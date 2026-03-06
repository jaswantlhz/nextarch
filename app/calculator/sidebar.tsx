"use client";

import {
    LayoutGrid,
    Wind,
    Thermometer,
    Volume2,
    TableProperties,
    Sun,
    Activity
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-context";

const sidebarItems = [
    { icon: Wind, label: "Volume of Air (Heat Gain)", mode: "volume-heat-gain" },
    { icon: LayoutGrid, label: "Window Calculations", mode: "window-calculations" },
    { icon: Activity, label: "Volume of Air (Qw + Qt Forces)", mode: "volume-forces" },
    { icon: TableProperties, label: "Q from ACH", mode: "q-from-ach" },
    { icon: Volume2, label: "By Element", mode: "by-element" },
    { icon: Sun, label: "Equivalent Solar Heat Gain", mode: "solar-heat-gain" },
];

export function Sidebar() {
    const searchParams = useSearchParams();
    const currentMode = searchParams.get("mode") || "window-calculations";
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <aside
            className="w-64 flex flex-col h-screen fixed left-0 top-0 z-40"
            style={{
                background: isDark ? "#0B1221" : "#ffffff",
                borderRight: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
                transition: "background 0.3s, border-color 0.3s",
            }}
        >
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="mb-8">
                    <h2
                        className="text-xs font-bold uppercase tracking-wider mb-4 px-2"
                        style={{ color: isDark ? "#6b7280" : "#94a3b8" }}
                    >
                        Calculation Module
                    </h2>
                    <nav className="space-y-2">
                        {sidebarItems.map((item) => {
                            const isActive = currentMode === item.mode;
                            return (
                                <Link
                                    key={item.mode}
                                    href={`/calculator?mode=${item.mode}`}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                                    )}
                                    style={{
                                        background: isActive
                                            ? "#1A73E8"
                                            : "transparent",
                                        color: isActive
                                            ? "#ffffff"
                                            : isDark ? "#9ca3af" : "#64748b",
                                    }}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="truncate">{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto bg-white/20 rounded-full p-0.5 min-w-4 min-h-4 flex items-center justify-center">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Engine Status */}
                <div
                    className="mt-8 mx-2 p-4 rounded-xl border"
                    style={{
                        borderColor: "rgba(59,130,246,0.2)",
                        background: "rgba(59,130,246,0.05)",
                    }}
                >
                    <h3 className="text-blue-400 font-semibold text-sm mb-2">Engine Status</h3>
                    <p
                        className="text-xs leading-relaxed mb-4"
                        style={{ color: isDark ? "#9ca3af" : "#64748b" }}
                    >
                        Real-time calculations active. Using ASHRAE 62.1 standards for ventilation flow parameters.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-green-400 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Implementation Ready
                    </div>
                </div>
            </div>
        </aside>
    );
}
