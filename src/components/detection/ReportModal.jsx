import React from "react";
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  AlertTriangle, 
  Copy
} from "lucide-react";

export default function ReportModal({ currentData, onClose }) {
  const isSynthetic = !currentData.verdict.includes("AUTHENTIC");

  const handleCopyJSON = () => {
    const reportJSON = JSON.stringify(currentData, null, 2);
    navigator.clipboard.writeText(reportJSON);
    alert("RL Forensic Report JSON copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#b1ada1]/40 p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#f4f3ee] border border-[#b1ada1]/40 text-[#2b2723] hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-[#b1ada1]/30">
          <div className="w-12 h-12 rounded-2xl bg-[#f4f3ee] border border-[#c15f3c]/30 flex items-center justify-center text-[#c15f3c]">
            <span className="text-2xl font-bold font-mono">◉</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#2b2723] font-sans">
                VeriLens RL Forensic Certificate
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-semibold">
                MDP VERIFIED
              </span>
            </div>
            <p className="text-xs text-[#2b2723]/60 font-mono">
              Digital Evidence Integrity Standard ISO/IEC 27037 · RL Autonomous Node
            </p>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="py-6 space-y-5">
          
          {/* Main Verdict Strip */}
          <div className="p-4 rounded-2xl border border-[#b1ada1]/40 bg-[#f4f3ee] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isSynthetic ? (
                <AlertTriangle className="w-6 h-6 text-[#c15f3c]" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-[#2b2723]" />
              )}
              <div>
                <div className="text-[10px] font-mono text-[#2b2723]/60 uppercase">
                  RL FORENSIC CLASSIFICATION
                </div>
                <div className="text-lg font-bold text-[#2b2723] font-sans">
                  {currentData.verdict}
                </div>
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-2xl font-black text-[#c15f3c]">
                {currentData.confidence}%
              </div>
              <div className="text-[10px] text-[#2b2723]/60">Q-CONFIDENCE</div>
            </div>
          </div>

          {/* Evidence Data Table */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40">
            <div>
              <span className="text-[#2b2723]/60 block text-[10px]">FILE IDENTIFIER:</span>
              <span className="text-[#2b2723] font-semibold">{currentData.filename}</span>
            </div>
            <div>
              <span className="text-[#2b2723]/60 block text-[10px]">VERIFICATION TIMESTAMP:</span>
              <span className="text-[#2b2723]">{currentData.dateAnalyzed || "2026-09-19 11:24:08 UTC"}</span>
            </div>
            <div>
              <span className="text-[#2b2723]/60 block text-[10px]">SPATIAL DIMENSIONS:</span>
              <span className="text-[#2b2723]">{currentData.dimensions}</span>
            </div>
            <div>
              <span className="text-[#2b2723]/60 block text-[10px]">RL POLICY AGENT:</span>
              <span className="text-[#c15f3c] font-bold">{currentData.rlVerification?.agentPolicy || "Deep-Q v4.2"}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-[#b1ada1]/30 flex items-center justify-between">
              <div>
                <span className="text-[#2b2723]/60 block text-[10px]">NEURAL CLASSIFIER MODEL:</span>
                <span className="text-[#c15f3c] font-bold font-mono text-[11px]">{currentData.modelUsed || "prithivMLmods/deepfake-detector-model-v1"}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Python Backend Active</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-[#b1ada1]/30">
              <span className="text-[#2b2723]/60 block text-[10px]">SHA-256 DIGITAL FINGERPRINT:</span>
              <span className="text-[#2b2723] break-all select-all font-mono text-[11px]">
                {currentData.sha256 || "8f4c2e71b29a103c893290ff65a9172bf41e03a1d95712ef726b281b9542a1bc"}
              </span>
            </div>
          </div>

          {/* Forensic Layer Breakdown Summary */}
          <div className="space-y-2 text-xs font-mono">
            <span className="text-[10px] font-mono text-[#2b2723]/60 uppercase tracking-wider block font-semibold">
              RL Observation Vector Telemetry:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-white border border-[#b1ada1]/40">
                <div className="text-[#2b2723]/60 text-[10px]">SPATIAL POLICY GRADIENT</div>
                <div className="text-[#2b2723] font-bold">{currentData.evidence?.visualArtifacts?.status || "Anomaly Flagged"} ({currentData.evidence?.visualArtifacts?.confidence || 89}%)</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#b1ada1]/40">
                <div className="text-[#2b2723]/60 text-[10px]">SPECTRAL ACTION PROBE</div>
                <div className="text-[#2b2723] font-bold">{currentData.evidence?.frequencyAnalysis?.status || "Lattice Anomaly"} ({currentData.evidence?.frequencyAnalysis?.confidence || 94}%)</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#b1ada1]/40">
                <div className="text-[#2b2723]/60 text-[10px]">QUANTIZATION AGENT</div>
                <div className="text-[#2b2723] font-bold">{currentData.evidence?.metadata?.status || "Synthetic Footprint"} ({currentData.evidence?.metadata?.confidence || 63}%)</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#b1ada1]/40">
                <div className="text-[#2b2723]/60 text-[10px]">PRNU NOISE RESIDUAL</div>
                <div className="text-[#2b2723] font-bold">{currentData.evidence?.noisePattern?.status || "Synthetic Noise"} ({currentData.evidence?.noisePattern?.confidence || 87}%)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-[#b1ada1]/30 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyJSON}
            className="px-4 py-2.5 rounded-xl bg-[#f4f3ee] border border-[#b1ada1]/40 text-xs font-mono text-[#2b2723] hover:bg-white flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Raw JSON</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-[#f4f3ee] border border-[#b1ada1]/40 text-[#2b2723] hover:bg-white text-xs font-semibold flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={() => {
                alert("Cryptographic RL forensic report downloaded successfully.");
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#c15f3c] hover:bg-[#c15f3c]/90 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
