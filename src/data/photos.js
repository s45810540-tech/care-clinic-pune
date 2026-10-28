/**
 * Real clinic photographs.
 *
 * Files dropped into `src/assets/photos/` (see that folder's README for the
 * exact names) are discovered at build time via import.meta.glob and emitted
 * as hashed assets. Until a file exists the site falls back to the generated
 * placeholder art — so there are never broken images or 404s, and adding a
 * photo needs no code change: drop it in and rebuild.
 */

const files = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** First glob entry whose file name starts with `name` (e.g. `storefront`). */
const pick = (name) =>
  Object.entries(files)
    .find(([path]) => path.split('/').pop().startsWith(name))?.[1] || null;

export const PHOTOS = {
  storefront: pick('storefront'),
  signboard: pick('signboard'),
  interior: pick('interior'),
  team: pick('team'),
};

/** Resolved src for a named photo, falling back to placeholder artwork. */
export const photoSrc = (key, fallback) => PHOTOS[key] || fallback;

/** True once at least one real photograph has been added. */
export const hasRealPhotos = Object.values(PHOTOS).some(Boolean);
