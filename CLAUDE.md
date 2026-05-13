# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

**Codenergy** — a Korean-language **personalized coding-learning platform driven by coding tests** (slogan: "코딩테스트, 지식에서 스킬로"). The product loop: user takes a coding test → results identify weak concepts → the platform delivers tailored learning. Coding tests are the input signal, not the end product.

Tech: full-stack app with a Vite multi-page frontend talking to an Express + SQLite backend. C code submitted by users is executed via Judge0 (RapidAPI).

## Repo layout

```
imformation/
├─ package.json          ← root: orchestrates both halves via `concurrently`
├─ frontend/             ← Vite multi-page app (vanilla JS, no framework)
├─ backend/              ← Express 4 + node:sqlite API server (port 3000)
├─ CLAUDE.md
├─ README.md
├─ prompt.md             ← scratchpad used by the `/claude_move` skill
├─ we_have_to_do.txt     ← team backlog/notes (Korean)
└─ workflow.png          ← architecture sketch
```

## Commands

From the **repo root**:

```powershell
npm run install:all   # one-shot install for root + frontend + backend
npm run dev           # boots backend (3000) + frontend (5173) concurrently
npm run dev:frontend  # frontend only
npm run dev:backend   # backend only
npm run build         # production build of the frontend (→ frontend/dist)
```

Frontend-only ([frontend/](frontend/)):

```powershell
npm run dev        # vite dev server on 5173
npm run build      # → frontend/dist
npm run preview    # serve the built bundle
npm run test:e2e   # Playwright tests (boots its own server on 5174)
npm run test:e2e:ui
```

Backend-only ([backend/](backend/)):

```powershell
npm run dev   # node --watch src/index.js
npm start
```

No linter or formatter is configured. Tests are Playwright e2e only — there is no unit test runner.

## Frontend ([frontend/](frontend/))

Vanilla JS + Vite multi-page app. Each top-level `.html` file is a Rollup entry registered in [frontend/vite.config.js](frontend/vite.config.js). No router, no framework.

Pages:
- [index.html](frontend/index.html) — marketing landing page
- [pricing.html](frontend/pricing.html), [survey.html](frontend/survey.html), [results.html](frontend/results.html)
- Test flow: [test-login.html](frontend/test-login.html) → [test-intro.html](frontend/test-intro.html) → [test-concepts.html](frontend/test-concepts.html) → [test-gauge.html](frontend/test-gauge.html) → [test-problem.html](frontend/test-problem.html) → [test-result.html](frontend/test-result.html)
- [avatar.html](frontend/avatar.html) — avatar/character customization

Shared modules in [frontend/src/](frontend/src/):
- [main.js](frontend/src/main.js) — landing-page bootstrapping; defines `API_BASE = "http://localhost:3000"`, wires the **tilt effect** (every element with `data-tilt` gets a `mousemove` listener applying 3D `rotateX/rotateY`, max 14°). Add `data-tilt` to make new cards/buttons tilt — no JS changes needed. Also handles the "demo-mode" fallback when the backend is unreachable.
- [style.css](frontend/src/style.css) — global styles.
- [test-problems.js](frontend/src/test-problems.js) — hardcoded C-problem pool + queue helpers (`buildProblemQueue`, `loadProblemQueue`, `saveProblemQueue`, `getTestCases`). Each problem has an `expected(A)` JS reference that mocks what the user's C code should print. This is the single source of truth for problem content and per-case verdicts. If a real grading backend is wired in, this file is the only place that needs to change.
- [judge.js](frontend/src/judge.js) — Judge0 (RapidAPI) C-compile/run client. Reads `VITE_JUDGE0_KEY` and `VITE_JUDGE0_HOST` (Vite env). Falls back to mock-mode when keys are absent. Free RapidAPI tier is ~50 calls/day, so the test flow batches calls deliberately.
- Per-page controllers: [test-login.js](frontend/src/test-login.js), [test-intro.js](frontend/src/test-intro.js), [test-concepts.js](frontend/src/test-concepts.js), [test-gauge.js](frontend/src/test-gauge.js), [test-problem.js](frontend/src/test-problem.js), [test-result.js](frontend/src/test-result.js), [avatar.js](frontend/src/avatar.js).
- [avatar/](frontend/src/avatar/) — `character.js`, `outfits.js`, `avatar.css` for the avatar editor.

E2E tests in [frontend/tests/e2e/](frontend/tests/e2e/). Playwright config ([playwright.config.ts](frontend/playwright.config.ts)) forces empty Judge0 env vars so tests use mock execution.

## Backend ([backend/](backend/))

Express 4 + `node:sqlite` (built-in, requires Node ≥ 22.5) + bcryptjs + nodemailer. CORS is locked to Vite dev origins with credentials enabled so frontend `fetch(..., { credentials: "include" })` works.

- [src/index.js](backend/src/index.js) — entry point, port 3000 (override with `PORT`), mounts routers.
- [src/auth.js](backend/src/auth.js) — `/api/signup`, `/api/login`, `/api/logout`, `/api/me`, `/api/find-username`, `/api/forgot-password`. Cookie session (`sid`), bcrypt password hashing.
- [src/test.js](backend/src/test.js) — `/api/test/progress`, `/api/test/answer`, `/api/test/state`, `/api/test/email-sample`.
- [src/avatar.js](backend/src/avatar.js) — `/api/avatar/*`.
- [src/db.js](backend/src/db.js) — SQLite init + schema migrations. DB at `backend/data/app.db`, created on first run. WAL mode, foreign keys on.
- [src/mailer.js](backend/src/mailer.js) — nodemailer wrapper. Falls back to console-log when SMTP env vars are empty.

Env in [backend/.env](backend/.env) (copy from `.env.example`):

```
PORT=3000
SESSION_SECRET=change-me-in-production
SMTP_HOST= SMTP_PORT=587 SMTP_USER= SMTP_PASS= SMTP_FROM="…"
```

See [backend/README.md](backend/README.md) for the full endpoint table and curl examples.

## Conventions

- **Korean copy throughout** — UI strings, error messages, and inline docs in [test-problems.js](frontend/src/test-problems.js) are all Korean. Keep it that way unless explicitly asked.
- **No framework, no router** — each `.html` is its own entry; navigation is plain `<a>` and `location.href`. Don't introduce React/Vue/etc. without asking.
- **State persistence** — test flow state lives in `sessionStorage` (queue, progress, answers, timer) keyed under `codenergy:test:*`. User identity lives in the backend session cookie. Avatar/progress that should outlive a session goes through `/api/*`.
- **Tilt effect** — add `data-tilt` to opt in; no JS changes.

## Ownership

All directories in this repo are the user's working area — make changes freely when asked. There are no separate teammate-owned subdirectories anymore.
