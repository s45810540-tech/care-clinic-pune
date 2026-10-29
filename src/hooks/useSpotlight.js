import { useEffect } from 'react';

/**
 * Pointer spotlight for any element marked `data-spotlight`.
 *
 * One delegated listener for the whole document, work batched into a frame, and
 * only the element under the pointer is touched. Skipped entirely for coarse
 * pointers and reduced-motion visitors, where there is no pointer to follow.
 */
export default function useSpotlight() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    let frame = 0;
    let target = null;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${((x - rect.left) / rect.width) * 100}%`);
      target.style.setProperty('--my', `${((y - rect.top) / rect.height) * 100}%`);
    };

    const onMove = (event) => {
      const el = event.target instanceof Element ? event.target.closest('[data-spotlight]') : null;
      if (el !== target) {
        if (target) target.style.removeProperty('--mx');
        target = el;
      }
      if (!target) return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
