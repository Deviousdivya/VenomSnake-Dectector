import { useEffect, useState } from 'react';
import { Clock, ExternalLink, Hospital, Loader2, MapPin, Navigation, Phone } from 'lucide-react';
import { findNearbyHospitals, mapsSearchUrl, NearbyHospital } from '../services/hospitalService';
import { Coords, getCoords } from '../lib/geo';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  coords: Coords | null;
  onCoords: (c: Coords) => void;
  /** Look hospitals up as soon as a location is known (used right after a venomous result). */
  autoLoad?: boolean;
}

/** Real hospitals near the user, nearest first. Data: OpenStreetMap. Works even if the AI service is down. */
export function HospitalList({ coords, onCoords, autoLoad = false }: Props) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'locating' | 'loading' | 'done' | 'error'>('idle');
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = async (c: Coords) => {
    setStatus('loading');
    setMessage(null);
    try {
      setHospitals(await findNearbyHospitals(c.lat, c.lng));
      setStatus('done');
    } catch {
      setStatus('error');
      setMessage('We could not load nearby hospitals right now.');
    }
  };

  useEffect(() => {
    if (autoLoad && coords && status === 'idle') void load(coords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, coords]);

  const start = async () => {
    setMessage(null);
    if (coords) return load(coords);
    setStatus('locating');
    try {
      const c = await getCoords();
      onCoords(c);
      await load(c);
    } catch (e: any) {
      setStatus('error');
      setMessage(e.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-sans text-base font-bold tracking-normal">
          <Hospital size={18} className="text-brand-700" aria-hidden /> {t('nearby_hospitals')}
        </h3>
        {status !== 'loading' && status !== 'locating' && (
          <button type="button" onClick={start} className="btn btn-primary btn-sm">
            <MapPin size={16} aria-hidden /> {status === 'done' ? 'Refresh' : t('find_hospitals')}
          </button>
        )}
      </div>

      <div aria-live="polite" className="mt-4">
        {(status === 'locating' || status === 'loading') && (
          <div className="space-y-3" role="status">
            <p className="flex items-center gap-2 text-sm text-muted">
              <Loader2 size={16} className="animate-spin" aria-hidden />
              {status === 'locating' ? 'Getting your location…' : 'Looking for hospitals near you…'}
            </p>
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[76px] animate-pulse rounded-xl bg-line/60" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-xl border border-warn-600/30 bg-warn-50 p-4 text-sm text-ink-2">
            <p>{message}</p>
            <a
              className="mt-2 inline-flex items-center gap-1.5 font-semibold text-brand-700 underline underline-offset-2"
              href={coords ? mapsSearchUrl(coords.lat, coords.lng) : 'https://www.google.com/maps/search/hospital+near+me'}
              target="_blank"
              rel="noopener noreferrer"
            >
              Search hospitals on Google Maps <ExternalLink size={14} aria-hidden />
            </a>
          </div>
        )}

        {status === 'done' && hospitals.length === 0 && (
          <p className="rounded-xl bg-paper p-4 text-sm text-ink-2">
            No hospitals were found in the map data for your area. Call 108 or search on{' '}
            <a
              className="font-semibold text-brand-700 underline"
              href={coords ? mapsSearchUrl(coords.lat, coords.lng) : 'https://www.google.com/maps/search/hospital+near+me'}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Maps
            </a>
            .
          </p>
        )}

        {status === 'done' && hospitals.length > 0 && (
          <ol className="space-y-3">
            {hospitals.map((h, i) => (
              <li key={h.id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="flex items-start gap-2 font-semibold text-ink">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                        {i + 1}
                      </span>
                      <span className="break-words">{h.name}</span>
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                      <span className="font-semibold text-ink-2">{h.distanceKm < 10 ? h.distanceKm.toFixed(1) : Math.round(h.distanceKm)} km away</span>
                      {h.address && <span>{h.address}</span>}
                    </p>
                    <p className="mt-2 flex flex-wrap gap-2">
                      {h.government && <span className="badge badge-safe">Government</span>}
                      {h.emergency && (
                        <span className="badge badge-neutral">
                          <Clock size={12} aria-hidden /> Emergency dept.
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <a
                      href={h.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      aria-label={`Directions to ${h.name}`}
                    >
                      <Navigation size={15} aria-hidden /> Directions
                    </a>
                    {h.phone && (
                      <a href={`tel:${h.phone.split(/[;,]/)[0].replace(/\s+/g, '')}`} className="btn btn-outline btn-sm" aria-label={`Call ${h.name}`}>
                        <Phone size={15} aria-hidden /> Call
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Distances are in a straight line. Hospital details come from OpenStreetMap and may be incomplete. Antivenom stock is not
        shown — call ahead to confirm, or call <a className="font-semibold text-danger-700" href="tel:108">108</a>.
      </p>
    </div>
  );
}
