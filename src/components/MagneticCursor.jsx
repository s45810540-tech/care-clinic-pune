import { useEffect, useRef } from 'react';

/**
 * Magnetic cursor: a soft ring that follows the pointer and "sticks" to elements
 * with [data-magnetic]. Desktop + fine pointer + no reduced motion only.
 * The native cursor stays visible — this is decoration, not a replacement.
 */
export default function MagneticCursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!ringEl || !dotEl) return undefined;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      dotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // Magnetise: if the pointer is near a [data-magnetic] element, pull the ring to its centre.
      const el = e.target instanceof Element ? e.target.closest('[data-magnetic]') : null;
      if (el) {
        const r = el.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
        targetScale = 2.1;
      } else {
        targetScale = 1;
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (targetScale - scale) * 0.14;
      ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] hidden md:block">
      <div ref={ring} className="absolute left-0 top-0 h-10 w-10 rounded-full border border-brand-600/50" />
      <div ref={dot} className="absolute left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent-500" />
    </div>
  );
}
