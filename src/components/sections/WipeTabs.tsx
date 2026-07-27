'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Scene, type SceneKind } from '@/components/visual/Scene';
import { CircleButton } from '@/components/motion/CircleButton';

export type WipeTab = {
  id: string;
  tab: string;
  body: string;
  scene: SceneKind;
};

/**
 * Pestañas con barrido diagonal.
 *
 * La sección de amenities de la referencia y, de lejos, su transición más
 * reconocible. En las capturas se ve el corte inclinado a media pasada: la
 * escena nueva no aparece con un fundido, entra empujando a la anterior con
 * un borde recto de unos 8 grados.
 *
 * Se implementa con `clip-path` sobre un polígono cuyos vértices superiores
 * e inferiores están desfasados en el eje X. Ese desfase es lo que produce
 * la inclinación. Estado de reposo: el polígono está colapsado a la
 * izquierda, fuera del encuadre. Estado activo: cubre todo el panel.
 *
 * Se anima `clip-path` en lugar de mover un elemento porque así el fondo no
 * se desplaza: la escena está quieta y lo que viaja es la máscara, que es
 * exactamente lo que ocurre en la referencia.
 *
 * Accesibilidad: es un patrón de pestañas real, con `role="tablist"`,
 * flechas del teclado y `aria-selected`. Que sea espectacular no lo exime
 * de ser navegable.
 */
export function WipeTabs({ tabs, ctaHref = '/procesos' }: { tabs: WipeTab[]; ctaHref?: string }) {
  const { d } = useI18n();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  // El indicador vertical se posiciona midiendo el botón activo. Calcularlo
  // con CSS puro exigiría alturas fijas, y los rótulos cambian de longitud
  // con el idioma.
  useEffect(() => {
    const list = listRef.current;
    const marker = markerRef.current;
    if (!list || !marker) return;

    const buttons = list.querySelectorAll<HTMLElement>('.wipe-tabs__tab');
    const current = buttons[active];
    if (!current) return;

    marker.style.height = `${current.offsetHeight}px`;
    marker.style.transform = `translateY(${current.offsetTop}px)`;
  }, [active, tabs]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      setActive((i) => (i + 1) % tabs.length);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      setActive((i) => (i - 1 + tabs.length) % tabs.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(tabs.length - 1);
    }
  };

  const current = tabs[active];

  return (
    <section className="wipe-tabs section--flush" data-canvas="night">
      <div className="wipe-tabs__scenes" aria-hidden="true">
        {tabs.map((tab, i) => (
          <div
            className="wipe-scene"
            key={tab.id}
            data-active={i === active}
            style={{
              // 1,05 s con entrada y salida suaves: por debajo de un segundo
              // el barrido se percibe como un parpadeo.
              transition: 'clip-path 1.05s cubic-bezier(0.76, 0, 0.24, 1)',
              zIndex: i === active ? 2 : 1,
            }}
          >
            <Scene kind={tab.scene} />
            <div className="wipe-scene__scrim" />
          </div>
        ))}
      </div>

      <div className="wipe-tabs__inner shell shell--railed">
        <div
          className="wipe-tabs__list"
          role="tablist"
          aria-orientation="vertical"
          aria-label={d.benefits.eyebrow}
          ref={listRef}
          onKeyDown={onKeyDown}
        >
          <span className="wipe-tabs__marker" ref={markerRef} aria-hidden="true" />
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`wipe-tab-${tab.id}`}
              aria-selected={i === active}
              aria-controls={`wipe-panel-${tab.id}`}
              tabIndex={i === active ? 0 : -1}
              className="wipe-tabs__tab"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
            >
              {tab.tab}
            </button>
          ))}
        </div>

        <div
          className="wipe-tabs__panel"
          role="tabpanel"
          id={`wipe-panel-${current.id}`}
          aria-labelledby={`wipe-tab-${current.id}`}
          tabIndex={0}
        >
          <span className="wipe-tabs__panel-label">{current.tab}</span>
          <p className="wipe-tabs__panel-text" key={current.id}>
            {current.body}
          </p>
        </div>

        <div className="wipe-tabs__cta">
          <CircleButton href={ctaHref}>{d.nav.seeJobs}</CircleButton>
        </div>
      </div>
    </section>
  );
}

export default WipeTabs;
