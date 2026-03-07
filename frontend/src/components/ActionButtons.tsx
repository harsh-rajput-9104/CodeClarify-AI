"use client";

/**
 * ActionButtons Component
 *
 * Displays the four analysis action buttons:
 * - Explain Code
 * - Find Bugs
 * - Optimize Code
 * - Convert Language
 *
 * Each button has a distinct color and icon.
 * When an action is loading, the button shows a spinner.
 */

import React, { useState } from "react";
import type { AnalysisAction } from "@/lib/api";

interface ActionButtonsProps {
    /** Callback when an action button is clicked */
    onAction: (action: AnalysisAction) => void;
    /** Whether a request is currently in progress */
    isLoading: boolean;
    /** The action currently being processed */
    activeAction: AnalysisAction | null;
    /** Whether there's code in the editor */
    hasCode: boolean;
}

/** Button configuration for each action */
const ACTIONS: {
    action: AnalysisAction;
    label: string;
    icon: string;
    shortcut: string;
    color: string;
    description: string;
}[] = [
        {
            action: "explain",
            label: "Explain",
            icon: "?>",
            shortcut: "⌘1",
            color: "var(--action-explain)",
            description: "Get a simple, beginner-friendly explanation",
        },
        {
            action: "bugs",
            label: "Find Bugs",
            icon: "//",
            shortcut: "⌘2",
            color: "var(--action-bugs)",
            description: "Detect potential issues and bugs",
        },
        {
            action: "optimize",
            label: "Optimize",
            icon: "++",
            shortcut: "⌘3",
            color: "var(--action-optimize)",
            description: "Get performance and readability improvements",
        },
        {
            action: "convert",
            label: "Convert",
            icon: "<>",
            shortcut: "⌘4",
            color: "var(--action-convert)",
            description: "Convert to another programming language",
        },
    ];

export default function ActionButtons({
    onAction,
    isLoading,
    activeAction,
    hasCode,
}: ActionButtonsProps) {
    const [hoveredAction, setHoveredAction] = useState<string | null>(null);

    return (
        <div className="animate-fade-in-up stagger-3">
            <div className="action-grid">
                {ACTIONS.map(({ action, label, icon, shortcut, description }) => {
                    const isActive = activeAction === action && isLoading;
                    const isSelected = activeAction === action && !isLoading;
                    const isDisabled = isLoading || !hasCode;
                    const isHovered = hoveredAction === action;

                    return (
                        /*
                         * Outer wrapper — "group" for CSS group-hover targeting.
                         * It is the outermost 1px-padding shell that reveals the
                         * gradient border on hover (same technique as the Uiverse component).
                         */
                        <div
                            key={action}
                            className={`action-btn-shell${isDisabled ? " action-btn-shell--disabled" : ""}${isActive || isSelected ? " action-btn-shell--active" : ""}`}
                        >
                            {/* Gradient border overlay — fades in on hover */}
                            <span
                                className="action-btn-gradient"
                                aria-hidden="true"
                            />

                            {/* Inner button surface */}
                            <button
                                id={`action-${action}`}
                                onClick={() => onAction(action)}
                                disabled={isDisabled}
                                className="action-btn-inner"
                                onMouseEnter={() => setHoveredAction(action)}
                                onMouseLeave={() => setHoveredAction(null)}
                                title={description}
                            >
                                {/* Icon / Spinner */}
                                <span style={styles.buttonIcon}>
                                    {isActive ? (
                                        <div className="spinner" />
                                    ) : (
                                        <span style={styles.iconGlyph}>{icon}</span>
                                    )}
                                </span>

                                {/* Label — slides right on hover */}
                                <span
                                    className="action-btn-label"
                                    style={{
                                        color: isActive || isSelected ? "#5b6af0" : "#9a9aa0",
                                    }}
                                >
                                    {isActive ? "Analyzing..." : label}
                                </span>

                                {/* Keyboard shortcut hint — fades in on hover */}
                                <span
                                    style={{
                                        ...styles.shortcutHint,
                                        opacity: isHovered && !isDisabled ? 1 : 0,
                                    }}
                                >
                                    {shortcut}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Help text when no code is present */}
            {!hasCode && (
                <p style={styles.helpText}>
                    Paste some code in the editor to get started
                </p>
            )}
        </div>
    );
}

/* --------------------------------------------------
   Inline Styles (only for things that can't easily
   be driven by a shared CSS class)
   -------------------------------------------------- */
const styles: Record<string, React.CSSProperties> = {
    buttonIcon: {
        fontSize: "0.85rem",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "18px",
    },
    iconGlyph: {
        fontFamily: "var(--font-mono)",
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#5b6af0",
        letterSpacing: "-0.5px",
    },
    shortcutHint: {
        marginLeft: "auto",
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        color: "var(--text-muted)",
        padding: "2px 5px",
        borderRadius: "3px",
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        transition: "opacity 150ms ease",
        whiteSpace: "nowrap",
    },
    helpText: {
        marginTop: "0.5rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        textAlign: "center",
    },
};
