from django.db.models import Count
from books.models import Book
from circulation.models import IssueBook

def get_smart_recommendations(user, limit=5):
    """
    Generate content-based recommendations for a student.
    
    Logic:
    1. Look at the student's past borrowed books.
    2. Extract their favorite categories and authors.
    3. Find books in those categories/authors that the student hasn't borrowed yet.
    4. Rank them by overall popularity (how many times they've been issued to anyone).
    5. Fallback to overall popular books if the student has no history or not enough matches.
    """
    
    # 1. Get the IDs of books the student has already borrowed (we won't recommend these)
    borrowed_books = IssueBook.objects.filter(member=user).values_list('book_id', flat=True)
    borrowed_book_ids = list(borrowed_books)
    
    # If the student has never borrowed a book, fallback to general popular books
    if not borrowed_book_ids:
        popular_books = Book.objects.annotate(
            issue_count=Count('issuebook')
        ).filter(
            available_copies__gt=0
        ).order_by('-issue_count')[:limit]
        
        return [
            {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "cover_image": book.cover_image.url if book.cover_image else None,
                "reason": "Highly Popular Overall"
            }
            for book in popular_books
        ]

    # 2. Extract favorite categories and authors
    # We query the Book model directly for the books they've borrowed
    past_books = Book.objects.filter(id__in=borrowed_book_ids)
    
    # Simple counting for categories and authors
    categories = {}
    authors = {}
    for book in past_books:
        categories[book.category] = categories.get(book.category, 0) + 1
        authors[book.author] = authors.get(book.author, 0) + 1
        
    # Get top categories and authors (sorting by frequency)
    top_categories = sorted(categories, key=categories.get, reverse=True)[:3]
    top_authors = sorted(authors, key=authors.get, reverse=True)[:3]
    
    # 3. Find candidate books (matching top categories or authors, not already borrowed)
    # 4. Rank by popularity (issue_count) and prioritize available copies
    candidates = Book.objects.exclude(
        id__in=borrowed_book_ids
    ).filter(
        available_copies__gt=0
    ).filter(
        category__in=top_categories
    ) | Book.objects.exclude(
        id__in=borrowed_book_ids
    ).filter(
        available_copies__gt=0
    ).filter(
        author__in=top_authors
    )
    
    # Annotate with issue count and order
    ranked_candidates = candidates.annotate(
        issue_count=Count('issuebook')
    ).order_by('-issue_count')[:limit]
    
    recommendations = []
    for book in ranked_candidates:
        # Determine the reason to show the user
        if book.author in top_authors:
            reason = f"Because you read {book.author}"
        else:
            reason = f"Popular in {book.category}"
            
        recommendations.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "cover_image": book.cover_image.url if book.cover_image else None,
            "reason": reason
        })
        
    # 5. If we still don't have enough recommendations, fill with overall popular books
    if len(recommendations) < limit:
        needed = limit - len(recommendations)
        exclude_ids = borrowed_book_ids + [r["id"] for r in recommendations]
        
        fillers = Book.objects.exclude(
            id__in=exclude_ids
        ).filter(
            available_copies__gt=0
        ).annotate(
            issue_count=Count('issuebook')
        ).order_by('-issue_count')[:needed]
        
        for book in fillers:
            recommendations.append({
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "cover_image": book.cover_image.url if book.cover_image else None,
                "reason": "Trending in the Library"
            })
            
    return recommendations
