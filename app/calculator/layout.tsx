import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ThemeProvider } from "./theme-context";
import { ThemedShell } from "./themed-shell";

export default function CalculatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <ThemedShell>
                <Sidebar />
                <Header />
                <main className="pl-64 pt-16 min-h-screen">
                    <div className="container mx-auto p-8 max-w-[1600px]">
                        {children}
                    </div>
                </main>

                {/* Footer / Status Bar */}
                <div className="fixed bottom-0 left-64 right-0 h-8 border-t border-white/5 flex items-center justify-between px-6 z-20 text-[10px] uppercase tracking-wider font-mono"
                    style={{ background: "inherit", borderColor: "rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-4" style={{ color: "#6b7280" }}>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]"></span>
                            CPU ENGINE: ACTIVE
                        </div>
                        <span>Lat: 12ms</span>
                    </div>
                    <div className="flex items-center gap-4" style={{ color: "#6b7280" }}>
                        <span>V1.4.2-STABLE</span>
                        <span>SUPPORT</span>
                        <span>DOCS</span>
                    </div>
                </div>
            </ThemedShell>
        </ThemeProvider>
    );
}
