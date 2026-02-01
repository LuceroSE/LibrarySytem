from django.forms import ModelForm
from django.core.exceptions import ValidationError
from .models import Book
from datetime import date


class BookForm(ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'year_published', 'author']

    def clean_year_published(self):
        year = self.cleaned_data['year_published']
        if year > date.today().year:
            raise ValidationError('The year published cannot be in the future')
        if year < 1440:
            raise ValidationError('The printing press was not invented until 1440')
        return year
    
    def clean(self):     #overriding built in validation from parent class (built in validation oj django)
        cleaned_data = super().clean()  #this gets a dictionary that holds values are safe from prev validations

        year = cleaned_data.get('year_published')
        author = cleaned_data.get('author') #.get() because a field might be missing from cleaned_data if it failed its own validation earlier
        if year and author and year < author.birth_year:
            raise ValidationError('A book cannot be published before its author was born')
        return cleaned_data
    
    def save(self, commit=True):
        book = super().save(commit=False) #This creates a Book object in memory with all the form data filled in, but does not save it to the database yet
        book.title = book.title.title()
        book.date_added = date.today()

        if commit: #We keep the value of commit parameter because Django itself sometimes calls save(commit=False) when working with related objects 
            book.save()
        return book