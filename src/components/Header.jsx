import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { ADDRESS, EMERGENCY_NUMBER, PHONE_DISPLAY, PHONE_TEL, RATING, waLink } from '../data/site';
import { isOpenNow, nextOpening, formatTime, hoursSummary } from '../utils/clinic';
import Icon from './Icon';

/**
 * Primary navigation.
 *
 * `wide: true` items (Gallery, FAQ) only appear in the bar from xl up — below
 * that they live in the drawer, so the row never wraps or crops on a laptop.
 */
const NAV = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/about', key: 'nav.about' },
  { to: '/services', key: 'nav.services' },
  { to: '/reviews', key: 'nav.reviews' },
  { to: '/gallery', key: 'gallery.title', wide: true },
  { to: '/blog', key: 'nav.blog' },
  { to: '/faq', key: 'nav.faq', wide: true },
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

  const next = nextOpening();
  const status = open
    ? t('common.openNow')
    : next
      ? t('common.opensAt', { time: formatTime(next.label, lang) })
      : t('common.closed');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${
        open ? 'bg-emerald-100 text-emerald-900' : 'bg-line text-ink-soft'
      }`}
      title={`${status} · ${hoursSummary(lang)}`}
    >
      <span className={`h-2 w-2 rounded-full ${open ? 'animate-pulse-soft bg-emerald-500' : 'bg-ink-mute/50'}`} />
      {open ? t('common.openNow') : t('common.closed')}
      {!compact && (
        <span className="hidden font-medium opacity-80 sm:inline">· {hoursSummary(lang)}</span>
      )}
    </span>
  );
}

export default function Header() {
  const { t, lang, setLang, languages } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);
  const drawerRef = useRef(null);

  // Publish the real header height as --header-h so every offset (page padding,
  // sticky service rail, anchor scroll-margin, mobile drawer) stays correct even
  // when the emergency strip wraps to two lines on a narrow phone.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const publish = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      if (h > 0) document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    publish();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', publish);
      return () => window.removeEventListener('resize', publish);
    }
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpenMenu(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!openMenu) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(false);
        document.getElementById('menu-button')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    drawerRef.current?.querySelector('a, button')?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      {/* Spectrum crown: 3px of colour across the very top of every page. */}
      <div className="rainbow-edge h-[3px] w-full" aria-hidden />
      {/* Utility strip — emergency number, phone, rating, language. */}
      <div className="bg-gradient-to-r from-brand-900 via-grape-700 to-sky-700 text-white">
        <div className="container-page flex min-h-8 items-center justify-between gap-3 py-1 text-[11px] sm:text-xs">
          <p className="flex min-w-0 items-center gap-1.5 font-semibold">
            <Icon name="info" className="h-3.5 w-3.5 shrink-0 text-mango-300" />
            <span className="truncate">
              <span className="sm:hidden">Emergency? Call {EMERGENCY_NUMBER}</span>
              <span className="hidden sm:inline">{t('common.emergency')}</span>
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="tabular hidden items-center gap-1.5 font-bold text-white/90 transition hover:text-white md:flex"
            >
              <Icon name="phone" className="h-3.5 w-3.5" />
              {PHONE_DISPLAY}
            </a>
            {RATING.value > 0 && (
              <span className="hidden items-center gap-1 text-mango-300 lg:flex">
                <Icon name="star" className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                {RATING.value} · {RATING.count} {t('common.reviews')}
              </span>
            )}
            <div className="flex items-center rounded-full bg-white/10 p-0.5" role="group" aria-label={t('common.language')}>
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  aria-pressed={lang === l.code}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold transition ${
                    lang === l.code ? 'bg-white text-brand-950' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`border-b transition-all duration-300 ease-brand ${
          scrolled
            ? 'border-line bg-white/92 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-white/85 backdrop-blur-md'
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* No aria-label: the visible clinic name IS the link's accessible name
              (an aria-label that rewords it fails WCAG label-in-name). */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 text-white shadow-soft transition duration-300 ease-brand group-hover:scale-[1.04]">
              <Icon name="heart" className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-tight text-ink sm:text-base">
                केअर क्लिनिक
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700 sm:text-[11px]">
                General Medicine &amp; Surgery
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative rounded-full px-3 py-2 text-[13px] font-bold transition duration-200 ${
                    item.wide ? 'hidden xl:inline-flex' : 'inline-flex'
                  } ${
                    isActive
                      ? 'bg-brand-50 text-brand-900'
                      : 'text-ink-soft hover:bg-brand-50/70 hover:text-brand-900'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <OpenBadge compact />
            <Link to="/book" className="btn-primary hidden !px-5 !py-2.5 md:inline-flex">
              {t('common.bookNow')}
            </Link>

            <button
              type="button"
              id="menu-button"
              onClick={() => setOpenMenu((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-line text-ink transition hover:border-brand-300 hover:bg-brand-50 xl:hidden"
              aria-expanded={openMenu}
              aria-controls="mobile-drawer"
              aria-label={openMenu ? t('nav.close') : t('nav.menu')}
            >
              <Icon name={openMenu ? 'close' : 'menu'} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer — `inert` keeps its links out of the tab order while closed. */}
      <div
        className={`fixed inset-0 top-[var(--header-h)] z-40 bg-ink/45 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          openMenu ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpenMenu(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-drawer"
        ref={drawerRef}
        inert={!openMenu ? '' : undefined}
        className={`fixed inset-x-0 top-[var(--header-h)] z-40 max-h-[calc(100dvh-var(--header-h))] overflow-y-auto
                    border-b border-line bg-white shadow-lift transition-transform duration-300 ease-brand xl:hidden ${
                      openMenu ? 'translate-y-0' : '-translate-y-[calc(100%+var(--header-h))]'
                    }`}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
      >
        <nav className="container-page grid gap-1 py-4 sm:grid-cols-2" aria-label="Mobile">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold transition ${
                  isActive ? 'bg-brand-50 text-brand-900' : 'text-ink hover:bg-brand-50/70'
                }`
              }
            >
              {t(item.key)}
              <Icon name="chevronRight" className="h-4 w-4 text-brand-500" />
            </NavLink>
          ))}

          <div className="mt-3 space-y-4 border-t border-line pt-4 sm:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <OpenBadge />
              <span className="chip">
                <Icon name="mapPin" className="h-3.5 w-3.5 text-brand-600" />
                {ADDRESS.line3}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${PHONE_TEL}`} className="btn-ghost">
                <Icon name="phone" className="h-4 w-4" /> {t('common.call')}
              </a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost !text-emerald-800">
                <Icon name="whatsapp" className="h-4 w-4" fill="currentColor" strokeWidth={0} />{' '}
                {t('common.whatsappShort')}
              </a>
              <Link to="/book" className="btn-primary col-span-2" onClick={() => setOpenMenu(false)}>
                <Icon name="calendar" className="h-4 w-4" /> {t('common.bookNow')}
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
