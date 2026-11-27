import credits from './photoCredits.json';

export interface PhotoCredit {
  src: string;
  author: string;
  license: string;
  page: string;
}

const table = credits as Record<string, PhotoCredit>;

/** A real, openly licensed reference photograph of a species, looked up by its scientific name (null if we have none). */
export function speciesPhoto(scientific?: string): PhotoCredit | null {
  if (!scientific) return null;
  return table[scientific.trim()] ?? null;
}
