import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { EMERGENCY_NUMBER, RATING, waLink } from '../data/site';
import { isOpenNow, formatTime } from '../utils/clinic';
import { HOURS } from '../data/site';
import Icon from './Icon';

const NAV = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/about', key: 'nav.about' },
  { to: '/services', key: 'nav.services' },
  { to: '/reviews', key: 'nav.reviews' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/faq', key: 'nav.faq' },
  { to: '/contact', key: 'nav.contact' },
];

/** Small "Open now / Closed" pill based on the clinic's local time. */
export function OpenBadge({ compact = false }) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(isOpenNow());

  useEffect(() => {
    const id = setInterval(() => setOpen(isOpenNow()), 60_000);
    return () => clearInterval(id);
  }, []);

  const closeLabel = formatTime(HOURS.closingTime, lang);
  const openLabel = formatTime(HOURS.openingTime, lang);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${
        open ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
      }`}
      // eslint-disable-next-line react/no-unescaped-entities
      title={open ? `${t('common.closesAt', { time: closeLabel })}` : `${t('common.opensAt', { time: openLabel })}`}
    >
      <span className={`h-2 w-2 rounded-full ${open ? 'bg-emerald-500 animate-pulse-soft' : 'bg-slate-400'}`} />
      {open ? t('common.openNow') : t('common.closed')}
      {!compact && (
        <span className="hidden font-medium opacity-80 sm:inline">
          · {t('common.daily')} {openLabel}–{closeLabel}
        </span>
      )}
    </span>
  );
}

export default function Header() {
  const { t, lang, setLang, languages } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpenMenu(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = openMenu ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openMenu]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Emergency notice — always visible, never dismissible */}
      <div className="bg-brand-950 text-white">
        <div className="container-page flex h-8 items-center justify-between gap-3 text-[11px] sm:text-xs">
          <p className="flex items-center gap-1.5 truncate font-semibold">
            <Icon name="info" className="h-3.5 w-3.5 shrink-0 text-accent-300" />
            <span className="truncate">
              <span className="sm:hidden">Emergency? Call {EMERGENCY_NUMBER}</span>
              <span className="hidden sm:inline">{t('common.emergency')}</span>
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-1">
            {RATING.value > 0 && (
              <span className="hidden items-center gap-1 text-accent-300 md:flex">
                <Icon name="star" className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                {RATING.value} · {RATING.count} {t('common.reviews')}
              </span>
            )}
            <div className="flex items-center rounded-full bg-white/10 p-0.5" role="group" aria-label={t('common.language')}>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  aria-pressed={lang === l.code}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold transition ${
                    lang === l.code ? 'bg-white text-brand-950' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? 'border-brand-100 bg-white/95 shadow-soft backdrop-blur-md'
            : 'border-transparent bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[64px]">
          {/* No aria-label: the visible clinic name IS the link's accessible name
              (an aria-label that rewords it fails WCAG label-in-name). */}
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-soft transition group-hover:scale-105">
              <Icon name="heart" className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-tight text-ink sm:text-base">
                केअर क्लिनिक
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-700 sm:text-[11px]">
                General Medicine &amp; Surgery
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full whitespace-nowrap px-3.5 py-2 text-[13px] font-bold transition ${
                    isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-soft hover:bg-brand-50 hover:text-brand-800'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <OpenBadge compact />
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2.5 text-[13px] font-bold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50 xl:inline-flex"
            >
              <Icon name="whatsapp" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              {t('common.whatsapp')}
            </a>
            <Link to="/book" className="btn-primary hidden !px-5 !py-2.5 md:inline-flex">
              {t('common.bookNow')}
            </Link>

            <button
              type="button"
              onClick={() => setOpenMenu((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-brand-100 text-ink lg:hidden"
              aria-expanded={openMenu}
              aria-label={openMenu ? t('nav.close') : t('nav.menu')}
            >
              <Icon name={openMenu ? 'close' : 'menu'} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-[96px] z-40 bg-ink/40 backdrop-blur-sm transition-opacity lg:hidden ${
          openMenu ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpenMenu(false)}
        aria-hidden={!openMenu}
      />
      <div
        className={`fixed inset-x-0 top-[96px] z-40 max-h-[calc(100dvh-96px)] overflow-y-auto border-b border-brand-100 bg-white transition-transform duration-300 lg:hidden ${
          // Translate past the header height as well as the panel's own height —
          // a plain -110% left the last row peeking above the header on phones.
          openMenu
            ? 'translate-y-0'
            : 'pointer-events-none -translate-y-[calc(100%+96px)]'
        }`}
        role="dialog"
        aria-label={t('nav.menu')}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>                  `flex items-center justify-between whitespace-nowrap rounded-2xl px-4 py-3.5 text-base font-bold transition ${
                  isActive ? 'bg-brand-50 text-brand-800' : 'text-ink hover:bg-brand-50'
                }`
              }
            >
              {t(item.key)}
              <Icon name="chevronRight" className="h-4 w-4 text-brand-500" />
            </NavLink>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href="tel:+918275573300" className="btn-ghost">
              <Icon name="phone" className="h-4 w-4" /> {t('common.call')}
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost !text-emerald-800">
              <Icon name="whatsapp" className="h-4 w-4" fill="currentColor" strokeWidth={0} /> {t('common.whatsappShort')}
            </a>
            <Link to="/book" className="btn-primary col-span-2">
              <Icon name="calendar" className="h-4 w-4" /> {t('common.bookNow')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
