/**
 * Platform Detection Module
 * Detects the job board platform based on URL patterns
 */

/**
 * Detects the job board platform from a URL
 * @param {string} url - The job posting URL
 * @returns {string} Platform identifier: 'greenhouse', 'lever', 'ashby', or 'generic'
 */
function detectPlatform(url) {
  const urlLower = url.toLowerCase();

  // Greenhouse detection
  if (urlLower.includes('greenhouse.io') || 
      urlLower.includes('boards.greenhouse.io') ||
      urlLower.includes('grnh.se')) {
    console.log('🏢 Detected platform: Greenhouse');
    return 'greenhouse';
  }

  // Lever detection
  if (urlLower.includes('lever.co') || 
      urlLower.includes('jobs.lever.co')) {
    console.log('🏢 Detected platform: Lever');
    return 'lever';
  }

  // Ashby detection
  if (urlLower.includes('ashbyhq.com') || 
      urlLower.includes('jobs.ashbyhq.com')) {
    console.log('🏢 Detected platform: Ashby');
    return 'ashby';
  }

  // Generic fallback
  console.log('🏢 Detected platform: Generic');
  return 'generic';
}

module.exports = { detectPlatform };
