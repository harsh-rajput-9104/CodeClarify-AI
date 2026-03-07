"use client";

/**
 * OutputPanel Component
 *
 * Displays structured AI-generated explanations.
 * Renders the markdown response with proper formatting:
 * - Section headers
 * - Code blocks
 * - Bullet lists
 * - Comfortable spacing
 *
 * Shows different states:
 * - Empty (initial welcome state)
 * - Loading (analyzing animation)
 * - Error (error message)
 * - Result (formatted AI output)
 */

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface OutputPanelProps {
    /** The AI-generated result (markdown string) */
    result: string | null;
    /** Whether a request is loading */
    isLoading: boolean;
    /** Error message if the request failed */
    error: string | null;
    /** The action that was performed */
    action: string | null;
}

/** Labels and icons for each action type */
const ACTION_LABELS: Record<string, { label: string; icon: string }> = {
    explain: { label: "Explanation", icon: "?>" },
    bugs: { label: "Bug Analysis", icon: "//" },
    optimize: { label: "Optimization", icon: "++" },
    convert: { label: "Conversion", icon: "<>" },
};

/* ── Chip config for the empty state ────────────────── */
const FEATURE_CHIPS = [
    "Simple Explanations",
    "Line-by-Line Breakdown",
    "Example Usage",
    "Key Takeaways",
];

