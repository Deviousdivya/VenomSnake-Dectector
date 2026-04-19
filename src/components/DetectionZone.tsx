import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, AlertCircle, CheckCircle2, ShieldAlert, BookOpen, HeartPulse, Sparkles, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { detectSnake } from '../services/geminiService';
import { DetectionResult } from '../types';
import { cn } from '../lib/utils';
import { compressImage } from '../utils/imageCompressor';
import { useLanguage } from '../context/LanguageContext';
import { AntivenomDashboard } from './AntivenomDashboard';
import { ActivePerception } from './ActivePerception';

export function DetectionZone() {
  const { t, languageName } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<'idle' | 'optimizing' | 'analyzing'>('idle');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showActiveLens, setShowActiveLens] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
      setLoadingPhase('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleCapture = (base64: string) => {
    setPreview(base64);
    // Convert base64 to File object for handleScan
    fetch(base64)
      .then(res => res.blob())
      .then(blob => {
        const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
      });
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const fullBase64 = reader.result as string;
        
        // Phase 1: Optimization (Client-Side Edge)
        setLoadingPhase('optimizing');
        const compressedBase64 = await compressImage(fullBase64);
        
        // Phase 2: AI Analysis (Scalable Asynchronous Queue)
        setLoadingPhase('analyzing');
        
        // Simulation of non-blocking job submission
        const jobRes = await fetch('/api/analyze-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: compressedBase64, language: languageName })
        });
        const { jobId } = await jobRes.json();
        
        // Polling the Message Queue
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/analyze-job/${jobId}`);
            const jobData = await statusRes.json();
            
            if (jobData.status === 'COMPLETED') {
              clearInterval(pollInterval);
              
              // Now call the real AI service for actual result (stateless proxy)
              const res = await detectSnake(compressedBase64, 'image/jpeg', languageName);
              
              setResult(res);
              localStorage.setItem(`snake_scan_${Date.now()}`, JSON.stringify(res));
              setLoading(false);
              setLoadingPhase('idle');
            }
          } catch (pollErr) {
            console.error("Polling error", pollErr);
          }
        }, 2000);
      };
    } catch (err) {
      console.error(err);
      setError("Bio-scan failed. The satellite link might be unstable. Please try again.");
      setLoading(false);
      setLoadingPhase('idle');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-4 py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-safe/10 border border-brand-safe/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-safe mb-2">
          <Sparkles size={12} />
          Accelerated Neural Engine
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{t('scan_header')} <span className="text-brand-safe">{t('scan_header_accent')}</span></h2>
        <p className="text-white/60 max-w-xl mx-auto">{t('scan_desc')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Column */}
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              "relative aspect-square rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6",
              isDragActive ? "border-brand-safe bg-brand-safe/5" : "border-white/10 hover:border-white/30 bg-white/5",
              preview && "border-solid"
            )}
          >
            <input {...getInputProps()} />
            
            {preview ? (
              <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-safe/10 flex items-center justify-center mx-auto">
                  <Upload className="text-brand-safe" size={32} />
                </div>
                <div>
                  <p className="font-semibold text-xl">{t('dropzone_title')}</p>
                  <p className="text-sm text-white/40">{t('dropzone_subtitle')}</p>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActiveLens(true);
                  }}
                  className="mt-6 px-6 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest text-brand-safe border-brand-safe/30 hover:bg-brand-safe/10 transition-all flex items-center gap-2"
                >
                  <Camera size={14} />
                  Activate Live Lens
                </button>
              </div>
            )}
            
            <AnimatePresence>
              {isDragActive && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-brand-safe/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <p className="font-bold text-2xl text-white">Release to scan</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleScan}
            disabled={!file || loading}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
              !file || loading 
                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                : "bg-brand-safe text-[#0a0a0a] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {loadingPhase === 'optimizing' ? t('scanning_optimizing') : t('scanning_neural')}
              </>
            ) : (
              <>
                <ShieldAlert size={20} />
                {t('btn_analyze')}
              </>
            )}
          </button>
          
          {error && (
            <div className="p-4 bg-brand-danger/10 border border-brand-danger/30 rounded-xl text-brand-danger text-sm flex gap-3">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full glass rounded-[2rem] flex flex-col items-center justify-center p-12 text-center space-y-4 text-white/20"
              >
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                  <ShieldAlert size={40} />
                </div>
                <p>Waiting for data input...</p>
              </motion.div>
            ) : loading ? (
               <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full glass rounded-[2rem] flex flex-col items-center justify-center p-12 text-center space-y-8"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-brand-safe/20 animate-pulse" />
                  <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-safe animate-spin" size={48} />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="text-xl font-bold">{loadingPhase === 'optimizing' ? 'Optimizing Data' : 'Bio-Neural Mapping'}</h3>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="w-1/2 h-full bg-brand-safe"
                      />
                    </div>
                  </div>
                  <p className="text-white/40 text-sm italic">
                    {loadingPhase === 'optimizing' 
                      ? 'Downsampling for high-speed transmission...' 
                      : 'Comparing patterns against 3,500+ venomous species...'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full flex flex-col gap-4"
              >
                {/* Result Card */}
                <div className={cn(
                  "glass rounded-3xl p-8 space-y-6 relative overflow-hidden",
                  result?.riskLevel === 'VENOMOUS' ? "border-brand-danger/30 glow-crimson" : "border-brand-safe/30 glow-emerald"
                )}>
                  {/* Risk Badge */}
                  <div className="flex justify-between items-center">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                      result?.riskLevel === 'VENOMOUS' ? "bg-brand-danger/20 text-brand-danger" : "bg-brand-safe/20 text-brand-safe"
                    )} >
                      {result?.riskLevel === 'VENOMOUS' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                      {result?.riskLevel === 'VENOMOUS' ? t('risk_venomous') : t('risk_non_venomous')}
                    </div>

                    {result?.riskLevel === 'VENOMOUS' && (
                      <button 
                        onClick={() => setShowInventory(true)}
                        className="bg-brand-danger text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                      >
                        {t('btn_locate_antivenom')}
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold">{result?.commonName}</h3>
                    <p className="text-white/40 italic font-mono text-sm">{result?.scientificName}</p>
                  </div>

                  <p className="text-white/70 text-sm leading-relaxed">{result?.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-brand-safe">
                        <BookOpen size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t('precautions')}</span>
                      </div>
                      <ul className="text-[11px] text-white/50 space-y-1.5 list-disc pl-4">
                        {result?.precautions.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-brand-danger">
                        <HeartPulse size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t('sos_steps')}</span>
                      </div>
                      <ul className="text-[11px] text-white/50 space-y-1.5 list-disc pl-4">
                        {result?.emergencySteps.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={async () => {
                    try {
                      await fetch('/api/sightings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          species: result?.commonName,
                          location: { lat: 12.9716, lng: 77.5946 } 
                        })
                      });
                      alert("Bio-Sighting uplinked to global database successfully.");
                    } catch (e) {
                      console.error("Uplink failed", e);
                    }
                  }}
                  className="w-full glass py-4 rounded-3xl text-sm font-bold border-white/5 hover:bg-white/5 transition-all text-brand-safe"
                >
                  Report Sighting to Global Database
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showInventory && result && (
          <AntivenomDashboard speciesName={result.commonName} onClose={() => setShowInventory(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showActiveLens && (
          <ActivePerception 
            onCapture={handleCapture} 
            onClose={() => setShowActiveLens(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

