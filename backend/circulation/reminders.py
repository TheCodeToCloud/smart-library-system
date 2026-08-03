import datetime
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from .models import IssueBook

def _get_frequency_days(frequency_str):
    if frequency_str == 'Weekly':
        return 7
    elif frequency_str == 'Monthly':
        return 30
    return 1 # Default to Daily

def send_overdue_reminders():
    from dashboard.models import SystemSettings
    sys_settings = SystemSettings.load()
    
    now = timezone.now()
    today = datetime.date.today()
    sent_count = 0
    skipped_count = 0

    # 1. Pre-due Reminders (Reminder Days Before Due)
    try:
        days_before = int(sys_settings.reminder_days_before)
    except ValueError:
        days_before = 2 # fallback

    if days_before > 0:
        target_due_date = today + datetime.timedelta(days=days_before)
        pre_due_books = IssueBook.objects.filter(
            status='issued',
            due_date__date=target_due_date
        )
        for issue in pre_due_books:
            # Avoid sending multiple pre-due emails on the same day
            if issue.last_reminder_sent and issue.last_reminder_sent.date() == today:
                skipped_count += 1
                continue
                
            subject = 'Upcoming Due Date Reminder'
            message = f"""Dear {issue.member.first_name or issue.member.username},

This is a gentle reminder that the book "{issue.book.title}" is due on {issue.due_date.date()}. 
Please return it on or before the due date to avoid any late fines.

Thank you,
Library Management System"""
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[issue.member.email],
                    fail_silently=False
                )
                issue.last_reminder_sent = now
                issue.save(update_fields=['last_reminder_sent'])
                sent_count += 1
            except Exception as e:
                print(f"Failed to send pre-due email to {issue.member.email}: {e}")

    # 2. Overdue Reminders
    if not sys_settings.email_on_overdue:
        return f"Pre-due: {sent_count} sent. Overdue emails are disabled."

    freq_days = _get_frequency_days(sys_settings.overdue_alert_frequency)
    cutoff_date = now - datetime.timedelta(days=freq_days)

    overdue_books = IssueBook.objects.filter(
        status='issued',
        due_date__lt=today
    )

    for issue in overdue_books:
        # Skip if a reminder was sent within the frequency cooldown
        if issue.last_reminder_sent and issue.last_reminder_sent > cutoff_date:
            skipped_count += 1
            continue

        days_overdue = (today - issue.due_date.date()).days

        if days_overdue <= 3:
            subject = 'Gentle Reminder: Library Book Overdue'
            message = f"""Dear {issue.member.first_name or issue.member.username},

This is a gentle reminder that the book "{issue.book.title}" was due on {issue.due_date.date()}. 
Please return it as soon as possible to avoid accumulating fines.

Thank you,
Library Management System"""
        elif days_overdue <= 7:
            subject = 'Notice: Overdue Book and Accumulating Fines'
            message = f"""Dear {issue.member.first_name or issue.member.username},

Our records indicate that the book "{issue.book.title}" is now {days_overdue} days overdue.
Your current accumulating fine is Rs. {days_overdue * 5}. 

Please return the book immediately to stop further fines.

Thank you,
Library Management System"""
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
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[issue.member.email],
                fail_silently=False
            )
            issue.last_reminder_sent = now
            issue.save(update_fields=['last_reminder_sent'])
            sent_count += 1
        except Exception as e:
            print(f"Failed to send overdue email to {issue.member.email}: {e}")

    return f"{sent_count} reminder(s) sent, {skipped_count} skipped (due to frequency)."


def send_overdue_reminders_force():
    """Force send - bypasses all cooldowns. For testing only."""
    from dashboard.models import SystemSettings
    sys_settings = SystemSettings.load()
    
    now = timezone.now()
    today = datetime.date.today()
    sent_count = 0
    errors = []

    try:
        days_before = int(sys_settings.reminder_days_before)
    except ValueError:
        days_before = 2

    # Pre-due Force
    if days_before > 0:
        target_due_date = today + datetime.timedelta(days=days_before)
        pre_due_books = IssueBook.objects.filter(status='issued', due_date__date=target_due_date)
        for issue in pre_due_books:
            try:
                send_mail(
                    "Upcoming Due Date Reminder",
                    f"Dear {issue.member.username},\nThe book '{issue.book.title}' is due on {issue.due_date.date()}.",
                    settings.DEFAULT_FROM_EMAIL,
                    [issue.member.email],
                    fail_silently=False
                )
                issue.last_reminder_sent = now
                issue.save(update_fields=['last_reminder_sent'])
                sent_count += 1
            except Exception as e:
                errors.append(f"{issue.member.email}: {str(e)}")

    if not sys_settings.email_on_overdue:
        return {"error": "Overdue emails disabled", "pre_due_sent": sent_count, "errors": errors}

    # Overdue Force
    overdue_books = IssueBook.objects.filter(status='issued', due_date__lt=today)
    for issue in overdue_books:
        days_overdue = (today - issue.due_date.date()).days
        message = f"Dear {issue.member.username},\nBook '{issue.book.title}' is {days_overdue} days overdue. Fine is Rs. {days_overdue * 5}."
        try:
            send_mail("Notice: Overdue Book", message, settings.DEFAULT_FROM_EMAIL, [issue.member.email], fail_silently=False)
            issue.last_reminder_sent = now
            issue.save(update_fields=['last_reminder_sent'])
            sent_count += 1
        except Exception as e:
            errors.append(f"{issue.member.email}: {str(e)}")

    return {
        "overdue_found": overdue_books.count(),
        "total_sent": sent_count,
        "errors": errors,
    }