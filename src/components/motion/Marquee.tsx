'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

type Props = {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Marquesina infinita.
 *
 * Se renderizan dos pistas idénticas y se desplaza el conjunto exactamente
 * el ancho de una: al llegar al final, la segunda pista ocupa la posición
 * que tenía la primera y el reinicio es invisible. Es el único método que
 * no produce un salto perceptible cuando el contenido tiene ancho variable
 * (y aquí lo tiene, porque cambia con el idioma).
 */
export function Marquee({ items, speed = 38, reverse = false, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const track = el.querySelector<HTMLElement>('.marquee__track');
    if (!track) return;

    const width = track.getBoundingClientRect().width;
    if (!width) return;

    const tween = gsap.fromTo(
      el.querySelectorAll('.marquee__track'),
      { x: reverse ? -width : 0 },
      {
        x: reverse ? 0 : -width,
        duration: width / speed,
        ease: 'none',
        repeat: -1,
      },
    );

    return () => {
      tween.kill();
    };
  }, [items, speed, reverse, reduced]);

  const track = (key: string) => (
    <div className="marquee__track" key={key} aria-hidden={key === 'b'}>
      {items.map((item, i) => (
        <span className="marquee__item" key={`${key}-${i}`}>
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className={['marquee', className].filter(Boolean).join(' ')} ref={ref}>
      {track('a')}
      {track('b')}
    </div>
  );
}

export default Marquee;
