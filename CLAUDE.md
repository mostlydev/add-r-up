# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Does

**add-r-up** is a Texas Hold'em poker prize calculator — a single-screen Ionic 3 / Angular 4 mobile app. Given a pot size, it calculates prize amounts for up to 5 places using fixed percentage splits, rounding down to the nearest bill denomination. Excess from rounding is added back to 1st place.

Prize percentages: 1st gets the remainder, 2nd=27.5%, 3rd=10.5%, 4th=5%, 5th=2%. Prizes below the minimum prize threshold show a beer icon instead.

## Commands

```bash
# Serve in browser (development)
ionic serve

# Build
npm run build

# Lint
npm run lint
```

There are no tests in this project.

## Architecture

This is a single-page Ionic 3 app. Everything meaningful lives in `src/pages/home/`:

- `home.ts` — `HomePage` component with all logic: prize calculation (`recalculate()`), settings persistence via `@ionic/storage`, and language detection via `@ionic-native/globalization`
- `home.html` — template with `ion-list` / `ion-segment` UI
- `home.scss` — page styles
- `home.constants.ts` — available languages (`en`, `pl`) and `sysOptions` shared state object

`src/app/app.module.ts` wires up `TranslateModule` (ng2-translate) with JSON files from `src/assets/i18n/` as the translation source.

## i18n

Translations are in `src/assets/i18n/{en,pl}.json`. Language is auto-detected from the device (Cordova) or browser, falling back to `en`. The user can also switch language via a segment picker. To add a language: add a JSON file, add an entry to `availableLanguages` in `home.constants.ts`.

## Storage

Settings (pot size, smallest bill, smallest prize) are persisted using `@ionic/storage` (key/value). Saved on every `onChange()` call, loaded on `ngOnInit`.
