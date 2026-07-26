'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AnimationEngine() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Just make everything visible
      document.querySelectorAll('[data-animate]').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    // Wait a tick for DOM to be ready
    const timer = setTimeout(() => {
      initAnimations();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

function initAnimations() {
  // ─── CHARACTER SPLIT ANIMATIONS ───
  document.querySelectorAll('[data-animate="chars"]').forEach((el) => {
    const text = el.textContent || '';
    const html = el.innerHTML;
    // Preserve inner HTML structure (like <span> tags)
    const wrapper = document.createElement('span');
    wrapper.style.display = 'contents';

    // Split visible text into characters while preserving HTML
    const splitHTML = splitTextToChars(html);
    el.innerHTML = splitHTML;

    const chars = el.querySelectorAll('.char');
    gsap.set(chars, { opacity: 0, y: 40, rotateX: -45, transformOrigin: '50% 50%' });

    ScrollTrigger.create({
      trigger: el as HTMLElement,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.02,
          ease: 'power4.out',
        });
      },
    });
  });

  // ─── FADE UP ANIMATIONS ───
  document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
    const delay = parseFloat((el as HTMLElement).dataset.delay || '0');

    gsap.set(el, { opacity: 0, y: 40 });

    ScrollTrigger.create({
      trigger: el as HTMLElement,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power4.out',
        });
      },
    });
  });

  // ─── SCALE IN ANIMATIONS ───
  document.querySelectorAll('[data-animate="scale-in"]').forEach((el) => {
    const delay = parseFloat((el as HTMLElement).dataset.delay || '0');

    gsap.set(el, { opacity: 0, scale: 0.85 });

    ScrollTrigger.create({
      trigger: el as HTMLElement,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          delay,
          ease: 'power4.out',
        });
      },
    });
  });

  // ─── COUNTER ANIMATIONS ───
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt((el as HTMLElement).dataset.count || '0', 10);

    ScrollTrigger.create({
      trigger: el as HTMLElement,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toLocaleString();
          },
        });
      },
    });
  });

  // ─── PARALLAX EFFECTS ───
  document.querySelectorAll('.orbital').forEach((el) => {
    gsap.to(el, {
      y: -40,
      scrollTrigger: {
        trigger: el as HTMLElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  });

  // ─── SECTION DIVIDER ANIMATION ───
  document.querySelectorAll('.section-divider').forEach((el) => {
    gsap.fromTo(el.querySelector('::after') || el, 
      { scaleX: 0 },
      {
        scaleX: 1,
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1,
        },
      }
    );
  });

  // ─── MAGNETIC BUTTON EFFECTS ───
  document.querySelectorAll('.button').forEach((button) => {
    const btn = button as HTMLElement;
    let bounds: DOMRect;

    const onEnter = () => {
      bounds = btn.getBoundingClientRect();
    };

    const onMove = (e: MouseEvent) => {
      if (!bounds) return;
      const x = e.clientX - bounds.left - bounds.width / 2;
      const y = e.clientY - bounds.top - bounds.height / 2;
      gsap.to(btn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    const onLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
  });

  // ─── CARD TILT EFFECT ───
  document.querySelectorAll('.card').forEach((card) => {
    const el = card as HTMLElement;

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const bounds = el.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width - 0.5;
      const y = (e.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(el, {
        rotateY: x * 8,
        rotateX: -y * 8,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.6)',
      });
    });
  });

  // ─── HEADER HIDE/SHOW ON SCROLL ───
  const header = document.querySelector('.site-header') as HTMLElement;
  if (header) {
    let lastScroll = 0;
    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        const scroll = self.scroll();
        if (scroll > 100) {
          header.classList.add('header-scrolled');
          if (scroll > lastScroll && scroll > 200) {
            header.classList.add('header-hidden');
          } else {
            header.classList.remove('header-hidden');
          }
        } else {
          header.classList.remove('header-scrolled');
          header.classList.remove('header-hidden');
        }
        lastScroll = scroll;
      },
    });
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector((link as HTMLAnchorElement).getAttribute('href') || '');
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target as HTMLElement, offsetY: 80 },
          duration: 1.2,
          ease: 'power4.inOut',
        });
      }
    });
  });
}

// Utility: Split text into characters while preserving HTML tags
function splitTextToChars(html: string): string {
  // Simple approach: wrap each visible character in a span
  let result = '';
  let inTag = false;
  let tagBuffer = '';

  for (let i = 0; i < html.length; i++) {
    const char = html[i];

    if (char === '<') {
      inTag = true;
      tagBuffer += char;
      continue;
    }

    if (char === '>') {
      inTag = false;
      tagBuffer += char;
      result += tagBuffer;
      tagBuffer = '';
      continue;
    }

    if (inTag) {
      tagBuffer += char;
      continue;
    }

    // Regular character
    if (char === ' ') {
      result += ' ';
    } else {
      result += `<span class="char" style="display:inline-block">${char}</span>`;
    }
  }

  return result;
}
