/**
 * Ornamentos geometricos.
 *
 * La referencia rompe su reticula con buganvillas recortadas que invaden las
 * esquinas. El gesto es excelente: introduce materia organica en una
 * composicion severa. Copiar la flor seria fuera de lugar en un banco de
 * desarrollo boliviano, asi que se conserva el gesto y se cambia el motivo
 * por geometria textil andina: rombos escalonados, chevrones y la chakana.
 *
 * Se dibujan solo con trazo, nunca macizos, para que convivan con el vidrio
 * sin robarle protagonismo al texto.
 */

export type OrnamentKind = 'rombos' | 'chevron' | 'cruz' | 'telar';

type Props = {
  kind?: OrnamentKind;
  className?: string;
  tone?: string;
  opacity?: number;
};

const CELLS = [0, 1, 2, 3, 4];

function Rombos({ tone }: { tone: string }) {
  return (
    <g stroke={tone} fill="none" strokeWidth="1">
      {CELLS.map((row) =>
        CELLS.map((col) => {
          const x = 30 + col * 42;
          const y = 30 + row * 42;
          const scale = Math.max(1 - (row + col) * 0.07, 0.3);
          const s = 17 * scale;
          return (
            <g key={`${row}-${col}`} opacity={Math.max(0.15, 1 - (row + col) * 0.12)}>
              <path d={`M${x},${y - s} L${x + s},${y} L${x},${y + s} L${x - s},${y} Z`} />
              <path
                d={`M${x},${y - s * 0.45} L${x + s * 0.45},${y} L${x},${y + s * 0.45} L${x - s * 0.45},${y} Z`}
              />
            </g>
          );
        }),
      )}
    </g>
  );
}

function Chevron({ tone }: { tone: string }) {
  const rows = [0, 1, 2, 3, 4, 5, 6];
  return (
    <g stroke={tone} fill="none" strokeWidth="1.1">
      {rows.map((r) => (
        <path
          key={r}
          d={`M10,${34 + r * 26} L60,${8 + r * 26} L110,${34 + r * 26} L160,${8 + r * 26} L210,${34 + r * 26}`}
          opacity={Math.max(0.12, 1 - r * 0.14)}
        />
      ))}
    </g>
  );
}

function Cruz({ tone }: { tone: string }) {
  // Chakana: cruz escalonada andina, construida con un unico trazo cerrado.
  const u = 22;
  const c = 110;
  const d = [
    `M${c - u / 2},${c - u * 2.5}`,
    `h${u} v${u} h${u} v${u} h${u} v${u} h-${u} v${u} h-${u} v${u} h-${u}`,
    `v-${u} h-${u} v-${u} h-${u} v-${u} h${u} v-${u} h${u} Z`,
  ].join(' ');

  return (
    <g stroke={tone} fill="none">
      <path d={d} strokeWidth="1.2" opacity="0.8" />
      <path
        d={d}
        strokeWidth="0.8"
        opacity="0.35"
        transform={`translate(${c} ${c}) scale(0.6) translate(-${c} -${c})`}
      />
      <path
        d={d}
        strokeWidth="0.6"
        opacity="0.18"
        transform={`translate(${c} ${c}) scale(1.42) translate(-${c} -${c})`}
      />
      <circle cx={c} cy={c} r="5" strokeWidth="1" opacity="0.6" />
    </g>
  );
}

function Telar({ tone }: { tone: string }) {
  const lines = Array.from({ length: 14 }, (_, i) => i);
  return (
    <g stroke={tone} fill="none" strokeWidth="0.9">
      {lines.map((i) => (
        <line
          key={`v${i}`}
          x1={14 + i * 15}
          y1="8"
          x2={14 + i * 15}
          y2="212"
          opacity={i % 3 === 0 ? 0.5 : 0.16}
        />
      ))}
      {lines.map((i) => (
        <line
          key={`h${i}`}
          x1="8"
          y1={14 + i * 15}
          x2="212"
          y2={14 + i * 15}
          opacity={i % 4 === 0 ? 0.42 : 0.12}
        />
      ))}
      {[2, 5, 8, 11].map((i) => (
        <rect key={`b${i}`} x={14 + i * 15} y={14 + i * 15} width="15" height="15" opacity="0.55" />
      ))}
    </g>
  );
}

export function Ornament({ kind = 'rombos', className, tone = 'currentColor', opacity }: Props) {
  return (
    <svg
      className={['ornament', className].filter(Boolean).join(' ')}
      viewBox="0 0 220 220"
      style={opacity === undefined ? undefined : { opacity }}
      aria-hidden="true"
      focusable="false"
    >
      {kind === 'rombos' ? <Rombos tone={tone} /> : null}
      {kind === 'chevron' ? <Chevron tone={tone} /> : null}
      {kind === 'cruz' ? <Cruz tone={tone} /> : null}
      {kind === 'telar' ? <Telar tone={tone} /> : null}
    </svg>
  );
}

export default Ornament;
