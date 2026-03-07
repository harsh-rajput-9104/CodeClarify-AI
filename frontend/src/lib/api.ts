/**
 * API Client for CodeClarify AI
 *
 * Handles communication between the Next.js frontend
 * and the Express.js backend API server.
 */

// Backend API base URL — configurable via environment variable
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Allowed action types
export type AnalysisAction = "explain" | "bugs" | "optimize" | "convert";

// Response shape from the backend
export interface AnalysisResponse {
    result?: string;
    error?: string;
}

/**
 * Sends code to the backend for AI analysis.
 *
 * @param code - The user's code to analyze
 * @param action - The type of analysis to perform
 * @returns The AI-generated analysis result
 * @throws Error if the request fails
 */
export async function analyzeCode(
    code: string,
    action: AnalysisAction
): Promise<AnalysisResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, action }),
        });

        const data = await response.json();

        // If the server returned an error status or an error field
        if (!response.ok || data.error) {
            return {
                error:
                    data.error ||
                    `Server error (${response.status}). Please try again.`,
            };
        }

        return data;
    } catch (error) {
        // Network error or server unreachable
        console.error("API request failed:", error);
        return {
            error:
                "Could not connect to the server. Please make sure the backend is running.",
        };
    }
}
