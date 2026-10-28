import { useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/useMotion';

/**
 * Pointer-tracking 3D tilt.
 *
 * A card that leans towards the cursor in real 3D (rotateX/rotateY around its
 * own centre) with a soft light sheen following the pointer. Cheap: one
 * transform per frame on the element, no library, and the value is written
 * straight to the node so React never re-renders while the mouse moves.
 *
 * Switched off entirely for `prefers-reduced-motion` and for touch pointers,
 * where a tilt is meaningless and would only cause flicker mid-scroll.
 */
export default function Tilt({
  children,
  className = '',
  max = 9,
  scale = 1.015,
  glare = true,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const frame = useRef(0);
  const reduced = usePrefersReducedMotion();

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    if (glare) el.style.setProperty('--tilt-sheen', '0');
  };

  const onPointerMove = (e) => {
    if (reduced || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 … 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(
        px * max
      ).toFixed(2)}deg) scale(${scale})`;
      if (glare) {
        el.style.setProperty('--tilt-x', `${(px + 0.5) * 100}%`);
        el.style.setProperty('--tilt-y', `${(py + 0.5) * 100}%`);
        el.style.setProperty('--tilt-sheen', '1');
      }
    });
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      style={{ transformStyle: 'preserve-3d', ...style }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      {...rest}
    >
      {children}
      {glare && <span className="tilt__sheen" aria-hidden />}
    </div>
  );
}
