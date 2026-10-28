import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../../hooks/useScroll';
import { usePrefersReducedMotion } from '../../hooks/useMotion';
import { useI18n } from '../../i18n/I18nContext';
import { GALLERY } from '../../data/content';
import Tilt from '../Tilt';
import Icon from '../Icon';

/**
 * "Look around the clinic" — a scroll-driven 3D photo stage.
 *
 * Four photographs sit in one perspective container. As the section travels up
 * the viewport each card moves on its own depth track (a different translateY
 * and rotateY, scrubbed by scroll position), so the group reads as a physical
 * arrangement you are drifting past rather than a flat image grid. The pointer
 * adds a light per-card tilt on top (components/Tilt.jsx).
 *
 * Degradation:
 *  • ≤1023px — no scrub, no rotation: cards simply fade up in order, because
 *    a 3D transform on a phone is jank, not polish.
 *  • prefers-reduced-motion — everything sits still and the CSS shows the
 *    cards in their final position.
 */
const LAYOUT = [
  // span, aspect, offset (desktop only), scroll track (from → to)
  {
    span: 'sm:col-span-7',
    ratio: 'aspect-[16/10]',
    offset: 'lg:mt-0',
    from: { y: 70, rotateY: 9, scale: 1.06 },
    to: { y: -40, rotateY: -4, scale: 1 },
  },
  {
    span: 'sm:col-span-5',
    ratio: 'aspect-[4/3] lg:aspect-[4/5]',
    offset: 'lg:mt-16',
    from: { y: 120, rotateY: -12 },
    to: { y: -20, rotateY: 3 },
  },
  {
    span: 'sm:col-span-5',
    ratio: 'aspect-[4/3] lg:aspect-[4/5]',
    offset: 'lg:-mt-10',
    from: { y: 90, rotateX: 10 },
    to: { y: -34, rotateX: 0 },
  },
  {
    span: 'sm:col-span-7',
    ratio: 'aspect-[16/10]',
    offset: 'lg:mt-8',
    from: { y: 140, rotateX: -8 },
    to: { y: -60, rotateX: 0 },
  },
];

export default function ClinicScene() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { t, L } = useI18n();

  useEffect(() => {
    if (reduced) return undefined;

    const mm = gsap.matchMedia();

    // Desktop: scrub every card on its own depth track.
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 0.8,
        },
      });

      gsap.utils.toArray('[data-scene-card]').forEach((card, i) => {
        const conf = LAYOUT[i];
        gsap.set(card, { transformPerspective: 1200, transformOrigin: '50% 50%' });
        tl.fromTo(card, { ...conf.from }, { ...conf.to, ease: 'none' }, 0);
      });

      return () => tl.scrollTrigger?.kill();
    });

    // Pointer parallax on the whole stage — a couple of degrees, no more.
    const stage = stageRef.current;
    let frame = 0;
    const onMove = (e) => {
      if (e.pointerType === 'touch' || !stage) return;
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        stage.style.setProperty('--scene-ry', `${(px * 4).toFixed(2)}deg`);
        stage.style.setProperty('--scene-rx', `${(-py * 3).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      stage?.style.setProperty('--scene-ry', '0deg');
      stage?.style.setProperty('--scene-rx', '0deg');
    };
    stage?.addEventListener('pointermove', onMove);
    stage?.addEventListener('pointerleave', onLeave);

    // Card heights change once the real photos decode; re-measure then.
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(refresh);
      cancelAnimationFrame(frame);
      stage?.removeEventListener('pointermove', onMove);
      stage?.removeEventListener('pointerleave', onLeave);
      mm.revert();
    };
  }, [reduced]);

  const cards = GALLERY.slice(0, 4);

  return (
    <section
      ref={sectionRef}
      className="section relative overflow-hidden bg-sand"
      aria-labelledby="clinic-scene-title"
    >
      {/* Warm wash + hairline grid so the photos sit on something, not in a void. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_360px_at_80%_-10%,rgba(63,145,130,0.14),transparent_62%),radial-gradient(700px_320px_at_0%_100%,rgba(224,158,58,0.12),transparent_62%)]"
        aria-hidden
      />

      <div className="container-page relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow" data-reveal="fade">
              <span className="eyebrow-dot" aria-hidden />
              {t('gallery.title')}
            </span>
            <h2 id="clinic-scene-title" className="mt-4 max-w-2xl title-lg" data-reveal="3d">
              {t('home.sceneTitle')}
            </h2>
            <p className="mt-3 max-w-xl lead" data-reveal data-delay="0.08">
              {t('home.sceneSub')}
            </p>
          </div>
          <Link to="/gallery" className="btn-ghost shrink-0 self-start sm:self-auto" data-magnetic>
            {t('common.viewAll')} <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>

        {/* The 3D stage: outer element owns the perspective, inner element
            leans with the pointer, each figure is scrubbed on its own track. */}
        <div className="stage-3d mt-10 lg:mt-14">
          <div
            ref={stageRef}
            className="scene-stage grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6"
          >
          {cards.map((card, i) => {
            const conf = LAYOUT[i] || LAYOUT[0];
            return (
              <figure
                key={card.src}
                data-scene-card
                className={`${conf.span} ${conf.offset} relative m-0`}
                data-reveal={i === 0 ? 'fade' : undefined}
              >
                <Tilt max={7} scale={1.02} className="h-full rounded-3xl">
                  <Link
                    to="/gallery"
                    className="group relative block h-full overflow-hidden rounded-3xl border border-line bg-white p-2 shadow-lift
                               transition-shadow duration-300 hover:shadow-[0_36px_80px_-40px_rgba(12,26,23,0.55)]"
                    aria-label={`${L(card.caption)} — ${t('common.viewAll')}`}
                  >
                    <img
                      src={card.src}
                      alt={L(card.caption)}
                      width={1200}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className={`w-full rounded-2xl object-cover ${conf.ratio}`}
                    />
                    <figcaption className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
                      <span className="text-xs font-bold leading-snug text-ink-soft">{L(card.caption)}</span>
                      <Icon
                        name="arrowUpRight"
                        className="h-4 w-4 shrink-0 text-brand-600 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </figcaption>
                  </Link>
                </Tilt>
              </figure>
            );
          })}
          </div>
        </div>

        {/* Three facts that ride the same depth plane as the photos. */}
        <ul className="mt-8 grid gap-3 sm:grid-cols-3" data-reveal data-delay="0.1">
          {[
            { icon: 'mapPin', text: t('home.sceneFact1') },
            { icon: 'clock', text: t('home.sceneFact2') },
            { icon: 'users', text: t('home.sceneFact3') },
          ].map((fact) => (
            <li
              key={fact.text}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white/80 px-4 py-3 text-xs font-semibold text-ink-soft backdrop-blur-sm"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name={fact.icon} className="h-4 w-4" />
              </span>
              {fact.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
