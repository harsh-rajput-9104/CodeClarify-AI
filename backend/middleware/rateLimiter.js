/**
 * Rate Limiting Middleware
 * 
 * Prevents abuse by limiting the number of requests
 * a single IP address can make per minute.
 * 
 * Current limit: 5 requests per minute per IP.
 */

const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 5,              // Maximum 5 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests. Please wait a minute before trying again.',
    },
});

module.exports = apiLimiter;
