from flask import Blueprint, request, jsonify
from app.services.gemini_service import GeminiService
import logging
import os
import base64
import google.generativeai as genai
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load API key from .env
load_dotenv()
GOOGLE_API_KEY = os.getenv("AIzaSyDOF9luP3qyguwBhHIqwsbZeHdsNR1tKVY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is missing. Please check your .env file.")

# Configure Google AI API
genai.configure(api_key=GOOGLE_API_KEY)

# Define Blueprint
main = Blueprint("main", __name__)

gemini_service = GeminiService()

@main.route("/analyze_scan", methods=["POST"])
def analyze_scan():
    try:
        # Debug: Log API key usage
        print("Using API Key:", GOOGLE_API_KEY[:6] + "******")

        # Check if a file is uploaded
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Read and encode the image in Base64
        image_bytes = file.read()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        # Send image to Google Gemini API
        try:
            model = genai.GenerativeModel("gemini-pro-vision")
            response = model.generate_content([
                {"type": "image", "data": image_base64},
                {"type": "text", "data": "Analyze this dental X-ray and detect any abnormalities."}
            ])
        except Exception as ai_error:
            print("Error communicating with Gemini API:", str(ai_error))
            return jsonify({"error": "Failed to connect to Google AI API"}), 500

        # Process AI response
        if response and response.text:
            return jsonify({
                "status": "success",
                "message": "X-ray analyzed successfully",
                "analysis": response.text
            })
        else:
            return jsonify({"error": "AI did not return a valid response"}), 500

    except Exception as e:
        print("Server Error:", str(e))
        return jsonify({"error": str(e)}), 500
