/**
 * Skill Extractor Service
 * Identifies technical skills in text using dictionary-based matching
 */

// Comprehensive skill dictionary
const SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'React', 'Angular', 'Vue', 'Node', 'Express', 'Django', 'Flask', 'Spring',
  'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
  'Git', 'CI/CD', 'Jenkins', 'GitHub Actions',
  'Airflow', 'Spark', 'Hadoop', 'Kafka',
  'Tableau', 'Power BI', 'Looker',
  'REST', 'GraphQL', 'gRPC',
  'Linux', 'Bash', 'Shell'
];

/**
 * Extracts skills from text using case-insensitive regex matching with word boundaries
 * @param {string} text - The text to extract skills from
 * @returns {string[]} Array of unique skills found, sorted alphabetically
 */
function extractSkills(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const foundSkills = new Set();

  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();

  // Check each skill in the dictionary
  for (const skill of SKILLS) {
    // Escape special regex characters in skill name
    const escapedSkill = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create regex pattern with word boundaries for exact matching
    // \b ensures we match whole words only (e.g., "JavaScript" but not "JavaScriptExtra")
    const pattern = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    
    if (pattern.test(lowerText)) {
      foundSkills.add(skill);
    }
  }

  // Convert Set to array and sort alphabetically
  return Array.from(foundSkills).sort();
}

module.exports = {
  extractSkills,
  SKILLS // Export for testing purposes
};
