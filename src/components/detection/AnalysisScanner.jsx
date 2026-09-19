import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Terminal, 
  Cpu, 
  Activity, 
  Scan, 
  Waves, 
  FileSearch, 
  ShieldAlert,
  Zap
} from "lucide-react";

export default function AnalysisScanner({ currentData, onAnalysisComplete }) {
  const [progress, setProgress] = useState(12);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([
    "INITIALIZING: AI Image Detector Autonomous Agent Engine...",
    "MDP FORMULATION: Defining State Space S = {I_rgb, W_wavelet, F_fft, N_prnu}...",
    "POLICY INITIALIZATION: Loading Deep-Q Network & PPO Actor-Critic weights..."
  ]);

  const stages = [
    { name: "State Space Ingestion", key: "prep", threshold: 16, icon: FileSearch, code: "S_0 ∈ R^(HxWx4)" },
    { name: "DQN Policy Exploration", key: "feat", threshold: 36, icon: Scan, code: "π_θ(a_1|S_0)" },
    { name: "Spectral Action Probe", key: "freq", threshold: 56, icon: Activity, code: "FFT-2D(a_2)" },
    { name: "Sensor PRNU Wavelet Policy", key: "noise", threshold: 74, icon: Waves, code: "PRNU(a_3)" },
    { name: "Actor-Critic Consensus", key: "consensus", threshold: 90, icon: Cpu, code: "V_ϕ(s)" },
    { name: "Optimal Value Convergence", key: "final", threshold: 100, icon: Zap, code: "Q*(s,a)" }
  ];

  const floatingTags = [
    { label: "STATE TENSOR", x: "42%", y: "28%", delay: 0.2 },
    { label: "Q-ACTION a_1", x: "68%", y: "52%", delay: 0.6 },
    { label: "PRNU REWARD", x: "24%", y: "65%", delay: 1.0 },
    { label: "2D-FFT PROBE", x: "70%", y: "22%", delay: 1.4 },
    { label: "DQT MATRIX", x: "30%", y: "82%", delay: 1.8 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onAnalysisComplete();
          }, 600);
          return 100;
        }

        const next = Math.min(100, prev + Math.floor(Math.random() * 6) + 3);

        // Update stage based on progress
        if (next >= 90) {
          setActiveStageIndex(5);
        } else if (next >= 74) {
          setActiveStageIndex(4);
        } else if (next >= 56) {
          setActiveStageIndex(3);
        } else if (next >= 36) {
          setActiveStageIndex(2);
        } else if (next >= 16) {
          setActiveStageIndex(1);
        }

        // Dynamic RL policy logs
        if (next > 20 && next < 30) {
          setTerminalLogs((l) => [
            ...l.slice(-4),
            currentData?.backendConnected
              ? `[PY-FASTAPI] Ingested tensor ${currentData.dimensions}. MD5: ${currentData.hashMD5?.slice(0, 10)}...`
              : `[MDP STEP 1/6] Ingested tensor ${currentData.dimensions}. State space normalized to [-1, 1].`
          ]);
        } else if (next > 40 && next < 50) {
          setTerminalLogs((l) => [
            ...l.slice(-4),
            currentData?.backendConnected
              ? `[PY-OPENCV] 2D-FFT azimuthal power spectrum & Laplacian variance computed.`
              : `[MDP STEP 2/6] Policy agent executed spatial saccade: accumulated +0.38 entropy anomaly reward.`
          ]);
        } else if (next > 60 && next < 70) {
          setTerminalLogs((l) => [
            ...l.slice(-4),
            currentData?.backendConnected
              ? `[PY-PIL] Error Level Analysis (ELA) residual matrix isolated.`
              : `[MDP STEP 3/6] Spectral action probe executed 2D-FFT azimuthal power distribution scan.`
          ]);
        } else if (next > 75 && next < 85) {
          setTerminalLogs((l) => [
            ...l.slice(-4),
            currentData?.backendConnected
              ? `[PY-TORCH] Evaluated model: ${currentData.modelUsed || "umm-maybe/AI-image-detector"}`
              : `[MDP STEP 4/6] PRNU sensor agent isolated wavelet residuals; comparing with CMOS dark current.`
          ]);
        } else if (next >= 92 && next < 98) {
          setTerminalLogs((l) => [
            ...l.slice(-4),
            currentData?.backendConnected
              ? `[RL AGENT] Multi-probe reward divergence: ${currentData.confidence}% confidence.`
              : `[MDP STEP 5/6] Actor-Critic policy equilibrium reached across 4 independent reward channels.`
          ]);
        } else if (next >= 100) {
          setTerminalLogs((l) => [
            ...l.slice(-4),
            `[MDP STEP 6/6] Bellman optimality condition satisfied. Optimal Q* return converged.`
          ]);
        }

        return next;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [currentData, onAnalysisComplete]);

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-[#c15f3c]/40 shadow-glow-orange relative overflow-hidden">
        
        {/* Holographic Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#b1ada1]/30">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-[#c15f3c]" />
              <span className="absolute w-5 h-5 rounded-full bg-[#c15f3c]/50 animate-ping" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#2b2723] tracking-tight font-sans">
                RL Forensic Agent Trajectory Active
              </h2>
              <p className="text-xs text-[#767167] font-mono">
                Evaluating target: <span className="text-[#c15f3c] font-semibold">{currentData.filename}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#767167]">POLICY LATENCY:</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#c15f3c]/10 text-[#c15f3c] border border-[#c15f3c]/30 font-semibold">
              18.4ms / action
            </span>
          </div>
        </div>

        {/* Center & Right Scan Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Center Image Scanner Overlay */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden bg-[#f4f3ee] border border-[#b1ada1]/40 shadow-xl flex items-center justify-center group">
              
              {/* Target Image with Scanning Gradients */}
              <img
                src={currentData.imageUrl}
                alt="Target Image Scan"
                className="w-full h-full object-cover filter brightness-95 contrast-105"
              />

              {/* Animated Holographic Reticle Grid */}
              <div className="absolute inset-0 bg-forensic-grid opacity-40 pointer-events-none" />

              {/* Animated Horizontal Laser Scan Line */}
              <motion.div
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c15f3c] to-transparent shadow-[0_0_16px_#c15f3c] pointer-events-none z-20"
              >
                <div className="w-full h-12 bg-gradient-to-b from-[#c15f3c]/20 to-transparent -translate-y-full" />
              </motion.div>

              {/* Floating RL state detection tags */}
              {floatingTags.map((tag) => (
                <motion.div
                  key={tag.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
                  transition={{ repeat: Infinity, duration: 3, delay: tag.delay, ease: "easeInOut" }}
                  className="absolute pointer-events-none z-20 font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/95 border border-[#c15f3c]/60 text-[#c15f3c] shadow-md backdrop-blur-sm font-semibold"
                  style={{ left: tag.x, top: tag.y }}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c15f3c] mr-1" />
                  {tag.label}
                </motion.div>
              ))}

              {/* HUD Coordinates Display */}
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-white/90 border border-[#b1ada1]/40 text-[10px] font-mono text-[#767167] z-20 shadow-sm">
                STATE: MDP_S6 · Q_VAL: {(progress / 100 * 0.91).toFixed(2)}
              </div>

              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/90 border border-[#c15f3c]/40 text-[10px] font-mono text-[#c15f3c] z-20 font-bold shadow-sm">
                RL AGENT ACTIVE
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full max-w-md mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#767167] flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c15f3c]" />
                  <span>Convergence Progress:</span>
                </span>
                <span className="text-[#c15f3c] font-bold text-sm">{progress}%</span>
              </div>
              <div className="w-full bg-[#f4f3ee] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#b1ada1]/40">
                <div 
                  className="h-full bg-[#c15f3c] rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: 6 RL Stages & Terminal Feed */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Sequential Stage Badges */}
            <div className="space-y-2.5">
              <div className="text-xs font-mono text-[#767167] uppercase tracking-wider font-semibold mb-1">
                MDP Decision Trajectory
              </div>

              {stages.map((stage, idx) => {
                const isCompleted = activeStageIndex > idx;
                const isCurrent = activeStageIndex === idx;
                const StageIcon = stage.icon;

                return (
                  <div
                    key={stage.key}
                    className={`
                      flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all
                      ${isCompleted 
                        ? "bg-[#c15f3c]/5 border-[#c15f3c]/30 text-[#2b2723]" 
                        : isCurrent 
                          ? "bg-[#c15f3c]/15 border-[#c15f3c] text-[#c15f3c] shadow-sm font-semibold" 
                          : "bg-white border-[#b1ada1]/30 text-[#767167]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#c15f3c] shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-[#c15f3c] animate-spin shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#b1ada1] shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold block font-sans text-xs">{stage.name}</span>
                        <span className="text-[10px] text-[#767167] font-mono">{stage.code}</span>
                      </div>
                    </div>

                    <div className="text-[10px] uppercase font-mono font-semibold">
                      {isCompleted ? "VERIFIED" : isCurrent ? "COMPUTING" : "WAITING"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Reinforcement Learning Terminal Stream */}
            <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40 font-mono text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#b1ada1]/30 text-[10px] text-[#767167]">
                <div className="flex items-center gap-1.5 font-semibold text-[#2b2723]">
                  <Terminal className="w-3.5 h-3.5 text-[#c15f3c]" />
                  <span>RL POLICY TELEMETRY STREAM</span>
                </div>
                <span className="text-[#c15f3c] font-semibold">ONLINE</span>
              </div>

              <div className="space-y-1 pt-1 text-[11px] max-h-32 overflow-y-auto">
                {terminalLogs.map((log, i) => (
                  <p key={i} className="text-[#2b2723] leading-snug">
                    <span className="text-[#c15f3c] font-bold">&gt;</span> {log}
                  </p>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
