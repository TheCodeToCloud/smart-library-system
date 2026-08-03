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
        # Handle file upload manually if present
        resource_file = self.request.FILES.get('resource_file')
        if resource_file:
            file_data = resource_file.read()
            file_name = resource_file.name
            file_type = resource_file.content_type
            serializer.save(
                uploaded_by=self.request.user,
                file_data=file_data,
                file_name=file_name,
                file_type=file_type
            )
        else:
            serializer.save(uploaded_by=self.request.user)

class ELibraryResourceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ELibraryResource.objects.all()
    serializer_class = ELibraryResourceSerializer
    permission_classes = [IsAdminOrLibrarian]

from django.http import HttpResponse, Http404

class ELibraryResourceDownloadView(generics.GenericAPIView):
    queryset = ELibraryResource.objects.all()

    def get(self, request, *args, **kwargs):
        resource = self.get_object()
        if not resource.file_data:
            raise Http404("No file attached to this resource.")
        
        try:
            # Serve file directly from PostgreSQL database
            response = HttpResponse(resource.file_data, content_type=resource.file_type)
            
            # Inline display for PDF/Doc instead of forced attachment
            filename = resource.file_name
            response['Content-Disposition'] = f'inline; filename="{filename}"'
            
            return response
        except Exception as e:
            raise Http404(f"Failed to fetch file from DB: {str(e)}")



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

import os
import json
import google.generativeai as genai
from rest_framework.views import APIView

class AIAutoFillView(APIView):
    permission_classes = [IsAdminOrLibrarian]

    def post(self, request):
        title = request.data.get('title')
        author = request.data.get('author')
        
        if not title or not author:
            return Response({"error": "Title and author are required"}, status=400)
            
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            # Fallback to mock data if no API key is provided
            return Response({
                "description": f"An insightful exploration by {author} titled '{title}'. This book provides deep perspectives and valuable knowledge for its readers.",
                "category": "General Knowledge",
                "keywords": "knowledge, reading, general"
            })
            
        try:
            genai.configure(api_key=api_key)
            prompt = f"""
            You are a librarian assistant. I have a book titled '{title}' by '{author}'.
            Please provide a short description (2-3 sentences), the best fitting standard library category (like Fiction, Science, History, Technology, Self-Help, etc), and 3-5 keywords.
            Format the response strictly as a JSON object with keys: "description", "category", "keywords".
            Do not include markdown blocks, just the JSON.
            """
            
            try:
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content(prompt)
            except Exception as model_err:
                print("Gemini 1.5 Flash failed, falling back to gemini-pro:", model_err)
                model = genai.GenerativeModel('gemini-pro')
                response = model.generate_content(prompt)
                
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:-3].strip()
            elif text.startswith('```'):
                text = text[3:-3].strip()
                
            data = json.loads(text)
            return Response(data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)