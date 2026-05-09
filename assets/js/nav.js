/* ========================================================================
   nav.js — mobile menu toggle + esc close
   ======================================================================== */

(function () {
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-menu');
  if (!toggle || !drawer) return;

  function open() {
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function close() {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }
  toggle.addEventListener('click', () => {
    document.body.classList.contains('menu-open') ? close() : open();
  });
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setTimeout(close, 80)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) close();
  });
})();
