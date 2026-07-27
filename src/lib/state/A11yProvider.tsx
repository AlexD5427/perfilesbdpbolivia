'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/* ==========================================================================
   PREFERENCIAS DE ACCESIBILIDAD

   Todo se materializa como atributos `data-*` en <html>. Ventajas frente a
   pasar el estado por props o contexto a cada componente:

     - El CSS reacciona solo; ningún componente necesita saber que existe
       un modo de alto contraste.
     - Un script inline puede aplicar las preferencias antes de la primera
       pintura, lo que elimina el parpadeo al recargar.
     - Funciona igual en páginas de servidor y de cliente.
   ========================================================================== */

export type TextSize = 'normal' | 'grande' | 'mayor' | 'maximo';
export type Contrast = 'normal' | 'alto';
export type ColorVision =
  | 'ninguno'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'acromatopsia'
  | 'realce';
export type Spacing = 'normal' | 'amplio';

export type A11yPrefs = {
  texto: TextSize;
  contraste: Contrast;
  daltonismo: ColorVision;
  espaciado: Spacing;
  dislexia: boolean;
  enlaces: boolean;
  movimiento: boolean;
  cursor: boolean;
  regla: boolean;
};

export const A11Y_DEFAULTS: A11yPrefs = {
  texto: 'normal',
  contraste: 'normal',
  daltonismo: 'ninguno',
  espaciado: 'normal',
  dislexia: false,
  enlaces: false,
  movimiento: false,
  cursor: false,
  regla: false,
};

export const A11Y_STORAGE_KEY = 'bdp:a11y';

/** Traduce las preferencias a los atributos que consume el CSS. */
function toAttributes(p: A11yPrefs): Record<string, string | null> {
  return {
    'data-texto': p.texto === 'normal' ? null : p.texto,
    'data-contraste': p.contraste === 'normal' ? null : p.contraste,
    'data-daltonismo': p.daltonismo === 'ninguno' ? null : p.daltonismo,
    'data-espaciado': p.espaciado === 'normal' ? null : p.espaciado,
    'data-dislexia': p.dislexia ? 'true' : null,
    'data-enlaces': p.enlaces ? 'subrayados' : null,
    'data-movimiento': p.movimiento ? 'reducido' : null,
    'data-cursor': p.cursor ? 'grande' : null,
  };
}

/**
 * Script que corre antes de pintar.
 *
 * Se inyecta en <head>. Sin él, alguien con alto contraste activado ve medio
 * segundo de interfaz oscura en cada carga: exactamente el tipo de detalle
 * que hace que una función de accesibilidad se sienta añadida a última hora.
 */
export const a11yBootstrapScript = `(function(){try{var p=JSON.parse(localStorage.getItem('${A11Y_STORAGE_KEY}')||'{}');var r=document.documentElement;var m={texto:'data-texto',contraste:'data-contraste',daltonismo:'data-daltonismo',espaciado:'data-espaciado'};for(var k in m){var v=p[k];if(v&&v!=='normal'&&v!=='ninguno')r.setAttribute(m[k],v);}if(p.dislexia)r.setAttribute('data-dislexia','true');if(p.enlaces)r.setAttribute('data-enlaces','subrayados');if(p.movimiento)r.setAttribute('data-movimiento','reducido');if(p.cursor)r.setAttribute('data-cursor','grande');}catch(e){}})();`;

type A11yValue = {
  prefs: A11yPrefs;
  set: <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => void;
  toggle: (key: 'dislexia' | 'enlaces' | 'movimiento' | 'cursor' | 'regla') => void;
  reset: () => void;
  /** Cuántos ajustes están fuera de su valor por defecto. */
  activeCount: number;
};

const A11yContext = createContext<A11yValue | null>(null);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<A11yPrefs>(A11Y_DEFAULTS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(A11Y_STORAGE_KEY);
      if (raw) setPrefs({ ...A11Y_DEFAULTS, ...(JSON.parse(raw) as Partial<A11yPrefs>) });
    } catch {
      /* preferencias ilegibles: seguimos con las de fábrica */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    for (const [attr, value] of Object.entries(toAttributes(prefs))) {
      if (value === null) root.removeAttribute(attr);
      else root.setAttribute(attr, value);
    }
    try {
      window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* sin persistencia */
    }
  }, [prefs]);

  const set = useCallback(<K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggle = useCallback(
    (key: 'dislexia' | 'enlaces' | 'movimiento' | 'cursor' | 'regla') => {
      setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const reset = useCallback(() => setPrefs(A11Y_DEFAULTS), []);

  const value = useMemo<A11yValue>(() => {
    const activeCount = (Object.keys(A11Y_DEFAULTS) as (keyof A11yPrefs)[]).filter(
      (k) => prefs[k] !== A11Y_DEFAULTS[k],
    ).length;
    return { prefs, set, toggle, reset, activeCount };
  }, [prefs, set, toggle, reset]);

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y(): A11yValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y debe usarse dentro de <A11yProvider>.');
  return ctx;
}
