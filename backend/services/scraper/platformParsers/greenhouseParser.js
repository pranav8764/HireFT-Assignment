/**
 * Greenhouse Parser
 * Extracts job data from Greenhouse job boards
 */

/**
 * Parses a Greenhouse job posting
 * @param {CheerioAPI} $ - Cheerio instance loaded with HTML
 * @returns {Object} Parsed job data
 */
function parseGreenhouse($) {
  console.log('🌿 Parsing Greenhouse job posting...');

  // Extract title
  let title = null;
  const titleSelectors = [
    '.app-title',
    'h1.app-title',
    '.job-title',
    'h1',
    '[data-qa="job-title"]'
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
    '.company-name',
    '[data-qa="company-name"]',
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

  // Extract description
  let description = '';
  const descriptionSelectors = [
    '#content',
    '.content',
    '.job-post',
    '#app',
    'main'
  ];
  
  for (const selector of descriptionSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim().length > 100) {
      description = element.text().trim();
      break;
    }
  }

  console.log(`✅ Greenhouse parsing complete - Title: ${title || 'N/A'}`);

  return {
    title,
    company,
    description
  };
}

module.exports = { parseGreenhouse };
