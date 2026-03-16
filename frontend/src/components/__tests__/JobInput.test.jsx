import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import JobInput from '../JobInput';
import { LoadingProvider } from '../../contexts/LoadingContext';
import { ErrorProvider } from '../../contexts/ErrorContext';

// Mock the useDebounce hook
vi.mock('../../hooks/useDebounce', () => {
  return {
    default: vi.fn((value) => value)
  };
});

// Helper to render with providers
const renderWithProviders = (component) => {
  return render(
    <ErrorProvider>
      <LoadingProvider>
        {component}
      </LoadingProvider>
    </ErrorProvider>
  );
};

describe('JobInput Component', () => {
  const mockOnUrlSubmit = vi.fn();
  const mockOnAutoProcess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Auto-processing functionality', () => {
    test('should trigger auto-processing on paste event with valid URL', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/job-posting');
      
      // Simulate paste event
      const validUrl = 'https://example.com/job-posting';
      await user.click(input);
      
      // Create paste event
      const pasteEvent = new Event('paste', { bubbles: true });
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: {
          getData: () => validUrl
        }
      });
      
      fireEvent(input, pasteEvent);
      
      await waitFor(() => {
        expect(mockOnAutoProcess).toHaveBeenCalledWith(validUrl, expect.any(AbortSignal));
      });
    });

    test('should trigger auto-processing on blur event with valid URL', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/job-posting');
      
      // Type valid URL and blur
      const validUrl = 'https://example.com/job-posting';
      await user.type(input, validUrl);
      await user.tab(); // This triggers blur
      
      await waitFor(() => {
        expect(mockOnAutoProcess).toHaveBeenCalledWith(validUrl, expect.any(AbortSignal));
      });
    });

    test('should not trigger auto-processing for invalid URLs', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/job-posting');
      
      // Type invalid URL and blur
      const invalidUrl = 'not-a-valid-url';
      await user.type(input, invalidUrl);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('URL format is not recognized')).toBeInTheDocument();
        expect(mockOnAutoProcess).not.toHaveBeenCalled();
      });
    });

    test('should show loading state during processing', async () => {
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
          loading={true}
        />
      );

      const input = screen.getByRole('textbox');
      
      expect(input).toBeDisabled();
      
      // Check for spinner element by class name
      const spinnerElement = screen.getByText('', { selector: '.spinner' });
      expect(spinnerElement).toBeInTheDocument();
    });

    test('should display success message after successful processing', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/job-posting');
      
      // Type valid URL and blur
      const validUrl = 'https://example.com/job-posting';
      await user.type(input, validUrl);
      await user.tab();
      
      // Wait for processing to complete (simulate success)
      await waitFor(() => {
        expect(screen.getByText('✅ URL processed successfully')).toBeInTheDocument();
      });
    });

    test('should prevent duplicate processing of same URL', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
        />
      );

      const input = screen.getByRole('textbox');
      
      const validUrl = 'https://example.com/job-posting';
      
      // First blur
      await user.type(input, validUrl);
      await user.tab();
      
      await waitFor(() => {
        expect(mockOnAutoProcess).toHaveBeenCalledWith(validUrl, expect.any(AbortSignal));
      });
      
      const firstCallCount = mockOnAutoProcess.mock.calls.length;
      
      // Second blur with same URL should not trigger additional processing
      await user.click(input);
      await user.tab();
      
      // Should not have additional calls
      expect(mockOnAutoProcess).toHaveBeenCalledTimes(firstCallCount);
    });
  });

  describe('URL validation', () => {
    test('should validate URLs correctly', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/job-posting');
      
      // Test empty URL
      await user.tab();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      
      // Test invalid URL format
      await user.type(input, 'invalid-url');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('URL format is not recognized')).toBeInTheDocument();
      });
      
      // Clear and test URL without protocol
      await user.clear(input);
      await user.type(input, 'example.com/job');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('URL format is not recognized')).toBeInTheDocument();
      });
    });

    test('should clear errors when user starts typing', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/job-posting');
      
      // Create error state
      await user.type(input, 'invalid-url');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('URL format is not recognized')).toBeInTheDocument();
      });
      
      // Start typing should clear error
      await user.type(input, 'h');
      
      expect(screen.queryByText('URL format is not recognized')).not.toBeInTheDocument();
    });
  });

  describe('Visual feedback', () => {
    test('should show processing feedback for different event types', async () => {
      const user = userEvent.setup();
      
      // Mock auto-process to be async and not resolve immediately
      const mockAsyncAutoProcess = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockAsyncAutoProcess}
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/job-posting');
      
      // Test blur processing feedback
      await user.type(input, 'https://example.com/job-posting');
      await user.tab();
      
      expect(screen.getByText('Validating URL...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText('Validating URL...')).not.toBeInTheDocument();
      });
    });

    test('should disable input during processing', () => {
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
          loading={true}
          disabled={true}
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/job-posting');
      expect(input).toBeDisabled();
    });

    test('should show cancel button during processing and allow cancellation', async () => {
      const user = userEvent.setup();
      
      // Mock auto-process to be async and not resolve immediately
      const mockAsyncAutoProcess = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockAsyncAutoProcess}
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/job-posting');
      
      // Type valid URL and blur to trigger processing
      await user.type(input, 'https://example.com/job-posting');
      await user.tab();
      
      // Cancel button should appear during processing
      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });
      
      // Click cancel button
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);
      
      // Should show cancellation message
      await waitFor(() => {
        expect(screen.getByText('Processing cancelled by user')).toBeInTheDocument();
      });
      
      // Cancel button should disappear
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });
});