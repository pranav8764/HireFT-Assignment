import { useState, useRef } from 'react';
import JobInput from './components/JobInput';
import ResumeUpload from './components/ResumeUpload';
import Results from './components/Results';
import ErrorRecovery from './components/ErrorRecovery';
import { analyzeJob } from './services/api';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { ErrorProvider, useComponentError } from './contexts/ErrorContext';

function AppContent() {
  const [jobUrl, setJobUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const resumeFileRef = useRef(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Use error context for centralized error handling
  const { addError, clearError, hasError } = useComponentError('App');
  
  // Use loading context to sync analysis loading state
  const { setLoading: setLoadingContext } = useLoading();

  const handleUrlSubmit = (url) => {
    setJobUrl(url);
    setError(''); // Clear any previous errors
    clearError(); // Clear context errors
  };

  const handleAutoProcess = async (url, signal = null) => {
    setJobUrl(url);
    setError('');
    clearError();
    
    // If we have both URL and resume, trigger analysis automatically
    const currentFile = resumeFile || resumeFileRef.current;
    if (url && currentFile) {
      await handleAnalyze(url, currentFile, signal);
    }
  };

  const handleFileSelect = (file) => {
    setResumeFile(file);
    resumeFileRef.current = file;
    setError('');
    clearError();
  };

  const handleAnalyze = async (urlOverride = null, fileOverride = null, signal = null) => {
    const currentUrl = urlOverride || jobUrl;
    const currentFile = fileOverride || resumeFile || resumeFileRef.current;
    
    if (!currentUrl || !currentFile) {
      const errorMsg = 'Please provide both a job URL and resume file';
      setError(errorMsg);
      addError(errorMsg, { type: 'validation', retryable: false });
      return;
    }

    setLoading(true);
    setError('');
    clearError();
    setAnalysisData(null);
    setLoadingContext('analysis', true, 'App');

    try {
      const result = await analyzeJob(currentUrl, currentFile, signal);
      
      if (result.success) {
        setAnalysisData(result.data);
      } else {
        const errorMsg = result.error?.message || 'Analysis failed';
        setError(errorMsg);
        addError(errorMsg, { 
          type: 'server', 
          retryable: true,
          context: { url: currentUrl, hasFile: Boolean(currentFile) }
        });
      }
    } catch (err) {
      let errorMsg;
      let errorType = 'error';
      let retryable = true;
      
      // Check if error was due to cancellation
      if (err.name === 'AbortError' || err.message?.includes('cancel')) {
        errorMsg = 'Analysis cancelled';
        errorType = 'cancelled';
        retryable = false;
      } else if (err.message?.includes('timeout')) {
        errorMsg = 'Request timed out - please try again';
        errorType = 'timeout';
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMsg = 'Network error - please check your connection';
        errorType = 'network';
      } else {
        errorMsg = err.message || 'An error occurred during analysis';
      }
      
      setError(errorMsg);
      addError(errorMsg, { 
        type: errorType, 
        retryable,
        context: { url: currentUrl, hasFile: Boolean(currentFile) }
      });
    } finally {
      setLoading(false);
      setLoadingContext('analysis', false);
    }
  };

  // Retry function for error recovery
  const retryAnalysis = async () => {
    await handleAnalyze();
  };

  const canAnalyze = Boolean(jobUrl && resumeFile && !loading);

  // Build status message for screen reader announcements
  const statusMessage = loading
    ? 'Analyzing your resume against the job posting, please wait.'
    : error
    ? `Error: ${error}`
    : analysisData
    ? 'Analysis complete. Results are now available.'
    : '';

  return (
    <div className="app">
      {/* Screen reader live region for status announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>

      <header className="app-header">
        <h1>🎯 Job Match Analyzer</h1>
        <p className="app-description">
          Compare your resume against job requirements and get AI-powered suggestions for improvement
        </p>
      </header>

      <main className="app-main" aria-busy={loading} aria-label="Job Match Analyzer application">
        {!analysisData ? (
          <div className="input-section">
            <div className="input-container">
              <JobInput 
                onUrlSubmit={handleUrlSubmit} 
                onAutoProcess={handleAutoProcess}
                loading={loading}
                disabled={loading}
              />
              <ResumeUpload onFileSelect={handleFileSelect} />
              
              <div className="analyze-section">
                <button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className={`analyze-btn ${canAnalyze ? 'enabled' : 'disabled'}`}
                  aria-label={loading ? 'Analyzing, please wait' : 'Analyze resume match'}
                  aria-disabled={!canAnalyze}
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

            {/* Enhanced error display with recovery options */}
            {(error || hasError) && (
              <div className="error-container">
                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}
                <ErrorRecovery
                  componentName="App"
                  onRetry={retryAnalysis}
                  onDismiss={() => {
                    setError('');
                    clearError();
                  }}
                  showRetryButton={canAnalyze}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="results-section" aria-label="Analysis results">
            <Results 
              analysisData={analysisData} 
              showDetailedFactors={true}
            />
            
            <div className="new-analysis">
              <button
                onClick={() => {
                  setAnalysisData(null);
                  setJobUrl('');
                  setResumeFile(null);
                  setError('');
                  clearError();
                }}
                className="new-analysis-btn"
                aria-label="Start a new job match analysis"
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

function App() {
  return (
    <ErrorProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </ErrorProvider>
  );
}

export default App;