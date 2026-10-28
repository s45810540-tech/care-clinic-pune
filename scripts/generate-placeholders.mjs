/**
 * Generates realistic-looking SVG placeholder images into public/images.
 * Run with: node scripts/generate-placeholders.mjs
 *
 * ⚠️ These are PLACEHOLDERS. The client must replace every file in
 * public/images with real photographs before launch (see README).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images');
mkdirSync(outDir, { recursive: true });

/** Each scene: label, size, palette (bg gradient stops), and simple composition. */
const scenes = [
  { file: 'doctor-portrait.svg', w: 800, h: 1000, label: 'Dr. Swati Kamble', sub: 'DOCTOR PHOTO · PLACEHOLDER', tone: 'teal', shape: 'portrait' },
  { file: 'gallery-1.svg', w: 960, h: 720, label: 'Reception & waiting area', sub: 'CLINIC PHOTO · PLACEHOLDER', tone: 'teal', shape: 'interior' },
  { file: 'gallery-2.svg', w: 960, h: 720, label: 'Consultation room', sub: 'CLINIC PHOTO · PLACEHOLDER', tone: 'sand', shape: 'interior' },
  { file: 'gallery-3.svg', w: 960, h: 720, label: 'Examination & day-care', sub: 'CLINIC PHOTO · PLACEHOLDER', tone: 'aqua', shape: 'interior' },
  { file: 'gallery-4.svg', w: 960, h: 720, label: 'Diagnostics corner', sub: 'CLINIC PHOTO · PLACEHOLDER', tone: 'sand', shape: 'interior' },
  { file: 'gallery-5.svg', w: 960, h: 720, label: 'Pharmacy guidance desk', sub: 'CLINIC PHOTO · PLACEHOLDER', tone: 'teal', shape: 'interior' },
  { file: 'gallery-6.svg', w: 960, h: 720, label: 'Clinic entrance, Keshav Nagar', sub: 'CLINIC PHOTO · PLACEHOLDER', tone: 'aqua', shape: 'exterior' },
  { file: 'blog-fever.svg', w: 1200, h: 675, label: 'Fever in adults', sub: 'ARTICLE HEADER · PLACEHOLDER', tone: 'warm', shape: 'blob' },
  { file: 'blog-bp.svg', w: 1200, h: 675, label: 'Blood pressure habits', sub: 'ARTICLE HEADER · PLACEHOLDER', tone: 'teal', shape: 'blob' },
  { file: 'blog-child.svg', w: 1200, h: 675, label: 'Child with fever', sub: 'ARTICLE HEADER · PLACEHOLDER', tone: 'aqua', shape: 'blob' },
  { file: 'og-cover.svg', w: 1200, h: 630, label: 'Care Clinic for General Medicine & Surgery', sub: 'केअर क्लिनिक · KESHAV NAGAR, MUNDHWA, PUNE', tone: 'deep', shape: 'brand' },
];

