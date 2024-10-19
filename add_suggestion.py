import os
import django
import requests
import json
import time

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "amazon_product_review.settings")
django.setup()

from admin_panel.models import Product  # Replace with your app's name and Product model

def get_suggestion_from_api(product_name):
    """
    Function to call the API and fetch the suggestion for the given product name.
    """
    api_url = f"http://127.0.0.1:8000/admin_panel/suggestion/{product_name}/"
    try:
        time.sleep(5)
        response = requests.get(api_url)
        if response.status_code == 200:
            data = response.json()  # Parse the JSON response
            suggestion = data.get('suggestion', {}).get('suggestion', None)
            return suggestion
        else:
            print(f"Failed to fetch data for {product_name}. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching suggestion for {product_name}: {e}")
        return None

def update_product_suggestions():
    """
    Function to loop through all products and update their suggestions.
    """
    # Fetch all products from the database
    products = Product.objects.all()

    for product in products:
        # Get the product name to pass to the API
        product_name = product.name  # Assuming the Product model has a 'name' field
        print(f"Fetching suggestion for {product_name}...")

        # Fetch the suggestion from the API
        suggestion = get_suggestion_from_api(product_name)

        if suggestion:
            # Update the product's suggestion field
            product.suggestion = suggestion
            product.save()
            print(f"Updated suggestion for {product_name}")
        else:
            print(f"No suggestion found for {product_name}")

if __name__ == "__main__":
    update_product_suggestions()
