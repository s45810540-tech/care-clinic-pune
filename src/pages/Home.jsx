import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { useReveals, gsap, ScrollTrigger } from '../hooks/useScroll';
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
import { POSTS, L } from '../data/content';
import { photoSrc } from '../data/photos';
import { isOpenNow, formatTime } from '../utils/clinic';
import { HOURS } from '../data/site';
import Icon from '../components/Icon';
import { Sparkle, Flower, ConfettiDots, Cloud, Leaf, Bloom } from '../components/Stickers';
import { SectionHeading, RatingBadge } from '../components/ui';
import Counter from '../components/home/Counter';
import ServicesCarousel from '../components/home/ServicesCarousel';
import CinemaChapter from '../components/home/CinemaChapter';
import VisitTimeline from '../components/home/VisitTimeline';
import HeroFallback from '../components/home/HeroFallback';
import ReadinessIndicator from '../components/ReadinessIndicator';

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
  const { t, L } = useI18n();
  const show3D = useShouldLoad3D();
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const [beat, setBeat] = useState(0);

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
        .fromTo('[data-hero-vignette]', { opacity: 0 }, { opacity: 0.6, duration: 0.6, ease: 'none' }, 0)
        .to('[data-hero-vignette]', { opacity: 0.18, duration: 0.4, ease: 'none' }, 0.6);
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  // Chapter meter — same scroll runway as the 3D camera rig (see Hero3D), so
  // 01/02/03 always line up with the shot's establish → push-in → pull-out.
  useEffect(() => {
    if (reduced) return undefined;
    const onScroll = () => {
      const runway = Math.max(400, (window.innerHeight || 1) - 96); // 96px header
      const p = Math.min(1, Math.max(0, window.scrollY / runway));
      setBeat(Math.min(2, Math.floor(p * 3)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100dvh-96px)] flex-col justify-center overflow-hidden bg-gradient-to-b from-brand-50 via-white to-accent-50/50"
    >
      {/* Decorative background layers (parallax + fallback art) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-300/60 blur-3xl" data-parallax="0.2" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-200/70 blur-3xl" data-parallax="0.3" />
        <div className="absolute -right-10 top-1/3 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" data-parallax="0.18" />
        <div className="absolute inset-0 grain opacity-60" />

        {/* Playful doodles — pure decoration, behind the copy, aria-hidden */}
        <Sparkle className="absolute left-[54%] top-14 h-8 w-8 animate-floaty text-accent-400" style={{ animationDelay: '0.6s' }} />
        <Sparkle className="absolute right-[14%] top-44 hidden h-5 w-5 animate-floaty text-sky-400 sm:block" style={{ animationDelay: '1.4s' }} />
        <Flower className="absolute bottom-32 right-10 hidden h-7 w-7 rotate-12 text-rose-300 lg:block" />
        <ConfettiDots className="absolute left-[47%] top-1/3 hidden h-36 w-36 text-brand-300/70 lg:block" />
        <Cloud className="absolute left-[58%] top-24 hidden h-14 w-24 animate-floaty text-white opacity-80 drop-shadow-sm lg:block" style={{ animationDelay: '1.2s' }} />
        <Leaf className="absolute bottom-24 left-[52%] hidden h-8 w-8 -rotate-12 animate-floaty text-emerald-300 lg:block" style={{ animationDelay: '2s' }} />
        <Bloom className="absolute right-[38%] top-1/2 hidden h-9 w-9 animate-floaty xl:block" style={{ animationDelay: '1.6s' }} />
      </div>

      {/* 3D scene (or static art) sits behind the copy.
          On phones it is dialled back so it never competes with the text. */}
      <div className="pointer-events-none absolute inset-0 opacity-30 sm:opacity-100">
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
        className="pointer-events-none absolute inset-0 z-[5] opacity-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(4,25,24,0.55)_100%)]"
        aria-hidden
      />

      {/* Shot-chapter meter, desktop only (decorative). */}
      <div
        className="pointer-events-none absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
        aria-hidden
      >
        {['01', '02', '03'].map((n, i) => (
          <span key={n} className="flex flex-col items-center gap-2">
            <span
              className={`text-[10px] font-extrabold tracking-[0.25em] transition-colors duration-300 ${
                beat === i ? 'text-brand-700' : 'text-ink-mute/40'
              }`}
            >
              {n}
            </span>
            <span
              className={`h-8 w-px transition-all duration-300 ${
                beat === i ? 'bg-brand-600' : 'bg-brand-200'
              }`}
            />
          </span>
        ))}
      </div>

      <div className="container-page relative z-10 py-20 sm:py-24">
        <div className="hero-copy max-w-2xl">
          <span className="eyebrow animate-fade-up" data-reveal="fade">
            <span className={`h-2 w-2 rounded-full ${isOpenNow() ? 'bg-emerald-500 animate-pulse-soft' : 'bg-slate-400'}`} />
            {t('home.eyebrow')}
          </span>

          <h1
            className="mt-6 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl"
            data-reveal
          >
            {L(SITE.tagline)}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-mute sm:text-lg" data-reveal data-delay="0.1">
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
              className="btn bg-emerald-700 text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.8)] hover:bg-emerald-800 !px-7 !py-4 text-base"
              data-magnetic
            >
              <Icon name="whatsapp" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
              {t('common.whatsapp')}
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-ink-soft sm:text-sm">
            {[t('home.quick1'), t('home.quick2'), t('home.quick3')].map((q) => (
              <li key={q} className="flex items-center gap-1.5" data-reveal="fade">
                <Icon name="check" className="h-4 w-4 text-brand-600" />
                {q}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3" data-reveal data-delay="0.24">
            <RatingBadge />
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-brand-800 transition hover:border-brand-400"
              data-magnetic
            >
              <Icon name="phone" className="h-4 w-4" /> {PHONE_DISPLAY}
            </a>
          </div>
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
  return (
    <section className="relative border-y border-brand-100 bg-white py-12">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label.en} className="text-center lg:text-left" data-reveal>
              {/* One bright tone per stat keeps the band playful while each
                  colour still clears AA at this size. */}
              <p
                className={`text-4xl font-extrabold ${['text-brand-700', 'text-accent-600', 'text-sky-600', 'text-rose-600'][i]} sm:text-5xl`}
              >
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink-mute sm:text-sm">
                {L(s.label)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ink-mute">{t('home.statsNote')}</p>
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
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative" data-reveal="left">
          <div className="absolute -left-6 -top-6 h-40 w-40 rounded-3xl bg-accent-200" aria-hidden />
          <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-3xl bg-sky-200" aria-hidden />
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 shadow-soft">
            <img
              src={DOCTOR.photo}
              alt={`${DOCTOR.name} — [PLACEHOLDER photograph]`}
              width={800}
              height={1000}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
              <p className="text-sm font-extrabold text-ink">{DOCTOR.name}</p>
              <p className="text-xs text-ink-mute">{L(DOCTOR.role)}</p>
            </div>
          </div>
        </div>

        <div data-reveal="right">
          <span className="eyebrow">{t('home.doctorTitle')}</span>
          {/* Section-title scale — see the type hierarchy documented in components/ui.jsx */}
          <h2 className="mt-5 text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">{t('about.doctorTitle')}</h2>
          <p className="mt-5 text-base leading-relaxed text-ink-mute sm:text-lg">{t('home.doctorBody')}</p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="card p-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-brand-700">{t('about.qualifications')}</dt>
              <dd className="mt-1 font-bold text-ink">{DOCTOR.qualifications}</dd>
            </div>
            <div className="card p-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-brand-700">{t('about.regNo')}</dt>
              <dd className="mt-1 font-bold text-ink">{DOCTOR.regNo}</dd>
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
/* Why us + rating + map                                               */
/* ------------------------------------------------------------------ */
function WhyAndRating() {
  const { t, L } = useI18n();
  const sectionRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Parallax on the decorative blob.
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
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50/60 py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-accent-100/70 blur-3xl" data-parallax="0.25" />
      <div className="container-page relative">
        <SectionHeading eyebrow={SITE.shortName} title={t('home.whyTitle')} sub={t('home.whySub')} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((item, i) => (
            <article
              key={item.t}
              className="card p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand-300"
              data-reveal
              data-delay={i * 0.07}
              data-magnetic
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl ${[
                  'bg-brand-100 text-brand-700',
                  'bg-accent-100 text-accent-700',
                  'bg-sky-100 text-sky-700',
                  'bg-rose-100 text-rose-700',
                ][i]}`}
              >
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg">{t(item.t)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-mute">{t(item.b)}</p>
            </article>
          ))}
        </div>

        {/* Aggregate rating (no individual testimonials — see /reviews) */}
        <div className="mt-14 grid gap-6 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div data-reveal="left">
            <span className="eyebrow">{t('common.rating')}</span>
            <h3 className="mt-4 text-2xl sm:text-3xl">{t('home.ratingTitle')}</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-mute sm:text-base">
              {t('home.ratingSub', { value: RATING.value, count: RATING.count })}
            </p>
            <p className="mt-3 text-xs text-ink-mute/80">{t('reviews.noTestimonials')}</p>
          </div>
          <div className="flex flex-col items-center gap-4" data-reveal="right">
            <div className="text-center">
              <p className="text-6xl font-extrabold text-ink">{RATING.value}</p>
              <div className="mt-1 flex justify-center gap-0.5 text-accent-500">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-ink-mute">
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

function MapSection() {
  const { t } = useI18n();
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div data-reveal="left">
          <span className="eyebrow">{t('home.mapTitle')}</span>
          <h2 className="mt-5 text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">{t('contact.findUs')}</h2>
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

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <Icon name="clock" className="h-4 w-4 text-brand-600" />
            {t('common.daily')} {formatTime(HOURS.openingTime)} – {formatTime(HOURS.closingTime)}
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

        <div className="overflow-hidden rounded-[2rem] border border-brand-100 shadow-card" data-reveal="right">
          <iframe
            title="Care Clinic location map"
            src={RATING.mapEmbed}
            width="100%"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full border-0 sm:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  const { t, L, lang } = useI18n();
  return (
    <section className="bg-sand py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading eyebrow={t('nav.blog')} title={t('home.blogTitle')} sub={t('home.blogSub')} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group card overflow-hidden transition duration-300 hover:-translate-y-1.5"
              data-reveal
              data-delay={i * 0.08}
              data-magnetic
            >
              <img
                src={post.image}
                alt=""
                width={640}
                height={360}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                  <span>{L(post.category)}</span>
                  <span className="text-ink-mute">· {t('common.readTime', { n: post.readMins })}</span>
                </div>
                <h3 className="mt-3 text-lg leading-snug transition group-hover:text-brand-700">{L(post.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-mute">{L(post.excerpt)}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  {t('common.learnMore')} <Icon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-brand-900 py-16 text-white sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_300px_at_20%_0%,rgba(249,155,32,0.28),transparent_60%),radial-gradient(600px_300px_at_90%_100%,rgba(20,184,166,0.5),transparent_60%),radial-gradient(520px_280px_at_55%_30%,rgba(244,114,182,0.16),transparent_65%)]" />
      <div className="container-page relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div data-reveal="left">
          {/* explicit white — the base h1–h4 rule (text-ink) beats inherited color */}
          <h2 className="max-w-2xl text-3xl leading-[1.1] text-white sm:text-4xl lg:text-5xl">{t('home.ctaTitle')}</h2>
          <p className="mt-3 max-w-xl text-brand-100/85">{t('home.ctaSub')}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row" data-reveal="right">
          <Link to="/book" className="btn bg-accent-500 !px-7 !py-4 text-base text-ink hover:bg-accent-400" data-magnetic>
            <Icon name="calendar" className="h-5 w-5" /> {t('common.bookNow')}
          </Link>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn border border-white/30 !px-7 !py-4 text-base text-white hover:bg-white/10"
            data-magnetic
          >
            <Icon name="whatsapp" className="h-5 w-5" fill="currentColor" strokeWidth={0} />
            {t('common.whatsapp')}
          </a>
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
      <Stats />
      <DoctorTeaser />
      <CinemaChapter />
      <ServicesCarousel />
      <VisitTimeline />
      <WhyAndRating />
      <MapSection />
      <BlogPreview />
      <CtaBand />
    </>
  );
}
