import React from 'react';
import PropTypes from 'prop-types';
import MatchScore from './MatchScore';
import SkillList from './SkillList';
import { DataSection, PartialDataWrapper, LoadingFallback, FeatureFallback } from './GracefulDegradation';
import { useComponentError } from '../contexts/ErrorContext';
import '../types/scoreTypes.js';

/**
 * Results Component
 * Displays analysis results with optional detailed factor information
 * Includes graceful degradation for partial data scenarios
 * 
 * @param {ResultsProps} props - Component props
 */
const Results = ({ analysisData, showDetailedFactors = false }) => {
  const { addError, clearError } = useComponentError('Results');
  
  if (!analysisData) {
    return null;
  }

  const {
    jobTitle,
    company,
    jobSkills,
    resumeSkills,
    matchScore,
    breakdown, // Add breakdown data
    matchingSkills,
    missingSkills,
    suggestions,
    experienceDetails,
    educationDetails,
    responsibilityDetails
  } = analysisData;

  // Check for partial data scenarios
  const hasPartialSkillData = !jobSkills || !resumeSkills || !matchingSkills || !missingSkills;
  const hasPartialFactorData = showDetailedFactors && (!experienceDetails || !educationDetails);

  return (
    <div className="results" role="main" aria-label="Analysis Results">
      <div className="results-header">
        <h2>Analysis Results</h2>
        <div className="job-info" aria-label="Job information">
          {jobTitle && <h3 className="job-title">{jobTitle}</h3>}
          {company && <p className="company-name">at {company}</p>}
        </div>
      </div>

      <div className="results-content">
        {/* Match Score Section with graceful degradation */}
        <DataSection
          title="Match Score"
          data={matchScore}
          componentName="MatchScore"
          loadingComponent={<LoadingFallback title="Match Score" type="card" />}
        >
          <MatchScore 
            score={matchScore} 
            breakdown={breakdown}
            showDetails={false}
          />
        </DataSection>

        {/* Skills Overview with partial data handling */}
        <DataSection
          title="Skills Analysis"
          data={{ jobSkills, resumeSkills, matchingSkills, missingSkills }}
          componentName="SkillsOverview"
          showPartialNotice={hasPartialSkillData}
        >
          <PartialDataWrapper
            title="Skills Overview"
            data={{ jobSkills, resumeSkills, matchingSkills, missingSkills }}
            expectedFields={['jobSkills', 'resumeSkills', 'matchingSkills', 'missingSkills']}
            componentName="SkillsOverview"
            showMissingFields={false}
          >
            <div className="skills-overview">
              <div className="skills-row">
                <div className="skill-column">
                  <SkillList 
                    skills={matchingSkills} 
                    type="matching" 
                    alwaysShow={true}
                  />
                </div>
                <div className="skill-column">
                  <SkillList 
                    skills={missingSkills} 
                    type="missing" 
                    alwaysShow={true}
                  />
                </div>
              </div>
              
              <div className="skills-row">
                <div className="skill-column">
                  <SkillList 
                    skills={jobSkills} 
                    type="job" 
                    alwaysShow={true}
                  />
                </div>
                <div className="skill-column">
                  <SkillList 
                    skills={resumeSkills} 
                    type="resume" 
                    alwaysShow={true}
                  />
                </div>
              </div>
            </div>
          </PartialDataWrapper>
        </DataSection>

        {/* Enhanced Factor Details Section with graceful degradation */}
        {showDetailedFactors && (
          <DataSection
            title="Detailed Factor Analysis"
            data={{ experienceDetails, educationDetails, responsibilityDetails }}
            componentName="FactorDetails"
            showPartialNotice={hasPartialFactorData}
            loadingComponent={<LoadingFallback title="Factor Analysis" type="section" />}
            errorComponent={
              <FeatureFallback 
                featureName="Factor Analysis"
                description="Detailed breakdown of evaluation factors is temporarily unavailable."
                icon="📊"
              />
            }
          >
            {(experienceDetails || educationDetails) ? (
              <div className="factor-details">
                <h3>📊 Detailed Factor Analysis</h3>
                <p className="factor-details-description">
                  Comprehensive breakdown of how each evaluation factor contributes to your match score
                </p>
                
                {/* Experience Details with fallback */}
                {experienceDetails ? (
                  <FactorDetailsSection
                    title="Experience Match"
                    icon="💼"
                    score={experienceDetails.score}
                    details={experienceDetails}
                    type="experience"
                  />
                ) : (
                  <FeatureFallback 
                    featureName="Experience Analysis"
                    description="Experience matching details are being processed."
                    icon="💼"
                    showRetry={false}
                  />
                )}
                
                {/* Education Details with fallback */}
                {educationDetails ? (
                  <FactorDetailsSection
                    title="Education Match"
                    icon="🎓"
                    score={educationDetails.score}
                    details={educationDetails}
                    type="education"
                  />
                ) : (
                  <FeatureFallback 
                    featureName="Education Analysis"
                    description="Education matching details are being processed."
                    icon="🎓"
                    showRetry={false}
                  />
                )}
                

              </div>
            ) : (
              <FeatureFallback 
                featureName="Detailed Factor Analysis"
                description="Factor analysis is temporarily unavailable, but your core match score and skills analysis remain accurate."
                icon="📊"
              />
            )}
          </DataSection>
        )}

        {/* AI Suggestions Section with graceful degradation */}
        <DataSection
          title="AI Suggestions"
          data={suggestions}
          componentName="Suggestions"
          loadingComponent={<LoadingFallback title="AI Suggestions" type="list" />}
          errorComponent={
            <FeatureFallback 
              featureName="AI Suggestions"
              description="AI-powered suggestions are temporarily unavailable."
              icon="💡"
            />
          }
          emptyComponent={
            <div className="suggestions-empty">
              <div className="suggestions-icon">💡</div>
              <p>No specific suggestions available at this time.</p>
              <p>Your analysis results above provide valuable insights for improvement.</p>
            </div>
          }
        >
          {suggestions && suggestions.length > 0 && (
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
          )}
        </DataSection>
      </div>
    </div>
  );
};

