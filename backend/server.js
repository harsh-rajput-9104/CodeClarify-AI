/**
 * CodeClarify AI - Backend Server
 * 
 * Express.js server that acts as a proxy between the frontend
 * and the Groq AI API. Handles input validation, rate limiting,
 * and prompt construction for code analysis.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file FIRST
dotenv.config();

const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// Middleware Configuration
// --------------------------------------------------

// Parse incoming JSON request bodies
app.use(express.json({ limit: '1mb' }));

// Enable CORS for the frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// --------------------------------------------------
// Routes
// --------------------------------------------------

// Mount the analyze API routes
app.use('/api', analyzeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CodeClarify AI Backend is running' });
});

// --------------------------------------------------
// Error Handling
// --------------------------------------------------

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`✅ CodeClarify AI Backend running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/analyze`);
});
