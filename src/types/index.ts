export type RiskLevel = 'VENOMOUS' | 'NON-VENOMOUS' | 'UNKNOWN';

export interface DetectionResult {
  commonName: string;
  scientificName: string;
  riskLevel: RiskLevel;
  description: string;
  precautions: string[];
  emergencySteps: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
}

export interface DiagnosisResult {
  venomType: 'NEUROTOXIC' | 'HEMOTOXIC' | 'CYTOTOXIC' | 'UNKNOWN';
  confidence: number;
  summary: string;
  physicianNotes: string[];
  severity: 'MILD' | 'MODERATE' | 'CRITICAL';
}