Results.propTypes = {
  analysisData: PropTypes.shape({
    jobTitle: PropTypes.string,
    company: PropTypes.string,
    jobSkills: PropTypes.arrayOf(PropTypes.string),
    resumeSkills: PropTypes.arrayOf(PropTypes.string),
    matchScore: PropTypes.number.isRequired,
    breakdown: PropTypes.shape({
      skills: PropTypes.number,
      experience: PropTypes.number,
      education: PropTypes.number,
      responsibilities: PropTypes.number
    }),
    matchingSkills: PropTypes.arrayOf(PropTypes.string),
    missingSkills: PropTypes.arrayOf(PropTypes.string),
    suggestions: PropTypes.arrayOf(PropTypes.string),
    experienceDetails: PropTypes.shape({
      score: PropTypes.number.isRequired,
      requiredYears: PropTypes.number,
      candidateYears: PropTypes.number,
      meetsRequirement: PropTypes.bool,
      relevantExperience: PropTypes.arrayOf(PropTypes.string),
      missingExperience: PropTypes.arrayOf(PropTypes.string)
    }),
    educationDetails: PropTypes.shape({
      score: PropTypes.number.isRequired,
      requiredDegree: PropTypes.string,
      candidateDegree: PropTypes.string,
      requiredLevel: PropTypes.string,
      candidateLevel: PropTypes.string,
      meetsRequirement: PropTypes.bool,
      relevantEducation: PropTypes.arrayOf(PropTypes.string),
      missingEducation: PropTypes.arrayOf(PropTypes.string)
    }),
    responsibilityDetails: PropTypes.shape({
      score: PropTypes.number.isRequired,
      matchingResponsibilities: PropTypes.arrayOf(PropTypes.string),
      missingResponsibilities: PropTypes.arrayOf(PropTypes.string),
      additionalResponsibilities: PropTypes.arrayOf(PropTypes.string),
      totalJobKeywords: PropTypes.number
    })
  }).isRequired,
  showDetailedFactors: PropTypes.bool
};

Results.defaultProps = {
  showDetailedFactors: false
};

/**
 * FactorDetailsSection Component
 * Displays detailed information for a specific evaluation factor
 */
