/**
 * Education Matcher Module
 * Compares education requirements with candidate qualifications using a ranked level system.
 */

const EDUCATION_LEVELS = {
  'PhD': 4,
  'Doctorate': 4,
  'Masters': 3,
  'Master': 3,
  'Bachelors': 2,
  'Bachelor': 2,
  'Diploma': 1,
  'Associate': 1,
  'None': 0
};

/**
 * Extract education level from text using keyword matching
 * @param {string} text - Text to search for education keywords
 * @returns {string|null} - Standardized education level or null if not found
 */
function extractEducationLevel(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const lowerText = text.toLowerCase();
  
  // Check for PhD/Doctorate (highest priority)
  if (lowerText.match(/\b(phd|ph\.d\.|doctorate|doctoral)\b/i)) {
    return 'PhD';
  }
  
  // Check for Masters
  if (lowerText.match(/\b(masters?|master'?s?|m\.s\.|m\.a\.|mba)\b/i)) {
    return 'Masters';
  }
  
  // Check for Bachelors
  if (lowerText.match(/\b(bachelors?|bachelor'?s?|b\.s\.|b\.a\.|b\.sc\.|undergraduate)\b/i)) {
    return 'Bachelors';
  }
  
  // Check for Diploma/Associate
  if (lowerText.match(/\b(diploma|associate|a\.s\.|a\.a\.)\b/i)) {
    return 'Diploma';
  }
  
  return null;
}

/**
 * Calculate education match score between job requirements and candidate qualifications
 * @param {string} jobDescription - Full job posting text
 * @param {string} resumeText - Full resume text
 * @returns {Object} Education match result with score and details
 */
function calculateEducationMatch(jobDescription, resumeText) {
  // Validate inputs (Requirement 9.2)
  if (!jobDescription || typeof jobDescription !== 'string') {
    console.warn('Invalid jobDescription provided to educationMatcher');
    return {
      score: 0,
      requiredLevel: null,
      candidateLevel: null,
      meetsRequirement: false
    };
  }

  if (!resumeText || typeof resumeText !== 'string') {
    console.warn('Invalid resumeText provided to educationMatcher');
    return {
      score: 0,
      requiredLevel: null,
      candidateLevel: null,
      meetsRequirement: false
    };
  }

  // Extract education levels
  const requiredLevel = extractEducationLevel(jobDescription);
  const candidateLevel = extractEducationLevel(resumeText) || 'None';
  
  // If no requirement found, return perfect score
  if (!requiredLevel) {
    return {
      score: 100.00,
      requiredLevel: null,
      candidateLevel: candidateLevel,
      meetsRequirement: true
    };
  }
  
  // Get numeric ranks
  const requiredRank = EDUCATION_LEVELS[requiredLevel];
  const candidateRank = EDUCATION_LEVELS[candidateLevel];
  
  // Calculate score
  let score;
  let meetsRequirement;
  
  if (candidateRank >= requiredRank) {
    // Candidate meets or exceeds requirement
    score = 100.00;
    meetsRequirement = true;
  } else {
    // Candidate below requirement
    score = requiredRank > 0 ? (candidateRank / requiredRank) * 100 : 0;
    meetsRequirement = false;
  }
  
  // Round to 2 decimal places
  score = Math.round(score * 100) / 100;
  
  return {
    score,
    requiredLevel,
    candidateLevel,
    meetsRequirement
  };
}

module.exports = {
  calculateEducationMatch,
  EDUCATION_LEVELS
};
