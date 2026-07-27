'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { LOCALE_META } from '@/lib/i18n/locales';
import { Icon } from '@/components/system/Icon';

type Status = 'idle' | 'reading' | 'paused';

/**
 * Lector de voz de la página.
 *
 * Se apoya en `SpeechSynthesis`, que está en todos los navegadores actuales
 * y no requiere ningún servicio externo: el texto nunca sale del dispositivo.
 *
 * Detalles que hacen que sea usable y no una casilla marcada:
 *
 *   - **Extrae contenido, no marcado.** Recorre el `<main>` tomando sólo
 *     titulares, párrafos y elementos de lista, y salta lo que esté oculto
 *     o marcado como decorativo. Leer la interfaz entera de arriba abajo,
 *     incluidos los rótulos de los botones, es inservible.
 *
 *   - **Lee por frases y resalta la actual.** Se sigue con la vista mientras
 *     se escucha, que es justo lo que necesita una persona con dislexia o
 *     con dificultad de concentración.
 *
 *   - **Elige la voz por idioma.** Busca una voz instalada que coincida con
 *     el idioma activo. Para quechua y aymara no existen voces en ningún
 *     sistema operativo de consumo, así que recurre a español boliviano:
 *     la fonética castellana es razonablemente cercana y se entiende mejor
 *     que una voz inglesa leyendo texto aymara.
 *
 *   - **Se detiene al salir.** `speechSynthesis` sobrevive a la navegación;
 *     sin la limpieza, la voz seguiría hablando en la página siguiente.
 */
export function SpeechReader() {
  const { d, locale } = useI18n();
  const [status, setStatus] = useState<Status>('idle');
  const [rate, setRate] = useState(1);
  const [supported, setSupported] = useState(true);

  const chunks = useRef<{ text: string; node: HTMLElement }[]>([]);
  const index = useRef(0);
  const highlighted = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const clearHighlight = useCallback(() => {
    highlighted.current?.classList.remove('tts-reading');
    highlighted.current = null;
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    clearHighlight();
    chunks.current = [];
    index.current = 0;
    setStatus('idle');
  }, [clearHighlight]);

  // La síntesis es global al navegador: si no se cancela al desmontar,
  // la voz continúa sobre la página siguiente.
  useEffect(() => stop, [stop]);

  const pickVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Quechua y aymara no tienen voces sintéticas en ningún sistema de
    // consumo. El castellano boliviano es el sustituto más inteligible.
    const wanted = locale === 'qu' || locale === 'ay' ? 'es' : LOCALE_META[locale].tag;
    const base = wanted.split('-')[0];

    return (
      voices.find((v) => v.lang.toLowerCase() === wanted.toLowerCase()) ??
      voices.find((v) => v.lang.toLowerCase().startsWith(base)) ??
      voices[0]
    );
  }, [locale]);

  const collect = useCallback(() => {
    const main = document.querySelector('main');
    if (!main) return [];

    const nodes = Array.from(
      main.querySelectorAll<HTMLElement>('h1, h2, h3, h4, p, li, blockquote'),
    );

    return nodes
      .filter((node) => {
        if (node.closest('[aria-hidden="true"]')) return false;
        if (node.getAttribute('aria-hidden') === 'true') return false;
        // `offsetParent` nulo significa oculto o dentro de algo con
        // display:none; también descartamos los paneles cerrados.
        if (node.offsetParent === null) return false;
        return (node.textContent ?? '').trim().length > 2;
      })
      .map((node) => ({ text: (node.textContent ?? '').trim(), node }));
  }, []);

  const speakFrom = useCallback(
    (start: number) => {
      const synth = window.speechSynthesis;
      const item = chunks.current[start];

      if (!item) {
        stop();
        return;
      }

      index.current = start;
      clearHighlight();
      item.node.classList.add('tts-reading');
      highlighted.current = item.node;
      item.node.scrollIntoView({ block: 'center', behavior: 'smooth' });

      const utterance = new SpeechSynthesisUtterance(item.text);
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang ?? 'es-BO';
      utterance.rate = rate;
      utterance.pitch = 1;

      utterance.onend = () => {
        // Sólo continuamos si seguimos en modo lectura: si el usuario pulsó
        // detener durante la frase, `onend` también se dispara.
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) return;
        speakFrom(start + 1);
      };

      utterance.onerror = () => stop();

      synth.speak(utterance);
    },
    [clearHighlight, pickVoice, rate, stop],
  );

  const play = useCallback(() => {
    if (!supported) return;

    const synth = window.speechSynthesis;

    if (status === 'paused') {
      synth.resume();
      setStatus('reading');
      return;
    }

    synth.cancel();
    chunks.current = collect();
    if (!chunks.current.length) return;

    setStatus('reading');
    speakFrom(0);
  }, [collect, speakFrom, status, supported]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setStatus('paused');
  }, []);

  // Reanudar con otra velocidad exige recrear la locución: `rate` sólo se
  // lee en el momento de encolar.
  useEffect(() => {
    if (status !== 'reading') return;
    const current = index.current;
    window.speechSynthesis.cancel();
    speakFrom(current);
    // Intencionadamente sólo depende de `rate`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  // Atajo global: Alt + L.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!event.altKey || event.key.toLowerCase() !== 'l') return;
      event.preventDefault();
      if (status === 'reading') pause();
      else play();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status, play, pause]);

  if (!supported || status === 'idle') return null;

  return (
    <div className="tts-bar" role="region" aria-label={d.a11y.tts}>
      {status === 'reading' ? (
        <span className="tts-wave" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : null}

      <span className="tts-bar__status">
        {status === 'reading' ? d.tts.reading : d.tts.paused}
      </span>

      <label className="tts-bar__rate">
        <span>{d.tts.speed}</span>
        <input
          type="range"
          min={0.6}
          max={1.8}
          step={0.1}
          value={rate}
          onChange={(event) => setRate(Number(event.target.value))}
          aria-label={d.tts.speed}
        />
        <span aria-hidden="true">{rate.toFixed(1)}x</span>
      </label>

      <div className="tts-bar__ctrls">
        {status === 'reading' ? (
          <button type="button" className="tts-bar__btn" onClick={pause} aria-label={d.tts.pause}>
            <Icon name="pause" size={15} />
          </button>
        ) : (
          <button type="button" className="tts-bar__btn" onClick={play} aria-label={d.tts.resume}>
            <Icon name="play" size={13} />
          </button>
        )}
        <button type="button" className="tts-bar__btn" onClick={stop} aria-label={d.tts.stop}>
          <Icon name="stop" size={11} />
        </button>
      </div>
    </div>
  );
}

/** Botón que arranca la lectura desde cualquier parte de la interfaz. */
export function SpeechTrigger({ className }: { className?: string }) {
  const { d } = useI18n();
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      className={className ?? 'btn btn--ghost btn--sm'}
      onClick={() => {
        // Reutilizamos el atajo para no duplicar la lógica de lectura.
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', altKey: true }));
      }}
    >
      <Icon name="speaker" size={15} />
      {d.tts.play}
    </button>
  );
}

export default SpeechReader;
