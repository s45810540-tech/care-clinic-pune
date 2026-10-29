import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../../hooks/useMotion';
import { useI18n } from '../../i18n/I18nContext';
import { SERVICES } from '../../data/content';
import Icon from '../Icon';

/**
 * Horizontal services rail.
 *  • Every device: native overflow-x scroll with snap points, arrow controls and
 *    a progress bar. No scroll-jacking, no pinned spacers.
 *  • No reduced motion: cards coverflow in 3D as they cross the viewport centre.
 */
/* Each service family owns one hue; the rail cycles them. */
const TILE_BARS = [
  'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-coral-500',
  'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-sky-500',
  'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-mango-400',
  'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-grape-500',
  'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-mint-500',
  'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-brand-500',
  'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-coral-400',
];
const TILE_ICONS = [
  'bg-coral-50 text-coral-600',
  'bg-sky-50 text-sky-600',
  'bg-mango-50 text-mango-700',
  'bg-grape-50 text-grape-600',
  'bg-mint-50 text-mint-700',
  'bg-brand-50 text-brand-700',
  'bg-coral-50 text-coral-600',
];
const TILE_TICKS = [
  'text-coral-500', 'text-sky-500', 'text-mango-500', 'text-grape-500',
  'text-mint-500', 'text-brand-500', 'text-coral-500',
];

export default function ServicesCarousel() {
  const railRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { t, L, lang } = useI18n();

  /**
   * Native horizontal rail. No ScrollTrigger pin: pinning a full-height section
   * injects a spacer whose height is measured on mount, and on this page the
   * late-loading display font and photos moved everything under it — which is
   * what left huge white gaps while scrolling. A snap rail cannot desync.
   */
  const onScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setProgress(max > 0 ? rail.scrollLeft / max : 0);
    setAtStart(rail.scrollLeft < 8);
    setAtEnd(rail.scrollLeft > max - 8);
  };

  const nudge = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('[data-card3d]');
    const step = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' });
  };

  /**
   * Coverflow: cards rotate away from the viewport centre. Reads each card's
   * box once per frame, so it stays correct while the rail is dragged, swiped,
   * nudged by the arrows or scrolled by the page.
   */
  useEffect(() => {
    if (reduced) return undefined;
    const rail = railRef.current;
    if (!rail) return undefined;
    const cards = Array.from(rail.querySelectorAll('[data-card3d]'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const centre = window.innerWidth / 2;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const offset = Math.max(-1.4, Math.min(1.4, (r.left + r.width / 2 - centre) / (window.innerWidth * 0.75)));
        const clamped = Math.max(-1, Math.min(1, offset));
        card.style.transform = `perspective(1500px) rotateY(${(clamped * -12).toFixed(2)}deg) scale(${(1 - Math.abs(clamped) * 0.06).toFixed(3)})`;
        card.style.opacity = String(1 - Math.abs(clamped) * 0.3);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    rail.addEventListener('scroll', schedule, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      rail.removeEventListener('scroll', schedule);
      cards.forEach((card) => {
        card.style.transform = '';
        card.style.opacity = '';
      });
    };
  }, [reduced]);

  return (
    <section className="wash wash-strong relative overflow-hidden py-16 sm:py-24">
      <div className="blob right-0 top-0 h-80 w-80 animate-drift bg-grape-300/40" aria-hidden />
      <div className="blob -left-24 bottom-0 h-72 w-72 animate-drift-slow bg-mango-300/40" aria-hidden />

      <div className="container-page relative">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow !border-white/70 !bg-white/85" data-reveal="fade">
              <span className="eyebrow-dot" aria-hidden />
              {t('nav.services')}
            </span>
            <h2 className="mt-4 max-w-xl title-lg text-ink" data-reveal>
              {t('home.servicesTitle')}
            </h2>
          </div>

          {/* Arrow controls: real buttons, keyboard reachable, disabled at the ends. */}
          <div className="flex items-center gap-2 self-start lg:self-end" data-reveal="fade" data-delay="0.1">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label={lang === 'mr' ? 'मागील सेवा' : 'Previous services'}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-brand-800 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-300 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label={lang === 'mr' ? 'पुढील सेवा' : 'Next services'}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-brand-800 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-300 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft" data-reveal data-delay="0.12">
          {t('home.servicesSub')}
        </p>
      </div>

      {/* Rail: native scroll, snap points, momentum — same on every device. */}
      <div className="relative mt-8 sm:mt-10">
        <div
          ref={railRef}
          onScroll={onScroll}
          role="group"
          aria-label={t('nav.services')}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 pt-2 sm:gap-6 sm:px-8 [perspective:1500px] [perspective-origin:50%_45%] [transform-style:preserve-3d]"
        >
          {SERVICES.map((s, i) => (
            <article
              key={s.slug}
              data-magnetic
              data-card3d
              className={`group relative w-[78vw] max-w-[330px] shrink-0 snap-center overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition-[border-color,box-shadow] duration-300 will-change-transform hover:border-brand-300 hover:shadow-lift sm:w-[330px] lg:w-[352px] ${TILE_BARS[i % TILE_BARS.length]}`}
              data-reveal="up"
              data-delay={Math.min(i * 0.05, 0.25)}
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${TILE_ICONS[i % TILE_ICONS.length]}`}>
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <span className="tabular text-xs font-bold text-ink-mute/50">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-xl text-ink">{L(s.title)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-mute">{L(s.short)}</p>
              <ul className="mt-4 space-y-1.5">
                {s.points.slice(0, 2).map((p) => (
                  <li key={p.en} className="flex items-start gap-2 text-xs text-ink-soft">
                    <Icon name="check" className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${TILE_TICKS[i % TILE_TICKS.length]}`} />
                    {L(p)}
                  </li>
                ))}
              </ul>
              <Link
                to={`/services#${s.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition group-hover:gap-2.5 group-hover:text-brand-900"
              >
                <span className="sr-only">{L(s.title)} </span>
                {t('common.learnMore')} <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </article>
          ))}

          {/* Last tile: send people to the full list. */}
          <Link
            to="/services"
            className="group flex w-[70vw] max-w-[280px] shrink-0 snap-center flex-col justify-between rounded-3xl border border-brand-200 bg-brand-700 p-6 text-white shadow-glow transition duration-500 ease-spring hover:-translate-y-1.5 sm:w-[280px]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
              <Icon name="arrowUpRight" className="h-6 w-6" />
            </span>
            <span>
              <span className="mt-8 block text-xl font-extrabold">{t('common.viewAll')}</span>
              <span className="mt-1 block text-sm text-brand-100/90">{t('nav.services')}</span>
            </span>
          </Link>
        </div>

        {/* Progress: how far through the rail you are, and it is also a control. */}
        <div className="container-page mt-2 flex items-center gap-4">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-brand-200/60">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-brand-600 via-sky-500 to-grape-500 transition-[width] duration-200"
              style={{ width: `${Math.max(8, progress * 100)}%` }}
            />
          </span>
          <span className="tabular text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">
            {String(Math.round(progress * (SERVICES.length - 1)) + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
