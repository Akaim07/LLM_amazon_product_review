from django.urls import path
from . import views  # Import the views from your app

urlpatterns = [
    path('suggestion/<str:product_name>/', views.get_suggestion_view, name='get_suggestion'),
    path('api/merchant/<str:merchant_name>/', views.get_products_by_merchant, name='products_by_merchant'),
    path('api/product_details/<str:product_name>/', views.get_product_details_by_name, name='product_details'),
    path('api/merchants/', views.get_merchant_list, name='merchant_list'),
     path('api/product_names/', views.get_product_name_list, name='product_name_list'),
     path('api/products_with_ratings/', views.get_all_products_with_ratings, name='products_with_ratings'),
]