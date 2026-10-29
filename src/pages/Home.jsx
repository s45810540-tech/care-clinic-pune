import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useReveals, gsap } from '../hooks/useScroll';
import { useShouldLoad3D, usePrefersReducedMotion } from '../hooks/useMotion';
import { useSeo } from '../utils/seo';
import {
  ADDRESS,
  DOCTOR,
  MAPS_LINK,
  PHONE_DISPLAY,
  PHONE_TEL,
  RATING,
  SITE,
  STATS,
  waLink,
} from '../data/site';
import { POSTS } from '../data/content';
import { photoSrc } from '../data/photos';
import { isOpenNow, hoursSummary } from '../utils/clinic';
import Icon from '../components/Icon';
import FlipCard from '../components/FlipCard';
import TrustRibbon from '../components/TrustRibbon';
import KineticTitle from '../components/KineticTitle';
import DoctorPlate from '../components/DoctorPlate';
import Ticker from '../components/Ticker';
import { Sparkle, ConfettiDots, Squiggle, Cloud, Bloom } from '../components/Stickers';
import { SectionHeading, RatingBadge } from '../components/ui';
import Counter from '../components/home/Counter';
import ServicesCarousel from '../components/home/ServicesCarousel';
import CinemaChapter from '../components/home/CinemaChapter';
import ClinicScene from '../components/home/ClinicScene';
import VisitTimeline from '../components/home/VisitTimeline';
import HeroFallback from '../components/home/HeroFallback';
import ReadinessIndicator from '../components/ReadinessIndicator';
import Tilt from '../components/Tilt';

// 3D is code-split so budget phones never download three.js for the first paint.
const Hero3D = lazy(() => import('../components/home/Hero3D'));

/**
 * Cinematic take tuning — retune the hero shot here, without touching Hero3D.
 * Every keyframe channel of the shot lives in DEFAULT_HERO_ANIMATION inside
 * Hero3D.jsx ({ t: position along the scroll 0→1, v: value). Override any
 * subset; everything else keeps the defaults. Examples:
 *
 *   camera: { fov: [{ t: 0, v: 42 }, { t: 1, v: 28 }] }   // longer final lens
 *   model:  { rotY: [{ t: 0, v: 0 }, { t: 1, v: 4 }] }    // slower spin
 *   light:  { amber: [{ t: 1, v: 34 }] }                  // warmer finale
 */
const HERO_ANIMATION = {
  // Warm the closing frame: a touch more amber and a slightly longer lens so
  // the final pull-back settles like an establishing shot.
  camera: {
    fov: [
      { t: 0, v: 42 },
      { t: 0.32, v: 52 },
      { t: 0.64, v: 45 },
      { t: 1, v: 30 },
    ],
  },
  light: {
    amber: [
      { t: 0, v: 16 },
      { t: 0.32, v: 7 },
      { t: 0.64, v: 32 },
      { t: 1, v: 26 },
    ],
  },
};

/* One hue per card, cycled. Colour marks the card, it does not decorate it. */
const WHY_TONES = ['coral', 'sky', 'mango', 'grape'];

