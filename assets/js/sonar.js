/* ==========================================================================
   sonar.js — interactive WebGL "sonar field" hero.
   A grid of points on a tilted plane. Continuous ping waves sweep outward
   from the centre; the pointer emits its own ripple. Points rise and
   illuminate along each wavefront — a sonar return reading the deep.
   ES module · Three.js from CDN (see importmap in the HTML).
   Gracefully degrades: no WebGL / reduced-motion -> CSS fallback.
   ========================================================================== */

import * as THREE from 'three';

const canvas = document.getElementById('sonar-canvas');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fail() { document.documentElement.classList.add('no-webgl'); }

if (!canvas) {
  /* nothing to do */
} else if (REDUCED) {
  fail();
} else {
  try { boot(); } catch (e) { console.warn('sonar: falling back', e); fail(); }
}

function boot() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 200);
  camera.position.set(0, 6.5, 15);
  camera.lookAt(0, -2, -7);

  // -------- point grid on the XZ plane --------
  const SIZE = 84;                 // points per side
  const SPACING = 0.7;
  const half = (SIZE - 1) * SPACING * 0.5;
  const count = SIZE * SIZE;

  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);   // per-point phase jitter
  let i = 0;
  for (let x = 0; x < SIZE; x++) {
    for (let z = 0; z < SIZE; z++) {
      positions[i * 3]     = x * SPACING - half;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = z * SPACING - half;
      seeds[i] = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453 % 1;
      i++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));

  const uniforms = {
    uTime:     { value: 0 },
    uPing:     { value: -10 },                       // time of last auto ping origin
    uPointer:  { value: new THREE.Vector3(0, 0, 0) }, // pointer position on plane
    uPointerT: { value: -10 },                       // time of last pointer ripple
    uSize:     { value: renderer.getPixelRatio() * 2.1 },
    uColLow:   { value: new THREE.Color('#3c4a28') },
    uColMid:   { value: new THREE.Color('#8bab42') },
    uColHigh:  { value: new THREE.Color('#c6f24e') },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      uniform float uTime, uPing, uPointerT, uSize;
      uniform vec3 uPointer;
      attribute float seed;
      varying float vI;

      // an expanding ring: crest at radius = speed*age, fading with age & distance
      float ring(float dist, float age, float speed, float width) {
        if (age < 0.0) return 0.0;
        float front = age * speed;
        float d = dist - front;
        float pulse = exp(-d * d / (width * width));   // gaussian ring
        float decay = exp(-age * 0.55) * exp(-dist * 0.045);
        return pulse * decay;
      }

      void main() {
        vec3 p = position;
        float dC = length(p.xz);                       // distance from centre
        float dP = length(p.xz - uPointer.xz);         // distance from pointer

        float wCenter = ring(dC, uTime - uPing, 3.4, 0.9);
        float wPtr    = ring(dP, uTime - uPointerT, 3.0, 0.7) * 1.2;
        // gentle ambient swell so the field is never fully dead
        float swell = 0.12 * sin(dC * 0.7 - uTime * 1.1 + seed * 6.28);

        float lift = wCenter * 1.6 + wPtr * 1.8 + swell;
        p.y += lift;

        vI = clamp(wCenter * 1.5 + wPtr * 1.8 + swell * 0.5 + 0.24, 0.0, 1.0);

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (uSize + vI * uSize * 3.6) / -mv.z * 24.0;
      }
    `,
    fragmentShader: /* glsl */`
      precision mediump float;
      uniform vec3 uColLow, uColMid, uColHigh;
      varying float vI;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float r = length(c);
        if (r > 0.5) discard;
        float glow = smoothstep(0.5, 0.0, r);
        vec3 col = mix(uColLow, uColMid, smoothstep(0.0, 0.5, vI));
        col = mix(col, uColHigh, smoothstep(0.5, 1.0, vI));
        float alpha = glow * (0.22 + vI * 0.95);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // -------- pointer -> plane intersection --------
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const ndc = new THREE.Vector2(0, 0);
  const hit = new THREE.Vector3();
  const targetTilt = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0 };
  let lastPointer = 0;

  function onPointer(e) {
    const t = e.touches ? e.touches[0] : e;
    const nx = (t.clientX / window.innerWidth) * 2 - 1;
    const ny = -(t.clientY / window.innerHeight) * 2 + 1;
    ndc.set(nx, ny);
    targetTilt.x = ny * 0.25;
    targetTilt.y = nx * 0.4;
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      // throttle pointer pings so drags feel like sonar, not noise
      if (clock.elapsedTime - lastPointer > 0.28) {
        uniforms.uPointer.value.copy(hit);
        uniforms.uPointerT.value = clock.elapsedTime;
        lastPointer = clock.elapsedTime;
      }
    }
  }
  window.addEventListener('pointermove', onPointer, { passive: true });

  // -------- resize --------
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // -------- render loop with auto-ping + pause when off-screen --------
  const clock = new THREE.Clock();
  let nextPing = 1.0;
  const PING_INTERVAL = 3.6;
  let visible = true;
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.01 })
      .observe(hero);
  }

  // -------- scroll reaction: the 3D scene responds to scroll position --------
  let scrollY = window.scrollY;
  let lastPingScroll = scrollY;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (visible && Math.abs(scrollY - lastPingScroll) > 110) {
      uniforms.uPing.value = clock.getElapsedTime();   // emit a sonar ping on scroll
      lastPingScroll = scrollY;
    }
  }, { passive: true });

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    if (t > nextPing) { uniforms.uPing.value = t; nextPing = t + PING_INTERVAL; }

    const heroH = hero ? hero.offsetHeight : window.innerHeight;
    const sf = Math.min(1, Math.max(0, scrollY / heroH));   // 0..1 through the hero

    // ease camera toward pointer-driven tilt for parallax; lift with scroll
    tilt.x += (targetTilt.x - tilt.x) * 0.04;
    tilt.y += (targetTilt.y - tilt.y) * 0.04;
    camera.position.x = Math.sin(tilt.y) * 12;
    camera.position.z = Math.cos(tilt.y) * 12;
    camera.position.y = 6.4 + tilt.x * 2.2 + sf * 5.0;
    camera.lookAt(0, -0.4 - sf * 2.0, -1.5);

    renderer.render(scene, camera);
  }
  frame();

  window.__sonarReady = true;
}
