'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useI18n } from '@/lib/i18n';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { BdpLogo } from '@/components/brand/BdpLogo';

const SESSION_KEY = 'bdp:preloaded';

/**
 * Cortina de entrada.
 *
 * Reglas que se impuso esta pieza:
 *
 *   1. **Corta de verdad.** 2,4 segundos de principio a fin. Una animación
 *      de carga bonita que retiene a la persona es una animación mal hecha.
 *   2. **Una sola vez por sesión.** Se marca en `sessionStorage`: volver a
 *      la portada desde otra página no la repite. Al usuario le encanta la
 *      primera vez y le estorba la quinta.
 *   3. **No bloquea.** El contenido ya está montado y accesible debajo; esto
 *      es una capa que se retira, no una pantalla que hay que esperar.
 *   4. **Se salta.** Cualquier tecla, clic o scroll la acelera al final.
 *
 * La secuencia: el logotipo entra con un barrido de máscara vertical, las
 * palabras del titular suben escalonadas, un filete se dibuja de lado a lado
 * y dos cortinas se separan revelando la portada.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const { d } = useI18n();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finish = () => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* sin sessionStorage la cortina se repite; es aceptable */
      }
      setGone(true);
      onDone();
    };

    if (reduced) {
      // Con movimiento reducido no hay coreografía: se muestra el mensaje
      // un instante por cortesía y se retira.
      const id = window.setTimeout(finish, 450);
      return () => window.clearTimeout(id);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: finish });
      timeline.current = tl;

      tl.to('.preloader__aura', { opacity: 1, duration: 1.1 }, 0)
        .fromTo(
          '.preloader__logo',
          { opacity: 0, yPercent: 18, clipPath: 'inset(100% 0% 0% 0%)' },
          { opacity: 1, yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05 },
          0.1,
        )
        .fromTo(
          '.preloader__word',
          { opacity: 0, yPercent: 105, rotate: 2 },
          { opacity: 1, yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.08 },
          0.45,
        )
        .fromTo(
          '.preloader__rule span',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.05, ease: 'power2.inOut' },
          0.6,
        )
        .to('.preloader__meta', { opacity: 1, duration: 0.6 }, 0.85)
        // Salida: el contenido sube y se desvanece antes de que las cortinas
        // se abran, para que no se vea el texto cortado por el borde.
        .to(
          '.preloader__stage',
          { opacity: 0, yPercent: -6, duration: 0.55, ease: 'power2.in' },
          1.75,
        )
        .to('.preloader__aura', { opacity: 0, duration: 0.5 }, 1.75)
        .to(
          '.preloader__curtain--top',
          { yPercent: -100, duration: 0.95, ease: 'power4.inOut' },
          1.95,
        )
        .to(
          '.preloader__curtain--bottom',
          { yPercent: 100, duration: 0.95, ease: 'power4.inOut' },
          1.95,
        );
    }, root);

    // Escape rápido: quien ya la vio no debería tener que esperarla.
    const skip = () => timeline.current?.timeScale(4.5);
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('wheel', skip, { once: true, passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
    };
  }, [reduced, onDone]);

  if (gone) return null;

  const words = d.preloader.line.split(' ');

  return (
    <div className="preloader" ref={rootRef} role="status" aria-live="polite">
      <div className="preloader__aura" />
      <div className="preloader__curtain preloader__curtain--top" />
      <div className="preloader__curtain preloader__curtain--bottom" />

      <div className="preloader__stage">
        <BdpLogo variant="full" tone="light" className="preloader__logo" />

        <h1 className="preloader__title">
          {words.map((word, i) => (
            <span className="preloader__word" key={`w-${i}`}>
              {word}
            </span>
          ))}
          <span className="preloader__word">{d.preloader.entity}</span>
        </h1>

        <div className="preloader__rule">
          <span />
        </div>

        <p className="preloader__meta">{d.preloader.meta}</p>
      </div>
    </div>
  );
}

/** Verdadero si la cortina ya se mostró en esta sesión del navegador. */
export function preloaderAlreadyShown(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export default Preloader;
