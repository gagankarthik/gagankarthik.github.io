/* ========================================================================
   about.js — horizontal scroll wheel-translation for the loves rail
   ======================================================================== */

(function () {
  const rail = document.querySelector('.loves-rail');
  if (!rail) return;
  // map vertical wheel to horizontal scroll for desktop (when fully visible)
  let inside = false;
  rail.addEventListener('mouseenter', () => { inside = true; });
  rail.addEventListener('mouseleave', () => { inside = false; });
  window.addEventListener('wheel', (e) => {
    if (!inside) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4 && e.deltaY > 0) return;
    if (rail.scrollLeft <= 0 && e.deltaY < 0) return;
    rail.scrollLeft += e.deltaY;
    e.preventDefault();
  }, { passive: false });
})();
