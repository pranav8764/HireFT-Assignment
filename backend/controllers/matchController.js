/**
 * Match Controller
 * Handles job match analysis requests
 */

const jobScraper = require('../services/jobScraper');
const resumeParser = require('../services/resumeParser');
const skillExtractor = require('../services/skillExtractor');
const matchEngine = require('../services/matchEngine');
const aiSuggestions = require('../services/aiSuggestions');
const Analysis = require('../models/Analysis');

/**
 * Analyzes job posting and resume for skill matching
 * POST /api/analyze
 */
async function analyze(req, res) {
  try {
    // Request inputs are already validated by middleware
    const { jobUrl } = req.body;
    const resumeFile = req.file;

    console.log(`🔍 Starting analysis for job: ${jobUrl}`);

    // Step 1: Scrape job posting
    console.log('📄 Scraping job posting...');
    const jobData = await jobScraper.scrapeJob(jobUrl);

    // Step 2: Parse resume
    console.log('📋 Parsing resume...');
    const resumeText = await resumeParser.parseResume(resumeFile.buffer);
    // Step 3: Extract skills from job description
    console.log('🔧 Extracting job skills...');
    const jobSkills = skillExtractor.extractSkills(jobData.description);

    // Step 4: Extract skills from resume text
    console.log('🔧 Extracting resume skills...');
    const resumeSkills = skillExtractor.extractSkills(resumeText);

    // Step 5: Calculate match
    console.log('⚖️  Calculating match...');
    const matchResult = matchEngine.calculateMatch(jobSkills, resumeSkills);

    // Step 6: Generate AI suggestions
    console.log('🤖 Generating AI suggestions...');
    const suggestions = await aiSuggestions.generateSuggestions(
      jobData.description, 
      resumeText
    );

    // Step 7: Create Analysis document and save to database
    console.log('💾 Saving analysis to database...');
    const analysisData = {
      jobUrl: jobUrl.trim(),
      jobTitle: jobData.title,
      company: jobData.company,
      jobSkills,
      resumeSkills,
      matchScore: matchResult.matchScore,
      matchingSkills: matchResult.matchingSkills,
      missingSkills: matchResult.missingSkills,
      suggestions
    };

    let savedAnalysis;
    try {
      const analysis = new Analysis(analysisData);
      savedAnalysis = await analysis.save();
      console.log('✅ Analysis saved successfully');
    } catch (dbError) {
      // Log database save errors but still return results to user
      console.error('❌ Database save error:', dbError.message);
    }

    // Step 8: Return JSON response with success: true and complete analysis data
    const responseData = {
      id: savedAnalysis ? savedAnalysis._id : null,
      jobTitle: jobData.title,
      company: jobData.company,
      jobSkills,
      resumeSkills,
      matchScore: matchResult.matchScore,
      matchingSkills: matchResult.matchingSkills,
      missingSkills: matchResult.missingSkills,
      suggestions,
      createdAt: savedAnalysis ? savedAnalysis.createdAt : new Date()
    };

    console.log(`✅ Analysis completed - Match Score: ${matchResult.matchScore}%`);

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('❌ Analysis error:', error.message);

    // Determine appropriate HTTP status code
    let statusCode = 500;
    let errorCode = 'INTERNAL_SERVER_ERROR';

    // Client errors (400)
    if (error.message.includes('Invalid URL') || 
        error.message.includes('Unable to connect') ||
        error.message.includes('HTTP 4')) {
      statusCode = 400;
      errorCode = 'INVALID_JOB_URL';
    } else if (error.message.includes('Corrupted') || 
               error.message.includes('Invalid PDF')) {
      statusCode = 400;
      errorCode = 'INVALID_PDF_FILE';
    }

    res.status(statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: errorCode
      }
    });
  }
}

module.exports = {
  analyze
};