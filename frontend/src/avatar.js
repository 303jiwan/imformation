/* =====================================================================
   Avatar customization page controller (new schema).

   - Auth-gated. Logged-out users see the empty-state CTA which opens the
     existing #auth-modal via the header login button (same path as the
     test-login flow).
   - When logged in, renders the stage (.avatar-character) plus an editor
     (.avatar-editor) with category tabs, a style grid, and a color row.
   - State is the new full config object (see DEFAULT_CONFIG in
     ./avatar/character.js). Saved to:
       * localStorage["codenergy:avatar:config"]  — every change, offline-safe
       * POST /api/avatar                         — when the Save button is hit
     Loaded from GET /api/avatar on boot, falling back to localStorage, then
     to DEFAULT_CONFIG.
   - Legacy localStorage["codenergy:avatar:equipped"] is migrated once on
     first load (best-effort; deleted afterwards).
   ===================================================================== */

import './avatar/avatar.css';
import {
  renderCharacter,
  DEFAULT_CONFIG,
  SKIN_TONES,
  normalizeConfig,
} from './avatar/character.js';
import { getByCategory } from './avatar/outfits.js';

const API_BASE = 'http://localhost:3000';
const STORAGE_KEY      = 'codenergy:avatar:config';
const LEGACY_STORAGE_KEY = 'codenergy:avatar:equipped';
const AUTH_HINT_KEY    = 'codenergy:auth:hint';
const DEMO_USER_KEY    = 'codenergy:demo:user';

// ---------------------------------------------------------------------------
// Categories (UI tab order) and per-category color palettes.
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'hair',       label: '헤어',    hasColor: true,  allowNone: false },
  { id: 'top',        label: '상의',    hasColor: true,  allowNone: false },
  { id: 'bottom',     label: '하의',    hasColor: true,  allowNone: false },
  { id: 'face',       label: '표정',    hasColor: false, allowNone: false },
  { id: 'hat',        label: '모자',    hasColor: true,  allowNone: true  },
  { id: 'glasses',    label: '안경',    hasColor: true,  allowNone: true  },
  { id: 'earrings',   label: '귀걸이',  hasColor: true,  allowNone: true  },
  { id: 'skin',       label: '피부톤',  hasColor: false, allowNone: false },
  { id: 'background', label: '배경',    hasColor: false, allowNone: false },
];

const PALETTES = {
  hair:     ['#1f2937', '#5b3a1d', '#8b5e34', '#c9a47a', '#e6b34a', '#9ca3af'],
  top:      ['#ffffff', '#1f2937', '#a855f7', '#3b82f6', '#ef4444', '#10b981', '#fbbf24'],
  bottom:   ['#1e3a8a', '#374151', '#3b82f6', '#92400e', '#ffffff'],
  hat:      ['#ef4444', '#1f2937', '#fbbf24', '#10b981', '#3b82f6', '#a855f7'],
  glasses:  ['#000000', '#374151', '#92400e', '#ef4444', '#3b82f6'],
  earrings: ['#fcd34d', '#9ca3af', '#ef4444', '#3b82f6'],
};

const BACKGROUNDS = [
  { id: 'default',  label: '기본'    },
  { id: 'sky',      label: '하늘'    },
  { id: 'sunset',   label: '노을'    },
  { id: 'mint',     label: '민트'    },
  { id: 'lavender', label: '라벤더'  },
];

const ACCESSORY_TYPES = new Set(['hat', 'glasses', 'earrings']);

// ---------------------------------------------------------------------------
// Persistence + auth helpers
// ---------------------------------------------------------------------------

function readAuthHint() {
  try { return localStorage.getItem(AUTH_HINT_KEY); } catch (_) { return null; }
}

function hasDemoUser() {
  try { return !!localStorage.getItem(DEMO_USER_KEY); } catch (_) { return false; }
}

