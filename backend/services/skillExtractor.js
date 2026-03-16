/**
 * Skill Extractor Service
 * Identifies technical skills in text using dictionary-based matching
 */

const SKILLS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'React',
  'Angular',
  'Vue',
  'Node',
  'Express',
  'Django',
  'Flask',
  'Spring',
  'SQL',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Elasticsearch',
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Git',
  'CI/CD',
  'Jenkins',
  'GitHub Actions',
  'Airflow',
  'Spark',
  'Hadoop',
  'Kafka',
  'Tableau',
  'Power BI',
  'Looker',
  'REST',
  'GraphQL',
  'gRPC',
  'Linux',
  'Bash',
  'Shell',
  'Customer Engineering'
];

/**
 * Escapes special regex characters in a string.
 */
function escapeRegex(str) {
  // Build pattern via constructor to avoid source corruption of special chars
  const bs = String.fromCharCode(92);
  const dol = String.fromCharCode(36);
  const pat = new RegExp('[.*+?^' + dol + '{}()|[' + bs + ']' + bs + bs + ']', 'g');
  return str.replace(pat, function(ch) { return bs + ch; });
}

/**
 * Extracts skills from text using case-insensitive matching.
 * Handles skills ending in non-word characters (C++, C#) via lookahead/lookbehind.
 * @param {string} text
 * @returns {string[]} Sorted array of matched skills
 */
function extractSkills(text) {
  if (!text || typeof text !== 'string') return [];

  const foundSkills = new Set();
  const lowerText = text.toLowerCase();
  const bs = String.fromCharCode(92);
  const dol = String.fromCharCode(36);

  for (const skill of SKILLS) {
    const esc = escapeRegex(skill.toLowerCase());

    // Skills ending in non-word chars (C++, C#) need lookahead boundaries
    let pattern;
    if (new RegExp('[+#/]' + dol).test(esc)) {
      pattern = new RegExp('(?<!' + bs + 'w)' + esc + '(?!' + bs + 'w)', 'i');
    } else {
      pattern = new RegExp(bs + 'b' + esc + bs + 'b', 'i');
    }

    if (pattern.test(lowerText)) foundSkills.add(skill);
  }

  return Array.from(foundSkills).sort();
}

module.exports = { extractSkills, SKILLS };
