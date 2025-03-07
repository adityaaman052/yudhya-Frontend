"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import AnalysisResults from "@/components/AnalysisResults";

export default function Solution() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    setAnalysisData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/solution/analyze_scan",  // ✅ Uses env variable
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong!");
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-16">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Dental AI Assistant
      </h1>
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">
        <UploadForm onUpload={handleUpload} />
        
        {loading && (
          <p className="text-center text-gray-600 mt-4">Analyzing scan...</p>
        )}

        {error && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}

        {analysisData && <AnalysisResults data={analysisData} />}
      </div>
    </div>
  );
}
