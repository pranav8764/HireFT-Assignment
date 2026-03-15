/**
 * Dynamic Page Renderer
 * Uses Puppeteer to render JavaScript-heavy pages
 */

const puppeteer = require('puppeteer');

let browser = null;

/**
 * Gets or creates a browser instance
 * @returns {Promise<Browser>} Puppeteer browser instance
 */
async function getBrowser() {
  if (!browser || !browser.isConnected()) {
    console.log('🚀 Launching Puppeteer browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
  }
  return browser;
}

/**
 * Renders a dynamic page using Puppeteer
 * @param {string} url - The URL to render
 * @returns {Promise<string>} Rendered HTML content
 */
async function renderPage(url) {
  let page = null;
  
  try {
    console.log(`🎭 Rendering dynamic page: ${url}`);
    
    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Navigate to page and wait for network to be idle
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait a bit more for any lazy-loaded content
    await page.waitForTimeout(2000);

    // Get the rendered HTML
    const html = await page.content();
    
    console.log(`✅ Page rendered successfully (${html.length} bytes)`);
    return html;

  } catch (error) {
    console.error(`❌ Puppeteer render error: ${error.message}`);
    throw new Error(`Failed to render dynamic page: ${error.message}`);
  } finally {
    if (page) {
      await page.close();
    }
  }
}

/**
 * Closes the browser instance
 */
async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

module.exports = { renderPage, closeBrowser };
