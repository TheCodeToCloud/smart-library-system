from django.urls import path
from .views import (CategoryDistributionView, DashboardStatsView, IssueReturnChartView,
                    NotificationsView, PopularBooksView, RecentIssuesView, TopReadersView,
                    SystemSettingsView, AnnouncementListView, AnnouncementDetailView)

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('recent-issues/', RecentIssuesView.as_view()),
    path('popular-books/', PopularBooksView.as_view()),
    path('notifications/', NotificationsView.as_view(), name='notifications'),
    path('category-distribution/', CategoryDistributionView.as_view()),
    path('issue-return-chart/', IssueReturnChartView.as_view()),
    path('top-readers/', TopReadersView.as_view(), name='top-readers'),
    path('settings/', SystemSettingsView.as_view(), name='system-settings'),
    path('real-announcements/', AnnouncementListView.as_view(), name='announcements-list'),
    path('real-announcements/<int:pk>/', AnnouncementDetailView.as_view(), name='announcement-detail'),
]