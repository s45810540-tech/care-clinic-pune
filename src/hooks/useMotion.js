import { useEffect, useState } from 'react';

/**
 * Shared motion helpers: reduced-motion preference, low-end device detection,
 * and the GSAP/Lenis smooth-scroll setup used across the site.
 */

/** True when the visitor has asked the OS/browser to reduce motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Low-end device heuristic used to skip the WebGL hero:
 * small screens with little RAM/CPU, Data-Saver, or an old GPU.
 * Falls back to a static gradient/SVG illustration.
 */
export function useShouldLoad3D() {
  const reduced = usePrefersReducedMotion();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (reduced) return setOk(false);
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const slowNet = conn && ['slow-2g', '2g', '3g'].includes(conn.effectiveType);
    const lowRam = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const lowCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
    const smallScreen = window.matchMedia('(max-width: 768px)').matches;
    // Budget Androids usually report both a low core count and low memory.
    const lowEnd = (smallScreen && (lowRam || lowCpu)) || lowRam || lowCpu;

    // Only mount WebGL when the device looks capable AND a 2D canvas is available.
    const canvasOk = !!document.createElement('canvas').getContext('webgl2');
    setOk(canvasOk && !lowEnd && !slowNet);
  }, [reduced]);

  return ok;
}

/**
 * True while the element is on screen. Used to pause off-screen WebGL canvases
 * (frameloop="never") so only the scene you can actually see is rendering.
 */
export function useSceneActive(ref) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return active;
}

/** Adds a CSS class while an element is in view — cheap reveal without JS animation libs. */
export function useInViewOnce(ref, className = 'in-view') {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(className);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, className]);
}
