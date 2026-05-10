// Outfit catalog for the Codenergy avatar feature.
//
// Each outfit object:
//   - id:          kebab-case unique string
//   - name:        Korean display name
//   - category:    'top' | 'bottom' | 'hat' | 'face'
//   - thumbnail:   standalone 64x64 SVG string (used in the wardrobe grid)
//   - svgFragment: SVG fragment positioned for the character body (used by
//                  renderCharacter); coordinates are in the character's
//                  viewBox space (0 0 320 480).
//
// Body coordinate cheat sheet (matches character.js):
//   head center:  (160, 130)   head radius ~ 78
//   neck:         y ~ 208..220
//   torso top:    y ~ 215      torso bottom: y ~ 340
//   shoulders:    x ~ 96..224  at y ~ 220
//   waist:        x ~ 110..210 at y ~ 335
//   legs top:     y ~ 340      legs bottom:  y ~ 450

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
    svgFragment: `
      <g class="outfit-top top-tshirt-white">
        <!-- Smoother shoulder line: starts just outside shoulders (x=96/224),
             rides along the shoulder seam (y=218), then dips at the neckline
             (centered on neck x=148~172). Hem ends at waist line y=346. -->
        <path d="M96 220 Q116 218 140 224 Q160 240 180 224 Q204 218 224 220
                 L240 252 L222 264 L218 256 L218 346 L102 346 L102 256 L98 264 L80 252 Z"
              fill="#ffffff" stroke="#cbd5e1" stroke-width="3" stroke-linejoin="round"/>
        <!-- Neckline accent matches collar dip -->
        <path d="M140 224 Q160 240 180 224" fill="none" stroke="#cbd5e1" stroke-width="2"/>
      </g>`,
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
    svgFragment: `
      <g class="outfit-top top-hoodie-purple">
        <path d="M96 218 Q112 200 140 198 Q160 192 180 198 Q208 200 224 218
                 L240 252 L222 264 L218 256 L218 348 L102 348 L102 256 L98 264 L80 252 Z"
              fill="#a855f7" stroke="#7c3aed" stroke-width="3" stroke-linejoin="round"/>
        <!-- hood resting on shoulders -->
        <path d="M112 222 Q160 250 208 222 Q198 244 160 252 Q122 244 112 222 Z"
              fill="#7c3aed"/>
        <!-- drawstrings -->
        <line x1="150" y1="244" x2="150" y2="280" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round"/>
        <line x1="170" y1="244" x2="170" y2="280" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round"/>
        <!-- pocket -->
        <path d="M126 296 L194 296 L186 332 L134 332 Z" fill="#9333ea" stroke="#7c3aed" stroke-width="2"/>
      </g>`,
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
    svgFragment: `
      <g class="outfit-top top-shirt-formal">
        <!-- Shirt body: smooth shoulder line that hugs the shoulders, with a
             neckline notch at the neck position (x=148~172) for the collar. -->
        <path d="M96 220 Q116 218 140 224 Q160 240 180 224 Q204 218 224 220
                 L240 252 L222 264 L218 256 L218 346 L102 346 L102 256 L98 264 L80 252 Z"
              fill="#f8fafc" stroke="#94a3b8" stroke-width="3" stroke-linejoin="round"/>
        <!-- collar — sits over the neckline notch -->
        <path d="M138 224 L160 256 L182 224 L172 218 L160 232 L148 218 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
        <!-- tie -->
        <path d="M155 244 L165 244 L168 252 L162 264 L158 264 L152 252 Z" fill="#22c55e"/>
        <path d="M158 264 L162 264 L168 332 L152 332 Z" fill="#16a34a"/>
        <!-- buttons -->
        <line x1="160" y1="266" x2="160" y2="344" stroke="#cbd5e1" stroke-width="1.5"/>
        <circle cx="160" cy="288" r="2" fill="#94a3b8"/>
        <circle cx="160" cy="310" r="2" fill="#94a3b8"/>
        <circle cx="160" cy="332" r="2" fill="#94a3b8"/>
      </g>`,
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
    svgFragment: `
      <g class="outfit-top top-hoodie-black">
        <path d="M96 218 Q112 200 140 198 Q160 192 180 198 Q208 200 224 218
                 L240 252 L222 264 L218 256 L218 348 L102 348 L102 256 L98 264 L80 252 Z"
              fill="#1f2937" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
        <path d="M112 222 Q160 250 208 222 Q198 244 160 252 Q122 244 112 222 Z"
              fill="#0f172a"/>
        <line x1="150" y1="244" x2="150" y2="280" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
        <line x1="170" y1="244" x2="170" y2="280" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
        <path d="M126 296 L194 296 L186 332 L134 332 Z" fill="#111827" stroke="#0f172a" stroke-width="2"/>
      </g>`,
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
    svgFragment: `
      <g class="outfit-bottom bottom-jeans-blue">
        <!-- Waist matches torso bottom (x=100..220, y=340). Leg cuffs end at
             y=448 — the top edge of the shoe ellipses (cy=456, ry=8) so the
             jeans meet the shoes cleanly without overlapping. -->
        <path d="M100 340 L220 340 L222 372 L204 448 L184 448 L172 380 L160 376 L148 380 L136 448 L116 448 L98 372 Z"
              fill="#3b82f6" stroke="#1d4ed8" stroke-width="3" stroke-linejoin="round"/>
        <!-- waistband -->
        <rect x="100" y="340" width="120" height="10" fill="#1d4ed8"/>
        <!-- center seam -->
        <line x1="160" y1="350" x2="160" y2="378" stroke="#1d4ed8" stroke-width="2"/>
        <!-- stitches on legs -->
        <line x1="148" y1="386" x2="138" y2="444" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3"/>
        <line x1="172" y1="386" x2="182" y2="444" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3"/>
      </g>`,
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
    svgFragment: `
      <g class="outfit-bottom bottom-shorts">
        <!-- Waist matches torso bottom (x=100..220, y=340). Cuff ends at y=408
             (above the knee, well above shoes). Crotch V centered on x=160. -->
        <path d="M100 340 L220 340 L220 360 L208 408 L182 408 L172 380 L160 376 L148 380 L138 408 L112 408 L100 360 Z"
              fill="#22c55e" stroke="#16a34a" stroke-width="3" stroke-linejoin="round"/>
        <rect x="100" y="340" width="120" height="8" fill="#16a34a"/>
        <line x1="160" y1="348" x2="160" y2="378" stroke="#16a34a" stroke-width="2"/>
      </g>`,
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
    svgFragment: `
      <g class="outfit-bottom bottom-slacks">
        <!-- Waist matches torso bottom (x=100..220, y=340). Cuffs end at y=448
             so the slacks rest on top of the shoe ellipses (cy=456). -->
        <path d="M100 340 L220 340 L222 372 L204 448 L184 448 L172 380 L160 376 L148 380 L136 448 L116 448 L98 372 Z"
              fill="#1f2937" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
        <rect x="100" y="340" width="120" height="8" fill="#0f172a"/>
        <!-- crisp center crease on each leg -->
        <line x1="142" y1="386" x2="130" y2="444" stroke="#374151" stroke-width="1.5"/>
        <line x1="178" y1="386" x2="190" y2="444" stroke="#374151" stroke-width="1.5"/>
      </g>`,
  },
];

