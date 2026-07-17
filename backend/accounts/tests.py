from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User, StudentProfile

class AccountsTests(APITestCase):

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

    def test_student_registration_success(self):
        """Test registering a student works when all required fields are provided."""
        url = reverse('register')
        data = {
            'username': 'new_student',
            'email': 'new@student.com',
            'password': 'password123',
            'role': 'student',
            'first_name': 'New',
            'last_name': 'Student',
            'roll_no': 'STU101',
            'department': 'Math'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(StudentProfile.objects.filter(roll_no='STU101').exists())

    def test_student_registration_missing_roll_no(self):
        """Test registering a student fails if roll_no is missing."""
        url = reverse('register')
        data = {
            'username': 'bad_student',
            'email': 'bad@student.com',
            'password': 'password123',
            'role': 'student',
            'first_name': 'Bad',
            'last_name': 'Student',
            'department': 'Physics'
            # missing roll_no
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('roll_no', response.data)

    def test_login_success(self):
        """Test login with correct credentials."""
        # login requires email and password according to LoginSerializer
        response = self.client.post('/api/login/', {
            'email': 'student@test.com',
            'password': 'testpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_failure(self):
        """Test login with incorrect credentials."""
        response = self.client.post('/api/login/', {
            'email': 'student@test.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_role_based_permissions(self):
        """Test student cannot access admin-only endpoint."""
        # Authenticate as student
        response = self.client.post('/api/login/', {
            'email': 'student@test.com',
            'password': 'testpassword123'
        })
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        
        # Try to access members list (IsAdmin)
        url = reverse('members')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Authenticate as admin
        response_admin = self.client.post('/api/login/', {
            'email': 'admin@test.com',
            'password': 'testpassword123'
        })
        admin_token = response_admin.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + admin_token)

        # Try to access members list (IsAdmin)
        response_admin = self.client.get(url)
        self.assertEqual(response_admin.status_code, status.HTTP_200_OK)
