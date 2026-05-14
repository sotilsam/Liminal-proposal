# Liminal — Project Context for Claude Code

## What is this project

Landing page for "Liminal" — an HCI course project (2026).
Liminal is an AR rehabilitation system that treats phantom limb pain
using real-time 3D rendering, motion tracking, and voice control.
Created by: Sam Sotil & Eliya Zakay.

## Tech Stack

- React + Vite
- React Three Fiber + @react-three/drei (3D scene)
- GSAP + ScrollTrigger (scroll animations)
- Lenis (smooth scroll, integrated with GSAP ticker)
- CSS Modules (no Tailwind, no styled-components)

## Run commands

npm install
npm run dev # localhost:5173
npm run build

## File structure

src/
components/
HeroScene.jsx / .module.css ← 3D banner + hero text
ProductCards.jsx / .module.css ← Section 01: interface definition
Architecture.jsx / .module.css ← Section 02: system architecture SVG
AppFlow.jsx / .module.css ← Section 03: app flow SVG
Footer.jsx / .module.css
App.jsx / App.module.css
main.jsx ← Lenis + GSAP init here

public/
models/ ← User drops .glb files here
limb_01.glb ... limb_08.glb ← loaded by HeroScene, missing = skip

## Design system

Background: #0a0a0f
Teal accent: #00d4b8
Purple: #7c5cbf
Text: #e8e8f0
Card bg: #13131f
Max border-radius: 8px

## Hero section layout (important)

NOT a left/right split.
Layout is TOP → MIDDLE → BOTTOM:

- TOP: centered text (title + tagline + description), large
- MIDDLE: full-width R3F canvas (~55vh), horizontal row of 3D models
- BOTTOM: CTA button, absolute positioned, centered

Scroll behavior: as user scrolls DOWN, the 3D model row moves RIGHT,
revealing more models from the left. Implemented via GSAP ScrollTrigger
on the Three.js group position.x (scrub: 1.5).

## SVG diagrams (Sections 02 & 03)

- Architecture: 3-column (teal/purple/coral), semi-transparent fills,
  dark bg adapted, hover glow on boxes
- AppFlow: green=main screens, blue=sub-actions, diamond=decisions,
  cloud path=database. Draw-on-scroll via stroke-dashoffset animation.

## Content is placeholder

All text content (cards, diagram labels, etc.) is placeholder.
The user will edit it manually. Do not over-engineer the content —
keep it easy to find and change.

## Key conventions

- Smooth scroll: Lenis feeds into gsap.ticker, not window scroll events
- All scroll animations use ScrollTrigger with scrub unless noted
- useGLTF calls are wrapped in try/catch — missing models skip silently
- CSS variables defined in App.module.css, imported where needed
- Hebrew content may be added later — keep text in easy-to-find constants

## Hebrew / RTL support

The site is bilingual — some sections are in Hebrew, some in English.

- Add `dir="rtl"` and `lang="he"` to the Hebrew sections/elements,
  NOT to the entire <html> tag (to avoid breaking the English parts)
- Use `direction: rtl` and `text-align: right` in CSS only on Hebrew containers
- Font: add "Heebo" from Google Fonts alongside Inter —
  use Heebo for Hebrew text, Inter for English
- Section titles and navigation: English
- Card content (ProductCards): Hebrew
- Hero tagline + description: Hebrew
- SVG diagram labels (Architecture, AppFlow): English (keep short, technical)
- Footer: Hebrew

When adding new text content, ask which language before writing.
