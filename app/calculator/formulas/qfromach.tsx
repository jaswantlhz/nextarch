"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

interface ResultData {
    Q: number;
}

export default function Qfromach() {
    const [values, setValues] = useState({
        ACH: 0,
        V: 0,
        rho: 1.2,
        Cp: 1005.0,
        delta_T: 0,
    });

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const { ACH, V, rho, Cp, delta_T } = values;

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/q-from-ach`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ACH: ACH,
                        V: V,
                        rho: rho,
                        Cp: Cp,
                        delta_T: delta_T,
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
                        Q from ACH (Heat Load)
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Calculates the amount of heat energy supplied to or removed from a
                        space based on air changes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetricCard
                            label="Air Changes (ACH)"
                            value={ACH}
                            unit="h⁻¹"
                            name="ACH"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Room Volume (V)"
                            value={V}
                            unit="m³"
                            name="V"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Air Density (ρ)"
                            value={rho}
                            unit="kg/m³"
                            name="rho"
                            step={0.01}
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Specific Heat (Cp)"
                            value={Cp}
                            unit="J/kg·K"
                            name="Cp"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Temp. Diff (ΔT)"
                            value={delta_T}
                            unit="K"
                            name="delta_T"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? "Calculating..." : "Calculate Heat Load"}
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
                                    Q = \\frac{ACH \\times V \\times \\rho \\times C_p \\times \\Delta T}{3600}
                                `}
                            />
                        </div>

                        <div className="bg-[#131B2C] rounded-xl p-4 font-mono text-sm space-y-3">
                            <div className="flex items-start gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs mt-1 w-24">STEP</span>
                                <span className="text-[#1A73E8] break-all">
                                    {result
                                        ? `Q = (${ACH} × ${V} × ${rho} × ${Cp} × ${delta_T}) / 3600`
                                        : "Q = (ACH × V × ρ × Cp × ΔT) / 3600"
                                    }
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs w-24">IMPLEMENTATION:</span>
                                <span className="text-green-400 font-bold">
                                    {result ? result.Q.toFixed(3) : "Wait for calc..."}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="lg:col-span-4 space-y-6">
                    <ResultCard
                        label="Heat Load (Q)"
                        value={result ? result.Q.toFixed(0) : "---"}
                        unit="W"
                    />

                    {result && (
                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                                Key Parameters
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-xs">Air Exchange</p>
                                    <p className="text-xl font-bold text-white">
                                        {ACH} <span className="text-sm font-normal text-gray-600">ACH</span>
                                    </p>
                                </div>
                                <div className="w-full h-px bg-white/5"></div>
                                <div>
                                    <p className="text-gray-500 text-xs">Room Volume</p>
                                    <p className="text-xl font-bold text-white">
                                        {V} <span className="text-sm font-normal text-gray-600">m³</span>
                                    </p>
                                </div>
                                <div className="w-full h-px bg-white/5"></div>
                                <div>
                                    <p className="text-gray-500 text-xs">Temp Difference</p>
                                    <p className="text-xl font-bold text-white">
                                        {delta_T} <span className="text-sm font-normal text-gray-600">K</span>
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