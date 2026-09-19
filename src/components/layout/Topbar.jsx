import React from "react";
import { Menu } from "lucide-react";

export default function Topbar({ 
  onMenuToggle, 
  activeTab,
  backendStatus = { isOnline: false, details: null },
  onRefreshBackend
}) {
  const isOnline = backendStatus?.isOnline;
  const modelStatus = backendStatus?.details?.model_status;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 border-b border-[#b1ada1]/30 px-4 lg:px-8 py-3.5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg bg-[#f4f3ee] border border-[#b1ada1]/40 text-[#2b2723] hover:text-[#c15f3c] lg:hidden transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base lg:text-lg font-bold text-[#2b2723] tracking-tight font-sans">
                AI Image Detector <span className="text-[#c15f3c] font-mono text-xs font-semibold">AI Detection</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c]" />
                RL ENGINE
              </span>
            </div>
            <p className="text-xs text-[#767167] hidden sm:block">
              Markov State Exploration · Deep Q-Networks · PRNU Sensor Reward · Multi-Agent Policy
            </p>
          </div>
        </div>

        {/* Live Python Backend Status Indicator */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div 
              title={`Python ${backendStatus?.details?.python_version || "3.13"} • PyTorch ${backendStatus?.details?.pytorch_version || "2.12"} • Model: ${modelStatus || "active"}`}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300/60 text-[11px] font-mono text-emerald-900 flex items-center gap-2 shadow-sm transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline text-emerald-700 font-medium">PYTHON BACKEND:</span>
              <span className="font-bold text-emerald-700">ONLINE (PORT 8000)</span>
            </div>
          ) : (
            <button
              onClick={onRefreshBackend}
              title="Python server not detected on http://127.0.0.1:8000. Running in Standalone Client Mode. Click to retry connection."
              className="px-3 py-1.5 rounded-xl bg-[#f4f3ee] hover:bg-[#eae8e0] border border-[#b1ada1]/50 text-[11px] font-mono text-[#767167] flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="hidden sm:inline">STANDALONE MODE</span>
              <span className="text-[#c15f3c] font-semibold underline decoration-dotted">RETRY BACKEND</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
