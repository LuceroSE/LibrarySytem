from django.shortcuts import render, get_object_or_404, redirect
from .models import Book, Author
from .forms import BookForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required, user_passes_test, permission_required
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required

from rest_framework import viewsets
from .serializers import AuthorSerializer, BookSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

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

    can_edit = request.user.has_perm('pages.change_book')
    can_delete = request.user.has_perm('pages.delete_book')

    return render(request, 'book_detail.html', {'book' : book, 'can_edit': can_edit, 'can_delete' : can_delete}) #This passes the permission check results to the template so we can show or hide buttons accordingly.

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

# for the user_passes_test decorator, lambda is this too
def is_staff(user):
    return user.is_staff

@login_required # only return the add book (in a wrapper) html if user is logged in. login_required is a 
#decorator and it returns our function and lets access to the add_book page only if the user is loggged in otherwise it defaults to 
# LOGIN_URL = 'login' #setting for where to send users who try to access a page that requires login 
@permission_required('pages.add_book', raise_exception=True)  #MODEL BASED checks whether the user has a specific permission, if a logged-in user lacks permission, a 403 makes more sense than sending them to a login page they don't need
@user_passes_test(is_staff) # CONSTUM CONDITION decorator to check if user passes this test of is staff, we can define here any condition we want noy only is_staff tho. redirection is to login page rn, a 403 makes more sense than sending them to a login page they don't need 
def add_book(request):
    
    if request.method == 'POST':
        form = BookForm(request.POST) #request.POST is a dictionary that store the fields as keys and the values inputted as values
        if form.is_valid():
            book = form.save(commit=False) #The @login_required decorator guarantees that request.user is a real User object (not AnonymousUser)
            book.added_by = request.user
            book.save()
            return redirect('book_list') #return to the url of book_list using the nickname of the path mapping
            #we need this return or otherwise we will stay in the same page and everything will be reloaded when we refresh and
            #the book will be resaved, creating duplicates. This is becuase the browser saves the last requests
    else:#if it is get, lets reply with the book form (inside this statement the form is empty)
        form = BookForm()
    return render(request, 'add_book.html', {'form' : form})
    # we get to this return statement because the form is new (we just created it we are sending it back for our get response)
    # or because form was invalid and the responde is an invalid form (with fields filled in), user fills the fields and fixes the issues
    # after that another post request is created by them pressing the submit boton

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    
    return render(request, 'registration/register.html', {'form' : form})

def user_can_modify_book(user, book):        
    """Check if user can edit/delete this book. 
    This keeps your authorization rules in one place. If the rules change 
    (e.g., "moderators can edit but not delete"), you only update one function."""
    if user.is_staff:
        return True
    if user.has_perm('pages.change_book'):
        return True
    if book.added_by == user:  #OBJECT LEVEL We're not asking "does this user have delete permission?" (model-level). We're asking "is this user the one who added this specific book?" (object-level).
        return True
    return False

@login_required
def delete_book(request, book_id):
    book = get_object_or_404(Book, pk=book_id)
    
    if not user_can_modify_book(request.user, book):
        return HttpResponseForbidden("You don't have permission to delete this book.")
    
    if request.method == "POST":
        book.delete()
        return redirect('book_list')

    return render(request, 'confirm_delete.html', {'book':book})

@login_required
def edit_book(request, book_id):
    # 1. Get the book (or 404 if it doesn't exist)
    book = get_object_or_404(Book, pk=book_id)   #We fetch the book by its ID from the URL. If it doesn't exist, Django returns a 404 page automatically.

    # 2. Check authorization
    if not user_can_modify_book(request.user, book):
        return HttpResponseForbidden("You don't have permission to edit this book.")

    # 3. Handle GET and POST
    if request.method == 'POST':
        form = BookForm(request.POST, instance=book)  #When the user submits changes, we create the form with both request.POST (the submitted data) and instance=book (the book to update). The save() call updates the existing book rather than creating a new one.
        if form.is_valid():
            form.save()
            return redirect('book_detail', book_id=book.id)
    else:
        form = BookForm(instance=book)  #When the user first visits the edit page, we create a form with instance=book. This pre-fills the form with the book's current title, year, and author.

    return render(request, 'edit_book.html', {'form': form, 'book': book})

#-----------------------------------------------------------------------------
# pages/views.py



class AuthorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Author model.

    Provides: list, create, retrieve, update, partial_update, destroy
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

@extend_schema_view(
    list=extend_schema(
        summary="List all books",
        description="Returns a list of all books in the bookshop.",
        parameters=[
            OpenApiParameter(
                name='title',
                description='Filter books by title (case-insensitive)',
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name='author',
                description='Filter books by author ID',
                required=False,
                type=int,
            ),
        ],
    ),
    create=extend_schema(
        summary="Add a new book",
        description="Adds a new book to the bookshop inventory.",
    ),
    retrieve=extend_schema(
        summary="Get book details",
        description="Returns the details of a single book by its ID.",
    ),
    update=extend_schema(
        summary="Replace a book",
        description="Completely replaces an existing book's data.",
    ),
    partial_update=extend_schema(
        summary="Update book fields",
        description="Updates specific fields of an existing book.",
    ),
    destroy=extend_schema(
        summary="Remove a book",
        description="Permanently removes a book from the inventory.",
    ),
)
class BookViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Book model.

    Provides: list, create, retrieve, update, partial_update, destroy
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self):
        queryset = Book.objects.all()
        title = self.request.query_params.get('title')
        if title:
            queryset = queryset.filter(title__icontains=title)
        author_id = self.request.query_params.get('author')
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        return queryset