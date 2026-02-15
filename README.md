# HabitFlow

A habit tracking app inspired by [Teenage Engineering](https://teenage.engineering)'s hardware design language. Built with React, featuring rotary knob navigation, LED-style toggle grids, procedural click sounds, and 12 product-inspired color schemes.

All data stays in your browser via an in-memory SQLite database persisted to localStorage. No accounts, no servers, no tracking.

## Features

- **LED Toggle Grid** — Check off habits with glowing LED-style squares. Perfect days get an extra glow.
- **Rotary Month Knob** — Drag, scroll, or click to navigate months. Inspired by TE's rotary encoders.
- **12 Color Schemes** — Switch between palettes from the OP-1, OP-Z, EP-133, OB-4, and more.
- **Dark Mode** — Hardware toggle switch, persisted to localStorage.
- **Click Sounds** — Procedural audio via Web Audio API. Three variants: toggle, knob, and switch.
- **Streak Tracking** — Real consecutive-day streaks per habit and overall, with best-streak history.
- **Analytics Dashboard** — Per-habit VU meters, weekly day-of-week patterns, and yearly overview.
- **Flip Counter** — Animated odometer-style streak display.
- **Keyboard Shortcuts** — Arrow keys (months), `N` (new habit), `D` (dark mode).
- **Offline-First** — SQLite via sql.js, fully client-side. Works without internet after first load.

## Color Schemes

| Theme | Inspiration |
|-------|------------|
| HabitFlow | Default green |
| OP-1 | Classic blue encoders |
| OP-Z | Signal yellow |
| OP-XY | Record red |
| EP-133 | Sampler orange |
| TE Brand | Magenta |
| OB-4 | Navy |
| PO-400 | Modular yellow |
| Off-White | Virgil Abloh collab |
| PO-20 | Arcade purple |
| OP-1 Field | Ochre |
| PO-12 | Rhythm green |

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

## Project Structure

```
src/
  App.jsx                    # Main layout — header, knob panel, grid, footer
  main.jsx                   # React entry point
  index.css                  # TE design system — CSS custom properties, components
  components/
    AddHabitModal.jsx         # Modal for creating new habits
    AnalyticsPanel.jsx        # Per-habit cards, weekly pattern, yearly overview
    FlipCounter.jsx           # Animated odometer digit display
    HabitGrid.jsx             # LED strip rows with day headers
    MonthKnob.jsx             # Rotary encoder with drag/scroll/click
    StatsPanel.jsx            # Footer stats bar
    ThemePicker.jsx           # Color scheme dropdown selector
    VUMeter.jsx               # Segmented horizontal completion bar
  hooks/
    useClickSound.js          # Web Audio API procedural click synthesis
    useDarkMode.js            # Dark mode toggle with system preference
    useHabitTracker.js        # Core data: CRUD, streaks, analytics
    useTheme.js               # 12 TE color schemes with localStorage
  utils/
    database.js               # sql.js wrapper — init, queries, persistence
```

## Data Storage

HabitFlow uses [sql.js](https://github.com/sql-js/sql.js/) — a full SQLite database compiled to WebAssembly, running entirely in the browser. The database is serialized to `localStorage` after every write.

**Schema:**

- `habits` — id, name, type, created_at, sort_order
- `habit_entries` — id, habit_id, year, month, day, completed

To export your data, open browser DevTools and run:

```js
JSON.parse(localStorage.getItem('habitTrackerDB'))
```

To clear all data:

```js
localStorage.removeItem('habitTrackerDB')
```

## Deployment

HabitFlow is a static site. Deploy the `dist/` folder to any of these:

- **Vercel** — `npx vercel`
- **Netlify** — Drag and drop `dist/` or connect your repo
- **GitHub Pages** — Use `gh-pages` branch with the build output
- **Cloudflare Pages** — Connect repo, set build command to `npm run build`

## License

MIT
