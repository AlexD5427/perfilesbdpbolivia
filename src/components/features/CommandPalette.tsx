'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { jobs } from '@/lib/jobs';
import { glossary } from '@/lib/data/glossary';
import { Icon, type IconName } from '@/components/system/Icon';
import { setScrollLock } from '@/components/motion/SmoothScroll';

type Command = {
  id: string;
  group: string;
  title: string;
  hint?: string;
  icon: IconName;
  run: () => void;
  /** Texto adicional que se indexa pero no se muestra. */
  keywords?: string;
};

/**
 * Paleta de comandos.
 *
 * Abre con Ctrl/Cmd + K y busca a la vez en convocatorias, páginas, acciones
 * y glosario. En un portal donde la información está repartida entre siete
 * secciones, esto ahorra más clics que cualquier rediseño de menú.
 *
 * El emparejamiento es por subsecuencia difusa, no por subcadena: escribir
 * "ofcr" encuentra "Oficial de Créditos". Es lo que la gente espera desde
 * que lo popularizaron los editores de código, y evita fallar por una tilde
 * o una letra intermedia. Se puntúa favoreciendo coincidencias contiguas y
 * al principio de palabra, para que el resultado más obvio quede arriba.
 */
function fuzzy(query: string, target: string): number | null {
  if (!query) return 0;

  const q = normalise(query);
  const t = normalise(target);

  let score = 0;
  let ti = 0;
  let streak = 0;

  for (const char of q) {
    const found = t.indexOf(char, ti);
    if (found === -1) return null;

    // Contigüidad y comienzo de palabra son las dos señales que hacen que
    // el ranking se sienta "correcto".
    if (found === ti) streak += 1;
    else streak = 0;

    score += 10 + streak * 6;
    if (found === 0 || t[found - 1] === ' ') score += 12;

    ti = found + 1;
  }

  // Penalizamos ligeramente los textos largos: entre dos coincidencias
  // equivalentes, gana la más específica.
  return score - t.length * 0.15;
}

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { d } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      router.push(href);
      onClose();
    };

    return [
      ...jobs.map((job) => ({
        id: `job-${job.id}`,
        group: d.nav.jobs,
        title: job.title,
        hint: `${job.area} · ${job.city}`,
        icon: 'file' as IconName,
        keywords: `${job.reference} ${job.modality} ${job.contract} ${(job.skills ?? []).join(' ')}`,
        run: go(`/procesos/${job.id}`),
      })),
      {
        id: 'nav-jobs',
        group: d.features.navigate,
        title: d.nav.jobs,
        icon: 'layers',
        run: go('/procesos'),
      },
      {
        id: 'nav-space',
        group: d.features.navigate,
        title: d.nav.space,
        icon: 'user',
        run: go('/candidato'),
      },
      {
        id: 'nav-cv',
        group: d.features.navigate,
        title: d.dash.cv,
        icon: 'file',
        run: go('/candidato/cv'),
      },
      {
        id: 'nav-assess',
        group: d.features.navigate,
        title: d.dash.assessments,
        icon: 'clipboard',
        run: go('/candidato/evaluaciones'),
      },
      {
        id: 'nav-help',
        group: d.features.navigate,
        title: d.nav.help,
        icon: 'info',
        run: go('/ayuda'),
      },
      {
        id: 'nav-a11y',
        group: d.features.navigate,
        title: d.footer.accessibility,
        icon: 'accessibility',
        run: go('/accesibilidad'),
      },
      {
        id: 'act-read',
        group: d.features.select,
        title: d.tts.play,
        hint: 'Alt + L',
        icon: 'speaker',
        run: () => {
          onClose();
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', altKey: true }));
        },
      },
      {
        id: 'act-focus',
        group: d.features.select,
        title: d.features.focusMode,
        hint: 'Alt + F',
        icon: 'focus',
        run: () => {
          onClose();
          const root = document.documentElement;
          const on = root.getAttribute('data-enfoque') === 'true';
          if (on) root.removeAttribute('data-enfoque');
          else root.setAttribute('data-enfoque', 'true');
        },
      },
      ...glossary.map((entry) => ({
        id: `glo-${entry.term}`,
        group: d.features.glossary,
        title: entry.term,
        hint: entry.definition.slice(0, 68) + '...',
        icon: 'book' as IconName,
        run: go('/ayuda#glosario'),
      })),
    ];
  }, [d, router, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return commands.slice(0, 9);

    return commands
      .map((command) => {
        const haystack = `${command.title} ${command.hint ?? ''} ${command.keywords ?? ''}`;
        const score = fuzzy(query, haystack);
        return score === null ? null : { command, score };
      })
      .filter((entry): entry is { command: Command; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((entry) => entry.command);
  }, [commands, query]);

  // El índice activo debe volver al principio en cuanto cambia la lista, o
  // apuntaría a un resultado que ya no está.
  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;

    setScrollLock(true);
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);

    return () => {
      setScrollLock(false);
      window.clearTimeout(id);
      setQuery('');
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActive((i) => (i + 1) % Math.max(results.length, 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        results[active]?.run();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active, onClose]);

  // Mantenemos visible el elemento activo al navegar con el teclado.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  let lastGroup = '';

  return (
    <div className="overlay-scrim" onClick={onClose} role="presentation">
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label={d.features.search}
        onClick={(event) => event.stopPropagation()}
        data-lenis-prevent
      >
        <div className="palette__field">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={d.features.searchPlaceholder}
            aria-label={d.features.search}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="palette__kbd">ESC</kbd>
        </div>

        <div className="palette__results" ref={listRef}>
          {results.length === 0 ? (
            <p className="palette__empty">{d.features.noResults}</p>
          ) : (
            results.map((command, i) => {
              const showGroup = command.group !== lastGroup;
              lastGroup = command.group;

              return (
                <div key={command.id}>
                  {showGroup ? <p className="palette__group-label">{command.group}</p> : null}
                  <button
                    type="button"
                    className="palette__item"
                    data-active={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={command.run}
                  >
                    <span className="palette__item-icon">
                      <Icon name={command.icon} size={15} />
                    </span>
                    <span className="palette__item-body">
                      <span className="palette__item-title">{command.title}</span>
                      {command.hint ? (
                        <span className="palette__item-hint">{command.hint}</span>
                      ) : null}
                    </span>
                    <Icon name="arrow-right" size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="palette__footer">
          <span>↑ ↓ {d.features.navigate}</span>
          <span>↵ {d.features.select}</span>
          <span>ESC {d.features.dismiss}</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
