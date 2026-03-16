import React from 'react';
import { useComponentError } from '../contexts/ErrorContext';

/**
 * GracefulDegradation Component
 * Provides fallback displays when some analysis data is unavailable
 * while maintaining core functionality
 */
const GracefulDegradation = ({ 
  children, 
  fallback, 
  componentName,
  dataKey,
  data,
  loadingComponent = null,
  errorComponent = null,
  showPartialData = true
}) => {
  const { hasError } = useComponentError(componentName);

  // Check if data is available
  const hasData = data !== null && data !== undefined;
  const isPartialData = hasData && (
    Array.isArray(data) ? data.length === 0 : 
    typeof data === 'object' ? Object.keys(data).length === 0 : 
    false
  );

  // If there's an error and no data, show error component or fallback
  if (hasError && !hasData) {
    return errorComponent || fallback || (
      <div className="degradation-error">
        <div className="degradation-icon">⚠️</div>
        <div className="degradation-message">
          This section is temporarily unavailable
        </div>
      </div>
    );
  }

  // If data is loading, show loading component
  if (!hasData && loadingComponent) {
    return loadingComponent;
  }

  // If we have partial data and should show it
  if (isPartialData && showPartialData) {
    return (
      <div className="degradation-partial">
        <div className="degradation-notice">
          <span className="degradation-icon">ℹ️</span>
          <span className="degradation-text">
            Some information may be incomplete
          </span>
        </div>
        {children}
      </div>
    );
  }

  // If we have data, render children normally
  if (hasData) {
    return children;
  }

  // Default fallback
  return fallback || (
    <div className="degradation-fallback">
      <div className="degradation-icon">📊</div>
      <div className="degradation-message">
        Data not available
      </div>
    </div>
  );
};

/**
 * PartialDataWrapper Component
 * Wraps components that might have partial data and provides appropriate messaging
 */
export const PartialDataWrapper = ({ 
  children, 
  title,
  data,
  expectedFields = [],
  componentName,
  showMissingFields = false
}) => {
  const { hasError } = useComponentError(componentName);
  
  if (!data) {
    return (
      <div className="partial-data-wrapper unavailable">
        <div className="partial-header">
          <h4>{title}</h4>
          <span className="partial-status unavailable">Unavailable</span>
        </div>
        <div className="partial-content">
          <div className="partial-message">
            <span className="partial-icon">⏳</span>
            This information is currently being processed
          </div>
        </div>
      </div>
    );
  }

  // Check which expected fields are missing
  const missingFields = expectedFields.filter(field => 
    !data[field] || 
    (Array.isArray(data[field]) && data[field].length === 0)
  );
  
  const hasPartialData = missingFields.length > 0;
  const hasComponentError = hasError && missingFields.length === expectedFields.length;

  return (
    <div className={`partial-data-wrapper ${hasPartialData ? 'partial' : 'complete'} ${hasComponentError ? 'error' : ''}`}>
      <div className="partial-header">
        <h4>{title}</h4>
        {hasPartialData && (
          <span className="partial-status partial">
            {hasComponentError ? 'Error' : 'Partial'}
          </span>
        )}
        {!hasPartialData && (
          <span className="partial-status complete">Complete</span>
        )}
      </div>
      
      {hasPartialData && showMissingFields && (
        <div className="partial-notice">
          <span className="partial-icon">ℹ️</span>
          <span className="partial-text">
            Some information is missing: {missingFields.join(', ')}
          </span>
        </div>
      )}
      
      <div className="partial-content">
        {children}
      </div>
    </div>
  );
};

/**
 * LoadingFallback Component
 * Shows loading state for missing sections while maintaining layout
 */
export const LoadingFallback = ({ 
  title, 
  type = 'section',
  showSkeleton = true 
}) => {
  const skeletonLines = type === 'list' ? 3 : type === 'card' ? 4 : 2;
  
  return (
    <div className={`loading-fallback ${type}`}>
      {title && <div className="loading-title">{title}</div>}
      
      {showSkeleton ? (
        <div className="loading-skeleton">
          {Array.from({ length: skeletonLines }, (_, index) => (
            <div 
              key={index} 
              className="skeleton-line"
              style={{ 
                width: `${Math.random() * 40 + 60}%`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))}
        </div>
      ) : (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span className="loading-text">Loading...</span>
        </div>
      )}
    </div>
  );
};

/**
 * FeatureFallback Component
 * Provides fallback when entire features are unavailable
 */
export const FeatureFallback = ({ 
  featureName, 
  description,
  onRetry,
  showRetry = true,
  icon = '🔧'
}) => {
  return (
    <div className="feature-fallback">
      <div className="feature-fallback-content">
        <div className="feature-icon">{icon}</div>
        <h4 className="feature-title">{featureName} Unavailable</h4>
        <p className="feature-description">
          {description || `The ${featureName} feature is temporarily unavailable.`}
        </p>
        <p className="feature-message">
          Core functionality remains available. This feature will be restored automatically.
        </p>
        
        {showRetry && onRetry && (
          <button 
            onClick={onRetry}
            className="feature-retry-btn"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * DataSection Component
 * Wrapper for data sections with built-in graceful degradation
 */
export const DataSection = ({ 
  title,
  data,
  children,
  componentName,
  loadingComponent,
  errorComponent,
  emptyComponent,
  showPartialNotice = true
}) => {
  const { hasError } = useComponentError(componentName);
  
  // Determine data state
  const isLoading = data === undefined;
  const isEmpty = data === null || 
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === 'object' && data && Object.keys(data).length === 0);
  const hasData = !isLoading && !isEmpty;
  const hasPartialData = hasData && showPartialNotice;

  return (
    <div className="data-section">
      {title && <h3 className="data-section-title">{title}</h3>}
      
      <GracefulDegradation
        componentName={componentName}
        data={data}
        loadingComponent={loadingComponent || <LoadingFallback title={title} />}
        errorComponent={errorComponent}
        fallback={emptyComponent}
        showPartialData={hasPartialData}
      >
        {children}
      </GracefulDegradation>
    </div>
  );
};

export { GracefulDegradation };
export default GracefulDegradation;