# Implementation Plan (review target)

# Implementation Plan — 아바타 페이지 전면 재설계

## 목표 (Goal)
현재 아바타 페이지(`avatar.html` + `src/avatar/*` + `src/avatar.js`) 코드를 모두 제거하고, `image.png` 시안에 맞춰 **사용자명 배지 → 캐릭터 미리보기 → 3단(Body/Clothing/Accessories) 탭 → 색상 팔레트 → 아이템 그리드 → Back/Finish Editing** 구조의 새 아바타 에디터를 구현한다. 로그아웃 상태에서 아바타로 진입하려는 모든 경로(헤더 nav 버튼, `/avatar.html` 직접 접속)에서 로그인 모달이 뜨도록 보장한다.

## 변경할 파일 (Files)

### 삭제/완전 재작성
- `frontend/src/avatar.js` — 컨트롤러 처음부터 새로. 새 schema와 새 UI 트리에 맞춰.
- `frontend/src/avatar/character.js` — 새 schema(`body / clothing / accessories`)에 맞춰 SVG 합성 로직 새로. 기본 캐릭터는 단순 SVG(머리/몸/팔/다리 + 피부톤/표정 고정).
- `frontend/src/avatar/outfits.js` — 새 카탈로그. 카테고리당 7~8개 항목(악세사리는 "없음" + 7개). 이미지의 4×2 그리드에 맞춤.
- `frontend/src/avatar/avatar.css` — 시안에 맞춰 다크 보라 배경 + 둥근 카드 + 탭/팔레트/그리드 스타일 처음부터.

### 부분 수정
- `frontend/avatar.html` — `<section class="avatar-page" id="avatar-root">` 내부 skeleton(`<div class="avatar-stage"><div class="avatar-character"></div></div><div class="avatar-editor"></div>`)을 비우고 `id="avatar-root"`만 남긴다. `.avatar-toast` div도 제거(컨트롤러가 렌더링하면서 만들도록). 헤더/모달 마크업과 script 임포트는 그대로.
- `frontend/tests/e2e/avatar.spec.ts` — 새 selector와 새 schema에 맞춰 케이스 4개를 업데이트. 로그아웃→로그인 모달 케이스만 그대로 통과해야 함.
- `frontend/tests/e2e/avatar-editor.spec.ts` — 마찬가지로 새 selector/schema로 마이그레이션. 백엔드 mock(`GET/POST /api/avatar`) 형식과 토스트 케이스 유지.

### 변경 없음
- `frontend/src/main.js` — `goAvatar()`가 로그아웃 시 `openLoginModal()`을 호출하는 분기가 이미 있음. 그대로 둠.
- `backend/src/avatar.js` — config을 opaque JSON blob으로 저장(16KB 제한). 새 schema 그대로 통과.
- `backend/src/db.js` — schema 변경 없음.

## 새 데이터 스키마

`localStorage["codenergy:avatar:config"]` 및 `POST /api/avatar` 바디:

```js
{
  body: {
    skinTone: "tone-2",                       // tone-1..tone-6 (id only)
    hair:    { style: "hair-short", color: "#1f2937" }
  },
  clothing: {
    top:     { style: "top-tee",   color: "#2563eb" },
    bottom:  { style: "bot-jeans", color: "#1f2937" }
  },
  accessories: {
    hat:     null | { style: "hat-cap",      color: "#ef4444" },
    glasses: null | { style: "glasses-round", color: "#000000" },
    other:   null | { style: "earring-stud",  color: "#fcd34d" }
  }
}
```

- 기존 `codenergy:avatar:equipped` 및 기존 평면 schema는 마이그레이션 없이 그냥 무시(첫 로드 시 default로 덮어씀). 레거시 키는 한 번 `localStorage.removeItem()`.
- sessionStorage 키는 추가/변경 없음.

## UI 구조 (image.png 기반)

