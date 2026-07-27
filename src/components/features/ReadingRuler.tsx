'use client';

import { useEffect, useRef } from 'react';
import { useA11y } from '@/lib/state/A11yProvider';

/**
 * Guía de lectura.
 *
 * Una banda horizontal que sigue al puntero y oscurece el resto de la
 * página. Ayuda a quien pierde el renglón: dislexia, baja visión, fatiga
 * o simplemente textos largos.
 *
 * La posición se escribe directamente en el estilo del nodo dentro de un
 * `requestAnimationFrame`; pasar cada movimiento del ratón por el estado de
 * React haría trabajar al reconciliador cientos de veces por segundo para
 * mover un rectángulo.
 */
export function ReadingRuler() {
  const { prefs } = useA11y();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!prefs.regla) return;

    let frame = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      const el = ref.current;
      if (el) el.style.transform = `translateY(${y}px)`;
    };

    const onMove = (event: PointerEvent) => {
      // Centramos la banda en el cursor: la mitad de su altura (4,2 rem).
      y = event.clientY - 33;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [prefs.regla]);

  if (!prefs.regla) return null;

  return <div className="reading-ruler" ref={ref} aria-hidden="true" />;
}

export default ReadingRuler;
