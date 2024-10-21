from django.shortcuts import render

# Create your views here.

# Create your views here.
from django.shortcuts import render
from django.http import JsonResponse  # If you want to return a JSON response
from .gemini import GeminiGenerator  # Import the GeminiGenerator class
from django.shortcuts import get_list_or_404,get_object_or_404
from .models import Product


# Define the view for getting a suggestion
def get_suggestion_view(request, product_name):
    suggestion = GeminiGenerator.get_suggestion(product=product_name)

    return JsonResponse(suggestion)


def get_products_by_merchant(request, merchant_name):
    # Get the products for the given merchant
    products = Product.objects.filter(merchant=merchant_name)

    # Prepare response data
    product_list = []
    for product in products:
        product_list.append({
            'name': product.name,
            'rating': product.overall_rating,
            'suggestion': product.suggestion
        })

    return JsonResponse({'products': product_list})


def get_product_details_by_name(request, product_name):
    # Fetch product by name
    product = get_object_or_404(Product, name=product_name)

    # Prepare response data
    product_details = {
        'id' : product.id,
        'name': product.name,
        'rating': product.overall_rating,
        'summary': product.summary,
        'suggestion': product.suggestion
    }
    return JsonResponse(product_details)

def get_merchant_list(request):
    # Fetch distinct merchants from the Product table
    merchants = Product.objects.values_list('merchant', flat=True).distinct()
    return JsonResponse({'merchants': list(merchants)})

def get_product_name_list(request):
    # Fetch all product names
    products = Product.objects.values() 
    product_list = list(products)
    
    # product_names = Product.objects.values_list('id','name')
    return JsonResponse({'product_names':product_list})

def get_all_products_with_ratings(request):
    # Fetch all products with their names and ratings
    products = Product.objects.values('id','name', 'overall_rating')
    return JsonResponse({'products': list(products)})

def admin_pannel(request):
    return render(request, 'admin_page.html')