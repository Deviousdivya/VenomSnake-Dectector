import { DiagnosisResult } from '../types';

// Basic, rule-based guidance used when the AI service is unavailable (quota used up, no internet, key problem).
// It is deliberately cautious: every snakebite is treated as urgent, and warning signs only ever raise the urgency.
const NEURO = ['vision', 'breathing', 'muscle']; // signs of nerve poisoning
const BLEED = ['bleeding'];
const LOCAL = ['swelling', 'pain'];

export function localTriage(biteLocation: string, symptomIds: string[], symptomLabels: string[]): DiagnosisResult {
  const has = (group: string[]) => symptomIds.some((s) => group.includes(s));
  const neuro = has(NEURO);
  const bleed = has(BLEED);
  const local = has(LOCAL);

  const critical = neuro || bleed;
  const venomType: DiagnosisResult['venomType'] = neuro ? 'NEUROTOXIC' : bleed ? 'HEMOTOXIC' : local ? 'CYTOTOXIC' : 'UNKNOWN';

  let summary: string;
  if (neuro && bleed) {
    summary = 'You have signs that can come from venom affecting both the nerves and the blood. This is an emergency — get to a hospital immediately.';
  } else if (neuro) {
    summary = 'Blurred vision, weak muscles or trouble breathing can be signs of venom affecting the nerves. Breathing can fail quickly. This is an emergency — get to a hospital immediately.';
  } else if (bleed) {
    summary = 'Bleeding that will not stop can be a sign that venom is affecting the blood. This is an emergency — get to a hospital immediately.';
  } else if (local) {
    summary = 'Swelling and pain around the bite can be a local effect of venom, and can get worse over hours. Some serious bites look mild at first, so please see a doctor urgently.';
  } else {
    summary = 'Even with few symptoms, a snakebite should be checked by a doctor — some serious bites look mild at first.';
  }

  return {
    venomType,
    confidence: 0,
    severity: critical ? 'CRITICAL' : 'MODERATE',
    summary,
    offline: true,
    physicianNotes: [
      `Bitten on: ${biteLocation}`,
      symptomLabels.length ? `Symptoms: ${symptomLabels.join(', ')}` : 'No other symptoms reported yet',
      'Time of the bite: note it down',
      'Snake type: unknown unless you saw it (a photo helps, but is not needed)',
    ],
  };
}
