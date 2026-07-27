'use client';

import Link from 'next/link';
import { useRef, type MouseEvent, type ReactNode } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

// Radio 49 sobre un lienzo de 100: deja medio píxel de respiro para el trazo.
const R = 49;
const CIRC = 2 * Math.PI * R;

/**
 * Botón circular con anillo que se dibuja.
 *
 * En la referencia estos botones aparecen sobre las fotografías ("VIEW
 * AVAILABLE APARTMENTS", "BOOK A CALL NOW"). El anillo no aparece de golpe:
 * se traza desde arriba en sentido horario. Aquí se consigue animando
 * `strokeDashoffset` desde la circunferencia completa hasta cero.
 *
 * Además el conjunto sigue ligeramente al puntero dentro de su área, lo que
 * da la sensación de que el círculo tiene masa.
 */
export function CircleButton({ children, href, onClick, className, ariaLabel }: Props) {
  const ref = useRef<HTMLElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const handleEnter = () => {
    if (reduced || !circleRef.current) return;
    gsap.fromTo(
      circleRef.current,
      { strokeDashoffset: CIRC },
      { strokeDashoffset: 0, duration: 1.1, ease: 'expo.out', overwrite: true },
    );
  };

  const handleLeave = () => {
    if (reduced) return;
    if (circleRef.current) {
      gsap.to(circleRef.current, { strokeDashoffset: CIRC, duration: 0.5, ease: 'power2.inOut' });
    }
    gsap.to([ref.current, labelRef.current], { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
  };

  const handleMove = (event: MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: dx * 0.16, y: dy * 0.16, duration: 0.5, ease: 'power3.out' });
    // La etiqueta se mueve un poco más que el anillo: microparalaje interno.
    gsap.to(labelRef.current, { x: dx * 0.08, y: dy * 0.08, duration: 0.6, ease: 'power3.out' });
  };

  const inner = (
    <>
      <svg className="circle-btn__ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r={R}
          strokeDasharray={CIRC}
          strokeDashoffset={reduced ? 0 : CIRC}
        />
      </svg>
      <span className="circle-btn__label" ref={labelRef}>
        {children}
      </span>
    </>
  );

  const shared = {
    className: ['circle-btn', className].filter(Boolean).join(' '),
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onMouseMove: handleMove,
    onFocus: handleEnter,
    onBlur: handleLeave,
    'aria-label': ariaLabel,
  };

  if (href) {
    return (
      <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} {...shared}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" ref={ref as React.Ref<HTMLButtonElement>} onClick={onClick} {...shared}>
      {inner}
    </button>
  );
}

export default CircleButton;
