'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  useA11y,
  type ColorVision,
  type Contrast,
  type Spacing,
  type TextSize,
} from '@/lib/state/A11yProvider';
import { Icon } from '@/components/system/Icon';

/**
 * Centro de accesibilidad.
 *
 * Diez ajustes, agrupados por lo que la persona quiere conseguir y no por
 * cómo están implementados. Todos se aplican al instante, sin botón de
 * guardar: si hay que confirmar un cambio de contraste, la función ya falló.
 *
 * Sobre los modos de visión del color: los tres primeros SIMULAN la
 * dicromacia y sirven para que el equipo revise sus propios diseños. El
 * cuarto, "realzar colores", es el útil para quien tiene la condición,
 * porque separa los tonos en conflicto en lugar de imitarlos. La distinción
 * está explicada en el propio panel, no escondida en la documentación.
 */
export function AccessibilityDock() {
  const { d } = useI18n();
  const { prefs, set, toggle, reset, activeCount } = useA11y();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      // Devolvemos el foco al lanzador: dejarlo suelto en el documento es
      // uno de los fallos de accesibilidad más comunes en paneles flotantes.
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const sizes: { value: TextSize; label: string }[] = [
    { value: 'normal', label: d.a11y.sizeNormal },
    { value: 'grande', label: d.a11y.sizeLarge },
    { value: 'mayor', label: d.a11y.sizeLarger },
    { value: 'maximo', label: d.a11y.sizeMax },
  ];

  const contrasts: { value: Contrast; label: string }[] = [
    { value: 'normal', label: d.a11y.contrastNormal },
    { value: 'alto', label: d.a11y.contrastHigh },
  ];

  const visions: { value: ColorVision; label: string }[] = [
    { value: 'ninguno', label: d.a11y.cvNone },
    { value: 'realce', label: d.a11y.cvBoost },
    { value: 'protanopia', label: d.a11y.cvProtanopia },
    { value: 'deuteranopia', label: d.a11y.cvDeuteranopia },
    { value: 'tritanopia', label: d.a11y.cvTritanopia },
    { value: 'acromatopsia', label: d.a11y.cvAchromatopsia },
  ];

  const spacings: { value: Spacing; label: string }[] = [
    { value: 'normal', label: d.a11y.spacingNormal },
    { value: 'amplio', label: d.a11y.spacingWide },
  ];

  const switches = [
    { key: 'dislexia', label: d.a11y.dyslexia },
    { key: 'enlaces', label: d.a11y.underline },
    { key: 'movimiento', label: d.a11y.motion },
    { key: 'cursor', label: d.a11y.cursor },
    { key: 'regla', label: d.a11y.ruler },
  ] as const;

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className="a11y-launcher"
        aria-label={d.a11y.open}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="accessibility" size={24} />
        {activeCount > 0 ? (
          <span className="icon-btn__badge" aria-hidden="true">
            {activeCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="a11y-dock"
          ref={panelRef}
          role="dialog"
          aria-label={d.a11y.title}
          data-lenis-prevent
        >
          <div className="a11y-dock__head">
            <div>
              <h2 className="label label--accent">{d.a11y.title}</h2>
              <p style={{ fontSize: '0.76rem', opacity: 0.6 }}>{d.a11y.subtitle}</p>
            </div>
            <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label={d.nav.close}>
              <Icon name="close" size={15} />
            </button>
          </div>

          <div className="a11y-group">
            <span className="a11y-group__label">{d.a11y.textSize}</span>
            <div className="a11y-options">
              {sizes.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="a11y-option"
                  aria-pressed={prefs.texto === option.value}
                  onClick={() => set('texto', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="a11y-group">
            <span className="a11y-group__label">{d.a11y.contrast}</span>
            <div className="a11y-options">
              {contrasts.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="a11y-option"
                  aria-pressed={prefs.contraste === option.value}
                  onClick={() => set('contraste', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="a11y-group">
            <span className="a11y-group__label">{d.a11y.colorVision}</span>
            <div className="a11y-options">
              {visions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="a11y-option"
                  aria-pressed={prefs.daltonismo === option.value}
                  onClick={() => set('daltonismo', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="a11y-group">
            <span className="a11y-group__label">{d.a11y.spacing}</span>
            <div className="a11y-options">
              {spacings.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="a11y-option"
                  aria-pressed={prefs.espaciado === option.value}
                  onClick={() => set('espaciado', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="a11y-group">
            {switches.map((item) => (
              <button
                key={item.key}
                type="button"
                className="a11y-switch"
                aria-pressed={prefs[item.key]}
                onClick={() => toggle(item.key)}
              >
                <span>{item.label}</span>
                <span className="a11y-switch__track">
                  <span className="a11y-switch__thumb" />
                </span>
              </button>
            ))}
          </div>

          <div className="row row--between">
            <button type="button" className="btn btn--quiet btn--sm" onClick={reset}>
              {d.a11y.reset}
            </button>
            <span className="label label--tiny" style={{ maxWidth: '18ch', textAlign: 'right' }}>
              {d.a11y.saved}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default AccessibilityDock;
