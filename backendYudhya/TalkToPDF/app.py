import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime
from dotenv import load_dotenv
from rag import RAGSystem  # Ensure rag.py is in the same directory

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ✅ Ensure correct absolute path for uploads
UPLOAD_FOLDER = os.path.abspath('uploaded_documents')
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'doc', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure folder exists

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ✅ Upload Document API
@app.route('/api/upload_document', methods=['POST'])
def upload_document():
    """Handles document upload and initializes RAG processing"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], filename))  # Absolute path
            file.save(file_path)

            print(f"✅ File uploaded successfully: {file_path}")  # Debugging log

            # Initialize RAG system
            try:
                rag_system = RAGSystem(pdf_path=file_path)
                return jsonify({'success': True, 'message': 'File uploaded and processed', 'filename': filename})
            except Exception as e:
                return jsonify({'success': False, 'message': f'Error processing document: {str(e)}'}), 500
        
        return jsonify({'success': False, 'message': 'Invalid file type'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Upload failed: {str(e)}'}), 500


# ✅ Document Summarization API
@app.route('/api/summarize', methods=['POST'])
def summarize_document():
    """Summarizes an uploaded document"""
    try:
        data = request.get_json()
        filename = data.get("filename")

        print(f"📂 Received filename: {filename}")  # Debugging log

        if not filename:
            return jsonify({"error": "Filename is required"}), 400

        file_path = os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filename)))

        print(f"🔍 Checking file existence: {file_path}")  # Debugging log

        if not os.path.exists(file_path):
            print(f"❌ ERROR: File not found - {file_path}")
            return jsonify({"error": f"File not found: {filename}"}), 404

        # ✅ Ensure RAG system uses correct file path
        rag_system = RAGSystem(pdf_path=file_path)
        summary = rag_system.summarize()

        print(f"✅ Summary generated: {summary}")  # Debugging log

        return jsonify({"status": "success", "summary": summary})
    
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")  # Debugging log
        return jsonify({"error": str(e)}), 500


# ✅ List Uploaded Documents API
@app.route('/api/list_documents', methods=['GET'])
def list_documents():
    """Returns a list of uploaded documents"""
    try:
        documents = [
            {
                'filename': f,
                'uploaded_at': datetime.fromtimestamp(os.path.getctime(os.path.join(app.config['UPLOAD_FOLDER'], f))).isoformat()
            }
            for f in os.listdir(app.config['UPLOAD_FOLDER'])
        ]
        return jsonify({'success': True, 'documents': documents})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# ✅ Delete a Document API
@app.route('/api/delete_document/<filename>', methods=['DELETE'])
def delete_document(filename):
    """Deletes a document from the server"""
    try:
        file_path = os.path.abspath(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filename)))
        
        print(f"🗑 Attempting to delete file: {file_path}")  # Debugging log
        
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"✅ File deleted successfully: {file_path}")  # Debugging log
            return jsonify({'success': True, 'message': 'Document deleted'})
        
        print(f"❌ ERROR: Document not found - {file_path}")
        return jsonify({'success': False, 'message': 'Document not found'}), 404
    except Exception as e:
        print(f"❌ ERROR deleting document: {str(e)}")  # Debugging log
        return jsonify({'success': False, 'message': f'Error deleting document: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
