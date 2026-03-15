/**
 * Integration Test for Multi-Factor Matching Engine
 * Tests the complete matching workflow with sample data
 */

const matchEngine = require('./services/matchEngine');

console.log('🧪 Testing Multi-Factor Matching Engine\n');

// Sample job data
const jobSkills = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API'];
const jobDescription = `
We are looking for a Senior Full Stack Developer with 5+ years of experience.

Requirements:
- Bachelor's degree in Computer Science or related field
- 5+ years of professional software development experience
- Strong proficiency in JavaScript, React, and Node.js
- Experience with MongoDB and REST API design

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Mentor junior developers
- Participate in code reviews
`;

// Sample resume data
const resumeSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'];
const resumeText = `
John Doe
Senior Software Engineer

Education:
Bachelor of Science in Computer Science
University of Technology, 2015

Experience:
Senior Software Engineer at Tech Corp (2019 - Present)
- Developed full-stack web applications using React and Node.js
- Designed and implemented REST APIs
- Led a team of 3 junior developers
- Conducted code reviews and mentoring sessions

Software Engineer at StartupXYZ (2016 - 2019)
- Built responsive web interfaces using JavaScript and React
- Collaborated with product managers and designers
- Wrote unit tests and integration tests

Skills:
JavaScript, React, Node.js, Python, SQL, Git, Agile
`;

console.log('📋 Test Data:');
console.log('Job Skills:', jobSkills);
console.log('Resume Skills:', resumeSkills);
console.log('Job Description Length:', jobDescription.length, 'chars');
console.log('Resume Text Length:', resumeText.length, 'chars');
console.log('\n' + '='.repeat(60) + '\n');

try {
  // Run the matching engine
  console.log('⚙️  Running Match Engine...\n');
  const result = matchEngine.calculateMatch(
    jobSkills,
    resumeSkills,
    jobDescription,
    resumeText
  );

  // Display results
  console.log('✅ Match Engine Results:\n');
  console.log('📊 Overall Match Score:', result.matchScore + '%');
  console.log('\n📈 Score Breakdown:');
  console.log('  - Skills:', result.breakdown.skills + '%');
  console.log('  - Experience:', result.breakdown.experience + '%');
  console.log('  - Education:', result.breakdown.education + '%');
  console.log('  - Responsibilities:', result.breakdown.responsibilities + '%');
  
  console.log('\n✓ Matching Skills:', result.matchingSkills.join(', '));
  console.log('✗ Missing Skills:', result.missingSkills.join(', '));
  
  console.log('\n📚 Missing Requirements:');
  console.log('  Experience:');
  console.log('    - Required:', result.missingRequirements.experience.required, 'years');
  console.log('    - Candidate:', result.missingRequirements.experience.candidate, 'years');
  console.log('    - Met:', result.missingRequirements.experience.met ? 'Yes' : 'No');
  console.log('  Education:');
  console.log('    - Required:', result.missingRequirements.education.required);
  console.log('    - Candidate:', result.missingRequirements.education.candidate);
  console.log('    - Met:', result.missingRequirements.education.met ? 'Yes' : 'No');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Integration Test PASSED');
  console.log('='.repeat(60) + '\n');

  // Validate result structure
  console.log('🔍 Validating Result Structure...\n');
  
  const validations = [
    { name: 'matchScore exists', pass: typeof result.matchScore === 'number' },
    { name: 'matchScore in range [0-100]', pass: result.matchScore >= 0 && result.matchScore <= 100 },
    { name: 'breakdown exists', pass: result.breakdown !== undefined },
    { name: 'breakdown.skills exists', pass: typeof result.breakdown.skills === 'number' },
    { name: 'breakdown.experience exists', pass: typeof result.breakdown.experience === 'number' },
    { name: 'breakdown.education exists', pass: typeof result.breakdown.education === 'number' },
    { name: 'breakdown.responsibilities exists', pass: typeof result.breakdown.responsibilities === 'number' },
    { name: 'matchingSkills is array', pass: Array.isArray(result.matchingSkills) },
    { name: 'missingSkills is array', pass: Array.isArray(result.missingSkills) },
    { name: 'missingRequirements exists', pass: result.missingRequirements !== undefined },
    { name: 'missingRequirements.experience exists', pass: result.missingRequirements.experience !== undefined },
    { name: 'missingRequirements.education exists', pass: result.missingRequirements.education !== undefined }
  ];

  let allPassed = true;
  validations.forEach(v => {
    const status = v.pass ? '✅' : '❌';
    console.log(`${status} ${v.name}`);
    if (!v.pass) allPassed = false;
  });

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('✅ All Validations PASSED');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  } else {
    console.log('❌ Some Validations FAILED');
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Integration Test FAILED\n');
  console.error('Error:', error.message);
  console.error('\nStack Trace:');
  console.error(error.stack);
  console.log('\n' + '='.repeat(60) + '\n');
  process.exit(1);
}
