import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileImage,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  Layers,
  Image as ImageIcon,
  Camera,
  Bot,
} from "lucide-react";
import { QUICK_TEST_SAMPLES } from "../../data/forensicSamples";

export default function UploadZone({ onImageSelected, onSelectSample }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFile = (file) => {
    setErrorMsg("");
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds maximum 10 MB limit. Please select a smaller image.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Unsupported file format. Please upload JPG, JPEG, PNG, or WEBP.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      onImageSelected(file, objectUrl, { width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = objectUrl;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Upload Container */}
      <div className={`
        relative rounded-3xl glass-card p-6 sm:p-8
        transition-all duration-300 group
        ${isDragOver
          ? "border-[#c15f3c] shadow-glow-orange-lg scale-[1.01]"
          : "border-[#b1ada1]/35 hover:border-[#c15f3c] hover:shadow-glow-orange"
        }
      `}>
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#b1ada1]/30">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2b2723] tracking-tight flex items-center gap-2.5 font-sans">
              <span>Scan &amp; Detect Media</span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30">
                REAL VS AI DETECTOR
              </span>
            </h2>
            <p className="text-sm text-[#767167] mt-1">
              Upload any image to test whether it is an authentic real photograph or AI-generated (Midjourney, DALL-E, Stable Diffusion, Deepfakes).
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#767167]">
            <Shield className="w-4 h-4 text-[#c15f3c]" />
            <span>Zero Data Retention · Local Compute</span>
          </div>
        </div>

        {/* Upload Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative mt-6 rounded-2xl border-2 border-dashed
            flex flex-col items-center justify-center p-8 sm:p-14
            cursor-pointer overflow-hidden transition-all duration-300
            ${isDragOver
              ? "border-[#c15f3c] bg-[#c15f3c]/5"
              : "border-[#b1ada1]/50 hover:border-[#c15f3c] bg-[#f4f3ee]/60 hover:bg-[#f4f3ee]"
            }
          `}
        >
          {/* Holographic grid overlay */}
          <div className="absolute inset-0 bg-forensic-grid opacity-40 pointer-events-none" />

          {/* Upload Icon */}
          <div className="relative mb-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#b1ada1]/40 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-[#c15f3c]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#c15f3c] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-center relative z-10 space-y-1.5">
            <p className="text-base sm:text-lg font-semibold text-[#2b2723] font-sans">
              Drag &amp; Drop Image Here
            </p>
            <p className="text-sm text-[#767167]">
              or <span className="text-[#c15f3c] underline underline-offset-4 font-medium hover:text-[#a94f30]">Browse Files</span> from your computer
            </p>
          </div>

          {/* Supported Formats */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#767167] relative z-10">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#b1ada1]/35 shadow-sm">
              JPG · JPEG · PNG · WEBP
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#b1ada1]/35 text-[#2b2723] font-medium shadow-sm">
              Up to 10 MB
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#c15f3c]/10 border border-[#c15f3c]/30 text-[#c15f3c] font-semibold shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c]" />
              Multi-Signal: ViT + 2D-FFT + PRNU + EXIF
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* 1-Click Instant Test Samples */}
        {onSelectSample && (
          <div className="mt-6 pt-6 border-t border-[#b1ada1]/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
              <span className="text-xs font-mono font-bold text-[#2b2723] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c15f3c]" />
                <span>Instant Verification Test Samples:</span>
              </span>
              <span className="text-[11px] font-mono text-[#767167]">
                Click below to test Real vs AI detection instantly
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {QUICK_TEST_SAMPLES.map((sample) => {
                const isReal = sample.type === "real";
                return (
                  <button
                    key={sample.id}
                    onClick={() => onSelectSample(sample)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group shadow-sm hover:scale-[1.01] ${
                      isReal
                        ? "bg-emerald-50/50 border-emerald-300/80 hover:bg-emerald-50 hover:border-emerald-500"
                        : "bg-[#c15f3c]/5 border-[#c15f3c]/30 hover:bg-[#c15f3c]/10 hover:border-[#c15f3c]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
                        isReal
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-[#c15f3c]/15 text-[#c15f3c] border-[#c15f3c]/35"
                      }`}>
                        {isReal ? <Camera className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#767167]">
                          {isReal ? "GROUND TRUTH: REAL" : "GROUND TRUTH: SYNTHETIC"}
                        </div>
                        <div className={`text-sm font-bold mt-0.5 ${
                          isReal ? "text-emerald-950 group-hover:text-emerald-700" : "text-[#2b2723] group-hover:text-[#c15f3c]"
                        }`}>
                          {sample.title}
                        </div>
                        <div className="text-[11px] text-[#767167] font-mono">
                          {sample.subtitle}
                        </div>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                      isReal
                        ? "border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white"
                        : "border-[#c15f3c]/30 group-hover:bg-[#c15f3c] group-hover:text-white"
                    }`}>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-[#c15f3c]/10 border border-[#c15f3c]/30 text-[#c15f3c] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

      </div>
    </div>
  );
}
