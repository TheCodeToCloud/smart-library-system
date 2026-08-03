import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library.settings')
django.setup()

from rest_framework.test import APIRequestFactory
from accounts.views import AdminCreateMemberView
from accounts.models import User

# First, get admin
admin = User.objects.filter(role='admin').first()

# Clean dummy user
User.objects.filter(email='BIPLOVTUMBAPOMBBT183780@mbman.edu.np').delete()

factory = APIRequestFactory()
request = factory.post('/api/accounts/admin-create-member/', {
    'first_name': 'Biplov',
    'last_name': 'Tumbapo',
    'email': 'BIPLOVTUMBAPOMBBT183780@mbman.edu.np',
    'username': 'BIPLOVTUMBAPOMBBT183780',
    'phone': '9708611427',
    'department': 'Computer Science',
    'roll_no': '33',
    'password': 'password123'
}, format='json')

from rest_framework.test import force_authenticate
force_authenticate(request, user=admin)
view = AdminCreateMemberView.as_view()
try:
    response = view(request)
    print("STATUS CODE:", response.status_code)
    print("RESPONSE DATA:", response.data)
except Exception as e:
    import traceback
    print("EXCEPTION:", traceback.format_exc())
