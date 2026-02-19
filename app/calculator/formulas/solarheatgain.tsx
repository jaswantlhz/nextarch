"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

interface ResultData {
    Q_solar: number;
    effective_SHGC: number;
}

export default function SolarHeatGain() {
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
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/solar-heat-gain`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        area: area,
                        SHGC: shgc,
                        projection_factor: projection_factor,
                        solar_irradiation: solar_irradiation,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error calculating:", error);
            alert(
                "Error calculating. Please ensure the API is running on http://localhost:8000"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Equivalent Solar Heat Gain
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Calculates the heat gain through glazing considering shading and solar
                        irradiation.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard
                            label="Window Area (A)"
                            value={area}
                            unit="m²"
                            name="area"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="SHGC"
                            value={shgc}
                            unit=""
                            name="shgc"
                            step={0.01}
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Projection Factor (PF)"
                            value={projection_factor}
                            unit=""
                            name="projection_factor"
                            step={0.1}
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Solar Irradiation (I)"
                            value={solar_irradiation}
                            unit="W/m²"
                            name="solar_irradiation"
                            onChange={handleChange}
                        />
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
                    <div className="bg-[#0f1623] border border-white/5 rounded-2xl p-6 relative">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[#1A73E8] text-xs font-bold uppercase tracking-wider">
                                LIVE FORMULA PREVIEW
                            </h3>
                            <ArrowLeft className="text-white/20 h-5 w-5" />
                        </div>

                        <div className="text-white text-2xl flex justify-center py-8 mb-8">
                            <BlockMath
                                math={`
                                    Q_{\\text{solar}} = A \\times (\\text{SHGC} \\times \\text{PF}) \\times I
                                `}
                            />
                        </div>

                        <div className="bg-[#131B2C] rounded-xl p-4 font-mono text-sm space-y-3">
                            <div className="flex items-start gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs mt-1 w-24">STEP</span>
                                <span className="text-[#1A73E8] break-all">
                                    {result
                                        ? `Q = ${area} × (${shgc} × ${projection_factor}) × ${solar_irradiation}`
                                        : "Q = A × (SHGC × PF) × I"
                                    }
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs w-24">IMPLEMENTATION:</span>
                                <span className="text-green-400 font-bold">
                                    {result ? result.Q_solar.toFixed(3) : "Wait for calc..."}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="lg:col-span-4 space-y-6">
                    <ResultCard
                        label="Solar Heat Gain (Q)"
                        value={result ? result.Q_solar.toFixed(2) : "---"}
                        unit="W"
                    />

                    {result && (
                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                                Parameters
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-xs">Effective SHGC</p>
                                    <p className="text-xl font-bold text-white">
                                        {result.effective_SHGC.toFixed(3)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}
