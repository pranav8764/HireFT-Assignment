/**
 * Fetch Page Module
 * Fetches raw HTML from URLs with retry logic and proper headers
 */

const axios = require('axios');

/**
 * Fetches HTML content from a URL with retry logic
 * @param {string} url - The URL to fetch
 * @param {number} retries - Number of retry attempts (default: 3)
 * @returns {Promise<string>} Raw HTML content
 */
async function fetchPage(url, retries = 3) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🌐 Fetching page (attempt ${attempt}/${retries}): ${url}`);
      
      const response = await axios.get(url, {
        timeout: 15000, // 15 second timeout
        headers,
        maxRedirects: 5,
        validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
      });

      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}: Unable to fetch page`);
      }

      console.log(`✅ Page fetched successfully (${response.data.length} bytes)`);
      return response.data;

    } catch (error) {
      console.log(`❌ Fetch attempt ${attempt} failed: ${error.message}`);

      // If this was the last retry, throw the error
      if (attempt === retries) {
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          throw new Error(`Unable to connect to ${url}`);
        }
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
          throw new Error(`Request timeout while accessing ${url}`);
        }
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

module.exports = { fetchPage };
