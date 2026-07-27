'use client';

import { useState, type FormEvent } from 'react';
import { useI18n } from '@/lib/i18n';
import { usePortal, type JobAlert } from '@/lib/state/PortalProvider';
import { useToast } from '@/lib/state/ToastProvider';
import { facets } from '@/lib/jobs';
import { Icon } from '@/components/system/Icon';

/**
 * Alertas de convocatorias.
 *
 * Guarda criterios de búsqueda para avisar cuando aparezca algo que encaje.
 * Hoy la suscripción vive en el navegador; cuando exista backend, este
 * componente sólo cambia de destino y la interfaz se queda igual.
 *
 * Nota deliberada: no se pide correo si la persona no ha iniciado sesión.
 * Recoger direcciones sin cuenta asociada crea una base de datos huérfana
 * que después nadie sabe cómo tratar bajo la normativa de protección de
 * datos personales.
 */
export function AlertsManager() {
  const { d } = useI18n();
  const { alerts, addAlert, removeAlert } = usePortal();
  const { push } = useToast();

  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [keyword, setKeyword] = useState('');
  const [frequency, setFrequency] = useState<JobAlert['frequency']>('semanal');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    addAlert({
      area: area || null,
      city: city || null,
      keyword: keyword.trim(),
      frequency,
    });
    setKeyword('');
    push(d.features.alertsCreate, 'success');
  };

  const describe = (alert: JobAlert) =>
    [alert.keyword, alert.area, alert.city].filter(Boolean).join(' · ') || d.common.all;

  return (
    <div className="stack">
      <form className="stack stack--sm" onSubmit={submit}>
        <label className="field">
          <span>{d.features.search}</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={d.features.searchPlaceholder}
          />
        </label>

        <div className="form-grid">
          <label className="field">
            <span>{d.jobs.area}</span>
            <select value={area} onChange={(event) => setArea(event.target.value)}>
              <option value="">{d.common.all}</option>
              {facets.areas.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{d.jobs.city}</span>
            <select value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="">{d.common.all}</option>
              {facets.cities.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="a11y-options">
          {(['inmediata', 'diaria', 'semanal'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className="a11y-option"
              aria-pressed={frequency === value}
              onClick={() => setFrequency(value)}
            >
              {value}
            </button>
          ))}
        </div>

        <button type="submit" className="btn btn--sm">
          <Icon name="bell" size={14} />
          {d.features.alertsCreate}
        </button>
      </form>

      {alerts.length === 0 ? (
        <p className="body-text" style={{ fontSize: '0.86rem' }}>
          {d.features.alertsEmpty}
        </p>
      ) : (
        <ul className="stack stack--sm">
          {alerts.map((alert) => (
            <li key={alert.id} className="checklist__item" data-done="false">
              <Icon name="bell" size={15} />
              <span className="checklist__text" style={{ flex: 1 }}>
                {describe(alert)}
                <br />
                <span className="label label--tiny">{alert.frequency}</span>
              </span>
              <button
                type="button"
                onClick={() => removeAlert(alert.id)}
                aria-label={`${d.common.remove}: ${describe(alert)}`}
              >
                <Icon name="close" size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlertsManager;
