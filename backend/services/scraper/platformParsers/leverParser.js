/**
 * Lever Parser
 * Extracts job data from Lever job boards
 */

/**
 * Parses a Lever job posting
 * @param {CheerioAPI} $ - Cheerio instance loaded with HTML
 * @returns {Object} Parsed job data
 */
function parseLever($) {
  console.log('🎚️  Parsing Lever job posting...');

  // Extract title
  let title = null;
  const titleSelectors = [
    '.posting-headline h2',
    '.posting-headline',
    'h2[data-qa="posting-name"]',
    'h1',
    '.job-title'
  ];
  
  for (const selector of titleSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      title = element.text().trim();
      break;
    }
  }

  // Extract company name
  let company = null;
  const companySelectors = [
    '.main-header-text-logo',
    '.company-name',
    'meta[property="og:site_name"]',
    '[data-qa="company-name"]'
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

  // Extract description
  let description = '';
  const descriptionSelectors = [
    '.posting',
    '.posting-description',
    '.content',
    'main',
    '.job-description'
  ];
  
  for (const selector of descriptionSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim().length > 100) {
      description = element.text().trim();
      break;
    }
  }

  console.log(`✅ Lever parsing complete - Title: ${title || 'N/A'}`);

  return {
    title,
    company,
    description
  };
}

module.exports = { parseLever };
