/**
 * Match Engine Service
 * Orchestrates multi-factor matching across skills, experience, education, and responsibilities
 */

const skillMatcher = require('./matching/skillMatcher');
const experienceMatcher = require('./matching/experienceMatcher');
const educationMatcher = require('./matching/educationMatcher');
const responsibilityMatcher = require('./matching/responsibilityMatcher');
const finalScoreCalculator = require('./matching/finalScoreCalculator');

/**
 * Calculates comprehensive match between job and resume across multiple factors
 * @param {string[]} jobSkills - Array of skills from job posting
 * @param {string[]} resumeSkills - Array of skills from resume
 * @param {string} jobDescription - Full job posting text
 * @param {string} resumeText - Full resume text
 * @returns {Object} MatchResult with matchScore, breakdown, matchingSkills, missingSkills, missingRequirements, etc.
 */
function calculateMatch(jobSkills, resumeSkills, jobDescription, resumeText) {
  // Validate all input parameters are defined
  if (!Array.isArray(jobSkills)) jobSkills = [];
  if (!Array.isArray(resumeSkills)) resumeSkills = [];
  if (typeof jobDescription !== 'string') jobDescription = '';
  if (typeof resumeText !== 'string') resumeText = '';

  // Initialize default scores
  let skillResult = { score: 0, matchingSkills: [], missingSkills: [] };
  let experienceResult = { score: 0, requiredYears: null, candidateYears: null, meetsRequirement: false };
  let educationResult = { score: 0, requiredLevel: null, candidateLevel: null, meetsRequirement: false };
  let responsibilityResult = { score: 0, matchingKeywords: [], missingKeywords: [], totalJobKeywords: 0 };

  // Invoke skillMatcher with error handling
  try {
    skillResult = skillMatcher.calculateSkillMatch(jobSkills, resumeSkills);
  } catch (error) {
    console.error('Error in skillMatcher:', error);
    skillResult = { score: 0, matchingSkills: [], missingSkills: jobSkills };
  }

  // Invoke experienceMatcher with error handling
  try {
    experienceResult = experienceMatcher.calculateExperienceMatch(jobDescription, resumeText);
  } catch (error) {
    console.error('Error in experienceMatcher:', error);
    experienceResult = { score: 0, requiredYears: null, candidateYears: null, meetsRequirement: false };
  }

  // Invoke educationMatcher with error handling
  try {
    educationResult = educationMatcher.calculateEducationMatch(jobDescription, resumeText);
  } catch (error) {
    console.error('Error in educationMatcher:', error);
    educationResult = { score: 0, requiredLevel: null, candidateLevel: null, meetsRequirement: false };
  }

  // Invoke responsibilityMatcher with error handling
  try {
    responsibilityResult = responsibilityMatcher.calculateResponsibilityMatch(jobDescription, resumeText);
  } catch (error) {
    console.error('Error in responsibilityMatcher:', error);
    responsibilityResult = { score: 0, matchingKeywords: [], missingKeywords: [], totalJobKeywords: 0 };
  }

  // Calculate final weighted score
  let finalResult;
  try {
    finalResult = finalScoreCalculator.calculateFinalScore(
      skillResult.score,
      experienceResult.score,
      educationResult.score,
      responsibilityResult.score
    );
  } catch (error) {
    console.error('Error in finalScoreCalculator:', error);
    finalResult = {
      finalScore: 0,
      breakdown: {
        skills: 0,
        experience: 0,
        education: 0,
        responsibilities: 0
      },
      weights: {
        skills: 0.40,
        experience: 0.30,
        education: 0.15,
        responsibilities: 0.15
      }
    };
  }

  // Construct comprehensive result object
  return {
    // Final weighted score
    matchScore: finalResult.finalScore,
    
    // Backward compatibility: skill matching details
    matchingSkills: skillResult.matchingSkills,
    missingSkills: skillResult.missingSkills,
    totalJobSkills: jobSkills.length,
    totalResumeSkills: resumeSkills.length,
    
    // Score breakdown by criterion
    breakdown: finalResult.breakdown,
    
    // Detailed factor information for frontend display
    experienceDetails: {
      score: experienceResult.score,
      requiredYears: experienceResult.requiredYears,
      candidateYears: experienceResult.candidateYears,
      meetsRequirement: experienceResult.meetsRequirement
    },
    educationDetails: {
      score: educationResult.score,
      requiredDegree: educationResult.requiredLevel,
      candidateDegree: educationResult.candidateLevel,
      meetsRequirement: educationResult.meetsRequirement
    },
    responsibilityDetails: {
      score: responsibilityResult.score,
      matchingResponsibilities: responsibilityResult.matchingKeywords,
      missingResponsibilities: responsibilityResult.missingKeywords,
      totalJobKeywords: responsibilityResult.totalJobKeywords
    }
  };
}

module.exports = {
  calculateMatch
};
