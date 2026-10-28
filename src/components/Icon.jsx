/**
 * Lightweight inline SVG icon set (24×24, stroke = currentColor).
 * Keeping icons in one file avoids an icon-library dependency on budget phones.
 */

const paths = {
  phone: 'M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z',
  whatsapp: 'M3.5 20.5l1.3-4.2A8.2 8.2 0 1 1 8 19.3l-4.5 1.2Zm5-4.6c.3 1.6 2.4 3.7 4 4l.9-1.3 1.9.9-.4 1.5c-2.9.7-6.9-3-7.4-6.4l1.4-.6.9 1.9-.4 1Z', // filled-style handset
  mapPin: 'M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  calendar: 'M7 3v3m10-3v3M4 8.5h16M5.5 5.5h13A1.5 1.5 0 0 1 20 7v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V7a1.5 1.5 0 0 1 1.5-1.5Z',
  clock: 'M12 7.5V12l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  arrowUpRight: 'M7 17 17 7m0 0H8.5M17 7v8.5',
  chevronDown: 'M6 9.5 12 15l6-5.5',
  chevronLeft: 'M14.5 6 9 12l5.5 6',
  chevronRight: 'M9.5 6 15 12l-5.5 6',
  check: 'M5 12.5 9.5 17 19 7',
  plus: 'M12 5v14M5 12h14',
  heart: 'M12 20s-7.5-4.7-7.5-10A4.2 4.2 0 0 1 12 7.4 4.2 4.2 0 0 1 19.5 10c0 5.3-7.5 10-7.5 10Z',
  shield: 'M12 3.5 5 6v5.5c0 4.3 3 7.4 7 9 4-1.6 7-4.7 7-9V6l-7-2.5Z',
  mail: 'M4 6.5h16v11H4v-11Zm0 .5 8 6 8-6',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c-2.5 2.4-3.5 5.4-3.5 9s1 6.6 3.5 9m0-18c2.5 2.4 3.5 5.4 3.5 9s-1 6.6-3.5 9M3.5 9.5h17m-17 5h17',
  external: 'M14 4h6v6m0-6L10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  info: 'M12 10.5V16m0-8.6v.1M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  sparkle: 'M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6 10.4 9 12 3.5Z',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8.5 6.5a4 4 0 0 0-3-3.9M3.5 19.5a5.5 5.5 0 0 1 11 0M16 4.6a3.5 3.5 0 0 1 0 6.8',
  // Service glyphs
  stethoscope: 'M6 3v5a4 4 0 0 0 8 0V3M4.5 3h3m5 0h3M10 15v1.5a4.5 4.5 0 0 0 9 0V14m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  thermometer: 'M12 14.5V4.8a2 2 0 1 1 4 0v9.7a4 4 0 1 1-4 0Z',
  home: 'M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1v-8.5Z',
  baby: 'M12 8.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 8c0-2.5 2.7-4 6-4s6 1.5 6 4-2.7 3.5-6 3.5S6 19 6 16.5Zm4-8.8c.6.6 1.3.9 2 .9s1.4-.3 2-.9',
  scalpel: 'M14.5 3.5 20 9l-8 8-3.5 1.5L10 15l8-8M6.5 8.5 3 12l4 4 3.5-3.5',
  leaf: 'M5 19c0-7 5-13 14-13 0 8-5 13-11 13H5Zm0 0c1.5-4 4.5-7 9-9',
  flask: 'M9.5 3v6L5 17.5A2 2 0 0 0 6.8 20.5h10.4a2 2 0 0 0 1.8-3L14.5 9V3M8 3h8M7.5 14h9',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5.2-1.8L21 21',
};

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.7, fill = 'none', title }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  );
}
