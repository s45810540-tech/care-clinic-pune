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
    <footer className="relative overflow-hidden bg-brand-950 text-white">
      {/* Brand hairline: teal into amber, no confetti. */}
      <div
        className="h-px w-full bg-[linear-gradient(90deg,transparent,#3F9182_20%,#EBB965_55%,transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_360px_at_12%_-20%,rgba(63,145,130,0.28),transparent_62%),radial-gradient(700px_300px_at_92%_0%,rgba(224,158,58,0.14),transparent_62%)]"
        aria-hidden
      />

      {/* Bottom padding keeps the last line clear of the sticky mobile action bar. */}
      <div className="container-page relative pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-14 sm:pt-16 md:pb-14">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand + CTA */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/15">
                <Icon name="heart" className="h-6 w-6 text-accent-300" strokeWidth={2} />
              </span>
              <div className="leading-tight">
                <p className="text-lg font-extrabold">{SITE.shortName}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-200">
                  General Medicine &amp; Surgery
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/75">{t('footer.about')}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <OpenBadge />
              <a
                href={RATING.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold transition hover:bg-white/20"
              >
                <span className="flex items-center gap-0.5 text-accent-300">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                {RATING.value} · {RATING.count} {t('common.reviews')}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/book" className="btn-light !px-5 !py-3">
                <Icon name="calendar" className="h-4 w-4" /> {t('common.bookNow')}
              </Link>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-outline-light !px-5 !py-3">
                <Icon name="whatsapp" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                {t('common.whatsapp')}
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent-300">
              {t('footer.contact')}
            </h2>
            <address className="mt-4 space-y-4 text-sm not-italic text-brand-100/85">
              <p className="flex gap-3">
                <Icon name="mapPin" className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
                <span className="leading-relaxed">
                  {ADDRESS.line1},<br />
                  {ADDRESS.line2},<br />
                  {ADDRESS.line3} – {ADDRESS.pincode}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Icon name="phone" className="h-5 w-5 shrink-0 text-brand-300" />
                <a href={`tel:${PHONE_TEL}`} className="tabular font-bold transition hover:text-white">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Icon name="clock" className="h-5 w-5 shrink-0 text-brand-300" />
                <span>
                  {t('common.daily')} {hours}
                </span>
              </p>
              <p className="flex items-start gap-3 text-xs leading-relaxed text-brand-200/70">
                <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
                {t('footer.emergencyNote')} {EMERGENCY_NUMBER}.
              </p>
            </address>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent-300">
              {t('footer.quickLinks')}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-100/85">
              {explore.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/contact" className="transition hover:text-white">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + latest reading */}
          <div className="md:col-span-2">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent-300">
              {t('footer.legal')}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-100/85">
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-300">
              {t('nav.blog')}
            </p>
            <ul className="mt-2 space-y-2 text-xs text-brand-100/70">
              {POSTS.slice(0, 2).map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="leading-relaxed transition hover:text-white">
                    {p.title[lang] ?? p.title.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-brand-200/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {t('footer.rights')}
          </p>
          <p className="max-w-xl leading-relaxed">
            <Link to="/medical-disclaimer" className="underline underline-offset-2 transition hover:text-white">
              {t('common.notMedicalAdvice')}
            </Link>
          </p>
          <p className="shrink-0">{t('footer.builtBy')}</p>
        </div>
      </div>
    </footer>
  );
}
