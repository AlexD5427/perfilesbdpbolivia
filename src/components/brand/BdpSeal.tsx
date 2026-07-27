'use client';

import { useId } from 'react';
import { BdpLogo } from './BdpLogo';

/**
 * Sello circular rotatorio.
 *
 * Traducción directa del emblema de ERA: un texto que corre sobre una
 * circunferencia con el símbolo de la casa en el centro. Allí decía
 * "ERA RESIDENCE" repetido; aquí gira el nombre del banco.
 *
 * El texto se repite dos veces a 180 grados para que la lectura sea
 * continua sin importar dónde se detenga la rotación.
 */
export function BdpSeal({
  spin = true,
  className,
  caption = 'BDP · TALENTO ·',
}: {
  spin?: boolean;
  className?: string;
  caption?: string;
}) {
  const id = useId().replace(/:/g, '');
  const pathId = `seal-path-${id}`;

  return (
    <span className={['seal', spin ? 'seal--spin' : '', className].filter(Boolean).join(' ')}>
      <svg className="seal__ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <defs>
          {/* Circunferencia de rodadura del texto */}
          <path id={pathId} d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" fill="none" />
        </defs>
        <text>
          <textPath href={`#${pathId}`} startOffset="0%">
            {caption}
          </textPath>
          <textPath href={`#${pathId}`} startOffset="50%">
            {caption}
          </textPath>
        </text>
      </svg>
      <BdpLogo variant="mark" tone="current" className="seal__mark" />
    </span>
  );
}

export default BdpSeal;
