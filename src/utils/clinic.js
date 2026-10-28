import { HOURS } from '../data/site';

/** Minutes since midnight for a "HH:MM" string. */
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Is the clinic open right now? Used for the "Open now" badge. */
export function isOpenNow(date = new Date()) {
  const now = date.getHours() * 60 + date.getMinutes();
  const open = toMinutes(HOURS.openingTime);
  const close = toMinutes(HOURS.closingTime); // past midnight is not handled: closes 22:00
  return now >= open && now < close;
}

/** Formats "09:00" → "9:00 am" (en) / "सकाळी 9:00" (mr). */
export function formatTime(hhmm, lang = 'en') {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? (lang === 'mr' ? 'रात्री' : 'pm') : lang === 'mr' ? 'सकाळी' : 'am';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${lang === 'mr' ? suffix + ' ' : ''}${hour12}:${String(m).padStart(2, '0')}${lang === 'mr' ? '' : ' ' + suffix}`;
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
