from django.shortcuts import render

# Create your views here.


def home(request):
    return render(request, "home.html", 
                  {'title' : 'Welcome',
                   'items' : ['Django', 'Python', 'HTML'],
                   })

def about(request):
    return render(request, "about.html")

