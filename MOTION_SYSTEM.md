# Motion system

The portal uses GSAP for page entrances, button micro-interactions, and controlled ambient rotation. Three.js provides a low-power, wireframe atmosphere behind the public shell. The canvas is decorative, pointer-free, and removed under `prefers-reduced-motion`.

Animation rules:

- Animate transform and opacity, not layout geometry.
- Use exponential ease-out curves for entrances and interactions.
- Keep ambient motion slow and low contrast.
- Never use motion to communicate essential information.
- Respect reduced motion and low-power rendering.
- Keep buttons keyboard-visible and at least 44px tall.
- Preserve a static Liquid Glass fallback when WebGL is unavailable.

The scroll progress indicator is passive and uses requestAnimationFrame throttling. Smooth scrolling is disabled automatically for users who request reduced motion.
