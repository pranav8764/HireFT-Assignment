/**
 * AI Suggestions Service
 * Generates personalized resume improvement recommendations using Groq (Llama-3.3-70b-versatile)
 */

const Groq = require('groq-sdk');

// Initialize Groq client with API key from environment
let groq = null;

function initializeGroq() {
  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
}

/**
 * Generates resume improvement suggestions using Groq (Llama-3.3-70b-versatile)
 * @param {string} jobDescription - The job posting description
 * @param {string} resumeText - The candidate's resume text
 * @returns {Promise<string[]>} Array of actionable suggestions
 */
async function generateSuggestions(jobDescription, resumeText) {
  try {
    // Validate inputs
    if (!jobDescription || !resumeText) {
      return ['Unable to generate suggestions: missing job description or resume text.'];
    }

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY not configured in .env file');
      return ['AI suggestions temporarily unavailable. Please configure Groq API key.'];
    }

    // Initialize Groq if not already done
    initializeGroq();

    // Construct refined prompt for focused, actionable suggestions
    const prompt = `You are a senior hiring manager. Analyze this job posting and resume, then provide exactly 5 concise, actionable suggestions to improve the resume match.

JOB POSTING:
${jobDescription.substring(0, 2500)}

CANDIDATE RESUME:
${resumeText.substring(0, 2500)}

INSTRUCTIONS:
- Focus ONLY on the biggest gaps between job requirements and resume
- Each suggestion must be specific and actionable (not generic advice)
- Prioritize missing skills, experience gaps, and keyword optimization
- Be direct and practical
- 

FORMAT:
1. [Specific action]
2. [Specific action]
3. [Specific action]
4. [Specific action]
5. [Specific action]`;

    console.log('🤖 Calling Groq API with Llama-3.3-70b-versatile...');

    // Call Groq API with Llama model
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a resume optimization expert. Provide ultra-concise, specific suggestions (under 20 words each) that directly address job-resume gaps. Focus on exact skills/keywords to add.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    console.log('✅ Groq API response received');

    const responseText = completion.choices[0]?.message?.content || '';

    // Parse response text into array of suggestions
    const suggestions = parseResponseToArray(responseText);

    // Ensure we have at least some suggestions
    if (suggestions.length === 0) {
      return getFallbackSuggestions(jobDescription, resumeText);
    }

    return suggestions;

  } catch (error) {
    console.error('❌ AI Suggestions Error:', error.message);

    // Handle specific Groq errors
    if (error.message.includes('API key') || error.message.includes('401')) {
      console.error('❌ Invalid Groq API key');
      return ['AI suggestions unavailable: Invalid API key. Please check your Groq API key.'];
    }

    if (error.message.includes('quota') || error.message.includes('429')) {
      console.error('❌ Groq API quota exceeded');
      return getFallbackSuggestions(jobDescription, resumeText);
    }

    if (error.message.includes('model') || error.message.includes('404')) {
      console.error('❌ Model not available');
      return ['AI suggestions unavailable: Llama-3.3-70b-versatile model not available. Please check your Groq subscription.'];
    }

    // Implement fallback message for API failures
    return getFallbackSuggestions(jobDescription, resumeText);
  }
}

/**
 * Parses the AI response text into an array of suggestions
 * @param {string} text - The response text from the AI
 * @returns {string[]} Array of suggestions
 */
function parseResponseToArray(text) {
  if (!text) return [];

  const suggestions = [];

  // Split by newlines and filter for numbered items
  const lines = text.split('\n').filter(line => line.trim());

  for (const line of lines) {
    // Match numbered list items (e.g., "1.", "1)", "1 -", "1:")
    const match = line.match(/^\d+[\.\):\-]\s*(.+)$/);
    if (match && match[1]) {
      suggestions.push(match[1].trim());
    }
  }

  // If no numbered items found, try splitting by newlines
  if (suggestions.length === 0) {
    return lines
      .filter(line => line.length > 10) // Filter out very short lines
      .slice(0, 5); // Take first 5 lines
  }

  return suggestions.slice(0, 5); // Ensure we return max 5 suggestions
}

/**
 * Generates fallback suggestions when AI is unavailable
 * @param {string} jobDescription - The job posting description
 * @param {string} resumeText - The candidate's resume text
 * @returns {string[]} Array of fallback suggestions
 */
function getFallbackSuggestions(jobDescription, resumeText) {
  const suggestions = [];
  
  // Extract basic information for fallback suggestions
  const jobLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();
  
  // Suggestion 1: Skills analysis
  const commonTechSkills = ['javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker', 'kubernetes'];
  const missingSkills = commonTechSkills.filter(skill => 
    jobLower.includes(skill) && !resumeLower.includes(skill)
  );
  
  if (missingSkills.length > 0) {
    suggestions.push(`Consider adding these relevant skills mentioned in the job: ${missingSkills.slice(0, 3).join(', ')}`);
  } else {
    suggestions.push('Review the job requirements and ensure all relevant technical skills are prominently featured in your resume');
  }
  
  // Suggestion 2: Experience quantification
  if (!resumeLower.includes('%') && !resumeLower.includes('increased') && !resumeLower.includes('improved')) {
    suggestions.push('Quantify your achievements with specific numbers, percentages, or metrics to demonstrate impact');
  } else {
    suggestions.push('Continue highlighting quantifiable achievements and consider adding more specific metrics where possible');
  }
  
  // Suggestion 3: Keywords optimization
  suggestions.push('Incorporate more keywords from the job description throughout your resume, especially in the summary and experience sections');
  
  // Suggestion 4: Experience relevance
  if (jobLower.includes('senior') || jobLower.includes('lead')) {
    suggestions.push('Emphasize leadership experience, mentoring responsibilities, and strategic decision-making in your role descriptions');
  } else {
    suggestions.push('Tailor your experience descriptions to match the specific responsibilities mentioned in the job posting');
  }
  
  // Suggestion 5: Education and certifications
  if (jobLower.includes('certification') || jobLower.includes('certified')) {
    suggestions.push('Consider obtaining relevant certifications mentioned in the job requirements to strengthen your candidacy');
  } else {
    suggestions.push('Ensure your education section clearly shows how your background aligns with the job requirements');
  }
  
  return suggestions.slice(0, 5);
}

module.exports = {
  generateSuggestions
};
