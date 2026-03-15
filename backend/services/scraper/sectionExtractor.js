/**
 * Section Extractor
 * Extracts structured sections from job description text
 */

/**
 * Extracts sections from job description text
 * @param {string} text - The job description text
 * @returns {Object} Extracted sections
 */
function extractSections(text) {
  console.log('📑 Extracting job description sections...');

  const sections = {
    responsibilities: '',
    requirements: '',
    qualifications: '',
    benefits: ''
  };

  if (!text || text.length < 50) {
    return sections;
  }

  // Split text into lines for analysis
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  // Section headers patterns
  const patterns = {
    responsibilities: /^(responsibilities|duties|what you('ll| will) do|role|your role|key responsibilities|job responsibilities)/i,
    requirements: /^(requirements|required|must have|required skills|required qualifications|what we('re| are) looking for)/i,
    qualifications: /^(qualifications|preferred|nice to have|bonus|preferred qualifications|ideal candidate|you have)/i,
    benefits: /^(benefits|what we offer|perks|compensation|why join|why work)/i
  };

  let currentSection = null;
  let sectionContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line is a section header
    let foundSection = null;
    for (const [sectionName, pattern] of Object.entries(patterns)) {
      if (pattern.test(line)) {
        foundSection = sectionName;
        break;
      }
    }

    if (foundSection) {
      // Save previous section content
      if (currentSection && sectionContent.length > 0) {
        sections[currentSection] = sectionContent.join('\n').trim();
      }

      // Start new section
      currentSection = foundSection;
      sectionContent = [];
    } else if (currentSection) {
      // Add line to current section
      sectionContent.push(line);
    }
  }

  // Save last section
  if (currentSection && sectionContent.length > 0) {
    sections[currentSection] = sectionContent.join('\n').trim();
  }

  // Log what was found
  const foundSections = Object.entries(sections)
    .filter(([_, content]) => content.length > 0)
    .map(([name, _]) => name);
  
  if (foundSections.length > 0) {
    console.log(`✅ Extracted sections: ${foundSections.join(', ')}`);
  } else {
    console.log('⚠️  No structured sections found in job description');
  }

  return sections;
}

module.exports = { extractSections };
