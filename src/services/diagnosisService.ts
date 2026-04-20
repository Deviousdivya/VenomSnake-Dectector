import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { DiagnosisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const DIAGNOSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    venomType: { type: Type.STRING, enum: ['NEUROTOXIC', 'HEMOTOXIC', 'CYTOTOXIC', 'UNKNOWN'] },
    confidence: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    physicianNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
    severity: { type: Type.STRING, enum: ['MILD', 'MODERATE', 'CRITICAL'] }
  },
  required: ['venomType', 'confidence', 'summary', 'physicianNotes', 'severity']
};

export async function analyzeSymptoms(
  biteLocation: string, 
  symptoms: string[], 
  languageName: string = "English"
): Promise<DiagnosisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Bio-Core API Key missing. Please configure GEMINI_API_KEY in environment variables.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{
        parts: [{
          text: `Analyze symptoms for a bite at ${biteLocation}. Symptoms: ${symptoms.join(", ")}. Return JSON in ${languageName}.`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: DIAGNOSIS_SCHEMA,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      }
    });

    if (!response.text) throw new Error("Clinical nodes offline.");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error('AI Diagnosis Error:', error);
    let userMessage = "Triage link failed.";
    if (error.message?.includes("expired") || error.message?.includes("API key")) {
      userMessage = "BIO-CORE CRITICAL: Your API Key has expired or is invalid. Please renew GEMINI_API_KEY in Vercel settings.";
    }
    throw new Error(userMessage);
  }
}