const WHY = [
  { icon: 'shield', t: 'home.why1T', b: 'home.why1B' },
  { icon: 'sparkle', t: 'home.why2T', b: 'home.why2B' },
  { icon: 'clock', t: 'home.why3T', b: 'home.why3B' },
  { icon: 'flask', t: 'home.why4T', b: 'home.why4B' },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  const { t, L, lang } = useI18n();
  const show3D = useShouldLoad3D();
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);

  // Cinematic copy exit: the block tips back in 3D perspective and racks out of
  // focus as the camera take plays behind it, while a vignette closes in.
  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.set('.hero-copy', { transformPerspective: 900, transformOrigin: '50% 100%' });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      tl.fromTo(
        '.hero-copy',
        { y: 0, rotateX: 0, scale: 1, opacity: 1 },
        { y: -60, rotateX: 9, scale: 0.96, opacity: 0.12, ease: 'none' },
        0
      )
        .fromTo('[data-hero-vignette]', { opacity: 0 }, { opacity: 0.55, duration: 0.6, ease: 'none' }, 0)
        .to('[data-hero-vignette]', { opacity: 0.16, duration: 0.4, ease: 'none' }, 0.6);
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  const open = isOpenNow();

  return (
    <section
      ref={sectionRef}
      className="wash relative isolate flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-center overflow-hidden"
    >
      {/* Decorative background layers (parallax + fallback art) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* Four colour layers at different parallax depths. Each drifts on its own
            long cycle, so the wash never repeats visibly. */}
        <div className="blob -left-28 top-0 h-80 w-80 animate-drift bg-sky-300/60" data-parallax="0.2" data-depth="0.6" />
        <div className="blob -bottom-28 right-0 h-96 w-96 animate-drift-slow bg-mango-300/55" data-parallax="0.3" data-depth="1" />
        <div className="blob right-1/3 top-10 h-64 w-64 animate-drift bg-coral-300/45" data-parallax="0.38" data-depth="1.4" />
        <div className="blob -left-10 bottom-1/4 h-56 w-56 animate-drift-slow bg-mint-300/50" data-parallax="0.26" data-depth="0.8" />
        <div className="absolute inset-0 grain opacity-30" />
      </div>

      {/* Floating doodles: slow, offset, and behind the copy so they never
          compete with the headline. */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden sm:block" aria-hidden>
        <Cloud className="doodle left-[6%] top-[16%] h-14 w-20 animate-bob text-white/90 drop-shadow-sm" />
        <Sparkle className="doodle right-[10%] top-[24%] h-7 w-7 animate-bob text-accent-400 [animation-delay:0.8s]" />
        <Sparkle className="doodle left-[42%] bottom-[16%] h-5 w-5 animate-bob text-brand-400 [animation-delay:1.6s]" />
        <Bloom className="doodle right-[16%] bottom-[12%] h-9 w-9 animate-wiggle text-mango-400/80" />
      </div>

      {/* 3D scene (or static art) sits behind the copy.
          On phones it is dialled back so it never competes with the text. */}
      <div className="pointer-events-none absolute inset-0 opacity-25 sm:opacity-100">
        {show3D ? (
          <Suspense fallback={<HeroFallback />}>
            <Hero3D animation={HERO_ANIMATION} />
          </Suspense>
        ) : (
          <HeroFallback />
        )}
      </div>

      {/* Cinematic vignette — closes in over the take as you scroll (scrubbed above). */}
      <div
        data-hero-vignette
        className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,35,32,0.5)_100%)] opacity-0"
        aria-hidden
      />

      <div className="container-page relative z-10 py-14 sm:py-20">
        <div className="hero-copy max-w-2xl">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-white/80 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-900 shadow-soft backdrop-blur-sm"
            data-reveal="fade"
          >
            <span
              className={`h-2 w-2 rounded-full ${open ? 'animate-pulse-soft bg-emerald-500' : 'bg-ink-mute/50'}`}
              aria-hidden
            />
            {open ? t('common.openNow') : t('common.closed')} · {t('common.daily')}{' '}
            {hoursSummary(lang)}
          </span>

          {/* Words arrive one at a time and lift under the pointer. The text is
              still a single heading for screen readers and crawlers. */}
          <KineticTitle as="h1" text={L(SITE.tagline)} className="mt-6 title-xl" delay={0.05} />

          <p className="mt-6 max-w-xl lead" data-reveal data-delay="0.1">
            {t('home.sub')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" data-reveal data-delay="0.18">
            <Link to="/book" className="btn-primary !px-7 !py-4 text-base" data-magnetic>
              <Icon name="calendar" className="h-5 w-5" /> {t('common.bookNow')}
            </Link>
            <a
              href={waLink('Hello, I would like to book an appointment at Care Clinic.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-emerald-700/20 bg-white !px-7 !py-4 text-base text-emerald-800 shadow-soft hover:border-emerald-700/40 hover:bg-emerald-50"
              data-magnetic
            >
              <Icon name="whatsapp" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
              {t('common.whatsapp')}
            </a>
          </div>

          {/* Trust row — the three facts a new patient actually checks. */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5" data-reveal data-delay="0.24">
            <RatingBadge />
            <a
              href={`tel:${PHONE_TEL}`}
              className="tabular inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-brand-800 shadow-soft transition duration-300 ease-brand hover:border-brand-300"
              data-magnetic
            >
              <Icon name="phone" className="h-4 w-4" /> {PHONE_DISPLAY}
            </a>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-ink-soft sm:text-sm">
            {[t('home.quick1'), t('home.quick2'), t('home.quick3')].map((q) => (
              <li key={q} className="flex items-center gap-1.5" data-reveal="fade">
                <Icon name="check" className="h-4 w-4 text-brand-600" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute sm:flex">
        {t('home.scroll')}
        <span className="h-10 w-px animate-pulse-soft bg-gradient-to-b from-brand-600 to-transparent" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stats band                                                          */
/* ------------------------------------------------------------------ */
function Stats() {
  const { t, L } = useI18n();
  const numbers = ['text-coral-600', 'text-sky-600', 'text-mango-600', 'text-grape-600'];
  const bars = ['bg-coral-500', 'bg-sky-500', 'bg-mango-400', 'bg-grape-500'];

  return (
    <section className="wash relative overflow-hidden py-12 sm:py-14">
      <Sparkle className="doodle -left-2 top-8 h-10 w-10 animate-bob text-mango-400/80" aria-hidden />
      <Sparkle className="doodle right-6 bottom-6 h-6 w-6 animate-bob text-coral-400/70 [animation-delay:1.2s]" aria-hidden />
      <div className="container-page relative">
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label.en}
              className="relative overflow-hidden rounded-3xl border border-line bg-white/85 p-5 text-center shadow-soft backdrop-blur-sm sm:p-6"
              data-reveal="3d"
              data-delay={i * 0.07}
            >
              <span className={`absolute inset-x-6 top-0 h-1 rounded-full ${bars[i % 4]}`} aria-hidden />
              <dd className={`tabular mt-2 text-4xl font-extrabold sm:text-5xl ${numbers[i % 4]}`}>
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </dd>
              <dt className="mx-auto mt-2 max-w-[18ch] text-[11px] font-bold uppercase leading-relaxed tracking-[0.12em] text-ink-mute sm:text-xs">
                {L(s.label)}
              </dt>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-center text-xs leading-relaxed text-ink-mute">{t('home.statsNote')}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Doctor teaser                                                       */
/* ------------------------------------------------------------------ */
function DoctorTeaser() {
  const { t, L } = useI18n();
  return (
    <section className="section relative overflow-hidden">
      <div className="blob -right-28 top-10 h-80 w-80 animate-drift bg-sky-200/60" aria-hidden />
      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        <div className="relative" data-reveal="left">
          {/* Coloured plates behind the panel, one step further back in Z. */}
          <div className="absolute -left-4 -top-4 h-40 w-40 rotate-6 rounded-3xl bg-accent-200/70" aria-hidden />
          <div className="absolute -bottom-5 -right-5 h-36 w-36 -rotate-6 rounded-3xl bg-coral-200/70" aria-hidden />
          <DoctorPlate doctor={DOCTOR} className="relative" />
        </div>

        <div data-reveal="right">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden />
            {t('home.doctorTitle')}
          </span>
          <h2 className="mt-5 title-lg">{t('about.doctorTitle')}</h2>
          <p className="mt-5 lead">{t('home.doctorBody')}</p>

          <dl className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-paper p-4">
              <dt className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-700">
                {t('about.qualifications')}
              </dt>
              <dd className="mt-1 font-bold text-ink">{DOCTOR.qualifications}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-4">
              <dt className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-700">
                {t('about.regNo')}
              </dt>
              <dd className="tabular mt-1 font-bold text-ink">{DOCTOR.regNo}</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/about" className="btn-ghost" data-magnetic>
              {t('nav.about')} <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <Link to="/book" className="btn-primary" data-magnetic>
              {t('common.bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why us + rating                                                     */
/* ------------------------------------------------------------------ */
function WhyAndRating() {
  const { t } = useI18n();
  const sectionRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Parallax on the decorative wash.
  useEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        gsap.to(el, {
          yPercent: speed * 40,
          ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="section wash relative overflow-hidden">
      <div className="blob -right-32 top-10 h-80 w-80 animate-drift bg-sky-300/50" data-parallax="0.25" aria-hidden />
      <div className="blob -left-24 bottom-0 h-72 w-72 animate-drift-slow bg-coral-200/60" aria-hidden />
      <div className="container-page relative">
        <SectionHeading eyebrow={SITE.shortName} title={t('home.whyTitle')} sub={t('home.whySub')} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((item, i) => (
            <div key={item.t} data-reveal="tilt-top" data-delay={i * 0.07}>
              <FlipCard
                index={`0${i + 1}`}
                icon={item.icon}
                title={t(item.t)}
                body={t(item.b)}
                tone={WHY_TONES[i % WHY_TONES.length]}
              />
            </div>
          ))}
        </div>

        {/* Aggregate rating (no individual testimonials — see /reviews) */}
        <div
          className="mt-12 grid gap-8 overflow-hidden rounded-4xl border border-line bg-white p-6 shadow-card sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"
          data-reveal="3d"
        >
          <div>
            <span className="eyebrow">
              <span className="eyebrow-dot" aria-hidden />
              {t('common.rating')}
            </span>
            <h3 className="mt-4 title-md">{t('home.ratingTitle')}</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-mute sm:text-base">
              {t('home.ratingSub', { value: RATING.value, count: RATING.count })}
            </p>
            <p className="mt-3 text-xs text-ink-mute/80">{t('reviews.noTestimonials')}</p>
          </div>
          <div className="flex flex-col items-center gap-4 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="text-center">
              <p className="tabular text-6xl font-extrabold leading-none text-ink">{RATING.value}</p>
              <div className="mt-2 flex justify-center gap-0.5 text-accent-500">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-1.5 text-xs font-semibold text-ink-mute">
                {RATING.count} {t('common.reviews')}
              </p>
            </div>
            <a href={RATING.googleUrl} target="_blank" rel="noopener noreferrer" className="btn-dark" data-magnetic>
              {t('common.seeReviews')} <Icon name="arrowUpRight" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Map + visit info                                                    */
/* ------------------------------------------------------------------ */
function MapSection() {
  const { t, lang } = useI18n();
  return (
    <section className="section relative overflow-hidden">
      <div className="container-page grid items-start gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
        <div data-reveal="left">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden />
            {t('home.mapTitle')}
          </span>
          <h2 className="mt-5 title-lg">{t('contact.findUs')}</h2>

          <address className="mt-5 not-italic leading-relaxed text-ink-mute">
            {ADDRESS.line1},<br />
            {ADDRESS.line2},<br />
            {ADDRESS.line3} – {ADDRESS.pincode}
          </address>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary" data-magnetic>
              <Icon name="mapPin" className="h-4 w-4" /> {t('contact.getDirections')}
            </a>
            <Link to="/contact" className="btn-ghost" data-magnetic>
              {t('nav.contact')}
            </Link>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft shadow-soft">
            <Icon name="clock" className="h-4 w-4 text-brand-600" />
            {t('common.daily')} {hoursSummary(lang)}
          </div>

          {/* Animated open/closed dial — the day filling up to closing time. */}
          <ReadinessIndicator className="mt-7" />

          {/* Tilted polaroid of the actual entrance — swaps in the real photo
              the moment src/assets/photos/storefront.* exists. */}
          <figure
            className="mt-7 w-full max-w-xs -rotate-2 rounded-2xl border-4 border-white bg-white p-2 shadow-soft"
            data-reveal="scale"
          >
            <img
              src={photoSrc('storefront', '/images/gallery-6.svg')}
              alt={t('home.entryPhoto')}
              loading="lazy"
              width={640}
              height={480}
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
            <figcaption className="px-1 py-2 text-xs font-bold text-ink-mute">{t('home.entryPhoto')}</figcaption>
          </figure>
        </div>

        <div className="overflow-hidden rounded-4xl border border-line shadow-card" data-reveal="right">
          <iframe
            title="Care Clinic location map"
            src={RATING.mapEmbed}
            width="100%"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[340px] w-full border-0 sm:h-[480px]"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Blog preview                                                        */
/* ------------------------------------------------------------------ */
function BlogPreview() {
  const { t, L } = useI18n();
  return (
    <section className="section relative overflow-hidden bg-sand">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow={t('nav.blog')}
            title={t('home.blogTitle')}
            sub={t('home.blogSub')}
            className="sm:max-w-2xl"
          />
          <Link to="/blog" className="btn-ghost shrink-0 self-start sm:self-auto" data-magnetic>
            {t('common.viewAll')} <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group card card-hover overflow-hidden"
              data-reveal
              data-delay={i * 0.08}
              data-magnetic
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt=""
                  width={640}
                  height={360}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover transition duration-500 ease-brand group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-700">
                  <span>{L(post.category)}</span>
                  <span className="text-ink-mute/70">· {t('common.readTime', { n: post.readMins })}</span>
                </div>
                <h3 className="mt-3 text-lg leading-snug transition group-hover:text-brand-700">{L(post.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-mute">{L(post.excerpt)}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  {t('common.learnMore')}{' '}
                  <Icon name="arrowRight" className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                         */
/* ------------------------------------------------------------------ */
function CtaBand() {
  const { t, lang } = useI18n();
  return (
    <section className="relative overflow-hidden pb-20 pt-4 sm:pb-24">
      <div className="container-page">
        <div className="sheen relative rounded-[2.5rem]" data-reveal="3d">
        <div className="wash wash-strong relative z-10 overflow-hidden rounded-[2.5rem] border border-line p-8 shadow-lift sm:p-12 lg:p-14">
          <span className="rainbow-edge absolute inset-x-0 top-0 h-1.5" aria-hidden />
          <div className="blob -right-16 -top-16 h-64 w-64 animate-drift bg-mango-300/60" aria-hidden />
          <div className="blob -bottom-20 left-10 h-56 w-56 animate-drift-slow bg-grape-300/50" aria-hidden />
          <ConfettiDots className="doodle -left-6 bottom-6 h-24 w-24 text-coral-300/70" aria-hidden />
          <Squiggle className="doodle right-10 top-10 h-6 w-24 rotate-6 text-sky-500/70" aria-hidden />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div data-reveal="left" className="max-w-2xl">
              <span className="eyebrow !border-white/70 !bg-white/80">
                <span className="eyebrow-dot" aria-hidden />
                {t('common.daily')}
              </span>
              <h2 className="mt-4 title-lg text-ink">{t('home.ctaTitle')}</h2>
              <p className="mt-3 text-ink-soft">{t('home.ctaSub')}</p>
              <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-ink-soft">
                <span className="tabular inline-flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-mango-100 text-mango-700">
                    <Icon name="phone" className="h-3.5 w-3.5" />
                  </span>
                  {PHONE_DISPLAY}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-100 text-sky-700">
                    <Icon name="clock" className="h-3.5 w-3.5" />
                  </span>
                  {t('common.daily')} {hoursSummary(lang)}
                </span>
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row" data-reveal="right">
              <Link to="/book" className="btn-primary !px-7 !py-4 text-base" data-magnetic>
                <Icon name="calendar" className="h-5 w-5" /> {t('common.bookNow')}
              </Link>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-mint-300 bg-white !px-7 !py-4 text-base text-mint-800 shadow-soft hover:border-mint-500 hover:bg-mint-50"
                data-magnetic
              >
                <Icon name="whatsapp" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                {t('common.whatsapp')}
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export default function Home() {
  useSeo({
    title: 'Clinic in Keshav Nagar, Mundhwa, Pune',
    description:
      'Care Clinic for General Medicine & Surgery, Pune — general medicine, fever & infection care, paediatrics with day-care admission, piles & minor surgery, Ayurvedic treatment and diagnostics. Open daily till 10 pm.',
    path: '/',
  });
  useReveals();

  return (
    <>
      <Hero />
      <TrustRibbon />
      <Stats />
      <ClinicScene />
      <Ticker />
      <DoctorTeaser />
      <CinemaChapter />
      <ServicesCarousel />
      <VisitTimeline />
      <WhyAndRating />
      <MapSection />
      <BlogPreview />
      <Ticker reverse />
      <CtaBand />
    </>
  );
}
