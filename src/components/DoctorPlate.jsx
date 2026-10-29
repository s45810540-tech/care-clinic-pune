import { useI18n } from '../i18n/I18nContext';
import Icon from './Icon';
import Tilt from './Tilt';
import { Sparkle } from './Stickers';

/**
 * Consultant panel.
 *
 * There is no photograph of Dr. Kamble yet, and a stock face or a grey
 * "image unavailable" box would be worse than neither. So the default is a
 * designed credential plate: initials, name, role and the registration number
 * a patient can actually verify on screen.
 *
 * When a real photograph is dropped in (`DOCTOR.photo` pointing at a .jpg,
 * .png or .webp), the same component renders the portrait instead — no other
 * file needs to change.
 */
const isRealPhoto = (src = '') => /\.(jpe?g|png|webp|avif)(\?.*)?$/i.test(src);

export default function DoctorPlate({ doctor, className = '', compact = false }) {
  const { L } = useI18n();
  const initials = doctor.name
    .replace(/^Dr\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <Tilt max={6} className={`group relative ${className}`}>
      {/* Deep solid base, not just a gradient child: the chips stay readable
          even if the decorative gradient layer never paints. */}
      <div data-spotlight className="spotlight relative overflow-hidden rounded-4xl border border-brand-900/20 bg-brand-900 shadow-lift">
        {isRealPhoto(doctor.photo) ? (
          <img
            src={doctor.photo}
            alt={doctor.name}
            width={800}
            height={1000}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-6 sm:p-7">
            {/* Layered ground: forest block plus a lime arc, entirely type-driven. */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900"
              aria-hidden
            />
            <div
              className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-400/25 blur-2xl"
              aria-hidden
            />
            <div
              className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgba(6,31,23,0.85),transparent)]"
              aria-hidden
            />

            <div className="relative flex items-start justify-between">
              <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80 ring-1 ring-inset ring-white/20">
                Consultant
              </span>
              <Sparkle className="h-6 w-6 animate-bob text-accent-300" aria-hidden />
            </div>

            {/* Initials do the job a missing portrait would, without pretending. */}
            <div className="relative flex flex-1 items-center justify-center">
              <span
                className={`font-display font-extrabold leading-none tracking-tight text-white/95 ${
                  compact ? 'text-7xl' : 'text-8xl sm:text-9xl'
                }`}
                aria-hidden
              >
                {initials}
              </span>
            </div>

            <div className="relative">
              <p className="font-display text-xl font-extrabold text-white sm:text-2xl">{doctor.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-accent-200">{L(doctor.role)}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-bold text-white ring-1 ring-inset ring-white/20">
                  {doctor.qualifications}
                </span>
                <span className="tabular rounded-full bg-accent-400 px-2.5 py-1 text-[11px] font-extrabold text-brand-950">
                  Reg. {doctor.regNo}
                </span>
              </div>
            </div>
          </div>
        )}

        {isRealPhoto(doctor.photo) && (
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/60 bg-white/92 px-4 py-3 shadow-soft backdrop-blur">
            <p className="text-sm font-extrabold text-ink">{doctor.name}</p>
            <p className="mt-0.5 text-xs text-ink-mute">{L(doctor.role)}</p>
          </div>
        )}
      </div>

      {/* Outside the card so it reads as a caption, not a badge. */}
      <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-mute">
        <Icon name="shield" className="h-3.5 w-3.5 text-brand-600" />
        Registration number is printed on the clinic signboard — check it against your receipt.
      </p>
    </Tilt>
  );
}
