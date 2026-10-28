import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader } from '../components/ui';
import { GALLERY } from '../data/content';
import { hasRealPhotos } from '../data/photos';
import Icon from '../components/Icon';

/** Photo gallery with a minimal lightbox (keyboard + backdrop close). */
export default function Gallery() {
  const { t, L } = useI18n();
  const [active, setActive] = useState(null);

  useSeo({
    title: 'Gallery',
    description: 'Photographs of Care Clinic, Keshav Nagar, Mundhwa, Pune — reception, consultation room and day-care area.',
    path: '/gallery',
  });
  useReveals();

  // Close on Escape; lock scroll while open.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = active !== null ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <>
      <PageHeader eyebrow={t('gallery.title')} title={t('gallery.title')} sub={t('gallery.sub')} />

      <section className="container-page py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden rounded-3xl border text-left shadow-card transition hover:-translate-y-1 focus-visible:outline-offset-4 ${[
                'border-brand-200',
                'border-accent-200',
                'border-sky-200',
                'border-rose-200',
                'border-violet-200',
                'border-brand-200',
              ][i]}`}
              data-reveal
              data-delay={(i % 3) * 0.06}
              data-magnetic
            >
              <img
                src={item.src}
                alt={L(item.caption)}
                width={640}
                height={480}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-brand-900/90 to-transparent p-4 text-sm font-bold text-white">
                {L(item.caption)}
                <Icon name="arrowUpRight" className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>

        {/* Only nag about placeholders while none of the real photos exist. */}
        {!hasRealPhotos && (
          <p className="mt-8 text-center text-xs text-ink-mute">
            [PLACEHOLDER] Images 1–4 are mock-ups. Drop the clinic photographs into
            src/assets/photos/ (see its README) and they replace these automatically.
          </p>
        )}
      </section>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={L(GALLERY[active].caption)}
          onClick={(e) => e.target === e.currentTarget && setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={t('gallery.close')}
          >
            <Icon name="close" className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => setActive((a) => (a - 1 + GALLERY.length) % GALLERY.length)}
            className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-8"
            aria-label="Previous"
          >
            <Icon name="chevronLeft" className="h-6 w-6" />
          </button>

          <figure className="max-h-full max-w-4xl">
            <img src={GALLERY[active].src} alt={L(GALLERY[active].caption)} className="max-h-[75vh] w-full rounded-2xl object-contain" />
            <figcaption className="mt-4 text-center text-sm font-semibold text-white/90">
              {L(GALLERY[active].caption)}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={() => setActive((a) => (a + 1) % GALLERY.length)}
            className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-8"
            aria-label="Next"
          >
            <Icon name="chevronRight" className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
