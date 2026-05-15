# Implementation Plan (review target)

# Implementation Plan v2 — 코딩 학습 흐름 (AR review 반영)

## Goal
trail.html 육각형 노드 = 학습 단위. 레슨 시작하기 → (개념 → 기본/연습 문제 → 채점 → 다음 레슨). 진행률은 codetrails 카드 게이지 누적. 1차 범위: Trail 0(프로그래밍 시작) Ch1·Ch2 + Trail 1(프로그래밍 기초) Ch1·Ch2.

## AR 리뷰 반영 요약 (변경점)
1. **서버 소유 lesson catalog**: `backend/src/lesson-catalog.js`에 lesson/problem 메타(id, 소속, prerequisite, expected)를 둠. 프론트엔드 `lesson-data.js`는 표시용 텍스트만; expected/prereq는 서버 단독 보유.
2. **submit 강제 검증**: lesson 잠금/`problem_id ∈ lesson` 멤버십/이전 레슨 완료 여부를 트랜잭션 안에서 확인. 위반 → 4xx, 진도 변경 없음.
3. **mock vs judge 등급 분리**: mock 채점은 `verdict: "ungraded"`로만 저장(non-credit). 영구 `done` 진행은 judge0 실행 결과만 인정. judge0 키 없으면 "연습용 — 진도 미반영" 배지 표시.
4. **진행률 상태 분리**: `unauthenticated / loading / error / ok(0~100%)` 4상태로 게이지 렌더. error는 마지막 캐시값 + 재시도 버튼.

## 변경할 파일

### Frontend
- `frontend/lessons.html` 신규
- `frontend/src/lessons.js` 신규
- `frontend/src/lesson-data.js` 신규 — **표시용 메타만** (expectedOutput 없음)
- `frontend/src/trail.js` 수정 — hex 클릭 시 우측 패널 동적 갱신 + "레슨 시작하기" → `lessons.html?lesson={id}`
- `frontend/src/codetrails.js` 신규 — `/api/learn/progress` 호출, 4상태
- `frontend/src/style.css` — lessons + 게이지(에러/로딩 배지) CSS
- `frontend/vite.config.js` — `lessons` 엔트리

### Backend (보안 핵심)
- `backend/src/lesson-catalog.js` 신규 — 서버 진실의 원천 (id, prereq, expected, input)
- `backend/src/db.js`
  - `lesson_progress(user_id, lesson_id, status, completed_at)` PK (user_id, lesson_id)
  - `lesson_attempts(id, user_id, lesson_id, problem_id, code, verdict, ungraded INTEGER, submitted_at)`
- `backend/src/learn.js` 신규
  - `GET /api/learn/progress` — 트레일별 진도. 비인증 → 401
  - `GET /api/learn/lesson/:id` — 잠금/다음 레슨
  - `POST /api/learn/submit` — 트랜잭션:
    1. validateMembership → 422
    2. isUnlocked → 423
    3. judge0 enabled → 실행 (ungraded=0) / 미설정 → mock (ungraded=1)
    4. insert attempt
    5. ungraded=0 + 모든 문제 통과 → progress 'done' (idempotent)
- `backend/src/index.js` — 라우터 마운트

### Tests
- `frontend/tests/e2e/lessons-flow.spec.ts`
- `frontend/tests/e2e/trail-progress.spec.ts` — 4상태 검증
- `backend/tests/learn.test.js` (Node test runner)
  - locked submit → 423
  - 다른 레슨 problem_id → 422
  - judge0 미설정 + 정답 → ungraded, progress 변동 없음
  - judge0 mock pass + 전체 통과 → done
  - 같은 통과 두 번(replay) → idempotent
  - 비인증 progress → 401

### CI 안전망
- `backend/scripts/check-catalog-sync.mjs` — `lesson-data.js`와 `lesson-catalog.js`의 id/구조 매칭 강제. 빌드 시 실행

## 데이터 모델

### Frontend `lesson-data.js` (표시용)
```js
{
  id: "t0-ch1-1", trail: 0, ch: 1, no: 1, title: "출력 입문",
  concept: { sections: [...] },
  problems: {
    basic: [{ id: "t0-ch1-1-b1", title: "단어 출력", diff: "Easy", xp: 10, desc: "...", example: { input: "", output: "Hello" } }],
    practice: [...]
  }
}
```

