from django.urls import path
from .views import MeView, RegisterView, UpdateUserRoleView, UserListView, GoogleLoginView, MemberListView

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path("google-login/",GoogleLoginView.as_view(),name="google-login"),
    path('me/',MeView.as_view(),name='me'),
    path('users/',UserListView.as_view(),name='users'),
    path('users/<int:pk>/',UpdateUserRoleView.as_view(),name='user-update'),
    # Members endpoint (used by frontend)
    path('members/',MemberListView.as_view(),name='members'),
]