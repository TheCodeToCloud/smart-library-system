from rest_framework import serializers
from .models import Report
from django.utils.timezone import localtime

class ReportSerializer(serializers.ModelSerializer):
    generatedBy = serializers.SerializerMethodField()
    generatedOn = serializers.SerializerMethodField()
    dateRange = serializers.SerializerMethodField()
    type = serializers.CharField(source='report_type')

    class Meta:
        model = Report
        fields = ['id', 'name', 'type', 'dateRange', 'generatedOn', 'generatedBy', 'status', 'file']

    def get_generatedBy(self, obj):
        if not obj.generated_by:
            return "System"
        name = f"{obj.generated_by.first_name} {obj.generated_by.last_name}".strip()
        return name if name else obj.generated_by.username

    def get_generatedOn(self, obj):
        local_dt = localtime(obj.generated_on)
        return local_dt.strftime("%d %b, %Y %I:%M %p")

    def get_dateRange(self, obj):
        if obj.start_date and obj.end_date:
            return f"{obj.start_date.strftime('%d %b, %Y')} - {obj.end_date.strftime('%d %b, %Y')}"
        elif obj.start_date:
            return f"From {obj.start_date.strftime('%d %b, %Y')}"
        elif obj.end_date:
            return f"Until {obj.end_date.strftime('%d %b, %Y')}"
        return "All time"
