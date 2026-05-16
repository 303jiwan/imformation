# Codenergy Backend

Auth + coding-test API for the Codenergy frontend.
Express 4 + Supabase Postgres (via `pg`) + bcryptjs + nodemailer. No framework on top.

## Quick start

```powershell
cd backend
npm install
copy .env.example .env
# then edit .env and paste your Supabase DATABASE_URL (see below)
npm run dev              # node --watch src/index.js
```

Server listens on **http://localhost:3000** (the frontend's `API_BASE`).

### Connecting to Supabase

User accounts and per-user data live in Supabase Postgres so they sync across
machines. To wire up a backend instance:

1. Open Supabase Dashboard → your project → **Project Settings → Database →
   Connection string → URI**.
2. Copy the **Transaction Pooler** URI (port 6543). Replace `[YOUR-PASSWORD]`
   with your database password. If you forgot it, click *Reset database
   password* on the same page.
3. Paste it into `backend/.env` as `DATABASE_URL=postgresql://...`.

The same `DATABASE_URL` on every machine = same user table = same login from
anywhere. The schema is managed by SQL migrations applied to the Supabase
project; new tables/columns ship as separate migrations rather than runtime
`CREATE TABLE` calls.

Uploaded lecture files (videos, thumbnails) are still stored on the local
machine's disk under `backend/uploads/`; only the metadata syncs. Migrating
files to Supabase Storage is a separate follow-up.

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

### 채점 (auth required)

자체 gcc 채점기. 인증 쿠키(`sid`)가 없으면 401. Docker가 없고 `GRADER_UNSAFE_NOCONTAINER=0` 이면 503.

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/api/grade/run` | `{source, stdins[], cpuTimeLimit?, memoryLimit?}` | 컴파일 + 실행만 (expected 비교 없음). `{compile, cases[]}` 반환. |
| POST | `/api/grade/submit` | `{source, stdins[], expected[], hidden[], cpuTimeLimit?, memoryLimit?}` | 채점 (expected 비교). `{compile, passed, total, firstFail?, cases[]}` 반환. hidden=true 케이스의 `stdout`·`expected` 는 마스킹됨. |

#### 응답 코드

| 상태 | 의미 |
|---|---|
| 200 | 채점 완료 (컴파일 오류도 200; `compile.ok===false` 확인) |
| 400 | 요청 바디 검증 실패 |
| 401 | 로그인 필요 |
| 408 | 채점 타임아웃 / 큐 대기 초과 |
| 429 | 레이트리밋 초과 (`Retry-After: 60` 헤더 포함) |
| 503 | 채점 서비스 불가 (Docker 미설치 + `GRADER_UNSAFE_NOCONTAINER=0`) |

#### verdict 값

`"ok" | "wrong" | "tle" | "runtime" | "compile" | "system" | "output_limit"`

#### curl 예제

```bash
# 채점 실행 (로그인 쿠키 필요)
curl -i -b cookies.txt -X POST http://localhost:3000/api/grade/run \
  -H "Content-Type: application/json" \
  -d '{"source":"#include<stdio.h>\nint main(){printf(\"1\");return 0;}","stdins":[""]}'

# 채점 제출
curl -i -b cookies.txt -X POST http://localhost:3000/api/grade/submit \
  -H "Content-Type: application/json" \
  -d '{"source":"#include<stdio.h>\nint main(){int a;scanf(\"%d\",&a);printf(\"%d\",a*2);return 0;}","stdins":["3\n"],"expected":["6"],"hidden":[false]}'
```

#### Docker 설치 안내

프로덕션에서는 `GRADER_UNSAFE_NOCONTAINER=0` (기본) + Docker Desktop 또는 Docker Engine을 설치해야 합니다.

```bash
# Docker 설치 후 이미지 미리 받기 (최초 1회, 약 400MB)
docker pull gcc:9
```

개발 환경에서 Docker 없이 빠르게 테스트하려면:
```
GRADER_UNSAFE_NOCONTAINER=1   # backend/.env 에 추가
```
단, 이 설정은 샌드박스가 없어 악의적인 코드가 서버에 직접 실행될 수 있으므로 **공개 배포에 절대 사용하지 마세요**.

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