function isLoggedIn() {
  const hint = readAuthHint();
  if (hint === 'logged-in' || hasDemoUser()) return true;
  if (hint === 'logged-out') return false;
  const myWrap = document.getElementById('my-wrap');
  return !!(myWrap && !myWrap.hidden);
}

function loadLocalConfig() {
  // Migrate legacy first (delete-on-success or delete-on-failure either way).
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        const migrated = normalizeConfig(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      } catch (_) { /* drop on parse failure */ }
      try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch (_) {}
    }
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

function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
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
// State
// ---------------------------------------------------------------------------

const root = document.getElementById('avatar-root');

let config = loadLocalConfig();
let activeCategory = 'hair';
let toastTimer = null;

// ---------------------------------------------------------------------------
// Empty (logged-out) view
// ---------------------------------------------------------------------------

function renderEmpty() {
  root.innerHTML = `
    <div class="avatar-empty">
      <div class="avatar-empty__icon" aria-hidden="true">👤</div>
      <h2 class="avatar-empty__title">아바타를 꾸미려면 로그인이 필요해요</h2>
      <p class="avatar-empty__desc">나만의 캐릭터에 옷과 모자를 입혀보세요.</p>
      <button type="button" class="cta avatar-empty__cta" id="avatar-empty-login">로그인하기</button>
    </div>
  `;
  const btn = document.getElementById('avatar-empty-login');
  if (btn) {
    btn.addEventListener('click', () => {
      const headerLoginBtn = document.getElementById('login-btn');
      if (headerLoginBtn && !headerLoginBtn.hidden) headerLoginBtn.click();
    });
  }
}

// ---------------------------------------------------------------------------
// Editor (logged-in) view
// ---------------------------------------------------------------------------

function renderEditor() {
  root.innerHTML = `
    <div class="avatar-page">
      <div class="avatar-stage">
        <div class="avatar-character" id="avatar-character"></div>
      </div>
      <div class="avatar-editor">
        <div class="avatar-tabs" id="avatar-tabs">
          ${CATEGORIES.map((c) => `
            <button type="button"
                    class="avatar-tab${c.id === activeCategory ? ' is-active' : ''}"
                    data-cat="${c.id}">${c.label}</button>
          `).join('')}
        </div>
        <div class="avatar-grid" id="avatar-grid"></div>
        <div class="avatar-color-row" id="avatar-color-row"></div>
        <div class="avatar-actions">
          <button type="button" class="avatar-save-btn" id="avatar-save">저장</button>
          <button type="button" class="ghost" id="avatar-reset">초기화</button>
        </div>
      </div>
      <div class="avatar-toast" id="avatar-toast" role="status" aria-live="polite"></div>
    </div>
  `;

  paintCharacter();
  paintEditor();

  document.getElementById('avatar-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.avatar-tab');
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    paintEditor();
  });

  document.getElementById('avatar-save').addEventListener('click', onSaveClick);

  const resetBtn = document.getElementById('avatar-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      config = cloneDefault();
      saveLocalConfig();
      paintCharacter();
      paintEditor();
    });
  }
}

// ---------------------------------------------------------------------------
// Painters
// ---------------------------------------------------------------------------

function paintCharacter() {
  const stage = document.getElementById('avatar-character');
  if (!stage) return;
  stage.innerHTML = renderCharacter(config);
}

function paintEditor() {
  // Sync tab active state without a full re-render.
  const tabs = document.getElementById('avatar-tabs');
  if (tabs) {
    tabs.querySelectorAll('.avatar-tab').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.cat === activeCategory);
    });
  }
  paintGrid();
  paintColorRow();
}

function getActiveCategoryDef() {
  return CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
}

