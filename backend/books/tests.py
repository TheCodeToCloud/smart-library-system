from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User, StudentProfile
from books.models import Book

class BooksTests(APITestCase):
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
        StudentProfile.objects.create(
            user=self.student,
            roll_no='STU100',
            department='CS'
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

    def test_list_books(self):
        """Test any authenticated user can list books."""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        url = reverse('book-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_search_books(self):
        """Test searching books by query."""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        url = reverse('book-list')
        response = self.client.get(url, {'search': 'Test Book'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_book_admin(self):
        """Test admin can create a book."""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        url = reverse('book-list')
        data = {
            'title': 'New Book',
            'author': 'New Author',
            'category': 'Math',
            'isbn': '0987654321',
            'total_copies': 2,
            'available_copies': 2
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Book.objects.count(), 2)

    def test_create_book_student_denied(self):
        """Test student cannot create a book."""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.student_token)
        url = reverse('book-list')
        data = {
            'title': 'New Book',
            'author': 'New Author',
            'category': 'Math',
            'isbn': '0987654321',
            'total_copies': 2,
            'available_copies': 2
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
