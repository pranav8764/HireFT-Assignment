/**
 * Test script for the new multi-layer scraping system
 * Run with: node test-scraper.js
 */

const { scrapeJob } = require('./services/jobScraper');

// Test URLs for different platforms
const testUrls = {
  greenhouse: 'https://boards.greenhouse.io/embed/job_app?token=4389798005',
  lever: 'https://jobs.lever.co/example/job-id',
  microsoft: 'https://careers.microsoft.com/us/en/job/1770393/Software-Engineer',
  generic: 'https://www.example.com/careers/job'
};

async function testScraper() {
  console.log('🧪 Testing Multi-Layer Job Scraper\n');
  console.log('=' .repeat(60));

  // Test with Microsoft URL (from user's example)
  const testUrl = 'https://careers.microsoft.com/us/en/job/1770393/Software-Engineer';
  
  try {
    console.log(`\n📝 Testing URL: ${testUrl}\n`);
    
    const result = await scrapeJob(testUrl);
    
    console.log('\n✅ SCRAPING SUCCESSFUL!\n');
    console.log('=' .repeat(60));
    console.log(`Title: ${result.title || 'N/A'}`);
    console.log(`Company: ${result.company || 'N/A'}`);
    console.log(`Platform: ${result.platform}`);
    console.log(`Description Length: ${result.description.length} characters`);
    console.log('\nSections Found:');
    console.log(`  - Responsibilities: ${result.sections.responsibilities ? 'Yes' : 'No'}`);
    console.log(`  - Requirements: ${result.sections.requirements ? 'Yes' : 'No'}`);
    console.log(`  - Qualifications: ${result.sections.qualifications ? 'Yes' : 'No'}`);
    console.log(`  - Benefits: ${result.sections.benefits ? 'Yes' : 'No'}`);
    console.log('\nFirst 200 characters of description:');
    console.log(result.description.substring(0, 200) + '...');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('\n❌ SCRAPING FAILED!');
    console.error(`Error: ${error.message}`);
    console.error('=' .repeat(60));
  }

  // Close Puppeteer browser if it was opened
  const { closeBrowser } = require('./services/scraper/renderPage');
  await closeBrowser();
  
  console.log('\n✅ Test complete!');
  process.exit(0);
}

// Run the test
testScraper();
