from rest_framework import serializers
from .models import SystemSettings, Announcement

class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    created_by_role = serializers.CharField(source='created_by.role', read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'message', 'created_at', 'created_by_name', 'created_by_role']
