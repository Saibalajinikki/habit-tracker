# HabitFlow

A habit tracking app inspired by [Teenage Engineering](https://teenage.engineering)'s hardware design language. Built with React, featuring rotary knob navigation, LED-style toggle grids, procedural click sounds, and 12 product-inspired color schemes.

All data stays in your browser via an in-memory SQLite database persisted to localStorage. No accounts, no servers, no tracking.

## Features

- **LED Toggle Grid** — Check off habits with glowing LED-style squares. Perfect days get an extra glow.
- **Rotary Month Knob** — Drag, scroll, or click to navigate months. Inspired by TE's rotary encoders.
- **12 Color Schemes** — Switch between palettes inspired by the OP-1, OP-Z, EP-133, OB-4, and more.
- **Dark Mode** — Hardware toggle switch, persisted to localStorage.
- **Click Sounds** — Procedural audio via Web Audio API. Three variants: toggle, knob, and switch.
- **Streak Tracking** — Real consecutive-day streaks per habit and overall, with best-streak history.
- **Analytics Dashboard** — Per-habit VU meters, weekly day-of-week patterns, and yearly overview.
- **Flip Counter** — Animated odometer-style streak display.
- **Splash Screen** — Cinematic boot-up animation when the app launches.
- **Keyboard Shortcuts** — Arrow keys (months), `N` (new habit), `D` (dark mode).
- **Offline-First** — SQLite via sql.js, fully client-side. Works without internet after first load.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and Run

```bash
git clone https://github.com/Saibalajinikki/habit-tracker.git
cd habit-tracker
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

The `dist/` folder contains the static build, ready to deploy to any static host.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Database | sql.js (SQLite compiled to WebAssembly) |
| Animations | GSAP |
| Audio | Web Audio API (procedural synthesis) |
| Fonts | Space Grotesk + Space Mono |

## Deployment

HabitFlow is a static site. Deploy the `dist/` folder to any of these:

- **Vercel** — `npx vercel`
- **Netlify** — Drag and drop `dist/` or connect your repo
- **GitHub Pages** — Use `gh-pages` branch with the build output
- **Cloudflare Pages** — Connect repo, set build command to `npm run build`

## License

MIT
