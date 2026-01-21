from django.shortcuts import render

# Create your views here.


def home(request):
    username = request.GET.get('username', 'Guest')
    return render(request, "home.html", {'username': username})

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
