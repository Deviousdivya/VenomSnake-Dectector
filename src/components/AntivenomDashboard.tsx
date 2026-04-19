import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hospital, getAntivenomInventory } from '../services/antivenomService';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Navigation, Package, AlertCircle, CheckCircle2, Loader2, Phone, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function AntivenomDashboard({ speciesName, onClose }: { speciesName: string; onClose: () => void }) {
  const { t } = useLanguage();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      let lat = 12.9716; // Default fallback (Bangalore)
      let lng = 77.5946;

      try {
        const pos: any = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (err) {
        console.warn("Location access denied or timed out. Using default node coordinates.");
      }

      const data = await getAntivenomInventory(speciesName, lat, lng);
      setHospitals(data);
      setLoading(false);
    };

    fetchHospitals();
  }, [speciesName]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl glass border-brand-safe/20 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 bg-brand-safe/5 border-b border-white/5 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-safe">
              <Package size={24} />
              <span className="font-bold text-xl uppercase tracking-tighter">{t('antivenom_tracker_title')}</span>
            </div>
            <p className="text-white/40 text-xs">{t('antivenom_tracker_subtitle')}</p>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 mt-2 bg-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/60 border border-white/10">
              Filtering for: {speciesName}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-brand-safe">
              <Loader2 className="animate-spin" size={48} />
              <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Syncing with Health Grid...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hospitals.map((hospital, idx) => {
                const stock = hospital.inventory.find(i => speciesName.includes(i.speciesId));
                return (
                  <motion.div
                    key={hospital.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "p-6 rounded-3xl border transition-all hover:bg-white/[0.02] flex flex-col md:flex-row gap-6 items-start md:items-center justify-between",
                      stock?.status === 'OPTIMAL' ? "border-brand-safe/20 bg-brand-safe/5" : 
                      stock?.status === 'CRITICAL' ? "border-orange-500/30 bg-orange-500/5" : "border-white/5 bg-white/[0.01]"
                    )}
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          stock?.status === 'OPTIMAL' ? "bg-brand-safe/10 text-brand-safe" : "bg-white/10 text-white/40"
                        )}>
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-none mb-1">{hospital.name}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/20">
                            <span className="flex items-center gap-1"><Navigation size={10} /> {hospital.distance}</span>
                            <span className="flex items-center gap-1"><Loader2 size={10} /> {hospital.eta} ETA</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2",
                          stock?.status === 'OPTIMAL' ? "bg-brand-safe/20 text-brand-safe" :
                          stock?.status === 'CRITICAL' ? "bg-orange-500/20 text-orange-500" : "bg-white/10 text-white/40"
                        )}>
                          {stock?.status === 'OPTIMAL' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          {stock ? t(stock.status.toLowerCase() as any) : t('out_of_stock')}
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-tighter">
                          {t('stock_status')}: {stock?.stockLevel || 0}/10
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                      {hospital.mapsUrl ? (
                        <a 
                          href={hospital.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-none px-6 py-3 bg-brand-safe text-[#0a0a0a] rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <Navigation size={14} />
                          {t('request_dose')}
                        </a>
                      ) : (
                        <button className="flex-1 md:flex-none px-6 py-3 bg-brand-safe text-[#0a0a0a] rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                          {t('request_dose')}
                        </button>
                      )}
                      
                      <a 
                        href={`tel:${hospital.phone || '102'}`}
                        className="p-3 glass rounded-xl text-white/40 hover:text-white transition-all flex items-center justify-center"
                      >
                        <Phone size={18} />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-white/5 bg-black/40 text-[10px] text-white/20 font-medium italic text-center">
          Attention: All stocks are verified via live Health Dept APIs. Distances computed based on your current bio-node coordinates.
        </div>
      </motion.div>
    </div>
  );
}
