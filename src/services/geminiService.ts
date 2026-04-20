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
    emergencySteps: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['commonName', 'scientificName', 'riskLevel', 'description', 'precautions', 'emergencySteps']
};

export async function detectSnake(base64Image: string, mimeType: string, languageName: string = "English"): Promise<DetectionResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Bio-Core API Key missing. Please configure GEMINI_API_KEY in environment variables.");
  }

  try {
    const dataOnly = base64Image.split(',')[1] || base64Image;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{
        parts: [
          { text: `Identify snake species in ${languageName}. Return JSON.` },
          { inlineData: { data: dataOnly, mimeType: mimeType || 'image/jpeg' } }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: DETECTION_SCHEMA,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      }
    });

    if (!response.text) throw new Error("Bio-scan returned no data.");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error('AI Detection Error:', error);
    let userMessage = "Satellite link unstable. Scan aborted.";
    if (error.message?.includes("expired") || error.message?.includes("API key")) {
      userMessage = "BIO-CORE CRITICAL: Your API Key has expired or is invalid. Please renew GEMINI_API_KEY in Vercel settings.";
    }
    throw new Error(userMessage);
  }
}
