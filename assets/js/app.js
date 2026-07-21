/* ==========================================================================
   app.js — interaction layer, powered by Motion (the vanilla build of
   Framer Motion, motion.dev). Scroll reveals, hero line reveal, animated
   bars, magnetic button, subtle card tilt, nav + mobile menu.
   Lenis (loaded globally) drives smooth scroll. ES module.
   ========================================================================== */
import { animate, inView, stagger } from 'motion';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = window.matchMedia('(pointer: coarse)').matches;
const EASE = [0.22, 1, 0.36, 1];

/* ---------------- smooth scroll (Lenis) ---------------- */
function bootLenis() {
  if (REDUCED || !window.Lenis) return;
  const lenis = new window.Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.5 });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  window.__lenis = lenis;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -80 });
    });
  });
}

/* ---------------- topbar: scrolled + dark-over-hero ---------------- */
function bootTopbar() {
  const bar = document.querySelector('.topbar');
  if (!bar) return;
  const hero = document.querySelector('.hero');
  let threshold = hero ? hero.offsetHeight - 90 : 0;   // measured once, not per-scroll
  let ticking = false;
  const apply = () => {
    bar.classList.toggle('scrolled', window.scrollY > 24);
    if (hero) bar.classList.toggle('nav-dark', window.scrollY < threshold);
    ticking = false;
  };
  const on = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
  apply();
  window.addEventListener('scroll', on, { passive: true });
  window.addEventListener('resize', () => { if (hero) threshold = hero.offsetHeight - 90; apply(); }, { passive: true });
}

/* ---------------- active nav ---------------- */
function bootNav() {
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.getAttribute('data-nav') === here) { a.classList.add('is-active'); a.setAttribute('aria-current', 'page'); }
  });
}

/* ---------------- mobile menu ---------------- */
function bootMobile() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;
  const set = (open) => {
    toggle.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => set(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

/* ---------------- hero line reveal ---------------- */
function bootHeroTitle() {
  /* Hero title reveal is handled by a pure-CSS animation (see .hero-title .l > span
     in theme.css) so it can never get stuck hidden by a JS/Motion race. */
}

/* ---------------- scroll reveals ---------------- */
function bootReveals() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  if (REDUCED) { items.forEach((el) => el.classList.add('is-in')); return; }
  // give siblings inside the same container a cascade so cards enter in sequence
  items.forEach((el) => {
    if (el.dataset.revealDelay != null) return;
    const sibs = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'));
    const idx = sibs.indexOf(el);
    el.dataset.autoDelay = String(Math.min(idx, 6) * 0.07);
  });
  inView(items, (entry) => {
    const el = entry.target || entry;   // Motion v11 passes an IntersectionObserverEntry
    if (el.dataset.seen) return;
    el.dataset.seen = '1';
    const delay = parseFloat(el.getAttribute('data-reveal-delay') || el.dataset.autoDelay || '0');
    animate(el, { opacity: [0, 1], y: [34, 0], filter: ['blur(8px)', 'blur(0px)'] },
      { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] });
    el.classList.add('is-in');
  }, { amount: 0.15 });
}

/* ---------------- animated bars (confidence + skill) ---------------- */
function bootBars() {
  const bars = document.querySelectorAll('.conf-row .bar i, .skill-bar i');
  if (!bars.length) return;
  bars.forEach((bar) => {
    const w = (bar.style.getPropertyValue('--w') || bar.getAttribute('data-w') || '80%').trim();
    if (REDUCED) { bar.style.width = w; return; }
    inView(bar, () => {
      animate(bar, { width: ['0%', w] }, { duration: 1.2, ease: EASE });
    }, { amount: 0.6 });
  });
}

/* ---------------- magnetic buttons ---------------- */
function bootMagnetic() {
  if (REDUCED || COARSE) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const str = parseFloat(el.getAttribute('data-magnetic')) || 16;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      animate(el, { x: x * str, y: y * str }, { duration: 0.5, ease: EASE });
    });
    el.addEventListener('pointerleave', () => animate(el, { x: 0, y: 0 }, { type: 'spring', stiffness: 200, damping: 12 }));
  });
}

/* ---------------- subtle card tilt ---------------- */
function bootTilt() {
  if (REDUCED || COARSE) return;
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.getAttribute('data-tilt')) || 6;
    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      animate(el, { rotateY: px * max, rotateX: -py * max }, { duration: 0.4, ease: 'easeOut' });
    });
    el.addEventListener('pointerleave', () => animate(el, { rotateX: 0, rotateY: 0 }, { duration: 0.6, ease: EASE }));
  });
}

/* ---------------- pause off-screen CSS animations (perf) ---------------- */
function bootAnimPause() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-paused', !e.isIntersecting));
  }, { rootMargin: '140px' });
  document.querySelectorAll('.flow, .tape').forEach((el) => io.observe(el));
}

/* ---------------- scroll progress bar ---------------- */
function bootProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${pct.toFixed(4)})`;
    ticking = false;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* ---------------- scroll parallax ---------------- */
function bootParallax() {
  if (REDUCED) return;
  const els = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!els.length) return;
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;   // skip off-screen
      const off = (r.top + r.height / 2 - vh / 2) / vh;   // -1..1 across viewport
      const amt = parseFloat(el.getAttribute('data-parallax')) || 30;
      el.style.setProperty('--py', (-off * amt).toFixed(1) + 'px');
      el.style.setProperty('--py2', (-off * amt * 0.4).toFixed(1) + 'px');
    });
    ticking = false;
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* ---------------- contact form (mailto, no backend) ---------------- */
function bootContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const note = document.getElementById('cf-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) { if (note) note.textContent = 'Please fill in every field.'; return; }
    const subject = encodeURIComponent(`Portfolio enquiry — ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:mullapudi.gagankarthik@gmail.com?subject=${subject}&body=${body}`;
    if (note) note.textContent = 'Opening your email client…';
  });
}

/* ---------------- opening loader ---------------- */
function bootLoader() {
  const l = document.querySelector('.loader');
  if (!l) return;
  const hide = () => { if (l.dataset.done) return; l.dataset.done = '1'; l.classList.add('done'); setTimeout(() => l.remove(), 620); };
  if (document.readyState === 'complete') setTimeout(hide, 350);
  else window.addEventListener('load', () => setTimeout(hide, 300));
  setTimeout(hide, 2600); // hard fallback
}

/* ---------------- boot ---------------- */
function boot() {
  bootLoader();
  bootLenis(); bootTopbar(); bootNav(); bootMobile();
  bootHeroTitle(); bootReveals(); bootBars(); bootMagnetic(); bootTilt(); bootParallax(); bootAnimPause(); bootContactForm();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
