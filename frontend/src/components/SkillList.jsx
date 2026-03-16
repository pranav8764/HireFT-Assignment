import React from 'react';
import EmptyState from './EmptyState';

const SkillList = ({ skills, type, alwaysShow = true }) => {
  // Define empty state messages for each skill type
  const emptyMessages = {
    matching: "No matching skills found",
    missing: "No missing skills",
    job: "No job skills identified",
    resume: "No resume skills found"
  };

  // Determine if we should show the component
  const shouldShow = alwaysShow || (skills && skills.length > 0);
  
  if (!shouldShow) {
    return null;
  }

  // Define colors and labels for different skill types
  const typeConfig = {
    matching: {
      color: '#27ae60',
      backgroundColor: '#d5f4e6',
      label: 'Matching Skills',
      description: 'Skills you have that match the job requirements'
    },
    missing: {
      color: '#e74c3c',
      backgroundColor: '#fdeaea',
      label: 'Missing Skills',
      description: 'Skills required for the job that are not in your resume'
    },
    job: {
      color: '#3498db',
      backgroundColor: '#ebf3fd',
      label: 'Job Requirements',
      description: 'All skills mentioned in the job posting'
    },
    resume: {
      color: '#95a5a6',
      backgroundColor: '#f8f9fa',
      label: 'Your Skills',
      description: 'Skills found in your resume'
    }
  };

  const config = typeConfig[type] || typeConfig.resume;

  return (
    <div className="skill-list" role="region" aria-label={config.label}>
      <div className="skill-list-header">
        <h4 className="skill-list-title" id={`skill-list-title-${type}`}>{config.label}</h4>
        <span
          className="skill-count"
          aria-label={`${skills && skills.length > 0 ? skills.length : 0} skills`}
        >
          ({skills && skills.length > 0 ? skills.length : 0})
        </span>
      </div>
      <p className="skill-list-description" id={`skill-list-desc-${type}`}>{config.description}</p>
      
      {skills && skills.length > 0 ? (
        <ul
          className="skills-grid"
          aria-labelledby={`skill-list-title-${type}`}
          aria-describedby={`skill-list-desc-${type}`}
        >
          {skills.map((skill, index) => (
            <li
              key={index}
              className="skill-badge"
              style={{
                color: config.color,
                backgroundColor: config.backgroundColor,
                borderColor: config.color
              }}
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState 
          message={emptyMessages[type] || emptyMessages.resume} 
          type={type}
        />
      )}
    </div>
  );
};

export default SkillList;