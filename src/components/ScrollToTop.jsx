import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger, gsap } from '../hooks/useScroll';

/** Scrolls to the top (or to an anchor hash) on every route change. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = window.__lenis;

    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        // Wait a frame so the new route has painted before measuring.
        requestAnimationFrame(() => {
          if (lenis) lenis.scrollTo(el, { offset: -96 });
          else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }
    }

    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    // Layout changes after navigation invalidate trigger positions.
    const id = setTimeout(() => ScrollTrigger.refresh(), 350);
    gsap.killTweensOf(window);
    return () => clearTimeout(id);
  }, [pathname, hash]);

  return null;
}
