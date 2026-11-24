import type { GoogleGenAI } from '@google/genai';

// The preview model is sometimes overloaded (503) or rate-limited (429). Try a stable model before giving up.
const FALLBACK_MODEL = 'gemini-2.5-flash';

export async function generateWithFallback(ai: GoogleGenAI, params: any) {
  try {
    return await ai.models.generateContent(params);
  } catch (e: any) {
    const msg = String(e?.message || e);
    const retryable = /503|UNAVAILABLE|overloaded|high demand|429|RESOURCE_EXHAUSTED|quota|404|not found|no longer available/i.test(msg);
    if (!retryable || params.model === FALLBACK_MODEL) throw e;
    console.warn('[gemini] primary model failed, retrying with', FALLBACK_MODEL);
    const config = { ...(params.config || {}) };
    delete config.thinkingConfig; // thinking levels differ between model generations
    return await ai.models.generateContent({ ...params, model: FALLBACK_MODEL, config });
  }
}
