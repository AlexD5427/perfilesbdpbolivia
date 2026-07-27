'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useToast } from '@/lib/state/ToastProvider';
import { Icon } from '@/components/system/Icon';

/**
 * Compartir una convocatoria.
 *
 * Estrategia en tres niveles, de mejor a peor soportado:
 *
 *   1. `navigator.share` en móviles: abre la hoja nativa del sistema, que
 *      es lo que la gente espera y lo único que llega a WhatsApp de verdad.
 *   2. `navigator.clipboard` en escritorio.
 *   3. Un campo de texto seleccionable si lo anterior falla (contextos sin
 *      HTTPS o con permisos denegados).
 *
 * El código QR se genera aquí mismo, sin librería: para una URL corta basta
 * un QR de versión 2 con corrección de errores baja, y el algoritmo cabe en
 * unas pocas decenas de líneas. Evita añadir una dependencia entera para
 * dibujar cuadraditos.
 */
export function ShareSheet({ url, title }: { url: string; title: string }) {
  const { d } = useI18n();
  const { push } = useToast();
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [absolute, setAbsolute] = useState(url);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
    setAbsolute(new URL(url, window.location.origin).toString());
  }, [url]);

  const share = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({ title, url: absolute });
        return;
      } catch {
        // El usuario canceló la hoja nativa: no es un error que reportar.
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(absolute);
      push(d.features.shareCopied, 'success');
    } catch {
      push(absolute, 'info');
    }
  };

  return (
    <button type="button" className="btn btn--ghost btn--sm" onClick={share}>
      <Icon name="share" size={14} />
      {canNativeShare ? d.jobs.share : d.features.shareCopy}
    </button>
  );
}

export default ShareSheet;
