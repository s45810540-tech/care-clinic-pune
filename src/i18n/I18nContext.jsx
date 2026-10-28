import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { LANGUAGES, translations } from './translations';

const KEY = 'care-clinic-lang';

const I18nContext = createContext(null);

/** Resolve `{ en, mr }` objects against the active language. */
export const pick = (obj, lang) => (obj && (obj[lang] ?? obj.en)) ?? '';

/** Interpolate `{name}` placeholders inside a translated string. */
const interpolate = (str, vars) =>
  Object.entries(vars || {}).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), v),
    str
  );

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved && translations[saved]) return saved;
    } catch {
      /* storage blocked — fall through to browser language */
    }
    // First-time visitors from Maharashtra get Marathi.
    const nav = (navigator.language || 'en').toLowerCase();
    return nav.startsWith('mr') ? 'mr' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* ignore */
    }

    // Marathi needs the Devanagari webfont (~120 kB) — fetch it on demand so
    // English visitors never download it. Loaded once and kept for the session.
    if (lang === 'mr' && !document.getElementById('font-devanagari')) {
      const link = document.createElement('link');
      link.id = 'font-devanagari';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, [lang]);

  /** Translate a UI key, e.g. t('nav.home') */
  const t = useCallback(
    (key, vars) => {
      const entry = translations[lang]?.[key] ?? translations.en[key] ?? key;
      return interpolate(entry, vars);
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, languages: LANGUAGES, L: (obj) => pick(obj, lang) }),
    [lang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
