import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmptyState from '../EmptyState';

describe('EmptyState Component', () => {
  it('renders the provided message', () => {
    const message = 'No data available';
    render(<EmptyState message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('applies correct styling for matching type', () => {
    render(<EmptyState message="No matching skills" type="matching" />);
    
    const emptyState = screen.getByText('No matching skills').closest('.empty-state');
    expect(emptyState).toHaveStyle({
      backgroundColor: '#d5f4e6',
      color: '#27ae60'
    });
  });

  it('applies correct styling for missing type', () => {
    render(<EmptyState message="No missing skills" type="missing" />);
    
    const emptyState = screen.getByText('No missing skills').closest('.empty-state');
    expect(emptyState).toHaveStyle({
      backgroundColor: '#fdeaea',
      color: '#e74c3c'
    });
  });

  it('applies correct styling for job type', () => {
    render(<EmptyState message="No job skills" type="job" />);
    
    const emptyState = screen.getByText('No job skills').closest('.empty-state');
    expect(emptyState).toHaveStyle({
      backgroundColor: '#ebf3fd',
      color: '#3498db'
    });
  });

  it('applies correct styling for resume type', () => {
    render(<EmptyState message="No resume skills" type="resume" />);
    
    const emptyState = screen.getByText('No resume skills').closest('.empty-state');
    expect(emptyState).toHaveStyle({
      backgroundColor: '#f8f9fa',
      color: '#95a5a6'
    });
  });

  it('applies default styling when type is not provided', () => {
    render(<EmptyState message="Default message" />);
    
    const emptyState = screen.getByText('Default message').closest('.empty-state');
    expect(emptyState).toHaveStyle({
      backgroundColor: '#f8f9fa',
      color: '#6c757d'
    });
  });

  it('displays appropriate icon for each type', () => {
    const types = [
      { type: 'matching', icon: '🔍' },
      { type: 'missing', icon: '❌' },
      { type: 'job', icon: '💼' },
      { type: 'resume', icon: '📄' },
      { type: 'default', icon: '📝' }
    ];

    types.forEach(({ type, icon }) => {
      const { unmount } = render(<EmptyState message="Test message" type={type} />);
      expect(screen.getByText(icon)).toBeInTheDocument();
      unmount();
    });
  });

  it('has consistent visual structure', () => {
    render(<EmptyState message="Test message" type="matching" />);
    
    const emptyState = screen.getByText('Test message').closest('.empty-state');
    expect(emptyState).toHaveStyle({
      padding: '20px',
      textAlign: 'center',
      borderRadius: '8px',
      fontSize: '14px',
      fontStyle: 'italic'
    });
  });
});