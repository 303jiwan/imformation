# Implementation Plan (review target) — v2 (codex adversarial review 반영)

# Implementation Plan — 배터리 아바타 + 재화 상점 시스템

## Goal
메인 페이지의 배터리 마스코트(`index.html` `.mascot`)를 아바타 캐릭터로 채택하고, 본체 컬러·중앙 문양 커스터마이즈 + 모자/옷 착장을 지원한다. 문제를 풀면 "배터리"(재화)가 적립되고, 상점에서 기본 무료 옷 외 추가 아이템을 구매해 착장할 수 있게 한다.

## Multi-agent 분담

| Agent | 역할 | 의존성 |
|---|---|---|
| **A. character-svg** | `character.js` 재설계: 인간→배터리 SVG, `body.color`+`body.symbol` 슬롯, `BATTERY_COLORS`·`BODY_SYMBOLS`, `normalizeConfig` 신구 호환 | 없음 |
| **B. outfits-rework** | `outfits.js`: 배터리 좌표계 hat/top/glasses/other 재작성, `BOTTOMS` 폐기, `price`/`tier` 메타 + `SYMBOLS` 카탈로그 | A 완료 후 |
| **C. wallet-shop-backend** | DB 마이그레이션, wallet/shop/avatar 라우터 (원자적 SQL), `/api/test/answer` 첫 AC grant (멱등), **`/api/avatar` 서버사이드 소유권 검증** | A·B와 병렬 가능 |
| **D. frontend-shop-ui** | `avatar.js` 상점 탭, 잔액 배지, 구매 모달, 카테고리 재정의 | A·B·C 완료 후 |

Step 7에서 메인 Opus가 A → (B와 C 병렬) → D 순으로 Sonnet sub-agent 호출.

## Files

### Frontend
- `frontend/src/avatar/character.js` — 신규 SVG, 신 스키마
- `frontend/src/avatar/outfits.js` — 좌표계 재조정, price/tier, BOTTOMS 제거, SYMBOLS 추가
- `frontend/src/avatar/avatar.css` — 상점 모달/잠금 배지/잔액 배지
- `frontend/src/avatar.js` — 상점 탭, 잔액 UI, 구매 흐름
- `frontend/src/avatar/shop-catalog.js` (신규) — 카탈로그 single-source (id, category, price, tier). 백엔드와 공유
- `frontend/src/test-problem.js` — 첫 AC 후 wallet refresh
- `frontend/tests/e2e/avatar*.spec.ts` — 깨진 어설션 최소 패치
- `frontend/tests/e2e/shop.spec.ts` (신규) — 동시 클릭/소유권 우회 회귀 케이스

### Backend
- `backend/src/wallet.js` (신규) — walletRouter, **원자적 purchase**
- `backend/src/shop-catalog.js` (신규) — `frontend/src/avatar/shop-catalog.js`와 동일 데이터 (ESM import 가능하면 frontend 모듈을 backend가 import; 빌드 의존이 안 맞으면 동일 데이터 hardcode + 단위 테스트로 동기 보장)
- `backend/src/avatar.js` — **POST 시 소유권 검증 추가**: config 내 모든 non-free 아이템 id가 `user_owned_items`에 있어야 persist 허용
- `backend/src/test.js` — `/api/test/answer` 멱등 grant + 응답 `{ awarded, balance }`
- `backend/src/db.js` — 신규 stmts
- `backend/src/index.js` — walletRouter 마운트

### DB Migration (`migrations/2026XXXX_wallet_shop.sql`)
```sql
-- 1. 지갑 (1 row per user)
CREATE TABLE user_wallet (
  user_id    BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance    INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 소유 아이템 (uniqueness 보장)
CREATE TABLE user_owned_items (
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id     TEXT   NOT NULL,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

-- 3. 문제별 최초 보상 마커 — 멱등성 핵심. (user_id, problem_id) PK가 grant의 진리.
--    test_answers에 award 컬럼을 다는 대신 별도 테이블로 분리해 grant=row 1:1 매핑.
CREATE TABLE problem_awards (
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id  TEXT   NOT NULL,
  amount      INT    NOT NULL,
  awarded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, problem_id)
);
```
*test_answers 는 unchanged. award는 `problem_awards`만 진리. AC가 들어와도 PK conflict면 grant 없음.*

## Schema / API

### Avatar config
```js
DEFAULT_CONFIG = {
  body:    { color: '#7c3aed', symbol: { id: 'sym-bolt', color: '#22c55e' } },
  clothing:{ top: { style: 'top-tee', color: '#2563eb' } },
  accessories: { hat: null, glasses: null, other: null },
};
```
기존 `skinTone/hair/bottom`은 `normalizeConfig`에서 silently drop.

