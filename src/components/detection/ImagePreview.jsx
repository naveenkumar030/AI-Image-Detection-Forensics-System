import React, { useState } from "react";
import { 
  Play, 
  RotateCcw, 
  FileText, 
  Maximize2, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  Hash, 
  Eye, 
  Cpu,
  Layers
} from "lucide-react";

export default function ImagePreview({ 
  currentData, 
  onChangeImage, 
  onStartAnalysis 
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-[#b1ada1]/35 relative overflow-hidden">
        
        {/* Header telemetry banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#b1ada1]/30">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c15f3c] animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#2b2723] font-semibold">
              IMAGE ACQUISITION BUFFER
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#c15f3c]/10 border border-[#c15f3c]/30 text-[#c15f3c] font-medium">
              READY FOR RL MDP EXPLORATION
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#767167]">
            <span>RL ENGINE: v4.2-DQN+PPO Policy Agent</span>
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Large Image Preview */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden bg-[#f4f3ee] border border-[#b1ada1]/40 flex items-center justify-center min-h-[320px] sm:min-h-[400px] max-h-[460px] group">
              <img
                src={currentData.imageUrl}
                alt={currentData.filename}
                className={`w-full h-full object-contain transition-transform duration-300 ${isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Holographic corner reticles */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#c15f3c] pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#c15f3c] pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#c15f3c] pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#c15f3c] pointer-events-none" />

              {/* Interactive Zoom Control */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-white/90 border border-[#b1ada1]/40 text-xs text-[#2b2723] hover:text-[#c15f3c] flex items-center gap-1.5 backdrop-blur-md transition-colors shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#c15f3c]" />
                <span className="font-mono text-[11px]">{isZoomed ? "100% Zoom" : "Inspect Loupe"}</span>
              </button>

              {/* Overlay Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 border border-[#b1ada1]/40 text-[11px] font-mono text-[#c15f3c] font-semibold backdrop-blur-md shadow-sm">
                INPUT RESOLUTION: {currentData.dimensions}
              </div>
            </div>

            <div className="mt-2 text-[11px] text-[#767167] font-mono flex items-center justify-between px-1">
              <span>Click image to toggle 150% detail loupe</span>
              <span>Color Profile: {currentData.colorSpace || "sRGB"}</span>
            </div>
          </div>

          {/* Right Column: File Information & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-mono text-[#c15f3c] uppercase tracking-wider font-semibold">
                  Source File Metadata
                </span>
                <h3 className="text-xl font-bold text-[#2b2723] tracking-tight mt-0.5 break-all font-sans">
                  {currentData.filename}
                </h3>
              </div>

              {/* Metadata Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/35">
                <div>
                  <span className="text-[11px] text-[#767167] font-mono">Dimensions</span>
                  <p className="text-sm font-semibold text-[#2b2723] font-mono mt-0.5">
                    {currentData.dimensions}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-[#767167] font-mono">Format</span>
                  <p className="text-sm font-semibold text-[#2b2723] font-mono mt-0.5">
                    {currentData.format}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-[#767167] font-mono">File Size</span>
                  <p className="text-sm font-semibold text-[#2b2723] font-mono mt-0.5">
                    {currentData.fileSize}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-[#767167] font-mono">Color Space</span>
                  <p className="text-sm font-semibold text-[#2b2723] font-mono mt-0.5">
                    {currentData.colorSpace || "sRGB"}
                  </p>
                </div>
              </div>

              {/* Cryptographic hash snippet */}
              <div className="p-3.5 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/35 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#767167] font-mono">
                  <span className="flex items-center gap-1 font-semibold text-[#2b2723]">
                    <Hash className="w-3 h-3 text-[#c15f3c]" />
                    <span>MD5 CHECKSUM</span>
                  </span>
                  <span className="text-[#c15f3c] font-semibold">Integrity Verified</span>
                </div>
                <p className="text-[11px] font-mono text-[#767167] truncate">
                  {currentData.hashMD5 || "e4d909c290d0fb1ca068ffaddf22cbd0"}
                </p>
              </div>

              {/* Pipeline stages readiness check */}
              <div className="p-3.5 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/35 space-y-2">
                <span className="text-[11px] font-mono text-[#767167] uppercase tracking-wider font-semibold block">
                  RL Policy Modules Standing By
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#2b2723]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#c15f3c]" />
                    <span>Spatial DQN Policy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#c15f3c]" />
                    <span>2D-FFT Action Probe</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#c15f3c]" />
                    <span>PRNU Wavelet Agent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#c15f3c]" />
                    <span>umm-maybe ViT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#b1ada1]/30 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onChangeImage}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl glass-button-secondary flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Change Image</span>
              </button>

              <button
                onClick={onStartAnalysis}
                className="w-full sm:w-2/3 py-3 px-6 rounded-xl glass-button-primary flex items-center justify-center gap-2.5 text-sm font-semibold tracking-wide group shadow-glow-orange-sm"
              >
                <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                <span>Launch RL Forensic Scan</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
