import React from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Info,
  Download,
  Sparkles,
  Camera,
  Bot,
  Layers,
  Activity,
  Waves,
  CheckCircle2,
  FileCheck2,
  XCircle,
} from "lucide-react";

export default function ResultCard({ currentData, onDownloadReport }) {
  const isSynthetic = Boolean(currentData.isAIGenerated);
  const confidence = currentData.confidence;
  const synthScore = currentData.syntheticConfidence ?? confidence;
  const realScore = currentData.realConfidence ?? (100 - confidence);
  const supportingFindings = currentData.supportingFindings || [];
  const clientMetrics = currentData.clientMetrics || {};

  // Gauge calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  // Top 3 concise findings for "Why this verdict?"
  const topFindings = (currentData.primaryFindings || []).slice(0, 3);
  const allFindings = [...topFindings, ...supportingFindings.slice(0, 2)];

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold mb-1">
            <span className={`w-2 h-2 rounded-full ${isSynthetic ? "bg-[#c15f3c]" : "bg-emerald-600"}`} />
            <span className={isSynthetic ? "text-[#c15f3c]" : "text-emerald-700"}>
              DETECTION RESULT: {isSynthetic ? "AI GENERATED" : "REAL PHOTOGRAPH"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2b2723] tracking-tight font-sans">
            Classification Verdict
          </h2>
          <p className="text-sm text-[#767167] mt-0.5">
            Analyzed target: <span className="text-[#2b2723] font-mono font-semibold">{currentData.filename}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadReport}
            className="px-4 py-2.5 rounded-xl glass-button-secondary text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#c15f3c]" />
            <span>Export Forensic Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Large Result Card */}
      <div className="rounded-3xl glass-panel-elevated p-6 sm:p-8 border border-[#b1ada1]/35 relative overflow-hidden shadow-card-soft">

        {/* Ambient glow accent behind verdict */}
        <div className={`ambient-glow w-[380px] h-[380px] -top-20 -right-20 ${isSynthetic ? "bg-[#c15f3c]" : "bg-emerald-500"} opacity-10`} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

          {/* Main Verdict & Key Findings (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-4">

            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border shadow-sm ${
                isSynthetic
                  ? "bg-[#c15f3c]/15 text-[#c15f3c] border-[#c15f3c]/40"
                  : "bg-emerald-50 text-emerald-800 border-emerald-300"
              }`}>
                {isSynthetic ? <Bot className="w-4 h-4 text-[#c15f3c]" /> : <Camera className="w-4 h-4 text-emerald-600" />}
                {isSynthetic ? "AI-GENERATED MEDIA" : "AUTHENTIC REAL PHOTOGRAPH"}
              </span>

              <span className="text-xs font-mono text-[#767167] px-2.5 py-1 rounded-full bg-[#f4f3ee] border border-[#b1ada1]/35">
                {currentData.cameraModel || (isSynthetic ? "No Camera Sensor" : "Optical Camera")}
              </span>

              {currentData.confidenceTier && (
                <span className={`text-xs font-mono px-2.5 py-1 rounded-full border font-semibold ${
                  isSynthetic
                    ? "bg-[#c15f3c]/10 text-[#c15f3c] border-[#c15f3c]/30"
                    : "bg-emerald-50 text-emerald-800 border-emerald-300"
                }`}>
                  {currentData.confidenceTier}
                </span>
              )}

              {currentData.backendConnected && (
                <span className="text-xs font-mono text-emerald-800 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  FastAPI Multi-Signal Core
                </span>
              )}

              {/* Detection Model Tag */}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f4f3ee] text-[#767167] border border-[#b1ada1]/35">
                Model: {currentData.modelUsed?.split(" + ")[0] || "Multi-Signal"}
              </span>

              {/* Camera Sensor Status Tag */}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isSynthetic
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}>
                Sensor: {isSynthetic ? "No CMOS Detected" : "CMOS Verified"}
              </span>

              {/* FFT Spectral Status Tag */}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                (currentData.metrics?.fft_azimuthal?.is_abnormal_spectrum)
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}>
                FFT: {(currentData.metrics?.fft_azimuthal?.is_abnormal_spectrum) ? "Lattice Anomaly" : "1/f Normal"}
              </span>
            </div>

            {/* Verdict Headline */}
            <div>
              <div className="text-xs font-mono text-[#767167] uppercase tracking-wider font-semibold">
                AUTHENTICITY VERDICT
              </div>
              <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1 font-sans ${
                isSynthetic ? "text-[#c15f3c]" : "text-emerald-900"
              }`}>
                {isSynthetic ? "AI-Generated Image (Synthetic)" : "Real Camera Photograph"}
              </h3>
            </div>

            {/* High-Impact Dual Gauge */}
            <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/35 space-y-2">
              <div className="flex items-center justify-between text-sm font-mono font-bold">
                <span className="flex items-center gap-1.5 text-[#c15f3c]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c15f3c]" />
                  AI Generated: {synthScore}%
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Real Photograph: {realScore}%
                </span>
              </div>

              {/* Segmented dual meter */}
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-white border border-[#b1ada1]/40 p-0.5">
                <div
                  className="h-full bg-[#c15f3c] rounded-l-full transition-all duration-700 ease-out"
                  style={{ width: `${synthScore}%` }}
                  title={`AI Probability: ${synthScore}%`}
                />
                <div
                  className="h-full bg-emerald-600 rounded-r-full transition-all duration-700 ease-out"
                  style={{ width: `${realScore}%` }}
                  title={`Real Camera Probability: ${realScore}%`}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#767167]">
                <span>[ {synthScore}% AI Generated</span>
                <span>{realScore}% Real Photograph ]</span>
              </div>
            </div>

            {/* "Why this verdict?" quick explanation box */}
            <div className="p-4 rounded-2xl bg-white border border-[#b1ada1]/35 space-y-2">
              <div className="text-xs font-mono font-bold text-[#2b2723] uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#c15f3c]" />
                  <span>Why this verdict? (Key Evidence)</span>
                </div>
                <span className="text-[10px] font-mono font-normal text-[#767167]">Multi-Signal Forensic Proof</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#767167]">
                {allFindings.slice(0, 5).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isSynthetic ? "bg-[#c15f3c]" : "bg-emerald-600"}`} />
                    <span className="text-[#2b2723]/90 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Circular Confidence Meter (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#f4f3ee] border border-[#b1ada1]/35 relative">

            {/* Meter Container */}
            <div className="relative w-44 h-44 flex items-center justify-center">

              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-[#b1ada1]/30"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Value Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={isSynthetic ? "#c15f3c" : "#059669"}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-[#2b2723] tracking-tighter font-mono">
                  {confidence}%
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-widest font-bold mt-0.5 ${
                  isSynthetic ? "text-[#c15f3c]" : "text-emerald-700"
                }`}>
                  {isSynthetic ? "AI CONFIDENCE" : "REAL CONFIDENCE"}
                </span>
              </div>
            </div>

            {/* Tier Indicator */}
            <div className="mt-4 text-center">
              <div className="text-xs font-mono font-bold text-[#2b2723]">
                {currentData.confidenceTier || (isSynthetic ? "High AI Confidence" : "Verified Real Camera")}
              </div>
              <div className="text-[11px] text-[#767167] mt-0.5 font-mono">
                {currentData.modelUsed || "Multi-Signal Forensic Core"}
              </div>
            </div>

            {/* Quick Metrics Pills */}
            <div className="mt-5 grid grid-cols-2 gap-2 w-full pt-4 border-t border-[#b1ada1]/30 text-center">
              <div className="p-2 rounded-xl bg-white border border-[#b1ada1]/35">
                <div className="text-[9px] font-mono text-[#767167] uppercase">2D-FFT LATTICE</div>
                <div className="text-xs font-bold font-mono text-[#2b2723] mt-0.5">
                  {currentData.metrics?.fft_azimuthal?.is_abnormal_spectrum ? "Anomaly Flagged" : "Normal 1/f"}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#b1ada1]/35">
                <div className="text-[9px] font-mono text-[#767167] uppercase">SENSOR PRNU</div>
                <div className="text-xs font-bold font-mono text-[#2b2723] mt-0.5">
                  {currentData.metrics?.noise_prnu?.has_sensor_noise ? "Hardware CMOS" : "Synthetic/None"}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#b1ada1]/35">
                <div className="text-[9px] font-mono text-[#767167] uppercase">EXIF HARDWARE</div>
                <div className="text-xs font-bold font-mono text-[#2b2723] mt-0.5">
                  {currentData.metrics?.exif_metadata?.has_camera_hardware ? "Verified" : "Absent"}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#b1ada1]/35">
                <div className="text-[9px] font-mono text-[#767167] uppercase">VIT MODEL</div>
                <div className="text-xs font-bold font-mono text-[#2b2723] mt-0.5">
                  {isSynthetic ? "Anomaly" : "Clear"}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
