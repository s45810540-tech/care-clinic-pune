import { useId, useState } from 'react';
import Icon from './Icon';

/**
 * 3D flip card (rotateY on a preserve-3d box).
 *
 *   front = the coloured face, always readable on its own
 *   back  = the detail, revealed by hover, tap or Enter/Space
 *
 * `aria-expanded` carries the state, and the CSS never flips on focus alone, so
 * the visual state, the button state and the announcement stay in step. With
 * `prefers-reduced-motion` the two faces stack instead of rotating.
 */

const TONES = {
  brand: { face: 'from-brand-600 via-brand-700 to-brand-900', glow: 'shadow-glow-brand', soft: 'text-brand-700 bg-brand-50' },
  coral: { face: 'from-coral-500 via-coral-600 to-coral-700', glow: 'shadow-glow-coral', soft: 'text-coral-700 bg-coral-50' },
  sky: { face: 'from-sky-500 via-sky-600 to-sky-700', glow: 'shadow-glow-sky', soft: 'text-sky-700 bg-sky-50' },
  mango: { face: 'from-mango-400 via-mango-500 to-mango-600', glow: 'shadow-glow-mango', soft: 'text-mango-800 bg-mango-50' },
  grape: { face: 'from-grape-500 via-grape-600 to-grape-700', glow: 'shadow-glow-grape', soft: 'text-grape-700 bg-grape-50' },
  mint: { face: 'from-mint-400 via-mint-500 to-mint-700', glow: 'shadow-glow-brand', soft: 'text-mint-800 bg-mint-50' },
};

export default function FlipCard({ index, title, body, icon = 'check', tone = 'brand', className = '' }) {
  const [flipped, setFlipped] = useState(false);
  const id = useId();
  const t = TONES[tone] ?? TONES.brand;

  return (
    <div className={`flip h-full ${className}`} data-flipped={flipped}>
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-expanded={flipped}
        aria-describedby={`${id}-back`}
        className="flip__inner block h-full w-full rounded-3xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:ring-offset-2"
      >
        {/* Front */}
        <div
          className={`flip__side relative flex h-full min-h-[16rem] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${t.face} p-6 text-white ${t.glow}`}
        >
          <span
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/10"
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Icon name={icon} className="h-6 w-6" strokeWidth={1.8} />
            </span>
            {index && (
              <span className="text-3xl font-black leading-none text-white/35">{index}</span>
            )}
          </div>
          <div className="relative">
            <h3 className="text-xl font-extrabold leading-tight text-white">{title}</h3>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">
              <Icon name="arrowRight" className="h-3.5 w-3.5" /> Read
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          id={`${id}-back`}
          className="flip__side flip__back flex h-full min-h-[16rem] flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-card"
        >
          <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] ${t.soft}`}>
            <Icon name={icon} className="h-3.5 w-3.5" /> {title}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{body}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">
            <Icon name="arrowLeft" className="h-3.5 w-3.5" /> Back
          </span>
        </div>
      </button>
    </div>
  );
}
