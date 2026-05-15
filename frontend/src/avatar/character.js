// Base character + composition for the Codenergy avatar feature.
//
// Character is drawn inside a 320x480 viewBox. Outfits in outfits.js share the
// same coordinate space.
//
// Schema (see avatar.js DEFAULT_CONFIG):
//   {
//     hair:    { style, color },
//     top:     { style, color },
//     bottom:  { style, color },
//     face:    { style },
//     skinTone: 'tone-1'..'tone-6',
//     accessories: [{ type: 'hat'|'glasses'|'earrings', style, color }],
//     background: 'default'|'sky'|'sunset'|'mint'|'lavender',
//   }
//
// Layer z-order (back to front):
//   1. background
//   2. shadow
//   3. legs
//   4. body / torso
//   5. bottom
//   6. arms
//   7. top
//   8. head + ears
//   9. earrings (rendered against ears, before hair drape)
//  10. hair
//  11. face
//  12. glasses
//  13. hat

import { getById, renderOutfitFragment } from './outfits.js';

export const SKIN_TONES = [
  { id: 'tone-1', label: '가장 밝은',   base: '#fff5d6', shadow: '#fce8a4' },
  { id: 'tone-2', label: '밝은 톤',     base: '#fde68a', shadow: '#fbbf24' },
  { id: 'tone-3', label: '중간 톤',     base: '#f4c084', shadow: '#d97706' },
  { id: 'tone-4', label: '구릿빛 톤',   base: '#c89878', shadow: '#92622f' },
  { id: 'tone-5', label: '어두운 톤',   base: '#8b5a3c', shadow: '#5a3a25' },
  { id: 'tone-6', label: '가장 어두운', base: '#5a3a25', shadow: '#3a2415' },
];

export const DEFAULT_SKIN_TONE = 'tone-2';

function lookupSkinTone(id) {
  return SKIN_TONES.find((t) => t.id === id)
      || SKIN_TONES.find((t) => t.id === DEFAULT_SKIN_TONE)
      || SKIN_TONES[0];
}

// ---------------------------------------------------------------------------
// Base SVG fragments (parameterized by skin tone).
// ---------------------------------------------------------------------------

const baseLegs = (skin, shadow) => `
  <g class="char-legs">
    <rect x="132" y="340" width="22" height="110" rx="11" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <rect x="166" y="340" width="22" height="110" rx="11" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <ellipse cx="143" cy="456" rx="18" ry="8" fill="#1f2937"/>
    <ellipse cx="177" cy="456" rx="18" ry="8" fill="#1f2937"/>
  </g>
`;

const baseBody = (skin, shadow) => `
  <g class="char-body">
    <rect x="148" y="200" width="24" height="22" rx="6" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <path d="M104 220 Q104 212 116 210 L204 210 Q216 212 216 220 L220 340 L100 340 Z"
          fill="${skin}" stroke="${shadow}" stroke-width="2" stroke-linejoin="round"/>
  </g>
`;

const baseArms = (skin, shadow) => `
  <g class="char-arms">
    <rect x="74" y="222" width="28" height="110" rx="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <rect x="218" y="222" width="28" height="110" rx="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <circle cx="88"  cy="338" r="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <circle cx="232" cy="338" r="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
  </g>
`;

const baseHead = (skin, shadow) => `
  <g class="char-head">
    <ellipse cx="84"  cy="134" rx="9"  ry="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <ellipse cx="236" cy="134" rx="9"  ry="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <circle cx="160" cy="130" r="78" fill="${skin}" stroke="${shadow}" stroke-width="2.5"/>
  </g>
`;

const DEFAULT_FACE = `
  <g class="char-face char-face--default">
    <circle cx="138" cy="128" r="5" fill="#1f2937"/>
    <circle cx="182" cy="128" r="5" fill="#1f2937"/>
    <circle cx="140" cy="126" r="1.4" fill="#ffffff"/>
    <circle cx="184" cy="126" r="1.4" fill="#ffffff"/>
    <path d="M144 158 Q160 170 176 158" stroke="#1f2937" stroke-width="3"
          fill="none" stroke-linecap="round"/>
  </g>
`;

const SHADOW = `
  <ellipse cx="160" cy="464" rx="74" ry="9" fill="#000" opacity="0.08"/>
`;

// ---------------------------------------------------------------------------
// Backgrounds — full-bleed gradient or solid pad behind the character.
// ---------------------------------------------------------------------------

function renderBackground(name) {
  const bg = name || 'default';
  if (bg === 'default') {
    // No background = transparent (page color shows through).
    return '';
  }
  const gradients = {
    sky:      ['#bae6fd', '#e0f2fe'],
    sunset:   ['#fbbf24', '#fb7185'],
    mint:     ['#a7f3d0', '#ecfdf5'],
    lavender: ['#ddd6fe', '#f5f3ff'],
  };
  const stops = gradients[bg];
  if (!stops) return '';
  const id = `avatar-bg-${bg}`;
  return `
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${stops[0]}"/>
        <stop offset="1" stop-color="${stops[1]}"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="320" height="480" fill="url(#${id})"/>
  `;
}

// ---------------------------------------------------------------------------
// Helpers for the new config schema.
// ---------------------------------------------------------------------------

function getAccessory(accessories, type) {
  if (!Array.isArray(accessories)) return null;
  return accessories.find((a) => a && a.type === type) || null;
}

function fragmentForPart(part, expectedCategory) {
  if (!part || !part.style) return '';
  const item = getById(part.style);
  if (!item || item.category !== expectedCategory) return '';
  return renderOutfitFragment(item, part.color);
}