// ---------------------------------------------------------------------------
// HATS
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
    svgFragment: `
      <g class="outfit-hat hat-beanie">
        <path d="M86 124 Q86 56 160 52 Q234 56 234 124 Z" fill="#a855f7" stroke="#7c3aed" stroke-width="3"/>
        <rect x="84" y="118" width="152" height="22" rx="8" fill="#7c3aed"/>
        <!-- pompom -->
        <circle cx="160" cy="50" r="14" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
      </g>`,
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
    svgFragment: `
      <g class="outfit-hat hat-cap">
        <path d="M86 130 Q86 64 160 60 Q234 64 234 130 Z" fill="#22c55e" stroke="#16a34a" stroke-width="3"/>
        <!-- brim: shifted slightly right of center (head spans x=82..238) but
             still anchored on the head. Old cx=206 pushed it past the right
             ear; cx=190 keeps the brim centered on the forehead. -->
        <ellipse cx="190" cy="136" rx="68" ry="12" fill="#16a34a"/>
        <!-- logo -->
        <text x="160" y="112" text-anchor="middle" font-family="Arial,sans-serif" font-size="40" font-weight="800" fill="#ffffff">C</text>
      </g>`,
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
    svgFragment: `
      <g class="outfit-hat hat-beret">
        <!-- beret tilted to one side. Head radius is 78; rx=82 lets the beret
             drape just slightly past the head silhouette without floating
             out near the ears (old rx=86 pushed it visibly off the head). -->
        <ellipse cx="160" cy="92" rx="82" ry="40" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
        <ellipse cx="160" cy="120" rx="60" ry="9" fill="#7f1d1d"/>
        <!-- stem on top -->
        <circle cx="200" cy="60" r="8" fill="#7f1d1d"/>
      </g>`,
  },
];

