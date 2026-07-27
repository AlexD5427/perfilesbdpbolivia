/**
 * Identidad BDP reconstruida como SVG vectorial.
 *
 * El logotipo oficial se compone de dos elementos:
 *   1. El cúmulo de cinco hexágonos (dos navy #004282, tres cian #00b0d8)
 *      que asciende de izquierda a derecha: la metáfora de crecimiento
 *      productivo del banco.
 *   2. El lettering "BDP" con la D en navy, la P en cian y la B en navy.
 *
 * Se omite el microtexto legal del archivo original: es ilegible por debajo
 * de 200 px de ancho y sólo añadiría peso al bundle.
 *
 * `tone` permite pintar toda la marca de un solo color, necesario para
 * colocarla sobre fondos fotográficos o dentro del sello rotatorio.
 */

type Tone = 'color' | 'light' | 'dark' | 'current';

type Props = {
  variant?: 'full' | 'mark';
  tone?: Tone;
  className?: string;
  title?: string;
};

const NAVY = '#004282';
const CYAN = '#00b0d8';

function fills(tone: Tone) {
  switch (tone) {
    case 'light':
      return { navy: '#ffffff', cyan: '#ffffff' };
    case 'dark':
      return { navy: '#04121f', cyan: '#04121f' };
    case 'current':
      return { navy: 'currentColor', cyan: 'currentColor' };
    default:
      return { navy: NAVY, cyan: CYAN };
  }
}

/** Los cinco hexágonos, en coordenadas del archivo original. */
function Cluster({ navy, cyan }: { navy: string; cyan: string }) {
  return (
    <>
      <path
        fill={cyan}
        d="M9.59,29.92H4.44a1.88,1.88,0,0,0-.93.25,1.78,1.78,0,0,0-.68.68L1.54,33.08.25,35.31a1.87,1.87,0,0,0,0,1.87l1.29,2.23,1.29,2.23a1.78,1.78,0,0,0,.68.68,1.88,1.88,0,0,0,.93.25H9.59a1.89,1.89,0,0,0,1.62-.93l1.28-2.23,1.29-2.23a1.87,1.87,0,0,0,0-1.87l-1.29-2.23-1.28-2.23a1.89,1.89,0,0,0-1.62-.93Z"
      />
      <path
        fill={navy}
        d="M26.12,36H20.64a1.82,1.82,0,0,0-1.55.89l-1.36,2.37L16.36,41.6a1.81,1.81,0,0,0-.24.9,1.75,1.75,0,0,0,.24.89l1.37,2.37,1.36,2.37a1.8,1.8,0,0,0,1.55.9h5.48a1.79,1.79,0,0,0,.89-.24,1.82,1.82,0,0,0,.66-.66L29,45.76l1.37-2.37a1.75,1.75,0,0,0,.24-.89,1.81,1.81,0,0,0-.24-.9L29,39.23l-1.37-2.37a1.72,1.72,0,0,0-.66-.65A1.7,1.7,0,0,0,26.12,36Z"
      />
      <path
        fill={cyan}
        d="M24.52,14.57H17.16a2.75,2.75,0,0,0-1.35.36,2.69,2.69,0,0,0-1,1L13,19.11l-1.84,3.18a2.73,2.73,0,0,0,0,2.71L13,28.18l1.84,3.18a2.73,2.73,0,0,0,2.34,1.36h7.36a2.63,2.63,0,0,0,1.35-.37,2.69,2.69,0,0,0,1-1l1.84-3.18L30.54,25a2.73,2.73,0,0,0,0-2.71L28.7,19.11l-1.84-3.19a2.69,2.69,0,0,0-1-1A2.72,2.72,0,0,0,24.52,14.57Z"
      />
      <path
        fill={cyan}
        d="M44,23.59h-7a2.66,2.66,0,0,0-1.3.35,2.62,2.62,0,0,0-1,.95l-1.76,3.05-1.76,3a2.59,2.59,0,0,0,0,2.6l1.76,3,1.76,3a2.57,2.57,0,0,0,1,1,2.66,2.66,0,0,0,1.3.35h7a2.66,2.66,0,0,0,1.3-.35,2.57,2.57,0,0,0,.95-1l1.76-3,1.76-3a2.59,2.59,0,0,0,0-2.6l-1.76-3-1.76-3.05a2.62,2.62,0,0,0-.95-.95A2.66,2.66,0,0,0,44,23.59Z"
      />
      <path
        fill={navy}
        d="M43.15,0H35a2.88,2.88,0,0,0-1.44.39,2.79,2.79,0,0,0-1.05,1L30.47,5l-2,3.52a2.89,2.89,0,0,0-.39,1.44,2.83,2.83,0,0,0,.39,1.44l2,3.53,2,3.53a2.93,2.93,0,0,0,1.05,1.05,2.88,2.88,0,0,0,1.44.39h8.15a2.89,2.89,0,0,0,2.49-1.44l2-3.53,2-3.53a2.92,2.92,0,0,0,.38-1.44,3,3,0,0,0-.38-1.44L47.68,5l-2-3.53a2.72,2.72,0,0,0-1-1A2.88,2.88,0,0,0,43.15,0Z"
      />
    </>
  );
}

/** Lettering B D P. */
function Wordmark({ navy, cyan }: { navy: string; cyan: string }) {
  return (
    <>
      <path
        fill={navy}
        d="M85.05,11.85a2.35,2.35,0,0,1,2.39-2.32h13.29c8.62,0,12.46,3.13,12.46,11.66v6.28c0,8.21-2.73,12.1-11.35,12.1H85.05ZM93.3,32.34h7.22c3,0,4.17-2,4.17-5.12V20.93c0-3.88-1.28-4.68-4.17-4.68h-6.2a1,1,0,0,0-1,1Z"
      />
      <path
        fill={cyan}
        d="M116.6,39.57V11.87a2.45,2.45,0,0,1,2.55-2.34h14.2c8.27,0,11.38,3.17,11.38,11,0,8.45-2.09,11.33-11.38,11.33H128a2.42,2.42,0,0,0-2.52,2.3v5.39Zm15-14.66c3.51-.12,4-.48,4-4.36,0-3.09-.53-4.05-4-4.05h-4.86a1.23,1.23,0,0,0-1.23,1.23v7.18Z"
      />
      <path
        fill={navy}
        d="M76.81,23.72s3.37-1.1,3.37-6.8S75.56,9.55,72,9.55H55.83a2.27,2.27,0,0,0-2.32,2.21v26a1.77,1.77,0,0,0,1.77,1.77h17.5c3.2,0,8.86-1.29,8.86-8.66C81.64,24.44,76.81,23.72,76.81,23.72Zm-15-6.44A1.17,1.17,0,0,1,63,16.1h5.42c2.2.08,2.47.76,2.47,2.57,0,2.4-.67,2.88-3.41,2.88H61.86ZM67.78,33H61.86V28.14a1,1,0,0,1,1-1h5.07c2.55,0,3.45.36,3.45,2.85S70.32,33,67.78,33Z"
      />
    </>
  );
}

export function BdpLogo({ variant = 'full', tone = 'color', className, title }: Props) {
  const { navy, cyan } = fills(tone);
  const isMark = variant === 'mark';

  return (
    <svg
      className={className}
      viewBox={isMark ? '0 0 51 49.03' : '0 0 144.73 49.03'}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <Cluster navy={navy} cyan={cyan} />
      {isMark ? null : <Wordmark navy={navy} cyan={cyan} />}
    </svg>
  );
}

export default BdpLogo;
