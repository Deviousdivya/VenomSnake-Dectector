import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, CircleCheck, CircleHelp, Cpu, Flag, HeartPulse, Info, Phone, Siren, Syringe, TriangleAlert } from 'lucide-react';
import { DetectionResult } from '../types';
import { Coords } from '../lib/geo';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { speciesPhoto } from '../data/photos';
import { HospitalList } from './HospitalList';

interface Props {
  result: DetectionResult;
  coords: Coords | null;
  onCoords: (c: Coords) => void;
}

/** "High / Medium / Low" is easier to act on than a percentage. */
function howSure(confidence?: number) {
  if (confidence == null) return null;
  if (confidence >= 75) return { label: 'High', width: 90 };
  if (confidence >= 50) return { label: 'Medium', width: 60 };
  return { label: 'Low', width: 30 };
}

/** The first one or two sentences of the description, so the headline answer stays short. */
function shortText(text: string, max = 190) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('। '));
  return stop > 60 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, '') + '…';
}

export function SnakeResult({ result, coords, onCoords }: Props) {
  const { t } = useLanguage();
  const venomous = result.riskLevel === 'VENOMOUS';
  const unknown = result.riskLevel === 'UNKNOWN';
  const [report, setReport] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const photo = speciesPhoto(result.scientificName);
  const sure = howSure(result.confidence);

  const sendSighting = async () => {
    if (!coords) return;
    setReport('sending');
    try {
      const res = await fetch('/api/sightings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ species: result.commonName, location: { lat: coords.lat, lng: coords.lng } }),
      });
      if (!res.ok) throw new Error('failed');
      setReport('sent');
    } catch {
      setReport('error');
    }
  };

  const verdict = venomous
    ? { title: `${t('risk_venomous')} — keep away`, bar: 'bg-danger-600 text-white', icon: TriangleAlert }
    : unknown
      ? { title: 'Not sure — treat it as dangerous', bar: 'bg-[#a35b00] text-white', icon: CircleHelp }
      : { title: `${t('risk_non_venomous')} — still keep your distance`, bar: 'bg-brand-700 text-white', icon: CircleCheck };

  const actions = venomous || unknown
    ? ['Stay at least 2 metres away. Don’t touch, corner or try to catch it.', 'If anyone is bitten, call 108 straight away. Don’t wait for symptoms.', 'Keep children and pets away until it has gone.']
    : ['Don’t handle it, even though it is harmless to most people.', 'If someone is bitten, wash the wound with clean water and see a doctor.', 'If you are unsure, treat it as venomous and call 108.'];

  return (
    <section aria-labelledby="result-title" className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
      {/* 1. the verdict */}
      <div className={cn('flex flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-8', verdict.bar)}>
        <p className="flex items-center gap-3 font-serif text-2xl font-medium sm:text-3xl">
          <verdict.icon size={28} aria-hidden /> {verdict.title}
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs text-white/85">
          <Cpu size={13} aria-hidden />
          {result.source === 'on-device' && 'Checked on your device · it can be wrong'}
          {result.source === 'gemini' && 'Checked by cloud AI · it can be wrong'}
          {result.source === 'on-device-fallback' && 'On-device guess · cloud AI unavailable'}
          {!result.source && 'AI-assisted · it can be wrong'}
        </span>
      </div>

      {/* 2. what it is */}
      <div className={cn('grid', photo && 'md:grid-cols-[0.85fr_1fr]')}>
        {photo && (
          <div className="relative min-h-56 md:min-h-full">
            <img src={photo.src} alt={`A ${result.commonName}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <p className="absolute bottom-2 right-2 max-w-[92%] truncate rounded bg-black/55 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-sm">
              Reference photo: {photo.author} ·{' '}
              <a className="underline" href={photo.page} target="_blank" rel="noopener noreferrer">
                {photo.license}
              </a>
            </p>
          </div>
        )}
        <div className="p-6 sm:p-8">
          <h2 id="result-title" className="text-4xl sm:text-5xl">
            {result.commonName}
          </h2>
          <p className="italic-serif mt-1 text-lg text-muted">{result.scientificName}</p>
          <p className="mt-4 leading-relaxed text-ink-2">{shortText(result.description)}</p>

          {sure && (
            <div className="mt-5 max-w-xs">
              <p className="flex items-baseline justify-between text-sm">
                <span className="font-semibold text-ink">How sure are we?</span>
                <span className="font-semibold">{sure.label}</span>
              </p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line" role="meter" aria-label="How sure" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(result.confidence ?? 0)}>
                <div className="bar-grow h-full rounded-full bg-brand-700" style={{ width: `${sure.width}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. what to do */}
      <div className="border-t border-line bg-paper px-6 py-6 sm:px-8">
        <h3 className="font-sans text-[13px] font-bold uppercase tracking-[0.18em] text-gold-700">What to do now</h3>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {actions.map((a, i) => (
            <li key={a} className="flex gap-3 rounded-2xl bg-surface p-4 text-[15px] leading-snug text-ink-2 ring-1 ring-line">
              <span className="font-serif text-2xl leading-none text-gold-500" aria-hidden>
                {i + 1}
              </span>
              {a}
            </li>
          ))}
        </ol>

        {(venomous || unknown) && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a href="tel:108" className="btn btn-danger">
              <Phone size={18} aria-hidden /> {t('call_ambulance')}
            </a>
            <a href="tel:112" className="btn btn-outline-danger">
              <Siren size={18} aria-hidden /> {t('call_emergency')}
            </a>
          </div>
        )}
        {unknown && (
          <p className="mt-4 text-sm text-ink-2">
            {result.chanceVenomous != null && <>We estimate about a {Math.round(result.chanceVenomous)}% chance it is venomous. </>}A clearer photo may give a better answer.{' '}
            <Link className="font-semibold text-brand-700 underline" to="/emergency">
              First-aid guide
            </Link>
          </p>
        )}
      </div>

      {/* 4. nearest hospitals, only when it matters */}
      {venomous && (
        <div className="border-t border-line px-6 py-6 sm:px-8">
          <h3 className="font-sans text-[13px] font-bold uppercase tracking-[0.18em] text-danger-700">If someone has been bitten: nearest hospitals</h3>
          <div className="mt-4">
            <HospitalList coords={coords} onCoords={onCoords} autoLoad />
          </div>
        </div>
      )}

      {/* 5. everything else, one tap away */}
      <details className="group border-t border-line">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-xl font-medium sm:px-8">
          More details
          <ChevronDown size={20} aria-hidden className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="space-y-8 px-6 pb-8 sm:px-8">
          {result.alternatives && result.alternatives.length > 0 && (
            <div>
              <h4 className="font-sans text-sm font-bold tracking-normal">{unknown ? 'It could be' : 'Other possibilities'}</h4>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
                {result.alternatives.map((a, i) => (
                  <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-paper px-3 py-2 ring-1 ring-line">
                    <span>
                      {a.commonName}
                      {a.scientificName && <em className="ml-1 text-muted">{a.scientificName}</em>}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={cn('badge', a.venomous ? 'badge-danger' : 'badge-safe')}>{a.venomous ? 'Venomous' : 'Harmless'}</span>
                      <span className="tabular-nums text-muted">{Math.round(a.confidence)}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="font-sans text-sm font-bold tracking-normal">{t('precautions')}</h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] text-ink-2">
                {result.precautions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-sans text-sm font-bold tracking-normal">{t('sos_steps')}</h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] text-ink-2">
                {result.emergencySteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {venomous && (result.antidoteInfo || result.medicalFacility || (result.rescueContacts && result.rescueContacts.length > 0)) && (
            <div className="space-y-3 rounded-2xl bg-paper p-5 text-sm ring-1 ring-line">
              <p className="flex items-start gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <Info size={14} className="mt-px shrink-0" aria-hidden /> Suggested by AI — confirm with a doctor or a verified source
              </p>
              {result.antidoteInfo && (
                <p className="flex gap-2">
                  <Syringe size={16} className="mt-0.5 shrink-0 text-brand-700" aria-hidden />
                  <span>
                    <strong>Antivenom:</strong> {result.antidoteInfo}
                  </span>
                </p>
              )}
              {result.medicalFacility && (
                <p className="flex gap-2">
                  <HeartPulse size={16} className="mt-0.5 shrink-0 text-danger-600" aria-hidden />
                  <span>
                    <strong>Treatment facility:</strong> {result.medicalFacility}
                  </span>
                </p>
              )}
              {result.rescueContacts && result.rescueContacts.length > 0 && (
                <div className="flex gap-2">
                  <Phone size={16} className="mt-0.5 shrink-0 text-brand-700" aria-hidden />
                  <div>
                    <strong>Rescue contacts:</strong>
                    <ul className="mt-1 list-disc pl-5 text-ink-2">
                      {result.rescueContacts.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                    <p className="mt-1 text-xs text-muted">AI can get phone numbers wrong — verify a number before relying on it.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <button type="button" onClick={sendSighting} disabled={!coords || report === 'sending' || report === 'sent'} className="btn btn-outline btn-sm">
              <Flag size={16} aria-hidden /> {report === 'sent' ? 'Sighting reported' : 'Report this sighting'}
            </button>
            <p className="text-sm text-muted" aria-live="polite">
              {report === 'sent' && 'Thank you — the sighting was recorded.'}
              {report === 'error' && 'Could not send the report. Please try again.'}
              {report === 'idle' && !coords && 'Allow location access to report where you saw it.'}
            </p>
          </div>
        </div>
      </details>
    </section>
  );
}
