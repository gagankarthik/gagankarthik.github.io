/* ========================================================================
   home.js — interactive bits for index.html (light, restrained)
   - Count-up for [data-count]
   - Magnetic effect for [data-magnetic]
   - Hero load reveal (cooperates with Splitting + reveal.js)
   ======================================================================== */

(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH   = matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------- COUNT-UP ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const suffix = el.getAttribute('data-count-suffix') || '';
        const dur = REDUCED ? 0 : 1200;
        const t0 = performance.now();
        function step(now) {
          const t = Math.min(1, (now - t0) / Math.max(1, dur));
          const eased = 1 - Math.pow(1 - t, 3);
          const v = Math.round(target * eased);
          el.firstChild ? (el.firstChild.nodeValue = String(v)) : (el.textContent = String(v));
          if (suffix && !el.querySelector('.x')) {
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
          el.textContent = '0';
          requestAnimationFrame(step);
        }
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------------- MAGNETIC BUTTONS ---------------- */
  if (!REDUCED && !TOUCH) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.getAttribute('data-magnetic')) || 18;
      let raf = null;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---------------- HERO LOAD REVEAL ---------------- */
  /* reveal.js animates [data-split] on scroll-trigger; for hero, it sits in viewport
     on load so it fires immediately. We additionally fade in the eyebrow / sub / ctas
     in sequence for a deliberate entry. */
  const hero = document.querySelector('.hero');
  if (hero && !REDUCED) {
    const seq = hero.querySelectorAll('[data-load-seq]');
    if (window.gsap) {
      gsap.from(seq, {
        y: 18, opacity: 0, duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.15,
      });
    }
  }

  /* ---------------- SECTION NUM INDICATOR ---------------- */
  /* Update a top-of-page section marker as user scrolls between major sections */
  const sections = Array.from(document.querySelectorAll('[data-section-num]'));
  const indicator = document.querySelector('[data-section-indicator]');
  if (sections.length && indicator) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
          const num = entry.target.getAttribute('data-section-num');
          const label = entry.target.getAttribute('data-section-label') || '';
          indicator.querySelector('[data-section-num-val]').textContent = num;
          indicator.querySelector('[data-section-label-val]').textContent = label;
        }
      });
    }, { threshold: [0.35, 0.6] });
    sections.forEach((s) => io.observe(s));
  }

})();
