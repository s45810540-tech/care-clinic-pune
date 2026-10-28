import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { HOURS } from '../data/site';
import { isOpenNow, formatTime } from '../utils/clinic';

/**
 * "Open now" dial — a friendly, always-accurate opening-hours indicator.
 *
 * A 96px SVG ring shows today's clinic day filling up: the arc grows from the
 * opening time to the closing time, with an amber marker riding its tip. Inside
 * sits the live status ("Open now · closes 10 pm" or "Closed · opens 9 am").
 *
 * Purely decorative (aria-hidden) — the same information is written out in text
 * beside it — and it only animates under `prefers-reduced-motion`-safe CSS:
 * the arc itself is derived from real time, re-checked every minute, so it is
 * correct even with motion disabled.
 */
export default function ReadinessIndicator({ className = '' }) {
  const { t, lang } = useI18n();
  const [now, setNow] = useState(() => new Date());

  // Tick once a minute — the dial and status text stay truthful without
  // re-rendering every frame.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const open = isOpenNow(now);

  // HOURS values are "HH:MM" strings — convert to minutes since midnight.
  const toMin = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };
  const openMin = toMin(HOURS.openingTime);
  const closeMin = toMin(HOURS.closingTime);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // 0 → 1 progress of the clinic day, clamped outside opening hours.
  const progress = Math.min(1, Math.max(0, (nowMin - openMin) / Math.max(1, closeMin - openMin)));

  // Geometry: circle r=40 → circumference ≈ 251.3; round caps look friendly.
  const R = 40;
  const C = 2 * Math.PI * R;
  const dash = C * progress;
  const angle = progress * 360 - 90; // -90 so 0 progress starts at 12 o'clock
  const markerX = 50 + R * Math.cos((angle * Math.PI) / 180);
  const markerY = 50 + R * Math.sin((angle * Math.PI) / 180);

  const openLabel = formatTime(HOURS.openingTime, lang);
  const closeLabel = formatTime(HOURS.closingTime, lang);

  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-0">
          {/* Track */}
          <circle cx="50" cy="50" r={R} fill="none" stroke="#CCFBF1" strokeWidth="9" />
          {/* Today's progress */}
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={open ? '#0D9488' : '#94A3B8'}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C - dash}`}
            className="transition-[stroke-dasharray] duration-700 ease-out"
          />
          {/* Marker riding the tip of the arc */}
          {open && (
            <circle
              cx={markerX}
              cy={markerY}
              r="6.5"
              fill="#F99B20"
              stroke="#ffffff"
              strokeWidth="3"
              className="transition-all duration-700 ease-out"
            />
          )}
        </svg>
        {/* Live status dot */}
        <span
          className={`absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            open ? 'animate-pulse-soft bg-accent-400' : 'bg-slate-400'
          }`}
        />
      </div>

      <div className="min-w-0">
        <p className={`text-sm font-extrabold ${open ? 'text-emerald-700' : 'text-ink-soft'}`}>
          {open ? t('common.openNow') : t('common.closed')}
        </p>
        <p className="mt-0.5 text-xs font-semibold text-ink-mute">
          {open ? t('common.closesAt', { time: closeLabel }) : t('common.opensAt', { time: openLabel })}
        </p>
        <p className="mt-1 text-[11px] text-ink-mute/80">
          {t('common.daily')} {openLabel} – {closeLabel}
        </p>
      </div>
    </div>
  );
}
