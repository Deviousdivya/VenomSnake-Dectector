import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleCheck, CircleHelp, Cpu, Flag, HeartPulse, Info, Phone, ShieldAlert, Siren, Syringe, TriangleAlert } from 'lucide-react';
import { DetectionResult } from '../types';
import { Coords } from '../lib/geo';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { HospitalList } from './HospitalList';

interface Props {
  result: DetectionResult;
  coords: Coords | null;
  onCoords: (c: Coords) => void;
}

function Meter({ label, value, tone }: { label: string; value: number; tone: 'brand' | 'danger' }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="tabular-nums font-bold">{v}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}>
        <div className={cn('h-full rounded-full', tone === 'danger' ? 'bg-danger-600' : 'bg-brand-600')} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

function CallButtons() {
  const { t } = useLanguage();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <a href="tel:108" className="btn btn-danger">
        <Phone size={18} aria-hidden /> {t('call_ambulance')}
      </a>
      <a href="tel:112" className="btn btn-outline-danger">
        <Siren size={18} aria-hidden /> {t('call_emergency')}
      </a>
    </div>
  );
}

export function SnakeResult({ result, coords, onCoords }: Props) {
  const { t } = useLanguage();
  const venomous = result.riskLevel === 'VENOMOUS';
  const unknown = result.riskLevel === 'UNKNOWN';
  const [report, setReport] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

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

  const headerTone = venomous ? 'bg-danger-50' : unknown ? 'bg-warn-50' : 'bg-brand-50';

  return (
    <section aria-labelledby="result-title" className="card overflow-hidden">
      <div className={cn('flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4 sm:px-8', headerTone)}>
        <span className={cn('badge', venomous ? 'badge-danger' : unknown ? 'badge-warn' : 'badge-safe')}>
          {venomous ? <TriangleAlert size={14} aria-hidden /> : unknown ? <CircleHelp size={14} aria-hidden /> : <CircleCheck size={14} aria-hidden />}
          {venomous ? t('risk_venomous') : unknown ? 'Unknown' : t('risk_non_venomous')}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <Cpu size={13} aria-hidden />
          {result.source === 'on-device' && 'Identified on your device · it can be wrong'}
          {result.source === 'gemini' && 'Identified by cloud AI · it can be wrong'}
          {result.source === 'on-device-fallback' && 'On-device guess · cloud AI unavailable'}
          {!result.source && 'AI-assisted result · it can be wrong'}
        </span>
      </div>

      <div className="card-pad">
        <h2 id="result-title" className="text-3xl sm:text-4xl">
          {result.commonName}
        </h2>
        <p className="mt-1 font-serif text-lg italic text-muted">{result.scientificName}</p>
        <p className="mt-4 leading-relaxed text-ink-2">{result.description}</p>

        {(result.confidence != null || result.chanceVenomous != null) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {result.confidence != null && <Meter label="Species confidence" value={result.confidence} tone="brand" />}
            {result.chanceVenomous != null && <Meter label="Chance it is venomous" value={result.chanceVenomous} tone="danger" />}
          </div>
        )}

        {result.alternatives && result.alternatives.length > 0 && (
          <div className="mt-5">
            <h3 className="font-sans text-sm font-bold tracking-normal">{unknown ? 'It could be' : 'Other possibilities'}</h3>
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

        {venomous && (
          <div className="mt-8 rounded-2xl border border-danger-600/25 bg-danger-50/70 p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-sans text-lg font-bold tracking-normal text-danger-700">
              <Siren size={20} aria-hidden /> If someone has been bitten
            </h3>
            <p className="mb-4 mt-1 text-sm text-ink-2">Call for an ambulance first. Don't wait for symptoms and don't try to catch the snake.</p>
            <CallButtons />

            {(result.antidoteInfo || result.medicalFacility || (result.rescueContacts && result.rescueContacts.length > 0)) && (
              <div className="mt-5 space-y-3 rounded-xl bg-white p-4 text-sm">
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

            <div className="mt-6">
              <HospitalList coords={coords} onCoords={onCoords} autoLoad />
            </div>
          </div>
        )}

        {unknown && (
          <div className="mt-8 rounded-2xl border border-warn-600/30 bg-warn-50 p-5 text-sm text-ink-2">
            <p className="flex items-center gap-2 font-semibold text-warn-600">
              <ShieldAlert size={18} aria-hidden /> We couldn't tell whether this snake is venomous
            </p>
            <p className="mt-2 font-semibold text-ink">
              Do not go near it. It may be venomous or it may be harmless
              {result.chanceVenomous != null && <> — we estimate about a {Math.round(result.chanceVenomous)}% chance that it is venomous</>}, but we are not sure.
            </p>
            <p className="mt-2">
              Treat it as venomous: keep away and, if anyone is bitten, <a className="font-bold text-danger-700" href="tel:108">call 108</a> right away.{' '}
              <Link className="font-semibold text-brand-700 underline" to="/emergency">
                See the first-aid guide and nearby hospitals
              </Link>
              . A clearer photo may give a better result.
            </p>
          </div>
        )}

        {!venomous && !unknown && (
          <p className="mt-8 flex gap-2 rounded-2xl bg-brand-50 p-4 text-sm text-ink-2">
            <CircleCheck size={18} className="mt-0.5 shrink-0 text-brand-700" aria-hidden />
            <span>
              Non-venomous snakes can still bite and cause infection. Don't handle it. If someone is bitten, wash the wound with clean water and
              see a doctor — and if you are unsure of the identification, treat it as venomous and{' '}
              <a className="font-semibold text-danger-700" href="tel:108">call 108</a>.
            </span>
          </p>
        )}

        <div className="mt-8 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
          <div>
            <h3 className="font-sans text-base font-bold tracking-normal">{t('precautions')}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] text-ink-2">
              {result.precautions.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-base font-bold tracking-normal">{t('sos_steps')}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] text-ink-2">
              {result.emergencySteps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
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
    </section>
  );
}
