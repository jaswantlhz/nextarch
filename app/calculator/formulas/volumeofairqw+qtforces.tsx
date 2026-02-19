"use client";

import { useState } from "react";
import { MetricCard, ResultCard } from "../dashboard-components";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Calendar, Wind, Thermometer, Info, ArrowLeft } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { Label } from "@/components/ui/label";

interface ResultData {
    Qt: number;
    Qw: number;
    Q_combined: number;
}

export default function Voaqwqtforce() {
    const [values, setValues] = useState({
        A_inlet: 0,
        h: 0,
        t_i: 0,
        t_o: 0,
        A_smaller: 0,
        V: 0,
        K: 0.6,
    });

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(false);

    // EPW State
    const [epwUploaded, setEpwUploaded] = useState(false);
    const [epwYears, setEpwYears] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState({
        year: 2024,
        month: 1,
        day: 1,
        hour: 12,
    });
    const [epwData, setEpwData] = useState<Record<string, string[]>>({});
    const [epwMessage, setEpwMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const { A_inlet, h, t_i, t_o, A_smaller, V, K } = values;

    const handleEpwUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setEpwMessage("Uploading...");

        try {
            const response = await fetch('https://archbackend.vercel.app/api/upload-epw', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setEpwUploaded(true);
                setEpwYears(data.years || []);
                setEpwData(data.year_month_data || {});
                setSelectedDate(prev => ({ ...prev, year: data.years[0] || 2024 }));
                setEpwMessage(`EPW file uploaded! ${data.total_records} records found.`);
            } else {
                setEpwMessage(data.message || 'Failed to upload EPW file');
            }
        } catch (error) {
            console.error('Error uploading EPW file:', error);
            setEpwMessage('Error uploading EPW file. Please ensure the API is running.');
        }
    };

    const handleFetchEpwData = async () => {
        try {
            const response = await fetch('https://archbackend.vercel.app/api/query-epw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedDate),
            });

            const data = await response.json();

            if (data.success) {
                setValues(prev => ({
                    ...prev,
                    t_o: data.temperature,
                    V: data.wind_speed_mh // Assuming API returns m/h or conversion is handled
                }));
                // Note: The original generic code set V directly. 
                // If API returns m/s, we might need conversion based on unit expectation.
                // Re-using logic from original file.
                setEpwMessage(`Data fetched: ${data.temperature}°C, ${data.wind_speed_mh} wind speed`);
            } else {
                setEpwMessage(data.message || 'No data found for selected date/time');
            }
        } catch (error) {
            console.error('Error querying EPW data:', error);
            setEpwMessage('Error fetching EPW data');
        }
    };

    const formatHour = (h: number) => {
        if (h === 24) return "12 AM (Midnight)";
        if (h === 12) return "12 PM (Noon)";
        if (h > 12) return `${h - 12} PM`;
        return `${h} AM`;
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.API_URL}/api/volume-air-forces`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    A_inlet: A_inlet,
                    h: h,
                    t_i: t_i,
                    t_o: t_o,
                    A_smaller: A_smaller,
                    V: V,
                    K: K
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
                    <h1 className="text-3xl font-bold text-white mb-2">Volume of Air (Forces)</h1>
                    <p className="text-gray-400 max-w-2xl">
                        Calculates thermal, wind, and combined ventilation flows based on opening areas and environmental conditions.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Inputs */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Standard Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard
                            label="Inlet Area (A)"
                            value={A_inlet}
                            unit="m²"
                            name="A_inlet"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Height Diff (h)"
                            value={h}
                            unit="m"
                            name="h"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Indoor Temp (ti)"
                            value={t_i}
                            unit="°C"
                            name="t_i"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Smaller Area (As)"
                            value={A_smaller}
                            unit="m²"
                            name="A_smaller"
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Eff. Coeff (K)"
                            value={K}
                            unit=""
                            name="K"
                            step={0.1}
                            onChange={handleChange}
                        />
                        <MetricCard
                            label="Outdoor Temp (to)"
                            value={t_o}
                            unit="°C"
                            name="t_o"
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

                    {/* Weather Data Card */}
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#1A73E8]/10 p-2 rounded-lg">
                                <Wind className="text-[#1A73E8] h-5 w-5" />
                            </div>
                            <h4 className="text-white font-medium">Auto-fill from Weather Data (EPW)</h4>
                        </div>

                        <div className="space-y-4">
                            {/* Upload Area */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1A73E8]/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center transition-colors group-hover:border-[#1A73E8]/50">
                                    <input
                                        type="file"
                                        accept=".epw"
                                        onChange={handleEpwUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2 group-hover:text-[#1A73E8] transition-colors" />
                                    <p className="text-sm text-gray-300 font-medium">Click to upload .epw file</p>
                                    <p className="text-xs text-gray-500 mt-1">Maximum file size 200MB</p>
                                </div>
                            </div>

                            {epwUploaded && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Day</Label>
                                            <select
                                                className="w-full bg-[#0B1121] border border-white/10 rounded-lg text-white text-sm px-3 py-2 focus:ring-1 focus:ring-[#1A73E8] outline-none"
                                                value={selectedDate.day}
                                                onChange={(e) => setSelectedDate(prev => ({ ...prev, day: Number(e.target.value) }))}
                                            >
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Month</Label>
                                            <select
                                                className="w-full bg-[#0B1121] border border-white/10 rounded-lg text-white text-sm px-3 py-2 focus:ring-1 focus:ring-[#1A73E8] outline-none"
                                                value={selectedDate.month}
                                                onChange={(e) => setSelectedDate(prev => ({ ...prev, month: Number(e.target.value) }))}
                                            >
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Year</Label>
                                            <select
                                                className="w-full bg-[#0B1121] border border-white/10 rounded-lg text-white text-sm px-3 py-2 focus:ring-1 focus:ring-[#1A73E8] outline-none"
                                                value={selectedDate.year}
                                                onChange={(e) => setSelectedDate(prev => ({ ...prev, year: Number(e.target.value) }))}
                                            >
                                                {epwYears.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-gray-500">Hour</Label>
                                            <select
                                                className="w-full bg-[#0B1121] border border-white/10 rounded-lg text-white text-sm px-3 py-2 focus:ring-1 focus:ring-[#1A73E8] outline-none"
                                                value={selectedDate.hour}
                                                onChange={(e) => setSelectedDate(prev => ({ ...prev, hour: Number(e.target.value) }))}
                                            >
                                                {Array.from({ length: 24 }, (_, i) => i + 1).map(h => (
                                                    <option key={h} value={h}>{formatHour(h)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleFetchEpwData}
                                        className="w-full bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 text-[#1A73E8] border border-[#1A73E8]/20"
                                    >
                                        Apply Weather Data to Inputs
                                    </Button>

                                    {epwMessage && (
                                        <div className="flex gap-2 items-center text-xs text-gray-400 bg-[#0B1121] p-3 rounded-lg border border-white/5">
                                            <Info className="h-4 w-4 text-[#1A73E8]" />
                                            {epwMessage}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-8 py-6 rounded-xl font-semibold text-lg"
                        >
                            {loading ? 'Calculating...' : 'Calculate Flows'}
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
                                    Q_t &= 7.0 \\times A \\times \\sqrt{h \\times (t_i - t_o)} \\\\
                                    Q_w &= \\frac{K \\times A_{smaller} \\times V}{60} \\\\
                                    Q_{combined} &= \\sqrt{Q_w^2 + Q_t^2}
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
                                            ? `Qt = 7.0 × ${A_inlet} × √(${h} × (${t_i} - ${t_o}))`
                                            : "Qt = 7.0 × A × √(h × (ti - to))"
                                        }
                                    </span>
                                    <span className="text-[#1A73E8] break-all block">
                                        {result
                                            ? `Qw = (${K} × ${A_smaller} × ${V}) / 60`
                                            : "Qw = (K × As × V) / 60"
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mx-4 my-2">
                                <span className="text-gray-500 uppercase tracking-wider text-xs w-24">IMPLEMENTATION:</span>
                                <span className="text-green-400 font-bold">
                                    {result ? `Qt: ${result.Qt.toFixed(1)}, Qw: ${result.Qw.toFixed(1)}` : "Wait for calc..."}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Results */}
                <div className="lg:col-span-4 space-y-6">
                    <ResultCard
                        label="Combined Flow (Q)"
                        value={result ? result.Q_combined.toFixed(2) : "---"}
                        unit="m³/min"
                    />

                    {result && (
                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Components</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-xs">Thermal Flow</p>
                                    <p className="text-xl font-bold text-white">{result.Qt.toFixed(2)} <span className="text-sm font-normal text-gray-600">m³/min</span></p>
                                </div>
                                <div className="w-full h-px bg-white/5"></div>
                                <div>
                                    <p className="text-gray-500 text-xs">Wind Flow</p>
                                    <p className="text-xl font-bold text-white">{result.Qw.toFixed(2)} <span className="text-sm font-normal text-gray-600">m³/min</span></p>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}