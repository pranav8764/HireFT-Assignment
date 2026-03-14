import React from 'react';

const SkillList = ({ skills, type }) => {
  if (!skills || skills.length === 0) {
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
    <div className="skill-list">
      <div className="skill-list-header">
        <h4 className="skill-list-title">{config.label}</h4>
        <span className="skill-count">({skills.length})</span>
      </div>
      <p className="skill-list-description">{config.description}</p>
      
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="skill-badge"
            style={{
              color: config.color,
              backgroundColor: config.backgroundColor,
              borderColor: config.color
            }}
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;