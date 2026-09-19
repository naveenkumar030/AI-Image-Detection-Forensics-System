import React, { useState } from "react";
import { 
  Settings, 
  Save, 
  Check
} from "lucide-react";

export default function SettingsView() {
  const [sensitivity, setSensitivity] = useState(85);
  const [selectedPolicy, setSelectedPolicy] = useState("ppo-forensics");
  const [rlDepth, setRlDepth] = useState("deep");
  const [discountFactor, setDiscountFactor] = useState(99);
  const [apiKey, setApiKey] = useState("");
  const [savedStatus, setSavedStatus] = useState(false);

  const handleGenerateKey = () => {
    const newKey = "vl_rl_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
  };

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#b1ada1]/30">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c15f3c] font-semibold mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>RL SYSTEM CONFIGURATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2b2723] tracking-tight font-sans">
            RL Policy &amp; MDP Agent Settings
          </h2>
          <p className="text-sm text-[#2b2723]/60 mt-1">
            Adjust RL exploration depth, policy checkpoints, Bellman discount factor, and sensor reward weights.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[#c15f3c] hover:bg-[#c15f3c]/90 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          {savedStatus ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedStatus ? "Policy Saved" : "Save Policy Config"}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        
        {/* Section 1: Forensic Sensitivity & Decision Threshold */}
        <div className="bg-white rounded-3xl p-6 border border-[#b1ada1]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2b2723] tracking-tight font-sans">
                Detection Sensitivity &amp; Decision Threshold
              </h3>
              <p className="text-xs text-[#2b2723]/60 mt-0.5">
                Controls the operating threshold on the policy Q-return curve between false positive and false negative rates.
              </p>
            </div>
            <span className="text-base font-mono font-bold text-[#c15f3c]">
              {sensitivity}%
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="50"
              max="98"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full accent-[#c15f3c] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-[#2b2723]/60">
              <span>50% (High Recall / Strict)</span>
              <span>85% (Balanced Policy)</span>
              <span>98% (High Precision Only)</span>
            </div>
          </div>
        </div>

        {/* Section 2: Active RL Policy Architecture */}
        <div className="bg-white rounded-3xl p-6 border border-[#b1ada1]/30 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#2b2723] tracking-tight font-sans">
              Active RL Policy Architecture
            </h3>
            <p className="text-xs text-[#2b2723]/60 mt-0.5">
              Select the Reinforcement Learning agent policy specialized for target manipulation environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {[
              {
                id: "ppo-forensics",
                title: "PPO-Forensics-v5",
                tag: "Recommended Active",
                desc: "Proximal Policy Optimization actor-critic with multi-scale entropy bonus."
              },
              {
                id: "dqn-entropy",
                title: "DQN-Entropy-v4.2",
                tag: "High Sensitivity",
                desc: "Deep Q-Network with curiosity-driven exploration for subtle inpainting seams."
              },
              {
                id: "sac-continuous",
                title: "SAC-Continuous-v3",
                tag: "Multi-Resolution",
                desc: "Soft Actor-Critic for ultra-high resolution Gigapixel inspection."
              }
            ].map((pol) => {
              const isSelected = selectedPolicy === pol.id;
              return (
                <div
                  key={pol.id}
                  onClick={() => setSelectedPolicy(pol.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-[#c15f3c]/10 border-[#c15f3c] shadow-sm" 
                      : "bg-[#f4f3ee] border-[#b1ada1]/40 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#2b2723] font-mono">{pol.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isSelected ? "bg-[#c15f3c] text-white" : "bg-white text-[#2b2723]/60 border border-[#b1ada1]/40"
                    }`}>
                      {pol.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#2b2723]/70 leading-relaxed font-sans">{pol.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: MDP Exploration Depth & Discount Factor */}
        <div className="bg-white rounded-3xl p-6 border border-[#b1ada1]/30 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Trajectory Depth */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#2b2723] font-sans">
                MDP Exploration Trajectory Depth
              </h4>
              <p className="text-xs text-[#2b2723]/60">Number of sequential forensic hypothesis actions tested per frame.</p>
              
              <div className="flex items-center gap-2 pt-2">
                {[
                  { id: "fast", label: "Fast (3 Actions)", latency: "25ms" },
                  { id: "deep", label: "Deep (6 Actions)", latency: "65ms" },
                  { id: "exhaustive", label: "Exhaustive (12 Actions)", latency: "140ms" }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setRlDepth(d.id)}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-mono transition-all text-center ${
                      rlDepth === d.id 
                        ? "bg-[#c15f3c] text-white font-bold shadow-sm" 
                        : "bg-[#f4f3ee] border-[#b1ada1]/40 text-[#2b2723] hover:bg-white"
                    }`}
                  >
                    <div>{d.label}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{d.latency}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Discount Factor Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#2b2723] font-sans">
                  Bellman Discount Factor (γ)
                </h4>
                <span className="text-sm font-mono font-bold text-[#c15f3c]">
                  {(discountFactor / 100).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-[#2b2723]/60">Controls priority of immediate vs long-range multi-channel forensic rewards.</p>
              
              <div className="pt-2">
                <input
                  type="range"
                  min="90"
                  max="99"
                  value={discountFactor}
                  onChange={(e) => setDiscountFactor(Number(e.target.value))}
                  className="w-full accent-[#c15f3c] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-[#2b2723]/60 mt-1">
                  <span>0.90 (Localized Focus)</span>
                  <span>0.99 (Global Pareto Optimality)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section 4: API & Agent Credentials */}
        <div className="bg-white rounded-3xl p-6 border border-[#b1ada1]/30 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#2b2723] tracking-tight font-sans">
              RL Node API Authentication
            </h3>
            <p className="text-xs text-[#2b2723]/60 mt-0.5">
              Bearer key for programmatic inference and batch RL policy evaluation via Python / REST SDK.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <input
              type="text"
              value={apiKey}
              placeholder="No active API key. Click generate to create a new key."
              readOnly
              className="flex-1 min-w-[260px] px-4 py-2.5 rounded-xl bg-[#f4f3ee] border border-[#b1ada1]/40 text-xs font-mono text-[#2b2723] focus:outline-none select-all placeholder-[#2b2723]/40"
            />
            {apiKey ? (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  alert("RL API Key copied!");
                }}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#b1ada1]/40 hover:border-[#c15f3c] text-xs font-mono text-[#2b2723] transition-colors"
              >
                Copy Key
              </button>
            ) : null}
            <button
              onClick={handleGenerateKey}
              className="px-4 py-2.5 rounded-xl bg-[#c15f3c] hover:bg-[#c15f3c]/90 text-xs font-mono text-white transition-colors"
            >
              {apiKey ? "Regenerate Key" : "Generate Key"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
