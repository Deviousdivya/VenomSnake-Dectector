import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { DiagnosisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DIAGNOSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    venomType: { type: Type.STRING, enum: ['NEUROTOXIC', 'HEMOTOXIC', 'CYTOTOXIC', 'UNKNOWN'] },
    confidence: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    physicianNotes: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    severity: { type: Type.STRING, enum: ['MILD', 'MODERATE', 'CRITICAL'] }
  },
  required: ['venomType', 'confidence', 'summary', 'physicianNotes', 'severity']
};

export async function analyzeSymptoms(
  biteLocation: string, 
  symptoms: string[], 
  languageName: string = "English"
): Promise<DiagnosisResult> {
  const result = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          {
            text: `CLINICAL SYNDROMIC ANALYSIS (Real-time): 
            A patient has presented with a snakebite at the ${biteLocation}. 
            Observed clinical manifestations: ${symptoms.join(", ")}.
            
            Perform a rigorous syndromic differential diagnosis based on WHO snakebite management guidelines. 
            Identify if the venom is:
            1. Neurotoxic (Elapids like Cobra, Krait)
            2. Hemotoxic (Vipers like Russell's, Saw-scaled)
            3. Cytotoxic/Necrotoxic (Vipers/Cobras causing tissue decay)
            4. Myotoxic (Sea snakes/some vipers)
            
            Categorize the likely venom type, assign a confidence percentage, provide a physician-level clinical summary, and list 4-6 critical physician notes for immediate treatment (e.g., airway management, clotting tests, specific antivenom requirements). 
            
            Output Language: ${languageName}. 
            The summary and notes must be professionally translated.
            Return results in JSON format matching the schema.`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: DIAGNOSIS_SCHEMA,
    }
  });

  const text = result.text;
  if (!text) throw new Error("Failed to get diagnosis from Gemini");
  
  return JSON.parse(text) as DiagnosisResult;
}
