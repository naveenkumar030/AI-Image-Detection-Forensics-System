import React, { useState } from "react";
import { 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut
} from "lucide-react";

export default function ForensicHeatmap({ currentData }) {
  const isSynthetic = !currentData.verdict.includes("AUTHENTIC");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(1, z - 0.25));
  const handleReset = () => setZoomLevel(1);

  // Region markers for RL anomaly intensity computed dynamically from currentData
  const anomalyZones = (currentData?.highImpactRegions || []).map((r) => ({
    name: r.name,
    level: r.anomalyType || (isSynthetic ? "High Q-Anomaly" : "Natural Sensor"),
    x: `${r.x}%`,
    y: `${r.y}%`,
    color: (r.anomalyType?.includes("High") || (isSynthetic && !r.anomalyType))
      ? "bg-[#c15f3c]" 
      : "bg-[#b1ada1]"
  }));

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#b1ada1]/30 shadow-sm">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#b1ada1]/30">
          <div>
            <div className="text-xs font-mono text-[#c15f3c] uppercase tracking-wider font-semibold mb-1">
              REINFORCEMENT ACTION SALIENCY MAP
            </div>
            <h3 className="text-xl font-bold text-[#2b2723] tracking-tight font-sans">
              RL Spatial Saliency &amp; State Heatmap
            </h3>
            <p className="text-xs text-[#2b2723]/60 mt-0.5">
              Multi-scale state anomaly density highlighting localized synthetic artifacts discovered by policy probes.
            </p>
          </div>

          {/* Interactive Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                showHeatmap 
                  ? "bg-[#c15f3c] border-[#c15f3c] text-white" 
                  : "bg-[#f4f3ee] border-[#b1ada1]/40 text-[#2b2723] hover:bg-white"
              }`}
            >
              {showHeatmap ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showHeatmap ? "Q-Heatmap ON" : "Q-Heatmap OFF"}</span>
            </button>

            <div className="flex items-center gap-1 bg-[#f4f3ee] p-1 rounded-xl border border-[#b1ada1]/40">
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-[#2b2723] hover:text-[#c15f3c] rounded-lg hover:bg-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-[#2b2723] px-1 font-semibold">
                {(zoomLevel * 100).toFixed(0)}%
              </span>
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-[#2b2723] hover:text-[#c15f3c] rounded-lg hover:bg-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 text-[#2b2723]/60 hover:text-[#c15f3c] rounded-lg hover:bg-white border-l border-[#b1ada1]/40 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Forensic Map Viewer Canvas Area */}
        <div className="relative rounded-2xl overflow-hidden bg-[#f4f3ee] border border-[#b1ada1]/40 min-h-[340px] sm:min-h-[420px] flex items-center justify-center">
          
          <div 
            className="w-full h-full relative transition-transform duration-200 flex items-center justify-center p-4"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Base Image */}
            <img
              src={currentData.imageUrl}
              alt="RL Map Target"
              className="max-h-[420px] w-auto object-contain rounded-xl shadow-sm border border-[#b1ada1]/30"
            />

            {/* Heatmap Anomaly Overlay */}
            {showHeatmap && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative max-h-[420px] w-auto">
                  {/* Simulated heat zones */}
                  <div 
                    className="absolute inset-0 opacity-60 mix-blend-multiply rounded-xl"
                    style={{
                      background: isSynthetic 
                        ? "radial-gradient(ellipse at 48% 38%, rgba(193,95,60,0.8) 0%, rgba(193,95,60,0.3) 45%, transparent 70%), radial-gradient(circle at 75% 45%, rgba(193,95,60,0.6) 0%, transparent 45%)"
                        : "radial-gradient(ellipse at 50% 50%, rgba(177,173,161,0.5) 0%, transparent 60%)"
                    }}
                  />

                  {/* Anomaly Point Indicators */}
                  {anomalyZones.map((zone) => (
                    <div
                      key={zone.name}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto group cursor-pointer"
                      style={{ left: zone.x, top: zone.y }}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full ${zone.color} shadow-md border-2 border-white flex items-center justify-center`} />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-5 whitespace-nowrap bg-white border border-[#b1ada1]/40 px-2 py-1 rounded-xl text-[10px] font-mono text-[#2b2723] shadow-lg pointer-events-none">
                        {zone.name} · <span className="text-[#c15f3c] font-bold">{zone.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coordinates HUD overlay */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-white/90 border border-[#b1ada1]/40 text-[10px] font-mono text-[#2b2723]/70 backdrop-blur-sm shadow-sm">
            STATE MATRIX: {currentData.dimensions} · PEAK REWARD: +0.46 dB
          </div>

        </div>

        {/* Anomaly Intensity Legend */}
        <div className="mt-5 p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-mono text-[#2b2723]/70 uppercase tracking-wider font-semibold">
            RL Value Return Scale:
          </span>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b1ada1] shadow-sm" />
              <span className="text-[#2b2723]">Natural Sensor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b1ada1]/60 shadow-sm" />
              <span className="text-[#2b2723]">Baseline Return</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c15f3c]/70 shadow-sm" />
              <span className="text-[#2b2723]">Elevated Variance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c15f3c]" />
              <span className="text-[#c15f3c] font-bold">High Q-Anomaly</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
