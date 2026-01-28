from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('users/<int:id>/', views.user_profile),
    path('books/', views.book_list, name='book_list'),
    path('books/search/', views.book_search, name='book_search'), #before the books/<int:book_id>/' path because Otherwise Django might try to interpret "search" as a book ID. THIS IS GET, NOT A URL PARAMETER
    path('books/<int:book_id>/', views.book_detail, name='book_detail'),
    path('authors/<int:author_id>/', views.author_detail, name='author_detail')
]