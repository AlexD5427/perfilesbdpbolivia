'use client';

import { useToast } from '@/lib/state/ToastProvider';
import { Icon } from '@/components/system/Icon';

const ICONS = {
  info: 'info',
  success: 'check',
  error: 'alert',
} as const;

/**
 * Pila de avisos.
 *
 * El contenedor lleva `aria-live="polite"`, de modo que un lector de
 * pantalla anuncia cada mensaje al terminar lo que estuviera leyendo. Un
 * aviso visual que desaparece a los cuatro segundos y no se anuncia
 * simplemente no existe para quien no lo ve.
 */
export function ToastStack() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-stack" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.kind}`}>
          <span className="toast__icon">
            <Icon name={ICONS[toast.kind]} size={17} />
          </span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button type="button" onClick={() => dismiss(toast.id)} aria-label="Cerrar aviso">
            <Icon name="close" size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
