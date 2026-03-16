/**
 * Responsibility Matcher Module
 *
 * Extracts responsibility phrases from job descriptions and compares them
 * against resume content using phrase-level keyword overlap scoring.
 * This avoids the noise of single-word token matching.
 */

// Stop words to filter out during phrase scoring
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'your', 'our', 'their', 'its', 'also', 'other', 'including', 'such',
  'well', 'able', 'new', 'use', 'used', 'using', 'work', 'working'
]);

/**
 * Extracts meaningful content words from a phrase for overlap scoring.
 * @param {string} phrase
 * @returns {Set<string>}
 */
function phraseWords(phrase) {
  return new Set(
    phrase.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 3 && !STOP_WORDS.has(w))
  );
}

/**
 * Extracts responsibility phrases from text.
 * Looks for bullet/numbered list items first, then falls back to sentences.
 * @param {string} text
 * @returns {string[]}
 */
function extractResponsibilityPhrases(text) {
  if (!text || typeof text !== 'string') return [];

  const phrases = [];

  // Match bullet/list items: lines starting with -, •, *, or a number
  const bulletPattern = /^[\s]*[-•*\u2022][\s]+(.+)$/gm;
  const numberedPattern = /^[\s]*\d+[.)]\s+(.+)$/gm;

  let match;
  while ((match = bulletPattern.exec(text)) !== null) {
    const phrase = match[1].trim();
    if (phrase.length > 10) phrases.push(phrase);
  }
  while ((match = numberedPattern.exec(text)) !== null) {
    const phrase = match[1].trim();
    if (phrase.length > 10) phrases.push(phrase);
  }

  // If no list items found, split into sentences as fallback
  if (phrases.length === 0) {
    const sentences = text
      .split(/[.;\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 15 && s.split(/\s+/).length >= 3);
    phrases.push(...sentences);
  }

  // Deduplicate and cap to avoid noise
  return [...new Set(phrases)].slice(0, 50);
}

/**
 * Scores how well a job responsibility phrase is covered by resume text.
 * Uses word-overlap: if enough content words from the phrase appear in the resume,
 * it counts as a match.
 * @param {string} jobPhrase
 * @param {Set<string>} resumeWordSet - all content words from the resume
 * @returns {number} overlap ratio 0–1
 */
function phraseOverlapScore(jobPhrase, resumeWordSet) {
  const words = phraseWords(jobPhrase);
  if (words.size === 0) return 0;
  let hits = 0;
  for (const w of words) {
    if (resumeWordSet.has(w)) hits++;
  }
  return hits / words.size;
}

/**
 * Calculates responsibility match score between job description and resume.
 * @param {string} jobDescription
 * @param {string} resumeText
 * @returns {Object} match result with score and phrase-level details
 */
function calculateResponsibilityMatch(jobDescription, resumeText) {
  if (!jobDescription || typeof jobDescription !== 'string') {
    console.warn('Invalid job description provided to responsibilityMatcher');
    return { score: 0, matchingKeywords: [], missingKeywords: [], totalJobKeywords: 0 };
  }
  if (!resumeText || typeof resumeText !== 'string') {
    console.warn('Invalid resume text provided to responsibilityMatcher');
    return { score: 0, matchingKeywords: [], missingKeywords: [], totalJobKeywords: 0 };
  }

  const jobPhrases = extractResponsibilityPhrases(jobDescription);

  if (jobPhrases.length === 0) {
    return { score: 100, matchingKeywords: [], missingKeywords: [], totalJobKeywords: 0 };
  }

  // Build a set of all meaningful words from the resume for fast lookup
  const resumeWordSet = phraseWords(resumeText);

  // Threshold: a phrase is "matched" if >40% of its content words appear in the resume
  const MATCH_THRESHOLD = 0.4;

  const matchingPhrases = [];
  const missingPhrases = [];

  for (const phrase of jobPhrases) {
    const overlap = phraseOverlapScore(phrase, resumeWordSet);
    if (overlap >= MATCH_THRESHOLD) {
      matchingPhrases.push(phrase);
    } else {
      missingPhrases.push(phrase);
    }
  }

  const score = (matchingPhrases.length / jobPhrases.length) * 100;
  const roundedScore = Math.round(score * 100) / 100;

  return {
    score: roundedScore,
    matchingKeywords: matchingPhrases,
    missingKeywords: missingPhrases,
    totalJobKeywords: jobPhrases.length
  };
}

module.exports = {
  calculateResponsibilityMatch,
  extractResponsibilityPhrases,
  phraseOverlapScore,
  STOP_WORDS
};
