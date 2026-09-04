# Pinava — Frontend Developer Portfolio

Pinava is a lightweight personal portfolio for a frontend developer. It is built with plain HTML, CSS, and JavaScript. No framework, no build step.

## Features

- Personal hero section with core tech stack and CV download
- Selected work section with desktop split layout and mobile responsive cards
- Project viewer modal with keyboard accessibility
- Skip link, focus management, and semantic structure
- Responsive from 320px up to 1920px

## Project Architecture

```
pinava/
├── index.html              # Semantic page structure
├── css/
│   └── styles.css          # Layout, theme tokens, responsive rules
├── js/
│   ├── app.js              # App controller, modal, accessibility
│   └── projects.js         # Portfolio project data
├── assets/
│   ├── favicon.svg         # Site favicon
│   └── projects/
│       ├── pineup/favicon.svg
│       ├── trado/favicon.svg
│       ├── sky-weather/favicon.svg
│       └── pine-notes/favicon.svg
└── cv/
    └── cv.pdf              # Placeholder location for CV (not included)
```

## Tech Stack

- Semantic HTML5
- CSS3 (custom properties, clamp, flex, grid, responsive)
- Vanilla JavaScript (ES6+, no dependencies)
- Self-hosted SVG assets

## Setup

Open `index.html` in a browser or serve the folder with any static server.

## Manual Steps

- Replace `[Your Name]` in the hero with the actual name
- Drop a real `cv.pdf` into the `cv/` folder
- Update contact links in the contact section
- Replace project favicon SVGs with branded assets if available
