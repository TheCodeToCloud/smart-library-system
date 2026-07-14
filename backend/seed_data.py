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
    {'title': 'The Alchemist', 'author': 'Paulo Coelho', 'category': 'Fiction', 'isbn': '978-0062315007', 'total_copies': 5, 'available_copies': 3, 'cover_image': 'https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg'},
    {'title': 'Atomic Habits', 'author': 'James Clear', 'category': 'Self-Help', 'isbn': '978-0735211292', 'total_copies': 4, 'available_copies': 2, 'cover_image': 'https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UF1000,1000_QL80_.jpg'},
    {'title': 'Think and Grow Rich', 'author': 'Napoleon Hill', 'category': 'Self-Help', 'isbn': '978-1585424337', 'total_copies': 3, 'available_copies': 3, 'cover_image': 'https://m.media-amazon.com/images/I/71UypkUjStL._AC_UF1000,1000_QL80_.jpg'},
    {'title': 'Clean Code', 'author': 'Robert C. Martin', 'category': 'Technology', 'isbn': '978-0132350884', 'total_copies': 6, 'available_copies': 4, 'cover_image': 'https://m.media-amazon.com/images/I/41xShlnTZTL._AC_UF1000,1000_QL80_.jpg'},
    {'title': 'The Psychology of Money', 'author': 'Morgan Housel', 'category': 'Finance', 'isbn': '978-0857197689', 'total_copies': 4, 'available_copies': 1, 'cover_image': 'https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UF1000,1000_QL80_.jpg'},
    {'title': 'Deep Work', 'author': 'Cal Newport', 'category': 'Self-Help', 'isbn': '978-1455586691', 'total_copies': 3, 'available_copies': 2, 'cover_image': 'https://m.media-amazon.com/images/I/71Sbx3679fL._AC_UF1000,1000_QL80_.jpg'},
    {'title': 'Rich Dad Poor Dad', 'author': 'Robert T. Kiyosaki', 'category': 'Finance', 'isbn': '978-1612680194', 'total_copies': 5, 'available_copies': 3, 'cover_image': 'https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg'},
    {'title': 'The Power of Habit', 'author': 'Charles Duhigg', 'category': 'Self-Help', 'isbn': '978-1400069286', 'total_copies': 4, 'available_copies': 2, 'cover_image': 'https://m.media-amazon.com/images/I/711ey-93Y6L._AC_UF1000,1000_QL80_.jpg'},
]

for b in books_data:
    obj, created = Book.objects.update_or_create(
        isbn=b['isbn'],
        defaults=b
    )
    if created:
        print(f'Book created: {b["title"]}')
    else:
        print(f'Book updated: {b["title"]}')

print(f'\nTotal books: {Book.objects.count()}')
print(f'Total users: {User.objects.count()}')
print('\nAll done! Database ready.')
