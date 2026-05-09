/* ========================================================================
   playful.js — count-ups, currently rotator, sparkle particles, easter eggs
   ======================================================================== */

(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ STAT COUNT-UPS ============ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const suffix = el.getAttribute('data-count-suffix') || '';
        const dur = REDUCED ? 0 : 1100;
        const t0 = performance.now();
        function step(now) {
          const t = Math.min(1, (now - t0) / Math.max(1, dur));
          const eased = 1 - Math.pow(1 - t, 3);
          const v = Math.round(target * eased);
          el.firstChild ? (el.firstChild.nodeValue = String(v)) : (el.textContent = String(v));
          // re-append suffix span if present
          const suffixSpan = el.querySelector('.x');
          if (suffix && !suffixSpan) {
            const s = document.createElement('span');
            s.className = 'x';
            s.textContent = suffix;
            el.appendChild(s);
          }
          if (t < 1) requestAnimationFrame(step);
        }
        if (REDUCED) {
          el.textContent = String(target);
          if (suffix) {
            const s = document.createElement('span'); s.className = 'x'; s.textContent = suffix; el.appendChild(s);
          }
        } else {
          // seed with text node
          el.textContent = '0';
          requestAnimationFrame(step);
        }
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ============ CURRENTLY ROTATOR ============ */
  const rotator = document.querySelector('.currently-rotator');
  if (rotator) {
    const items = Array.from(rotator.querySelectorAll('.currently-item'));
    if (items.length > 1) {
      let i = 0;
      items[0].classList.add('is-active');
      const interval = REDUCED ? 99999 : 3600;
      setInterval(() => {
        const cur = items[i];
        cur.classList.remove('is-active');
        cur.classList.add('is-leaving');
        i = (i + 1) % items.length;
        const next = items[i];
        next.classList.add('is-active');
        setTimeout(() => cur.classList.remove('is-leaving'), 600);
      }, interval);
    } else if (items.length === 1) {
      items[0].classList.add('is-active');
    }
  }

  /* ============ SPARKLE PARTICLES on CTA click ============ */
  function sparkleBurst(x, y) {
    if (REDUCED) return;
    const colors = ['', 'is-coral', 'is-pink', 'is-violet', 'is-green'];
    const count = 10;
    for (let k = 0; k < count; k++) {
      const s = document.createElement('div');
      s.className = 'sparkle ' + colors[k % colors.length];
      s.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/></svg>';
      const angle = (Math.PI * 2 * k) / count + Math.random() * 0.5;
      const dist = 60 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      s.style.left = (x - 7) + 'px';
      s.style.top  = (y - 7) + 'px';
      s.style.transition = 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms ease';
      s.style.transform = 'translate(0,0) scale(0.4) rotate(0deg)';
      s.style.opacity = '1';
      document.body.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(${dx}px, ${dy}px) scale(${0.6 + Math.random()*0.8}) rotate(${Math.random()*360}deg)`;
        s.style.opacity = '0';
      });
      setTimeout(() => s.remove(), 900);
    }
  }
  document.querySelectorAll('[data-sparkle]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const r = el.getBoundingClientRect();
      sparkleBurst(r.left + r.width / 2, r.top + r.height / 2);
    });
  });

  /* ============ STATUS DOT EASTER EGG (5 clicks → rainbow + hint) ============ */
  const statusDots = document.querySelectorAll('.topbar .status-dot, .topbar-status');
  let dotClicks = 0;
  let dotTimer = null;
  function statusEgg() {
    document.body.classList.toggle('status-rainbow');
    showHint('★ rainbow mode unlocked', '<kbd>Esc</kbd> to switch off');
  }
  statusDots.forEach((d) => {
    d.style.cursor = 'pointer';
    d.addEventListener('click', () => {
      dotClicks += 1;
      clearTimeout(dotTimer);
      dotTimer = setTimeout(() => { dotClicks = 0; }, 1500);
      if (dotClicks >= 5) {
        dotClicks = 0;
        statusEgg();
      }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('status-rainbow')) {
      document.body.classList.remove('status-rainbow');
    }
  });

  /* ============ KBD HINT (small toast) ============ */
  let hintEl = null;
  function ensureHint() {
    if (hintEl) return hintEl;
    hintEl = document.createElement('div');
    hintEl.className = 'kbd-hint';
    document.body.appendChild(hintEl);
    return hintEl;
  }
  function showHint(html, footer) {
    const el = ensureHint();
    el.innerHTML = html + (footer ? '<span style="opacity:.6;margin-left:6px">' + footer + '</span>' : '');
    el.classList.add('is-shown');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('is-shown'), 2400);
  }

  /* ============ TYPE "HIRE" anywhere → confetti + scroll to contact ============ */
  let buf = '';
  document.addEventListener('keydown', (e) => {
    // ignore in inputs
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key && e.key.length === 1) {
      buf = (buf + e.key.toLowerCase()).slice(-6);
      if (buf.endsWith('hire')) {
        buf = '';
        confetti();
        showHint('★ thank you — let\'s talk', 'opening contact…');
        setTimeout(() => { window.location.href = 'contact.html'; }, 900);
      }
    }
  });

  /* ============ CONFETTI BURST ============ */
  function confetti() {
    if (REDUCED) return;
    const layer = document.createElement('div');
    layer.className = 'confetti';
    document.body.appendChild(layer);
    const colors = ['#f5d35c', '#e85d4d', '#6dd58c', '#4ea7d8', '#ff7eb6', '#b794f4'];
    const N = 80;
    for (let i = 0; i < N; i++) {
      const p = document.createElement('div');
      const c = colors[i % colors.length];
      p.style.position = 'absolute';
      p.style.width = (6 + Math.random() * 8) + 'px';
      p.style.height = (10 + Math.random() * 10) + 'px';
      p.style.background = c;
      p.style.borderRadius = '2px';
      p.style.left = (Math.random() * 100) + '%';
      p.style.top = '-20px';
      const x = (Math.random() - 0.5) * 200;
      const dur = 1400 + Math.random() * 1000;
      p.style.transition = `transform ${dur}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${dur}ms ease`;
      p.style.transform = 'translate(0,0) rotate(0deg)';
      layer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${x}px, 110vh) rotate(${Math.random()*720}deg)`;
        p.style.opacity = '0';
      });
    }
    setTimeout(() => layer.remove(), 2600);
  }

  // expose so other handlers can fire it
  window.__playful_confetti = confetti;

  /* ============ HOVER-CONFETTI on the spin-badge (subtle) ============ */
  const badge = document.querySelector('.spin-badge');
  if (badge) {
    badge.addEventListener('click', (e) => {
      const r = badge.getBoundingClientRect();
      sparkleBurst(r.left + r.width / 2, r.top + r.height / 2);
    });
  }
})();
