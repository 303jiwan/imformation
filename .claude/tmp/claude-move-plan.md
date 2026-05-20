# Implementation Plan v2 — 친구초대 → 배틀(PvP) (AR 반영)

## 목표
`친구 초대` → `배틀` 교체 + 배틀 진입/매치 페이지 신규. 5문제 3승 선취 = 승리 + 배터리 보상. HTTP 폴링 멀티플레이. 화이트/그린/퍼플 톤 유지.

---

## 핵심 결정 (AR 반영)

### D1. 채점 reference
- 백엔드에 `battle_problems` 테이블 + 시드 5~10문제.
- 채점: 백엔드가 testcases 보유 → grader.js → 전 케이스 통과 시 정답.
- `/match/:id/state` 응답은 설명/예제만 (testcases/expected 제외).

### D2. 좀비 청소
- `battle_queue.joined_at` 60초 이상 → 매칭 트랜잭션 진입 시 lazy 삭제
- `battle_matches.last_activity_at` 컬럼. 180초 무활동 → 상대 승리 (forfeit)
- waiting 방 `created_at + 10분` 만료
- 페이지 unload 시 `navigator.sendBeacon` 으로 leave

### D3. 매치 시작 동기화
- 매치 생성 시 `started_at = now() + 3s`
- 응답에 `serverNow, startedAt` 포함 → 클라 카운트다운 3-2-1
- started_at 전에는 제출 비활성

### D4. /match/:id/state 인가
- 요청자 ∉ match_players → 403

### D5. users.batteries 충돌 확인
- Role A 가 grep 후 결정. 충돌 시 `battle_batteries` 컬럼 분기

---

## 변경할 파일

### 신규
- `frontend/battle.html`, `frontend/battle-match.html`
- `frontend/src/battle.js`, `frontend/src/battle-match.js`
- `backend/src/battle.js`
- `backend/sql/battle.sql`

### 수정
- 14 HTML (index, avatar, codetrails, lectures, lessons, pricing, results, survey, trail, test-concepts, test-gauge, test-intro, test-login, test-result) — nav `<a data-action="invite">`/`my-menu <li>` 교체
- `admin.html`, `test-problem.html` — Role C 먼저 grep 검증 후 처리/스킵 보고
- `frontend/index.html` — invite-modal DOM 삭제
- `frontend/src/main.js` — invite 제거, battle i18n 추가
- `frontend/src/style.css` — invite-* 삭제, `.battle-*` 추가, `.code-editor-shell` 공용 클래스 추출
- `frontend/vite.config.js` — `battle`, `battleMatch` 엔트리
- `backend/src/index.js` — battle 라우터 마운트

---

## 단계

### Step 1 (Role A) DB 스키마 + 시드
```sql
create table if not exists battle_queue (
  user_id int primary key references users(id) on delete cascade,
  joined_at timestamptz not null default now()
);

create table if not exists battle_problems (
  id serial primary key,
  title text not null, description text not null,
  input_desc text, output_desc text,
  constraints jsonb default '[]'::jsonb,
  examples jsonb default '[]'::jsonb,
  testcases jsonb not null default '[]'::jsonb,
  starter_code text default '',
  time_limit_ms int default 1000,
  memory_kb int default 65536
);

create table if not exists battle_matches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  started_at timestamptz not null,
  last_activity_at timestamptz default now(),
  problem_ids int[] not null,
  state text not null default 'in_progress',
  winner_user_id int null references users(id),
  ended_at timestamptz null
);

create table if not exists battle_match_players (
  match_id uuid references battle_matches(id) on delete cascade,
  user_id int references users(id) on delete cascade,
  score int not null default 0,
  current_problem_idx int not null default 0,
  primary key(match_id, user_id)
);

create table if not exists battle_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  host_user_id int references users(id) on delete cascade,
  created_at timestamptz default now(),
  state text not null default 'waiting',
  match_id uuid null references battle_matches(id)
);

-- batteries column: Role A 가 ALTER 전 grep 후 결정
-- alter table users add column if not exists batteries int not null default 0;

-- 시드 5문제 (test-problems.js 쉬운 문제 이식)
```

### Step 2 (Role A) 엔드포인트
모두 `requireAuth`, 응답에 `serverNow` 포함. 매칭/룸 API rate limit 적용.

