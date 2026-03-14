/**
 * Job Scraper Service
 * Fetches and extracts content from job posting URLs
 */

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes job posting data from a URL
 * @param {string} url - The job posting URL to scrape
 * @returns {Promise<Object>} JobData object with title, company, description, url
 */
async function scrapeJob(url) {
  try {
    // Fetch HTML content with 10-second timeout
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract job title using common selectors
    let title = null;
    const titleSelectors = ['h1', '.job-title', '.jobTitle', '[class*="title"]', 'title'];
    for (const selector of titleSelectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        title = element.text().trim();
        break;
      }
    }

    // Extract company name using common selectors
    let company = null;
    const companySelectors = ['.company-name', '.companyName', '[class*="company"]', '[data-company]'];
    for (const selector of companySelectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim()) {
        company = element.text().trim();
        break;
      }
    }

    // Extract job description from main content area
    let description = '';
    const descriptionSelectors = ['main', '.description', '.job-description', '[class*="description"]', 'article', 'body'];
    for (const selector of descriptionSelectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim().length > 100) {
        description = element.text().trim();
        break;
      }
    }

    // If no description found, use body text as fallback
    if (!description) {
      description = $('body').text().trim();
    }

    return {
      title,
      company,
      description,
      url
    };

  } catch (error) {
    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error(`Unable to connect to ${url}: ${error.message}`);
    }
    
    // Handle timeout errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      throw new Error(`Request timeout while accessing ${url}`);
    }

    // Handle HTTP errors
    if (error.response) {
      throw new Error(`HTTP ${error.response.status}: Unable to fetch job posting`);
    }

    // Generic error
    throw new Error(`Failed to scrape job posting: ${error.message}`);
  }
}

module.exports = {
  scrapeJob
};
