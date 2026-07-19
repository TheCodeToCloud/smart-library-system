from django.db import models

class SystemSettings(models.Model):
    # General
    library_name = models.CharField(max_length=255, default="City Central Library")
    library_code = models.CharField(max_length=50, default="CCL-2026")
    language = models.CharField(max_length=50, default="English")
    timezone = models.CharField(max_length=100, default="(GMT+05:45) Asia/Kathmandu")
    date_format = models.CharField(max_length=50, default="DD MMM YYYY (e.g. 27 May 2026)")
    currency = models.CharField(max_length=50, default="NPR - Nepali Rupee (Rs)")

    # Library Info
    address = models.TextField(default="123 Library Street, Kathmandu")
    phone = models.CharField(max_length=20, default="+977 9800000000")
    email = models.EmailField(default="library@uni.edu.np")
    website = models.URLField(default="https://library.uni.edu.np")
    established = models.CharField(max_length=4, default="2010")
    total_floors = models.CharField(max_length=10, default="3")

    # Notifications
    email_on_issue = models.BooleanField(default=True)
    email_on_return = models.BooleanField(default=True)
    email_on_overdue = models.BooleanField(default=True)
    sms_on_overdue = models.BooleanField(default=False)
    reminder_days_before = models.CharField(max_length=10, default="2")
    overdue_alert_frequency = models.CharField(max_length=50, default="Daily")

    # Backup
    auto_backup = models.BooleanField(default=True)
    backup_frequency = models.CharField(max_length=50, default="Weekly")
    last_backup = models.CharField(max_length=100, default="27 May 2026, 02:30 PM")
    backup_location = models.CharField(max_length=100, default="Cloud Storage")

    def save(self, *args, **kwargs):
        # Enforce Singleton pattern: Only one row allowed (pk=1)
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "System Settings"
