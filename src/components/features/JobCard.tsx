'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { usePortal } from '@/lib/state/PortalProvider';
import { useToast } from '@/lib/state/ToastProvider';
import { daysUntilClose, matchScore, urgencyOf, type Job } from '@/lib/jobs';
import { GlassSurface } from '@/components/motion/GlassSurface';
import { Icon } from '@/components/system/Icon';
import { MatchMeter } from './ProgressRing';

/**
 * Ficha de convocatoria.
 *
 * Traducción de la tarjeta de tipología de la referencia: metadatos en
 * versalitas diminutas arriba, título en Didone, y las acciones alineadas
 * al pie sobre un filete.
 *
 * La cuenta atrás es la única pieza que se permite color de alarma. Es un
 * dato con consecuencias reales (si se pasa la fecha no hay recuperación
 * posible) y por eso gana el derecho a romper la sobriedad de la paleta.
 */
export function JobCard({ job, showMatch = true }: { job: Job; showMatch?: boolean }) {
  const { d, fmt } = useI18n();
  const { isSaved, toggleSaved, inCompare, toggleCompare, profile } = usePortal();
  const { push } = useToast();

  const saved = isSaved(job.id);
  const comparing = inCompare(job.id);
  const days = daysUntilClose(job);
  const urgency = urgencyOf(job);

  // Sólo mostramos compatibilidad si hay perfil suficiente: un 12 % basado
  // en un perfil vacío desanima sin informar de nada.
  const hasProfile = profile.skills.length > 0 || profile.areas.length > 0;
  const match = hasProfile
    ? matchScore(job, {
        skills: profile.skills,
        areas: profile.areas,
        city: profile.city,
        modality: profile.modality,
        years: profile.years,
      })
    : null;

  const deadlineText =
    days < 0 ? d.jobs.closed : days === 0 ? d.jobs.closesToday : fmt(d.jobs.closesIn, { n: days });

  const onSave = () => {
    const nowSaved = toggleSaved(job.id);
    push(nowSaved ? `${d.jobs.saved}: ${job.title}` : `${d.common.remove}: ${job.title}`, 'success');
  };

  const onCompare = () => {
    const result = toggleCompare(job.id);
    if (result === 'full') push(d.features.compareEmpty, 'error');
  };

  return (
    <GlassSurface as="article" className="job-card glass--lift" tilt={3}>
      <div className="job-card__top">
        <span className="chip chip--accent">{job.area}</span>
        <div className="job-card__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onSave}
            aria-pressed={saved}
            aria-label={`${saved ? d.common.remove : d.jobs.save}: ${job.title}`}
          >
            <Icon name={saved ? 'bookmark-filled' : 'bookmark'} size={15} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onCompare}
            aria-pressed={comparing}
            aria-label={`${d.jobs.compare}: ${job.title}`}
          >
            <Icon name="compare" size={15} />
          </button>
        </div>
      </div>

      <h3 className="job-card__title">
        <Link href={`/procesos/${job.id}`}>{job.title}</Link>
      </h3>

      <p className="job-card__meta">
        <span>{job.city}</span>
        <span>{job.modality}</span>
        <span>{job.experience}</span>
      </p>

      <p className="body-text" style={{ fontSize: '0.86rem' }}>
        {job.summary}
      </p>

      {showMatch && match ? <MatchMeter score={match.score} compact /> : null}

      <div className="job-card__foot">
        <span className="deadline" data-urgency={urgency}>
          {deadlineText}
        </span>
        <Link href={`/procesos/${job.id}`} className="btn btn--ghost btn--sm">
          {d.jobs.view}
        </Link>
      </div>
    </GlassSurface>
  );
}

export default JobCard;
