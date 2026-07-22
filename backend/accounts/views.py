from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests

from rest_framework import generics
from accounts.permissions import IsAdmin, IsAdminOrLibrarian
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, GoogleLoginSerializer, MemberSerializer, SubmitKYCSerializer
from .models import User, StudentProfile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser




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
            request.user,
            context={'request': request}
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
    permission_classes = [IsAdminOrLibrarian]

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

class UploadProfilePictureView(APIView):
    """Allow authenticated users to upload/update their profile picture"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'profile_picture' not in request.FILES:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = request.user
            user.profile_picture = request.FILES['profile_picture']
            user.save()
            
            serializer = UserSerializer(user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            error_msg = str(e) + "\n" + traceback.format_exc()
            print("CLOUDINARY UPLOAD ERROR:", error_msg)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubmitKYCView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if request.user.role != 'student':
            return Response(
                {"error": "Only students can submit KYC details."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = SubmitKYCSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        # Update User
        user = request.user
        user.phone = data['phone']
        user.address = data['address']
        user.save()

        # Update or Create StudentProfile
        try:
            profile = user.student_profile
            # If already approved, do not allow changes. Or if you want to allow re-submission, set to pending.
            if profile.kyc_status == 'approved':
                return Response(
                    {"error": "Your KYC is already approved."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except StudentProfile.DoesNotExist:
            profile = StudentProfile(user=user)

        profile.roll_no = data['roll_no']
        profile.department = data['department']
        profile.id_proof = data['id_proof']
        profile.kyc_status = 'pending'
        profile.save()

        return Response(
            {"message": "KYC submitted successfully. Please wait for approval."},
            status=status.HTTP_200_OK
        )


class CleanTestDataView(APIView):
    """Admin only: Delete all student users and circulation records for clean demo."""
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        # Simple secret key check via query param: ?secret=LibraryCronJobSecret2026!
        secret = request.query_params.get('secret', '')
        if secret != settings.REMINDER_SECRET:
            return Response({"error": "Unauthorized. Add ?secret=YOUR_SECRET to URL."}, status=403)

        from circulation.models import IssueBook

        # Delete all circulation records
        issue_count, _ = IssueBook.objects.all().delete()

        # Delete all student profiles
        profile_count, _ = StudentProfile.objects.all().delete()

        # Delete all non-admin, non-librarian users
        user_qs = User.objects.exclude(role__in=['admin', 'librarian'])
        user_count = user_qs.count()
        user_qs.delete()

        return Response({
            "success": True,
            "deleted": {
                "circulation_records": issue_count,
                "student_profiles": profile_count,
                "users": user_count,
            },
            "message": f"Cleaned! {user_count} students, {issue_count} circulation records deleted. Ready for fresh demo!"
        })