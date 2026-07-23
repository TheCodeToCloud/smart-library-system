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

    def update(self, instance, validated_data):
        if 'total_copies' in validated_data:
            new_total = validated_data['total_copies']
            # Calculate how many copies are currently issued
            issued_copies = instance.total_copies - instance.available_copies
            # Ensure we don't end up with negative available copies if they reduce total_copies too much
            new_available = max(0, new_total - issued_copies)
            validated_data['available_copies'] = new_available
            
        return super().update(instance, validated_data)