function paintGrid() {
  const grid = document.getElementById('avatar-grid');
  if (!grid) return;
  const cat = getActiveCategoryDef();

  // SKIN TONE grid is special — one swatch per tone.
  if (cat.id === 'skin') {
    const cells = SKIN_TONES.map((tone) => {
      const isEquipped = config.skinTone === tone.id;
      return `
        <button type="button"
                class="avatar-item avatar-item--skin${isEquipped ? ' is-equipped' : ''}"
                data-tone="${tone.id}">
          <span class="avatar-item__thumb">
            <span class="avatar-item__thumb-skin" style="background-color: ${tone.base};"></span>
          </span>
          <span class="avatar-item__label">${tone.label}</span>
        </button>
      `;
    });
    grid.innerHTML = cells.join('');
    grid.querySelectorAll('.avatar-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        config.skinTone = btn.dataset.tone;
        commitChange();
      });
    });
    return;
  }

  // BACKGROUND grid — gradient swatches.
  if (cat.id === 'background') {
    const cells = BACKGROUNDS.map((bg) => {
      const isEquipped = (config.background || 'default') === bg.id;
      return `
        <button type="button"
                class="avatar-item avatar-item--bg${isEquipped ? ' is-equipped' : ''}"
                data-bg="${bg.id}">
          <span class="avatar-item__thumb avatar-item__thumb--bg-${bg.id}"></span>
          <span class="avatar-item__label">${bg.label}</span>
        </button>
      `;
    });
    grid.innerHTML = cells.join('');
    grid.querySelectorAll('.avatar-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        config.background = btn.dataset.bg;
        commitChange();
      });
    });
    return;
  }

  // Generic categories: list of styles, optional "none" cell.
  const items = getByCategory(cat.id) || [];
  const equippedStyleId = getEquippedStyleId(cat.id);
  const cells = [];

  if (cat.allowNone) {
    const noneSelected = equippedStyleId == null;
    cells.push(`
      <button type="button"
              class="avatar-item${noneSelected ? ' is-equipped' : ''}"
              data-id="__none__">
        <span class="avatar-item__thumb" aria-hidden="true">∅</span>
        <span class="avatar-item__label">없음</span>
      </button>
    `);
  }

  items.forEach((item) => {
    const isEquipped = equippedStyleId === item.id;
    cells.push(`
      <button type="button"
              class="avatar-item${isEquipped ? ' is-equipped' : ''}"
              data-id="${item.id}">
        <span class="avatar-item__thumb">${item.thumbnail || ''}</span>
        <span class="avatar-item__label">${item.name || ''}</span>
      </button>
    `);
  });

  grid.innerHTML = cells.join('');
  grid.querySelectorAll('.avatar-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      setEquippedStyleId(cat.id, id === '__none__' ? null : id);
      commitChange();
    });
  });
}

function paintColorRow() {
  const row = document.getElementById('avatar-color-row');
  if (!row) return;
  const cat = getActiveCategoryDef();
  if (!cat.hasColor) {
    row.innerHTML = '';
    return;
  }
  const palette = PALETTES[cat.id] || [];
  const current = getEquippedColor(cat.id);
  // For accessory categories with no item equipped, hide chips.
  if (ACCESSORY_TYPES.has(cat.id) && getEquippedStyleId(cat.id) == null) {
    row.innerHTML = '';
    return;
  }
  row.innerHTML = palette.map((hex) => `
    <button type="button"
            class="avatar-color-chip${current && current.toLowerCase() === hex.toLowerCase() ? ' is-selected' : ''}"
            style="background-color: ${hex};"
            data-color="${hex}"
            aria-label="${hex}"></button>
  `).join('');

  row.querySelectorAll('.avatar-color-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      setEquippedColor(cat.id, chip.dataset.color);
      commitChange();
    });
  });
}

// ---------------------------------------------------------------------------
// State mutations (per-category)
// ---------------------------------------------------------------------------

function getEquippedStyleId(cat) {
  if (cat === 'face')   return config.face   ? config.face.style   : null;
  if (cat === 'hair')   return config.hair   ? config.hair.style   : null;
  if (cat === 'top')    return config.top    ? config.top.style    : null;
  if (cat === 'bottom') return config.bottom ? config.bottom.style : null;
  if (ACCESSORY_TYPES.has(cat)) {
    const acc = (config.accessories || []).find((a) => a && a.type === cat);
    return acc ? acc.style : null;
  }
  return null;
}

