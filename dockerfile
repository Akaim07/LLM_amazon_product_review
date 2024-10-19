FROM python:slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python" "-m" "uvicorn" "amazon_product_review.asgi:application"]

EXPOSE 8000