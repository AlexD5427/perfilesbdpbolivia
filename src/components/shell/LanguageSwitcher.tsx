'use client';

import { useEffect, useRef, useState } from 'react';
import { LOCALES, LOCALE_META, useI18n, type Locale } from '@/lib/i18n';
import { Icon } from '@/components/system/Icon';

/**
 * Selector de idioma.
 *
 * Cada opcion se muestra en su propia lengua (endonimo). Alguien que navega
 * en aymara debe poder reconocer "Aymar aru" aunque no lea la etiqueta en
 * castellano; al reves tambien.
 *
 * Se implementa como listbox con teclado completo en lugar de un <select>
 * nativo porque hace falta marcar cada opcion con su propio atributo lang
 * (para que los lectores de pantalla cambien de voz) y mostrar el idioma
 * activo con un indicador visible.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, d } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div className="lang" ref={wrapRef}>
      <button
        type="button"
        className="lang__trigger icon-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${d.language.change}. ${d.language.current}: ${LOCALE_META[locale].endonym}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="globe" size={16} />
        {compact ? null : <span className="lang__code">{LOCALE_META[locale].short}</span>}
      </button>

      {open ? (
        <ul className="lang__menu glass" role="listbox" aria-label={d.language.label}>
          {LOCALES.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                className="lang__option"
                lang={LOCALE_META[code].tag}
                onClick={() => choose(code)}
              >
                <span className="lang__endonym">{LOCALE_META[code].endonym}</span>
                <span className="lang__code">{LOCALE_META[code].short}</span>
                {code === locale ? <Icon name="check" size={14} /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default LanguageSwitcher;
