interface AnalysisResponse {
  analysis: string;
}

interface ErrorResponse {
  error: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const analyzeScan = async (scanDescription: string): Promise<AnalysisResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scan_description: scanDescription }),
    });
    
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || 'Analysis failed');
    }
    
    const data: AnalysisResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing scan:', error);
    throw error instanceof Error ? error : new Error('Analysis failed');
  }
};

export const getTreatment = async (conditions: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/treatment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conditions }),
    });
    
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || 'Failed to get treatment suggestions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting treatment:', error);
    throw error instanceof Error ? error : new Error('Failed to get treatment suggestions');
  }
}; 