/**
 * Match Engine Service
 * Compares job and resume skills, calculates compatibility
 */

/**
 * Calculates match between job skills and resume skills
 * @param {string[]} jobSkills - Array of skills from job posting
 * @param {string[]} resumeSkills - Array of skills from resume
 * @returns {Object} MatchResult with matchingSkills, missingSkills, matchScore, etc.
 */
function calculateMatch(jobSkills, resumeSkills) {
  // Validate inputs
  if (!Array.isArray(jobSkills)) jobSkills = [];
  if (!Array.isArray(resumeSkills)) resumeSkills = [];

  // Convert skill arrays to Sets for efficient lookup
  const jobSkillsSet = new Set(jobSkills.map(skill => skill.toLowerCase()));
  const resumeSkillsSet = new Set(resumeSkills.map(skill => skill.toLowerCase()));

  // Calculate matching skills (intersection of both sets)
  const matchingSkills = [];
  for (const skill of jobSkills) {
    if (resumeSkillsSet.has(skill.toLowerCase())) {
      matchingSkills.push(skill);
    }
  }

  // Calculate missing skills (job skills not in resume skills)
  const missingSkills = [];
  for (const skill of jobSkills) {
    if (!resumeSkillsSet.has(skill.toLowerCase())) {
      missingSkills.push(skill);
    }
  }

  // Calculate match score
  let matchScore = 0;
  if (jobSkills.length > 0) {
    matchScore = (matchingSkills.length / jobSkills.length) * 100;
    // Round to 2 decimal places
    matchScore = Math.round(matchScore * 100) / 100;
  }

  return {
    matchingSkills,
    missingSkills,
    matchScore,
    totalJobSkills: jobSkills.length,
    totalResumeSkills: resumeSkills.length
  };
}

module.exports = {
  calculateMatch
};
