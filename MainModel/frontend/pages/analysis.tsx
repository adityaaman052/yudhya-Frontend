import { useState } from 'react';
import { analyzeScan, getTreatment } from '../services/api';

// Define types for the analysis response
interface Analysis {
  analysis: string;
}

export default function Analysis() {
  const [scanDescription, setScanDescription] = useState<string>('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      
      if (!scanDescription.trim()) {
        throw new Error('Please enter a scan description');
      }

      const result = await analyzeScan(scanDescription);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Dental Scan Analysis</h1>
      
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded-md min-h-[150px]"
          value={scanDescription}
          onChange={(e) => setScanDescription(e.target.value)}
          placeholder="Enter scan description..."
          disabled={loading}
        />
      </div>

      <button 
        className={`px-4 py-2 rounded-md ${
          loading 
            ? 'bg-gray-400' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
        onClick={handleAnalysis}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Scan'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {analysis && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
          <div className="p-4 bg-gray-50 rounded-md">
            <pre className="whitespace-pre-wrap">{JSON.stringify(analysis, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 