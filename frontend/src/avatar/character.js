// character.js — 새 schema (plan step 4)
//
// Schema:
//   {
//     body: {
//       skinTone: 'tone-1'..'tone-6',
//       hair: { style, color }
//     },
//     clothing: {
//       top:    { style, color },
//       bottom: { style, color }
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
//   다리 → 몸통 → 팔 → 하의 → 상의 → 머리(피부 베이스) → 표정(고정) → 귀걸이(other) → 머리카락 → 안경 → 모자

import { getById, renderOutfitFragment } from './outfits.js';

// ---------------------------------------------------------------------------
// Skin tones
// ---------------------------------------------------------------------------

export const SKIN_TONES = [
  { id: 'tone-1', label: '가장 밝은',   base: '#fff5d6', shadow: '#fce8a4' },
  { id: 'tone-2', label: '밝은 톤',     base: '#fde68a', shadow: '#fbbf24' },
  { id: 'tone-3', label: '중간 톤',     base: '#f4c084', shadow: '#d97706' },
  { id: 'tone-4', label: '구릿빛 톤',   base: '#c89878', shadow: '#92622f' },
  { id: 'tone-5', label: '어두운 톤',   base: '#8b5a3c', shadow: '#5a3a25' },
  { id: 'tone-6', label: '가장 어두운', base: '#5a3a25', shadow: '#3a2415' },
];

function lookupSkinTone(id) {
  return SKIN_TONES.find((t) => t.id === id)
    || SKIN_TONES.find((t) => t.id === 'tone-2')
    || SKIN_TONES[0];
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_CONFIG = {
  body: {
    skinTone: 'tone-2',
    hair: { style: 'hair-short', color: '#1f2937' },
  },
  clothing: {
    top:    { style: 'top-tee',   color: '#2563eb' },
    bottom: { style: 'bot-jeans', color: '#1f2937' },
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

  // body
  const rawBody = raw.body && typeof raw.body === 'object' ? raw.body : {};
  const skinTone = SKIN_TONES.some((t) => t.id === rawBody.skinTone)
    ? rawBody.skinTone
    : def.body.skinTone;
  const rawHair = rawBody.hair && typeof rawBody.hair === 'object' ? rawBody.hair : {};
  const hairStyle = typeof rawHair.style === 'string' && rawHair.style
    ? rawHair.style : def.body.hair.style;
  const hairColor = typeof rawHair.color === 'string' && rawHair.color
    ? rawHair.color : def.body.hair.color;

  // clothing
  const rawClothing = raw.clothing && typeof raw.clothing === 'object' ? raw.clothing : {};
  const rawTop = rawClothing.top && typeof rawClothing.top === 'object' ? rawClothing.top : {};
  const topStyle = typeof rawTop.style === 'string' && rawTop.style
    ? rawTop.style : def.clothing.top.style;
  const topColor = typeof rawTop.color === 'string' && rawTop.color
    ? rawTop.color : def.clothing.top.color;
  const rawBot = rawClothing.bottom && typeof rawClothing.bottom === 'object' ? rawClothing.bottom : {};
  const botStyle = typeof rawBot.style === 'string' && rawBot.style
    ? rawBot.style : def.clothing.bottom.style;
  const botColor = typeof rawBot.color === 'string' && rawBot.color
    ? rawBot.color : def.clothing.bottom.color;

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
      skinTone,
      hair: { style: hairStyle, color: hairColor },
    },
    clothing: {
      top:    { style: topStyle,  color: topColor },
      bottom: { style: botStyle,  color: botColor },
    },
    accessories: {
      hat:     normAcc(rawAcc.hat),
      glasses: normAcc(rawAcc.glasses),
      other:   normAcc(rawAcc.other),
    },
  };
}

// ---------------------------------------------------------------------------
// Base SVG fragments (coordinate space: 240×320)
// ---------------------------------------------------------------------------

