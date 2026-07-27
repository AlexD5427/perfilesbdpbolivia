'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { usePortal } from '@/lib/state/PortalProvider';
import { BdpLogo } from '@/components/brand/BdpLogo';
import { Icon } from '@/components/system/Icon';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * Cabecera fija.
 *
 * Dos comportamientos que parecen menores y no lo son:
 *
 * 1. **Se esconde al bajar, vuelve al subir.** En una página con titulares
 *    a pantalla completa, una barra permanente arriba les roba aire. Al
 *    subir reaparece porque ese gesto significa "quiero navegar".
 *
 * 2. **Invierte su tinta según el lienzo que tenga debajo.** La página
 *    alterna secciones oscuras y claras; una cabecera blanca fija sería
 *    invisible sobre la sección crema. Se resuelve con un
 *    `IntersectionObserver` sobre una línea horizontal imaginaria a la
 *    altura de la cabecera: cuando esa línea entra en una sección clara,
 *    la cabecera se pinta oscura. Es más barato y más fiable que consultar
 *    posiciones en cada evento de scroll.
 */
export function SiteHeader({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { d } = useI18n();
  const pathname = usePathname();
  const { saved } = usePortal();

  const [pinned, setPinned] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [over, setOver] = useState<'dark' | 'light'>('dark');
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Umbral de 6 px: por debajo, el temblor del trackpad haría parpadear
      // la cabecera constantemente.
      if (Math.abs(y - lastY.current) > 6) {
        setPinned(y < lastY.current || y < 120);
        lastY.current = y;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-canvas]');
    if (!sections.length) {
      setOver('dark');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const canvas = entry.target.getAttribute('data-canvas');
          setOver(canvas === 'powder' || canvas === 'cream' ? 'light' : 'dark');
        }
      },
      {
        // Banda de un píxel a la altura del centro de la cabecera.
        rootMargin: '-42px 0px -100% 0px',
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const nav = [
    { href: '/procesos', label: d.nav.jobs },
    { href: '/ayuda', label: d.nav.help },
    { href: '/accesibilidad', label: d.footer.accessibility },
  ];

  return (
    <header
      className="site-header"
      data-pinned={pinned}
      data-scrolled={scrolled}
      data-over={over}
    >
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label={d.brand.portal}>
          <BdpLogo variant="full" tone={over === 'light' ? 'color' : 'light'} />
          <span className="site-header__brand-text">{d.brand.portal}</span>
        </Link>

        <nav className="site-header__nav" aria-label={d.nav.menu}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-rule"
              aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__tools">
          <div className="header-actions">
            <Link href="/procesos" className="link-rule link-rule--always">
              {d.nav.seeJobs}
            </Link>
            <Link href="/ayuda" className="link-rule">
              {d.nav.bookCall}
            </Link>
            <Link href="/iniciar-sesion" className="link-rule">
              {d.nav.login}
            </Link>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={onOpenSearch}
            aria-label={d.features.search}
          >
            <Icon name="search" size={16} />
          </button>

          <span className="icon-btn-wrap">
            <Link href="/candidato/postulaciones" className="icon-btn" aria-label={d.jobs.saved}>
              <Icon name="bookmark" size={16} />
            </Link>
            {saved.length > 0 ? (
              <span className="icon-btn__badge" aria-hidden="true">
                {saved.length}
              </span>
            ) : null}
          </span>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
