/**
 * Input Validation Middleware
 * 
 * Validates the request body for the /api/analyze endpoint.
 * Checks:
 *   - 'code' field is present and non-empty
 *   - 'action' field is one of the allowed actions
 *   - Code does not exceed 350 lines
 */

// Allowed analysis action types
const ALLOWED_ACTIONS = ['explain', 'bugs', 'optimize', 'convert'];

// Maximum number of lines the code input can have
const MAX_CODE_LINES = 350;

const validateInput = (req, res, next) => {
    const { code, action } = req.body;

    // Check that code is provided
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
        return res.status(400).json({
            error: 'Code is required. Please paste some code to analyze.',
        });
    }

    // Check that action is provided and valid
    if (!action || !ALLOWED_ACTIONS.includes(action)) {
        return res.status(400).json({
            error: `Invalid action. Allowed actions: ${ALLOWED_ACTIONS.join(', ')}`,
        });
    }

    // Check code length (max 350 lines)
    const lineCount = code.split('\n').length;
    if (lineCount > MAX_CODE_LINES) {
        return res.status(400).json({
            error: 'Code exceeds maximum allowed length.',
        });
    }

    // All validations passed — proceed to the controller
    next();
};

module.exports = validateInput;
