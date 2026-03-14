import React from 'react';

const MatchScore = ({ score }) => {
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

  return (
    <div className="match-score">
      <h3>Match Score</h3>
      <div className="score-container">
        <div className="circular-progress">
          <svg width="120" height="120" className="progress-ring">
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
          <div className="score-text">
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
    </div>
  );
};

export default MatchScore;