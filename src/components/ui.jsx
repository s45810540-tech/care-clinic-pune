import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { RATING } from '../data/site';
import Icon from './Icon';

/**
 * ── Type hierarchy (one system for the whole site) ───────────────────────
 * 1. Page title (h1):        .title-xl on the home hero, .title-lg+ on PageHeader
 * 2. Section title (h2):     .title-lg  (SectionHeading is the canonical one)
 * 3. Panel / feature (h3):   .title-md
 * 4. Card title (h3):        text-xl (text-lg in compact cards)
 * 5. Meta / label:           .eyebrow, text-[11px] uppercase tracking-[0.16em]
 *
 * Semantic level follows visual level — cards never use h2, and a page never
 * jumps from h1 straight to h3.
 */

/** Short two-tone rule — replaces the hand-drawn squiggle that used to sit under every title. */
function Rule({ align = 'center' }) {
  const self = align === 'left' ? 'self-start' : align === 'right' ? 'self-end' : 'self-center';
  return (
    <span className={`flex items-center gap-1 ${self}`} aria-hidden data-reveal="fade">
      <span className="h-[3px] w-8 rounded-full bg-brand-700" />
      <span className="h-[3px] w-3 rounded-full bg-accent-400" />
    </span>
  );
}

/** Section eyebrow + title + optional subtitle, used on every page. */
export function SectionHeading({ eyebrow, title, sub, align = 'center', as: Tag = 'h2', className = '' }) {
  const alignCls =
    align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center';

  return (
    <div className={`flex flex-col gap-4 ${alignCls} ${className}`}>
      {eyebrow && (
        <span className="eyebrow" data-reveal="fade">
          <span className="eyebrow-dot" aria-hidden />
          {eyebrow}
        </span>
      )}
      <Tag className={`max-w-3xl title-lg ${align === 'center' ? 'mx-auto' : ''}`} data-reveal>
        {title}
      </Tag>
      <Rule align={align} />
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
  const cls = size === 'lg' ? 'text-base px-5 py-2.5' : 'text-sm px-4 py-2';
  return (
    <a
      href={href || RATING.googleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 font-bold text-ink transition
                  duration-300 ease-brand hover:border-accent-300 hover:bg-accent-100 ${cls}`}
      data-magnetic
    >
      <span className="flex items-center gap-0.5 text-accent-500">
        {[0, 1, 2, 3, 4].map((i) => (
          <Icon key={i} name="star" className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span className="tabular">{RATING.value}</span>
      {showCount && (
        <span className="font-semibold text-ink-mute">
          ({RATING.count} {t('common.reviews')})
        </span>
      )}
      <Icon name="arrowUpRight" className="h-4 w-4 text-ink-mute" />
    </a>
  );
}

/** Small "placeholder" chip the client can spot in the preview. */
export function PlaceholderTag({ children = 'Client to replace' }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-md bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-800">
      [ {children} ]
    </span>
  );
}

/**
 * Page header used by interior pages: eyebrow (with optional back link),
 * title, subtitle and whatever actions the page passes as children.
 */
export function PageHeader({ eyebrow, title, sub, children, backTo, backLabel }) {
  return (
    <section className="wash wash-strong relative isolate overflow-hidden border-b border-line">
      {/* Colour blooms sit behind the text on a white base, so contrast never
          depends on where a blob happens to be. */}
      <div className="blob -right-20 -top-10 h-72 w-72 animate-drift bg-sky-300/50" aria-hidden />
      <div className="blob -left-24 bottom-0 h-64 w-64 animate-drift-slow bg-coral-200/55" aria-hidden />

      <div className="container-page relative pb-10 pt-10 sm:pb-14 sm:pt-14">
        {backTo && (
          <Link
            to={backTo}
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-700 transition hover:text-brand-900"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
        {eyebrow && (
          <span className="eyebrow" data-reveal="fade">
            <span className="eyebrow-dot" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 max-w-4xl title-lg" data-reveal>
          {title}
        </h1>
        {sub && (
          <p className="mt-4 max-w-2xl lead" data-reveal data-delay="0.08">
            {sub}
          </p>
        )}
        {children}
      </div>
      <span className="rainbow-edge absolute inset-x-0 bottom-0 h-1" aria-hidden />
    </section>
  );
}
