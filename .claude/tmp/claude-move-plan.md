# Implementation Plan (v2 — codex AR 반영)

## 목표 (Goal)
1. 첨부 이미지 기준으로 `top-starcape` SVG 재디자인 — 망토가 본체를 충분히 덮고 자연스럽게 떨어지도록.
2. 상점 미소유 아이템 클릭 시 **명시적 preview transaction**: 캐릭터에 임시 장착 미리보기, localStorage/서버 저장 안 됨, 모든 닫힘/실패 경로에서 정확히 원복. 구매 성공 경로만 preview를 진짜 장착으로 전환.

## 변경할 파일 (Files)

### 1. `frontend/src/avatar/outfits.js` — `top-starcape` svgFragment 재작업
   - 망토 크기 확대. 좌표:
     - 본체 BODY_RECT `x=48 y=40 w=144 h=240`. 망토 어깨선 y≈110부터 본체 하단보다 살짝 아래 y≈290까지. 좌우 x≈24~216 (양쪽 24px 플레어).
     - 윤곽: 칼라 V (중앙 y≈108, 좌우 어깨 y≈118), 하단 둥근 사다리꼴.
     - 안감(밝은 보라) path 좌우 12~16px 인셋.
   - 별 polygon 5~7개, x=50~190, y=140~250 분포, 크기 약간 키움.
   - 노란 리본 칼라 V 중앙(x=120, y=110) 매듭폭 ≈40px.
   - `svgFragment(_color)` — 색 인자 무시, 보라 `#7c3aed` / 노랑 `#fbbf24` / 흰 별.
   - 칼라 V는 y≥110 아래로만 — 눈(cx=120, cy=120, r=38) 가리지 않게.

### 2. `frontend/src/avatar.js` — preview transaction (codex AR 반영)

핵심 불변 규칙:
- **`previewSnapshot != null`인 동안 `commitChange` 호출 = 절대 금지**.
- preview를 진짜 장착으로 전환하는 유일한 경로: `executePurchase` 성공 + 그 itemId의 ownership 확정 직후.
- 그 외 모든 닫힘/취소/실패/예외 = `revertPreview()`.

구현:
- 모듈 상단:
  - `let previewSnapshot = null;`
  - `let previewItemId = null;`
- `applyPreview(itemId)`:
  - 이미 `previewSnapshot != null`이면 **새 snapshot 캡처하지 않음** (첫 snapshot 유지). 단, `previewItemId = itemId`로 갱신, 그리고 카테고리별 setter 호출 후 `paintCharacter()`만.
  - 첫 호출이면 `previewSnapshot = JSON.parse(JSON.stringify(config))`, `previewItemId = itemId`.
  - 카테고리별 setter 호출(`setBodySymbol`/`setTop`/`setAccessory`). `paintCharacter()`. `commitChange` 호출 금지. `isDirty` 건드리지 않음.
- `revertPreview()`:
  - `previewSnapshot == null`이면 no-op.
  - `config = previewSnapshot`, `previewSnapshot = null`, `previewItemId = null`.
  - `paintCharacter()` + `paintGrid()` + `paintColorRow()`. **`saveLocalConfig` 호출 안 함.**
- **모든 mutating action을 preview 활성 시 가드**:
  - `onRandom()`, `onReset()` 진입부: `if (previewSnapshot) { revertPreview(); return; }` — preview 중 누르면 그냥 원복만 (혼란 방지).
  - `onItemClick(id)`:
    - shop 미소유 클릭: `applyPreview(id)` → `openBuyModal(id)`.
    - shop 소유 클릭 / 다른 카테고리 클릭: 진입부에 `if (previewSnapshot) { revertPreview(); }` 먼저 — 그 후 정상 commitChange 흐름.
  - primary/secondary tab 클릭: 진입부에서 `if (previewSnapshot) revertPreview();`.
  - 색칩 클릭(`setColor` → `commitChange` 경로): preview 중 가드.
  - `commitChange()` 함수에도 디펜시브 가드: 첫 줄에 `if (previewSnapshot) { return; }` (또는 console.warn). 호출 지점 가드 + 함수 내 가드 이중 안전망.
