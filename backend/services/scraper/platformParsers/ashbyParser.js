/**
 * Ashby Parser
 * Extracts job data from Ashby job boards
 */

/**
 * Parses an Ashby job posting
 * @param {CheerioAPI} $ - Cheerio instance loaded with HTML
 * @returns {Object} Parsed job data
 */
function parseAshby($) {
  console.log('📋 Parsing Ashby job posting...');

  // Extract title
  let title = null;
  const titleSelectors = [
    'h1',
    '.ashby-job-posting-heading',
    '[data-testid="job-title"]',
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
    '.company-name',
    'meta[property="og:site_name"]',
    '[data-testid="company-name"]'
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
    '.ashby-job-posting',
    '.ashby-job-posting-brief-content',
    'main',
    '.content',
    '.job-description'
  ];
  
  for (const selector of descriptionSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim().length > 100) {
      description = element.text().trim();
      break;
    }
  }

  console.log(`✅ Ashby parsing complete - Title: ${title || 'N/A'}`);

  return {
    title,
    company,
    description
  };
}

module.exports = { parseAshby };
