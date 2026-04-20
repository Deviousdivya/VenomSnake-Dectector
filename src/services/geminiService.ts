import { GoogleGenAI, Type } from "@google/genai";
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
      model: "gemini-flash-latest",
      contents: [{
        parts: [
          { text: `FAST IDENTIFY: Provide snake species data for the attached image in ${languageName}. Be concise. Return JSON matching schema.` },
          { inlineData: { data: dataOnly, mimeType: mimeType || 'image/jpeg' } }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: DETECTION_SCHEMA,
      }
    });

    if (!response.text) throw new Error("Bio-scan returned no data.");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error('AI Detection Error:', error);
    throw new Error(error.message || "Satellite link unstable. Scan aborted.");
  }
}
