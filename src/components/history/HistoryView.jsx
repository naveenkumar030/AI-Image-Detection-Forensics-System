import React, { useState } from "react";
import { 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Trash2, 
  Zap,
  FolderOpen,
  Plus
} from "lucide-react";

export default function HistoryView({ 
  historyList = [], 
  onInspectSample, 
  onUploadClick,
  onClearHistory 
}) {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const totalScans = historyList.length;
  const synthScans = historyList.filter((item) => 
    item.isAIGenerated !== undefined ? Boolean(item.isAIGenerated) : (item.verdict && !item.verdict.includes("AUTHENTIC"))
  ).length;
  const synthPercent = totalScans > 0 ? ((synthScans / totalScans) * 100).toFixed(1) : "0.0";

  const filteredHistory = historyList.filter((item) => {
    const isSynthetic = item.isAIGenerated !== undefined 
      ? Boolean(item.isAIGenerated) 
      : Boolean(item.verdict && !item.verdict.includes("AUTHENTIC"));
    if (filter === "Synthetic" && !isSynthetic) return false;
    if (filter === "Authentic" && isSynthetic) return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.filename?.toLowerCase().includes(q) ||
        item.sourceTag?.toLowerCase().includes(q) ||
        item.verdict?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c15f3c] font-semibold mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>RL FORENSIC EVALUATION ARCHIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2b2723] tracking-tight font-sans">
            RL Analysis History &amp; Archive
          </h2>
          <p className="text-sm text-[#2b2723]/60 mt-1">
            Browse and inspect previous RL policy scans, Bellman returns, SHA-256 signatures, and certificates.
          </p>
        </div>

        {/* Total scans counter */}
        <div className="p-3.5 px-5 rounded-2xl bg-white border border-[#b1ada1]/30 shadow-sm flex items-center gap-5">
          <div>
            <div className="text-[10px] font-mono text-[#2b2723]/60 uppercase">RECORDED SCANS</div>
            <div className="text-2xl font-bold font-mono text-[#2b2723] mt-0.5">{totalScans}</div>
          </div>
          <div className="w-px h-8 bg-[#b1ada1]/30" />
          <div>
            <div className="text-[10px] font-mono text-[#2b2723]/60 uppercase">SYNTHETIC RATIO</div>
            <div className="text-2xl font-bold font-mono text-[#c15f3c] mt-0.5">{synthPercent}%</div>
          </div>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      {totalScans > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          
          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {["All", "Synthetic", "Authentic"].map((tab) => {
              const isActive = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                    isActive
                      ? "bg-[#c15f3c] text-white shadow-sm"
                      : "bg-white border border-[#b1ada1]/40 text-[#2b2723] hover:border-[#c15f3c]/40"
                  }`}
                >
                  {tab}
                  {tab === "All" && ` (${totalScans})`}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Field */}
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-[#2b2723]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by filename or source tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#b1ada1]/40 text-xs font-mono text-[#2b2723] placeholder-[#2b2723]/40 focus:outline-none focus:border-[#c15f3c]"
              />
            </div>

            {onClearHistory && (
              <button
                onClick={onClearHistory}
                className="p-2 rounded-xl bg-white border border-[#b1ada1]/40 text-[#2b2723]/60 hover:text-[#c15f3c] hover:border-[#c15f3c]/40 transition-colors"
                title="Clear All History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalScans === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white border border-[#b1ada1]/30 shadow-sm text-center max-w-2xl mx-auto my-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40 flex items-center justify-center mx-auto text-[#c15f3c]">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2b2723] font-sans">
              No Analysis History Recorded
            </h3>
            <p className="text-sm text-[#2b2723]/60 max-w-md mx-auto mt-1 leading-relaxed">
              When you upload images and execute Reinforcement Learning forensic scans, your verified dossiers and cryptographic certificates will be preserved here.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onUploadClick}
              className="px-6 py-3 rounded-xl bg-[#c15f3c] hover:bg-[#c15f3c]/90 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Image to Begin</span>
            </button>
          </div>
        </div>
      ) : (
        /* History Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => {
            const isSynthetic = item.isAIGenerated !== undefined 
              ? Boolean(item.isAIGenerated) 
              : Boolean(item.verdict && !item.verdict.includes("AUTHENTIC"));

            return (
              <div
                key={item.id}
                onClick={() => onInspectSample(item)}
                className="bg-white rounded-2xl p-4 border border-[#b1ada1]/30 hover:border-[#c15f3c]/60 shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f4f3ee] shrink-0 border border-[#b1ada1]/40">
                      <img
                        src={item.imageUrl}
                        alt={item.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                          isSynthetic
                            ? "bg-[#c15f3c]/10 text-[#c15f3c] border-[#c15f3c]/30"
                            : "bg-[#f4f3ee] text-[#2b2723] border-[#b1ada1]/40"
                        }`}>
                          {isSynthetic ? <AlertTriangle className="w-2.5 h-2.5" /> : <ShieldCheck className="w-2.5 h-2.5" />}
                          {isSynthetic ? "Synthetic" : "Authentic"}
                        </span>
                        <span className="text-[10px] font-mono text-[#2b2723]/60">{item.dimensions}</span>
                      </div>

                      <h4 className="text-xs font-bold text-[#2b2723] font-mono truncate">{item.filename}</h4>
                      <p className="text-[11px] text-[#2b2723]/60 mt-0.5 truncate">{item.sourceTag || "Custom Upload"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#2b2723]/60 pt-2 border-t border-[#b1ada1]/20">
                    <span>{item.dateAnalyzed || "Recent"}</span>
                    <span className={`font-bold ${isSynthetic ? "text-[#c15f3c]" : "text-[#2b2723]"}`}>
                      {item.confidence}% Q-Score
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#b1ada1]/20 flex items-center justify-between text-xs text-[#2b2723]/70 group-hover:text-[#c15f3c] transition-colors">
                  <span className="text-[10px] font-mono">Inspect RL Certificate</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c15f3c] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
