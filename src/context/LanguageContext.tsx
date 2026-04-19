import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LanguageCode } from '../locales/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof translations['en']) => string;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('language') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: keyof typeof translations['en']): string => {
    const langDict = translations[language] || translations['en'];
    // Fallback if key missing in target language
    return (langDict as any)[key] || translations['en'][key] || key;
  };

  const languageNames: Record<LanguageCode, string> = {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    te: 'Telugu',
    mr: 'Marathi',
    ta: 'Tamil',
    gu: 'Gujarati',
    kn: 'Kannada',
    ml: 'Malayalam'
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageName: languageNames[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
