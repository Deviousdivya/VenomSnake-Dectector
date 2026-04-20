import { GoogleGenAI, Type } from "@google/genai";
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
      model: "gemini-3.1-pro-preview",
      contents: [{
        parts: [{
          text: `CLINICAL SYNDROMIC ANALYSIS: Bite at ${biteLocation}. Symptoms: ${symptoms.join(", ")}. Return JSON matching schema in ${languageName}.`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: DIAGNOSIS_SCHEMA,
      }
    });

    if (!response.text) throw new Error("Clinical nodes offline.");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error('AI Diagnosis Error:', error);
    throw new Error(error.message || "Triage link failed.");
  }
}
