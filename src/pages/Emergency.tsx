import { useState } from 'react';
import { ExternalLink, HeartPulse, Loader2, MapPin, Phone, Share2, ShieldCheck, Siren, X } from 'lucide-react';
import { Seo } from '../seo/Seo';
import { HospitalList } from '../components/HospitalList';
import { useLanguage } from '../context/LanguageContext';
import { Coords, getCoords, mapsPinUrl } from '../lib/geo';
import { cn } from '../lib/utils';

const donts = [
  'Cut the bite or try to suck out the venom.',
  'Tie a tight tourniquet.',
  'Apply ice, heat, herbs or traditional remedies.',
  'Try to catch or kill the snake.',
  'Drink alcohol or take medicine nobody prescribed.',
  'Wait for symptoms to appear before asking for help.',
];

type Note = { kind: 'ok' | 'err'; text: string } | null;

export default function Emergency() {
  const { t } = useLanguage();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [busy, setBusy] = useState<'share' | 'rescue' | null>(null);
  const [note, setNote] = useState<Note>(null);

  const steps = [
    { title: t('emergency_protocol_1'), desc: t('emergency_protocol_1_desc') },
    { title: t('emergency_protocol_2'), desc: t('emergency_protocol_2_desc') },
    { title: t('emergency_protocol_3'), desc: t('emergency_protocol_3_desc') },
    { title: t('emergency_protocol_4'), desc: t('emergency_protocol_4_desc') },
  ];

  // Copies an SOS message with a map link and opens the share sheet (or SMS where sharing is not available).
  const shareLocation = async () => {
    setBusy('share');
    setNote(null);
    try {
      const c = await getCoords();
      setCoords(c);
      const url = mapsPinUrl(c);
      const text = `EMERGENCY SOS: I have been bitten by a snake. My location: ${url}`;
      let copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        /* clipboard may be blocked - sharing still works */
      }
      if (navigator.share) {
        try {
          await navigator.share({ title: 'VenomSnake Emergency SOS', text, url });
        } catch (e: any) {
          if (e?.name !== 'AbortError') throw e;
        }
      } else {
        window.location.href = `sms:?body=${encodeURIComponent(text)}`;
      }
      setNote({ kind: 'ok', text: copied ? 'SOS message with your location is copied — paste it into any chat or SMS.' : 'Your location message is ready to send.' });
    } catch (e: any) {
      setNote({ kind: 'err', text: e?.message || 'Could not get your location.' });
    } finally {
      setBusy(null);
    }
  };

  const requestRescue = async () => {
    setBusy('rescue');
    setNote(null);
    try {
      const c = await getCoords();
      setCoords(c);
      const text = `SNAKE RESCUE NEEDED: A snake has been spotted at this location: ${mapsPinUrl(c)}. Please send a trained handler.`;
      window.location.href = `sms:?body=${encodeURIComponent(text)}`;
      setNote({ kind: 'ok', text: 'Your messaging app should open with your location. Send it to your local rescue team or forest department.' });
    } catch (e: any) {
      setNote({ kind: 'err', text: e?.message || 'Your location is needed so rescuers can find you.' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Seo path="/emergency" />

      <section className="bg-danger-600 text-white">
        <div className="container-x py-12 sm:py-16">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/85">
            <Siren size={16} aria-hidden /> Snakebite emergency
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl !text-white sm:text-6xl">{t('emergency_headline')}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">{t('emergency_lead')}</p>
          <div className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-2">
            <a href="tel:108" className="btn pulse-ring !min-h-14 bg-white text-lg text-danger-700 hover:bg-danger-50">
              <Phone size={20} aria-hidden /> {t('call_ambulance')}
            </a>
            <a href="tel:112" className="btn !min-h-14 border-2 border-white/70 text-lg text-white hover:bg-white/10">
              <Siren size={20} aria-hidden /> {t('call_emergency')}
            </a>
          </div>
          <p className="mt-5 max-w-2xl text-sm text-white/85">
            108 is the free ambulance service in most Indian states, and 112 is the national emergency number. Ambulance crews can often take you to the nearest hospital that
            treats snakebite.
          </p>
        </div>
      </section>

      <div className="container-x grid items-start gap-10 py-12 sm:py-16 lg:grid-cols-2">
        {/* What to do */}
        <div className="space-y-10">
          <section aria-labelledby="steps-title">
            <h2 id="steps-title" className="text-3xl">{t('emergency_protocol')}</h2>
            <ol className="mt-6 space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="card flex gap-4 p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-700 font-bold text-white" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-lg font-bold tracking-normal">{s.title}</h3>
                    <p className="mt-1 text-[15px] text-ink-2">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="dont-title" className="rounded-2xl border border-danger-600/25 bg-danger-50 p-6 sm:p-8">
            <h2 id="dont-title" className="text-2xl text-danger-700">Do not</h2>
            <ul className="mt-4 space-y-3">
              {donts.map((d) => (
                <li key={d} className="flex gap-3 text-[15px] text-ink-2">
                  <X size={18} className="mt-0.5 shrink-0 text-danger-600" aria-hidden /> {d}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">Most of these methods don't work, can cause harm, and waste time you need to reach treatment.</p>
          </section>
        </div>

        {/* Get help */}
        <div className="space-y-10">
          <section aria-labelledby="loc-title" className="card card-pad">
            <h2 id="loc-title" className="text-2xl">Send your location</h2>
            <p className="mt-2 text-[15px] text-ink-2">Share where you are with family, a neighbour or a rescue team in one tap.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={shareLocation} disabled={busy !== null} className="btn btn-primary">
                {busy === 'share' ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Share2 size={18} aria-hidden />} {t('share_location')}
              </button>
              <button type="button" onClick={requestRescue} disabled={busy !== null} className="btn btn-outline">
                {busy === 'rescue' ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <HeartPulse size={18} aria-hidden />} {t('send_rescue')}
              </button>
            </div>
            <p
              aria-live="polite"
              className={cn('mt-4 flex items-start gap-2 text-sm', note?.kind === 'err' ? 'text-danger-700' : 'text-brand-800', !note && 'hidden')}
            >
              {note?.kind === 'ok' && <ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden />}
              {note?.text}
            </p>
            <p className="mt-4 text-sm text-muted">
              There is no single national snake-rescue number. Your state forest department or a local rescue group can send a trained handler — search{' '}
              <a
                className="inline-flex items-center gap-1 font-semibold text-brand-700 underline underline-offset-2"
                href="https://www.google.com/maps/search/snake+rescue+near+me"
                target="_blank"
                rel="noopener noreferrer"
              >
                snake rescue near me <ExternalLink size={13} aria-hidden />
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="hosp-title" className="card card-pad">
            <h2 id="hosp-title" className="sr-only">Hospitals near you</h2>
            <HospitalList coords={coords} onCoords={setCoords} />
            <p className="mt-5 flex items-start gap-2 rounded-xl bg-paper p-3 text-sm text-ink-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand-700" aria-hidden />
              Your location stays on your device except for this search: only your coordinates are sent to our server, which asks OpenStreetMap's map service for nearby hospitals. They are not stored.
            </p>
          </section>

          <section aria-labelledby="src-title" className="text-sm text-muted">
            <h2 id="src-title" className="font-sans text-sm font-bold uppercase tracking-wider text-ink">Sources</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a className="font-medium text-brand-700 underline" href="https://www.who.int/news-room/fact-sheets/detail/snakebite-envenoming" target="_blank" rel="noopener noreferrer">
                  WHO — Snakebite envenoming (fact sheet)
                </a>
              </li>
              <li>
                <a
                  className="font-medium text-brand-700 underline"
                  href="https://ncdc.mohfw.gov.in/uploads/pdf/Standard-Treatment-Guidelines-for-Management-of-Snake-Bite.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  India — Standard Treatment Guidelines for Management of Snake Bite (NCDC)
                </a>
              </li>
            </ul>
            <p className="mt-3">General information, not medical advice. Always follow the instructions of the emergency operator and doctors.</p>
          </section>
        </div>
      </div>
    </>
  );
}
