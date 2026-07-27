'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { BdpSeal } from '@/components/brand/BdpSeal';
import { scrollTo } from '@/components/motion/SmoothScroll';

/**
 * Riel lateral izquierdo.
 *
 * Es el elemento que más carácter le da a la referencia y el que mejor se
 * traduce a este contexto: el sello institucional arriba, un contador de
 * 00 a 100 en el centro y la guía de scroll abajo.
 *
 * Sobre el contador: no es decorativo. En una página de convocatorias muy
 * larga la persona necesita saber cuánto le queda, y un número es más
 * legible de reojo que una barra fina. Al llegar al final se convierte en
 * el botón "ir arriba", igual que en la referencia.
 *
 * El valor se escribe directamente en el DOM en vez de pasar por el estado
 * de React: se actualiza en cada fotograma del scroll y provocar cien
 * renders por segundo sería absurdo. Sólo el cruce del umbral del 97 % pasa
 * por `useState`, porque ahí sí cambia la estructura.
 */
export function ScrollRail() {
  const { d } = useI18n();
  const valueRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const pct = Math.round(progress * 100);

      if (valueRef.current) {
        valueRef.current.textContent = String(pct).padStart(2, '0');
      }
      if (fillRef.current) {
        fillRef.current.style.setProperty('--progress', String(progress));
      }
      setAtEnd(pct >= 97);
    };

    const onScroll = () => {
      // Coalescemos en un único fotograma: el evento de scroll puede
      // dispararse muchas más veces que refresca la pantalla.
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <aside className="scroll-rail" aria-hidden="true">
      <BdpSeal caption="BDP · TALENTO · BOLIVIA · " />

      <div className="rail-counter">
        <span className="rail-counter__line">
          <span ref={fillRef} />
        </span>
        <span className="rail-counter__value" ref={valueRef}>
          00
        </span>
      </div>

      <button
        type="button"
        className="rail-scroll"
        data-mode={atEnd ? 'top' : 'down'}
        onClick={() => scrollTo(atEnd ? 0 : window.innerHeight)}
        tabIndex={-1}
      >
        <span className="rail-scroll__text">{atEnd ? d.footer.toTop : d.hero.scroll}</span>
        <span className="rail-scroll__arrow" />
      </button>
    </aside>
  );
}

export default ScrollRail;
