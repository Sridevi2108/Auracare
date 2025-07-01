import requests

API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"
HEADERS = {"Authorization": "Bearer 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"}
PAYLOAD = {"inputs": "Hello, how are you?"}

response = requests.post(API_URL, json=PAYLOAD, headers=HEADERS)

print(response.json())