export default function OutputPanel({
    result,
    isLoading,
    error,
    action,
}: OutputPanelProps) {
    // Get the action label for display
    const actionInfo = action ? ACTION_LABELS[action] : null;

    return (
        <>
            {/* ── Scoped keyframe animations ──────────────────────── */}
            <style>{`
                /* 1a. Ready-dot ripple ring */
                @keyframes op-ripple {
                    0%   { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(2.2); opacity: 0; }
                }

                /* 1c. Action badge slide-in */
                @keyframes op-badge-in {
                    from { opacity: 0; transform: translateX(8px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                /* 2a. Skeleton shimmer sweep */
                @keyframes op-shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }

                /* 2b. Blinking dots for "Analyzing..." */
                @keyframes op-dot-blink {
                    0%, 80%, 100% { opacity: 0; }
                    40%           { opacity: 1; }
                }

                /* 2c. Loading border pulse */
                @keyframes op-border-pulse {
                    0%, 100% { border-color: rgba(91,106,240,0.06); }
                    50%       { border-color: rgba(91,106,240,0.18); }
                }

                /* 3a. Error shake entrance */
                @keyframes op-error-shake {
                    0%,100% { transform: translateX(0); }
                    20%     { transform: translateX(-4px); }
                    40%     { transform: translateX(4px); }
                    60%     { transform: translateX(-2px); }
                    80%     { transform: translateX(2px); }
                }

                /* 4a. Empty icon float */
                @keyframes op-float {
                    0%,100% { transform: translateY(0px); }
                    50%     { transform: translateY(-6px); }
                }

                /* 4b. Feature-chip staggered entrance */
                @keyframes op-chip-in {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* 4c. Empty title reveal */
                @keyframes op-title-reveal {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* 5a. Result entrance */
                @keyframes op-result-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ── Applied classes ── */

                /* Header gradient separator */
                .op-panel-header {
                    position: relative;
                }
                .op-panel-header::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(
                        to right,
                        rgba(91,106,240,0.28) 0%,
                        rgba(255,255,255,0.07) 40%,
                        transparent 100%
                    );
                }

                /* Ready dot ripple wrapper */
                .op-dot-wrap {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .op-dot-ring {
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 1px solid rgba(52,211,153,0.4);
                    animation: op-ripple 2s ease-out infinite;
                    pointer-events: none;
                }

                /* Action badge animated entrance */
                .op-action-badge-animated {
                    animation: op-badge-in 0.25s ease both;
                }

                /* Skeleton lines */
                .op-skeleton {
                    height: 11px;
                    border-radius: 3px;
                    background: linear-gradient(
                        90deg,
                        rgba(255,255,255,0.04) 25%,
                        rgba(91,106,240,0.10) 50%,
                        rgba(255,255,255,0.04) 75%
                    );
                    background-size: 200% 100%;
                    animation: op-shimmer 1.8s ease-in-out infinite;
                }
                .op-skeleton-s1 { animation-delay: 0s;    }
                .op-skeleton-s2 { animation-delay: 0.15s; }
                .op-skeleton-s3 { animation-delay: 0.30s; }
                .op-skeleton-s4 { animation-delay: 0.45s; }
                .op-skeleton-s5 { animation-delay: 0.60s; }

                /* Animated dots */
                .op-dot {
                    animation: op-dot-blink 1.4s ease-in-out infinite;
                    opacity: 0;
                }
                .op-dot-1 { animation-delay: 0s;   }
                .op-dot-2 { animation-delay: 0.2s; }
                .op-dot-3 { animation-delay: 0.4s; }

                /* Loading container border pulse */
                .op-loading-wrap {
                    border: 1px solid rgba(91,106,240,0.06);
                    border-radius: 8px;
                    padding: 2rem;
                    animation: op-border-pulse 3s ease-in-out infinite;
                }

                /* Error entrance */
                .op-error-container {
                    animation: op-error-shake 0.4s ease both, fadeIn 0.3s ease both;
                }

                /* Empty: floating icon */
                .op-float-icon {
                    animation: op-float 4s ease-in-out infinite;
                    filter: drop-shadow(0 4px 12px rgba(91,106,240,0.2));
                }

                /* Feature chips */
                .op-chip {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    font-family: var(--font-mono);
                    color: var(--text-muted);
                    padding: 10px 14px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 6px;
                    opacity: 0;
                    animation: op-chip-in 0.4s ease forwards;
                    transition: background 0.15s ease, border-color 0.15s ease;
                }
                .op-chip:hover {
                    background: rgba(91,106,240,0.06);
                    border-color: rgba(91,106,240,0.15);
                }
                .op-chip-1 { animation-delay: 0.10s; }
                .op-chip-2 { animation-delay: 0.20s; }
                .op-chip-3 { animation-delay: 0.30s; }
                .op-chip-4 { animation-delay: 0.40s; }

                /* Empty title */
                .op-empty-title {
                    animation: op-title-reveal 0.4s ease 0.05s both;
                }

                /* Result container */
                .op-result {
                    animation: op-result-in 0.4s ease both;
                }
            `}</style>

            <div
                className="panel animate-fade-in-up stagger-4"
                style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
            >
                {/* ── Panel Header ──────────────────────────────────── */}
                <div className="panel-header op-panel-header">
                    <span style={styles.headerIcon}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1L11 6L6 11" stroke="#6b6b72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M1 6H10" stroke="#6b6b72" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </span>
                    <span>Output</span>

                    {/* 1a. Ready badge with ripple ring around dot */}
                    {!isLoading && !error && !result && (
                        <div style={styles.readyBadge}>
                            {/* Ripple wrapper */}
                            <span className="op-dot-wrap">
                                <span className="op-dot-ring" aria-hidden="true" />
                                <span style={styles.readyDot} />
                            </span>
                            <span>Ready</span>
                        </div>
                    )}

                    {/* 1c. Action badge — key forces re-mount → slide-in animation */}
                    {actionInfo && (
                        <div
                            key={`badge-${action}`}
                            className="op-action-badge-animated"
                            style={styles.actionBadge}
                        >
                            <span style={styles.actionIcon}>{actionInfo.icon}</span>
                            <span>{actionInfo.label}</span>
                        </div>
                    )}
                </div>

                {/* ── Panel Content ─────────────────────────────────── */}
                <div className="output-panel-content" style={styles.content}>

                    {/* ── Loading State ──── */}
                    {isLoading && (
                        <div style={styles.loadingContainer}>
                            {/* 2c. Pulsing-border wrapper */}
                            <div className="op-loading-wrap" style={{ width: "100%", maxWidth: "340px" }}>
                                {/* 2a. Skeleton header bar */}
                                <div
                                    className="op-skeleton"
                                    style={{ width: "30%", height: "8px", marginBottom: "1rem", background: "rgba(91,106,240,0.08)", backgroundImage: "none", animation: "none" }}
                                />
                                {/* 2a. Code-line skeletons */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div className="op-skeleton op-skeleton-s1" style={{ width: "75%" }} />
                                    <div className="op-skeleton op-skeleton-s2" style={{ width: "55%" }} />
                                    <div className="op-skeleton op-skeleton-s3" style={{ width: "85%" }} />
                                    <div className="op-skeleton op-skeleton-s4" style={{ width: "40%" }} />
                                    <div className="op-skeleton op-skeleton-s5" style={{ width: "65%" }} />
                                </div>
                            </div>

                            {/* 2b. Animated "Analyzing..." text */}
                            <p style={styles.loadingText}>
                                Analyzing
                                <span className="op-dot op-dot-1">.</span>
                                <span className="op-dot op-dot-2">.</span>
                                <span className="op-dot op-dot-3">.</span>
                            </p>
                            <p style={styles.loadingSubtext}>
                                This usually takes a few seconds
                            </p>
                        </div>
                    )}

                    {/* ── Error State ──── */}
                    {!isLoading && error && (
                        <div
                            className="op-error-container"
                            style={{
                                ...styles.errorContainer,
                                /* 3b. Red left accent + icon glow via inline additions */
                                borderLeft: "2px solid rgba(239,68,68,0.4)",
                            }}
                        >
                            <span
                                style={{
                                    ...styles.errorIcon,
                                    boxShadow: "0 0 8px rgba(239,68,68,0.2)",
                                }}
                            >
                                !
                            </span>
                            <p style={styles.errorText}>{error}</p>
                        </div>
                    )}

                    {/* ── Result State ──── */}
                    {!isLoading && !error && result && (
                        <div className="op-result markdown-output" style={styles.resultContainer}>
                            {/* 5b. Result top accent line */}
                            <div style={styles.resultAccentLine} />
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {result}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* ── Empty / Welcome State ──── */}
                    {!isLoading && !error && !result && (
                        <div
                            style={{
                                ...styles.emptyContainer,
                                /* 4d. Radial background texture */
                                background: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(91,106,240,0.04) 0%, transparent 70%)",
                            }}
                        >
                            {/* 4a. Floating icon with glow */}
                            <div style={styles.emptyIcon}>
                                <div className="op-float-icon">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="2" y="2" width="36" height="36" rx="8" fill="none" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" />
                                        <path d="M14 15L10 20L14 25" stroke="#5b6af0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                                        <path d="M26 15L30 20L26 25" stroke="#5b6af0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                                        <path d="M23 12L17 28" stroke="#4e5cdb" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                    </svg>
                                </div>
                            </div>

                            {/* 4c. Title with entrance animation */}
                            <h3 className="op-empty-title" style={styles.emptyTitle}>
                                Ready to Analyze
                            </h3>

                            <p style={styles.emptyText}>
                                Paste code and choose an action above to get a structured AI analysis.
                            </p>

                            {/* 4b. Feature chips — staggered entrance + hover effect */}
                            <div style={styles.emptyFeatures}>
                                {FEATURE_CHIPS.map((chip, i) => (
                                    <div key={chip} className={`op-chip op-chip-${i + 1}`}>
                                        <span style={styles.featureDot} />
                                        {chip}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 5c. Scroll fade gradient — always present, only visible when scrolling */}
                    <div style={styles.scrollFade} aria-hidden="true" />
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
    content: {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: "1.5rem",
        position: "relative",
    },
    readyBadge: {
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        fontSize: "0.7rem",
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        color: "var(--text-muted)",
    },
    readyDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#34d399",
        animation: "pulse-dot 2s ease-in-out infinite",
        display: "inline-block",
        position: "relative",
        zIndex: 1,
    },
    actionBadge: {
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "0.7rem",
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        padding: "2px 10px",
        borderRadius: "4px",
        background: "rgba(91, 106, 240, 0.08)",
        color: "#5b6af0",
        border: "1px solid rgba(91, 106, 240, 0.15)",
    },
    actionIcon: {
        fontWeight: 600,
        letterSpacing: "-0.5px",
    },

    // Loading state
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "300px",
        gap: "1.25rem",
    },
    loadingText: {
        fontFamily: "var(--font-body)",
        fontSize: "0.95rem",
        fontWeight: 500,
        color: "var(--text-primary)",
    },
    loadingSubtext: {
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
    },

    // Error state
    errorContainer: {
        display: "flex",
        alignItems: "flex-start",
        gap: "0.6rem",
        padding: "0.75rem 1rem",
        background: "rgba(239, 68, 68, 0.06)",
        border: "1px solid rgba(239, 68, 68, 0.15)",
        borderRadius: "7px",
    },
    errorIcon: {
        fontSize: "0.7rem",
        fontWeight: 700,
        fontFamily: "var(--font-mono)",
        color: "#ef4444",
        width: "18px",
        height: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "1.5px solid #ef4444",
        flexShrink: 0,
        lineHeight: 1,
    },
    errorText: {
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        color: "#f87171",
        lineHeight: 1.5,
    },

    // Result state
    resultContainer: {
        // animation handled by .op-result class
    },
    resultAccentLine: {
        height: "1px",
        width: "100%",
        background: "linear-gradient(to right, #5b6af0, #8b5cf6, transparent)",
        borderRadius: "1px",
        marginBottom: "1rem",
    },

    // Scroll fade at bottom of content area
    scrollFade: {
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        height: "40px",
        background: "linear-gradient(to top, rgba(10,10,11,0.75), transparent)",
        pointerEvents: "none",
        marginTop: "-40px",
    },

    // Empty / Welcome state
    emptyContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "300px",
        textAlign: "center",
        gap: "0.5rem",
    },
    emptyIcon: {
        marginBottom: "0.25rem",
        opacity: 0.9,
    },
    emptyTitle: {
        fontFamily: "var(--font-display)",
        fontSize: "1.125rem",
        fontWeight: 600,
        color: "var(--text-primary)",
        letterSpacing: "-0.3px",
    },
    emptyText: {
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        color: "var(--text-muted)",
        maxWidth: "340px",
        lineHeight: 1.6,
    },
    emptyFeatures: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.4rem",
        marginTop: "1rem",
    },
    featureDot: {
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        background: "#5b6af0",
        flexShrink: 0,
        display: "inline-block",
    },
};
