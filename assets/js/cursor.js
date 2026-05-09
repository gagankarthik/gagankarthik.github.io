/* ========================================================================
   cursor.js — custom cursor + magnetic buttons
   Disabled on touch + reduced-motion.
   ======================================================================== */

(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH = matchMedia('(hover: none), (pointer: coarse)').matches;
  if (REDUCED || TOUCH) return;

  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const label = ring ? ring.querySelector('.cursor-label') : null;
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let dx = mx, dy = my;
  let scale = 0.5;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  });
  window.addEventListener('mousedown', () => document.body.classList.add('cursor-down'));
  window.addEventListener('mouseup',   () => document.body.classList.remove('cursor-down'));
  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  window.addEventListener('mouseenter', () => {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });

  function tick() {
    // dot follows fast, ring lerps slow
    dx += (mx - dx) * 0.85;
    dy += (my - dy) * 0.85;
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    const target = document.body.classList.contains('cursor-down')
      ? 0.85
      : (document.body.classList.contains('cursor-hover') ? 1 : 0.5);
    scale += (target - scale) * 0.22;
    dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale})`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // hover state on interactive elements
  const HOVER_SEL = 'a, button, [role="button"], [data-cursor], .work-card, .stat, .principle, .love-card';
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest(HOVER_SEL);
    if (t) {
      document.body.classList.add('cursor-hover');
      const text = t.getAttribute('data-cursor-label')
        || (t.tagName === 'A' && t.getAttribute('href') && (t.getAttribute('href').startsWith('http') ? 'visit ↗' : 'open →'))
        || (t.tagName === 'BUTTON' ? 'click' : '');
      if (label) label.textContent = text;
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(HOVER_SEL)) {
      document.body.classList.remove('cursor-hover');
      if (label) label.textContent = '';
    }
  });

  // magnetic buttons
  const magnets = document.querySelectorAll('[data-magnetic]');
  magnets.forEach((el) => {
    const radius = 80;
    const max = 12;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const ex = e.clientX, ey = e.clientY;
      const distX = ex - cx, distY = ey - cy;
      const dist = Math.hypot(distX, distY);
      if (dist > radius) {
        el.style.transform = '';
        return;
      }
      const k = (1 - dist / radius) * max;
      el.style.transform = `translate(${(distX/radius)*k}px, ${(distY/radius)*k}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // hover-radial for work cards
  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width)  * 100;
      const y = ((e.clientY - r.top)  / r.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
})();
