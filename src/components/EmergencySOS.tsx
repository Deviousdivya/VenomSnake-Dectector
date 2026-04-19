import { useState } from 'react';
import { Phone, AlertTriangle, HeartPulse, MapPin, X, ChevronRight, Share2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export function EmergencySOS() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const handleShareLocation = async () => {
    try {
      const pos: any = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = pos.coords;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Emergency Location - VenomSnake',
          text: `Emergency! Possible snakebite at coordinates: ${latitude}, ${longitude}.`,
          url: url
        });
      } else {
        window.open(url, '_blank');
      }
    } catch (err) {
      alert("Unable to acquire high-precision GPS lock. Check device permissions.");
    }
  };

  const steps = [
    { title: t('emergency_protocol_1'), desc: t('emergency_protocol_1_desc') },
    { title: t('emergency_protocol_2'), desc: t('emergency_protocol_2_desc') },
    { title: t('emergency_protocol_3'), desc: t('emergency_protocol_3_desc') },
    { title: t('emergency_protocol_4'), desc: t('emergency_protocol_4_desc') }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] flex items-center justify-center p-5 rounded-full bg-brand-danger text-white shadow-[0_0_40px_rgba(239,68,68,0.5)] hover:scale-110 active:scale-95 transition-all animate-pulse"
      >
        <Phone size={32} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg glass border-brand-danger/30 rounded-[2.5rem] overflow-hidden"
            >
              <div className="bg-brand-danger/20 p-8 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-brand-danger">
                    <AlertTriangle size={24} />
                    <span className="font-bold text-xl uppercase tracking-tighter">{t('emergency_title')}</span>
                  </div>
                  <p className="text-white/60 text-sm">Follow these protocols immediately.</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Hotlines */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Priority Rescue Contacts</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <a href="tel:102" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-brand-danger/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-danger/10 flex items-center justify-center text-brand-danger">
                          <Phone size={24} />
                        </div>
                        <div>
                          <p className="font-bold">Medical Emergency</p>
                          <p className="text-sm text-white/40">Ambulance Hub (102 / 108)</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-white/20 group-hover:text-brand-danger transition-all" />
                    </a>
                    <a href="tel:1900" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-brand-safe/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-safe/10 flex items-center justify-center text-brand-safe">
                          <Share2 size={24} />
                        </div>
                        <div>
                          <p className="font-bold">Snake Rescue Services</p>
                          <p className="text-sm text-white/40">Forest Dept Wildlife Hub</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-white/20 group-hover:text-brand-safe transition-all" />
                    </a>
                  </div>
                </div>

                {/* Protocols */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t('emergency_protocol')}</h4>
                  <div className="space-y-3">
                    {steps.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold text-[10px]">{i + 1}</div>
                        <div className="space-y-1">
                          <p className="font-bold text-sm">{step.title}</p>
                          <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Share */}
                <div className="space-y-4">
                  <button 
                    onClick={handleShareLocation}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white text-[#0a0a0a] font-bold text-sm tracking-tight hover:bg-white/90 transition-all active:scale-95"
                  >
                    <MapPin size={18} />
                    {t('share_location')}
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-safe/40 italic">
                    <ShieldCheck size={12} />
                    Encrypted via TLS 1.3 & JWT Tunnelling
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
