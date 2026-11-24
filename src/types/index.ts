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
