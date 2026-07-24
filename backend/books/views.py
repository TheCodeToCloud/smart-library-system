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

from django.http import HttpResponse, Http404

class ELibraryResourceDownloadView(generics.GenericAPIView):
    queryset = ELibraryResource.objects.all()

    def get(self, request, *args, **kwargs):
        resource = self.get_object()
        if not resource.resource_file:
            raise Http404("No file attached to this resource.")
        
        try:
            # Read file using Django's authenticated storage API
            file_content = resource.resource_file.read()
            
            response = HttpResponse(file_content, content_type='application/pdf')
            
            filename = resource.resource_file.name.split('/')[-1]
            if not filename.endswith('.pdf') and not filename.endswith('.doc') and not filename.endswith('.docx'):
                filename += '.pdf'
                
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        except Exception as e:
            raise Http404(f"Failed to fetch file: {str(e)}")



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