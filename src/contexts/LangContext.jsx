import { createContext, useContext, useState, useEffect } from 'react';
import { useContent } from './ContentContext';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const { langSettings } = useContent();
  const idEnabled = langSettings?.id_enabled === true;
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (!idEnabled && lang !== 'en') {
      setLang('en');
      return;
    }
    document.documentElement.lang = lang;
  }, [lang, idEnabled]);

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
