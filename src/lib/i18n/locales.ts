/**
 * Idiomas soportados por el portal.
 *
 * El español latinoamericano es la fuente de verdad: el tipo `Dictionary` se
 * deriva de él, de modo que TypeScript falla la compilación si a cualquier
 * otro idioma le falta una clave. No se puede publicar una traducción
 * incompleta ni por accidente.
 */
export const LOCALES = ['es', 'en', 'qu', 'ay'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';

export const LOCALE_META: Record<
  Locale,
  { label: string; endonym: string; tag: string; short: string }
> = {
  es: { label: 'Español (Latinoamérica)', endonym: 'Español', tag: 'es-BO', short: 'ES' },
  en: { label: 'Inglés', endonym: 'English', tag: 'en', short: 'EN' },
  qu: { label: 'Quechua', endonym: 'Runa simi', tag: 'qu-BO', short: 'QU' },
  ay: { label: 'Aymara', endonym: 'Aymar aru', tag: 'ay-BO', short: 'AY' },
};

export const STORAGE_KEY = 'bdp:locale';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Resuelve el idioma a partir del navegador, cayendo al español. */
export function resolveLocale(candidates: readonly string[]): Locale {
  for (const candidate of candidates) {
    const base = candidate.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}
