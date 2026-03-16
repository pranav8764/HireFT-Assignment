import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Results from '../Results';
import { ErrorProvider } from '../../contexts/ErrorContext';

const renderWithProviders = (ui) => render(<ErrorProvider>{ui}</ErrorProvider>);

describe('Results Integration Tests', () => {
  describe('skill block display with empty states', () => {
    it('displays all skill blocks with empty states when no skills are provided', () => {
      const analysisData = {
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        matchScore: 75,
        breakdown: {
          skills: 80,
          experience: 70,
          education: 75,
          responsibilities: 78
        },
        // All skill arrays are empty or undefined
        matchingSkills: [],
        missingSkills: null,
        jobSkills: undefined,
        resumeSkills: [],
        suggestions: []
      };

      renderWithProviders(<Results analysisData={analysisData} />);

      // Verify all skill block headers are present
      expect(screen.getByText('Matching Skills')).toBeInTheDocument();
      expect(screen.getByText('Missing Skills')).toBeInTheDocument();
      expect(screen.getByText('Job Requirements')).toBeInTheDocument();
      expect(screen.getByText('Your Skills')).toBeInTheDocument();

      // Verify all empty state messages are displayed
      expect(screen.getByText('No matching skills found')).toBeInTheDocument();
      expect(screen.getByText('No missing skills')).toBeInTheDocument();
      expect(screen.getByText('No job skills identified')).toBeInTheDocument();
      expect(screen.getByText('No resume skills found')).toBeInTheDocument();

      // Verify all counts show 0
      expect(screen.getAllByText('(0)')).toHaveLength(4);
    });

    it('displays mixed states with some empty and some populated skill blocks', () => {
      const analysisData = {
        jobTitle: 'Frontend Developer',
        company: 'Web Solutions',
        matchScore: 85,
        breakdown: {
          skills: 90,
          experience: 80,
          education: 85,
          responsibilities: 85
        },
        matchingSkills: ['React', 'JavaScript'],
        missingSkills: [], // Empty
        jobSkills: ['React', 'JavaScript', 'TypeScript'], 
        resumeSkills: null, // Null
        suggestions: []
      };

      renderWithProviders(<Results analysisData={analysisData} />);

      // Verify populated skill blocks show skills (using getAllByText since skills can appear multiple times)
      expect(screen.getAllByText('React')).toHaveLength(2); // In matching and job skills
      expect(screen.getAllByText('JavaScript')).toHaveLength(2); // In matching and job skills
      expect(screen.getByText('TypeScript')).toBeInTheDocument(); // Only in job skills

      // Verify populated skill blocks show correct counts
      expect(screen.getByText('(2)')).toBeInTheDocument(); // matching skills
      expect(screen.getByText('(3)')).toBeInTheDocument(); // job skills

      // Verify empty skill blocks show empty state messages
      expect(screen.getByText('No missing skills')).toBeInTheDocument();
      expect(screen.getByText('No resume skills found')).toBeInTheDocument();

      // Verify empty skill blocks show 0 count
      expect(screen.getAllByText('(0)')).toHaveLength(2);
    });

    it('maintains consistent layout structure regardless of data availability', () => {
      const analysisData = {
        jobTitle: 'Full Stack Developer',
        company: 'Innovation Inc',
        matchScore: 90,
        breakdown: {
          skills: 95,
          experience: 85,
          education: 90,
          responsibilities: 90
        },
        matchingSkills: ['React', 'Node.js', 'MongoDB'],
        missingSkills: ['Docker', 'Kubernetes'],
        jobSkills: ['React', 'Node.js', 'MongoDB', 'Docker', 'Kubernetes'],
        resumeSkills: ['React', 'Node.js', 'MongoDB', 'Express'],
        suggestions: ['Consider learning Docker for containerization']
      };

      renderWithProviders(<Results analysisData={analysisData} />);

      // Verify all skill blocks are present with consistent structure
      const skillLists = document.querySelectorAll('.skill-list');
      
      expect(skillLists).toHaveLength(4);
      
      // Each skill list should have header, description, and content
      skillLists.forEach(skillList => {
        expect(skillList).toBeInTheDocument();
        expect(skillList.querySelector('.skill-list-header')).toBeInTheDocument();
        expect(skillList.querySelector('.skill-list-description')).toBeInTheDocument();
        // Should have either skills-grid or empty-state
        const hasSkillsGrid = skillList.querySelector('.skills-grid');
        const hasEmptyState = skillList.querySelector('.empty-state');
        expect(hasSkillsGrid || hasEmptyState).toBeTruthy();
      });
    });
  });
});