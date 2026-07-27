'use client';

import { useI18n } from '@/lib/i18n';

/**
 * Anillo de progreso.
 *
 * Se dibuja con `stroke-dasharray` sobre un círculo SVG. El valor se anuncia
 * con `role="progressbar"` y sus atributos ARIA: un anillo que sólo existe
 * visualmente no comunica nada a quien usa lector de pantalla.
 */
export function ProgressRing({
  value,
  size = 74,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <span
      className="ring"
      style={{ ['--ring-size' as string]: `${size}px` }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ring__track" cx="50" cy="50" r={radius} />
        <circle
          className="ring__value"
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="ring__label" aria-hidden="true">
        {clamped}
      </span>
    </span>
  );
}

/** Barra de compatibilidad perfil / convocatoria. */
export function MatchMeter({ score, compact = false }: { score: number; compact?: boolean }) {
  const { d } = useI18n();

  return (
    <div
      className="match"
      role="progressbar"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={d.features.match}
    >
      {compact ? null : <span className="label label--tiny">{d.features.match}</span>}
      <span className="match__bar">
        <span className="match__fill" style={{ ['--match' as string]: score / 100 }} />
      </span>
      <span className="match__value">{score}%</span>
    </div>
  );
}

export default ProgressRing;
