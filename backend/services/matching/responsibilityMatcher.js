/**
 * Responsibility Matcher Module
 * 
 * Compares job responsibilities with resume work experience using keyword extraction and matching.
 * Extracts meaningful keywords from both texts, filters stop words, and calculates match percentage.
 */

// Stop words to filter out (common words with low semantic value)
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
]);

/**
 * Extracts meaningful keywords from text
 * @param {string} text - Text to extract keywords from
 * @returns {string[]} - Array of unique keywords
 */
function extractKeywords(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Convert to lowercase and split into words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(word => word.length > 0);

  // Filter out stop words and words shorter than 3 characters
  const keywords = words.filter(word => 
    word.length >= 3 && !STOP_WORDS.has(word)
  );

  // Return unique keywords
  return [...new Set(keywords)];
}

/**
 * Calculates responsibility match score between job description and resume
 * @param {string} jobDescription - Full job posting text
 * @param {string} resumeText - Full resume text
 * @returns {Object} - Match result with score and keyword details
 */
function calculateResponsibilityMatch(jobDescription, resumeText) {
  // Validate inputs
  if (!jobDescription || typeof jobDescription !== 'string') {
    console.warn('Invalid job description provided to responsibilityMatcher');
    return {
      score: 0,
      matchingKeywords: [],
      missingKeywords: [],
      totalJobKeywords: 0
    };
  }

  if (!resumeText || typeof resumeText !== 'string') {
    console.warn('Invalid resume text provided to responsibilityMatcher');
    return {
      score: 0,
      matchingKeywords: [],
      missingKeywords: [],
      totalJobKeywords: 0
    };
  }

  // Extract keywords from both texts
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);

  // Handle edge case: no job keywords found
  if (jobKeywords.length === 0) {
    return {
      score: 100,
      matchingKeywords: [],
      missingKeywords: [],
      totalJobKeywords: 0
    };
  }

  // Convert to Sets for efficient matching (case-insensitive already handled)
  const jobKeywordSet = new Set(jobKeywords);
  const resumeKeywordSet = new Set(resumeKeywords);

  // Calculate matching and missing keywords
  const matchingKeywords = jobKeywords.filter(keyword => 
    resumeKeywordSet.has(keyword)
  );
  
  const missingKeywords = jobKeywords.filter(keyword => 
    !resumeKeywordSet.has(keyword)
  );

  // Calculate score: (matching / total) × 100
  const score = (matchingKeywords.length / jobKeywords.length) * 100;

  // Round to 2 decimal places
  const roundedScore = Math.round(score * 100) / 100;

  return {
    score: roundedScore,
    matchingKeywords,
    missingKeywords,
    totalJobKeywords: jobKeywords.length
  };
}

module.exports = {
  calculateResponsibilityMatch,
  extractKeywords, // Export for testing
  STOP_WORDS // Export for testing
};
