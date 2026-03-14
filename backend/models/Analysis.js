/**
 * Analysis Model
 * MongoDB schema for storing job match analysis results
 */

const mongoose = require('mongoose');

// Define the Analysis schema
const analysisSchema = new mongoose.Schema({
  // Job posting URL (required)
  jobUrl: {
    type: String,
    required: true,
    trim: true
  },
  
  // Job title extracted from posting
  jobTitle: {
    type: String,
    default: null
  },
  
  // Company name extracted from posting
  company: {
    type: String,
    default: null
  },
  
  // Skills extracted from job posting
  jobSkills: {
    type: [String],
    default: []
  },
  
  // Skills extracted from resume
  resumeSkills: {
    type: [String],
    default: []
  },
  
  // Match score percentage (0-100)
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Skills that match between job and resume
  matchingSkills: {
    type: [String],
    default: []
  },
  
  // Skills required by job but missing from resume
  missingSkills: {
    type: [String],
    default: []
  },
  
  // AI-generated improvement suggestions
  suggestions: {
    type: [String],
    default: []
  },
  
  // Timestamp when analysis was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index on createdAt field for efficient querying of recent analyses
analysisSchema.index({ createdAt: -1 });

// Add compound index for querying by jobUrl and date
analysisSchema.index({ jobUrl: 1, createdAt: -1 });

// Add virtual for formatted creation date
analysisSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Add method to calculate additional metrics
analysisSchema.methods.getAnalysisMetrics = function() {
  return {
    totalJobSkills: this.jobSkills.length,
    totalResumeSkills: this.resumeSkills.length,
    matchingSkillsCount: this.matchingSkills.length,
    missingSkillsCount: this.missingSkills.length,
    matchPercentage: this.matchScore,
    suggestionsCount: this.suggestions.length
  };
};

// Static method to find recent analyses
analysisSchema.statics.findRecent = function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('jobUrl jobTitle company matchScore createdAt');
};

// Static method to find analyses by match score range
analysisSchema.statics.findByMatchScore = function(minScore = 0, maxScore = 100) {
  return this.find({
    matchScore: { $gte: minScore, $lte: maxScore }
  }).sort({ matchScore: -1 });
};

// Export the Analysis model
module.exports = mongoose.model('Analysis', analysisSchema);