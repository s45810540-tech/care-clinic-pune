import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../hooks/useScroll';

/**
 * Animated number counter (years, patients, rating).
 * Starts once when scrolled into view; respects prefers-reduced-motion
 * by jumping straight to the final value.
 */
export default function Counter({ value, duration = 1.8, suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(value);
      return undefined;
    }

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => setDisplay(obj.val),
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, duration]);

  const formatted =
    decimals > 0
      ? Number(display).toFixed(decimals)
      : Math.round(display).toLocaleString('en-IN');

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}

/** Re-runs ScrollTrigger measurement after mount (fonts/layout settle). */
export function useRefreshTriggers(deps = []) {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
