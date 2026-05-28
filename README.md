# Pinava Curator — Digital Showroom

Pinava Curator is a premium, immersive digital portfolio built to showcase creative web development projects. Designed around a sleek, dark-themed geometric aesthetic, the platform arranges past works as interactive orbital petals flanking a central golden brand insignia. Clicking a project triggers a cinematic dispersion animation, revealing a fully integrated live preview embedded directly from Vercel alongside repository documentation.

## ✨ Features

- **Interactive Sacred Geometry UI:** Utilizes mathematical layout principles to dynamically arrange project nodes in an organic, orbital configuration.
- **Cinematic Motion Design:** Powered by the native **Web Animations API (WAAPI)** for high-performance, fluid explosion and blur transitions without third-party rendering overhead.
- **Embedded Live Previews:** Features an isolated `<iframe>` viewer subsystem equipped with dynamic network loaders to preview external Vercel applications live without leaving the page.
- **Asynchronous DOM Generation:** Zero manual HTML mapping. Project nodes are structural data objects compiled at runtime.
- **Responsive Architecture:** Automatically switches from an advanced graphical canvas layout on desktop viewports to an ergonomic, high-contrast grid infrastructure on mobile devices.

---

## 📂 Project Architecture

```text
pinava-curator/
│
├── index.html          # Core semantic DOM skeleton
├── css/
│   └── style.css       # Core layout styling, theme tokens, and spatial rules
│
├── js/
│   ├── app.js          # DOM Controller and runtime application lifecycle
│   ├── projects.js     # Structured dataset for portfolio entries
│   └── animation.js    # Math-driven WAAPI layout engine and physics
│
└── assets/
    └── logo.png        # Premium brand asset

The internal animation engine recalculates spatial angles, balances node dispersion vectors, and updates the mobile viewport layout instantly.
⚡ Tech Stack
 Structure: Semantic HTML5
 Typography & Styling: Advanced CSS3 (Custom Variables, Native Clamping, Clip-Paths)
 Engine Logic: Vanilla JavaScript (ES6+ Modules, Clean State Operations)
 Motion Profiles: Web Animations API (WAAPI)
 Hosting Environment: Optimized for seamless routing via Vercel / GitHub Pages
```
