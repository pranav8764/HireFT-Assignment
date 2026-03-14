/**
 * Request Validation Middleware
 * Validates incoming requests for the Job Match Analyzer API
 */

/**
 * Validates job URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL format
 */
function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    // Check if protocol is http or https
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Middleware to validate analyze request
 * Validates jobUrl format and resumeFile presence
 */
function validateAnalyzeRequest(req, res, next) {
  const { jobUrl } = req.body;
  const resumeFile = req.file;

  // Validate jobUrl presence
  if (!jobUrl || !jobUrl.trim()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Job URL is required',
        code: 'MISSING_JOB_URL'
      }
    });
  }

  // Validate jobUrl format
  if (!isValidUrl(jobUrl.trim())) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid job URL format. Please provide a valid HTTP or HTTPS URL',
        code: 'INVALID_JOB_URL_FORMAT'
      }
    });
  }

  // Validate resumeFile presence
  if (!resumeFile) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Resume file is required',
        code: 'MISSING_RESUME_FILE'
      }
    });
  }

  // Validate resumeFile is PDF
  if (resumeFile.mimetype !== 'application/pdf') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Resume file must be a PDF',
        code: 'INVALID_FILE_TYPE'
      }
    });
  }

  // All validations passed, proceed to controller
  next();
}

module.exports = {
  validateAnalyzeRequest,
  isValidUrl
};
