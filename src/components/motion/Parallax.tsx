'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

type Props = {
  children: ReactNode;
  /** Recorrido total en porcentaje de la altura del elemento. */
  amount?: number;
  className?: string;
  axis?: 'y' | 'x';
  /** Escala fija mientras se desplaza; evita que asomen los bordes. */
  scale?: number;
};

/**
 * Desplazamiento diferencial ligado al scroll.
 *
 * `scrub: 1` introduce un segundo de inercia entre el scroll y el movimiento.
 * Ese retardo es justamente lo que hace que el fondo se sienta pesado y
 * distante en vez de pegado al cursor: es la diferencia entre paralaje
 * elegante y paralaje barato.
 */
export function Parallax({ children, amount = 18, className, axis = 'y', scale }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { [axis === 'y' ? 'yPercent' : 'xPercent']: -amount / 2, scale: scale ?? 1 },
        {
          [axis === 'y' ? 'yPercent' : 'xPercent']: amount / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [amount, axis, scale, reduced]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

export default Parallax;
