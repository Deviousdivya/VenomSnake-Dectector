/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronDown, Zap, ShieldCheck, Globe, Info, Instagram, Twitter, Linkedin, WifiOff, Database, AlertTriangle, RefreshCcw } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { ThreeSnake } from './components/ThreeSnake';
import { DetectionZone } from './components/DetectionZone';
import { EmergencySOS } from './components/EmergencySOS';
import { NewsSection } from './components/NewsSection';
import { BiteLogic } from './components/BiteLogic';
import { ConnectionProvider, useConnection } from './context/ConnectionContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { cn } from './lib/utils';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("System Failure Detected:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6 glass p-10 rounded-[2.5rem] border border-red-500/30">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold uppercase tracking-tighter">Bio-Core Fault</h1>
              <p className="text-white/40 text-sm italic">The neural network encountered a critical interruption.</p>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2 underline decoration-red-500/30">Error Signature:</p>
              <p className="text-[11px] font-mono text-white/60 line-clamp-3 leading-relaxed">
                {this.state.error?.message || "Unknown cryptographic failure at origin."}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCcw size={16} />
              Attempt Node Re-Synchronization
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const { isOffline, lowDataMode, setLowDataMode } = useConnection();
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();

  // Parallax transforms for Hero
  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const subtitleY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  const btnY = useTransform(scrollYProgress, [0, 0.4], [0, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="min-h-screen selection:bg-brand-safe selection:text-[#0a0a0a]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <EmergencySOS />

      {/* Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[40] w-[calc(100%-2rem)] max-w-lg bg-brand-danger px-6 py-2 rounded-full flex items-center justify-center gap-3 shadow-2xl"
          >
            <WifiOff size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Satellite Link Offline — Using Cached Data</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.section
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative min-h-screen flex flex-col items-center justify-center pt-20"
            >
              {/* 3D Background - Disabled in Low Data Mode */}
              {!lowDataMode && (
                <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                  <Canvas dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#10b981" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#ef4444" />
                    <Suspense fallback={null}>
                      <ThreeSnake />
                      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                    </Suspense>
                  </Canvas>
                </div>
              )}

              {/* Hero Content */}
              <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
                <motion.div
                  style={{ y: titleY, opacity }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-safe/10 border border-brand-safe/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-brand-safe mb-4">
                    <span className="w-2 h-2 rounded-full bg-brand-safe animate-pulse" />
                    Deep Learning Core Secured
                  </div>
                  
                  <div className="relative">
                    <h1 className="text-[14vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] md:leading-[0.8] uppercase italic select-none">
                      {t('hero_title_1')}<br /> 
                      <span className="text-transparent stroke-text">{t('hero_title_2')}</span><br /> 
                      {t('hero_title_3')}
                    </h1>
                  </div>

                  <motion.p 
                    style={{ y: subtitleY }}
                    className="text-base md:text-2xl text-white/30 max-w-2xl md:max-w-3xl mx-auto font-medium px-4"
                  >
                    {t('hero_subtitle')}
                  </motion.p>
                </motion.div>

                <motion.div
                  style={{ y: btnY, opacity }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16"
                >
                  <button 
                    onClick={() => setActiveTab('scan')}
                    className="group relative px-10 py-5 bg-brand-safe text-[#0a0a0a] rounded-2xl font-black text-xl uppercase tracking-tighter flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_30px_60px_-15px_rgba(16,185,129,0.5)]"
                  >
                    {t('btn_start_scan')}
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button 
                     onClick={() => setActiveTab('news')}
                    className="px-10 py-5 glass text-white rounded-2xl font-black text-xl uppercase tracking-tighter border-white/5 hover:bg-white/10 transition-all"
                  >
                    {t('btn_access_intel')}
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Analyze Environment</span>
                  <ChevronDown className="text-white/20 animate-bounce" />
                </motion.div>
              </div>

              {/* Bento Features Preview */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-32 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 glass p-10 rounded-[2.5rem] border border-white/5 flex flex-col justify-between h-[300px]">
                  <div className="w-12 h-12 rounded-2xl bg-brand-safe/10 flex items-center justify-center text-brand-safe">
                    <Zap size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{t('feature_latency_title')}</h3>
                    <p className="text-white/40 text-sm">{t('feature_latency_desc')}</p>
                  </div>
                </div>
                <div className="glass p-10 rounded-[2.5rem] border border-white/5 flex flex-col justify-between h-[300px]">
                  <div className="w-12 h-12 rounded-2xl bg-brand-danger/10 flex items-center justify-center text-brand-danger">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{t('feature_sos_title')}</h3>
                    <p className="text-white/40 text-sm">{t('feature_sos_desc')}</p>
                  </div>
                </div>
                <div className="glass p-10 rounded-[2.5rem] border border-white/5 flex flex-col justify-between h-[300px]">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{t('feature_global_title')}</h3>
                    <p className="text-white/40 text-sm">{t('feature_global_desc')}</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'scan' && (
            <motion.section
              key="scan"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <DetectionZone />
            </motion.section>
          )}

          {activeTab === 'bite-logic' && (
            <motion.section
              key="bite-logic"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <BiteLogic />
            </motion.section>
          )}

          {activeTab === 'news' && (
            <motion.section
              key="news"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
            >
              <NewsSection />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-4 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Zap className="text-brand-safe fill-brand-safe" size={28} />
              <span className="font-extrabold tracking-tighter text-2xl uppercase">VenomSnake</span>
            </div>
            <p className="text-white/40 text-sm max-w-md leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex items-center gap-4">
               <a href="#" className="p-3 glass rounded-xl text-white/40 hover:text-brand-safe hover:border-brand-safe/30 transition-all"><Instagram size={20} /></a>
               <a href="#" className="p-3 glass rounded-xl text-white/40 hover:text-brand-safe hover:border-brand-safe/30 transition-all"><Twitter size={20} /></a>
               <a href="#" className="p-3 glass rounded-xl text-white/40 hover:text-brand-safe hover:border-brand-safe/30 transition-all"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-[11px] text-white/40">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-brand-safe transition-colors">Surface Protocols</button></li>
              <li><button onClick={() => setActiveTab('scan')} className="hover:text-brand-safe transition-colors">Bio-Scan Node</button></li>
              <li><button onClick={() => setActiveTab('bite-logic')} className="hover:text-brand-safe transition-colors">{t('nav_bite_logic')}</button></li>
              <li><button onClick={() => setActiveTab('news')} className="hover:text-brand-safe transition-colors">Intelligence Logs</button></li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-brand-danger/10 border border-brand-danger/20 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-brand-danger">
                <Info size={18} />
                <span className="font-bold text-xs uppercase tracking-widest">{t('disclaimer_title')}</span>
              </div>
              <p className="text-[10px] leading-relaxed text-white/40 italic">
                {t('disclaimer_body')}
              </p>
            </div>
            
            {/* Connection Toggle */}
            <div className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Database size={16} className={lowDataMode ? "text-brand-safe" : "text-white/20"} />
                <span className="text-xs font-bold uppercase tracking-widest">Data Saver</span>
              </div>
              <button 
                onClick={() => setLowDataMode(!lowDataMode)}
                className={cn(
                  "w-10 h-5 rounded-full relative transition-all duration-300",
                  lowDataMode ? "bg-brand-safe" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                  lowDataMode ? "left-6" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-20 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5 mt-20 opacity-40">
           <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 Biometric Tech Systems. All Nodes Synchronized.</p>
           <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy Encryption</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Operations</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ConnectionProvider>
          <AppContent />
        </ConnectionProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
