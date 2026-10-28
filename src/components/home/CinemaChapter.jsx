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
              stroke={r.amber ? '#f99b20' : '#2dd4bf'}
              opacity={0.55}
            />
          ))}
        </g>
        <path d={strand} fill="none" stroke="#5eead4" strokeWidth="7" strokeLinecap="round" />
        <path d={mirror} fill="none" stroke="#0d9488" strokeWidth="7" strokeLinecap="round" />
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

    const mm = gsap.matchMedia();

    /* Desktop: pin + one scrubbed take through all three cards. */
    mm.add('(min-width: 1024px)', () => {
      const cards = gsap.utils.toArray('.cinema-card', cardsRef.current);
      if (cards.length < 3) return undefined;

      // Overlap the cards (grid stack) — only once we're actually pinning,
      // so phones and reduced-motion visitors see a normal document flow.
      cardsRef.current?.classList.add('cinema-stack');
      gsap.set(cards, { opacity: 0, y: 44, scale: 0.98 });
      gsap.set(cards[0], { opacity: 1, y: 0, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 2.2)}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      // 0 → out / 1 → in, then 1 → out / 2 → in (card 3 holds to the end).
      tl.to(cards[0], { opacity: 0, y: -44, scale: 0.98, duration: 0.5, ease: 'power2.in' }, 0.7)
        .fromTo(cards[1], { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.05)
        .to(cards[1], { opacity: 0, y: -44, scale: 0.98, duration: 0.5, ease: 'power2.in' }, 1.8)
        .fromTo(cards[2], { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.15);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        cardsRef.current?.classList.remove('cinema-stack');
        gsap.set(cards, { clearProps: 'all' });
      };
    });

    /* Phones: staggered entrance; the helix scrubs across the whole pass. */
    mm.add('(max-width: 1023px)', () => {
      const cards = gsap.utils.toArray('.cinema-card', cardsRef.current);
      const enter = gsap.from(cards, {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      });
      const scrub = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => setProgress(self.progress),
      });
      return () => {
        enter.scrollTrigger?.kill();
        enter.kill();
        scrub.kill();
      };
    });

    const refresh = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(refresh);
      mm.revert();
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
      className="relative overflow-hidden bg-[#04211f] py-20 text-white sm:py-24 lg:min-h-screen lg:py-0"
    >
      {/* Colour grade: teal key, amber bounce, deep cinematic vignette. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(820px_420px_at_78%_22%,rgba(20,184,166,0.3),transparent_65%),radial-gradient(700px_400px_at_12%_92%,rgba(249,155,32,0.2),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 grain opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,12,11,0.72)_100%)]" />

      <div className="relative flex min-h-full flex-col justify-center lg:min-h-screen lg:py-24">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Copy + chapter cards */}
          <div className="relative z-10">
            {/* Chapter meter (decorative) */}
            <div className="mb-7 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em]" aria-hidden>
              <span className="text-accent-300">0{beat + 1}</span>
              <span className="relative h-px w-24 bg-white/20 sm:w-32">
                <span
                  ref={barRef}
                  className="absolute inset-y-0 left-0 w-full origin-left bg-accent-400"
                  style={{ transform: 'scaleX(0)' }}
                />
              </span>
              <span className="text-white/40">0{CHAPTERS.length}</span>
            </div>

            <span className="eyebrow !border-white/20 !bg-white/10 !text-brand-100">
              {t('about.valuesTitle')}
            </span>
            {/* text-white must be explicit: the base-layer h1–h4 rule sets text-ink,
                which would otherwise beat the inherited white and render at ~1:1. */}             <h2 className="mt-5 max-w-xl text-3xl leading-[1.1] text-white sm:text-4xl lg:text-5xl">
              {t('home.cinemaTitle')}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-100/75 sm:text-base">
              {t('home.cinemaSub')}
            </p>

            <div ref={cardsRef} className="mt-8 space-y-4 lg:space-y-0">
              {CHAPTERS.map((c) => (
                <article
                  key={c.i}
                  className="cinema-card rounded-3xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold tracking-[0.2em] text-accent-300">{c.i}</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <h3 className="mt-3 text-lg text-white sm:text-xl">{t(c.t)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-100/80">{t(c.b)}</p>
                </article>
              ))}
            </div>
          </div>

          {/* 3D layer: full-bleed behind the copy on phones, its own frame on
              desktop. One instance only — never two canvases. */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-40 lg:relative lg:z-auto lg:min-h-[500px] lg:self-stretch lg:opacity-100">
            {helix}
          </div>
        </div>
      </div>
    </section>
  );
}
