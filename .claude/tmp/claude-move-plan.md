# Implementation Plan (v2 — codex AR 반영)

## 목표 (Goal)
아바타 에디터에서 "본체색"(배터리 색) 변경 UI를 제거하고, 정규화 시점에 본체 색을 강제로 고정해 기존 저장값까지 잠근다. 첨부 이미지(보라색 별무늬 망토 + 노란 리본)를 닮은 새 상의 `top-starcape`을 추가하되, 색상 인자와 무관하게 항상 보라/노랑으로 렌더되도록 한다.

## 변경할 파일 (Files)

1. **`frontend/src/avatar/character.js`** *(추가 — codex AR 지적 #1 반영)*
   - `LOCKED_BODY_COLOR` 상수 신설: 값은 `'#ffffff'` (현재 default 유지). [?] 사진 속 노란색(`#fbbf24`)으로 잠그고 싶다면 사용자 확인 필요.
   - `DEFAULT_CONFIG.body.color`도 `LOCKED_BODY_COLOR`로 통일.
   - `normalizeConfig()`에서 입력 `rawBody.color`를 검사하지 말고 **무조건** `LOCKED_BODY_COLOR`를 반환하도록 변경 → 기존에 저장된 다른 색도 reload/persist 경계에서 자동 리셋됨.
   - 이렇게 하면 다음 `saveLocalConfig`/`saveRemoteConfig` 호출 시 자동으로 보정된 값이 영속화돼 마이그레이션 없이 정리됨.

2. **`frontend/src/avatar.js`**
   - `CATEGORIES.body.subs`에서 `{ id: 'color', label: '본체색', … }` 항목 삭제 → 신체 탭은 `symbol`(문양)만 노출.
   - 모듈 상단 `let activeSecondary = 'color';` 초기값을 `'symbol'`로 변경.
   - `onRandom()`에서 본체색 랜덤화 코드 (`config.body.color = bodyColor.base;` 및 그 위 `pickRandom(BATTERY_COLORS)`) 삭제.
   - `setBodyColor()` 함수와 `paintGrid()`의 `sub.id === 'color'` 분기는 dead path이지만 안전상 유지(또는 정리).
   - `BATTERY_COLORS` import는 onRandom 변경 후 미사용이면 제거.

3. **`frontend/src/avatar/outfits.js`** *(codex AR 지적 #2 반영)*
   - `TOPS` 배열 끝에 `top-starcape` 추가:
     - `id: 'top-starcape'`, `name: '별무늬 망토'`, `thumbnail: '🌟'`, `price: 100`, `tier: 'premium'`.
     - `svgFragment`은 **`color` 인자를 받되 무시**하고 내부에서 보라(`#7c3aed`)와 노랑(`#fbbf24`)을 하드코딩. 예: `svgFragment(_ignored) => '<g>...purple cape with white stars + yellow bow...</g>'`. 이렇게 하면 기존 top 색이 무엇이든 망토는 항상 보라/노랑으로 렌더된다.
     - 좌표: 본체 BODY_RECT(48,40,144,240) 기준 망토 폭 x≈32~208, y≈120~270. 흰색 별 polygon 5~7개를 망토 표면에 분포. 목 부분에 노란 리본 매듭.

4. **`frontend/src/avatar/shop-catalog.js`**
   - `// ── tops` 블록에 `'top-starcape': { category: 'top', price: 100, tier: 'premium' },` 추가.

5. **`backend/src/shop-catalog.js`** (frontend와 동기 필수)
   - 동일하게 `'top-starcape': { category: 'top', price: 100, tier: 'premium' },` 추가.

6. **`frontend/src/avatar.js` — paintColorRow 조정** *(codex AR 지적 #2 보조)*
   - `top-starcape`이 장착돼 있을 때 색상 팔레트(`avatar-color-row`)를 숨김 → 사용자가 색 칩을 눌러도 망토 색이 안 바뀌므로(svg가 인자 무시) 칩 자체를 안 보이게 해서 UX 혼동 방지. `paintColorRow()`에서 `sub.id === 'top' && getEquippedStyleId('top') === 'top-starcape'`이면 `el.innerHTML = ''; return;`.

## 단계 (Steps)

1. `character.js`에 `LOCKED_BODY_COLOR` 추가, `DEFAULT_CONFIG.body.color`와 `normalizeConfig`의 body.color 처리를 강제 고정으로 수정.
2. `avatar.js`의 `CATEGORIES.body.subs`에서 color 제거, `activeSecondary` 초기값을 `'symbol'`로 변경.
3. `avatar.js` `onRandom()`에서 body.color 랜덤화 라인 2줄 제거.
4. `avatar.js` `paintColorRow()`에 top-starcape 장착 시 빈 row 분기 추가.
5. `outfits.js`의 `TOPS`에 `top-starcape` 추가 — svgFragment는 인자 무시, 내부 하드코딩 보라/노랑.
6. `frontend/src/avatar/shop-catalog.js`에 엔트리 추가.
7. `backend/src/shop-catalog.js`에 동일 엔트리 추가.
8. `npm run build` 빌드 확인 → `npm run dev`로 수동 UI 검증.

## 데이터 / 스키마 / API 변경

- **DB / API**: schema 변경 없음. `top-starcape`이 새 itemId로 카탈로그에 추가됨.
- **Schema 의미 변경**: `config.body.color`는 schema에 남아있으나 항상 `LOCKED_BODY_COLOR`로 정규화됨. 기존 저장값은 다음 `normalizeConfig` 호출에서 자동 리셋되어 다음 save 시 영속화된다.
- **localStorage / sessionStorage**: 키 변경 없음.

## 리스크 / 가정

- **본체 색 잠금 값**: 현재 plan은 `#ffffff`로 고정. 사진의 노란색이 의도였다면 `#fbbf24`로 변경해야 함 [?].
- **기존 사용자 데이터 자동 리셋**: 본인 의도였던 색상 선택이 silently 사라짐. 한 번 보이는 토스트("배터리 색이 기본값으로 통일되었습니다") 추가 여부 [?]. 현재 plan은 토스트 없이 자동 리셋.
- **별무늬 망토는 재색칠 불가**: 디자인 의도 보존을 위해 색 인자 무시. 사용자가 색을 바꾸고 싶어도 못 바꾸는데, 망토 등록 시 색 팔레트도 안 보이므로 일관됨.
- **z-order**: 망토(top, layer 4)는 본체 위·눈/문양/안경 아래. 문양이 망토 위로 떠 보일 수 있어 시각적으로 어색할 수 있음. V1은 그대로, 문제되면 후속 작업.
- **신체 탭의 secondary가 "문양" 1개만**: 기존 패턴(`의상→상의` 1개)과 동일하므로 OK.
- **`BATTERY_COLORS` export**: 미사용이지만 외부 참조 가능성 있어 그대로 유지.

## 검증 방법

1. `npm run build` 통과.
2. `npm run dev`:
   - 신체 탭의 secondary에 "본체색"이 사라지고 "문양"만.
   - localStorage `codenergy:avatar:config`에 `body.color`를 임의 값(`#fbbf24`)으로 박은 뒤 페이지 새로고침 → 캐릭터 본체가 `LOCKED_BODY_COLOR`로 렌더되는지 (정규화 강제 확인).
   - 랜덤 버튼 여러 번 — 본체색 절대 안 바뀜.
   - 상점에서 별무늬 망토(100🔋) 구매 → 자동 장착 후 본체에 **보라 망토 + 흰별 + 노란 리본** 렌더.
   - 다른 top(예: top-tee 파랑)을 먼저 장착한 상태에서 별무늬 망토로 갈아입어도 망토는 보라색 유지 (codex 지적 #2 회귀 시나리오).
   - 의상 탭에서 별무늬 망토 장착 중에는 색상 칩 row가 비어있는지.
   - 저장 후 새로고침해도 망토 유지 + body.color는 LOCKED 값으로 보존.
3. Playwright e2e 있으면 `cd frontend && npm run test:e2e`.
