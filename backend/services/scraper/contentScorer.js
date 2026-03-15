/**
 * Content Scoring System
 * Finds the most likely job description block using heuristics
 */

/**
 * Keywords that indicate job description content
 */
const JOB_KEYWORDS = [
  'responsibilities', 'requirements', 'qualifications', 'experience',
  'skills', 'duties', 'role', 'position', 'candidate', 'must have',
  'should have', 'preferred', 'required', 'years', 'degree', 'bachelor',
  'master', 'education', 'benefits', 'salary', 'compensation', 'team',
  'work', 'job', 'apply', 'hiring'
];

/**
 * Scores an element based on likelihood of containing job description
 * @param {Cheerio} element - Cheerio element to score
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {number} Score (higher is better)
 */
function scoreElement(element, $) {
  const text = $(element).text().toLowerCase();
  const textLength = text.length;

  // Base score from text length (longer is generally better)
  let score = Math.min(textLength / 100, 100);

  // Bonus points for job-related keywords
  let keywordCount = 0;
  for (const keyword of JOB_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      keywordCount += matches.length;
    }
  }
  score += keywordCount * 5;

  // Penalty for very short content
  if (textLength < 200) {
    score *= 0.1;
  }

  // Penalty for navigation/header/footer elements
  const className = $(element).attr('class') || '';
  const id = $(element).attr('id') || '';
  const combined = (className + ' ' + id).toLowerCase();
  
  if (combined.includes('nav') || combined.includes('header') || 
      combined.includes('footer') || combined.includes('sidebar') ||
      combined.includes('menu')) {
    score *= 0.1;
  }

  return score;
}

/**
 * Finds the element most likely to contain the job description
 * @param {CheerioAPI} $ - Cheerio instance loaded with HTML
 * @returns {string} Text content of the highest scoring element
 */
function findBestContent($) {
  console.log('🎯 Scoring content blocks to find job description...');

  const candidates = ['div', 'section', 'article', 'main'];
  let bestScore = 0;
  let bestElement = null;

  // Score all candidate elements
  candidates.forEach(tag => {
    $(tag).each((i, element) => {
      const score = scoreElement(element, $);
      
      if (score > bestScore) {
        bestScore = score;
        bestElement = element;
      }
    });
  });

  if (bestElement) {
    const text = $(bestElement).text().trim();
    console.log(`✅ Found best content block (score: ${bestScore.toFixed(2)}, length: ${text.length})`);
    return text;
  }

  console.log('⚠️  No suitable content block found, using body text');
  return $('body').text().trim();
}

module.exports = { findBestContent, scoreElement };
