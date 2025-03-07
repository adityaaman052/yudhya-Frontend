from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get API key from .env
API_KEY = os.getenv("GOOGLE_AI_API_KEY")

if not API_KEY:
    raise ValueError("GOOGLE_AI_API_KEY is missing in the .env file")

# Configure the Gemini API
genai.configure(api_key=API_KEY)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"error": "Empty message"}), 400

    try:
        # Use the free-tier Gemini model
        model = genai.GenerativeModel("gemini-1.5-flash")  
        response = model.generate_content(user_input)

        return jsonify({"response": response.text})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Runs on port 5000
