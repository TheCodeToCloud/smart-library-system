from datetime import date, timedelta
from urllib import request
from django.conf import settings

# Allow Admin and Librarian users
from accounts.permissions import IsAdminOrLibrarian, IsStudent

from rest_framework.views import APIView, View
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from books.models import Book

from .models import IssueBook, User
from .serializers import BorrowRequestSerializer, IssueBookSerializer, DirectIssueSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .reminders import send_overdue_reminders


class StudentStatsView(APIView):
    """Return personalised stats for the logged-in student."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()

        # All borrow records for this student
        all_borrows = IssueBook.objects.filter(member=user)

        currently_borrowed = all_borrows.filter(status="issued").count()
        overdue_count = all_borrows.filter(
            status="issued", due_date__lt=today
        ).count()
        due_soon_count = all_borrows.filter(
            status="issued",
            due_date__gte=today,
            due_date__lte=today + timedelta(days=3)
        ).count()
        total_fine = sum(
            b.fine_amount for b in all_borrows.filter(fine_amount__gt=0)
        )

        return Response({
            "currently_borrowed": currently_borrowed,
            "overdue": overdue_count,
            "due_soon": due_soon_count,
            "total_fine": total_fine,
        })


class BorrowRequestView(generics.CreateAPIView):
    
    # Only logged-in users can borrow books
    permission_classes = [IsAuthenticated, IsStudent]

    # Serializer used for validation and saving
    serializer_class = BorrowRequestSerializer

    def create(self, request, *args, **kwargs):

        # Get book ID from request data
        book_id = request.data.get('book')

        try:
            # Fetch book from database
            book = Book.objects.get(id=book_id)

        except Book.DoesNotExist:
            return Response(
                {
                    "error": "Book not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        # KYC check: student must have an approved KYC before borrowing
        try:
            kyc_status = request.user.student_profile.kyc_status
        except Exception:
            kyc_status = None

        if kyc_status != 'approved':
            label = kyc_status if kyc_status in ('pending', 'rejected') else 'not submitted'
            return Response(
                {
                    "error": f"Your KYC verification is {label}. "
                             f"Please wait for admin approval before borrowing books."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if book is available
        if book.available_copies <= 0:
            return Response(
                {
                    "error": "Book is not available"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if this student already has this book in pending or issued status
        existing_request = IssueBook.objects.filter(
            member=request.user,
            book=book,
            status__in=["pending", "issued"]
        ).exists()

        if existing_request:
            return Response(
                {
                    "error": "You already have a pending or issued request for this book."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate incoming request data
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # Save IssueBook record
        serializer.save(member=request.user)

        return Response(
            {
                "message": "Borrow request submitted successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
class ApproveBorrowRequestView(APIView):
    # Approve a student's borrow request.
    # Only Admins and Librarians can approve requests.

    # Restrict access
    permission_classes = [IsAdminOrLibrarian]

    def post(self, request, issue_id):

        try:
            # Find the borrow request
            issue = IssueBook.objects.get(id=issue_id)

        except IssueBook.DoesNotExist:

            return Response(
                {
                    "error": "Borrow request not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Prevent approving the same request twice
        if issue.status != "pending":

            return Response(
                {
                    "error": "This request has already been processed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check whether copies are still available
        if issue.book.available_copies <= 0:

            return Response(
                {
                    "error": "No copies available."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Approve the request
        issue.status = "issued"

        # Book issued today
        issue.issue_date = date.today()

        # Student must return within 14 days
        issue.due_date = date.today() + timedelta(days=14)

        issue.save()

        # Reduce available copies
        book = issue.book
        book.available_copies -= 1
        book.save()

        return Response(
            {
                "message": "Borrow request approved successfully."
            },
            status=status.HTTP_200_OK
        )
    
class RejectBorrowRequestView(APIView):
    """
    Reject a borrow request.

    Only Admins and Librarians can reject requests.
    """

    # Only Admin and Librarian are allowed
    permission_classes = [IsAdminOrLibrarian]

    def post(self, request, issue_id):

        try:
            # Find the borrow request
            issue = IssueBook.objects.get(id=issue_id)

        except IssueBook.DoesNotExist:

            return Response(
                {
                    "error": "Borrow request not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Request has already been processed
        if issue.status != "pending":

            return Response(
                {
                    "error": "This request has already been processed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Reject the request
        issue.status = "rejected"

        # Save changes
        issue.save()

        return Response(
            {
                "message": "Borrow request rejected successfully."
            },
            status=status.HTTP_200_OK
        )
    
class DirectIssueView(generics.CreateAPIView):

    # Only admin/librarian can directly issue books
    permission_classes = [IsAdminOrLibrarian]

    serializer_class = DirectIssueSerializer

    def create(self, request, *args, **kwargs):

        book_id = request.data.get("book")
        member_id = request.data.get("member")

        # Check book
        try:
            book = Book.objects.get(id=book_id)

        except Book.DoesNotExist:
            return Response(
                {
                    "error": "Book not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Check member
        try:
            member = User.objects.get(id=member_id)

        except User.DoesNotExist:
            return Response(
                {
                    "error": "Member not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Admins/Librarians/Students can all borrow books for testing

        # Book availability
        if book.available_copies <= 0:
            return Response(
                {
                    "error": "Book is not available."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate issue
        if IssueBook.objects.filter(
            member=member,
            book=book,
            status="issued"
        ).exists():
            return Response(
                {
                    "error": "Student already has this book."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create issue record
        issue = IssueBook.objects.create(
            book=book,
            member=member,
            status="issued",
            issue_date=date.today(),
            due_date=date.today() + timedelta(days=14)
        )

        # Reduce available copies
        book.available_copies -= 1
        book.save()

        return Response(
            {
                "message": "Book issued successfully.",
                "data": IssueBookSerializer(issue).data
            },
            status=status.HTTP_201_CREATED
        )
    
class ReturnBookView(APIView):

    """
    Return an issued book.
    Only Admins and Librarians can return books.
    """
    permission_classes = [IsAdminOrLibrarian]

    def post(self, request, issue_id):

        try:
            # Find the issue record
            issue = IssueBook.objects.get(id=issue_id)

        except IssueBook.DoesNotExist:
            return Response(
                {
                    "error": "Issue record not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Only issued books can be returned
        if issue.status != "issued":
            return Response(
                {
                    "error": "Only issued books can be returned."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Today's date
        today = date.today()

        # Update issue record
        issue.status = "returned"
        issue.return_date = today

        # Fine Calculation
        fine = 0

        # Check if returned after due date
        if today > issue.due_date:

            # Number of late days
            overdue_days = (today - issue.due_date).days

            # Fine = Rs. 5 per day
            fine = overdue_days * 5

        issue.fine_amount = fine

        issue.save()

        # Increase available copies
        book = issue.book
        book.available_copies += 1
        book.save()

        return Response(
            {
                "message": "Book returned successfully.",
                "fine_amount": fine
            },
            status=status.HTTP_200_OK
        )

class MyBorrowHistoryView(generics.ListAPIView):

    # Student can view only their own borrow history.
    serializer_class = IssueBookSerializer

    permission_classes = [IsStudent]

    def get_queryset(self):

        return IssueBook.objects.filter(
            member=self.request.user
        ).order_by("-request_date")
    
class PendingBorrowRequestView(generics.ListAPIView):
    #View all pending borrow requests.

    serializer_class = IssueBookSerializer

    permission_classes = [IsAdminOrLibrarian]

    def get_queryset(self):

        return IssueBook.objects.filter(
            status="pending"
        ).order_by("request_date")
    
class IssuedBooksView(generics.ListAPIView):
    # View all issued books.

    serializer_class = IssueBookSerializer

    permission_classes = [IsAdminOrLibrarian]

    def get_queryset(self):

        return IssueBook.objects.filter(
            status="issued"
        ).order_by("-issue_date")

class OverdueBooksView(generics.ListAPIView):

    # View all overdue books.
    serializer_class = IssueBookSerializer

    permission_classes = [IsAdminOrLibrarian]

    def get_queryset(self):

        return IssueBook.objects.filter(
            status="issued",
            due_date__lt=date.today()
        ).order_by("due_date")
    
# Show recently issued books
class RecentTransactionsView(generics.ListAPIView):

    # Show latest circulation activities.

    serializer_class = IssueBookSerializer
    permission_classes = [IsAdminOrLibrarian]

    def get_queryset(self):

        return IssueBook.objects.order_by(
            "-request_date"
        )[:10]
    
class SendReminderView(APIView):
    permission_classes = [IsAdminOrLibrarian]

    def post(self, request):
        result = send_overdue_reminders()
        return Response({"message": result})


class AllFinesView(generics.ListAPIView):
    """Admin/Librarian: all IssueBook records that have a fine."""
    serializer_class = IssueBookSerializer
    permission_classes = [IsAdminOrLibrarian]

    def get_queryset(self):
        return IssueBook.objects.filter(
            fine_amount__gt=0
        ).order_by('-fine_amount')


class MyFinesView(generics.ListAPIView):
    """Student: their own fined records."""
    serializer_class = IssueBookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return IssueBook.objects.filter(
            member=self.request.user,
            fine_amount__gt=0
        ).order_by('-fine_amount')


class PayFineView(APIView):
    """Mark a fine as paid."""
    permission_classes = [IsAdminOrLibrarian]

    def post(self, request, issue_id):
        try:
            issue = IssueBook.objects.get(id=issue_id)
        except IssueBook.DoesNotExist:
            return Response({"error": "Record not found."}, status=status.HTTP_404_NOT_FOUND)

        if issue.fine_amount <= 0:
            return Response({"error": "No fine on this record."}, status=status.HTTP_400_BAD_REQUEST)

        issue.fine_status = 'paid'
        issue.fine_paid_date = date.today()
        issue.save()
        return Response({"message": "Fine marked as paid."})


class WaiveFineView(APIView):
    """Waive a fine (forgive without payment)."""
    permission_classes = [IsAdminOrLibrarian]

    def post(self, request, issue_id):
        try:
            issue = IssueBook.objects.get(id=issue_id)
        except IssueBook.DoesNotExist:
            return Response({"error": "Record not found."}, status=status.HTTP_404_NOT_FOUND)

        if issue.fine_amount <= 0:
            return Response({"error": "No fine on this record."}, status=status.HTTP_400_BAD_REQUEST)

        issue.fine_status = 'waived'
        issue.save()
        return Response({"message": "Fine waived."})

class DebugBackdateView(APIView):
    """Temporary endpoint to backdate all issued books by 10 days for testing fines."""
    def get(self, request):
        from datetime import date, timedelta
        issues = IssueBook.objects.filter(status='issued')
        count = 0
        for issue in issues:
            # Make it 10 days overdue
            issue.due_date = date.today() - timedelta(days=10)
            if not issue.issue_date:
                issue.issue_date = date.today() - timedelta(days=24)
            issue.save()
            count += 1
        return Response({
            "message": f"Success! {count} issued books have been backdated by 10 days.",
            "instruction": "Now go to the main website, Return the book, and check the Fine Manager!"
        })



from .recommendations import get_smart_recommendations

class RecommendationsView(APIView):
    """Student: Get smart book recommendations."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recommendations = get_smart_recommendations(request.user)
        return Response(recommendations)


