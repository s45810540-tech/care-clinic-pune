import { useRef } from 'react';
import { gsap } from '../../hooks/useScroll';
import { usePrefersReducedMotion } from '../../hooks/useMotion';
import { useI18n } from '../../i18n/I18nContext';
import { VISIT_STEPS } from '../../data/content';
import { useLayoutEffect } from 'react';

/**
 * "How your visit works" timeline.
 * A vertical rail fills with colour as you scroll (scrubbed), while each step
 * fades in. On phones the rail sits on the left; on desktop it stays centred
 * with alternating cards.
 */
const TONES = ['bg-brand-700', 'bg-coral-600', 'bg-sky-600', 'bg-grape-600', 'bg-mango-600'];
const ACCENTS = [
  'hover:border-brand-300',
  'hover:border-coral-300',
  'hover:border-sky-300',
  'hover:border-grape-300',
  'hover:border-mango-300',
];

export default function VisitTimeline() {
  const rootRef = useRef(null);
  const railRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const { L } = useI18n();

  useLayoutEffect(() => {
    if (reduced) {
      if (railRef.current) railRef.current.style.transform = 'scaleY(1)';
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        railRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 65%',
            end: 'bottom 75%',
            scrub: 0.4,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/50 to-white py-16 sm:py-24">
      <div className="container-page">
        <div className="relative">
          {/* Rail */}
          <div className="absolute left-6 top-0 h-full w-0.5 bg-brand-100 sm:left-1/2 sm:-translate-x-1/2" aria-hidden>
            <div
              ref={railRef}
              className="h-full w-full origin-top bg-gradient-to-b from-brand-500 via-brand-600 to-accent-400"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          <ol className="relative space-y-8 sm:space-y-12">
            {VISIT_STEPS.map((step, i) => {
              const right = i % 2 === 1;
              return (
                <li
                  key={step.step}
                  className={`relative pl-16 sm:w-1/2 sm:pl-0 ${
                    right ? 'sm:ml-auto sm:pl-14' : 'sm:pr-14 sm:text-right'
                  }`}
                  data-reveal={right ? 'flipY' : 'tilt-top'}
                  data-delay={i * 0.05}
                >
                  {/* Node on the rail: one hue per step, all AA on white text. */}
                  <span
                    className={`absolute left-0.5 top-1 z-10 grid h-12 w-12 place-items-center rounded-full border-4 border-white text-sm font-extrabold text-white shadow-soft ${
                      TONES[i % TONES.length]
                    } ${right ? 'sm:-left-6' : 'sm:left-auto sm:-right-6'}`}
                  >
                    {step.step}
                  </span>

                  <div className={`card-pop rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6 ${ACCENTS[i % ACCENTS.length]}`}>
                    <h3 className="text-xl">{L(step.title)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-mute sm:text-base">{L(step.body)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
