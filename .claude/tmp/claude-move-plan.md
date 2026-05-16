# Implementation Plan (review target) — v2 (codex adversarial review 반영)

# Implementation Plan — 자체 채점기 도입 (Backend gcc + Docker)

## Goal
외부 Judge0 (RapidAPI) 의존을 제거하고, 백엔드에 자체 채점 라우터를 두어 **제출 1건당 컴파일 1회 + stdin만 갈아끼우며 N회 실행**하는 구조로 전환한다. 케이스 수 상한(현재 10개)을 풀고 외부 API 키·콜 제한을 없앤다. **인증/레이트리밋/동시성 보호를 첫 출시부터 포함한다 (codex 지적 반영).**

## Files to change

### Backend (신규/수정)
- `backend/src/grader.js` (신규) — gcc + Docker 샌드박스 채점 모듈 + Express 라우터 + in-process 큐
- `backend/src/index.js` — `graderRouter` 마운트
- `backend/.env.example` — `GRADER_*` 환경변수 추가
- `backend/README.md` — `/api/grade/*` 엔드포인트 표 + Docker 설치 안내 + 인증/제한 정책 명시

### Frontend
- `frontend/src/judge.js` — Judge0 호출 코드 전면 교체. `runC` 시그니처 유지(호환), `runCMany`·`submitCMany` 신규. `judgeAvailable`는 getter 함수
- `frontend/src/test-problem.js` — `runAllCases`는 `runCMany`, `submitTest`는 `submitCMany` 사용. 케이스 루프 제거
- `frontend/src/lessons.js` — **(추가됨, 리뷰 반영)** `runC` 호출부의 `verdict === "accepted"`를 `=== "ok"`로 변경, `judgeAvailable` 호출 형태 변경, 503/네트워크 폴백 정리
- `frontend/.env.example` — `VITE_JUDGE0_KEY` / `VITE_JUDGE0_HOST` 제거, `VITE_API_BASE` 추가
- `frontend/tests/e2e/`의 setup이 env 강제하는 부분 — mock 분기를 "백엔드 503/네트워크 실패 → mock"으로 갱신

### Repo
- `CLAUDE.md` — "Backend persistence" 섹션 옆에 채점기 설명 추가, `judge.js`/`lessons.js` 줄 갱신

## Steps

1. **백엔드 grader 골격 (Docker 없이 직접 실행 모드, 개발용) + 인증/제한 (리뷰 반영)**
   - `backend/src/grader.js` 작성:
     - `compileOnce(source, workDir)` — `gcc -O2 -std=c11 -o sol sol.c` (10s 타임아웃), `{ ok, output }`
     - `runOne(binPath, stdin, { cpuMs, memMb })` — `child_process.spawn` + `setTimeout(kill SIGKILL)`, stdout/stderr 캡처. **출력 크기 상한 (`GRADER_MAX_OUTPUT_BYTES=64KB`)** 초과 시 truncate + `verdict: "output_limit"`
     - `gradeMany({ source, stdins, expected? })` — 임시 디렉토리 → 컴파일 1회 → stdins 순회 → try/finally 정리. wall-clock 상한 (`GRADER_JOB_TIMEOUT_MS=30000`) 초과 시 전체 작업 중단
   - **인증·제한 (1단계 필수)**:
     - `loadSession` 미들웨어 적용 → 비로그인 401. (CLAUDE.md의 세션 쿠키 인증)
     - 세션ID/IP 키로 **per-user 토큰버킷 레이트리밋**: `GRADER_RATE_PER_MIN=30`. 초과 시 429 + `Retry-After`
     - **글로벌 동시성 제한** (`GRADER_MAX_CONCURRENT=4`): 동시에 도는 채점 작업 개수 캡. 초과분은 in-process FIFO 큐로 대기 (`GRADER_QUEUE_MAX=20`, 초과 시 503 "busy")
     - 큐에 들어간 요청은 `GRADER_QUEUE_WAIT_MS=10000` 후에도 못 뽑히면 408
   - Express `Router()`: `POST /run`, `POST /submit`. body 검증:
     - 소스 길이 ≤ `GRADER_MAX_SOURCE_BYTES=100KB`
     - `stdins.length` ≤ `GRADER_MAX_CASES=200`
     - 각 stdin 길이 ≤ `GRADER_MAX_STDIN_BYTES=16KB`
   - `GRADER_UNSAFE_NOCONTAINER=1`이어야만 직접 실행 분기 활성. 0(기본)인데 Docker도 안 깔려 있으면 라우터가 503 + 명확 메시지
   - `backend/src/index.js`에 `app.use("/api/grade", graderRouter)` 마운트
   - 손-검증: 정상 / 컴파일 에러 / 무한루프(TLE) / segfault / 큰 출력 / 비로그인 401 / 레이트리밋 429 / 큐 포화 503 — curl로 확인