from django.conf import settings
from .reminders import send_overdue_reminders
from rest_framework.permissions import AllowAny

class TriggerRemindersWebhookView(APIView):
    """
    Webhook endpoint to trigger overdue reminders.
    Intended to be called daily by GitHub Actions cron job.
    Uses a secret key for authorization.
    """
    authentication_classes = [] # Disable JWT parsing since we use a custom Bearer secret
    permission_classes = [AllowAny]

    def post(self, request):
        secret = request.headers.get('Authorization')
        
        if not secret or secret != f"Bearer {settings.REMINDER_SECRET}":
            return Response({"error": "Unauthorized"}, status=403)
            
        try:
            result = send_overdue_reminders()
            return Response({
                "success": True, 
                "message": result
            })
        except Exception as e:
            return Response({
                "success": False, 
                "error": str(e)
            }, status=500)


class ForceRemindersView(APIView):
    """Admin-only: Force send overdue reminders bypassing 24h cooldown. For testing."""
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        # Simple secret key check via query param: ?secret=LibraryCronJobSecret2026!
        secret = request.query_params.get('secret', '')
        if secret != settings.REMINDER_SECRET:
            return Response({"error": "Unauthorized. Add ?secret=YOUR_SECRET to URL."}, status=403)

        from .reminders import send_overdue_reminders_force
        result = send_overdue_reminders_force()
        return Response(result)
