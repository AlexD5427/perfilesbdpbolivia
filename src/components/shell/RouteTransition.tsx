'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { BdpLogo } from '@/components/brand/BdpLogo';

/**
 * Transición entre rutas: el arco.
 *
 * En la referencia, la sección clara sube sobre la oscura con una corona
 * semicircular. El mismo gesto sirve como transición de página: un panel
 * crema con borde superior en arco barre la pantalla de abajo arriba,
 * muestra el símbolo del banco un instante y se retira hacia arriba.
 *
 * Se ejecuta DESPUÉS de que Next haya montado la ruta nueva, no antes. Es
 * una decisión deliberada: interceptar la navegación para animar la salida
 * obliga a retrasar el cambio de página, y una web institucional no debería
 * ser más lenta a cambio de una animación. Así el velo cubre el momento en
 * que la ruta nueva se pinta, que es justo cuando hace falta.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const veilRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    // La carga inicial ya tiene su propia cortina (el preloader).
    if (first.current) {
      first.current = false;
      return;
    }

    const veil = veilRef.current;
    if (!veil || reduced) return;

    const mark = veil.querySelector('.route-veil__mark');

    const tl = gsap.timeline();
    tl.set(veil, { yPercent: 100, borderRadius: '50% 50% 0 0 / 22% 22% 0 0' })
      .set(mark, { opacity: 0, scale: 0.9 })
      .to(veil, { yPercent: 0, borderRadius: '0%', duration: 0.62, ease: 'power3.inOut' })
      .to(mark, { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out' }, '-=0.2')
      .to(mark, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '+=0.1')
      .to(veil, {
        yPercent: -100,
        borderRadius: '0 0 50% 50% / 0 0 22% 22%',
        duration: 0.7,
        ease: 'power3.inOut',
      });

    // Cada ruta nueva empieza arriba del todo: heredar el scroll anterior
    // deja a la persona en mitad de una página que no ha visto.
    window.scrollTo(0, 0);

    return () => {
      tl.kill();
    };
  }, [pathname, reduced]);

  return (
    <div className="route-veil" ref={veilRef} aria-hidden="true">
      <BdpLogo variant="mark" className="route-veil__mark" />
    </div>
  );
}

export default RouteTransition;
