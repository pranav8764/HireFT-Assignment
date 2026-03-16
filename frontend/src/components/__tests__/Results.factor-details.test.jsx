import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Results from '../Results';
import { ErrorProvider } from '../../contexts/ErrorContext';

const renderWithProviders = (ui) => render(<ErrorProvider>{ui}</ErrorProvider>);

describe('Results Factor Details Tests', () => {
  const mockAnalysisDataWithFactorDetails = {
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Innovations',
    matchScore: 82,
    breakdown: {
      skills: 85,
      experience: 75,
      education: 80,
      responsibilities: 88
    },
    matchingSkills: ['React', 'JavaScript', 'Node.js'],
    missingSkills: ['Docker', 'Kubernetes'],
    jobSkills: ['React', 'JavaScript', 'Node.js', 'Docker', 'Kubernetes'],
    resumeSkills: ['React', 'JavaScript', 'Node.js', 'Python'],
    suggestions: ['Consider learning Docker for containerization'],
    experienceDetails: {
      score: 75,
      requiredYears: 5,
      candidateYears: 3,
      relevantExperience: ['React development', 'API integration', 'Frontend architecture'],
      missingExperience: ['Team leadership', 'System design']
    },
    educationDetails: {
      score: 80,
      requiredDegree: "Bachelor's in Computer Science",
      candidateDegree: "Bachelor's in Information Technology",
      relevantEducation: ['Computer Science fundamentals', 'Software engineering principles'],
      missingEducation: ['Advanced algorithms', 'Machine learning']
    },
    responsibilityDetails: {
      score: 88,
      matchingResponsibilities: ['Code development', 'Testing', 'Code review'],
      missingResponsibilities: ['Mentoring junior developers'],
      additionalResponsibilities: ['Technical documentation', 'Client communication']
    }
  };

  describe('when showDetailedFactors is false', () => {
    it('does not display factor details section', () => {
      renderWithProviders(
        <Results analysisData={mockAnalysisDataWithFactorDetails} showDetailedFactors={false} />
      );
      expect(screen.queryByText('📊 Detailed Factor Analysis')).not.toBeInTheDocument();
      expect(screen.queryByText('Experience Match')).not.toBeInTheDocument();
      expect(screen.queryByText('Education Match')).not.toBeInTheDocument();
      expect(screen.queryByText('Responsibility Match')).not.toBeInTheDocument();
    });
  });

  describe('when showDetailedFactors is true', () => {
    it('displays factor details section with all factors', () => {
      renderWithProviders(
        <Results analysisData={mockAnalysisDataWithFactorDetails} showDetailedFactors={true} />
      );
      expect(screen.getByText('📊 Detailed Factor Analysis')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive breakdown of how each evaluation factor contributes to your match score')).toBeInTheDocument();
      expect(screen.getByText('Experience Match')).toBeInTheDocument();
      expect(screen.getByText('Education Match')).toBeInTheDocument();
      expect(screen.getByText('Responsibility Match')).toBeInTheDocument();
    });

    it('displays factor scores correctly', () => {
      renderWithProviders(
        <Results analysisData={mockAnalysisDataWithFactorDetails} showDetailedFactors={true} />
      );
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
      expect(screen.getByText('88%')).toBeInTheDocument();
    });

    it('allows expanding and collapsing factor details', () => {
      renderWithProviders(
        <Results analysisData={mockAnalysisDataWithFactorDetails} showDetailedFactors={true} />
      );
      const experienceToggle = screen.getByRole('button', { name: /Experience Match/i });
      expect(screen.queryByText('Experience Requirements')).not.toBeInTheDocument();
      fireEvent.click(experienceToggle);
      expect(screen.getByText('Experience Requirements')).toBeInTheDocument();
      expect(screen.getByText('Required:')).toBeInTheDocument();
      expect(screen.getByText('5 years')).toBeInTheDocument();
      expect(screen.getByText('Your Experience:')).toBeInTheDocument();
      expect(screen.getByText('3 years')).toBeInTheDocument();
      fireEvent.click(experienceToggle);
      expect(screen.queryByText('Experience Requirements')).not.toBeInTheDocument();
    });

    it('displays experience details correctly when expanded', () => {
      renderWithProviders(
        <Results analysisData={mockAnalysisDataWithFactorDetails} showDetailedFactors={true} />
      );
      const experienceToggle = screen.getByRole('button', { name: /Experience Match/i });
      fireEvent.click(experienceToggle);
      expect(screen.getByText('✅ Relevant Experience')).toBeInTheDocument();
      expect(screen.getByText('React development')).toBeInTheDocument();
      expect(screen.getByText('API integration')).toBeInTheDocument();
      expect(screen.getByText('Frontend architecture')).toBeInTheDocument();
      expect(screen.getByText('❌ Missing Experience')).toBeInTheDocument();
      expect(screen.getByText('Team leadership')).toBeInTheDocument();
      expect(screen.getByText('System design')).toBeInTheDocument();
    });

    it('displays education details correctly when expanded', () => {
      renderWithProviders(
        <Results analysisData={mockAnalysisDataWithFactorDetails} showDetailedFactors={true} />
      );
      const educationToggle = screen.getByRole('button', { name: /Education Match/i });
      fireEvent.click(educationToggle);
      expect(screen.getByText('Degree Requirements')).toBeInTheDocument();
      expect(screen.getByText("Bachelor's in Computer Science")).toBeInTheDocument();
      expect(screen.getByText("Bachelor's in Information Technology")).toBeInTheDocument();
      expect(screen.getByText('✅ Relevant Education')).toBeInTheDocument();
      expect(screen.getByText('Computer Science fundamentals')).toBeInTheDocument();
      expect(screen.getByText('Software engineering principles')).toBeInTheDocument();
      expect(screen.getByText('❌ Missing Education')).toBeInTheDocument();
      expect(screen.getByText('Advanced algorithms')).toBeInTheDocument();
      expect(screen.getByText('Machine learning')).toBeInTheDocument();
    });

    it('displays responsibility details correctly when expanded', () => {
      renderWithProviders(
        <Results analysisData={mockAnalysisDataWithFactorDetails} showDetailedFactors={true} />
      );
      const responsibilityToggle = screen.getByRole('button', { name: /Responsibility Match/i });
      fireEvent.click(responsibilityToggle);
      expect(screen.getByText('✅ Matching Responsibilities')).toBeInTheDocument();
      expect(screen.getByText('Code development')).toBeInTheDocument();
      expect(screen.getByText('Testing')).toBeInTheDocument();
      expect(screen.getByText('Code review')).toBeInTheDocument();
      expect(screen.getByText('❌ Missing Responsibilities')).toBeInTheDocument();
      expect(screen.getByText('Mentoring junior developers')).toBeInTheDocument();
      expect(screen.getByText('➕ Additional Responsibilities')).toBeInTheDocument();
      expect(screen.getByText('Technical documentation')).toBeInTheDocument();
      expect(screen.getByText('Client communication')).toBeInTheDocument();
    });

    it('shows help tooltips for each factor', () => {
      renderWithProviders(
        <Results analysisData={mockAnalysisDataWithFactorDetails} showDetailedFactors={true} />
      );
      const helpIcons = screen.getAllByText('ℹ️');
      expect(helpIcons).toHaveLength(3);
    });
  });

  describe('when factor details are missing', () => {
    it('only shows factors that have details available', () => {
      const analysisDataWithPartialDetails = {
        ...mockAnalysisDataWithFactorDetails,
        experienceDetails: undefined,
        educationDetails: {
          score: 70,
          relevantEducation: ['Basic programming'],
          missingEducation: ['Advanced topics']
        },
        responsibilityDetails: undefined
      };
      renderWithProviders(
        <Results analysisData={analysisDataWithPartialDetails} showDetailedFactors={true} />
      );
      expect(screen.queryByText('Experience Match')).not.toBeInTheDocument();
      expect(screen.getByText('Education Match')).toBeInTheDocument();
      expect(screen.queryByText('Responsibility Match')).not.toBeInTheDocument();
    });

    it('does not show factor details section when no factor details are available', () => {
      const analysisDataWithoutFactorDetails = {
        ...mockAnalysisDataWithFactorDetails,
        experienceDetails: undefined,
        educationDetails: undefined,
        responsibilityDetails: undefined
      };
      renderWithProviders(
        <Results analysisData={analysisDataWithoutFactorDetails} showDetailedFactors={true} />
      );
      expect(screen.queryByText('📊 Detailed Factor Analysis')).not.toBeInTheDocument();
    });
  });
});
