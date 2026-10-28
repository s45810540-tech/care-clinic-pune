import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals, gsap } from '../hooks/useScroll';
import { usePrefersReducedMotion } from '../hooks/useMotion';
import { PageHeader, PlaceholderTag } from '../components/ui';
import { SERVICES } from '../data/content';
import { useEffect, useRef } from 'react';
import Icon from '../components/Icon';

const TONES = [
  'from-brand-50 to-white',
  'from-accent-50 to-white',
  'from-brand-50 to-white',
  'from-accent-50 to-white',
  'from-brand-50 to-white',
  'from-accent-50 to-white',
  'from-brand-50 to-white',
];

export default function Services() {
  const { t, L } = useI18n();
  const pageRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useSeo({
    title: 'Services',
    description:
      'General medicine, fever and infection treatment, family doctor care, paediatric care and day-care admission, piles/anal fissure and minor surgery, Ayurvedic treatment and diagnostics in Pune.',
    path: '/services',
  });
  useReveals();

  // Gentle parallax on the alternating service illustrations.
  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-service-art]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={pageRef}>
      <PageHeader eyebrow={t('nav.services')} title={t('services.title')} sub={t('services.sub')} />

      {/* Jump links */}
      <nav className="sticky top-[96px] z-30 border-b border-brand-100 bg-white/95 backdrop-blur" aria-label="Services">
        <div className="no-scrollbar container-page flex gap-2 overflow-x-auto py-3">
          {SERVICES.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="shrink-0 rounded-full border border-brand-200 px-4 py-2 text-xs font-bold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
            >
              {L(s.title)}
            </a>
          ))}
        </div>
      </nav>

      {/* Detail section for every service */}
      {SERVICES.map((service, i) => {
        const flip = i % 2 === 1;
        return (
          <section
            key={service.slug}
            id={service.slug}
            className={`scroll-mt-[160px] bg-gradient-to-b ${TONES[i % TONES.length]} py-14 sm:py-20`}
          >
            <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div data-reveal={flip ? 'right' : 'left'}>
                <span className="eyebrow">
                  <span className="font-mono text-[10px] text-brand-600">0{i + 1}</span>
                  {t('nav.services')}
                </span>
                <h2 className="mt-5 text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">{L(service.title)}</h2>
                <p className="mt-4 text-base leading-relaxed text-ink-mute sm:text-lg">{L(service.short)}</p>

                <h3 className="mt-8 text-sm font-extrabold uppercase tracking-[0.16em] text-brand-700">
                  {t('services.eachTitle')}
                </h3>
                <ul className="mt-4 space-y-3">
                  {service.points.map((p) => (
                    <li key={p.en} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-soft">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                        <Icon name="check" className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      {L(p)}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 flex items-start gap-2 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm leading-relaxed text-ink">
                  <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                  <span>
                    <strong>{t('services.note')}:</strong> {L(service.note)}
                  </span>
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to={`/book?service=${service.slug}`} className="btn-primary" data-magnetic>
                    <Icon name="calendar" className="h-4 w-4" /> {t('services.bookThis')}
                  </Link>
                  <Link to="/contact" className="btn-ghost" data-magnetic>
                    {t('nav.contact')}
                  </Link>
                </div>
              </div>

              {/* Illustration panel — [PLACEHOLDER] swap for a real clinic photograph */}
              <div className={flip ? 'lg:order-first' : ''} data-reveal={flip ? 'left' : 'right'}>
                <div
                  data-service-art
                  className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-8 shadow-card"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-100/70" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent-100/70" />
                  <div className="relative grid place-items-center py-10 text-brand-700">
                    <span className="grid h-32 w-32 place-items-center rounded-[2rem] bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-glow">
                      <Icon name={service.icon} className="h-16 w-16" strokeWidth={1.4} />
                    </span>
                  </div>
                  <div className="relative mt-6 flex items-center justify-between rounded-2xl bg-sand px-5 py-4">
                    <div>
                      <p className="text-sm font-extrabold text-ink">{L(service.title)}</p>
                      <p className="text-xs text-ink-mute">Keshav Nagar, Mundhwa, Pune</p>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700 text-white">
                      <Icon name="arrowUpRight" className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-center text-[11px] text-ink-mute">
                    <PlaceholderTag>Illustration — replace with a photo</PlaceholderTag>
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Closing CTA */}
      <section className="bg-brand-900 py-14 text-white sm:py-16">
        <div className="container-page flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div data-reveal="left">
            {/* explicit white — the base h1–h4 rule (text-ink) beats inherited color */}
            <h2 className="text-3xl leading-[1.1] text-white sm:text-4xl lg:text-5xl">{t('home.ctaTitle')}</h2>
            <p className="mt-2 text-brand-100/85">{t('home.ctaSub')}</p>
          </div>
          <Link to="/book" className="btn bg-accent-500 !px-7 !py-4 text-ink hover:bg-accent-400" data-magnetic>
            <Icon name="calendar" className="h-5 w-5" /> {t('common.bookNow')}
          </Link>
        </div>
      </section>
    </div>
  );
}
