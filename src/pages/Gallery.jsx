import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useSeo } from '../utils/seo';
import { useReveals } from '../hooks/useScroll';
import { PageHeader } from '../components/ui';
import { GALLERY } from '../data/content';
import { hasRealPhotos } from '../data/photos';
import Icon from '../components/Icon';
import Tilt from '../components/Tilt';

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

      <section className="container-page section">
        <div className="stage-3d grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((item, i) => (
            <Tilt
              key={item.src}
              max={7}
              className="rounded-3xl"
              data-reveal
              data-delay={(i % 3) * 0.06}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group relative block w-full overflow-hidden rounded-3xl border border-line bg-white text-left shadow-card
                           transition-shadow duration-300 hover:shadow-lift focus-visible:outline-offset-4"
              >
                <img
                  src={item.src}
                  alt={L(item.caption)}
                  width={640}
                  height={480}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition duration-500 ease-brand group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-brand-950/90 via-brand-950/40 to-transparent p-4 text-sm font-bold text-white">
                  {L(item.caption)}
                  <Icon name="arrowUpRight" className="h-4 w-4 shrink-0" />
                </span>
              </button>
            </Tilt>
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
