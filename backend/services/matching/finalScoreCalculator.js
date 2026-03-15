/**
 * Final Score Calculator Module
 * 
 * Combines individual matcher scores using weighted formula to produce final match score.
 * Weights: Skills (40%), Experience (30%), Education (15%), Responsibilities (15%)
 */

const WEIGHTS = {
  skills: 0.40,
  experience: 0.30,
  education: 0.15,
  responsibilities: 0.15
};

/**
 * Validates and normalizes a score value
 * @param {*} score - Score to validate
 * @returns {number} - Valid score between 0-100, or 0 if invalid
 */
function validateScore(score) {
  // Treat invalid inputs as 0
  if (score === null || score === undefined || typeof score !== 'number' || isNaN(score)) {
    return 0;
  }
  
  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates final weighted match score from individual criterion scores
 * 
 * @param {number} skillScore - Score from skill matcher (0-100)
 * @param {number} experienceScore - Score from experience matcher (0-100)
 * @param {number} educationScore - Score from education matcher (0-100)
 * @param {number} responsibilityScore - Score from responsibility matcher (0-100)
 * @returns {Object} Result object with finalScore, breakdown, and weights
 */
function calculateFinalScore(skillScore, experienceScore, educationScore, responsibilityScore) {
  // Validate and normalize all input scores
  const validSkillScore = validateScore(skillScore);
  const validExperienceScore = validateScore(experienceScore);
  const validEducationScore = validateScore(educationScore);
  const validResponsibilityScore = validateScore(responsibilityScore);
  
  // Apply weighted formula
  const finalScore = 
    (WEIGHTS.skills * validSkillScore) +
    (WEIGHTS.experience * validExperienceScore) +
    (WEIGHTS.education * validEducationScore) +
    (WEIGHTS.responsibilities * validResponsibilityScore);
  
  // Round to 2 decimal places
  const roundedScore = Math.round(finalScore * 100) / 100;
  
  // Clamp result between 0 and 100 (should already be in range, but ensure)
  const clampedScore = Math.max(0, Math.min(100, roundedScore));
  
  return {
    finalScore: clampedScore,
    breakdown: {
      skills: validSkillScore,
      experience: validExperienceScore,
      education: validEducationScore,
      responsibilities: validResponsibilityScore
    },
    weights: {
      skills: WEIGHTS.skills,
      experience: WEIGHTS.experience,
      education: WEIGHTS.education,
      responsibilities: WEIGHTS.responsibilities
    }
  };
}

module.exports = {
  calculateFinalScore
};
