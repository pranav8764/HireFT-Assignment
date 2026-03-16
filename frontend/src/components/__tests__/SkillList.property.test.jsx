import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';
import SkillList from '../SkillList';

describe('SkillList Property-Based Tests', () => {
  describe('Property 5: Empty state message display for all skill blocks', () => {
    /**
     * **Feature: frontend-ux-enhancements, Property 5: Empty state message display for all skill blocks**
     * 
     * For any skill block type (matching, missing, job, resume) with empty data, 
     * the Skill_Block should display the appropriate empty state message instead of hiding the block.
     * 
     * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
     */
    it('displays appropriate empty state messages for all skill block types with empty data', () => {
      fc.assert(fc.property(
        fc.constantFrom('matching', 'missing', 'job', 'resume'),
        fc.constantFrom([], null, undefined),
        (skillType, emptySkills) => {
          const { unmount } = render(
            <SkillList skills={emptySkills} type={skillType} alwaysShow={true} />
          );

          // Define expected messages for each type
          const expectedMessages = {
            matching: 'No matching skills found',
            missing: 'No missing skills',
            job: 'No job skills identified',
            resume: 'No resume skills found'
          };

          // Verify the component is rendered (not hidden)
          const expectedMessage = expectedMessages[skillType];
          expect(screen.getByText(expectedMessage)).toBeInTheDocument();

          // Verify the skill block header is still present
          const typeLabels = {
            matching: 'Matching Skills',
            missing: 'Missing Skills',
            job: 'Job Requirements',
            resume: 'Your Skills'
          };
          expect(screen.getByText(typeLabels[skillType])).toBeInTheDocument();

          // Verify count shows 0
          expect(screen.getByText('(0)')).toBeInTheDocument();

          unmount();
        }
      ), { numRuns: 20 });
    });
  });

  describe('Property 6: Layout consistency across data states', () => {
    /**
     * **Feature: frontend-ux-enhancements, Property 6: Layout consistency across data states**
     * 
     * For any combination of skill data availability (empty or populated), 
     * the Results_Display_Component should maintain consistent layout structure and visual styling.
     * 
     * **Validates: Requirements 3.5, 3.6**
     */
    it('maintains consistent layout structure regardless of skill data availability', () => {
      fc.assert(fc.property(
        fc.constantFrom('matching', 'missing', 'job', 'resume'),
        fc.oneof(
          fc.constant([]), // empty array
          fc.constant(null), // null
          fc.constant(undefined), // undefined
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }) // populated array
        ),
        (skillType, skills) => {
          const { unmount } = render(
            <SkillList skills={skills} type={skillType} alwaysShow={true} />
          );

          // Verify consistent header structure is always present
          const typeLabels = {
            matching: 'Matching Skills',
            missing: 'Missing Skills', 
            job: 'Job Requirements',
            resume: 'Your Skills'
          };

          expect(screen.getByText(typeLabels[skillType])).toBeInTheDocument();
          
          // Verify skill count is always displayed
          const skillCount = skills && Array.isArray(skills) ? skills.length : 0;
          expect(screen.getByText(`(${skillCount})`)).toBeInTheDocument();

          // Verify description is always present
          const typeDescriptions = {
            matching: 'Skills you have that match the job requirements',
            missing: 'Skills required for the job that are not in your resume',
            job: 'All skills mentioned in the job posting',
            resume: 'Skills found in your resume'
          };
          expect(screen.getByText(typeDescriptions[skillType])).toBeInTheDocument();

          // Verify the main container structure
          const skillList = screen.getByText(typeLabels[skillType]).closest('.skill-list');
          expect(skillList).toBeInTheDocument();

          unmount();
        }
      ), { numRuns: 20 });
    });
  });

  describe('alwaysShow behavior property', () => {
    /**
     * Property: When alwaysShow is true, skill blocks should always be visible regardless of data state.
     * When alwaysShow is false, skill blocks should be hidden when no skills are present.
     */
    it('respects alwaysShow prop behavior for all data states', () => {
      fc.assert(fc.property(
        fc.constantFrom('matching', 'missing', 'job', 'resume'),
        fc.oneof(fc.constant([]), fc.constant(null), fc.constant(undefined)),
        fc.boolean(),
        (skillType, emptySkills, alwaysShow) => {
          const { container, unmount } = render(
            <SkillList skills={emptySkills} type={skillType} alwaysShow={alwaysShow} />
          );

          if (alwaysShow) {
            // Should render the component with empty state
            expect(container.firstChild).not.toBeNull();
            
            const expectedMessages = {
              matching: 'No matching skills found',
              missing: 'No missing skills',
              job: 'No job skills identified',
              resume: 'No resume skills found'
            };
            expect(screen.getByText(expectedMessages[skillType])).toBeInTheDocument();
          } else {
            // Should not render anything
            expect(container.firstChild).toBeNull();
          }

          unmount();
        }
      ), { numRuns: 20 });
    });
  });

  describe('skill rendering property', () => {
    /**
     * Property: When skills are provided, they should all be rendered as skill badges
     * with appropriate styling and the correct count displayed.
     */
    it('renders all provided skills with correct count and styling', () => {
      fc.assert(fc.property(
        fc.constantFrom('matching', 'missing', 'job', 'resume'),
        fc.array(
          fc.oneof(
            fc.constant('React'),
            fc.constant('JavaScript'),
            fc.constant('Node.js'),
            fc.constant('Python'),
            fc.constant('TypeScript'),
            fc.constant('CSS'),
            fc.constant('HTML'),
            fc.constant('Vue.js'),
            fc.constant('Angular'),
            fc.constant('Express.js')
          ), 
          { minLength: 1, maxLength: 8 }
        ),
        (skillType, skills) => {
          const { unmount, container } = render(
            <SkillList skills={skills} type={skillType} alwaysShow={true} />
          );

          // Verify correct count is displayed within this specific container
          const skillCountElement = container.querySelector('.skill-count');
          expect(skillCountElement).toHaveTextContent(`(${skills.length})`);

          // Verify all skills are rendered as skill badges
          const skillBadges = container.querySelectorAll('.skill-badge');
          expect(skillBadges).toHaveLength(skills.length);

          // Verify skills are in skill badges (not empty state)
          const skillsGrid = container.querySelector('.skills-grid');
          expect(skillsGrid).toBeInTheDocument();

          // Verify no empty state is shown
          const emptyState = container.querySelector('.empty-state');
          expect(emptyState).not.toBeInTheDocument();

          unmount();
        }
      ), { numRuns: 20 });
    });
  });
});