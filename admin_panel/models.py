from django.db import models

# Create your models here.
class Product(models.Model):
    asin = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=250)
    overall_rating = models.DecimalField(max_digits=3, decimal_places=2)
    review_count = models.IntegerField()
    summary = models.TextField()
    merchant = models.CharField(max_length=255)
    suggestion = models.TextField()

    def __str__(self):
        return self.name