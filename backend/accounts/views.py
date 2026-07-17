from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests

from rest_framework import generics
from accounts.permissions import IsAdmin, IsAdminOrLibrarian
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, GoogleLoginSerializer, MemberSerializer
from .models import User, StudentProfile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response




class RegisterView(generics.CreateAPIView):
    
    # User Registration API
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class MeView(APIView):
    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )
    
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer

    permission_classes = [
        IsAdmin
    ]

class MemberListView(generics.ListAPIView):
    """Returns all users with full member details (including student profile)"""
    queryset = User.objects.select_related('student_profile').order_by('id')
    serializer_class = MemberSerializer
    permission_classes = [IsAdmin]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

# Promote/demote users
class UpdateUserRoleView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        })
    
class GoogleLoginView(generics.GenericAPIView):

    # Serializer that accepts the Google ID token
    serializer_class = GoogleLoginSerializer

    def post(self, request):

        # Handle camelCase idToken from frontend
        data = request.data.copy()
        if "idToken" in data and "id_token" not in data:
            data["id_token"] = data.pop("idToken")

        # Validate incoming data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Extract Google ID token
        google_token = serializer.validated_data["id_token"]

        try:
            # Verify that the token really came from Google
            google_user = id_token.verify_oauth2_token(
                google_token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

        except ValueError:
            return Response(
                {
                    "error": "Invalid Google token."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Extract user information from Google's response
        email = google_user["email"]
        first_name = google_user.get("given_name", "")
        last_name = google_user.get("family_name", "")

        # Create user if it doesn't already exist
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email.split("@")[0],
                "first_name": first_name,
                "last_name": last_name,
                "role": "student",
            }
        )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Google login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK
        )


class KYCApproveView(APIView):
    """Approve a student's KYC — sets kyc_status to 'approved'."""
    permission_classes = [IsAdminOrLibrarian]

    def post(self, request, user_id):
        try:
            profile = StudentProfile.objects.get(user__id=user_id)
        except StudentProfile.DoesNotExist:
            return Response({"error": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        profile.kyc_status = 'approved'
        profile.save()
        return Response({"message": f"KYC approved for {profile.user.username}."})


class KYCRejectView(APIView):
    """Reject a student's KYC — sets kyc_status to 'rejected'."""
    permission_classes = [IsAdminOrLibrarian]

    def post(self, request, user_id):
        try:
            profile = StudentProfile.objects.get(user__id=user_id)
        except StudentProfile.DoesNotExist:
            return Response({"error": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        profile.kyc_status = 'rejected'
        profile.save()
        return Response({"message": f"KYC rejected for {profile.user.username}."})