/**
 * Analyze Routes
 * 
 * Defines the API routes for code analysis.
 * Applies rate limiting and input validation middleware
 * before passing requests to the controller.
 */

const express = require('express');
const router = express.Router();

const { handleAnalyze } = require('../controllers/analyzeController');
const validateInput = require('../middleware/validateInput');
const apiLimiter = require('../middleware/rateLimiter');

// GET /api/analyze - Health check endpoint
router.get('/analyze', (req, res) => {
  res.json({
    message: 'CodeClarify AI API is running. Use POST /api/analyze to analyze code.'
  });
});

// POST /api/analyze
// Flow: Rate Limit → Validate Input → Controller
router.post('/analyze', apiLimiter, validateInput, handleAnalyze);

module.exports = router;