### Backend `lesson-catalog.js` (검증)
```js
{ "t0-ch1-1": { trail: 0, prereq: null, problems: { "t0-ch1-1-b1": { kind: "basic", expected: "Hello\n", input: "", judge0Lang: "c" } } } }
```

## Steps

### 0단계 — 인프라 + 보안 골격 (총괄, 직접)
1. db 스키마 + 마이그레이션
2. `lesson-catalog.js` 빈 객체 + 헬퍼
3. `learn.js` 3개 라우트 (인증/검증/트랜잭션 다)
4. `lesson-data.js` 빈 객체 + 헬퍼
5. `lessons.html` + `lessons.js` 골격
6. catalog-sync 스크립트

### 1단계 — Trail 0 / Trail 1 콘텐츠 (병렬, worktree)

#### Trail 0 그룹 (worktree-trail0)
- Ch1 (출력 입문/변수/기본 자료형/연산자) + Ch2 (출력/입력 입문/입력/입출력 연습) — 8 레슨
- lesson-data.js (표시) + lesson-catalog.js (검증) 같이 작성
- Trail 0 전용 e2e spec
- 문제 출처: 기존 test-problems.js 재활용 + 신규
- green 테마

#### Trail 1 그룹 (worktree-trail1)
- Ch1 (8개) + Ch2 (6개) — 14 레슨
- 난이도 Easy 70 / Medium 25 / Hard 5%
- yellow 테마

### 2단계 — 통합 (총괄)
1. 두 worktree 머지 (충돌 해결)
2. catalog-sync 통과 확인
3. `npm run build` + `npm run test:e2e` + `node --test backend/tests/learn.test.js`
4. dist 리빌드 커밋

## Grading 흐름
```
client submit → POST /api/learn/submit
  ↳ requireAuth → 401
  ↳ validateMembership(lesson_id, problem_id) → 422
  ↳ isUnlocked(userId, lesson_id) → 423
  ↳ judge0 enabled?
       yes → judge0 (ungraded=0) using catalog.expected
       no  → mock (verdict='ungraded', ungraded=1)
  ↳ insert lesson_attempts
  ↳ if ungraded=0 AND 모든 문제 통과 → lesson_progress 'done'
  ↳ return { verdict, ungraded, lessonStatus, nextLessonId }
```

## 진행률 게이지 4상태
| 상태 | 조건 | 표시 |
|------|------|------|
| `unauthenticated` | 401 | "로그인하면 진도 기록" 배지 + 0% (회색) |
| `loading` | 첫 fetch | 펄스 스켈레톤 |
| `error` | 4xx/5xx (≠401) or 네트워크 실패 | 마지막 캐시값(localStorage) + ⚠ + 재시도 |
| `ok` | 정상 | 실제 % + 트레일 색상 |

## 멀티 에이전트
- **총괄**: 이 세션. 0/2단계 직접, 1단계 launch.
- **Trail 0 / Trail 1**: 각 1개 general-purpose sub-agent (worktree isolation), 1 worktree 내에서 디자인/기능/백엔드 검증/콘텐츠/테스트 4 hat 순차 처리. 4×2=8 분리는 같은 파일 머지 비용 폭증으로 비추천.

## 리스크 / 가정
- `[?]` 100+ 레슨 중 22개만 1차 — 사용자 OK 가정
- judge0 free 50/day, 수업용 부족할 수 있음 (mock은 진도 미반영)
- catalog-sync는 빌드 타임 강제 (한쪽만 수정 → 빌드 실패)
- lesson_attempts 무한 누적, 후속 정리
- 두 worktree 충돌(trail.js / style.css / db.js) 거의 확실, 머지 시간 들어감

## 검증
- `node backend/scripts/check-catalog-sync.mjs` exit 0
- `npm run build`
- `npm run test:e2e`
- `node --test backend/tests/learn.test.js` (6 시나리오)
- 수동: mock 정답 → ungraded, 게이지 변동 없음 / judge0 정답 → done + 게이지 1/22 / 비로그인 → "로그인하면 진도 기록" 배지
