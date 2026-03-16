import React, { createContext, useContext, useState, useCallback } from 'react';

const ErrorContext = createContext();

/**
 * Error Context Provider
 * Provides centralized error handling and recovery mechanisms across the application
 */
export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState({});
  const [retryAttempts, setRetryAttempts] = useState({});

  /**
   * Add an error for a specific component
   * @param {string} component - Component identifier
   * @param {string|Error} error - Error message or Error object
   * @param {Object} options - Additional error options
   */
  const addError = useCallback((component, error, options = {}) => {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorData = {
      message: errorMessage,
      timestamp: new Date().toISOString(),
      type: options.type || 'error',
      retryable: options.retryable !== false, // Default to retryable
      context: options.context || null,
      originalError: error instanceof Error ? error : null
    };

    setErrors(prev => ({
      ...prev,
      [component]: errorData
    }));
  }, []);

  /**
   * Clear error for a specific component
   * @param {string} component - Component identifier
   */
  const clearError = useCallback((component) => {
    setErrors(prev => {
      const { [component]: removed, ...rest } = prev;
      return rest;
    });
    
    // Also clear retry attempts for this component
    setRetryAttempts(prev => {
      const { [component]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
    setRetryAttempts({});
  }, []);

  /**
   * Get error for a specific component
   * @param {string} component - Component identifier
   * @returns {Object|null} Error data or null if no error
   */
  const getError = useCallback((component) => {
    return errors[component] || null;
  }, [errors]);

  /**
   * Check if a component has an error
   * @param {string} component - Component identifier
   * @returns {boolean} True if component has an error
   */
  const hasError = useCallback((component) => {
    return Boolean(errors[component]);
  }, [errors]);

  /**
   * Retry mechanism with exponential backoff
   * @param {string} component - Component identifier
   * @param {Function} retryFunction - Function to retry
   * @param {Object} options - Retry options
   */
  const retry = useCallback(async (component, retryFunction, options = {}) => {
    const maxAttempts = options.maxAttempts || 3;
    const baseDelay = options.baseDelay || 1000; // 1 second
    const maxDelay = options.maxDelay || 10000; // 10 seconds
    
    const currentAttempts = retryAttempts[component] || 0;
    
    if (currentAttempts >= maxAttempts) {
      addError(component, 'Maximum retry attempts exceeded', {
        type: 'retry_exhausted',
        retryable: false,
        context: { attempts: currentAttempts, maxAttempts }
      });
      return false;
    }

    // Clear existing error before retry
    clearError(component);
    
    // Update retry attempts
    setRetryAttempts(prev => ({
      ...prev,
      [component]: currentAttempts + 1
    }));

    try {
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, currentAttempts), maxDelay);
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const result = await retryFunction();
      
      // Success - clear retry attempts
      setRetryAttempts(prev => {
        const { [component]: removed, ...rest } = prev;
        return rest;
      });
      
      return result;
    } catch (error) {
      // Determine if error is retryable
      const isRetryable = isRetryableError(error);
      
      addError(component, error, {
        type: 'retry_failed',
        retryable: isRetryable && (currentAttempts + 1) < maxAttempts,
        context: { 
          attempt: currentAttempts + 1, 
          maxAttempts,
          nextRetryDelay: Math.min(baseDelay * Math.pow(2, currentAttempts + 1), maxDelay)
        }
      });
      
      return false;
    }
  }, [retryAttempts, addError, clearError]);

  /**
   * Get retry attempts for a component
   * @param {string} component - Component identifier
   * @returns {number} Number of retry attempts
   */
  const getRetryAttempts = useCallback((component) => {
    return retryAttempts[component] || 0;
  }, [retryAttempts]);

  /**
   * Check if an error is retryable based on error type
   * @param {Error|string} error - Error to check
   * @returns {boolean} True if error is retryable
   */
  const isRetryableError = useCallback((error) => {
    if (typeof error === 'string') {
      return !error.toLowerCase().includes('validation') && 
             !error.toLowerCase().includes('invalid') &&
             !error.toLowerCase().includes('unauthorized');
    }
    
    if (error instanceof Error) {
      // Network errors are generally retryable
      if (error.name === 'NetworkError' || 
          error.name === 'TimeoutError' ||
          error.message?.includes('timeout') ||
          error.message?.includes('network') ||
          error.message?.includes('fetch')) {
        return true;
      }
      
      // Abort errors are not retryable
      if (error.name === 'AbortError' || error.message?.includes('cancel')) {
        return false;
      }
      
      // Server errors (5xx) are retryable, client errors (4xx) are not
      if (error.response?.status) {
        return error.response.status >= 500;
      }
    }
    
    return true; // Default to retryable
  }, []);

  const value = {
    errors,
    addError,
    clearError,
    clearAllErrors,
    getError,
    hasError,
    retry,
    getRetryAttempts,
    isRetryableError
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

/**
 * Hook to use error context
 * @returns {Object} Error context methods and state
 */
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

/**
 * Hook for component-specific error handling
 * @param {string} componentName - Name of the component
 * @returns {Object} Component-specific error methods
 */
export const useComponentError = (componentName) => {
  const { addError, clearError, getError, hasError, retry, getRetryAttempts } = useError();
  
  return {
    error: getError(componentName),
    hasError: hasError(componentName),
    retryAttempts: getRetryAttempts(componentName),
    addError: (error, options) => addError(componentName, error, options),
    clearError: () => clearError(componentName),
    retry: (retryFunction, options) => retry(componentName, retryFunction, options)
  };
};

export default ErrorContext;