```
┌─ avatar-page (다크 보라) ────────────────┐
│  ┌─ avatar-card (둥근 카드) ─────────┐  │
│  │  [사용자명 배지]                   │  │
│  │  ┌─ stage (벽돌 패턴 배경) ────┐ │  │
│  │  │      <SVG 캐릭터>            │ │  │
│  │  └────────────────────────────┘ │  │
│  │  ── tabs-primary: 신체│의상│악세 ─│  │
│  │  ── tabs-secondary: (가변) ────  │  │
│  │  ●●●●●●●●●  color row (옵션)    │  │
│  │  ┌─ 4×2 item grid ─┐            │  │
│  │  │ X  []  []  []   │            │  │
│  │  │ [] []  []  []   │            │  │
│  │  └─────────────────┘            │  │
│  │  [ Back ]   [ Finish Editing ]   │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

- 라벨은 모두 한국어(CLAUDE.md `Korean copy throughout` 규칙):
  - primary: `신체` / `의상` / `악세사리`
  - secondary:
    - 신체: `피부` / `머리`
    - 의상: `상의` / `하의`
    - 악세사리: `모자` / `안경` / `기타`
- 색상 팔레트는 `hasColor: true`인 sub-카테고리(`머리`, `상의`, `하의`, `모자`, `안경`, `기타`)에서만 표시. `피부`는 표시 안 함(피부 그리드 자체가 색 선택 역할).
- 악세사리 sub-카테고리는 `allowNone: true` — 그리드 첫 칸이 `X(없음)`.
- `Back` 버튼은 변경사항을 저장하지 않고 `index.html`로 이동(`location.href = 'index.html'`).
- `Finish Editing` 버튼은 `POST /api/avatar` 호출 후 성공 토스트 → `index.html`로 이동. 실패 시 빨간 토스트만 띄우고 페이지 유지.

## 단계 (Steps)

1. **준비**: e2e 두 스펙(`avatar.spec.ts`, `avatar-editor.spec.ts`) 현재 케이스 목록을 메모. 신규 selector 목록 확정.
2. **HTML 슬림화**: `avatar.html`의 `#avatar-root` 내부 자식을 비우고 `.avatar-toast`도 제거.
3. **CSS 재작성**: `avatar.css` 전체를 새로. BEM(`avatar-card`, `avatar-stage`, `avatar-tabs--primary`, `avatar-tabs--secondary`, `avatar-color-row`, `avatar-grid`, `avatar-item`, `avatar-actions`, `avatar-toast`). 카드 폭 `min(420px, 92vw)`.
4. **character.js 재작성**: 단일 export `renderCharacter(config)`. SVG viewBox `0 0 240 320`. 레이어 z-order: 다리 → 몸통 → 팔 → 하의 → 상의 → 머리 베이스(피부) → 표정(고정) → 귀걸이(other) → 머리카락 → 안경 → 모자. `SKIN_TONES` 6종, `normalizeConfig(raw)` 헬퍼 export.
5. **outfits.js 재작성**: `CATALOG = { hair, top, bottom, hat, glasses, other }`. 항목: `{ id, name, thumbnail, svgFragment(color) }`. 카테고리당 7개. thumbnail은 단순 SVG 또는 이모지.
6. **avatar.js 재작성**:
   - 새 schema로 `loadLocalConfig()` / `saveLocalConfig()` / `fetchRemoteConfig()` / `saveRemoteConfig()`. 레거시 `codenergy:avatar:equipped` 키만 `removeItem()`.
   - state: `config`, `activePrimary` (default `body`), `activeSecondary` (default `skin`).
   - 로그아웃 분기(`renderEmpty`): 즉시 헤더 로그인 모달을 자동으로 띄우고 페이지 본문은 비워둠. 모달이 닫힐 때(취소/배경) `location.replace('index.html')`.
   - 로그인 분기(`renderEditor`): 위 UI 구조 그대로 렌더링. 변경 시 `paintCharacter()` + `paintTabs()` + `paintGrid()` + `paintColorRow()`.
   - `Finish Editing` 핸들러: `await saveRemoteConfig()` 성공 시 토스트 후 `location.href = 'index.html'`. 실패 시 에러 토스트만.
7. **사용자명 배지**: 헤더의 `#my-name` / `localStorage["codenergy:demo:user"].username` / `/api/me` 응답에서 username 추출. fallback `'me'`.
8. **빌드/dev 확인**: `npm run build` 통과 확인. `npm run dev`로 띄워 수동 확인.
9. **e2e 마이그레이션**: 두 스펙을 새 selector/schema에 맞춰 수정.
10. **e2e 실행**: `npm run test:e2e` 통과 확인.

## 리스크 / 가정

- **기존 e2e 스펙이 모두 깨진다** — 같은 PR 안에서 마이그레이션해야 함.
- **레거시 사용자의 저장된 config** — `normalizeConfig()`가 default로 덮어씀. [?] 마이그레이션 필요 시 별도 작업.
- **i18n 키** — 한국어 하드코딩으로만. [?] 추후 i18n 키 필요 시 별도.
- **시안의 `Body/Clothing/Accessories` vs 한국어 라벨** — CLAUDE.md 규칙 우선해서 한국어 표기.
- **face와 background** — prompt 명시 없음. 표정 고정 1종, 배경 단일 벽돌 패턴.
- **사용자명 노출** — /api/me 응답이 늦으면 첫 페인트 때 `'me'` 표시 후 fetch 완료 시 갱신.

## 검증 방법

1. **빌드**: `npm run build` 통과.
2. **수동(dev)**: `npm run dev` 후
   - 로그아웃 + 헤더 "아바타" 클릭 → 로그인 모달
   - 로그아웃 + `/avatar.html` 직접 접속 → 로그인 모달
   - 데모 로그인 + 아바타 페이지 → 사용자명 배지, 캐릭터, 3단 탭, 그리드, 색상 표시
   - 신체→머리/피부, 의상→상의/하의, 악세사리→모자/안경/기타 (X 포함) 모두 즉시 반영
   - `Finish Editing` 클릭 → 토스트 + index.html 이동
   - 다시 아바타 페이지 들어가도 마지막 설정 유지
3. **e2e**: `npm run test:e2e` 통과(두 스펙 마이그레이션 포함).
4. **회귀**: index/pricing/test-* 콘솔 에러 없음.
