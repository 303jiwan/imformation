import"./modulepreload-polyfill-B5Qt9EMX.js";import"./main-Cptly1tc.js";function a(t,e=.25){if(typeof t!="string"||!t.startsWith("#"))return t;let r=t.length===4?"#"+t.slice(1).split("").map(l=>l+l).join(""):t;const s=parseInt(r.slice(1,3),16),o=parseInt(r.slice(3,5),16),n=parseInt(r.slice(5,7),16),c=Math.max(0,Math.min(1,1-e));return"#"+[s,o,n].map(l=>Math.round(l*c).toString(16).padStart(2,"0")).join("")}const H=[{id:"hair-short",name:"짧은",thumbnail:"✂️",svgFragment:(t="#1f2937")=>{const e=a(t,.3);return`<g class="outfit-hair hair-short">
        <path d="M60 78 Q62 30 120 26 Q178 30 180 78 Q170 58 155 54 Q138 62 120 58 Q102 62 86 58 Q72 58 60 78 Z" fill="${t}"/>
        <path d="M82 56 Q102 36 152 40 Q140 56 120 58 Q100 58 82 56 Z" fill="${e}"/>
      </g>`}},{id:"hair-long",name:"긴",thumbnail:"💇",svgFragment:(t="#5b3a1d")=>{const e=a(t,.25);return`<g class="outfit-hair hair-long">
        <path d="M58 84 Q56 28 120 22 Q184 28 182 84 L186 180 L174 184 L172 140 L172 86 Q158 64 120 60 Q82 64 68 86 L68 140 L56 184 L44 180 Z" fill="${t}"/>
        <path d="M82 58 Q100 36 152 40 Q140 56 120 60 Q100 60 82 58 Z" fill="${e}"/>
      </g>`}},{id:"hair-curly",name:"곱슬",thumbnail:"🌀",svgFragment:(t="#8b5e34")=>`<g class="outfit-hair hair-curly">
      <circle cx="62"  cy="55" r="20" fill="${t}"/>
      <circle cx="88"  cy="38" r="23" fill="${t}"/>
      <circle cx="120" cy="30" r="25" fill="${t}"/>
      <circle cx="152" cy="38" r="23" fill="${t}"/>
      <circle cx="178" cy="55" r="20" fill="${t}"/>
      <circle cx="58"  cy="80" r="16" fill="${t}"/>
      <circle cx="182" cy="80" r="16" fill="${t}"/>
    </g>`},{id:"hair-ponytail",name:"포니테일",thumbnail:"🎀",svgFragment:(t="#c9a47a")=>{const e=a(t,.2);return`<g class="outfit-hair hair-ponytail">
        <path d="M62 80 Q64 30 120 24 Q178 30 178 78 Q168 58 152 54 Q136 62 120 58 Q104 62 88 58 Q74 56 62 80 Z" fill="${t}"/>
        <ellipse cx="185" cy="108" rx="13" ry="32" fill="${t}" stroke="${e}" stroke-width="1.5"/>
      </g>`}},{id:"hair-bun",name:"번 헤어",thumbnail:"👩",svgFragment:(t="#92400e")=>{const e=a(t,.3);return`<g class="outfit-hair hair-bun">
        <path d="M62 80 Q64 30 120 24 Q178 30 178 78 Q168 58 152 54 Q136 62 120 58 Q104 62 88 58 Q74 56 62 80 Z" fill="${t}"/>
        <circle cx="120" cy="24" r="18" fill="${t}" stroke="${e}" stroke-width="2"/>
      </g>`}},{id:"hair-wavy",name:"웨이브",thumbnail:"〰️",svgFragment:(t="#d4a26a")=>{const e=a(t,.2);return`<g class="outfit-hair hair-wavy">
        <path d="M60 80 Q62 30 120 24 Q178 30 180 80 Q165 55 150 58 Q135 68 120 60 Q105 68 90 58 Q74 55 60 80 Z" fill="${t}"/>
        <path d="M54 100 Q62 84 72 94 Q82 104 92 90 Q102 76 112 90 Q122 104 132 90 Q142 76 152 90 Q162 104 172 90 Q182 76 186 100" stroke="${e}" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>`}},{id:"hair-buzz",name:"버즈컷",thumbnail:"🪒",svgFragment:(t="#374151")=>`<g class="outfit-hair hair-buzz">
      <path d="M62 82 Q64 38 120 34 Q176 38 178 82 Q178 62 120 58 Q62 62 62 82 Z" fill="${t}"/>
    </g>`}],q=[{id:"top-tee",name:"티셔츠",thumbnail:"👕",svgFragment:(t="#2563eb")=>{const e=a(t,.2);return`<g class="outfit-top top-tee">
        <path d="M52 138 C62 122 86 118 120 118 C154 118 178 122 188 138 L188 158 C182 165 174 178 174 182 L174 214 L66 214 L66 182 C62 172 56 162 52 158 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M66 142 Q120 158 174 142" fill="none" stroke="${e}" stroke-width="1.5"/>
      </g>`}},{id:"top-hoodie",name:"후드티",thumbnail:"🧥",svgFragment:(t="#a855f7")=>{const e=a(t,.25);return`<g class="outfit-top top-hoodie">
        <path d="M56 138 C68 120 86 116 120 116 C154 116 172 120 184 138 L190 158 C186 168 180 180 178 184 L178 214 L62 214 L62 184 C60 176 54 162 56 158 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M62 142 Q120 158 178 142" fill="none" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
        <path d="M78 182 L162 182 L158 206 L82 206 Z" fill="none" stroke="${e}" stroke-width="2"/>
        <line x1="84" y1="152" x2="84" y2="180" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
        <line x1="156" y1="152" x2="156" y2="180" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
      </g>`}},{id:"top-shirt",name:"셔츠",thumbnail:"👔",svgFragment:(t="#f8fafc")=>{const e=a(t,.22);return`<g class="outfit-top top-shirt">
        <path d="M52 138 C62 122 86 118 120 118 C154 118 178 122 188 138 L188 158 C182 165 174 178 174 182 L174 214 L66 214 L66 182 C62 172 56 162 52 158 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M102 138 L120 158 L138 138 L130 133 L120 145 L110 133 Z" fill="${e}"/>
        <line x1="120" y1="160" x2="120" y2="210" stroke="${e}" stroke-width="1.5"/>
        <circle cx="120" cy="173" r="1.5" fill="${e}"/>
        <circle cx="120" cy="187" r="1.5" fill="${e}"/>
        <circle cx="120" cy="201" r="1.5" fill="${e}"/>
      </g>`}},{id:"top-tank",name:"민소매",thumbnail:"🎽",svgFragment:(t="#10b981")=>{const e=a(t,.2);return`<g class="outfit-top top-tank">
        <path d="M76 136 C82 120 96 118 120 118 C144 118 158 120 164 136 L166 214 L74 214 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M74 214 L74 140 C64 138 54 148 52 158 L52 174 Z" fill="${t}" stroke="${e}" stroke-width="2"/>
        <path d="M166 214 L166 140 C176 138 186 148 188 158 L188 174 Z" fill="${t}" stroke="${e}" stroke-width="2"/>
      </g>`}},{id:"top-jacket",name:"재킷",thumbnail:"🧣",svgFragment:(t="#1e3a8a")=>{const e=a(t,.28),r=a(t,-.2);return`<g class="outfit-top top-jacket">
        <path d="M52 138 C64 120 86 116 120 116 C154 116 176 120 188 138 L192 162 C186 172 178 184 176 188 L176 214 L64 214 L64 188 C62 180 54 168 48 162 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M102 118 L120 148 L138 118 L128 112 L120 126 L112 112 Z" fill="${e}"/>
        <line x1="120" y1="148" x2="120" y2="212" stroke="${e}" stroke-width="3"/>
        <rect x="60" y="168" width="14" height="10" rx="2" fill="${r}"/>
      </g>`}},{id:"top-stripe",name:"스트라이프",thumbnail:"🧵",svgFragment:(t="#ef4444")=>{const e=a(t,.2);return`<g class="outfit-top top-stripe">
        <path d="M52 138 C62 122 86 118 120 118 C154 118 178 122 188 138 L188 158 C182 165 174 178 174 182 L174 214 L66 214 L66 182 C62 172 56 162 52 158 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <line x1="66" y1="152" x2="174" y2="152" stroke="${e}" stroke-width="4"/>
        <line x1="64" y1="164" x2="174" y2="164" stroke="${e}" stroke-width="4"/>
        <line x1="64" y1="176" x2="174" y2="176" stroke="${e}" stroke-width="4"/>
      </g>`}},{id:"top-polo",name:"폴로",thumbnail:"🏌️",svgFragment:(t="#0ea5e9")=>{const e=a(t,.22);return`<g class="outfit-top top-polo">
        <path d="M52 138 C62 122 86 118 120 118 C154 118 178 122 188 138 L188 158 C182 165 174 178 174 182 L174 214 L66 214 L66 182 C62 172 56 162 52 158 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M108 118 L112 136 L120 130 L128 136 L132 118 Q120 108 108 118 Z" fill="${e}"/>
        <line x1="120" y1="134" x2="120" y2="155" stroke="${e}" stroke-width="2"/>
        <circle cx="120" cy="159" r="2" fill="${e}"/>
        <circle cx="120" cy="168" r="2" fill="${e}"/>
      </g>`}}],R=[{id:"bot-jeans",name:"청바지",thumbnail:"👖",svgFragment:(t="#1f2937")=>{const e=a(t,.3);return`<g class="outfit-bottom bot-jeans">
        <path d="M66 213 L174 213 L176 234 L148 300 L138 300 L120 238 L120 235 L112 238 L102 300 L92 300 L64 234 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="7" fill="${e}"/>
        <line x1="120" y1="220" x2="120" y2="237" stroke="${e}" stroke-width="1.5"/>
        <line x1="104" y1="241" x2="100" y2="296" stroke="#fbbf24" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="136" y1="241" x2="140" y2="296" stroke="#fbbf24" stroke-width="1" stroke-dasharray="2 2"/>
      </g>`}},{id:"bot-shorts",name:"반바지",thumbnail:"🩳",svgFragment:(t="#22c55e")=>{const e=a(t,.3);return`<g class="outfit-bottom bot-shorts">
        <path d="M66 213 L174 213 L174 234 L148 270 L138 270 L120 238 L120 235 L112 238 L102 270 L92 270 L66 234 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="6" fill="${e}"/>
        <line x1="120" y1="219" x2="120" y2="237" stroke="${e}" stroke-width="1.5"/>
      </g>`}},{id:"bot-slacks",name:"슬랙스",thumbnail:"👔",svgFragment:(t="#374151")=>{const e=a(t,.32);return`<g class="outfit-bottom bot-slacks">
        <path d="M66 213 L174 213 L176 234 L148 300 L138 300 L120 238 L120 235 L112 238 L102 300 L92 300 L64 234 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="6" fill="${e}"/>
        <line x1="104" y1="243" x2="100" y2="296" stroke="${e}" stroke-width="1"/>
        <line x1="136" y1="243" x2="140" y2="296" stroke="${e}" stroke-width="1"/>
      </g>`}},{id:"bot-skirt",name:"스커트",thumbnail:"👗",svgFragment:(t="#f9a8d4")=>{const e=a(t,.2);return`<g class="outfit-bottom bot-skirt">
        <path d="M68 213 L172 213 L182 300 L58 300 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="68" y="213" width="104" height="6" fill="${e}"/>
      </g>`}},{id:"bot-cargo",name:"카고팬츠",thumbnail:"🪖",svgFragment:(t="#78716c")=>{const e=a(t,.28);return`<g class="outfit-bottom bot-cargo">
        <path d="M66 213 L174 213 L176 234 L148 300 L138 300 L120 238 L120 235 L112 238 L102 300 L92 300 L64 234 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="6" fill="${e}"/>
        <rect x="72" y="236" width="18" height="12" rx="2" fill="${e}"/>
        <rect x="150" y="236" width="18" height="12" rx="2" fill="${e}"/>
      </g>`}},{id:"bot-leggings",name:"레깅스",thumbnail:"🩲",svgFragment:(t="#1e1b4b")=>{const e=a(t,.3);return`<g class="outfit-bottom bot-leggings">
        <path d="M78 213 L162 213 L164 234 L145 300 L135 300 L120 240 L120 237 L116 240 L105 300 L95 300 L76 234 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
      </g>`}},{id:"bot-jogger",name:"조거팬츠",thumbnail:"🧶",svgFragment:(t="#6b7280")=>{const e=a(t,.25);return`<g class="outfit-bottom bot-jogger">
        <path d="M66 213 L174 213 L176 234 L150 295 L140 295 L120 238 L120 235 L112 238 L90 295 L80 295 L64 234 Z" fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <rect x="66" y="213" width="108" height="6" fill="${e}"/>
        <ellipse cx="105" cy="297" rx="18" ry="4" fill="${e}"/>
        <ellipse cx="135" cy="297" rx="18" ry="4" fill="${e}"/>
      </g>`}}],G=[{id:"hat-cap",name:"야구모자",thumbnail:"🧢",svgFragment:(t="#1f2937")=>{const e=a(t,.3);return`<g class="outfit-hat hat-cap">
        <path d="M60 82 Q62 42 120 38 Q178 42 180 82 Z" fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="148" cy="88" rx="52" ry="8" fill="${e}"/>
        <text x="120" y="72" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="800" fill="#ffffff">C</text>
      </g>`}},{id:"hat-beanie",name:"비니",thumbnail:"🎩",svgFragment:(t="#a855f7")=>{const e=a(t,.3);return`<g class="outfit-hat hat-beanie">
        <path d="M62 84 Q64 38 120 34 Q176 38 178 84 Z" fill="${t}" stroke="${e}" stroke-width="2"/>
        <rect x="58" y="78" width="124" height="14" rx="6" fill="${e}"/>
        <circle cx="120" cy="32" r="10" fill="#fde68a" stroke="#f59e0b" stroke-width="1.5"/>
      </g>`}},{id:"hat-beret",name:"베레모",thumbnail:"🎭",svgFragment:(t="#dc2626")=>{const e=a(t,.35);return`<g class="outfit-hat hat-beret">
        <ellipse cx="120" cy="58" rx="64" ry="30" fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="120" cy="76" rx="46" ry="7" fill="${e}"/>
        <circle cx="150" cy="34" r="6" fill="${e}"/>
      </g>`}},{id:"hat-tophat",name:"탑햇",thumbnail:"🎩",svgFragment:(t="#111827")=>{const e=a(t,.5);return`<g class="outfit-hat hat-tophat">
        <rect x="88" y="22" width="64" height="60" rx="4" fill="${t}" stroke="${e}" stroke-width="2"/>
        <rect x="62" y="78" width="116" height="10" rx="4" fill="${e}"/>
      </g>`}},{id:"hat-bucket",name:"버킷햇",thumbnail:"👒",svgFragment:(t="#fbbf24")=>{const e=a(t,.25);return`<g class="outfit-hat hat-bucket">
        <path d="M78 82 Q80 46 120 42 Q160 46 162 82 Z" fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="120" cy="84" rx="68" ry="10" fill="${e}"/>
      </g>`}},{id:"hat-visor",name:"바이저",thumbnail:"🏄",svgFragment:(t="#10b981")=>{const e=a(t,.28);return`<g class="outfit-hat hat-visor">
        <rect x="58" y="70" width="124" height="14" rx="6" fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="148" cy="86" rx="52" ry="8" fill="${e}"/>
      </g>`}},{id:"hat-fedora",name:"페도라",thumbnail:"🤠",svgFragment:(t="#92400e")=>{const e=a(t,.3);return`<g class="outfit-hat hat-fedora">
        <path d="M80 82 Q82 44 120 40 Q158 44 160 82 Z" fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="120" cy="84" rx="70" ry="9" fill="${e}"/>
        <path d="M90 48 Q120 38 150 48" fill="none" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
      </g>`}}],z=[{id:"glasses-round",name:"동그란",thumbnail:"👓",svgFragment:(t="#000000")=>`<g class="outfit-glasses glasses-round">
      <circle cx="104" cy="82" r="11" fill="#ffffff" fill-opacity="0.18" stroke="${t}" stroke-width="2.5"/>
      <circle cx="136" cy="82" r="11" fill="#ffffff" fill-opacity="0.18" stroke="${t}" stroke-width="2.5"/>
      <line x1="115" y1="82" x2="125" y2="82" stroke="${t}" stroke-width="2.5"/>
      <line x1="93"  y1="80" x2="72"  y2="82" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="147" y1="80" x2="168" y2="82" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`},{id:"glasses-square",name:"뿔테",thumbnail:"🕶️",svgFragment:(t="#1f2937")=>`<g class="outfit-glasses glasses-square">
      <rect x="92" y="74" width="24" height="18" rx="2" fill="#ffffff" fill-opacity="0.16" stroke="${t}" stroke-width="3"/>
      <rect x="124" y="74" width="24" height="18" rx="2" fill="#ffffff" fill-opacity="0.16" stroke="${t}" stroke-width="3"/>
      <line x1="116" y1="83" x2="124" y2="83" stroke="${t}" stroke-width="3"/>
      <line x1="92"  y1="80" x2="72"  y2="82" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="148" y1="80" x2="168" y2="82" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`},{id:"glasses-sun",name:"선글라스",thumbnail:"😎",svgFragment:(t="#374151")=>`<g class="outfit-glasses glasses-sun">
      <circle cx="104" cy="82" r="12" fill="${t}" fill-opacity="0.85" stroke="${t}" stroke-width="2"/>
      <circle cx="136" cy="82" r="12" fill="${t}" fill-opacity="0.85" stroke="${t}" stroke-width="2"/>
      <line x1="116" y1="82" x2="124" y2="82" stroke="${t}" stroke-width="2.5"/>
      <line x1="92"  y1="79" x2="70"  y2="81" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="148" y1="79" x2="170" y2="81" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`},{id:"glasses-cat",name:"캣아이",thumbnail:"🐱",svgFragment:(t="#a855f7")=>`<g class="outfit-glasses glasses-cat">
      <path d="M92 86 Q98 72 116 74 Q126 76 116 88 Z" fill="#ffffff" fill-opacity="0.18" stroke="${t}" stroke-width="2.5"/>
      <path d="M124 86 Q132 72 148 74 Q158 76 148 88 Z" fill="#ffffff" fill-opacity="0.18" stroke="${t}" stroke-width="2.5"/>
      <line x1="116" y1="82" x2="124" y2="82" stroke="${t}" stroke-width="2.5"/>
      <line x1="92"  y1="84" x2="70"  y2="80" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="148" y1="84" x2="170" y2="80" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`},{id:"glasses-heart",name:"하트",thumbnail:"❤️",svgFragment:(t="#ef4444")=>`<g class="outfit-glasses glasses-heart">
      <path d="M104 84 Q96 76 98 82 Q100 90 104 92 Q108 90 110 82 Q112 76 104 84 Z" fill="${t}" opacity="0.7"/>
      <path d="M136 84 Q128 76 130 82 Q132 90 136 92 Q140 90 142 82 Q144 76 136 84 Z" fill="${t}" opacity="0.7"/>
      <line x1="114" y1="82" x2="126" y2="82" stroke="${t}" stroke-width="2"/>
      <line x1="96"  y1="80" x2="76"  y2="80" stroke="${t}" stroke-width="2" stroke-linecap="round"/>
      <line x1="144" y1="80" x2="164" y2="80" stroke="${t}" stroke-width="2" stroke-linecap="round"/>
    </g>`},{id:"glasses-mono",name:"모노클",thumbnail:"🧐",svgFragment:(t="#92400e")=>`<g class="outfit-glasses glasses-mono">
      <circle cx="136" cy="82" r="12" fill="#ffffff" fill-opacity="0.14" stroke="${t}" stroke-width="2.5"/>
      <line x1="148" y1="82" x2="168" y2="86" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`},{id:"glasses-oval",name:"오벌",thumbnail:"🔍",svgFragment:(t="#0ea5e9")=>`<g class="outfit-glasses glasses-oval">
      <ellipse cx="104" cy="82" rx="13" ry="9" fill="#ffffff" fill-opacity="0.16" stroke="${t}" stroke-width="2.5"/>
      <ellipse cx="136" cy="82" rx="13" ry="9" fill="#ffffff" fill-opacity="0.16" stroke="${t}" stroke-width="2.5"/>
      <line x1="117" y1="82" x2="123" y2="82" stroke="${t}" stroke-width="2.5"/>
      <line x1="91"  y1="80" x2="70"  y2="82" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="149" y1="80" x2="170" y2="82" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`}],J=[{id:"earring-stud",name:"스터드",thumbnail:"💎",svgFragment:(t="#fcd34d")=>{const e=a(t,.4);return`<g class="outfit-other earring-stud">
        <circle cx="58"  cy="92" r="4" fill="${t}" stroke="${e}" stroke-width="1.5"/>
        <circle cx="182" cy="92" r="4" fill="${t}" stroke="${e}" stroke-width="1.5"/>
      </g>`}},{id:"earring-hoop",name:"링",thumbnail:"⭕",svgFragment:(t="#fcd34d")=>`<g class="outfit-other earring-hoop">
      <circle cx="58"  cy="96" r="7" fill="none" stroke="${t}" stroke-width="2.5"/>
      <circle cx="182" cy="96" r="7" fill="none" stroke="${t}" stroke-width="2.5"/>
    </g>`},{id:"earring-drop",name:"드롭",thumbnail:"💧",svgFragment:(t="#a78bfa")=>{const e=a(t,.3);return`<g class="outfit-other earring-drop">
        <circle cx="58"  cy="88" r="2.5" fill="${e}"/>
        <ellipse cx="58"  cy="98" rx="4" ry="6" fill="${t}"/>
        <circle cx="182" cy="88" r="2.5" fill="${e}"/>
        <ellipse cx="182" cy="98" rx="4" ry="6" fill="${t}"/>
      </g>`}},{id:"earring-star",name:"별",thumbnail:"⭐",svgFragment:(t="#fbbf24")=>`<g class="outfit-other earring-star">
      <text x="58"  y="98" text-anchor="middle" font-size="12" fill="${t}">★</text>
      <text x="182" y="98" text-anchor="middle" font-size="12" fill="${t}">★</text>
    </g>`},{id:"earring-cross",name:"십자가",thumbnail:"✝️",svgFragment:(t="#9ca3af")=>`<g class="outfit-other earring-cross">
      <line x1="58" y1="88" x2="58" y2="102" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="53" y1="92" x2="63" y2="92" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="182" y1="88" x2="182" y2="102" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="177" y1="92" x2="187" y2="92" stroke="${t}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`},{id:"earring-pearl",name:"진주",thumbnail:"🤍",svgFragment:(t="#f1f5f9")=>{const e=a(t,.15);return`<g class="outfit-other earring-pearl">
        <circle cx="58"  cy="92" r="5" fill="${t}" stroke="${e}" stroke-width="1.5"/>
        <circle cx="182" cy="92" r="5" fill="${t}" stroke="${e}" stroke-width="1.5"/>
      </g>`}},{id:"earring-feather",name:"깃털",thumbnail:"🪶",svgFragment:(t="#86efac")=>`<g class="outfit-other earring-feather">
      <path d="M58 88 C54 94 52 100 56 106 C60 102 62 96 58 88 Z" fill="${t}"/>
      <path d="M182 88 C178 94 176 100 180 106 C184 102 186 96 182 88 Z" fill="${t}"/>
    </g>`}],tt={hair:H,top:q,bottom:R,hat:G,glasses:z,other:J},et=new Map([...H,...q,...R,...G,...z,...J].map(t=>[t.id,t]));function rt(t){return tt[t]||[]}function it(t){return t==null?null:et.get(t)||null}function st(t,e){if(!t)return"";const r=t.svgFragment;return typeof r=="function"?r(e):typeof r=="string"?r:""}const m=[{id:"tone-1",label:"가장 밝은",base:"#fff5d6",shadow:"#fce8a4"},{id:"tone-2",label:"밝은 톤",base:"#fde68a",shadow:"#fbbf24"},{id:"tone-3",label:"중간 톤",base:"#f4c084",shadow:"#d97706"},{id:"tone-4",label:"구릿빛 톤",base:"#c89878",shadow:"#92622f"},{id:"tone-5",label:"어두운 톤",base:"#8b5a3c",shadow:"#5a3a25"},{id:"tone-6",label:"가장 어두운",base:"#5a3a25",shadow:"#3a2415"}];function ot(t){return m.find(e=>e.id===t)||m.find(e=>e.id==="tone-2")||m[0]}const g={body:{skinTone:"tone-2",hair:{style:"hair-short",color:"#1f2937"}},clothing:{top:{style:"top-tee",color:"#2563eb"},bottom:{style:"bot-jeans",color:"#1f2937"}},accessories:{hat:null,glasses:null,other:null}};function j(t){if(!t||typeof t!="object")return JSON.parse(JSON.stringify(g));const e=g,r=t.body&&typeof t.body=="object"?t.body:{},s=m.some(d=>d.id===r.skinTone)?r.skinTone:e.body.skinTone,o=r.hair&&typeof r.hair=="object"?r.hair:{},n=typeof o.style=="string"&&o.style?o.style:e.body.hair.style,c=typeof o.color=="string"&&o.color?o.color:e.body.hair.color,l=t.clothing&&typeof t.clothing=="object"?t.clothing:{},f=l.top&&typeof l.top=="object"?l.top:{},v=typeof f.style=="string"&&f.style?f.style:e.clothing.top.style,L=typeof f.color=="string"&&f.color?f.color:e.clothing.top.color,h=l.bottom&&typeof l.bottom=="object"?l.bottom:{},V=typeof h.style=="string"&&h.style?h.style:e.clothing.bottom.style,X=typeof h.color=="string"&&h.color?h.color:e.clothing.bottom.color,C=t.accessories&&typeof t.accessories=="object"&&!Array.isArray(t.accessories)?t.accessories:{};function Q(d){return!d||typeof d!="object"||typeof d.style!="string"||!d.style?null:{style:d.style,color:typeof d.color=="string"?d.color:"#000000"}}return{body:{skinTone:s,hair:{style:n,color:c}},clothing:{top:{style:v,color:L},bottom:{style:V,color:X}},accessories:{hat:Q(C.hat),glasses:Q(C.glasses),other:Q(C.other)}}}const at=(t,e)=>`
  <g class="char-legs">
    <rect x="98"  y="212" width="17" height="88" rx="8"  fill="${t}" stroke="${e}" stroke-width="1.5"/>
    <rect x="125" y="212" width="17" height="88" rx="8"  fill="${t}" stroke="${e}" stroke-width="1.5"/>
    <ellipse cx="106" cy="302" rx="14" ry="6" fill="#1f2937"/>
    <ellipse cx="133" cy="302" rx="14" ry="6" fill="#1f2937"/>
  </g>
`,nt=(t,e)=>`
  <g class="char-body">
    <rect x="109" y="126" width="22" height="17" rx="5" fill="${t}" stroke="${e}" stroke-width="1.5"/>
    <path d="M72 140 Q72 134 80 132 L160 132 Q168 134 168 140 L170 213 L70 213 Z"
          fill="${t}" stroke="${e}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
`,lt=(t,e)=>`
  <g class="char-arms">
    <rect x="51" y="142" width="20" height="74" rx="10" fill="${t}" stroke="${e}" stroke-width="1.5"/>
    <rect x="169" y="142" width="20" height="74" rx="10" fill="${t}" stroke="${e}" stroke-width="1.5"/>
    <circle cx="61"  cy="220" r="10" fill="${t}" stroke="${e}" stroke-width="1.5"/>
    <circle cx="179" cy="220" r="10" fill="${t}" stroke="${e}" stroke-width="1.5"/>
  </g>
`,ct=(t,e)=>`
  <g class="char-head">
    <ellipse cx="60"  cy="86" rx="7"  ry="10" fill="${t}" stroke="${e}" stroke-width="1.5"/>
    <ellipse cx="180" cy="86" rx="7"  ry="10" fill="${t}" stroke="${e}" stroke-width="1.5"/>
    <circle  cx="120" cy="82" r="60"  fill="${t}" stroke="${e}" stroke-width="2"/>
  </g>
`,dt=`
  <g class="char-face char-face--default">
    <circle cx="104" cy="80" r="4"   fill="#1f2937"/>
    <circle cx="136" cy="80" r="4"   fill="#1f2937"/>
    <circle cx="105" cy="79" r="1.2" fill="#ffffff"/>
    <circle cx="137" cy="79" r="1.2" fill="#ffffff"/>
    <path d="M108 98 Q120 108 132 98" stroke="#1f2937" stroke-width="2.5"
          fill="none" stroke-linecap="round"/>
  </g>
`;function u(t,e){if(!t||!t.style)return"";const r=it(t.style);return r?st(r,t.color):""}function ft(t={}){const e=j(t),r=ot(e.body.skinTone),s=r.base,o=r.shadow,n=u(e.body.hair),c=u(e.clothing.top),l=u(e.clothing.bottom),f=u(e.accessories.hat),v=u(e.accessories.glasses),L=u(e.accessories.other);return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 320"
     class="codenergy-character"
     role="img" aria-label="Codenergy 아바타">
  ${at(s,o)}
  ${nt(s,o)}
  ${lt(s,o)}
  ${l}
  ${c}
  ${ct(s,o)}
  ${dt}
  ${L}
  ${n}
  ${v}
  ${f}
</svg>`.trim()}const S="http://localhost:3000",P="codenergy:avatar:config",ht="codenergy:avatar:equipped",ut="codenergy:auth:hint",D="codenergy:demo:user",x={body:{label:"신체",subs:[{id:"skin",label:"피부",hasColor:!1,allowNone:!1},{id:"hair",label:"머리",hasColor:!0,allowNone:!1}]},clothing:{label:"의상",subs:[{id:"top",label:"상의",hasColor:!0,allowNone:!1},{id:"bottom",label:"하의",hasColor:!0,allowNone:!1}]},accessories:{label:"악세사리",subs:[{id:"hat",label:"모자",hasColor:!0,allowNone:!0},{id:"glasses",label:"안경",hasColor:!0,allowNone:!0},{id:"other",label:"기타",hasColor:!0,allowNone:!0}]}},y={hair:["#1f2937","#5b3a1d","#8b5e34","#c9a47a","#e6b34a","#9ca3af","#ef4444","#a855f7","#22c55e"],top:["#ffffff","#1f2937","#a855f7","#3b82f6","#ef4444","#10b981","#fbbf24","#f97316","#22c55e"],bottom:["#1e3a8a","#374151","#3b82f6","#92400e","#ffffff","#000000","#a855f7","#ef4444","#10b981"],hat:["#1f2937","#404040","#cbd5e1","#3b82f6","#a855f7","#ef4444","#fbbf24","#92400e","#10b981"],glasses:["#000000","#374151","#92400e","#ef4444","#3b82f6","#a855f7","#10b981","#fbbf24","#9ca3af"],other:["#fcd34d","#9ca3af","#ef4444","#3b82f6","#a855f7","#10b981","#fbbf24","#f97316","#000000"]};function A(){return JSON.parse(JSON.stringify(g))}function gt(){try{localStorage.removeItem(ht)}catch{}try{const t=localStorage.getItem(P);return t?j(JSON.parse(t)):A()}catch{return A()}}function K(){try{localStorage.setItem(P,JSON.stringify(i))}catch{}}async function yt(){try{const t=await fetch(`${S}/api/avatar`,{method:"GET",credentials:"include"});if(!t.ok)return null;const e=await t.json().catch(()=>null);return e&&e.avatar?j(e.avatar):null}catch{return null}}async function kt(){const t=await fetch(`${S}/api/avatar`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({avatar:i})});if(!t.ok){let e="save failed";try{const r=await t.json();r&&r.error&&(e=r.error)}catch{}throw new Error(e)}return t.json().catch(()=>({ok:!0}))}function w(){try{const e=localStorage.getItem(ut);if(e==="logged-in")return!0;if(e==="logged-out")return!1;if(localStorage.getItem(D))return!0}catch{}const t=document.getElementById("my-wrap");return!!(t&&!t.hidden)}const F=document.getElementById("avatar-root");let i=gt(),k="body",p="skin",M=null;function mt(){F.innerHTML="",sessionStorage.setItem("codenergy:redirectAfterLogin","avatar.html");function t(){const r=document.getElementById("auth-modal");if(!r||!r.hidden)return;const s=document.getElementById("login-btn");s&&s.click(),r.hidden&&(r.hidden=!1)}t();const e=document.getElementById("auth-modal");if(e){const r=new MutationObserver(()=>{e.hidden&&(r.disconnect(),w()?B():location.replace("index.html"))});r.observe(e,{attributes:!0,attributeFilter:["hidden"]})}}function pt(){F.innerHTML=`
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
  `,Z(),U(),T(),b(),$(),_t(),F.addEventListener("click",bt)}function bt(t){const e=t.target.closest("[data-action]");if(e){if(e.dataset.action==="back"){Ft();return}if(e.dataset.action==="finish"){Tt();return}}const r=t.target.closest(".avatar-tab[data-primary]");if(r){k=r.dataset.primary,p=x[k].subs[0].id,U(),T(),b(),$();return}const s=t.target.closest(".avatar-tab[data-secondary]");if(s){p=s.dataset.secondary,T(),b(),$();return}const o=t.target.closest(".avatar-item[data-id]");if(o){const c=o.dataset.id;Mt(c);return}const n=t.target.closest(".avatar-color-chip[data-color]");if(n){Qt(p,n.dataset.color),Y();return}}function Z(){const t=document.getElementById("avatar-character");t&&(t.innerHTML=ft(i))}function U(){const t=document.getElementById("avatar-primary");t&&(t.innerHTML=Object.entries(x).map(([e,r])=>`
    <button type="button"
            class="avatar-tab${e===k?" is-active":""}"
            data-primary="${e}">${r.label}</button>
  `).join(""))}function T(){const t=document.getElementById("avatar-secondary");if(!t)return;const e=x[k].subs;t.innerHTML=e.map(r=>`
    <button type="button"
            class="avatar-tab${r.id===p?" is-active":""}"
            data-secondary="${r.id}">${r.label}</button>
  `).join("")}function I(){const t=x[k].subs;return t.find(e=>e.id===p)||t[0]}function b(){const t=document.getElementById("avatar-grid");if(!t)return;const e=I(),r=[];if(e.id==="skin")m.forEach(s=>{const o=i.body.skinTone===s.id;r.push(`
        <button type="button"
                class="avatar-item avatar-item--skin${o?" is-equipped":""}"
                data-id="${s.id}">
          <span class="avatar-item__thumb">
            <span class="avatar-item__thumb-skin" style="background-color:${s.base};"></span>
          </span>
          <span>${s.label}</span>
        </button>
      `)});else{if(e.allowNone){const n=_(e.id)==null;r.push(`
        <button type="button"
                class="avatar-item avatar-item--none${n?" is-equipped":""}"
                data-id="__none__">
          <span class="avatar-item__thumb">✕</span>
          <span>없음</span>
        </button>
      `)}const s=rt(e.id),o=_(e.id);s.forEach(n=>{const c=o===n.id;r.push(`
        <button type="button"
                class="avatar-item${c?" is-equipped":""}"
                data-id="${n.id}">
          <span class="avatar-item__thumb">${n.thumbnail||""}</span>
          <span>${n.name||""}</span>
        </button>
      `)})}t.innerHTML=r.join("")}function $(){const t=document.getElementById("avatar-color-row");if(!t)return;const e=I();if(!e.hasColor){t.innerHTML="";return}if(k==="accessories"&&_(e.id)==null){t.innerHTML="";return}const r=y[e.id]||[],s=$t(e.id);t.innerHTML=r.map(o=>`
    <button type="button"
            class="avatar-color-chip${s&&s.toLowerCase()===o.toLowerCase()?" is-selected":""}"
            style="background-color:${o};"
            data-color="${o}"
            aria-label="${o}"></button>
  `).join("")}function _(t){return t==="skin"?i.body.skinTone:t==="hair"?i.body.hair?i.body.hair.style:null:t==="top"?i.clothing.top?i.clothing.top.style:null:t==="bottom"?i.clothing.bottom?i.clothing.bottom.style:null:t==="hat"?i.accessories.hat?i.accessories.hat.style:null:t==="glasses"?i.accessories.glasses?i.accessories.glasses.style:null:t==="other"&&i.accessories.other?i.accessories.other.style:null}function $t(t){return t==="hair"?i.body.hair?i.body.hair.color:null:t==="top"?i.clothing.top?i.clothing.top.color:null:t==="bottom"?i.clothing.bottom?i.clothing.bottom.color:null:t==="hat"?i.accessories.hat?i.accessories.hat.color:null:t==="glasses"?i.accessories.glasses?i.accessories.glasses.color:null:t==="other"&&i.accessories.other?i.accessories.other.color:null}function xt(t){i.body.skinTone=t}function wt(t){const e=i.body.hair&&i.body.hair.color||y.hair[0];i.body.hair={style:t||g.body.hair.style,color:e}}function vt(t){const e=i.clothing.top&&i.clothing.top.color||y.top[0];i.clothing.top={style:t||g.clothing.top.style,color:e}}function Lt(t){const e=i.clothing.bottom&&i.clothing.bottom.color||y.bottom[0];i.clothing.bottom={style:t||g.clothing.bottom.style,color:e}}function Ct(t,e){if(e==null)i.accessories[t]=null;else{const r=i.accessories[t],s=r&&r.color||y[t]&&y[t][0]||"#000000";i.accessories[t]={style:e,color:s}}}function Qt(t,e){if(t==="hair"){i.body.hair&&(i.body.hair.color=e);return}if(t==="top"){i.clothing.top&&(i.clothing.top.color=e);return}if(t==="bottom"){i.clothing.bottom&&(i.clothing.bottom.color=e);return}if(t==="hat"){i.accessories.hat&&(i.accessories.hat.color=e);return}if(t==="glasses"){i.accessories.glasses&&(i.accessories.glasses.color=e);return}if(t==="other"){i.accessories.other&&(i.accessories.other.color=e);return}}function Mt(t){const e=I();e.id==="skin"?xt(t):e.id==="hair"?wt(t==="__none__"?null:t):e.id==="top"?vt(t==="__none__"?null:t):e.id==="bottom"?Lt(t==="__none__"?null:t):Ct(e.id,t==="__none__"?null:t),Y()}function Y(){K(),Z(),b(),$()}function Ft(){location.href="index.html"}async function Tt(){try{await kt(),O("저장 완료",!1),setTimeout(()=>{location.href="index.html"},600)}catch{O("저장 실패",!0)}}function O(t,e){const r=document.getElementById("avatar-toast");r&&(r.textContent=t,r.classList.toggle("is-error",!!e),r.classList.add("is-show"),M&&clearTimeout(M),M=setTimeout(()=>r.classList.remove("is-show"),2400))}function _t(){const t=document.getElementById("avatar-username");if(!t)return;const e=document.getElementById("my-name"),r=e?e.textContent.trim():"";if(r&&r!=="사용자 이름"){t.textContent=r;return}try{const s=localStorage.getItem(D);if(s){const o=JSON.parse(s);if(o&&o.username){t.textContent=o.username;return}}}catch{}fetch(`${S}/api/me`,{credentials:"include"}).then(s=>s.ok?s.json():null).then(s=>{if(s&&s.user&&s.user.username){const o=document.getElementById("avatar-username");o&&(o.textContent=s.user.username)}}).catch(()=>{})}function B(){w()?pt():mt()}let W=!1;async function E(){if(W=!0,B(),w()){const t=await yt();t&&(i=t,K(),Z(),b(),$())}}window.addEventListener("codenergy:auth",E);w()?E():setTimeout(()=>{W||E()},2e3);const N=document.getElementById("my-wrap");N&&new MutationObserver(()=>B()).observe(N,{attributes:!0,attributeFilter:["hidden"]});
