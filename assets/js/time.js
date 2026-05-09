/* ========================================================================
   time.js — live local time, updates every second
   Format: HH:MM:SS LOCAL
   ======================================================================== */

(function () {
  const targets = document.querySelectorAll('[data-live-time]');
  if (!targets.length) return;
  const zoneTargets = document.querySelectorAll('[data-live-zone]');

  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    const d = new Date();
    const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    targets.forEach((el) => {
      const showLabel = el.getAttribute('data-live-time') === 'label';
      el.textContent = showLabel ? `${time} LOCAL` : time;
    });
  }
  tick();
  setInterval(tick, 1000);

  if (zoneTargets.length) {
    let zone = 'LOCAL';
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'LOCAL';
    } catch (e) {}
    zoneTargets.forEach((el) => { el.textContent = zone; });
  }
})();