function getEquippedColor(cat) {
  if (cat === 'hair')   return config.hair   ? config.hair.color   : null;
  if (cat === 'top')    return config.top    ? config.top.color    : null;
  if (cat === 'bottom') return config.bottom ? config.bottom.color : null;
  if (ACCESSORY_TYPES.has(cat)) {
    const acc = (config.accessories || []).find((a) => a && a.type === cat);
    return acc ? acc.color : null;
  }
  return null;
}

function setEquippedStyleId(cat, styleId) {
  if (cat === 'face') {
    if (styleId == null) {
      // face has allowNone:false in spec, but be defensive.
      config.face = { ...DEFAULT_CONFIG.face };
    } else {
      config.face = { style: styleId };
    }
    return;
  }
  if (cat === 'hair' || cat === 'top' || cat === 'bottom') {
    if (styleId == null) {
      config[cat] = { ...DEFAULT_CONFIG[cat] };
    } else {
      const prev = config[cat] || {};
      const color = prev.color || (PALETTES[cat] && PALETTES[cat][0]) || '#000000';
      config[cat] = { style: styleId, color };
    }
    return;
  }
  if (ACCESSORY_TYPES.has(cat)) {
    const list = Array.isArray(config.accessories) ? config.accessories.slice() : [];
    const idx = list.findIndex((a) => a && a.type === cat);
    if (styleId == null) {
      if (idx >= 0) list.splice(idx, 1);
    } else {
      const color = (idx >= 0 && list[idx].color) || (PALETTES[cat] && PALETTES[cat][0]) || '#000000';
      const next = { type: cat, style: styleId, color };
      if (idx >= 0) list[idx] = next;
      else list.push(next);
    }
    config.accessories = list;
  }
}

function setEquippedColor(cat, color) {
  if (cat === 'hair' || cat === 'top' || cat === 'bottom') {
    if (!config[cat]) config[cat] = { ...DEFAULT_CONFIG[cat] };
    config[cat] = { ...config[cat], color };
    return;
  }
  if (ACCESSORY_TYPES.has(cat)) {
    const list = Array.isArray(config.accessories) ? config.accessories.slice() : [];
    const idx = list.findIndex((a) => a && a.type === cat);
    if (idx < 0) return; // no item equipped, color is a no-op
    list[idx] = { ...list[idx], color };
    config.accessories = list;
  }
}

function commitChange() {
  saveLocalConfig();
  paintCharacter();
  paintEditor();
}

// ---------------------------------------------------------------------------
// Save flow
// ---------------------------------------------------------------------------

async function onSaveClick() {
  const btn = document.getElementById('avatar-save');
  if (btn) btn.disabled = true;
  try {
    await saveRemoteConfig();
    showToast('저장 완료', false);
  } catch (err) {
    showToast('저장 실패', true);
  } finally {
    if (btn) btn.disabled = false;
  }
}

function showToast(text, isError) {
  const toast = document.getElementById('avatar-toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.toggle('is-error', !!isError);
  toast.classList.add('is-show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-show');
  }, 2400);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

function render() {
  if (isLoggedIn()) renderEditor();
  else renderEmpty();
}

let authResolved = false;
async function resolveAndRender() {
  authResolved = true;
  render();
  // After rendering the editor optimistically from local cache, try to pull
  // the canonical config from the server and re-render if it differs.
  if (isLoggedIn()) {
    const remote = await fetchRemoteConfig();
    if (remote) {
      config = remote;
      saveLocalConfig();
      paintCharacter();
      paintEditor();
    }
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

// React to login/logout changes that flip #my-wrap visibility.
const myWrap = document.getElementById('my-wrap');
if (myWrap) {
  const observer = new MutationObserver(() => render());
  observer.observe(myWrap, { attributes: true, attributeFilter: ['hidden'] });
}
