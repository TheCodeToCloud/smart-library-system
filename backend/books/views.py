from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from accounts.permissions import IsAdminOrLibrarian
from .models import Book, ELibraryResource
from .serializers import BookSerializer, ELibraryResourceSerializer

class ELibraryResourceListCreateView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = ELibraryResource.objects.all()
    serializer_class = ELibraryResourceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'author', 'category']

    def get_permissions(self):
        if self.request.method in ['POST']:
            return [IsAdminOrLibrarian()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class ELibraryResourceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ELibraryResource.objects.all()
    serializer_class = ELibraryResourceSerializer
    permission_classes = [IsAdminOrLibrarian]

import cloudinary
import cloudinary.utils
from django.conf import settings
from django.shortcuts import redirect
from django.http import Http404
import time

class ELibraryResourceDownloadView(generics.GenericAPIView):
    queryset = ELibraryResource.objects.all()

    def get(self, request, *args, **kwargs):
        resource = self.get_object()
        if not resource.resource_file:
            raise Http404("No file attached to this resource.")
        
        try:
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'),
                api_key=settings.CLOUDINARY_STORAGE.get('API_KEY'),
                api_secret=settings.CLOUDINARY_STORAGE.get('API_SECRET')
            )
            
            # resource_file.name = e.g. 'media/elibrary/ML-Past-Question_wvtl90.pdf'
            # For raw files, the public_id INCLUDES the extension
            public_id = resource.resource_file.name  # full name with extension
            
            # Extract format separately
            fmt = 'pdf'
            if '.' in public_id:
                fmt = public_id.rsplit('.', 1)[1]
            
            # private_download_url goes through api.cloudinary.com (API endpoint)
            # NOT res.cloudinary.com (CDN) — so it bypasses CDN delivery restrictions
            url = cloudinary.utils.private_download_url(
                public_id,
                fmt,
                resource_type='raw',
                expires_at=int(time.time()) + 3600  # Valid for 1 hour
            )
            
            return redirect(url)
        except Exception as e:
            raise Http404(f"Failed to generate download URL: {str(e)}")



class BookListCreateView(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    # Enable search
    filter_backends = [filters.SearchFilter]

    # Search fields
    search_fields = [
        'title',
        'author',
        'category',
        'isbn'
    ]

    def get_permissions(self):

        if self.request.method == 'GET':
            return [IsAuthenticated()]

        return [IsAdminOrLibrarian()]

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            import traceback
            error_msg = str(e) + "\n" + traceback.format_exc()
            print("BOOK CREATE ERROR:", error_msg)
            return Response({"detail": str(e), "traceback": error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_permissions(self):

        if self.request.method == 'GET':
            return [IsAuthenticated()]

        return [IsAdminOrLibrarian()]