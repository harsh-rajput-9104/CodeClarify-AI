"use client";

/**
 * CodeClarify AI – Main Page
 *
 * Layout:
 * ┌─────────────────────────────────────────────┐
 * │  Header (flex-shrink-0, h-[52px])            │
 * ├─────────────────────────────────────────────┤
 * │  Action Buttons Bar (flex-shrink-0)          │
 * ├────────────────────┬────────────────────────┤
 * │   Code Editor      │   Output Panel          │
 * │   (flex-1, scroll) │   (flex-1, scroll)      │
 * └────────────────────┴────────────────────────┘
 */

import React, { useState, useCallback } from "react";
import Header from "@/components/Header";
import CodeEditor from "@/components/CodeEditor";
import ActionButtons from "@/components/ActionButtons";
import OutputPanel from "@/components/OutputPanel";
import { analyzeCode, type AnalysisAction } from "@/lib/api";

/** Default sample code shown when the app first loads */
const DEFAULT_CODE = `// Welcome to CodeClarify AI! 🎉
// Paste your code here, or try this example:

function fibonacci(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev = 0;
  let current = 1;

  for (let i = 2; i <= n; i++) {
    let next = prev + current;
    prev = current;
    current = next;
  }

  return current;
}

// Calculate the 10th Fibonacci number
console.log(fibonacci(10));
`;

export default function HomePage() {
    // ── State ──────────────────────────────────────────
    const [code, setCode] = useState<string>(DEFAULT_CODE);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeAction, setActiveAction] = useState<AnalysisAction | null>(null);

    // ── Handler: Perform Analysis ──────────────────────
    const handleAction = useCallback(
        async (action: AnalysisAction) => {
            // Don't allow multiple simultaneous requests
            if (isLoading) return;

            // Clear previous results
            setResult(null);
            setError(null);
            setActiveAction(action);
            setIsLoading(true);

            try {
                // Send the code to the backend for analysis
                const response = await analyzeCode(code, action);

                if (response.error) {
                    setError(response.error);
                } else if (response.result) {
                    setResult(response.result);
                } else {
                    setError("Received an empty response. Please try again.");
                }
            } catch (err) {
                setError("An unexpected error occurred. Please try again.");
                console.error("Analysis error:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [code, isLoading]
    );

    // ── Render ─────────────────────────────────────────
    return (
        // Root: full viewport height, no overflow, column stack
        <div className="app-root">
            {/* 1. Header — fixed height, never shrinks */}
            <Header />

            {/* 2. Action Buttons Bar — fixed height, never shrinks */}
            <div className="action-bar">
                <div className="action-bar-inner">
                    <ActionButtons
                        onAction={handleAction}
                        isLoading={isLoading}
                        activeAction={activeAction}
                        hasCode={code.trim().length > 0}
                    />
                </div>
            </div>

            {/* 3. Main workspace — fills ALL remaining height */}
            <div className="workspace-area">
                {/* Left: Code Editor */}
                <div className="editor-pane">
                    <CodeEditor
                        value={code}
                        onChange={setCode}
                    />
                </div>

                {/* Right: AI Output */}
                <div className="output-pane">
                    <OutputPanel
                        result={result}
                        isLoading={isLoading}
                        error={error}
                        action={activeAction}
                    />
                </div>
            </div>

            {/* 4. Status Bar — fixed height, hidden on mobile */}
            <div className="status-bar">
                <span>Groq · llama3-70b-8192</span>
                <span className="status-hide-mobile">{code.split("\n").length} lines</span>
                <span className="status-hide-mobile" style={{ marginLeft: "auto" }}>CodeClarify is AI and can make mistakes.</span>
                <span style={{ marginLeft: "auto" }}>CodeClarify AI © 2026</span>
            </div>
        </div>
    );
}