// ---------------------------------------------------------------------------
// FACES (expressions / face accessories)
// Note: faces are layered on top of the base body, so they replace the base
// face if present. The base body in character.js renders a default neutral
// face only when `face` is null/undefined.
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
    svgFragment: `
      <g class="outfit-face face-smile">
        <!-- eyes -->
        <circle cx="138" cy="128" r="5.5" fill="#1f2937"/>
        <circle cx="182" cy="128" r="5.5" fill="#1f2937"/>
        <!-- eye highlights -->
        <circle cx="140" cy="126" r="1.6" fill="#ffffff"/>
        <circle cx="184" cy="126" r="1.6" fill="#ffffff"/>
        <!-- cheeks -->
        <circle cx="124" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <circle cx="196" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <!-- big smile -->
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
    svgFragment: `
      <g class="outfit-face face-serious">
        <!-- narrowed eyes -->
        <rect x="128" y="126" width="22" height="5" rx="2.5" fill="#1f2937"/>
        <rect x="170" y="126" width="22" height="5" rx="2.5" fill="#1f2937"/>
        <!-- straight mouth -->
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
    svgFragment: `
      <g class="outfit-face face-wink">
        <!-- left eye: closed wink -->
        <path d="M128 130 Q138 122 148 130" stroke="#1f2937" stroke-width="4"
              fill="none" stroke-linecap="round"/>
        <!-- right eye: open -->
        <circle cx="182" cy="128" r="5.5" fill="#1f2937"/>
        <circle cx="184" cy="126" r="1.6" fill="#ffffff"/>
        <!-- cheeks -->
        <circle cx="124" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <circle cx="196" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <!-- smile -->
        <path d="M138 160 Q160 176 182 160" stroke="#1f2937" stroke-width="3.5"
              fill="none" stroke-linecap="round"/>
      </g>`,
  },
  {
    id: 'face-glasses',
    name: '안경',
    category: 'face',
    thumbnail: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="22" cy="30" r="6" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
        <circle cx="42" cy="30" r="6" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
        <line x1="28" y1="30" x2="36" y2="30" stroke="#1f2937" stroke-width="2"/>
        <path d="M22 42 Q32 48 42 42" stroke="#1f2937" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>`,
    svgFragment: `
      <g class="outfit-face face-glasses">
        <!-- eyes behind lenses -->
        <circle cx="138" cy="130" r="3.5" fill="#1f2937"/>
        <circle cx="182" cy="130" r="3.5" fill="#1f2937"/>
        <!-- glasses frames -->
        <circle cx="138" cy="130" r="14" fill="#ffffff" fill-opacity="0.25" stroke="#1f2937" stroke-width="3"/>
        <circle cx="182" cy="130" r="14" fill="#ffffff" fill-opacity="0.25" stroke="#1f2937" stroke-width="3"/>
        <line x1="152" y1="130" x2="168" y2="130" stroke="#1f2937" stroke-width="3"/>
        <!-- Temples extending out toward the ears (ears at x=84 and x=236) so
             the glasses look like they actually rest on the head. -->
        <line x1="124" y1="128" x2="96" y2="130" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
        <line x1="196" y1="128" x2="224" y2="130" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
        <!-- subtle smile -->
        <path d="M144 162 Q160 174 176 162" stroke="#1f2937" stroke-width="3"
              fill="none" stroke-linecap="round"/>
      </g>`,
  },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export const OUTFITS = [...TOPS, ...BOTTOMS, ...HATS, ...FACES];

const _byId = new Map(OUTFITS.map((o) => [o.id, o]));

export function getById(id) {
  if (id == null) return null;
  return _byId.get(id) || null;
}

export function getByCategory(category) {
  return OUTFITS.filter((o) => o.category === category);
}
