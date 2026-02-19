
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { ChangeEvent } from "react";

interface MetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    subLabel?: string;
    className?: string;
    name?: string; // name for the input field
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
    step?: number;
}

export function MetricCard({
    label,
    value,
    unit,
    subLabel,
    className,
    name,
    onChange,
    min,
    max,
    step
}: MetricCardProps) {
    return (
        <div
            className={cn(
                "bg-[#131B2C] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#1A73E8]/50 transition-colors",
                className
            )}
        >
            <div className="flex justify-between items-start z-10">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {label}
                </span>
                {unit && (
                    <span className="bg-white/5 text-gray-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {unit}
                    </span>
                )}
            </div>
            <div className="z-10 relative">
                {onChange ? (
                    <input
                        type="number"
                        name={name}
                        value={value}
                        onChange={onChange}
                        min={min}
                        max={max}
                        step={step}
                        className="text-3xl font-bold text-[#1A73E8] tracking-tight bg-transparent border-none focus:outline-none w-full placeholder-blue-900/50"
                    />
                ) : (
                    <div className="text-3xl font-bold text-[#1A73E8] tracking-tight">
                        {value}
                    </div>
                )}

                {subLabel && (
                    <div className="text-xs text-gray-500 mt-1">{subLabel}</div>
                )}
            </div>

            {/* Decorational background element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#1A73E8]/5 rounded-full blur-2xl group-hover:bg-[#1A73E8]/10 transition-colors pointer-events-none"></div>
        </div>
    );
}

export function ResultCard({
    value,
    unit,
    label,
}: {
    value: string | number;
    unit: string;
    label: string;
}) {
    return (
        <div className="bg-[#1A73E8] rounded-3xl p-8 relative overflow-hidden h-64 flex flex-col justify-between text-white shadow-lg shadow-blue-900/20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start opacity-80 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold tracking-tighter">{value}</span>
                    <span className="text-2xl font-medium opacity-80">{unit}</span>
                </div>
            </div>


        </div>
    );
}

export function FormulaPreview({
    V, n, v_wind, K, result
}: {
    V: number, n: number, v_wind: number, K: number, result: string | number
}) {
    return (
        <div className="bg-[#0B1221] border border-white/5 rounded-3xl p-8 relative mt-6 border-l-4 border-l-[#1A73E8]">
            <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider">Live Formula Preview</span>
                <span className="text-gray-700 opacity-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M14 18l-6-6 6-6" /></svg>
                </span>
            </div>

            <div className="flex justify-center items-center py-8">
                <div className="text-4xl font-serif italic text-gray-300">
                    A<sub className="text-lg not-italic opacity-70">eff</sub> = <span className="mx-2"></span>
                    <div className="inline-block text-center align-middle">
                        <div className="border-b border-gray-600 pb-1 mb-1 px-4 text-gray-200">V × n</div>
                        <div className="text-gray-200">3600 × v × K</div>
                    </div>
                </div>
            </div>

            <div className="bg-[#131B2C] rounded-xl p-4 mt-8 font-mono text-sm flex flex-col gap-2 relative overflow-hidden border border-white/5 shadow-inner">
                <div className="flex items-center gap-4 text-blue-400">
                    <span className="opacity-50 min-w-[100px] text-xs uppercase tracking-wider text-gray-500">Step</span>
                    <span>A = <span className="text-[#1A73E8]">({V} × {n})</span> / <span className="text-[#1A73E8]">(3600 × {v_wind} × {K})</span></span>
                </div>
                <div className="flex items-center gap-4 text-green-400">
                    <span className="opacity-50 min-w-[100px] text-xs uppercase tracking-wider text-gray-500">Implementation:</span>
                    <span className="font-bold">{result}</span>
                </div>
            </div>
        </div>
    )
}

interface SchematicPreviewProps {
    area?: number;
    V_room?: number;
    n_ach?: number;
    v_wind?: number;
    K?: number;
    isMetric?: boolean;
}

export function SchematicPreview({
    area = 0,
    V_room = 0,
    n_ach = 0,
    v_wind = 0,
    K = 0,
    isMetric = true,
}: SchematicPreviewProps) {
    const unit = isMetric ? "m²" : "ft²";
    const displayArea = area.toFixed(3);

    // Scale the inlet panel size proportionally (capped between 5% and 95%)
    const inletFraction = Math.min(0.95, Math.max(0.05, area / Math.max(area * 8, 1)));
    const inletPercent = Math.round(inletFraction * 100);

    return (
        <div className="bg-[#131B2C] border border-white/5 rounded-3xl p-6 h-full min-h-[300px] flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6 z-10">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Schematic Preview
                </h3>
                <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                </div>
            </div>

            {/* Building cross-section schematic */}
            <div className="flex-1 flex items-center justify-center relative z-10">
                <div className="relative w-48 h-64">
                    {/* Outer wall outline */}
                    <div className="w-full h-full border-2 border-blue-500/30 rounded-sm bg-blue-500/5 relative">

                        {/* Inlet opening (bottom) - scaled by area */}
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-[#1A73E8]/20 border-t-2 border-dashed border-[#1A73E8]/60 transition-all duration-500 flex items-center justify-center"
                            style={{ height: `${Math.max(8, Math.min(50, inletPercent))}%` }}
                        >
                            <div className="flex flex-col items-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
                                </svg>
                                <span className="text-[9px] text-[#1A73E8] font-mono font-bold mt-0.5">IN</span>
                            </div>
                        </div>

                        {/* Outlet opening (top) - scaled by area */}
                        <div
                            className="absolute top-0 left-0 right-0 bg-[#1A73E8]/10 border-b-2 border-dashed border-[#1A73E8]/40 transition-all duration-500 flex items-center justify-center"
                            style={{ height: `${Math.max(8, Math.min(50, inletPercent))}%` }}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] text-blue-400 font-mono font-bold">OUT</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14" /><path d="M5 12l7 7 7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Center area label */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-[10px] text-gray-500 font-mono">Aᴇᶠᶠ</div>
                                <div className="text-sm font-bold text-[#1A73E8] font-mono transition-all duration-300">
                                    {displayArea}
                                </div>
                                <div className="text-[9px] text-gray-500 font-mono">{unit}</div>
                            </div>
                        </div>

                        {/* Wind arrow from left */}
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                                <path d="M0 6 H14 M10 2 L14 6 L10 10" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-[8px] text-green-400 font-mono">{v_wind}m/s</span>
                        </div>
                    </div>

                    {/* Q label below */}
                    <div className="absolute -bottom-7 left-0 w-full text-center text-[9px] text-gray-500 font-mono">
                        Q = {V_room} × {n_ach} = <span className="text-[#1A73E8]">{(V_room * n_ach).toFixed(0)} m³/h</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-[10px] text-gray-500 italic max-w-xs mx-auto text-center z-10">
                Top-inlet / bottom-outlet cross-ventilation configuration.
            </div>

            <div className="absolute inset-0 bg-[#0B1221] opacity-50 z-0 pointer-events-none"></div>
        </div>
    );
}
