'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { MotionAtmosphere } from '@/components/MotionAtmosphere';
import { ScrollProgress } from '@/components/ScrollProgress';
import { AnimationEngine } from '@/components/AnimationEngine';
import { LoadingScreen } from '@/components/LoadingScreen';

export function PortalShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true); // Default to dark for liquid glass
  const [largeText, setLargeText] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user has seen loading screen this session
    const seen = sessionStorage.getItem('bdp-loaded');
    if (seen) {
      setLoaded(true);
      setShowContent(true);
    }
  }, []);

  useEffect(() => {
    setLargeText(localStorage.getItem('bdp-large-text') === 'true');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', largeText);
    localStorage.setItem('bdp-large-text', String(largeText));
  }, [largeText]);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
    sessionStorage.setItem('bdp-loaded', 'true');
    // Small delay for the exit animation to complete
    setTimeout(() => setShowContent(true), 100);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* Three.js Background */}
      <section className="atmosphere-panel" aria-hidden="true">
        <MotionAtmosphere />
      </section>

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Skip Link */}
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">bdp</span>
            <span>Portal de Candidaturas</span>
          </Link>
          <nav aria-label="Navegaci\u00f3n principal">
            <Link href="/procesos">Ver procesos</Link>
            <Link href="/ayuda">Ayuda</Link>
            <Link className="header-login" href="/iniciar-sesion">Iniciar sesi\u00f3n</Link>
          </nav>
          <div className="header-tools">
            <button
              aria-label="Ajustar tama\u00f1o de texto"
              onClick={() => setLargeText(!largeText)}
            >
              Aa
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="contenido" style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <AnimationEngine />
        {children}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div>
          <span className="brand-mark">bdp</span>
          <p>Banco de Desarrollo Productivo BDP S.A.M.</p>
        </div>
        <div>
          <strong>Informaci\u00f3n</strong>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/terminos">T\u00e9rminos de uso</Link>
          <Link href="/accesibilidad">Accesibilidad</Link>
        </div>
        <div>
          <strong>\u00bfNecesitas ayuda?</strong>
          <Link href="/ayuda">Visita el centro de ayuda</Link>
          <span>La Paz, Bolivia \u00b7 es-BO</span>
        </div>
      </footer>
    </>
  );
}
