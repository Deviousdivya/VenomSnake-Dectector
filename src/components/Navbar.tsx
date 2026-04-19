import { useState } from 'react';
import { Shield, Newspaper, AlertCircle, Menu, X, Zap, ChevronDown, Globe, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { languages, LanguageCode } from '../locales/translations';

interface NavItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
        active 
          ? "bg-brand-safe/20 text-brand-safe border border-brand-safe/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
          : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export function Navbar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, languageName, t } = useLanguage();

  const tabs = [
    { id: 'home', label: t('nav_home'), icon: Shield },
    { id: 'scan', label: t('nav_scan'), icon: Zap },
    { id: 'bite-logic', label: t('nav_bite_logic'), icon: Activity },
    { id: 'news', label: t('nav_news'), icon: Newspaper },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6 flex flex-col items-center gap-4 pointer-events-none">
      <div className="glass px-2 py-2 rounded-full flex items-center gap-1 pointer-events-auto max-md:hidden">
        <div className="flex items-center gap-2 px-4 mr-4">
          <Zap className="text-brand-safe fill-brand-safe animate-pulse" size={24} />
          <span className="font-bold tracking-tighter text-lg uppercase">VenomSnake</span>
        </div>
        {tabs.map((tab) => (
          <NavItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}

        <div className="h-6 w-[1px] bg-white/10 mx-2" />

        <div className="relative">
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Globe size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{languageName}</span>
            <ChevronDown size={14} className={cn("transition-transform", langOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-12 right-0 w-48 glass rounded-2xl p-2 border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all",
                        language === lang.code ? "bg-brand-safe/20 text-brand-safe" : "hover:bg-white/5 text-white/60 hover:text-white"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex justify-between items-center w-full px-4 pointer-events-auto">
         <div className="flex items-center gap-2">
          <Zap className="text-brand-safe" size={24} />
          <span className="font-bold tracking-tighter text-lg uppercase">VenomSnake</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLangOpen(!langOpen)} className="p-2 glass rounded-full">
            <Globe size={20} />
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 glass rounded-full">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Lang Panel */}
      <AnimatePresence>
        {langOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 right-4 left-4 glass rounded-3xl p-6 md:hidden pointer-events-auto z-50 grid grid-cols-2 gap-2"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as LanguageCode);
                  setLangOpen(false);
                }}
                className={cn(
                  "px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center transition-all",
                  language === lang.code ? "bg-brand-safe text-[#0a0a0a]" : "bg-white/5 text-white/40"
                )}
              >
                {lang.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isOpen && !langOpen) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="absolute top-20 left-4 right-4 glass rounded-3xl p-6 md:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all",
                    activeTab === tab.id ? "bg-brand-safe/20 text-brand-safe" : "bg-white/5"
                  )}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
