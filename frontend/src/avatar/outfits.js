// outfits.js — 배터리 캐릭터용 카탈로그 (v2)
// 좌표계: SVG viewBox 0 0 240 320
// BODY_RECT = { x:48, y:40, width:144, height:240, rx:32 }
// 눈: cx=120, cy=120, r=38 / cap: x=98, y=22, w=44, h=18
// HAIR, BOTTOMS 카테고리 완전 제거. 4카테고리 × 7개 = 28 아이템.

import { BODY_RECT } from './character.js';
// BODY_RECT 참조: x=48, y=40, width=144, height=240, rx=32
// (좌표는 인라인 숫자로 박혀 있음 — import는 참조용)
void BODY_RECT; // used for reference; prevents lint unused-import warning

// ---------------------------------------------------------------------------
// shade 헬퍼
// ---------------------------------------------------------------------------
function shade(hex, amount = 0.25) {
  if (typeof hex !== 'string' || !hex.startsWith('#')) return hex;
  let h = hex.length === 4
    ? '#' + hex.slice(1).split('').map((c) => c + c).join('')
    : hex;
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  const f = Math.max(0, Math.min(1, 1 - amount));
  return '#' + [r, g, b].map((v) => Math.round(v * f).toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// TOPS — 본체 위 1/3 영역 (x=52~188, y=130~230). 팔 없는 배터리 본체 형태.
// ---------------------------------------------------------------------------
const TOPS = [
  {
    id:        'top-tee',
    name:      '티셔츠',
    thumbnail: '👕',
    price:     0,
    tier:      'free',
    svgFragment: (color = '#2563eb') => {
      const dk = shade(color, 0.22);
      return `<g class="outfit-top top-tee">
        <path d="M52 140 Q52 130 60 128 L80 124 Q120 120 160 124 L180 128 Q188 130 188 140 L188 210 L52 210 Z"
              fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M88 124 Q120 140 152 124" fill="none" stroke="${dk}" stroke-width="1.5" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id:        'top-tank',
    name:      '민소매',
    thumbnail: '🎽',
    price:     0,
    tier:      'free',
    svgFragment: (color = '#10b981') => {
      const dk = shade(color, 0.2);
      return `<g class="outfit-top top-tank">
        <path d="M68 140 Q68 130 76 128 Q120 122 164 128 Q172 130 172 140 L172 210 L68 210 Z"
              fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <line x1="68" y1="140" x2="52" y2="160" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
        <line x1="172" y1="140" x2="188" y2="160" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id:        'top-hoodie',
    name:      '후드티',
    thumbnail: '🧥',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#a855f7') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-top top-hoodie">
        <path d="M52 140 Q52 128 62 126 L80 122 Q120 118 160 122 L178 126 Q188 128 188 140 L188 210 L52 210 Z"
              fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M88 122 Q120 138 152 122" fill="none" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
        <rect x="104" y="180" width="32" height="22" rx="4" fill="none" stroke="${dk}" stroke-width="2"/>
        <line x1="120" y1="148" x2="120" y2="180" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id:        'top-stripe',
    name:      '스트라이프',
    thumbnail: '🧵',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#ef4444') => {
      const dk = shade(color, 0.22);
      return `<g class="outfit-top top-stripe">
        <path d="M52 140 Q52 130 60 128 L80 124 Q120 120 160 124 L180 128 Q188 130 188 140 L188 210 L52 210 Z"
              fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <line x1="56"  y1="155" x2="184" y2="155" stroke="${dk}" stroke-width="4"/>
        <line x1="55"  y1="170" x2="185" y2="170" stroke="${dk}" stroke-width="4"/>
        <line x1="54"  y1="185" x2="186" y2="185" stroke="${dk}" stroke-width="4"/>
      </g>`;
    },
  },
  {
    id:        'top-shirt',
    name:      '셔츠',
    thumbnail: '👔',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#f8fafc') => {
      const dk = shade(color, 0.22);
      return `<g class="outfit-top top-shirt">
        <path d="M52 140 Q52 130 60 128 L80 124 Q120 120 160 124 L180 128 Q188 130 188 140 L188 210 L52 210 Z"
              fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M104 124 L112 140 L120 134 L128 140 L136 124 Q120 114 104 124 Z" fill="${dk}"/>
        <line x1="120" y1="142" x2="120" y2="208" stroke="${dk}" stroke-width="1.5"/>
        <circle cx="120" cy="158" r="2" fill="${dk}"/>
        <circle cx="120" cy="174" r="2" fill="${dk}"/>
        <circle cx="120" cy="190" r="2" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id:        'top-jacket',
    name:      '재킷',
    thumbnail: '🧣',
    price:     100,
    tier:      'premium',
    svgFragment: (color = '#1e3a8a') => {
      const dk = shade(color, 0.28);
      const lt = shade(color, -0.15);
      return `<g class="outfit-top top-jacket">
        <path d="M52 140 Q52 128 62 126 L80 122 Q120 118 160 122 L178 126 Q188 128 188 140 L188 210 L52 210 Z"
              fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M104 122 L112 142 L120 136 L128 142 L136 122 Q120 112 104 122 Z" fill="${dk}"/>
        <line x1="120" y1="142" x2="120" y2="208" stroke="${dk}" stroke-width="3"/>
        <rect x="58" y="160" width="16" height="12" rx="2" fill="${lt}"/>
        <line x1="52" y1="140" x2="52" y2="210" stroke="${dk}" stroke-width="4" stroke-linecap="round"/>
        <line x1="188" y1="140" x2="188" y2="210" stroke="${dk}" stroke-width="4" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id:        'top-polo',
    name:      '폴로',
    thumbnail: '🏌️',
    price:     100,
    tier:      'premium',
    svgFragment: (color = '#0ea5e9') => {
      const dk = shade(color, 0.22);
      return `<g class="outfit-top top-polo">
        <path d="M52 140 Q52 130 60 128 L80 124 Q120 120 160 124 L180 128 Q188 130 188 140 L188 210 L52 210 Z"
              fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M110 120 L114 138 L120 132 L126 138 L130 120 Q120 112 110 120 Z" fill="${dk}"/>
        <line x1="120" y1="136" x2="120" y2="160" stroke="${dk}" stroke-width="2"/>
        <circle cx="120" cy="164" r="2.5" fill="${dk}"/>
        <circle cx="120" cy="174" r="2.5" fill="${dk}"/>
        <line x1="88" y1="124" x2="80" y2="134" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
        <line x1="152" y1="124" x2="160" y2="134" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// HATS — cap(y=22~40) 위. 모자는 y=−12~40 영역에 배치.
// ---------------------------------------------------------------------------
const HATS = [
  {
    id:        'hat-cap',
    name:      '야구모자',
    thumbnail: '🧢',
    price:     0,
    tier:      'free',
    svgFragment: (color = '#1f2937') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-hat hat-cap">
        <path d="M48 38 Q50 -2 120 -5 Q190 -2 192 38 Z"
              fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="158" cy="40" rx="46" ry="7" fill="${dk}"/>
        <text x="120" y="24" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="800" fill="#ffffff">C</text>
      </g>`;
    },
  },
  {
    id:        'hat-beanie',
    name:      '비니',
    thumbnail: '🎩',
    price:     0,
    tier:      'free',
    svgFragment: (color = '#a855f7') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-hat hat-beanie">
        <path d="M50 40 Q52 -4 120 -7 Q188 -4 190 40 Z"
              fill="${color}" stroke="${dk}" stroke-width="2"/>
        <rect x="46" y="34" width="148" height="14" rx="6" fill="${dk}"/>
        <circle cx="120" cy="-5" r="11" fill="#fde68a" stroke="#f59e0b" stroke-width="1.5"/>
      </g>`;
    },
  },
  {
    id:        'hat-tophat',
    name:      '탑햇',
    thumbnail: '🎩',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#111827') => {
      const dk = shade(color, 0.5);
      return `<g class="outfit-hat hat-tophat">
        <rect x="92" y="-38" width="56" height="56" rx="4"
              fill="${color}" stroke="${dk}" stroke-width="2"/>
        <rect x="60" y="16" width="120" height="12" rx="4" fill="${dk}"/>
        <line x1="92" y1="-2" x2="148" y2="-2" stroke="${dk}" stroke-width="1.5" opacity="0.5"/>
      </g>`;
    },
  },
  {
    id:        'hat-fedora',
    name:      '페도라',
    thumbnail: '🤠',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#92400e') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-hat hat-fedora">
        <path d="M80 38 Q82 2 120 -1 Q158 2 160 38 Z"
              fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="120" cy="40" rx="72" ry="10" fill="${dk}"/>
        <path d="M92 14 Q120 4 148 14" fill="none" stroke="${dk}" stroke-width="3" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id:        'hat-bucket',
    name:      '버킷햇',
    thumbnail: '👒',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#fbbf24') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-hat hat-bucket">
        <path d="M82 38 Q84 4 120 1 Q156 4 158 38 Z"
              fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="120" cy="40" rx="66" ry="11" fill="${dk}"/>
        <path d="M86 24 Q120 16 154 24" fill="none" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id:        'hat-beret',
    name:      '베레모',
    thumbnail: '🎭',
    price:     100,
    tier:      'premium',
    svgFragment: (color = '#dc2626') => {
      const dk = shade(color, 0.35);
      return `<g class="outfit-hat hat-beret">
        <ellipse cx="112" cy="20" rx="68" ry="28" fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="120" cy="36" rx="46" ry="8" fill="${dk}"/>
        <circle  cx="148" cy="-2" r="6" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id:        'hat-visor',
    name:      '바이저',
    thumbnail: '🏄',
    price:     100,
    tier:      'premium',
    svgFragment: (color = '#10b981') => {
      const dk = shade(color, 0.28);
      return `<g class="outfit-hat hat-visor">
        <rect x="46" y="26" width="148" height="16" rx="7"
              fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="158" cy="44" rx="50" ry="8" fill="${dk}"/>
        <text x="96" y="40" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#ffffff">CODENERGY</text>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// GLASSES — 외눈(cx=120, cy=120, r=38). 단일 대형 프레임/링으로 통합.
// ---------------------------------------------------------------------------
const GLASSES = [
  {
    id:        'glasses-round',
    name:      '동그란',
    thumbnail: '👓',
    price:     0,
    tier:      'free',
    svgFragment: (color = '#000000') => `<g class="outfit-glasses glasses-round">
      <circle cx="120" cy="120" r="46" fill="none" stroke="${color}" stroke-width="3"/>
      <line x1="74"  y1="118" x2="56"  y2="115" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="166" y1="118" x2="184" y2="115" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    </g>`,
  },
  {
    id:        'glasses-square',
    name:      '뿔테',
    thumbnail: '🕶️',
    price:     0,
    tier:      'free',
    svgFragment: (color = '#1f2937') => `<g class="outfit-glasses glasses-square">
      <rect x="73" y="73" width="94" height="94" rx="8"
            fill="none" stroke="${color}" stroke-width="3.5"/>
      <line x1="73"  y1="118" x2="54"  y2="115" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="167" y1="118" x2="186" y2="115" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    </g>`,
  },
  {
    id:        'glasses-sun',
    name:      '선글라스',
    thumbnail: '😎',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#374151') => `<g class="outfit-glasses glasses-sun">
      <circle cx="120" cy="120" r="46" fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="2"/>
      <line x1="74"  y1="118" x2="56"  y2="115" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="166" y1="118" x2="184" y2="115" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    </g>`,
  },
  {
    id:        'glasses-cat',
    name:      '캣아이',
    thumbnail: '🐱',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#a855f7') => {
      const dk = shade(color, 0.2);
      return `<g class="outfit-glasses glasses-cat">
        <path d="M74 130 Q74 74 120 72 Q166 74 166 130 Q150 118 120 116 Q90 118 74 130 Z"
              fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>
        <line x1="74"  y1="118" x2="54"  y2="112" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        <line x1="166" y1="118" x2="186" y2="112" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        <line x1="120" y1="72"  x2="128" y2="60"  stroke="${dk}"    stroke-width="2" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id:        'glasses-oval',
    name:      '오벌',
    thumbnail: '🔍',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#0ea5e9') => `<g class="outfit-glasses glasses-oval">
      <ellipse cx="120" cy="120" rx="48" ry="36"
               fill="none" stroke="${color}" stroke-width="3"/>
      <line x1="72"  y1="118" x2="54"  y2="115" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="168" y1="118" x2="186" y2="115" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    </g>`,
  },
  {
    id:        'glasses-heart',
    name:      '하트',
    thumbnail: '❤️',
    price:     100,
    tier:      'premium',
    svgFragment: (color = '#ef4444') => `<g class="outfit-glasses glasses-heart">
      <path d="M120 160 C120 160 70 132 70 104 C70 88 82 78 96 82 C106 84 120 96 120 96 C120 96 134 84 144 82 C158 78 170 88 170 104 C170 132 120 160 120 160 Z"
            fill="${color}" fill-opacity="0.75" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="70"  y1="104" x2="50"  y2="100" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="170" y1="104" x2="190" y2="100" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    </g>`,
  },
  {
    id:        'glasses-mono',
    name:      '모노클',
    thumbnail: '🧐',
    price:     100,
    tier:      'premium',
    svgFragment: (color = '#92400e') => `<g class="outfit-glasses glasses-mono">
      <circle cx="120" cy="120" r="46"
              fill="none" stroke="${color}" stroke-width="3.5"/>
      <line x1="166" y1="120" x2="190" y2="128" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="120" cy="120" r="2" fill="${color}" opacity="0.4"/>
    </g>`,
  },
];

// ---------------------------------------------------------------------------
// OTHER — 배터리 사이드 액세서리 (핀, 왕관, 후광 등). ID prefix: acc-
// ---------------------------------------------------------------------------
const OTHER = [
  {
    id:        'acc-bolt-pin',
    name:      '번개 핀',
    thumbnail: '⚡',
    price:     0,
    tier:      'free',
    svgFragment: (color = '#fbbf24') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-other acc-bolt-pin">
        <path d="M172 55 L160 75 L168 75 L162 95 L180 70 L170 70 Z"
              fill="${color}" stroke="${dk}" stroke-width="1.5" stroke-linejoin="round"/>
      </g>`;
    },
  },
  {
    id:        'acc-star-pin',
    name:      '별 핀',
    thumbnail: '⭐',
    price:     0,
    tier:      'free',
    svgFragment: (color = '#fbbf24') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-other acc-star-pin">
        <polygon points="60,55 63,65 74,65 65,72 68,82 60,75 52,82 55,72 46,65 57,65"
                 fill="${color}" stroke="${dk}" stroke-width="1.5" stroke-linejoin="round"/>
      </g>`;
    },
  },
  {
    id:        'acc-bow',
    name:      '리본',
    thumbnail: '🎀',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#f472b6') => {
      const dk = shade(color, 0.22);
      return `<g class="outfit-other acc-bow">
        <path d="M46 50 C38 42 38 58 46 54 L58 50 Z" fill="${color}" stroke="${dk}" stroke-width="1.5"/>
        <path d="M46 50 C38 42 38 58 46 54 Z" fill="${dk}" opacity="0.3"/>
        <path d="M70 50 C78 42 78 58 70 54 L58 50 Z" fill="${color}" stroke="${dk}" stroke-width="1.5"/>
        <circle cx="58" cy="50" r="5" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id:        'acc-flame-pin',
    name:      '불꽃 핀',
    thumbnail: '🔥',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#f97316') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-other acc-flame-pin">
        <path d="M174 90 C168 80 164 70 170 60 C172 68 176 70 176 64 C180 70 182 80 178 90 C178 94 174 96 174 90 Z"
              fill="${color}" stroke="${dk}" stroke-width="1.5" stroke-linejoin="round"/>
      </g>`;
    },
  },
  {
    id:        'acc-gear-pin',
    name:      '톱니 핀',
    thumbnail: '⚙️',
    price:     30,
    tier:      'common',
    svgFragment: (color = '#94a3b8') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-other acc-gear-pin">
        <g transform="translate(60,80)">
          <circle r="10" fill="${color}" stroke="${dk}" stroke-width="1.5"/>
          <circle r="5"  fill="${dk}" opacity="0.6"/>
          <rect x="-3" y="-14" width="6" height="7" rx="1.5" fill="${color}" stroke="${dk}" stroke-width="1"/>
          <rect x="-3" y="7"   width="6" height="7" rx="1.5" fill="${color}" stroke="${dk}" stroke-width="1"/>
          <rect x="-14" y="-3" width="7" height="6" rx="1.5" fill="${color}" stroke="${dk}" stroke-width="1"/>
          <rect x="7"   y="-3" width="7" height="6" rx="1.5" fill="${color}" stroke="${dk}" stroke-width="1"/>
        </g>
      </g>`;
    },
  },
  {
    id:        'acc-crown',
    name:      '왕관',
    thumbnail: '👑',
    price:     100,
    tier:      'premium',
    svgFragment: (color = '#fbbf24') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-other acc-crown">
        <path d="M84 22 L100 8 L120 22 L140 8 L156 22 L156 38 L84 38 Z"
              fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="100" cy="8"  r="3.5" fill="${dk}"/>
        <circle cx="120" cy="22" r="3"   fill="${dk}" opacity="0.5"/>
        <circle cx="140" cy="8"  r="3.5" fill="${dk}"/>
        <line x1="84" y1="34" x2="156" y2="34" stroke="${dk}" stroke-width="2"/>
      </g>`;
    },
  },
  {
    id:        'acc-halo',
    name:      '후광',
    thumbnail: '😇',
    price:     100,
    tier:      'premium',
    svgFragment: (color = '#fde68a') => {
      const dk = shade(color, 0.2);
      return `<g class="outfit-other acc-halo">
        <ellipse cx="120" cy="16" rx="46" ry="12"
                 fill="none" stroke="${color}" stroke-width="5" opacity="0.9"/>
        <ellipse cx="120" cy="16" rx="46" ry="12"
                 fill="none" stroke="${dk}" stroke-width="2" opacity="0.5"/>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// Catalog map — HAIR, BOTTOMS 완전 제거
// ---------------------------------------------------------------------------
export const CATALOG = {
  top:     TOPS,
  hat:     HATS,
  glasses: GLASSES,
  other:   OTHER,
};

const _byId = new Map(
  [...TOPS, ...HATS, ...GLASSES, ...OTHER].map((o) => [o.id, o])
);

export function getByCategory(sub) {
  return CATALOG[sub] || [];
}

export function getById(id) {
  if (id == null) return null;
  return _byId.get(id) || null;
}

export function renderOutfitFragment(item, color) {
  if (!item) return '';
  const f = item.svgFragment;
  if (typeof f === 'function') return f(color);
  if (typeof f === 'string') return f;
  return '';
}