const FactorDetailsSection = ({ title, icon, score, details, type }) => {
  const [expanded, setExpanded] = React.useState(false);
  
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score < 50) return '#e74c3c'; // Red
    if (score < 75) return '#f39c12'; // Yellow/Orange
    return '#27ae60'; // Green
  };

  const scoreColor = getScoreColor(score);

  // Helper text for each factor type
  const getHelpText = (type) => {
    switch (type) {
      case 'experience':
        return 'This factor evaluates how well your work experience aligns with the job requirements, including years of experience and relevant roles.';
      case 'education':
        return 'This factor assesses how your educational background matches the job requirements, including degree level and field of study.';
      case 'responsibility':
        return 'This factor analyzes how your past responsibilities and duties align with what the job requires you to do.';
      default:
        return 'This factor contributes to your overall match score based on specific evaluation criteria.';
    }
  };

  const renderExperienceDetails = (details) => (
    <div className="factor-content">
      {(details.requiredYears != null || details.candidateYears != null) && (
        <div className="experience-years">
          <h5>Experience Requirements</h5>
          <div className="years-comparison">
            {details.requiredYears != null && (
              <div className="years-item">
                <span className="years-label">Required:</span>
                <span className="years-value">{details.requiredYears} years</span>
              </div>
            )}
            {details.candidateYears != null && (
              <div className="years-item">
                <span className="years-label">Your Experience:</span>
                <span className="years-value">{details.candidateYears} years</span>
              </div>
            )}
            {details.meetsRequirement != null && (
              <div className="years-item">
                <span className="years-label">Meets Requirement:</span>
                <span className="years-value" style={{ color: details.meetsRequirement ? '#27ae60' : '#e74c3c' }}>
                  {details.meetsRequirement ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {details.relevantExperience && details.relevantExperience.length > 0 && (
        <div className="experience-section">
          <h5>✅ Relevant Experience</h5>
          <ul className="experience-list relevant">
            {details.relevantExperience.map((item, index) => (
              <li key={index} className="experience-item">{item}</li>
            ))}
          </ul>
        </div>
      )}
      
      {details.missingExperience && details.missingExperience.length > 0 && (
        <div className="experience-section">
          <h5>❌ Missing Experience</h5>
          <ul className="experience-list missing">
            {details.missingExperience.map((item, index) => (
              <li key={index} className="experience-item">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderEducationDetails = (details) => {
    const requiredDegree = details.requiredDegree || details.requiredLevel;
    const candidateDegree = details.candidateDegree || details.candidateLevel;
    return (
      <div className="factor-content">
        {(requiredDegree || candidateDegree) && (
          <div className="education-degrees">
            <h5>Degree Requirements</h5>
            <div className="degrees-comparison">
              {requiredDegree && (
                <div className="degree-item">
                  <span className="degree-label">Required:</span>
                  <span className="degree-value">{requiredDegree}</span>
                </div>
              )}
              {candidateDegree && (
                <div className="degree-item">
                  <span className="degree-label">Your Degree:</span>
                  <span className="degree-value">{candidateDegree}</span>
                </div>
              )}
              {details.meetsRequirement != null && (
                <div className="degree-item">
                  <span className="degree-label">Meets Requirement:</span>
                  <span className="degree-value" style={{ color: details.meetsRequirement ? '#27ae60' : '#e74c3c' }}>
                    {details.meetsRequirement ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {details.relevantEducation && details.relevantEducation.length > 0 && (
          <div className="education-section">
            <h5>✅ Relevant Education</h5>
            <ul className="education-list relevant">
              {details.relevantEducation.map((item, index) => (
                <li key={index} className="education-item">{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {details.missingEducation && details.missingEducation.length > 0 && (
          <div className="education-section">
            <h5>❌ Missing Education</h5>
            <ul className="education-list missing">
              {details.missingEducation.map((item, index) => (
                <li key={index} className="education-item">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderResponsibilityDetails = (details) => (
    <div className="factor-content">
      {details.matchingResponsibilities && details.matchingResponsibilities.length > 0 && (
        <div className="responsibility-section">
          <h5>✅ Matching Responsibilities</h5>
          <ul className="responsibility-list matching">
            {details.matchingResponsibilities.map((item, index) => (
              <li key={index} className="responsibility-item">{item}</li>
            ))}
          </ul>
        </div>
      )}
      
      {details.missingResponsibilities && details.missingResponsibilities.length > 0 && (
        <div className="responsibility-section">
          <h5>❌ Missing Responsibilities</h5>
          <ul className="responsibility-list missing">
            {details.missingResponsibilities.map((item, index) => (
              <li key={index} className="responsibility-item">{item}</li>
            ))}
          </ul>
        </div>
      )}
      
      {details.additionalResponsibilities && details.additionalResponsibilities.length > 0 && (
        <div className="responsibility-section">
          <h5>➕ Additional Responsibilities</h5>
          <ul className="responsibility-list additional">
            {details.additionalResponsibilities.map((item, index) => (
              <li key={index} className="responsibility-item">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderFactorContent = () => {
    switch (type) {
      case 'experience':
        return renderExperienceDetails(details);
      case 'education':
        return renderEducationDetails(details);
      case 'responsibility':
        return renderResponsibilityDetails(details);
      default:
        return <div className="factor-content">No details available</div>;
    }
  };

  return (
    <div className="factor-details-section">
      <div className="factor-header">
        <button 
          className="factor-toggle"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls={`factor-details-${type}`}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${title} details, score ${Math.round(score)} percent`}
        >
          <div className="factor-title">
            <span className="factor-icon" aria-hidden="true">{icon}</span>
            <span className="factor-name">{title}</span>
            <span className="factor-score" style={{ color: scoreColor }}>
              {Math.round(score)}%
            </span>
          </div>
          <span className="toggle-indicator">
            {expanded ? '▼' : '▶'}
          </span>
        </button>
        
        <div className="factor-help">
          <button
            className="help-icon-btn"
            aria-label={`Help: ${getHelpText(type)}`}
            title={getHelpText(type)}
            type="button"
            tabIndex={0}
          >
            <span className="help-icon" aria-hidden="true">ℹ️</span>
          </button>
          <div className="help-tooltip" role="tooltip">
            {getHelpText(type)}
          </div>
        </div>
      </div>

      {expanded && (
        <div id={`factor-details-${type}`} className="factor-details-content">
          {renderFactorContent()}
        </div>
      )}
    </div>
  );
};

FactorDetailsSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  details: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['experience', 'education', 'responsibility']).isRequired
};

export default Results;