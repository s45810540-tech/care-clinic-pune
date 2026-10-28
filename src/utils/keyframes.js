/**
 * Keyframe sampling for the cinematic scroll sequences.
 *
 * A channel is an array of `{ t, v }` stops where `t` runs 0 → 1 along the
 * scroll timeline and `v` is a number (or an array of numbers for a vector).
 * Sampling eases every segment with smoothstep, so camera and model moves
 * accelerate and settle like a real dolly instead of tracking scroll at a
 * constant speed. Channels share one time base, which is what keeps camera,
 * model, lighting and copy moving as a single choreographed shot.
 */

/** Hermite smoothstep — 0 at both ends, eased in the middle. */
const smoothstep = (x) => x * x * (3 - 2 * x);

export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Frame-rate independent damping (exponential smoothing). */
export function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * Math.min(dt, 0.1)));
}

/** Locate the keyframe segment `t` falls into and the eased 0→1 blend within it. */
function segment(keys, t) {
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].t) i += 1;
  const a = keys[i];
  const b = keys[i + 1];
  const span = b.t - a.t || 1;
  return [a, b, smoothstep(clamp01((t - a.t) / span))];
}

/** Sample a scalar channel at time `t`. */
export function sampleNumber(keys, t) {
  if (t <= keys[0].t) return keys[0].v;
  const last = keys[keys.length - 1];
  if (t >= last.t) return last.v;
  const [a, b, k] = segment(keys, t);
  return a.v + (b.v - a.v) * k;
}

/** Sample a vector channel at time `t` into `out` (an array), and return it. */
export function sampleVector(keys, t, out) {
  const template = keys[0].v;
  const dst = out && out.length === template.length ? out : new Array(template.length);

  if (t <= keys[0].t) {
    for (let c = 0; c < template.length; c += 1) dst[c] = keys[0].v[c];
    return dst;
  }
  const last = keys[keys.length - 1];
  if (t >= last.t) {
    for (let c = 0; c < template.length; c += 1) dst[c] = last.v[c];
    return dst;
  }

  const [a, b, k] = segment(keys, t);
  for (let c = 0; c < template.length; c += 1) dst[c] = a.v[c] + (b.v[c] - a.v[c]) * k;
  return dst;
}
