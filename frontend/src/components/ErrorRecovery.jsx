import React from 'react';
import { useComponentError } from '../contexts/ErrorContext';

/**
 * ErrorRecovery Component
 * Displays error messages with recovery options for specific components
 */
const ErrorRecovery = ({ 
  componentName, 
  onRetry, 
  onDismiss,
  showRetryButton = true,
  showDismissButton = true,
  className = ''
}) => {
  const { error, hasError, retryAttempts, retry, clearError } = useComponentError(componentName);

  if (!hasError) {
    return null;
  }

  const handleRetry = async () => {
    if (onRetry) {
      const success = await retry(onRetry, {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000
      });
      
      if (!success && error?.type === 'retry_exhausted') {
        // Show user-friendly message for exhausted retries
        console.warn(`Retry exhausted for ${componentName}`);
      }
    }
  };

  const handleDismiss = () => {
    clearError();
    if (onDismiss) {
      onDismiss();
    }
  };

  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'network':
        return '🌐';
      case 'timeout':
        return '⏱️';
      case 'validation':
        return '⚠️';
      case 'retry_exhausted':
        return '🔄';
      case 'server':
        return '🖥️';
      default:
        return '❌';
    }
  };

  const getErrorTitle = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'Network Error';
      case 'timeout':
        return 'Request Timeout';
      case 'validation':
        return 'Validation Error';
      case 'retry_exhausted':
        return 'Multiple Attempts Failed';
      case 'server':
        return 'Server Error';
      default:
        return 'Error';
    }
  };

  const getSuggestion = (errorType, message) => {
    switch (errorType) {
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'timeout':
        return 'The request took too long. Please try again.';
      case 'validation':
        return 'Please check your input and try again.';
      case 'retry_exhausted':
        return 'Multiple attempts have failed. Please try again later or contact support.';
      case 'server':
        return 'Our servers are experiencing issues. Please try again later.';
      default:
        if (message?.toLowerCase().includes('url')) {
          return 'Please check the URL format and try again.';
        }
        if (message?.toLowerCase().includes('file')) {
          return 'Please check the file and try again.';
        }
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const errorIcon = getErrorIcon(error.type);
  const errorTitle = getErrorTitle(error.type);
  const suggestion = getSuggestion(error.type, error.message);
  const canRetry = error.retryable && showRetryButton && onRetry;

  return (
    <div className={`error-recovery ${className}`}>
      <div className="error-content">
        <div className="error-header">
          <span className="error-icon" aria-hidden="true">{errorIcon}</span>
          <div className="error-text">
            <h4 className="error-title">{errorTitle}</h4>
            <p className="error-message">{error.message}</p>
            <p className="error-suggestion">{suggestion}</p>
          </div>
        </div>

        {error.context && (
          <div className="error-context">
            {error.context.attempts && (
              <div className="retry-info">
                Attempt {error.context.attempts} of {error.context.maxAttempts}
              </div>
            )}
            {error.context.nextRetryDelay && (
              <div className="retry-delay">
                Next retry in {Math.round(error.context.nextRetryDelay / 1000)} seconds
              </div>
            )}
          </div>
        )}

        <div className="error-actions">
          {canRetry && (
            <button 
              onClick={handleRetry}
              className="error-retry-btn"
              disabled={retryAttempts >= 3}
            >
              {retryAttempts > 0 ? `Retry (${retryAttempts}/3)` : 'Retry'}
            </button>
          )}
          
          {showDismissButton && (
            <button 
              onClick={handleDismiss}
              className="error-dismiss-btn"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * InlineError Component
 * Compact error display for inline use within components
 */
export const InlineError = ({ 
  componentName, 
  onRetry,
  showRetryButton = false,
  className = ''
}) => {
  const { error, hasError, clearError } = useComponentError(componentName);

  if (!hasError) {
    return null;
  }

  const handleRetry = () => {
    clearError();
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className={`inline-error ${className}`}>
      <span className="inline-error-icon">⚠️</span>
      <span className="inline-error-message">{error.message}</span>
      {showRetryButton && error.retryable && onRetry && (
        <button 
          onClick={handleRetry}
          className="inline-error-retry"
        >
          Retry
        </button>
      )}
    </div>
  );
};

/**
 * ErrorToast Component
 * Toast-style error notifications that auto-dismiss
 */
export const ErrorToast = ({ 
  componentName, 
  autoHide = true,
  hideDelay = 5000,
  onRetry,
  className = ''
}) => {
  const { error, hasError, clearError } = useComponentError(componentName);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (hasError) {
      setVisible(true);
      
      if (autoHide && error.type !== 'retry_exhausted') {
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(clearError, 300); // Allow fade out animation
        }, hideDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [hasError, autoHide, hideDelay, clearError, error?.type]);

  if (!hasError || !visible) {
    return null;
  }

  const handleRetry = () => {
    clearError();
    if (onRetry) {
      onRetry();
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(clearError, 300);
  };

  return (
    <div className={`error-toast ${visible ? 'visible' : ''} ${className}`}>
      <div className="toast-content">
        <span className="toast-icon">❌</span>
        <span className="toast-message">{error.message}</span>
        <div className="toast-actions">
          {error.retryable && onRetry && (
            <button onClick={handleRetry} className="toast-retry">
              Retry
            </button>
          )}
          <button onClick={handleClose} className="toast-close">
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorRecovery;