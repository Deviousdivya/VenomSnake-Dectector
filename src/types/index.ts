export type RiskLevel = 'VENOMOUS' | 'NON-VENOMOUS' | 'UNKNOWN';

export interface DetectionResult {
  commonName: string;
  scientificName: string;
  riskLevel: RiskLevel;
  description: string;
  precautions: string[];
  emergencySteps: string[];
  antidoteInfo?: string;
  rescueContacts?: string[];
  medicalFacility?: string;
  /** 0-100: how sure the identifier is about the species shown */
  confidence?: number;
  /** 0-100: how likely it is that this snake is venomous (set when the identification is uncertain) */
  chanceVenomous?: number;
  /** other possibilities, most likely first */
  alternatives?: SnakeAlternative[];
  /** which identifier produced this result */
  source?: 'on-device' | 'gemini' | 'on-device-fallback';
}

export interface SnakeAlternative {
  commonName: string;
  scientificName?: string;
  confidence: number; // 0-100
  venomous: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl?: string;
  url?: string;
}

export interface DiagnosisResult {
  venomType: 'NEUROTOXIC' | 'HEMOTOXIC' | 'CYTOTOXIC' | 'UNKNOWN';
  confidence: number;
  summary: string;
  physicianNotes: string[];
  severity: 'MILD' | 'MODERATE' | 'CRITICAL';
  /** true when this came from the built-in rules because the AI service was unavailable */
  offline?: boolean;
}
