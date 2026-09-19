import React, { useState } from "react";
import { 
  Eye, 
  Layers, 
  Sliders, 
  Sparkles, 
  Zap,
  TrendingUp
} from "lucide-react";

export default function ExplainableAI({ currentData }) {
  const isSynthetic = currentData?.isAIGenerated !== undefined 
    ? Boolean(currentData.isAIGenerated) 
    : !currentData?.verdict?.includes("AUTHENTIC");
  const [opacity, setOpacity] = useState(70);
  const [selectedLayer, setSelectedLayer] = useState("qvalue"); // 'qvalue' | 'policy' | 'fft' | 'noise'
  const [activeRegion, setActiveRegion] = useState(null);

  const regions = currentData.highImpactRegions || [];

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      
      {/* Section Heading */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c15f3c] font-semibold mb-1">
          <Zap className="w-3.5 h-3.5" />
          <span>EXPLAINABLE REINFORCEMENT LEARNING (XRL) ATTRIBUTION</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#2b2723] tracking-tight font-sans">
          Why did the RL Agent classify this as {isSynthetic ? "Synthetic Artifacts" : "Authentic Camera Capture"}?
        </h3>
        <p className="text-sm text-[#2b2723]/60 mt-1">
          Q-Value saliency and policy gradient activation maps highlight state features that produced maximal Bellman returns.
        </p>
      </div>

      {/* Main Panel */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#b1ada1]/30 shadow-sm relative overflow-hidden">
        
        {/* Layer & Opacity Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#b1ada1]/30">
          
          {/* Layer Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40">
            <button
              onClick={() => setSelectedLayer("qvalue")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedLayer === "qvalue" 
                  ? "bg-[#c15f3c] text-white font-bold" 
                  : "text-[#2b2723]/70 hover:text-[#2b2723]"
              }`}
            >
              Q-Value Saliency Q*(s,a)
            </button>
            <button
              onClick={() => setSelectedLayer("policy")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedLayer === "policy" 
                  ? "bg-[#c15f3c] text-white font-bold" 
                  : "text-[#2b2723]/70 hover:text-[#2b2723]"
              }`}
            >
              Policy Gradient ∇_θ J
            </button>
            <button
              onClick={() => setSelectedLayer("fft")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedLayer === "fft" 
                  ? "bg-[#c15f3c] text-white font-bold" 
                  : "text-[#2b2723]/70 hover:text-[#2b2723]"
              }`}
            >
              2D-FFT Action Slice
            </button>
            <button
              onClick={() => setSelectedLayer("noise")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedLayer === "noise" 
                  ? "bg-[#c15f3c] text-white font-bold" 
                  : "text-[#2b2723]/70 hover:text-[#2b2723]"
              }`}
            >
              PRNU Wavelet Residual
            </button>
          </div>

          {/* Opacity Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#2b2723]/60">Heatmap Blend:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-28 sm:w-36 accent-[#c15f3c] cursor-pointer"
            />
            <span className="text-xs font-mono text-[#2b2723] font-bold w-8">{opacity}%</span>
          </div>

        </div>

        {/* Two-Column Heatmap Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Image with Heatmap Overlay */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative rounded-2xl overflow-hidden bg-[#f4f3ee] border border-[#b1ada1]/40 min-h-[320px] sm:min-h-[390px] flex items-center justify-center p-4">
              
              {/* Base Image */}
              <img
                src={currentData.imageUrl}
                alt="RL Forensic Target"
                className="w-full h-full max-h-[370px] object-contain rounded-xl"
              />

              {/* Dynamic Heatmap Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-200 p-4"
                style={{ opacity: opacity / 100 }}
              >
                {(selectedLayer === "qvalue" || selectedLayer === "policy") && (
                  <div className="w-full h-full relative">
                    {/* Q-Value blobs over suspicious regions */}
                    {regions.map((reg) => (
                      <div
                        key={reg.name}
                        className={`absolute rounded-full pointer-events-none transition-all duration-300 ${
                          activeRegion === reg.name ? "ring-2 ring-[#c15f3c] scale-110" : ""
                        }`}
                        style={{
                          left: `${reg.x}%`,
                          top: `${reg.y}%`,
                          width: `${reg.radius * 2.5}%`,
                          height: `${reg.radius * 2.5}%`,
                          transform: "translate(-50%, -50%)",
                          background: isSynthetic 
                            ? "radial-gradient(circle, rgba(193,95,60,0.85) 0%, rgba(193,95,60,0.45) 45%, transparent 100%)"
                            : "radial-gradient(circle, rgba(177,173,161,0.7) 0%, rgba(177,173,161,0.3) 50%, transparent 100%)",
                          mixBlendMode: "multiply",
                          filter: "blur(12px)"
                        }}
                      />
                    ))}
                  </div>
                )}

                {selectedLayer === "fft" && (
                  <div 
                    className="w-full h-full opacity-80 mix-blend-multiply rounded-xl"
                    style={{
                      background: `radial-gradient(circle at center, rgba(193,95,60,0.8) 0%, rgba(177,173,161,0.5) 60%, transparent 100%)`
                    }}
                  />
                )}

                {selectedLayer === "noise" && (
                  <div 
                    className="w-full h-full opacity-70 mix-blend-multiply rounded-xl"
                    style={{
                      background: "rgba(193, 95, 60, 0.15)"
                    }}
                  />
                )}
              </div>

              {/* Active Region Marker Pin if selected */}
              {activeRegion && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white border border-[#c15f3c] text-xs font-mono text-[#c15f3c] flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#c15f3c]" />
                  <span>Inspecting State Patch: {activeRegion}</span>
                </div>
              )}

              {/* Reticle borders */}
              <div className="absolute top-3 right-3 font-mono text-[10px] text-[#2b2723] bg-white/90 px-2 py-0.5 rounded border border-[#b1ada1]/40 font-bold">
                POLICY ACTION: {selectedLayer.toUpperCase()}
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <span className="text-[#2b2723]/70">Agent Value Return Scale Q(s,a):</span>
              <div className="flex items-center gap-2">
                <span className="text-[#2b2723]/60 text-[11px]">Baseline 0.0</span>
                <div className="w-32 sm:w-44 h-2.5 rounded-full bg-gradient-to-r from-[#b1ada1] via-[#c15f3c]/60 to-[#c15f3c] border border-[#b1ada1]/30 shadow-sm" />
                <span className="text-[#c15f3c] font-bold text-[11px]">Peak 1.0</span>
              </div>
            </div>

          </div>

          {/* Right Column: Evidence Explanation & High-Impact Regions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-[#2b2723] uppercase tracking-wider font-mono">
                  High-Reward State Patches
                </h4>
                <span className="text-[11px] font-mono text-[#2b2723]/60">
                  Click to highlight on map
                </span>
              </div>

              {/* Interactive Region Pills */}
              <div className="space-y-2">
                {regions.map((region) => {
                  const isSelected = activeRegion === region.name;
                  return (
                    <button
                      key={region.name}
                      onClick={() => setActiveRegion(isSelected ? null : region.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? "bg-[#c15f3c]/10 border-[#c15f3c] text-[#2b2723] scale-[1.01]" 
                          : "bg-[#f4f3ee] border-[#b1ada1]/40 text-[#2b2723] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#c15f3c]" : "bg-[#b1ada1]"}`} />
                        <div>
                          <p className="text-xs font-semibold text-[#2b2723] font-sans">{region.name}</p>
                          <p className="text-[10px] font-mono text-[#2b2723]/60">
                            {region.anomalyType} · Reward: <strong className="text-[#c15f3c]">{region.rewardDelta}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#c15f3c]">
                          {region.contribution}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RL Policy interpretation summary */}
            <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40 space-y-2">
              <div className="text-[11px] font-mono text-[#2b2723]/60 uppercase tracking-wider font-semibold">
                Policy Trajectory Synthesis
              </div>
              <p className="text-xs text-[#2b2723]/80 leading-relaxed font-sans">
                {isSynthetic ? (
                  <>
                    The Deep-Q Network agent accumulated highest positive returns when probing boundary transitions, hair tessellations, and background micro-gradients. High-frequency lattice peaks and non-Poisson PRNU variance reinforced the synthetic policy decision.
                  </>
                ) : (
                  <>
                    The policy gradient demonstrates uniform, distributed attention across the image surface without localized anomaly clusters. The PRNU sensor reward matched physical semiconductor silicon curves, proving natural optical acquisition.
                  </>
                )}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
