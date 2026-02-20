"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useTheme } from "../theme-context";

interface ResultData {
    Q_solar: number;
    effective_SHGC: number;
}

export default function SolarHeatGain() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [values, setvalues] = useState({
        area: 0,
        shgc: 0,
        projection_factor: 1,
        solar_irradiation: 0,
    });
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setvalues((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const { area, shgc, projection_factor, solar_irradiation } = values;

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.API_URL}/api/solar-heat-gain`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ area, SHGC: shgc, projection_factor, solar_irradiation }),
            });
            if (!response.ok) throw new Error("API request failed");
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error calculating:", error);
            alert("Error calculating. Please ensure the API is running on http://localhost:8000");
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-3xl font-bold mb-2" style={{ color: titleColor }}>Equivalent Solar Heat Gain</h1>
                    <p className="max-w-2xl" style={{ color: subtitleColor }}>
                        Calculates the heat gain through glazing considering shading and solar irradiation.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard label="Window Area (A)" value={area} unit="m²" name="area" onChange={handleChange} />
                        <MetricCard label="SHGC" value={shgc} unit="" name="shgc" step={0.01} onChange={handleChange} />
                        <MetricCard label="Projection Factor (PF)" value={projection_factor} unit="" name="projection_factor" step={0.1} onChange={handleChange} />
                        <MetricCard label="Solar Irradiation (I)" value={solar_irradiation} unit="W/m²" name="solar_irradiation" onChange={handleChange} />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? "Calculating..." : "Calculate Gain"}
                        </Button>
                    </div>

                    {/* Live Formula Preview */}
                    <div className="rounded-2xl p-6 relative" style={{ background: previewBg, border: previewBorder }}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[#1A73E8] text-xs font-bold uppercase tracking-wider">LIVE FORMULA PREVIEW</h3>
                            <ArrowLeft className="h-5 w-5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1" }} />
                        </div>
                        <div className="text-2xl flex justify-center py-8 mb-8" style={{ color: titleColor }}>
                            <BlockMath math={`Q_{\\text{solar}} = A \\times (\\text{SHGC} \\times \\text{PF}) \\times I`} />
                        </div>
                        <div className="rounded-xl p-4 font-mono text-sm space-y-3" style={{ background: stepBg, border: stepBorder }}>
                            <div className="flex items-start gap-4 mx-4 my-2">
                                <span className="uppercase tracking-wider text-xs mt-1 w-24" style={{ color: labelColor }}>STEP</span>
                                <span className="text-[#1A73E8] break-all">
                                    {result
                                        ? `Q = ${area} × (${shgc} × ${projection_factor}) × ${solar_irradiation}`
                                        : "Q = A × (SHGC × PF) × I"
                                    }
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mx-4 my-2">
                                <span className="uppercase tracking-wider text-xs w-24" style={{ color: labelColor }}>IMPLEMENTATION:</span>
                                <span className="text-green-400 font-bold">
                                    {result ? result.Q_solar.toFixed(3) : "Wait for calc..."}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <ResultCard label="Solar Heat Gain (Q)" value={result ? result.Q_solar.toFixed(2) : "---"} unit="W" />

                    {result && (
                        <div className="rounded-2xl p-6 space-y-4" style={{ background: cardBg, border: cardBorder }}>
                            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: subtitleColor }}>Parameters</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs" style={{ color: labelColor }}>Effective SHGC</p>
                                    <p className="text-xl font-bold" style={{ color: titleColor }}>{result.effective_SHGC.toFixed(3)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
