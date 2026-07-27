'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { SplitText } from '@/components/motion/SplitText';
import { Scene, type SceneKind } from '@/components/visual/Scene';
import { Icon } from '@/components/system/Icon';

export type CarouselSlide = {
  id: string;
  title: string;
  body: string;
  kicker?: string;
  scene: SceneKind;
};

/**
 * Carrusel vinculado.
 *
 * Es la sección "Three reasons to choose Era" de la referencia. Lo
 * característico no es el carrusel en sí, sino que titular, imagen y texto
 * cambian a la vez: al pasar de diapositiva, el titular gigante se rehace
 * letra por letra. En las capturas se aprecia perfectamente el estado
 * intermedio ("BUILT T0", "BOUTIQUE CO N") con las últimas letras aún
 * fantasma.
 *
 * Aquí se reproduce remontando el componente `SplitText` con una `key`
 * nueva en cada cambio: React lo desmonta y lo vuelve a montar, y la
 * animación de entrada se reproduce entera. Es más simple y más fiable que
 * intentar reanimar el mismo nodo.
 *
 * El avance automático se detiene en cuanto la persona interactúa. Un
 * carrusel que sigue girando mientras alguien lee es hostil.
 */
export function LinkedCarousel({
  slides,
  autoplay = 7000,
  portrait = false,
}: {
  slides: CarouselSlide[];
  autoplay?: number;
  portrait?: boolean;
}) {
  const { d } = useI18n();
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const timer = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length],
  );

  const interact = useCallback(
    (next: number) => {
      setLocked(true);
      go(next);
    },
    [go],
  );

  useEffect(() => {
    if (locked || !autoplay || slides.length < 2) return;
    timer.current = window.setTimeout(() => go(index + 1), autoplay);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, locked, autoplay, slides.length, go]);

  const slide = slides[index];

  return (
    <div
      className="linked-carousel"
      role="group"
      aria-roledescription="carrusel"
      aria-label={slide.title}
    >
      {/* La clave fuerza el remontaje para que el revelado se repita. */}
      <SplitText
        key={`title-${slide.id}`}
        as="h2"
        className="display display--lg linked-carousel__title"
        mode="chars"
        onScroll={false}
        stagger={0.024}
      >
        {slide.title}
      </SplitText>

      <div
        className={`linked-carousel__stage${portrait ? ' linked-carousel__stage--portrait' : ''}`}
      >
        {slides.map((item, i) => (
          <div
            className="carousel-slide"
            key={item.id}
            data-active={i === index}
            aria-hidden={i !== index}
            style={{
              transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <Scene kind={item.scene} />
          </div>
        ))}
      </div>

      <div className="pager">
        <button
          type="button"
          className="pager__arrow"
          onClick={() => interact(index - 1)}
          aria-label={d.common.previous}
        >
          <Icon name="arrow-left" size={16} />
        </button>

        <span className="pager__num" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span
          className="pager__track"
          style={{ ['--pager' as string]: (index + 1) / slides.length }}
        >
          <span />
        </span>

        <span className="pager__num" aria-hidden="true">
          {String(slides.length).padStart(2, '0')}
        </span>

        <button
          type="button"
          className="pager__arrow"
          onClick={() => interact(index + 1)}
          aria-label={d.common.next}
        >
          <Icon name="arrow-right" size={16} />
        </button>
      </div>

      <div className="stack stack--sm" style={{ marginTop: '2.2rem', textAlign: 'center' }}>
        <p className="lede lede--center" key={`body-${slide.id}`}>
          {slide.body}
        </p>
        {slide.kicker ? <p className="label label--tiny">{slide.kicker}</p> : null}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {index + 1} {d.common.of} {slides.length}: {slide.title}
      </p>
    </div>
  );
}

export default LinkedCarousel;
