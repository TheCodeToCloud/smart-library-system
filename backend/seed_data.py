import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library.settings')
django.setup()

from accounts.models import User
from books.models import Book

# Ensure admin user is deleted (as requested by user)
try:
    admin_to_delete = User.objects.get(username='admin')
    admin_to_delete.delete()
    print('Admin user deleted successfully.')
except User.DoesNotExist:
    pass

# Create default librarian
lib_user, lib_created = User.objects.get_or_create(
    username='librarian',
    defaults={'email': 'librarian@library.com', 'role': 'librarian', 'is_staff': True}
)
lib_user.set_password('librarian123')
lib_user.save()
if lib_created:
    print('Librarian created: librarian@library.com / librarian123')
else:
    print('Librarian password reset to: librarian123')

# Add sample books
books_data = [
    {'title': 'The Alchemist', 'author': 'Paulo Coelho', 'category': 'Fiction', 'isbn': '978-0062315007', 'total_copies': 10, 'available_copies': 10, 'cover_image': '/book-alchemist.jpg'},
    {'title': 'Atomic Habits', 'author': 'James Clear', 'category': 'Self-Help', 'isbn': '978-0735211292', 'total_copies': 10, 'available_copies': 10, 'cover_image': '/book-atomic-habits.jpg'},
    {'title': 'Think and Grow Rich', 'author': 'Napoleon Hill', 'category': 'Self-Help', 'isbn': '978-1585424337', 'total_copies': 10, 'available_copies': 10, 'cover_image': '/book-think-grow-rich.jpg'},
    {'title': 'Clean Code', 'author': 'Robert C. Martin', 'category': 'Technology', 'isbn': '978-0132350884', 'total_copies': 10, 'available_copies': 10, 'cover_image': '/book-clean-code.jpg'},
    {'title': 'The Psychology of Money', 'author': 'Morgan Housel', 'category': 'Finance', 'isbn': '978-0857197689', 'total_copies': 10, 'available_copies': 10, 'cover_image': '/book-psychology-money.jpg'},
    {'title': 'Deep Work', 'author': 'Cal Newport', 'category': 'Self-Help', 'isbn': '978-1455586691', 'total_copies': 10, 'available_copies': 10, 'cover_image': '/book-deep-work.jpg'},
    {'title': 'Rich Dad Poor Dad', 'author': 'Robert T. Kiyosaki', 'category': 'Finance', 'isbn': '978-1612680194', 'total_copies': 10, 'available_copies': 10, 'cover_image': '/book-rich-dad.jpg'},
    {'title': 'The Power of Habit', 'author': 'Charles Duhigg', 'category': 'Self-Help', 'isbn': '978-1400069286', 'total_copies': 10, 'available_copies': 10, 'cover_image': '/book-power-habit.jpg'},
]

for b in books_data:
    obj, created = Book.objects.get_or_create(
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
