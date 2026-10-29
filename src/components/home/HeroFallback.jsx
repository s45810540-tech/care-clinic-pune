/**
 * Static hero artwork used when 3D is skipped:
 * reduced-motion preference, Data-Saver, or a low-end phone.
 *
 * A friendly illustrated scene — floating stethoscope over soft clouds, leaves
 * and blossoms — built entirely from inline SVG + CSS gradients, so it costs
 * zero extra requests beyond one inline file. The clouds/leaves use the same
 * `animate-floaty` motion language as the rest of the site (killed under
 * prefers-reduced-motion by the site-wide rule).
 */
import { Cloud, Bloom, Leaf, Sparkle } from '../Stickers';

export default function HeroFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Warm colour field */}
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 animate-fade-up rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(20,184,166,0.55),rgba(15,118,110,0.18)_45%,transparent_70%)] sm:left-[68%] sm:h-[640px] sm:w-[640px]" />
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 animate-floaty rounded-full border border-white/40 sm:left-[68%]" />

      {/* Drifting clouds */}
      <Cloud
        className="absolute left-[42%] top-[16%] h-14 w-24 animate-floaty text-white opacity-90 sm:left-[58%] sm:h-20 sm:w-32"
        style={{ animationDelay: '0.4s' }}
      />
      <Cloud
        className="absolute bottom-[18%] left-[52%] hidden h-12 w-20 animate-floaty text-white opacity-70 sm:left-[80%] sm:block"
        style={{ animationDelay: '2.2s' }}
      />

      {/* Blossom + leaves tucked around the illustration */}
      <Bloom className="absolute right-[24%] top-[24%] hidden h-10 w-10 animate-floaty sm:block" style={{ animationDelay: '1.1s' }} />
      <Leaf className="absolute bottom-[26%] right-[18%] hidden h-8 w-8 rotate-[24deg] animate-floaty text-emerald-300 lg:block" />
      <Sparkle className="absolute left-[46%] top-[36%] h-6 w-6 animate-floaty text-accent-300" style={{ animationDelay: '1.7s' }} />

      <svg
        viewBox="0 0 400 460"
        className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 opacity-95 sm:left-[68%] sm:h-[420px] sm:w-[420px]"
        role="img"
        aria-label="Illustration of a stethoscope"
      >
        <defs>
          <linearGradient id="tube" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4A22B8" />
            <stop offset="100%" stopColor="#1B0F49" />
          </linearGradient>
          <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#DCD3FF" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF7A57" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF7A57" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="300" r="150" fill="url(#glow)" opacity="0.35" />
        {/* Binaural tubing */}
        <path
          d="M120 70 C110 150 130 200 200 235 C270 200 290 150 280 70"
          fill="none"
          stroke="url(#tube)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Tube to chest piece */}
        <path
          d="M200 235 C210 290 218 330 214 372"
          fill="none"
          stroke="url(#tube)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Ear tips */}
        <circle cx="120" cy="66" r="17" fill="url(#metal)" stroke="#4A22B8" strokeWidth="5" />
        <circle cx="280" cy="66" r="17" fill="url(#metal)" stroke="#4A22B8" strokeWidth="5" />
        {/* Chest piece */}
        <g transform="translate(214 392)">
          <circle r="54" fill="url(#metal)" stroke="#4A22B8" strokeWidth="7" />
          <circle r="40" fill="#f7fbfb" stroke="#FF7A57" strokeWidth="6" />
          <circle r="12" fill="#4A22B8" opacity="0.25" />
        </g>
      </svg>
    </div>
  );
}
