import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from './useMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger and Lenis
 * share one clock. Disabled entirely when the visitor prefers reduced motion.
 */
export function useSmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      touchMultiplier: 1.6,
      // Keep native touch scrolling on phones — Lenis only smooths wheel input here.
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Expose for route-level scrollTo calls (see ScrollToTop).
    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [reduced]);
}

/**
 * Reveals every [data-reveal] element inside `scopeRef` as it enters the viewport.
 * Supports data-reveal="fade|left|right|scale|3d|flipY|tilt-top" variants from index.css.
 */
export function useReveals(scopeRef, deps = []) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = scopeRef?.current ?? document;
    const els = Array.from(root.querySelectorAll('[data-reveal]'));
    if (!els.length) return undefined;

    const reveal = (el) => {
      el.style.setProperty('--reveal-delay', `${parseFloat(el.dataset.delay || '0')}s`);
      el.classList.add('is-revealed');
    };

    if (reduced) {
      els.forEach(reveal);
      return undefined;
    }

    /*
     * IntersectionObserver, not a ScrollTrigger per element.
     *
     * The old version created ~50 ScrollTriggers whose start/end positions were
     * measured on mount. Every pin (services rail, cinema chapter) and every
     * late-loading photo then shifted those positions, so sections scrolled into
     * view without ever firing and stayed at opacity 0 — a blank white band.
     * IO measures nothing, so pins and lazy images cannot invalidate it.
     */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
    );
    els.forEach((el) => io.observe(el));

    // Anything already on screen at mount (deep link, restored scroll position)
    // is revealed immediately instead of waiting for a scroll that may not come.
    const raf = requestAnimationFrame(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          reveal(el);
          io.unobserve(el);
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}

// Re-exported for components that need the same registered plugin instance.
export { gsap, ScrollTrigger };
