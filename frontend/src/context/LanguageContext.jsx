import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations, languages } from '../i18n/translations.js';

const LANG_KEY = 'auto-ecole-lang-v1';
const LanguageContext = createContext(null);

const getByPath = (obj, path) => path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

const interpolate = (str, vars) => {
  if (!vars) return str;
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), str);
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      return window.localStorage.getItem(LANG_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    window.localStorage.setItem(LANG_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
  }, [lang, dir]);

  const t = useCallback(
    (key, vars) => {
      const value = getByPath(translations[lang], key) ?? getByPath(translations.en, key);
      if (typeof value !== 'string') return key;
      return interpolate(value, vars);
    },
    [lang]
  );

  const toggleLanguage = useCallback(() => setLang((l) => (l === 'en' ? 'ar' : 'en')), []);

  const value = useMemo(() => ({ lang, dir, setLang, toggleLanguage, t, languages }), [lang, dir, toggleLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
