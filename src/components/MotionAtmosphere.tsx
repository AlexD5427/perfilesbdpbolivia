'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

export function MotionAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 4.5;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(1.35, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x20b8a6, wireframe: true, transparent: true, opacity: 0.22 });
    const orb = new THREE.Mesh(geometry, material);
    group.add(orb);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.012, 12, 96), new THREE.MeshBasicMaterial({ color: 0xe4b45d, transparent: true, opacity: 0.42 }));
    ring.rotation.x = 0.9;
    group.add(ring);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
    intro.fromTo(canvas, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: reduced ? 0.01 : 1.1 });
    if (!reduced) {
      gsap.to(group.rotation, { y: Math.PI * 2, x: Math.PI * 0.25, duration: 28, repeat: -1, ease: 'none' });
      gsap.to(ring.rotation, { z: -Math.PI * 2, duration: 20, repeat: -1, ease: 'none' });
    }

    let frame = 0;
    const render = () => { frame = requestAnimationFrame(render); renderer.render(scene, camera); };
    render();
    return () => { cancelAnimationFrame(frame); intro.kill(); gsap.killTweensOf(group.rotation); gsap.killTweensOf(ring.rotation); observer.disconnect(); geometry.dispose(); material.dispose(); ring.geometry.dispose(); (ring.material as THREE.Material).dispose(); renderer.dispose(); };
  }, []);

  return <canvas className="motion-canvas" ref={canvasRef} aria-hidden="true" />;
}

export function MotionEnhancer() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const revealTargets = document.querySelectorAll('.hero > div:first-child, .section, .detail-hero, .form-shell, .process-hero');
      gsap.fromTo(revealTargets, { opacity: 0, y: reduced ? 0 : 18 }, { opacity: 1, y: 0, duration: reduced ? 0.01 : 0.75, stagger: reduced ? 0 : 0.06, ease: 'power4.out', clearProps: 'transform' });
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>('.button').forEach((button) => {
          const onEnter = () => gsap.to(button, { y: -3, scale: 1.025, duration: 0.22, ease: 'power3.out' });
          const onLeave = () => gsap.to(button, { y: 0, scale: 1, duration: 0.3, ease: 'power3.out' });
          button.addEventListener('mouseenter', onEnter);
          button.addEventListener('mouseleave', onLeave);
          button.addEventListener('focus', onEnter);
          button.addEventListener('blur', onLeave);
        });
      }
    });
    return () => ctx.revert();
  }, []);
  return null;
}
