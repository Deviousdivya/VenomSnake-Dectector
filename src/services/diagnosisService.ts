import { generateWithFallback } from "./geminiFallback";
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult } from "../types";
import { localTriage } from "./localTriage";

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
  languageName: string = "English",
  symptomIds: string[] = []
): Promise<DiagnosisResult> {
  // Performance Check: Client-side Caching
  const symptomsKey = symptoms.sort().join('_');
  const cacheKey = `diagnose_${biteLocation}_${symptomsKey}_${languageName}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    console.log("[Cache Hit] Serving cached triage data.");
    return JSON.parse(cached);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured - using built-in guidance.");
    return localTriage(biteLocation, symptomIds, symptoms);
  }

  try {
    const response = await generateWithFallback(ai, {
      model: "gemini-3.1-flash-lite-preview",
      contents: [{
        parts: [{
          text: `EVALUATE SNAKEBITE: Site: ${biteLocation}. Symptoms: ${symptoms.join(", ")}. 
          Return ONLY JSON in ${languageName}. 
          
          CRITICAL INSTRUCTIONS:
          1. 'summary': Write in VERY SIMPLE, non-medical language that any child or layperson can understand. Explain what might be happening simply.
          2. 'physicianNotes': List clear, simple bullet points of what the user should tell a doctor (e.g., 'My arm is swelling fast'). Avoid technical jargon.
          3. venomType: Must be NEUROTOXIC, HEMOTOXIC, CYTOTOXIC, or UNKNOWN.
          4. severity: Must be MILD, MODERATE, or CRITICAL.`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: DIAGNOSIS_SCHEMA as any
      }
    });

    const rawText = response.text || "";
    const result = JSON.parse(rawText);
    
    // Save to cache
    localStorage.setItem(cacheKey, JSON.stringify(result));
    
    return result;
  } catch (error: any) {
    console.error('AI Diagnosis Error:', error);
    // The AI is unavailable (quota used up, key problem or no internet): never leave the person with nothing -
    // fall back to the built-in, cautious guidance.
    console.error("Gemini unavailable - using built-in guidance.", error?.message);
    return localTriage(biteLocation, symptomIds, symptoms);
  }
}