2. **Docker 샌드박스 래퍼 추가**
   - `runInDocker(cmd, { stdin, cpuMs, memMb })`:
     ```
     docker run --rm -i --network=none --memory=128m --memory-swap=128m
       --cpus=0.5 --pids-limit=64 --read-only
       --tmpfs /tmp:rw,noexec,nosuid,size=16m
       -v <hostWork>:/work:ro
       --user 65534:65534
       <GRADER_DOCKER_IMAGE> /work/sol
     ```
   - **성능**: 같은 컨테이너 안에서 컴파일 + 실행 N회를 sh 스크립트로 묶어 한 번에 실행 (acceptance 100케이스 5초 충족 목적)
   - 호스트 보조 가드: `Promise.race(docker, sleep(cpuMs+1500))` 후 `docker kill`
   - 컴파일·실행 분리 시 컴파일 컨테이너는 `/work` rw + root, 실행 컨테이너는 ro + nobody — Windows host에서 bind mount 권한 이슈 발생 시 named volume으로 대안
   - `GRADER_UNSAFE_NOCONTAINER` 분기와 동일 인터페이스로 묶기 (`runSandboxed(...)` 한 함수가 분기)
   - 악성 코드 4종 (`while(1)`, NULL deref, `/etc/passwd` read, fork bomb) 모두 호스트 영향 없이 의도 verdict로 응답하는지 수동 테스트

3. **프론트엔드 `judge.js` 재작성 (리뷰 반영: run/submit 분리)**
   - 기존 RapidAPI 호출 / base64 / 키 검사 / STATUS 매핑 전부 삭제
   - 신규 API:
     ```js
     export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
     let _judgeAvailable = true;
     export function judgeAvailable() { return _judgeAvailable; }

     // /api/grade/run — expected 안 보냄, raw stdout/verdict만 받음 (코드 실행 / lessons.js)
     export async function runCMany(source, stdins, { cpuTimeLimit, memoryLimit } = {}) {
       const res = await fetch(`${API_BASE}/api/grade/run`, {
         method: "POST", credentials: "include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ source, stdins, cpuTimeLimit, memoryLimit }),
       });
       if (res.status === 503) { _judgeAvailable = false; throw new Error("grader unavailable"); }
       if (!res.ok) throw new Error(`grader ${res.status}`);
       return await res.json();
     }

     // /api/grade/submit — expected[] 보냄. 백엔드가 case별 pass + firstFail만 돌려줌
     // hidden 케이스는 expected를 보내되 백엔드 응답에서 expected/stdout을 마스킹해 받는다
     export async function submitCMany(source, casesPlan, { cpuTimeLimit, memoryLimit } = {}) {
       // casesPlan: [{ stdin, expected, hidden? }]
       const res = await fetch(`${API_BASE}/api/grade/submit`, {
         method: "POST", credentials: "include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           source,
           stdins: casesPlan.map(c => c.stdin),
           expected: casesPlan.map(c => c.expected),
           hidden: casesPlan.map(c => !!c.hidden),
           cpuTimeLimit, memoryLimit,
         }),
       });
       if (res.status === 503) { _judgeAvailable = false; throw new Error("grader unavailable"); }
       if (!res.ok) throw new Error(`grader ${res.status}`);
       return await res.json();
     }

     // 호환: 기존 runC 호출자(lessons.js)를 위한 1건 래퍼.
     // verdict는 백엔드 표준("ok"/"wrong"/...) 그대로. lessons.js는 step 5에서 "ok"로 마이그레이션.
     export async function runC(source, stdin) {
       const out = await runCMany(source, [stdin]);
       const c = out.cases?.[0] || {};
       return {
         verdict: out.compile?.ok === false ? "compile" : (c.verdict || "system"),
         stdout: c.stdout || "",
         stderr: c.stderr || "",
         compileOutput: out.compile?.output || "",
         statusDescription: c.statusDescription || "",
         timeMs: c.timeMs ?? null,
         memoryKb: c.memoryKb ?? null,
       };
     }

     export function normalizeOutput(s) { /* 유지 */ }
     export function gradingSample(problem, count = 100) { /* 유지 */ }
     ```
   - verdict 표준: `"ok" | "wrong" | "tle" | "runtime" | "compile" | "system" | "output_limit"`

