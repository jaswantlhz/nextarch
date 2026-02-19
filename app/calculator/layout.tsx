import { Sidebar } from "./sidebar";
import { Header } from "./header";

export default function CalculatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#080C15] text-white font-sans selection:bg-blue-500/30">
            <Sidebar />
            <Header />
            <main className="pl-64 pt-16 min-h-screen">
                <div className="container mx-auto p-8 max-w-[1600px]">
                    {children}
                </div>
            </main>

            {/* Footer / Status Bar (optional, based on design 'CPU ENGINE: ACTIVE') */}
            <div className="fixed bottom-0 left-64 right-0 h-8 bg-[#0B1221] border-t border-white/5 flex items-center justify-between px-6 z-20 text-[10px] uppercase tracking-wider font-mono text-gray-500">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]"></span>
                        CPU ENGINE: ACTIVE
                    </div>
                    <span>Lat: 12ms</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>V1.4.2-STABLE</span>
                    <span>SUPPORT</span>
                    <span>DOCS</span>
                </div>
            </div>
        </div>
    );
}
