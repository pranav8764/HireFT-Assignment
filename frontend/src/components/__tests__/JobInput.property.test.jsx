import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi, afterEach } from 'vitest';
import JobInput from '../JobInput';
import { LoadingProvider } from '../../contexts/LoadingContext';
import { ErrorProvider } from '../../contexts/ErrorContext';

// Mock the useDebounce hook to return immediate values for testing
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

describe('JobInput Property-Based Tests', () => {
  const mockOnUrlSubmit = vi.fn();
  const mockOnAutoProcess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * **Feature: frontend-ux-enhancements, Property 1**: Auto-processing triggers for valid URLs
   * **Validates: Requirements 1.1, 1.2**
   */
  test('Property 1: Auto-processing triggers for valid URLs', async () => {
    const validUrls = [
      'https://example.com/job',
      'http://test.com/posting',
      'https://company.org/careers/123'
    ];

    for (const validUrl of validUrls) {
      cleanup();
      vi.clearAllMocks();
      
      const { unmount } = renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
        />
      );

      const input = screen.getByRole('textbox');
      
      // Test paste event
      const pasteEvent = new Event('paste', { bubbles: true });
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: {
          getData: () => validUrl
        }
      });
      
      fireEvent(input, pasteEvent);
      
      await waitFor(() => {
        expect(mockOnAutoProcess).toHaveBeenCalledWith(validUrl, expect.any(AbortSignal));
      }, { timeout: 1000 });

      unmount();
    }
  });

  /**
   * **Feature: frontend-ux-enhancements, Property 2**: Invalid URL validation without processing
   * **Validates: Requirements 1.4**
   */
  test('Property 2: Invalid URL validation without processing', async () => {
    const invalidUrls = [
      'invalid-url',
      'ftp://example.com',
      'not-a-url',
      'https:/'
    ];

    for (const invalidUrl of invalidUrls) {
      cleanup();
      vi.clearAllMocks();
      
      const { unmount } = renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
        />
      );

      const input = screen.getByRole('textbox');
      
      // Test blur with invalid URL
      fireEvent.change(input, { target: { value: invalidUrl } });
      fireEvent.blur(input);
      
      // Should show validation error and not call auto-process
      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/Please enter|URL format|valid URL/i);
        expect(errorMessages.length).toBeGreaterThan(0);
        expect(mockOnAutoProcess).not.toHaveBeenCalled();
      }, { timeout: 1000 });

      unmount();
    }
  });

  /**
   * **Feature: frontend-ux-enhancements, Property 3**: Visual feedback during processing states
   * **Validates: Requirements 1.5, 5.1, 5.2, 5.3, 5.4**
   */
  test('Property 3: Visual feedback during processing states', () => {
    const testCases = [
      { loading: true, disabled: false },
      { loading: false, disabled: true },
      { loading: true, disabled: true },
      { loading: false, disabled: false }
    ];

    testCases.forEach((state) => {
      cleanup();
      
      const { unmount } = renderWithProviders(
        <JobInput 
          onUrlSubmit={mockOnUrlSubmit} 
          onAutoProcess={mockOnAutoProcess}
          loading={state.loading}
          disabled={state.disabled}
        />
      );

      const input = screen.getByRole('textbox');
      
      // Check input state
      if (state.loading || state.disabled) {
        expect(input).toBeDisabled();
      }
      
      // Check for loading indicator when loading
      if (state.loading) {
        const spinnerElement = screen.getByText('', { selector: '.spinner' });
        expect(spinnerElement).toBeInTheDocument();
      }

      unmount();
    });
  });
});