/**
 * Job Scraper Service - Production Multi-Layer Scraping System
 * Fetches and extracts content from job posting URLs
 * Supports: Greenhouse, Lever, Ashby, and generic career pages
 */

const cheerio = require('cheerio');
const { fetchPage } = require('./scraper/fetchPage');
const { renderPage } = require('./scraper/renderPage');
const { detectPlatform } = require('./scraper/detectPlatform');
const { parseGreenhouse } = require('./scraper/platformParsers/greenhouseParser');
const { parseLever } = require('./scraper/platformParsers/leverParser');
const { parseAshby } = require('./scraper/platformParsers/ashbyParser');
const { parseGeneric } = require('./scraper/genericParser');
const { extractSections } = require('./scraper/sectionExtractor');
const { cleanText } = require('./scraper/textCleaner');

/**
 * Determines if HTML content is too minimal (likely needs rendering)
 * @param {string} html - HTML content to check
 * @returns {boolean} True if content appears minimal/dynamic
 */
function isMinimalContent(html) {
  // Remove HTML tags and check text length
  const textContent = html.replace(/<[^>]*>/g, ' ').trim();
  const textLength = textContent.length;

  // If very little text content, likely a dynamic page
  if (textLength < 500) {
    return true;
  }

  // Check for common SPA indicators
  const spaIndicators = [
    'id="root"',
    'id="app"',
    'id="__next"',
    'data-reactroot',
    'ng-app',
    'v-app'
  ];

  const hasMinimalText = textLength < 2000;
  const hasSpaIndicator = spaIndicators.some(indicator => html.includes(indicator));

  return hasMinimalText && hasSpaIndicator;
}

/**
 * Scrapes job posting data from a URL using multi-layer architecture
 * @param {string} url - The job posting URL to scrape
 * @returns {Promise<Object>} JobData object with title, company, description, sections, platform, url
 */
async function scrapeJob(url) {
  try {
    console.log(`\n🚀 Starting multi-layer scrape for: ${url}`);

    // Step 1: Fetch page HTML
    let html = await fetchPage(url);

    // Step 2: Check if page needs rendering (dynamic content)
    if (isMinimalContent(html)) {
      console.log('⚡ Detected minimal content, rendering with Puppeteer...');
      try {
        html = await renderPage(url);
      } catch (renderError) {
        console.log('⚠️  Puppeteer rendering failed, continuing with static HTML');
        // Continue with original HTML if rendering fails
      }
    }

    // Step 3: Load HTML with Cheerio
    const $ = cheerio.load(html);

    // Step 4: Detect platform
    const platform = detectPlatform(url);

    // Step 5: Run platform-specific parser or generic parser
    let jobData;
    
    switch (platform) {
      case 'greenhouse':
        jobData = parseGreenhouse($);
        break;
      case 'lever':
        jobData = parseLever($);
        break;
      case 'ashby':
        jobData = parseAshby($);
        break;
      default:
        jobData = parseGeneric($);
    }

    // Step 6: Extract sections from description
    const sections = extractSections(jobData.description);

    // Step 7: Clean all text content
    const cleanedData = {
      title: cleanText(jobData.title || ''),
      company: cleanText(jobData.company || ''),
      description: cleanText(jobData.description || ''),
      sections: {
        responsibilities: cleanText(sections.responsibilities),
        requirements: cleanText(sections.requirements),
        qualifications: cleanText(sections.qualifications),
        benefits: cleanText(sections.benefits)
      },
      platform,
      url
    };

    // Step 8: Validate we got meaningful content
    if (!cleanedData.description || cleanedData.description.length < 100) {
      throw new Error('Unable to extract meaningful job description from page');
    }

    console.log(`✅ Scraping complete - Platform: ${platform}, Title: ${cleanedData.title || 'N/A'}`);
    console.log(`📊 Description length: ${cleanedData.description.length} characters\n`);

    return cleanedData;

  } catch (error) {
    console.error(`❌ Scraping failed: ${error.message}`);

    // Handle network errors
    if (error.message.includes('Unable to connect')) {
      throw new Error(`Unable to connect to ${url}: Network error`);
    }
    
    // Handle timeout errors
    if (error.message.includes('timeout')) {
      throw new Error(`Request timeout while accessing ${url}`);
    }

    // Handle HTTP errors
    if (error.message.includes('HTTP')) {
      throw error;
    }

    // Generic error
    throw new Error(`Failed to scrape job posting: ${error.message}`);
  }
}

module.exports = {
  scrapeJob
};
