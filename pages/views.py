from django.shortcuts import render

# Create your views here.


def home(request):
    username = request.GET.get('username', 'Guest')
    return render(request, "home.html", {'username': username})

def about(request):
    return render(request, "about.html")

