/* =====================================================================
   Avatar customization page controller.
   - Auth-gated: when logged out, shows an empty-state CTA that opens the
     existing #auth-modal (via the header login button click — same path
     used by test-login.js).
   - When logged in, renders a stage (current character) and a wardrobe
     panel with category tabs (top / bottom / hat / face).
   - Equipped state persists to localStorage["codenergy:avatar:equipped"].
   - Listens to the codenergy:auth event so that logging out while on the
     page reverts the UI to the empty state without a reload.
   ===================================================================== */

import './avatar/avatar.css';
import { renderCharacter, DEFAULT_EQUIPPED, SKIN_TONES } from './avatar/character.js';
import { OUTFITS, getByCategory } from './avatar/outfits.js';

const STORAGE_KEY = 'codenergy:avatar:equipped';

const CATEGORIES = [
  { id: 'top', label: '상의', allowNone: false },
  { id: 'bottom', label: '하의', allowNone: false },
  { id: 'hat', label: '모자', allowNone: true },
  { id: 'face', label: '표정', allowNone: false },
  { id: 'skin', label: '피부톤', allowNone: false },
];

const root = document.getElementById('avatar-root');

let equipped = loadEquipped();
let activeCategory = 'top';

/* ---------- persistence ---------- */

function loadEquipped() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_EQUIPPED };
    const parsed = JSON.parse(raw);
    return {
      top: parsed.top ?? DEFAULT_EQUIPPED.top,
      bottom: parsed.bottom ?? DEFAULT_EQUIPPED.bottom,
      hat: 'hat' in parsed ? parsed.hat : DEFAULT_EQUIPPED.hat,
      face: parsed.face ?? DEFAULT_EQUIPPED.face,
      skinTone: parsed.skinTone ?? DEFAULT_EQUIPPED.skinTone,
    };
  } catch (_) {
    return { ...DEFAULT_EQUIPPED };
  }
}

function saveEquipped() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(equipped));
  } catch (_) {}
}

/* ---------- auth detection ---------- */

function isLoggedIn() {
  // Same heuristic as the rest of the app: #my-wrap is unhidden by main.js
  // when /api/me returns a user (see setLoggedIn in main.js).
  const myWrap = document.getElementById('my-wrap');
  return !!(myWrap && !myWrap.hidden);
}

/* ---------- empty (logged-out) view ---------- */

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

/* ---------- equipped (logged-in) view ---------- */

function renderEquipped() {
  root.innerHTML = `
    <div class="avatar-stage">
      <div class="avatar-character" id="avatar-character"></div>
    </div>
    <div class="avatar-wardrobe">
      <div class="avatar-tabs" id="avatar-tabs">
        ${CATEGORIES.map((c) => `
          <button type="button" class="avatar-tab${c.id === activeCategory ? ' is-active' : ''}" data-cat="${c.id}">${c.label}</button>
        `).join('')}
      </div>
      <div class="avatar-grid" id="avatar-grid"></div>
      <div class="avatar-actions">
        <button type="button" class="ghost" id="avatar-reset">초기화</button>
      </div>
    </div>
  `;

  paintCharacter();
  paintGrid();

  const tabs = document.getElementById('avatar-tabs');
  if (tabs) {
    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.avatar-tab');
      if (!btn) return;
      activeCategory = btn.dataset.cat;
      tabs.querySelectorAll('.avatar-tab').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.cat === activeCategory);
      });
      paintGrid();
    });
  }

  const resetBtn = document.getElementById('avatar-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      equipped = { ...DEFAULT_EQUIPPED };
      saveEquipped();
      paintCharacter();
      paintGrid();
    });
  }
}

function paintCharacter() {
  const stage = document.getElementById('avatar-character');
  if (!stage) return;
  stage.innerHTML = renderCharacter(equipped);
}

function paintGrid() {
  const grid = document.getElementById('avatar-grid');
  if (!grid) return;

  const cat = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  if (cat.id === 'skin') {
    const tones = Array.isArray(SKIN_TONES) ? SKIN_TONES : [];
    const cells = tones.map((tone) => {
      const isEquipped = equipped.skinTone === tone.id;
      return `
        <button type="button" class="avatar-item avatar-item--skin${isEquipped ? ' is-equipped' : ''}" data-tone="${tone.id}">
          <span class="avatar-item__thumb">
            <span class="avatar-item__thumb-skin" style="background-color: ${tone.base};"></span>
          </span>
          <span class="avatar-item__label">${tone.label || ''}</span>
        </button>
      `;
    });

    grid.innerHTML = cells.join('');

    grid.querySelectorAll('.avatar-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const toneId = btn.dataset.tone;
        if (!toneId) return;
        equipped.skinTone = toneId;
        saveEquipped();
        paintCharacter();
        paintGrid();
      });
    });
    return;
  }

  const items = (typeof getByCategory === 'function')
    ? (getByCategory(cat.id) || [])
    : (OUTFITS || []).filter((o) => o.category === cat.id);

  const cells = [];

  if (cat.allowNone) {
    const noneEquipped = equipped[cat.id] == null;
    cells.push(`
      <button type="button" class="avatar-item${noneEquipped ? ' is-equipped' : ''}" data-id="__none__">
        <span class="avatar-item__thumb" aria-hidden="true">∅</span>
        <span class="avatar-item__label">없음</span>
      </button>
    `);
  }

  items.forEach((item) => {
    const isEquipped = equipped[cat.id] === item.id;
    cells.push(`
      <button type="button" class="avatar-item${isEquipped ? ' is-equipped' : ''}" data-id="${item.id}">
        <span class="avatar-item__thumb">${item.thumbnail || ''}</span>
        <span class="avatar-item__label">${item.name || ''}</span>
      </button>
    `);
  });

  grid.innerHTML = cells.join('');

  grid.querySelectorAll('.avatar-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      equipped[cat.id] = (id === '__none__') ? null : id;
      saveEquipped();
      paintCharacter();
      paintGrid();
    });
  });
}

/* ---------- bootstrap ---------- */

function render() {
  if (isLoggedIn()) renderEquipped();
  else renderEmpty();
}

// React to auth-state changes from main.js (initial /api/me, login, logout).
window.addEventListener('codenergy:auth', () => {
  render();
});

// Initial render — main.js may not have finished its session check yet, so
// also fall back to a MutationObserver on #my-wrap to catch the moment its
// hidden attribute flips. (Same approach test-login.js uses.)
render();

const myWrap = document.getElementById('my-wrap');
if (myWrap) {
  const observer = new MutationObserver(() => render());
  observer.observe(myWrap, { attributes: true, attributeFilter: ['hidden'] });
}
