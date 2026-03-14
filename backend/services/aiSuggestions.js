/**
 * AI Suggestions Service
 * Generates personalized resume improvement recommendations using OpenAI
 */

const OpenAI = require('openai');

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generates resume improvement suggestions using GPT-4
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
    if (!process.env.OPENAI_API_KEY) {
      return ['AI suggestions temporarily unavailable. Please try again later.'];
    }

    // Construct prompt instructing LLM to act as hiring expert
    const prompt = `You are an expert hiring manager and career coach. Analyze the following job description and resume, then provide 5 specific, actionable suggestions to improve the resume for this job.

Job Description:
${jobDescription.substring(0, 2000)}

Resume:
${resumeText.substring(0, 2000)}

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
5. [Fifth suggestion]`;

    // Call OpenAI API with gpt-4 model
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert hiring manager and career coach who provides specific, actionable resume improvement advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    // Extract response text
    const responseText = response.choices[0]?.message?.content || '';

    // Parse response text into array of suggestions
    const suggestions = parseResponseToArray(responseText);

    // Ensure we have at least some suggestions
    if (suggestions.length === 0) {
      return ['AI suggestions temporarily unavailable. Please try again later.'];
    }

    return suggestions;

  } catch (error) {
    console.error('AI Suggestions Error:', error.message);

    // Implement fallback message for API failures
    return ['AI suggestions temporarily unavailable. Please try again later.'];
  }
}

/**
 * Parses the LLM response text into an array of suggestions
 * @param {string} text - The response text from the LLM
 * @returns {string[]} Array of suggestions
 */
function parseResponseToArray(text) {
  if (!text) return [];

  const suggestions = [];

  // Split by newlines and filter for numbered items
  const lines = text.split('\n').filter(line => line.trim());

  for (const line of lines) {
    // Match numbered list items (e.g., "1.", "1)", "1 -")
    const match = line.match(/^\d+[\.\)]\s*(.+)$/);
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

  return suggestions;
}

module.exports = {
  generateSuggestions
};
