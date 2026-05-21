# Implementation Plan (AR 반영) — Trail 0 커리큘럼 확장

## 목표 (Goal)
Trail 0 (Codetree 101) 커리큘럼을 trail.js 챕터 정의에 맞춰 lesson-data.js + backend lesson-catalog에 추가한다. 사용자 명시: 조건문 if/else/else if/switch, 반복문 for/while/do-while, 별 찍기. AR 반영 두 가지: (1) 기존 prereq 절대 변경 금지, (2) 채점에 hidden test case 도입(공개 example과 분리).

## AR 반영 핵심 변경

### A. Prereq 무손상 원칙
- **기존 ID(t0-ch1-1 ~ t0-ch1-4, t0-ch2-1 ~ t0-ch2-4, t0-ch3-1, t0-ch3-2)의 prereq 절대 변경 금지.** 진행 중 사용자 잠금 위험 차단.
- 신규 레슨은 모두 **기존 체인의 가장 끝(t0-ch3-2) 이후에만 append**.
- 결과: trail.js의 Ch1 node5 "변수와 자료형", Ch2 node5 "표준 입출력"은 **이번 PR 범위에서 제외**(트레일 사이드바엔 노드 라벨만 존재, 클릭 시 "준비 중" 표시). 추후 별도 PR로 처리.
- 신규 추가 lesson 13개 (다듬어진 범위):
  - Ch3 보강(2): `t0-ch3-3` if/else, `t0-ch3-4` switch
  - Ch4 신규(4): `t0-ch4-1` for, `t0-ch4-2` while, `t0-ch4-3` do-while, `t0-ch4-4` 중첩 반복(별 찍기)
  - Ch5 신규(4): 배열 선언, 입출력, 2차원, 순회
  - Ch6 신규(3): char 배열, strlen, strcmp (4-node 라벨 중 3개로 축소; "문자열 출력"은 1번에 흡수)
- prereq 체인: `t0-ch3-2 → ch3-3 → ch3-4 → ch4-1 → ch4-2 → ch4-3 → ch4-4 → ch5-1 → ch5-2 → ch5-3 → ch5-4 → ch6-1 → ch6-2 → ch6-3`.

### B. Hidden test case 도입
- backend `lesson-catalog.js` problem schema 확장:
  ```js
  // 기존
  "t0-chN-M-bX": { kind, expected, input, judge0Lang }
  // 변경: cases 배열
  "t0-chN-M-bX": {
    kind, judge0Lang,
    cases: [
      { input, expected, public: true  },   // lesson-data example과 동일
      { input, expected, public: false },   // 서버 전용 hidden
    ],
  }
  ```
- backend grader/submit 경로(`/api/learn/submit`) 손봄: 전 case 통과 시에만 correct. `cases`가 없으면 fallback으로 기존 `expected/input` 단일 case 사용(기존 lesson 호환).
- `check-catalog-sync.mjs` 보강: 신규 lesson은 `cases` 최소 1개 hidden 포함 검증. 기존 lesson은 변경 없음(legacy 통과).
- frontend `lesson-data.js`의 `example` 필드는 **public case와 동일**한 값만. hidden case는 절대 노출 안 함.

## 변경할 파일 (Files)

### 1. `backend/src/lesson-catalog.js`
- Trail 0 영역 끝(line 102 `// === END Trail 0 ===` 직전)에 신규 13개 lesson 추가.
- 각 lesson은 `cases` 배열 사용. `b1`/`p1` 각각 public 1 + hidden 1~2.

### 2. `backend/src/learn-grader.js` (또는 `/api/learn/submit` 핸들러 위치)
- 채점 로직 변경: catalog problem에 `cases` 배열 있으면 전부 실행해 모두 통과해야 correct. 없으면 기존 단일 expected 비교.
- **사전 조사 필요**: 채점 코드 정확한 위치 확인(t0-* 채점이 grader.js 또는 별도 learn route). 현재 plan에선 위치 가정 — builder가 코드 위치 확정.

### 3. `backend/scripts/check-catalog-sync.mjs`
- 신규 lesson(`cases` 사용 lesson)이 hidden case 최소 1개 가지는지 추가 검사. 기존 lesson은 면제.

### 4. `frontend/src/lesson-data.js`
- 신규 13개 lesson 추가. `example.input/output`은 public case 값 그대로(클라이언트 노출 OK).

## 단계 (Steps)

1. **사전 조사**(builder 시작 전): `/api/learn/submit` 채점 코드 위치 확정. grader.js? auth.js? test.js? routes 분리?
2. backend lesson-catalog cases 스키마 확장 + 신규 13 lesson 추가.
3. backend submit 핸들러: `cases` 배열 지원. 기존 단일 expected fallback 유지.
4. check-catalog-sync.mjs: cases 사용 lesson에 hidden 1개+ 검증.
5. frontend lesson-data.js 신규 13 lesson 추가 (example = public case).
6. **검증**:
   - `node backend/scripts/check-catalog-sync.mjs` 통과.
   - `npm run build` 무에러.
   - dev 서버 띄워 t0-ch3-3 / t0-ch4-4 노드 클릭 → 레슨 표시, "레슨 시작하기 →" 진입.
   - 별 찍기 b1 정답 코드 직접 제출 → public + hidden 모두 통과 verdict 확인.
   - 기존 ch1-1~ch3-2 정답 제출 → 여전히 correct(legacy 호환).

