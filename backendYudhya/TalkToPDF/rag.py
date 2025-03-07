import os
import PyPDF2
import docx

class RAGSystem:
    def __init__(self, pdf_path):
        self.pdf_path = os.path.abspath(pdf_path)
        print(f"📂 RAG System initialized with: {self.pdf_path}")  # Debugging log

    def summarize(self):
        """Extracts text from a document and provides a summary."""
        if not os.path.exists(self.pdf_path):
            print(f"❌ ERROR: File does not exist - {self.pdf_path}")
            return "Error: File not found."

        try:
            if self.pdf_path.endswith(".pdf"):
                text = self._extract_text_from_pdf()
            elif self.pdf_path.endswith(".docx"):
                text = self._extract_text_from_docx()
            elif self.pdf_path.endswith(".txt"):
                text = self._extract_text_from_txt()
            else:
                return "Unsupported file format."

            if not text.strip():
                return "No readable content found in the document."

            return self._generate_summary(text)

        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
            return f"Error processing document: {str(e)}"

    def _extract_text_from_pdf(self):
        """Extracts text from a PDF file."""
        text = ""
        with open(self.pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text.strip()

    def _extract_text_from_docx(self):
        """Extracts text from a DOCX file."""
        doc = docx.Document(self.pdf_path)
        return "\n".join([para.text for para in doc.paragraphs])

    def _extract_text_from_txt(self):
        """Extracts text from a TXT file."""
        with open(self.pdf_path, "r", encoding="utf-8") as file:
            return file.read()

    def _generate_summary(self, text):
        """Dummy summarization logic (Replace with actual AI model later)."""
        sentences = text.split(". ")
        summary = ". ".join(sentences[:3]) + ("..." if len(sentences) > 3 else "")
        return summary if summary else "Summary not generated."
