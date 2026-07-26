'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

export function MotionAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Particle System
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color('#00e5ff'),
      new THREE.Color('#20ddb8'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#3b82f6'),
      new THREE.Color('#f0c040'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 3;

      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 0.5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPixelRatio;

        void main() {
          vColor = color;
          vec3 pos = position;

          // Gentle floating motion
          pos.x += sin(uTime * 0.3 + position.y * 0.5) * 0.1;
          pos.y += cos(uTime * 0.2 + position.x * 0.5) * 0.1;
          pos.z += sin(uTime * 0.25 + position.z * 0.3) * 0.05;

          // Mouse influence
          float dist = length(pos.xy - uMouse * 3.0);
          float influence = smoothstep(3.0, 0.0, dist) * 0.3;
          pos.xy += normalize(pos.xy - uMouse * 3.0) * influence;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float sizeAttenuation = (300.0 / -mvPosition.z);
          gl_PointSize = size * sizeAttenuation * uPixelRatio * 0.5;
          gl_Position = projectionMatrix * mvPosition;

          // Fade based on distance from camera
          vAlpha = smoothstep(15.0, 2.0, -mvPosition.z) * 0.6;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Central Orb (glassmorphic sphere)
    const orbGeometry = new THREE.IcosahedronGeometry(1.2, 4);
    const orbMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float uTime;

        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          vec3 pos = position;

          // Noise displacement
          float noise = snoise(pos * 1.5 + uTime * 0.15) * 0.12;
          pos += normal * noise;

          vPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
          // Fresnel-like edge glow
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

          // Dynamic color shift
          vec3 color1 = vec3(0.0, 0.898, 1.0); // cyan
          vec3 color2 = vec3(0.545, 0.361, 0.965); // purple
          vec3 color3 = vec3(0.125, 0.867, 0.722); // teal

          float t = sin(uTime * 0.2) * 0.5 + 0.5;
          vec3 baseColor = mix(mix(color1, color2, t), color3, sin(uTime * 0.15 + 1.0) * 0.5 + 0.5);

          // Glass effect
          float alpha = fresnel * 0.5 + 0.03;
          vec3 finalColor = baseColor * fresnel + baseColor * 0.05;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orb);

    // Torus rings
    const createRing = (radius: number, tube: number, color: string, rotX: number, rotZ: number) => {
      const geom = new THREE.TorusGeometry(radius, tube, 32, 128);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.15,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = rotX;
      mesh.rotation.z = rotZ;
      return mesh;
    };

    const ring1 = createRing(1.8, 0.008, '#00e5ff', 1.2, 0.3);
    const ring2 = createRing(2.2, 0.005, '#8b5cf6', 0.8, -0.5);
    const ring3 = createRing(2.6, 0.004, '#20ddb8', 1.5, 0.8);
    scene.add(ring1, ring2, ring3);

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Scroll influence
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // GSAP animations for rings
    gsap.to(ring1.rotation, { y: Math.PI * 2, duration: 25, repeat: -1, ease: 'none' });
    gsap.to(ring2.rotation, { y: -Math.PI * 2, duration: 30, repeat: -1, ease: 'none' });
    gsap.to(ring3.rotation, { y: Math.PI * 2, duration: 35, repeat: -1, ease: 'none' });

    // Render loop
    let time = 0;
    let frame: number;
    const render = () => {
      frame = requestAnimationFrame(render);
      time += 0.01;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Update uniforms
      particleMaterial.uniforms.uTime.value = time;
      particleMaterial.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      orbMaterial.uniforms.uTime.value = time;
      orbMaterial.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Orb gentle rotation
      orb.rotation.y = time * 0.2;
      orb.rotation.x = Math.sin(time * 0.3) * 0.1;

      // Camera responds to mouse slightly
      camera.position.x += (mouseRef.current.x * 0.3 - camera.position.x) * 0.02;
      camera.position.y += (mouseRef.current.y * 0.2 - camera.position.y) * 0.02;

      // Scroll parallax on particle system
      const scrollInfluence = scrollY * 0.0005;
      particleSystem.rotation.y = scrollInfluence * 0.5;
      particleSystem.position.y = -scrollInfluence * 2;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      gsap.killTweensOf(ring1.rotation);
      gsap.killTweensOf(ring2.rotation);
      gsap.killTweensOf(ring3.rotation);
      particleGeometry.dispose();
      particleMaterial.dispose();
      orbGeometry.dispose();
      orbMaterial.dispose();
      ring1.geometry.dispose(); (ring1.material as THREE.Material).dispose();
      ring2.geometry.dispose(); (ring2.material as THREE.Material).dispose();
      ring3.geometry.dispose(); (ring3.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="motion-canvas" ref={canvasRef} aria-hidden="true" />;
}
