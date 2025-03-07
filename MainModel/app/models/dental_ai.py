import google.generativeai as genai
import base64
import os
from dotenv import load_dotenv

# Load API key
load_dotenv()
GOOGLE_API_KEY = os.getenv("AIzaSyDOF9luP3qyguwBhHIqwsbZeHdsNR1tKVY")

class DentalAIModel:
    def __init__(self):
        genai.configure(api_key=GOOGLE_API_KEY)
        self.model = genai.GenerativeModel("gemini-pro-vision")

    def analyze_image(self, image_path):
        """Analyze an X-ray using Google Gemini AI."""
        with open(image_path, "rb") as img:
            image_base64 = base64.b64encode(img.read()).decode("utf-8")

        # Request AI analysis
        response = self.model.generate_content([
            {"type": "image", "data": image_base64},
            {"type": "text", "data": "Analyze this dental X-ray and detect any abnormalities."}
        ])

        if response and response.text:
            return response.text
        else:
            return "Analysis failed. No response from AI."
