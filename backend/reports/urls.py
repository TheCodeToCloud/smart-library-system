from django.urls import path
from .views import ReportListView, GenerateReportView

urlpatterns = [
    path('', ReportListView.as_view(), name='report-list'),
    path('generate/', GenerateReportView.as_view(), name='report-generate'),
]
