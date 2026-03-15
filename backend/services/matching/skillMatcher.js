/**
 * Skill Matcher Module
 * 
 * Compares job-required skills with resume skills to calculate skill match percentage.
 * Implements case-insensitive skill comparison using Sets.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

/**
 * Calculate skill match score between job requirements and resume skills
 * 
 * @param {Array<string>} jobSkills - Skills extracted from job description
 * @param {Array<string>} resumeSkills - Skills extracted from resume
 * @returns {Object} Result object containing score, matchingSkills, and missingSkills
 */
function calculateSkillMatch(jobSkills, resumeSkills) {
  // Validate inputs - default to empty arrays if invalid (Requirement 9.1)
  const validJobSkills = Array.isArray(jobSkills) ? jobSkills : [];
  const validResumeSkills = Array.isArray(resumeSkills) ? resumeSkills : [];

  // Handle edge case: empty job skills array returns score of 0 (Requirement 1.5)
  if (validJobSkills.length === 0) {
    return {
      score: 0,
      matchingSkills: [],
      missingSkills: []
    };
  }

  // Convert to lowercase Sets for case-insensitive comparison (Requirement 1.6)
  const jobSkillsLower = new Set(validJobSkills.map(skill => skill.toLowerCase()));
  const resumeSkillsLower = new Set(validResumeSkills.map(skill => skill.toLowerCase()));

  // Calculate matching skills - intersection (Requirement 1.2)
  const matchingSkills = [];
  const matchingSkillsLower = new Set();
  
  for (const skill of jobSkillsLower) {
    if (resumeSkillsLower.has(skill)) {
      matchingSkillsLower.add(skill);
      // Find original casing from job skills for display
      const originalSkill = validJobSkills.find(s => s.toLowerCase() === skill);
      matchingSkills.push(originalSkill);
    }
  }

  // Calculate missing skills - set difference (Requirement 1.3)
  const missingSkills = [];
  
  for (const skill of jobSkillsLower) {
    if (!matchingSkillsLower.has(skill)) {
      // Find original casing from job skills for display
      const originalSkill = validJobSkills.find(s => s.toLowerCase() === skill);
      missingSkills.push(originalSkill);
    }
  }

  // Calculate score as (matching / total) × 100 (Requirement 1.1)
  const rawScore = (matchingSkills.length / validJobSkills.length) * 100;
  
  // Round score to 2 decimal places
  const score = Math.round(rawScore * 100) / 100;

  return {
    score,
    matchingSkills,
    missingSkills
  };
}

module.exports = {
  calculateSkillMatch
};
