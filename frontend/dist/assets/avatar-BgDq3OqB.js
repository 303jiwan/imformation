import"./modulepreload-polyfill-B5Qt9EMX.js";import"./main-MRu2IMKr.js";const yt={x:48,y:40,width:144,height:240,rx:32},it="#ffffff",z=[{id:"bat-white",label:"클래식",base:"#ffffff",stroke:"#7c3aed"},{id:"bat-yellow",label:"노란",base:"#fbbf24",stroke:"#d97706"},{id:"bat-blue",label:"파란",base:"#60a5fa",stroke:"#1d4ed8"},{id:"bat-green",label:"초록",base:"#4ade80",stroke:"#15803d"},{id:"bat-pink",label:"핑크",base:"#f9a8d4",stroke:"#be185d"},{id:"bat-orange",label:"오렌지",base:"#fb923c",stroke:"#c2410c"},{id:"bat-purple",label:"보라",base:"#c084fc",stroke:"#7e22ce"},{id:"bat-teal",label:"청록",base:"#2dd4bf",stroke:"#0f766e"},{id:"bat-red",label:"빨강",base:"#f87171",stroke:"#b91c1c"},{id:"bat-dark",label:"다크",base:"#334155",stroke:"#0f172a"}];function p(t,e=.3){if(typeof t!="string"||!t.startsWith("#"))return"#7c3aed";let r=t.length===4?"#"+t.slice(1).split("").map(n=>n+n).join(""):t;const a=parseInt(r.slice(1,3),16),s=parseInt(r.slice(3,5),16),i=parseInt(r.slice(5,7),16),c=Math.max(0,Math.min(1,1-e));return"#"+[a,s,i].map(n=>Math.round(n*c).toString(16).padStart(2,"0")).join("")}function gt(t){const e=z.find(r=>r.base===t);return e?e.stroke:p(t,.3)}const L=[{id:"sym-bolt",label:"번개",thumbnail:"⚡",svgFragment:(t="#22c55e")=>`
      <path d="M 133 178 L 106 220 L 122 220 L 108 254 L 138 208 L 120 208 Z"
            fill="${t}" stroke="${p(t,.25)}" stroke-width="2.5" stroke-linejoin="round"/>
    `},{id:"sym-heart",label:"하트",thumbnail:"❤️",svgFragment:(t="#ef4444")=>`
      <path d="M120 248 C120 248 88 228 88 208 C88 196 96 188 108 190 C114 191 120 197 120 197 C120 197 126 191 132 190 C144 188 152 196 152 208 C152 228 120 248 120 248 Z"
            fill="${t}" stroke="${p(t,.25)}" stroke-width="2"/>
    `},{id:"sym-star",label:"별",thumbnail:"⭐",svgFragment:(t="#fbbf24")=>`
      <polygon points="120,192 126,210 146,210 130,222 136,240 120,230 104,240 110,222 94,210 114,210"
               fill="${t}" stroke="${p(t,.25)}" stroke-width="2" stroke-linejoin="round"/>
    `},{id:"sym-cog",label:"톱니바퀴",thumbnail:"⚙️",svgFragment:(t="#94a3b8")=>`
      <g transform="translate(120,220)">
        <circle r="14" fill="${t}" stroke="${p(t,.25)}" stroke-width="2"/>
        <circle r="7"  fill="${p(t,.15)}" stroke="${p(t,.35)}" stroke-width="1.5"/>
        <rect x="-4" y="-20" width="8" height="10" rx="2" fill="${t}" stroke="${p(t,.25)}" stroke-width="1.5"/>
        <rect x="-4" y="10"  width="8" height="10" rx="2" fill="${t}" stroke="${p(t,.25)}" stroke-width="1.5"/>
        <rect x="-20" y="-4" width="10" height="8" rx="2" fill="${t}" stroke="${p(t,.25)}" stroke-width="1.5"/>
        <rect x="10"  y="-4" width="10" height="8" rx="2" fill="${t}" stroke="${p(t,.25)}" stroke-width="1.5"/>
      </g>
    `},{id:"sym-flame",label:"불꽃",thumbnail:"🔥",svgFragment:(t="#f97316")=>`
      <path d="M120 192 C110 202 104 212 108 224 C110 232 116 238 120 240 C124 238 130 232 132 224 C136 212 130 202 120 192 Z M120 208 C118 214 116 220 118 226 C118 228 119 230 120 231 C121 230 122 228 122 226 C124 220 122 214 120 208 Z"
            fill="${t}" stroke="${p(t,.25)}" stroke-width="1.5" stroke-linejoin="round"/>
    `},{id:"sym-code",label:"코드",thumbnail:"</>",svgFragment:(t="#38bdf8")=>`
      <text x="120" y="228" text-anchor="middle" font-family="monospace" font-size="26"
            font-weight="bold" fill="${t}" stroke="${p(t,.25)}" stroke-width="1">&lt;/&gt;</text>
    `}];function bt(t){return L.find(e=>e.id===t)||L[0]}const Z={body:{color:it,symbol:{id:"sym-bolt",color:"#22c55e"}},clothing:{top:{style:"top-tee",color:"#2563eb"}},accessories:{hat:null,glasses:null,other:null}};function U(t){if(!t||typeof t!="object")return JSON.parse(JSON.stringify(Z));const e=Z,r=t.body&&typeof t.body=="object"?t.body:{},a=it,s=r.symbol&&typeof r.symbol=="object"?r.symbol:{},i=L.some(u=>u.id===s.id)?s.id:e.body.symbol.id,c=typeof s.color=="string"&&s.color.startsWith("#")?s.color:e.body.symbol.color,n=t.clothing&&typeof t.clothing=="object"?t.clothing:{},f=n.top&&typeof n.top=="object"?n.top:{},x=typeof f.style=="string"&&f.style?f.style:e.clothing.top.style,m=typeof f.color=="string"&&f.color?f.color:e.clothing.top.color,h=t.accessories&&typeof t.accessories=="object"&&!Array.isArray(t.accessories)?t.accessories:{};function v(u){return!u||typeof u!="object"||typeof u.style!="string"||!u.style?null:{style:u.style,color:typeof u.color=="string"?u.color:"#000000"}}return{body:{color:a,symbol:{id:i,color:c}},clothing:{top:{style:x,color:m}},accessories:{hat:v(h.hat),glasses:v(h.glasses),other:v(h.other)}}}function A(t){if(!t||!t.style)return"";const e=wt(t.style);return e?xt(e,t.color):""}function kt(t={}){const e=U(t),r=e.body.color,a=gt(r),s=a,c=bt(e.body.symbol.id).svgFragment(e.body.symbol.color),n=A(e.clothing.top),f=A(e.accessories.hat),x=A(e.accessories.glasses),m=A(e.accessories.other),h=yt,v=h.x+h.width/2,u=h.y+80;return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 320"
     class="codenergy-character"
     role="img" aria-label="Codenergy 아바타">
  <!-- 1. 그림자 -->
  <ellipse cx="${v}" cy="310" rx="70" ry="6" fill="#94a3b8" opacity="0.28"/>

  <!-- 2. cap -->
  <rect x="${v-22}" y="22" width="44" height="18" rx="7" fill="${s}"/>

  <!-- 3. 본체 -->
  <rect x="${h.x}" y="${h.y}" width="${h.width}" height="${h.height}" rx="${h.rx}"
        fill="${r}" stroke="${a}" stroke-width="5"/>

  <!-- 4. top 의상 (Agent B 좌표) -->
  ${n}

  <!-- 5. 눈 -->
  <circle cx="${v}" cy="${u}" r="38" fill="#ffffff" stroke="#a855f7" stroke-width="4"/>

  <!-- 6. 동공 -->
  <g class="char-pupil">
    <circle cx="${v}" cy="${u}" r="20" fill="#3a2a4a"/>
    <circle cx="${v+8}" cy="${u-8}" r="6" fill="#ffffff"/>
  </g>

  <!-- 7. symbol (번개 등) -->
  ${c}

  <!-- 8. glasses -->
  ${x}

  <!-- 9. hat -->
  ${f}

  <!-- 10. other (측면 액세서리) -->
  ${m}
</svg>`.trim()}function l(t,e=.25){if(typeof t!="string"||!t.startsWith("#"))return t;let r=t.length===4?"#"+t.slice(1).split("").map(n=>n+n).join(""):t;const a=parseInt(r.slice(1,3),16),s=parseInt(r.slice(3,5),16),i=parseInt(r.slice(5,7),16),c=Math.max(0,Math.min(1,1-e));return"#"+[a,s,i].map(n=>Math.round(n*c).toString(16).padStart(2,"0")).join("")}const st=[{id:"top-tee",name:"티셔츠",thumbnail:"👕",price:0,tier:"free",svgFragment:(t="#2563eb")=>{const e=l(t,.22);return`<g class="outfit-top top-tee">
        <path d="M52 140 Q52 130 60 128 L80 124 Q120 120 160 124 L180 128 Q188 130 188 140 L188 210 L52 210 Z"
              fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M88 124 Q120 140 152 124" fill="none" stroke="${e}" stroke-width="1.5" stroke-linecap="round"/>
      </g>`}},{id:"top-tank",name:"민소매",thumbnail:"🎽",price:0,tier:"free",svgFragment:(t="#10b981")=>{const e=l(t,.2);return`<g class="outfit-top top-tank">
        <path d="M68 140 Q68 130 76 128 Q120 122 164 128 Q172 130 172 140 L172 210 L68 210 Z"
              fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <line x1="68" y1="140" x2="52" y2="160" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
        <line x1="172" y1="140" x2="188" y2="160" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
      </g>`}},{id:"top-hoodie",name:"후드티",thumbnail:"🧥",price:30,tier:"common",svgFragment:(t="#a855f7")=>{const e=l(t,.25);return`<g class="outfit-top top-hoodie">
        <path d="M52 140 Q52 128 62 126 L80 122 Q120 118 160 122 L178 126 Q188 128 188 140 L188 210 L52 210 Z"
              fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M88 122 Q120 138 152 122" fill="none" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
        <rect x="104" y="180" width="32" height="22" rx="4" fill="none" stroke="${e}" stroke-width="2"/>
        <line x1="120" y1="148" x2="120" y2="180" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
      </g>`}},{id:"top-stripe",name:"스트라이프",thumbnail:"🧵",price:30,tier:"common",svgFragment:(t="#ef4444")=>{const e=l(t,.22);return`<g class="outfit-top top-stripe">
        <path d="M52 140 Q52 130 60 128 L80 124 Q120 120 160 124 L180 128 Q188 130 188 140 L188 210 L52 210 Z"
              fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <line x1="56"  y1="155" x2="184" y2="155" stroke="${e}" stroke-width="4"/>
        <line x1="55"  y1="170" x2="185" y2="170" stroke="${e}" stroke-width="4"/>
        <line x1="54"  y1="185" x2="186" y2="185" stroke="${e}" stroke-width="4"/>
      </g>`}},{id:"top-shirt",name:"셔츠",thumbnail:"👔",price:30,tier:"common",svgFragment:(t="#f8fafc")=>{const e=l(t,.22);return`<g class="outfit-top top-shirt">
        <path d="M52 140 Q52 130 60 128 L80 124 Q120 120 160 124 L180 128 Q188 130 188 140 L188 210 L52 210 Z"
              fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M104 124 L112 140 L120 134 L128 140 L136 124 Q120 114 104 124 Z" fill="${e}"/>
        <line x1="120" y1="142" x2="120" y2="208" stroke="${e}" stroke-width="1.5"/>
        <circle cx="120" cy="158" r="2" fill="${e}"/>
        <circle cx="120" cy="174" r="2" fill="${e}"/>
        <circle cx="120" cy="190" r="2" fill="${e}"/>
      </g>`}},{id:"top-jacket",name:"재킷",thumbnail:"🧣",price:100,tier:"premium",svgFragment:(t="#1e3a8a")=>{const e=l(t,.28),r=l(t,-.15);return`<g class="outfit-top top-jacket">
        <path d="M52 140 Q52 128 62 126 L80 122 Q120 118 160 122 L178 126 Q188 128 188 140 L188 210 L52 210 Z"
              fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M104 122 L112 142 L120 136 L128 142 L136 122 Q120 112 104 122 Z" fill="${e}"/>
        <line x1="120" y1="142" x2="120" y2="208" stroke="${e}" stroke-width="3"/>
        <rect x="58" y="160" width="16" height="12" rx="2" fill="${r}"/>
        <line x1="52" y1="140" x2="52" y2="210" stroke="${e}" stroke-width="4" stroke-linecap="round"/>
        <line x1="188" y1="140" x2="188" y2="210" stroke="${e}" stroke-width="4" stroke-linecap="round"/>
      </g>`}},{id:"top-polo",name:"폴로",thumbnail:"🏌️",price:100,tier:"premium",svgFragment:(t="#0ea5e9")=>{const e=l(t,.22);return`<g class="outfit-top top-polo">
        <path d="M52 140 Q52 130 60 128 L80 124 Q120 120 160 124 L180 128 Q188 130 188 140 L188 210 L52 210 Z"
              fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M110 120 L114 138 L120 132 L126 138 L130 120 Q120 112 110 120 Z" fill="${e}"/>
        <line x1="120" y1="136" x2="120" y2="160" stroke="${e}" stroke-width="2"/>
        <circle cx="120" cy="164" r="2.5" fill="${e}"/>
        <circle cx="120" cy="174" r="2.5" fill="${e}"/>
        <line x1="88" y1="124" x2="80" y2="134" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
        <line x1="152" y1="124" x2="160" y2="134" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
      </g>`}},{id:"top-starcape",name:"별무늬 망토",thumbnail:"🌟",price:100,tier:"premium",svgFragment:t=>`<g class="outfit-top top-starcape">
      <path d="M24 118 Q24 108 36 106 L80 100 Q120 96 160 100 L204 106 Q216 108 216 118 L216 292 Q168 302 120 304 Q72 302 24 292 Z"
            fill="#7c3aed" stroke="#5b21b6" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M44 128 Q120 122 196 128 L196 286 Q160 294 120 295 Q80 294 44 286 Z"
            fill="#a78bfa" opacity="0.45"/>
      <polygon points="75,155 79,167 92,167 82,175 86,187 75,179 64,187 68,175 58,167 71,167"
               fill="#ffffff" opacity="0.93"/>
      <polygon points="120,142 124,154 137,154 127,162 131,174 120,166 109,174 113,162 103,154 116,154"
               fill="#ffffff" opacity="0.93"/>
      <polygon points="165,155 169,167 182,167 172,175 176,187 165,179 154,187 158,175 148,167 161,167"
               fill="#ffffff" opacity="0.93"/>
      <polygon points="90,205 93,214 103,214 95,220 98,229 90,223 82,229 85,220 77,214 87,214"
               fill="#ffffff" opacity="0.86"/>
      <polygon points="150,205 153,214 163,214 155,220 158,229 150,223 142,229 145,220 137,214 147,214"
               fill="#ffffff" opacity="0.86"/>
      <polygon points="120,235 122,241 129,241 123,245 125,251 120,247 115,251 117,245 111,241 118,241"
               fill="#ffffff" opacity="0.80"/>
      <polygon points="57,240 59,246 66,246 61,250 63,256 57,252 51,256 53,250 48,246 55,246"
               fill="#ffffff" opacity="0.78"/>
      <path d="M100 113 C87 103 86 120 100 116 L120 112 Z" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
      <path d="M140 113 C153 103 154 120 140 116 L120 112 Z" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
      <circle cx="120" cy="112" r="7" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
    </g>`}],nt=[{id:"hat-cap",name:"야구모자",thumbnail:"🧢",price:0,tier:"free",svgFragment:(t="#1f2937")=>{const e=l(t,.3);return`<g class="outfit-hat hat-cap">
        <path d="M48 38 Q50 -2 120 -5 Q190 -2 192 38 Z"
              fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="158" cy="40" rx="46" ry="7" fill="${e}"/>
        <text x="120" y="24" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="800" fill="#ffffff">C</text>
      </g>`}},{id:"hat-beanie",name:"비니",thumbnail:"🎩",price:0,tier:"free",svgFragment:(t="#a855f7")=>{const e=l(t,.3);return`<g class="outfit-hat hat-beanie">
        <path d="M50 40 Q52 -4 120 -7 Q188 -4 190 40 Z"
              fill="${t}" stroke="${e}" stroke-width="2"/>
        <rect x="46" y="34" width="148" height="14" rx="6" fill="${e}"/>
        <circle cx="120" cy="-5" r="11" fill="#fde68a" stroke="#f59e0b" stroke-width="1.5"/>
      </g>`}},{id:"hat-tophat",name:"탑햇",thumbnail:"🎩",price:30,tier:"common",svgFragment:(t="#111827")=>{const e=l(t,.5);return`<g class="outfit-hat hat-tophat">
        <rect x="92" y="-38" width="56" height="56" rx="4"
              fill="${t}" stroke="${e}" stroke-width="2"/>
        <rect x="60" y="16" width="120" height="12" rx="4" fill="${e}"/>
        <line x1="92" y1="-2" x2="148" y2="-2" stroke="${e}" stroke-width="1.5" opacity="0.5"/>
      </g>`}},{id:"hat-fedora",name:"페도라",thumbnail:"🤠",price:30,tier:"common",svgFragment:(t="#92400e")=>{const e=l(t,.3);return`<g class="outfit-hat hat-fedora">
        <path d="M80 38 Q82 2 120 -1 Q158 2 160 38 Z"
              fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="120" cy="40" rx="72" ry="10" fill="${e}"/>
        <path d="M92 14 Q120 4 148 14" fill="none" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
      </g>`}},{id:"hat-bucket",name:"버킷햇",thumbnail:"👒",price:30,tier:"common",svgFragment:(t="#fbbf24")=>{const e=l(t,.25);return`<g class="outfit-hat hat-bucket">
        <path d="M82 38 Q84 4 120 1 Q156 4 158 38 Z"
              fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="120" cy="40" rx="66" ry="11" fill="${e}"/>
        <path d="M86 24 Q120 16 154 24" fill="none" stroke="${e}" stroke-width="2" stroke-linecap="round"/>
      </g>`}},{id:"hat-beret",name:"베레모",thumbnail:"🎭",price:100,tier:"premium",svgFragment:(t="#dc2626")=>{const e=l(t,.35);return`<g class="outfit-hat hat-beret">
        <ellipse cx="112" cy="20" rx="68" ry="28" fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="120" cy="36" rx="46" ry="8" fill="${e}"/>
        <circle  cx="148" cy="-2" r="6" fill="${e}"/>
      </g>`}},{id:"hat-visor",name:"바이저",thumbnail:"🏄",price:100,tier:"premium",svgFragment:(t="#10b981")=>{const e=l(t,.28);return`<g class="outfit-hat hat-visor">
        <rect x="46" y="26" width="148" height="16" rx="7"
              fill="${t}" stroke="${e}" stroke-width="2"/>
        <ellipse cx="158" cy="44" rx="50" ry="8" fill="${e}"/>
        <text x="96" y="40" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#ffffff">CODENERGY</text>
      </g>`}}],lt=[{id:"glasses-round",name:"동그란",thumbnail:"👓",price:0,tier:"free",svgFragment:(t="#000000")=>`<g class="outfit-glasses glasses-round">
      <circle cx="120" cy="120" r="46" fill="none" stroke="${t}" stroke-width="3"/>
      <line x1="74"  y1="118" x2="56"  y2="115" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
      <line x1="166" y1="118" x2="184" y2="115" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
    </g>`},{id:"glasses-square",name:"뿔테",thumbnail:"🕶️",price:0,tier:"free",svgFragment:(t="#1f2937")=>`<g class="outfit-glasses glasses-square">
      <rect x="73" y="73" width="94" height="94" rx="8"
            fill="none" stroke="${t}" stroke-width="3.5"/>
      <line x1="73"  y1="118" x2="54"  y2="115" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
      <line x1="167" y1="118" x2="186" y2="115" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
    </g>`},{id:"glasses-sun",name:"선글라스",thumbnail:"😎",price:30,tier:"common",svgFragment:(t="#374151")=>`<g class="outfit-glasses glasses-sun">
      <circle cx="120" cy="120" r="46" fill="${t}" fill-opacity="0.85" stroke="${t}" stroke-width="2"/>
      <line x1="74"  y1="118" x2="56"  y2="115" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
      <line x1="166" y1="118" x2="184" y2="115" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
    </g>`},{id:"glasses-cat",name:"캣아이",thumbnail:"🐱",price:30,tier:"common",svgFragment:(t="#a855f7")=>{const e=l(t,.2);return`<g class="outfit-glasses glasses-cat">
        <path d="M74 130 Q74 74 120 72 Q166 74 166 130 Q150 118 120 116 Q90 118 74 130 Z"
              fill="none" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
        <line x1="74"  y1="118" x2="54"  y2="112" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
        <line x1="166" y1="118" x2="186" y2="112" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
        <line x1="120" y1="72"  x2="128" y2="60"  stroke="${e}"    stroke-width="2" stroke-linecap="round"/>
      </g>`}},{id:"glasses-oval",name:"오벌",thumbnail:"🔍",price:30,tier:"common",svgFragment:(t="#0ea5e9")=>`<g class="outfit-glasses glasses-oval">
      <ellipse cx="120" cy="120" rx="48" ry="36"
               fill="none" stroke="${t}" stroke-width="3"/>
      <line x1="72"  y1="118" x2="54"  y2="115" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
      <line x1="168" y1="118" x2="186" y2="115" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
    </g>`},{id:"glasses-heart",name:"하트",thumbnail:"❤️",price:100,tier:"premium",svgFragment:(t="#ef4444")=>`<g class="outfit-glasses glasses-heart">
      <path d="M120 160 C120 160 70 132 70 104 C70 88 82 78 96 82 C106 84 120 96 120 96 C120 96 134 84 144 82 C158 78 170 88 170 104 C170 132 120 160 120 160 Z"
            fill="${t}" fill-opacity="0.75" stroke="${t}" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="70"  y1="104" x2="50"  y2="100" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
      <line x1="170" y1="104" x2="190" y2="100" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
    </g>`},{id:"glasses-mono",name:"모노클",thumbnail:"🧐",price:100,tier:"premium",svgFragment:(t="#92400e")=>`<g class="outfit-glasses glasses-mono">
      <circle cx="120" cy="120" r="46"
              fill="none" stroke="${t}" stroke-width="3.5"/>
      <line x1="166" y1="120" x2="190" y2="128" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="120" cy="120" r="2" fill="${t}" opacity="0.4"/>
    </g>`}],ct=[{id:"acc-bolt-pin",name:"번개 핀",thumbnail:"⚡",price:0,tier:"free",svgFragment:(t="#fbbf24")=>{const e=l(t,.25);return`<g class="outfit-other acc-bolt-pin">
        <path d="M172 55 L160 75 L168 75 L162 95 L180 70 L170 70 Z"
              fill="${t}" stroke="${e}" stroke-width="1.5" stroke-linejoin="round"/>
      </g>`}},{id:"acc-star-pin",name:"별 핀",thumbnail:"⭐",price:0,tier:"free",svgFragment:(t="#fbbf24")=>{const e=l(t,.25);return`<g class="outfit-other acc-star-pin">
        <polygon points="60,55 63,65 74,65 65,72 68,82 60,75 52,82 55,72 46,65 57,65"
                 fill="${t}" stroke="${e}" stroke-width="1.5" stroke-linejoin="round"/>
      </g>`}},{id:"acc-bow",name:"리본",thumbnail:"🎀",price:30,tier:"common",svgFragment:(t="#f472b6")=>{const e=l(t,.22);return`<g class="outfit-other acc-bow">
        <path d="M46 50 C38 42 38 58 46 54 L58 50 Z" fill="${t}" stroke="${e}" stroke-width="1.5"/>
        <path d="M46 50 C38 42 38 58 46 54 Z" fill="${e}" opacity="0.3"/>
        <path d="M70 50 C78 42 78 58 70 54 L58 50 Z" fill="${t}" stroke="${e}" stroke-width="1.5"/>
        <circle cx="58" cy="50" r="5" fill="${e}"/>
      </g>`}},{id:"acc-flame-pin",name:"불꽃 핀",thumbnail:"🔥",price:30,tier:"common",svgFragment:(t="#f97316")=>{const e=l(t,.25);return`<g class="outfit-other acc-flame-pin">
        <path d="M174 90 C168 80 164 70 170 60 C172 68 176 70 176 64 C180 70 182 80 178 90 C178 94 174 96 174 90 Z"
              fill="${t}" stroke="${e}" stroke-width="1.5" stroke-linejoin="round"/>
      </g>`}},{id:"acc-gear-pin",name:"톱니 핀",thumbnail:"⚙️",price:30,tier:"common",svgFragment:(t="#94a3b8")=>{const e=l(t,.25);return`<g class="outfit-other acc-gear-pin">
        <g transform="translate(60,80)">
          <circle r="10" fill="${t}" stroke="${e}" stroke-width="1.5"/>
          <circle r="5"  fill="${e}" opacity="0.6"/>
          <rect x="-3" y="-14" width="6" height="7" rx="1.5" fill="${t}" stroke="${e}" stroke-width="1"/>
          <rect x="-3" y="7"   width="6" height="7" rx="1.5" fill="${t}" stroke="${e}" stroke-width="1"/>
          <rect x="-14" y="-3" width="7" height="6" rx="1.5" fill="${t}" stroke="${e}" stroke-width="1"/>
          <rect x="7"   y="-3" width="7" height="6" rx="1.5" fill="${t}" stroke="${e}" stroke-width="1"/>
        </g>
      </g>`}},{id:"acc-crown",name:"왕관",thumbnail:"👑",price:100,tier:"premium",svgFragment:(t="#fbbf24")=>{const e=l(t,.25);return`<g class="outfit-other acc-crown">
        <path d="M84 22 L100 8 L120 22 L140 8 L156 22 L156 38 L84 38 Z"
              fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="100" cy="8"  r="3.5" fill="${e}"/>
        <circle cx="120" cy="22" r="3"   fill="${e}" opacity="0.5"/>
        <circle cx="140" cy="8"  r="3.5" fill="${e}"/>
        <line x1="84" y1="34" x2="156" y2="34" stroke="${e}" stroke-width="2"/>
      </g>`}},{id:"acc-halo",name:"후광",thumbnail:"😇",price:100,tier:"premium",svgFragment:(t="#fde68a")=>{const e=l(t,.2);return`<g class="outfit-other acc-halo">
        <ellipse cx="120" cy="16" rx="46" ry="12"
                 fill="none" stroke="${t}" stroke-width="5" opacity="0.9"/>
        <ellipse cx="120" cy="16" rx="46" ry="12"
                 fill="none" stroke="${e}" stroke-width="2" opacity="0.5"/>
      </g>`}}],vt={top:st,hat:nt,glasses:lt,other:ct},$t=new Map([...st,...nt,...lt,...ct].map(t=>[t.id,t]));function C(t){return vt[t]||[]}function wt(t){return t==null?null:$t.get(t)||null}function xt(t,e){if(!t)return"";const r=t.svgFragment;return typeof r=="function"?r(e):typeof r=="string"?r:""}const M={"top-tee":{category:"top",price:0,tier:"free"},"top-tank":{category:"top",price:0,tier:"free"},"top-hoodie":{category:"top",price:30,tier:"common"},"top-stripe":{category:"top",price:30,tier:"common"},"top-shirt":{category:"top",price:30,tier:"common"},"top-jacket":{category:"top",price:100,tier:"premium"},"top-polo":{category:"top",price:100,tier:"premium"},"top-starcape":{category:"top",price:100,tier:"premium"},"hat-cap":{category:"hat",price:0,tier:"free"},"hat-beanie":{category:"hat",price:0,tier:"free"},"hat-tophat":{category:"hat",price:30,tier:"common"},"hat-fedora":{category:"hat",price:30,tier:"common"},"hat-bucket":{category:"hat",price:30,tier:"common"},"hat-beret":{category:"hat",price:100,tier:"premium"},"hat-visor":{category:"hat",price:100,tier:"premium"},"glasses-round":{category:"glasses",price:0,tier:"free"},"glasses-square":{category:"glasses",price:0,tier:"free"},"glasses-sun":{category:"glasses",price:30,tier:"common"},"glasses-cat":{category:"glasses",price:30,tier:"common"},"glasses-oval":{category:"glasses",price:30,tier:"common"},"glasses-heart":{category:"glasses",price:100,tier:"premium"},"glasses-mono":{category:"glasses",price:100,tier:"premium"},"acc-bolt-pin":{category:"other",price:0,tier:"free"},"acc-star-pin":{category:"other",price:0,tier:"free"},"acc-bow":{category:"other",price:30,tier:"common"},"acc-flame-pin":{category:"other",price:30,tier:"common"},"acc-gear-pin":{category:"other",price:30,tier:"common"},"acc-crown":{category:"other",price:100,tier:"premium"},"acc-halo":{category:"other",price:100,tier:"premium"},"sym-bolt":{category:"symbol",price:0,tier:"free"},"sym-heart":{category:"symbol",price:30,tier:"common"},"sym-star":{category:"symbol",price:30,tier:"common"},"sym-code":{category:"symbol",price:30,tier:"common"},"sym-cog":{category:"symbol",price:100,tier:"premium"},"sym-flame":{category:"symbol",price:100,tier:"premium"}};function J(t){const e=M[t];return!!(e&&e.price===0)}function Y(t){const e=M[t];return e?e.price:null}const T="http://localhost:3000",dt="codenergy:avatar:config",Lt="codenergy:avatar:equipped",Ct="codenergy:auth:hint",ft="codenergy:demo:user",R={body:{label:"신체",subs:[{id:"symbol",label:"문양",hasColor:!0,allowNone:!1}]},clothing:{label:"의상",subs:[{id:"top",label:"상의",hasColor:!0,allowNone:!1}]},accessories:{label:"악세사리",subs:[{id:"hat",label:"모자",hasColor:!0,allowNone:!0},{id:"glasses",label:"안경",hasColor:!0,allowNone:!0},{id:"other",label:"기타",hasColor:!0,allowNone:!0}]},shop:{label:"상점",subs:[{id:"top",label:"상의"},{id:"hat",label:"모자"},{id:"glasses",label:"안경"},{id:"other",label:"기타"},{id:"symbol",label:"문양"}]}},k={symbol:["#22c55e","#ef4444","#fbbf24","#3b82f6","#a855f7","#f97316","#38bdf8","#94a3b8","#e879f9"],top:["#ffffff","#1f2937","#a855f7","#3b82f6","#ef4444","#10b981","#fbbf24","#f97316","#22c55e"],hat:["#1f2937","#404040","#cbd5e1","#3b82f6","#a855f7","#ef4444","#fbbf24","#92400e","#10b981"],glasses:["#000000","#374151","#92400e","#ef4444","#3b82f6","#a855f7","#10b981","#fbbf24","#9ca3af"],other:["#fcd34d","#9ca3af","#ef4444","#3b82f6","#a855f7","#10b981","#fbbf24","#f97316","#000000"]};let g={balance:0,ownedItemIds:new Set};async function _t(){Object.keys(M).forEach(t=>{J(t)&&g.ownedItemIds.add(t)});try{const t=await fetch(`${T}/api/wallet`,{credentials:"include"});if(!t.ok)return;const e=await t.json().catch(()=>null);if(!e)return;typeof e.balance=="number"&&(g.balance=e.balance),Array.isArray(e.ownedItemIds)&&e.ownedItemIds.forEach(r=>g.ownedItemIds.add(r)),Object.keys(M).forEach(r=>{J(r)&&g.ownedItemIds.add(r)}),V()}catch{}}function $(t){return J(t)?!0:g.ownedItemIds.has(t)}function V(){const t=document.getElementById("avatar-balance-num");t&&(t.textContent=String(g.balance))}function D(){return JSON.parse(JSON.stringify(Z))}function It(){try{localStorage.removeItem(Lt)}catch{}try{const t=localStorage.getItem(dt);return t?U(JSON.parse(t)):D()}catch{return D()}}function ut(){try{localStorage.setItem(dt,JSON.stringify(o))}catch{}}async function Mt(){try{const t=await fetch(`${T}/api/avatar`,{method:"GET",credentials:"include"});if(!t.ok)return null;const e=await t.json().catch(()=>null);return e&&e.avatar?U(e.avatar):null}catch{return null}}async function Et(){const t=await fetch(`${T}/api/avatar`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({avatar:o})});if(!t.ok){let e="save failed";try{const r=await t.json();r&&r.error&&(e=r.error)}catch{}throw new Error(e)}return t.json().catch(()=>({ok:!0}))}function H(){try{const e=localStorage.getItem(Ct);if(e==="logged-in")return!0;if(e==="logged-out")return!1;if(localStorage.getItem(ft))return!0}catch{}const t=document.getElementById("my-wrap");return!!(t&&!t.hidden)}const q=document.getElementById("avatar-root");let o=It(),w="body",Q="symbol",G=null,P=!1,at=!1,d=null,X=null;function St(){q.innerHTML="",sessionStorage.setItem("codenergy:redirectAfterLogin","avatar.html");function t(){const r=document.getElementById("auth-modal");if(!r||!r.hidden)return;const a=document.getElementById("login-btn");a&&a.click(),r.hidden&&(r.hidden=!1)}t();const e=document.getElementById("auth-modal");if(e){const r=new MutationObserver(()=>{e.hidden&&(r.disconnect(),!q.querySelector(".avatar-card")&&(H()?rt():location.replace("index.html")))});r.observe(e,{attributes:!0,attributeFilter:["hidden"]})}}function Ft(){q.innerHTML=`
    <div class="avatar-page-wrap">
      <div class="avatar-card">
        <div class="avatar-card__head">
          <div>
            <p class="avatar-eyebrow">아바타 에디터</p>
            <h1 class="avatar-title">나만의 캐릭터 꾸미기</h1>
          </div>
          <div class="avatar-head-right">
            <div class="avatar-balance" id="avatar-balance">🔋 <span id="avatar-balance-num">0</span></div>
            <div class="avatar-username" id="avatar-username">me</div>
          </div>
        </div>

        <div class="avatar-layout">
          <aside class="avatar-preview">
            <div class="avatar-stage">
              <div class="avatar-stage__glow" aria-hidden="true"></div>
              <div class="avatar-stage__floor" aria-hidden="true"></div>
              <div class="avatar-character" id="avatar-character"></div>
            </div>
            <div class="avatar-quick">
              <button type="button" class="avatar-quick__btn" data-action="random" aria-label="랜덤">
                <span class="avatar-quick__icon">🎲</span><span>랜덤</span>
              </button>
              <button type="button" class="avatar-quick__btn" data-action="reset" aria-label="초기화">
                <span class="avatar-quick__icon">↺</span><span>초기화</span>
              </button>
            </div>
          </aside>

          <div class="avatar-panel">
            <div class="avatar-tabs avatar-tabs--primary"   id="avatar-primary"></div>
            <div class="avatar-tabs avatar-tabs--secondary" id="avatar-secondary"></div>
            <div class="avatar-color-row" id="avatar-color-row"></div>
            <div class="avatar-grid" id="avatar-grid"></div>
            <div class="avatar-actions">
              <button type="button" class="avatar-btn avatar-btn--ghost"   data-action="back">뒤로</button>
              <button type="button" class="avatar-btn avatar-btn--primary" data-action="finish">저장하기</button>
            </div>
          </div>
        </div>

        <div class="avatar-toast" id="avatar-toast" role="status" aria-live="polite"></div>

        <!-- 구매 확인 모달 -->
        <div class="avatar-buy-modal" id="avatar-buy-modal" hidden>
          <div class="avatar-buy-modal__inner">
            <p class="avatar-buy-modal__title" id="avatar-buy-title">아이템 구매</p>
            <p class="avatar-buy-modal__price" id="avatar-buy-price"></p>
            <div class="avatar-buy-modal__actions">
              <button type="button" class="avatar-btn avatar-btn--ghost avatar-btn--sm" id="avatar-buy-cancel">취소</button>
              <button type="button" class="avatar-btn avatar-btn--primary avatar-btn--sm" id="avatar-buy-confirm">구매하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,O(),pt(),W(),E(),S(),Gt(),V(),at||(q.addEventListener("click",Qt),at=!0)}function Qt(t){if(t.target.closest("#avatar-buy-cancel")){ht(),b();return}if(t.target.closest("#avatar-buy-confirm")){At();return}const a=t.target.closest("[data-action]");if(a){if(a.dataset.action==="back"){Nt();return}if(a.dataset.action==="finish"){Pt();return}if(a.dataset.action==="random"){Rt();return}if(a.dataset.action==="reset"){Ht();return}}const s=t.target.closest(".avatar-tab[data-primary]");if(s){d&&b(),w=s.dataset.primary,Q=R[w].subs[0].id,pt(),W(),E(),S();return}const i=t.target.closest(".avatar-tab[data-secondary]");if(i){d&&b(),Q=i.dataset.secondary,W(),E(),S();return}const c=t.target.closest(".avatar-item[data-id]");if(c){const f=c.dataset.id;qt(f);return}const n=t.target.closest(".avatar-color-chip[data-color]");if(n){d&&b(),Tt(Q,n.dataset.color),F();return}}function O(){const t=document.getElementById("avatar-character");t&&(t.innerHTML=kt(o))}function pt(){const t=document.getElementById("avatar-primary");t&&(t.innerHTML=Object.entries(R).map(([e,r])=>`
    <button type="button"
            class="avatar-tab${e===w?" is-active":""}${e==="shop"?" avatar-tab--shop":""}"
            data-primary="${e}">${r.label}</button>
  `).join(""))}function W(){const t=document.getElementById("avatar-secondary");if(!t)return;const e=R[w].subs;t.innerHTML=e.map(r=>`
    <button type="button"
            class="avatar-tab${r.id===Q?" is-active":""}"
            data-secondary="${r.id}">${r.label}</button>
  `).join("")}function tt(){const t=R[w].subs;return t.find(e=>e.id===Q)||t[0]}function E(){const t=document.getElementById("avatar-grid");if(!t)return;const e=tt(),r=[];if(w==="shop"){const a=e.id;let s;a==="symbol"?s=L.map(i=>({id:i.id,name:i.label,thumbnail:i.thumbnail,price:Y(i.id)??0})):s=C(a).map(i=>({id:i.id,name:i.name,thumbnail:i.thumbnail,price:Y(i.id)??i.price??0})),s.forEach(i=>{const c=$(i.id),n=i.price<=g.balance,x=j(a)===i.id;let m="avatar-item";x&&(m+=" is-equipped"),c||(m+=" is-locked",n?m+=" is-affordable":m+=" is-unaffordable"),r.push(`
        <button type="button"
                class="${m}"
                data-id="${i.id}"
                data-price="${i.price}">
          <span class="avatar-item__thumb">${i.thumbnail||""}</span>
          <span>${i.name||""}</span>
          ${c?"":`<span class="avatar-item__price">${i.price} 🔋</span>`}
        </button>
      `)})}else if(e.id==="color")z.forEach(a=>{const s=o.body.color===a.base;r.push(`
        <button type="button"
                class="avatar-item avatar-item--skin${s?" is-equipped":""}"
                data-id="${a.id}">
          <span class="avatar-item__thumb">
            <span class="avatar-item__thumb-skin" style="background-color:${a.base};border-color:${a.stroke};"></span>
          </span>
          <span>${a.label}</span>
        </button>
      `)});else if(e.id==="symbol")L.forEach(a=>{if(!$(a.id))return;const s=o.body.symbol.id===a.id;r.push(`
        <button type="button"
                class="avatar-item${s?" is-equipped":""}"
                data-id="${a.id}">
          <span class="avatar-item__thumb">${a.thumbnail||""}</span>
          <span>${a.label}</span>
        </button>
      `)});else{if(e.allowNone){const i=j(e.id)==null;r.push(`
        <button type="button"
                class="avatar-item avatar-item--none${i?" is-equipped":""}"
                data-id="__none__">
          <span class="avatar-item__thumb">✕</span>
          <span>없음</span>
        </button>
      `)}const a=C(e.id).filter(i=>$(i.id)),s=j(e.id);a.forEach(i=>{const c=s===i.id;r.push(`
        <button type="button"
                class="avatar-item${c?" is-equipped":""}"
                data-id="${i.id}">
          <span class="avatar-item__thumb">${i.thumbnail||""}</span>
          <span>${i.name||""}</span>
        </button>
      `)})}t.innerHTML=r.join("")}function S(){const t=document.getElementById("avatar-color-row");if(!t)return;if(w==="shop"){t.innerHTML="";return}const e=tt();if(!e.hasColor){t.innerHTML="";return}if(e.id==="top"&&j("top")==="top-starcape"){t.innerHTML="";return}if(w==="accessories"&&j(e.id)==null){t.innerHTML="";return}const r=k[e.id]||[],a=jt(e.id);t.innerHTML=r.map(s=>`
    <button type="button"
            class="avatar-color-chip${a&&a.toLowerCase()===s.toLowerCase()?" is-selected":""}"
            style="background-color:${s};"
            data-color="${s}"
            aria-label="${s}"></button>
  `).join("")}function j(t){return t==="color"?o.body.color:t==="symbol"?o.body.symbol?o.body.symbol.id:null:t==="top"?o.clothing.top?o.clothing.top.style:null:t==="hat"?o.accessories.hat?o.accessories.hat.style:null:t==="glasses"?o.accessories.glasses?o.accessories.glasses.style:null:t==="other"&&o.accessories.other?o.accessories.other.style:null}function jt(t){return t==="symbol"?o.body.symbol?o.body.symbol.color:null:t==="top"?o.clothing.top?o.clothing.top.color:null:t==="hat"?o.accessories.hat?o.accessories.hat.color:null:t==="glasses"?o.accessories.glasses?o.accessories.glasses.color:null:t==="other"&&o.accessories.other?o.accessories.other.color:null}function Bt(t){const e=z.find(r=>r.id===t);o.body.color=e?e.base:t}function N(t){const e=o.body.symbol&&o.body.symbol.color||"#22c55e",r=t&&L.some(a=>a.id===t)?t:"sym-bolt";o.body.symbol={id:r,color:e}}function B(t){const e=o.clothing.top&&o.clothing.top.color||k.top[0];o.clothing.top={style:t||Z.clothing.top.style,color:e}}function _(t,e){if(e==null)o.accessories[t]=null;else{const r=o.accessories[t],a=r&&r.color||k[t]&&k[t][0]||"#000000";o.accessories[t]={style:e,color:a}}}function Tt(t,e){if(t==="symbol"){o.body.symbol&&(o.body.symbol.color=e);return}if(t==="top"){o.clothing.top&&(o.clothing.top.color=e);return}if(t==="hat"){o.accessories.hat&&(o.accessories.hat.color=e);return}if(t==="glasses"){o.accessories.glasses&&(o.accessories.glasses.color=e);return}if(t==="other"){o.accessories.other&&(o.accessories.other.color=e);return}}let et=null;function Ot(t){const e=Y(t)??0,r=document.getElementById("avatar-buy-modal");if(!r)return;const a=document.getElementById("avatar-buy-title"),s=document.getElementById("avatar-buy-price");let i=t;const c=L.find(n=>n.id===t);if(c)i=c.label;else{const n=(()=>{for(const f of["top","hat","glasses","other"]){const x=C(f).find(m=>m.id===t);if(x)return x}return null})();n&&(i=n.name)}a&&(a.textContent=`"${i}" 구매`),s&&(s.textContent=`가격: ${e} 🔋 (잔액: ${g.balance} 🔋)`),et=t,r.hidden=!1}function ht(){const t=document.getElementById("avatar-buy-modal");t&&(t.hidden=!0),et=null}async function At(){const t=et;if(ht(),!!t)try{const e=await fetch(`${T}/api/shop/purchase`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({itemId:t})}),r=await e.json().catch(()=>({}));if(!e.ok){b();const i=r.error==="insufficient_battery"?"배터리 잔액이 부족합니다":r.error==="already_owned"?"이미 소유한 아이템입니다":r.error==="invalid_item"?"유효하지 않은 아이템입니다":"구매 실패";I(i,!0);return}typeof r.balance=="number"&&(g.balance=r.balance),Array.isArray(r.ownedItemIds)?r.ownedItemIds.forEach(i=>g.ownedItemIds.add(i)):g.ownedItemIds.add(t),V(),I("구매 완료! 아이템이 장착되었습니다",!1),d!=null&&(o=d,d=null,X=null);const a=M[t],s=a?a.category:null;s==="symbol"?N(t):s==="top"?B(t):s&&_(s,t),F()}catch{b(),I("구매 중 오류가 발생했습니다",!0)}}function Zt(t){d==null&&(d=JSON.parse(JSON.stringify(o))),X=t;const e=M[t],r=e?e.category:null;r==="symbol"?N(t):r==="top"?B(t):r&&_(r,t),O()}function b(){d!=null&&(o=d,d=null,X=null,O(),E(),S())}function qt(t){if(w==="shop"){if(!$(t)){Zt(t),Ot(t);return}d&&b();const r=(()=>{const a=M[t];return a?a.category:null})();if(!r)return;r==="symbol"?N(t):r==="top"?B(t):_(r,t),F();return}d&&b();const e=tt();e.id==="color"?Bt(t):e.id==="symbol"?N(t):e.id==="top"?B(t==="__none__"?null:t):_(e.id,t==="__none__"?null:t),F()}function F(){d||(P=!0,ut(),O(),E(),S())}function Nt(){if(d){b(),location.href="index.html";return}P&&!window.confirm("저장되지 않은 변경사항이 있어요. 저장하지 않고 나가시겠어요?")||(location.href="index.html")}function y(t){return t[Math.floor(Math.random()*t.length)]}function Rt(){if(d){b();return}const t=L.filter(i=>$(i.id));if(t.length){const i=y(t);o.body.symbol&&o.body.symbol.color,o.body.symbol={id:i.id,color:y(k.symbol)}}const e=C("top").filter(i=>$(i.id));e.length&&B(y(e).id);const r=C("hat").filter(i=>$(i.id)),a=C("glasses").filter(i=>$(i.id)),s=C("other").filter(i=>$(i.id));_("hat",Math.random()<.5||!r.length?null:y(r).id),_("glasses",Math.random()<.5||!a.length?null:y(a).id),_("other",Math.random()<.5||!s.length?null:y(s).id),o.body.symbol&&(o.body.symbol.color=y(k.symbol)),o.clothing.top&&(o.clothing.top.color=y(k.top)),o.accessories.hat&&(o.accessories.hat.color=y(k.hat)),o.accessories.glasses&&(o.accessories.glasses.color=y(k.glasses)),o.accessories.other&&(o.accessories.other.color=y(k.other)),F(),I("랜덤 적용",!1)}function Ht(){if(d){b();return}window.confirm("기본 모습으로 되돌릴까요?")&&(o=D(),F(),I("기본값으로 초기화",!1))}async function Pt(){try{await Et(),P=!1,I("저장 완료",!1),setTimeout(()=>{location.href="index.html"},600)}catch{I("저장 실패",!0)}}function I(t,e){const r=document.getElementById("avatar-toast");r&&(r.textContent=t,r.classList.toggle("is-error",!!e),r.classList.add("is-show"),G&&clearTimeout(G),G=setTimeout(()=>r.classList.remove("is-show"),2400))}function Gt(){const t=document.getElementById("avatar-username");if(!t)return;const e=document.getElementById("my-name"),r=e?e.textContent.trim():"";if(r&&r!=="사용자 이름"){t.textContent=r;return}try{const a=localStorage.getItem(ft);if(a){const s=JSON.parse(a);if(s&&s.username){t.textContent=s.username;return}}}catch{}fetch(`${T}/api/me`,{credentials:"include"}).then(a=>a.ok?a.json():null).then(a=>{if(a&&a.user&&a.user.username){const s=document.getElementById("avatar-username");s&&(s.textContent=a.user.username)}}).catch(()=>{})}function rt(){H()?Ft():St()}let mt=!1;async function K(){if(mt=!0,rt(),H()){const t=await Mt();t&&(o=t,P=!1,ut(),O(),E(),S()),await _t(),E()}}window.addEventListener("codenergy:auth",K);H()?K():setTimeout(()=>{mt||K()},2e3);const ot=document.getElementById("my-wrap");ot&&new MutationObserver(()=>rt()).observe(ot,{attributes:!0,attributeFilter:["hidden"]});
