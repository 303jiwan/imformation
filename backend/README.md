# Codenergy Backend

Auth + coding-test API for the Codenergy frontend.
Express 4 + better-sqlite3 + bcryptjs + nodemailer. No framework on top.

## Quick start

```powershell
cd backend
npm install
copy .env.example .env   # optional — defaults are fine for dev
npm run dev              # node --watch src/index.js
```

Server listens on **http://localhost:3000** (the frontend's `API_BASE`).
SQLite database is created on first run at `backend/data/app.db`.

## Endpoints

All responses are JSON. Auth-protected routes return `401` when no valid
session cookie (`sid`) is present.

### Auth

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/api/signup` | `{username, password, email}` | Creates user, sets session, returns user. 409 on duplicate username. |
| POST | `/api/login` | `{username, password}` | 401 on bad creds. |
| POST | `/api/logout` | — | Clears server-side session and cookie. |
| GET  | `/api/me` | — | Returns user, or 401. |
| POST | `/api/find-username` | `{email}` | Emails the username if the address is registered. Always 200 (no enumeration). |
| POST | `/api/forgot-password` | `{email, username}` | Issues a temporary password and emails it. Always 200. |

### Coding test (auth required unless noted)

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/api/test/progress` | `{current, total}` | Upserts the user's progress. |
| POST | `/api/test/answer` | `{problemId, code, verdict}` | Stores a submission. |
| GET  | `/api/test/state` | — | `{progress, answers[]}` for the current user. |
| POST | `/api/test/email-sample` | `{email}` | Public — captures the test-login "email me my results" field. |

### curl examples

```bash
# 1. unauthenticated /me  -> 401
curl -i http://localhost:3000/api/me

# 2. signup (auto-login, sets cookie)
curl -i -c cookies.txt -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","email":"a@b.com"}'

# 3. /me with cookie  -> 200 user
curl -i -b cookies.txt http://localhost:3000/api/me

# 4. logout
curl -i -b cookies.txt -X POST http://localhost:3000/api/logout

# 5. find username (always 200)
curl -i -X POST http://localhost:3000/api/find-username \
  -H "Content-Type: application/json" -d '{"email":"a@b.com"}'

# 6. forgot password (always 200, emails a temp password)
curl -i -X POST http://localhost:3000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","username":"test"}'
```

## Storage

- Database: `backend/data/app.db` (SQLite, WAL mode).
  Tables: `users`, `sessions`, `test_progress`, `test_answers`, `email_samples`.
- Schema lives in [`src/db.js`](src/db.js); changes are applied on startup
  via `CREATE TABLE IF NOT EXISTS`.

To wipe state: stop the server, delete `backend/data/app.db*`, restart.

## Environment variables

See [`.env.example`](.env.example).

| Var | Purpose |
|---|---|
| `PORT` | HTTP port (default `3000`). |
| `SESSION_SECRET` | Reserved for future signed-cookie use. Sessions today are random 32-byte hex tokens stored in SQLite. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | If `SMTP_HOST` is set, mail is sent through nodemailer. Otherwise emails are printed to the console (dev mode). |

## Security

- Passwords are hashed with bcrypt (10 rounds). Plaintext is never stored.
- Sessions: 32-byte hex tokens stored server-side in SQLite, sent as an
  `httpOnly`, `sameSite=lax` cookie with `maxAge` of 7 days.
  `secure: false` because the frontend runs on plain `http://localhost`;
  flip to `true` in production over HTTPS.
- All SQL uses prepared statements (better-sqlite3 `db.prepare`).
- CORS allowlist is hard-coded to the Vite dev origins
  (`localhost:5173`, `localhost:5174`, plus `127.0.0.1`).
- Username/password recovery endpoints don't reveal whether an email or
  username exists — they always return 200 with the same message.

## Known limits / next steps

- No rate limiting. Add `express-rate-limit` on `/api/login`,
  `/api/signup`, `/api/find-*` before exposing publicly.
- `forgot-password` issues a temporary password directly; a proper
  reset-token flow with a short-lived link is preferable.
- Sessions are not signed; cookie value tampering simply yields
  "session not found" so this is benign, but signed cookies would let us
  detect tampering server-side without a DB hit.
- No automated tests yet.
