'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { getJob, daysUntilClose } from '@/lib/jobs';

/**
 * Tabla comparativa.
 *
 * Se transpone respecto a lo habitual: los atributos van en filas y las
 * convocatorias en columnas. Comparar en vertical exige mover los ojos mucho
 * menos que comparar en horizontal, y con tres columnas sigue cabiendo en
 * una pantalla de portátil.
 */
export function CompareTable({ ids }: { ids: string[] }) {
  const { d, num } = useI18n();
  const items = ids.map(getJob).filter((job): job is NonNullable<typeof job> => Boolean(job));

  if (items.length < 2) {
    return <p className="body-text">{d.features.compareEmpty}</p>;
  }

  const rows: { label: string; render: (job: (typeof items)[number]) => React.ReactNode }[] = [
    { label: d.jobs.area, render: (job) => job.area },
    { label: d.jobs.city, render: (job) => job.city },
    { label: d.jobs.modality, render: (job) => job.modality },
    { label: d.jobs.contract, render: (job) => job.contract },
    { label: d.jobs.experience, render: (job) => job.experience },
    {
      label: d.features.salary,
      render: (job) =>
        job.salary
          ? `Bs ${num(job.salary.min)} – ${num(job.salary.max)}`
          : '—',
    },
    {
      label: d.jobs.closes,
      render: (job) => {
        const days = daysUntilClose(job);
        if (days < 0) return d.jobs.closed;
        if (days === 0) return d.jobs.closesToday;
        return `${days} ${d.common.days}`;
      },
    },
    {
      label: 'Vacantes',
      render: (job) => job.vacancies ?? '—',
    },
    {
      label: d.jobs.requirements,
      render: (job) => (
        <ul>
          {job.requirements.slice(0, 3).map((item) => (
            <li key={item} style={{ marginBottom: '0.35rem' }}>
              {item}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <table className="compare-table">
      <caption className="visually-hidden">{d.features.compareTitle}</caption>
      <thead>
        <tr>
          <th scope="col">{d.jobs.reference}</th>
          {items.map((job) => (
            <th key={job.id} scope="col" style={{ width: 'auto' }}>
              <Link href={`/procesos/${job.id}`} className="link-rule">
                <span style={{ fontSize: '0.92rem', textTransform: 'none', letterSpacing: 0 }}>
                  {job.title}
                </span>
              </Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            {items.map((job) => (
              <td key={job.id}>{row.render(job)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CompareTable;
