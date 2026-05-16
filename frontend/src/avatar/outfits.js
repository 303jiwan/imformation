// outfits.js — 새 카탈로그 (plan step 5)
// 좌표계: SVG viewBox 0 0 240 320 (character.js 와 동일)
// 각 sub당 7개 항목

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
// HAIR — style id prefix: hair-
// ---------------------------------------------------------------------------
const HAIR = [
  {
    id: 'hair-short',
    name: '짧은',
    thumbnail: '✂️',
    svgFragment: (color = '#1f2937') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-hair hair-short">
        <path d="M60 78 Q62 30 120 26 Q178 30 180 78 Q170 58 155 54 Q138 62 120 58 Q102 62 86 58 Q72 58 60 78 Z" fill="${color}"/>
        <path d="M82 56 Q102 36 152 40 Q140 56 120 58 Q100 58 82 56 Z" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id: 'hair-long',
    name: '긴',
    thumbnail: '💇',
    svgFragment: (color = '#5b3a1d') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-hair hair-long">
        <path d="M58 84 Q56 28 120 22 Q184 28 182 84 L186 180 L174 184 L172 140 L172 86 Q158 64 120 60 Q82 64 68 86 L68 140 L56 184 L44 180 Z" fill="${color}"/>
        <path d="M82 58 Q100 36 152 40 Q140 56 120 60 Q100 60 82 58 Z" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id: 'hair-curly',
    name: '곱슬',
    thumbnail: '🌀',
    svgFragment: (color = '#8b5e34') => `<g class="outfit-hair hair-curly">
      <circle cx="62"  cy="55" r="20" fill="${color}"/>
      <circle cx="88"  cy="38" r="23" fill="${color}"/>
      <circle cx="120" cy="30" r="25" fill="${color}"/>
      <circle cx="152" cy="38" r="23" fill="${color}"/>
      <circle cx="178" cy="55" r="20" fill="${color}"/>
      <circle cx="58"  cy="80" r="16" fill="${color}"/>
      <circle cx="182" cy="80" r="16" fill="${color}"/>
    </g>`,
  },
  {
    id: 'hair-ponytail',
    name: '포니테일',
    thumbnail: '🎀',
    svgFragment: (color = '#c9a47a') => {
      const dk = shade(color, 0.2);
      return `<g class="outfit-hair hair-ponytail">
        <path d="M62 80 Q64 30 120 24 Q178 30 178 78 Q168 58 152 54 Q136 62 120 58 Q104 62 88 58 Q74 56 62 80 Z" fill="${color}"/>
        <ellipse cx="185" cy="108" rx="13" ry="32" fill="${color}" stroke="${dk}" stroke-width="1.5"/>
      </g>`;
    },
  },
  {
    id: 'hair-bun',
    name: '번 헤어',
    thumbnail: '👩',
    svgFragment: (color = '#92400e') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-hair hair-bun">
        <path d="M62 80 Q64 30 120 24 Q178 30 178 78 Q168 58 152 54 Q136 62 120 58 Q104 62 88 58 Q74 56 62 80 Z" fill="${color}"/>
        <circle cx="120" cy="24" r="18" fill="${color}" stroke="${dk}" stroke-width="2"/>
      </g>`;
    },
  },
  {
    id: 'hair-wavy',
    name: '웨이브',
    thumbnail: '〰️',
    svgFragment: (color = '#d4a26a') => {
      const dk = shade(color, 0.2);
      return `<g class="outfit-hair hair-wavy">
        <path d="M60 80 Q62 30 120 24 Q178 30 180 80 Q165 55 150 58 Q135 68 120 60 Q105 68 90 58 Q74 55 60 80 Z" fill="${color}"/>
        <path d="M54 100 Q62 84 72 94 Q82 104 92 90 Q102 76 112 90 Q122 104 132 90 Q142 76 152 90 Q162 104 172 90 Q182 76 186 100" stroke="${dk}" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id: 'hair-buzz',
    name: '버즈컷',
    thumbnail: '🪒',
    svgFragment: (color = '#374151') => `<g class="outfit-hair hair-buzz">
      <path d="M62 82 Q64 38 120 34 Q176 38 178 82 Q178 62 120 58 Q62 62 62 82 Z" fill="${color}"/>
    </g>`,
  },
];

