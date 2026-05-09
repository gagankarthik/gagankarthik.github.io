/* ========================================================================
   reveal.js — heading char-reveal via Splitting + GSAP, generic .reveal-fade
   ======================================================================== */

(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // simple .reveal-fade (no GSAP needed)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal-fade').forEach((el) => io.observe(el));

  if (REDUCED) {
    document.querySelectorAll('[data-split]').forEach((el) => el.classList.add('is-in'));
    return;
  }
  if (!window.gsap || !window.ScrollTrigger || !window.Splitting) return;

  // split + animate every [data-split]
  document.querySelectorAll('[data-split]').forEach((el) => {
    const mode = el.getAttribute('data-split') || 'chars';
    let parts = [];
    try {
      const result = Splitting({ target: el, by: mode === 'lines' ? 'lines' : 'chars' });
      if (mode === 'lines') {
        parts = result[0].lines.flat();
      } else {
        parts = result[0].chars;
      }
    } catch (e) { return; }

    parts.forEach((c) => { c.style.display = 'inline-block'; c.style.willChange = 'transform, opacity'; });

    gsap.fromTo(parts,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        ease: 'expo.out',
        duration: 1.0,
        stagger: 0.022,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
  });

  // generic reveal-stagger groups
  document.querySelectorAll('[data-stagger]').forEach((el) => {
    const items = el.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;
    gsap.fromTo(items,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
  });
})();
