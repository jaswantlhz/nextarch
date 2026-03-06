"use client"
import { useState, useRef, useEffect } from "react";
import { Settings, User, Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "./theme-context";

export function Header() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setSettingsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header
            className="h-16 border-b flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-30"
            style={{
                background: isDark ? "#0B1221" : "#ffffff",
                borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)",
                transition: "background 0.3s, border-color 0.3s",
            }}
        >
            {/* Brand */}
            <div className="flex items-center gap-2">
                <div className="text-blue-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                    </svg>
                </div>
                <span
                    className="text-xl font-bold"
                    style={{ color: isDark ? "#ffffff" : "#1e293b", transition: "color 0.3s" }}
                >
                    NextArch Precision
                </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">

                {/* Settings button with dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setSettingsOpen(v => !v)}
                        className="p-2 rounded-full transition-colors"
                        style={{
                            color: settingsOpen ? "#3b82f6" : (isDark ? "#9ca3af" : "#64748b"),
                            background: settingsOpen
                                ? (isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)")
                                : "transparent",
                        }}
                        title="Theme"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Dropdown */}
                    {settingsOpen && (
                        <div
                            className="absolute right-0 top-12 w-64 rounded-xl shadow-2xl border overflow-hidden z-50"
                            style={{
                                background: isDark ? "#1e293b" : "#ffffff",
                                borderColor: isDark ? "#334155" : "#e2e8f0",
                                boxShadow: isDark
                                    ? "0 20px 40px rgba(0,0,0,0.5)"
                                    : "0 20px 40px rgba(0,0,0,0.12)",
                            }}
                        >
                            {/* Header */}
                            <div
                                className="px-4 py-3 border-b"
                                style={{
                                    borderColor: isDark ? "#334155" : "#e2e8f0",
                                    background: isDark ? "#0f172a" : "#f8fafc",
                                }}
                            >
                                <p
                                    className="text-xs font-mono uppercase tracking-wider"
                                    style={{ color: isDark ? "#64748b" : "#94a3b8" }}
                                >
                                    Settings
                                </p>
                            </div>

                            {/* Theme section */}
                            <div className="p-3">
                                <p
                                    className="text-[10px] font-mono uppercase tracking-widest mb-2 px-1"
                                    style={{ color: isDark ? "#475569" : "#94a3b8" }}
                                >
                                    Appearance
                                </p>

                                {/* Light Mode option */}
                                <button
                                    onClick={() => { if (isDark) toggleTheme(); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-1"
                                    style={{
                                        background: !isDark
                                            ? "rgba(59,130,246,0.1)"
                                            : "transparent",
                                        color: isDark ? "#94a3b8" : "#2563eb",
                                    }}
                                >
                                    <Sun className="w-4 h-4" />
                                    <span className="text-sm font-medium flex-1 text-left">Light Mode</span>
                                    {!isDark && <Check className="w-4 h-4" />}
                                </button>

                                {/* Dark Mode option */}
                                <button
                                    onClick={() => { if (!isDark) toggleTheme(); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                                    style={{
                                        background: isDark
                                            ? "rgba(59,130,246,0.12)"
                                            : "transparent",
                                        color: !isDark ? "#64748b" : "#60a5fa",
                                    }}
                                >
                                    <Moon className="w-4 h-4" />
                                    <span className="text-sm font-medium flex-1 text-left">Dark Mode</span>
                                    {isDark && <Check className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Separator */}
                            <div
                                className="mx-3 border-t"
                                style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}
                            />

                            {/* Version info */}
                            <div className="px-4 py-2.5">
                                <p
                                    className="text-[10px] font-mono"
                                    style={{ color: isDark ? "#475569" : "#94a3b8" }}
                                >
                                    NextArch Precision v1.4.2-stable
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* User button */}
                <button
                    className="p-1 rounded-full transition-colors bg-[#1A73E8]/20 text-[#1A73E8]"
                    title="User"
                >
                    <User className="w-6 h-6 p-1" />
                </button>
            </div>
        </header>
    );
}
