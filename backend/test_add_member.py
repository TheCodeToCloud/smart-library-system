import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library.settings')
django.setup()

from accounts.models import User

emails_to_delete = ['alokrajgupta63@gmail.com', 'BIPLOVTUMBAPOMBBT183780@mbman.edu.np']
for email in emails_to_delete:
    deleted, _ = User.objects.filter(email=email).delete()
    if deleted:
        print(f"Deleted {email}")
    else:
        print(f"{email} not found")

print("Cleanup complete!")

