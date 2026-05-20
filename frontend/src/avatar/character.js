// character.js — 배터리 마스코트 캐릭터 (plan step 4, Agent A 재작성)
//
// Schema:
//   {
//     body: {
//       color: '#ffffff',              // 본체 fill
//       symbol: { id, color }          // 배터리 몸통 문양
//     },
//     clothing: {
//       top: { style, color }
//     },
//     accessories: {
//       hat:     null | { style, color },
//       glasses: null | { style, color },
//       other:   null | { style, color }
//     }
//   }
//
// SVG viewBox: 0 0 240 320
// root class: codenergy-character
//
// Layer z-order (back → front):
//   그림자 → cap → 본체 → top 의상 → 눈 → 동공 → symbol → glasses → hat → other

import { getById, renderOutfitFragment } from './outfits.js';

// ---------------------------------------------------------------------------
// BODY_RECT — Agent B가 outfit 좌표 재산정에 사용
// ---------------------------------------------------------------------------

export const BODY_RECT = { x: 48, y: 40, width: 144, height: 240, rx: 32 };

// ---------------------------------------------------------------------------
// LOCKED_BODY_COLOR — 본체 색상 고정값
// ---------------------------------------------------------------------------

export const LOCKED_BODY_COLOR = '#ffffff';

// ---------------------------------------------------------------------------
// SKIN_TONES — deprecated, 빈 배열 유지 (기존 import 호환)
// ---------------------------------------------------------------------------

/** @deprecated 배터리 캐릭터에서는 사용되지 않음 */
export const SKIN_TONES = [];

// ---------------------------------------------------------------------------
// BATTERY_COLORS — 본체 색상 팔레트
// ---------------------------------------------------------------------------

export const BATTERY_COLORS = [
  { id: 'bat-white',  label: '클래식',  base: '#ffffff', stroke: '#7c3aed' },
  { id: 'bat-yellow', label: '노란',    base: '#fbbf24', stroke: '#d97706' },
  { id: 'bat-blue',   label: '파란',    base: '#60a5fa', stroke: '#1d4ed8' },
  { id: 'bat-green',  label: '초록',    base: '#4ade80', stroke: '#15803d' },
  { id: 'bat-pink',   label: '핑크',    base: '#f9a8d4', stroke: '#be185d' },
  { id: 'bat-orange', label: '오렌지',  base: '#fb923c', stroke: '#c2410c' },
  { id: 'bat-purple', label: '보라',    base: '#c084fc', stroke: '#7e22ce' },
  { id: 'bat-teal',   label: '청록',    base: '#2dd4bf', stroke: '#0f766e' },
  { id: 'bat-red',    label: '빨강',    base: '#f87171', stroke: '#b91c1c' },
  { id: 'bat-dark',   label: '다크',    base: '#334155', stroke: '#0f172a' },
];

// ---------------------------------------------------------------------------
// shade 헬퍼 — BATTERY_COLORS 외 자유 hex 사용 시 stroke 자동 산정
// ---------------------------------------------------------------------------

function shade(hex, amount = 0.3) {
  if (typeof hex !== 'string' || !hex.startsWith('#')) return '#7c3aed';
  let h = hex.length === 4
    ? '#' + hex.slice(1).split('').map((c) => c + c).join('')
    : hex;
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  const f = Math.max(0, Math.min(1, 1 - amount));
  return '#' + [r, g, b].map((v) => Math.round(v * f).toString(16).padStart(2, '0')).join('');
}

function strokeForBodyColor(color) {
  const found = BATTERY_COLORS.find((c) => c.base === color);
  return found ? found.stroke : shade(color, 0.3);
}

// ---------------------------------------------------------------------------
// BODY_SYMBOLS — 몸통 문양 카탈로그
// ---------------------------------------------------------------------------

