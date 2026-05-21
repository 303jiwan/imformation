# Implementation Plan (AR 반영) — test-concepts 기본 개념 설명 보강

## Goal
test-concepts.html의 12개 C 기본 개념 카드가 1줄 `desc`만 보여줘 부족함. 각 개념에 요약·예시 코드·자주 하는 실수까지 노출해 학습 효과 강화. 동시에 체크박스 선택과 "자세히" 보기 동작을 **DOM 구조 수준에서** 분리해 상태 오염 차단.

## AR 반영 핵심 변경
**자세히 버튼은 `<label>` 안에 두지 않는다.** label은 체크박스 선택 영역만 감싸고, "자세히" 버튼은 같은 tile 컨테이너 안 **sibling**으로 배치. → 마우스 클릭/Enter/Space/모바일 탭/합성 클릭 어떤 경로로도 체크박스 토글 위험 없음. `event.stopPropagation()` 의존 제거.

### tile DOM 구조 (변경 후)
```html
<div class="concept-tile">
  <label class="concept-tile__select">
    <input type="checkbox" name="concept" value="..." />
    <span class="concept-tile__tag">기초</span>
    <div class="concept-tile__head">
      <h3 class="concept-tile__name">...</h3>
      <span class="concept-tile__check" aria-hidden="true">✓</span>
    </div>
    <p class="concept-tile__desc">...</p>
  </label>
  <button type="button" class="concept-tile__detail-btn"
          data-concept-id="..."
          aria-haspopup="dialog"
          aria-controls="concept-detail-modal">
    자세히
  </button>
</div>
```
- 외곽 `<div class="concept-tile">`이 wrapper.
- `<label>`이 체크박스 + 라벨 콘텐츠만 감쌈. label 활성화 시 체크박스만 토글.
- `<button>`은 label 밖. `type="button"` 명시(폼 submit 방지). `aria-haspopup="dialog"` + `aria-controls`.
- 버튼 클릭 핸들러는 그냥 모달 열기 — propagation 차단 불필요(label 외부라).

## 변경 파일

### frontend/src/test-concepts.js
- `CONCEPTS` 항목마다 `detail` 객체 추가:
  ```js
  detail: {
    summary: string,     // 2~3문장 풀어쓴 개념 요약 (한국어)
    example: string,     // 핵심 문법 보여주는 짧은 C 코드 (gcc -std=c99 기준, 컴파일 가능)
    pitfalls: string[],  // 초보자가 자주 하는 실수 1~2개
  }
  ```
- 12개 항목 전부 작성 (`vars`, `operators`, `cond`, `loops`, `arrays`, `strings`, `functions`, `io`, `pointers`, `structs`, `memory`, `recursion`).
- `renderTiles()` 리팩터: tile 마크업을 위 새 구조로 출력. 체크박스/카운트 selector는 기존과 동일하게 `input[name=concept]:checked` 유지(`getCheckedIds`/`setCheckedIds` 무수정).
- "자세히" 버튼에 `addEventListener("click", ...)` → `openDetailModal(conceptId)`. propagation 차단 코드 **없음**(불필요).
- 모달 open/close 헬퍼:
  - `openDetailModal(id)` — 모달에 detail 데이터 주입 후 `hidden=false`, 직전 포커스 저장, `<button class="close">`에 포커스 이동.
  - `closeDetailModal()` — `hidden=true`, 저장한 직전 포커스 복원.
  - 닫기: 닫기 버튼 클릭, backdrop 클릭(`[data-close]`), 모달 열려있을 때 `keydown Escape`.
  - 모달 열린 동안 `aria-hidden` 토글, 페이지 스크롤 잠금은 생략(가벼움). [?]