4. **`test-problem.js` 호출부 교체 (리뷰 반영: submit은 submitCMany 사용)**
   - `runAllCases()`: for 루프 제거. `await runCMany(code, cases.map(c => c.input + "\n"))` 한 방. 응답의 `compile.ok===false` 분기로 모든 케이스 마킹, 아니면 `cases[i]`에 결과 주입
   - `submitTest()`:
     - easy 경로 `gradingSample(problem, 10)` → `gradingSample(problem, 100)` (PoC 후 조정)
     - 시퀀셜 for-루프 + per-case `runC` 제거 → **`submitCMany(code, casesPlan)`** 한 번 호출
     - `casesPlan` = `[{ stdin, expected, hidden }]`. 백엔드 응답의 `passed/total/firstFail` 그대로 표시
     - mock 분기는 catch에서 처리 (judgeAvailable() === false 또는 fetch throw)
     - hidden 케이스의 expected는 백엔드로는 보내지만 sessionStorage에는 기존처럼 `null`로 저장 (현재 코드 유지)
   - `judgeAvailable`은 boolean이 아니라 함수 호출 (`if (!judgeAvailable())`)

5. **`lessons.js` 마이그레이션 (리뷰 반영: 누락 caller 포함)**
   - `import { runC, normalizeOutput, judgeAvailable } from "./judge.js"` 유지
   - `if (!judgeAvailable)` → `if (!judgeAvailable())`
   - `result.verdict === "accepted"` → `result.verdict === "ok"` (2곳: line 321, line 325)
   - `runC` 호출은 그대로 (호환 래퍼 사용)
   - 503/네트워크 에러 catch → 기존 mock/안내 경로로
   - 손-검증: 강의 페이지에서 코드 실행 정상 동작 확인

6. **샘플링 정책 정리**
   - `medium`/`killer`는 `getGradingCases(problem)` 그대로 사용
   - `easy`만 `gradingSample(problem, 100)`
   - 백엔드 `GRADER_MAX_CASES` 초과 시 프론트가 잘라서 보내고 `console.warn`

7. **환경 변수 / 문서**
   - `backend/.env.example`:
     ```
     # 자체 채점기
     GRADER_DOCKER_IMAGE=gcc:9
     GRADER_COMPILE_TIMEOUT_MS=10000
     GRADER_RUN_TIMEOUT_MS=2000
     GRADER_MEMORY_MB=128
     GRADER_MAX_CASES=200
     GRADER_MAX_SOURCE_BYTES=102400
     GRADER_MAX_STDIN_BYTES=16384
     GRADER_MAX_OUTPUT_BYTES=65536
     GRADER_JOB_TIMEOUT_MS=30000
     GRADER_MAX_CONCURRENT=4
     GRADER_QUEUE_MAX=20
     GRADER_QUEUE_WAIT_MS=10000
     GRADER_RATE_PER_MIN=30
     GRADER_UNSAFE_NOCONTAINER=0
     ```
   - `frontend/.env.example`: `VITE_JUDGE0_*` 삭제, `VITE_API_BASE=http://localhost:3000` 추가
   - `backend/README.md`: `/api/grade/run` / `/api/grade/submit` curl + 401/429/503 응답 정책 + Docker 설치 안내
   - `CLAUDE.md`: `judge.js`/`grader.js`/`lessons.js` 줄 갱신

