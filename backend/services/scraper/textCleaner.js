/**
 * Text Cleaner
 * Cleans and normalizes extracted text
 */

/**
 * Cleans extracted text by removing extra whitespace and normalizing formatting
 * @param {string} text - The text to clean
 * @returns {string} Cleaned text
 */
function cleanText(text) {
  if (!text) return '';

  let cleaned = text;

  // Remove excessive whitespace
  cleaned = cleaned.replace(/[ \t]+/g, ' ');

  // Remove repeated line breaks (more than 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Remove leading/trailing whitespace from each line
  cleaned = cleaned.split('\n')
    .map(line => line.trim())
    .join('\n');

  // Remove any remaining leading/trailing whitespace
  cleaned = cleaned.trim();

  // Remove common noise patterns
  cleaned = cleaned.replace(/\[object Object\]/g, '');
  cleaned = cleaned.replace(/undefined/g, '');
  cleaned = cleaned.replace(/null/g, '');

  // Normalize unicode spaces
  cleaned = cleaned.replace(/\u00A0/g, ' '); // Non-breaking space
  cleaned = cleaned.replace(/\u2003/g, ' '); // Em space
  cleaned = cleaned.replace(/\u2002/g, ' '); // En space

  return cleaned;
}

module.exports = { cleanText };
