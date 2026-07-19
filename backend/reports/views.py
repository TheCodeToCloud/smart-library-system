import csv
from io import StringIO
from django.core.files.base import ContentFile
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminOrLibrarian
from .models import Report
from .serializers import ReportSerializer
from accounts.models import User
from books.models import Book
from circulation.models import IssueBook
from django.utils import timezone
import datetime

class ReportListView(generics.ListAPIView):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated, IsAdminOrLibrarian]
    queryset = Report.objects.all()

class GenerateReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrLibrarian]

    def post(self, request):
        name = request.data.get('name')
        report_type = request.data.get('report_type')
        start_date_str = request.data.get('start_date')
        end_date_str = request.data.get('end_date')

        if not name or not report_type:
            return Response({'error': 'Name and report type are required'}, status=400)

        # Parse dates
        start_date = None
        end_date = None
        if start_date_str:
            start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
        if end_date_str:
            end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()

        # Create report record
        report = Report(
            name=name,
            report_type=report_type,
            start_date=start_date,
            end_date=end_date,
            generated_by=request.user
        )

        csv_buffer = StringIO()
        writer = csv.writer(csv_buffer)

        if report_type == 'Members':
            qs = User.objects.all()
            if start_date:
                qs = qs.filter(date_joined__date__gte=start_date)
            if end_date:
                qs = qs.filter(date_joined__date__lte=end_date)
            writer.writerow(['ID', 'Username', 'Full Name', 'Email', 'Role', 'Date Joined'])
            for user in qs:
                writer.writerow([user.id, user.username, user.full_name, user.email, user.role, user.date_joined.strftime('%Y-%m-%d')])

        elif report_type == 'Books':
            qs = Book.objects.all()
            if start_date:
                qs = qs.filter(created_at__gte=start_date)
            if end_date:
                qs = qs.filter(created_at__lte=end_date)
            writer.writerow(['ID', 'Title', 'Author', 'Category', 'ISBN', 'Total Copies', 'Available Copies', 'Added On'])
            for book in qs:
                writer.writerow([book.id, book.title, book.author, book.category, book.isbn, book.total_copies, book.available_copies, book.created_at.strftime('%Y-%m-%d')])

        elif report_type == 'Finance':
            qs = IssueBook.objects.filter(fine_amount__gt=0)
            if start_date:
                qs = qs.filter(request_date__gte=start_date)
            if end_date:
                qs = qs.filter(request_date__lte=end_date)
            writer.writerow(['Issue ID', 'Book Title', 'Member Name', 'Issue Date', 'Return Date', 'Fine Amount', 'Status'])
            for issue in qs:
                member_name = issue.member.full_name if hasattr(issue.member, 'full_name') else issue.member.username
                writer.writerow([
                    issue.id, 
                    issue.book.title, 
                    member_name,
                    issue.issue_date.strftime('%Y-%m-%d') if issue.issue_date else '',
                    issue.return_date.strftime('%Y-%m-%d') if issue.return_date else '',
                    issue.fine_amount,
                    issue.status
                ])

        # Save CSV to file field
        filename = f"{report_type}_{timezone.now().strftime('%Y%m%d%H%M%S')}.csv"
        csv_file = ContentFile(csv_buffer.getvalue().encode('utf-8'))
        report.file.save(filename, csv_file, save=True)
        report.save()

        return Response(ReportSerializer(report).data)
