'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom smooth scroll engine using lerp (linear interpolation).
 * Provides buttery-smooth scrolling without affecting navigation or
 * ScrollTrigger compatibility.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    let current = 0;
    let target = 0;
    let ease = 0.08; // Lower = smoother/slower, higher = more responsive
    let rafId: number;
    let resizeObserver: ResizeObserver;

    // Set body height to content height for native scrollbar
    const setBodyHeight = () => {
      document.body.style.height = `${content.getBoundingClientRect().height}px`;
    };

    setBodyHeight();
    resizeObserver = new ResizeObserver(setBodyHeight);
    resizeObserver.observe(content);

    // Fix wrapper position
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '100%';
    wrapper.style.willChange = 'transform';

    const smoothScroll = () => {
      target = window.scrollY;
      current += (target - current) * ease;

      // Round to prevent sub-pixel rendering issues
      const rounded = Math.round(current * 100) / 100;
      content.style.transform = `translate3d(0, ${-rounded}px, 0)`;

      rafId = requestAnimationFrame(smoothScroll);
    };

    rafId = requestAnimationFrame(smoothScroll);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      document.body.style.height = '';
      wrapper.style.position = '';
      wrapper.style.top = '';
      wrapper.style.left = '';
      wrapper.style.width = '';
      content.style.transform = '';
    };
  }, []);

  return (
    <div ref={wrapperRef} className="smooth-scroll-wrapper">
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