export const BODY_SYMBOLS = [
  {
    id: 'sym-bolt',
    label: '번개',
    thumbnail: '⚡',
    // 200→240 좌표계 변환: 원본 path 중심(cx=100→120), y 오프셋 +30
    svgFragment: (color = '#22c55e') => `
      <path d="M 133 178 L 106 220 L 122 220 L 108 254 L 138 208 L 120 208 Z"
            fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="2.5" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'sym-heart',
    label: '하트',
    thumbnail: '❤️',
    svgFragment: (color = '#ef4444') => `
      <path d="M120 248 C120 248 88 228 88 208 C88 196 96 188 108 190 C114 191 120 197 120 197 C120 197 126 191 132 190 C144 188 152 196 152 208 C152 228 120 248 120 248 Z"
            fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="2"/>
    `,
  },
  {
    id: 'sym-star',
    label: '별',
    thumbnail: '⭐',
    svgFragment: (color = '#fbbf24') => `
      <polygon points="120,192 126,210 146,210 130,222 136,240 120,230 104,240 110,222 94,210 114,210"
               fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="2" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'sym-cog',
    label: '톱니바퀴',
    thumbnail: '⚙️',
    svgFragment: (color = '#94a3b8') => `
      <g transform="translate(120,220)">
        <circle r="14" fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="2"/>
        <circle r="7"  fill="${shade(color, 0.15)}" stroke="${shade(color, 0.35)}" stroke-width="1.5"/>
        <rect x="-4" y="-20" width="8" height="10" rx="2" fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="1.5"/>
        <rect x="-4" y="10"  width="8" height="10" rx="2" fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="1.5"/>
        <rect x="-20" y="-4" width="10" height="8" rx="2" fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="1.5"/>
        <rect x="10"  y="-4" width="10" height="8" rx="2" fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="1.5"/>
      </g>
    `,
  },
  {
    id: 'sym-flame',
    label: '불꽃',
    thumbnail: '🔥',
    svgFragment: (color = '#f97316') => `
      <path d="M120 192 C110 202 104 212 108 224 C110 232 116 238 120 240 C124 238 130 232 132 224 C136 212 130 202 120 192 Z M120 208 C118 214 116 220 118 226 C118 228 119 230 120 231 C121 230 122 228 122 226 C124 220 122 214 120 208 Z"
            fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="1.5" stroke-linejoin="round"/>
    `,
  },
  {
    id: 'sym-code',
    label: '코드',
    thumbnail: '</>',
    svgFragment: (color = '#38bdf8') => `
      <text x="120" y="228" text-anchor="middle" font-family="monospace" font-size="26"
            font-weight="bold" fill="${color}" stroke="${shade(color, 0.25)}" stroke-width="1">&lt;/&gt;</text>
    `,
  },
];

