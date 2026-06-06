import { createContext, useContext, useState, useEffect } from 'react';
import { readData } from '../utils/storage';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const settings = readData('ph_lang_settings') || {};
  const idEnabled = settings.id_enabled === true;
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function toggle() {
    if (!idEnabled) return;
    setLang(l => l === 'en' ? 'id' : 'en');
  }

  return (
    <LangContext.Provider value={{ lang, toggle, idEnabled }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function T({ en, id }) {
  const { lang } = useLang();
  return lang === 'id' && id ? id : en;
}
