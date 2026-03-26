# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Does

**add-r-up** is a Texas Hold'em poker prize calculator — a single-screen mobile PWA. Given a pot size, it calculates prizes for up to 5 places using fixed percentage splits (55/27.5/10.5/5/2), rounding down to the nearest bill denomination. Excess from rounding goes back to 1st place. Prizes below the minimum prize threshold show a 🍺 icon instead.

## Commands

```bash
fnm use 22          # required — Node 22+ for Vite 5
npm run dev         # dev server with HMR at localhost:5173
npm run build       # TypeScript compile + Vite build → www/
npm test            # Vitest (calculator logic only, no DOM)

# Serve the built output (used for manual testing)
npx serve www --listen 8100
```

## Architecture

Single-page React app. All logic lives in `src/`:

| File | Purpose |
|------|---------|
| `App.tsx` | Root component — composes all hooks, renders full layout |
| `App.css` | All styles — dark theme, viewport-locked layout, segment buttons |
| `calculator.ts` | Pure prize calculation logic (`calculate`, `floorTo`, `PERCENTS`) |
| `calculator.test.ts` | Vitest tests for calculation logic |
| `useTranslation.ts` | i18n hook — English/Polish, auto-detect from browser, persists to localStorage |
| `useSettings.ts` | Settings hook — pot, smallestBill, minPrize, persisted to localStorage |
| `locales/en.json` | English translation keys |
| `locales/pl.json` | Polish translation keys |

## Build Output

Vite builds into `www/` (`emptyOutDir: false`). The `www/` directory also contains Cordova runtime files (`cordova.js`, `lib/`, `manifest.json`, `assets/`) that are served alongside the Vite output. The `publicDir` is set to `www/` so dev server serves these assets during development.

## Adding a Language

1. Add `src/locales/<code>.json` with the same keys as `en.json`
2. Add an entry to `AVAILABLE_LANGUAGES` in `src/useTranslation.ts`
