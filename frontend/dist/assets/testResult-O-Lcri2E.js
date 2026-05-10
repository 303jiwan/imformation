import"./main-CousPi8R.js";import{T as E,P as v}from"./test-problems-D2aXybzh.js";const f="codenergy:test:progress",S="codenergy:test:answers",C="codenergy:test:timer",b=document.getElementById("page-fade"),L=document.getElementById("result-shell");function P(){try{const s=sessionStorage.getItem(f);if(s){const a=JSON.parse(s);if(typeof(a==null?void 0:a.current)=="number")return{current:a.current,total:a.total??E}}}catch{}return{current:1,total:E}}function R(s){try{sessionStorage.setItem(f,JSON.stringify(s))}catch{}}function A(){try{const s=sessionStorage.getItem(S);return s?JSON.parse(s):{}}catch{return{}}}const j={correct:{chip:"정답",chipClass:"result-hero__chip--correct",icon:"🎉",title:["훌륭해요!","완벽해요!","잘 풀어내셨어요!"],sub:"모든 테스트 케이스를 통과했습니다. 다음 문제도 그대로 가봐요.",enc:["이 흐름이라면 다음 문제도 무리 없겠어요.","한 번에 통과! 자신감을 가지고 가도 좋습니다.","정확하고 깔끔하네요 — 그대로 진행해주세요."]},wrong:{chip:"오답",chipClass:"result-hero__chip--wrong",icon:"💡",title:["조금만 더!","거의 다 왔어요.","다시 한 번 차분히."],sub:"일부 케이스에서 기대 출력과 달랐어요. 정답 코드와 비교해보면서 다음에 적용해보세요.",enc:["오답은 가장 좋은 학습 재료예요. 다음 문제는 더 잘 풀 수 있을 거예요.","한 발 한 발 나아가고 있어요. 흐름을 잃지 마세요.","비교 코드의 패턴을 메모해두면 다음에 큰 도움이 돼요."]},timeout:{chip:"시간 초과",chipClass:"result-hero__chip--timeout",icon:"⏳",title:["시간이 부족했어요.","아쉽게 시간 초과!","다음엔 페이스 조절!"],sub:"10분 안에 제출하지 못해 자동 제출되었습니다. 정답 코드를 살펴보고 흐름을 익혀보세요.",enc:["속도는 익숙해지면 자연스럽게 따라옵니다.","처음엔 누구나 시간이 빠듯해요 — 다음 문제로 가볼까요?","다음엔 1분 단위로 나눠서 풀어보세요."]},missing:{chip:"미제출",chipClass:"result-hero__chip--wrong",icon:"🤔",title:["제출 기록이 없어요"],sub:"이 문제를 풀고 결과 페이지로 돌아온 게 맞나요? 다시 시도하려면 처음부터 시작해주세요.",enc:["메인으로 돌아가 다시 시작할 수 있어요."]}};function x(s){return s[Math.floor(Math.random()*s.length)]}function m(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function N(s,a){var d;const e=v.find(u=>u.id===s.current)??v[0],t=a[e.id],l=(t==null?void 0:t.verdict)||"missing",c=j[l],_=(t==null?void 0:t.code)??"// (제출된 코드가 없습니다)",p=e.solution,i=((d=t==null?void 0:t.cases)==null?void 0:d.length)??0,h=s.current>=s.total;L.innerHTML=`
    <div class="result-hero">
      <span class="result-hero__chip ${c.chipClass}">${c.chip}</span>
      <div class="result-hero__icon" aria-hidden="true">${c.icon}</div>
      <h1 class="result-hero__title">${x(c.title)}</h1>
      <p class="result-hero__sub">${c.sub}</p>
      <div class="result-hero__meta">
        <span>문제 <strong>${e.id} / ${s.total}</strong></span>
        <span>·</span>
        <span><strong>${e.title}</strong></span>
        ${l==="correct"?`<span>·</span><span>테스트 케이스 <strong>${i}/${i}</strong> 통과</span>`:l==="wrong"?"<span>·</span><span>테스트 케이스 일부 실패</span>":""}
      </div>
    </div>

    <div class="result-compare">
      <div class="code-card">
        <div class="code-card__head">
          <span>내가 작성한 코드</span>
          <span class="code-card__badge code-card__badge--mine">MY CODE</span>
        </div>
        <pre class="code-card__body">${m(_)}</pre>
      </div>
      <div class="code-card">
        <div class="code-card__head">
          <span>참고 정답 코드</span>
          <span class="code-card__badge code-card__badge--ans">REFERENCE</span>
        </div>
        <pre class="code-card__body">${m(p)}</pre>
      </div>
    </div>

    <div class="result-encouragement">
      <span class="result-encouragement__icon" aria-hidden="true">💪</span>
      <p class="result-encouragement__text">
        <strong>${x(c.enc)}</strong>
      </p>
    </div>

    <div class="result-actions">
      <button type="button" class="result-back" id="exit-btn">테스트 종료하고 메인으로</button>
      ${h?'<button type="button" class="result-next result-next--final" id="next-btn">최종 결과 보기 →</button>':'<button type="button" class="result-next" id="next-btn">다음 문제 풀기 →</button>'}
    </div>
  `,document.getElementById("next-btn").addEventListener("click",()=>{if(h){H(s,a),window.scrollTo({top:0,behavior:"smooth"});return}const u={current:s.current+1,total:s.total};R(u);try{sessionStorage.removeItem(C)}catch{}b&&b.classList.remove("is-hidden"),setTimeout(()=>{window.location.href="test-gauge.html"},180)}),document.getElementById("exit-btn").addEventListener("click",K)}const I={correct:{label:"정답",icon:"✓",segClass:"summary-bar__seg--correct",cardClass:"summary-card--correct"},wrong:{label:"오답",icon:"✗",segClass:"summary-bar__seg--wrong",cardClass:"summary-card--wrong"},timeout:{label:"시간 초과",icon:"⏱",segClass:"summary-bar__seg--timeout",cardClass:"summary-card--timeout"},missing:{label:"미제출",icon:"—",segClass:"summary-bar__seg--missing",cardClass:"summary-card--missing"}};function w(s){const a=s==null?void 0:s.tag;if(!a)return(s==null?void 0:s.title)||`문제 ${s==null?void 0:s.id}`;const e=String(a).split("·").map(t=>t.trim()).filter(Boolean);return e[1]||e[0]||a}function Y(s){const a=new Set,e=[];for(const{p:t,v:l}of s){if(l==="correct")continue;const c=w(t);a.has(c)||(a.add(c),e.push(c))}return e}function H(s,a){let e=0,t=0,l=0,c=0;const _=v.map(n=>{const r=a[n.id],o=(r==null?void 0:r.verdict)||"missing";return o==="correct"?e++:o==="wrong"?t++:o==="timeout"?l++:c++,{p:n,v:o,a:r}}),p=e,i=s.total,h=i?Math.round(e/i*100):0,d=p===i?"perfect":p>=Math.ceil(i*.6)?"good":"tryAgain",u={perfect:{title:"축하합니다 — 완벽해요!",sub:"5문제 모두 정답이에요. 코딩테스트 자신감을 얻으셨길 바랍니다."},good:{title:"잘 하셨어요!",sub:"좋은 페이스입니다. 부족한 부분은 정답 코드를 참고해 다듬어보세요."},tryAgain:{title:"여기서부터가 시작이에요.",sub:"오늘의 결과보다 더 중요한 건 흐름이에요. 한 번 더 도전해볼까요?"}},$=new Set(v.map(w).filter(Boolean)).size,T=$>0?"도전한 개념 수":"도전한 문제 수",k=$>0?$:i,O=_.map(({p:n,v:r})=>{const o=I[r];return`<span class="summary-bar__seg ${o.segClass}" title="문제 ${n.id} — ${o.label}"></span>`}).join(""),y=Y(_);let g="";if(d==="perfect")g=`
      <div class="summary-rec__row">
        <span class="summary-rec__icon" aria-hidden="true">🚀</span>
        <div class="summary-rec__body">
          <h3 class="summary-rec__h">더 어려운 문제에 도전해보세요</h3>
          <p class="summary-rec__p">기본기는 충분합니다. 한 단계 위 개념으로 시야를 넓혀볼까요?</p>
          <a class="summary-rec__cta" href="test-concepts.html">개념 다시 보러 가기 →</a>
        </div>
      </div>
    `;else if(d==="good"){const n=y.length?y.slice(0,3).map(r=>`<span class="summary-rec__chip">${m(r)}</span>`).join(""):"";g=`
      <div class="summary-rec__row">
        <span class="summary-rec__icon" aria-hidden="true">🎯</span>
        <div class="summary-rec__body">
          <h3 class="summary-rec__h">이 개념을 더 연습해보세요</h3>
          ${n?`<div class="summary-rec__chips">${n}</div>
               <p class="summary-rec__p">위 개념을 중심으로 비슷한 문제를 한 번 더 풀어보세요.</p>`:'<p class="summary-rec__p">전반적으로 잘 하셨어요. 아쉬운 문제만 다시 한 번 살펴보세요.</p>'}
          <a class="summary-rec__cta" href="test-concepts.html">개념 다시 보러 가기 →</a>
        </div>
      </div>
    `}else{const n=y.length?y.slice(0,3).map(r=>`<span class="summary-rec__chip">${m(r)}</span>`).join(""):"";g=`
      <div class="summary-rec__row">
        <span class="summary-rec__icon" aria-hidden="true">📘</span>
        <div class="summary-rec__body">
          <h3 class="summary-rec__h">기초부터 차근차근</h3>
          ${n?`<div class="summary-rec__chips">${n}</div>
               <p class="summary-rec__p">이 개념들을 다시 익히고 비슷한 문제로 감을 잡아보세요.</p>`:'<p class="summary-rec__p">개념 정리부터 다시 한 번 살펴보고 차근차근 풀어볼까요?</p>'}
          <a class="summary-rec__cta" href="test-concepts.html">개념 다시 보러 가기 →</a>
        </div>
      </div>
    `}L.innerHTML=`
    <div class="result-hero">
      <span class="result-hero__chip result-hero__chip--correct">테스트 완료</span>
      <div class="summary-score">${p}<span class="summary-score__total"> / ${i}</span></div>
      <p class="summary-score__sub">정답 ${e} · 오답 ${t} · 시간 초과 ${l}${c?` · 미제출 ${c}`:""}</p>
      <h1 class="result-hero__title">${u[d].title}</h1>
      <p class="result-hero__sub">${u[d].sub}</p>
    </div>

    <div class="dash-section">
      <div class="dash-section__head">
        <h2 class="dash-section__h">전체 결과 한눈에 보기</h2>
        <span class="dash-section__pct">정답률 ${h}%</span>
      </div>
      <div class="summary-bar" role="img" aria-label="문제별 결과 막대">
        ${O}
      </div>
      <div class="summary-bar__legend">
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--correct"></i>정답 ${e}</span>
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--wrong"></i>오답 ${t}</span>
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--timeout"></i>시간 초과 ${l}</span>
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--missing"></i>미제출 ${c}</span>
      </div>
    </div>

    <div class="dash-stats">
      <div class="dash-stat">
        <span class="dash-stat__num">${h}<span class="dash-stat__unit">%</span></span>
        <span class="dash-stat__label">정답률</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat__num">${e}<span class="dash-stat__unit">/${i}</span></span>
        <span class="dash-stat__label">맞힌 문제</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat__num">${k}</span>
        <span class="dash-stat__label">${T}</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat__num">${t+l+c}</span>
        <span class="dash-stat__label">복습할 문제</span>
      </div>
    </div>

    <div class="dash-section">
      <div class="dash-section__head">
        <h2 class="dash-section__h">문제별 결과</h2>
        <span class="dash-section__pct">${i}문제</span>
      </div>
      <div class="summary-grid">
        ${_.map(({p:n,v:r})=>{const o=I[r],B=w(n);return`
            <div class="summary-card ${o.cardClass}">
              <span class="summary-card__icon" aria-hidden="true">${o.icon}</span>
              <span class="summary-card__num">문제 ${n.id}</span>
              <span class="summary-card__title">${m(n.title)}</span>
              <span class="summary-card__concept">${m(B)}</span>
              <span class="summary-card__verdict">${o.label}</span>
            </div>
          `}).join("")}
      </div>
    </div>

    <div class="summary-rec">
      <div class="summary-rec__head">
        <span class="summary-rec__badge">학습 추천</span>
        <h2 class="summary-rec__title">다음에 무엇을 해볼까요?</h2>
      </div>
      ${g}
    </div>

    <div class="result-encouragement">
      <span class="result-encouragement__icon" aria-hidden="true">✨</span>
      <p class="result-encouragement__text">
        <strong>이 진단 결과를 바탕으로 학습 경로를 추천해드릴게요.</strong>
        곧 등록하신 이메일로 상세 분석을 보내드립니다.
      </p>
    </div>

    <div class="result-actions">
      <button type="button" class="result-back" id="restart-btn">다시 시작하기</button>
      <a href="index.html" class="result-next result-next--final" id="home-btn" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;">
        메인으로 돌아가기 →
      </a>
    </div>
  `,document.getElementById("restart-btn").addEventListener("click",()=>{if(confirm("진행 기록을 모두 지우고 처음부터 다시 시작할까요?")){for(const n of[f,S,C])try{sessionStorage.removeItem(n)}catch{}b&&b.classList.remove("is-hidden"),setTimeout(()=>{window.location.href="test-concepts.html"},180)}})}function K(){if(confirm("정말 테스트를 종료할까요? 진행 상황이 사라집니다.")){for(const s of[f,S,C])try{sessionStorage.removeItem(s)}catch{}window.location.href="index.html"}}const J=P(),D=A();N(J,D);
