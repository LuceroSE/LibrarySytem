from django.db import models

# Create your models here.
class Author(models.Model):
    name = models.CharField(max_length=100)
    birth_year = models.IntegerField()
    country = models.CharField(max_length=50)

class Book(models.Model):
    title = models.CharField(max_length=200)
    year_published = models.IntegerField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE) # This creates the author_id foreign key column