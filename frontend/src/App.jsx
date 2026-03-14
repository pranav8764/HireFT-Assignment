import React, { useState } from 'react';
import JobInput from './components/JobInput';
import ResumeUpload from './components/ResumeUpload';
import Results from './components/Results';
import { analyzeJob } from './services/api';

function App() {
  const [jobUrl, setJobUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUrlSubmit = (url) => {
    setJobUrl(url);
    setError(''); // Clear any previous errors
  };

  const handleFileSelect = (file) => {
    setResumeFile(file);
    setError(''); // Clear any previous errors
  };

  const handleAnalyze = async () => {
    if (!jobUrl || !resumeFile) {
      setError('Please provide both a job URL and resume file');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisData(null);

    try {
      const result = await analyzeJob(jobUrl, resumeFile);
      
      if (result.success) {
        setAnalysisData(result.data);
      } else {
        setError(result.error?.message || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = Boolean(jobUrl && resumeFile && !loading);
  
  console.log('Current state - Job URL:', jobUrl, 'Resume File:', resumeFile);
  
  console.log('Can analyze:', canAnalyze);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Job Match Analyzer</h1>
        <p className="app-description">
          Compare your resume against job requirements and get AI-powered suggestions for improvement
        </p>
      </header>

      <main className="app-main">
        {!analysisData ? (
          <div className="input-section">
            <div className="input-container">
              <JobInput onUrlSubmit={handleUrlSubmit} />
              <ResumeUpload onFileSelect={handleFileSelect} />
              
              <div className="analyze-section">
                <button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  
                  className={`analyze-btn ${canAnalyze ? 'enabled' : 'disabled'}`}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Match'
                  )}
                </button>
                
                {jobUrl && resumeFile && (
                  <div className="ready-indicator">
                    ✅ Ready to analyze
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="error-container">
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="results-section">
            <Results analysisData={analysisData} />
            
            <div className="new-analysis">
              <button
                onClick={() => {
                  setAnalysisData(null);
                  setJobUrl('');
                  setResumeFile(null);
                  setError('');
                }}
                className="new-analysis-btn"
              >
                Start New Analysis
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by AI • Built with React</p>
      </footer>
    </div>
  );
}

export default App;