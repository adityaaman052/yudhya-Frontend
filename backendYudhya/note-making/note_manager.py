import os
import json

class NoteManager:
    def __init__(self, notes_folder):
        self.notes_folder = notes_folder

    def normalize_topic(self, topic):
        """Converts topic name into a valid folder name."""
        return topic.strip().replace(" ", "_").replace(".", "").lower()

    def save_note(self, topic, content):
        """Saves a structured note under a specific topic."""
        topic = self.normalize_topic(topic)
        topic_folder = os.path.join(self.notes_folder, topic)
        os.makedirs(topic_folder, exist_ok=True)

        filename = f"{len(os.listdir(topic_folder)) + 1}.json"
        filepath = os.path.join(topic_folder, filename)

        note_data = {"structured_notes": content}

        with open(filepath, "w", encoding="utf-8") as file:
            json.dump(note_data, file, indent=4)

        return filename

    def get_notes(self, topic):
        """Retrieves all structured notes for a specific topic."""
        topic = self.normalize_topic(topic)
        topic_folder = os.path.join(self.notes_folder, topic)

        if not os.path.exists(topic_folder):
            return None

        notes = []
        for file in os.listdir(topic_folder):
            with open(os.path.join(topic_folder, file), "r", encoding="utf-8") as f:
                note_data = json.load(f)
                notes.append(note_data["structured_notes"])

        return notes
