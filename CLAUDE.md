# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the [frontend/](frontend/) directory.

```bash
cd frontend
npm install        # first-time setup
npm run dev        # start Vite dev server
npm run build      # production build to frontend/dist
npm run preview    # serve the built bundle locally
```

There is no test runner, linter, or formatter configured.

## Architecture

This is a static landing page that mimics the Codetree marketing site (Korean copy: "코딩테스트, 지식에서 스킬로"). The frontend is a **vanilla JS + Vite** project — no framework, no router, no build step beyond Vite's defaults.

- [frontend/index.html](frontend/index.html) is the single entry point. All page content (header, hero, cards section) lives directly in HTML; JS only enhances it.
- [frontend/src/main.js](frontend/src/main.js) imports `./style.css` and wires up the **tilt effect** — every element with `data-tilt` gets a `mousemove` listener that applies a 3D `rotateX/rotateY` transform (max 14°). When adding new interactive cards or buttons that should tilt, just add the `data-tilt` attribute; no JS changes needed.
- [frontend/src/style.css](frontend/src/style.css) holds all styling.

## Ownership

- [frontend/](frontend/) is the **user's** working area — make changes here freely when the user requests frontend work.
- [Backend_jiwan/](Backend_jiwan/) (and any future backend code) is owned by a **teammate**. Do not modify backend files unless the user explicitly asks; treat it as read-only context.
- [Frontend_jounho/](Frontend_jounho/) is another teammate's placeholder directory.

## Repo layout quirks

- [Backend_jiwan/](Backend_jiwan/) and [Frontend_jounho/](Frontend_jounho/) are currently empty placeholder directories named after team members — not the actual code locations. The real frontend lives in [frontend/](frontend/).
- The top-level file `backend` (no extension) appears to be an accidental commit containing the string "awn"; safe to ignore unless the user asks about it.
