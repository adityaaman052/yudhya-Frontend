"use client";

import { useState } from "react";

export default function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) onUpload(file);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <label className="block text-gray-700 font-semibold mb-2">Upload Dental X-ray</label>
      <input
        type="file"
        className="border p-2 w-full rounded-md"
        accept=".png,.jpg,.jpeg,.dcm"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
        Analyze Scan
      </button>
    </form>
  );
}