// ---------------------------------------------------------------------------
// TOPS — style id prefix: top-
// ---------------------------------------------------------------------------
const TOPS = [
  {
    id: 'top-tee',
    name: '티셔츠',
    thumbnail: '👕',
    svgFragment: (color = '#2563eb') => {
      const dk = shade(color, 0.2);
      return `<g class="outfit-top top-tee">
        <path d="M52 138 C62 122 86 118 120 118 C154 118 178 122 188 138 L188 158 C182 165 174 178 174 182 L174 214 L66 214 L66 182 C62 172 56 162 52 158 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M66 142 Q120 158 174 142" fill="none" stroke="${dk}" stroke-width="1.5"/>
      </g>`;
    },
  },
  {
    id: 'top-hoodie',
    name: '후드티',
    thumbnail: '🧥',
    svgFragment: (color = '#a855f7') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-top top-hoodie">
        <path d="M56 138 C68 120 86 116 120 116 C154 116 172 120 184 138 L190 158 C186 168 180 180 178 184 L178 214 L62 214 L62 184 C60 176 54 162 56 158 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M62 142 Q120 158 178 142" fill="none" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
        <path d="M78 182 L162 182 L158 206 L82 206 Z" fill="none" stroke="${dk}" stroke-width="2"/>
        <line x1="84" y1="152" x2="84" y2="180" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
        <line x1="156" y1="152" x2="156" y2="180" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>
      </g>`;
    },
  },
  {
    id: 'top-shirt',
    name: '셔츠',
    thumbnail: '👔',
    svgFragment: (color = '#f8fafc') => {
      const dk = shade(color, 0.22);
      return `<g class="outfit-top top-shirt">
        <path d="M52 138 C62 122 86 118 120 118 C154 118 178 122 188 138 L188 158 C182 165 174 178 174 182 L174 214 L66 214 L66 182 C62 172 56 162 52 158 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M102 138 L120 158 L138 138 L130 133 L120 145 L110 133 Z" fill="${dk}"/>
        <line x1="120" y1="160" x2="120" y2="210" stroke="${dk}" stroke-width="1.5"/>
        <circle cx="120" cy="173" r="1.5" fill="${dk}"/>
        <circle cx="120" cy="187" r="1.5" fill="${dk}"/>
        <circle cx="120" cy="201" r="1.5" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id: 'top-tank',
    name: '민소매',
    thumbnail: '🎽',
    svgFragment: (color = '#10b981') => {
      const dk = shade(color, 0.2);
      return `<g class="outfit-top top-tank">
        <path d="M76 136 C82 120 96 118 120 118 C144 118 158 120 164 136 L166 214 L74 214 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M74 214 L74 140 C64 138 54 148 52 158 L52 174 Z" fill="${color}" stroke="${dk}" stroke-width="2"/>
        <path d="M166 214 L166 140 C176 138 186 148 188 158 L188 174 Z" fill="${color}" stroke="${dk}" stroke-width="2"/>
      </g>`;
    },
  },
  {
    id: 'top-jacket',
    name: '재킷',
    thumbnail: '🧣',
    svgFragment: (color = '#1e3a8a') => {
      const dk = shade(color, 0.28);
      const lt = shade(color, -0.2);
      return `<g class="outfit-top top-jacket">
        <path d="M52 138 C64 120 86 116 120 116 C154 116 176 120 188 138 L192 162 C186 172 178 184 176 188 L176 214 L64 214 L64 188 C62 180 54 168 48 162 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M102 118 L120 148 L138 118 L128 112 L120 126 L112 112 Z" fill="${dk}"/>
        <line x1="120" y1="148" x2="120" y2="212" stroke="${dk}" stroke-width="3"/>
        <rect x="60" y="168" width="14" height="10" rx="2" fill="${lt}"/>
      </g>`;
    },
  },
  {
    id: 'top-stripe',
    name: '스트라이프',
    thumbnail: '🧵',
    svgFragment: (color = '#ef4444') => {
      const dk = shade(color, 0.2);
      return `<g class="outfit-top top-stripe">
        <path d="M52 138 C62 122 86 118 120 118 C154 118 178 122 188 138 L188 158 C182 165 174 178 174 182 L174 214 L66 214 L66 182 C62 172 56 162 52 158 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <line x1="66" y1="152" x2="174" y2="152" stroke="${dk}" stroke-width="4"/>
        <line x1="64" y1="164" x2="174" y2="164" stroke="${dk}" stroke-width="4"/>
        <line x1="64" y1="176" x2="174" y2="176" stroke="${dk}" stroke-width="4"/>
      </g>`;
    },
  },
  {
    id: 'top-polo',
    name: '폴로',
    thumbnail: '🏌️',
    svgFragment: (color = '#0ea5e9') => {
      const dk = shade(color, 0.22);
      return `<g class="outfit-top top-polo">
        <path d="M52 138 C62 122 86 118 120 118 C154 118 178 122 188 138 L188 158 C182 165 174 178 174 182 L174 214 L66 214 L66 182 C62 172 56 162 52 158 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M108 118 L112 136 L120 130 L128 136 L132 118 Q120 108 108 118 Z" fill="${dk}"/>
        <line x1="120" y1="134" x2="120" y2="155" stroke="${dk}" stroke-width="2"/>
        <circle cx="120" cy="159" r="2" fill="${dk}"/>
        <circle cx="120" cy="168" r="2" fill="${dk}"/>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// BOTTOMS — style id prefix: bot-
// ---------------------------------------------------------------------------
const BOTTOMS = [
  {
    id: 'bot-jeans',
    name: '청바지',
    thumbnail: '👖',
    svgFragment: (color = '#1f2937') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-bottom bot-jeans">
        <path d="M66 213 L174 213 L176 234 L148 300 L138 300 L120 238 L120 235 L112 238 L102 300 L92 300 L64 234 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="7" fill="${dk}"/>
        <line x1="120" y1="220" x2="120" y2="237" stroke="${dk}" stroke-width="1.5"/>
        <line x1="104" y1="241" x2="100" y2="296" stroke="#fbbf24" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="136" y1="241" x2="140" y2="296" stroke="#fbbf24" stroke-width="1" stroke-dasharray="2 2"/>
      </g>`;
    },
  },
  {
    id: 'bot-shorts',
    name: '반바지',
    thumbnail: '🩳',
    svgFragment: (color = '#22c55e') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-bottom bot-shorts">
        <path d="M66 213 L174 213 L174 234 L148 270 L138 270 L120 238 L120 235 L112 238 L102 270 L92 270 L66 234 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="6" fill="${dk}"/>
        <line x1="120" y1="219" x2="120" y2="237" stroke="${dk}" stroke-width="1.5"/>
      </g>`;
    },
  },
  {
    id: 'bot-slacks',
    name: '슬랙스',
    thumbnail: '👔',
    svgFragment: (color = '#374151') => {
      const dk = shade(color, 0.32);
      return `<g class="outfit-bottom bot-slacks">
        <path d="M66 213 L174 213 L176 234 L148 300 L138 300 L120 238 L120 235 L112 238 L102 300 L92 300 L64 234 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="6" fill="${dk}"/>
        <line x1="104" y1="243" x2="100" y2="296" stroke="${dk}" stroke-width="1"/>
        <line x1="136" y1="243" x2="140" y2="296" stroke="${dk}" stroke-width="1"/>
      </g>`;
    },
  },
  {
    id: 'bot-skirt',
    name: '스커트',
    thumbnail: '👗',
    svgFragment: (color = '#f9a8d4') => {
      const dk = shade(color, 0.2);
      return `<g class="outfit-bottom bot-skirt">
        <path d="M68 213 L172 213 L182 300 L58 300 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="68" y="213" width="104" height="6" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id: 'bot-cargo',
    name: '카고팬츠',
    thumbnail: '🪖',
    svgFragment: (color = '#78716c') => {
      const dk = shade(color, 0.28);
      return `<g class="outfit-bottom bot-cargo">
        <path d="M66 213 L174 213 L176 234 L148 300 L138 300 L120 238 L120 235 L112 238 L102 300 L92 300 L64 234 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="6" fill="${dk}"/>
        <rect x="72" y="236" width="18" height="12" rx="2" fill="${dk}"/>
        <rect x="150" y="236" width="18" height="12" rx="2" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id: 'bot-leggings',
    name: '레깅스',
    thumbnail: '🩲',
    svgFragment: (color = '#1e1b4b') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-bottom bot-leggings">
        <path d="M78 213 L162 213 L164 234 L145 300 L135 300 L120 240 L120 237 L116 240 L105 300 L95 300 L76 234 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
      </g>`;
    },
  },
  {
    id: 'bot-jogger',
    name: '조거팬츠',
    thumbnail: '🧶',
    svgFragment: (color = '#6b7280') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-bottom bot-jogger">
        <path d="M66 213 L174 213 L176 234 L150 295 L140 295 L120 238 L120 235 L112 238 L90 295 L80 295 L64 234 Z" fill="${color}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="6" fill="${dk}"/>
        <ellipse cx="105" cy="297" rx="18" ry="4" fill="${dk}"/>
        <ellipse cx="135" cy="297" rx="18" ry="4" fill="${dk}"/>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// HATS — style id prefix: hat-
// ---------------------------------------------------------------------------
const HATS = [
  {
    id: 'hat-cap',
    name: '야구모자',
    thumbnail: '🧢',
    svgFragment: (color = '#1f2937') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-hat hat-cap">
        <path d="M60 82 Q62 42 120 38 Q178 42 180 82 Z" fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="148" cy="88" rx="52" ry="8" fill="${dk}"/>
        <text x="120" y="72" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="800" fill="#ffffff">C</text>
      </g>`;
    },
  },
  {
    id: 'hat-beanie',
    name: '비니',
    thumbnail: '🎩',
    svgFragment: (color = '#a855f7') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-hat hat-beanie">
        <path d="M62 84 Q64 38 120 34 Q176 38 178 84 Z" fill="${color}" stroke="${dk}" stroke-width="2"/>
        <rect x="58" y="78" width="124" height="14" rx="6" fill="${dk}"/>
        <circle cx="120" cy="32" r="10" fill="#fde68a" stroke="#f59e0b" stroke-width="1.5"/>
      </g>`;
    },
  },
  {
    id: 'hat-beret',
    name: '베레모',
    thumbnail: '🎭',
    svgFragment: (color = '#dc2626') => {
      const dk = shade(color, 0.35);
      return `<g class="outfit-hat hat-beret">
        <ellipse cx="120" cy="58" rx="64" ry="30" fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="120" cy="76" rx="46" ry="7" fill="${dk}"/>
        <circle cx="150" cy="34" r="6" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id: 'hat-tophat',
    name: '탑햇',
    thumbnail: '🎩',
    svgFragment: (color = '#111827') => {
      const dk = shade(color, 0.5);
      return `<g class="outfit-hat hat-tophat">
        <rect x="88" y="22" width="64" height="60" rx="4" fill="${color}" stroke="${dk}" stroke-width="2"/>
        <rect x="62" y="78" width="116" height="10" rx="4" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id: 'hat-bucket',
    name: '버킷햇',
    thumbnail: '👒',
    svgFragment: (color = '#fbbf24') => {
      const dk = shade(color, 0.25);
      return `<g class="outfit-hat hat-bucket">
        <path d="M78 82 Q80 46 120 42 Q160 46 162 82 Z" fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="120" cy="84" rx="68" ry="10" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id: 'hat-visor',
    name: '바이저',
    thumbnail: '🏄',
    svgFragment: (color = '#10b981') => {
      const dk = shade(color, 0.28);
      return `<g class="outfit-hat hat-visor">
        <rect x="58" y="70" width="124" height="14" rx="6" fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="148" cy="86" rx="52" ry="8" fill="${dk}"/>
      </g>`;
    },
  },
  {
    id: 'hat-fedora',
    name: '페도라',
    thumbnail: '🤠',
    svgFragment: (color = '#92400e') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-hat hat-fedora">
        <path d="M80 82 Q82 44 120 40 Q158 44 160 82 Z" fill="${color}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="120" cy="84" rx="70" ry="9" fill="${dk}"/>
        <path d="M90 48 Q120 38 150 48" fill="none" stroke="${dk}" stroke-width="3" stroke-linecap="round"/>
      </g>`;
    },
  },
];

// ---------------------------------------------------------------------------
// GLASSES — style id prefix: glasses-
// ---------------------------------------------------------------------------
const GLASSES = [
  {
    id: 'glasses-round',
    name: '동그란',
    thumbnail: '👓',
    svgFragment: (color = '#000000') => `<g class="outfit-glasses glasses-round">
      <circle cx="104" cy="82" r="11" fill="#ffffff" fill-opacity="0.18" stroke="${color}" stroke-width="2.5"/>
      <circle cx="136" cy="82" r="11" fill="#ffffff" fill-opacity="0.18" stroke="${color}" stroke-width="2.5"/>
      <line x1="115" y1="82" x2="125" y2="82" stroke="${color}" stroke-width="2.5"/>
      <line x1="93"  y1="80" x2="72"  y2="82" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="147" y1="80" x2="168" y2="82" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: 'glasses-square',
    name: '뿔테',
    thumbnail: '🕶️',
    svgFragment: (color = '#1f2937') => `<g class="outfit-glasses glasses-square">
      <rect x="92" y="74" width="24" height="18" rx="2" fill="#ffffff" fill-opacity="0.16" stroke="${color}" stroke-width="3"/>
      <rect x="124" y="74" width="24" height="18" rx="2" fill="#ffffff" fill-opacity="0.16" stroke="${color}" stroke-width="3"/>
      <line x1="116" y1="83" x2="124" y2="83" stroke="${color}" stroke-width="3"/>
      <line x1="92"  y1="80" x2="72"  y2="82" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="148" y1="80" x2="168" y2="82" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: 'glasses-sun',
    name: '선글라스',
    thumbnail: '😎',
    svgFragment: (color = '#374151') => `<g class="outfit-glasses glasses-sun">
      <circle cx="104" cy="82" r="12" fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="2"/>
      <circle cx="136" cy="82" r="12" fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="2"/>
      <line x1="116" y1="82" x2="124" y2="82" stroke="${color}" stroke-width="2.5"/>
      <line x1="92"  y1="79" x2="70"  y2="81" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="148" y1="79" x2="170" y2="81" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: 'glasses-cat',
    name: '캣아이',
    thumbnail: '🐱',
    svgFragment: (color = '#a855f7') => `<g class="outfit-glasses glasses-cat">
      <path d="M92 86 Q98 72 116 74 Q126 76 116 88 Z" fill="#ffffff" fill-opacity="0.18" stroke="${color}" stroke-width="2.5"/>
      <path d="M124 86 Q132 72 148 74 Q158 76 148 88 Z" fill="#ffffff" fill-opacity="0.18" stroke="${color}" stroke-width="2.5"/>
      <line x1="116" y1="82" x2="124" y2="82" stroke="${color}" stroke-width="2.5"/>
      <line x1="92"  y1="84" x2="70"  y2="80" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="148" y1="84" x2="170" y2="80" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: 'glasses-heart',
    name: '하트',
    thumbnail: '❤️',
    svgFragment: (color = '#ef4444') => `<g class="outfit-glasses glasses-heart">
      <path d="M104 84 Q96 76 98 82 Q100 90 104 92 Q108 90 110 82 Q112 76 104 84 Z" fill="${color}" opacity="0.7"/>
      <path d="M136 84 Q128 76 130 82 Q132 90 136 92 Q140 90 142 82 Q144 76 136 84 Z" fill="${color}" opacity="0.7"/>
      <line x1="114" y1="82" x2="126" y2="82" stroke="${color}" stroke-width="2"/>
      <line x1="96"  y1="80" x2="76"  y2="80" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <line x1="144" y1="80" x2="164" y2="80" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: 'glasses-mono',
    name: '모노클',
    thumbnail: '🧐',
    svgFragment: (color = '#92400e') => `<g class="outfit-glasses glasses-mono">
      <circle cx="136" cy="82" r="12" fill="#ffffff" fill-opacity="0.14" stroke="${color}" stroke-width="2.5"/>
      <line x1="148" y1="82" x2="168" y2="86" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: 'glasses-oval',
    name: '오벌',
    thumbnail: '🔍',
    svgFragment: (color = '#0ea5e9') => `<g class="outfit-glasses glasses-oval">
      <ellipse cx="104" cy="82" rx="13" ry="9" fill="#ffffff" fill-opacity="0.16" stroke="${color}" stroke-width="2.5"/>
      <ellipse cx="136" cy="82" rx="13" ry="9" fill="#ffffff" fill-opacity="0.16" stroke="${color}" stroke-width="2.5"/>
      <line x1="117" y1="82" x2="123" y2="82" stroke="${color}" stroke-width="2.5"/>
      <line x1="91"  y1="80" x2="70"  y2="82" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="149" y1="80" x2="170" y2="82" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`,
  },
];

// ---------------------------------------------------------------------------
// OTHER (귀걸이/기타 악세사리) — style id prefix: earring-
// ---------------------------------------------------------------------------
const OTHER = [
  {
    id: 'earring-stud',
    name: '스터드',
    thumbnail: '💎',
    svgFragment: (color = '#fcd34d') => {
      const dk = shade(color, 0.4);
      return `<g class="outfit-other earring-stud">
        <circle cx="58"  cy="92" r="4" fill="${color}" stroke="${dk}" stroke-width="1.5"/>
        <circle cx="182" cy="92" r="4" fill="${color}" stroke="${dk}" stroke-width="1.5"/>
      </g>`;
    },
  },
  {
    id: 'earring-hoop',
    name: '링',
    thumbnail: '⭕',
    svgFragment: (color = '#fcd34d') => `<g class="outfit-other earring-hoop">
      <circle cx="58"  cy="96" r="7" fill="none" stroke="${color}" stroke-width="2.5"/>
      <circle cx="182" cy="96" r="7" fill="none" stroke="${color}" stroke-width="2.5"/>
    </g>`,
  },
  {
    id: 'earring-drop',
    name: '드롭',
    thumbnail: '💧',
    svgFragment: (color = '#a78bfa') => {
      const dk = shade(color, 0.3);
      return `<g class="outfit-other earring-drop">
        <circle cx="58"  cy="88" r="2.5" fill="${dk}"/>
        <ellipse cx="58"  cy="98" rx="4" ry="6" fill="${color}"/>
        <circle cx="182" cy="88" r="2.5" fill="${dk}"/>
        <ellipse cx="182" cy="98" rx="4" ry="6" fill="${color}"/>
      </g>`;
    },
  },
  {
    id: 'earring-star',
    name: '별',
    thumbnail: '⭐',
    svgFragment: (color = '#fbbf24') => `<g class="outfit-other earring-star">
      <text x="58"  y="98" text-anchor="middle" font-size="12" fill="${color}">★</text>
      <text x="182" y="98" text-anchor="middle" font-size="12" fill="${color}">★</text>
    </g>`,
  },
  {
    id: 'earring-cross',
    name: '십자가',
    thumbnail: '✝️',
    svgFragment: (color = '#9ca3af') => `<g class="outfit-other earring-cross">
      <line x1="58" y1="88" x2="58" y2="102" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="53" y1="92" x2="63" y2="92" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="182" y1="88" x2="182" y2="102" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="177" y1="92" x2="187" y2="92" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: 'earring-pearl',
    name: '진주',
    thumbnail: '🤍',
    svgFragment: (color = '#f1f5f9') => {
      const dk = shade(color, 0.15);
      return `<g class="outfit-other earring-pearl">
        <circle cx="58"  cy="92" r="5" fill="${color}" stroke="${dk}" stroke-width="1.5"/>
        <circle cx="182" cy="92" r="5" fill="${color}" stroke="${dk}" stroke-width="1.5"/>
      </g>`;
    },
  },
  {
    id: 'earring-feather',
    name: '깃털',
    thumbnail: '🪶',
    svgFragment: (color = '#86efac') => `<g class="outfit-other earring-feather">
      <path d="M58 88 C54 94 52 100 56 106 C60 102 62 96 58 88 Z" fill="${color}"/>
      <path d="M182 88 C178 94 176 100 180 106 C184 102 186 96 182 88 Z" fill="${color}"/>
    </g>`,
  },
];

// ---------------------------------------------------------------------------
// Catalog map
// ---------------------------------------------------------------------------
export const CATALOG = {
  hair:    HAIR,
  top:     TOPS,
  bottom:  BOTTOMS,
  hat:     HATS,
  glasses: GLASSES,
  other:   OTHER,
};

const _byId = new Map([
  ...HAIR,
  ...TOPS,
  ...BOTTOMS,
  ...HATS,
  ...GLASSES,
  ...OTHER,
].map((o) => [o.id, o]));

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
