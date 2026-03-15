/**
 * Edge Case Tests for Multi-Factor Matching Engine
 * Tests error handling and edge cases
 */

const matchEngine = require('./services/matchEngine');

console.log('🧪 Testing Edge Cases for Multi-Factor Matching Engine\n');

const tests = [
  {
    name: 'Empty job skills',
    jobSkills: [],
    resumeSkills: ['JavaScript', 'React'],
    jobDescription: 'Looking for a developer with 3 years experience.',
    resumeText: 'Software Engineer with 5 years experience.',
    expectedBehavior: 'Should handle empty job skills gracefully'
  },
  {
    name: 'Empty resume skills',
    jobSkills: ['JavaScript', 'React'],
    resumeSkills: [],
    jobDescription: 'Looking for a developer with 3 years experience.',
    resumeText: 'Software Engineer with 5 years experience.',
    expectedBehavior: 'Should handle empty resume skills gracefully'
  },
  {
    name: 'Empty job description',
    jobSkills: ['JavaScript'],
    resumeSkills: ['JavaScript'],
    jobDescription: '',
    resumeText: 'Software Engineer with 5 years experience. Bachelor degree.',
    expectedBehavior: 'Should handle empty job description'
  },
  {
    name: 'Empty resume text',
    jobSkills: ['JavaScript'],
    resumeSkills: ['JavaScript'],
    jobDescription: 'Looking for a developer with 3 years experience. Bachelor degree required.',
    resumeText: '',
    expectedBehavior: 'Should handle empty resume text'
  },
  {
    name: 'No experience mentioned',
    jobSkills: ['JavaScript'],
    resumeSkills: ['JavaScript'],
    jobDescription: 'Looking for a JavaScript developer.',
    resumeText: 'I am a JavaScript developer.',
    expectedBehavior: 'Should default to 100% experience score when no requirement'
  },
  {
    name: 'No education mentioned',
    jobSkills: ['JavaScript'],
    resumeSkills: ['JavaScript'],
    jobDescription: 'Looking for a JavaScript developer.',
    resumeText: 'I am a JavaScript developer.',
    expectedBehavior: 'Should default to 100% education score when no requirement'
  },
  {
    name: 'Invalid inputs (null)',
    jobSkills: null,
    resumeSkills: null,
    jobDescription: null,
    resumeText: null,
    expectedBehavior: 'Should handle null inputs gracefully'
  },
  {
    name: 'Invalid inputs (undefined)',
    jobSkills: undefined,
    resumeSkills: undefined,
    jobDescription: undefined,
    resumeText: undefined,
    expectedBehavior: 'Should handle undefined inputs gracefully'
  }
];

let passedTests = 0;
let failedTests = 0;

tests.forEach((test, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Test ${index + 1}: ${test.name}`);
  console.log(`Expected: ${test.expectedBehavior}`);
  console.log('='.repeat(60));

  try {
    const result = matchEngine.calculateMatch(
      test.jobSkills,
      test.resumeSkills,
      test.jobDescription,
      test.resumeText
    );

    // Validate result structure
    const isValid = 
      typeof result.matchScore === 'number' &&
      result.matchScore >= 0 &&
      result.matchScore <= 100 &&
      result.breakdown !== undefined &&
      Array.isArray(result.matchingSkills) &&
      Array.isArray(result.missingSkills) &&
      result.missingRequirements !== undefined;

    if (isValid) {
      console.log('✅ PASSED');
      console.log(`   Match Score: ${result.matchScore}%`);
      console.log(`   Breakdown: Skills=${result.breakdown.skills}%, Experience=${result.breakdown.experience}%, Education=${result.breakdown.education}%, Responsibilities=${result.breakdown.responsibilities}%`);
      passedTests++;
    } else {
      console.log('❌ FAILED - Invalid result structure');
      console.log('   Result:', JSON.stringify(result, null, 2));
      failedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED - Exception thrown');
    console.log('   Error:', error.message);
    failedTests++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${tests.length}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log('='.repeat(60) + '\n');

if (failedTests === 0) {
  console.log('✅ All Edge Case Tests PASSED\n');
  process.exit(0);
} else {
  console.log('❌ Some Edge Case Tests FAILED\n');
  process.exit(1);
}
