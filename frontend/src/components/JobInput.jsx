import React, { useState, useEffect, useRef } from 'react';
import useDebounce from '../hooks/useDebounce';
import { useLoading } from '../contexts/LoadingContext';
import { useComponentError } from '../contexts/ErrorContext';
import { InlineError } from './ErrorRecovery';

const JobInput = ({ onUrlSubmit, onAutoProcess, loading = false, disabled = false }) => {
  const [jobUrl, setJobUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState(null);
  const [lastProcessedUrl, setLastProcessedUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const abortControllerRef = useRef(null);
  const inputRef = useRef(null);
  
  // Use loading context for centralized state management
  const { loadingStates, setLoading } = useLoading();
  
  // Use error context for enhanced error handling
  const { addError, clearError, hasError, retry } = useComponentError('JobInput');
  
  // Debounce the URL value for auto-processing
  const debouncedUrl = useDebounce(jobUrl, 500);

  const validateUrl = (url) => {
    if (!url || !url.trim()) {
      return { isValid: false, error: 'Please enter a job posting URL' };
    }
    
    try {
      new URL(url);
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return { isValid: false, error: 'Please enter a valid URL (must start with http:// or https://)' };
      }
      return { isValid: true, error: null };
    } catch {
      return { isValid: false, error: 'URL format is not recognized' };
    }
  };

  const triggerAutoProcess = async (url, type) => {
    if (!onAutoProcess || !url || url === lastProcessedUrl) return;
    
    const validation = validateUrl(url);
    if (!validation.isValid) {
      setUrlError(validation.error);
      addError(validation.error, { 
        type: 'validation', 
        retryable: false,
        context: { url, validationType: type }
      });
      return;
    }

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    setIsProcessing(true);
    setProcessingType(type);
    setUrlError('');
    setSuccessMessage('');
    clearError(); // Clear any previous errors
    
    // Update loading context
    setLoading('urlProcessing', true, 'JobInput');
    
    try {
      await onAutoProcess(url.trim(), abortControllerRef.current.signal);
      setLastProcessedUrl(url.trim());
      setSuccessMessage('URL processed successfully');
    } catch (error) {
      let errorType = 'error';
      let retryable = true;
      
      // Check if error was due to cancellation
      if (error.name === 'AbortError' || error.message?.includes('cancel')) {
        setUrlError('Processing cancelled');
        errorType = 'cancelled';
        retryable = false;
      } else if (error.message?.includes('timeout')) {
        setUrlError('Request timed out - please try again');
        errorType = 'timeout';
      } else if (error.message?.includes('network')) {
        setUrlError('Network error - please check your connection');
        errorType = 'network';
      } else {
        setUrlError(error.message || 'Unable to process URL - please try again later');
        errorType = 'processing';
      }
      
      addError(error.message || 'Unable to process URL', {
        type: errorType,
        retryable,
        context: { url, processingType: type }
      });
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
      setLoading('urlProcessing', false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
      setProcessingType(null);
      setLoading('urlProcessing', false);
      setUrlError('Processing cancelled by user');
      addError('Processing cancelled by user', { 
        type: 'cancelled', 
        retryable: false 
      });
      abortControllerRef.current = null;
    }
  };

  // Retry function for error recovery
  const retryProcessing = async () => {
    if (jobUrl) {
      await triggerAutoProcess(jobUrl, 'retry');
    }
  };

  // Auto-process on debounced URL change (for typing)
  useEffect(() => {
    if (debouncedUrl && debouncedUrl !== lastProcessedUrl && debouncedUrl !== jobUrl) {
      // Only auto-process if the debounced value is different from current input
      // This prevents processing while user is still typing
      triggerAutoProcess(debouncedUrl, 'debounce');
    }
  }, [debouncedUrl]);

  const handleUrlChange = (event) => {
    const url = event.target.value;
    setJobUrl(url);
    
    // Clear error and success messages when user starts typing
    if (urlError) {
      setUrlError('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
    // Clear context errors when user starts typing
    clearError();
  };

  const handlePaste = async (event) => {
    // Get pasted content
    const pastedText = event.clipboardData.getData('text');
    
    // Update the input value immediately
    setJobUrl(pastedText);
    
    // Clear any existing errors
    setUrlError('');
    
    // Trigger immediate auto-processing for paste
    if (pastedText.trim()) {
      await triggerAutoProcess(pastedText, 'paste');
    }
  };

  const handleBlur = async () => {
    // Trigger immediate auto-processing on blur if URL is valid and different
    if (jobUrl.trim() && jobUrl !== lastProcessedUrl) {
      await triggerAutoProcess(jobUrl, 'blur');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const validation = validateUrl(jobUrl);
    if (!validation.isValid) {
      setUrlError(validation.error);
      return;
    }

    setUrlError('');
    onUrlSubmit(jobUrl.trim());
  };

  const isInputDisabled = disabled || loading || isProcessing;
  const showLoadingIndicator = loading || isProcessing;

  return (
    <div className="job-input">
      <h3 id="job-input-label">Job Posting URL</h3>
      <div className="input-group">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            id="job-url-input"
            type="url"
            value={jobUrl}
            onChange={handleUrlChange}
            onPaste={handlePaste}
            onBlur={handleBlur}
            placeholder="https://example.com/job-posting"
            className={`url-input ${urlError ? 'error' : ''} ${showLoadingIndicator ? 'loading' : ''}`}
            disabled={isInputDisabled}
            aria-labelledby="job-input-label"
            aria-describedby={urlError ? 'url-error' : successMessage ? 'url-success' : 'url-hint'}
            aria-invalid={Boolean(urlError)}
            aria-busy={showLoadingIndicator}
            autoComplete="url"
          />
          <span id="url-hint" className="sr-only">
            Paste or type a job posting URL. Processing will start automatically.
          </span>
          {showLoadingIndicator && (
            <div className="input-loading-indicator" aria-hidden="true">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        {processingType && (
          <div className="processing-feedback" role="status" aria-live="polite">
            {processingType === 'paste' && 'Processing pasted URL...'}
            {processingType === 'blur' && 'Validating URL...'}
            {processingType === 'debounce' && 'Auto-processing URL...'}
          </div>
        )}
        {isProcessing && (
          <button 
            onClick={handleCancel} 
            className="cancel-btn"
            aria-label="Cancel URL processing"
          >
            Cancel
          </button>
        )}
      </div>
      {urlError && !hasError && (
        <div id="url-error" className="error-message" role="alert" aria-live="assertive">
          {urlError}
        </div>
      )}
      {hasError && (
        <InlineError 
          componentName="JobInput" 
          onRetry={retryProcessing}
          showRetryButton={!isProcessing && !loading}
        />
      )}
      {successMessage && !urlError && !isProcessing && !hasError && (
        <div id="url-success" className="success-message" role="status" aria-live="polite">
          ✅ {successMessage}
        </div>
      )}
    </div>
  );
};

export default JobInput;