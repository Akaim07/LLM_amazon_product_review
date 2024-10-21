from django.shortcuts import render
from collections import defaultdict
from django.db.models import Count, Case, When, IntegerField
from django.shortcuts import render
from django.http import JsonResponse  # If you want to return a JSON response
from .gemini import GeminiGenerator  # Import the GeminiGenerator class
from django.shortcuts import get_list_or_404,get_object_or_404
from .models import Product,AllProduct


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


def product_rating_stats(request):
    # Group by name and annotate with the count of ratings based on the condition
    product_stats = AllProduct.objects.values('name').annotate(
        positive=Count(Case(When(rating__gt=4, then=1), output_field=IntegerField())),
        negative=Count(Case(When(rating__lt=4, then=1), output_field=IntegerField())),
        neutral=Count(Case(When(rating=4, then=1), output_field=IntegerField()))
    )    
    response_data = list(product_stats)
    return JsonResponse(response_data, safe=False)

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

def get_merchants_with_product_info(request):
    merchants_data = defaultdict(lambda: {'count': 0, 'products': []})
    products = Product.objects.all()

    for product in products:
        merchants_data[product.merchant]['count'] += 1
        # Append both product id and name to the products list
        merchants_data[product.merchant]['products'].append({
            'id': product.id,
            'name': product.name
        })

    response_data = []
    for merchant, info in merchants_data.items():
        response_data.append({
            'merchant': merchant,
            'product_count': info['count'],
            'products': info['products']
        })

    return JsonResponse({'merchants': response_data})


def admin_pannel(request):
    return render(request, 'admin_page.html')