8. **E2E**
   - `frontend/playwright.config.ts`: 빈 `VITE_JUDGE0_*` 강제 → 신규 mock 결정 로직(백엔드 미가용 → mock)에 맞게 갱신
   - 백엔드 미기동 → 503 → mock 분기 → 기존 테스트 통과

## Data / API / Storage

- 신규 엔드포인트 (모두 **로그인 필요**, 429/503 가능):
  - `POST /api/grade/run` body `{ source, stdins[], cpuTimeLimit?, memoryLimit? }`
    → `{ compile:{ok,output}, cases:[{stdout, stderr, verdict, timeMs, memoryKb, statusDescription?}] }`
  - `POST /api/grade/submit` body `{ source, stdins[], expected[], hidden[], cpuTimeLimit?, memoryLimit? }`
    → `{ compile, passed, total, firstFail?: {index, label, verdict, expected?, actual?}, cases?: [{verdict, pass, timeMs, memoryKb}] }`
    - hidden=true 케이스는 응답 cases[i]에서 `stdout`·`expected` 마스킹(누락), pass만 노출. firstFail이 hidden인 경우 expected/actual도 마스킹
- verdict 집합: `"ok" | "wrong" | "tle" | "runtime" | "compile" | "system" | "output_limit"`
- SessionStorage 키 변경 없음
- DB 스키마 변경 없음
- 인증: `loadSession` 미들웨어로 비로그인 401 (CLAUDE.md의 쿠키 세션)

## Risks / Assumptions

- **Windows + Docker bind mount 권한** — `--user 65534`로 떨어뜨릴 때 Windows host bind mount는 권한 매핑이 달라 실행 실패 가능. 대응: 컴파일 root + 실행 nobody 분리 또는 named volume [?]
- **Docker 데몬 호출 비용** — 호출당 100~300ms. step 2의 sh 묶음 전략으로 컨테이너 1회만 띄움
- **gcc:9 이미지 ~1GB** — README에 사전 pull 안내
- **인증 + 레이트리밋의 부작용** — Playwright e2e는 비로그인 → 401 → mock 폴백으로 흘러야 함. test fixture에서 백엔드 미기동을 가정하니 영향 없음
- **세션 기반 레이트리밋의 우회** — 로그인 자체가 무료 자동가입이라 진짜 abuse 방어는 약함. 다만 "1회 가입 = 분당 30콜" 정도면 자동화된 마이닝 페이로드는 비효율로 차단 가능. 후속에 captcha/이메일 인증 의무화로 강화
- **[?] easy grading count 기본값** — 10 → 100. PoC 후 조정
- **[?] judgeAvailable 함수화로 인한 호환** — `if (!judgeAvailable)` 형태를 쓰는 호출자가 lessons.js 외에 더 있으면 모두 함수 호출로 변경 필요. 마이그레이션 시 grep으로 전수 확인
- **호환 래퍼 runC 의 동작** — `verdict === "accepted"`를 쓰는 잔존 호출자가 있을 가능성 → migration 전 grep으로 0건 확인 (현재 lessons.js 외엔 없음을 codex 리뷰가 확인)

## Verification

- 백엔드 단위 손-검증 (curl):
  - 정상 / 컴파일 에러 / TLE / segfault / 큰 출력 / 비로그인 / 레이트리밋 초과 / 큐 포화
  - 100케이스 부하 → 5초 내 응답 (Docker 모드, 한 컨테이너 안에서 sh 묶음)
- 보안 회귀 4종 (악성 코드) — 호스트 영향 zero (CPU·메모리·디스크·네트워크)
- 동시성 — 5개 동시 요청 → 4개는 처리, 1개 큐 대기 → 큐가 비면 처리 (`GRADER_MAX_CONCURRENT=4`)
- 레이트리밋 — 한 세션이 분당 31번째 요청에 429 (`Retry-After` 헤더)
- 프론트 통합:
  - `npm run dev` → 로그인 후 `test-problem.html` "코드 실행"·"제출 및 채점" 동작
  - 강의 페이지(lessons) 코드 실행 동작 (verdict 마이그레이션 검증)
  - 백엔드 끈 채로 새로고침 → 자동 mock 폴백
- E2E: `npm run test:e2e` 통과
- 빌드: `npm run build` 에러 없음 (frontend Vite 번들에 RapidAPI 흔적 0)
