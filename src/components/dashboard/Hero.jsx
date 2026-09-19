import React from "react";
import {
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Cpu,
  Layers,
  Eye,
  Flame,
  FileCheck2,
  ChevronRight,
  Zap,
  Activity,
  CheckCircle2,
  Bot,
  Camera,
} from "lucide-react";

export default function Hero({ onUploadClick }) {
  return (
    <section className="relative pt-6 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background orbital graphic decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] pointer-events-none opacity-30">
        <div className="w-full h-full border border-[#c15f3c]/25 rounded-[100%] rotate-12 animate-spin-slow" />
        <div className="absolute inset-8 border border-[#b1ada1]/30 rounded-[100%] -rotate-6" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">

        {/* Status pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#c15f3c]/35 shadow-sm mb-6 animate-float">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c15f3c] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c15f3c]"></span>
          </span>
          <span className="text-xs font-mono font-medium text-[#2b2723]">
            Multi-Signal AI vs Real Image Verification
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] font-bold border border-[#c15f3c]/30">
            ViT + 2D-FFT + PRNU + EXIF
          </span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2b2723] tracking-tight leading-[1.12] mb-5 font-sans">
          Real or AI-Generated? <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#2b2723] via-[#767167] to-[#c15f3c] bg-clip-text text-transparent">
            Verify media authenticity.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#767167] max-w-2xl leading-relaxed mb-8 font-sans">
          Upload any image to test whether it is an authentic real photograph or AI-generated (Midjourney, DALL-E, Stable Diffusion, Deepfakes).
          Calibrated multi-signal forensics combine neural vision transformers, 2D-FFT spectral analysis, CMOS sensor PRNU noise detection, and EXIF hardware provenance.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center w-full sm:w-auto">
          <button
            onClick={onUploadClick}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl glass-button-primary flex items-center justify-center gap-2.5 text-sm font-semibold tracking-wide group shadow-glow-orange"
          >
            <span>Scan Image to Detect Real vs AI</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Forensic capability highlight cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12 w-full pt-6 border-t border-[#b1ada1]/30">
          <div className="p-4 rounded-2xl bg-white border border-[#b1ada1]/35 text-left shadow-card-soft">
            <div className="text-[10px] font-mono text-[#767167] uppercase tracking-wider">NEURAL VI T</div>
            <div className="text-base font-bold text-[#2b2723] mt-1 font-mono">Deepfake Classifier</div>
            <div className="text-[10px] text-[#c15f3c] font-mono mt-0.5">prithivMLmods/v1</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#b1ada1]/35 text-left shadow-card-soft">
            <div className="text-[10px] font-mono text-[#767167] uppercase tracking-wider">SPECTRAL FREQUENCY</div>
            <div className="text-base font-bold text-[#2b2723] mt-1 font-mono">2D-FFT Locus</div>
            <div className="text-[10px] text-[#c15f3c] font-mono mt-0.5">Azimuthal Scan</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#b1ada1]/35 text-left shadow-card-soft">
            <div className="text-[10px] font-mono text-[#767167] uppercase tracking-wider">SENSOR PHYSICS</div>
            <div className="text-base font-bold text-[#2b2723] mt-1 font-mono">CMOS PRNU</div>
            <div className="text-[10px] text-[#c15f3c] font-mono mt-0.5">Silicon Dark-Current</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#b1ada1]/35 text-left shadow-card-soft">
            <div className="text-[10px] font-mono text-[#767167] uppercase tracking-wider">EXIF AUDIT</div>
            <div className="text-base font-bold text-[#2b2723] mt-1 font-mono">Hardware Tags</div>
            <div className="text-[10px] text-[#c15f3c] font-mono mt-0.5">Camera / Lens / ISO</div>
          </div>
        </div>

      </div>
    </section>
  );
}
