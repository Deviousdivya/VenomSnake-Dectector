import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Camera, CircleAlert, ImagePlus, Info, Loader2, ScanSearch, Siren, Trash2 } from 'lucide-react';
import { Seo } from '../seo/Seo';
import { useLanguage } from '../context/LanguageContext';
import { identifySnake } from '../services/identifyService';
import { preloadEngine } from '../services/localModel';
import { compressImage } from '../utils/imageCompressor';
import { Coords, getCoords, readAsDataURL } from '../lib/geo';
import { DetectionResult } from '../types';
import { cn } from '../lib/utils';
import { CameraCapture } from '../components/CameraCapture';
import { SnakeResult } from '../components/SnakeResult';
import { PageHero } from '../components/PageHero';
import { bigFourPhotos } from '../data/bigFour';

type Phase = 'idle' | 'locating' | 'optimizing' | 'analyzing' | 'cloud';

const phaseText: Record<Exclude<Phase, 'idle'>, string> = {
  locating: 'Checking your location…',
  optimizing: 'Preparing your photo…',
  analyzing: 'Analysing on your device…',
  cloud: 'Double-checking with cloud AI…',
};

export default function Identify() {
  const { t, languageName } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);
  const [modelPct, setModelPct] = useState(0);
  const busy = phase !== 'idle';
  const phaseLabel = phase === 'analyzing' && modelPct > 0 && modelPct < 100 ? `Loading the identifier (first time only) ${modelPct}%` : phaseText[phase as Exclude<Phase, 'idle'>];

  const setPhoto = useCallback((f: File) => {
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(f);
    });
    setFile(f);
    setResult(null);
    setError(null);
  }, []);

  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) setPhoto(files[0]);
    },
    [setPhoto]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
    disabled: busy,
  });

  const removePhoto = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
  };

  const onCameraCapture = async (dataUrl: string) => {
    const blob = await (await fetch(dataUrl)).blob();
    setPhoto(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
  };

  const handleScan = async () => {
    if (!file || busy) return;
    setError(null);
    setResult(null);

    // Location makes the rescue and hospital suggestions relevant, but it must never slow the scan down:
    // ask in the background and use it only if it has arrived by the time it is needed.
    let locationStr = 'Unknown';
    getCoords(8000).then((c) => { setCoords(c); locationStr = `${c.lat}, ${c.lng}`; }).catch(() => {});

    try {
      setPhase('analyzing');
      const res = await identifySnake({
        file,
        getBase64: async () => compressImage(await readAsDataURL(file)),
        languageName,
        get location() { return locationStr; },
        onStage: (s) => setPhase(s === 'cloud' ? 'cloud' : 'analyzing'),
        onModelProgress: (f) => setModelPct(Math.round(f * 100)),
      });
      setResult(res);
      localStorage.setItem(`snake_scan_${Date.now()}`, JSON.stringify(res));
    } catch (e: any) {
      setError(e?.message || 'We could not complete the identification. Please try again.');
    } finally {
      setPhase('idle');
    }
  };

  useEffect(() => {
    const w = window as any;
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => preloadEngine()) : setTimeout(preloadEngine, 800);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  useEffect(() => {
    if (result || error) outRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result, error]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Seo path="/identify" />
      <PageHero eyebrow="AI snake identification" title={t('scan_title')} lead={t('scan_intro')} image={bigFourPhotos.cobra.lg} position={bigFourPhotos.cobra.position} />
      <div className="container-x py-12 sm:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
          {/* Upload */}
          <div className="space-y-5 lg:sticky lg:top-28">
            <div
              {...getRootProps()}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed bg-white p-6 text-center transition',
                isDragActive ? 'border-brand-600 bg-brand-50' : 'border-brand-200',
                preview && 'border-solid border-line'
              )}
            >
              <input {...getInputProps()} aria-label="Upload a photo of the snake" />
              {preview ? (
                <img src={preview} alt="The photo you selected" className={cn('absolute inset-0 h-full w-full object-cover transition duration-500', busy && 'scale-105 brightness-90 saturate-75')} />
              ) : (
                <div className="space-y-4">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-brand-700">
                    <ImagePlus size={30} aria-hidden />
                  </span>
                  <div>
                    <p className="font-serif text-2xl font-semibold">{t('dropzone_title')}</p>
                    <p className="mt-1 text-sm text-muted">{t('dropzone_subtitle')}</p>
                  </div>
                </div>
              )}
              {preview && busy && (
                <div className="absolute inset-0" aria-hidden>
                  <div className="scan-beam" />
                  {['left-4 top-4 border-l-2 border-t-2', 'right-4 top-4 border-r-2 border-t-2', 'left-4 bottom-4 border-b-2 border-l-2', 'right-4 bottom-4 border-b-2 border-r-2'].map((c) => (
                    <span key={c} className={`absolute h-8 w-8 border-gold-300 ${c}`} />
                  ))}
                </div>
              )}
              {isDragActive && (
                <div className="absolute inset-0 grid place-items-center bg-brand-700/85 text-xl font-semibold text-white">Drop the photo here</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={open} disabled={busy} className="btn btn-outline !px-3 whitespace-nowrap">
                <ImagePlus size={18} aria-hidden /> {preview ? 'Change photo' : 'Choose photo'}
              </button>
              <button type="button" onClick={() => setCameraOpen(true)} disabled={busy} className="btn btn-outline !px-3 whitespace-nowrap">
                <Camera size={18} aria-hidden /> {t('btn_camera')}
              </button>
            </div>

            <button type="button" onClick={handleScan} disabled={!file || busy} className="btn btn-primary w-full !py-4 text-base">
              {busy ? (
                <>
                  <Loader2 size={20} className="animate-spin" aria-hidden /> {phaseLabel}
                </>
              ) : (
                <>
                  <ScanSearch size={20} aria-hidden /> {t('btn_analyze')}
                </>
              )}
            </button>

            {preview && !busy && (
              <button type="button" onClick={removePhoto} className="btn btn-ghost btn-sm w-full">
                <Trash2 size={16} aria-hidden /> {t('btn_remove')}
              </button>
            )}

            <ul className="space-y-2 rounded-2xl bg-white p-5 text-sm text-ink-2 ring-1 ring-line">
              <li className="font-semibold text-ink">For the best result</li>
              <li>• Stay at least 2 metres away — never touch the snake.</li>
              <li>• Show the whole body and the head, in good light.</li>
              <li>• Avoid blurry, zoomed-in or very dark photos.</li>
            </ul>
            <p className="flex gap-2 text-xs text-muted">
              <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
              We ask for your location to tailor rescue and hospital suggestions. It is only used for this scan and you can decline.
            </p>
          </div>

          {/* Output */}
          <div ref={outRef} className="min-w-0 scroll-mt-24" aria-live="polite">
            {!result && !error && !busy && (
              <div className="card flex min-h-[320px] flex-col items-center justify-center gap-4 p-10 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-paper text-brand-700 ring-1 ring-line">
                  <ScanSearch size={28} aria-hidden />
                </span>
                <h2 className="text-2xl">Your result will appear here</h2>
                <p className="max-w-sm text-ink-2">Add a photo and press “{t('btn_analyze')}”. You will see the species, whether it is venomous, and what to do.</p>
              </div>
            )}

            {busy && (
              <div className="card flex min-h-[320px] flex-col items-center justify-center gap-6 p-10 text-center" role="status">
                <Loader2 size={44} className="animate-spin text-brand-700" aria-hidden />
                <div>
                  <h2 className="text-2xl">{phaseLabel}</h2>
                  <p className="mt-2 text-ink-2">This usually takes a few seconds.</p>
                </div>
                <div className="h-1.5 w-56 overflow-hidden rounded-full bg-brand-100">
                  <div className="sweep h-full w-1/3 rounded-full bg-brand-600" />
                </div>
              </div>
            )}

            {error && !busy && (
              <div className="card border-warn-600/40 p-8" role="alert">
                <p className="flex items-center gap-2 text-lg font-bold text-warn-600">
                  <CircleAlert size={22} aria-hidden /> We couldn't identify this snake
                </p>
                <p className="mt-3 text-ink-2">{error}</p>
                <div className="mt-6 rounded-2xl border border-danger-600/25 bg-danger-50 p-5">
                  <p className="flex items-center gap-2 font-bold text-danger-700">
                    <Siren size={18} aria-hidden /> Has someone been bitten?
                  </p>
                  <p className="mt-1 text-sm text-ink-2">Don't wait for a result. Call for help now.</p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <a href="tel:108" className="btn btn-danger btn-sm">Call 108</a>
                    <Link to="/emergency" className="btn btn-outline-danger btn-sm">First aid &amp; nearby hospitals</Link>
                  </div>
                </div>
                <button type="button" onClick={handleScan} disabled={!file} className="btn btn-outline btn-sm mt-5">
                  Try again
                </button>
                <div className="mt-6 border-t border-line pt-5 text-sm text-ink-2">
                  <p className="font-bold text-ink">In the meantime</p>
                  <ul className="mt-2 space-y-1.5">
                    <li>• Keep your distance, and treat the snake as venomous.</li>
                    <li>
                      • Compare it with <Link className="font-semibold text-brand-700 underline" to="/big-four">India's Big Four venomous snakes</Link>.
                    </li>
                    <li>
                      • If you were bitten, use the <Link className="font-semibold text-brand-700 underline" to="/symptom-checker">symptom checker</Link>, which still gives basic guidance.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {result && !busy && <SnakeResult result={result} coords={coords} onCoords={setCoords} />}
          </div>
        </div>
      </div>

      {cameraOpen && <CameraCapture onCapture={onCameraCapture} onClose={() => setCameraOpen(false)} />}
    </>
  );
}