### API
- `GET  /api/wallet` → `{ balance, ownedItemIds }`
- `GET  /api/shop/items` → `{ items: [{id, category, price, tier, free}] }`
- `POST /api/shop/purchase` body `{itemId}` → 200 `{ok, balance, ownedItemIds}` / 400 `{error: already_owned | insufficient_battery | invalid_item}`
- `POST /api/test/answer` 응답에 `{ awarded: int, balance: int }` 추가
- `POST /api/avatar` 본문 검증 강화: config 내 모든 참조 id (`clothing.top.style`, `accessories.hat.style`, `accessories.glasses.style`, `accessories.other.style`, `body.symbol.id`)가 무료 아이템이거나 `user_owned_items`에 존재해야 함. 미소유 id 발견 시 400 `{error: 'unowned_item', itemId}`. (body.color는 자유)

### 배터리 적립 — **멱등 SQL**
`POST /api/test/answer` 내부 (verdict === 'AC' 일 때만):
```sql
-- 한 트랜잭션, 한 conditional INSERT.
INSERT INTO problem_awards (user_id, problem_id, amount)
VALUES ($1, $2, 10)
ON CONFLICT (user_id, problem_id) DO NOTHING
RETURNING amount;
```
RETURNING 행이 있을 때만 (≡ 진짜 첫 AC) wallet 갱신:
```sql
INSERT INTO user_wallet (user_id, balance, updated_at)
VALUES ($1, $awarded, now())
ON CONFLICT (user_id) DO UPDATE SET
  balance = user_wallet.balance + EXCLUDED.balance,
  updated_at = now()
RETURNING balance;
```
두 statement는 `withTx`로 묶음. 응답: `{awarded: <RETURNING>.amount || 0, balance: <후속 RETURNING balance>}`.
**동시 두 AC 제출 시**: PK conflict가 둘 중 하나를 막아 grant 1회만 발생.

### 구매 — **원자적 spend**
`POST /api/shop/purchase` 트랜잭션 (서버사이드 카탈로그에서 `price` 결정):
```sql
-- step 1: 이미 소유했으면 already_owned 400.
INSERT INTO user_owned_items (user_id, item_id)
VALUES ($1, $2)
ON CONFLICT (user_id, item_id) DO NOTHING
RETURNING item_id;
```
RETURNING이 비면 → 트랜잭션 ROLLBACK, 400 `already_owned`.
이후, **조건부 차감**:
```sql
UPDATE user_wallet
   SET balance = balance - $price,
       updated_at = now()
 WHERE user_id = $1 AND balance >= $price
RETURNING balance;
```
RETURNING 비면 → 잔액 부족이거나 wallet row 없음 → ROLLBACK, 400 `insufficient_battery`.
둘 다 통과 시 COMMIT, 200. 이로써:
- 두 번 클릭: 두 번째는 `already_owned` (INSERT 실패).
- 두 다른 아이템 동시 구매로 잔액 음수: UPDATE의 `balance >= price` 조건이 둘 중 늦은 트랜잭션을 거절.
- 차감만 되고 소유는 못받는 race: INSERT가 먼저, UPDATE 실패 시 ROLLBACK으로 INSERT도 취소.

*무료(price=0) 아이템도 같은 흐름. UPDATE는 자명히 통과 → INSERT만 성공하면 끝.*

### Avatar 저장 — **소유권 가드**
`POST /api/avatar` 핸들러:
1. `normalizeConfig(body.avatar)` 후, config에서 참조하는 item id 집합 `S` 추출 (top.style, hat.style, glasses.style, other.style, body.symbol.id, 단 hair는 신 schema에 없으므로 무시).
2. `S` 중 무료 아이템(`shop-catalog.js`의 `price === 0`)은 통과.
3. 나머지 id는 `SELECT 1 FROM user_owned_items WHERE user_id=$1 AND item_id = ANY($2)` 결과와 대조.
4. 누락된 id가 하나라도 있으면 400 `unowned_item` (해당 id 표기). 통과 시 기존 upsert 흐름 그대로.
5. (보너스) `body.color`는 자유, `body.symbol.color`도 자유 (소유한 symbol style 만 검증).

### 상점 카탈로그 V1
shop-catalog 모듈의 정적 데이터. 가격은 서버가 진리(클라이언트가 보내는 price는 무시).
- 무료(0): `top-tee`, `top-tank`, `hat-cap`, `hat-beanie`, `glasses-round`, `sym-bolt`
- 유료(30): `top-hoodie`, `top-stripe`, `hat-tophat`, `hat-fedora`, `glasses-sun`, `glasses-cat`, `sym-heart`, `sym-star`
- 프리미엄(100): `top-jacket`, `hat-beret`, `glasses-heart`, `sym-cog`, `sym-flame`

## Steps per Agent

### Agent A — character.js
1. viewBox 240×320 유지, 배터리 본체 좌표 상수 `bodyRect` (예: x=48 y=40 w=144 h=240 rx=32) export
2. `BATTERY_COLORS` (8~10개 팔레트, free)
3. `BODY_SYMBOLS` (5~8개, `sym-bolt` free, 나머지 일부 유료 — catalog와 일치)
4. `DEFAULT_CONFIG` 신규화
5. `normalizeConfig` 신/구 호환
6. `renderCharacter`: 본체 → cap → top → 눈/동공 → 문양 → glasses → hat → other
7. e2e 셀렉터 보존 (.codenergy-character, root svg)

