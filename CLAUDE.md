# CLAUDE.md

Guide Claude Code (claude.ai/code) for this repo.

## What this repo is

**Codenergy** — Korean **personalized coding-learning platform driven by coding tests** (slogan: "코딩테스트, 지식에서 스킬로"). Loop: user takes coding test → results identify weak concepts → platform delivers tailored learning. Coding tests are input signal, not end product.

Tech: full-stack app, Vite multi-page frontend + Express backend. Backend persistence = **Supabase Postgres** (via `pg` driver, async) so accounts + per-user data sync across machines — every backend pointed at same `DATABASE_URL` sees same rows. User C code runs via **자체 채점기** (`backend/src/grader.js`): gcc 컴파일 1회 + stdin 갈아끼우며 N회 실행. 개발 환경은 `GRADER_UNSAFE_NOCONTAINER=1`(직접 실행), 프로덕션은 Docker 샌드박스(`gcc:9` 이미지) 사용.

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

From **repo root**:

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

No linter/formatter configured. Tests = Playwright e2e only — no unit test runner.

## Frontend ([frontend/](frontend/))

Vanilla JS + Vite multi-page. Each top-level `.html` = Rollup entry in [frontend/vite.config.js](frontend/vite.config.js). No router, no framework.

Pages:
- [index.html](frontend/index.html) — marketing landing
- [pricing.html](frontend/pricing.html), [survey.html](frontend/survey.html), [results.html](frontend/results.html)
- Test flow: [test-login.html](frontend/test-login.html) → [test-intro.html](frontend/test-intro.html) → [test-concepts.html](frontend/test-concepts.html) → [test-gauge.html](frontend/test-gauge.html) → [test-problem.html](frontend/test-problem.html) → [test-result.html](frontend/test-result.html)
- [avatar.html](frontend/avatar.html) — avatar/character customization

Shared modules in [frontend/src/](frontend/src/):
- [main.js](frontend/src/main.js) — landing bootstrap; defines `API_BASE = "http://localhost:3000"`, wires **tilt effect** (every element with `data-tilt` gets `mousemove` listener applying 3D `rotateX/rotateY`, max 14°). Add `data-tilt` to make new cards/buttons tilt — no JS changes. Also handles "demo-mode" fallback when backend unreachable.
- [style.css](frontend/src/style.css) — global styles.
- [test-problems.js](frontend/src/test-problems.js) — hardcoded C-problem pool + queue helpers (`buildProblemQueue`, `loadProblemQueue`, `saveProblemQueue`, `getTestCases`). Each problem has `expected(A)` JS reference mocking what user's C code should print. Single source of truth for problem content + per-case verdicts. If real grading backend wired in, only this file changes. **Dual purpose:** problems here are not just test items — will later be reused as example/practice corpus for C-syntax (문법) learning module. When adding problems, treat each as teaching example for its `concepts` tag too: keep `description` self-explanatory, write `solution` like idiomatic textbook snippet for that concept (not clever one-liner), prefer covering missing concept over piling onto well-covered one.
- [judge.js](frontend/src/judge.js) — 자체 채점기 클라이언트. `VITE_API_BASE`(기본 `http://localhost:3000`)로 백엔드 `/api/grade/*` 호출. `runCMany`/`submitCMany` (배치 API) + `runC` (단일 케이스 호환 래퍼). 503/네트워크 오류 시 `_judgeAvailable=false` → 호출자가 mock 경로로 폴백.
- Per-page controllers: [test-login.js](frontend/src/test-login.js), [test-intro.js](frontend/src/test-intro.js), [test-concepts.js](frontend/src/test-concepts.js), [test-gauge.js](frontend/src/test-gauge.js), [test-problem.js](frontend/src/test-problem.js), [test-result.js](frontend/src/test-result.js), [avatar.js](frontend/src/avatar.js).
- [avatar/](frontend/src/avatar/) — `character.js`, `outfits.js`, `avatar.css` for avatar editor.

E2E tests in [frontend/tests/e2e/](frontend/tests/e2e/). Playwright config ([playwright.config.ts](frontend/playwright.config.ts))은 `VITE_API_BASE=http://localhost:3000`을 설정하며, 테스트 중 백엔드가 없으면 `/api/grade/*`가 네트워크 오류로 실패 → judge.js가 자동으로 mock 경로로 폴백합니다.

## Backend ([backend/](backend/))

Express 4 + Supabase Postgres (via `pg` driver) + bcryptjs + nodemailer. CORS locked to Vite dev origins with credentials enabled so frontend `fetch(..., { credentials: "include" })` works.

- [src/index.js](backend/src/index.js) — entry, port 3000 (override `PORT`), mounts routers.
- [src/auth.js](backend/src/auth.js) — `/api/signup`, `/api/login`, `/api/logout`, `/api/me`, `/api/find-username`, `/api/forgot-password`, `/api/signup/send-code`, `/api/signup/verify-code`. Cookie session (`sid`), bcrypt password hashing. Email auth codes stored as sha256 hashes with attempt cap + 60s resend cooldown.
- [src/grader.js](backend/src/grader.js) — `/api/grade/run`, `/api/grade/submit`. gcc 컴파일 + 실행 채점 모듈. 인증 필수(401), 레이트리밋(429), 동시성 큐(503/408). `GRADER_UNSAFE_NOCONTAINER=1`이면 직접 실행, `0`이면 Docker 샌드박스(`gcc:9`).
- [src/test.js](backend/src/test.js) — `/api/test/progress`, `/api/test/answer`, `/api/test/state`, `/api/test/email-sample`.
- [src/avatar.js](backend/src/avatar.js) — `/api/avatar/*`.
- [src/db.js](backend/src/db.js) — `pg.Pool` against Supabase. Exports `stmts` (async; preserves SQLite-style `.get`/`.all`/`.run` shape) and `withTx(fn)` for transactions. Schema lives in Supabase migrations, not this file. Requires `DATABASE_URL` in `backend/.env` — see [backend/README.md](backend/README.md). Note: uploaded lecture media still on local backend disk under `backend/uploads/`; only metadata syncs through Postgres.
- [src/mailer.js](backend/src/mailer.js) — nodemailer wrapper. Falls back to console-log when SMTP env vars empty.

Env in [backend/.env](backend/.env) (copy from `.env.example`):

```
PORT=3000
SESSION_SECRET=change-me-in-production
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
SMTP_HOST= SMTP_PORT=587 SMTP_USER= SMTP_PASS= SMTP_FROM="…"
```

`DATABASE_URL` required — get Transaction Pooler URI from
Supabase Dashboard → Project Settings → Database → Connection string.

See [backend/README.md](backend/README.md) for full endpoint table + curl examples.

## Conventions

- **Korean copy throughout** — UI strings, error messages, inline docs in [test-problems.js](frontend/src/test-problems.js) all Korean. Keep that way unless asked.
- **No framework, no router** — each `.html` = own entry; navigation = plain `<a>` and `location.href`. Don't add React/Vue/etc. without asking.
- **State persistence** — test flow state in `sessionStorage` (queue, progress, answers, timer) keyed under `codenergy:test:*`. User identity in backend session cookie. Avatar/progress that outlives session goes through `/api/*`.
- **Tilt effect** — add `data-tilt` to opt in; no JS changes.

## Ownership

All dirs = user's working area — change freely when asked. No separate teammate-owned subdirs.