### frontend/test-concepts.html
- 기존 `auth-modal` 옆에 `concept-detail-modal` 마크업 추가. id 충돌 없게 `id="concept-detail-modal"`.
- 내부 슬롯: `.detail__tag`, `.detail__name`, `.detail__summary`, `<pre class="detail__example">`, `<ul class="detail__pitfalls">`.
- 닫기 버튼 `aria-label="닫기"`.
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` 명시.

### frontend/src/style.css
- 신규 클래스: `.concept-tile`(이전 label 클래스를 wrapper로 승격), `.concept-tile__select`(label), `.concept-tile__detail-btn`(sibling button).
- 기존 `.concept-tile` 스타일이 label에 걸려있으면 이름 재배치(wrapper로 옮기고 label은 `.concept-tile__select`로 분리). 회귀 막으려 기존 selectors 점검 필수.
- 모달: `.concept-detail-modal` (기존 `.modal` 패턴 재사용 가능하면 재사용, 충돌 시 BEM 분리). `.detail__example` 코드 블록 모노스페이스 + 가로 스크롤 허용.

## 데이터/API/스키마
없음. sessionStorage 키/형태(`codenergy:test:concepts`) 불변. 백엔드 변경 없음.

## 리스크/가정
- 기존 `.concept-tile` 셀렉터가 label에 직접 걸려 있어 wrapper 분리 시 스타일 회귀 가능 → C 역할이 기존 CSS 전부 grep해서 .concept-tile* 셀렉터 영향 파악 후 마이그레이션.
- 콘텐츠 정확성: 12개 detail 본문 Claude가 작성. `gets()`/`itoa` 등 비표준·금지 함수 사용 금지. printf 형식 지정자는 `%d`,`%f`,`%c`,`%s` 등 표준만.
- i18n 토큰: 다른 페이지에 `data-i18n` 토큰 다수. 신규 detail 콘텐츠는 **한국어 하드코딩**으로 시작. 모달 chrome(닫기 버튼 등)도 한국어 하드코딩.
- 모달 접근성: focus trap은 MVP에서 생략(닫기 버튼에만 포커스 이동 + ESC 동작). 추후 강화. [?]

## 검증
- `npm run dev` → http://localhost:5173/test-concepts.html
  - 12개 tile 모두 "자세히" 버튼 노출
  - 마우스 클릭 → 모달 열림, 체크박스 상태 **변화 없음**
  - 자세히 버튼에 키보드 포커스 → Enter/Space → 모달 열림, 체크박스 상태 변화 없음
  - 모바일 viewport(DevTools 토글) 탭 → 모달 열림, 체크박스 상태 변화 없음
  - 체크박스/label 영역 클릭 → 체크박스 토글, 모달은 열리지 않음
  - 모달 닫기: 닫기 버튼, backdrop, ESC 모두 동작
  - 모달 닫힌 후 직전 포커스가 자세히 버튼으로 복귀
  - 시작/전체선택/모두해제 회귀 없음
- `npm run build` 성공
- `npm run test:e2e` 기존 케이스 회귀 없음

## prompt.md 두 번째 항목 (컴파일러 설치) — 이번 plan 제외
WSL/Docker 사용자 수동 설치 대기 중. 설치 완료 알림 받으면 별도 `backend/.env` 수정.

## 에이전트 로스터

### A. 콘텐츠 작성
- 담당: `frontend/src/test-concepts.js`의 `CONCEPTS[*].detail` 12개 셋 본문 작성.
- 산출물: detail 12개 summary/example/pitfalls 완성. example C 코드는 컴파일 가능한 완전 스니펫(`#include` + `main` 또는 함수 단위로 자체 설명 가능한 형태).
- 의존성: 없음(병렬 안전). 스키마는 plan에서 고정.
- 포함 이유: 콘텐츠 품질이 핵심 가치. 코드/디자인과 분리 검토.

### B. 기능구현 (프론트 로직)
- 담당: `frontend/src/test-concepts.js`의 `renderTiles()` 리팩터, tile DOM 새 구조, "자세히" 버튼 핸들러, 모달 open/close 헬퍼, 포커스 관리.
- 산출물: 동작하는 모달 토글. 마우스/키보드/모바일 모든 경로에서 체크박스 오염 없음.
- 의존성: A의 detail 스키마와 합의된 키만 사용. **A 완료 후** 통합.
- 포함 이유: AR 지적 핵심 — DOM 구조 변경 + 이벤트 안전성.

### C. 디자인/UI
- 담당: `frontend/test-concepts.html` 모달 마크업(`role="dialog"` + ARIA) + `frontend/src/style.css` 신규 클래스. 기존 `.concept-tile`/`label` 셀렉터 마이그레이션도 책임.
- 산출물: 마크업 + 스타일. 기존 그리드 레이아웃 회귀 없음.
- 의존성: B의 새 DOM 구조 클래스명과 합의(plan에 고정) → B와 병렬 안전, A와도 병렬 안전.
- 포함 이유: HTML/CSS 신규 + 기존 셀렉터 마이그레이션.

### 제외
- 백엔드: 변경 없음.
- 테스트(e2e 신규): scope 작음 + 명시 요청 없음. 검증은 수동 + 빌드 + 기존 e2e 회귀.

### 실행 그래프
1. **A** 먼저 (콘텐츠 12 항목).
2. A 끝나면 **B + C** 병렬 (스키마/클래스명 plan에 고정돼 충돌 없음).
3. 메인 통합 검증.
