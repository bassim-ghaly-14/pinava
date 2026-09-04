# Pinava — Frontend Developer Portfolio

Pinava is a lightweight personal portfolio for a frontend developer. It is built with plain HTML, CSS, and JavaScript. No framework, no build step, no dependencies.

## Features

- Personal hero section with core tech stack and CV download
- Selected work section with desktop split layout and mobile responsive cards
- Project viewer modal with keyboard accessibility and graceful iframe fallback
- Lazy iframe loading — live previews only load when the viewer is opened
- Skip link, focus management, focus trap, and semantic structure
- Self-hosted font (latin subset), SEO metadata, Open Graph, and JSON-LD
- `robots.txt` and `sitemap.xml`
- Responsive from 320px up to 1920px+, with reduced mobile backdrop-filter cost

## Project Architecture

```
pinava/
├── index.html              # Semantic page structure, SEO metadata, JSON-LD
├── robots.txt              # Crawler policy + sitemap reference
├── sitemap.xml             # Single-page sitemap
├── css/
│   └── styles.css          # Design tokens, layout, responsive rules, @font-face
├── js/
│   ├── app.js              # App controller, modal, iframe fallback, accessibility
│   └── projects.js         # Portfolio project data
├── assets/
│   ├── favicon.svg         # Site favicon
│   ├── fonts/
│   │   └── la-belle-aurore-latin.woff2  # Self-hosted signature font (latin)
│   └── projects/
│       ├── pineup/favicon.svg
│       ├── trado/favicon.svg
│       ├── sky-weather/favicon.svg
│       ├── pine-notes/favicon.svg
│       └── rotix/favicon.svg
└── cv/
    └── cv.pdf              # CV (replace with the final version when ready)
```

## Tech Stack

- Semantic HTML5
- CSS3 (custom properties, clamp, flex, grid, responsive)
- Vanilla JavaScript (ES6+, no dependencies, deferred scripts)
- Self-hosted SVG and font assets

## Setup

Open `index.html` in a browser or serve the folder with any static server.

## Notes

- The canonical domain is `https://pinava-curator.vercel.app/` (used for canonical, Open Graph, sitemap, and JSON-LD).
- If a live project blocks iframe embedding (X-Frame-Options / CSP frame-ancestors), the viewer shows a fallback panel with an "Open Live Site" link after a one-shot timeout. The external link is always available as a guaranteed fallback.

## Manual Steps

- Replace `cv/cv.pdf` with the final CV PDF when ready
- Provide a raster Open Graph image (e.g. 1200×630 PNG/JPG) — SVG OG images are not supported by some crawlers; update the `og:image` and `twitter:image` URLs when available
