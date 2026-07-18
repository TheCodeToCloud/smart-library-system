from django.urls import path
from .views import MeView, RegisterView, UpdateUserRoleView, UserListView, GoogleLoginView, MemberListView, KYCApproveView, KYCRejectView, UploadProfilePictureView

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path("google-login/",GoogleLoginView.as_view(),name="google-login"),
    path('me/',MeView.as_view(),name='me'),
    path('users/',UserListView.as_view(),name='users'),
    path('users/<int:pk>/',UpdateUserRoleView.as_view(),name='user-update'),
    # Members endpoint (used by frontend)
    path('members/',MemberListView.as_view(),name='members'),
    # KYC actions (admin/librarian only)
    path('kyc/<int:user_id>/approve/', KYCApproveView.as_view(), name='kyc-approve'),
    path('kyc/<int:user_id>/reject/', KYCRejectView.as_view(), name='kyc-reject'),
    path('profile-picture/', UploadProfilePictureView.as_view(), name='profile-picture'),
]