'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { usePersistentState } from '@/lib/hooks/usePersistentState';

/* ==========================================================================
   ESTADO DEL PORTAL

   Toda la información de la persona candidata que hoy vive en el navegador.
   Cuando exista backend, este proveedor es el único punto que hay que
   reescribir: las vistas consumen la interfaz, no el almacenamiento.
   ========================================================================== */

export type JobAlert = {
  id: string;
  area: string | null;
  city: string | null;
  keyword: string;
  frequency: 'inmediata' | 'diaria' | 'semanal';
  createdAt: string;
};

export type CandidateProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  headline: string;
  summary: string;
  education: string;
  years: number;
  skills: string[];
  areas: string[];
  modality: string[];
  hasCv: boolean;
  hasLetter: boolean;
  hasId: boolean;
};

export const EMPTY_PROFILE: CandidateProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  headline: '',
  summary: '',
  education: '',
  years: 0,
  skills: [],
  areas: [],
  modality: [],
  hasCv: false,
  hasLetter: false,
  hasId: false,
};

/** Máximo de convocatorias comparables a la vez. */
export const COMPARE_LIMIT = 3;

type PortalValue = {
  saved: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => boolean;

  compare: string[];
  inCompare: (id: string) => boolean;
  toggleCompare: (id: string) => 'added' | 'removed' | 'full';
  clearCompare: () => void;

  recents: string[];
  pushRecent: (id: string) => void;

  alerts: JobAlert[];
  addAlert: (alert: Omit<JobAlert, 'id' | 'createdAt'>) => void;
  removeAlert: (id: string) => void;

  profile: CandidateProfile;
  updateProfile: (patch: Partial<CandidateProfile>) => void;

  /** Porcentaje 0-100 de completitud, con los campos que faltan. */
  completeness: { pct: number; missing: (keyof CandidateProfile)[] };
};

const PortalContext = createContext<PortalValue | null>(null);

/** Campos que cuentan para la barra de completitud del perfil. */
const SCORED: { key: keyof CandidateProfile; weight: number }[] = [
  { key: 'firstName', weight: 1 },
  { key: 'lastName', weight: 1 },
  { key: 'email', weight: 1 },
  { key: 'phone', weight: 1 },
  { key: 'city', weight: 1 },
  { key: 'headline', weight: 1 },
  { key: 'summary', weight: 2 },
  { key: 'education', weight: 2 },
  { key: 'skills', weight: 2 },
  { key: 'areas', weight: 1 },
  { key: 'hasCv', weight: 3 },
  { key: 'hasLetter', weight: 1 },
  { key: 'hasId', weight: 1 },
];

function isFilled(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === 'string' && value.trim().length > 0;
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = usePersistentState<string[]>('bdp:saved', []);
  const [compare, setCompare] = usePersistentState<string[]>('bdp:compare', []);
  const [recents, setRecents] = usePersistentState<string[]>('bdp:recents', []);
  const [alerts, setAlerts] = usePersistentState<JobAlert[]>('bdp:alerts', []);
  const [profile, setProfile] = usePersistentState<CandidateProfile>(
    'bdp:profile',
    EMPTY_PROFILE,
  );

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  const toggleSaved = useCallback(
    (id: string) => {
      const willSave = !saved.includes(id);
      setSaved((prev) => (willSave ? [...prev, id] : prev.filter((x) => x !== id)));
      return willSave;
    },
    [saved, setSaved],
  );

  const inCompare = useCallback((id: string) => compare.includes(id), [compare]);

  const toggleCompare = useCallback(
    (id: string): 'added' | 'removed' | 'full' => {
      if (compare.includes(id)) {
        setCompare((prev) => prev.filter((x) => x !== id));
        return 'removed';
      }
      if (compare.length >= COMPARE_LIMIT) return 'full';
      setCompare((prev) => [...prev, id]);
      return 'added';
    },
    [compare, setCompare],
  );

  const clearCompare = useCallback(() => setCompare([]), [setCompare]);

  const pushRecent = useCallback(
    (id: string) => {
      // Se mueve al frente si ya estaba; guardamos como mucho ocho.
      setRecents((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
    },
    [setRecents],
  );

  const addAlert = useCallback(
    (alert: Omit<JobAlert, 'id' | 'createdAt'>) => {
      setAlerts((prev) => [
        ...prev,
        {
          ...alert,
          id: `alerta-${Date.now().toString(36)}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    },
    [setAlerts],
  );

  const removeAlert = useCallback(
    (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id)),
    [setAlerts],
  );

  const updateProfile = useCallback(
    (patch: Partial<CandidateProfile>) => setProfile((prev) => ({ ...prev, ...patch })),
    [setProfile],
  );

  const completeness = useMemo(() => {
    const total = SCORED.reduce((sum, f) => sum + f.weight, 0);
    let earned = 0;
    const missing: (keyof CandidateProfile)[] = [];

    for (const field of SCORED) {
      if (isFilled(profile[field.key])) earned += field.weight;
      else missing.push(field.key);
    }

    return { pct: Math.round((earned / total) * 100), missing };
  }, [profile]);

  const value = useMemo<PortalValue>(
    () => ({
      saved,
      isSaved,
      toggleSaved,
      compare,
      inCompare,
      toggleCompare,
      clearCompare,
      recents,
      pushRecent,
      alerts,
      addAlert,
      removeAlert,
      profile,
      updateProfile,
      completeness,
    }),
    [
      saved,
      isSaved,
      toggleSaved,
      compare,
      inCompare,
      toggleCompare,
      clearCompare,
      recents,
      pushRecent,
      alerts,
      addAlert,
      removeAlert,
      profile,
      updateProfile,
      completeness,
    ],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal(): PortalValue {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal debe usarse dentro de <PortalProvider>.');
  return ctx;
}