- `onRootClick`의 `#avatar-buy-cancel`: `closeBuyModal()` → `revertPreview()`.
- `executePurchase()`:
  - **`previewSnapshot`은 entry에서 폐기하지 않음.** snapshot 유지.
  - `closeBuyModal()` 호출.
  - try-catch 안에서 fetch → 성공 경로:
    - `wallet.balance`/`ownedItemIds` 갱신, toast 표시.
    - **이제** 카테고리별 setter 재호출(또는 이미 preview에서 적용된 상태 그대로 사용)해서 config 확정 → `previewSnapshot = null; previewItemId = null;` → `commitChange()` (localStorage 저장 + isDirty).
    - 즉 "commit 직전에 snapshot 비우기" 순서.
  - 실패 경로(non-OK 응답 / catch / 네트워크 에러): `revertPreview()` 호출 → toast → return.
- `onBack()`: preview 중이면 confirm 안 띄우고 그냥 `revertPreview()` 후 navigate.

### 3. 다른 파일 변경 없음.

## 단계 (Steps)

1. `outfits.js`의 `top-starcape` svgFragment 새 좌표로 교체.
2. `avatar.js`: `previewSnapshot`, `previewItemId` 추가. `applyPreview` / `revertPreview` 함수 작성.
3. `onItemClick` shop 미소유 분기: `applyPreview(id)` + `openBuyModal(id)`.
4. `onItemClick` 그 외 mutating 분기 진입부에 preview 가드.
5. `onRandom`/`onReset` 진입부에 `if (previewSnapshot) { revertPreview(); return; }`.
6. tab 클릭 핸들러(primary/secondary)에 `if (previewSnapshot) revertPreview();`.
7. `commitChange` 첫 줄에 디펜시브 가드 `if (previewSnapshot) return;`.
8. `onRootClick` cancel 분기: `closeBuyModal()` 후 `revertPreview()`.
9. `executePurchase`: snapshot entry에서 폐기 금지. 성공 직전 `previewSnapshot = null; previewItemId = null;` 후 commitChange. 실패/예외 시 `revertPreview()`.
10. `onBack`: preview 중이면 revert 후 navigate.
11. `cd frontend; npm run build` 빌드 확인.
12. `npm run dev` 수동 검증.

## 데이터 / 스키마 / API 변경

없음. 새 모듈 로컬 상태 변수 2개(`previewSnapshot`, `previewItemId`).

## 리스크 / 가정

- `commitChange` 디펜시브 가드는 정상 흐름에서는 작동하지 않음(executePurchase가 snapshot 비운 뒤 commitChange 호출). 호출 순서 엄수.
- 모달 닫힘 경로는 현재 cancel 버튼만 존재. ESC/백드롭 클릭이 추가되면 그 핸들러도 `revertPreview()` 호출 필요.
- preview 중 `onBack`은 confirm 생략. preview는 localStorage 저장 안 됐으므로 잃을 게 없음.
- `executePurchase` 내 fetch 예외 시 catch 블록에서 `revertPreview` 호출.
- preview 중 다른 미소유 클릭 시 첫 snapshot 유지 — 정확한 원복 보장.

## 검증 방법

1. `npm run build` 통과.
2. `npm run dev` 후 avatar.html, 망토 디자인 시각 확인 (본체 충분히 덮음, 눈 안 가림, 리본/별 노출).
3. preview 시나리오:
   - shop 미소유 클릭 → 모달 + 캐릭터 미리장착.
   - **취소** → 원래 모습 복원. localStorage `codenergy:avatar:config` 변화 없음 확인.
   - **구매 성공** → 장착 유지 + localStorage 저장.
   - **잔액 부족 실패** → toast + 원래 모습 복원.
   - **네트워크 에러 시뮬** (백엔드 끄기) → catch 블록 작동, 원래 모습 복원.
   - preview 중 **다른 미소유 클릭** → 두 번째 아이템 미리보기로 변경, 최초 snapshot 유지. 두 번째 취소 시 최초 상태로 복원.
   - preview 중 **랜덤 버튼** → preview 그냥 revert (혼란 방지). localStorage 변화 없음.
   - preview 중 **초기화 버튼** → 동일.
   - preview 중 **소유 아이템 클릭** → preview revert 후 그 소유 아이템 정상 장착·저장.
   - preview 중 **탭 전환** → preview revert.
4. Playwright e2e 회귀.
