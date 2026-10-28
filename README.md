# केअर क्लिनिक — Care Clinic for General Medicine & Surgery, Pune

A premium, multi-page, mobile-first marketing + appointment-booking website for
**Care Clinic for General Medicine & Surgery**, Keshav Nagar, Mundhwa, Pune.

> **Client note:** everything in `[BRACKETS]` is a placeholder you must replace
> before launch. The full checklist is in [Placeholders](#placeholders) below.
> The legal pages must be reviewed by a qualified Indian lawyer before go-live.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + Vite 6 (static build, deploys to any free host) |
| Routing | React Router v7 (`BrowserRouter`, one route per page) |
| Styling | Tailwind CSS 3 (design tokens in `tailwind.config.js`) |
| Scroll storytelling | GSAP + ScrollTrigger, Lenis smooth scroll |
| 3D | Three.js via React Three Fiber — two lazy scenes (hero rig + helix chapter), static SVG fallbacks |
| Forms | Web3Forms (default) or Formspree — both free |
| WhatsApp | Click-to-chat `wa.me` links (free, no paid API) |
| Language | English / मराठी toggle (extensible to हिंदी) |

---

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
```

Optional environment variables (create a `.env` file — never commit it):

```bash
VITE_FORM_ACCESS_KEY=your-web3forms-access-key   # appointment form backend
VITE_FORM_ENDPOINT=https://formspree.io/f/xxxx   # alternative: Formspree
VITE_GA_ID=G-XXXXXXXXXX                          # analytics (only after cookie consent)
```

---

## Folder structure

```
index.html                 # meta tags, Open Graph, JSON-LD (LocalBusiness/MedicalClinic/Physician)
public/
  robots.txt  sitemap.xml  favicon.svg
  images/                  # PLACEHOLDER artwork — replace with real photos
scripts/
  generate-placeholders.mjs  # regenerates the placeholder images
src/
  App.jsx                  # routes (Home, About, Services, Book, Reviews, Gallery,
                           #   Contact, FAQ, Blog + 3 posts, 6 legal pages, 404)
  components/              # Header (emergency bar + lang toggle), Footer,
                           #   MobileBottomBar, WhatsAppFab, CookieConsent,
                           #   MagneticCursor, ui.jsx, home/* (Hero3D,
                           #   CinemaChapter + Helix3D, carousel, timeline)
  utils/keyframes.js       # shared keyframe sampler for the cinematic takes
  three/GradientEnvironment.js  # shared studio-reflection env for all scenes
  data/site.js             # ← ALL clinic details live here (address, phone, hours, doctor)
  data/content.js          # ← services, visit steps, FAQs, blog posts, gallery
  data/photos.js           # resolves real photos dropped into assets/photos/ (else mock art)
  assets/photos/           # ← DROP THE 4 REAL CLINIC PHOTOS HERE (see its README)
  components/Stickers.jsx  # playful decorative SVG doodles (sparkles, squiggle, confetti)
  i18n/                    # English/मराठी dictionary + provider
  hooks/                   # useScroll (Lenis+GSAP), useMotion (reduced-motion / low-end)
  pages/                   # one file per page, legal/ for the six policy pages
  utils/clinic.js          # open-now logic, date/time formatting
  utils/seo.js             # per-route <title>/meta/OG/canonical
```

---

## Editing clinic information

| What | Where |
| --- | --- |
| Address, phone, WhatsApp, hours, doctor, rating, stats | `src/data/site.js` |
| Services, FAQs, visit steps, blog posts, gallery | `src/data/content.js` |
| English / Marathi UI text | `src/i18n/translations.js` |
| Page titles & descriptions | `useSeo({...})` at the top of each file in `src/pages/` |
| Structured data (schema.org) | `index.html` |
| Legal text | `src/pages/legal/*.jsx` (all share `LegalShell.jsx` + `LAST_UPDATED`) |

**Hours:** `HOURS.openingTime` in `src/data/site.js` is `[09:00]` — a placeholder.
Closing time is 10 pm (given). The header badge computes “Open now” from the
visitor’s clock, and the booking form only offers slots inside opening hours and
disables past slots (30-minute lead).

---

## Appointment booking

1. Visitor fills the form (name, phone, age, service, date, time slot, symptoms + DPDP consent).
2. Client-side validation + honeypot spam field.
3. The request is POSTed to a **free backend**:
   - **Web3Forms (default):** create a free key at web3forms.com → put it in
     `VITE_FORM_ACCESS_KEY` (or `FORM_CONFIG.accessKey` in `src/data/site.js`).
   - **Formspree:** set `VITE_FORM_ENDPOINT` to your form URL.
   - **Google Sheets:** paste an Apps Script `exec` URL as `VITE_FORM_ENDPOINT`
     and send `application/x-www-form-urlencoded` (or swap the fetch body in
     `BookAppointment.jsx`).
4. A confirmation screen shows the booking summary, and a **pre-filled WhatsApp
   message** opens automatically:
   `Hello, I'd like to book an appointment: Name, Date, Time, Service`
5. If no backend key is configured yet, the site runs in **demo mode**: the
   WhatsApp handoff still works and a note is shown on the confirmation.

---

## WhatsApp + contact actions

- Floating **WhatsApp** button on every page (`components/WhatsAppFab.jsx`).
- “Chat on WhatsApp” in the header, contact page, footer, FAQ and CTA bands.
- Sticky mobile bottom bar: **Call · WhatsApp · Book · Directions**.
- Header emergency strip: *“For emergencies, call 112 or visit the nearest hospital.”*

All WhatsApp links are free click-to-chat links (`wa.me/918275573300`) — no paid
WhatsApp Business API.

---

## Cinematic 3D scroll (home page)

Two WebGL scenes play as choreographed takes rather than loop animations. Both
are code-split, gated behind `useShouldLoad3D` and **paused when off screen**
(`useSceneActive` → `frameloop="never"`), so only the scene you can see renders.

1. **Hero rig** (`components/home/Hero3D.jsx`) — one scroll time base drives
   keyframed channels for camera position/look-at/FOV/roll, the stethoscope's
   rotation and drift, and the light grade (clean clinic white → amber rim →
   pull-back long lens). Fast scrolls add a velocity kick: the lens widens and
   the camera whips slightly. The hero copy tips back in 3D perspective with a
   scrubbed vignette and a 01/02/03 shot meter.
2. **“How we work” chapter** (`components/home/CinemaChapter.jsx` +
   `Helix3D.jsx`) — a pinned section where three value cards crossfade through
   one scrubbed timeline while a 3D DNA helix assembles beside them: base-pair
   rungs grow in as the scroll front passes, camera dollies in, amber rim rises.

Keyframe sampling and damping live in `src/utils/keyframes.js`; the shared
genesis-gradient environment is `src/three/GradientEnvironment.js`.

Degradation, deliberately:

- **Mobile** — no pinning: cards stack normally with a staggered entrance and
  the helix scrubs behind the copy at 40 % opacity.
- **Low-end phones / Data-Saver / no WebGL2** — static generated SVG helix.
- **`prefers-reduced-motion`** — no pin, no scrub, no canvas; plain content.

---

## Performance & accessibility

- **Route-level code splitting**; the Three.js chunk (≈238 kB gzip) loads only
  on the home hero, and only on capable devices.
- `useShouldLoad3D` skips WebGL for low-end phones (≤4 cores/GB), Data-Saver,
  missing WebGL2, or `prefers-reduced-motion`, and shows a static SVG gradient
  fallback instead.
- Smooth scroll, counters, reveals, parallax and the magnetic cursor are all
  disabled under `prefers-reduced-motion`.
- Images are lazy-loaded SVG placeholders (≈1.7 kB each) — replace with
  WebP/AVIF photos, ≤100 kB each, with explicit `width`/`height`.
- Keyboard focus rings, `aria-expanded` accordion, labelled form fields with
  inline errors, 44 px tap targets, WCAG AA contrast (checked against the teal
  palette), skip-to-content `#main` landmark.
- **Static pre-paint shell**: `index.html` ships a branded one-screen shell
  (headline + Book/WhatsApp buttons) that paints before the JS bundle, so 3G/4G
  visitors see the clinic instead of a white screen. `src/App.jsx` fades it out
  once the first real page heading paints; with JavaScript disabled it stays as a
  usable landing page.
- **Fonts load without blocking paint** (`media="print"` swap). The ~120 kB
  Devanagari webfont is fetched only when someone switches to मराठी; a ~3 kB
  15-character subset covers the wordmark that shows in English mode.

**Measured** (Lighthouse 12, simulated mobile / slow 4G, on the production
build): **Performance 95 · Accessibility 100 · Best Practices 100 · SEO 100**,
FCP 1.9 s, LCP 1.9 s, TBT 200 ms, CLS 0.02. The report is kept at
`artifacts/lighthouse-cinema.json`. Re-run with `npx lighthouse http://localhost:3000/`
after `npm run build && npm run preview`.

---

## SEO

- Per-route `<title>`, description, Open Graph and canonical tags (`src/utils/seo.js`).
- `index.html` ships `MedicalClinic` + `LocalBusiness` + `Physician` JSON-LD with
  the real address, phone, hours and the aggregate 4.9/600 rating.
- `public/sitemap.xml` and `public/robots.txt` list every route.
- ⚠️ Replace `care-clinic.example.com` with the production domain in
  `index.html`, `public/sitemap.xml`, `public/robots.txt` and `SITE.origin`
  (`src/data/site.js`), then add the site to Google Search Console.

---

## Deployment (free hosts)

The build is a static SPA (`dist/`), so any of these work.

### Cloudflare Pages
1. `npm run build`
2. Cloudflare Pages → Create project → upload `dist/` (or connect Git, build
   command `npm run build`, output directory `dist`).
3. SPA fallback is provided by `public/_redirects` (already in the repo).

### Netlify
1. Connect the repo; build `npm run build`; publish directory `dist`.
2. `netlify.toml` (included) handles the SPA redirect.

### Vercel
1. Import the repo; framework “Vite”; build `npm run build`; output `dist`.
2. `vercel.json` (included) rewrites all routes to `index.html`.

### After deploying
- Set `VITE_FORM_ACCESS_KEY` / `VITE_GA_ID` in the host’s environment variables
  and rebuild.
- Open `/`, `/book`, `/contact` on the live URL and check the console.

---

## Design language — professional, playful, bright

- **Base:** the calm teal/white medical palette (plus warm amber) carries all
  structure and primary actions — that's the “professional”.
- **Bright pops:** one accent tone each for stats numbers, icon chips and the
  visit-timeline nodes (teal → amber → sky → rose). Every combination was
  contrast-checked against WCAG AA — reuse the same tone arrays when adding
  cards, and never put light tones under body text.
- **Playful gestures** (all decorative, `aria-hidden`, and disabled under
  `prefers-reduced-motion`):
  - a hand-drawn squiggle under **every** section heading (`ui.jsx` → SectionHeading);
  - a procedural sticker library — cartoon **clouds, blossoms, leaves, trees,
    sparkles, confetti and a stethoscope doodle** — hand-built inline SVG in
    `src/components/Stickers.jsx` (no image files, ~1 kB total). Used in the
    hero, page headers and as the illustrated scene in the static hero fallback;
  - tilted “polaroid” photo cards (Home map section, Contact wayfinding card);
  - a spectrum stripe across the top of the dark footer.
- **Type hierarchy** — one system, documented at the top of `src/components/ui.jsx`:
  page title (h1, 4xl→6xl) → section title (h2, 3xl→5xl) → panel (h3, 2xl→3xl)
  → card (h3, xl) → meta label. Semantic level follows visual level; cards
  never use `h2`.
- **Opening-hours dial** (`src/components/ReadinessIndicator.jsx`): a small SVG
  ring in the Home map section shows today's clinic day filling up to closing
  time, with a live “Open now · closes 10 pm” line. Re-reads the clock every
  minute; decorative (`aria-hidden`) since the same hours are written in text.

---

## Cinematic hero — tuning without touching the 3D code

The hero scroll-take (camera path, stethoscope performance, light grade) is
fully data-driven. **To retune it, edit `HERO_ANIMATION` at the top of
`src/pages/Home.jsx`** — no need to open `Hero3D.jsx`:

```js
const HERO_ANIMATION = {
  camera: {
    fov: [                       // field of view along the scroll
      { t: 0, v: 42 },           // t = 0 → 1 position in the scroll runway
      { t: 1, v: 30 },           // v = value at that key
    ],
  },
  light: { amber: [{ t: 1, v: 26 }] }, // partial channel: rest keeps defaults
};
```

Every channel of `DEFAULT_HERO_ANIMATION` (exported from `Hero3D.jsx`) can be
overridden this way: `camera.pos / look / fov / roll`,
`model.rotY / rotX / posY / posZ / scale`, `light.key / teal / amber`.
Unspecified channels keep their defaults.
- **Photographs:** gallery slots use the real clinic photos when present
  (`src/data/photos.js`), otherwise the generated mock art — with captions that
  match the final photo, and a self-hiding `[PLACEHOLDER]` note on the Gallery.

---

## Placeholders — replace before launch

| # | Item | Where |
| --- | --- | --- |
| 1 | Production domain (`care-clinic.example.com`) | `index.html`, `public/sitemap.xml`, `public/robots.txt`, `src/data/site.js` |
| 2 | Doctor’s **[QUALIFICATIONS]** | `src/data/site.js` → `DOCTOR.qualifications` |
| 3 | Doctor’s **[REG. NO.]** | `src/data/site.js` → `DOCTOR.regNo` |
| 4 | **[OPENING TIME]** (`09:00`) | `src/data/site.js` → `HOURS.openingTime` |
| 5 | Years of service / patients-served figures | `src/data/site.js` → `STATS` (+ note on the Home page) |
| 6 | Google Maps listing URL (for the 4.9/600 link) | `src/data/site.js` → `RATING.googleUrl` |
| 7 | Map embed URL / geo coordinates | `src/data/site.js` → `RATING.mapEmbed`, `index.html` JSON-LD `geo` |
| 8 | **The 4 real clinic photos** (entrance+team, board, room, staff) | Drop into `src/assets/photos/` using the exact names in that folder's README, then rebuild — they replace the mock-ups automatically on Gallery/About/Contact/Home. Compress to ≤250 kB each first. |
| 8b | Doctor portrait & blog artwork | `public/images/*` (regenerate with `node scripts/generate-placeholders.mjs`) |
| 9 | Web3Forms access key or Formspree endpoint | `.env` / `FORM_CONFIG` in `src/data/site.js` |
| 10 | GA4 measurement id (only after consent) | `.env` `VITE_GA_ID`, `src/components/CookieConsent.jsx` |
| 11 | Grievance Officer name + email (DPDP) | `src/pages/legal/PrivacyPolicy.jsx` |
| 12 | Retention periods, notice period, fees | Privacy / Cancellation policy pages |
| 13 | Contact e-mail addresses | Terms, Accessibility, Privacy pages |
| 14 | “Website by [AGENCY NAME]” | `src/i18n/translations.js` → `footer.builtBy` |
| 15 | Language spoken, fees, landmark (FAQ answers) | `src/data/content.js` → `FAQS` |

---

## Compliance

- **Reviews:** this site shows **only** the aggregate Google rating (4.9 from
  600 reviews) with a “See reviews on Google” link. There are **no** named
  testimonials, star quotes or superlatives (“best doctor”), in line with Indian
  medical advertising rules. Keep it that way when editing content.
- **Legal pages:** Privacy Policy (DPDP Act 2023), Terms & Conditions, Medical
  Disclaimer, Cookie Policy, Cancellation & Rescheduling, Accessibility — all
  plain-language drafts with a visible **Last updated** date and a permanent
  “have a lawyer review this” notice. Governing law: courts of **Pune,
  Maharashtra**. **A qualified lawyer must review them before launch.**
- **Medical copy:** service and blog text avoids cure/guarantee claims and links
  to the Medical Disclaimer.
- **Cookies:** analytics load only after explicit consent; the banner records
  `granted`/`denied` in localStorage and can be changed by clearing site data.