const baseLegs = (skin, shadow) => `
  <g class="char-legs">
    <rect x="98"  y="212" width="17" height="88" rx="8"  fill="${skin}" stroke="${shadow}" stroke-width="1.5"/>
    <rect x="125" y="212" width="17" height="88" rx="8"  fill="${skin}" stroke="${shadow}" stroke-width="1.5"/>
    <ellipse cx="106" cy="302" rx="14" ry="6" fill="#1f2937"/>
    <ellipse cx="133" cy="302" rx="14" ry="6" fill="#1f2937"/>
  </g>
`;

const baseBody = (skin, shadow) => `
  <g class="char-body">
    <rect x="109" y="126" width="22" height="17" rx="5" fill="${skin}" stroke="${shadow}" stroke-width="1.5"/>
    <path d="M72 140 Q72 134 80 132 L160 132 Q168 134 168 140 L170 213 L70 213 Z"
          fill="${skin}" stroke="${shadow}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
`;

const baseArms = (skin, shadow) => `
  <g class="char-arms">
    <rect x="51" y="142" width="20" height="74" rx="10" fill="${skin}" stroke="${shadow}" stroke-width="1.5"/>
    <rect x="169" y="142" width="20" height="74" rx="10" fill="${skin}" stroke="${shadow}" stroke-width="1.5"/>
    <circle cx="61"  cy="220" r="10" fill="${skin}" stroke="${shadow}" stroke-width="1.5"/>
    <circle cx="179" cy="220" r="10" fill="${skin}" stroke="${shadow}" stroke-width="1.5"/>
  </g>
`;

const baseHead = (skin, shadow) => `
  <g class="char-head">
    <ellipse cx="60"  cy="86" rx="7"  ry="10" fill="${skin}" stroke="${shadow}" stroke-width="1.5"/>
    <ellipse cx="180" cy="86" rx="7"  ry="10" fill="${skin}" stroke="${shadow}" stroke-width="1.5"/>
    <circle  cx="120" cy="82" r="60"  fill="${skin}" stroke="${shadow}" stroke-width="2"/>
  </g>
`;

const DEFAULT_FACE = `
  <g class="char-face char-face--default">
    <circle cx="104" cy="80" r="4"   fill="#1f2937"/>
    <circle cx="136" cy="80" r="4"   fill="#1f2937"/>
    <circle cx="105" cy="79" r="1.2" fill="#ffffff"/>
    <circle cx="137" cy="79" r="1.2" fill="#ffffff"/>
    <path d="M108 98 Q120 108 132 98" stroke="#1f2937" stroke-width="2.5"
          fill="none" stroke-linecap="round"/>
  </g>
`;

// ---------------------------------------------------------------------------
// Fragment helpers
// ---------------------------------------------------------------------------

function fragmentFor(slot, sub) {
  if (!slot || !slot.style) return '';
  const item = getById(slot.style);
  if (!item) return '';
  // sub may differ from category stored on item (e.g. 'other' mapped to earring IDs)
  return renderOutfitFragment(item, slot.color);
}

// ---------------------------------------------------------------------------
// renderCharacter
// ---------------------------------------------------------------------------

export function renderCharacter(input = {}) {
  const cfg = normalizeConfig(input);

  const tone = lookupSkinTone(cfg.body.skinTone);
  const skin = tone.base;
  const shadow = tone.shadow;

  const hairFrag    = fragmentFor(cfg.body.hair, 'hair');
  const topFrag     = fragmentFor(cfg.clothing.top, 'top');
  const bottomFrag  = fragmentFor(cfg.clothing.bottom, 'bottom');
  const hatFrag     = fragmentFor(cfg.accessories.hat, 'hat');
  const glassesFrag = fragmentFor(cfg.accessories.glasses, 'glasses');
  const otherFrag   = fragmentFor(cfg.accessories.other, 'other');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 320"
     class="codenergy-character"
     role="img" aria-label="Codenergy 아바타">
  ${baseLegs(skin, shadow)}
  ${baseBody(skin, shadow)}
  ${baseArms(skin, shadow)}
  ${bottomFrag}
  ${topFrag}
  ${baseHead(skin, shadow)}
  ${DEFAULT_FACE}
  ${otherFrag}
  ${hairFrag}
  ${glassesFrag}
  ${hatFrag}
</svg>`.trim();
}
