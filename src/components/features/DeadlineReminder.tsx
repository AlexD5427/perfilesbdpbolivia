'use client';

import { useI18n } from '@/lib/i18n';
import { useToast } from '@/lib/state/ToastProvider';
import type { Job } from '@/lib/jobs';
import { Icon } from '@/components/system/Icon';

/**
 * Recordatorio de cierre.
 *
 * Genera un archivo `.ics` en el navegador y lo descarga. Al abrirse, el
 * calendario del sistema crea un evento de día completo el día anterior al
 * cierre, con una alarma 24 horas antes.
 *
 * Es el enfoque correcto para este caso: no requiere backend, no pide
 * permisos de notificación, funciona con Google Calendar, Outlook y Apple
 * Calendar por igual, y el recordatorio sobrevive aunque la persona no
 * vuelva a entrar al portal. Las notificaciones web, en cambio, sólo llegan
 * si el navegador está abierto y la mayoría de la gente las rechaza.
 */
function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Fecha en formato ICS de día completo (YYYYMMDD). */
function toIcsDate(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

/** Escapa los caracteres que RFC 5545 reserva. */
function escapeIcs(value: string): string {
  return value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
}

export function DeadlineReminder({ job }: { job: Job }) {
  const { d } = useI18n();
  const { push } = useToast();

  const download = () => {
    const close = new Date(`${job.closesAt}T12:00:00Z`);
    const dayBefore = new Date(close.getTime() - 86_400_000);
    const dayAfter = new Date(close.getTime() + 86_400_000);

    // Las líneas de un ICS se separan con CRLF; con LF a secas algunos
    // clientes (Outlook entre ellos) rechazan el archivo entero.
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BDP SAM//Portal de Candidaturas//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${job.reference}@bdp.com.bo`,
      `DTSTAMP:${toIcsDate(new Date())}T090000Z`,
      `DTSTART;VALUE=DATE:${toIcsDate(dayBefore)}`,
      `DTEND;VALUE=DATE:${toIcsDate(dayAfter)}`,
      `SUMMARY:${escapeIcs(`${d.jobs.closes}: ${job.title}`)}`,
      `DESCRIPTION:${escapeIcs(`${job.reference} · ${job.area} · ${job.city}`)}`,
      `URL:${window.location.origin}/procesos/${job.id}`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcs(job.title)}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `${job.reference}.ics`;
    anchor.click();
    // Sin revocar, el blob queda retenido en memoria hasta recargar.
    URL.revokeObjectURL(href);

    push(d.jobs.addCalendar, 'success');
  };

  return (
    <button type="button" className="btn btn--ghost btn--sm" onClick={download}>
      <Icon name="calendar" size={14} />
      {d.jobs.addCalendar}
    </button>
  );
}

export default DeadlineReminder;
