'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useI18n } from '@/lib/i18n';

type Props = {
  to: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
};

/**
 * Contador que sube al entrar en pantalla.
 *
 * El valor se formatea con el `Intl.NumberFormat` del idioma activo en cada
 * fotograma, de modo que los separadores de millar son los correctos en
 * castellano y no los del inglés.
 */
export function Counter({ to, className, suffix = '', prefix = '', duration = 2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { num } = useI18n();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.textContent = `${prefix}${num(to)}${suffix}`;
      return;
    }

    const state = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        value: to,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${prefix}${num(Math.round(state.value))}${suffix}`;
        },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [to, duration, prefix, suffix, reduced, num]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

export default Counter;
