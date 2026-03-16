import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Results from '../Results';
import { GracefulDegradation, PartialDataWrapper, LoadingFallback, FeatureFallback, DataSection } from '../GracefulDegradation';
import { ErrorProvider } from '../../contexts/ErrorContext';

const renderWithProviders = (ui) => render(<ErrorProvider>{ui}</ErrorProvider>);

const baseAnalysisData = {
  matchScore: 75,
  jobTitle: 'Software Engineer',
  company: 'Tech Corp',
  matchingSkills: ['React'],
  missingSkills: ['Docker'],
  jobSkills: ['React', 'Docker'],
  resumeSkills: ['React'],
  suggestions: []
};

describe('Graceful Degradation - Partial Data Scenarios', () => {
  describe('Results renders with missing optional fields', () => {
    it('renders when breakdown is missing', () => {
      const data = { ...baseAnalysisData, breakdown: undefined };
      renderWithProviders(<Results analysisData={data} />);
      // "Match Score" appears in both DataSection title and MatchScore h3
      expect(screen.getAllByText('Match Score').length).toBeGreaterThan(0);
      // Should show unavailable message instead of crashing
      expect(screen.getByText(/Detailed score breakdown is being calculated/i)).toBeInTheDocument();
    });

    it('renders when suggestions are missing', () => {
      const data = { ...baseAnalysisData, suggestions: undefined };
      renderWithProviders(<Results analysisData={data} />);
      // "Match Score" appears in both DataSection title and MatchScore h3
      expect(screen.getAllByText('Match Score').length).toBeGreaterThan(0);
    });

    it('renders when all skill arrays are null/undefined', () => {
      const data = {
        ...baseAnalysisData,
        matchingSkills: null,
        missingSkills: undefined,
        jobSkills: null,
        resumeSkills: undefined
      };
      renderWithProviders(<Results analysisData={data} />);
      // All four skill blocks should still render with empty states
      expect(screen.getByText('No matching skills found')).toBeInTheDocument();
      expect(screen.getByText('No missing skills')).toBeInTheDocument();
      expect(screen.getByText('No job skills identified')).toBeInTheDocument();
      expect(screen.getByText('No resume skills found')).toBeInTheDocument();
    });

    it('renders factor fallbacks when showDetailedFactors is true but details are missing', () => {
      const data = {
        ...baseAnalysisData,
        experienceDetails: undefined,
        educationDetails: undefined,
        responsibilityDetails: undefined
      };
      renderWithProviders(<Results analysisData={data} showDetailedFactors={true} />);
      // Factor details section should not appear when all details are missing
      expect(screen.queryByText('📊 Detailed Factor Analysis')).not.toBeInTheDocument();
    });

    it('shows partial factor details when only some factors are available', () => {
      const data = {
        ...baseAnalysisData,
        experienceDetails: { score: 70, relevantExperience: ['React'], missingExperience: [] },
        educationDetails: undefined,
        responsibilityDetails: undefined
      };
      renderWithProviders(<Results analysisData={data} showDetailedFactors={true} />);
      expect(screen.getByText('Experience Match')).toBeInTheDocument();
      expect(screen.queryByText('Education Match')).not.toBeInTheDocument();
      expect(screen.queryByText('Responsibility Match')).not.toBeInTheDocument();
    });
  });

  describe('GracefulDegradation component', () => {
    it('shows fallback when data is null', () => {
      renderWithProviders(
        <GracefulDegradation componentName="Test" data={null} fallback={<div>No data</div>}>
          <div>Content</div>
        </GracefulDegradation>
      );
      expect(screen.getByText('No data')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders children when data is available', () => {
      renderWithProviders(
        <GracefulDegradation componentName="Test" data={{ value: 1 }}>
          <div>Content</div>
        </GracefulDegradation>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('shows loading component when data is undefined', () => {
      renderWithProviders(
        <GracefulDegradation
          componentName="Test"
          data={undefined}
          loadingComponent={<div>Loading section...</div>}
        >
          <div>Content</div>
        </GracefulDegradation>
      );
      expect(screen.getByText('Loading section...')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('shows default fallback when no fallback provided and data is null', () => {
      renderWithProviders(
        <GracefulDegradation componentName="Test" data={null}>
          <div>Content</div>
        </GracefulDegradation>
      );
      expect(screen.getByText('Data not available')).toBeInTheDocument();
    });
  });

  describe('LoadingFallback component', () => {
    it('renders with title', () => {
      render(<LoadingFallback title="Loading Skills" />);
      expect(screen.getByText('Loading Skills')).toBeInTheDocument();
    });

    it('renders skeleton lines by default', () => {
      const { container } = render(<LoadingFallback title="Test" />);
      expect(container.querySelectorAll('.skeleton-line').length).toBeGreaterThan(0);
    });

    it('renders spinner when showSkeleton is false', () => {
      render(<LoadingFallback title="Test" showSkeleton={false} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('FeatureFallback component', () => {
    it('renders feature name and description', () => {
      render(
        <FeatureFallback
          featureName="Score Breakdown"
          description="Score details are unavailable."
        />
      );
      expect(screen.getByText('Score Breakdown Unavailable')).toBeInTheDocument();
      expect(screen.getByText('Score details are unavailable.')).toBeInTheDocument();
    });

    it('shows retry button when onRetry is provided', () => {
      const onRetry = vi.fn();
      render(<FeatureFallback featureName="Test" onRetry={onRetry} />);
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('hides retry button when showRetry is false', () => {
      render(<FeatureFallback featureName="Test" showRetry={false} />);
      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });
  });

  describe('PartialDataWrapper component', () => {
    it('shows unavailable state when data is null', () => {
      renderWithProviders(
        <PartialDataWrapper title="Skills" data={null} componentName="Test">
          <div>Content</div>
        </PartialDataWrapper>
      );
      expect(screen.getByText('Unavailable')).toBeInTheDocument();
      expect(screen.getByText(/currently being processed/i)).toBeInTheDocument();
    });

    it('renders children when data is provided', () => {
      renderWithProviders(
        <PartialDataWrapper title="Skills" data={{ skills: ['React'] }} componentName="Test">
          <div>Skill content</div>
        </PartialDataWrapper>
      );
      expect(screen.getByText('Skill content')).toBeInTheDocument();
    });

    it('shows partial status when expected fields are missing', () => {
      renderWithProviders(
        <PartialDataWrapper
          title="Skills"
          data={{ skills: ['React'] }}
          expectedFields={['skills', 'experience']}
          componentName="Test"
        >
          <div>Content</div>
        </PartialDataWrapper>
      );
      expect(screen.getByText('Partial')).toBeInTheDocument();
    });
  });

  describe('DataSection component', () => {
    it('shows loading fallback (skeleton) when data is undefined', () => {
      const { container } = renderWithProviders(
        <DataSection title="Test Section" data={undefined} componentName="Test">
          <div>Content</div>
        </DataSection>
      );
      // DataSection uses LoadingFallback (skeleton) by default
      expect(container.querySelector('.skeleton-line')).toBeTruthy();
      expect(container.querySelector('.loading-fallback')).toBeTruthy();
    });

    it('shows fallback when data is null and no loadingComponent', () => {
      renderWithProviders(
        <GracefulDegradation componentName="Test" data={null}>
          <div>Content</div>
        </GracefulDegradation>
      );
      expect(screen.getByText('Data not available')).toBeInTheDocument();
    });

    it('renders children when data is available', () => {
      renderWithProviders(
        <DataSection title="Test Section" data={{ value: 1 }} componentName="Test">
          <div>Section content</div>
        </DataSection>
      );
      expect(screen.getByText('Section content')).toBeInTheDocument();
    });
  });
});