## 별 찍기 case 설계 (구체)

`t0-ch4-4-b1` 직각삼각형:
- stdin으로 N 받게 문제 재설계 (단일 expected 하드코딩 차단):
  - desc: "양의 정수 N을 입력받아 별로 직각삼각형(높이 N) 그리기"
  - public case: input="4\n", expected="*\n**\n***\n****\n"
  - hidden case 1: input="2\n", expected="*\n**\n"
  - hidden case 2: input="6\n", expected="*\n**\n***\n****\n*****\n******\n"
- starter `scanf("%d", &n)` 사용. 클라가 public expected 하드코딩 → hidden 실패.

## 데이터/스키마/API 변경
- backend catalog schema: `expected/input` → `cases: [{input, expected, public}]` (옵션 필드, 둘 다 지원).
- `/api/learn/submit` 응답 형식 변경 없음(verdict 그대로). 단, 내부적으로 multi-case 평가.
- sessionStorage 키 변경 없음.
- DB 변경 없음.

## 리스크 / 가정
- **리스크 1 — 채점 핸들러 위치 미확정**: builder가 시작하기 전 reading 단계에서 정확한 코드 위치 찾아야. 현재 plan은 "어딘가에 있다" 가정.
- **리스크 2 — Schema dual-shape 복잡도**: cases vs expected 두 형태 분기 → 버그 가능. fallback 명확히 작성하고 양쪽 다 테스트.
- **리스크 3 — 콘텐츠 분량**: 13 lesson × (concept 5~7 sections + 2 problems × 2~3 cases) = 작성 분량 큼. 그러나 trail 1 lesson과 동일 패턴 복붙 가능.
- **리스크 4 — Trail 0 stops at Ch6**: Ch1-5/Ch2-5/Ch7~Ch11은 후속 PR. 사용자에 별도 사후 처리 알림 필요. ⚠️ 사용자가 "커리큘럼 다 추가하라고" 했으므로, 이번 PR 끝낸 뒤 follow-up 명시.
- **가정**: backend submit 핸들러가 단순 expected 문자열 비교 사용 중. 더 복잡한 평가(주관식 등) 없음.

## 검증 방법
- [ ] `node backend/scripts/check-catalog-sync.mjs` 통과(신규 lesson hidden case 검증 포함).
- [ ] `npm run build` 무에러.
- [ ] 신규 노드 13개 클릭 → 레슨 표시.
- [ ] 별 찍기 b1: 정답 코드 제출 → correct (public+hidden 모두 통과).
- [ ] 별 찍기 b1: expected 하드코딩 코드 제출 → wrong(hidden case 실패).
- [ ] 기존 ch1-1 정답 제출 → 여전히 correct(legacy 단일 expected 경로).
- [ ] 사용자 시나리오: ch1-4 done 상태에서 ch2-1 unlock 유지(prereq 무변경 확인).

## 에이전트 로스터 (Agent Roster)

| 역할 | 담당 파일/범위 | 산출물 / 완료 조건 | 의존성 | 포함/제외 이유 |
|---|---|---|---|---|
| **백엔드(스키마+채점)** | `backend/src/lesson-catalog.js` schema 확장 + `/api/learn/submit` 핸들러 multi-case 지원 + `check-catalog-sync.mjs` 보강 | catalog cases 배열 지원, fallback 동작, sync 스크립트 hidden 1개+ 검증. 정답/하드코딩 테스트 통과 | **선행** — 프론트엔드/콘텐츠보다 먼저. 스키마 fixed돼야 콘텐츠 작성 가능 | 채점 데이터 스키마 변경 + 채점 코드 손봄 필수 → 포함 |
| **백엔드(콘텐츠)** | `backend/src/lesson-catalog.js` 신규 13 lesson 추가 (public+hidden cases) | 13개 CATALOG 엔트리, 각 b/p problem cases 배열, prereq 체이닝 정확 | 스키마 작업 후 **순차 실행** | catalog 데이터 작성 → 포함 |
| **프론트엔드(콘텐츠)** | `frontend/src/lesson-data.js` 신규 13 lesson 추가 | LESSONS 엔트리 13개, concept.sections 5~7, problems.example = public case 그대로 | 백엔드(콘텐츠) 완료 후 순차(또는 동시 작성, public case 사양 plan에 박혀 있어 병렬 안전) | 레슨 본문/문제 콘텐츠 → 포함 |
| **테스트** | 통합 검증 + 사용자 시나리오 확인 | `check-catalog-sync.mjs` + `npm run build` + dev 서버 수동 클릭 + 별 찍기 정답/하드코딩 제출 결과 캡처 + ch1-1 legacy 경로 확인 | 위 세 역할 완료 후 | 채점 회귀 위험 큼 → **수동 검증** 필수 포함 |

**제외**:
- **디자인/UI**: 사이드바 이미 scrollable, HTML/CSS 변경 없음 → 제외.
- **DB 마이그레이션**: 스키마 변경은 in-memory catalog만, DB 무변경 → 제외.
- **인프라/CI**: 무변경 → 제외.

## 우선순위 축소 결정 메모
- AR 반영으로 신규 lesson 33 → 13개로 축소. 함수/포인터/구조체/동적메모리/재귀(ch7~ch11) + Ch1-5/Ch2-5는 사용자에게 follow-up 제안.
- 사용자가 명시한 핵심: 조건문 세분화 + 반복문 + 별 찍기 → 모두 포함됨.
