import"./main-BLTUPEoH.js";function c(t,e=.25){if(typeof t!="string"||!t.startsWith("#")||t.length!==7&&t.length!==4)return t;let r=t.length===4?"#"+t.slice(1).split("").map(u=>u+u).join(""):t;const s=parseInt(r.slice(1,3),16),o=parseInt(r.slice(3,5),16),l=parseInt(r.slice(5,7),16),a=Math.max(0,Math.min(1,1-e)),f=Math.round(s*a).toString(16).padStart(2,"0"),b=Math.round(o*a).toString(16).padStart(2,"0"),v=Math.round(l*a).toString(16).padStart(2,"0");return`#${f}${b}${v}`}const V=[{id:"top-tshirt-white",name:"흰 티셔츠",category:"top",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 20 L24 14 L32 18 L40 14 L50 20 L46 28 L42 26 L42 52 L22 52 L22 26 L18 28 Z"
              fill="#ffffff" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
      </svg>`,svgFragment:(t="#ffffff")=>{const e=c(t,.18);return`
      <g class="outfit-top top-tshirt-white">
        <path d="M74 215 C88 196 132 190 160 190 C188 190 232 196 246 215
                 L246 245 C240 255 232 275 232 280 L232 350 L100 350 L100 280 C90 255 84 245 74 245 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M100 219 Q160 245 220 219" fill="none" stroke="${e}" stroke-width="2"/>
      </g>`}},{id:"top-hoodie-purple",name:"후드티",category:"top",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 22 L22 14 Q32 10 42 14 L50 22 L46 30 L42 28 L42 54 L22 54 L22 28 L18 30 Z"
              fill="#a855f7" stroke="#7c3aed" stroke-width="2" stroke-linejoin="round"/>
        <path d="M22 14 Q32 22 42 14 Q40 22 32 24 Q24 22 22 14 Z" fill="#7c3aed"/>
        <line x1="32" y1="30" x2="32" y2="48" stroke="#7c3aed" stroke-width="2"/>
      </svg>`,svgFragment:(t="#a855f7")=>{const e=c(t,.25);return`
      <g class="outfit-top top-hoodie-purple">
        <path d="M84 215 C98 196 132 190 160 190 C188 190 222 196 236 215
                 L244 245 C240 255 232 275 232 280 L232 352 L100 352 L100 280 C90 255 86 245 84 245 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M84 216 C78 236 82 275 100 280 L100 352 L84 352 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M236 216 C242 236 238 275 220 280 L220 352 L236 352 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M100 219 Q160 245 220 219" fill="none" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
        <path d="M116 290 L204 290 L198 326 L122 326 Z" fill="none" stroke="${e}" stroke-width="3"/>
        <line x1="130" y1="244" x2="130" y2="280" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
        <line x1="190" y1="244" x2="190" y2="280" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
      </g>`}},{id:"top-shirt-formal",name:"정장 셔츠",category:"top",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 20 L24 14 L32 22 L40 14 L50 20 L46 28 L42 26 L42 54 L22 54 L22 26 L18 28 Z"
              fill="#f8fafc" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
        <path d="M28 16 L32 28 L36 16 Z" fill="#22c55e"/>
        <line x1="32" y1="28" x2="32" y2="50" stroke="#cbd5e1" stroke-width="1.5"/>
        <circle cx="32" cy="34" r="1" fill="#94a3b8"/>
        <circle cx="32" cy="42" r="1" fill="#94a3b8"/>
      </svg>`,svgFragment:(t="#f8fafc")=>{const e=c(t,.25),r=c(t,.1);return`
      <g class="outfit-top top-shirt-formal">
        <path d="M74 215 C88 196 132 190 160 190 C188 190 232 196 246 215
                 L246 245 C240 255 232 275 232 280 L232 350 L100 350 L100 280 C90 255 84 245 74 245 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M138 219 L160 251 L182 219 L172 213 L160 227 L148 213 Z" fill="${r}" stroke="${e}" stroke-width="2"/>
        <path d="M155 239 L165 239 L168 247 L162 259 L158 259 L152 247 Z" fill="#22c55e"/>
        <path d="M158 259 L162 259 L168 327 L152 327 Z" fill="#16a34a"/>
        <line x1="160" y1="261" x2="160" y2="339" stroke="${e}" stroke-width="1.5"/>
        <circle cx="160" cy="283" r="2" fill="${e}"/>
        <circle cx="160" cy="305" r="2" fill="${e}"/>
        <circle cx="160" cy="327" r="2" fill="${e}"/>
      </g>`}},{id:"top-hoodie-black",name:"까만 후디",category:"top",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 22 L22 14 Q32 10 42 14 L50 22 L46 30 L42 28 L42 54 L22 54 L22 28 L18 30 Z"
              fill="#1f2937" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <path d="M22 14 Q32 22 42 14 Q40 22 32 24 Q24 22 22 14 Z" fill="#0f172a"/>
        <line x1="32" y1="30" x2="32" y2="48" stroke="#0f172a" stroke-width="2"/>
      </svg>`,svgFragment:(t="#1f2937")=>{const e=c(t,.25);return`
      <g class="outfit-top top-hoodie-black">
        <path d="M84 215 C98 196 132 190 160 190 C188 190 222 196 236 215
                 L244 245 C240 255 232 275 232 280 L232 352 L100 352 L100 280 C90 255 86 245 84 245 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M84 216 C78 236 82 275 100 280 L100 352 L84 352 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M236 216 C242 236 238 275 220 280 L220 352 L236 352 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M100 219 Q160 245 220 219" fill="none" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
        <path d="M116 290 L204 290 L198 326 L122 326 Z" fill="none" stroke="${e}" stroke-width="3"/>
        <line x1="130" y1="244" x2="130" y2="280" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
        <line x1="190" y1="244" x2="190" y2="280" stroke="${e}" stroke-width="3" stroke-linecap="round"/>
      </g>`}}],X=[{id:"bottom-jeans-blue",name:"청바지",category:"bottom",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M18 12 L46 12 L48 32 L40 56 L34 56 L32 32 L30 56 L24 56 L16 32 Z"
              fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" stroke-linejoin="round"/>
        <line x1="32" y1="14" x2="32" y2="32" stroke="#1d4ed8" stroke-width="1.5"/>
        <rect x="20" y="14" width="24" height="4" fill="#1d4ed8"/>
      </svg>`,svgFragment:(t="#3b82f6")=>{const e=c(t,.3);return`
      <g class="outfit-bottom bottom-jeans-blue">
        <path d="M100 340 L220 340 L222 372 L185 460 L175 460 L160 380 L160 376 L150 380 L145 460 L135 460 L98 372 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <rect x="100" y="340" width="120" height="10" fill="${e}"/>
        <line x1="160" y1="350" x2="160" y2="378" stroke="${e}" stroke-width="2"/>
        <line x1="150" y1="386" x2="145" y2="456" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3"/>
        <line x1="170" y1="386" x2="175" y2="456" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3"/>
      </g>`}},{id:"bottom-shorts",name:"반바지",category:"bottom",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M18 16 L46 16 L46 38 L38 44 L34 38 L32 30 L30 38 L26 44 L18 38 Z"
              fill="#22c55e" stroke="#16a34a" stroke-width="2" stroke-linejoin="round"/>
        <rect x="20" y="18" width="24" height="3" fill="#16a34a"/>
      </svg>`,svgFragment:(t="#22c55e")=>{const e=c(t,.3);return`
      <g class="outfit-bottom bottom-shorts">
        <path d="M100 340 L220 340 L220 360 L185 420 L175 420 L160 380 L160 376 L150 380 L145 420 L135 420 L100 360 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <rect x="100" y="340" width="120" height="8" fill="${e}"/>
        <line x1="160" y1="348" x2="160" y2="378" stroke="${e}" stroke-width="2"/>
      </g>`}},{id:"bottom-slacks",name:"슬랙스",category:"bottom",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M18 12 L46 12 L48 32 L40 56 L34 56 L32 32 L30 56 L24 56 L16 32 Z"
              fill="#1f2937" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
        <line x1="32" y1="14" x2="32" y2="56" stroke="#0f172a" stroke-width="1.2"/>
      </svg>`,svgFragment:(t="#1f2937")=>{const e=c(t,.35),r=c(t,.15);return`
      <g class="outfit-bottom bottom-slacks">
        <path d="M100 340 L220 340 L222 372 L185 460 L175 460 L160 380 L160 376 L150 380 L145 460 L135 460 L98 372 Z"
              fill="${t}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/>
        <rect x="100" y="340" width="120" height="8" fill="${e}"/>
        <line x1="145" y1="386" x2="140" y2="456" stroke="${r}" stroke-width="1.5"/>
        <line x1="175" y1="386" x2="180" y2="456" stroke="${r}" stroke-width="1.5"/>
      </g>`}}],tt=[{id:"hat-beanie",name:"비니",category:"hat",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 36 Q14 14 32 14 Q50 14 50 36 Z" fill="#a855f7" stroke="#7c3aed" stroke-width="2"/>
        <rect x="12" y="34" width="40" height="8" rx="3" fill="#7c3aed"/>
        <circle cx="32" cy="14" r="4" fill="#fde68a" stroke="#f59e0b" stroke-width="1.5"/>
      </svg>`,svgFragment:(t="#a855f7")=>{const e=c(t,.3);return`
      <g class="outfit-hat hat-beanie">
        <path d="M86 124 Q86 56 160 52 Q234 56 234 124 Z" fill="${t}" stroke="${e}" stroke-width="3"/>
        <rect x="84" y="118" width="152" height="22" rx="8" fill="${e}"/>
        <circle cx="160" cy="50" r="14" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
      </g>`}},{id:"hat-cap",name:"야구모자",category:"hat",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M14 38 Q14 18 32 18 Q50 18 50 38 Z" fill="#22c55e" stroke="#16a34a" stroke-width="2"/>
        <ellipse cx="40" cy="40" rx="20" ry="5" fill="#16a34a"/>
        <text x="32" y="32" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="#fff">C</text>
      </svg>`,svgFragment:(t="#22c55e")=>{const e=c(t,.3);return`
      <g class="outfit-hat hat-cap">
        <path d="M86 130 Q86 64 160 60 Q234 64 234 130 Z" fill="${t}" stroke="${e}" stroke-width="3"/>
        <ellipse cx="190" cy="136" rx="68" ry="12" fill="${e}"/>
        <text x="160" y="112" text-anchor="middle" font-family="Arial,sans-serif" font-size="40" font-weight="800" fill="#ffffff">C</text>
      </g>`}},{id:"hat-beret",name:"베레모",category:"hat",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <ellipse cx="32" cy="28" rx="20" ry="12" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
        <ellipse cx="32" cy="36" rx="14" ry="3" fill="#7f1d1d"/>
        <circle cx="42" cy="20" r="3" fill="#7f1d1d"/>
      </svg>`,svgFragment:(t="#dc2626")=>{const e=c(t,.35);return`
      <g class="outfit-hat hat-beret">
        <ellipse cx="160" cy="92" rx="82" ry="40" fill="${t}" stroke="${e}" stroke-width="3"/>
        <ellipse cx="160" cy="120" rx="60" ry="9" fill="${e}"/>
        <circle cx="200" cy="60" r="8" fill="${e}"/>
      </g>`}}],et=[{id:"face-smile",name:"웃는얼굴",category:"face",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="24" cy="28" r="3" fill="#1f2937"/>
        <circle cx="40" cy="28" r="3" fill="#1f2937"/>
        <path d="M22 38 Q32 48 42 38" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>`,svgFragment:()=>`
      <g class="outfit-face face-smile">
        <circle cx="138" cy="128" r="5.5" fill="#1f2937"/>
        <circle cx="182" cy="128" r="5.5" fill="#1f2937"/>
        <circle cx="140" cy="126" r="1.6" fill="#ffffff"/>
        <circle cx="184" cy="126" r="1.6" fill="#ffffff"/>
        <circle cx="124" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <circle cx="196" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <path d="M138 158 Q160 178 182 158" stroke="#1f2937" stroke-width="3.5"
              fill="none" stroke-linecap="round"/>
      </g>`},{id:"face-serious",name:"진지한얼굴",category:"face",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <rect x="20" y="26" width="8" height="3" rx="1.5" fill="#1f2937"/>
        <rect x="36" y="26" width="8" height="3" rx="1.5" fill="#1f2937"/>
        <line x1="26" y1="42" x2="38" y2="42" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,svgFragment:()=>`
      <g class="outfit-face face-serious">
        <rect x="128" y="126" width="22" height="5" rx="2.5" fill="#1f2937"/>
        <rect x="170" y="126" width="22" height="5" rx="2.5" fill="#1f2937"/>
        <line x1="146" y1="166" x2="174" y2="166" stroke="#1f2937" stroke-width="3.5" stroke-linecap="round"/>
      </g>`},{id:"face-wink",name:"윙크",category:"face",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M20 28 Q24 24 28 28" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="40" cy="28" r="3" fill="#1f2937"/>
        <path d="M22 38 Q32 46 42 38" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>`,svgFragment:()=>`
      <g class="outfit-face face-wink">
        <path d="M128 130 Q138 122 148 130" stroke="#1f2937" stroke-width="4"
              fill="none" stroke-linecap="round"/>
        <circle cx="182" cy="128" r="5.5" fill="#1f2937"/>
        <circle cx="184" cy="126" r="1.6" fill="#ffffff"/>
        <circle cx="124" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <circle cx="196" cy="148" r="7" fill="#fca5a5" opacity="0.55"/>
        <path d="M138 160 Q160 176 182 160" stroke="#1f2937" stroke-width="3.5"
              fill="none" stroke-linecap="round"/>
      </g>`},{id:"face-glasses",name:"안경 표정",category:"face",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="22" cy="30" r="6" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
        <circle cx="42" cy="30" r="6" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
        <line x1="28" y1="30" x2="36" y2="30" stroke="#1f2937" stroke-width="2"/>
        <path d="M22 42 Q32 48 42 42" stroke="#1f2937" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>`,svgFragment:()=>`
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
      </g>`}],rt=[{id:"hair-short",name:"짧은머리",category:"hair",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="36" r="22" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M14 30 Q14 12 32 10 Q50 12 50 30 Q42 22 32 22 Q22 22 14 30 Z" fill="#1f2937"/>
      </svg>`,svgFragment:(t="#1f2937")=>{const e=c(t,.3);return`
      <g class="outfit-hair hair-short">
        <path d="M82 120 Q86 45 160 39 Q234 45 238 120
                 Q226 96 208 92 Q188 100 160 96 Q132 96 120 102
                 Q98 100 90 110 Z"
              fill="${t}"/>
        <path d="M110 96 Q130 55 188 61 Q176 88 160 92 Q142 92 110 96 Z" fill="${e}"/>
      </g>`}},{id:"hair-long",name:"긴머리",category:"hair",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="34" r="20" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M10 30 Q10 8 32 8 Q54 8 54 30 L54 50 L46 46 L46 30 Q46 16 32 16 Q18 16 18 30 L18 46 L10 50 Z" fill="#5b3a1d"/>
      </svg>`,svgFragment:(t="#5b3a1d")=>{const e=c(t,.25);return`
      <g class="outfit-hair hair-long">
        <path d="M76 130 Q72 41 160 35 Q248 41 244 130
                 L250 260 L232 266 L228 220 L228 132
                 Q210 100 160 96 Q110 100 92 132 L92 220 L88 266 L70 260 Z"
              fill="${t}"/>
        <path d="M110 96 Q130 55 188 61 Q176 88 160 92 Q142 92 110 96 Z" fill="${e}"/>
      </g>`}},{id:"hair-curly",name:"곱슬머리",category:"hair",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="32" cy="36" r="20" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="18" cy="22" r="8" fill="#8b5e34"/>
        <circle cx="32" cy="14" r="9" fill="#8b5e34"/>
        <circle cx="46" cy="22" r="8" fill="#8b5e34"/>
        <circle cx="14" cy="32" r="6" fill="#8b5e34"/>
        <circle cx="50" cy="32" r="6" fill="#8b5e34"/>
      </svg>`,svgFragment:(t="#8b5e34")=>`
      <g class="outfit-hair hair-curly">
        <circle cx="85" cy="85" r="26" fill="${t}"/>
        <circle cx="115" cy="61"  r="30" fill="${t}"/>
        <circle cx="160" cy="47"  r="32" fill="${t}"/>
        <circle cx="205" cy="61"  r="30" fill="${t}"/>
        <circle cx="235" cy="85" r="26" fill="${t}"/>
        <circle cx="77"  cy="128" r="22" fill="${t}"/>
        <circle cx="243" cy="128" r="22" fill="${t}"/>
        <circle cx="75"  cy="150" r="18" fill="${t}"/>
        <circle cx="245" cy="150" r="18" fill="${t}"/>
      </g>`},{id:"hair-ponytail",name:"포니테일",category:"hair",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="30" cy="34" r="20" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M10 30 Q10 8 30 8 Q50 8 50 28 Q42 20 32 20 Q20 20 14 30 Z" fill="#c9a47a"/>
        <ellipse cx="54" cy="40" rx="8" ry="14" fill="#c9a47a"/>
      </svg>`,svgFragment:(t="#c9a47a")=>{const e=c(t,.2);return`
      <g class="outfit-hair hair-ponytail">
        <path d="M86 122 Q90 41 160 37 Q240 41 238 122
                 Q228 98 208 92 Q188 100 160 96 Q132 96 120 102
                 Q98 100 90 110 Z"
              fill="${t}"/>
        <ellipse cx="242" cy="164" rx="18" ry="42" fill="${t}" stroke="${e}" stroke-width="2"/>
        <path d="M236 138 Q244 154 242 164" stroke="${e}" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>`}}],it=[{id:"glasses-round",name:"동그란 안경",category:"glasses",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="22" cy="32" r="10" fill="none" stroke="#000000" stroke-width="3"/>
        <circle cx="42" cy="32" r="10" fill="none" stroke="#000000" stroke-width="3"/>
        <line x1="32" y1="32" x2="32" y2="32" stroke="#000000" stroke-width="3"/>
        <line x1="32" y1="32" x2="32" y2="32" stroke="#000000" stroke-width="3"/>
        <line x1="12" y1="30" x2="6" y2="30" stroke="#000000" stroke-width="3"/>
        <line x1="52" y1="30" x2="58" y2="30" stroke="#000000" stroke-width="3"/>
      </svg>`,svgFragment:(t="#000000")=>`
      <g class="outfit-glasses glasses-round">
        <circle cx="138" cy="130" r="14" fill="#ffffff" fill-opacity="0.2" stroke="${t}" stroke-width="3"/>
        <circle cx="182" cy="130" r="14" fill="#ffffff" fill-opacity="0.2" stroke="${t}" stroke-width="3"/>
        <line x1="152" y1="130" x2="168" y2="130" stroke="${t}" stroke-width="3"/>
        <line x1="124" y1="128" x2="96"  y2="130" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
        <line x1="196" y1="128" x2="224" y2="130" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
      </g>`},{id:"glasses-square",name:"뿔테 안경",category:"glasses",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <rect x="10" y="22" width="20" height="16" rx="2" fill="none" stroke="#000000" stroke-width="3"/>
        <rect x="34" y="22" width="20" height="16" rx="2" fill="none" stroke="#000000" stroke-width="3"/>
        <line x1="30" y1="30" x2="34" y2="30" stroke="#000000" stroke-width="3"/>
      </svg>`,svgFragment:(t="#1f2937")=>`
      <g class="outfit-glasses glasses-square">
        <rect x="122" y="116" width="32" height="26" rx="3" fill="#ffffff" fill-opacity="0.18" stroke="${t}" stroke-width="4"/>
        <rect x="166" y="116" width="32" height="26" rx="3" fill="#ffffff" fill-opacity="0.18" stroke="${t}" stroke-width="4"/>
        <line x1="154" y1="129" x2="166" y2="129" stroke="${t}" stroke-width="4"/>
        <line x1="122" y1="124" x2="96"  y2="128" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
        <line x1="198" y1="124" x2="224" y2="128" stroke="${t}" stroke-width="3" stroke-linecap="round"/>
      </g>`},{id:"glasses-clear",name:"투명 안경",category:"glasses",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="22" cy="32" r="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="42" cy="32" r="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
        <line x1="32" y1="32" x2="32" y2="32" stroke="#94a3b8" stroke-width="2"/>
      </svg>`,svgFragment:(t="#94a3b8")=>`
      <g class="outfit-glasses glasses-clear">
        <circle cx="138" cy="130" r="14" fill="#ffffff" fill-opacity="0.15" stroke="${t}" stroke-width="2"/>
        <circle cx="182" cy="130" r="14" fill="#ffffff" fill-opacity="0.15" stroke="${t}" stroke-width="2"/>
        <line x1="152" y1="130" x2="168" y2="130" stroke="${t}" stroke-width="2"/>
        <line x1="124" y1="128" x2="98"  y2="130" stroke="${t}" stroke-width="2" stroke-linecap="round"/>
        <line x1="196" y1="128" x2="222" y2="130" stroke="${t}" stroke-width="2" stroke-linecap="round"/>
      </g>`}],st=[{id:"earrings-stud",name:"귀고리",category:"earrings",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="20" cy="40" r="6" fill="#fcd34d" stroke="#92400e" stroke-width="2"/>
        <circle cx="44" cy="40" r="6" fill="#fcd34d" stroke="#92400e" stroke-width="2"/>
      </svg>`,svgFragment:(t="#fcd34d")=>{const e=c(t,.45);return`
      <g class="outfit-earrings earrings-stud">
        <circle cx="82"  cy="146" r="4.5" fill="${t}" stroke="${e}" stroke-width="1.5"/>
        <circle cx="238" cy="146" r="4.5" fill="${t}" stroke="${e}" stroke-width="1.5"/>
      </g>`}},{id:"earrings-hoop",name:"링 귀걸이",category:"earrings",thumbnail:`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <circle cx="20" cy="40" r="8" fill="none" stroke="#fcd34d" stroke-width="3"/>
        <circle cx="44" cy="40" r="8" fill="none" stroke="#fcd34d" stroke-width="3"/>
      </svg>`,svgFragment:(t="#fcd34d")=>`
      <g class="outfit-earrings earrings-hoop">
        <circle cx="82"  cy="152" r="8" fill="none" stroke="${t}" stroke-width="3"/>
        <circle cx="238" cy="152" r="8" fill="none" stroke="${t}" stroke-width="3"/>
      </g>`}],j=[...V,...X,...tt,...et,...rt,...it,...st],ot=new Map(j.map(t=>[t.id,t]));function I(t){return t==null?null:ot.get(t)||null}function at(t){return j.filter(e=>e.category===t)}function N(t,e){if(!t)return"";const r=t.svgFragment;return typeof r=="function"?r(e):typeof r=="string"?r:""}const k=[{id:"tone-1",label:"가장 밝은",base:"#fff5d6",shadow:"#fce8a4"},{id:"tone-2",label:"밝은 톤",base:"#fde68a",shadow:"#fbbf24"},{id:"tone-3",label:"중간 톤",base:"#f4c084",shadow:"#d97706"},{id:"tone-4",label:"구릿빛 톤",base:"#c89878",shadow:"#92622f"},{id:"tone-5",label:"어두운 톤",base:"#8b5a3c",shadow:"#5a3a25"},{id:"tone-6",label:"가장 어두운",base:"#5a3a25",shadow:"#3a2415"}],O="tone-2";function lt(t){return k.find(e=>e.id===t)||k.find(e=>e.id===O)||k[0]}const nt=(t,e)=>`
  <g class="char-legs">
    <rect x="132" y="340" width="22" height="110" rx="11" fill="${t}" stroke="${e}" stroke-width="2"/>
    <rect x="166" y="340" width="22" height="110" rx="11" fill="${t}" stroke="${e}" stroke-width="2"/>
    <ellipse cx="143" cy="456" rx="18" ry="8" fill="#1f2937"/>
    <ellipse cx="177" cy="456" rx="18" ry="8" fill="#1f2937"/>
  </g>
`,ct=(t,e)=>`
  <g class="char-body">
    <rect x="148" y="200" width="24" height="22" rx="6" fill="${t}" stroke="${e}" stroke-width="2"/>
    <path d="M104 220 Q104 212 116 210 L204 210 Q216 212 216 220 L220 340 L100 340 Z"
          fill="${t}" stroke="${e}" stroke-width="2" stroke-linejoin="round"/>
  </g>
`,ft=(t,e)=>`
  <g class="char-arms">
    <rect x="74" y="222" width="28" height="110" rx="14" fill="${t}" stroke="${e}" stroke-width="2"/>
    <rect x="218" y="222" width="28" height="110" rx="14" fill="${t}" stroke="${e}" stroke-width="2"/>
    <circle cx="88"  cy="338" r="14" fill="${t}" stroke="${e}" stroke-width="2"/>
    <circle cx="232" cy="338" r="14" fill="${t}" stroke="${e}" stroke-width="2"/>
  </g>
`,dt=(t,e)=>`
  <g class="char-head">
    <ellipse cx="84"  cy="134" rx="9"  ry="14" fill="${t}" stroke="${e}" stroke-width="2"/>
    <ellipse cx="236" cy="134" rx="9"  ry="14" fill="${t}" stroke="${e}" stroke-width="2"/>
    <circle cx="160" cy="130" r="78" fill="${t}" stroke="${e}" stroke-width="2.5"/>
  </g>
`,ht=`
  <g class="char-face char-face--default">
    <circle cx="138" cy="128" r="5" fill="#1f2937"/>
    <circle cx="182" cy="128" r="5" fill="#1f2937"/>
    <circle cx="140" cy="126" r="1.4" fill="#ffffff"/>
    <circle cx="184" cy="126" r="1.4" fill="#ffffff"/>
    <path d="M144 158 Q160 170 176 158" stroke="#1f2937" stroke-width="3"
          fill="none" stroke-linecap="round"/>
  </g>
`,gt=`
  <ellipse cx="160" cy="464" rx="74" ry="9" fill="#000" opacity="0.08"/>
`;function ut(t){const e=t||"default";if(e==="default")return"";const s={sky:["#bae6fd","#e0f2fe"],sunset:["#fbbf24","#fb7185"],mint:["#a7f3d0","#ecfdf5"],lavender:["#ddd6fe","#f5f3ff"]}[e];if(!s)return"";const o=`avatar-bg-${e}`;return`
    <defs>
      <linearGradient id="${o}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${s[0]}"/>
        <stop offset="1" stop-color="${s[1]}"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="320" height="480" fill="url(#${o})"/>
  `}function L(t,e){return Array.isArray(t)&&t.find(r=>r&&r.type===e)||null}function y(t,e){if(!t||!t.style)return"";const r=I(t.style);return!r||r.category!==e?"":N(r,t.color)}function $(t){if(!t||!t.style)return"";const e=I(t.style);return!e||e.category!==t.type?"":N(e,t.color)}function yt(t={}){const e=p(t),r=lt(e.skinTone),s=r.base,o=r.shadow,l=ut(e.background),a=y(e.top,"top"),f=y(e.bottom,"bottom"),b=y(e.hair,"hair"),v=y(e.face,"face"),u=L(e.accessories,"hat"),J=L(e.accessories,"glasses"),K=L(e.accessories,"earrings"),Y=$(u),P=$(J),W=$(K),z=v||ht;return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480"
     class="codenergy-character"
     role="img" aria-label="Codenergy 아바타">
  ${l}
  ${gt}
  ${nt(s,o)}
  ${ct(s,o)}
  ${f}
  ${ft(s,o)}
  ${a}
  ${dt(s,o)}
  ${W}
  ${b}
  ${z}
  ${P}
  ${Y}
</svg>`.trim()}const n={hair:{style:"hair-short",color:"#1f2937"},top:{style:"top-tshirt-white",color:"#ffffff"},bottom:{style:"bottom-jeans-blue",color:"#3b82f6"},face:{style:"face-smile"},skinTone:O,accessories:[],background:"default"};function p(t){if(!t||typeof t!="object")return n;if(t.hair&&typeof t.hair=="object"||t.top&&typeof t.top=="object"||Array.isArray(t.accessories))return{hair:t.hair||n.hair,top:t.top||n.top,bottom:t.bottom||n.bottom,face:t.face||n.face,skinTone:t.skinTone||n.skinTone,accessories:Array.isArray(t.accessories)?t.accessories:[],background:t.background||n.background};const r=[];return t.hat&&r.push({type:"hat",style:t.hat,color:"#1f2937"}),{hair:n.hair,top:t.top?{style:t.top,color:T(t.top,"top")}:n.top,bottom:t.bottom?{style:t.bottom,color:T(t.bottom,"bottom")}:n.bottom,face:t.face?{style:t.face}:n.face,skinTone:t.skinTone||n.skinTone,accessories:r,background:n.background}}function T(t,e){if(e==="top"){if(t==="top-tshirt-white")return"#ffffff";if(t==="top-hoodie-purple")return"#a855f7";if(t==="top-shirt-formal")return"#f8fafc";if(t==="top-hoodie-black")return"#1f2937"}if(e==="bottom"){if(t==="bottom-jeans-blue")return"#3b82f6";if(t==="bottom-shorts")return"#22c55e";if(t==="bottom-slacks")return"#1f2937"}return"#3b82f6"}const q="http://localhost:3000",E="codenergy:avatar:config",A="codenergy:avatar:equipped",kt="codenergy:auth:hint",wt="codenergy:demo:user",Q=[{id:"hair",label:"헤어",hasColor:!0,allowNone:!1},{id:"top",label:"상의",hasColor:!0,allowNone:!1},{id:"bottom",label:"하의",hasColor:!0,allowNone:!1},{id:"face",label:"표정",hasColor:!1,allowNone:!1},{id:"hat",label:"모자",hasColor:!0,allowNone:!0},{id:"glasses",label:"안경",hasColor:!0,allowNone:!0},{id:"earrings",label:"귀걸이",hasColor:!0,allowNone:!0},{id:"skin",label:"피부톤",hasColor:!1,allowNone:!1},{id:"background",label:"배경",hasColor:!1,allowNone:!1}],d={hair:["#1f2937","#5b3a1d","#8b5e34","#c9a47a","#e6b34a","#9ca3af"],top:["#ffffff","#1f2937","#a855f7","#3b82f6","#ef4444","#10b981","#fbbf24"],bottom:["#1e3a8a","#374151","#3b82f6","#92400e","#ffffff"],hat:["#ef4444","#1f2937","#fbbf24","#10b981","#3b82f6","#a855f7"],glasses:["#000000","#374151","#92400e","#ef4444","#3b82f6"],earrings:["#fcd34d","#9ca3af","#ef4444","#3b82f6"]},pt=[{id:"default",label:"기본"},{id:"sky",label:"하늘"},{id:"sunset",label:"노을"},{id:"mint",label:"민트"},{id:"lavender",label:"라벤더"}],g=new Set(["hat","glasses","earrings"]);function xt(){try{return localStorage.getItem(kt)}catch{return null}}function mt(){try{return!!localStorage.getItem(wt)}catch{return!1}}function S(){const t=xt();if(t==="logged-in"||mt())return!0;if(t==="logged-out")return!1;const e=document.getElementById("my-wrap");return!!(e&&!e.hidden)}function bt(){try{const t=localStorage.getItem(A);if(t){try{const e=JSON.parse(t),r=p(e);localStorage.setItem(E,JSON.stringify(r))}catch{}try{localStorage.removeItem(A)}catch{}}}catch{}try{const t=localStorage.getItem(E);return t?p(JSON.parse(t)):C()}catch{return C()}}function B(){try{localStorage.setItem(E,JSON.stringify(i))}catch{}}function C(){return JSON.parse(JSON.stringify(n))}async function vt(){try{const t=await fetch(`${q}/api/avatar`,{method:"GET",credentials:"include"});if(!t.ok)return null;const e=await t.json().catch(()=>null);return e&&e.avatar?p(e.avatar):null}catch{return null}}async function Lt(){const t=await fetch(`${q}/api/avatar`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({avatar:i})});if(!t.ok){let e="save failed";try{const r=await t.json();r&&r.error&&(e=r.error)}catch{}throw new Error(e)}return t.json().catch(()=>({ok:!0}))}const H=document.getElementById("avatar-root");let i=bt(),x="hair",M=null;function $t(){H.innerHTML=`
    <div class="avatar-empty">
      <div class="avatar-empty__icon" aria-hidden="true">👤</div>
      <h2 class="avatar-empty__title">아바타를 꾸미려면 로그인이 필요해요</h2>
      <p class="avatar-empty__desc">나만의 캐릭터에 옷과 모자를 입혀보세요.</p>
      <button type="button" class="cta avatar-empty__cta" id="avatar-empty-login">로그인하기</button>
    </div>
  `;const t=document.getElementById("avatar-empty-login");t&&t.addEventListener("click",()=>{const e=document.getElementById("login-btn");e&&!e.hidden&&e.click()})}function Mt(){H.innerHTML=`
    <div class="avatar-page">
      <div class="avatar-stage">
        <div class="avatar-character" id="avatar-character"></div>
      </div>
      <div class="avatar-editor">
        <div class="avatar-tabs" id="avatar-tabs">
          ${Q.map(e=>`
            <button type="button"
                    class="avatar-tab${e.id===x?" is-active":""}"
                    data-cat="${e.id}">${e.label}</button>
          `).join("")}
        </div>
        <div class="avatar-grid" id="avatar-grid"></div>
        <div class="avatar-color-row" id="avatar-color-row"></div>
        <div class="avatar-actions">
          <button type="button" class="avatar-save-btn" id="avatar-save">저장</button>
          <button type="button" class="ghost" id="avatar-reset">초기화</button>
        </div>
      </div>
      <div class="avatar-toast" id="avatar-toast" role="status" aria-live="polite"></div>
    </div>
  `,m(),h(),document.getElementById("avatar-tabs").addEventListener("click",e=>{const r=e.target.closest(".avatar-tab");r&&(x=r.dataset.cat,h())}),document.getElementById("avatar-save").addEventListener("click",Bt);const t=document.getElementById("avatar-reset");t&&t.addEventListener("click",()=>{i=C(),B(),m(),h()})}function m(){const t=document.getElementById("avatar-character");t&&(t.innerHTML=yt(i))}function h(){const t=document.getElementById("avatar-tabs");t&&t.querySelectorAll(".avatar-tab").forEach(e=>{e.classList.toggle("is-active",e.dataset.cat===x)}),Et(),Qt()}function R(){return Q.find(t=>t.id===x)||Q[0]}function Et(){const t=document.getElementById("avatar-grid");if(!t)return;const e=R();if(e.id==="skin"){const l=k.map(a=>`
        <button type="button"
                class="avatar-item avatar-item--skin${i.skinTone===a.id?" is-equipped":""}"
                data-tone="${a.id}">
          <span class="avatar-item__thumb">
            <span class="avatar-item__thumb-skin" style="background-color: ${a.base};"></span>
          </span>
          <span class="avatar-item__label">${a.label}</span>
        </button>
      `);t.innerHTML=l.join(""),t.querySelectorAll(".avatar-item").forEach(a=>{a.addEventListener("click",()=>{i.skinTone=a.dataset.tone,w()})});return}if(e.id==="background"){const l=pt.map(a=>`
        <button type="button"
                class="avatar-item avatar-item--bg${(i.background||"default")===a.id?" is-equipped":""}"
                data-bg="${a.id}">
          <span class="avatar-item__thumb avatar-item__thumb--bg-${a.id}"></span>
          <span class="avatar-item__label">${a.label}</span>
        </button>
      `);t.innerHTML=l.join(""),t.querySelectorAll(".avatar-item").forEach(a=>{a.addEventListener("click",()=>{i.background=a.dataset.bg,w()})});return}const r=at(e.id)||[],s=G(e.id),o=[];if(e.allowNone){const l=s==null;o.push(`
      <button type="button"
              class="avatar-item${l?" is-equipped":""}"
              data-id="__none__">
        <span class="avatar-item__thumb" aria-hidden="true">∅</span>
        <span class="avatar-item__label">없음</span>
      </button>
    `)}r.forEach(l=>{const a=s===l.id;o.push(`
      <button type="button"
              class="avatar-item${a?" is-equipped":""}"
              data-id="${l.id}">
        <span class="avatar-item__thumb">${l.thumbnail||""}</span>
        <span class="avatar-item__label">${l.name||""}</span>
      </button>
    `)}),t.innerHTML=o.join(""),t.querySelectorAll(".avatar-item").forEach(l=>{l.addEventListener("click",()=>{const a=l.dataset.id;_t(e.id,a==="__none__"?null:a),w()})})}function Qt(){const t=document.getElementById("avatar-color-row");if(!t)return;const e=R();if(!e.hasColor){t.innerHTML="";return}const r=d[e.id]||[],s=Ct(e.id);if(g.has(e.id)&&G(e.id)==null){t.innerHTML="";return}t.innerHTML=r.map(o=>`
    <button type="button"
            class="avatar-color-chip${s&&s.toLowerCase()===o.toLowerCase()?" is-selected":""}"
            style="background-color: ${o};"
            data-color="${o}"
            aria-label="${o}"></button>
  `).join(""),t.querySelectorAll(".avatar-color-chip").forEach(o=>{o.addEventListener("click",()=>{St(e.id,o.dataset.color),w()})})}function G(t){if(t==="face")return i.face?i.face.style:null;if(t==="hair")return i.hair?i.hair.style:null;if(t==="top")return i.top?i.top.style:null;if(t==="bottom")return i.bottom?i.bottom.style:null;if(g.has(t)){const e=(i.accessories||[]).find(r=>r&&r.type===t);return e?e.style:null}return null}function Ct(t){if(t==="hair")return i.hair?i.hair.color:null;if(t==="top")return i.top?i.top.color:null;if(t==="bottom")return i.bottom?i.bottom.color:null;if(g.has(t)){const e=(i.accessories||[]).find(r=>r&&r.type===t);return e?e.color:null}return null}function _t(t,e){if(t==="face"){e==null?i.face={...n.face}:i.face={style:e};return}if(t==="hair"||t==="top"||t==="bottom"){if(e==null)i[t]={...n[t]};else{const s=(i[t]||{}).color||d[t]&&d[t][0]||"#000000";i[t]={style:e,color:s}}return}if(g.has(t)){const r=Array.isArray(i.accessories)?i.accessories.slice():[],s=r.findIndex(o=>o&&o.type===t);if(e==null)s>=0&&r.splice(s,1);else{const o=s>=0&&r[s].color||d[t]&&d[t][0]||"#000000",l={type:t,style:e,color:o};s>=0?r[s]=l:r.push(l)}i.accessories=r}}function St(t,e){if(t==="hair"||t==="top"||t==="bottom"){i[t]||(i[t]={...n[t]}),i[t]={...i[t],color:e};return}if(g.has(t)){const r=Array.isArray(i.accessories)?i.accessories.slice():[],s=r.findIndex(o=>o&&o.type===t);if(s<0)return;r[s]={...r[s],color:e},i.accessories=r}}function w(){B(),m(),h()}async function Bt(){const t=document.getElementById("avatar-save");t&&(t.disabled=!0);try{await Lt(),F("저장 완료",!1)}catch{F("저장 실패",!0)}finally{t&&(t.disabled=!1)}}function F(t,e){const r=document.getElementById("avatar-toast");r&&(r.textContent=t,r.classList.toggle("is-error",!!e),r.classList.add("is-show"),M&&clearTimeout(M),M=setTimeout(()=>{r.classList.remove("is-show")},2400))}function D(){S()?Mt():$t()}let U=!1;async function _(){if(U=!0,D(),S()){const t=await vt();t&&(i=t,B(),m(),h())}}window.addEventListener("codenergy:auth",_);S()?_():setTimeout(()=>{U||_()},2e3);const Z=document.getElementById("my-wrap");Z&&new MutationObserver(()=>D()).observe(Z,{attributes:!0,attributeFilter:["hidden"]});
