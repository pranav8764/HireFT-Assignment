/**
 * Experience Matcher Module
 * Extracts and compares years of experience from job descriptions and resumes
 */

/**
 * Extracts required years of experience from job description
 * @param {string} jobDescription - Full job posting text
 * @returns {number|null} Required years or null if not found
 */
function extractRequiredExperience(jobDescription) {
  if (!jobDescription || typeof jobDescription !== 'string') {
    return null;
  }

  // Pattern 1: "X+ years" or "X years"
  const pattern1 = /(\d+)\+?\s*years?/i;
  const match1 = jobDescription.match(pattern1);
  if (match1) {
    return parseInt(match1[1], 10);
  }

  // Pattern 2: "X-Y years" or "X to Y years" (use minimum value)
  const pattern2 = /(\d+)\s*[-to]+\s*(\d+)\s*years?/i;
  const match2 = jobDescription.match(pattern2);
  if (match2) {
    return parseInt(match2[1], 10); // Use minimum value
  }

  // Pattern 3: "X years of experience"
  const pattern3 = /(\d+)\s*years?\s+of\s+experience/i;
  const match3 = jobDescription.match(pattern3);
  if (match3) {
    return parseInt(match3[1], 10);
  }

  return null;
}

/**
 * Extracts total years of experience from resume text
 * @param {string} resumeText - Full resume text
 * @returns {number} Total years of experience (0 if not found)
 */
function extractCandidateExperience(resumeText) {
  if (!resumeText || typeof resumeText !== 'string') {
    return 0;
  }

  let totalYears = 0;

  // Pattern 1: Explicit "X years of experience"
  const explicitPattern = /(\d+)\+?\s*years?\s+of\s+experience/i;
  const explicitMatch = resumeText.match(explicitPattern);
  if (explicitMatch) {
    return parseInt(explicitMatch[1], 10);
  }

  // Pattern 2: Date ranges (YYYY-YYYY, YYYY-Present, Mon YYYY - Mon YYYY)
  const dateRangePatterns = [
    /(\d{4})\s*[-–—]\s*(\d{4})/g,           // 2018-2023
    /(\d{4})\s*[-–—]\s*present/gi,          // 2018-Present
    /(\d{4})\s*[-–—]\s*current/gi,          // 2018-Current
    /\w+\s+(\d{4})\s*[-–—]\s*\w+\s+(\d{4})/g, // Jan 2018 - Dec 2023
    /\w+\s+(\d{4})\s*[-–—]\s*present/gi,    // Jan 2018 - Present
  ];

  const currentYear = new Date().getFullYear();
  const processedRanges = new Set();

  dateRangePatterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern);
    while ((match = regex.exec(resumeText)) !== null) {
      const rangeKey = match[0];
      if (processedRanges.has(rangeKey)) continue;
      processedRanges.add(rangeKey);

      let startYear, endYear;

      if (match[0].toLowerCase().includes('present') || match[0].toLowerCase().includes('current')) {
        startYear = parseInt(match[1], 10);
        endYear = currentYear;
      } else if (match[2]) {
        startYear = parseInt(match[1], 10);
        endYear = parseInt(match[2], 10);
      } else {
        continue;
      }

      if (startYear && endYear && startYear <= endYear) {
        totalYears += (endYear - startYear);
      }
    }
  });

  return totalYears;
}

/**
 * Calculates experience match score
 * @param {string} jobDescription - Full job posting text
 * @param {string} resumeText - Full resume text
 * @returns {Object} Experience match result
 */
function calculateExperienceMatch(jobDescription, resumeText) {
  // Validate inputs (Requirement 9.2)
  if (!jobDescription || typeof jobDescription !== 'string') {
    console.warn('Invalid jobDescription provided to experienceMatcher');
    return {
      score: 0,
      requiredYears: null,
      candidateYears: null,
      meetsRequirement: false
    };
  }

  if (!resumeText || typeof resumeText !== 'string') {
    console.warn('Invalid resumeText provided to experienceMatcher');
    return {
      score: 0,
      requiredYears: null,
      candidateYears: null,
      meetsRequirement: false
    };
  }

  const requiredYears = extractRequiredExperience(jobDescription);
  const candidateYears = extractCandidateExperience(resumeText);

  let score;
  let meetsRequirement;

  // Edge case: no requirement found (score 100)
  if (requiredYears === null) {
    score = 100.0;
    meetsRequirement = true;
  }
  // Edge case: no experience (score 0)
  else if (candidateYears === 0 || candidateYears === null) {
    score = 0.0;
    meetsRequirement = false;
  }
  // Calculate score as min(candidate / required, 1.0) × 100
  else {
    const ratio = Math.min(candidateYears / requiredYears, 1.0);
    score = ratio * 100;
    meetsRequirement = candidateYears >= requiredYears;
  }

  // Round score to 2 decimal places
  score = Math.round(score * 100) / 100;

  return {
    score,
    requiredYears,
    candidateYears,
    meetsRequirement
  };
}

module.exports = {
  calculateExperienceMatch,
  extractRequiredExperience,
  extractCandidateExperience
};
