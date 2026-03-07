"use client";

/**
 * Header Component
 *
 * Top navigation bar for CodeClarify AI.
 * Displays the logo, app name, and a brief tagline.
 */

import React from "react";

export default function Header() {
    return (
        <>
            {/* ── Scoped keyframe animations ─────────────────── */}
            <style>{`
                /* 1. Animated gradient sweep along the bottom edge */
                @keyframes hdr-border-sweep {
                    0%   { background-position: -100% 0; }
                    100% { background-position: 200% 0; }
                }

                /* 2. Logo soft-breathing glow pulse */
                @keyframes hdr-logo-pulse {
                    0%, 100% { box-shadow: 0 0 0px rgba(91,106,240,0), 0 0 0 1px rgba(91,106,240,0.15); }
                    50%       { box-shadow: 0 0 12px rgba(91,106,240,0.3), 0 0 0 1px rgba(91,106,240,0.30); }
                }

                /* 4. Title entrance: slide in from left */
                @keyframes hdr-title-in {
                    from { opacity: 0; transform: translateX(-6px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                /* 5. Tagline entrance: slide in from right */
                @keyframes hdr-tagline-in {
                    from { opacity: 0; transform: translateX(6px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                /* 6. Live indicator pulse */
                @keyframes hdr-live-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.3; }
                }

                /* ── Applied classes ── */
                .hdr-border-line {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        #5b6af0 40%,
                        #8b5cf6 60%,
                        transparent 100%
                    );
                    background-size: 200% 100%;
                    animation: hdr-border-sweep 8s ease infinite;
                }

                .hdr-logo {
                    animation: hdr-logo-pulse 3s ease-in-out infinite;
                    transition: transform 0.2s ease, border-color 0.2s ease,
                                box-shadow 0.2s ease;
                }

                .hdr-logo:hover {
                    transform: scale(1.08);
                    border-color: rgba(91,106,240,0.4) !important;
                }

                .hdr-title {
                    animation: hdr-title-in 0.5s ease 0.1s both;
                }

                .hdr-tagline-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    animation: hdr-tagline-in 0.5s ease 0.25s both;
                }

                .hdr-live-dot {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #34d399;
                    flex-shrink: 0;
                    animation: hdr-live-pulse 2s ease-in-out infinite;
                }
            `}</style>

            <header className="animate-fade-in-up stagger-1" style={styles.header}>
                {/* 1. Animated gradient border line at the bottom */}
                <div className="hdr-border-line" aria-hidden="true" />

                <div className="header-container" style={styles.container}>
                    {/* Logo & Brand */}
                    <div style={styles.brand}>
                        {/* 2 & 3. Logo: breathing pulse + hover scale */}
                        <div className="hdr-logo" style={styles.logoContainer}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 28 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 9L6 14L10 19"
                                    stroke="#5b6af0"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M18 9L22 14L18 19"
                                    stroke="#5b6af0"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15 8L13 20"
                                    stroke="#4e5cdb"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        {/* 4. Title entrance animation */}
                        <div className="hdr-title">
                            <h1 style={styles.title}>
                                Code<span style={styles.titleAccent}>Clarify</span>{" "}
                                <span style={styles.titleAI}>AI</span>
                            </h1>
                        </div>
                    </div>

                    {/* 5 & 6. Tagline with entrance + live indicator */}
                    <div className="header-tagline hdr-tagline-wrapper">
                        <span className="hdr-live-dot" aria-hidden="true" />
                        <p style={styles.tagline}>
                            Understand code instantly
                        </p>
                    </div>
                </div>
            </header>
        </>
    );
}

/* --------------------------------------------------
   Inline Styles
   -------------------------------------------------- */
const styles: Record<string, React.CSSProperties> = {
    header: {
        position: "relative",
        height: "52px",
        flexShrink: 0,
        /* 7. Subtle radial indigo glow on the left (logo) side */
        background: `
            radial-gradient(ellipse 40% 100% at 0% 50%, rgba(91,106,240,0.04) 0%, transparent 100%),
            rgba(10, 10, 11, 0.9)
        `,
        /* Original border removed — replaced by the .hdr-border-line div */
        borderBottom: "none",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        overflow: "hidden", /* keeps the gradient line clipped to the header */
    },
    container: {
        maxWidth: "1440px",
        width: "100%",
        margin: "0 auto",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "7px",
        background: "rgba(91, 106, 240, 0.08)",
        border: "1px solid rgba(91, 106, 240, 0.15)",
    },
    title: {
        fontFamily: "var(--font-display)",
        fontSize: "1.05rem",
        fontWeight: 600,
        color: "var(--text-primary)",
        letterSpacing: "-0.3px",
        lineHeight: 1,
    },
    titleAccent: {
        color: "var(--accent-primary)",
    },
    titleAI: {
        fontSize: "0.6rem",
        fontWeight: 500,
        fontFamily: "var(--font-mono)",
        padding: "1px 5px",
        borderRadius: "4px",
        background: "rgba(91, 106, 240, 0.1)",
        color: "var(--accent-primary)",
        verticalAlign: "super",
        letterSpacing: "0.04em",
    },
    tagline: {
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        letterSpacing: "0.02em",
        margin: 0,
    },
};
