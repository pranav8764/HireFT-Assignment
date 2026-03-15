/**
 * Input Validation Tests for Matcher Modules
 * Tests that all matchers handle invalid inputs gracefully
 */

const skillMatcher = require('./services/matching/skillMatcher');
const experienceMatcher = require('./services/matching/experienceMatcher');
const educationMatcher = require('./services/matching/educationMatcher');
const responsibilityMatcher = require('./services/matching/responsibilityMatcher');

console.log('🧪 Testing Input Validation for All Matchers\n');

// Test 1: skillMatcher with invalid inputs
console.log('============================================================');
console.log('Test 1: skillMatcher with invalid inputs');
console.log('============================================================');

const skillTest1 = skillMatcher.calculateSkillMatch(null, ['JavaScript']);
console.log('✓ null jobSkills:', skillTest1);

const skillTest2 = skillMatcher.calculateSkillMatch(['JavaScript'], null);
console.log('✓ null resumeSkills:', skillTest2);

const skillTest3 = skillMatcher.calculateSkillMatch('not an array', ['JavaScript']);
console.log('✓ string jobSkills:', skillTest3);

const skillTest4 = skillMatcher.calculateSkillMatch(['JavaScript'], 123);
console.log('✓ number resumeSkills:', skillTest4);

// Test 2: experienceMatcher with invalid inputs
console.log('\n============================================================');
console.log('Test 2: experienceMatcher with invalid inputs');
console.log('============================================================');

const expTest1 = experienceMatcher.calculateExperienceMatch(null, 'Resume text');
console.log('✓ null jobDescription:', expTest1);

const expTest2 = experienceMatcher.calculateExperienceMatch('Job description', null);
console.log('✓ null resumeText:', expTest2);

const expTest3 = experienceMatcher.calculateExperienceMatch(123, 'Resume text');
console.log('✓ number jobDescription:', expTest3);

const expTest4 = experienceMatcher.calculateExperienceMatch('Job description', ['array']);
console.log('✓ array resumeText:', expTest4);

// Test 3: educationMatcher with invalid inputs
console.log('\n============================================================');
console.log('Test 3: educationMatcher with invalid inputs');
console.log('============================================================');

const eduTest1 = educationMatcher.calculateEducationMatch(null, 'Resume text');
console.log('✓ null jobDescription:', eduTest1);

const eduTest2 = educationMatcher.calculateEducationMatch('Job description', null);
console.log('✓ null resumeText:', eduTest2);

const eduTest3 = educationMatcher.calculateEducationMatch(undefined, 'Resume text');
console.log('✓ undefined jobDescription:', eduTest3);

const eduTest4 = educationMatcher.calculateEducationMatch('Job description', {});
console.log('✓ object resumeText:', eduTest4);

// Test 4: responsibilityMatcher with invalid inputs
console.log('\n============================================================');
console.log('Test 4: responsibilityMatcher with invalid inputs');
console.log('============================================================');

const respTest1 = responsibilityMatcher.calculateResponsibilityMatch(null, 'Resume text');
console.log('✓ null jobDescription:', respTest1);

const respTest2 = responsibilityMatcher.calculateResponsibilityMatch('Job description', null);
console.log('✓ null resumeText:', respTest2);

const respTest3 = responsibilityMatcher.calculateResponsibilityMatch([], 'Resume text');
console.log('✓ array jobDescription:', respTest3);

const respTest4 = responsibilityMatcher.calculateResponsibilityMatch('Job description', 456);
console.log('✓ number resumeText:', respTest4);

// Validation Summary
console.log('\n============================================================');
console.log('📊 Validation Summary');
console.log('============================================================');

let allPassed = true;

// Check skillMatcher returns valid structure with score 0 for invalid inputs
if (skillTest1.score !== 0 || skillTest2.score !== 0 || skillTest3.score !== 0 || skillTest4.score !== 0) {
  console.log('❌ skillMatcher validation failed');
  allPassed = false;
} else {
  console.log('✅ skillMatcher: Handles invalid inputs correctly');
}

// Check experienceMatcher returns score 0 and logs warnings
if (expTest1.score !== 0 || expTest2.score !== 0 || expTest3.score !== 0 || expTest4.score !== 0) {
  console.log('❌ experienceMatcher validation failed');
  allPassed = false;
} else {
  console.log('✅ experienceMatcher: Handles invalid inputs correctly');
}

// Check educationMatcher returns score 0 and logs warnings
if (eduTest1.score !== 0 || eduTest2.score !== 0 || eduTest3.score !== 0 || eduTest4.score !== 0) {
  console.log('❌ educationMatcher validation failed');
  allPassed = false;
} else {
  console.log('✅ educationMatcher: Handles invalid inputs correctly');
}

// Check responsibilityMatcher returns score 0 or empty arrays
if (respTest1.score !== 0 || respTest2.score !== 0 || respTest3.score !== 0 || respTest4.score !== 0) {
  console.log('❌ responsibilityMatcher validation failed');
  allPassed = false;
} else {
  console.log('✅ responsibilityMatcher: Handles invalid inputs correctly');
}

console.log('============================================================');
if (allPassed) {
  console.log('✅ All Input Validation Tests PASSED');
} else {
  console.log('❌ Some Input Validation Tests FAILED');
}
console.log('============================================================\n');
