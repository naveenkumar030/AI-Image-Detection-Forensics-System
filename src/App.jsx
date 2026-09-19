import React, { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import OrbitalParticles from "./components/background/OrbitalParticles";
import Hero from "./components/dashboard/Hero";
import UploadZone from "./components/detection/UploadZone";
import ImagePreview from "./components/detection/ImagePreview";
import AnalysisScanner from "./components/detection/AnalysisScanner";
import ResultCard from "./components/detection/ResultCard";
import EvidenceGrid from "./components/detection/EvidenceGrid";
import ExplainableAI from "./components/detection/ExplainableAI";
import ConfidenceChart from "./components/detection/ConfidenceChart";
import RLVerification from "./components/detection/RLVerification";
import ForensicHeatmap from "./components/detection/ForensicHeatmap";
import FinalVerdict from "./components/detection/FinalVerdict";
import ReportModal from "./components/detection/ReportModal";
import HistoryView from "./components/history/HistoryView";
import AnalyticsView from "./components/analytics/AnalyticsView";
import HowItWorksView from "./components/howitworks/HowItWorksView";
import { generateForensicsForFile } from "./data/forensicSamples";
import { checkBackendHealth, analyzeImageWithPython } from "./services/pythonBackend";

export default function App() {
  // Navigation & view states
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'detection' | 'history' | 'analytics' | 'how-it-works' | 'settings'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Forensic detection lifecycle states: 'idle' | 'preview' | 'scanning' | 'results'
  const [scanState, setScanState] = useState("idle");
  const [currentData, setCurrentData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ isOnline: false, details: null });
  const [pendingBackendPromise, setPendingBackendPromise] = useState(null);

  // History list persisted in localStorage
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem("verilens_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check Python backend connection on mount & periodically
  const refreshBackendHealth = async () => {
    const health = await checkBackendHealth();
    setBackendStatus(health);
  };

  useEffect(() => {
    refreshBackendHealth();
    const interval = setInterval(refreshBackendHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("verilens_history", JSON.stringify(historyList));
    } catch (e) {
      console.error("Failed to persist history to localStorage", e);
    }
  }, [historyList]);

  // Handle image upload from computer — auto-start analysis so output is immediate
  const handleImageUpload = (file, objectUrl, dimensions) => {
    // 1. Initial responsive state
    const generatedData = generateForensicsForFile(file, objectUrl, dimensions);
    setCurrentData(generatedData);
    setScanState("scanning");
    setActiveTab("detection");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 2. Trigger asynchronous Python FastAPI analysis with real ViT & CV forensics
    const promise = analyzeImageWithPython(file, objectUrl, dimensions).then((realData) => {
      if (realData) {
        setCurrentData(realData);
      }
      return realData;
    });
    setPendingBackendPromise(promise);
  };

  // Handle 1-click built-in test sample selection
  const handleSelectSample = (sample) => {
    setCurrentData(sample);
    setScanState("scanning");
    setActiveTab("detection");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPendingBackendPromise(null);
  };

  // Start the animated forensic analysis manually if called
  const handleStartAnalysis = async () => {
    setScanState("scanning");
    if (pendingBackendPromise) {
      try {
        const realData = await pendingBackendPromise;
        if (realData) {
          setCurrentData(realData);
        }
      } catch (err) {
        console.warn("Backend prediction resolution note:", err);
      }
    }
  };

  // Analysis scanner completes — smoothly transition to results
  const handleAnalysisComplete = async () => {
    if (pendingBackendPromise) {
      try {
        const realData = await pendingBackendPromise;
        if (realData) {
          setCurrentData(realData);
          setHistoryList((prev) => {
            const filtered = prev.filter((item) => item.id !== realData.id);
            return [realData, ...filtered];
          });
          setScanState("results");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      } catch (err) {
        console.warn("Backend completion resolution note:", err);
      }
    }

    setScanState("results");
    if (currentData) {
      setHistoryList((prev) => {
        const filtered = prev.filter((item) => item.id !== currentData.id);
        return [currentData, ...filtered];
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to analyze another image
  const handleAnalyzeAnother = () => {
    setScanState("idle");
    setCurrentData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Switch to History sample inspection
  const handleInspectHistorySample = (sample) => {
    setCurrentData(sample);
    setScanState("results");
    setActiveTab("detection");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear all history
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all forensic evaluation history?")) {
      setHistoryList([]);
      localStorage.removeItem("verilens_history");
    }
  };

  // Search quick selection from real history
  const handleSearchSelect = (query) => {
    const matchedSample = historyList.find(
      (s) => s.filename?.toLowerCase().includes(query.toLowerCase()) || s.sourceTag?.toLowerCase().includes(query.toLowerCase())
    );
    if (matchedSample) {
      setCurrentData(matchedSample);
      setScanState("results");
      setActiveTab("detection");
    }
  };

  const handleUploadClick = () => {
    setActiveTab("detection");
    setScanState("idle");
    setCurrentData(null);
    setTimeout(() => {
      document.getElementById("upload-zone-card")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#f4f3ee] text-[#2b2723] font-sans relative selection:bg-[#c15f3c]/20 selection:text-[#c15f3c]">
      
      {/* Antigravity Ambient Canvas & Orbital Glow */}
      <OrbitalParticles />

      {/* Persistent Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === "dashboard") {
            setScanState("idle");
          }
        }}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        historyCount={historyList.length}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
        
        {/* Top Navigation */}
        <Topbar
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          activeTab={activeTab}
          onSearchSelect={handleSearchSelect}
          backendStatus={backendStatus}
          onRefreshBackend={refreshBackendHealth}
        />

        {/* Dynamic View Router */}
        <main className="flex-1 pb-16">
          
          {/* Dashboard & Detection View */}
          {(activeTab === "dashboard" || activeTab === "detection") && (
            <div className="space-y-6">
              
              {/* Idle State or no image loaded: Hero & Upload */}
              {(scanState === "idle" || !currentData) && (
                <>
                  {activeTab === "dashboard" && (
                    <Hero
                      onUploadClick={handleUploadClick}
                    />
                  )}
                  <div id="upload-zone-card" className="px-4 sm:px-6 lg:px-8 pt-6">
                    <UploadZone
                      onImageSelected={handleImageUpload}
                      onSelectSample={handleSelectSample}
                    />
                  </div>
                </>
              )}

              {/* Preview State: Image Preview & File Information */}
              {scanState === "preview" && currentData && (
                <div className="px-4 sm:px-6 lg:px-8 pt-8">
                  <ImagePreview
                    currentData={currentData}
                    onChangeImage={handleAnalyzeAnother}
                    onStartAnalysis={handleStartAnalysis}
                  />
                </div>
              )}

              {/* Scanning State: Holographic Forensic Animation */}
              {scanState === "scanning" && currentData && (
                <div className="px-4 sm:px-6 lg:px-8 pt-8">
                  <AnalysisScanner
                    currentData={currentData}
                    onAnalysisComplete={handleAnalysisComplete}
                  />
                </div>
              )}

              {/* Results State: Complete Forensic Dossier */}
              {scanState === "results" && currentData && (
                <div className="px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
                  {/* 1. Main Result Card with Circular Meter */}
                  <ResultCard
                    currentData={currentData}
                    onDownloadReport={() => setShowReportModal(true)}
                  />

                  {/* 2. Responsive 4-Channel Evidence Grid */}
                  <EvidenceGrid
                    evidence={currentData.evidence}
                    isAI={!currentData.verdict.includes("AUTHENTIC")}
                  />

                  {/* 3. Explainable RL (XRL) with Q-Value Saliency & Policy Map */}
                  <ExplainableAI
                    currentData={currentData}
                  />

                  {/* 4. Horizontal Probability & Ensemble Confidence Breakdown */}
                  <ConfidenceChart
                    currentData={currentData}
                  />

                  {/* 5. RL Verification Agent Expandable Node Graph */}
                  <RLVerification
                    currentData={currentData}
                  />

                  {/* 6. Image Forensic Map with Intensity Highlights & Zoom */}
                  <ForensicHeatmap
                    currentData={currentData}
                  />

                  {/* 7. Centered Final Verdict Card */}
                  <FinalVerdict
                    currentData={currentData}
                    onAnalyzeAnother={handleAnalyzeAnother}
                    onDownloadReport={() => setShowReportModal(true)}
                    onViewFullAnalysis={() => setShowReportModal(true)}
                  />
                </div>
              )}

            </div>
          )}

          {/* History Archive View */}
          {activeTab === "history" && (
            <HistoryView 
              historyList={historyList}
              onInspectSample={handleInspectHistorySample}
              onUploadClick={handleUploadClick}
              onClearHistory={handleClearHistory}
            />
          )}

          {/* Analytics & Telemetry View */}
          {activeTab === "analytics" && (
            <AnalyticsView 
              historyList={historyList}
              onUploadClick={handleUploadClick}
            />
          )}

          {/* How It Works Architecture View */}
          {activeTab === "how-it-works" && (
            <HowItWorksView onTryScanner={handleUploadClick} />
          )}


        </main>

        {/* Global Forensic Certificate Modal */}
        {showReportModal && currentData && (
          <ReportModal
            currentData={currentData}
            onClose={() => setShowReportModal(false)}
          />
        )}

        {/* Platform Footer */}
        <footer className="border-t border-[#b1ada1]/30 py-6 px-4 sm:px-8 text-center text-xs font-mono text-[#767167] bg-white/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[#c15f3c] font-bold">◉ VeriLens RL</span>
              <span>— AI Image Detection</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>ISO/IEC 27037 Compliant</span>
              <span>•</span>
              <span>MDP-S6 + 2D-FFT + PRNU</span>
              <span>•</span>
              <span className="text-[#c15f3c] font-semibold">Deep-Q / PPO Agent Active</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
