import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillList from '../SkillList';

describe('SkillList Component', () => {
  describe('with skills data', () => {
    it('renders skills when provided', () => {
      const skills = ['React', 'JavaScript', 'Node.js'];
      render(<SkillList skills={skills} type="matching" />);
      
      expect(screen.getByText('Matching Skills')).toBeInTheDocument();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('displays correct count for skills', () => {
      const skills = ['Python', 'Django'];
      render(<SkillList skills={skills} type="resume" />);
      
      expect(screen.getByText('(2)')).toBeInTheDocument();
    });
  });

  describe('empty state behavior', () => {
    it('shows empty state message when alwaysShow is true and no skills', () => {
      render(<SkillList skills={[]} type="matching" alwaysShow={true} />);
      
      expect(screen.getByText('Matching Skills')).toBeInTheDocument();
      expect(screen.getByText('(0)')).toBeInTheDocument();
      expect(screen.getByText('No matching skills found')).toBeInTheDocument();
    });

    it('shows empty state message when skills is null and alwaysShow is true', () => {
      render(<SkillList skills={null} type="missing" alwaysShow={true} />);
      
      expect(screen.getByText('Missing Skills')).toBeInTheDocument();
      expect(screen.getByText('(0)')).toBeInTheDocument();
      expect(screen.getByText('No missing skills')).toBeInTheDocument();
    });

    it('shows empty state message when skills is undefined and alwaysShow is true', () => {
      render(<SkillList skills={undefined} type="job" alwaysShow={true} />);
      
      expect(screen.getByText('Job Requirements')).toBeInTheDocument();
      expect(screen.getByText('(0)')).toBeInTheDocument();
      expect(screen.getByText('No job skills identified')).toBeInTheDocument();
    });

    it('hides component when alwaysShow is false and no skills', () => {
      const { container } = render(<SkillList skills={[]} type="matching" alwaysShow={false} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('defaults to alwaysShow=true when prop not provided', () => {
      render(<SkillList skills={[]} type="resume" />);
      
      expect(screen.getByText('Your Skills')).toBeInTheDocument();
      expect(screen.getByText('No resume skills found')).toBeInTheDocument();
    });
  });

  describe('empty state messages', () => {
    it('shows correct message for matching skills', () => {
      render(<SkillList skills={[]} type="matching" alwaysShow={true} />);
      expect(screen.getByText('No matching skills found')).toBeInTheDocument();
    });

    it('shows correct message for missing skills', () => {
      render(<SkillList skills={[]} type="missing" alwaysShow={true} />);
      expect(screen.getByText('No missing skills')).toBeInTheDocument();
    });

    it('shows correct message for job skills', () => {
      render(<SkillList skills={[]} type="job" alwaysShow={true} />);
      expect(screen.getByText('No job skills identified')).toBeInTheDocument();
    });

    it('shows correct message for resume skills', () => {
      render(<SkillList skills={[]} type="resume" alwaysShow={true} />);
      expect(screen.getByText('No resume skills found')).toBeInTheDocument();
    });
  });

  describe('layout consistency', () => {
    it('maintains consistent header structure with empty state', () => {
      render(<SkillList skills={[]} type="matching" alwaysShow={true} />);
      
      expect(screen.getByText('Matching Skills')).toBeInTheDocument();
      expect(screen.getByText('(0)')).toBeInTheDocument();
      expect(screen.getByText('Skills you have that match the job requirements')).toBeInTheDocument();
    });

    it('maintains consistent header structure with skills', () => {
      const skills = ['React'];
      render(<SkillList skills={skills} type="matching" alwaysShow={true} />);
      
      expect(screen.getByText('Matching Skills')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
      expect(screen.getByText('Skills you have that match the job requirements')).toBeInTheDocument();
    });
  });

  describe('visual styling', () => {
    it('preserves visual styling in empty state', () => {
      render(<SkillList skills={[]} type="matching" alwaysShow={true} />);
      
      const skillList = screen.getByText('Matching Skills').closest('.skill-list');
      expect(skillList).toBeInTheDocument();
      
      const emptyState = screen.getByText('No matching skills found').closest('.empty-state');
      expect(emptyState).toBeInTheDocument();
    });
  });
});