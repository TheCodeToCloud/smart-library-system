"""
Scheduling the Overdue Reminders in Production
==============================================

Option 1: Railway (or similar PaaS) Cron Job
--------------------------------------------
If your host supports cron jobs (like Railway's Cron feature):
Schedule this command to run daily (e.g. `0 0 * * *` for midnight).
Command: `python manage.py send_overdue_reminders`

Option 2: Simple Worker Process (for basic setups)
--------------------------------------------------
If you don't have cron but can run a background worker in your `build.sh` or `Procfile`,
you can run a shell script that loops indefinitely:

    # In your worker startup script (e.g., worker.sh):
    while true; do
        python manage.py send_overdue_reminders
        sleep 86400  # sleep for 24 hours
    done

Since this is a simple college project, Option 1 or 2 is perfectly fine
and avoids the complexity of setting up Celery + Redis.
"""

from django.core.management.base import BaseCommand
from circulation.reminders import send_overdue_reminders

class Command(BaseCommand):
    help = 'Sends escalating overdue reminders to students with issued books past their due date.'

    def handle(self, *args, **options):
        self.stdout.write("Starting to send overdue reminders...")
        try:
            result = send_overdue_reminders()
            self.stdout.write(self.style.SUCCESS(f"Successfully completed: {result}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error occurred: {e}"))
