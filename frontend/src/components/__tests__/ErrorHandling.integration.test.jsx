import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach } from 'vitest';
import React, { useEffect } from 'react';
import { ErrorProvider, useComponentError } from '../../contexts/ErrorContext';
import ErrorRecovery from '../ErrorRecovery';
import { GracefulDegradation, DataSection, LoadingFallback } from '../GracefulDegradation';

// Test component that uses error context
const TestComponent = ({ componentName, shouldError = false }) => {
  const { addError, hasError, clearError } = useComponentError(componentName);
  
  const handleTriggerError = () => {
    addError('Test error message', { 
      type: 'network', 
      retryable: true,
      context: { test: true }
    });
  };

  const handleClearError = () => {
    clearError();
  };

  useEffect(() => {
    if (shouldError) {
      addError('Auto error', { type: 'validation', retryable: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldError]);

  return (
    <div>
      <button onClick={handleTriggerError}>Trigger Error</button>
      <button onClick={handleClearError}>Clear Error</button>
      {hasError && <div data-testid="error-indicator">Has Error</div>}
    </div>
  );
};

describe('Error Handling Integration Tests', () => {
  const renderWithErrorProvider = (component) => {
    return render(
      <ErrorProvider>
        {component}
      </ErrorProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ErrorContext', () => {
    test('should manage component-specific errors', async () => {
      const user = userEvent.setup();
      
      renderWithErrorProvider(
        <TestComponent componentName="TestComponent" />
      );

      // Initially no error
      expect(screen.queryByTestId('error-indicator')).not.toBeInTheDocument();

      // Trigger error
      const triggerButton = screen.getByText('Trigger Error');
      await user.click(triggerButton);

      // Should show error
      expect(screen.getByTestId('error-indicator')).toBeInTheDocument();

      // Clear error
      const clearButton = screen.getByText('Clear Error');
      await user.click(clearButton);

      // Should clear error
      expect(screen.queryByTestId('error-indicator')).not.toBeInTheDocument();
    });

    test('should handle multiple components independently', async () => {
      const user = userEvent.setup();
      
      renderWithErrorProvider(
        <div>
          <TestComponent componentName="Component1" />
          <TestComponent componentName="Component2" />
        </div>
      );

      const triggerButtons = screen.getAllByText('Trigger Error');
      
      // Trigger error in first component
      await user.click(triggerButtons[0]);
      
      const errorIndicators = screen.getAllByTestId('error-indicator');
      expect(errorIndicators).toHaveLength(1);
    });
  });

  describe('ErrorRecovery Component', () => {
    test('should display error recovery UI', async () => {
      const mockRetry = vi.fn();
      const mockDismiss = vi.fn();
      
      renderWithErrorProvider(
        <div>
          <TestComponent componentName="TestComponent" shouldError={true} />
          <ErrorRecovery
            componentName="TestComponent"
            onRetry={mockRetry}
            onDismiss={mockDismiss}
          />
        </div>
      );

      // Should show error recovery UI
      expect(screen.getByText('Validation Error')).toBeInTheDocument();
      expect(screen.getByText('Auto error')).toBeInTheDocument();
      
      // Should show dismiss button but not retry (not retryable)
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
      expect(screen.queryByText('Retry')).not.toBeInTheDocument();
    });

    test('should handle retry functionality', async () => {
      const user = userEvent.setup();
      const mockRetry = vi.fn().mockResolvedValue(true);
      
      renderWithErrorProvider(
        <div>
          <TestComponent componentName="TestComponent" />
          <ErrorRecovery
            componentName="TestComponent"
            onRetry={mockRetry}
          />
        </div>
      );

      // Trigger a retryable error
      const triggerButton = screen.getByText('Trigger Error');
      await user.click(triggerButton);

      // Should show retry button
      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      // Click retry - the component calls retry(onRetry) internally
      const retryButton = screen.getByText('Retry');
      await user.click(retryButton);

      // mockRetry is called via the context retry wrapper
      await waitFor(() => {
        expect(mockRetry).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('GracefulDegradation Component', () => {
    test('should show fallback when no data', () => {
      renderWithErrorProvider(
        <GracefulDegradation
          componentName="TestComponent"
          data={null}
          fallback={<div>No data available</div>}
        >
          <div>Content</div>
        </GracefulDegradation>
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    test('should show content when data is available', () => {
      renderWithErrorProvider(
        <GracefulDegradation
          componentName="TestComponent"
          data={{ test: 'data' }}
        >
          <div>Content</div>
        </GracefulDegradation>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('should show loading component when data is undefined', () => {
      renderWithErrorProvider(
        <GracefulDegradation
          componentName="TestComponent"
          data={undefined}
          loadingComponent={<LoadingFallback title="Loading Test" showSkeleton={false} />}
        >
          <div>Content</div>
        </GracefulDegradation>
      );

      expect(screen.getByText('Loading Test')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('DataSection Component', () => {
    test('should handle different data states', () => {
      const { rerender } = renderWithErrorProvider(
        <DataSection
          title="Test Section"
          data={undefined}
          componentName="TestSection"
        >
          <div>Section Content</div>
        </DataSection>
      );

      // Loading state - title appears in both section header and loading fallback
      expect(screen.getAllByText('Test Section').length).toBeGreaterThanOrEqual(1);
      // Loading skeleton is shown by default (no "Loading..." text)

      // Data available
      rerender(
        <ErrorProvider>
          <DataSection
            title="Test Section"
            data={{ test: 'data' }}
            componentName="TestSection"
          >
            <div>Section Content</div>
          </DataSection>
        </ErrorProvider>
      );

      expect(screen.getByText('Section Content')).toBeInTheDocument();

      // Empty data - DataSection passes loadingComponent to GracefulDegradation,
      // which shows it for any falsy data (null or undefined)
      rerender(
        <ErrorProvider>
          <DataSection
            title="Test Section"
            data={null}
            componentName="TestSection"
          >
            <div>Section Content</div>
          </DataSection>
        </ErrorProvider>
      );

      // With null data and no emptyComponent prop, DataSection shows the loading fallback
      expect(screen.getAllByText('Test Section').length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText('Section Content')).not.toBeInTheDocument();
    });
  });
});