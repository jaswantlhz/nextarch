"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

interface ResultData {
    Q: number;
    A?: number;
    Ai: number;
    Ao: number;
}

export default function Windowcalculations() {
    const [equalOpenings, setEqualOpenings] = useState(true);
    const [calcInlet, setCalcInlet] = useState(true);
    const [values, setValues] = useState({
        V_room: 0,
        n_ach: 0,
        K: 0.6,
        V: 0,
        A_effective: 2.0,
    });

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: Number(value) }));
    };

    const { V_room, n_ach, K, V, A_effective } = values;
    const calculatedQ = V_room * n_ach;

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/window-calculations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    V_room,
                    n_ach,
                    K,
                    V,
                    equal_opening: equalOpenings,
                    A_effective: equalOpenings ? null : A_effective,
                    calc_inlet: equalOpenings ? null : calcInlet,
                }),
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error calculating:', error);
            alert('Error calculating. Please ensure the API is running on http://localhost:8000');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Window Calculations</h1>
                    <p className="text-gray-400 max-w-2xl">
                        Calculates opening area for ventilation derived from Room Volume and Air Changes per Hour.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Primary inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard
                            label="Room Volume (V)"
                            value={V_room}
                            unit="m³"
                            name="V_room"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Air Changes per Hour (n)"
                            value={n_ach}
                            unit="ACH"
                            name="n_ach"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Derived Q display */}
                    <div className="bg-[#131B2C] border border-[#1A73E8]/20 rounded-2xl p-4 flex items-center gap-4">
                        <div className="bg-[#1A73E8]/10 p-2 rounded-lg shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Calculated Airflow Rate (Q = n × V)</p>
                            <p className="text-xl font-bold text-[#1A73E8]">{calculatedQ.toFixed(2)} <span className="text-sm font-normal text-gray-500">m³/h</span></p>
                        </div>
                    </div>

                    {/* Secondary inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard
                            label="Flow Coefficient (K)"
                            value={K}
                            unit=""
                            name="K"
                            step={0.05}
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Wind Speed (V)"
                            value={V}
                            unit="m/h"
                            name="V"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Opening type toggle */}
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Equal Openings</p>
                            <p className="text-xs text-gray-500 mt-0.5">Inlet = Outlet area (simplified calculation)</p>
                        </div>
                        <button
                            onClick={() => setEqualOpenings(!equalOpenings)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${equalOpenings ? 'bg-[#1A73E8]' : 'bg-gray-700'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${equalOpenings ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {/* Unequal openings extra inputs */}
                    {!equalOpenings && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <MetricCard
                                label="Effective Area (A_effective)"
                                value={A_effective}
                                unit="m²"
                                name="A_effective"
                                step={0.1}
                                onChange={handleChange}
                            />
                            <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-5">
                                <Label className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-3 block">Calculate For:</Label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setCalcInlet(true)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${calcInlet ? 'bg-[#1A73E8] border-[#1A73E8] text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/20'}`}
                                    >
                                        Inlet
                                    </button>
                                    <button
                                        onClick={() => setCalcInlet(false)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${!calcInlet ? 'bg-[#1A73E8] border-[#1A73E8] text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/20'}`}
                                    >
                                        Outlet
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? 'Calculating...' : 'Calculate Parameters'}
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
                            {equalOpenings ? (
                                <BlockMath
                                    math={`
                                        \\begin{align*}
                                        Q &= V_{room} \\times n_{ach} \\\\[6pt]
                                        A &= \\frac{Q}{K \\times V} \\quad \\text{(equal openings)}
                                        \\end{align*}
                                    `}
                                />
                            ) : (
                                <BlockMath
                                    math={`
                                        \\begin{align*}
                                        \\frac{1}{A_{eff}} &= \\frac{1}{A_i} + \\frac{1}{A_o} \\\\[6pt]
                                        A_i &= \\text{Inlet}, \\quad A_o = \\text{Outlet}
                                        \\end{align*}
                                    `}
                                />
                            )}
                        </div>

                        <div className="bg-[#131B2C] rounded-xl p-4 font-mono text-sm space-y-3">
                            <div className="flex items-start gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs mt-1 w-24">STEP</span>
                                <div className="space-y-1">
                                    <span className="text-[#1A73E8] break-all block">
                                        {equalOpenings
                                            ? `Q = ${V_room} × ${n_ach} = ${calculatedQ.toFixed(2)} m³/h`
                                            : `1/A_eff = 1/Ai + 1/Ao  (A_eff = ${A_effective})`
                                        }
                                    </span>
                                    <span className="text-[#1A73E8] break-all block">
                                        {equalOpenings
                                            ? `A = ${calculatedQ.toFixed(2)} / (${K} × ${V})`
                                            : `Solving for ${calcInlet ? 'Inlet' : 'Outlet'}`
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs w-24">IMPLEMENTATION:</span>
                                <span className="text-green-400 font-bold">
                                    {result
                                        ? equalOpenings
                                            ? `A = ${result.A?.toFixed(3) ?? '---'} m²`
                                            : `Ai = ${result.Ai.toFixed(3)} m²,  Ao = ${result.Ao.toFixed(3)} m²`
                                        : 'Wait for calc...'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="lg:col-span-4 space-y-6">
                    <ResultCard
                        label="Airflow Rate (Q)"
                        value={result ? result.Q.toFixed(2) : "---"}
                        unit="m³/h"
                    />

                    {/* Detailed Breakdown */}
                    {result && (
                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Detailed Breakdown</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-xs">Airflow Rate (Q)</p>
                                    <p className="text-xl font-bold text-white">{result.Q.toFixed(2)} <span className="text-sm font-normal text-gray-600">m³/h</span></p>
                                </div>

                                {result.A !== undefined && result.A !== null && (
                                    <>
                                        <div className="w-full h-px bg-white/5" />
                                        <div>
                                            <p className="text-gray-500 text-xs">Opening Area (A)</p>
                                            <p className="text-xl font-bold text-white">{result.A.toFixed(3)} <span className="text-sm font-normal text-gray-600">m²</span></p>
                                        </div>
                                    </>
                                )}

                                <div className="w-full h-px bg-white/5" />

                                <div>
                                    <p className="text-gray-500 text-xs">Inlet Area (Aᵢ)</p>
                                    <p className="text-xl font-bold text-white">{result.Ai.toFixed(3)} <span className="text-sm font-normal text-gray-600">m²</span></p>
                                </div>

                                <div className="w-full h-px bg-white/5" />

                                <div>
                                    <p className="text-gray-500 text-xs">Outlet Area (Aₒ)</p>
                                    <p className="text-xl font-bold text-white">{result.Ao.toFixed(3)} <span className="text-sm font-normal text-gray-600">m²</span></p>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}