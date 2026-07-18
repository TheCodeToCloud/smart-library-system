from django.db import models
import qrcode
from io import BytesIO

from django.core.files import File

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)

    category = models.CharField(max_length=100)

    isbn = models.CharField(
        max_length=20,
        unique=True
    )

    qr_code = models.ImageField(
        upload_to='book_qr/',
        blank=True,
        null=True
    )

    total_copies = models.IntegerField()

    available_copies = models.IntegerField()
    
    # Book cover image — can be either a URL or uploaded file (stored in Cloudinary)
    cover_image = models.URLField(blank=True, null=True)
    cover_image_file = models.ImageField(
        upload_to='book_covers/',
        blank=True,
        null=True
    )

    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ["id"] 

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if not self.qr_code:
            qr_data = f"Book ID: {self.id}\nTitle: {self.title}"

            qr_img = qrcode.make(qr_data)

            buffer = BytesIO()
            qr_img.save(buffer, format="PNG")
            buffer.seek(0)

            self.qr_code.save(
                f"book_{self.id}.png",
                File(buffer),
                save=False
            )

            super().save(update_fields=["qr_code"])