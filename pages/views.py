from django.shortcuts import render, get_object_or_404
from .models import Book

# Create your views here.


def home(request):
    return render(request, "home.html",)

def about(request):
    return render(request, "about.html")

def user_profile(request, id):
    users = {
        1: {'name': 'Alice', 'email':'alice@example.com'},
        2: {'name': 'Bob', 'email': 'bob@example.com'},
        3: {'name': 'Charlie', 'email': 'charlie@example.com'}
    }

    user = users.get(id) #.get returns none if key does not exit and you didnt specidy a default return statement

    if user is None: 
        return render(request, 'not_found.html', {'id': id}) 
    
    return render(request, 'profile.html', {'user' : user, 'id' : id})

def book_list(request):
    books = Book.objects.all() #SELECT * FROM pages_book;
    return render(request, 'book_list.html', {'books': books})

def book_detail(request, book_id):
    book = get_object_or_404(Book, id=book_id) #keyword argument id
    return render(request, 'book_detail.html', {'book' : book})

def book_search(request):
    query = request.GET.get('q', '') # Get the 'q' parameter, default to empty string
    if query:
        books = Book.objects.filter(title__icontains=query)
    else:
        books = Book.objects.none() # Get the 'q' parameter, default to empty string
    
    return render(request, 'book_search.html', {'books': books, 'query': query})
