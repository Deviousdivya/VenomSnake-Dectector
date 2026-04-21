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

export async function detectSnake(base64Image: string, mimeType: string, languageName: string = "English", userLocation?: string): Promise<DetectionResult> {
  // 1. Performance Check: Client-side Caching
  const dataOnly = base64Image.split(',')[1] || base64Image;
  const cacheKey = `detect_${dataOnly.slice(0, 100)}_${languageName}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    console.log("[Cache Hit] Serving cached bio-scan data.");
    return JSON.parse(cached);
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Bio-Core API Key missing. Please configure GEMINI_API_KEY in environment variables.");
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

    if (!response.text) throw new Error("Bio-scan returned no data.");
    const result = JSON.parse(response.text);
    
    // Save to cache for fast recurring answers
    localStorage.setItem(cacheKey, JSON.stringify(result));
    
    return result;
  } catch (error: any) {
    console.error('AI Detection Error:', error);
    let userMessage = "Satellite link unstable. Scan aborted.";
    if (error.message?.includes("expired") || error.message?.includes("API key")) {
      userMessage = "BIO-CORE CRITICAL: Your API Key has expired or is invalid. Please renew GEMINI_API_KEY in settings.";
    }
    throw new Error(userMessage);
  }
}
