from django.shortcuts import render

# Create your views here.


def home(request):
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    return render(request, "home.html", {'numbers': numbers})

def about(request):
    return render(request, "about.html")

