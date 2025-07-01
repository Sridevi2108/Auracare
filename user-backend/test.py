import requests

API_URL = "YOUR API URL"
HEADERS = {"Authorization": "Bearer hf_xxxxxxxxxx"}
PAYLOAD = {"inputs": "Hello, how are you?"}

response = requests.post(API_URL, json=PAYLOAD, headers=HEADERS)

print(response.json())
