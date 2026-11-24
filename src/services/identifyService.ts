// The identification ladder:
//   1. On-device model (free, private, no quota). Accepted only when it is confident AND the answer is clear-cut.
//   2. Gemini (cloud) for everything the on-device model is unsure about: blurry, dark, unfamiliar or ambiguous photos.
//   3. If Gemini is unavailable (quota, network), show an honest "not sure - keep away" result built from the
//      on-device guess, with the chance that the snake is venomous.
import { DetectionResult, SnakeAlternative } from '../types';
import { BITE_STEPS, GENERIC_PRECAUTIONS, KbSpecies, SPECIES_KB } from '../data/speciesKb';
import { classifyLocally, LocalPrediction } from './localModel';
import { detectSnake } from './geminiService';

// Chosen on held-out photos (see docs/identification-model-evaluation.md).
export const GATE = {
  minConfidence: 0.7, // top species probability
  minMaxLogit: 14, // base model must recognise a snake at all (filters non-snakes / unclear photos)
  venomousAbove: 0.5, // P(dangerous species) needed to call it VENOMOUS on-device
  harmlessBelow: 0.05, // P(dangerous species) must be below this to call it NON-VENOMOUS on-device
};
const LOAD_TIMEOUT_MS = 60_000;

export type Stage = 'on-device' | 'cloud';

export interface IdentifyOptions {
  file: Blob;
  getBase64: () => Promise<string>;
  languageName: string;
  location: string;
  onStage?: (s: Stage) => void;
  onModelProgress?: (fraction: number) => void;
}

const pct = (x: number) => Math.round(x * 100);

function alternativesFrom(pred: LocalPrediction, skip = 0): SnakeAlternative[] {
  return pred.top.slice(skip).map((c) => {
    const kb = SPECIES_KB[c.key];
    return { commonName: kb?.name ?? c.key.replace('_', ' '), scientificName: kb?.scientific, confidence: pct(c.prob), venomous: !!kb?.venomous };
  });
}

function fromKb(kb: KbSpecies, pred: LocalPrediction): DetectionResult {
  const venomous = kb.venomous;
  return {
    commonName: kb.name,
    scientificName: kb.scientific,
    riskLevel: venomous ? 'VENOMOUS' : 'NON-VENOMOUS',
    description: kb.blurb,
    precautions: GENERIC_PRECAUTIONS,
    emergencySteps: venomous ? BITE_STEPS : ['If bitten, wash the wound with clean water and see a doctor; call 108 if you are unsure the snake is harmless.'],
    antidoteInfo: venomous ? kb.antivenom : undefined,
    rescueContacts: [],
    confidence: pct(pred.confidence),
    chanceVenomous: pct(pred.pDanger),
    alternatives: alternativesFrom(pred, 1),
    source: 'on-device',
  };
}

/** Honest result for "we cannot tell": keep away, and show how likely it is to be venomous. */
function uncertain(pred: LocalPrediction): DetectionResult {
  const alts = alternativesFrom(pred);
  const lead = alts[0];
  return {
    commonName: 'Not sure — treat it as venomous',
    scientificName: lead ? `Best guess: ${lead.commonName} (${lead.confidence}%)` : 'Species unclear',
    riskLevel: 'UNKNOWN',
    description: 'The photo is not clear enough for a reliable identification. It could be a venomous snake or a harmless one — we cannot tell, so keep your distance.',
    precautions: GENERIC_PRECAUTIONS,
    emergencySteps: BITE_STEPS,
    rescueContacts: [],
    confidence: lead?.confidence,
    chanceVenomous: pct(pred.pDanger),
    alternatives: alts,
    source: 'on-device-fallback',
  };
}

function cautious(g: DetectionResult, pred: LocalPrediction | null): DetectionResult {
  const out = { ...g };
  if (pred && out.chanceVenomous == null) out.chanceVenomous = pct(pred.pDanger);
  if (pred && (!out.alternatives || out.alternatives.length === 0)) out.alternatives = alternativesFrom(pred);
  // A "harmless" answer the AI itself is not sure about must not reassure anyone.
  if (out.riskLevel === 'NON-VENOMOUS' && (out.confidence ?? 0) < 60) {
    out.riskLevel = 'UNKNOWN';
    out.chanceVenomous = Math.max(out.chanceVenomous ?? 0, pred ? pct(pred.pDanger) : 30);
  }
  return out;
}

export function decideLocally(pred: LocalPrediction): DetectionResult | null {
  if (pred.confidence < GATE.minConfidence || pred.maxLogit < GATE.minMaxLogit) return null;
  const kb = SPECIES_KB[pred.top[0].key];
  if (!kb) return null;
  if (kb.venomous && pred.pDanger >= GATE.venomousAbove) return fromKb(kb, pred);
  if (!kb.venomous && pred.pDanger < GATE.harmlessBelow) return fromKb(kb, pred);
  return null;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

export async function identifySnake(o: IdentifyOptions): Promise<DetectionResult> {
  let pred: LocalPrediction | null = null;
  const saveData = (navigator as any).connection?.saveData === true;

  if (!saveData) {
    try {
      o.onStage?.('on-device');
      pred = await withTimeout(classifyLocally(o.file, o.onModelProgress), LOAD_TIMEOUT_MS);
      const sure = decideLocally(pred);
      if (sure) return sure;
    } catch (e) {
      console.warn('[identify] on-device model unavailable, using cloud', e);
    }
  }

  o.onStage?.('cloud');
  try {
    const g = await detectSnake(await o.getBase64(), 'image/jpeg', o.languageName, o.location);
    return cautious(g, pred);
  } catch (e) {
    if (pred) return uncertain(pred); // cloud failed but the on-device guess still helps
    throw e;
  }
}
