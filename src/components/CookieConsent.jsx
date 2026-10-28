import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

const STORAGE_KEY = 'care-clinic-cookie-consent';

/**
 * Loads analytics ONLY after the visitor has opted in.
 *
 * [PLACEHOLDER] Replace the GA4 id (or delete this block if you use a different tool).
 * Nothing here runs before consent is stored in localStorage.
 */
function loadAnalytics() {
  const GA_ID = import.meta.env.VITE_GA_ID || 'G-XXXXXXXXXX';
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return; // no configured id → nothing to load
  if (document.getElementById('ga4-loader')) return;

  const s = document.createElement('script');
  s.id = 'ga4-loader';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  const inline = document.createElement('script');
  inline.id = 'ga4-inline';
  inline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`;
  document.head.appendChild(inline);
}

function removeAnalytics() {
  document.getElementById('ga4-loader')?.remove();
  document.getElementById('ga4-inline')?.remove();
}

export default function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable → treat as undecided and ask */
    }
    if (stored === 'granted') loadAnalytics();
    if (!stored) {
      // Small delay so the banner never covers the first paint of the hero.
      const id = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(id);
    }
    return undefined;
  }, []);

  const decide = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    value === 'granted' ? loadAnalytics() : removeAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('cookie.title')}
      className="fixed inset-x-3 bottom-24 z-50 max-w-xl animate-fade-up rounded-3xl border border-brand-100 bg-white p-5 shadow-soft md:inset-x-auto md:right-6 md:bottom-6"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
          🍪
        </span>
        <div>
          <p className="text-sm font-extrabold text-ink">{t('cookie.title')}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-mute">{t('cookie.body')}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => decide('granted')} className="btn-primary !px-4 !py-2.5 text-xs">
          {t('cookie.accept')}
        </button>
        <button type="button" onClick={() => decide('denied')} className="btn-ghost !px-4 !py-2.5 text-xs">
          {t('cookie.reject')}
        </button>
        <Link to="/cookie-policy" className="px-1 text-xs font-bold text-brand-700 underline underline-offset-2">
          {t('cookie.settings')}
        </Link>
      </div>
    </div>
  );
}