function lookupSymbol(id) {
  return BODY_SYMBOLS.find((s) => s.id === id) || BODY_SYMBOLS[0];
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_CONFIG = {
  body: {
    color: LOCKED_BODY_COLOR,
    symbol: { id: 'sym-bolt', color: '#22c55e' },
  },
  clothing: {
    top: { style: 'top-tee', color: '#2563eb' },
  },
  accessories: {
    hat:     null,
    glasses: null,
    other:   null,
  },
};

// ---------------------------------------------------------------------------
// normalizeConfig
// ---------------------------------------------------------------------------

export function normalizeConfig(raw) {
  if (!raw || typeof raw !== 'object') return JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  const def = DEFAULT_CONFIG;

  // body.color — 무조건 LOCKED_BODY_COLOR로 고정
  const rawBody = raw.body && typeof raw.body === 'object' ? raw.body : {};
  const bodyColor = LOCKED_BODY_COLOR;

  // body.symbol
  const rawSym = rawBody.symbol && typeof rawBody.symbol === 'object' ? rawBody.symbol : {};
  const symId = BODY_SYMBOLS.some((s) => s.id === rawSym.id)
    ? rawSym.id
    : def.body.symbol.id;
  const symColor = typeof rawSym.color === 'string' && rawSym.color.startsWith('#')
    ? rawSym.color
    : def.body.symbol.color;

  // clothing.top (bottom silently dropped)
  const rawClothing = raw.clothing && typeof raw.clothing === 'object' ? raw.clothing : {};
  let top = null;
  if (Object.prototype.hasOwnProperty.call(rawClothing, 'top')) {
    const rawTop = rawClothing.top && typeof rawClothing.top === 'object' ? rawClothing.top : null;
    if (rawTop) {
      const requestedTopStyle = typeof rawTop.style === 'string' && rawTop.style
        ? rawTop.style : def.clothing.top.style;
      const topStyle = getById(requestedTopStyle)
        ? requestedTopStyle
        : def.clothing.top.style;
      const topColor = typeof rawTop.color === 'string' && rawTop.color
        ? rawTop.color : def.clothing.top.color;
      top = { style: topStyle, color: topColor };
    }
  } else {
    top = { ...def.clothing.top };
  }

  // accessories
  const rawAcc = raw.accessories && typeof raw.accessories === 'object' && !Array.isArray(raw.accessories)
    ? raw.accessories : {};
  function normAcc(v) {
    if (!v || typeof v !== 'object') return null;
    if (typeof v.style !== 'string' || !v.style) return null;
    return { style: v.style, color: typeof v.color === 'string' ? v.color : '#000000' };
  }

  return {
    body: {
      color: bodyColor,
      symbol: { id: symId, color: symColor },
    },
    clothing: {
      top,
    },
    accessories: {
      hat:     normAcc(rawAcc.hat),
      glasses: normAcc(rawAcc.glasses),
      other:   normAcc(rawAcc.other),
    },
  };
}

// ---------------------------------------------------------------------------
// Fragment helpers
// ---------------------------------------------------------------------------

function fragmentFor(slot) {
  if (!slot || !slot.style) return '';
  const item = getById(slot.style);
  if (!item) return '';
  return renderOutfitFragment(item, slot.color);
}

// ---------------------------------------------------------------------------
// renderCharacter
// ---------------------------------------------------------------------------

export function renderCharacter(input = {}) {
  const cfg = normalizeConfig(input);

  const bodyColor  = cfg.body.color;
  const bodyStroke = strokeForBodyColor(bodyColor);
  const capColor   = bodyStroke; // cap은 stroke 색과 동일 (보라 계열)

  // symbol fragment
  const sym = lookupSymbol(cfg.body.symbol.id);
  const symbolFrag = sym.svgFragment(cfg.body.symbol.color);

  // outfit fragments
  const topFrag     = fragmentFor(cfg.clothing.top);
  const hatFrag     = fragmentFor(cfg.accessories.hat);
  const glassesFrag = fragmentFor(cfg.accessories.glasses);
  const otherFrag   = fragmentFor(cfg.accessories.other);
  // hair fragment는 배터리 캐릭터에서 사용하지 않음 (폐기)

  const B = BODY_RECT; // { x:48, y:40, width:144, height:240, rx:32 }
  const cx = B.x + B.width / 2;   // 120
  const topStyle = cfg.clothing.top?.style || '';
  const topTransform = topStyle === 'top-starcape'
    ? 'translate(120 188) scale(0.82 0.97) translate(-120 -160)'
    : 'translate(120 156) scale(1.08 1.58) translate(-120 -124)';
  const eyeCy = B.y + 80;         // 120 — 눈 중심

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 320"
     class="codenergy-character"
     role="img" aria-label="Codenergy 아바타">
  <!-- 1. 그림자 -->
  <ellipse cx="${cx}" cy="310" rx="70" ry="6" fill="#94a3b8" opacity="0.28"/>

  <!-- 2. cap -->
  <rect x="${cx - 22}" y="22" width="44" height="18" rx="7" fill="${capColor}"/>

  <!-- 3. 본체 -->
  <rect x="${B.x}" y="${B.y}" width="${B.width}" height="${B.height}" rx="${B.rx}"
        fill="${bodyColor}" stroke="${bodyStroke}" stroke-width="5"/>

  <!-- 4. top 의상 (Agent B 좌표) -->
  <!-- 5. 눈 -->
  <circle class="char-eye" cx="${cx}" cy="${eyeCy}" r="38" fill="#ffffff" stroke="#a855f7" stroke-width="4"/>

  <!-- 6. 동공 -->
  <g class="char-pupil">
    <circle cx="${cx}" cy="${eyeCy}" r="20" fill="#3a2a4a"/>
    <circle cx="${cx + 8}" cy="${eyeCy - 8}" r="6" fill="#ffffff"/>
  </g>

  <!-- 7. symbol (번개 등) -->
  ${symbolFrag}

  <!-- 9. hat -->
  ${hatFrag}

  <!-- 10. other (측면 액세서리) -->
  ${otherFrag}

  <!-- 11. clothing: larger, lower, and topmost so it naturally covers body details -->
  <g class="outfit-top-wrap">
    <g transform="${topTransform}">
      ${topFrag}
    </g>
  </g>

  <!-- 11. glasses: topmost accessory -->
  ${glassesFrag}
</svg>`.trim();
}
