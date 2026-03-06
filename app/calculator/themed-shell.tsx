"use client"
import { useTheme } from "./theme-context";
import { ReactNode } from "react";

export function ThemedShell({ children }: { children: ReactNode }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className="min-h-screen font-sans selection:bg-blue-500/30"
            style={{
                background: isDark ? "#080C15" : "#f0f4f8",
                color: isDark ? "#ffffff" : "#1e293b",
                transition: "background 0.3s, color 0.3s",
            }}
        >
            {children}
        </div>
    );
}
