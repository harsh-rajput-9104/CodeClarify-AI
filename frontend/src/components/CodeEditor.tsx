"use client";

/**
 * CodeEditor Component
 *
 * Wraps the Monaco Editor to provide a professional
 * code editing experience with syntax highlighting,
 * multi-line editing, scrolling, and copy/paste support.
 *
 * Uses a custom dark theme aligned with the app's
 * color system.
 */

import React, { useRef, useCallback, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
    /** Current code value */
    value: string;
    /** Callback when code changes */
    onChange: (value: string) => void;
    /** Detected or selected language */
    language?: string;
}

export default function CodeEditor({
    value,
    onChange,
    language = "CODE",
}: CodeEditorProps) {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    // ── Copy All state ───────────────────────────────────
    const [copiedAll, setCopiedAll] = useState(false);

    const handleCopyAll = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 1500);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    }, [value]);

    // ── Select All (Monaco API — works on mobile) ────────
    const handleSelectAll = useCallback(() => {
        const ed = editorRef.current;
        if (!ed) return;
        ed.focus();
        const model = ed.getModel();
        if (!model) return;
        const lastLine = model.getLineCount();
        ed.setSelection({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: lastLine,
            endColumn: model.getLineMaxColumn(lastLine),
        });
    }, []);

    /**
     * Called when the Monaco editor mounts.
     * Defines our custom dark theme to match the app palette.
     */
    const handleEditorMount: OnMount = useCallback((editor, monaco) => {
        editorRef.current = editor;

        // Define custom theme matching our design system
        monaco.editor.defineTheme("codeclarify-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "555560", fontStyle: "italic" },
                { token: "keyword", foreground: "5b6af0" },
                { token: "string", foreground: "69b0a8" },
                { token: "number", foreground: "d4a052" },
                { token: "type", foreground: "7b8af0" },
                { token: "function", foreground: "5bb8b0" },
                { token: "variable", foreground: "9a9aa0" },
                { token: "operator", foreground: "6b6b72" },
            ],
            colors: {
                "editor.background": "#0a0a0b",
                "editor.foreground": "#e8e8ea",
                "editor.lineHighlightBackground": "#111113",
                "editor.selectionBackground": "#5b6af030",
                "editor.inactiveSelectionBackground": "#5b6af015",
                "editorCursor.foreground": "#5b6af0",
                "editorLineNumber.foreground": "#333338",
                "editorLineNumber.activeForeground": "#555560",
                "editorIndentGuide.background": "#1a1a1e",
                "editorIndentGuide.activeBackground": "#252529",
                "editor.selectionHighlightBackground": "#5b6af015",
                "editorBracketMatch.background": "#5b6af015",
                "editorBracketMatch.border": "#5b6af040",
                "scrollbarSlider.background": "#ffffff10",
                "scrollbarSlider.hoverBackground": "#ffffff18",
                "scrollbarSlider.activeBackground": "#ffffff22",
            },
        });

        // Apply the theme
        monaco.editor.setTheme("codeclarify-dark");

        // Focus the editor
        editor.focus();
    }, []);

    /**
     * Handles changes in the editor content.
     */
    const handleChange = useCallback(
        (val: string | undefined) => {
            onChange(val || "");
        },
        [onChange]
    );

    const lineCount = value.split("\n").length;

    return (
        <>
            {/* ── Scoped keyframe animations ──────────────────── */}
            <style>{`
                /* 1a. Active indicator pulse on the header dot */
                @keyframes ce-dot-pulse {
                    0%, 100% { box-shadow: 0 0 0px rgba(91,106,240,0); }
                    50%       { box-shadow: 0 0 7px rgba(91,106,240,0.65); }
                }

                /* 1b. Line-count flash when value changes (re-mount via key) */
                @keyframes ce-line-flash {
                    0%   { color: #5b6af0; }
                    100% { color: var(--text-muted); }
                }

                /* 2a. Panel entrance animation */
                @keyframes ce-panel-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* 3. Language badge pop on change (re-mount via key) */
                @keyframes ce-badge-pop {
                    from { opacity: 0; transform: scale(0.85); }
                    to   { opacity: 1; transform: scale(1); }
                }

                /* Skeleton shimmer for loading state */
                @keyframes ce-shimmer {
                    0%, 100% { background-color: rgba(255,255,255,0.04); }
                    50%       { background-color: rgba(91,106,240,0.09); }
                }

                /* ── Applied classes ── */

                /* Active dot */
                .ce-active-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #5b6af0;
                    flex-shrink: 0;
                    animation: ce-dot-pulse 2.5s ease-in-out infinite;
                }

                /* Line count flash — applied fresh every re-mount */
                .ce-line-count {
                    font-size: 0.7rem;
                    font-family: var(--font-mono);
                    color: var(--text-muted);
                    animation: ce-line-flash 0.4s ease forwards;
                }

                /* Header gradient bottom separator */
                .ce-panel-header {
                    position: relative;
                }
                .ce-panel-header::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        rgba(91,106,240,0.35) 0%,
                        rgba(255,255,255,0.07) 40%,
                        rgba(255,255,255,0.07) 100%
                    );
                }

                /* ── Header action buttons (copy + select) ── */
                .ce-hdr-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 26px;
                    height: 26px;
                    padding: 0;
                    border-radius: 5px;
                    border: 1px solid transparent;
                    background: transparent;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
                    position: relative;
                    flex-shrink: 0;
                }
                .ce-hdr-btn:hover {
                    color: var(--text-primary);
                    border-color: rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.04);
                }
                .ce-hdr-btn--copied {
                    color: #34d399 !important;
                }

                /* Tooltip shared by both buttons */
                .ce-hdr-tooltip {
                    position: absolute;
                    bottom: calc(100% + 5px);
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(20,20,24,0.95);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: var(--text-secondary);
                    font-family: var(--font-mono);
                    font-size: 0.65rem;
                    white-space: nowrap;
                    padding: 3px 7px;
                    border-radius: 4px;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.15s ease;
                    z-index: 20;
                }
                .ce-hdr-btn:hover .ce-hdr-tooltip {
                    opacity: 1;
                }

                /* Vertical separator before button group */
                .ce-hdr-sep {
                    width: 1px;
                    height: 14px;
                    background: rgba(255,255,255,0.07);
                    margin: 0 8px;
                    flex-shrink: 0;
                }

                /* Mobile: larger tap targets */
                @media (max-width: 767px) {
                    .ce-hdr-btn {
                        width: 32px;
                        height: 32px;
                        padding: 4px;
                    }
                }

                /* Panel entrance — wraps the panel on load */
                .ce-panel-enter {
                    animation: ce-panel-in 0.5s ease 0.15s both;
                }

                /* Left accent border using a pseudo-element */
                .ce-panel-accent::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, #5b6af0, transparent);
                    border-radius: 2px 0 0 2px;
                    pointer-events: none;
                }

                /* Language badge pop animation */
                .ce-badge-pop {
                    animation: ce-badge-pop 0.25s ease both;
                }

                /* Skeleton loading lines */
                .ce-skeleton-line {
                    height: 12px;
                    border-radius: 4px;
                    animation: ce-shimmer 1.5s ease-in-out infinite;
                }
                .ce-skeleton-line:nth-child(1) { animation-delay: 0s;   }
                .ce-skeleton-line:nth-child(2) { animation-delay: 0.2s; }
                .ce-skeleton-line:nth-child(3) { animation-delay: 0.4s; }
            `}</style>

            {/* 2a. Panel wrapper — entrance animation + left accent + position:relative for ::before */}
            <div
                className="panel ce-panel-enter ce-panel-accent"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {/* Panel Header ─────────────────────────────────── */}
                <div className="panel-header ce-panel-header">
                    {/* 1a. Active indicator dot */}
                    <span className="ce-active-dot" aria-hidden="true" />

                    {/* Editor icon */}
                    <span style={styles.headerIcon}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3.5 2L1 6L3.5 10" stroke="#6b6b72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8.5 2L11 6L8.5 10" stroke="#6b6b72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>

                    <span>Editor</span>

                    {/* 3. Language badge — key forces re-mount → badge-pop anim */}
                    <div
                        key={`badge-${language}`}
                        className="ce-badge-pop"
                        style={styles.languageBadge}
                    >
                        {language}
                    </div>

                    {/* 1b. Line count — key forces re-mount → line-flash anim */}
                    <span
                        key={`lines-${lineCount}`}
                        className="ce-line-count"
                    >
                        {lineCount} ln
                    </span>

                    {/* ── Separator + button group ──────────────── */}
                    <span className="ce-hdr-sep" aria-hidden="true" />

                    {/* BUTTON 1 — Copy All */}
                    <button
                        className={`ce-hdr-btn${copiedAll ? " ce-hdr-btn--copied" : ""}`}
                        onClick={handleCopyAll}
                        aria-label="Copy all code"
                    >
                        {copiedAll ? (
                            /* Checkmark */
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6.5L4.5 9L10 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            /* Clipboard */
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <rect x="4" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M1 4.5V10C1 10.55 1.45 11 2 11H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                        )}
                        <span className="ce-hdr-tooltip">
                            {copiedAll ? "Copied!" : "Copy all"}
                        </span>
                    </button>

                    {/* BUTTON 2 — Select All (Monaco API, works on mobile) */}
                    <button
                        className="ce-hdr-btn"
                        onClick={handleSelectAll}
                        aria-label="Select all code"
                    >
                        {/* Selection / cursor icon */}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2.5 1.5" />
                            <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        <span className="ce-hdr-tooltip">Select all</span>
                    </button>
                </div>

                {/* Monaco Editor ─────────────────────────────────── */}
                {/* 2c. Subtle inner top glow separating header from code */}
                <div
                    className="editor-container editor-container-inner"
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflow: "hidden",
                        width: "100%",
                        boxShadow: "inset 0 1px 0 rgba(91, 106, 240, 0.06)",
                    }}
                >
                    <Editor
                        height="100%"
                        language={language}
                        value={value}
                        onChange={handleChange}
                        onMount={handleEditorMount}
                        theme="codeclarify-dark"
                        options={{
                            fontSize: 14,
                            fontFamily: "'Geist Mono', 'JetBrains Mono', 'SF Mono', monospace",
                            fontLigatures: false,
                            lineHeight: 22,
                            padding: { top: 16, bottom: 16 },
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: "off",
                            renderLineHighlight: "line",
                            cursorBlinking: "smooth",
                            cursorSmoothCaretAnimation: "on",
                            smoothScrolling: true,
                            bracketPairColorization: { enabled: false },
                            guides: {
                                indentation: true,
                                bracketPairs: false,
                            },
                            overviewRulerBorder: false,
                            overviewRulerLanes: 0,
                            hideCursorInOverviewRuler: true,
                            renderWhitespace: "selection",
                            contextmenu: true,
                            quickSuggestions: false,
                            suggestOnTriggerCharacters: false,
                            tabSize: 2,
                            detectIndentation: true,
                            lineNumbersMinChars: 3,
                            scrollbar: {
                                horizontal: "auto",
                                vertical: "auto",
                                horizontalScrollbarSize: 6,
                                verticalScrollbarSize: 6,
                                useShadows: false,
                            },
                        }}
                        loading={
                            /* 2d. Skeleton shimmer loading state */
                            <div style={styles.skeletonContainer}>
                                <div className="ce-skeleton-line" style={{ width: "60%" }} />
                                <div className="ce-skeleton-line" style={{ width: "80%" }} />
                                <div className="ce-skeleton-line" style={{ width: "45%" }} />
                            </div>
                        }
                    />
                </div>
            </div>
        </>
    );
}

/* --------------------------------------------------
   Inline Styles
   -------------------------------------------------- */
const styles: Record<string, React.CSSProperties> = {
    headerIcon: {
        display: "flex",
        alignItems: "center",
    },
    languageBadge: {
        marginLeft: "auto",
        fontSize: "0.7rem",
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        padding: "2px 10px",
        borderRadius: "4px",
        background: "rgba(91, 106, 240, 0.08)",
        color: "#5b6af0",
        border: "1px solid rgba(91, 106, 240, 0.15)",
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
    },
    skeletonContainer: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "12px",
        padding: "20px 16px",
        height: "100%",
    },
};
