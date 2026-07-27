'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Motor de scroll suave.
 *
 * Decisiones que importan:
 *
 * 1. Lenis interpola la posición del scroll REAL del documento; no traduce
 *    un contenedor con transform. Eso mantiene intactos el scroll nativo del
 *    teclado, el enfoque, `position: sticky`, la barra del navegador y el
 *    scroll-anchoring. Es la diferencia entre "suave" y "suave sin romper la
 *    navegación", que es exactamente lo que se pidió.
 *
 * 2. Lenis y ScrollTrigger deben compartir un único bucle de animación. Si
 *    cada uno corre su propio requestAnimationFrame, los disparadores van un
 *    fotograma por detrás y el paralaje tiembla. Por eso Lenis se avanza
 *    desde el ticker de GSAP.
 *
 * 3. `lagSmoothing(0)` evita que GSAP intente "recuperar" tiempo tras una
 *    pausa larga de la pestaña, lo que provocaría un salto brusco.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Exponencial de salida: rápida al inicio, muy larga al final.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Los enlaces internos deben usar el mismo motor, si no el salto es seco.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -100, duration: 1.4 });
    };

    document.addEventListener('click', onAnchorClick);

    // Cualquier componente puede pedir un desplazamiento sin conocer Lenis.
    const onScrollRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ to: number | string }>).detail;
      if (!detail) return;
      lenis.scrollTo(detail.to as never, { duration: 1.4 });
    };

    window.addEventListener('bdp:scrollto', onScrollRequest);

    // Bloqueo del scroll cuando se abre un modal o la paleta de comandos.
    const onLock = (event: Event) => {
      const locked = (event as CustomEvent<{ locked: boolean }>).detail?.locked;
      if (locked) lenis.stop();
      else lenis.start();
    };

    window.addEventListener('bdp:scrolllock', onLock);

    // Tras cargar tipografías e imágenes las alturas cambian: hay que
    // recalcular o los disparadores quedan desfasados.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) void document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      window.removeEventListener('bdp:scrollto', onScrollRequest);
      window.removeEventListener('bdp:scrolllock', onLock);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}

/** Ayudas para disparar los eventos anteriores desde cualquier componente. */
export function scrollTo(to: number | string) {
  window.dispatchEvent(new CustomEvent('bdp:scrollto', { detail: { to } }));
}

export function setScrollLock(locked: boolean) {
  window.dispatchEvent(new CustomEvent('bdp:scrolllock', { detail: { locked } }));
}

export default SmoothScroll;
