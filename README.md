# Pinava

A dependency-free, performance-focused frontend portfolio built with semantic HTML, modern CSS, and vanilla JavaScript — no framework, no build step, no runtime dependencies.

[Live Site](https://pinava.vercel.app/) · [Repository](https://github.com/bassim-ghaly-14/pinava)

## Overview

Pinava is the personal portfolio of Bassim Ghaly, a frontend developer. The entire site is a single static HTML document plus four CSS layers and two deferred JavaScript files. Project content lives in its own data file (`js/projects.js`) and is rendered into static mount points at load — the markup itself works without JavaScript (`<noscript>` fallback included), and no content is fetched as runtime partials, a deliberate choice to protect FCP/LCP, SEO, and no-JS behavior.

## Features

- Static hero with availability indicator, CTA buttons, CV actions (view in a new tab / native download), and a hand-tokenized "portfolio.ts" code editor with blinking caret (decorative, `aria-hidden`)
- Desktop projects registry: sidebar project menu driving an animated "glass presenter" card
- Mobile projects grid (≤1024px) replacing the desktop split layout
- Accessible project viewer modal with live preview, case studies, and iframe fallback
- Lazy-loaded live previews — the iframe receives a `src` only when the viewer is opened
- Optional per-project case studies (challenge, approach, key decisions) rendered safely and hidden entirely when absent
- "How I Build" process section, grouped Tech Stack, About, and Contact sections (all static)
- Scroll-reveal animations and nav active-state highlighting via `IntersectionObserver`
- Self-hosted font (La Belle Aurore, latin subset), full SEO metadata, JSON-LD, `robots.txt`, and `sitemap.xml`
- Self-contained custom 404 page (zero JS, inline styles, `noindex`)

## Architecture

```
index.html      Single static document: all sections + viewer modal markup
css/            4-layer cascade, loaded in order
js/projects.js  Project dataset (pure data, no DOM code)
js/app.js       Controller: rendering, modal, iframe lifecycle, observers
```

- **No framework, no build step.** The portfolio has no application-level runtime complexity, so a framework would add tooling and bundle cost without benefit. Everything is plain, auditable source served as-is.
- **Data separation.** All project content (titles, descriptions, tech stacks, links, case studies) lives in `js/projects.js`; `app.js` renders it into mount points (`#geometricMenu`, `#glassPresenter`, `#mobileGrid`) that must exist before the deferred scripts run.
- **Modal-first viewer.** `app.js` binds directly to the static `#projectViewer` dialog markup: focus trap, Escape handling, focus restoration to the trigger element, body scroll lock (`modal-open` class), iframe lifecycle management, and cleanup (clearing handlers, resetting `src` to `about:blank` on close).
- **Iframe reliability.** Previews are sandboxed (`allow-scripts allow-same-origin allow-forms allow-popups`) with `referrerpolicy="no-referrer"` and a one-shot 12-second load timeout: if no `load` event fires (site blocks embedding via `X-Frame-Options`/CSP), a fallback panel with a direct "Open Live Site" link is shown. The external link is always available regardless.
- **Safe rendering.** Case studies are built with DOM APIs and `textContent` only — no project data passes through `innerHTML` — and favicon images have an on-error fallback to the site favicon.

## Project Structure

```
pinava/
├── index.html              # Single page: all sections, SEO head, JSON-LD, viewer modal
├── 404.html                # Self-contained branded 404 (no JS, noindex)
├── robots.txt              # Crawler policy + sitemap reference
├── sitemap.xml             # Single-URL sitemap
├── css/
│   ├── base.css            # Design tokens, reset, @font-face, a11y, reveal/motion, scrollbar
│   ├── layout.css          # Header/nav, hero (+ editor), section headers, buttons
│   ├── sections.css        # Projects showcase, About, How I Build, Stack, Contact, Footer, viewer modal
│   └── responsive.css      # 1024px / 768px / 480px / 320px overrides
├── js/
│   ├── app.js              # Rendering, modal/iframe lifecycle, observers, a11y behavior
│   └── projects.js         # Project dataset (descriptions, stacks, links, case studies)
├── assets/
│   ├── favicon.svg
│   ├── fonts/
│   │   └── la-belle-aurore-latin.woff2   # Self-hosted signature font
│   └── projects/           # Per-project favicon SVGs (pineup, trado, sky-weather, pine-notes, rotix)
├── cv/
│   └── cv.pdf
└── README.md
```

## Tech Stack

**Pinava itself** uses only:

- Semantic HTML5 (`header`/`main`/`section`/`footer`/`nav` landmarks, `aria-*` attributes)
- CSS3 — custom properties, `clamp()`, flexbox, grid, `backdrop-filter`, `@font-face`, media queries, `prefers-reduced-motion`
- Vanilla JavaScript (ES6+, deferred scripts, `IntersectionObserver`, timer-based iframe lifecycle management)
- Self-hosted SVG and WOFF2 assets

**Featured projects** (the portfolio's content) are built with React, Next.js, TypeScript, TanStack Query, and more — but Pinava itself does not use any of them. There is no framework, package manager, or backend in this repository.

## Projects

All five projects are defined in `js/projects.js`. Featured projects appear in the desktop registry; the full set renders as cards on mobile.

| Project        | Type                 | Stack                                                                   | Live                                                      | Source                                                    |
| -------------- | -------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| PineUp Network | Fullstack (featured) | Next.js, React 19, TypeScript, TanStack Query, MUI, Tailwind, WebSocket | [pineup.vercel.app](https://pineup.vercel.app/)           | [GitHub](https://github.com/bassim-ghaly-14/pineup)       |
| TRADO Store    | Frontend (featured)  | React 19, Vite, TanStack Query, React Router, Tailwind, Formik, Stripe  | [trado-green.vercel.app](https://trado-green.vercel.app/) | [GitHub](https://github.com/bassim-ghaly-14/route-course) |
| SKY Weather    | Frontend (featured)  | HTML5, CSS3, ES Modules, OpenWeatherMap API, Vercel Serverless          | [sky-pple.vercel.app](https://sky-pple.vercel.app/)       | [GitHub](https://github.com/bassim-ghaly-14/sky)          |
| Pine Notes     | Frontend (featured)  | HTML5, CSS3, JavaScript, ES Modules, LocalStorage, Markdown             | [pine-notes.vercel.app](https://pine-notes.vercel.app/)   | [GitHub](https://github.com/bassim-ghaly-14/pine-notes)   |
| ROTIX Puzzle   | Game                 | HTML5, CSS3, JavaScript, ES Modules, Web Audio API, Vibration API, i18n | [rotix-game.vercel.app](https://rotix-game.vercel.app/)   | [GitHub](https://github.com/bassim-ghaly-14/rotix)        |

Each project includes a `caseStudy` object (challenge, approach, key decisions) rendered inside the viewer when present.

## Accessibility

Accessibility-focused implementation, verified in source:

- Semantic landmarks and heading hierarchy; all sections use `aria-labelledby`
- Skip link to `#main-content`
- Dialog semantics on the viewer (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)
- Full keyboard support: focus trap inside the open viewer, Escape to close, click-outside to close, focus restored to the triggering element on close
- Global `:focus-visible` outline styling
- Decorative elements marked `aria-hidden="true"`; iframe has a dynamic, per-project `title`
- `aria-pressed` state on project menu buttons; `aria-label` on icon-only links and the mobile project cards
- `prefers-reduced-motion: reduce` support disabling transitions/animations (site and 404 page)
- `<noscript>` fallback message in the projects section

## Performance

- **No build step, no bundle** — source files are served as authored
- **Lazy iframe loading** — the preview iframe gets a `src` only when a project is opened; on close, handlers are cleared and the iframe is reset to `about:blank` to release resources
- **Deferred scripts** — both JS files load with `defer`; all static content renders without JavaScript
- **IntersectionObserver** for reveal animations and nav state (with a show-all fallback when unsupported)
- **Self-hosted font** with `font-display: swap`, latin subset only
- **Mobile GPU cost reduction** — `backdrop-filter` is removed and replaced with a solid background on stacked cards below 1024px
- **Transform/opacity-based transitions** for reveals and hover states

## SEO

- Descriptive `<title>` and meta description; `lang="en"` and explicit `dir="ltr"`
- Canonical URL (`https://pinava.vercel.app/`)
- Open Graph and Twitter Card metadata (`summary` card)
- JSON-LD structured data (`Person` + `WebSite` in a `@graph`)
- `robots.txt` (allow all + sitemap reference) and a single-URL `sitemap.xml`
- 404 page is `noindex` and excluded from the sitemap

Note: the current `og:image`/`twitter:image` reference an SVG (`/assets/favicon.svg`). Some crawlers don't support SVG preview images; a raster 1200×630 image is a known improvement (see below).

## Responsive Design

Breakpoints (defined in `css/responsive.css` plus a desktop-only `min-width: 1025px` block in `layout.css`):

- **>1024px** — desktop split layout: sidebar project registry + glass presenter
- **≤1024px** — desktop showcase hidden; mobile project card grid shown; two-column process grid; `backdrop-filter` disabled
- **≤768px** — viewer becomes a near-fullscreen column layout; contact CTA and about list stack
- **≤480px** — single-column grids (process, stack, mobile grid, contact); hero and CV action buttons go full-width
- **≤320px** — reduced title sizes; brand text hidden (logo only)

## Getting Started

No package installation, build step, or environment variables are required — the repository contains no `package.json` and no dependencies.

```bash
# Option 1: open directly
open index.html

# Option 2: any static server
python3 -m http.server 8080
# then visit http://localhost:8080
```

A local server is recommended if you want behavior identical to production hosting, but the site works when `index.html` is opened directly.

## Deployment

The site is deployed on **Vercel** as a fully static project (`https://pinava.vercel.app/`):

- No build command, output directory configuration, or CI pipeline is needed — static files are served as-is
- `404.html` is served automatically for unmatched routes
- The canonical domain is referenced in `robots.txt`, `sitemap.xml`, the canonical tag, Open Graph, and JSON-LD; update it in those places if migrating domains

## Design Philosophy

- **Deliberately static.** All content is real markup in one document — content is visible without JavaScript, crawlable, and fast by construction.
- **Data-driven where it counts.** Project content is separated from logic, so adding a project means adding one object to `projects.js`.
- **Dark editorial identity.** Black background with gold gradient accents, glass cards, and a handwritten signature font used sparingly for personality.
- **Honest engineering.** Iframe embedding failures, missing favicons, missing case studies, and disabled JavaScript all have explicit, verified fallback paths.

## Browser Support

Built and documented against modern evergreen browsers (Chrome, Edge, Firefox, Safari). JavaScript degrades gracefully: without `IntersectionObserver` all reveal content is shown immediately, and without JavaScript the site remains readable with a `<noscript>` notice in the projects section. No legacy-browser testing has been performed.

## Known Improvements

- Replace the SVG Open Graph image with a raster 1200×630 PNG/JPG
- Replace `cv/cv.pdf` with the final CV version when ready

## License

No license file is currently included in the repository.
