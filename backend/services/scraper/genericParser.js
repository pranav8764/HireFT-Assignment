/**
 * Generic Parser
 * Fallback extraction for unknown career pages
 */

const { findBestContent } = require('./contentScorer');

/**
 * Parses a generic job posting page
 * @param {CheerioAPI} $ - Cheerio instance loaded with HTML
 * @returns {Object} Parsed job data
 */
function parseGeneric($) {
  console.log('🔍 Parsing generic job posting...');

  // Extract title
  let title = null;
  const titleSelectors = [
    'h1',
    '.job-title',
    '.jobTitle',
    '[class*="title"]',
    '[class*="Title"]',
    '[data-job-title]',
    'title'
  ];
  
  for (const selector of titleSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      title = element.text().trim();
      // Don't use page title if it's too long or contains site name
      if (selector === 'title' && title.length > 100) {
        continue;
      }
      break;
    }
  }

  // Extract company name
  let company = null;
  const companySelectors = [
    '.company-name',
    '.companyName',
    '[class*="company"]',
    '[class*="Company"]',
    '[data-company]',
    'meta[property="og:site_name"]'
  ];
  
  for (const selector of companySelectors) {
    if (selector.startsWith('meta')) {
      const content = $(selector).attr('content');
      if (content) {
        company = content.trim();
        break;
      }
    } else {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        company = element.text().trim();
        break;
      }
    }
  }

  // Extract description - try multiple selectors
  let description = '';
  const descriptionSelectors = [
    '.job-description',
    '.jobDescription',
    '[class*="description"]',
    '[class*="Description"]',
    '.description',
    'main',
    'article',
    '[role="main"]',
    '#content',
    '.content'
  ];
  
  for (const selector of descriptionSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim().length > 100) {
      description = element.text().trim();
      break;
    }
  }

  // If no description found using selectors, use content scorer
  if (!description || description.length < 200) {
    console.log('⚠️  Standard selectors failed, using content scorer...');
    description = findBestContent($);
  }

  console.log(`✅ Generic parsing complete - Title: ${title || 'N/A'}`);

  return {
    title,
    company,
    description
  };
}

module.exports = { parseGeneric };
