import { useI18n } from '../i18n/I18nContext';
import { RATING } from '../data/site';
import Icon from './Icon';
import { Squiggle, Sparkle, Cloud, Leaf } from './Stickers';

/**
 * ── Type hierarchy (one system for the whole site) ───────────────────────
 * 1. Page title (h1):        PageHeader  → text-4xl → 5xl → 6xl
 *    (home hero h1 is a size up: 2.6rem → 6xl → 7xl)
 * 2. Section title (h2):     text-3xl → 4xl → 5xl, leading-[1.1]
 *    — SectionHeading below is the canonical instance; standalone h2s copy
 *      this exact scale so every section peer matches (incl. white-on-dark).
 * 3. Panel / feature (h3):   text-2xl → 3xl      (e.g. rating, success screen)
 * 4. Card title (h3):        text-xl (text-lg in compact cards)
 * 5. Meta / label (h3–h4):   text-sm uppercase tracking-[0.14–0.16em]
 * Semantic level follows visual level — cards never use h2.
 */

/** Section eyebrow + title + optional subtitle, used on every page. */
export function SectionHeading({ eyebrow, title, sub, align = 'center', as: Tag = 'h2', className = '' }) {
  const alignCls =
    align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center';

  return (
    <div className={`flex flex-col gap-4 ${alignCls} ${className}`}>
      {eyebrow && <span className="eyebrow" data-reveal="fade">{eyebrow}</span>}
      <Tag className="max-w-3xl text-3xl leading-[1.1] sm:text-4xl lg:text-5xl" data-reveal>
        {title}
      </Tag>
      {/* Hand-drawn accent squiggle under every section title — the one
          playful gesture that repeats across the whole site. */}
      <Squiggle
        className={`-mt-1 h-3 w-16 text-accent-400 sm:w-20 ${align === 'left' ? '' : align === 'right' ? 'self-end' : 'self-center'}`}
        data-reveal="fade"
      />
      {sub && (
        <p className="max-w-2xl text-base leading-relaxed text-ink-mute sm:text-lg" data-reveal data-delay="0.08">
          {sub}
        </p>
      )}
    </div>
  );
}

/** Aggregate Google rating block — no individual testimonials (see /reviews). */
export function RatingBadge({ size = 'md', showCount = true, href }) {
  const { t } = useI18n();
  const cls = size === 'lg' ? 'text-base' : 'text-sm';
  return (
    <a
      href={href || RATING.googleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-2 font-bold text-ink ${cls}`}
      data-magnetic
    >
      <span className="flex items-center gap-0.5 text-accent-500">
        {[0, 1, 2, 3, 4].map((i) => (
          <Icon key={i} name="star" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      {RATING.value}
      {showCount && <span className="font-semibold text-ink-mute">({RATING.count} {t('common.reviews')})</span>}
      <Icon name="arrowUpRight" className="h-4 w-4 text-ink-mute" />
    </a>
  );
}

/** Small "placeholder" chip the client can spot in the preview. */
export function PlaceholderTag({ children = 'Client to replace' }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
      [ {children} ]
    </span>
  );
}

/** Page header used by interior pages (title, subtitle, breadcrumb). */
export function PageHeader({ eyebrow, title, sub, children }) {
  return (
    <section className="relative overflow-hidden border-b border-brand-100 bg-gradient-to-b from-brand-50 via-white to-accent-50/50">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-200/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-0 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />
      {/* Playful corner doodles */}
      <Sparkle className="absolute right-[12%] top-8 h-7 w-7 animate-floaty text-accent-400" style={{ animationDelay: '0.8s' }} />
      <Sparkle className="absolute left-[6%] bottom-8 hidden h-5 w-5 animate-floaty text-brand-400 sm:block" />
      <Cloud className="absolute right-[6%] bottom-6 hidden h-12 w-20 animate-floaty text-white opacity-80 drop-shadow-sm md:block" style={{ animationDelay: '1.5s' }} />
      <Leaf className="absolute left-[16%] top-8 hidden h-7 w-7 rotate-[18deg] animate-floaty text-emerald-300 md:block" style={{ animationDelay: '2.1s' }} />
      <div className="container-page relative py-14 sm:py-20">
        <span className="eyebrow" data-reveal="fade">
          {eyebrow}
        </span>
        <h1 className="mt-5 max-w-4xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl" data-reveal>
          {title}
        </h1>
        {sub && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-mute sm:text-lg" data-reveal data-delay="0.08">
            {sub}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
