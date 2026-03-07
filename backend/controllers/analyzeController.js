/**
 * Analyze Controller
 * 
 * Handles the POST /api/analyze endpoint.
 * Receives validated code and action from the request,
 * calls the Groq AI service, and returns the result.
 */

const { analyzeCode } = require('../services/groqService');

/**
 * Handles code analysis requests.
 * By the time this runs, input has already been validated
 * by the validateInput middleware.
 */
const handleAnalyze = async (req, res) => {
    const { code, action } = req.body;

    try {
        console.log(`📊 Analyzing code — Action: ${action}, Lines: ${code.split('\n').length}`);

        // Call the Groq AI service to analyze the code
        const result = await analyzeCode(code, action);

        // Return the AI-generated result
        res.status(200).json({ result });
    } catch (error) {
        console.error('Analysis error:', error.message);

        res.status(500).json({
            error: error.message || 'Failed to analyze code. Please try again.',
        });
    }
};

module.exports = { handleAnalyze };
