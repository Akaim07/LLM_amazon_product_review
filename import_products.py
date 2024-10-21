import os
import csv
import django

# Set the environment variable for Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "amazon_product_review.settings")  # Replace 'your_project' with your project name
# DJANGO_SETTINGS_MODULE=amazon_product_review.settings


django.setup()

# from amazon_product_review.models import AllProduct
from admin_panel.models import Product,AllProduct  # Replace 'your_app' with the actual app name

def empty_all_products():
    # Delete all entries from the AllProduct table
    AllProduct.objects.all().delete()
    print('All products have been deleted.')

def import_csv(file_path):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            AllProduct.objects.create(
                asin=row['asin'],
                name=row['name'],
                rating=row['rating'],
                review=row['review']
            )
            # if created:
            #     print(f'Successfully added product {row["name"]}')
            # else:
            #     print(f'Product {row["name"]} already exists')

if __name__ == "__main__":
    csv_file_path = "D:/Programming/Scrobits/LLM_amazon_product_review/admin_panel/dataset/amazon_vfl_reviews.csv"  # Adjust this path
    empty_all_products()
    import_csv(csv_file_path)
    