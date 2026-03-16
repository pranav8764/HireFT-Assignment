/**
 * Property-Based Tests for Skill Matcher Module
 * 
 * Tests the skill matching functionality using property-based testing
 * to verify correctness across a wide range of inputs.
 */

const fc = require('fast-check');
const { calculateSkillMatch } = require('../skillMatcher');

describe('skillMatcher Property-Based Tests', () => {
  
  // Feature: multi-factor-matching-engine, Property 1: Skill Score Calculation Correctness
  test('skill score equals (matching skills count / total job skills count) × 100', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 })), // jobSkills
        fc.array(fc.string({ minLength: 1, maxLength: 20 })), // resumeSkills
        (jobSkills, resumeSkills) => {
          const result = calculateSkillMatch(jobSkills, resumeSkills);
          
          if (jobSkills.length === 0) {
            // Edge case: empty job skills should return score of 0
            expect(result.score).toBe(0);
          } else {
            // Calculate expected score manually
            const jobSkillsLower = new Set(jobSkills.map(s => s.toLowerCase()));
            const resumeSkillsLower = new Set(resumeSkills.map(s => s.toLowerCase()));
            
            let matchingCount = 0;
            for (const skill of jobSkillsLower) {
              if (resumeSkillsLower.has(skill)) {
                matchingCount++;
              }
            }
            
            const expectedScore = (matchingCount / jobSkills.length) * 100;
            const expectedRounded = Math.round(expectedScore * 100) / 100;
            
            expect(result.score).toBeCloseTo(expectedRounded, 2);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multi-factor-matching-engine, Property 4: Skill Score Range Constraint
  test('skill score is always between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string()), // jobSkills
        fc.array(fc.string()), // resumeSkills
        (jobSkills, resumeSkills) => {
          const result = calculateSkillMatch(jobSkills, resumeSkills);
          expect(result.score).toBeGreaterThanOrEqual(0);
          expect(result.score).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multi-factor-matching-engine, Property 5: Case-Insensitive Skill Matching
  test('skills with different casing are recognized as matching skills', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 })), // baseSkills
        (baseSkills) => {
          if (baseSkills.length === 0) return; // Skip empty arrays
          
          // Create job skills with original casing
          const jobSkills = baseSkills;
          
          // Create resume skills with different casing
          const resumeSkills = baseSkills.map(skill => {
            // Randomly change case of each character
            return skill.split('').map(char => 
              Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
            ).join('');
          });
          
          const result = calculateSkillMatch(jobSkills, resumeSkills);
          
          // Property: All skills should match despite different casing
          expect(result.score).toBe(100);
          expect(result.matchingSkills.length).toBe(jobSkills.length);
          expect(result.missingSkills.length).toBe(0);
          
          // Property: Each skill that appears in both job and resume with different casing
          // should be recognized as a matching skill
          const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
          const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
          const matchingSkillsLower = result.matchingSkills.map(s => s.toLowerCase());
          
          jobSkillsLower.forEach(jobSkill => {
            if (resumeSkillsLower.includes(jobSkill)) {
              expect(matchingSkillsLower.includes(jobSkill)).toBe(true);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multi-factor-matching-engine, Property 2: Matching Skills Are Intersection
  test('matching skills are the intersection of job and resume skills', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 })), // jobSkills
        fc.array(fc.string({ minLength: 1, maxLength: 20 })), // resumeSkills
        (jobSkills, resumeSkills) => {
          const result = calculateSkillMatch(jobSkills, resumeSkills);
          
          // Convert to lowercase sets for comparison
          const jobSkillsLower = new Set(jobSkills.map(s => s.toLowerCase()));
          const resumeSkillsLower = new Set(resumeSkills.map(s => s.toLowerCase()));
          const matchingSkillsLower = new Set(result.matchingSkills.map(s => s.toLowerCase()));
          
          // Every matching skill should exist in both job and resume skills
          for (const skill of matchingSkillsLower) {
            expect(jobSkillsLower.has(skill)).toBe(true);
            expect(resumeSkillsLower.has(skill)).toBe(true);
          }
          
          // Every skill that exists in both should be in matching skills
          for (const skill of jobSkillsLower) {
            if (resumeSkillsLower.has(skill)) {
              expect(matchingSkillsLower.has(skill)).toBe(true);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multi-factor-matching-engine, Property 3: Missing Skills Are Set Difference
  test('missing skills are the set difference between job skills and resume skills', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 })), // jobSkills
        fc.array(fc.string({ minLength: 1, maxLength: 20 })), // resumeSkills
        (jobSkills, resumeSkills) => {
          const result = calculateSkillMatch(jobSkills, resumeSkills);
          
          // Convert to lowercase sets for case-insensitive comparison
          const jobSkillsLower = new Set(jobSkills.map(s => s.toLowerCase()));
          const resumeSkillsLower = new Set(resumeSkills.map(s => s.toLowerCase()));
          const missingSkillsLower = new Set(result.missingSkills.map(s => s.toLowerCase()));
          
          // Property: Every missing skill should exist in job skills but not in resume skills
          for (const skill of missingSkillsLower) {
            expect(jobSkillsLower.has(skill)).toBe(true);
            expect(resumeSkillsLower.has(skill)).toBe(false);
          }
          
          // Property: Every job skill not in resume should be in missing skills (completeness)
          for (const skill of jobSkillsLower) {
            if (!resumeSkillsLower.has(skill)) {
              expect(missingSkillsLower.has(skill)).toBe(true);
            }
          }
          
          // Property: Missing skills should be exactly the set difference (unique skills only)
          const expectedMissingSkills = new Set();
          for (const skill of jobSkillsLower) {
            if (!resumeSkillsLower.has(skill)) {
              expectedMissingSkills.add(skill);
            }
          }
          expect(missingSkillsLower.size).toBe(expectedMissingSkills.size);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test for result structure completeness
  test('result always contains required fields with correct types', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 })), // jobSkills
        fc.array(fc.string({ minLength: 1, maxLength: 20 })), // resumeSkills
        (jobSkills, resumeSkills) => {
          const result = calculateSkillMatch(jobSkills, resumeSkills);
          
          // Check result structure
          expect(typeof result).toBe('object');
          expect(result).not.toBeNull();
          
          // Check required fields exist with correct types
          expect(typeof result.score).toBe('number');
          expect(Array.isArray(result.matchingSkills)).toBe(true);
          expect(Array.isArray(result.missingSkills)).toBe(true);
          
          // Check that all array elements are strings
          result.matchingSkills.forEach(skill => {
            expect(typeof skill).toBe('string');
          });
          
          result.missingSkills.forEach(skill => {
            expect(typeof skill).toBe('string');
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test for input validation
  test('handles invalid inputs gracefully', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant('not an array'),
          fc.constant(123),
          fc.constant({}),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }))
        ), // jobSkills (potentially invalid)
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant('not an array'),
          fc.constant(123),
          fc.constant({}),
          fc.array(fc.string({ minLength: 1, maxLength: 20 }))
        ), // resumeSkills (potentially invalid)
        (jobSkills, resumeSkills) => {
          // Should not throw an error regardless of input
          expect(() => {
            const result = calculateSkillMatch(jobSkills, resumeSkills);
            
            // Result should always have the correct structure
            expect(typeof result.score).toBe('number');
            expect(Array.isArray(result.matchingSkills)).toBe(true);
            expect(Array.isArray(result.missingSkills)).toBe(true);
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });
});