function fragmentForAccessory(acc) {
  if (!acc || !acc.style) return '';
  const item = getById(acc.style);
  if (!item || item.category !== acc.type) return '';
  return renderOutfitFragment(item, acc.color);
}

// ---------------------------------------------------------------------------
// Public render
// ---------------------------------------------------------------------------

/**
 * Compose the full character SVG from a config object (new schema).
 *
 * Tolerant of legacy `equipped`-shape input (top/bottom/hat/face as plain ID
 * strings) — it migrates on the fly using DEFAULT_CONFIG colors.
 */
export function renderCharacter(input = {}) {
  const config = normalizeConfig(input);

  const tone = lookupSkinTone(config.skinTone);
  const skin = tone.base;
  const shadowColor = tone.shadow;

  const bgLayer = renderBackground(config.background);

  const topFrag    = fragmentForPart(config.top,    'top');
  const bottomFrag = fragmentForPart(config.bottom, 'bottom');
  const hairFrag   = fragmentForPart(config.hair,   'hair');
  const faceFrag   = fragmentForPart(config.face,   'face');

  const hat      = getAccessory(config.accessories, 'hat');
  const glasses  = getAccessory(config.accessories, 'glasses');
  const earrings = getAccessory(config.accessories, 'earrings');

  const hatFrag      = fragmentForAccessory(hat);
  const glassesFrag  = fragmentForAccessory(glasses);
  const earringsFrag = fragmentForAccessory(earrings);

  const faceLayer = faceFrag || DEFAULT_FACE;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480"
     class="codenergy-character"
     role="img" aria-label="Codenergy 아바타">
  ${bgLayer}
  ${SHADOW}
  ${baseLegs(skin, shadowColor)}
  ${baseBody(skin, shadowColor)}
  ${bottomFrag}
  ${baseArms(skin, shadowColor)}
  ${topFrag}
  ${baseHead(skin, shadowColor)}
  ${earringsFrag}
  ${hairFrag}
  ${faceLayer}
  ${glassesFrag}
  ${hatFrag}
</svg>`.trim();
}

// ---------------------------------------------------------------------------
// Defaults & legacy migration
// ---------------------------------------------------------------------------

export const DEFAULT_CONFIG = {
  hair:     { style: 'hair-short', color: '#1f2937' },
  top:      { style: 'top-tshirt-white', color: '#ffffff' },
  bottom:   { style: 'bottom-jeans-blue', color: '#3b82f6' },
  face:     { style: 'face-smile' },
  skinTone: DEFAULT_SKIN_TONE,
  accessories: [],
  background: 'default',
};

// Legacy alias kept so unrelated imports don't break during the migration
// window. New code should reference DEFAULT_CONFIG.
export const DEFAULT_EQUIPPED = {
  top: 'top-tshirt-white',
  bottom: 'bottom-jeans-blue',
  hat: null,
  face: 'face-smile',
  skinTone: DEFAULT_SKIN_TONE,
};

// Accept both shapes (new config + legacy equipped) and produce a normalized
// config. Defensive — never throws on partial/unknown input.
function normalizeConfig(input) {
  if (!input || typeof input !== 'object') return DEFAULT_CONFIG;

  // New shape: hair/top/bottom are objects with {style,color}.
  const looksNew = input.hair && typeof input.hair === 'object'
                || input.top  && typeof input.top  === 'object'
                || Array.isArray(input.accessories);

  if (looksNew) {
    return {
      hair:     input.hair     || DEFAULT_CONFIG.hair,
      top:      input.top      || DEFAULT_CONFIG.top,
      bottom:   input.bottom   || DEFAULT_CONFIG.bottom,
      face:     input.face     || DEFAULT_CONFIG.face,
      skinTone: input.skinTone || DEFAULT_CONFIG.skinTone,
      accessories: Array.isArray(input.accessories) ? input.accessories : [],
      background:  input.background || DEFAULT_CONFIG.background,
    };
  }

  // Legacy `equipped` shape (string IDs). Migrate with default colors.
  const accessories = [];
  if (input.hat) accessories.push({ type: 'hat', style: input.hat, color: '#1f2937' });

  return {
    hair:     DEFAULT_CONFIG.hair,
    top:      input.top    ? { style: input.top,    color: defaultColorFor(input.top,    'top')    } : DEFAULT_CONFIG.top,
    bottom:   input.bottom ? { style: input.bottom, color: defaultColorFor(input.bottom, 'bottom') } : DEFAULT_CONFIG.bottom,
    face:     input.face   ? { style: input.face } : DEFAULT_CONFIG.face,
    skinTone: input.skinTone || DEFAULT_CONFIG.skinTone,
    accessories,
    background: DEFAULT_CONFIG.background,
  };
}

function defaultColorFor(styleId, category) {
  if (category === 'top') {
    if (styleId === 'top-tshirt-white')   return '#ffffff';
    if (styleId === 'top-hoodie-purple')  return '#a855f7';
    if (styleId === 'top-shirt-formal')   return '#f8fafc';
    if (styleId === 'top-hoodie-black')   return '#1f2937';
  }
  if (category === 'bottom') {
    if (styleId === 'bottom-jeans-blue')  return '#3b82f6';
    if (styleId === 'bottom-shorts')      return '#22c55e';
    if (styleId === 'bottom-slacks')      return '#1f2937';
  }
  return '#3b82f6';
}

export { normalizeConfig };
