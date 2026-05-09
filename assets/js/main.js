/* ========================================================================
   main.js — boots Lenis + GSAP + ScrollTrigger, page transitions, topbar
   Loaded as a module; depends on Lenis, gsap, ScrollTrigger from CDN.
   ======================================================================== */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Register GSAP plugins (idempotent)
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------- Lenis smooth scroll --------------------------
let lenis = null;
function bootLenis() {
  if (REDUCED) return;
  if (!window.Lenis) return;
  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  window.__lenis = lenis;
}

// -------------------------- Topbar scrolled state --------------------------
function bootTopbar() {
  const bar = document.querySelector('.topbar');
  if (!bar) return;
  const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (lenis) lenis.on('scroll', onScroll);
}

// -------------------------- Active nav link --------------------------
function bootActiveNav() {
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const norm = here === '' ? 'index.html' : here;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const target = a.getAttribute('data-nav');
    if (target === norm || (norm === 'index.html' && target === 'index.html')) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });
}

// -------------------------- Page transition --------------------------
/* Click on internal nav -> overlay slides up to cover -> navigate.
   On the new page, an overlay element sits in DOM at full cover and slides up off-top on load. */

function bootPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  // entrance: synchronous head-script set html.pt-incoming if we arrived from a transition.
  if (document.documentElement.classList.contains('pt-incoming')) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        // remove the snap-class AND add uncovering in the same frame
        overlay.classList.add('is-uncovering');
        document.documentElement.classList.remove('pt-incoming');
        setTimeout(() => overlay.classList.remove('is-uncovering'), 720);
      }, 100);
    });
    sessionStorage.removeItem('pt:incoming');
  }

  // intercept internal links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (a.target === '_blank') return;
    if (a.hasAttribute('data-no-transition')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // only intercept same-origin html nav
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;
    if (!/\.html?$/.test(url.pathname) && url.pathname !== '/') return;
    // also skip if same page no hash
    if (url.pathname === location.pathname) return;

    e.preventDefault();
    if (REDUCED) {
      // simple fade
      document.body.style.transition = 'opacity 200ms ease';
      document.body.style.opacity = '0';
      setTimeout(() => { location.href = url.href; }, 220);
      return;
    }
    overlay.classList.add('is-covering');
    sessionStorage.setItem('pt:incoming', '1');
    setTimeout(() => { location.href = url.href; }, 580);
  });

  // restore opacity if user navigates back via bfcache
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      overlay.classList.remove('is-covering', 'is-uncovering');
      document.body.style.opacity = '1';
    }
  });
}

// -------------------------- Boot --------------------------
document.addEventListener('DOMContentLoaded', () => {
  bootLenis();
  bootTopbar();
  bootActiveNav();
  bootPageTransitions();
});
