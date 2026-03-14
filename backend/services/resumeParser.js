/**
 * Resume Parser Service
 * Extracts text content from PDF files
 */

const pdfParse = require('pdf-parse');

/**
 * Parses a PDF resume and extracts text content
 * @param {Buffer} fileBuffer - The PDF file buffer
 * @returns {Promise<string>} Extracted text from the PDF
 */
async function parseResume(fileBuffer) {
  try {
    // Validate input
    if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
      throw new Error('Invalid file buffer provided');
    }

    // Extract text from PDF using pdf-parse
    const data = await pdfParse(fileBuffer);

    // Get extracted text
    let text = data.text || '';

    // Clean extracted text by removing excessive whitespace
    text = text
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n')  // Remove empty lines
      .trim();

    // Handle empty PDF case
    if (!text || text.length === 0) {
      return '';
    }

    return text;

  } catch (error) {
    // Handle corrupted PDF errors
    if (error.message.includes('Invalid PDF') || 
        error.message.includes('PDF header') ||
        error.message.includes('encrypted')) {
      throw new Error('Corrupted or invalid PDF file. Please upload a valid PDF resume.');
    }

    // Handle password-protected PDFs
    if (error.message.includes('password') || error.message.includes('encrypted')) {
      throw new Error('Password-protected PDFs are not supported. Please upload an unprotected PDF.');
    }

    // Generic error
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
}

module.exports = {
  parseResume
};
