import Icon from './Icon';
import { useI18n } from '../i18n/I18nContext';

/**
 * "Trust ribbon" — a slow, endless strip of short factual reassurances that sits
 * directly under the hero.
 *
 * Playful and professional at once: one very slow horizontal drift (38s for the
 * full loop), it pauses the moment a pointer is over it, and every pill is a
 * fact the clinic can stand behind — hours, walk-ins, languages, tests, safety,
 * the doctor herself. Nothing invented.
 *
 * Under `prefers-reduced-motion` the drift stops and the pills wrap into a
 * static, centred list.
 */
const ITEMS = [
  { icon: 'clock', key: 'common.daily' },
  { icon: 'users', key: 'home.quick2' },
  { icon: 'globe', key: 'home.quick3' },
  { icon: 'shield', key: 'home.why1T' },
  { icon: 'stethoscope', key: 'home.doctorTitle' },
];

const TONES = [
  'bg-coral-50 text-coral-700 ring-coral-200',
  'bg-sky-50 text-sky-700 ring-sky-200',
  'bg-mango-50 text-mango-700 ring-mango-200',
  'bg-grape-50 text-grape-700 ring-grape-200',
  'bg-mint-50 text-mint-700 ring-mint-200',
  'bg-brand-50 text-brand-700 ring-brand-200',
];

export default function TrustRibbon() {
  const { t } = useI18n();

  return (
    <section className="ribbon relative overflow-hidden border-y border-line bg-white/70 py-4">
      {/* Edge fades keep the drift from reading as a cropped screenshot. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-24" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-24" aria-hidden />

      <ul className="ribbon-track items-center gap-3">
        {ITEMS.map((item, i) => (
          <li
            key={item.key}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold ring-1 ring-inset ${TONES[i % TONES.length]}`}
          >
            <Icon name={item.icon} className="h-4 w-4" strokeWidth={1.8} />
            {t(item.key)}
          </li>
        ))}
        {/* Second half: identical pills, hidden from assistive tech, so the
            -50% translation loops with no visible seam. */}
        {ITEMS.map((item, i) => (
          <li
            key={`dup-${item.key}`}
            aria-hidden
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold ring-1 ring-inset ${TONES[i % TONES.length]}`}
          >
            <Icon name={item.icon} className="h-4 w-4" strokeWidth={1.8} />
            {t(item.key)}
          </li>
        ))}
      </ul>
    </section>
  );
}
