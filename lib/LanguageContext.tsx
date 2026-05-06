'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './translations';
import type { Language } from '@/types';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('ass_lang') as Language | null;
    if (saved === 'en' || saved === 'ta') setLang(saved);
  }, []);

  const toggleLanguage = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'ta' : 'en';
      localStorage.setItem('ass_lang', next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t: translations[lang] as typeof translations.en }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
