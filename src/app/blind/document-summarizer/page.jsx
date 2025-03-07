"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState("");

  // Handle document upload
  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setStatus("Uploading document...");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/upload_document", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setFile(selectedFile);
        setFilename(data.filename);
        setStatus("✅ Document uploaded successfully.");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setStatus(`❌ Upload failed: ${error.message}`);
    }
  };

  // Request document summary
  const getSummary = async () => {
    if (!filename) {
      setStatus("❌ Please upload a document first.");
      return;
    }

    setStatus("⏳ Generating summary...");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      const data = await response.json();

      if (data.status === "success") {
        setSummary(data.summary);
        setStatus("✅ Summary generated successfully.");
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      setStatus(`❌ Summary failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <Card className="max-w-3xl w-full bg-gray-800 text-gray-100 shadow-xl rounded-lg p-6">
        <CardContent className="flex flex-col items-center space-y-6">
          <label
            htmlFor="fileUpload"
            className="block text-lg font-semibold cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
          >
            📂 Upload Document
          </label>
          <input type="file" accept=".pdf,.doc,.docx,.txt" id="fileUpload" className="hidden" onChange={handleFileUpload} />

          <button
            onClick={getSummary}
            className="bg-green-500 px-6 py-3 rounded-lg text-white shadow-lg hover:bg-green-600 transition"
          >
            📑 Summarize Document
          </button>

          {status && <p className="text-yellow-400 text-center">{status}</p>}
          {summary && (
            <div className="bg-gray-700 p-4 rounded-lg w-full text-center">
              <h2 className="text-xl font-bold mb-2">📌 Summary:</h2>
              <p>{summary}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;