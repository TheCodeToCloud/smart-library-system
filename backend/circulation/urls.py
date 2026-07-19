from django.urls import path

from .views import (BorrowRequestView, IssuedBooksView, MyBorrowHistoryView, OverdueBooksView,
                    PendingBorrowRequestView, RecentTransactionsView, ReturnBookView, SendReminderView,
                    ApproveBorrowRequestView, RejectBorrowRequestView, DirectIssueView, StudentStatsView,
                    AllFinesView, MyFinesView, PayFineView, WaiveFineView, RecommendationsView, DebugBackdateView)

urlpatterns = [
    # Borrow / Approve / Reject / Return
    path('borrow/',                     BorrowRequestView.as_view(),         name='borrow-book'),
    path('approve/<int:issue_id>/',     ApproveBorrowRequestView.as_view(),  name='approve-borrow'),
    path('issue-direct/',               DirectIssueView.as_view(),           name='direct-issue'),
    path('return/<int:issue_id>/',      ReturnBookView.as_view(),            name='return-book'),
    path('reject/<int:issue_id>/',      RejectBorrowRequestView.as_view(),   name='reject-borrow'),

    # Listing views
    path('my-books/',                   MyBorrowHistoryView.as_view(),       name='my-books'),
    path('pending/',                    PendingBorrowRequestView.as_view(),  name='pending-borrow-requests'),
    path('issued/',                     IssuedBooksView.as_view(),           name='issued-books'),
    path('overdue/',                    OverdueBooksView.as_view(),          name='overdue-books'),
    path('recent-transactions/',        RecentTransactionsView.as_view(),    name='recent-transactions'),

    # Stats / Reminders / Recommendations
    path('my-stats/',                   StudentStatsView.as_view(),          name='student-stats'),
    path('recommendations/',            RecommendationsView.as_view(),       name='smart-recommendations'),
    path('send-reminders/',             SendReminderView.as_view(),          name='send-reminders'),

    # Fines
    path('fines/',                      AllFinesView.as_view(),              name='all-fines'),
    path('my-fines/',                   MyFinesView.as_view(),               name='my-fines'),
    path('pay-fine/<int:issue_id>/',    PayFineView.as_view(),               name='pay-fine'),
    path('waive-fine/<int:issue_id>/',  WaiveFineView.as_view(),             name='waive-fine'),
    
    # Debug
    path('debug-backdate/',             DebugBackdateView.as_view(),         name='debug-backdate'),
]