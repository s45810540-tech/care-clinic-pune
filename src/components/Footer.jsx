import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { ADDRESS, EMERGENCY_NUMBER, PHONE_DISPLAY, PHONE_TEL, RATING, SITE, waLink } from '../data/site';
import { hoursSummary } from '../utils/clinic';
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
  const hours = hoursSummary(lang);

  const explore = [
    { to: '/about', label: t('nav.about') },
    { to: '/services', label: t('nav.services') },
    { to: '/gallery', label: t('gallery.title') },
    { to: '/reviews', label: t('nav.reviews') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/faq', label: t('nav.faq') },
  ];

  return (
    <footer className="wash relative overflow-hidden border-t border-line text-ink">
      {/* Spectrum rule closes the page instead of a dark slab. */}
      <div className="rainbow-edge h-1.5 w-full" aria-hidden />
      <div className="blob -right-20 top-0 h-72 w-72 animate-drift-slow bg-sky-300/40" aria-hidden />
      <div className="blob -left-16 bottom-10 h-64 w-64 animate-drift bg-mango-200/50" aria-hidden />

      {/* Bottom padding keeps the last line clear of the sticky mobile action bar. */}
      <div className="container-page relative pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-14 sm:pt-16 md:pb-14">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand + CTA */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-coral-500 to-grape-600 shadow-glow-coral">
                <Icon name="heart" className="h-6 w-6 text-white" strokeWidth={2} />
              </span>
              <div className="leading-tight">
                <p className="text-lg font-extrabold">{SITE.shortName}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">
                  General Medicine &amp; Surgery
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-mute">{t('footer.about')}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <OpenBadge />
              <a
                href={RATING.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink-soft shadow-soft transition hover:border-mango-300 hover:bg-mango-50"
              >
                <span className="flex items-center gap-0.5 text-mango-500">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                {RATING.value} · {RATING.count} {t('common.reviews')}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/book" className="btn-primary !px-5 !py-3">
                <Icon name="calendar" className="h-4 w-4" /> {t('common.bookNow')}
              </Link>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn border border-mint-300 bg-white !px-5 !py-3 text-mint-800 hover:border-mint-500 hover:bg-mint-50">
                <Icon name="whatsapp" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                {t('common.whatsapp')}
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-mute">
              {t('footer.contact')}
            </h2>
            <address className="mt-4 space-y-4 text-sm not-italic text-ink-soft">
              <p className="flex gap-3">
                <Icon name="mapPin" className="mt-0.5 h-5 w-5 shrink-0 text-coral-500" />
                <span className="leading-relaxed">
                  {ADDRESS.line1},<br />
                  {ADDRESS.line2},<br />
                  {ADDRESS.line3} – {ADDRESS.pincode}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Icon name="phone" className="h-5 w-5 shrink-0 text-sky-500" />
                <a href={`tel:${PHONE_TEL}`} className="tabular font-bold transition hover:text-brand-700">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Icon name="clock" className="h-5 w-5 shrink-0 text-sky-500" />
                <span>
                  {t('common.daily')} {hours}
                </span>
              </p>
              <p className="flex items-start gap-3 text-xs leading-relaxed text-ink-mute">
                <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
                {t('footer.emergencyNote')} {EMERGENCY_NUMBER}.
              </p>
            </address>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-mute">
              {t('footer.quickLinks')}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {explore.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/contact" className="transition hover:text-brand-700">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + latest reading */}
          <div className="md:col-span-2">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-mute">
              {t('footer.legal')}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-mute">
              {t('nav.blog')}
            </p>
            <ul className="mt-2 space-y-2 text-xs text-ink-mute">
              {POSTS.slice(0, 2).map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="leading-relaxed transition hover:text-brand-700">
                    {p.title[lang] ?? p.title.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {t('footer.rights')}
          </p>
          <p className="max-w-xl leading-relaxed">
            <Link to="/medical-disclaimer" className="underline underline-offset-2 transition hover:text-brand-700">
              {t('common.notMedicalAdvice')}
            </Link>
          </p>
          <p className="shrink-0">{t('footer.builtBy')}</p>
        </div>
      </div>
    </footer>
  );
}
