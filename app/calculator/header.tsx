import { Settings, User } from "lucide-react";

export function Header() {
    return (
        <header className="h-16 bg-[#0B1221] border-b border-white/5 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-30">

            {/* Brand */}
            <div className="flex items-center gap-2">
                <div className="text-blue-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                    </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    NextArch Precision
                </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                </button>

                <button className="p-1 text-gray-400 hover:text-white rounded-full transition-colors bg-[#1A73E8]/20 text-[#1A73E8]">
                    <User className="w-6 h-6 p-1" />
                </button>
            </div>
        </header>
    );
}
