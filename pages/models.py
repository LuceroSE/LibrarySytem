from django.db import models
from django.contrib.auth.models import User #user model in db
# Create your models here.
class Author(models.Model):
    name = models.CharField(max_length=100)
    birth_year = models.IntegerField()
    country = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    year_published = models.IntegerField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE) # This creates the author_id foreign key column
    date_added = models.DateField(auto_now_add=True)
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True) # if the user is deleted, we keep the book but set added_by to None (rather than deleting the book too, which is what CASCADE would do)
    #null=True allows the field to be empty (for books that existed before we added this field, or where the user has been deleted)
    def __str__(self):
        return self.title