import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../../hooks/useScroll';
import { usePrefersReducedMotion } from '../../hooks/useMotion';
import { useI18n } from '../../i18n/I18nContext';
import { SERVICES } from '../../data/content';
import Icon from '../Icon';

/**
 * Horizontal services carousel.
 *  • Desktop (no reduced motion): GSAP pins the section and scrubs the track sideways.
 *  • Mobile / reduced motion:      native overflow-x scroll with snap points (cheap + thumb-friendly).
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
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { t, L } = useI18n();

  useLayoutEffect(() => {
    if (reduced) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return undefined;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { x: 0 });
      };
    });

    const refresh = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(refresh);
      mm.revert();
    };
  }, [reduced]);

  /**
   * 3D coverflow: cards rotate in Y and shrink the further they sit from the
   * viewport centre, so the rail reads as a curved shelf of cards rather than a
   * flat strip. Driven from the scroll position of both the window (desktop,
   * where GSAP translates the track) and the track itself (mobile, native
   * horizontal scroll), throttled to one layout read per frame.
   */
  useEffect(() => {
    if (reduced) return undefined;
    const track = trackRef.current;
    if (!track) return undefined;
    const cards = Array.from(track.querySelectorAll('[data-card3d]'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const vw = window.innerWidth;
      const centre = vw / 2;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const offset = Math.max(-1, Math.min(1, (r.left + r.width / 2 - centre) / vw));
        const rotY = offset * -11;
        const scale = 1 - Math.abs(offset) * 0.055;
        card.style.transform = `perspective(1400px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = String(1 - Math.abs(offset) * 0.28);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    track.addEventListener('scroll', schedule, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      track.removeEventListener('scroll', schedule);
      cards.forEach((card) => {
        card.style.transform = '';
        card.style.opacity = '';
      });
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="wash wash-strong relative overflow-hidden py-16 lg:h-screen lg:py-0">
      <div className="blob right-0 top-0 h-80 w-80 animate-drift bg-grape-300/40" aria-hidden />

      <div className="relative flex h-full flex-col justify-center lg:py-24">
        <div className="container-page">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow !border-white/70 !bg-white/85" data-reveal="fade">
                {t('nav.services')}
              </span>
              <h2 className="mt-4 max-w-xl text-3xl leading-[1.1] text-ink sm:text-4xl lg:text-5xl" data-reveal>
                {t('home.servicesTitle')}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink-soft lg:text-right" data-reveal data-delay="0.1">
              {t('home.servicesSub')}
              <span className="mt-2 hidden text-xs font-bold uppercase tracking-widest text-ink-mute lg:block">
                {t('home.servicesDrag')} →
              </span>
            </p>
          </div>
        </div>

        {/* Track: horizontal on mobile via overflow, translated by GSAP on desktop */}
        <div className="mt-8 overflow-x-auto lg:mt-12 lg:overflow-visible">
          <div className="[perspective:1400px] [perspective-origin:50%_45%]">
            <div
              ref={trackRef}
              className="no-scrollbar flex w-max snap-x snap-mandatory gap-5 px-5 [transform-style:preserve-3d] sm:gap-6 lg:px-8 xl:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
            >
            {SERVICES.map((s, i) => (
              <article
                key={s.slug}
                data-magnetic
                data-card3d
                className={`group relative w-[80vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition-[border-color,box-shadow] duration-300 will-change-transform hover:shadow-lift sm:w-[340px] lg:w-[360px] ${TILE_BARS[i % TILE_BARS.length]}`}
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
                  {/* sr-only service name → the link's accessible text is never just "Read more" (WCAG link purpose) */}
                  <span className="sr-only">{L(s.title)} </span>
                  {t('common.learnMore')} <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </article>
            ))}
            </div>
          </div>
        </div>

        <div className="container-page mt-8 lg:hidden">
          <Link to="/services" className="btn-dark w-full">
            {t('common.viewAll')} — {t('nav.services')}
          </Link>
        </div>
      </div>
    </section>
  );
}
