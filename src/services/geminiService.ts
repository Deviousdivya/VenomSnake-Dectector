import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { DetectionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const DETECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    commonName: { type: Type.STRING },
    scientificName: { type: Type.STRING },
    riskLevel: { type: Type.STRING, enum: ['VENOMOUS', 'NON-VENOMOUS', 'UNKNOWN'] },
    description: { type: Type.STRING },
    precautions: { type: Type.ARRAY, items: { type: Type.STRING } },
    emergencySteps: { type: Type.ARRAY, items: { type: Type.STRING } },
    antidoteInfo: { type: Type.STRING },
    rescueContacts: { type: Type.ARRAY, items: { type: Type.STRING } },
    medicalFacility: { type: Type.STRING }
  },
  required: ['commonName', 'scientificName', 'riskLevel', 'description', 'precautions', 'emergencySteps', 'antidoteInfo', 'rescueContacts', 'medicalFacility']
};

// Fingerprint of the WHOLE image. (The cache key used to be only the first 100 characters of the data, which for a
// JPEG is just the file header - identical for every photo - so a second scan returned the first snake's result.)
function hashString(s: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 5381;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619);
    h2 = (Math.imul(h2, 33) + c) | 0;
  }
  return `${(h1 >>> 0).toString(36)}${(h2 >>> 0).toString(36)}${s.length.toString(36)}`;
}

export async function detectSnake(base64Image: string, mimeType: string, languageName: string = "English", userLocation?: string): Promise<DetectionResult> {
  // 1. Performance Check: Client-side Caching
  const dataOnly = base64Image.split(',')[1] || base64Image;
  const cacheKey = `detect_${hashString(dataOnly)}_${languageName}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    console.log("[Cache Hit] Serving cached bio-scan data.");
    return JSON.parse(cached);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured.");
    throw new Error("Identification is temporarily unavailable. Please try again later.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{
        parts: [
          { text: `Identify snake species in ${languageName}. 
          If VENOMOUS, provide:
          1. Specific anti-venom/antidote name.
          2. Local snake rescue team contact (if location known: ${userLocation || 'Unknown'}).
          3. Best hospital for snakebite treatment nearby.
          Return ONLY JSON conforming to the provided schema.` },
          { inlineData: { data: dataOnly, mimeType: mimeType || 'image/jpeg' } }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: DETECTION_SCHEMA as any,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      }
    });

    if (!response.text) throw new Error("No result came back. Please try again with a clearer photo.");
    const result = JSON.parse(response.text);
    
    // Save to cache for fast recurring answers
    localStorage.setItem(cacheKey, JSON.stringify(result));
    
    return result;
  } catch (error: any) {
    console.error('AI Detection Error:', error);
    let userMessage = "We couldn't complete the identification. Check your connection and try again.";
    if (error.message?.includes("expired") || error.message?.includes("API key")) {
      // details stay in the console - visitors only see a neutral message
      console.error("Gemini API key is expired or invalid - renew GEMINI_API_KEY.");
      userMessage = "Identification is temporarily unavailable. Please try again later.";
    }
    throw new Error(userMessage);
  }
}
