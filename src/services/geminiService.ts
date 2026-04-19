import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { DetectionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DETECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    commonName: { type: Type.STRING },
    scientificName: { type: Type.STRING },
    riskLevel: { type: Type.STRING, enum: ['VENOMOUS', 'NON-VENOMOUS', 'UNKNOWN'] },
    description: { type: Type.STRING },
    precautions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    emergencySteps: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    }
  },
  required: ['commonName', 'scientificName', 'riskLevel', 'description', 'precautions', 'emergencySteps']
};

export async function detectSnake(base64Image: string, mimeType: string, languageName: string = "English"): Promise<DetectionResult> {
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `FAST IDENTIFY: Provide snake species data for the attached image in ${languageName}. Be extremely concise. Focus on high-accuracy risk level assessment. All fields including description and steps must be in ${languageName} script. Return JSON matching schema.`
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: DETECTION_SCHEMA,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW
      }
    }
  });

  const text = result.text;
  if (!text) throw new Error("Failed to get response from Gemini");
  
  return JSON.parse(text) as DetectionResult;
}
