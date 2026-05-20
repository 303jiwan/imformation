/* =====================================================================
   avatar.js — 아바타 에디터 컨트롤러 (배터리 캐릭터 schema, shop 탭 포함)

   - 4단 탭 (신체/의상/악세사리/상점) × 세컨더리 탭
   - body.color (BATTERY_COLORS), body.symbol (BODY_SYMBOLS)
   - 상점 탭: 잠금 배지, 구매 모달, wallet 잔액
   - Back / 저장하기 버튼
   ===================================================================== */

import './avatar/avatar.css';
// outfits.js must be imported first to break the circular dependency:
// outfits.js → character.js (BODY_RECT) → outfits.js (getById).
// If outfits.js is evaluated first, it triggers character.js evaluation which
// doesn't access outfits.js at init-time, so BODY_RECT is defined by the time
// void BODY_RECT runs in outfits.js.
import { getByCategory, getById, renderOutfitFragment } from './avatar/outfits.js';
import {
  renderCharacter,
  DEFAULT_CONFIG,
  SKIN_TONES,
  normalizeConfig,
  BATTERY_COLORS,
  BODY_SYMBOLS,
} from './avatar/character.js';
import { SHOP_CATALOG, isFreeItem, getItemPrice } from './avatar/shop-catalog.js';

const API_BASE           = 'http://localhost:3000';
const STORAGE_KEY        = 'codenergy:avatar:config';
const LEGACY_STORAGE_KEY = 'codenergy:avatar:equipped';
const AUTH_HINT_KEY      = 'codenergy:auth:hint';
const DEMO_USER_KEY      = 'codenergy:demo:user';

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

