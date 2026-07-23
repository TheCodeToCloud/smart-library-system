from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import random


class User(AbstractUser):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('librarian', 'Librarian'),
        ('student', 'Student'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='student'
    )

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    address = models.TextField(
        blank=True
    )

    profile_picture = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True
    )

    def save(self, *args, **kwargs):

        if self.is_superuser:
            self.role = 'admin'

        super().save(*args, **kwargs)

    @property
    def full_name(self):
        if self.first_name or self.last_name:
            return f"{self.first_name} {self.last_name}".strip()

        return self.username

    def __str__(self):
        return self.username

class StudentProfile(models.Model):

    KYC_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )

    roll_no = models.CharField(
        max_length=50,
        unique=True
    )

    department = models.CharField(
        max_length=100
    )

    id_proof = models.FileField(
        upload_to='kyc/',
        blank=True,
        null=True
    )

    kyc_status = models.CharField(
        max_length=20,
        choices=KYC_STATUS_CHOICES,
        default='pending'
    )

    def save(self, *args, **kwargs):

        if self.user.role != 'student':
            raise ValueError(
                "Only students can have a StudentProfile"
            )

        super().save(*args, **kwargs)


    def __str__(self):
        return self.user.username


class EmailOTP(models.Model):
    """Stores a one-time 6-digit verification code for email confirmation."""
    email = models.EmailField(unique=True)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expires_at

    @classmethod
    def generate(cls, email):
        """Create or replace an OTP for the given email."""
        code = str(random.randint(100000, 999999))
        expires_at = timezone.now() + timezone.timedelta(minutes=10)
        obj, _ = cls.objects.update_or_create(
            email=email,
            defaults={"code": code, "expires_at": expires_at}
        )
        return obj

    def __str__(self):
        return f"OTP for {self.email}"