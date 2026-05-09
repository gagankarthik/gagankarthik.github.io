# Gagan Karthik — Portfolio

Personal portfolio site. Static, multi-page, no build step.

> **Live:** <https://gagankarthik.github.io/>

---

## About me — at a glance

| | |
|---|---|
| **Name** | Gagan Karthik (Mullapudi Gagan Karthik) |
| **Role** | Full-Stack Engineer |
| **Focus** | HR-tech · workforce SaaS · vertical B2B |
| **Stack** | Next.js · TypeScript · React · AWS Amplify · Supabase · PostgreSQL · Python |
| **Education** | M.S. Computer Science (USA) |
| **Status** | Open to work · STEM-OPT, US-based |
| **Email** | mullapudi.gagankarthik@gmail.com |
| **Phone** | +1 (470) 898-5946 |
| **GitHub** | <https://github.com/gagankarthik> |
| **Linktree** | <https://linktr.ee/gagankarthik> |

---

## What's in here

```
portfolio/
├── index.html              Home (hero, currently rotator, work rail, principles)
├── work.html               Selected work (5 project case sections)
├── about.html              About + portrait
├── contact.html            Email + phone + socials + signature + clock
├── 404.html
├── sitemap.xml             SEO
├── robots.txt              SEO
├── .nojekyll               GitHub Pages: no Jekyll
├── assets/
│   ├── css/
│   │   ├── tokens.css      colors, type scale, motion
│   │   ├── reset.css
│   │   ├── base.css        global typography, grain, reduced-motion
│   │   ├── components.css  cursor, topbar, buttons, marquee, footer, transitions, skip-link
│   │   ├── responsive.css  breakpoints (360 / 480 / 768 / 1024 / 1280)
│   │   ├── playful.css     rainbow mode, doodles, stickers, hero mesh, parallax/tilt
│   │   └── pages/{home,work,about,contact}.css
│   ├── js/
│   │   ├── main.js         Lenis + GSAP boot, page transitions, active nav
│   │   ├── cursor.js       custom cursor, magnetic buttons
│   │   ├── reveal.js       Splitting + ScrollTrigger char reveals
│   │   ├── terminal.js     hero typewriter
│   │   ├── time.js         live local time
│   │   ├── nav.js          mobile menu
│   │   ├── playful.js      count-ups, currently rotator, parallax/tilt, rainbow toggle, sparkle, type-'hire'
│   │   └── pages/{work,about,contact}.js
│   ├── img/                portrait + drop project screenshots here
│   └── svg/                strike, signature
└── data/projects.json      single source of truth for the 5 projects
```

---

## Quick edit map

| What you want to change | File |
|---|---|
| Hero headline / sub / CTAs | `index.html` (hero section) |
| Hero terminal lines (`profile.json`) | `assets/js/terminal.js` |
| The 5 projects (titles, taglines, GitHub URLs) | `index.html`, `work.html`, `data/projects.json` |
| About story / strengths / weaknesses / "Things I love" | `about.html` |
| Email, phone, social links | `contact.html` (and footers in every `*.html`) |
| Topbar status text | search `OPEN TO WORK · STEM OPT` across all `*.html` |
| Colors, fonts, spacing | `assets/css/tokens.css` |
| Type scale (per breakpoint) | `assets/css/responsive.css` + `pages/*.css` |
| Replace portrait | `assets/img/about-portrait.png` |

---

## Things I left for later

- [ ] Drop 5 project screenshots into `assets/img/` (HR-management, FirstShift, ClockDeck, OceanBlue, OB-Resume) — then swap each `<div class="project-visual" style="--gradient: …">` in `work.html` for `<div class="project-visual"><img src="…" alt="…" loading="lazy"/></div>`.
- [ ] Add real LinkedIn URL in `contact.html` (currently `#`).
- [ ] Add real Twitter / X URL in `contact.html` (currently `#`).
- [ ] Replace the favicon — currently the about-portrait acts as one. Drop a 32×32 + 180×180 set into `assets/img/` and update `<link rel="icon">` and `<link rel="apple-touch-icon">` in each page's `<head>`.
- [ ] Replace OG image with a proper 1200×630 share card. Currently the portrait is used.

---

## Tech & dependencies (CDN, no install)

- **Fonts:** Fraunces (serif), JetBrains Mono, Inter — Google Fonts
- **Smooth scroll:** [Lenis](https://github.com/darkroomengineering/lenis) `1.1.13`
- **Animations:** [GSAP](https://gsap.com) `3.12.5` + ScrollTrigger
- **Char splitting:** [Splitting.js](https://splitting.js.org) `1.x`

---

## Easter eggs

- Click the green status dot **5 times** → unlocks **Rainbow mode** (cycling colors site-wide). Press `Esc` to exit.
- Type **`hire`** anywhere on the site → confetti + auto-jumps to contact.
- Click the **primary CTA** (See my work →) → sparkle burst.
- Click the **spinning AVAILABLE FOR HIRE badge** → sparkle burst, opens contact.

---

## Accessibility notes

- WCAG 2.1 **AA color contrast** across body and label text on the dark theme.
- `prefers-reduced-motion` disables Lenis, GSAP scroll reveals, the typewriter, the custom cursor, parallax / tilt, page transitions, and rainbow animation (it falls back to a 200 ms fade between pages).
- `prefers-contrast: more` boosts dim/muted text further.
- "Skip to content" link surfaces on Tab — first focusable element.
- `aria-current="page"` set on the active nav link.
- Custom cursor and magnetic / parallax effects auto-disable on touch & coarse pointers.
- All decorative SVGs are `aria-hidden`. Functional SVGs (logo links, badges) carry `aria-label`.
- Time display uses `aria-live="off"` so screen readers don't announce every second.
- Mobile menu is keyboard-navigable; ESC closes it.

## SEO notes

- Per-page canonical, `og:image`, Twitter card.
- JSON-LD: `Person` + `WebSite` on home, `CollectionPage` + `ItemList` on work, `AboutPage` on about, `ContactPage` + `ContactPoint` on contact.
- `sitemap.xml` and `robots.txt` at the repo root.
- Semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<section>`).

## Tone

The copy throughout is in my voice — short, direct, no fluff, with deliberate contrast between editorial seriousness ("The Pattern", project case sections) and playful asides (the "type `hire`" hint, the rainbow easter egg, the "psst" microcopy under the principles grid). When you edit content, keep that contrast.
