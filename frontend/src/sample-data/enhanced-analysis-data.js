/**
 * Sample analysis data demonstrating the enhanced factor details functionality
 * This shows what the backend API should return to support the new features
 */

export const sampleEnhancedAnalysisData = {
  jobTitle: 'Senior Full Stack Developer',
  company: 'TechCorp Solutions',
  matchScore: 78,
  breakdown: {
    skills: 85,
    experience: 70,
    education: 75,
    responsibilities: 82
  },
  matchingSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git'],
  missingSkills: ['Docker', 'Kubernetes', 'AWS', 'TypeScript'],
  jobSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git', 'Docker', 'Kubernetes', 'AWS', 'TypeScript'],
  resumeSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git', 'Python', 'PostgreSQL'],
  suggestions: [
    'Consider learning Docker and Kubernetes for containerization and orchestration',
    'Gain experience with AWS cloud services to meet infrastructure requirements',
    'TypeScript knowledge would strengthen your JavaScript development skills'
  ],
  
  // Enhanced factor details - NEW FUNCTIONALITY
  experienceDetails: {
    score: 70,
    requiredYears: 5,
    candidateYears: 3,
    relevantExperience: [
      'Full-stack web development with React and Node.js',
      'Database design and management with MongoDB',
      'RESTful API development and integration',
      'Version control with Git and collaborative development'
    ],
    missingExperience: [
      'Senior-level team leadership and mentoring',
      'Large-scale system architecture design',
      'DevOps and cloud infrastructure management',
      'Performance optimization for high-traffic applications'
    ]
  },
  
  educationDetails: {
    score: 75,
    requiredDegree: "Bachelor's degree in Computer Science or related field",
    candidateDegree: "Bachelor's degree in Information Technology",
    relevantEducation: [
      'Computer Science fundamentals and programming principles',
      'Database systems and data structures',
      'Software engineering methodologies',
      'Web development technologies'
    ],
    missingEducation: [
      'Advanced algorithms and computational complexity',
      'Distributed systems and cloud computing',
      'Machine learning and artificial intelligence',
      'Cybersecurity and system security principles'
    ]
  },
  
  responsibilityDetails: {
    score: 82,
    matchingResponsibilities: [
      'Develop and maintain web applications using modern frameworks',
      'Write clean, maintainable, and well-documented code',
      'Collaborate with cross-functional teams on project requirements',
      'Participate in code reviews and maintain coding standards',
      'Debug and troubleshoot application issues',
      'Implement responsive design and ensure cross-browser compatibility'
    ],
    missingResponsibilities: [
      'Lead and mentor junior developers',
      'Architect scalable system solutions',
      'Manage deployment pipelines and CI/CD processes',
      'Conduct technical interviews and hiring decisions'
    ],
    additionalResponsibilities: [
      'Database administration and optimization',
      'Technical documentation and user guides',
      'Client communication and requirement gathering',
      'Performance monitoring and analytics implementation'
    ]
  }
};

export default sampleEnhancedAnalysisData;