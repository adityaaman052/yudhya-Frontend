import os
import google.generativeai as genai
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()
GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY")

# ✅ Configure Gemini AI
genai.configure(api_key=GOOGLE_AI_API_KEY)

class GeminiNoteGenerator:
    @staticmethod
    def generate_notes(topic, content):
        """
        Generates structured notes using Gemini AI.
        """
        prompt = f"""
        Generate well-structured, easy-to-read notes for the topic: {topic}.
        The notes should be educational, summarized, and formatted with key points.
        Use bullet points and make it concise but informative.
        Content: {content if content else 'General knowledge about this topic'}
        """

        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)

            if response.text:
                return response.text
            else:
                return "⚠️ Failed to generate notes."
        except Exception as e:
            return f"❌ Error: {str(e)}"
