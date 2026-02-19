"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Formula Components
import WindowOpeningDashboard from "./window-opening-dashboard";
import Windowcalculations from "./formulas/windowcalculations";
import Volumeofairheatgain from "./formulas/volumeofairheatgain";
import Voaqwqtforce from "./formulas/volumeofairqw+qtforces";
import Qfromach from "./formulas/qfromach";
import Byelement from "./formulas/byelement";
import SolarHeatGain from "./formulas/solarheatgain";

function CalculatorContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") || "window-opening";

    const renderCalculator = () => {
        switch (mode) {
            case "window-opening":
                return <WindowOpeningDashboard />;
            case "window-calculations":
                return <Windowcalculations />;
            case "volume-heat-gain":
                return <Volumeofairheatgain />;
            case "volume-forces":
                return <Voaqwqtforce />;
            case "q-from-ach":
                return <Qfromach />;
            case "by-element":
                return <Byelement />;
            case "solar-heat-gain":
                return <SolarHeatGain />;
            default:
                return <WindowOpeningDashboard />;
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {renderCalculator()}
        </div>
    );
}

export default function CalculatorPage() {
    return (
        <Suspense fallback={<div className="text-white p-8">Loading calculator...</div>}>
            <CalculatorContent />
        </Suspense>
    );
}