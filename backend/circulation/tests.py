import datetime
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User, StudentProfile
from books.models import Book
from circulation.models import IssueBook
from freezegun import freeze_time
from django.utils import timezone

class CirculationTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin_test',
            email='admin@test.com',
            password='testpassword123',
            role='admin'
        )
        self.student = User.objects.create_user(
            username='student_test',
            email='student@test.com',
            password='testpassword123',
            role='student'
        )
        self.profile = StudentProfile.objects.create(
            user=self.student,
            roll_no='STU100',
            department='CS',
            kyc_status='approved'
        )
        self.book = Book.objects.create(
            title='Test Book',
            author='Test Author',
            category='Science',
            isbn='1234567890',
            total_copies=5,
            available_copies=5
        )
        
        response = self.client.post('/api/login/', {
            'email': 'student@test.com',
            'password': 'testpassword123'
        })
        self.student_token = response.data['access']
        
        response_admin = self.client.post('/api/login/', {
            'email': 'admin@test.com',
            'password': 'testpassword123'
        })
        self.admin_token = response_admin.data['access']

    def test_full_borrow_lifecycle(self):
        """Test borrow request -> approve -> return with fine."""
        
        # 1. Borrow request (Student)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        url_borrow = reverse('borrow-book')
        response = self.client.post(url_borrow, {'book': self.book.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        issue = IssueBook.objects.get(member=self.student, book=self.book)
        self.assertEqual(issue.status, 'pending')
        
        # 2. Approve request (Admin)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        url_approve = reverse('approve-borrow', kwargs={'issue_id': issue.id})
        response = self.client.post(url_approve)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        issue.refresh_from_db()
        self.assertEqual(issue.status, 'issued')
        
        self.book.refresh_from_db()
        self.assertEqual(self.book.available_copies, 4) # Decreased
        
        # 3. Make the book overdue by 3 days
        # Instead of traveling to the future, we change the issue's due_date to 3 days ago
        issue.due_date = timezone.now().date() - datetime.timedelta(days=3)
        issue.save()

        # 4. Return book (Admin)
        url_return = reverse('return-book', kwargs={'issue_id': issue.id})
        response = self.client.post(url_return)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        issue.refresh_from_db()
        self.assertEqual(issue.status, 'returned')
        
        self.book.refresh_from_db()
        self.assertEqual(self.book.available_copies, 5) # Increased back
        
        # 5. Check fines
        # 3 days overdue. Fine should be 3 * 5 = 15
        self.assertEqual(issue.fine_amount, 15)

    def test_borrow_fails_if_kyc_not_approved(self):
        """Test borrow request fails if KYC is not approved."""
        self.profile.kyc_status = 'pending'
        self.profile.save()
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        url_borrow = reverse('borrow-book')
        response = self.client.post(url_borrow, {'book': self.book.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('KYC', response.data['error'])
