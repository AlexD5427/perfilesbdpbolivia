'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

type Mode = 'chars' | 'words' | 'lines';

type Props = {
  children: string;
  as?: ElementType;
  mode?: Mode;
  className?: string;
  /** Retardo antes de empezar, en segundos. */
  delay?: number;
  /** Separación entre piezas. Por debajo de 0.02 el efecto se pierde. */
  stagger?: number;
  /** Si es falso, la animación se dispara al montar en vez de con el scroll. */
  onScroll?: boolean;
  /** Se ejecuta al terminar; útil para encadenar secuencias. */
  onDone?: () => void;
};

/**
 * Revelado tipográfico carácter por carácter.
 *
 * Este es EL gesto de la referencia. En las capturas intermedias se ven
 * letras a distintas opacidades y alturas dentro del mismo titular: no son
 * estados de diseño distintos, es un stagger largo con solapamiento. Cada
 * carácter recorre opacidad 0→1, un desplazamiento vertical y una ligera
 * compresión de altura, y como la separación entre ellos (0.028 s) es mucho
 * menor que la duración individual (1.1 s), en cualquier fotograma conviven
 * treinta letras en distinto punto de su recorrido. De ahí el aspecto de
 * "letras fantasma" que se densifican.
 *
 * Detalles de implementación:
 *   - Los espacios se preservan con `\u00A0` dentro de su propio `span` para
 *     que el navegador no colapse el interletraje.
 *   - Se parte por palabras primero y luego por caracteres, de modo que
 *     `word-break` siga funcionando y el titular no se corte a mitad de
 *     palabra al cambiar de idioma.
 *   - El texto original queda en `aria-label`: los lectores de pantalla leen
 *     la frase completa, no ciento veinte letras sueltas.
 */
export function SplitText({
  children,
  as: Tag = 'span',
  mode = 'chars',
  className,
  delay = 0,
  stagger,
  onScroll = true,
  onDone,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.removeAttribute('data-split-ready');
      onDone?.();
      return;
    }

    const pieces = Array.from(
      el.querySelectorAll<HTMLElement>(mode === 'chars' ? '.split-char' : '.split-word'),
    );
    if (!pieces.length) return;

    el.setAttribute('data-split-ready', 'true');

    const step = stagger ?? (mode === 'chars' ? 0.028 : 0.07);

    const ctx = gsap.context(() => {
      gsap.set(pieces, {
        opacity: 0,
        yPercent: mode === 'chars' ? 52 : 100,
        scaleY: mode === 'chars' ? 1.18 : 1,
        transformOrigin: 'bottom center',
      });

      const tween = gsap.to(pieces, {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        duration: 1.1,
        delay,
        ease: 'expo.out',
        stagger: step,
        onComplete: onDone,
        // Limpiamos las transformaciones al terminar: dejarlas activas
        // mantiene cientos de capas de composición vivas sin motivo.
        clearProps: 'transform',
        ...(onScroll
          ? {
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            }
          : {}),
      });

      return () => {
        tween.kill();
      };
    }, el);

    return () => {
      ctx.revert();
      el.removeAttribute('data-split-ready');
      ScrollTrigger.refresh();
    };
    // `children` en las dependencias es intencional: al cambiar de idioma el
    // texto cambia y hay que rehacer el corte por completo.
  }, [children, mode, delay, stagger, onScroll, reduced, onDone]);

  return (
    <Tag ref={ref} className={className} aria-label={children}>
      <span aria-hidden="true">{renderPieces(children, mode)}</span>
    </Tag>
  );
}

function renderPieces(text: string, mode: Mode): ReactNode {
  const words = text.split(' ');

  if (mode === 'words' || mode === 'lines') {
    return words.map((word, i) => (
      <span className="split-word" key={`${word}-${i}`}>
        {word}
        {i < words.length - 1 ? '\u00A0' : ''}
      </span>
    ));
  }

  return words.map((word, wi) => (
    // El envoltorio por palabra impide que el titular se parta a mitad de
    // palabra: sin él, cada carácter sería un punto de corte válido.
    <span className="split-wordwrap" key={`w-${wi}`} style={{ display: 'inline-block' }}>
      {Array.from(word).map((char, ci) => (
        <span className="split-char" key={`c-${wi}-${ci}`}>
          {char}
        </span>
      ))}
      {wi < words.length - 1 ? <span className="split-char">{'\u00A0'}</span> : null}
    </span>
  ));
}

export default SplitText;
