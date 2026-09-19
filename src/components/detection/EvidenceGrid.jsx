import React, { useState } from "react";
import { 
  Scan, 
  Activity, 
  FileSearch, 
  Waves, 
  ChevronRight, 
  Info,
  CheckCircle,
  AlertTriangle, 
  Flame,
  Zap
} from "lucide-react";

export function EvidenceCard({ data, isSynthetic }) {
  const [expanded, setExpanded] = useState(false);

  const iconMap = {
    Scan: Scan,
    Activity: Activity,
    FileSearch: FileSearch,
    Waves: Waves
  };

  const IconComponent = iconMap[data.icon] || Scan;
  const isAnomaly = data.severity === "high" || data.severity === "critical";

  return (
    <div 
      className={`
        glass-card rounded-2xl p-5 border relative flex flex-col justify-between
        transition-all duration-300
        ${isAnomaly 
          ? "border-[#b1ada1]/35 hover:border-[#c15f3c] hover:shadow-glow-orange-sm" 
          : "border-[#b1ada1]/35 hover:border-[#2b2723]"
        }
      `}
    >
      <div>
        {/* Card Header with Icon & Confidence */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`p-2.5 rounded-xl border ${
            isAnomaly 
              ? "bg-[#c15f3c]/10 border-[#c15f3c]/30 text-[#c15f3c]" 
              : "bg-[#f4f3ee] border-[#b1ada1]/40 text-[#2b2723]"
          }`}>
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="text-right">
            <span className="text-lg font-bold font-mono text-[#2b2723]">
              {data.confidence}%
            </span>
            <span className="text-[10px] block font-mono text-[#767167]">
              Q-WEIGHT
            </span>
          </div>
        </div>

        {/* Title & Status */}
        <h4 className="text-base font-bold text-[#2b2723] tracking-tight font-sans">
          {data.title}
        </h4>

        <div className="mt-1.5 mb-2.5 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
            isAnomaly 
              ? "bg-[#c15f3c]/10 text-[#c15f3c] border-[#c15f3c]/30" 
              : "bg-[#f4f3ee] text-[#2b2723] border-[#b1ada1]/40"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAnomaly ? "bg-[#c15f3c]" : "bg-[#b1ada1]"}`} />
            {data.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#767167] leading-relaxed font-sans">
          {data.description}
        </p>

        {/* Expandable Technical Details */}
        {expanded && (
          <div className="mt-3.5 pt-3 border-t border-[#b1ada1]/30 text-xs font-mono text-[#767167] bg-[#f4f3ee] p-2.5 rounded-xl space-y-1.5">
            <div className="text-[10px] text-[#767167] uppercase tracking-wider font-semibold">
              Policy Agent Diagnostic:
            </div>
            <p className="text-[#2b2723] leading-normal">{data.details}</p>
          </div>
        )}
      </div>

      {/* Expand Toggle */}
      <div className="mt-4 pt-3 border-t border-[#b1ada1]/25 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-mono text-[#767167] hover:text-[#c15f3c] flex items-center gap-1 transition-colors"
        >
          <span>{expanded ? "Hide Diagnostic" : "View Diagnostic"}</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90 text-[#c15f3c]" : ""}`} />
        </button>

        {/* Mini progress bar */}
        <div className="w-16 bg-[#f4f3ee] h-1.5 rounded-full overflow-hidden border border-[#b1ada1]/30">
          <div 
            className={`h-full rounded-full ${isAnomaly ? "bg-[#c15f3c]" : "bg-[#2b2723]"}`}
            style={{ width: `${data.confidence}%` }}
          />
        </div>
      </div>

    </div>
  );
}

export default function EvidenceGrid({ evidence, isAI }) {
  const isSynthetic = isAI !== undefined ? isAI : true;

  const defaultCards = {
    visualArtifacts: {
      title: "Spatial Policy Gradient",
      status: isSynthetic ? "Anomaly Flagged" : "Natural Optical Manifold",
      confidence: isSynthetic ? 89 : 94,
      description: isSynthetic ? "RL policy agent detected synthetic micro-texture dissonance." : "Natural optical dispersion and sub-pixel Bayer distribution verified.",
      icon: "Scan",
      details: isSynthetic ? "Actor-Critic policy saccade isolated non-Euclidean boundary transitions." : "Natural lens aberration consistent with physical glass optics.",
      severity: isSynthetic ? "high" : "low"
    },
    frequencyAnalysis: {
      title: "Spectral Action Probe",
      status: isSynthetic ? "Lattice Anomaly" : "Continuous 1/f Spectrum",
      confidence: isSynthetic ? 94 : 96,
      description: isSynthetic ? "Frequency action probe breached natural azimuthal energy thresholds." : "Power spectral density follows natural 1/f photographic distribution.",
      icon: "Activity",
      details: isSynthetic ? "Fourier azimuthal distribution exhibits sharp synthetic harmonic peaks." : "Smooth frequency rolloff without periodic grid artifacts.",
      severity: isSynthetic ? "critical" : "low"
    },
    metadata: {
      title: "Quantization Agent",
      status: isSynthetic ? "Synthetic Footprint" : "Verified EXIF",
      confidence: isSynthetic ? 63 : 91,
      description: isSynthetic ? "Quantization matrix tables match synthetic render encoders." : "Hardware camera parameters and exposure headers validated.",
      icon: "FileSearch",
      details: isSynthetic ? "Quantization matrix tables indicate synthetic rendering encoder." : "Consistent color profile tags and sensor calibration curves found.",
      severity: isSynthetic ? "medium" : "low"
    },
    noisePattern: {
      title: "PRNU Sensor Noise Agent",
      status: isSynthetic ? "Non-Poisson Noise" : "Silicon Wafer Matched",
      confidence: isSynthetic ? 87 : 93,
      description: isSynthetic ? "Photon noise residual diverged from physical silicon sensor model." : "Consistent CMOS PRNU noise signature confirmed across RGB channels.",
      icon: "Waves",
      details: isSynthetic ? "Zero-mean synthetic residual devoid of physical sensor dark current." : "Matched camera sensor sensor PRNU fingerprint with zero discrepancy.",
      severity: isSynthetic ? "high" : "low"
    }
  };

  const cards = [
    evidence?.visualArtifacts || defaultCards.visualArtifacts,
    evidence?.frequencyAnalysis || defaultCards.frequencyAnalysis,
    evidence?.metadata || defaultCards.metadata,
    evidence?.noisePattern || defaultCards.noisePattern
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#2b2723] tracking-tight flex items-center gap-2 font-sans">
            <span>RL Observation Channels</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white border border-[#b1ada1]/40 text-[#767167] shadow-sm">
              4 POLICY VECTORS
            </span>
          </h3>
          <p className="text-xs text-[#767167]">
            Multi-modal layer observation signals formulated into agent reward functions.
          </p>
        </div>
      </div>

      {/* 4 Responsive Evidence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item, idx) => (
          <EvidenceCard key={item?.title || idx} data={item} isSynthetic={isSynthetic} />
        ))}
      </div>
    </div>
  );
}
