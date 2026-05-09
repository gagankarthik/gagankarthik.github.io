/* ========================================================================
   work.js — project visual parallax + draw-in dividers
   ======================================================================== */

(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // draw-in dividers via IO
  const dio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-drawn');
        dio.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.project-divider').forEach((d) => dio.observe(d));

  if (REDUCED || !window.gsap || !window.ScrollTrigger) return;

  // parallax visuals
  document.querySelectorAll('.project-visual').forEach((v) => {
    gsap.to(v, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: v,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  });

  // sticky big number on each project (subtle x-translate as user scrolls)
  document.querySelectorAll('.project').forEach((p) => {
    const num = p.querySelector('.project-num');
    if (!num) return;
    gsap.fromTo(num,
      { x: -10, opacity: 0.6 },
      {
        x: 10, opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: p,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });
  });
})();
