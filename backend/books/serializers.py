from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    # Returns the best available cover: uploaded file first, then URL
    best_cover = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'

    def get_best_cover(self, obj):
        request = self.context.get('request')
        if obj.cover_image_file:
            if request:
                return request.build_absolute_uri(obj.cover_image_file.url)
            return obj.cover_image_file.url
        if obj.cover_image:
            return obj.cover_image
        return None