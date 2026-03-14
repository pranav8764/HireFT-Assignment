import React from 'react';
import MatchScore from './MatchScore';
import SkillList from './SkillList';

const Results = ({ analysisData }) => {
  if (!analysisData) {
    return null;
  }

  const {
    jobTitle,
    company,
    jobSkills,
    resumeSkills,
    matchScore,
    matchingSkills,
    missingSkills,
    suggestions
  } = analysisData;

  return (
    <div className="results">
      <div className="results-header">
        <h2>Analysis Results</h2>
        <div className="job-info">
          {jobTitle && <h3 className="job-title">{jobTitle}</h3>}
          {company && <p className="company-name">at {company}</p>}
        </div>
      </div>

      <div className="results-content">
        {/* Match Score Section */}
        <div className="results-section">
          <MatchScore score={matchScore} />
        </div>

        {/* Skills Overview */}
        <div className="results-section">
          <div className="skills-overview">
            <div className="skills-row">
              <div className="skill-column">
                <SkillList 
                  skills={matchingSkills} 
                  type="matching" 
                />
              </div>
              <div className="skill-column">
                <SkillList 
                  skills={missingSkills} 
                  type="missing" 
                />
              </div>
            </div>
            
            <div className="skills-row">
              <div className="skill-column">
                <SkillList 
                  skills={jobSkills} 
                  type="job" 
                />
              </div>
              <div className="skill-column">
                <SkillList 
                  skills={resumeSkills} 
                  type="resume" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions Section */}
        {suggestions && suggestions.length > 0 && (
          <div className="results-section">
            <div className="suggestions">
              <h3>💡 AI-Powered Suggestions</h3>
              <p className="suggestions-description">
                Personalized recommendations to improve your resume for this job
              </p>
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="suggestion-item">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;