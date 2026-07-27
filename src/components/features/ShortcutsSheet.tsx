'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Icon } from '@/components/system/Icon';
import { setScrollLock } from '@/components/motion/SmoothScroll';

/**
 * Hoja de atajos de teclado.
 *
 * Se abre pulsando la interrogación, la convención que estableció GitHub y
 * que hoy espera cualquiera que use el teclado en serio. Existe porque un
 * portal con paleta de comandos, lector de voz y modo lectura tiene
 * suficientes atajos como para que descubrirlos por casualidad no sea
 * razonable.
 *
 * No se abre si el foco está en un campo de texto: ahí la interrogación es
 * un carácter, no un comando.
 */
export function ShortcutsSheet() {
  const { d } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;

      if (event.key === '?' && !typing) {
        event.preventDefault();
        setOpen((v) => !v);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setScrollLock(open);
    return () => setScrollLock(false);
  }, [open]);

  if (!open) return null;

  const rows = [
    { keys: ['Ctrl', 'K'], label: d.features.search },
    { keys: ['Alt', 'L'], label: d.tts.play },
    { keys: ['Alt', 'F'], label: d.features.focusMode },
    { keys: ['Alt', 'A'], label: d.a11y.open },
    { keys: ['G', 'C'], label: d.nav.jobs },
    { keys: ['G', 'E'], label: d.nav.space },
    { keys: ['?'], label: d.features.shortcuts },
    { keys: ['Esc'], label: d.features.dismiss },
  ];

  return (
    <div className="overlay-scrim" onClick={() => setOpen(false)} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={d.features.shortcuts}
        onClick={(event) => event.stopPropagation()}
        data-lenis-prevent
      >
        <div className="modal__head">
          <h2 className="display display--sm">{d.features.shortcuts}</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setOpen(false)}
            aria-label={d.nav.close}
          >
            <Icon name="close" size={15} />
          </button>
        </div>
        <div className="modal__body">
          <div className="shortcuts">
            {rows.map((row) => (
              <div className="shortcut-row" key={row.label}>
                <span>{row.label}</span>
                <span className="shortcut-keys">
                  {row.keys.map((key) => (
                    <kbd key={key}>{key}</kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortcutsSheet;
