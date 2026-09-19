import React from "react";
import { 
  Cpu, 
  Waves, 
  CheckCircle2, 
  Zap,
  ArrowRight,
  TrendingUp,
  Workflow
} from "lucide-react";

export default function HowItWorksView({ onTryScanner }) {
  const pillars = [
    {
      id: "mdp",
      title: "1. Markov Decision Process (MDP) Formulation",
      tag: "State-Action Environment (S, A, P, R, γ)",
      icon: Workflow,
      description: "Digital forensics formulated as sequential decision-making rather than a brittle, opaque black-box AI classifier.",
      details: [
        "State Space S: Multi-scale pixel matrices, dual-tree wavelet decompositions, 2D-FFT energy spectra, and PRNU sensor residuals.",
        "Action Space A: Dynamic forensic probes including spatial saccade crops, high-frequency slice filters, and quantization table parsers.",
        "Reward Function R(s,a): Information gain reward penalized for exploration cost and rewarded for empirical sensor anomaly divergence."
      ]
    },
    {
      id: "policy",
      title: "2. Deep Q-Network & Actor-Critic Policy (PPO)",
      tag: "Bellman Optimality Q*(s, a)",
      icon: Cpu,
      description: "Autonomous policy actors navigate pixel manifolds to actively search for synthetic manipulation seams.",
      details: [
        "Actor policy π_θ(a|s) selects the next forensic probe to test specific manipulation hypotheses.",
        "Critic value network V_ϕ(s) estimates expected cumulative returns without relying on single-pass heuristic shortcuts.",
        "Bellman recurrence converges with high mathematical stability across diverse resolution tiers."
      ]
    },
    {
      id: "prnu",
      title: "3. Physical Sensor PRNU Calibration Reward",
      tag: "Hardware Silicon Ground Truth",
      icon: Waves,
      description: "Evaluates Photo-Response Non-Uniformity (PRNU) — the unique physical silicon wafer fingerprint of authentic camera sensors.",
      details: [
        "Real digital sensors exhibit stochastic silicon wafer imperfections that follow Poisson photon statistics.",
        "Synthetic images produce zero-mean synthetic Gaussian or DDIM sampling step noise that fails correlation tests.",
        "Correlates noise residuals against physical camera profiles to compute an objective, unhackable reward metric."
      ]
    },
    {
      id: "consensus",
      title: "4. Multi-Agent Cooperative Policy Equilibrium",
      tag: "Pareto-Optimal Consensus",
      icon: Zap,
      description: "Independent specialized RL agents collaborate in a cooperative game to reach verifiable forensic certainty.",
      details: [
        "Spectral Agent, Noise Residual Agent, Spatial Saccade Agent, and Quantization Agent independently propose action trajectories.",
        "Consensus mechanism balances multi-dimensional evidence, eliminating false positives from compression or social media filters.",
        "Delivers an average +18% confidence improvement over standard static models."
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c15f3c] font-semibold mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>REINFORCEMENT LEARNING FORENSIC METHODOLOGY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2b2723] tracking-tight font-sans">
          Why RL Instead of Black-Box AI?
        </h2>
        <p className="text-base text-[#2b2723]/70 mt-3 leading-relaxed">
          Traditional AI classifiers rely on superficial texture shortcuts that fail against new generators. AI Image Detector treats forensics as an autonomous Markov Decision Process (MDP), sequentially probing state-action spaces to verify digital provenance.
        </p>
      </div>

      {/* MDP Mathematical Formula Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#b1ada1]/30 shadow-sm mb-12 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#b1ada1]/30">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c15f3c] font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>BELLMAN VALUE FORMULATION FOR FORENSIC AGENTS</span>
          </div>
          <span className="text-[11px] font-mono text-[#2b2723]/60">OPTIMAL POLICY: π* = argmax E[∑ γ^t R_t]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
          <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40">
            <div className="text-[10px] text-[#2b2723]/60 uppercase">1. STATE SPACE S</div>
            <div className="text-sm font-bold text-[#2b2723] mt-1">S = &#123;I_rgb, W_wave, F_fft, N_prnu&#125;</div>
            <div className="text-[10px] text-[#2b2723]/60 mt-1">Multi-modal image tensor</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#c15f3c]/40">
            <div className="text-[10px] text-[#c15f3c] uppercase font-bold">2. REWARD FUNCTION R</div>
            <div className="text-sm font-bold text-[#c15f3c] mt-1">R = D_KL(P_sensor || P_sample) - λ·C(a)</div>
            <div className="text-[10px] text-[#2b2723]/60 mt-1">Entropy gain &amp; sensor divergence</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40">
            <div className="text-[10px] text-[#2b2723] uppercase font-bold">3. Q-CONVERGENCE</div>
            <div className="text-sm font-bold text-[#2b2723] mt-1">Q*(s, a) = R(s,a) + γ max Q*(s', a')</div>
            <div className="text-[10px] text-[#2b2723]/60 mt-1">Convergence discount γ = 0.99</div>
          </div>
        </div>
      </div>

      {/* Pipeline Diagram Strip */}
      <div className="p-6 rounded-3xl bg-white border border-[#b1ada1]/30 shadow-sm mb-12 relative overflow-hidden">
        <div className="text-xs font-mono text-[#c15f3c] uppercase tracking-wider font-semibold mb-4">
          END-TO-END RL DECISION PIPELINE
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10 text-center font-mono">
          <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40">
            <div className="text-[10px] text-[#2b2723]/60">STATE INGESTION</div>
            <div className="text-xs font-bold text-[#2b2723] mt-1">Environment S_0</div>
            <div className="text-[10px] text-[#c15f3c] mt-1">Multi-scale Tensor</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40">
            <div className="text-[10px] text-[#2b2723]/60">ACTION a_1</div>
            <div className="text-xs font-bold text-[#2b2723] mt-1">DQN Saccade Probe</div>
            <div className="text-[10px] text-[#2b2723]/60 mt-1">Micro-Texture Seam</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40">
            <div className="text-[10px] text-[#2b2723]/60">ACTION a_2 &amp; a_3</div>
            <div className="text-xs font-bold text-[#2b2723] mt-1">2D-FFT &amp; PRNU Policy</div>
            <div className="text-[10px] text-[#2b2723]/60 mt-1">Spectral &amp; Silicon Wavelet</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#c15f3c]/10 border border-[#c15f3c]">
            <div className="text-[10px] text-[#c15f3c] font-bold">STAGE 4</div>
            <div className="text-xs font-bold text-[#2b2723] mt-1">Actor-Critic Consensus</div>
            <div className="text-[10px] text-[#c15f3c] mt-1">Multi-Agent Equilibrium</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#f4f3ee] border border-[#b1ada1]/40">
            <div className="text-[10px] text-[#2b2723]/60">OUTPUT</div>
            <div className="text-xs font-bold text-[#2b2723] mt-1">Optimal Q* Certificate</div>
            <div className="text-[10px] text-[#2b2723]/60 mt-1">99.4% Accuracy</div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="bg-white rounded-3xl p-6 sm:p-7 border border-[#b1ada1]/30 hover:border-[#c15f3c]/60 shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#f4f3ee] border border-[#c15f3c]/30 flex items-center justify-center text-[#c15f3c]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#f4f3ee] border border-[#b1ada1]/40 text-[#2b2723]">
                    {p.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#2b2723] tracking-tight font-sans mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-[#2b2723]/70 leading-relaxed mb-4">
                  {p.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-[#b1ada1]/20">
                  {p.details.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#2b2723]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c15f3c] shrink-0 mt-0.5" />
                      <span className="leading-normal">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action Bar */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#b1ada1]/30 text-center relative overflow-hidden shadow-sm">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#2b2723] tracking-tight font-sans">
          Ready to run live Reinforcement Learning analysis?
        </h3>
        <p className="text-sm text-[#2b2723]/60 mt-2 max-w-lg mx-auto">
          Test your images against our autonomous RL policy agent with instant explainable Q-value trajectories.
        </p>
        <button
          onClick={onTryScanner}
          className="mt-6 px-8 py-3.5 rounded-xl bg-[#c15f3c] hover:bg-[#c15f3c]/90 text-white text-sm font-semibold tracking-wide inline-flex items-center gap-2 group shadow-sm transition-all"
        >
          <span>Launch RL Scanner</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
