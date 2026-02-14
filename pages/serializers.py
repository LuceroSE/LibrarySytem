# pages/serializers.py
from rest_framework import serializers
from .models import Author, Book


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for the Author"""

    class Meta:
        model = Author                                     #Which Django model to serialize
        fields = ['id', 'name', 'birth_year', 'country']   #The attributes of the model that should be included in the API representation.
        read_only_fields = ['id']  #in we put fields that can't be set via the API (auto-generated fields) like PK

    

class BookSerializer(serializers.ModelSerializer):
    """Serializer for the Book model."""
    author_name = serializers.CharField(source='author.name', read_only=True)  #The source='author.name' tells DRF to traverse the ForeignKey relationship.

    class Meta:
        model = Book
        fields = ['id', 'title', 'year_published', 'author', 'author_name']
        read_only_fields = ['id']
    
    '''Form validation = frontend guard (website part of validation)
        Serializer validation = API guard (anyone interacting with out IP has to satisfy this)
        Model constraints = database guard'''

    def validate_year_published(self, value):
        """Ensure year is reasonable."""
        if value < 1000 or value > 2100:
            raise serializers.ValidationError("Year must be between 1000 and 2100")
        return value

    def validate(self, data):
        """Cross-field validation."""
        # Example: ensure the book wasn't published before the author was born
        if 'author' in data and 'year_published' in data:
            if data['year_published'] < data['author'].birth_year:
                raise serializers.ValidationError(
                    "Book cannot be published before the author was born"
                )
        return data
