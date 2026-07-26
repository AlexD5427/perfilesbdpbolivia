'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MotionAtmosphere, MotionEnhancer } from '@/components/MotionAtmosphere';
import { ScrollProgress } from '@/components/ScrollProgress';

export function PortalShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [largeText, setLargeText] = useState(false);
  useEffect(() => { setDark(localStorage.getItem('bdp-theme') === 'dark'); setLargeText(localStorage.getItem('bdp-large-text') === 'true'); }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('bdp-theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { document.documentElement.classList.toggle('large-text', largeText); localStorage.setItem('bdp-large-text', String(largeText)); }, [largeText]);
  return <>
    <ScrollProgress />
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header"><div className="header-inner"><Link className="brand" href="/"><span className="brand-mark">bdp</span><span>Portal de Candidaturas</span></Link><nav aria-label="Navegación principal"><Link href="/procesos">Ver procesos</Link><Link href="/ayuda">Ayuda</Link><Link className="header-login" href="/iniciar-sesion">Iniciar sesión</Link></nav><div className="header-tools"><button aria-label={dark ? 'Usar modo claro' : 'Usar modo oscuro'} onClick={() => setDark(!dark)}>{dark ? '☼' : '◐'}</button><button aria-label="Ajustar tamaño de texto" onClick={() => setLargeText(!largeText)}>Aa</button></div></div></header>
    <main id="contenido"><MotionEnhancer />{children}<section className="atmosphere-panel" aria-hidden="true"><MotionAtmosphere /></section></main>
    <footer className="site-footer"><div><span className="brand-mark">bdp</span><p>Banco de Desarrollo Productivo BDP S.A.M.</p></div><div><strong>Información</strong><Link href="/privacidad">Privacidad</Link><Link href="/terminos">Términos de uso</Link><Link href="/accesibilidad">Accesibilidad</Link></div><div><strong>¿Necesitas ayuda?</strong><Link href="/ayuda">Visita el centro de ayuda</Link><span>La Paz, Bolivia · es-BO</span></div></footer>
  </>;
}
