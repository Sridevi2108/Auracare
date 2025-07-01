from flask import Flask, request, jsonify
from llama_cpp import Llama

app = Flask(__name__)

# Load the Llama model (change path to your actual file)
MODEL_PATH = "llama-2-7b-chat.Q4_K_M.gguf"
llm = Llama(model_path=MODEL_PATH, n_ctx=2048)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # Generate response from Llama
    output = llm(prompt, max_tokens=150)
    response_text = output["choices"][0]["text"].strip()

    return jsonify({"response": response_text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
