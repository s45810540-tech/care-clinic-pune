import { useEffect, useRef } from 'react';

/**
 * Reading-progress hairline.
 *
 * A 3px spectrum bar pinned above the header. It is the only element on the page
 * that reports scroll position, and it earns its keep on a long home page: the
 * visitor can see how much is left without a scrollbar hunt.
 *
 * Implementation notes:
 *  - one passive scroll listener, all work batched into requestAnimationFrame;
 *  - the bar is transform-only (scaleX), so it never triggers layout;
 *  - it is decorative for assistive tech (`aria-hidden`), because the same
 *    information is in the scrollbar.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent" aria-hidden>
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-brand-500 via-sky-500 to-coral-500"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  );
}
