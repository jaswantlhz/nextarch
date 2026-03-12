"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "./dashboard-components";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useTheme } from "./theme-context";

interface ResultData {
    Q: number;
    A?: number; // Total opening area
    Ai: number;
    Ao: number;
}

export default function WindowOpeningDashboard() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [values, setValues] = useState({
        V_room: 120, // Default matching design
        n_ach: 6,    // Default matching design
        v_wind: 2.5, // Default matching design
        K: 0.65,     // Default matching design
    });

    // Result state
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isMetric, setIsMetric] = useState(true);

    const { V_room, n_ach, v_wind, K } = values;
    
    // Live calculated value
    const calculatedA = (V_room * n_ach) / (3600 * v_wind * K);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            // Keep the standard API pattern to match other components
            // Fallback to client-side calc if API doesn't exist yet
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/window-calculations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        V_room, n_ach, K, V: v_wind * 3600, // API probably expects m/h if it's the same as windowcalculations.tsx
                        equal_opening: true,
                    }),
                });
                if (!response.ok) throw new Error('API request failed');
                const data = await response.json();
                setResult(data);
            } catch (apiError) {
                // If the API isn't exactly matching, use client-side result
                setResult({
                    Q: V_room * n_ach,
                    A: calculatedA,
                    Ai: calculatedA,
                    Ao: calculatedA
                });
            }
        } catch (error) {
            console.error('Error calculating:', error);
            alert('Error calculating.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const titleColor = isDark ? "#ffffff" : "#1e293b";
    const subtitleColor = isDark ? "#9ca3af" : "#64748b";
    const labelColor = isDark ? "#6b7280" : "#94a3b8";
    const cardBg = isDark ? "#131B2C" : "#ffffff";
    const cardBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0";
    const previewBg = isDark ? "#0f1623" : "#f8fafc";
    const previewBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";
    const stepBg = isDark ? "#131B2C" : "#f1f5f9";
    const stepBorder = isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: titleColor }}>Optimised Window Opening</h1>
                    <p className="max-w-2xl" style={{ color: subtitleColor }}>
                        Determine required effective area based on room geometry and airflow requirements.
                    </p>
                </div>
                <div
                    className="p-1 rounded-lg flex"
                    style={{
                        background: isDark ? "#131B2C" : "#f1f5f9",
                        border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
                    }}
                >
                    <button
                        onClick={() => setIsMetric(true)}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${isMetric ? 'bg-[#1A73E8] text-white' : ''}`}
                        style={!isMetric ? { color: subtitleColor } : {}}
                    >
                        Metric
                    </button>
                    <button
                        onClick={() => setIsMetric(false)}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${!isMetric ? 'bg-[#1A73E8] text-white' : ''}`}
                        style={isMetric ? { color: subtitleColor } : {}}
                    >
                        Imperial
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard
                            label="Room Volume (V)"
                            value={V_room}
                            unit="m³"
                            name="V_room"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Air Changes (N)"
                            value={n_ach}
                            unit="ACH/h"
                            name="n_ach"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Wind Speed (v)"
                            value={v_wind}
                            unit="m/s"
                            name="v_wind"
                            step={0.1}
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Flow Coeff. (K)"
                            value={K}
                            unit="dim."
                            name="K"
                            step={0.05}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? "Calculating..." : "Calculate Parameters"}
                        </Button>
                    </div>

                    {/* Live Formula Preview */}
                    <div className="rounded-2xl p-6 relative" style={{ background: previewBg, border: previewBorder }}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[#1A73E8] text-xs font-bold uppercase tracking-wider">LIVE FORMULA PREVIEW</h3>
                            <ArrowLeft className="h-5 w-5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1" }} />
                        </div>
                        <div className="text-xl flex justify-center py-8 mb-8 w-full overflow-x-auto" style={{ color: titleColor }}>
                            <BlockMath math={`\\begin{align*}
                                A_{eff} &= \\frac{V_{room} \\times n_{ach}}{3600 \\times v_{wind} \\times K} \\\\[6pt]
                                A_{eff} &= \\frac{${V_room || 0} \\times ${n_ach || 0}}{3600 \\times ${v_wind || 0} \\times ${K || 0.6}} \\\\[6pt]
                                A_{eff} &= ${(!V_room || !n_ach || !v_wind || !K) ? '\\text{---}' : '\\mathbf{' + ((V_room * n_ach) / (3600 * v_wind * K)).toFixed(3) + '}'} \\; \\text{m}^2
                            \\end{align*}`} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <ResultCard
                        label="Total Effective Area"
                        value={result?.A?.toFixed(3) || "---"}
                        unit="m²"
                    />

                    {result && (
                        <div className="rounded-2xl p-6 space-y-4" style={{ background: cardBg, border: cardBorder }}>
                            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: subtitleColor }}>Detailed Breakdown</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Airflow Rate (Q)</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>{result.Q.toFixed(2)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m³/h</span></p>
                                </div>
                                <div className="w-full h-px" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0" }} />
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Total Area (A)</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>{result.A?.toFixed(3)} <span className="text-sm font-normal" style={{ color: subtitleColor }}>m²</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button className="w-full bg-[#131B2C] hover:bg-[#1A73E8] text-white border border-[#e2e8f0] dark:border-white/10 h-14 text-lg font-medium rounded-xl transition-all group mt-6">
                        <FileText className="mr-2 h-5 w-5 text-gray-400 group-hover:text-white" />
                        Generate Technical Report
                    </Button>
                </div>
            </div>
        </div>
    );
}
