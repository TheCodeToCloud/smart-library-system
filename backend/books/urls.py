from django.urls import path
from .views import (BookListCreateView,BookDetailView, ELibraryResourceListCreateView, ELibraryResourceRetrieveUpdateDestroyView)

urlpatterns = [
    path('elibrary/', ELibraryResourceListCreateView.as_view(), name='elibrary-list'),
    path('elibrary/<int:pk>/', ELibraryResourceRetrieveUpdateDestroyView.as_view(), name='elibrary-detail'),
    path('',BookListCreateView.as_view(),name='book-list'),
    path('<int:pk>/',BookDetailView.as_view(),name='book-detail'),
]