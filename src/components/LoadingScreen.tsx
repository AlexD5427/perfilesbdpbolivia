'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const bar = barRef.current;
    const text = textRef.current;
    const canvas = particlesRef.current;
    if (!container || !logo || !bar || !text || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    // Particles for loading screen
    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    }
    const particles: Particle[] = [];
    const colors = ['#00e5ff', '#20ddb8', '#8b5cf6', '#f0c040'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animFrame: number;
    const drawParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(drawParticles);
    };
    drawParticles();

    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation
        const exitTl = gsap.timeline({ onComplete });
        exitTl
          .to(particles, {
            duration: 0.8,
            onUpdate: () => {
              particles.forEach((p) => {
                p.vx *= 1.15;
                p.vy *= 1.15;
                p.alpha *= 0.97;
              });
            },
          })
          .to(logo, { scale: 1.2, opacity: 0, duration: 0.5, ease: 'power3.in' }, 0)
          .to(bar.parentElement, { opacity: 0, duration: 0.3 }, 0)
          .to(text, { opacity: 0, y: -10, duration: 0.3 }, 0)
          .to(container, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 0.9,
            ease: 'power4.inOut',
          }, 0.2);
      },
    });

    // Intro sequence
    tl.fromTo(logo, { scale: 0.5, opacity: 0, rotationY: -90 }, { scale: 1, opacity: 1, rotationY: 0, duration: 1, ease: 'power4.out' })
      .fromTo(text, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5)
      .fromTo(bar.parentElement, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.6)
      .to(bar, {
        width: '100%',
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: function() {
          setProgress(Math.round(this.progress() * 100));
        },
      }, 0.8);

    return () => {
      cancelAnimationFrame(animFrame);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="loading-screen" ref={containerRef} style={{ clipPath: 'circle(150% at 50% 50%)' }}>
      <canvas className="loading-particles" ref={particlesRef} />
      <div className="loading-logo" ref={logoRef}>bdp</div>
      <div className="loading-bar-container">
        <div className="loading-bar" ref={barRef} />
      </div>
      <div className="loading-text" ref={textRef}>
        Cargando experiencia \u00b7 {progress}%
      </div>
    </div>
  );
}
