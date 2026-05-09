/* ========================================================================
   terminal.js — character-by-character typewriter for hero terminal
   Lines mirror the existing site's profile.json. Looping cursor at end.
   ======================================================================== */

(function () {
  const term = document.getElementById('term');
  if (!term) return;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Each line is a sequence of "tokens" — { text, cls } so colors render correctly.
  const LINES = [
    { tokens: [ { text: '$ whoami', cls: 'term-cmd' } ], prompt: true, after: 320 },
    { tokens: [ { text: 'gagan_karthik', cls: 'term-out' } ], prompt: false, after: 220 },
    { tokens: [ { text: '$ cat profile.json', cls: 'term-cmd' } ], prompt: true, after: 480 },
    { tokens: [ { text: '{', cls: 'term-out' } ], prompt: false, after: 160 },
    { tokens: [
        { text: '  ' },
        { text: '"name"', cls: 'term-key' },
        { text: ': ' },
        { text: '"Gagan Karthik"', cls: 'term-val' },
        { text: ',' },
      ], prompt: false, after: 100 },
    { tokens: [
        { text: '  ' },
        { text: '"role"', cls: 'term-key' },
        { text: ': ' },
        { text: '"Full-Stack Engineer"', cls: 'term-val' },
        { text: ',' },
      ], prompt: false, after: 100 },
    { tokens: [
        { text: '  ' },
        { text: '"focus"', cls: 'term-key' },
        { text: ': ' },
        { text: '"HR + Workforce Tools"', cls: 'term-val' },
        { text: ',' },
      ], prompt: false, after: 100 },
    { tokens: [
        { text: '  ' },
        { text: '"stack"', cls: 'term-key' },
        { text: ': [' },
        { text: '"Next.js"', cls: 'term-val' },
        { text: ', ' },
        { text: '"TypeScript"', cls: 'term-val' },
        { text: ', ' },
        { text: '"AWS"', cls: 'term-val' },
        { text: '],' },
      ], prompt: false, after: 100 },
    { tokens: [
        { text: '  ' },
        { text: '"status"', cls: 'term-key' },
        { text: ': ' },
        { text: '"open_to_work"', cls: 'term-val' },
        { text: ',' },
      ], prompt: false, after: 100 },
    { tokens: [
        { text: '  ' },
        { text: '"availability"', cls: 'term-key' },
        { text: ': ' },
        { text: '"immediate"', cls: 'term-val' },
        { text: ',' },
      ], prompt: false, after: 100 },
    { tokens: [
        { text: '  ' },
        { text: '"superpower"', cls: 'term-key' },
        { text: ': ' },
        { text: '"ships_fast_with_AI"', cls: 'term-val' },
      ], prompt: false, after: 220 },
    { tokens: [ { text: '}', cls: 'term-out' } ], prompt: false, after: 320 },
  ];

  // helpers
  function makeLineEl(prompt) {
    const line = document.createElement('span');
    line.className = 'term-line';
    if (prompt) {
      const p = document.createElement('span');
      p.className = 'term-prompt';
      p.textContent = '› ';
      line.appendChild(p);
    } else {
      // indent placeholder so lines align with `term-out`
      line.classList.add('is-out');
    }
    term.appendChild(line);
    return line;
  }

  function appendCursor(line) {
    const c = document.createElement('span');
    c.className = 'term-cursor';
    line.appendChild(c);
    return c;
  }

  if (REDUCED) {
    // dump everything instantly
    LINES.forEach((line) => {
      const el = makeLineEl(line.prompt);
      line.tokens.forEach((tok) => {
        const span = document.createElement('span');
        if (tok.cls) span.className = tok.cls;
        span.textContent = tok.text.replace(/^\$ /, '');
        el.appendChild(span);
      });
    });
    const finalLine = makeLineEl(true);
    appendCursor(finalLine);
    return;
  }

  let li = 0;
  function nextLine() {
    if (li >= LINES.length) {
      const finalLine = makeLineEl(true);
      appendCursor(finalLine);
      return;
    }
    const def = LINES[li++];
    const lineEl = makeLineEl(def.prompt);
    const cursor = appendCursor(lineEl);

    // flatten tokens into typeable steps (char-by-char per token)
    const steps = [];
    def.tokens.forEach((tok) => {
      const cleanText = tok.text.replace(/^\$ /, '');
      const span = document.createElement('span');
      if (tok.cls) span.className = tok.cls;
      lineEl.insertBefore(span, cursor);
      // type chars
      for (let i = 0; i < cleanText.length; i++) {
        steps.push({ span, ch: cleanText[i] });
      }
    });

    let si = 0;
    function step() {
      if (si >= steps.length) {
        // remove the in-line cursor (only final line keeps one)
        cursor.remove();
        setTimeout(nextLine, def.after);
        return;
      }
      const s = steps[si++];
      s.span.appendChild(document.createTextNode(s.ch));
      // slight randomness for natural typing
      setTimeout(step, 14 + Math.random() * 26);
    }
    step();
  }

  setTimeout(nextLine, 600);
})();
