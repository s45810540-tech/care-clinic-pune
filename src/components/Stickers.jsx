/**
 * Decorative doodles — the “playful” half of the design language.
 *
 * Everything here is presentational and `aria-hidden`: sparkles, squiggles,
 * clouds, leaves and confetti that sit behind or beside content. They're
 * hand-built SVG (≈1 kB total, zero requests) — no icon-font or image files —
 * and their floaty animation is killed by the site-wide
 * `prefers-reduced-motion` rule in index.css.
 *
 * Every sticker accepts normal SVG props (className, style…) so pages can
 * position, tilt and delay them freely.
 */

/** Four-point sparkle/star. */
export function Sparkle({ className = '', ...rest }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false" {...rest}>
      <path
        d="M12 1.5c1.1 6 4.4 9.4 10.5 10.5-6.1 1.1-9.4 4.4-10.5 10.5C10.9 16.4 7.6 13 1.5 12 7.6 10.9 10.9 7.6 12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Hand-drawn style wavy underline. */
export function Squiggle({ className = '', ...rest }) {
  return (
    <svg viewBox="0 0 120 14" className={className} aria-hidden focusable="false" fill="none" {...rest}>
      <path
        d="M3 10C18 -1 36 15 56 8s40-11 61 1"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Scatter of confetti dots for backgrounds. */
export function ConfettiDots({ className = '', ...rest }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden focusable="false" {...rest}>
      <circle cx="14" cy="20" r="6" fill="currentColor" opacity="0.9" />
      <circle cx="96" cy="12" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="66" cy="58" r="7" fill="currentColor" opacity="0.8" />
      <circle cx="108" cy="78" r="5" fill="currentColor" opacity="0.6" />
      <circle cx="30" cy="92" r="4" fill="currentColor" opacity="0.7" />
      <path d="M44 26l6 6M50 26l-6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 62l6 6M22 62l-6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Six-petal asterisk flower (line style, for tiny accents). */
export function Flower({ className = '', ...rest }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false" {...rest}>
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M12 2v20" />
        <path d="M3.3 7v10" transform="rotate(60 12 12)" />
        <path d="M3.3 7v10" transform="rotate(-60 12 12)" />
      </g>
    </svg>
  );
}

/**
 * Cartoon flower — five rounded two-tone petals around a warm centre.
 * Uses its own fixed palette (rose petals, amber heart) so it stays colourful
 * wherever it is placed; `className` still controls size/position/tint via
 * opacity.
 */
export function Bloom({ className = '', ...rest }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false" {...rest}>
      <g>
        {petals.map((deg) => (
          <ellipse
            key={deg}
            cx="24"
            cy="11.5"
            rx="6.4"
            ry="9"
            fill={deg % 144 === 0 ? '#FB7185' : '#FDA4AF'}
            transform={`rotate(${deg} 24 24)`}
          />
        ))}
        <circle cx="24" cy="24" r="6.6" fill="#FBBF24" />
        <circle cx="22.2" cy="22.4" r="2.1" fill="#FDE68A" />
      </g>
    </svg>
  );
}

/** Puffy cartoon cloud — soft white body with a sky-blue underside. */
export function Cloud({ className = '', ...rest }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden focusable="false" {...rest}>
      {/* underside shadow */}
      <ellipse cx="30" cy="31" rx="26" ry="6.5" fill="#7DD3FC" opacity="0.45" />
      {/* puffy body: three overlapping circles + a base bar, unioned by colour */}
      <g fill="#FFFFFF">
        <circle cx="20" cy="24" r="11" />
        <circle cx="34" cy="19" r="13.5" />
        <circle cx="46" cy="26" r="9.5" />
        <rect x="12" y="24" width="38" height="10" rx="5" />
      </g>
      {/* top highlight */}
      <ellipse cx="30" cy="14" rx="7" ry="3.4" fill="#F0FDFA" opacity="0.9" />
    </svg>
  );
}

/** Single leaf with a vein — two-tone green, slightly tilted. */
export function Leaf({ className = '', ...rest }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false" {...rest}>
      <path
        d="M27 4c1.5 12-4.5 21-13.5 22.5C9 27.2 5 25 5 25S3.8 12.5 12 6.5C17 2.8 27 4 27 4Z"
        fill="#34D399"
      />
      <path
        d="M27 4c1.5 12-4.5 21-13.5 22.5C15 25.7 12 23 12 23s7-9.5 9.5-15C23 5 27 4 27 4Z"
        fill="#10B981"
      />
      <path
        d="M6.5 26.5C10 18 16.5 10.5 24 6.5"
        stroke="#065F46"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Playful rounded tree — two-tone canopy on a warm trunk. */
export function Tree({ className = '', ...rest }) {
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden focusable="false" {...rest}>
      <rect x="18" y="26" width="4.5" height="16" rx="2.2" fill="#B45309" />
      <path
        d="M20.2 33c-3 0-5 1.6-6.5 3.4"
        stroke="#B45309"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="14" cy="19" r="10.5" fill="#059669" />
      <circle cx="26" cy="18" r="9.5" fill="#10B981" />
      <circle cx="20" cy="11.5" r="9" fill="#34D399" />
      <circle cx="16.5" cy="9" r="2.6" fill="#A7F3D0" opacity="0.85" />
    </svg>
  );
}

/**
 * Tiny stethoscope doodle — a friendly line-art version of the hero model,
 * drawn for small decorative spots (cards, headers).
 */
export function StethoDoodle({ className = '', ...rest }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false" fill="none" {...rest}>
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M10 6v9a7.5 7.5 0 0 0 15 0V6" />
        <path d="M17.5 22.5V27a6.5 6.5 0 0 0 13 0v-3.2" />
      </g>
      <circle cx="7.5" cy="5.5" r="2.6" fill="currentColor" />
      <circle cx="27.5" cy="5.5" r="2.6" fill="currentColor" />
      <circle cx="30.5" cy="19.5" r="5" fill="#FBBF24" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}
