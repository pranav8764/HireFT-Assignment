import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useComponentError } from '../contexts/ErrorContext';
import { PartialDataWrapper } from './GracefulDegradation';
import '../types/scoreTypes.js';

/**
 * MatchScore Component
 * Displays overall match score with optional detailed breakdown
 * Includes graceful degradation for missing breakdown data
 * 
 * @param {MatchScoreProps} props - Component props
 */
const MatchScore = ({ score, breakdown = null, showDetails = false }) => {
  const [expanded, setExpanded] = useState(showDetails);
  const { addError } = useComponentError('MatchScore');

  // Validate score
  if (typeof score !== 'number' || isNaN(score)) {
    addError('Invalid score data received', { 
      type: 'data', 
      retryable: false,
      context: { score }
    });
    return (
      <div className="match-score error">
        <h3>Match Score</h3>
        <div className="score-error">
          <span className="error-icon">⚠️</span>
          <span>Score data unavailable</span>
        </div>
      </div>
    );
  }

  // Determine color based on score
  const getScoreColor = (score) => {
    if (score < 50) return '#e74c3c'; // Red
    if (score < 75) return '#f39c12'; // Yellow/Orange
    return '#27ae60'; // Green
  };

  // Determine score level text
  const getScoreLevel = (score) => {
    if (score < 50) return 'Needs Improvement';
    if (score < 75) return 'Good Match';
    return 'Excellent Match';
  };

  const color = getScoreColor(score);
  const level = getScoreLevel(score);
  
  // Calculate circumference for circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Factor weights (matching backend calculation)
  const weights = {
    skills: 0.40,
    experience: 0.30,
    education: 0.15,
    responsibilities: 0.15
  };

  // Factor display configuration
  const factors = [
    { key: 'skills', label: 'Skills Match', icon: '🔧', weight: weights.skills },
    { key: 'experience', label: 'Experience Match', icon: '💼', weight: weights.experience },
    { key: 'education', label: 'Education Match', icon: '🎓', weight: weights.education },
    { key: 'responsibilities', label: 'Responsibilities Match', icon: '📋', weight: weights.responsibilities }
  ];

  return (
    <div className="match-score" role="region" aria-label="Match Score">
      <h3 id="match-score-heading">Match Score</h3>
      <div className="score-container">
        <div
          className="circular-progress"
          role="img"
          aria-label={`Match score: ${Math.round(score)} percent — ${level}`}
        >
          <svg width="120" height="120" className="progress-ring" aria-hidden="true">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#e0e0e0"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={color}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="progress-circle"
            />
          </svg>
          <div className="score-text" aria-hidden="true">
            <div className="score-percentage" style={{ color }}>
              {Math.round(score)}%
            </div>
          </div>
        </div>
        <div className="score-details">
          <div className="score-level" style={{ color }}>
            {level}
          </div>
          <div className="score-description">
            Based on skill overlap between your resume and the job requirements
          </div>
        </div>
      </div>

      {/* Score Breakdown Section with graceful degradation */}
      {breakdown ? (
        <PartialDataWrapper
          title="Score Breakdown"
          data={breakdown}
          expectedFields={['skills', 'experience', 'education', 'responsibilities']}
          componentName="ScoreBreakdown"
          showMissingFields={false}
        >
          <div className="score-breakdown">
            <button 
              className="breakdown-toggle"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls="score-breakdown-details"
              aria-label={expanded ? 'Hide score breakdown details' : 'Show score breakdown details'}
            >
              {expanded ? '▼' : '▶'} {expanded ? 'Hide' : 'Show'} Score Details
            </button>

            {expanded && (
              <div id="score-breakdown-details" className="breakdown-details">
                {/* Mathematical Formula */}
                <div className="breakdown-formula">
                  <h4>Score Calculation Formula</h4>
                  <div className="formula-display">
                    Final Score = (Skills × {weights.skills.toFixed(2)}) + (Experience × {weights.experience.toFixed(2)}) + (Education × {weights.education.toFixed(2)}) + (Responsibilities × {weights.responsibilities.toFixed(2)})
                  </div>
                </div>

                {/* Individual Factor Scores */}
                <div className="breakdown-factors">
                  <h4>Individual Factor Scores</h4>
                  <div className="factors-grid">
                    {factors.map(factor => {
                      const factorScore = breakdown[factor.key];
                      
                      // Handle missing factor data gracefully
                      if (factorScore === undefined || factorScore === null) {
                        return (
                          <div key={factor.key} className="factor-item unavailable">
                            <div className="factor-header">
                              <div className="factor-label">
                                <span className="factor-icon" aria-hidden="true">{factor.icon}</span>
                                <span className="factor-name">{factor.label}</span>
                              </div>
                              <div className="factor-weight-badge">
                                {(factor.weight * 100).toFixed(0)}% weight
                              </div>
                            </div>
                            
                            <div className="factor-unavailable">
                              <span className="unavailable-icon">⏳</span>
                              <span className="unavailable-text">Processing...</span>
                            </div>
                          </div>
                        );
                      }

                      const weightedContribution = factorScore * factor.weight;
                      const barWidth = `${factorScore}%`;
                      const barColor = getScoreColor(factorScore);
                      const weightPercentage = (factor.weight * 100).toFixed(0);

                      return (
                        <div key={factor.key} className="factor-item">
                          <div className="factor-header">
                            <div className="factor-label">
                              <span className="factor-icon" aria-hidden="true">{factor.icon}</span>
                              <span className="factor-name">{factor.label}</span>
                            </div>
                            <div className="factor-weight-badge">
                              {weightPercentage}% weight
                            </div>
                          </div>
                          
                          <div className="factor-score-display">
                            <span className="factor-score-value" style={{ color: barColor }}>
                              {Math.round(factorScore)}%
                            </span>
                          </div>
                          
                          <div className="factor-bar-container">
                            <div 
                              className="factor-bar" 
                              style={{ 
                                width: barWidth, 
                                backgroundColor: barColor 
                              }}
                              role="progressbar"
                              aria-valuenow={factorScore}
                              aria-valuemin="0"
                              aria-valuemax="100"
                              aria-label={`${factor.label}: ${Math.round(factorScore)}%`}
                            />
                          </div>
                          
                          <div className="factor-contribution">
                            <span className="contribution-label">Final Score Impact:</span>
                            <span className="contribution-value" style={{ color: barColor }}>
                              +{weightedContribution.toFixed(1)} points
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Weighted Contributions Summary */}
                  <div className="weighted-summary">
                    <h5>Weighted Contributions to Final Score</h5>
                    <div className="contributions-breakdown">
                      {factors.map(factor => {
                        const factorScore = breakdown[factor.key];
                        
                        if (factorScore === undefined || factorScore === null) {
                          return (
                            <div key={`${factor.key}-contribution`} className="contribution-item unavailable">
                              <span className="contribution-factor">
                                <span className="factor-icon" aria-hidden="true">{factor.icon}</span>
                                {factor.label}
                              </span>
                              <span className="contribution-calculation">Processing...</span>
                              <span className="contribution-result">-- pts</span>
                            </div>
                          );
                        }
                        
                        const weightedContribution = factorScore * factor.weight;
                        const barColor = getScoreColor(factorScore);
                        
                        return (
                          <div key={`${factor.key}-contribution`} className="contribution-item">
                            <span className="contribution-factor">
                              <span className="factor-icon" aria-hidden="true">{factor.icon}</span>
                              {factor.label}
                            </span>
                            <span className="contribution-calculation">
                              {Math.round(factorScore)}% × {(factor.weight * 100).toFixed(0)}% = 
                            </span>
                            <span className="contribution-result" style={{ color: barColor }}>
                              {weightedContribution.toFixed(1)} pts
                            </span>
                          </div>
                        );
                      })}
                      <div className="contribution-total">
                        <span className="total-label">Final Score:</span>
                        <span className="total-value" style={{ color: getScoreColor(score) }}>
                          {Math.round(score)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PartialDataWrapper>
      ) : (
        // Fallback when no breakdown data is available
        <div className="score-breakdown unavailable">
          <div className="breakdown-unavailable">
            <span className="unavailable-icon">📊</span>
            <span className="unavailable-text">
              Detailed score breakdown is being calculated...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

MatchScore.propTypes = {
  score: PropTypes.number.isRequired,
  breakdown: PropTypes.shape({
    skills: PropTypes.number,
    experience: PropTypes.number,
    education: PropTypes.number,
    responsibilities: PropTypes.number
  }),
  showDetails: PropTypes.bool
};

export default MatchScore;