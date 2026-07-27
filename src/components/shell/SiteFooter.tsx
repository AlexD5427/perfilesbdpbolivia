'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { BdpLogo } from '@/components/brand/BdpLogo';
import { Ornament } from '@/components/visual/Ornament';
import { Reveal } from '@/components/motion/Reveal';

/**
 * Pie de página.
 *
 * La referencia cierra con un bloque ciruela y el teléfono compuesto en
 * Didone a un tamaño enorme, tratado como pieza tipográfica y no como dato
 * de contacto. Aquí ocupa ese lugar el correo de la oficina de talento, que
 * es el canal real de este portal.
 */
export function SiteFooter() {
  const { d } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" data-canvas="plum">
      <Ornament kind="chevron" className="ornament--bl ornament--faint" tone="#ffffff" />

      <div className="shell shell--railed">
        <Reveal variant="fade">
          <BdpLogo variant="mark" tone="light" className="site-footer__mark" />
        </Reveal>

        <Reveal variant="up" delay={0.1}>
          <a className="site-footer__phone" href="mailto:talento@bdp.com.bo">
            talento@bdp.com.bo
          </a>
        </Reveal>

        <Reveal variant="fade" delay={0.2}>
          <div className="site-footer__office">
            <span className="label label--tiny">{d.footer.office}</span>
            <span className="label">{d.footer.address}</span>
          </div>
        </Reveal>

        <div className="site-footer__grid">
          <div className="site-footer__col">
            <strong className="label label--tiny">{d.brand.portal}</strong>
            <p className="body-text" style={{ fontSize: '0.8rem' }}>
              {d.brand.legal}
            </p>
          </div>

          <div className="site-footer__col">
            <strong className="label label--tiny">{d.footer.info}</strong>
            <Link href="/privacidad" className="link-rule">
              {d.footer.privacy}
            </Link>
            <Link href="/terminos" className="link-rule">
              {d.footer.terms}
            </Link>
            <Link href="/accesibilidad" className="link-rule">
              {d.footer.accessibility}
            </Link>
          </div>

          <div className="site-footer__col">
            <strong className="label label--tiny">{d.footer.helpTitle}</strong>
            <Link href="/ayuda" className="link-rule">
              {d.footer.helpCenter}
            </Link>
            <Link href="/procesos" className="link-rule">
              {d.nav.jobs}
            </Link>
            <Link href="/crear-cuenta" className="link-rule">
              {d.nav.signup}
            </Link>
          </div>
        </div>

        <div className="site-footer__legal">
          <span className="label label--tiny">
            BDP S.A.M. · {year} · {d.footer.rights}
          </span>
          <span className="label label--tiny">La Paz · Bolivia</span>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
