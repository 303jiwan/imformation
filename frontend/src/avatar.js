/* =====================================================================
   avatar.js — 아바타 에디터 컨트롤러 (새 schema, plan step 6)

   - 3단 탭 (신체/의상/악세사리) × 세컨더리 탭
   - 4×2 아이템 그리드
   - 색상 팔레트
   - Back / Finish Editing 버튼
   ===================================================================== */

import './avatar/avatar.css';
import {
  renderCharacter,
  DEFAULT_CONFIG,
  SKIN_TONES,
  normalizeConfig,
} from './avatar/character.js';
import { getByCategory } from './avatar/outfits.js';

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
      { id: 'skin', label: '피부', hasColor: false, allowNone: false },
      { id: 'hair', label: '머리', hasColor: true,  allowNone: false },
    ],
  },
  clothing: {
    label: '의상',
    subs: [
      { id: 'top',    label: '상의', hasColor: true, allowNone: false },
      { id: 'bottom', label: '하의', hasColor: true, allowNone: false },
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
};

const PALETTES = {
  hair:    ['#1f2937','#5b3a1d','#8b5e34','#c9a47a','#e6b34a','#9ca3af','#ef4444','#a855f7','#22c55e'],
  top:     ['#ffffff','#1f2937','#a855f7','#3b82f6','#ef4444','#10b981','#fbbf24','#f97316','#22c55e'],
  bottom:  ['#1e3a8a','#374151','#3b82f6','#92400e','#ffffff','#000000','#a855f7','#ef4444','#10b981'],
  hat:     ['#1f2937','#404040','#cbd5e1','#3b82f6','#a855f7','#ef4444','#fbbf24','#92400e','#10b981'],
  glasses: ['#000000','#374151','#92400e','#ef4444','#3b82f6','#a855f7','#10b981','#fbbf24','#9ca3af'],
  other:   ['#fcd34d','#9ca3af','#ef4444','#3b82f6','#a855f7','#10b981','#fbbf24','#f97316','#000000'],
};

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
let activeSecondary = 'skin';
let toastTimer     = null;

// ---------------------------------------------------------------------------
// Logged-out view
// ---------------------------------------------------------------------------

function renderEmpty() {
  root.innerHTML = '';
  sessionStorage.setItem('codenergy:redirectAfterLogin', 'avatar.html');

  // Open the login modal — try the header button first (registers all main.js state),
  // then fall back to directly removing hidden in case main.js hasn't registered yet.
  function openLoginModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    if (!modal.hidden) return; // already open

    const headerLoginBtn = document.getElementById('login-btn');
    if (headerLoginBtn) {
      headerLoginBtn.click();
    }
    // Fallback: if click didn't open the modal (e.g. listener not yet attached),
    // open it directly.
    if (modal.hidden) {
      modal.hidden = false;
    }
  }

  openLoginModal();

  // Watch for modal close while still logged-out → redirect to index
  const modal = document.getElementById('auth-modal');
  if (modal) {
    const obs = new MutationObserver(() => {
      if (!modal.hidden) return; // modal still open or just opened
      obs.disconnect();
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
        <div class="avatar-username" id="avatar-username">me</div>
        <div class="avatar-stage">
          <div class="avatar-character" id="avatar-character"></div>
        </div>
        <div class="avatar-tabs avatar-tabs--primary"   id="avatar-primary"></div>
        <div class="avatar-tabs avatar-tabs--secondary" id="avatar-secondary"></div>
        <div class="avatar-color-row" id="avatar-color-row"></div>
        <div class="avatar-grid" id="avatar-grid"></div>
        <div class="avatar-actions">
          <button type="button" class="avatar-btn avatar-btn--ghost"   data-action="back">Back</button>
          <button type="button" class="avatar-btn avatar-btn--primary" data-action="finish">Finish Editing</button>
        </div>
        <div class="avatar-toast" id="avatar-toast" role="status" aria-live="polite"></div>
      </div>
    </div>
  `;

  paintCharacter();
  paintPrimaryTabs();
  paintSecondaryTabs();
  paintGrid();
  paintColorRow();
  resolveUsername();

  root.addEventListener('click', onRootClick);
}

function onRootClick(e) {
  // Check data-action buttons first (Back / Finish Editing)
  const actionBtn = e.target.closest('[data-action]');
  if (actionBtn) {
    if (actionBtn.dataset.action === 'back')   { onBack();   return; }
    if (actionBtn.dataset.action === 'finish') { onFinish(); return; }
  }

  // Primary tab click — identified by data-primary attribute
  const primaryTab = e.target.closest('.avatar-tab[data-primary]');
  if (primaryTab) {
    activePrimary  = primaryTab.dataset.primary;
    activeSecondary = CATEGORIES[activePrimary].subs[0].id;
    paintPrimaryTabs();
    paintSecondaryTabs();
    paintGrid();
    paintColorRow();
    return;
  }

  // Secondary tab click — identified by data-secondary attribute
  const secondaryTab = e.target.closest('.avatar-tab[data-secondary]');
  if (secondaryTab) {
    activeSecondary = secondaryTab.dataset.secondary;
    paintSecondaryTabs();
    paintGrid();
    paintColorRow();
    return;
  }

  // Item grid cell — identified by data-id attribute on .avatar-item
  const item = e.target.closest('.avatar-item[data-id]');
  if (item) {
    const id = item.dataset.id;
    onItemClick(id);
    return;
  }

  // Color chip — identified by data-color attribute on .avatar-color-chip
  const chip = e.target.closest('.avatar-color-chip[data-color]');
  if (chip) {
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
            class="avatar-tab${key === activePrimary ? ' is-active' : ''}"
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

  if (sub.id === 'skin') {
    // 6 skin tone swatches
    SKIN_TONES.forEach((tone) => {
      const equipped = config.body.skinTone === tone.id;
      cells.push(`
        <button type="button"
                class="avatar-item avatar-item--skin${equipped ? ' is-equipped' : ''}"
                data-id="${tone.id}">
          <span class="avatar-item__thumb">
            <span class="avatar-item__thumb-skin" style="background-color:${tone.base};"></span>
          </span>
          <span>${tone.label}</span>
        </button>
      `);
    });
  } else {
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
    const items = getByCategory(sub.id);
    const equippedId = getEquippedStyleId(sub.id);
    items.forEach((item) => {
      const equipped = equippedId === item.id;
      cells.push(`
        <button type="button"
                class="avatar-item${equipped ? ' is-equipped' : ''}"
                data-id="${item.id}">
          <span class="avatar-item__thumb">${item.thumbnail || ''}</span>
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
  const sub = getCurrentSubDef();

  if (!sub.hasColor) {
    el.innerHTML = '';
    return;
  }

  // Accessories: hide chips if nothing is equipped
  if (activePrimary === 'accessories' && getEquippedStyleId(sub.id) == null) {
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
  if (sub === 'skin')    return config.body.skinTone;
  if (sub === 'hair')    return config.body.hair ? config.body.hair.style : null;
  if (sub === 'top')     return config.clothing.top ? config.clothing.top.style : null;
  if (sub === 'bottom')  return config.clothing.bottom ? config.clothing.bottom.style : null;
  if (sub === 'hat')     return config.accessories.hat ? config.accessories.hat.style : null;
  if (sub === 'glasses') return config.accessories.glasses ? config.accessories.glasses.style : null;
  if (sub === 'other')   return config.accessories.other ? config.accessories.other.style : null;
  return null;
}

function getEquippedColor(sub) {
  if (sub === 'hair')    return config.body.hair ? config.body.hair.color : null;
  if (sub === 'top')     return config.clothing.top ? config.clothing.top.color : null;
  if (sub === 'bottom')  return config.clothing.bottom ? config.clothing.bottom.color : null;
  if (sub === 'hat')     return config.accessories.hat ? config.accessories.hat.color : null;
  if (sub === 'glasses') return config.accessories.glasses ? config.accessories.glasses.color : null;
  if (sub === 'other')   return config.accessories.other ? config.accessories.other.color : null;
  return null;
}

function setSkin(toneId) {
  config.body.skinTone = toneId;
}

function setHair(styleId) {
  const prevColor = (config.body.hair && config.body.hair.color) || PALETTES.hair[0];
  config.body.hair = { style: styleId || DEFAULT_CONFIG.body.hair.style, color: prevColor };
}

function setTop(styleId) {
  const prevColor = (config.clothing.top && config.clothing.top.color) || PALETTES.top[0];
  config.clothing.top = { style: styleId || DEFAULT_CONFIG.clothing.top.style, color: prevColor };
}

function setBottom(styleId) {
  const prevColor = (config.clothing.bottom && config.clothing.bottom.color) || PALETTES.bottom[0];
  config.clothing.bottom = { style: styleId || DEFAULT_CONFIG.clothing.bottom.style, color: prevColor };
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
  if (sub === 'hair')    { if (config.body.hair)         config.body.hair.color        = color; return; }
  if (sub === 'top')     { if (config.clothing.top)      config.clothing.top.color     = color; return; }
  if (sub === 'bottom')  { if (config.clothing.bottom)   config.clothing.bottom.color  = color; return; }
  if (sub === 'hat')     { if (config.accessories.hat)     config.accessories.hat.color    = color; return; }
  if (sub === 'glasses') { if (config.accessories.glasses) config.accessories.glasses.color = color; return; }
  if (sub === 'other')   { if (config.accessories.other)   config.accessories.other.color  = color; return; }
}

function onItemClick(id) {
  const sub = getCurrentSubDef();
  if (sub.id === 'skin') {
    setSkin(id);
  } else if (sub.id === 'hair') {
    setHair(id === '__none__' ? null : id);
  } else if (sub.id === 'top') {
    setTop(id === '__none__' ? null : id);
  } else if (sub.id === 'bottom') {
    setBottom(id === '__none__' ? null : id);
  } else {
    setAccessory(sub.id, id === '__none__' ? null : id);
  }
  commitChange();
}

function commitChange() {
  saveLocalConfig();
  paintCharacter();
  paintGrid();
  paintColorRow();
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function onBack() {
  location.href = 'index.html';
}

async function onFinish() {
  try {
    await saveRemoteConfig();
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

  // Immediate: try #my-name in the header
  const myName = document.getElementById('my-name');
  const nameFromHeader = myName ? myName.textContent.trim() : '';
  if (nameFromHeader && nameFromHeader !== '사용자 이름') {
    el.textContent = nameFromHeader;
    return;
  }

  // Try demo user in localStorage
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

  // Async: fetch /api/me
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
      saveLocalConfig();
      paintCharacter();
      paintGrid();
      paintColorRow();
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

// Watch #my-wrap visibility change
const myWrap = document.getElementById('my-wrap');
if (myWrap) {
  const obs = new MutationObserver(() => render());
  obs.observe(myWrap, { attributes: true, attributeFilter: ['hidden'] });
}
