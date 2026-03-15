/**
 * AI Suggestions Service
 * Generates personalized resume improvement recommendations using Google AI Studio (Gemini)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google AI client with API key from environment
let genAI = null;
let model = null;

function initializeGemini() {
  if (!genAI && process.env.GOOGLE_AI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    // Using gemini-2.0-flash-lite for reliable, high-quality responses with lower quota usage
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
  }
}

/**
 * Generates resume improvement suggestions using Google Gemini
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
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('❌ GOOGLE_AI_API_KEY not configured in .env file');
      return ['AI suggestions temporarily unavailable. Please configure Google AI API key.'];
    }

    // Initialize Gemini if not already done
    initializeGemini();

    // Construct prompt instructing AI to act as hiring expert
    const prompt = `You are an expert hiring manager and career coach. Analyze the following job description and resume, then provide exactly 5 specific, actionable suggestions to improve the resume for this job.

Job Description:
${jobDescription.substring(0, 3000)}

Resume:
${resumeText.substring(0, 3000)}

Provide exactly 5 suggestions as a numbered list focusing on:
- Adding missing skills or keywords
- Highlighting relevant experience
- Improving formatting or structure
- Quantifying achievements
- Tailoring content to job requirements

Format your response as:
1. [First suggestion]
2. [Second suggestion]
3. [Third suggestion]
4. [Fourth suggestion]
5. [Fifth suggestion]

Be specific and actionable. Each suggestion should be clear and implementable.`;

    console.log('🤖 Calling Google Gemini API...');

    // Call Google Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log('✅ Gemini API response received');

    // Parse response text into array of suggestions
    const suggestions = parseResponseToArray(responseText);

    // Ensure we have at least some suggestions
    if (suggestions.length === 0) {
      return getFallbackSuggestions(jobDescription, resumeText);
    }

    return suggestions;

  } catch (error) {
    console.error('❌ AI Suggestions Error:', error.message);

    // Handle specific Google AI errors
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
      console.error('❌ Invalid Google AI API key');
      return ['AI suggestions unavailable: Invalid API key. Please check your Google AI Studio API key.'];
    }

    if (error.message.includes('quota') || error.message.includes('429')) {
      console.error('❌ Google AI API quota exceeded');
      return getFallbackSuggestions(jobDescription, resumeText);
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
