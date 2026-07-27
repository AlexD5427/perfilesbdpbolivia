'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useI18n } from '@/lib/i18n';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { SplitText } from '@/components/motion/SplitText';
import { CircleButton } from '@/components/motion/CircleButton';

type Mood = 'dia' | 'noche';

/**
 * Héroe.
 *
 * Traducción de la portada de la referencia, elemento por elemento:
 *
 *   ERA RESIDENCE (Didone monumental)  ->  TRABAJA / EN EL BDP
 *   Estepona (script solapado)         ->  Bolivia
 *   BY DAY / BY NIGHT (conmutador)     ->  POR VOCACIÓN / POR PROPÓSITO
 *   A PLACE ... TO RETURN TO (flancos) ->  UN LUGAR ... PARA CRECER
 *   Botón circular sobre la foto       ->  VER CONVOCATORIAS ABIERTAS
 *
 * El conmutador merece una nota. En la referencia cambia el cielo de la
 * fotografía entre día y noche, y es puro deleite. Aquí se conserva porque
 * hace algo más: da a la portada dos lecturas emocionales distintas del
 * mismo mensaje sin duplicar contenido, y le da a la persona algo que tocar
 * en los primeros tres segundos. La transición dura 1,4 s con curva de
 * entrada y salida, para que se lea como un amanecer y no como un
 * interruptor de luz.
 *
 * La cordillera en SVG sustituye a la fotografía de la costa: sitúa la
 * pieza en Bolivia sin necesidad de banco de imágenes.
 */
export function Hero() {
  const { d } = useI18n();
  const reduced = useReducedMotion();
  const [mood, setMood] = useState<Mood>('dia');
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // Los flancos entran desde fuera del encuadre, imitando el modo en que
      // la referencia los desliza hacia sus posiciones.
      tl.fromTo(
        '.hero__flank--left',
        { opacity: 0, x: -60 },
        { opacity: 0.92, x: 0, duration: 1.4 },
        0.9,
      )
        .fromTo(
          '.hero__flank--right',
          { opacity: 0, x: 60 },
          { opacity: 0.92, x: 0, duration: 1.4 },
          0.9,
        )
        .fromTo('.hero__mood', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, 1.2)
        .fromTo('.hero__cta', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1 }, 1.35)
        .fromTo(
          '.hero__range',
          { opacity: 0, yPercent: 12 },
          { opacity: 1, yPercent: 0, duration: 1.8 },
          0.4,
        );

      // Paralaje de salida: el titular sube más despacio que la cordillera,
      // lo que separa los planos al abandonar la portada.
      gsap.to('.hero__inner', {
        yPercent: -14,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });

      gsap.to('.hero__range', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 1.2 },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="hero" data-canvas="night" data-mood={mood} ref={rootRef}>
      <div className="hero__sky hero__sky--day" />
      <div className="hero__sky hero__sky--night" />
      <div className="hero__vignette" />

      {/* Silueta de la cordillera. Dos planos con distinta opacidad para
          conseguir perspectiva aérea sin usar imágenes. */}
      <svg
        className="hero__range"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,210 L120,150 L210,196 L330,110 L440,178 L560,96 L690,168 L810,120 L930,190 L1050,140 L1170,198 L1290,152 L1440,200 L1440,320 L0,320 Z"
          fill="rgba(2,10,20,0.42)"
        />
        <path
          d="M0,250 L100,208 L200,244 L320,180 L430,232 L540,172 L660,228 L780,186 L900,240 L1020,198 L1140,246 L1260,206 L1440,248 L1440,320 L0,320 Z"
          fill="rgba(2,10,20,0.85)"
        />
      </svg>

      <div className="hero__flanks" aria-hidden="true">
        <span className="hero__flank hero__flank--left">{d.hero.flankLeft}</span>
        <span className="hero__flank hero__flank--right">{d.hero.flankRight}</span>
      </div>

      <div className="hero__inner shell">
        <div className="hero__title">
          <SplitText
            as="h1"
            className="display display--xxl"
            mode="chars"
            onScroll={false}
            delay={0.25}
          >
            {d.hero.line1}
          </SplitText>

          <SplitText
            as="span"
            className="display display--xl"
            mode="chars"
            onScroll={false}
            delay={0.45}
          >
            {d.hero.line2}
          </SplitText>

          <SplitText
            as="span"
            className="script script--xl hero__script"
            mode="chars"
            onScroll={false}
            delay={0.85}
            stagger={0.045}
          >
            {d.hero.script}
          </SplitText>
        </div>

        <div className="hero__mood" role="group" aria-label={d.hero.eyebrow}>
          <button
            type="button"
            aria-pressed={mood === 'dia'}
            onClick={() => setMood('dia')}
          >
            {d.hero.moodDay}
          </button>
          <button
            type="button"
            aria-pressed={mood === 'noche'}
            onClick={() => setMood('noche')}
          >
            {d.hero.moodNight}
          </button>
        </div>
      </div>

      <div className="hero__cta">
        <CircleButton href="/procesos">{d.hero.cta}</CircleButton>
      </div>
    </section>
  );
}

export default Hero;
