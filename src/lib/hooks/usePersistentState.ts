'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Estado de React respaldado por `localStorage`.
 *
 * Puntos delicados que resuelve:
 *
 *   - **Hidratación.** El servidor no tiene `localStorage`, así que el primer
 *     render usa siempre el valor inicial y la lectura real ocurre en un
 *     efecto. Leer durante el render provocaría un desajuste de hidratación.
 *
 *   - **Almacenamiento bloqueado.** En navegación privada de Safari y con
 *     cookies de terceros deshabilitadas, `localStorage` lanza al escribir.
 *     Todo va envuelto en try/catch: se pierde la persistencia, no la sesión.
 *
 *   - **Varias pestañas.** El evento `storage` sincroniza el estado entre
 *     pestañas abiertas del portal, que es lo que espera cualquiera que tenga
 *     una convocatoria abierta en otra ventana.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* valor corrupto o almacenamiento bloqueado: seguimos con el inicial */
    }
    hydrated.current = true;
  }, [key]);

  useEffect(() => {
    // No escribimos antes de haber leído: sobrescribiría el valor guardado
    // con el inicial en el primer render.
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* sin persistencia */
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key || event.newValue === null) return;
      try {
        setValue(JSON.parse(event.newValue) as T);
      } catch {
        /* ignoramos payloads inválidos de otras pestañas */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return [value, setValue, reset] as const;
}

export default usePersistentState;
