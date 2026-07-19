from django.db import models
from accounts.models import User

class Report(models.Model):
    REPORT_TYPES = (
        ('Members', 'Members'),
        ('Books', 'Books'),
        ('Finance', 'Finance'),
    )

    name = models.CharField(max_length=255)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    generated_on = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, default='Completed')
    file = models.FileField(upload_to='reports/', null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-generated_on']
