import datetime
from django.utils import timezone
from django.core.mail import send_mail
from .models import IssueBook

def send_overdue_reminders():
    # Find overdue books that are issued
    overdue_books = IssueBook.objects.filter(
        status='issued',
        due_date__lt=datetime.date.today()
    )

    now = timezone.now()
    cutoff_24h = now - datetime.timedelta(hours=24)
    sent_count = 0

    for issue in overdue_books:
        # Skip if a reminder was sent in the last 24 hours
        if issue.last_reminder_sent and issue.last_reminder_sent > cutoff_24h:
            continue

        days_overdue = (datetime.date.today() - issue.due_date).days

        # Tone 1: Gentle Reminder (1-3 days)
        if days_overdue <= 3:
            subject = 'Gentle Reminder: Library Book Overdue'
            message = f"""Dear {issue.member.first_name or issue.member.username},

This is a gentle reminder that the book "{issue.book.title}" was due on {issue.due_date}. 
Please return it as soon as possible to avoid accumulating fines.

Thank you,
Library Management System"""

        # Tone 2: Stronger Reminder with Fines (4-7 days)
        elif days_overdue <= 7:
            subject = 'Notice: Overdue Book and Accumulating Fines'
            message = f"""Dear {issue.member.first_name or issue.member.username},

Our records indicate that the book "{issue.book.title}" is now {days_overdue} days overdue.
Your current accumulating fine is Rs. {days_overdue * 5}. 

Please return the book immediately to stop further fines.

Thank you,
Library Management System"""

        # Tone 3: Final Notice (8+ days)
        else:
            subject = 'URGENT: Final Notice for Overdue Book'
            message = f"""Dear {issue.member.first_name or issue.member.username},

This is an URGENT notice. The book "{issue.book.title}" is {days_overdue} days overdue.
Your fine has reached Rs. {days_overdue * 5}. 

If the book is not returned immediately, your library account may be restricted, and further administrative action may be taken.

Library Management System"""

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email='roshankarki549@gmail.com',
                recipient_list=[issue.member.email],
                fail_silently=False
            )
            # Update last_reminder_sent only if email succeeds
            issue.last_reminder_sent = now
            issue.save(update_fields=['last_reminder_sent'])
            sent_count += 1
        except Exception as e:
            print(f"Failed to send email to {issue.member.email}: {e}")

    return f"{sent_count} reminder(s) sent."