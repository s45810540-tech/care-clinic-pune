import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { HOURS } from '../data/site';
import { isOpenNow, formatTime, sessions, sessionAt, nextOpening, minutesToHHMM } from '../utils/clinic';

/**
 * "Open now" dial — a friendly, always-accurate opening-hours indicator.
 *
 * The ring is the whole day, midnight at the top. Both OPD sessions are drawn
 * as arcs and a marker rides the current time, so a glance tells you whether
 * the clinic is open *and* how far into the day it is. Taller than it needs to
 * be for a badge, but this is the one place patients check before travelling.
 *
 * The text beside it carries the same information, so the whole graphic is
 * aria-hidden decoration around real text.
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

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const open = isOpenNow(now);
  const current = sessionAt(nowMin);
  const next = nextOpening(now);

  // Geometry: circle r=40 → circumference ≈ 251.33.
  const R = 40;
  const C = 2 * Math.PI * R;
  const DAY = 24 * 60;

  const arcs = sessions().map(([from, to]) => ({
    key: `${from}-${to}`,
    dash: ((to - from) / DAY) * C,
    offset: (from / DAY) * C,
  }));

  const markerAngle = (nowMin / DAY) * 360 - 90;
  const markerX = 50 + R * Math.cos((markerAngle * Math.PI) / 180);
  const markerY = 50 + R * Math.sin((markerAngle * Math.PI) / 180);

  const statusLine = open && current
    ? t('common.closesAt', { time: formatTime(minutesToHHMM(current[1]), lang) })
    : next
      ? t('common.opensAt', { time: formatTime(next.label, lang) })
      : t('common.closed');

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative h-24 w-24 shrink-0" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* 24-hour track */}
          <circle cx="50" cy="50" r={R} fill="none" stroke="#E0F0EC" strokeWidth="7" />
          {/* Each OPD session as its own arc */}
          {arcs.map((a) => (
            <circle
              key={a.key}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={open ? '#2C776A' : '#96CCC0'}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${a.dash} ${C}`}
              strokeDashoffset={-a.offset}
              transform="rotate(-90 50 50)"
            />
          ))}
          {/* "Now" marker */}
          <circle cx={markerX} cy={markerY} r="5" fill="#E09E3A" stroke="#fff" strokeWidth="2.5" />
        </svg>
        <span
          className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            open ? 'animate-pulse-soft bg-emerald-500' : 'bg-ink-mute/40'
          }`}
        />
      </div>

      <div className="min-w-0">
        <p className={`text-sm font-extrabold ${open ? 'text-emerald-700' : 'text-ink-soft'}`}>
          {open ? t('common.openNow') : t('common.closed')}
        </p>
        <p className="mt-0.5 text-xs font-semibold text-ink-mute">{statusLine}</p>
        <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
          {HOURS.sessions.map((s) => (
            <li key={s.open} className="tabular text-[11px] text-ink-mute/80">
              {formatTime(s.open, lang)} – {formatTime(s.close, lang)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
