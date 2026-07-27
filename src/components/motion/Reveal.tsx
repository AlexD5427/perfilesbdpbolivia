'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

type Variant = 'up' | 'fade' | 'scale' | 'mask' | 'left' | 'right';

type Props = {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  /** Escalona los hijos directos en lugar de mover el contenedor entero. */
  stagger?: number;
  className?: string;
  start?: string;
};

const FROM: Record<Variant, gsap.TweenVars> = {
  up: { opacity: 0, y: 42 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.94 },
  left: { opacity: 0, x: -48 },
  right: { opacity: 0, x: 48 },
  // El barrido de máscara descubre el contenido de abajo hacia arriba,
  // como las imágenes de la referencia al entrar en pantalla.
  mask: { clipPath: 'inset(100% 0% 0% 0%)', y: 24 },
};

const TO: Record<Variant, gsap.TweenVars> = {
  up: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  scale: { opacity: 1, scale: 1 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  mask: { clipPath: 'inset(0% 0% 0% 0%)', y: 0 },
};

/** Revelado genérico al entrar en el viewport. */
export function Reveal({
  children,
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  stagger,
  className,
  start = 'top 86%',
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const targets = stagger ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, FROM[variant], {
        ...TO[variant],
        duration: variant === 'mask' ? 1.3 : 1.05,
        delay,
        ease: 'expo.out',
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [variant, delay, stagger, start, reduced]);

  return (
    <Tag ref={ref} className={className} data-reveal={variant}>
      {children}
    </Tag>
  );
}

export default Reveal;
