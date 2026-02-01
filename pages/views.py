from django.shortcuts import render, get_object_or_404, redirect
from .models import Book, Author
from .forms import BookForm

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

def author_detail(request, author_id):
    author = get_object_or_404(Author, id=author_id)
    books = Book.objects.filter(author=author)
    return render(request, 'author_detail.html', {'author':author, 'books':books})

def add_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST) #request.POST is a dictionary that store the fields as keys and the values inputted as values
        if form.is_valid():
            form.save()
            return redirect('book_list') #return to the url of book_list using the nickname of the path mapping
            #we need this return or otherwise we will stay in the same page and everything will be reloaded when we refresh and
            #the book will be resaved, creating duplicates
    else:#if it is get, lets reply with the book form (inside this statement the form is empty)
        form = BookForm()
    return render(request, 'add_book.html', {'form' : form})
    # we get to this return statement because the form is new (we just created it we are sending it back for our get response)
    # or because form was invalid and the responde is an invalid form (with fields filled in), user fills the fields and fixes the issues
    # after that another post request is created by them pressing the submit boton