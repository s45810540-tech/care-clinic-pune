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
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray('[data-reveal]');
      if (reduced) {
        gsap.set(els, { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0, clearProps: 'transform' });
        return;
      }
      els.forEach((el) => {
        const variant = el.getAttribute('data-reveal') || 'up';
        const from =
          variant === 'left' ? { x: -32, y: 0 } :
          variant === 'right' ? { x: 32, y: 0 } :
          variant === 'scale' ? { scale: 0.94, y: 0 } :
          // '3d' — the element tips up out of the page as it arrives.
          variant === '3d' ? { y: 44, rotateX: 10, transformPerspective: 900, transformOrigin: '50% 100%' } :
          // 'flipY' — side panels swing in around their left edge.
          variant === 'flipY' ? { x: 28, y: 0, rotateY: -24, transformPerspective: 1100, transformOrigin: '0% 50%' } :
          // 'tilt-top' — grids of cards hang down from above, then settle.
          variant === 'tilt-top' ? { y: -24, rotateX: -16, transformPerspective: 1100, transformOrigin: '50% 0%' } :
          variant === 'fade' ? { y: 0 } : { y: 26 };

        // `opacity` (not autoAlpha) keeps the text in the accessibility tree and
        // in heading order while it waits to be revealed — visibility:hidden would
        // hide below-the-fold headings from screen readers and from audits.
        gsap.fromTo(
          el,
          { opacity: 0, ...from },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: parseFloat(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    }, scopeRef);

    // Layout shifts (fonts, images, route change) move triggers around.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = setTimeout(refresh, 400);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(timer);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}

export { gsap, ScrollTrigger };
