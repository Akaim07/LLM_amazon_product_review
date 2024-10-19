import os,json
import google.generativeai as genai
import dotenv
from .models import Product
# import django

dotenv.load_dotenv()

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "amazon_product_review.settings")
# django.setup()

class GeminiGenerator:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])

    # Create the model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 2024,
        "response_mime_type": "application/json",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
        system_instruction="You are a product expert, who get the overall review and summary and give suggestion from it for the product",)
    
    chat = model.start_chat(
        history=[]
    )

    @classmethod
    def ask_gemini(cls, prompt): 
        response = cls.chat.send_message(prompt)
        print(response.text)
        return json.loads(response.text)
    
    @classmethod
    def get_suggestion(cls, product):
        product_details  = cls.get_product_details_by_name(product)
        if product_details:
            product_id = product_details['asin']
            name = product_details['name']
            rating = product_details['overall_rating']
            people = product_details['review_count']
            summary = product_details['summary']
            
            prompt = f"""Product ID: {product_id},
                    Name: {name},
                    Average Ratings: {rating},
                    Review : {summary}
                    Merchant: {product_details['merchant']}
                    JJust give a suggestion based on review for this product,I need recommandation from you to improve product up to 50 words. don't self reference yourself, give in json format."""
            print(prompt)
            return GeminiGenerator.ask_gemini(prompt)
        return "Product Not Valid"
    
    def get_product_details_by_name(product_name):
        product = Product.objects.filter(name=product_name).first()  
        
        if product:
            asin = product.asin
            name = product.name
            overall_rating = product.overall_rating
            review_count = product.review_count
            summary = product.summary
            merchant = product.merchant
            
            return {
                'asin': asin,
                'name': name,
                'overall_rating': overall_rating,
                'review_count': review_count,
                'summary': summary,
                'merchant': merchant,
            }
        else:
            return None  # If no product was found
    
if __name__=='__main__':
    print(GeminiGenerator.get_suggestion(product="Mamaearth-Onion-Growth-Control-Redensyl"))

    
