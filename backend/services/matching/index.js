/**
 * Matching Module Exports
 * 
 * Central export point for all matcher modules in the multi-factor matching engine.
 * 
 * @module matching
 */

const { calculateSkillMatch } = require('./skillMatcher');
const { calculateExperienceMatch } = require('./experienceMatcher');
const { calculateEducationMatch, EDUCATION_LEVELS } = require('./educationMatcher');
const { calculateResponsibilityMatch, STOP_WORDS } = require('./responsibilityMatcher');
const { calculateFinalScore, WEIGHTS } = require('./finalScoreCalculator');

module.exports = {
  // Matcher functions
  calculateSkillMatch,
  calculateExperienceMatch,
  calculateEducationMatch,
  calculateResponsibilityMatch,
  calculateFinalScore,
  
  // Constants
  EDUCATION_LEVELS,
  STOP_WORDS,
  WEIGHTS
};
