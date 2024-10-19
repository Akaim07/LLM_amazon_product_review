import os
import csv
import django

# Set the environment variable for Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "amazon_product_review.settings")  # Replace 'your_project' with your project name
# DJANGO_SETTINGS_MODULE=amazon_product_review.settings


django.setup()

from admin_panel.models import Product  # Replace 'your_app' with the actual app name

def import_csv(file_path):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            product, created = Product.objects.get_or_create(
                asin=row['asin'],
                defaults={
                    'name': row['name'],
                    'overall_rating': row['overall_rating'],
                    'review_count': row['review_count'],
                    'summary': row['summary'],
                    'merchant': row['merchant'],
                }
            )
            if created:
                print(f'Successfully added product {row["name"]}')
            else:
                print(f'Product {row["name"]} already exists')

if __name__ == "__main__":
    csv_file_path = "D:/Programming/Scrobits/LLM_amazon_product_review/admin_panel/dataset/amazon_vfl_reviews_tuned.csv"  # Adjust this path
    import_csv(csv_file_path)
