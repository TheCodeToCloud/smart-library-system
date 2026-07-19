# DRF API View
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminOrLibrarian, IsStudent

# Models
from django.db.models import Count, Q
from books.models import Book
from accounts.models import User
from circulation.models import IssueBook
from datetime import date, timedelta

from .models import SystemSettings
from .serializers import SystemSettingsSerializer

class DashboardStatsView(APIView):

    permission_classes = [IsAdminOrLibrarian]

    def get(self, request):

        # Total books in library
        total_books = Book.objects.count()

        # Total registered members(students, librarian, admin)
        total_students = User.objects.filter(
        role="student"
        ).count()

        total_librarians = User.objects.filter(
            role="librarian"
        ).count()

        total_admins = User.objects.filter(
            role="admin"
        ).count()
        # Books currently issued
        books_issued = IssueBook.objects.filter(
            status='issued'
        ).count()

        # Overdue books
        overdue_books = IssueBook.objects.filter(
            status='issued',
            due_date__lt=date.today()
        ).count()

        total_members = total_students + total_librarians
        
        current_month = date.today().month
        current_year = date.today().year

        new_books_this_month = Book.objects.filter(created_at__year=current_year, created_at__month=current_month).count()
        new_members_this_month = User.objects.filter(date_joined__year=current_year, date_joined__month=current_month).exclude(role="admin").count()
        
        issued_this_month = IssueBook.objects.filter(issue_date__year=current_year, issue_date__month=current_month).count()
        overdue_this_month = IssueBook.objects.filter(status='issued', due_date__lt=date.today(), due_date__year=current_year, due_date__month=current_month).count()

        return Response({
            "total_students": total_students,
            "total_librarians": total_librarians,
            "total_admins": total_admins,
            "books_issued": books_issued,
            "overdue_books": overdue_books,
            "total_books": total_books,
            "total_members": total_members,
            "new_books_this_month": new_books_this_month,
            "new_members_this_month": new_members_this_month,
            "issued_this_month": issued_this_month,
            "overdue_this_month": overdue_this_month,
        })

class RecentIssuesView(APIView):

    permission_classes = [IsAdminOrLibrarian]

    def get(self, request):

        issues = IssueBook.objects.order_by(
            '-issue_date'
        )[:5]

        data = []

        for issue in issues:

            data.append({

                "book": issue.book.title,
                "book_cover": issue.book.cover_image

                if issue.book.cover_image else None,

                "member": issue.member.full_name,
                "member_photo": issue.member.profile_picture.url

                if issue.member.profile_picture else None,

                "issue_date": issue.issue_date,
                "due_date": issue.due_date

            })

        return Response(data)
    
class PopularBooksView(APIView):

    permission_classes = [IsAdminOrLibrarian]

    def get(self, request):
        # Optional ?period=30d to filter to last 30 days
        period = request.query_params.get('period', None)

        if period == '30d':
            since = date.today() - timedelta(days=30)
            books = Book.objects.annotate(
                issue_count=Count(
                    'issuebook',
                    filter=Q(issuebook__issue_date__gte=since)
                )
            ).order_by('-issue_count')[:5]
        else:
            books = Book.objects.annotate(
                issue_count=Count('issuebook')
            ).order_by('-issue_count')[:5]

        data = []
        for book in books:
            data.append({
                "title": book.title,
                "author": book.author,
                "times_issued": book.issue_count,
                "cover_image": book.cover_image if book.cover_image else None
            })

        return Response(data)
    
class NotificationsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
         
        notifications = []

        # 1. Issued Books

        recent_issues = IssueBook.objects.filter(
            status='issued'
        ).order_by('-id')

        for issue in recent_issues:

            notifications.append({
                "type": "issued",
                "message":
                f"{issue.member.full_name} issued '{issue.book.title}'",
                "date": issue.issue_date,
            })

        # 2. Returned Books
        returned_books = IssueBook.objects.filter(
                status='returned'
        ).order_by('-id')

        for issue in returned_books:

            notifications.append({
                "type": "returned",
                "message":
                f"{issue.member.full_name} returned '{issue.book.title}'",
                "date": issue.return_date,
            })      
        
        # 3. Overdue Books
        overdue_books = IssueBook.objects.filter(
            status='issued',
            due_date__lt=date.today()
        )

        for issue in overdue_books:

            notifications.append({

                "type": "overdue",

                "message":
                f"'{issue.book.title}' is overdue for {issue.member.full_name}",

                "date": issue.due_date

            })

        # 4. Low Stock Books
        low_stock_books = Book.objects.filter(
            available_copies__lte=1
        )

        for book in low_stock_books:

            notifications.append({

                "type": "low_stock",

                "message":
                f"Only {book.available_copies} copy left of '{book.title}'"

            })
            
        # Sort latest activity first
        notifications.sort(
            key=lambda x: x.get('date', date.min),
            reverse=True
        )

        return Response(notifications)  

class CategoryDistributionView(APIView):

    permission_classes = [IsAdminOrLibrarian]

    def get(self, request):

        categories = Book.objects.values(
            'category'
        ).annotate(
            total=Count('id')
        )

        return Response(categories)
    
class IssueReturnChartView(APIView):

    permission_classes = [IsAdminOrLibrarian]

    def get(self, request):

        issued = IssueBook.objects.filter(
            status='issued'
        ).count()

        returned = IssueBook.objects.filter(
            status='returned'
        ).count()

        return Response({
            "issued": issued,
            "returned": returned
        })


class TopReadersView(APIView):
    """Top 5 students by total books borrowed (all-time)."""
    permission_classes = [IsAdminOrLibrarian]

    def get(self, request):
        from django.db.models import Count

        top_students = (
            User.objects.filter(role='student')
            .annotate(borrow_count=Count('issuebook'))
            .order_by('-borrow_count')[:5]
        )

        data = []
        for rank, student in enumerate(top_students, start=1):
            data.append({
                "rank": rank,
                "id": student.id,
                "full_name": student.full_name,
                "email": student.email,
                "borrow_count": student.borrow_count,
                "badge": "🏆 Top Reader" if rank == 1 else f"#{rank} Reader",
            })
        return Response(data)

class SystemSettingsView(APIView):
    # Only Admin or Librarian can update settings
    # permission_classes = [IsAdminOrLibrarian] # Leaving open for testing now

    def get(self, request):
        settings = SystemSettings.load()
        serializer = SystemSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings = SystemSettings.load()
        serializer = SystemSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)