| Endpoint | 동작 |
|---|---|
| `POST /api/battle/queue/join` | TX: 좀비 청소 → SKIP LOCKED 매칭 → 매칭 시 양쪽 큐 삭제 + match insert (started_at=now()+3s, problem_ids=random 5) + match_players insert / 없으면 자기 큐 insert 후 202 `{status:'waiting'}` |
| `POST /api/battle/queue/leave` | DELETE 멱등 |
| `POST /api/battle/rooms` | code = `crypto.randomBytes(4).toString('hex').toUpperCase().slice(0,6)`, UNIQUE 실패 시 3회 재시도 |
| `POST /api/battle/rooms/:code/join` | 404/409 처리. 매치 생성 + state='matched' |
| `POST /api/battle/rooms/:code/leave` | 호스트만, waiting 상태만 |
| `GET /api/battle/rooms/:code/state` | host or joiner만, 외 404. `{state, matchId?, hostUserId, serverNow}` |
| `GET /api/battle/match/:id/state` | 인가 검증 (403). last_activity_at 업데이트. 무활동 180초 시 forfeit. 응답에 currentProblem(testcases 제외), startedAt, serverNow |
| `POST /api/battle/match/:id/submit` | 인가 + problemIdx 일치 검증 → grader 호출 → 전 케이스 통과 시 score++. score>=3 시 finished + winner + batteries +5. grader 503 시 `{verdict:'pending', retryAfterMs:2000}` |

### Step 3 (Role B) 디자인/UI
- `battle.html`: nav + `.battle-stage` 배경 카드 + `.battle-actions` (랜덤 PvP / 방 입력) + 모달들 (방 입력, 방 생성, 방 들어가기, 매칭 대기)
- `battle-match.html`: 3행 그리드 (문제 / 좌·우 아바타 + 점수 / Monaco 에디터) + 카운트다운 오버레이 + 결과 모달
- `style.css`: invite-* 삭제, `.code-editor-shell` 추출 (problem-editor 시각 베이스), `.battle-*` 추가, `.battle-disabled` 토스트

### Step 4 (Role C) 프론트 로직 + 정리
- nav 14파일 + my-menu grep/edit. admin/test-problem 검증 후 처리
- `main.js`:
  - invite 코드/함수/case/i18n 제거
  - `nav.battle`, `my.battle` 추가
  - 비로그인 시 `sessionStorage[REDIRECT_AFTER_LOGIN_KEY]='battle.html'` + 로그인 모달
  - 데모 모드 차단 alert
- `battle.js`:
  - 랜덤 PvP → `POST /queue/join` 1.5초 폴링 멱등 재호출
  - 방 생성/들어가기 폴링 → matchId 받으면 이동
  - sessionStorage `codenergy:battle:matchId`
  - `beforeunload` 시 sendBeacon leave (큐 대기 중 또는 호스트만)
- `battle-match.js`:
  - Monaco CDN 부트스트랩 (test-problem.html 패턴 복사)
  - 1.5초 폴링 `/match/:id/state`
  - 카운트다운: `serverNow - startedAt` 기준
  - 제출 → verdict==='pending' 2초 후 재시도. correct 시 다음 문제. finished/forfeit 시 결과 모달
- `vite.config.js`: 신규 엔트리

### Step 5 빌드/검증 (Role C 마지막)
- `npm run build`
- `npm run dev` + 두 브라우저 시나리오 (랜덤 PvP, 방 생성/들어가기, 3승 → 배터리)
- 한쪽 닫고 forfeit 동작 (dev 단축 옵션 [?])
- curl 403 인가 검증

---

## sessionStorage 키
- `codenergy:battle:matchId`

## i18n 추가
- `nav.battle`, `my.battle`
- `battle.title`, `battle.randomPvp`, `battle.roomEntry`, `battle.createRoom`, `battle.joinRoom`, `battle.waiting`, `battle.preparing`, `battle.youWon`, `battle.youLost`, `battle.batteryReward`, `battle.demoBlocked`, `battle.opponentLeft`

## 결정값
- 배터리 +5 / 폴링 1.5초 / forfeit 180초 / 시드 5문제

## 리스크
- 폴링 부하 → MVP 가정. 동시 100매치 이상 시 SSE/WS
- grader 큐 공유 → 503 retry 로 대응
- dist/ 빌드 후 git 반영은 사용자 위임

---

## 에이전트 로스터

### Role A: 백엔드 (병렬 안전)
- `backend/src/battle.js`, `backend/src/index.js`, `backend/sql/battle.sql`
- 8개 엔드포인트 + 시드 5문제 + users 컬럼 확인 보고

### Role B: 디자인/UI (병렬 안전)
- `frontend/battle.html`, `frontend/battle-match.html`, `frontend/src/style.css`
- 신규 마크업 + 톤 일관성 + `.code-editor-shell` 공용 클래스

### Role C: 기능구현 (Role A + B 완료 후)
- `frontend/src/battle.js`, `frontend/src/battle-match.js`, `frontend/src/main.js`, `frontend/vite.config.js`
- 14 HTML nav 교체, index.html invite-modal 삭제
- 마지막 빌드/검증 담당

### 제외
- 테스트: 수동 + curl + build 로 갈음
- DB 마이그레이션 전담: SQL 작성은 Role A, 실행은 사용자
