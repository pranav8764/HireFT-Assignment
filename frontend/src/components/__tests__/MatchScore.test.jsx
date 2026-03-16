import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MatchScore from '../MatchScore';
import { ErrorProvider } from '../../contexts/ErrorContext';

const renderWithProviders = (ui) =>
  render(<ErrorProvider>{ui}</ErrorProvider>);

describe('MatchScore Component', () => {
  const mockBreakdown = {
    skills: 85,
    experience: 70,
    education: 60,
    responsibilities: 80
  };

  it('renders basic score without breakdown', () => {
    renderWithProviders(<MatchScore score={75} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Excellent Match')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /score details/i })).not.toBeInTheDocument();
  });

  it('renders score with breakdown when provided', () => {
    renderWithProviders(<MatchScore score={75} breakdown={mockBreakdown} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show score breakdown details/i })).toBeInTheDocument();
  });

  it('expands breakdown details when toggle is clicked', () => {
    renderWithProviders(<MatchScore score={75} breakdown={mockBreakdown} />);
    
    const toggleButton = screen.getByRole('button', { name: /show score breakdown details/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByRole('button', { name: /hide score breakdown details/i })).toBeInTheDocument();
    expect(screen.getByText('Score Calculation Formula')).toBeInTheDocument();
    expect(screen.getByText('Individual Factor Scores')).toBeInTheDocument();
  });

  it('shows breakdown details by default when showDetails is true', () => {
    renderWithProviders(<MatchScore score={75} breakdown={mockBreakdown} showDetails={true} />);
    
    expect(screen.getByRole('button', { name: /hide score breakdown details/i })).toBeInTheDocument();
    expect(screen.getByText('Score Calculation Formula')).toBeInTheDocument();
  });

  it('displays individual factor scores correctly', () => {
    renderWithProviders(<MatchScore score={75} breakdown={mockBreakdown} showDetails={true} />);
    
    expect(screen.getAllByText('Skills Match')).toHaveLength(2);
    expect(screen.getAllByText('Experience Match')).toHaveLength(2);
    expect(screen.getAllByText('Education Match')).toHaveLength(2);
    expect(screen.getAllByText('Responsibilities Match')).toHaveLength(2);
    
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('displays factor weights correctly', () => {
    renderWithProviders(<MatchScore score={75} breakdown={mockBreakdown} showDetails={true} />);
    
    expect(screen.getByText('40% weight')).toBeInTheDocument();
    expect(screen.getByText('30% weight')).toBeInTheDocument();
    expect(screen.getAllByText('15% weight').length).toBe(2);
  });

  it('displays mathematical formula', () => {
    renderWithProviders(<MatchScore score={75} breakdown={mockBreakdown} showDetails={true} />);
    
    expect(screen.getByText(/Final Score = \(Skills × 0\.40\)/)).toBeInTheDocument();
  });

  it('displays factor contributions correctly', () => {
    renderWithProviders(<MatchScore score={75} breakdown={mockBreakdown} showDetails={true} />);
    
    const contributions = screen.getAllByText(/Final Score Impact:/);
    expect(contributions.length).toBe(4);
    
    expect(screen.getByText('Weighted Contributions to Final Score')).toBeInTheDocument();
  });
});
