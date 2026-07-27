'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Punto único de registro de GSAP.
 *
 * Registrar el plugin en cada componente provoca advertencias en desarrollo
 * y duplica trabajo en cada hot reload. Se hace aquí una sola vez y el resto
 * de la aplicación importa desde este módulo.
 */
let registered = false;

if (typeof window !== 'undefined' && !registered) {
  gsap.registerPlugin(ScrollTrigger);
  registered = true;

  // Ajustes globales que definen el carácter del movimiento del portal:
  // curvas largas, sin rebotes, todo se desliza y se asienta.
  gsap.defaults({ ease: 'power4.out', duration: 1 });

  // Con overwrite automático evitamos que dos tweens peleen por la misma
  // propiedad cuando el usuario navega rápido entre secciones.
  gsap.config({ autoSleep: 60, nullTargetWarn: false });
}

/** Curvas nombradas, espejo exacto de las variables CSS. */
export const EASE = {
  outExpo: 'expo.out',
  outQuint: 'quint.out',
  inOutQuart: 'power4.inOut',
  glass: 'power3.out',
} as const;

export { gsap, ScrollTrigger };
