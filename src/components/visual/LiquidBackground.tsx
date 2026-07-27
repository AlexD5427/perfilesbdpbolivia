'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * Fondo de vidrio liquido en WebGL.
 *
 * Es un unico cuadrilatero a pantalla completa con un shader de fragmento:
 * no hay geometria ni luces, asi que el coste es una pasada de pixeles y
 * nada mas. Con eso alcanza para lo que se necesita, que es una masa de
 * color que respira detras del vidrio.
 *
 * El shader combina tres campos:
 *   - Ruido simplex fractal a dos octavas, que genera la deriva lenta.
 *   - Un campo de distancia a tres lamparas con los colores de marca.
 *   - Una banda especular fina que atraviesa el lienzo en diagonal, que es
 *     lo que da la lectura de cristal y no de humo.
 *
 * El puntero desplaza el centro del campo con interpolacion muy baja (0.03),
 * de modo que el fondo responde con retardo notable. Si siguiera al raton al
 * instante pareceria un efecto de cursor; con retardo parece materia.
 */
export function LiquidBackground({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
    } catch {
      // Sin WebGL el fondo simplemente no existe. El degradado CSS del body
      // ya cubre el caso, asi que no hay nada que reparar.
      return;
    }

    // Media resolucion: es un fondo desenfocado, el detalle no se percibe y
    // el ahorro de relleno es enorme en pantallas de alta densidad.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5) * 0.7);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uIntensity: { value: intensity },
    };

    const vertexShader = [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = vec4(position.xy, 0.0, 1.0);',
      '}',
    ].join('\n');

    // El shader se compone como lista de lineas para mantenerlo legible en
    // el diff y evitar sorpresas con el escapado de plantillas.
    const fragmentShader = [
      'precision highp float;',
      'varying vec2 vUv;',
      'uniform float uTime;',
      'uniform vec2  uMouse;',
      'uniform vec2  uRes;',
      'uniform float uIntensity;',
      '',
      '// Ruido simplex 2D (Ashima Arts, dominio publico).',
      'vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }',
      'vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }',
      'vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }',
      '',
      'float snoise(vec2 v){',
      '  const vec4 C = vec4(0.211324865, 0.366025403, -0.577350269, 0.024390243);',
      '  vec2 i  = floor(v + dot(v, C.yy));',
      '  vec2 x0 = v - i + dot(i, C.xx);',
      '  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
      '  vec4 x12 = x0.xyxy + C.xxzz;',
      '  x12.xy -= i1;',
      '  i = mod289(i);',
      '  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
      '  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);',
      '  m = m*m; m = m*m;',
      '  vec3 x = 2.0 * fract(p * C.www) - 1.0;',
      '  vec3 h = abs(x) - 0.5;',
      '  vec3 ox = floor(x + 0.5);',
      '  vec3 a0 = x - ox;',
      '  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);',
      '  vec3 g;',
      '  g.x  = a0.x  * x0.x  + h.x  * x0.y;',
      '  g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
      '  return 130.0 * dot(m, g);',
      '}',
      '',
      'void main() {',
      '  // Correccion de aspecto: sin esto las manchas se ovalan en pantallas anchas.',
      '  vec2 uv = vUv;',
      '  vec2 p = uv;',
      '  p.x *= uRes.x / uRes.y;',
      '',
      '  float t = uTime * 0.045;',
      '',
      '  // Dos octavas bastan: la tercera no se distingue tras el desenfoque.',
      '  float n  = snoise(p * 1.4 + vec2(t, t * 0.7)) * 0.6;',
      '  n += snoise(p * 3.1 - vec2(t * 1.3, t)) * 0.25;',
      '',
      '  vec2 m = uMouse;',
      '  m.x *= uRes.x / uRes.y;',
      '',
      '  // Tres lamparas con los colores institucionales.',
      '  vec3 navy = vec3(0.0,   0.259, 0.510);',
      '  vec3 cyan = vec3(0.0,   0.690, 0.847);',
      '  vec3 deep = vec3(0.008, 0.047, 0.086);',
      '',
      '  float d1 = length(p - vec2(0.35 + n * 0.15, 0.30 + n * 0.12));',
      '  float d2 = length(p - vec2(0.85 - n * 0.12, 0.72 + n * 0.10));',
      '  float d3 = length(p - m);',
      '',
      '  float f1 = smoothstep(0.85, 0.0, d1);',
      '  float f2 = smoothstep(0.75, 0.0, d2);',
      '  float f3 = smoothstep(0.55, 0.0, d3) * 0.7;',
      '',
      '  vec3 col = deep;',
      '  col = mix(col, navy, f1 * 0.85);',
      '  col = mix(col, cyan, f2 * 0.55);',
      '  col = mix(col, cyan, f3 * 0.35);',
      '',
      '  // Banda especular: la firma del vidrio.',
      '  float band = sin((uv.x + uv.y) * 5.0 - uTime * 0.18);',
      '  col += smoothstep(0.965, 1.0, band) * 0.055;',
      '',
      '  // Vineta suave para que el contenido central respire.',
      '  float vig = smoothstep(1.25, 0.15, length(uv - 0.5));',
      '',
      '  float alpha = (f1 * 0.5 + f2 * 0.42 + f3 * 0.3) * vig * uIntensity;',
      '  gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.82));',
      '}',
    ].join('\n');

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader,
      fragmentShader,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    quad.frustumCulled = false;
    scene.add(quad);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    const target = new THREE.Vector2(0.5, 0.5);
    const onPointer = (event: PointerEvent) => {
      target.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let frame = 0;
    const clock = new THREE.Clock();
    let visible = !document.hidden;

    const loop = () => {
      if (!visible) return;
      frame = requestAnimationFrame(loop);
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(target, 0.03);
      renderer.render(scene, camera);
    };

    // Detenemos el bucle con la pestana oculta: no tiene sentido gastar GPU
    // dibujando algo que nadie mira, y ahorra bateria en portatiles.
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) loop();
      else cancelAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', onVisibility);

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reduced, intensity]);

  return <canvas className="liquid-canvas" ref={canvasRef} aria-hidden="true" />;
}

export default LiquidBackground;
