/* ========================================================================
   contact.js — click-to-copy email + clock
   ======================================================================== */

(function () {
  const block = document.querySelector('.email-block');
  const link  = block ? block.querySelector('.email-link') : null;
  const tip   = block ? block.querySelector('.copy-tip') : null;

  if (block && link) {
    const email = link.getAttribute('data-email') || link.textContent.trim();
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(email);
        block.classList.add('is-copied');
        if (tip) tip.textContent = 'Copied!';
        setTimeout(() => {
          block.classList.remove('is-copied');
          if (tip) tip.textContent = 'Click to copy';
        }, 1600);
      } catch (err) {
        // fallback: open mail client
        window.location.href = 'mailto:' + email;
      }
    });
  }

  // clock
  const clockTime = document.querySelector('[data-clock-time]');
  const clockZone = document.querySelector('[data-clock-zone]');
  if (clockTime) {
    const pad = (n) => String(n).padStart(2, '0');
    function tick() {
      const d = new Date();
      clockTime.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
    tick();
    setInterval(tick, 1000);
    if (clockZone) {
      try { clockZone.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
    }
  }
})();
