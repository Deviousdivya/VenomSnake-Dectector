import { useEffect, useRef, useState } from 'react';
import { Camera, CircleAlert, X } from 'lucide-react';

interface Props {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

/** Full-screen camera. Replaces the old simulated "Active Perception" screen: it gives real photo tips instead of fake status messages. */
export function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setError('The camera could not be opened. Allow camera access in your browser, or upload a photo instead.');
      }
    })();
    // stop the camera when this screen closes (a ref is used so the cleanup always sees the live stream)
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    onCapture(canvas.toDataURL('image/jpeg', 0.9));
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Camera" className="fixed inset-0 z-[100] flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <p className="text-sm font-semibold">Take a photo of the snake</p>
        <button type="button" onClick={onClose} aria-label="Close camera" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
          <X size={22} />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted onLoadedMetadata={() => setReady(true)} className="h-full w-full object-cover" />
        {!error && (
          <div aria-hidden className="pointer-events-none absolute inset-6 rounded-3xl border-2 border-dashed border-white/60 sm:inset-16" />
        )}
        {error && (
          <div className="absolute inset-0 grid place-items-center bg-black/85 p-8 text-center text-white">
            <div className="max-w-sm space-y-4">
              <CircleAlert size={44} className="mx-auto text-danger-100" aria-hidden />
              <p>{error}</p>
              <button type="button" onClick={onClose} className="btn btn-outline">
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 bg-black px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-white">
        <ul className="mx-auto grid max-w-2xl gap-x-6 gap-y-1 text-sm text-white/80 sm:grid-cols-3">
          <li>• Stay at least 2 metres away</li>
          <li>• Keep the whole snake in the frame</li>
          <li>• Use good light and hold steady</li>
        </ul>
        <button type="button" onClick={capture} disabled={!ready || !!error} className="btn btn-primary mx-auto flex w-full max-w-sm">
          <Camera size={20} aria-hidden /> Take photo
        </button>
      </div>
    </div>
  );
}
