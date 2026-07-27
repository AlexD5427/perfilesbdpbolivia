'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Inclinación máxima en grados. Cero desactiva el efecto 3D. */
  tilt?: number;
  as?: 'div' | 'article' | 'section' | 'li';
};

/**
 * Panel de vidrio con reflejo especular reactivo al puntero.
 *
 * El brillo se escribe como variables CSS (`--mx`, `--my`) en lugar de
 * animarse con JS: así el navegador lo resuelve en el compositor y no hay
 * recálculo de estilo por cada movimiento del ratón.
 *
 * La inclinación se mantiene deliberadamente baja (4 grados por defecto).
 * Un tilt agresivo delata el truco y abarata la pieza; a este ángulo sólo
 * se percibe como que el cristal "atrapa" la luz.
 */
export function GlassSurface({ children, className, tilt = 4, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);

    if (tilt > 0) {
      el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * tilt}deg) rotateY(${(px - 0.5) * tilt}deg)`;
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '0%');
  };

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={['glass', className].filter(Boolean).join(' ')}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </Tag>
  );
}

export default GlassSurface;
