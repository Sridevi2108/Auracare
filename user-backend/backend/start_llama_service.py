import requests, time

user_input = input("You: ")

# 🎭 CHOOSE YOUR VIBE:
# Uncomment ONE of the below:

# 🧑‍🤝‍🧑 Best Friend vibe
prompt = f"You're my best friend. I'm venting to you. Reply like someone who truly cares, casually and kindly:\n{user_input}"

# 🧘 Therapist vibe
# prompt = f"You’re a compassionate mental health therapist. Respond in a calm and validating tone:\n{user_input}"

start = time.time()

try:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "mistral",       # or "llama2:7b"
            "prompt": prompt,
            "stream": False,
            "temperature": 0.7,       # more creative / human
            "num_predict": 50
        },
        headers={"Content-Type": "application/json"},
        timeout=20
    )
    response.raise_for_status()
    reply = response.json().get("response", "").strip()
    print("✅ Bot reply:", reply)
except Exception as e:
    print("❌ Error:", e)

print("⏱️ Response time:", round(time.time() - start, 2), "seconds")
