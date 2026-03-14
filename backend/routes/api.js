/**
 * API Routes
 * Express router for API endpoints
 */

const express = require('express');
const multer = require('multer');
const matchController = require('../controllers/matchController');
const { validateAnalyzeRequest } = require('../middleware/validation');

const router = express.Router();

// Configure multer for memory storage with 5MB file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file
  },
  fileFilter: (req, file, cb) => {
    // Add multer file filter to accept only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Handle multer errors
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'File size too large. Maximum size is 5MB.',
          code: 'FILE_TOO_LARGE'
        }
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Too many files. Only one file is allowed.',
          code: 'TOO_MANY_FILES'
        }
      });
    }
  }
  
  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Only PDF files are allowed',
        code: 'INVALID_FILE_TYPE'
      }
    });
  }

  next(error);
};

// Define POST /api/analyze route with multer middleware, validation, and matchController.analyze handler
router.post('/analyze', upload.single('resumeFile'), handleMulterError, validateAnalyzeRequest, matchController.analyze);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Job Match Analyzer API',
    version: '1.0.0',
    endpoints: {
      'POST /api/analyze': 'Analyze job posting and resume for skill matching'
    }
  });
});

module.exports = router;