### Agent B — outfits.js + shop-catalog
1. Agent A의 `bodyRect` 기준 좌표 재계산
2. `BOTTOMS` 제거 + `CATALOG.bottom` 제거
3. 각 item에 `price`, `tier`, `free` 추가
4. `SYMBOLS` 카탈로그 추가 (`getByCategory('symbol')`)
5. `frontend/src/avatar/shop-catalog.js` (single-source): `{ [itemId]: { category, price, tier, free } }`. outfits.js와 wallet 둘 다 import. **백엔드도 동일 모듈 import 또는 동일 데이터 + 단위 테스트로 동기성 검증**.
6. tier 분배: 위 카탈로그 표.

### Agent C — wallet/shop/avatar backend
1. Migration SQL 적용 안내 (사용자가 Supabase에 실행)
2. `db.js` stmts 추가 (`insertProblemAward`, `incrementWallet`, `insertOwned`, `decrementWalletIfEnough`, `getWallet`, `listOwned`, `findOwned`)
3. `wallet.js` 라우터 작성, `requireAuth`. purchase는 위 원자적 SQL 시퀀스 그대로.
4. `shop-catalog.js` 백엔드 모듈 — frontend와 sync. 가격은 서버가 진리.
5. `test.js` `/answer` 수정: AC 첫 회 grant — 위 멱등 SQL.
6. `avatar.js` POST 수정: 소유권 검증.
7. **테스트**:
   - 동시 첫 AC 2개 → grant amount 합계 = 10 (DB 어설션).
   - 동시 동일 아이템 구매 → 200 1개 + 400 1개, 잔액 1회만 차감.
   - 잔액 부족 구매 → 잔액·소유 모두 unchanged.
   - 미소유 premium id로 POST /api/avatar → 400.
   - 무료 아이템 직접 POST → 통과.

### Agent D — frontend shop UI
1. `avatar.js` CATEGORIES 재정의 (body: color/symbol, clothing: top, accessories: hat/glasses/other, **shop**: top/hat/glasses/other/symbol)
2. 잔액 배지 `.avatar-balance`, GET /api/wallet 페이지 로드 시 호출
3. shop 탭 그리드: 미소유 아이템 🔒 + 가격, 클릭 → 구매 확인 모달 → POST /api/shop/purchase
4. 구매 응답으로 `balance` + `ownedItemIds` 갱신, 자동 장착(`commitChange`) 후 정상 그리드로 폴백
5. **장착 시 클라이언트는 미소유 premium을 차단** (UX 친화 — 서버는 어쨌든 거절). 무료/소유 아이템만 장착 가능 상태.
6. `test-problem.js`: `/api/test/answer` 응답의 `awarded > 0` 이면 "+10 🔋 적립" 토스트

## 검증

1. `npm run build` 컴파일 통과
2. `npx playwright test avatar*.spec.ts shop.spec.ts` — 기존 e2e 깨진 ≤ 2개 패치 + 신규 회귀 케이스 통과
3. Playwright 스크린샷: 배터리 캐릭터, 색/문양, hat/top, 상점 잠금/구매
4. **백엔드 동시성 테스트** (Node script로 Promise.all 2 submit/2 buy): grant 1회·spend 1회만.
5. **소유권 우회 테스트**: 미소유 premium id로 `POST /api/avatar` → 400 unowned_item.
6. Supabase persist 확인 (재로그인 후 잔액·소유 일치).

## Risks / 가정
- **R1**: outfit 좌표 재조정 부담 큼 → Agent B 단일 책임
- **R2**: 기존 사용자 데이터 silently drop → 마이그레이션 토스트 필요 여부 [?]
- **R3**: 서버/클라이언트 카탈로그 sync → 단일 모듈 import (또는 동기 단위 테스트)
- **R4**: 동시 구매·grant race → **별도 problem_awards PK + 조건부 wallet UPDATE로 SQL 레벨 보장 (review H1/H2 반영)**
- **R5**: 기존 e2e의 bot-*/skin tone case ≤ 2개 깨짐
- **R6**: /api/test/answer 응답 shape 추가가 lesson 호출자에 영향 없음
- **R7**: index.html 메인 마스코트는 변경 안 함
- **R8**: 무료 아이템도 `user_owned_items`에 row가 없음 → POST /api/avatar의 검증은 catalog.free 우선 체크. (DB row 없이도 통과)
- **R9**: shop-catalog 모듈을 backend가 frontend에서 import할 때 monorepo path resolution 이슈 가능 → Vite 빌드 산물과 무관한 plain ESM 모듈로 둠. 안 되면 백엔드에 동일 데이터를 두고 lint/test로 sync 확인.
- **A1**: 단가 10/30/100 V1 가정
- **A2**: 심볼 5~8개 프리셋 V1 가정

## 종료 조건
1. 배터리 캐릭터가 메인 마스코트와 시각 일치
2. 색·문양 즉시 반영
3. 무료 즉시 장착 / 유료는 잔액 차감 후 장착 — **서버 검증 통과**
4. 첫 AC +10 grant Supabase persist, 동시 제출 시 1회만
5. 미소유 premium 직접 POST /api/avatar 차단
6. e2e 통과 또는 R5 범위 최소 패치
