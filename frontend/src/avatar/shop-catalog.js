// frontend/src/avatar/shop-catalog.js
// 카탈로그의 단일 진리 (single-source of truth).
// backend도 동일 데이터를 hardcode/sync.
//
// 무료 아이템(price===0)은 user_owned_items 행 없이도 장착 가능.
// 백엔드의 avatar save validation에서 free 우선 체크.
//
// 모든 outfits + symbols 아이템을 카테고리/가격/티어 정보로 평탄화.
// 총 34 아이템: top 7 + hat 7 + glasses 7 + other 7 + symbol 6

export const SHOP_CATALOG = {
  // ── tops (7) ──────────────────────────────────────────────────────────────
  'top-tee':     { category: 'top', price: 0,   tier: 'free'    },
  'top-hoodie':  { category: 'top', price: 30,  tier: 'common'  },
  'top-stripe':  { category: 'top', price: 30,  tier: 'common'  },
  'top-shirt':   { category: 'top', price: 30,  tier: 'common'  },
  'top-jacket':   { category: 'top', price: 100, tier: 'premium' },
  'top-polo':     { category: 'top', price: 100, tier: 'premium' },
  'top-starcape': { category: 'top', price: 100, tier: 'premium' },

  // ── hats (7) ──────────────────────────────────────────────────────────────
  'hat-cap':     { category: 'hat', price: 0,   tier: 'free'    },
  'hat-beanie':  { category: 'hat', price: 0,   tier: 'free'    },
  'hat-tophat':  { category: 'hat', price: 30,  tier: 'common'  },
  'hat-fedora':  { category: 'hat', price: 30,  tier: 'common'  },
  'hat-bucket':  { category: 'hat', price: 30,  tier: 'common'  },
  'hat-beret':   { category: 'hat', price: 100, tier: 'premium' },
  'hat-visor':   { category: 'hat', price: 100, tier: 'premium' },

  // ── glasses (7) ───────────────────────────────────────────────────────────
  'glasses-round':  { category: 'glasses', price: 0,   tier: 'free'    },
  'glasses-square': { category: 'glasses', price: 0,   tier: 'free'    },
  'glasses-sun':    { category: 'glasses', price: 30,  tier: 'common'  },
  'glasses-cat':    { category: 'glasses', price: 30,  tier: 'common'  },
  'glasses-oval':   { category: 'glasses', price: 30,  tier: 'common'  },
  'glasses-heart':  { category: 'glasses', price: 100, tier: 'premium' },
  'glasses-mono':   { category: 'glasses', price: 100, tier: 'premium' },

  // ── other / 사이드 액세서리 (7) ────────────────────────────────────────────
  'acc-bolt-pin':  { category: 'other', price: 0,   tier: 'free'    },
  'acc-star-pin':  { category: 'other', price: 0,   tier: 'free'    },
  'acc-bow':       { category: 'other', price: 30,  tier: 'common'  },
  'acc-flame-pin': { category: 'other', price: 30,  tier: 'common'  },
  'acc-gear-pin':  { category: 'other', price: 30,  tier: 'common'  },
  'acc-crown':     { category: 'other', price: 100, tier: 'premium' },
  'acc-halo':      { category: 'other', price: 100, tier: 'premium' },

  // ── symbols / character.js BODY_SYMBOLS (6) ────────────────────────────────
  // ID는 character.js BODY_SYMBOLS[*].id 와 반드시 동기화 유지
  'sym-bolt':  { category: 'symbol', price: 0,   tier: 'free'    },
  'sym-heart': { category: 'symbol', price: 30,  tier: 'common'  },
  'sym-star':  { category: 'symbol', price: 30,  tier: 'common'  },
  'sym-code':  { category: 'symbol', price: 30,  tier: 'common'  },
  'sym-cog':   { category: 'symbol', price: 100, tier: 'premium' },
  'sym-flame': { category: 'symbol', price: 100, tier: 'premium' },
};

/**
 * 아이템이 무료인지 여부. 무료 아이템은 소유 기록 없이도 장착 가능.
 * @param {string} itemId
 * @returns {boolean}
 */
export function isFreeItem(itemId) {
  const entry = SHOP_CATALOG[itemId];
  return !!(entry && entry.price === 0);
}

/**
 * 아이템 가격 반환. 알 수 없는 ID는 null.
 * @param {string} itemId
 * @returns {number|null}
 */
export function getItemPrice(itemId) {
  const entry = SHOP_CATALOG[itemId];
  return entry ? entry.price : null;
}

/**
 * 아이템 카테고리 반환. 알 수 없는 ID는 null.
 * @param {string} itemId
 * @returns {string|null}
 */
export function getItemCategory(itemId) {
  const entry = SHOP_CATALOG[itemId];
  return entry ? entry.category : null;
}

/**
 * 카탈로그에 등록된 아이템인지 확인.
 * @param {string} itemId
 * @returns {boolean}
 */
export function isKnownItem(itemId) {
  return Object.prototype.hasOwnProperty.call(SHOP_CATALOG, itemId);
}
