import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Camera, RefreshCcw, ShieldCheck, Zap, Maximize, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

interface ActivePerceptionProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

export function ActivePerception({ onCapture, onClose }: ActivePerceptionProps) {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [guideText, setGuideText] = useState(t('active_perception_idle'));
  const [isSteady, setIsSteady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error(err);
        setError("Camera access denied. Ensure biometric permissions are granted.");
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!stream) return;

    // Scanline animation
    gsap.to(scanLineRef.current, {
      top: '100%',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Grid pulse
    gsap.to(gridRef.current, {
      opacity: 0.1,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Simulated "Active Perception" Logic
    const interval = setInterval(() => {
      const messages = [
        t('guide_move_back'),
        t('guide_get_head'),
        t('guide_wait_focus'),
        t('perception_ready')
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setGuideText(randomMsg);
      setIsSteady(randomMsg === t('perception_ready'));
    }, 3000);

    return () => clearInterval(interval);
  }, [stream, t]);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(base64);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black flex flex-col items-center justify-center p-4">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="relative w-full max-w-2xl aspect-[3/4] rounded-[2.5rem] bg-zinc-900 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.2)] border-2 border-white/5">
        {/* Live Feed */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover grayscale opacity-60 contrast-125"
        />

        {/* GSAP Overlays */}
        <div ref={gridRef} className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div ref={scanLineRef} className="absolute inset-x-0 top-0 h-[2px] bg-brand-safe shadow-[0_0_20px_#10b981] z-20 pointer-events-none" />

        {/* Bounding Box Corner Frame */}
        <div className="absolute inset-12 border border-brand-safe/20 pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-safe" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-safe" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-safe" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-safe" />
        </div>

        {/* Perception Status Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 glass-dark border-t border-white/10 flex flex-col items-center gap-6">
           <div className="flex flex-col items-center gap-2">
             <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full animate-pulse", isSteady ? "bg-brand-safe" : "bg-brand-danger")} />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Active Bio-Stream</span>
             </div>
             <p className="text-xl font-black text-white text-center tracking-tight leading-none px-4">
               {guideText}
             </p>
           </div>

           <div className="flex items-center gap-4 w-full px-4">
              <button 
                onClick={onClose}
                className="p-5 rounded-full glass border-white/10 text-white/40 hover:text-white transition-all"
              >
                <RefreshCcw size={24} />
              </button>
              
              <button 
                onClick={capture}
                disabled={!isSteady}
                className={cn(
                  "flex-1 py-5 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all",
                  isSteady 
                    ? "bg-brand-safe text-[#0a0a0a] shadow-[0_0_40px_rgba(16,185,129,0.4)] scale-105" 
                    : "bg-white/5 text-white/20"
                )}
              >
                <Camera size={24} />
                {t('btn_capture')}
              </button>

              <div className="p-5 rounded-full glass border-white/10 text-white/40">
                <Maximize size={24} />
              </div>
           </div>
        </div>

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center space-y-6">
            <AlertCircle size={64} className="text-brand-danger" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold uppercase tracking-tighter">System Malfunction</h3>
              <p className="text-white/40 text-sm leading-relaxed">{error}</p>
            </div>
            <button onClick={onClose} className="px-8 py-3 glass rounded-full font-bold">Abort Connection</button>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1">
             <div className="w-12 h-1 bg-brand-safe/20 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-brand-safe" />
             </div>
             <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Satellite</span>
          </div>
          <div className="flex flex-col items-center gap-1">
             <div className="w-12 h-1 bg-brand-safe/20 rounded-full overflow-hidden">
                <div className="w-full h-full bg-brand-safe animate-pulse" />
             </div>
             <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Focus</span>
          </div>
          <div className="flex flex-col items-center gap-1">
             <div className="w-12 h-1 bg-brand-safe/20 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-brand-danger" />
             </div>
             <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Luma</span>
          </div>
        </div>
        <p className="text-[10px] text-white/20 font-medium italic tracking-widest">
           Proprietary Active Perception Technology v4.1 • End-to-End Encryption Enabled
        </p>
      </div>
    </div>
  );
}
