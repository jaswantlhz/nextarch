"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2, Layers, ArrowRight, ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Element {
    U: number;
    A: number;
}

interface ResultData {
    Q_total: number;
    elements_UA: number[];
}

export default function Byelement() {
    const [elements, setElements] = useState<Element[]>([
        { U: 0, A: 0 }
    ]);
    const [deltaT, setDeltaT] = useState<number>(0);
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleElementChange = (index: number, field: 'U' | 'A', value: string) => {
        const newElements = [...elements];
        newElements[index][field] = parseFloat(value) || 0;
        setElements(newElements);
    };

    const addElement = () => {
        setElements([...elements, { U: 0, A: 0 }]);
    };

    const removeElement = (index: number) => {
        if (elements.length > 1) {
            setElements(elements.filter((_, i) => i !== index));
        }
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.API_URL}/api/by-element`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    elements: elements,
                    delta_T: deltaT
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
                    <h1 className="text-3xl font-bold text-white mb-2">Heat Flow by Element</h1>
                    <p className="text-gray-400 max-w-2xl">
                        Calculates total heat flow through a structure by summing heat lost or gained by each component.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Global Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard
                            label="Temp. Diff (ΔT)"
                            value={deltaT}
                            unit="K"
                            name="deltaT"
                            onChange={(e) => setDeltaT(parseFloat(e.target.value) || 0)}
                        />
                    </div>

                    {/* Dynamic Elements List */}
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#1A73E8]/10 p-2 rounded-lg">
                                    <Layers className="text-[#1A73E8] h-5 w-5" />
                                </div>
                                <h4 className="text-white font-medium">Building Elements</h4>
                            </div>
                            <Button
                                onClick={addElement}
                                className="bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 text-[#1A73E8] border border-[#1A73E8]/20"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Element
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {elements.map((element, index) => (
                                <div key={index} className="bg-[#0B1121] rounded-xl p-4 border border-white/5 relative group transition-all hover:border-white/10">
                                    <div className="flex flex-wrap md:flex-nowrap items-end gap-4">
                                        <div className="flex-1 min-w-[140px]">
                                            <Label className="text-xs text-gray-500 mb-1.5 block">U-value (W/m²·K)</Label>
                                            <Input
                                                type="number"
                                                value={element.U}
                                                onChange={(e) => handleElementChange(index, 'U', e.target.value)}
                                                className="bg-[#131B2C] border-white/10 text-white focus:ring-[#1A73E8] h-10"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center pb-2 text-gray-600">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-[140px]">
                                            <Label className="text-xs text-gray-500 mb-1.5 block">Area (m²)</Label>
                                            <Input
                                                type="number"
                                                value={element.A}
                                                onChange={(e) => handleElementChange(index, 'A', e.target.value)}
                                                className="bg-[#131B2C] border-white/10 text-white focus:ring-[#1A73E8] h-10"
                                            />
                                        </div>

                                        {elements.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeElement(index)}
                                                className="text-gray-500 hover:text-red-400 hover:bg-transparent h-10 w-10 shrink-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#131B2C] border border-white/10 rounded-full flex items-center justify-center text-xs font-mono text-gray-400">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? 'Calculating...' : 'Calculate Total Flow'}
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
                                    Q_{total} = (\\sum (U_i \\times A_i)) \\times \\Delta T
                                `}
                            />
                        </div>

                        <div className="bg-[#131B2C] rounded-xl p-4 font-mono text-sm space-y-3">
                            <div className="flex items-start gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs mt-1 w-24">STEP</span>
                                <span className="text-[#1A73E8] break-all">
                                    {result
                                        ? `Q = (${elements.map(e => (e.U * e.A).toFixed(1)).join(' + ')}) × ${deltaT}`
                                        : "Q = (Σ U × A) × ΔT"
                                    }
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs w-24">IMPLEMENTATION:</span>
                                <span className="text-green-400 font-bold">
                                    {result ? result.Q_total.toFixed(3) : "Wait for calc..."}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="lg:col-span-4 space-y-6">
                    <ResultCard
                        label="Total Heat Flow"
                        value={result ? result.Q_total.toFixed(2) : "---"}
                        unit="W"
                    />

                    {result && (
                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Element Breakdown (UA)</h4>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {result.elements_UA.map((ua, index) => (
                                    <div key={index} className="flex justify-between items-center bg-[#0B1121] p-3 rounded-lg border border-white/5">
                                        <span className="text-gray-400 text-sm">Element {index + 1}</span>
                                        <span className="font-mono text-white font-medium">{ua.toFixed(2)} <span className="text-xs text-gray-600">W/K</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}