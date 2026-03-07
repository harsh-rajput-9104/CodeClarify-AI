import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CodeClarify AI — Understand Code Instantly",
    description:
        "A beginner-friendly AI tool that explains code, finds bugs, optimizes performance, and converts between programming languages. Paste your code and get instant, structured explanations.",
    keywords: [
        "code explanation",
        "AI code analysis",
        "learn programming",
        "beginner coding",
        "code optimizer",
        "bug finder",
        "code converter",
    ],
    openGraph: {
        title: "CodeClarify AI — Understand Code Instantly",
        description:
            "Paste code, get structured AI explanations. Perfect for beginners learning to code.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/geist@1.2.2/dist/fonts/geist-mono/style.css"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
