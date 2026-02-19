"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

interface ResultData {
    Qs: number;
    Ql_vapor: number;
    Q_humidity: number;
    Qt_vapor: number;
    Qt_humidity: number;
}

export default function Volumeofairheatgain() {
    const [values, setvalues] = useState({
        ks: 0,
        h: 0,
        t: 0,
        wo: 0,
        kl: 0,
        wi: 0,
    });

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setvalues(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }

    const { ks, h, t, wo, kl, wi } = values;

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.API_URL}/api/volume-air-heat-gain`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Ks: ks,
                    Kl: kl,
                    t: t,
                    h: h,
                    wo: wo,
                    wi: wi
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

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
                    <h1 className="text-3xl font-bold text-white mb-2">Volume of Air (Heat Gain)</h1>
                    <p className="text-gray-400 max-w-2xl">
                        Calculates sensible and latent air volumes based on heat gain and humidity differences.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetricCard
                            label="Sensible Heat (Ks)"
                            value={ks}
                            unit="W"
                            name="ks"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Vapor Diff (h)"
                            value={h}
                            unit="mm Hg"
                            name="h"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Temp Rise (t)"
                            value={t}
                            unit="°C"
                            name="t"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Spec. Humidity Out (wo)"
                            value={wo}
                            unit=""
                            name="wo"
                            step={0.001}
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Latent Heat (Kl)"
                            value={kl}
                            unit="W"
                            name="kl"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Spec. Humidity In (wi)"
                            value={wi}
                            unit=""
                            name="wi"
                            step={0.001}
                            onChange={handleChange}
                        />
                    </div>

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
                            <BlockMath
                                math={`
                                    \\begin{align*}
                                    Q_s &= \\frac{2.9768 \\times K_s}{t} \\\\
                                    Q_l &= \\frac{K_l}{814 \\times (w_o - w_i)} \\\\
                                    Q_t &\\approx \\max(Q_{t\\text{ vapor}}, Q_{t\\text{ humidity}})
                                    \\end{align*}
                                `}
                            />
                        </div>

                        <div className="bg-[#131B2C] rounded-xl p-4 font-mono text-sm space-y-3">
                            <div className="flex items-start gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs mt-1 w-24">STEP</span>
                                <div className="space-y-1">
                                    <span className="text-[#1A73E8] break-all block">
                                        {result
                                            ? `Qs = (2.977 × ${ks}) / ${t}`
                                            : "Qs = (2.977 × Ks) / t"
                                        }
                                    </span>
                                    <span className="text-[#1A73E8] break-all block">
                                        {result
                                            ? `Ql = ${kl} / (814 × (${wo} - ${wi}))`
                                            : "Ql = Kl / (814 × (wo - wi))"
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs w-24">IMPLEMENTATION:</span>
                                <span className="text-green-400 font-bold">
                                    {result ? `Qs: ${result.Qs.toFixed(1)}, Ql: ${result.Q_humidity.toFixed(1)}` : "Wait for calc..."}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="lg:col-span-4 space-y-6">
                    <ResultCard
                        label="Total Air Volume (Qt)"
                        value={result ? Math.max(result.Qt_vapor, result.Qt_humidity).toFixed(0) : "---"}
                        unit="m³/h"
                    />

                    {/* Breakdown Results */}
                    {result && (
                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Detailed Breakdown</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-xs">Sensible Air Volume (Qs)</p>
                                    <p className="text-xl font-bold text-white">{result.Qs.toFixed(1)} <span className="text-sm font-normal text-gray-600">m³/h</span></p>
                                </div>
                                <div className="w-full h-px bg-white/5"></div>
                                <div>
                                    <p className="text-gray-500 text-xs">Latent (Vapor Method)</p>
                                    <p className="text-xl font-bold text-white">{result.Ql_vapor.toFixed(1)} <span className="text-sm font-normal text-gray-600">m³/h</span></p>
                                </div>
                                <div className="w-full h-px bg-white/5"></div>
                                <div>
                                    <p className="text-gray-500 text-xs">Latent (Humidity Method)</p>
                                    <p className="text-xl font-bold text-white">{result.Q_humidity.toFixed(1)} <span className="text-sm font-normal text-gray-600">m³/h</span></p>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}