const CATEGORIES = {
  body: {
    label: '신체',
    subs: [
      { id: 'symbol', label: '문양', hasColor: true, allowNone: false },
    ],
  },
  clothing: {
    label: '의상',
    subs: [
      { id: 'top', label: '상의', hasColor: true, allowNone: true },
    ],
  },
  accessories: {
    label: '악세사리',
    subs: [
      { id: 'hat',     label: '모자', hasColor: true, allowNone: true },
      { id: 'glasses', label: '안경', hasColor: true, allowNone: true },
      { id: 'other',   label: '기타', hasColor: true, allowNone: true },
    ],
  },
  shop: {
    label: '상점',
    subs: [
      { id: 'top',     label: '상의' },
      { id: 'hat',     label: '모자' },
      { id: 'glasses', label: '안경' },
      { id: 'other',   label: '기타' },
      { id: 'symbol',  label: '문양' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Palettes (색상 칩 — hair/bottom 제거)
// ---------------------------------------------------------------------------

const PALETTES = {
  symbol:  ['#22c55e','#ef4444','#fbbf24','#3b82f6','#a855f7','#f97316','#38bdf8','#94a3b8','#e879f9'],
  top:     ['#ffffff','#1f2937','#a855f7','#3b82f6','#ef4444','#10b981','#fbbf24','#f97316','#22c55e'],
  hat:     ['#1f2937','#404040','#cbd5e1','#3b82f6','#a855f7','#ef4444','#fbbf24','#92400e','#10b981'],
  glasses: ['#000000','#374151','#92400e','#ef4444','#3b82f6','#a855f7','#10b981','#fbbf24','#9ca3af'],
  other:   ['#fcd34d','#9ca3af','#ef4444','#3b82f6','#a855f7','#10b981','#fbbf24','#f97316','#000000'],
};

// ---------------------------------------------------------------------------
// Wallet state
// ---------------------------------------------------------------------------

let wallet = {
  balance: 0,
  ownedItemIds: new Set(),
};

async function loadWallet() {
  // Always treat free items as owned
  Object.keys(SHOP_CATALOG).forEach((id) => {
    if (isFreeItem(id)) wallet.ownedItemIds.add(id);
  });
  try {
    const res = await fetch(`${API_BASE}/api/wallet`, { credentials: 'include' });
    if (!res.ok) return;
    const json = await res.json().catch(() => null);
    if (!json) return;
    if (typeof json.balance === 'number') wallet.balance = json.balance;
    if (Array.isArray(json.ownedItemIds)) {
      json.ownedItemIds.forEach((id) => wallet.ownedItemIds.add(id));
    }
    // Re-add free items in case server omitted them
    Object.keys(SHOP_CATALOG).forEach((id) => {
      if (isFreeItem(id)) wallet.ownedItemIds.add(id);
    });
    updateBalanceBadge();
  } catch (_) {}
}

function isOwned(itemId) {
  if (isFreeItem(itemId)) return true;
  return wallet.ownedItemIds.has(itemId);
}

function updateBalanceBadge() {
  const el = document.getElementById('avatar-balance-num');
  if (el) el.textContent = String(wallet.balance);
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

function loadLocalConfig() {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (_) {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefault();
    return normalizeConfig(JSON.parse(raw));
  } catch (_) {
    return cloneDefault();
  }
}

function saveLocalConfig() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (_) {}
}

async function fetchRemoteConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/avatar`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    if (json && json.avatar) return normalizeConfig(json.avatar);
    return null;
  } catch (_) {
    return null;
  }
}

async function saveRemoteConfig() {
  const res = await fetch(`${API_BASE}/api/avatar`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: config }),
  });
  if (!res.ok) {
    let msg = 'save failed';
    try {
      const j = await res.json();
      if (j && j.error) msg = j.error;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({ ok: true }));
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function isLoggedIn() {
  try {
    const hint = localStorage.getItem(AUTH_HINT_KEY);
    if (hint === 'logged-in') return true;
    if (hint === 'logged-out') return false;
    if (localStorage.getItem(DEMO_USER_KEY)) return true;
  } catch (_) {}
  const myWrap = document.getElementById('my-wrap');
  return !!(myWrap && !myWrap.hidden);
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const root = document.getElementById('avatar-root');

let config         = loadLocalConfig();
let activePrimary  = 'body';
let activeSecondary = 'symbol';
let toastTimer     = null;
let isDirty        = false;
let rootClickBound = false;
let previewSnapshot = null;
let previewItemId   = null;

// ---------------------------------------------------------------------------
// Logged-out view
// ---------------------------------------------------------------------------

function renderEmpty() {
  root.innerHTML = '';
  sessionStorage.setItem('codenergy:redirectAfterLogin', 'avatar.html');

  function openLoginModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    if (!modal.hidden) return;

    const headerLoginBtn = document.getElementById('login-btn');
    if (headerLoginBtn) {
      headerLoginBtn.click();
    }
    if (modal.hidden) {
      modal.hidden = false;
    }
  }

  openLoginModal();

  const modal = document.getElementById('auth-modal');
  if (modal) {
    const obs = new MutationObserver(() => {
      if (!modal.hidden) return;
      obs.disconnect();
      if (root.querySelector('.avatar-card')) return;
      if (isLoggedIn()) {
        render();
      } else {
        location.replace('index.html');
      }
    });
    obs.observe(modal, { attributes: true, attributeFilter: ['hidden'] });
  }
}

// ---------------------------------------------------------------------------
// Logged-in view
// ---------------------------------------------------------------------------

function renderEditor() {
  root.innerHTML = `
    <div class="avatar-page-wrap">
      <div class="avatar-card">
        <div class="avatar-card__head">
          <div>
            <p class="avatar-eyebrow">아바타 에디터</p>
            <h1 class="avatar-title">나만의 캐릭터 꾸미기</h1>
          </div>
          <div class="avatar-head-right">
            <div class="avatar-balance" id="avatar-balance">🔋 <span id="avatar-balance-num">0</span></div>
            <div class="avatar-username" id="avatar-username">me</div>
          </div>
        </div>

        <div class="avatar-layout">
          <aside class="avatar-preview">
            <div class="avatar-stage">
              <div class="avatar-stage__glow" aria-hidden="true"></div>
              <div class="avatar-stage__floor" aria-hidden="true"></div>
              <div class="avatar-character" id="avatar-character"></div>
            </div>
            <div class="avatar-quick">
              <button type="button" class="avatar-quick__btn" data-action="random" aria-label="랜덤">
                <span class="avatar-quick__icon">🎲</span><span>랜덤</span>
              </button>
              <button type="button" class="avatar-quick__btn" data-action="reset" aria-label="초기화">
                <span class="avatar-quick__icon">↺</span><span>초기화</span>
              </button>
            </div>
          </aside>

          <div class="avatar-panel">
            <div class="avatar-tabs avatar-tabs--primary"   id="avatar-primary"></div>
            <div class="avatar-tabs avatar-tabs--secondary" id="avatar-secondary"></div>
            <div class="avatar-color-row" id="avatar-color-row"></div>
            <div class="avatar-grid" id="avatar-grid"></div>
            <div class="avatar-actions">
              <button type="button" class="avatar-btn avatar-btn--ghost"   data-action="back">뒤로</button>
              <button type="button" class="avatar-btn avatar-btn--primary" data-action="finish">저장하기</button>
            </div>
          </div>
        </div>

        <div class="avatar-toast" id="avatar-toast" role="status" aria-live="polite"></div>

        <!-- 구매 확인 모달 -->
        <div class="avatar-buy-modal" id="avatar-buy-modal" hidden>
          <div class="avatar-buy-modal__inner">
            <p class="avatar-buy-modal__title" id="avatar-buy-title">아이템 구매</p>
            <p class="avatar-buy-modal__price" id="avatar-buy-price"></p>
            <div class="avatar-buy-modal__actions">
              <button type="button" class="avatar-btn avatar-btn--ghost avatar-btn--sm" id="avatar-buy-cancel">취소</button>
              <button type="button" class="avatar-btn avatar-btn--primary avatar-btn--sm" id="avatar-buy-confirm">구매하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  paintCharacter();
  paintPrimaryTabs();
  paintSecondaryTabs();
  paintGrid();
  paintColorRow();
  resolveUsername();
  updateBalanceBadge();

  if (!rootClickBound) {
    root.addEventListener('click', onRootClick);
    rootClickBound = true;
  }
  setupEyeTracking();
}

function onRootClick(e) {
  // Buy modal buttons
  const cancelBtn = e.target.closest('#avatar-buy-cancel');
  if (cancelBtn) { closeBuyModal(); revertPreview(); return; }
  const confirmBtn = e.target.closest('#avatar-buy-confirm');
  if (confirmBtn) { executePurchase(); return; }

  // Check data-action buttons first
  const actionBtn = e.target.closest('[data-action]');
  if (actionBtn) {
    if (actionBtn.dataset.action === 'back')   { onBack();   return; }
    if (actionBtn.dataset.action === 'finish') { onFinish(); return; }
    if (actionBtn.dataset.action === 'random') { onRandom(); return; }
    if (actionBtn.dataset.action === 'reset')  { onReset();  return; }
  }

  // Primary tab click
  const primaryTab = e.target.closest('.avatar-tab[data-primary]');
  if (primaryTab) {
    if (previewSnapshot) revertPreview();
    activePrimary  = primaryTab.dataset.primary;
    activeSecondary = CATEGORIES[activePrimary].subs[0].id;
    paintPrimaryTabs();
    paintSecondaryTabs();
    paintGrid();
    paintColorRow();
    return;
  }

  // Secondary tab click
  const secondaryTab = e.target.closest('.avatar-tab[data-secondary]');
  if (secondaryTab) {
    if (previewSnapshot) revertPreview();
    activeSecondary = secondaryTab.dataset.secondary;
    paintSecondaryTabs();
    paintGrid();
    paintColorRow();
    return;
  }

  // Item grid cell
  const item = e.target.closest('.avatar-item[data-id]');
  if (item) {
    const id = item.dataset.id;
    onItemClick(id);
    return;
  }

  // Color chip
  const chip = e.target.closest('.avatar-color-chip[data-color]');
  if (chip) {
    if (previewSnapshot) revertPreview();
    setColor(activeSecondary, chip.dataset.color);
    commitChange();
    return;
  }
}

// ---------------------------------------------------------------------------
// Painters
// ---------------------------------------------------------------------------

function paintCharacter() {
  const el = document.getElementById('avatar-character');
  if (!el) return;
  el.innerHTML = renderCharacter(config);
}

function paintPrimaryTabs() {
  const el = document.getElementById('avatar-primary');
  if (!el) return;
  el.innerHTML = Object.entries(CATEGORIES).map(([key, cat]) => `
    <button type="button"
            class="avatar-tab${key === activePrimary ? ' is-active' : ''}${key === 'shop' ? ' avatar-tab--shop' : ''}"
            data-primary="${key}">${cat.label}</button>
  `).join('');
}

function paintSecondaryTabs() {
  const el = document.getElementById('avatar-secondary');
  if (!el) return;
  const subs = CATEGORIES[activePrimary].subs;
  el.innerHTML = subs.map((s) => `
    <button type="button"
            class="avatar-tab${s.id === activeSecondary ? ' is-active' : ''}"
            data-secondary="${s.id}">${s.label}</button>
  `).join('');
}

function getCurrentSubDef() {
  const subs = CATEGORIES[activePrimary].subs;
  return subs.find((s) => s.id === activeSecondary) || subs[0];
}

function paintGrid() {
  const el = document.getElementById('avatar-grid');
  if (!el) return;
  const sub = getCurrentSubDef();
  const cells = [];

  if (activePrimary === 'shop') {
    // Shop tab: 모든 아이템 표시 (소유/미소유 포함)
    const subId = sub.id;
    let items;
    if (subId === 'symbol') {
      items = BODY_SYMBOLS.map((sym) => ({
        id: sym.id,
        name: sym.label,
        thumbnail: sym.thumbnail,
        price: getItemPrice(sym.id) ?? 0,
      }));
    } else {
      items = getByCategory(subId).map((item) => ({
        id: item.id,
        name: item.name,
        thumbnail: item.thumbnail,
        price: getItemPrice(item.id) ?? item.price ?? 0,
      }));
    }

    items.forEach((item) => {
      const owned = isOwned(item.id);
      const affordable = item.price <= wallet.balance;
      const equippedId = getEquippedStyleId(subId);
      const equipped = equippedId === item.id;
      let cls = 'avatar-item';
      if (equipped) cls += ' is-equipped';
      if (!owned) {
        cls += ' is-locked';
        if (affordable) cls += ' is-affordable';
        else cls += ' is-unaffordable';
      }
      cells.push(`
        <button type="button"
                class="${cls}"
                data-id="${item.id}"
                data-price="${item.price}">
          <span class="avatar-item__thumb">${renderItemThumbnail(item, subId)}</span>
          <span>${item.name || ''}</span>
          ${!owned ? `<span class="avatar-item__price">${item.price} 🔋</span>` : ''}
        </button>
      `);
    });
  } else if (sub.id === 'color') {
    // 본체색: BATTERY_COLORS 스와치
    BATTERY_COLORS.forEach((bc) => {
      const equipped = config.body.color === bc.base;
      cells.push(`
        <button type="button"
                class="avatar-item avatar-item--skin${equipped ? ' is-equipped' : ''}"
                data-id="${bc.id}">
          <span class="avatar-item__thumb">
            <span class="avatar-item__thumb-skin" style="background-color:${bc.base};border-color:${bc.stroke};"></span>
          </span>
          <span>${bc.label}</span>
        </button>
      `);
    });
  } else if (sub.id === 'symbol') {
    // 문양: owned/free만 표시
    BODY_SYMBOLS.forEach((sym) => {
      if (!isOwned(sym.id)) return;
      const equipped = config.body.symbol.id === sym.id;
      cells.push(`
        <button type="button"
                class="avatar-item${equipped ? ' is-equipped' : ''}"
                data-id="${sym.id}">
          <span class="avatar-item__thumb">${sym.thumbnail || ''}</span>
          <span>${sym.label}</span>
        </button>
      `);
    });
  } else {
    // top / hat / glasses / other: owned/free만 표시
    if (sub.allowNone) {
      const equipped = getEquippedStyleId(sub.id) == null;
      cells.push(`
        <button type="button"
                class="avatar-item avatar-item--none${equipped ? ' is-equipped' : ''}"
                data-id="__none__">
          <span class="avatar-item__thumb">✕</span>
          <span>없음</span>
        </button>
      `);
    }
    const items = getByCategory(sub.id).filter((item) => isOwned(item.id));
    const equippedId = getEquippedStyleId(sub.id);
    items.forEach((item) => {
      const equipped = equippedId === item.id;
      cells.push(`
        <button type="button"
                class="avatar-item${equipped ? ' is-equipped' : ''}"
                data-id="${item.id}">
          <span class="avatar-item__thumb">${renderItemThumbnail(item, sub.id)}</span>
          <span>${item.name || ''}</span>
        </button>
      `);
    });
  }

  el.innerHTML = cells.join('');
}

function paintColorRow() {
  const el = document.getElementById('avatar-color-row');
  if (!el) return;

  // 상점 탭은 색상 팔레트 없음
  if (activePrimary === 'shop') {
    el.innerHTML = '';
    return;
  }

  const sub = getCurrentSubDef();

  if (!sub.hasColor) {
    el.innerHTML = '';
    return;
  }

  // top-starcape: 색상 팔레트 숨김 (하드코딩 색상 전용)
  if (sub.id === 'top' && getEquippedStyleId('top') === 'top-starcape') {
    el.innerHTML = '';
    return;
  }

  // Hide color chips when the active slot has no equipped item.
  if (sub.allowNone && getEquippedStyleId(sub.id) == null) {
    el.innerHTML = '';
    return;
  }

  const palette = PALETTES[sub.id] || [];
  const current = getEquippedColor(sub.id);
  el.innerHTML = palette.map((hex) => `
    <button type="button"
            class="avatar-color-chip${current && current.toLowerCase() === hex.toLowerCase() ? ' is-selected' : ''}"
            style="background-color:${hex};"
            data-color="${hex}"
            aria-label="${hex}"></button>
  `).join('');
}

// ---------------------------------------------------------------------------
// State mutations
// ---------------------------------------------------------------------------

function getEquippedStyleId(sub) {
  if (sub === 'color')   return config.body.color;
  if (sub === 'symbol')  return config.body.symbol ? config.body.symbol.id : null;
  if (sub === 'top')     return config.clothing.top ? config.clothing.top.style : null;
  if (sub === 'hat')     return config.accessories.hat ? config.accessories.hat.style : null;
  if (sub === 'glasses') return config.accessories.glasses ? config.accessories.glasses.style : null;
  if (sub === 'other')   return config.accessories.other ? config.accessories.other.style : null;
  return null;
}

function getEquippedColor(sub) {
  if (sub === 'symbol')  return config.body.symbol ? config.body.symbol.color : null;
  if (sub === 'top')     return config.clothing.top ? config.clothing.top.color : null;
  if (sub === 'hat')     return config.accessories.hat ? config.accessories.hat.color : null;
  if (sub === 'glasses') return config.accessories.glasses ? config.accessories.glasses.color : null;
  if (sub === 'other')   return config.accessories.other ? config.accessories.other.color : null;
  return null;
}

function renderItemThumbnail(item, category) {
  if (!item) return '';
  if (category === 'top') {
    const color = item.id === 'top-starcape'
      ? null
      : (getEquippedColor('top') || '#7c3aed');
    return `
      <svg viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g transform="translate(120 160) scale(0.82) translate(-120 -160)">
          ${renderOutfitFragment(item, color)}
        </g>
      </svg>
    `;
  }
  return item.thumbnail || '';
}

function setBodyColor(hex) {
  // hex is actually a BATTERY_COLORS id like 'bat-white'
  // If it looks like a battery color id, resolve to hex; otherwise treat as direct hex
  const found = BATTERY_COLORS.find((bc) => bc.id === hex);
  config.body.color = found ? found.base : hex;
}

function setBodySymbol(id) {
  const prevColor = (config.body.symbol && config.body.symbol.color) || '#22c55e';
  const validId = id && BODY_SYMBOLS.some((s) => s.id === id) ? id : 'sym-bolt';
  config.body.symbol = { id: validId, color: prevColor };
}

function setTop(styleId) {
  const prevColor = (config.clothing.top && config.clothing.top.color) || PALETTES.top[0];
  config.clothing.top = styleId == null
    ? null
    : { style: styleId, color: prevColor };
}

function setAccessory(sub, styleIdOrNull) {
  if (styleIdOrNull == null) {
    config.accessories[sub] = null;
  } else {
    const prev = config.accessories[sub];
    const prevColor = (prev && prev.color) || (PALETTES[sub] && PALETTES[sub][0]) || '#000000';
    config.accessories[sub] = { style: styleIdOrNull, color: prevColor };
  }
}

function setColor(sub, color) {
  if (sub === 'symbol')  { if (config.body.symbol) config.body.symbol.color = color; return; }
  if (sub === 'top')     { if (config.clothing.top)      config.clothing.top.color     = color; return; }
  if (sub === 'hat')     { if (config.accessories.hat)     config.accessories.hat.color    = color; return; }
  if (sub === 'glasses') { if (config.accessories.glasses) config.accessories.glasses.color = color; return; }
  if (sub === 'other')   { if (config.accessories.other)   config.accessories.other.color  = color; return; }
}

// ---------------------------------------------------------------------------
// Buy modal
// ---------------------------------------------------------------------------

let _pendingPurchaseId = null;

function openBuyModal(itemId) {
  const price = getItemPrice(itemId) ?? 0;
  const modal = document.getElementById('avatar-buy-modal');
  if (!modal) return;
  const titleEl = document.getElementById('avatar-buy-title');
  const priceEl = document.getElementById('avatar-buy-price');
  // Find item name
  let itemName = itemId;
  const sym = BODY_SYMBOLS.find((s) => s.id === itemId);
  if (sym) itemName = sym.label;
  else {
    const outfit = (() => {
      for (const cat of ['top', 'hat', 'glasses', 'other']) {
        const found = getByCategory(cat).find((i) => i.id === itemId);
        if (found) return found;
      }
      return null;
    })();
    if (outfit) itemName = outfit.name;
  }
  if (titleEl) titleEl.textContent = `"${itemName}" 구매`;
  if (priceEl) priceEl.textContent = `가격: ${price} 🔋 (잔액: ${wallet.balance} 🔋)`;
  _pendingPurchaseId = itemId;
  modal.hidden = false;
}

function closeBuyModal() {
  const modal = document.getElementById('avatar-buy-modal');
  if (modal) modal.hidden = true;
  _pendingPurchaseId = null;
}

async function executePurchase() {
  const itemId = _pendingPurchaseId;
  closeBuyModal();
  if (!itemId) return;

  try {
    const res = await fetch(`${API_BASE}/api/shop/purchase`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      revertPreview();
      const errMsg = json.error === 'insufficient_battery' ? '배터리 잔액이 부족합니다' :
                     json.error === 'already_owned' ? '이미 소유한 아이템입니다' :
                     json.error === 'invalid_item' ? '유효하지 않은 아이템입니다' :
                     '구매 실패';
      showToast(errMsg, true);
      return;
    }
    // Success
    if (typeof json.balance === 'number') wallet.balance = json.balance;
    if (Array.isArray(json.ownedItemIds)) {
      json.ownedItemIds.forEach((id) => wallet.ownedItemIds.add(id));
    } else {
      wallet.ownedItemIds.add(itemId);
    }
    updateBalanceBadge();
    showToast('구매 완료! 아이템이 장착되었습니다', false);

    // Restore snapshot then apply ONLY purchased itemId.
    // Guards against in-flight preview swap to other unowned items.
    if (previewSnapshot != null) {
      config = previewSnapshot;
      previewSnapshot = null;
      previewItemId = null;
    }
    const entry = SHOP_CATALOG[itemId];
    const cat = entry ? entry.category : null;
    if (cat === 'symbol') setBodySymbol(itemId);
    else if (cat === 'top') setTop(itemId);
    else if (cat) setAccessory(cat, itemId);
    commitChange();
  } catch (_) {
    revertPreview();
    showToast('구매 중 오류가 발생했습니다', true);
  }
}

// ---------------------------------------------------------------------------
// Preview transaction
// ---------------------------------------------------------------------------

function applyPreview(itemId) {
  if (previewSnapshot == null) {
    previewSnapshot = JSON.parse(JSON.stringify(config));
  }
  previewItemId = itemId;
  const entry = SHOP_CATALOG[itemId];
  const cat = entry ? entry.category : null;
  if (cat === 'symbol') setBodySymbol(itemId);
  else if (cat === 'top') setTop(itemId);
  else if (cat) setAccessory(cat, itemId);
  paintCharacter();
}

function revertPreview() {
  if (previewSnapshot == null) return;
  config = previewSnapshot;
  previewSnapshot = null;
  previewItemId = null;
  paintCharacter();
  paintGrid();
  paintColorRow();
}

// ---------------------------------------------------------------------------
// Item click
// ---------------------------------------------------------------------------

function onItemClick(id) {
  if (activePrimary === 'shop') {
    if (!isOwned(id)) {
      applyPreview(id);
      openBuyModal(id);
      return;
    }
    if (previewSnapshot) revertPreview();
    const cat = (() => {
      const e = SHOP_CATALOG[id];
      return e ? e.category : null;
    })();
    if (!cat) return;
    if (cat === 'symbol') setBodySymbol(id);
    else if (cat === 'top') setTop(id);
    else setAccessory(cat, id);
    commitChange();
    return;
  }

  if (previewSnapshot) revertPreview();
  const sub = getCurrentSubDef();
  if (sub.id === 'color') {
    setBodyColor(id);
  } else if (sub.id === 'symbol') {
    setBodySymbol(id);
  } else if (sub.id === 'top') {
    setTop(id === '__none__' ? null : id);
  } else {
    setAccessory(sub.id, id === '__none__' ? null : id);
  }
  commitChange();
}

function commitChange() {
  if (previewSnapshot) return;
  isDirty = true;
  saveLocalConfig();
  paintCharacter();
  paintGrid();
  paintColorRow();
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function onBack() {
  if (previewSnapshot) revertPreview();
  if (isDirty) {
    const ok = window.confirm('저장되지 않은 변경사항이 있어요. 저장하지 않고 나가시겠어요?');
    if (!ok) return;
  }
  location.href = 'index.html';
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function onRandom() {
  if (previewSnapshot) { revertPreview(); return; }
  // body.symbol: owned symbols에서 pick
  const ownedSymbols = BODY_SYMBOLS.filter((s) => isOwned(s.id));
  if (ownedSymbols.length) {
    const sym = pickRandom(ownedSymbols);
    const prevColor = (config.body.symbol && config.body.symbol.color) || '#22c55e';
    config.body.symbol = { id: sym.id, color: pickRandom(PALETTES.symbol) };
  }

  // clothing: 50% chance of "none", owned tops only
  const ownedTops = getByCategory('top').filter((i) => isOwned(i.id));
  setTop(Math.random() < 0.5 || !ownedTops.length ? null : pickRandom(ownedTops).id);

  // Accessories: 50% chance of "none", owned items only
  const ownedHats    = getByCategory('hat').filter((i) => isOwned(i.id));
  const ownedGlasses = getByCategory('glasses').filter((i) => isOwned(i.id));
  const ownedOther   = getByCategory('other').filter((i) => isOwned(i.id));

  setAccessory('hat',     Math.random() < 0.5 || !ownedHats.length    ? null : pickRandom(ownedHats).id);
  setAccessory('glasses', Math.random() < 0.5 || !ownedGlasses.length ? null : pickRandom(ownedGlasses).id);
  setAccessory('other',   Math.random() < 0.5 || !ownedOther.length   ? null : pickRandom(ownedOther).id);

  // Randomize colors
  if (config.body.symbol)          config.body.symbol.color          = pickRandom(PALETTES.symbol);
  if (config.clothing.top)         config.clothing.top.color         = pickRandom(PALETTES.top);
  if (config.accessories.hat)      config.accessories.hat.color      = pickRandom(PALETTES.hat);
  if (config.accessories.glasses)  config.accessories.glasses.color  = pickRandom(PALETTES.glasses);
  if (config.accessories.other)    config.accessories.other.color    = pickRandom(PALETTES.other);

  commitChange();
  showToast('랜덤 적용', false);
}

function onReset() {
  if (previewSnapshot) { revertPreview(); return; }
  if (!window.confirm('기본 모습으로 되돌릴까요?')) return;
  config = cloneDefault();
  commitChange();
  showToast('기본값으로 초기화', false);
}

async function onFinish() {
  try {
    await saveRemoteConfig();
    isDirty = false;
    showToast('저장 완료', false);
    setTimeout(() => { location.href = 'index.html'; }, 600);
  } catch (_) {
    showToast('저장 실패', true);
  }
}

function showToast(text, isError) {
  const toast = document.getElementById('avatar-toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.toggle('is-error', !!isError);
  toast.classList.add('is-show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2400);
}

// ---------------------------------------------------------------------------
// Username badge
// ---------------------------------------------------------------------------

function resolveUsername() {
  const el = document.getElementById('avatar-username');
  if (!el) return;

  const myName = document.getElementById('my-name');
  const nameFromHeader = myName ? myName.textContent.trim() : '';
  if (nameFromHeader && nameFromHeader !== '사용자 이름') {
    el.textContent = nameFromHeader;
    return;
  }

  try {
    const raw = localStorage.getItem(DEMO_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) {
        el.textContent = parsed.username;
        return;
      }
    }
  } catch (_) {}

  fetch(`${API_BASE}/api/me`, { credentials: 'include' })
    .then((r) => r.ok ? r.json() : null)
    .then((j) => {
      if (j && j.user && j.user.username) {
        const fresh = document.getElementById('avatar-username');
        if (fresh) fresh.textContent = j.user.username;
      }
    })
    .catch(() => {});
}

// ---------------------------------------------------------------------------
// Eye tracking
// ---------------------------------------------------------------------------

let eyeTrackBound = false;

function setupEyeTracking() {
  if (eyeTrackBound) return;
  eyeTrackBound = true;
  document.addEventListener('mousemove', onAvatarEyeMove);
  requestAnimationFrame(animateAvatarEye);
}

const EYE_SVG_RADIUS  = 38;
const PUPIL_SVG_RADIUS = 20;
const MAX_OFFSET_SVG   = EYE_SVG_RADIUS - PUPIL_SVG_RADIUS - 2;
const STIFFNESS        = 0.07;
const DAMPING          = 0.78;
const MAX_SPEED        = 2.4;
const SHAKE_REVERSALS  = 4;
const SHAKE_WINDOW_MS  = 400;

let _eyeTargetX = 0, _eyeTargetY = 0;
let _eyePosX    = 0, _eyePosY    = 0;
let _eyeVelX    = 0, _eyeVelY    = 0;
let _lastMouseX = null, _lastDxSign = 0;
const _eyeReversals = [];
let _eyeShaking = false;

function onAvatarEyeMove(e) {
  const eye = document.querySelector('#avatar-character .char-eye');
  if (!eye) return;
  const now = performance.now();
  if (_lastMouseX !== null) {
    const sign = Math.sign(e.clientX - _lastMouseX);
    if (sign !== 0) {
      if (_lastDxSign !== 0 && sign !== _lastDxSign) _eyeReversals.push(now);
      _lastDxSign = sign;
    }
  }
  _lastMouseX = e.clientX;
  while (_eyeReversals.length && now - _eyeReversals[0] > SHAKE_WINDOW_MS) _eyeReversals.shift();
  const wasShaking = _eyeShaking;
  _eyeShaking = _eyeReversals.length >= SHAKE_REVERSALS;
  if (_eyeShaking) {
    if (!wasShaking) { _eyeTargetX = _eyePosX; _eyeTargetY = _eyePosY; _eyeVelX = _eyeVelY = 0; }
    return;
  }
  const rect = eye.getBoundingClientRect();
  if (!rect.width) return;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  const scale = rect.width / (EYE_SVG_RADIUS * 2);
  const dx = (e.clientX - cx) / scale;
  const dy = (e.clientY - cy) / scale;
  const dist  = Math.hypot(dx, dy);
  const ratio = dist > MAX_OFFSET_SVG ? MAX_OFFSET_SVG / dist : 1;
  _eyeTargetX = dx * ratio;
  _eyeTargetY = dy * ratio;
}

function animateAvatarEye() {
  const pupil = document.querySelector('#avatar-character .char-pupil');
  if (!pupil) { requestAnimationFrame(animateAvatarEye); return; }
  const ax = (_eyeTargetX - _eyePosX) * STIFFNESS;
  const ay = (_eyeTargetY - _eyePosY) * STIFFNESS;
  _eyeVelX = (_eyeVelX + ax) * DAMPING;
  _eyeVelY = (_eyeVelY + ay) * DAMPING;
  const speed = Math.hypot(_eyeVelX, _eyeVelY);
  if (speed > MAX_SPEED) { _eyeVelX = (_eyeVelX / speed) * MAX_SPEED; _eyeVelY = (_eyeVelY / speed) * MAX_SPEED; }
  _eyePosX += _eyeVelX;
  _eyePosY += _eyeVelY;
  const r = Math.hypot(_eyePosX, _eyePosY);
  if (r > MAX_OFFSET_SVG) { _eyePosX = (_eyePosX / r) * MAX_OFFSET_SVG; _eyePosY = (_eyePosY / r) * MAX_OFFSET_SVG; _eyeVelX = _eyeVelY = 0; }
  pupil.setAttribute('transform', `translate(${_eyePosX.toFixed(2)} ${_eyePosY.toFixed(2)})`);
  requestAnimationFrame(animateAvatarEye);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

function render() {
  if (isLoggedIn()) {
    renderEditor();
  } else {
    renderEmpty();
  }
}

let authResolved = false;
async function resolveAndRender() {
  authResolved = true;
  render();
  if (isLoggedIn()) {
    const remote = await fetchRemoteConfig();
    if (remote) {
      config = remote;
      isDirty = false;
      saveLocalConfig();
      paintCharacter();
      paintGrid();
      paintColorRow();
    }
    // Load wallet after config is resolved
    await loadWallet();
    paintGrid(); // refresh lock/owned badges after wallet load
  }
}

window.addEventListener('codenergy:auth', resolveAndRender);

if (isLoggedIn()) {
  resolveAndRender();
} else {
  setTimeout(() => {
    if (!authResolved) resolveAndRender();
  }, 2000);
}

// Watch #my-wrap visibility change
const myWrap = document.getElementById('my-wrap');
if (myWrap) {
  const obs = new MutationObserver(() => render());
  obs.observe(myWrap, { attributes: true, attributeFilter: ['hidden'] });
}