const TONES = {
  teal: ['#0f766e', '#134e4a', '#f99b20'],
  aqua: ['#0d9488', '#042f2e', '#5eead4'],
  sand: ['#115e59', '#0a1f1d', '#fbcf8a'],
  warm: ['#b13f09', '#0a1f1d', '#f99b20'],
  deep: ['#042f2e', '#0f766e', '#f99b20'],
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function composition(shape, [c1, c2, c3], w, h) {
  switch (shape) {
    case 'portrait':
      return `
      <circle cx="${w / 2}" cy="${h * 0.42}" r="${w * 0.3}" fill="rgba(255,255,255,0.14)"/>
      <circle cx="${w / 2}" cy="${h * 0.34}" r="${w * 0.13}" fill="rgba(255,255,255,0.55)"/>
      <path d="M${w * 0.28} ${h * 0.72} a${w * 0.22} ${w * 0.22} 0 0 1 ${w * 0.44} 0 v${h * 0.18} h-${w * 0.44} Z" fill="rgba(255,255,255,0.45)"/>`;
    case 'interior':
      return `
      <rect x="${w * 0.1}" y="${h * 0.55}" width="${w * 0.34}" height="${h * 0.3}" rx="18" fill="rgba(255,255,255,0.35)"/>
      <rect x="${w * 0.5}" y="${h * 0.45}" width="${w * 0.38}" height="${h * 0.4}" rx="18" fill="rgba(255,255,255,0.22)"/>
      <circle cx="${w * 0.3}" cy="${h * 0.32}" r="${h * 0.12}" fill="rgba(255,255,255,0.3)"/>
      <path d="M0 ${h * 0.85} H${w}" stroke="rgba(255,255,255,0.35)" stroke-width="6"/>`;
    case 'exterior':
      return `
      <rect x="${w * 0.12}" y="${h * 0.3}" width="${w * 0.76}" height="${h * 0.55}" rx="20" fill="rgba(255,255,255,0.28)"/>
      <rect x="${w * 0.2}" y="${h * 0.45}" width="${w * 0.24}" height="${h * 0.4}" rx="12" fill="rgba(255,255,255,0.45)"/>
      <rect x="${w * 0.55}" y="${h * 0.45}" width="${w * 0.24}" height="${h * 0.2}" rx="12" fill="rgba(255,255,255,0.5)"/>
      <circle cx="${w * 0.82}" cy="${h * 0.18}" r="${h * 0.09}" fill="${c3}" opacity="0.85"/>`;
    case 'blob':
      return `
      <circle cx="${w * 0.78}" cy="${h * 0.3}" r="${h * 0.34}" fill="rgba(255,255,255,0.16)"/>
      <circle cx="${w * 0.2}" cy="${h * 0.75}" r="${h * 0.3}" fill="rgba(255,255,255,0.12)"/>
      <path d="M${w * 0.5} ${h * 0.28} c40 0 60 40 100 40 s60-30 90-10" stroke="${c3}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.9"/>`;
    case 'brand':
    default:
      return `
      <circle cx="${w * 0.86}" cy="${h * 0.5}" r="${h * 0.42}" fill="rgba(255,255,255,0.08)"/>
      <circle cx="${w * 0.1}" cy="${h * 0.9}" r="${h * 0.5}" fill="rgba(255,255,255,0.06)"/>
      <path d="M${w * 0.78} ${h * 0.42} h40 v40 h-40 z M${w * 0.74} ${h * 0.36} h120 v40 h-40 v40 h-40 v-40 h-40 z" fill="${c3}" opacity="0.9"/>
      <path d="M${w * 0.795} ${h * 0.44} h14 v14 h-14 z M${w * 0.775} ${h * 0.4} h54 v14 h-14 v14 h-14 v-14 h-14 z" fill="#ffffff" opacity="0.95"/>`;
  }
}

for (const scene of scenes) {
  const [c1, c2, c3] = TONES[scene.tone];
  const { w, h } = scene;
  const isDeep = scene.tone === 'deep';
  const textColor = '#ffffff';
  const subColor = 'rgba(255,255,255,0.72)';
  const fontSize = Math.round(Math.min(w, h) * 0.055);
  const subSize = Math.round(Math.min(w, h) * 0.03);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(scene.label)} — placeholder image">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="rgba(255,255,255,0.16)"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#dots)"/>
  <rect width="${w}" height="${h}" fill="url(#sheen)"/>
  ${composition(scene.shape, [c1, c2, c3], w, h)}
  ${isDeep ? '' : `<rect x="0" y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="rgba(4,47,46,0.55)"/>`}
  <text x="${w / 2}" y="${h * (isDeep ? 0.72 : 0.83)}" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="${textColor}">${esc(scene.label)}</text>
  <text x="${w / 2}" y="${h * (isDeep ? 0.79 : 0.9)}" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${subSize}" font-weight="600" letter-spacing="3" fill="${subColor}">${esc(scene.sub)}</text>
</svg>
`;
  writeFileSync(join(outDir, scene.file), svg);
  console.log('wrote', scene.file);
}
