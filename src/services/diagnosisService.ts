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
      model: "gemini-3.1-flash-lite-preview",
      contents: [{
        parts: [{
          text: `EVALUATE BITE: Site: ${biteLocation}. Symptoms: ${symptoms.join(", ")}. Return ONLY JSON matching schema in ${languageName}. 
          venomType must be one of: NEUROTOXIC, HEMOTOXIC, CYTOTOXIC, UNKNOWN.
          severity must be one of: MILD, MODERATE, CRITICAL.`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: DIAGNOSIS_SCHEMA
      }
    });

    const rawText = response.text || "";
    
    // Robust cleanup to handle markdown wrapping or other noise
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : rawText;

    if (!cleanJson) {
      throw new Error("Bio-Core nodes returned empty syndromic data.");
    }

    try {
      const data = JSON.parse(cleanJson);
      
      // Strict field validation to prevent downstream crashes
      if (!data.venomType || !data.severity || !data.summary || !Array.isArray(data.physicianNotes)) {
        throw new Error("Incomplete report data. Please re-run scan.");
      }

      return data as DiagnosisResult;
    } catch (parseError) {
      console.error("Diagnosis Parse Failure:", cleanJson);
      throw new Error("Triage data corruption. Bio-scanners need alignment.");
    }
  } catch (error: any) {
    console.error('AI Diagnosis Error:', error);
    let userMessage = error.message || "Triage link failed.";
    if (error.message?.includes("expired") || error.message?.includes("API key")) {
      userMessage = "BIO-CORE CRITICAL: Your API Key has expired or is invalid. Please renew GEMINI_API_KEY in Vercel settings.";
    }
    throw new Error(userMessage);
  }
}
