from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthorViewSet, BookViewSet

from . import views

router = DefaultRouter()
router.register(r'authors', AuthorViewSet, basename='author')
router.register(r'books', BookViewSet, basename='book')

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('users/<int:id>/', views.user_profile),
    path('books/', views.book_list, name='book_list'),
    path('books/search/', views.book_search, name='book_search'), #before the books/<int:book_id>/' path because Otherwise Django might try to interpret "search" as a book ID. THIS IS GET, NOT A URL PARAMETER
    path('books/add/', views.add_book, name='add_book'), #Django checks URL patterns in order from top to bottom. If <int:book_id> came first, Django would try to interpret "add" as a book ID, fail (it's not an integer), and return a 404 error.
    path('books/<int:book_id>/', views.book_detail, name='book_detail'),
    path('authors/<int:author_id>/', views.author_detail, name='author_detail'),
    path('register/', views.register, name='register'),
    path('books/<int:book_id>/edit/', views.edit_book, name='edit_book'),
    path('books/<int:book_id>/delete/', views.delete_book, name='delete_book'),
    path('api/', include(router.urls)),
]