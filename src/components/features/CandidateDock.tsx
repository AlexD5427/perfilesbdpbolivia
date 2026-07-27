'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { usePortal } from '@/lib/state/PortalProvider';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Icon, type IconName } from '@/components/system/Icon';

type DockEntry = {
  href: string;
  label: string;
  icon: IconName;
  badge?: number;
};

/**
 * Dock del espacio de candidatura.
 *
 * La magnificación al pasar el puntero funciona igual que en macOS: cada
 * icono crece en función de su distancia al cursor, no sólo el que está
 * debajo. Un único elemento que crece se lee como un botón grande; toda la
 * fila deformándose como una onda se lee como un dock. La diferencia está
 * en la curva: se usa una gaussiana con sigma de 1,5 celdas, que reparte el
 * crecimiento entre unos cinco iconos.
 *
 * El tamaño se escribe como variable CSS en cada nodo dentro de un
 * `requestAnimationFrame`. Con estado de React, mover el ratón por el dock
 * dispararía un render por fotograma para animar diez cajas.
 *
 * En dispositivos táctiles no hay puntero, así que el dock se comporta como
 * una barra de navegación normal y desplazable en horizontal.
 */
export function CandidateDock() {
  const { d } = useI18n();
  const pathname = usePathname();
  const { saved, alerts, completeness } = usePortal();
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  const BASE = 46;
  const MAX = 68;
  const SIGMA = 1.5;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || reduced) return;

    // Sin puntero fino (móvil, tableta) la magnificación no aporta nada.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const items = Array.from(rail.querySelectorAll<HTMLElement>('.dock-item'));
    let frame = 0;
    let pointerX = 0;

    const apply = () => {
      frame = 0;
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        // Distancia en "celdas" de dock, no en píxeles: así el efecto se
        // comporta igual con cualquier tamaño base.
        const distance = Math.abs(pointerX - center) / BASE;
        const gain = Math.exp(-(distance * distance) / (2 * SIGMA * SIGMA));
        item.style.setProperty('--dock-size', `${BASE + (MAX - BASE) * gain}px`);
      });
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      items.forEach((item) => item.style.setProperty('--dock-size', `${BASE}px`));
    };

    rail.addEventListener('pointermove', onMove);
    rail.addEventListener('pointerleave', onLeave);

    return () => {
      rail.removeEventListener('pointermove', onMove);
      rail.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const primary: DockEntry[] = [
    { href: '/candidato', label: d.nav.space, icon: 'layers' },
    { href: '/candidato/perfil', label: d.dash.profile, icon: 'user' },
    { href: '/candidato/cv', label: d.dash.cv, icon: 'file' },
    { href: '/candidato/cartas-presentacion', label: d.dash.letters, icon: 'clipboard' },
    { href: '/candidato/evaluaciones', label: d.dash.assessments, icon: 'sparkles' },
  ];

  const secondary: DockEntry[] = [
    { href: '/candidato/postulaciones', label: d.dash.saved, icon: 'bookmark', badge: saved.length },
    { href: '/candidato/notificaciones', label: d.dash.alerts, icon: 'bell', badge: alerts.length },
    { href: '/procesos', label: d.nav.jobs, icon: 'search' },
    { href: '/candidato/configuracion', label: d.dash.settings, icon: 'settings' },
  ];

  const renderItem = (entry: DockEntry) => (
    <Link
      key={entry.href}
      href={entry.href}
      className="dock-item"
      aria-current={pathname === entry.href ? 'page' : undefined}
      aria-label={entry.label}
    >
      <Icon name={entry.icon} />
      {entry.badge ? (
        <span className="dock-item__badge" aria-hidden="true">
          {entry.badge}
        </span>
      ) : null}
      <span className="dock-item__tip" aria-hidden="true">
        {entry.label}
      </span>
    </Link>
  );

  return (
    <nav className="candidate-dock" aria-label={d.nav.space}>
      <div className="candidate-dock__rail" ref={railRef}>
        {primary.map(renderItem)}
        <span className="dock-sep" aria-hidden="true" />
        {secondary.map(renderItem)}
        <span className="dock-sep" aria-hidden="true" />
        {/* El anillo de completitud vive en el dock a propósito: es el dato
            que más cambia el comportamiento de la persona candidata. */}
        <Link href="/candidato/perfil" className="dock-item" aria-label={d.dash.completeness}>
          <span className="dock-ring" style={{ ['--pct' as string]: completeness.pct }}>
            <span>{completeness.pct}</span>
          </span>
          <span className="dock-item__tip" aria-hidden="true">
            {d.dash.completeness}: {completeness.pct}%
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default CandidateDock;
