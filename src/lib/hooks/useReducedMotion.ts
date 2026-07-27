'use client';

import { useEffect, useState } from 'react';

/**
 * Verdadero si hay que suprimir el movimiento.
 *
 * Se consultan dos fuentes, porque no bastan por separado:
 *   - `prefers-reduced-motion` del sistema operativo.
 *   - El interruptor propio del panel de accesibilidad, que escribe
 *     `data-movimiento="reducido"` en <html>.
 *
 * Devuelve `true` durante el primer render en servidor para que ninguna
 * animación arranque antes de conocer la preferencia real.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;

    const read = () =>
      setReduced(mq.matches || root.getAttribute('data-movimiento') === 'reducido');

    read();
    mq.addEventListener('change', read);

    // El panel de accesibilidad puede cambiar el atributo en cualquier momento.
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-movimiento'] });

    return () => {
      mq.removeEventListener('change', read);
      observer.disconnect();
    };
  }, []);

  return reduced;
}

export default useReducedMotion;
