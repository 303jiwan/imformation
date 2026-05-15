// Outfit catalog for the Codenergy avatar feature.
//
// Each outfit's `svgFragment` is a function `(color) => svgString` so the
// primary fill is parameterizable per render. Categories without a primary
// color (face) ignore the argument.
//
// Body coordinate cheat sheet (matches character.js):
//   head center:  (160, 130)   head radius ~ 78
//   eyes:         (138, 128) and (182, 128)
//   ears:         x ~ 84 and x ~ 236, y ~ 134
//   neck:         y ~ 208..220
//   torso top:    y ~ 215      torso bottom: y ~ 340
//   shoulders:    x ~ 96..224  at y ~ 220
//   waist:        x ~ 110..210 at y ~ 335
//   legs top:     y ~ 340      legs bottom:  y ~ 450

// Tiny helper: darken a hex color by mixing with black. Used for stroke /
// secondary trim so any user color still has depth.
function shade(hex, amount = 0.25) {
  if (typeof hex !== 'string' || !hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) {
    return hex;
  }
  let h = hex.length === 4
    ? '#' + hex.slice(1).split('').map((c) => c + c).join('')
    : hex;
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  const f = Math.max(0, Math.min(1, 1 - amount));
  const rr = Math.round(r * f).toString(16).padStart(2, '0');
  const gg = Math.round(g * f).toString(16).padStart(2, '0');
  const bb = Math.round(b * f).toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`;
}

// ---------------------------------------------------------------------------
// TOPS
// ---------------------------------------------------------------------------
const TOPS = [
  {
    id: 'top-tshirt-white',
    name: '흰 티셔츠',
    category: 'top',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 20 L24 14 L32 18 L40 14 L50 20 L46 28 L42 26 L42 52 L22 52 L22 26 L18 28 Z"
              fill="#ffffff" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
      </svg>`,
    svgFragment: (color = '#ffffff') => {
      const stroke = shade(color, 0.18);
      return `
      <g class="outfit-top top-tshirt-white">
        <path d="M74 215 C88 196 132 190 160 190 C188 190 232 196 246 215
                 L246 245 C240 255 232 275 232 280 L232 350 L100 350 L100 280 C90 255 84 245 74 245 Z"
              fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M100 219 Q160 245 220 219" fill="none" stroke="${stroke}" stroke-width="2"/>
      </g>`;
    },
  },
  {
    id: 'top-hoodie-purple',
    name: '후드티',
    category: 'top',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 22 L22 14 Q32 10 42 14 L50 22 L46 30 L42 28 L42 54 L22 54 L22 28 L18 30 Z"
              fill="#a855f7" stroke="#7c3aed" stroke-width="2" stroke-linejoin="round"/>
        <path d="M22 14 Q32 22 42 14 Q40 22 32 24 Q24 22 22 14 Z" fill="#7c3aed"/>
        <line x1="32" y1="30" x2="32" y2="48" stroke="#7c3aed" stroke-width="2"/>
      </svg>`,
    svgFragment: (color = '#a855f7') => {
      const stroke = shade(color, 0.25);
      return `
      <g class="outfit-top top-hoodie-purple">
        <path d="M84 215 C98 196 132 190 160 190 C188 190 222 196 236 215
                 L244 245 C240 255 232 275 232 280 L232 352 L100 352 L100 280 C90 255 86 245 84 245 Z"
              fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M84 216 C78 236 82 275 100 280 L100 352 L84 352 Z"
              fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M236 216 C242 236 238 275 220 280 L220 352 L236 352 Z"
              fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M100 219 Q160 245 220 219" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
        <path d="M116 290 L204 290 L198 326 L122 326 Z" fill="none" stroke="${stroke}" stroke-width="3"/>
        <line x1="130" y1="244" x2="130" y2="280" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
        <line x1="190" y1="244" x2="190" y2="280" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id: 'top-shirt-formal',
    name: '정장 셔츠',
    category: 'top',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 20 L24 14 L32 22 L40 14 L50 20 L46 28 L42 26 L42 54 L22 54 L22 26 L18 28 Z"
              fill="#f8fafc" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
        <path d="M28 16 L32 28 L36 16 Z" fill="#22c55e"/>
        <line x1="32" y1="28" x2="32" y2="50" stroke="#cbd5e1" stroke-width="1.5"/>
        <circle cx="32" cy="34" r="1" fill="#94a3b8"/>
        <circle cx="32" cy="42" r="1" fill="#94a3b8"/>
      </svg>`,
    svgFragment: (color = '#f8fafc') => {
      const stroke = shade(color, 0.25);
      const collar = shade(color, 0.1);
      return `
      <g class="outfit-top top-shirt-formal">
        <path d="M74 215 C88 196 132 190 160 190 C188 190 232 196 246 215
                 L246 245 C240 255 232 275 232 280 L232 350 L100 350 L100 280 C90 255 84 245 74 245 Z"
              fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M138 219 L160 251 L182 219 L172 213 L160 227 L148 213 Z" fill="${collar}" stroke="${stroke}" stroke-width="2"/>
        <path d="M155 239 L165 239 L168 247 L162 259 L158 259 L152 247 Z" fill="#22c55e"/>
        <path d="M158 259 L162 259 L168 327 L152 327 Z" fill="#16a34a"/>
        <line x1="160" y1="261" x2="160" y2="339" stroke="${stroke}" stroke-width="1.5"/>
        <circle cx="160" cy="283" r="2" fill="${stroke}"/>
        <circle cx="160" cy="305" r="2" fill="${stroke}"/>
        <circle cx="160" cy="327" r="2" fill="${stroke}"/>
      </g>`;
    },
  },
  {
    id: 'top-hoodie-black',
    name: '까만 후디',
    category: 'top',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 22 L22 14 Q32 10 42 14 L50 22 L46 30 L42 28 L42 54 L22 54 L22 28 L18 30 Z"
              fill="#1f2937" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <path d="M22 14 Q32 22 42 14 Q40 22 32 24 Q24 22 22 14 Z" fill="#0f172a"/>
        <line x1="32" y1="30" x2="32" y2="48" stroke="#0f172a" stroke-width="2"/>
      </svg>`,
    svgFragment: (color = '#1f2937') => {
      const stroke = shade(color, 0.25);
      return `
      <g class="outfit-top top-hoodie-black">
        <path d="M84 215 C98 196 132 190 160 190 C188 190 222 196 236 215
                 L244 245 C240 255 232 275 232 280 L232 352 L100 352 L100 280 C90 255 86 245 84 245 Z"
              fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M84 216 C78 236 82 275 100 280 L100 352 L84 352 Z"
              fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M236 216 C242 236 238 275 220 280 L220 352 L236 352 Z"
              fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M100 219 Q160 245 220 219" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
        <path d="M116 290 L204 290 L198 326 L122 326 Z" fill="none" stroke="${stroke}" stroke-width="3"/>
        <line x1="130" y1="244" x2="130" y2="280" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
        <line x1="190" y1="244" x2="190" y2="280" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// BOTTOMS
// ---------------------------------------------------------------------------
const BOTTOMS = [
  {
    id: 'bottom-jeans-blue',
    name: '청바지',
    category: 'bottom',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M18 12 L46 12 L48 32 L40 56 L34 56 L32 32 L30 56 L24 56 L16 32 Z"
              fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" stroke-linejoin="round"/>
        <line x1="32" y1="14" x2="32" y2="32" stroke="#1d4ed8" stroke-width="1.5"/>
        <rect x="20" y="14" width="24" height="4" fill="#1d4ed8"/>
      </svg>`,
    svgFragment: (color = '#3b82f6') => {
      const dark = shade(color, 0.3);
      return `
      <g class="outfit-bottom bottom-jeans-blue">
        <path d="M100 340 L220 340 L222 372 L185 460 L175 460 L160 380 L160 376 L150 380 L145 460 L135 460 L98 372 Z"
              fill="${color}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
        <rect x="100" y="340" width="120" height="10" fill="${dark}"/>
        <line x1="160" y1="350" x2="160" y2="378" stroke="${dark}" stroke-width="2"/>
        <line x1="150" y1="386" x2="145" y2="456" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3"/>
        <line x1="170" y1="386" x2="175" y2="456" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3"/>
      </g>`;
    },
  },
  {
    id: 'bottom-shorts',
    name: '반바지',
    category: 'bottom',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M18 16 L46 16 L46 38 L38 44 L34 38 L32 30 L30 38 L26 44 L18 38 Z"
              fill="#22c55e" stroke="#16a34a" stroke-width="2" stroke-linejoin="round"/>
        <rect x="20" y="18" width="24" height="3" fill="#16a34a"/>
      </svg>`,
    svgFragment: (color = '#22c55e') => {
      const dark = shade(color, 0.3);
      return `
      <g class="outfit-bottom bottom-shorts">
        <path d="M100 340 L220 340 L220 360 L185 420 L175 420 L160 380 L160 376 L150 380 L145 420 L135 420 L100 360 Z"
              fill="${color}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
        <rect x="100" y="340" width="120" height="8" fill="${dark}"/>
        <line x1="160" y1="348" x2="160" y2="378" stroke="${dark}" stroke-width="2"/>
      </g>`;
    },
  },
  {
    id: 'bottom-slacks',
    name: '슬랙스',
    category: 'bottom',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M18 12 L46 12 L48 32 L40 56 L34 56 L32 32 L30 56 L24 56 L16 32 Z"
              fill="#1f2937" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="32" y1="14" x2="32" y2="56" stroke="#0f172a" stroke-width="1.2"/>
      </svg>`,
    svgFragment: (color = '#1f2937') => {
      const dark = shade(color, 0.35);
      const crease = shade(color, 0.15);
      return `
      <g class="outfit-bottom bottom-slacks">
        <path d="M100 340 L220 340 L222 372 L185 460 L175 460 L160 380 L160 376 L150 380 L145 460 L135 460 L98 372 Z"
              fill="${color}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
        <rect x="100" y="340" width="120" height="8" fill="${dark}"/>
        <line x1="145" y1="386" x2="140" y2="456" stroke="${crease}" stroke-width="1.5"/>
        <line x1="175" y1="386" x2="180" y2="456" stroke="${crease}" stroke-width="1.5"/>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// HATS (accessory)
// ---------------------------------------------------------------------------
const HATS = [
  {
    id: 'hat-beanie',
    name: '비니',
    category: 'hat',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 36 Q14 14 32 14 Q50 14 50 36 Z" fill="#a855f7" stroke="#7c3aed" stroke-width="2"/>
        <rect x="12" y="34" width="40" height="8" rx="3" fill="#7c3aed"/>
        <circle cx="32" cy="14" r="4" fill="#fde68a" stroke="#f59e0b" stroke-width="1.5"/>
      </svg>`,
    svgFragment: (color = '#a855f7') => {
      const dark = shade(color, 0.3);
      return `
      <g class="outfit-hat hat-beanie">
        <path d="M86 124 Q86 56 160 52 Q234 56 234 124 Z" fill="${color}" stroke="${dark}" stroke-width="3"/>
        <rect x="84" y="118" width="152" height="22" rx="8" fill="${dark}"/>
        <circle cx="160" cy="50" r="14" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
      </g>`;
    },
  },
  {
    id: 'hat-cap',
    name: '야구모자',
    category: 'hat',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 38 Q14 18 32 18 Q50 18 50 38 Z" fill="#22c55e" stroke="#16a34a" stroke-width="2"/>
        <ellipse cx="40" cy="40" rx="20" ry="5" fill="#16a34a"/>
        <text x="32" y="32" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="#fff">C</text>
      </svg>`,
    svgFragment: (color = '#22c55e') => {
      const dark = shade(color, 0.3);
      return `
      <g class="outfit-hat hat-cap">
        <path d="M86 130 Q86 64 160 60 Q234 64 234 130 Z" fill="${color}" stroke="${dark}" stroke-width="3"/>
        <ellipse cx="190" cy="136" rx="68" ry="12" fill="${dark}"/>
        <text x="160" y="112" text-anchor="middle" font-family="Arial,sans-serif" font-size="40" font-weight="800" fill="#ffffff">C</text>
      </g>`;
    },
  },
  {
    id: 'hat-beret',
    name: '베레모',
    category: 'hat',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <ellipse cx="32" cy="28" rx="20" ry="12" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
        <ellipse cx="32" cy="36" rx="14" ry="3" fill="#7f1d1d"/>
        <circle cx="42" cy="20" r="3" fill="#7f1d1d"/>
      </svg>`,
    svgFragment: (color = '#dc2626') => {
      const dark = shade(color, 0.35);
      return `
      <g class="outfit-hat hat-beret">
        <ellipse cx="160" cy="92" rx="82" ry="40" fill="${color}" stroke="${dark}" stroke-width="3"/>
        <ellipse cx="160" cy="120" rx="60" ry="9" fill="${dark}"/>
        <circle cx="200" cy="60" r="8" fill="${dark}"/>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// FACES (expressions). The color argument is ignored for faces.
// ---------------------------------------------------------------------------
const FACES = [
  {
    id: 'face-smile',
    name: '웃는얼굴',
    category: 'face',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="24" cy="28" r="3" fill="#1f2937"/>
        <circle cx="40" cy="28" r="3" fill="#1f2937"/>
        <path d="M22 38 Q32 48 42 38" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>`,
    svgFragment: () => `
      <g class="outfit-face face-smile">
        <circle cx="138" cy="128" r="5.5" fill="#1f2937"/>
        <circle cx="182" cy="128" r="5.5" fill="#1f2937"/>
        <circle cx="140" cy="126" r="1.6" fill="#ffffff"/>
        <circle cx="184" cy="126" r="1.6" fill="#ffffff"/>
        <circle cx="124" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <circle cx="196" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <path d="M138 158 Q160 178 182 158" stroke="#1f2937" stroke-width="3.5"
              fill="none" stroke-linecap="round"/>
      </g>`,
  },
  {
    id: 'face-serious',
    name: '진지한얼굴',
    category: 'face',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <rect x="20" y="26" width="8" height="3" rx="1.5" fill="#1f2937"/>
        <rect x="36" y="26" width="8" height="3" rx="1.5" fill="#1f2937"/>
        <line x1="26" y1="42" x2="38" y2="42" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
    svgFragment: () => `
      <g class="outfit-face face-serious">
        <rect x="128" y="126" width="22" height="5" rx="2.5" fill="#1f2937"/>
        <rect x="170" y="126" width="22" height="5" rx="2.5" fill="#1f2937"/>
        <line x1="146" y1="166" x2="174" y2="166" stroke="#1f2937" stroke-width="3.5" stroke-linecap="round"/>
      </g>`,
  },
  {
    id: 'face-wink',
    name: '윙크',
    category: 'face',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M20 28 Q24 24 28 28" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="40" cy="28" r="3" fill="#1f2937"/>
        <path d="M22 38 Q32 46 42 38" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>`,
    svgFragment: () => `
      <g class="outfit-face face-wink">
        <path d="M128 130 Q138 122 148 130" stroke="#1f2937" stroke-width="4"
              fill="none" stroke-linecap="round"/>
        <circle cx="182" cy="128" r="5.5" fill="#1f2937"/>
        <circle cx="184" cy="126" r="1.6" fill="#ffffff"/>
        <circle cx="124" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <circle cx="196" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <path d="M138 160 Q160 176 182 160" stroke="#1f2937" stroke-width="3.5"
              fill="none" stroke-linecap="round"/>
      </g>`,
  },
  {
    id: 'face-glasses',
    name: '안경 표정',
    category: 'face',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="22" cy="30" r="6" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
        <circle cx="42" cy="30" r="6" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
        <line x1="28" y1="30" x2="36" y2="30" stroke="#1f2937" stroke-width="2"/>
        <path d="M22 42 Q32 48 42 42" stroke="#1f2937" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>`,
    svgFragment: () => `
      <g class="outfit-face face-glasses">
        <circle cx="138" cy="130" r="3.5" fill="#1f2937"/>
        <circle cx="182" cy="130" r="3.5" fill="#1f2937"/>
        <circle cx="138" cy="130" r="14" fill="#ffffff" fill-opacity="0.25" stroke="#1f2937" stroke-width="3"/>
        <circle cx="182" cy="130" r="14" fill="#ffffff" fill-opacity="0.25" stroke="#1f2937" stroke-width="3"/>
        <line x1="152" y1="130" x2="168" y2="130" stroke="#1f2937" stroke-width="3"/>
        <line x1="124" y1="128" x2="96" y2="130" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
        <line x1="196" y1="128" x2="224" y2="130" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
        <path d="M144 162 Q160 174 176 162" stroke="#1f2937" stroke-width="3"
              fill="none" stroke-linecap="round"/>
      </g>`,
  },
];

// ---------------------------------------------------------------------------
// HAIR (own category, not a sub-type of hat). Sits between head and face.
// ---------------------------------------------------------------------------
const HAIR = [
  {
    id: 'hair-short',
    name: '짧은머리',
    category: 'hair',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="36" r="22" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M14 30 Q14 12 32 10 Q50 12 50 30 Q42 22 32 22 Q22 22 14 30 Z" fill="#1f2937"/>
      </svg>`,
    svgFragment: (color = '#1f2937') => {
      const accent = shade(color, 0.3);
      return `
      <g class="outfit-hair hair-short">
        <path d="M82 120 Q86 45 160 39 Q234 45 238 120
                 Q226 96 208 92 Q188 100 160 96 Q132 96 120 102
                 Q98 100 90 110 Z"
              fill="${color}"/>
        <path d="M110 96 Q130 55 188 61 Q176 88 160 92 Q142 92 110 96 Z" fill="${accent}"/>
      </g>`;
    },
  },
  {
    id: 'hair-long',
    name: '긴머리',
    category: 'hair',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="34" r="20" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M10 30 Q10 8 32 8 Q54 8 54 30 L54 50 L46 46 L46 30 Q46 16 32 16 Q18 16 18 30 L18 46 L10 50 Z" fill="#5b3a1d"/>
      </svg>`,
    svgFragment: (color = '#5b3a1d') => {
      const accent = shade(color, 0.25);
      return `
      <g class="outfit-hair hair-long">
        <path d="M76 130 Q72 41 160 35 Q248 41 244 130
                 L250 260 L232 266 L228 220 L228 132
                 Q210 100 160 96 Q110 100 92 132 L92 220 L88 266 L70 260 Z"
              fill="${color}"/>
        <path d="M110 96 Q130 55 188 61 Q176 88 160 92 Q142 92 110 96 Z" fill="${accent}"/>
      </g>`;
    },
  },
  {
    id: 'hair-curly',
    name: '곱슬머리',
    category: 'hair',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="36" r="20" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="18" cy="22" r="8" fill="#8b5e34"/>
        <circle cx="32" cy="14" r="9" fill="#8b5e34"/>
        <circle cx="46" cy="22" r="8" fill="#8b5e34"/>
        <circle cx="14" cy="32" r="6" fill="#8b5e34"/>
        <circle cx="50" cy="32" r="6" fill="#8b5e34"/>
      </svg>`,
    svgFragment: (color = '#8b5e34') => `
      <g class="outfit-hair hair-curly">
        <circle cx="85" cy="85" r="26" fill="${color}"/>
        <circle cx="115" cy="61"  r="30" fill="${color}"/>
        <circle cx="160" cy="47"  r="32" fill="${color}"/>
        <circle cx="205" cy="61"  r="30" fill="${color}"/>
        <circle cx="235" cy="85" r="26" fill="${color}"/>
        <circle cx="77"  cy="128" r="22" fill="${color}"/>
        <circle cx="243" cy="128" r="22" fill="${color}"/>
        <circle cx="75"  cy="150" r="18" fill="${color}"/>
        <circle cx="245" cy="150" r="18" fill="${color}"/>
      </g>`,
  },
  {
    id: 'hair-ponytail',
    name: '포니테일',
    category: 'hair',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="30" cy="34" r="20" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M10 30 Q10 8 30 8 Q50 8 50 28 Q42 20 32 20 Q20 20 14 30 Z" fill="#c9a47a"/>
        <ellipse cx="54" cy="40" rx="8" ry="14" fill="#c9a47a"/>
      </svg>`,
    svgFragment: (color = '#c9a47a') => {
      const accent = shade(color, 0.2);
      return `
      <g class="outfit-hair hair-ponytail">
        <path d="M86 122 Q90 41 160 37 Q240 41 238 122
                 Q228 98 208 92 Q188 100 160 96 Q132 96 120 102
                 Q98 100 90 110 Z"
              fill="${color}"/>
        <ellipse cx="242" cy="164" rx="18" ry="42" fill="${color}" stroke="${accent}" stroke-width="2"/>
        <path d="M236 138 Q244 154 242 164" stroke="${accent}" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// GLASSES (accessory). Positioned over eyes (~138,128) and (~182,128).
// ---------------------------------------------------------------------------
const GLASSES = [
  {
    id: 'glasses-round',
    name: '동그란 안경',
    category: 'glasses',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="22" cy="32" r="10" fill="none" stroke="#000000" stroke-width="3"/>
        <circle cx="42" cy="32" r="10" fill="none" stroke="#000000" stroke-width="3"/>
        <line x1="32" y1="32" x2="32" y2="32" stroke="#000000" stroke-width="3"/>
        <line x1="32" y1="32" x2="32" y2="32" stroke="#000000" stroke-width="3"/>
        <line x1="12" y1="30" x2="6" y2="30" stroke="#000000" stroke-width="3"/>
        <line x1="52" y1="30" x2="58" y2="30" stroke="#000000" stroke-width="3"/>
      </svg>`,
    svgFragment: (color = '#000000') => `
      <g class="outfit-glasses glasses-round">
        <circle cx="138" cy="130" r="14" fill="#ffffff" fill-opacity="0.2" stroke="${color}" stroke-width="3"/>
        <circle cx="182" cy="130" r="14" fill="#ffffff" fill-opacity="0.2" stroke="${color}" stroke-width="3"/>
        <line x1="152" y1="130" x2="168" y2="130" stroke="${color}" stroke-width="3"/>
        <line x1="124" y1="128" x2="96"  y2="130" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        <line x1="196" y1="128" x2="224" y2="130" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      </g>`,
  },
  {
    id: 'glasses-square',
    name: '뿔테 안경',
    category: 'glasses',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <rect x="10" y="22" width="20" height="16" rx="2" fill="none" stroke="#000000" stroke-width="3"/>
        <rect x="34" y="22" width="20" height="16" rx="2" fill="none" stroke="#000000" stroke-width="3"/>
        <line x1="30" y1="30" x2="34" y2="30" stroke="#000000" stroke-width="3"/>
      </svg>`,
    svgFragment: (color = '#1f2937') => `
      <g class="outfit-glasses glasses-square">
        <rect x="122" y="116" width="32" height="26" rx="3" fill="#ffffff" fill-opacity="0.18" stroke="${color}" stroke-width="4"/>
        <rect x="166" y="116" width="32" height="26" rx="3" fill="#ffffff" fill-opacity="0.18" stroke="${color}" stroke-width="4"/>
        <line x1="154" y1="129" x2="166" y2="129" stroke="${color}" stroke-width="4"/>
        <line x1="122" y1="124" x2="96"  y2="128" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        <line x1="198" y1="124" x2="224" y2="128" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      </g>`,
  },
  {
    id: 'glasses-clear',
    name: '투명 안경',
    category: 'glasses',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="22" cy="32" r="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="42" cy="32" r="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
        <line x1="32" y1="32" x2="32" y2="32" stroke="#94a3b8" stroke-width="2"/>
      </svg>`,
    svgFragment: (color = '#94a3b8') => `
      <g class="outfit-glasses glasses-clear">
        <circle cx="138" cy="130" r="14" fill="#ffffff" fill-opacity="0.15" stroke="${color}" stroke-width="2"/>
        <circle cx="182" cy="130" r="14" fill="#ffffff" fill-opacity="0.15" stroke="${color}" stroke-width="2"/>
        <line x1="152" y1="130" x2="168" y2="130" stroke="${color}" stroke-width="2"/>
        <line x1="124" y1="128" x2="98"  y2="130" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        <line x1="196" y1="128" x2="222" y2="130" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      </g>`,
  },
];

// ---------------------------------------------------------------------------
// EARRINGS (accessory). Hung off ears at (84, 134) and (236, 134).
// ---------------------------------------------------------------------------
const EARRINGS = [
  {
    id: 'earrings-stud',
    name: '귀고리',
    category: 'earrings',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="20" cy="40" r="6" fill="#fcd34d" stroke="#92400e" stroke-width="2"/>
        <circle cx="44" cy="40" r="6" fill="#fcd34d" stroke="#92400e" stroke-width="2"/>
      </svg>`,
    svgFragment: (color = '#fcd34d') => {
      const dark = shade(color, 0.45);
      return `
      <g class="outfit-earrings earrings-stud">
        <circle cx="82"  cy="146" r="4.5" fill="${color}" stroke="${dark}" stroke-width="1.5"/>
        <circle cx="238" cy="146" r="4.5" fill="${color}" stroke="${dark}" stroke-width="1.5"/>
      </g>`;
    },
  },
  {
    id: 'earrings-hoop',
    name: '링 귀걸이',
    category: 'earrings',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="20" cy="40" r="8" fill="none" stroke="#fcd34d" stroke-width="3"/>
        <circle cx="44" cy="40" r="8" fill="none" stroke="#fcd34d" stroke-width="3"/>
      </svg>`,
    svgFragment: (color = '#fcd34d') => `
      <g class="outfit-earrings earrings-hoop">
        <circle cx="82"  cy="152" r="8" fill="none" stroke="${color}" stroke-width="3"/>
        <circle cx="238" cy="152" r="8" fill="none" stroke="${color}" stroke-width="3"/>
      </g>`,
  },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export const HAIR_STYLES = HAIR;
export const GLASSES_STYLES = GLASSES;
export const EARRINGS_STYLES = EARRINGS;

export const OUTFITS = [
  ...TOPS,
  ...BOTTOMS,
  ...HATS,
  ...FACES,
  ...HAIR,
  ...GLASSES,
  ...EARRINGS,
];

const _byId = new Map(OUTFITS.map((o) => [o.id, o]));

export function getById(id) {
  if (id == null) return null;
  return _byId.get(id) || null;
}

export function getByCategory(category) {
  return OUTFITS.filter((o) => o.category === category);
}

// Render an outfit item's svg fragment with its color. Tolerates either a
// function-style svgFragment (new) or a plain string (legacy fallback).
export function renderOutfitFragment(item, color) {
  if (!item) return '';
  const f = item.svgFragment;
  if (typeof f === 'function') return f(color);
  if (typeof f === 'string') return f;
  return '';
}
