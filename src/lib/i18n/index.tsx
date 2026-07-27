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
import { DICTIONARIES, type Dictionary } from './dictionaries';
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  LOCALES,
  STORAGE_KEY,
  isLocale,
  resolveLocale,
  type Locale,
} from './locales';

type I18nValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** Diccionario completo del idioma activo. */
  d: Dictionary;
  /** Interpola marcadores {clave} dentro de una cadena ya resuelta. */
  fmt: (template: string, vars: Record<string, string | number>) => string;
  /** Formatea una fecha ISO en el calendario del idioma activo. */
  date: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
  /** Formatea un número con separadores locales. */
  num: (value: number) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Script que corre antes de la primera pintura.
 *
 * Sin esto, la página se renderiza en español y salta al idioma guardado
 * en cuanto hidrata React: un parpadeo muy visible. Aquí sólo fijamos el
 * atributo `lang` del documento, que es barato y evita el salto.
 */
export const localeBootstrapScript = `(function(){try{var k='${STORAGE_KEY}';var s=localStorage.getItem(k);var v=['${LOCALES.join("','")}'];if(s&&v.indexOf(s)>-1){document.documentElement.setAttribute('data-locale',s);document.documentElement.lang=s==='es'?'es-BO':s;}}catch(e){}})();`;

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Primer render en cliente: recuperamos la preferencia guardada o la del
  // navegador. Se hace en efecto para no romper la hidratación del servidor.
  useEffect(() => {
    let next: Locale | null = null;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) next = stored;
    } catch {
      /* almacenamiento bloqueado: seguimos con el idioma por defecto */
    }
    if (!next) next = resolveLocale(navigator.languages ?? [navigator.language]);
    if (next !== DEFAULT_LOCALE) setLocaleState(next);
  }, []);

  // Mantenemos <html lang> sincronizado: de esto dependen los lectores de
  // pantalla y la síntesis de voz para elegir la voz correcta.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = LOCALE_META[locale].tag;
    root.setAttribute('data-locale', locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* sin persistencia, pero la sesión actual sigue funcionando */
    }
  }, []);

  const value = useMemo<I18nValue>(() => {
    const tag = LOCALE_META[locale].tag;
    // Quechua y aymara no tienen datos de formato en la mayoría de motores
    // ICU, así que caemos a es-BO para fechas y números.
    const intlTag = locale === 'qu' || locale === 'ay' ? 'es-BO' : tag;

    return {
      locale,
      setLocale,
      d: DICTIONARIES[locale],
      fmt: (template, vars) =>
        template.replace(/\{(\w+)\}/g, (match, key: string) =>
          key in vars ? String(vars[key]) : match,
        ),
      date: (iso, opts) => {
        const parsed = new Date(iso);
        if (Number.isNaN(parsed.getTime())) return iso;
        return new Intl.DateTimeFormat(
          intlTag,
          opts ?? { day: 'numeric', month: 'long', year: 'numeric' },
        ).format(parsed);
      },
      num: (v) => new Intl.NumberFormat(intlTag).format(v),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n debe usarse dentro de <I18nProvider>.');
  return ctx;
}

export { LOCALES, LOCALE_META, DEFAULT_LOCALE };
export type { Locale, Dictionary };
