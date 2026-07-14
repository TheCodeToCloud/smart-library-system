import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library.settings')
django.setup()

from accounts.models import User
from books.models import Book

# Create admin superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@library.com', 'admin123')
    print('Admin created: admin@library.com / admin123')
else:
    print('Admin already exists')

# Add sample books
books_data = [
    {'title': 'The Alchemist', 'author': 'Paulo Coelho', 'category': 'Fiction', 'isbn': '978-0062315007', 'total_copies': 5, 'available_copies': 3},
    {'title': 'Atomic Habits', 'author': 'James Clear', 'category': 'Self-Help', 'isbn': '978-0735211292', 'total_copies': 4, 'available_copies': 2},
    {'title': 'Think and Grow Rich', 'author': 'Napoleon Hill', 'category': 'Self-Help', 'isbn': '978-1585424337', 'total_copies': 3, 'available_copies': 3},
    {'title': 'Clean Code', 'author': 'Robert C. Martin', 'category': 'Technology', 'isbn': '978-0132350884', 'total_copies': 6, 'available_copies': 4},
    {'title': 'The Psychology of Money', 'author': 'Morgan Housel', 'category': 'Finance', 'isbn': '978-0857197689', 'total_copies': 4, 'available_copies': 1},
    {'title': 'Deep Work', 'author': 'Cal Newport', 'category': 'Self-Help', 'isbn': '978-1455586691', 'total_copies': 3, 'available_copies': 2},
    {'title': 'Rich Dad Poor Dad', 'author': 'Robert T. Kiyosaki', 'category': 'Finance', 'isbn': '978-1612680194', 'total_copies': 5, 'available_copies': 3},
    {'title': 'The Power of Habit', 'author': 'Charles Duhigg', 'category': 'Self-Help', 'isbn': '978-1400069286', 'total_copies': 4, 'available_copies': 2},
]

for b in books_data:
    obj, created = Book.objects.get_or_create(isbn=b['isbn'], defaults=b)
    if created:
        print(f'Book created: {b["title"]}')

print(f'\nTotal books: {Book.objects.count()}')
print(f'Total users: {User.objects.count()}')
print('\nAll done! Database ready.')
