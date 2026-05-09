// Base character + composition for the Codenergy avatar feature.
//
// The character is drawn inside a 320x480 viewBox. Outfits in outfits.js use
// the same coordinate space so swapping items is consistent.
//
// Skin color is parameterized via SKIN_TONES (see export below). Pass
// `equipped.skinTone` (a tone id like 'tone-3') into renderCharacter to pick
// one; omit or pass an unknown id to fall back to DEFAULT_SKIN_TONE.
//
// Layer z-order (back to front):
//   1. background pad (subtle)
//   2. legs (base)
//   3. body / torso (skin)
//   4. bottom outfit (covers legs & waist)
//   5. arms (skin) — drawn after bottom so sleeves can sit on top via TOP layer
//   6. top outfit (covers torso & shoulders, sits over arms)
//   7. head (skin) + ears
//   8. hair
//   9. face features (eyes / mouth) — base default, OR face outfit overrides
//  10. hat (very last, on top of hair)

import { getById } from './outfits.js';

/**
 * Available skin tones. Each entry pairs a `base` fill with a slightly
 * darker `shadow` used for stroke / shading — same ratio as the original
 * hard-coded #fde68a / #fbbf24 pair so the character keeps the same depth
 * across all tones.
 *
 * 4번 에이전트(피부톤 UI)는 이 배열을 그대로 import 해서 톤 선택 UI를
 * 구성하면 됩니다. 각 항목의 `id`를 equipped.skinTone 으로 넘기면 됩니다.
 */
export const SKIN_TONES = [
  { id: 'tone-1', label: '가장 밝은',   base: '#fff5d6', shadow: '#fce8a4' },
  { id: 'tone-2', label: '밝은 톤',     base: '#fde68a', shadow: '#fbbf24' }, // 기존 기본
  { id: 'tone-3', label: '중간 톤',     base: '#f4c084', shadow: '#d97706' },
  { id: 'tone-4', label: '구릿빛 톤',   base: '#c89878', shadow: '#92622f' },
  { id: 'tone-5', label: '어두운 톤',   base: '#8b5a3c', shadow: '#5a3a25' },
  { id: 'tone-6', label: '가장 어두운', base: '#5a3a25', shadow: '#3a2415' },
];

export const DEFAULT_SKIN_TONE = 'tone-2'; // matches previous hard-coded color

// Hair color — kept independent from skin tone. Note: on the two darkest
// skin tones (tone-5, tone-6) the near-black hair has low contrast against
// the head fill. We deliberately keep it as-is to preserve the existing
// silhouette; the side-fringe accent (#0f172a) still reads as a subtle
// highlight. If a future iteration needs more contrast, swap HAIR per tone.
const HAIR = '#1f2937';

function lookupSkinTone(id) {
  return SKIN_TONES.find((t) => t.id === id)
      || SKIN_TONES.find((t) => t.id === DEFAULT_SKIN_TONE)
      || SKIN_TONES[0];
}

// Base character SVG fragments split by layer so we can interleave outfits.
// Each fragment is a function of (skin, shadow) so we can swap palettes
// per render without re-declaring the geometry.

const baseLegs = (skin, shadow) => `
  <g class="char-legs">
    <!-- Left leg -->
    <rect x="132" y="340" width="22" height="110" rx="11" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <!-- Right leg -->
    <rect x="166" y="340" width="22" height="110" rx="11" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <!-- Shoes -->
    <ellipse cx="143" cy="456" rx="18" ry="8" fill="#1f2937"/>
    <ellipse cx="177" cy="456" rx="18" ry="8" fill="#1f2937"/>
  </g>
`;

const baseBody = (skin, shadow) => `
  <g class="char-body">
    <!-- Neck -->
    <rect x="148" y="200" width="24" height="22" rx="6" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <!-- Torso (skin layer — usually fully covered by top) -->
    <path d="M104 220 Q104 212 116 210 L204 210 Q216 212 216 220 L220 340 L100 340 Z"
          fill="${skin}" stroke="${shadow}" stroke-width="2" stroke-linejoin="round"/>
  </g>
`;

const baseArms = (skin, shadow) => `
  <g class="char-arms">
    <!-- Left arm -->
    <rect x="74" y="222" width="28" height="110" rx="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <!-- Right arm -->
    <rect x="218" y="222" width="28" height="110" rx="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <!-- Hands -->
    <circle cx="88"  cy="338" r="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <circle cx="232" cy="338" r="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
  </g>
`;

const baseHead = (skin, shadow) => `
  <g class="char-head">
    <!-- Ears -->
    <ellipse cx="84"  cy="134" rx="9"  ry="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <ellipse cx="236" cy="134" rx="9"  ry="14" fill="${skin}" stroke="${shadow}" stroke-width="2"/>
    <!-- Head -->
    <circle cx="160" cy="130" r="78" fill="${skin}" stroke="${shadow}" stroke-width="2.5"/>
  </g>
`;

const BASE_HAIR = `
  <g class="char-hair">
    <!-- Top swoop covering forehead -->
    <path d="M88 122 Q92 60 160 54 Q228 60 232 122
             Q220 96 196 92 Q176 100 160 96 Q142 96 130 102
             Q108 100 100 110 Z"
          fill="${HAIR}"/>
    <!-- Side fringe accent -->
    <path d="M120 96 Q140 70 178 76 Q166 88 150 92 Q132 92 120 96 Z" fill="#0f172a"/>
  </g>
`;

// Default neutral face — used only if no face outfit is equipped.
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

/**
 * Compose the full character SVG.
 *
 * @param {Object} equipped
 * @param {string|null} equipped.top      outfit id or null
 * @param {string|null} equipped.bottom   outfit id or null
 * @param {string|null} equipped.hat      outfit id or null
 * @param {string|null} equipped.face     outfit id or null
 * @param {string} [equipped.skinTone]    skin tone id from SKIN_TONES;
 *                                        defaults to DEFAULT_SKIN_TONE.
 * @returns {string} SVG markup
 */
export function renderCharacter(equipped = {}) {
  const { top, bottom, hat, face, skinTone } = equipped;

  const tone = lookupSkinTone(skinTone);
  const skin = tone.base;
  const shadow = tone.shadow;

  const topItem    = getById(top);
  const bottomItem = getById(bottom);
  const hatItem    = getById(hat);
  const faceItem   = getById(face);

  // If outfit not in catalog or wrong category, treat as null.
  const topFrag    = topItem    && topItem.category    === 'top'    ? topItem.svgFragment    : '';
  const bottomFrag = bottomItem && bottomItem.category === 'bottom' ? bottomItem.svgFragment : '';
  const hatFrag    = hatItem    && hatItem.category    === 'hat'    ? hatItem.svgFragment    : '';
  const faceFrag   = faceItem   && faceItem.category   === 'face'   ? faceItem.svgFragment   : '';

  const faceLayer = faceFrag || DEFAULT_FACE;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480"
     class="codenergy-character"
     role="img" aria-label="Codenergy 아바타">
  ${SHADOW}
  ${baseLegs(skin, shadow)}
  ${baseBody(skin, shadow)}
  ${bottomFrag}
  ${baseArms(skin, shadow)}
  ${topFrag}
  ${baseHead(skin, shadow)}
  ${BASE_HAIR}
  ${faceLayer}
  ${hatFrag}
</svg>`.trim();
}

/**
 * The default equipped state used for a fresh / preview character.
 */
export const DEFAULT_EQUIPPED = {
  top: 'top-tshirt-white',
  bottom: 'bottom-jeans-blue',
  hat: null,
  face: 'face-smile',
  skinTone: DEFAULT_SKIN_TONE,
};
