/**
 * Python FastAPI Backend Integration Service
 * Endpoints:
 *   - GET  /api/health
 *   - POST /api/predict
 *
 * Robust error handling and timeout recovery with fallback to
 * authentic HTML5 canvas client forensics when backend is offline.
 * All fields synchronized with ResultCard, FinalVerdict, and ConfidenceChart.
 */

import { generateForensicsForFile, analyzeImageClientSide } from "../data/forensicSamples";

// By default, use relative /api paths.
// In unified fullstack mode (FastAPI serving dist) and Vite dev mode (via proxy), relative paths work directly.
// If relative fetch fails (e.g. standalone Vite preview without proxy), we fall back to http://127.0.0.1:8000.
let activeBaseUrl = "";
const REQUEST_TIMEOUT_MS = 35000;
const RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1500;

/**
 * Checks if the Python FastAPI backend is online.
 * @returns {Promise<{isOnline: boolean, details: any}>}
 */
export async function checkBackendHealth() {
  // 1. Try relative endpoint first (works for unified FastAPI server & Vite proxy)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${activeBaseUrl}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json();
      return { isOnline: true, details: data };
    }
  } catch {
    // 2. Relative fetch failed: if we aren't already on port 8000, attempt direct connection to FastAPI
    if (activeBaseUrl === "" && typeof window !== "undefined" && window.location.port !== "8000") {
      try {
        const directController = new AbortController();
        const directTimeout = setTimeout(() => directController.abort(), 2500);

        const directRes = await fetch("http://127.0.0.1:8000/api/health", { signal: directController.signal });
        clearTimeout(directTimeout);

        if (directRes && directRes.ok) {
          activeBaseUrl = "http://127.0.0.1:8000";
          const data = await directRes.json();
          return { isOnline: true, details: data };
        }
      } catch {
        // Backend offline
      }
    }
  }
  return { isOnline: false, details: null };
}

/**
 * Sleep utility for retry delay.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Performs a fetch request with timeout and retry logic.
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} retries
 * @returns {Promise<Response|null>}
 */
async function fetchWithRetry(url, options, retries = RETRY_ATTEMPTS) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        return res;
      }
      console.warn(`Fetch attempt ${attempt + 1} returned status ${res.status}.`);
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`Fetch attempt ${attempt + 1} failed: ${err.message}`);
    }

    if (attempt < retries - 1) {
      await sleep(RETRY_DELAY_MS * (attempt + 1));
    }
  }
  return null;
}

/**
 * Normalizes backend response fields to match frontend component expectations.
 * Ensures all fields required by ResultCard, FinalVerdict, and ConfidenceChart
 * are present and correctly typed.
 * 
 * @param {any} raw - Raw response from FastAPI backend
 * @param {string} objectUrl
 * @param {{ width: number, height: number }} dimensions
 * @returns {Promise<any>} Normalized result object
 */
async function normalizeBackendResponse(raw, objectUrl, dimensions) {
  const normalized = {
    ...raw,
    id: raw.id || `scan-${Date.now()}`,
    filename: raw.filename || "unknown",
    fileSize: raw.fileSize || "0.00 MB",
    dimensions: raw.dimensions || `${dimensions.width} × ${dimensions.height}`,
    format: raw.format || "JPEG",
    colorSpace: raw.colorSpace || "sRGB",
    hashMD5: raw.hashMD5 || "",
    sha256: raw.sha256 || "",
    sourceTag: raw.sourceTag || "Unknown",
    cameraModel: raw.cameraModel || "None",
    dateAnalyzed: raw.dateAnalyzed || new Date().toISOString(),
    imageUrl: objectUrl,
    modelUsed: raw.modelUsed || "Multi-Signal Forensic Engine",
    verdict: raw.verdict || "INCONCLUSIVE FORENSIC ANALYSIS",
    isAIGenerated: raw.isAIGenerated ?? false,
    confidence: raw.confidence || 0,
    realConfidence: raw.realConfidence ?? 0,
    syntheticConfidence: raw.syntheticConfidence ?? 0,
    uncertainConfidence: raw.uncertainConfidence ?? 0,
    confidenceTier: raw.confidenceTier || "INCONCLUSIVE / SUSPICIOUS",
    statusBadge: raw.statusBadge || "INCONCLUSIVE / SUSPICIOUS",
    riskLevel: raw.riskLevel || "MEDIUM",
    engine: raw.engine || "AI Image Detector Multi-Signal Forensics Engine",
    primaryFindings: raw.primaryFindings || [],
    supportingFindings: raw.supportingFindings || [],
    evidence: raw.evidence || {},
    metrics: raw.metrics || {},
    explainableAI: raw.explainableAI || {},
    highImpactRegions: raw.highImpactRegions || [],
    heatmapHotspots: raw.heatmapHotspots || [],
    rlVerification: raw.rlVerification || {},
    cropConsistency: raw.cropConsistency || {},
    backendConnected: true,
    clientMetrics: raw.clientMetrics || {},
  };

  return normalized;
}

/**
 * Sends an image to the Python FastAPI backend for neural & CV forensic analysis.
 * Falls back gracefully to authentic HTML5 canvas client forensics if backend is offline.
 * All returned fields are synchronized with ResultCard, FinalVerdict, and ConfidenceChart.
 * 
 * @param {File} file
 * @param {string} objectUrl
 * @param {{ width: number, height: number }} dimensions
 * @param {(status: string) => void} onStatusUpdate
 * @returns {Promise<any>} Normalized forensic result object
 */
export async function analyzeImageWithPython(
  file,
  objectUrl,
  dimensions = { width: 1920, height: 1080 },
  onStatusUpdate = () => {}
) {
  const formData = new FormData();
  formData.append("file", file);

  onStatusUpdate("[PYTHON-BACKEND] Uploading tensor to FastAPI server (Port 8000)...");

  let responseData = null;

  try {
    onStatusUpdate("[PYTHON-BACKEND] Attempting neural inference via FastAPI...");
    const res = await fetchWithRetry(`${activeBaseUrl}/api/predict`, { method: "POST", body: formData });
    if (!res) {
      console.warn("[AI-Detector] /api/predict returned no response after retries.");
    } else {
      responseData = await res.json();
    }

    if (responseData) {
      onStatusUpdate(
        `[PYTHON-BACKEND] Inference completed: ${responseData.modelUsed} (${responseData.confidenceTier})`
      );
    } else {
      console.warn("Python backend returned no data. Falling back to authentic client engine.");
      onStatusUpdate("[PYTHON-BACKEND] No response — switching to Standalone Client Forensics...");
    }
  } catch (err) {
    console.warn("Python backend unreachable after retries. Falling back to authentic client engine.", err);
    onStatusUpdate("[PYTHON-BACKEND] Backend offline — switching to Standalone Client Forensics...");
  }

  if (responseData) {
    // Normalize fields for frontend component compatibility
    const normalized = await normalizeBackendResponse(responseData, objectUrl, dimensions);
    return normalized;
  }

  // Graceful fallback: execute genuine HTML5 canvas and binary header inspection
  const clientAnalysis = await analyzeImageClientSide(file, objectUrl, dimensions);
  const fallbackData = generateForensicsForFile(file, objectUrl, dimensions, null, clientAnalysis);
  return {
    ...fallbackData,
    backendConnected: false,
    modelUsed: fallbackData.modelUsed || "AI Image Detector Client Forensics (Canvas & Header Inspection)",
    riskLevel: fallbackData.riskLevel || "LOW",
  };
}
