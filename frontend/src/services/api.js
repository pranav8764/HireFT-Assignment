import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  timeout: 30000, // 30 second timeout for analysis requests
});

/**
 * Analyzes a job posting against a resume
 * @param {string} jobUrl - URL of the job posting
 * @param {File} resumeFile - PDF file of the resume
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeJob = async (jobUrl, resumeFile, signal = null) => {
  const formData = new FormData();
  formData.append('jobUrl', jobUrl);
  formData.append('resumeFile', resumeFile);

  try {
    const response = await api.post('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: signal, // Pass abort signal to axios
    });
    
    return response.data;
  } catch (error) {
    // Check if error was due to cancellation
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      const cancelError = new Error('Request cancelled');
      cancelError.name = 'AbortError';
      throw cancelError;
    }
    
    // Extract error message from response or use default
    const errorMessage = error.response?.data?.error?.message || 
                        error.message || 
                        'An error occurred during analysis';
    
    throw new Error(errorMessage);
  }
};

export default api;