'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useI18n } from '@/lib/i18n';
import { usePortal, COMPARE_LIMIT } from '@/lib/state/PortalProvider';
import { getJob } from '@/lib/jobs';
import { Icon } from '@/components/system/Icon';
import { setScrollLock } from '@/components/motion/SmoothScroll';
import { CompareTable } from './CompareTable';

/**
 * Bandeja de comparación.
 *
 * Aparece flotando en cuanto hay una convocatoria seleccionada y muestra
 * tres huecos: dos vacíos comunican el límite sin necesidad de explicarlo.
 * Tres es el máximo deliberado; con cuatro columnas la tabla deja de
 * caber en un portátil y la comparación pierde su sentido.
 */
export function CompareTray() {
  const { d } = useI18n();
  const { compare, toggleCompare, clearCompare } = usePortal();
  const [openTable, setOpenTable] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!compare.length || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' },
    );
  }, [compare.length]);

  useEffect(() => {
    setScrollLock(openTable);
    return () => setScrollLock(false);
  }, [openTable]);

  if (!compare.length) return null;

  const slots = Array.from({ length: COMPARE_LIMIT }, (_, i) => compare[i] ?? null);

  return (
    <>
      <div className="compare-tray" ref={ref} role="region" aria-label={d.features.compareTitle}>
        <span className="label label--tiny">{d.features.compareTitle}</span>

        <div className="compare-tray__slots">
          {slots.map((id, i) => {
            const job = id ? getJob(id) : null;
            return (
              <span
                key={id ?? `empty-${i}`}
                className="compare-tray__slot"
                data-filled={Boolean(job)}
                title={job?.title}
              >
                {job ? job.title.slice(0, 2).toUpperCase() : '+'}
                {job ? (
                  <button
                    type="button"
                    onClick={() => toggleCompare(job.id)}
                    aria-label={`${d.common.remove}: ${job.title}`}
                  >
                    <Icon name="close" size={9} />
                  </button>
                ) : null}
              </span>
            );
          })}
        </div>

        <button
          type="button"
          className="btn btn--sm"
          onClick={() => setOpenTable(true)}
          disabled={compare.length < 2}
        >
          {d.features.compareOpen}
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={clearCompare}
          aria-label={d.features.clearFilters}
        >
          <Icon name="close" size={14} />
        </button>
      </div>

      {openTable ? (
        <div className="overlay-scrim" onClick={() => setOpenTable(false)} role="presentation">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={d.features.compareTitle}
            onClick={(event) => event.stopPropagation()}
            data-lenis-prevent
          >
            <div className="modal__head">
              <h2 className="display display--sm">{d.features.compareTitle}</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setOpenTable(false)}
                aria-label={d.nav.close}
              >
                <Icon name="close" size={15} />
              </button>
            </div>
            <div className="modal__body">
              <CompareTable ids={compare} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default CompareTray;
