# Create your views here.
from django.shortcuts import render
from django.http import JsonResponse  # If you want to return a JSON response
from .gemini import GeminiGenerator  # Import the GeminiGenerator class
from django.shortcuts import get_list_or_404,get_object_or_404
from .models import Product

# Create your views here.
def admin_pannel(request):
    return render(request, 'admin_page.html')