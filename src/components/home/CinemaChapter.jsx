/**
 * "How we work" — the cinematic chapter between the doctor intro and the
 * services carousel.
 *
 * Desktop (and no reduced motion): the section pins while one scrubbed
 * timeline plays three value cards across the frame and a 3D DNA helix
 * assembles beside them — base-pair rungs growing in as the scroll front
 * passes, camera dollying in, amber rim rising. Phones and reduced-motion
 * visitors get the same content as a plain stacked section with a gentle
 * entrance; low-end devices get the static SVG helix instead of WebGL.
 *
 * All copy is reused from the About page (bilingual) — nothing here makes
 * medical claims; it describes how the clinic behaves.
 */

import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../hooks/useScroll';
import { usePrefersReducedMotion, useShouldLoad3D } from '../../hooks/useMotion';
import { useI18n } from '../../i18n/I18nContext';

// three.js never loads on the critical path — same rule as the hero scene.
const Helix3D = lazy(() => import('./Helix3D'));

const CHAPTERS = [
  { i: '01', t: 'about.v1T', b: 'about.v1B' },
  { i: '02', t: 'about.v2T', b: 'about.v2B' },
  { i: '03', t: 'about.v3T', b: 'about.v3B' },
];

/**
 * Static helix drawing for reduced motion / low-end devices: two phase-shifted
 * strands plus base-pair rungs, generated as plain SVG paths.
 */
function HelixFallback() {
  const { strand, mirror, rungs } = useMemo(() => {
    const W = 320;
    const H = 460;
    const amp = 74;
    const turns = 3.2;
    const steps = 60;
    const x = (i, phase) => W / 2 + Math.sin((i / steps) * turns * Math.PI * 2 + phase) * amp;
    const y = (i) => 24 + (i / steps) * (H - 48);

    const line = (phase) => {
      let d = `M${x(0, phase).toFixed(1)} ${y(0).toFixed(1)}`;
      for (let i = 1; i <= steps; i += 1) d += ` L${x(i, phase).toFixed(1)} ${y(i).toFixed(1)}`;
      return d;
    };

    const rungList = [];
    for (let i = 0; i <= steps; i += 5) {
      rungList.push({ y: y(i), x1: x(i, 0), x2: x(i, Math.PI), amber: i % 15 === 0 });
    }
    return { strand: line(0), mirror: line(Math.PI), rungs: rungList };
  }, []);

  return (
    <div className="absolute inset-0 grid place-items-center">
      <svg
        viewBox="0 0 320 460"
        className="h-[300px] w-auto max-w-[86%] opacity-90 sm:h-[380px] lg:h-[460px]"
        aria-hidden
      >
        <g strokeWidth="2.5" strokeLinecap="round">
          {rungs.map((r, i) => (
            <line
              key={i}
              x1={r.x1}
              y1={r.y}
              x2={r.x2}
              y2={r.y}
              stroke={r.amber ? '#B4EE1F' : '#88C0A0'}
              opacity={0.55}
            />
          ))}
        </g>
        <path d={strand} fill="none" stroke="#CAF94F" strokeWidth="7" strokeLinecap="round" />
        <path d={mirror} fill="none" stroke="#2F835B" strokeWidth="7" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function CinemaChapter() {
  const rootRef = useRef(null);
  const cardsRef = useRef(null);
  const barRef = useRef(null);
  const progressRef = useRef(0);
  const reduced = usePrefersReducedMotion();
  const show3D = useShouldLoad3D();
  const [beat, setBeat] = useState(0);
  const { t } = useI18n();

  useLayoutEffect(() => {
    if (reduced) return undefined;

    const setProgress = (p) => {
      progressRef.current = p;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setBeat(Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length)));
    };

    // Progress only — no pin. Pinning injected a spacer measured on mount, and
    // the late display font plus lazy photos then shifted everything under it,
    // which is what produced the long blank stretch in the middle of the page.
    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top 70%',
      end: 'bottom 40%',
      onUpdate: (self) => setProgress(self.progress),
    });

    // Cards rise one by one as they arrive, in flow, so the copy is always
    // reachable by scroll, keyboard and screen readers.
    const cards = gsap.utils.toArray('.cinema-card', cardsRef.current);
    const tweens = cards.map((card) =>
      gsap.fromTo(
        card,
        { opacity: 0, y: 42, rotateX: 8, transformPerspective: 900 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        },
      ),
    );

    return () => {
      trigger.kill();
      tweens.forEach((tw) => {
        tw.scrollTrigger?.kill();
        tw.kill();
      });
    };
  }, [reduced]);

  const helix = show3D ? (
    <Suspense fallback={<HelixFallback />}>
      <Helix3D progressRef={progressRef} />
    </Suspense>
  ) : (
    <HelixFallback />
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 py-20 text-white sm:py-24 lg:min-h-screen lg:py-0"
    >
      {/* Colour grade: three saturated hues instead of a near-black slab, with a
          light vignette so the 3D helix keeps its depth. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_400px_at_82%_18%,rgba(107,230,186,0.42),transparent_62%),radial-gradient(680px_380px_at_8%_96%,rgba(255,176,32,0.34),transparent_60%),radial-gradient(520px_320px_at_20%_0%,rgba(255,116,102,0.3),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 grain opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,10,24,0.42)_100%)]" />

      <div className="container-page relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          {/* Sticky stage: copy, chapter meter and the helix stay put while the
              three chapters scroll past on the right. Pure CSS sticky — no pin,
              no spacer, nothing to desync. */}
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            {/* Chapter meter (decorative) */}
            <div className="mb-7 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em]" aria-hidden>
              <span className="text-mango-300">0{beat + 1}</span>
              <span className="relative h-px w-24 bg-white/30 sm:w-32">
                <span
                  ref={barRef}
                  className="absolute inset-y-0 left-0 w-full origin-left bg-mango-300"
                  style={{ transform: 'scaleX(0)' }}
                />
              </span>
              <span className="text-white/40">0{CHAPTERS.length}</span>
            </div>

            <span className="eyebrow !border-white/30 !bg-white/15 !text-white">
              {t('about.valuesTitle')}
            </span>
            {/* text-white must be explicit: the base-layer h1–h4 rule sets text-ink,
                which would otherwise beat the inherited white and render at ~1:1. */}
            <h2 className="mt-5 max-w-xl title-lg text-white">
              {t('home.cinemaTitle')}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {t('home.cinemaSub')}
            </p>

            <div className="relative mt-8 hidden h-[280px] lg:block">
              {helix}
            </div>
          </div>

          {/* Chapters: normal flow on every breakpoint. */}
          <div ref={cardsRef} className="space-y-5 sm:space-y-6">
            {CHAPTERS.map((c) => (
              <article
                key={c.i}
                className="cinema-card rounded-3xl border border-white/25 bg-white/12 p-6 backdrop-blur-md sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-mango-400/90 text-sm font-extrabold text-brand-900">
                    {c.i}
                  </span>
                  <span className="h-px flex-1 bg-white/20" />
                </div>
                <h3 className="mt-4 text-xl text-white sm:text-2xl">{t(c.t)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">{t(c.b)}</p>
              </article>
            ))}

            {/* Phone-only helix, since the sticky column is desktop-only. */}
            <div className="relative h-[240px] opacity-90 lg:hidden">{helix}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
