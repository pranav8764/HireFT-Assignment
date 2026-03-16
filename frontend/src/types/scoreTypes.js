/**
 * @fileoverview Type definitions for score-related data structures
 */

/**
 * @typedef {Object} ScoreBreakdown
 * @property {number} skills - Skills match score (0-100)
 * @property {number} experience - Experience match score (0-100)
 * @property {number} education - Education match score (0-100)
 * @property {number} responsibilities - Responsibilities match score (0-100)
 */

/**
 * @typedef {Object} ScoreWeights
 * @property {number} skills - Weight for skills factor (default: 0.40)
 * @property {number} experience - Weight for experience factor (default: 0.30)
 * @property {number} education - Weight for education factor (default: 0.15)
 * @property {number} responsibilities - Weight for responsibilities factor (default: 0.15)
 */

/**
 * @typedef {Object} FactorDetails
 * @property {string} key - Unique identifier for the factor
 * @property {string} label - Display label for the factor
 * @property {string} icon - Emoji icon for visual representation
 * @property {number} weight - Weight of this factor in final score calculation
 */

/**
 * @typedef {Object} ExperienceMatch
 * @property {number} score - Experience match score (0-100)
 * @property {number} [requiredYears] - Years of experience required by job
 * @property {number} [candidateYears] - Years of experience candidate has
 * @property {string[]} relevantExperience - List of relevant experience items
 * @property {string[]} missingExperience - List of missing experience items
 */

/**
 * @typedef {Object} EducationMatch
 * @property {number} score - Education match score (0-100)
 * @property {string} [requiredDegree] - Degree required by job
 * @property {string} [candidateDegree] - Degree candidate has
 * @property {string[]} relevantEducation - List of relevant education items
 * @property {string[]} missingEducation - List of missing education items
 */

/**
 * @typedef {Object} ResponsibilityMatch
 * @property {number} score - Responsibility match score (0-100)
 * @property {string[]} matchingResponsibilities - List of matching responsibilities
 * @property {string[]} missingResponsibilities - List of missing responsibilities
 * @property {string[]} additionalResponsibilities - List of additional responsibilities candidate has
 */

/**
 * @typedef {Object} AnalysisData
 * @property {string} [jobTitle] - Job title
 * @property {string} [company] - Company name
 * @property {string[]} [jobSkills] - Skills mentioned in job posting
 * @property {string[]} [resumeSkills] - Skills found in resume
 * @property {number} matchScore - Overall match score (0-100)
 * @property {ScoreBreakdown} [breakdown] - Detailed score breakdown by factor
 * @property {string[]} [matchingSkills] - Skills that match between job and resume
 * @property {string[]} [missingSkills] - Skills required by job but missing from resume
 * @property {string[]} [suggestions] - AI-generated suggestions for improvement
 * @property {ExperienceMatch} [experienceDetails] - Detailed experience matching information
 * @property {EducationMatch} [educationDetails] - Detailed education matching information
 * @property {ResponsibilityMatch} [responsibilityDetails] - Detailed responsibility matching information
 */

/**
 * @typedef {Object} MatchScoreProps
 * @property {number} score - Overall match score (0-100)
 * @property {ScoreBreakdown} [breakdown] - Detailed score breakdown by factor
 * @property {boolean} [showDetails=false] - Whether to show detailed breakdown by default
 */

/**
 * @typedef {Object} ResultsProps
 * @property {AnalysisData} analysisData - Complete analysis data
 * @property {boolean} [showDetailedFactors=false] - Whether to show detailed factor information
 */

export {};