/**
 * HuggingFace Inference API integration
 * Model: umm-maybe/AI-image-detector
 * Labels: "human" (authentic) | "artificial" (AI-generated)
 */

const HF_MODEL_ID = "umm-maybe/AI-image-detector";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL_ID}`;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 8000; // HF cold-start can take ~20s, retry after 8s

/**
 * Calls the HuggingFace Inference API with the given image file.
 * @param {File} file - The image File object to analyse.
 * @param {string} apiToken - A valid HuggingFace API token (hf_...).
 * @param {function} onStatusUpdate - Optional callback(string) for live status messages.
 * @returns {Promise<{isSynthetic: boolean, syntheticScore: number, authenticScore: number, rawLabel: string, rawScore: number, modelUsed: string}>}
 */
export async function runDeepfakeDetection(file, apiToken, onStatusUpdate = () => {}) {
  if (!apiToken || !apiToken.startsWith("hf_")) {
    throw new Error("NO_TOKEN");
  }

  // Convert File to ArrayBuffer for raw binary POST
  const arrayBuffer = await file.arrayBuffer();

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt === 1) {
        onStatusUpdate(`[HF API] Querying ${HF_MODEL_ID}...`);
      } else {
        onStatusUpdate(`[HF API] Model warming up — retry ${attempt}/${MAX_RETRIES}...`);
        await sleep(RETRY_DELAY_MS);
      }

      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": file.type || "image/jpeg",
          "x-wait-for-model": "true", // Ask HF to wait for cold-start instead of 503
        },
        body: arrayBuffer,
      });

      if (response.status === 503) {
        // Model is loading — wait and retry
        onStatusUpdate("[HF API] Model loading on HF servers, please wait...");
        lastError = new Error("MODEL_LOADING");
        continue;
      }

      if (response.status === 401) {
        throw new Error("INVALID_TOKEN");
      }

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HF_API_ERROR:${response.status}:${text.slice(0, 120)}`);
      }

      /** @type {Array<{label: string, score: number}>} */
      const results = await response.json();

      if (!Array.isArray(results) || results.length === 0) {
        throw new Error("UNEXPECTED_RESPONSE");
      }

      // Find AI and Real scores
      const deepfakeEntry = results.find((r) => r.label?.toLowerCase().includes("artificial"))
        ?? results.find((r) => r.label?.toLowerCase().includes("deepfake"))
        ?? results.find((r) => r.label?.toLowerCase().includes("fake"))
        ?? results.find((r) => r.label?.toLowerCase().includes("ai"))
        ?? results[0];

      const realEntry = results.find((r) => r.label?.toLowerCase().includes("human"))
        ?? results.find((r) => r.label?.toLowerCase().includes("realism"))
        ?? results.find((r) => r.label?.toLowerCase().includes("real"))
        ?? results.find((r) => r.label !== deepfakeEntry?.label)
        ?? results[1];

      const rawDeepfakeScore = deepfakeEntry?.score ?? 0;
      const rawRealScore = realEntry?.score ?? (1 - rawDeepfakeScore);

      // Convert to 0-100 integer percentages
      const syntheticScore = Math.round(rawDeepfakeScore * 100);
      const authenticScore = Math.round(rawRealScore * 100);
      const isSynthetic = syntheticScore > authenticScore;

      onStatusUpdate(
        `[HF API] Inference complete → ${deepfakeEntry?.label}: ${syntheticScore}% | ${realEntry?.label ?? "Realism"}: ${authenticScore}%`
      );

      return {
        isSynthetic,
        syntheticScore,
        authenticScore,
        rawLabel: deepfakeEntry?.label ?? "Deepfake",
        rawScore: rawDeepfakeScore,
        modelUsed: HF_MODEL_ID,
        allLabels: results,
      };
    } catch (err) {
      lastError = err;
      if (err.message === "INVALID_TOKEN" || err.message === "NO_TOKEN") {
        throw err; // Don't retry auth errors
      }
      if (attempt === MAX_RETRIES) break;
      onStatusUpdate(`[HF API] Retrying (${err.message})...`);
    }
  }

  throw lastError ?? new Error("HF_API_FAILED");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
