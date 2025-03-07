import os
import json
import re
from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
from gemini_notes import GeminiNoteGenerator
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()
GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY")

if not GOOGLE_AI_API_KEY:
    raise ValueError("GOOGLE_AI_API_KEY is missing. Check your .env file.")

# ✅ Create Flask app and enable CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # ✅ Allow frontend to fetch data

# ✅ Create Blueprint for note-making API
note_making_bp = Blueprint("note_making", __name__)
CORS(note_making_bp)  # ✅ Enable CORS for the blueprint

def sanitize_topic(topic):
    """Converts topic into a valid filename (for reference storage)."""
    topic = topic.strip().lower()  # ✅ Convert to lowercase for consistency
    topic = re.sub(r'[^a-zA-Z0-9\s]', '', topic)  # ✅ Remove special characters
    topic = topic.replace(" ", "_")  # ✅ Convert spaces to underscores
    return topic

@note_making_bp.route("/save_note", methods=["POST"])
def save_note():
    """Saves structured notes using Gemini AI."""
    data = request.json
    topic = data.get("topic", "").strip()
    content = data.get("content", "").strip()

    if not topic or not content:
        return jsonify({"success": False, "message": "Topic and content are required."}), 400

    # ✅ Fetch structured notes from Gemini AI
    structured_notes = GeminiNoteGenerator.generate_notes(topic, content)

    return jsonify({
        "success": True,
        "message": "Note saved successfully.",
        "generated_notes": structured_notes  # ✅ Return structured notes from Gemini
    })

@note_making_bp.route("/get_notes", methods=["GET"])
def get_notes():
    """Fetches structured notes from Gemini API dynamically."""
    topic = request.args.get("topic", "").strip()
    print(f"🔍 Fetching notes dynamically from Gemini for topic: {topic}")

    if not topic:
        return jsonify({"success": False, "message": "Topic is required."}), 400

    structured_notes = GeminiNoteGenerator.generate_notes(topic, "")

    if structured_notes:
        print(f"✅ Successfully fetched notes for '{topic}' from Gemini AI.")
        return jsonify({"success": True, "notes": structured_notes})
    else:
        print(f"⚠️ No notes generated for '{topic}'.")
        return jsonify({"success": False, "message": f"No notes generated for '{topic}'."})

# ✅ Register Blueprint
app.register_blueprint(note_making_bp, url_prefix="/api/note-making")

# ✅ Run the server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
