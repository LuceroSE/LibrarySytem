from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('users/<int:id>/', views.user_profile),
    path('books/', views.book_list, name='book_list')
]