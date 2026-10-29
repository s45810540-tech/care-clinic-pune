import { HOURS } from '../data/site';

/** Minutes since midnight for a "HH:MM" string. */
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Minutes since midnight → "HH:MM". */
export const minutesToHHMM = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

/** The day's OPD sessions as [openMinutes, closeMinutes] pairs. */
export const sessions = () =>
  (HOURS.sessions || [{ open: HOURS.openingTime, close: HOURS.closingTime }]).map((s) => [
    toMinutes(s.open),
    toMinutes(s.close),
  ]);

/** The session that contains `minutes`, or null. */
export const sessionAt = (minutes) => sessions().find(([open, close]) => minutes >= open && minutes < close) || null;

/** Is the clinic open right now? Used for the "Open now" badge. */
export function isOpenNow(date = new Date()) {
  return Boolean(sessionAt(date.getHours() * 60 + date.getMinutes()));
}

/**
 * When does the clinic next open? Returns minutes-until-open and the "HH:MM"
 * label, so a closed badge can say "Opens 5:00 pm" instead of just "Closed".
 */
export function nextOpening(date = new Date()) {
  const now = date.getHours() * 60 + date.getMinutes();
  const next = sessions().find(([open]) => open > now);
  if (!next) return null; // closed for the rest of today
  const [open] = next;
  return {
    label: `${String(Math.floor(open / 60)).padStart(2, '0')}:${String(open % 60).padStart(2, '0')}`,
    minutesAway: open - now,
  };
}

/** Formats "09:00" → "9:00 am" (en) / "सकाळी 9:00" (mr). */
export function formatTime(hhmm, lang = 'en') {
  const [h, m] = String(hhmm).split(':').map(Number);
  // Marathi day-parts, as the clinic's own board writes them:
  // स. (morning) · दु. (midday) · संध्या. (evening) · रात्री. (night).
  const suffix =
    lang === 'mr'
      ? h < 12
        ? 'स.'
        : h < 16
          ? 'दु.'
          : h < 20
            ? 'संध्या.'
            : 'रात्री.'
      : h >= 12
        ? 'pm'
        : 'am';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return lang === 'mr'
    ? `${suffix}${hour12}:${String(m).padStart(2, '0')}`
    : `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/**
 * Whole-day opening hours in one string, e.g.
 *   en: "10:00 am – 2:00 pm · 5:00 pm – 10:00 pm"
 *   mr: "स.१०:०० – दु.२:०० · संध्या.५:०० – रात्री.१०:००"
 * Every "daily hours" line on the site uses this, so a change to HOURS.sessions
 * updates the header, footer, booking page and map card together.
 */
export function hoursSummary(lang = 'en') {
  return (HOURS.sessions || [{ open: HOURS.openingTime, close: HOURS.closingTime }])
    .map(({ open, close }) => `${formatTime(open, lang)} – ${formatTime(close, lang)}`)
    .join(' · ');
}

export function formatDate(iso, lang = 'en') {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Local (not UTC) YYYY-MM-DD for "today" — toISOString() shifts the day in IST. */
export function localISODate(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
