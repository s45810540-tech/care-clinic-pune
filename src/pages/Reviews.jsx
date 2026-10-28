import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader } from '../components/ui';
import { RATING, SITE, ADDRESS } from '../data/site';
import Icon from '../components/Icon';
import { Link } from 'react-router-dom';

/**
 * Patient reviews page.
 *
 * ⚠️ COMPLIANCE: Indian medical advertising rules (see MCI/NCI guidelines and
 * the Consumer Protection Act 2019) restrict publishing patient testimonials
 * and superlatives in a doctor's advertising. This page therefore shows ONLY
 * the aggregate rating Google displays for the listing and links out to it.
 * Do not add named quotes, star ratings from individuals, or "best doctor" copy.
 */
export default function Reviews() {
  const { t } = useI18n();
  useSeo({
    title: 'Patient reviews',
    description: `Aggregate Google rating of ${RATING.value} from ${RATING.count} reviews for ${SITE.name}, Keshav Nagar, Mundhwa, Pune.`,
    path: '/reviews',
  });
  useReveals();

  return (
    <>
      <PageHeader eyebrow={t('common.rating')} title={t('reviews.title')} sub={t('reviews.sub')} />

      <section className="container-page py-14 sm:py-20">
        {/* Aggregate score card */}
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-brand-100 bg-white p-8 text-center shadow-card sm:p-12" data-reveal="scale">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-soft ring-1 ring-brand-100">
            {/* Google "G" — [PLACEHOLDER] replace with the official Google logo asset if preferred */}
            <span className="text-3xl font-extrabold text-[#4285F4]">G</span>
          </div>

          <p className="mt-6 text-6xl font-extrabold text-ink sm:text-7xl">{RATING.value}</p>

          <div className="mt-3 flex justify-center gap-1.5 text-accent-500" aria-label={`${RATING.value} out of 5`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Icon key={i} name="star" className="h-7 w-7" fill="currentColor" strokeWidth={0} />
            ))}
          </div>

          <p className="mt-3 font-semibold text-ink-mute">
            {RATING.count} {t('common.reviews')}
          </p>

          <a
            href={RATING.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-7 !px-7 !py-4 text-base"
            data-magnetic
          >
            {t('common.seeReviews')} <Icon name="arrowUpRight" className="h-5 w-5" />
          </a>

          <p className="mt-6 text-xs text-ink-mute/80">
            Opens the public Google listing for {SITE.shortName}, {ADDRESS.line3}.
          </p>
        </div>

        {/* Why there are no testimonials on this page */}
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-accent-200 bg-accent-50 p-6 sm:p-8" data-reveal>
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-accent-600">
              <Icon name="shield" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl">{t('reviews.noTestimonials')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t('reviews.compliance')}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-center" data-reveal>
          <Link to="/contact" className="btn-ghost" data-magnetic>
            {t('contact.getDirections')} <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
