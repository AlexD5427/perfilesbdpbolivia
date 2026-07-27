'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useI18n } from '@/lib/i18n';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const KEY = 'bdp:cookies';

/**
 * Aviso de cookies.
 *
 * Se toma prestada la tarjeta editorial de la referencia: fondo crema,
 * la palabra en script a un tamaño desproporcionado y las dos acciones
 * como enlaces subrayados en versalitas. Es un patrón mucho más digno que
 * la barra gris de siempre, y aquí es honesto porque el portal sólo usa
 * cookies estrictamente necesarias.
 *
 * Aparece con retardo de dos segundos: interrumpir la entrada del portal
 * con un cuadro legal sería exactamente el error que comete todo el mundo.
 */
export function CookieConsent() {
  const { d } = useI18n();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(KEY);
    } catch {
      /* sin almacenamiento no podemos recordar la decisión: no molestamos */
      return;
    }
    if (stored) return;

    const id = window.setTimeout(() => setVisible(true), 2000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!visible || reduced || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 26, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'expo.out' },
    );
  }, [visible, reduced]);

  const decide = (accepted: boolean) => {
    try {
      window.localStorage.setItem(KEY, accepted ? 'accepted' : 'declined');
    } catch {
      /* la decisión no persiste, pero se respeta en esta sesión */
    }

    if (reduced || !ref.current) {
      setVisible(false);
      return;
    }

    gsap.to(ref.current, {
      opacity: 0,
      y: 18,
      scale: 0.97,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => setVisible(false),
    });
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-card"
      ref={ref}
      role="dialog"
      aria-label={d.cookies.title}
      aria-live="polite"
    >
      <p className="cookie-card__script" aria-hidden="true">
        {d.cookies.title}
      </p>
      <p>{d.cookies.body}</p>
      <div className="cookie-card__actions">
        <button type="button" onClick={() => decide(true)}>
          {d.cookies.accept}
        </button>
        <span aria-hidden="true">/</span>
        <button type="button" onClick={() => decide(false)}>
          {d.cookies.decline}
        </button>
      </div>
    </div>
  );
}

export default CookieConsent;
