import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { ADDRESS, EMERGENCY_NUMBER, HOURS, PHONE_DISPLAY, PHONE_TEL, RATING, SITE, waLink } from '../data/site';
import { formatTime } from '../utils/clinic';
import { POSTS } from '../data/content';
import Icon from './Icon';
import { OpenBadge } from './Header';

const LEGAL_LINKS = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/medical-disclaimer', label: 'Medical Disclaimer' },
  { to: '/cookie-policy', label: 'Cookie Policy' },
  { to: '/cancellation-policy', label: 'Cancellation & Rescheduling' },
  { to: '/accessibility', label: 'Accessibility Statement' },
];

export default function Footer() {
  const { t, lang } = useI18n();
  const openLabel = formatTime(HOURS.openingTime, lang);
  const closeLabel = formatTime(HOURS.closingTime, lang);

  return (
    <footer className="relative overflow-hidden bg-brand-950 text-white">
      {/* Playful spectrum stripe — the site's signature between dark bands */}
      <div
        className="h-1.5 w-full bg-[linear-gradient(90deg,#2DD4BF_0%,#38BDF8_33%,#F99B20_66%,#FB7185_100%)]"
        aria-hidden
      />
      {/* Soft gradient wash so the dark footer still feels warm */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_400px_at_15%_-10%,rgba(20,184,166,0.35),transparent_60%),radial-gradient(800px_300px_at_90%_10%,rgba(249,155,32,0.18),transparent_60%)]" />

      <div className="container-page relative py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
                <Icon name="heart" className="h-6 w-6 text-accent-300" strokeWidth={2} />
              </span>
              <div className="leading-tight">
                <p className="text-lg font-extrabold">{SITE.shortName}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">
                  General Medicine &amp; Surgery
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/80">{t('footer.about')}</p>
            <div className="mt-4">
              <OpenBadge />
            </div>
            <a
              href={RATING.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white/20"
            >
              <span className="flex items-center gap-0.5 text-accent-300">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              {RATING.value} / 5 · {RATING.count} {t('common.reviews')}
              <Icon name="arrowUpRight" className="h-4 w-4" />
            </a>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-accent-300">{t('footer.contact')}</h3>
            <address className="mt-4 space-y-4 text-sm not-italic text-brand-100/90">
              <p className="flex gap-3">
                <Icon name="mapPin" className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
                <span>
                  {ADDRESS.line1},<br />
                  {ADDRESS.line2},<br />
                  {ADDRESS.line3} – {ADDRESS.pincode}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Icon name="phone" className="h-5 w-5 shrink-0 text-brand-300" />
                <a href={`tel:${PHONE_TEL}`} className="font-bold hover:text-white">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Icon name="clock" className="h-5 w-5 shrink-0 text-brand-300" />
                <span>
                  {t('common.daily')} {openLabel} – {closeLabel}
                </span>
              </p>
              <p className="flex items-start gap-3 text-xs text-brand-200/80">
                <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
                {t('footer.emergencyNote')} {EMERGENCY_NUMBER}.
              </p>
            </address>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn bg-emerald-700 text-white hover:bg-emerald-800">
                <Icon name="whatsapp" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                {t('common.whatsapp')}
              </a>
              <a href={`tel:${PHONE_TEL}`} className="btn border border-white/25 text-white hover:bg-white/10">
                <Icon name="phone" className="h-4 w-4" /> {t('common.call')}
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-accent-300">{t('footer.quickLinks')}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-100/90">
              {[
                { to: '/about', label: t('nav.about') },
                { to: '/services', label: t('nav.services') },
                { to: '/book', label: t('nav.book') },
                { to: '/reviews', label: t('nav.reviews') },
                { to: '/gallery', label: t('gallery.title') },
                { to: '/contact', label: t('nav.contact') },
                { to: '/faq', label: t('nav.faq') },
                { to: '/blog', label: t('nav.blog') },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              {POSTS.map((p) => (
                <li key={p.slug} className="hidden sm:block">
                  <Link to={`/blog/${p.slug}`} className="transition hover:text-white">
                    <span className="text-brand-300">· </span>
                    {p.title[lang] ?? p.title.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-accent-300">{t('footer.legal')}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-100/90">
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-brand-200/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {t('footer.rights')}
          </p>
          <p className="max-w-xl">
            <Link to="/medical-disclaimer" className="underline underline-offset-2 hover:text-white">
              {t('common.notMedicalAdvice')}
            </Link>
          </p>
          <p>{t('footer.builtBy')}</p>
        </div>
      </div>
    </footer>
  );
}
