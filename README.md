# Gagan Karthik — Portfolio

Personal portfolio for Gagan Karthik, full-stack engineer building HR & workforce tools. Static, multi-page, no build step.

```
portfolio/
├── index.html              Home
├── work.html               Selected work
├── about.html              About
├── contact.html            Contact
├── 404.html
├── .nojekyll               GitHub Pages: don't run Jekyll
├── README.md
├── assets/
│   ├── css/
│   │   ├── tokens.css      colors, type, motion vars
│   │   ├── reset.css
│   │   ├── base.css        global typography, grain, reduced-motion
│   │   ├── components.css  cursor, topbar, buttons, marquee, footer, transitions
│   │   ├── responsive.css  breakpoints
│   │   └── pages/
│   │       ├── home.css
│   │       ├── work.css
│   │       ├── about.css
│   │       └── contact.css
│   ├── js/
│   │   ├── main.js         Lenis + GSAP boot, page transitions, topbar
│   │   ├── cursor.js       custom cursor, magnetic buttons
│   │   ├── reveal.js       Splitting + GSAP scroll reveals
│   │   ├── terminal.js     hero typewriter
│   │   ├── time.js         live local clock
│   │   ├── nav.js          mobile menu
│   │   └── pages/
│   │       ├── work.js
│   │       ├── about.js
│   │       └── contact.js
│   ├── img/                drop screenshots here (see img/README.txt)
│   └── svg/
│       ├── strike.svg
│       └── signature.svg
└── data/
    └── projects.json       single source of truth for the 5 projects
```

---

## Run locally

The site is plain HTML/CSS/JS with CDN dependencies (Lenis, GSAP, Splitting). No build step.

**Easiest:**

```powershell
# from C:\Users\gagan\Desktop\Projects\portfolio
python -m http.server 8000
```

Then open <http://localhost:8000>.

If you don't have Python:

```powershell
npx serve .
```

You can also just double-click `index.html` — most things work, but custom fonts and the JS modules will load best from a real server.

---

## Deploy to GitHub Pages — exact clicks

1. **Create a repo on GitHub.** Name it whatever you want (e.g. `portfolio`).
2. From this folder, run:
   ```powershell
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/gagankarthik/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: open the repo → **Settings** (top-right tabs) → **Pages** (left sidebar).
4. Under **Build and deployment**:
   - **Source:** *Deploy from a branch*
   - **Branch:** *main*  /  folder: */ (root)*
   - Click **Save**.
5. Wait 30–60 seconds. The page will refresh with a green banner: *"Your site is live at https://gagankarthik.github.io/<repo-name>/"*.
6. The included `.nojekyll` file ensures GH Pages serves files starting with underscores or dots correctly.

**Want a custom domain?** In the same Pages settings, fill in *Custom domain* and follow GitHub's CNAME instructions.

---

## Update content

Most edits happen in three places:

| What you want to change                | File                                 |
| -------------------------------------- | ------------------------------------ |
| Hero headline, sub, CTAs               | `index.html` (lines ~85–105)         |
| Hero terminal lines (`profile.json`)   | `assets/js/terminal.js`              |
| The Pattern paragraphs / quote / stats | `index.html` (Section 01)            |
| The 5 projects shown on Home + Work    | `data/projects.json` (and the corresponding HTML markup in `index.html` and `work.html`) |
| About story, strengths, weaknesses     | `about.html`                         |
| Email, phone, social links             | `contact.html` + every footer        |
| Status text in topbar                  | search for `OPEN TO WORK` across all `*.html` |
| Colors, fonts, spacing                 | `assets/css/tokens.css`              |

The `data/projects.json` file is the single source of truth for project metadata. The HTML currently hard-codes the same content for SEO + zero-JS-fallback reasons. If you update one, update both — or migrate the cards to JS-rendered if you prefer one place.

---

## Replace before going live

Drop these in over the placeholders:

- [ ] **`assets/img/about-portrait.jpg`** — your portrait. Then in `about.html` replace the `<div class="photo-frame">` placeholder with `<img src="assets/img/about-portrait.jpg" alt="Gagan Karthik portrait" />`.
- [ ] **Project screenshots** — 5 images in `assets/img/`. In `work.html`, swap each `<div class="project-visual" style="--gradient: …">` block with `<div class="project-visual"><img src="assets/img/<project>.jpg" alt="<project> screenshot" loading="lazy"/></div>` (and remove the gradient inline-style if you do).
- [ ] **LinkedIn URL** — currently `href="#"` in `contact.html` (search `LinkedIn`). Replace with `https://www.linkedin.com/in/...`.
- [ ] **Twitter/X URL** — currently `href="#"` in `contact.html` (search `Twitter / X`). Replace or remove the column.
- [ ] **Linktree URL** — already set to `linktr.ee/gagankarthik`. Verify it's right.
- [ ] **OG image** (optional) — add `<meta property="og:image" content="..."/>` to each page's `<head>` once you have a 1200×630 share image.
- [ ] **Sentence "Gagan Karthik · February 2026"** in `about.html` — update if the year ticks over.

---

## Tech / dependencies (CDN, no install)

- **Fonts:** Fraunces (serif), JetBrains Mono, Inter — Google Fonts
- **Smooth scroll:** [Lenis](https://github.com/darkroomengineering/lenis) `1.1.13`
- **Animations:** [GSAP](https://gsap.com) `3.12.5` + ScrollTrigger
- **Char splitting:** [Splitting.js](https://splitting.js.org) `1.x`

All loaded via `unpkg.com`. If you'd rather self-host, download the files into `assets/vendor/` and update the four `<script src="https://unpkg.com/...">` lines per HTML page.

## Accessibility & motion

- `prefers-reduced-motion` disables Lenis, GSAP scroll reveals, the typewriter, the custom cursor, and the page-transition wipe (it falls back to a 200 ms fade).
- Custom cursor disables itself on touch / coarse pointers.
- All images have `alt` attributes (the placeholders use empty/`aria-hidden` spans because they're decorative).
- Mobile menu is keyboard-navigable; ESC closes it.

## Notes I left for myself

- The page transition is "best-effort": amber panel slides up to cover, browser navigates, panel slides up off-top on the new page. There's a brief flicker on slow networks; that's a fundamental limitation of multi-page navigation without a SPA router. Acceptable trade-off for a static site.
- The "How I work" section uses an *asymmetric* 2×2 grid — cards are intentionally offset by 12–28 px on desktop. If it feels off after content edits, tweak `.principle:nth-child(...)` translateY values in `pages/home.css`.
- `data-stagger` and `data-stagger-item` give you reusable scroll-staggered groups. Wrap a group with `data-stagger` and tag children with `data-stagger-item`.
- `data-cursor-label="..."` overrides the cursor ring's label text on hover. Useful for "visit ↗" vs "open →".
- `data-magnetic` makes a button pull toward the cursor within 80 px.
- `data-no-transition` on a link skips the page-transition overlay (useful for placeholder `#` links).
