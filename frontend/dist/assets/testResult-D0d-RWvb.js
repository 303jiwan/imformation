import"./modulepreload-polyfill-B5Qt9EMX.js";import"./main-Qt7JoFFu.js";import{loadProblemQueue as Z,PROBLEMS as $,TOTAL_PROBLEMS as j,QUEUE_KEY as D}from"./test-problems-uD0f3zrw.js";const x="codenergy:test:progress",M="codenergy:test:answers",O="codenergy:test:timer",q="codenergy:test:email",ss="codenergy:test:emailSent",U="http://localhost:3000";async function K(){try{const s=await fetch(`${U}/api/me`,{credentials:"include"});if(s.ok){const t=await s.json();if(t!=null&&t.email)return t.email}}catch{}try{const s=sessionStorage.getItem(q);if(s){const t=JSON.parse(s);if(t!=null&&t.email)return t.email}}catch{}return null}function ts(s){const t=new Set,a=new Set;for(const{p:c,v:n}of s){const i=Array.isArray(c==null?void 0:c.concepts)?c.concepts:[];for(const l of i)n==="correct"?a.add(l):t.add(l)}const o=[];for(const c of a)t.has(c)||o.push(c);return{weakConcepts:[...t],strongConcepts:o}}function N(s,t,a){const{weakConcepts:o,strongConcepts:c}=ts(t);return{email:s,testType:"default",summary:{correct:a.correct,wrong:a.wrong,timeout:a.timeout,missing:a.missing+a.ungraded,total:a.total},results:t.map(({slot:n,p:i,v:l})=>({slot:n,title:i.title,concept:I(i),verdict:l})),weakConcepts:o,strongConcepts:c}}async function Y(s){const t=await fetch(`${U}/api/test/result-email`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const a=await t.json().catch(()=>({}));throw new Error(a.error||`이메일 전송 실패 (${t.status})`)}return t.json()}const C=document.getElementById("page-fade"),V=document.getElementById("result-shell");function es(){try{const s=sessionStorage.getItem(x);if(s){const t=JSON.parse(s);if(typeof(t==null?void 0:t.current)=="number")return{current:t.current,total:t.total??j}}}catch{}return{current:1,total:j}}function F(s){try{sessionStorage.setItem(x,JSON.stringify(s))}catch{}}function as(){try{const s=sessionStorage.getItem(M);return s?JSON.parse(s):{}}catch{return{}}}const ns={correct:{chip:"정답",chipClass:"result-hero__chip--correct",icon:"🎉",title:["훌륭해요!","완벽해요!","잘 풀어내셨어요!"],sub:"모든 테스트 케이스를 통과했습니다. 다음 문제도 그대로 가봐요.",enc:["이 흐름이라면 다음 문제도 무리 없겠어요.","한 번에 통과! 자신감을 가지고 가도 좋습니다.","정확하고 깔끔하네요 — 그대로 진행해주세요."]},wrong:{chip:"오답",chipClass:"result-hero__chip--wrong",icon:"💡",title:["조금만 더!","거의 다 왔어요.","다시 한 번 차분히."],sub:"일부 케이스에서 기대 출력과 달랐어요. 정답 코드와 비교해보면서 다음에 적용해보세요.",enc:["오답은 가장 좋은 학습 재료예요. 다음 문제는 더 잘 풀 수 있을 거예요.","한 발 한 발 나아가고 있어요. 흐름을 잃지 마세요.","비교 코드의 패턴을 메모해두면 다음에 큰 도움이 돼요."]},timeout:{chip:"시간 초과",chipClass:"result-hero__chip--timeout",icon:"⏳",title:["시간이 부족했어요.","아쉽게 시간 초과!","다음엔 페이스 조절!"],sub:"10분 안에 제출하지 못해 자동 제출되었습니다. 정답 코드를 살펴보고 흐름을 익혀보세요.",enc:["속도는 익숙해지면 자연스럽게 따라옵니다.","처음엔 누구나 시간이 빠듯해요 — 다음 문제로 가볼까요?","다음엔 1분 단위로 나눠서 풀어보세요."]},missing:{chip:"미제출",chipClass:"result-hero__chip--wrong",icon:"🤔",title:["제출 기록이 없어요"],sub:"이 문제를 풀고 결과 페이지로 돌아온 게 맞나요? 다시 시도하려면 처음부터 시작해주세요.",enc:["메인으로 돌아가 다시 시작할 수 있어요."]},ungraded:{chip:"미채점",chipClass:"result-hero__chip--wrong",icon:"⚠️",title:["자동 채점이 불가능했어요"],sub:"Judge0 키가 설정되지 않아 코드를 실제로 실행하지 못했습니다. 결과는 정답·오답 어느 쪽으로도 기록되지 않았어요.",enc:["관리자에게 VITE_JUDGE0_KEY 설정을 요청한 뒤 다시 시도해주세요."]}};function J(s){return s[Math.floor(Math.random()*s.length)]}function d(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function cs(s,t,a){var g;const o=a[s.current-1]??a[0],c=$.find(v=>v.id===o)??$[0],n=t[c.id],i=(n==null?void 0:n.verdict)||"missing",l=ns[i],_=(n==null?void 0:n.code)??"// (제출된 코드가 없습니다)",f=c.solution,u=((g=n==null?void 0:n.cases)==null?void 0:g.length)??0,b=s.current>=s.total;V.innerHTML=`
    <div class="result-hero">
      <span class="result-hero__chip ${l.chipClass}">${l.chip}</span>
      <div class="result-hero__icon" aria-hidden="true">${l.icon}</div>
      <h1 class="result-hero__title">${J(l.title)}</h1>
      <p class="result-hero__sub">${l.sub}</p>
      <div class="result-hero__meta">
        <span>문제 <strong>${s.current} / ${s.total}</strong></span>
        <span>·</span>
        <span><strong>${c.title}</strong></span>
        ${i==="correct"?`<span>·</span><span>테스트 케이스 <strong>${u}/${u}</strong> 통과</span>`:i==="wrong"?"<span>·</span><span>테스트 케이스 일부 실패</span>":""}
      </div>
    </div>

    <div class="result-compare">
      <div class="code-card">
        <div class="code-card__head">
          <span>내가 작성한 코드</span>
          <span class="code-card__badge code-card__badge--mine">MY CODE</span>
        </div>
        <pre class="code-card__body">${d(_)}</pre>
      </div>
      <div class="code-card">
        <div class="code-card__head">
          <span>참고 정답 코드</span>
          <span class="code-card__badge code-card__badge--ans">REFERENCE</span>
        </div>
        <pre class="code-card__body">${d(f)}</pre>
      </div>
    </div>

    <div class="result-encouragement">
      <span class="result-encouragement__icon" aria-hidden="true">💪</span>
      <p class="result-encouragement__text">
        <strong>${J(l.enc)}</strong>
      </p>
    </div>

    <div class="result-actions">
      <button type="button" class="result-back" id="exit-btn">테스트 종료하고 메인으로</button>
      ${b?'<button type="button" class="result-next result-next--final" id="next-btn">최종 결과 보기 →</button>':'<button type="button" class="result-next" id="next-btn">다음 문제 풀기 →</button>'}
    </div>
  `,document.getElementById("next-btn").addEventListener("click",()=>{if(b){os(s,t,a),window.scrollTo({top:0,behavior:"smooth"});return}const v={current:s.current+1,total:s.total};F(v);try{sessionStorage.removeItem(O)}catch{}C&&C.classList.remove("is-hidden"),setTimeout(()=>{window.location.href="test-gauge.html"},180)}),document.getElementById("exit-btn").addEventListener("click",is)}const H={correct:{label:"정답",icon:"✓",segClass:"summary-bar__seg--correct",cardClass:"summary-card--correct"},wrong:{label:"오답",icon:"✗",segClass:"summary-bar__seg--wrong",cardClass:"summary-card--wrong"},timeout:{label:"시간 초과",icon:"⏱",segClass:"summary-bar__seg--timeout",cardClass:"summary-card--timeout"},missing:{label:"미제출",icon:"—",segClass:"summary-bar__seg--missing",cardClass:"summary-card--missing"},ungraded:{label:"미채점",icon:"⚠",segClass:"summary-bar__seg--missing",cardClass:"summary-card--missing"}};function I(s){const t=s==null?void 0:s.tag;if(!t)return(s==null?void 0:s.title)||`문제 ${s==null?void 0:s.id}`;const a=String(t).split("·").map(o=>o.trim()).filter(Boolean);return a[1]||a[0]||t}function rs(s){const t=new Set,a=[];for(const{p:o,v:c}of s){if(c==="correct")continue;const n=I(o);t.has(n)||(t.add(n),a.push(n))}return a}function os(s,t,a){let o=0,c=0,n=0,i=0,l=0;const _=a.map((e,r)=>{const m=$.find(X=>X.id===e)??$[0],h=t[m.id],y=(h==null?void 0:h.verdict)||"missing";return y==="correct"?o++:y==="wrong"?c++:y==="timeout"?n++:y==="ungraded"?l++:i++,{p:m,v:y,a:h,slot:r+1}}),f=o,u=s.total,b=u?Math.round(o/u*100):0,g=f===u?"perfect":f>=Math.ceil(u*.6)?"good":"tryAgain",v={perfect:{title:"축하합니다 — 완벽해요!",sub:"5문제 모두 정답이에요. 코딩테스트 자신감을 얻으셨길 바랍니다."},good:{title:"잘 하셨어요!",sub:"좋은 페이스입니다. 부족한 부분은 정답 코드를 참고해 다듬어보세요."},tryAgain:{title:"여기서부터가 시작이에요.",sub:"오늘의 결과보다 더 중요한 건 흐름이에요. 한 번 더 도전해볼까요?"}},T=new Set(_.map(({p:e})=>I(e)).filter(Boolean)).size,Q=T>0?"도전한 개념 수":"도전한 문제 수",z=T>0?T:u,W=_.map(({slot:e,v:r})=>{const m=H[r];return`<span class="summary-bar__seg ${m.segClass}" title="문제 ${e} — ${m.label}"></span>`}).join(""),E=rs(_);let w="";if(g==="perfect")w=`
      <div class="summary-rec__row">
        <span class="summary-rec__icon" aria-hidden="true">🚀</span>
        <div class="summary-rec__body">
          <h3 class="summary-rec__h">더 어려운 문제에 도전해보세요</h3>
          <p class="summary-rec__p">기본기는 충분합니다. 한 단계 위 개념으로 시야를 넓혀볼까요?</p>
          <a class="summary-rec__cta" href="test-concepts.html">개념 다시 보러 가기 →</a>
        </div>
      </div>
    `;else if(g==="good"){const e=E.length?E.slice(0,3).map(r=>`<span class="summary-rec__chip">${d(r)}</span>`).join(""):"";w=`
      <div class="summary-rec__row">
        <span class="summary-rec__icon" aria-hidden="true">🎯</span>
        <div class="summary-rec__body">
          <h3 class="summary-rec__h">이 개념을 더 연습해보세요</h3>
          ${e?`<div class="summary-rec__chips">${e}</div>
               <p class="summary-rec__p">위 개념을 중심으로 비슷한 문제를 한 번 더 풀어보세요.</p>`:'<p class="summary-rec__p">전반적으로 잘 하셨어요. 아쉬운 문제만 다시 한 번 살펴보세요.</p>'}
          <a class="summary-rec__cta" href="test-concepts.html">개념 다시 보러 가기 →</a>
        </div>
      </div>
    `}else{const e=E.length?E.slice(0,3).map(r=>`<span class="summary-rec__chip">${d(r)}</span>`).join(""):"";w=`
      <div class="summary-rec__row">
        <span class="summary-rec__icon" aria-hidden="true">📘</span>
        <div class="summary-rec__body">
          <h3 class="summary-rec__h">기초부터 차근차근</h3>
          ${e?`<div class="summary-rec__chips">${e}</div>
               <p class="summary-rec__p">이 개념들을 다시 익히고 비슷한 문제로 감을 잡아보세요.</p>`:'<p class="summary-rec__p">개념 정리부터 다시 한 번 살펴보고 차근차근 풀어볼까요?</p>'}
          <a class="summary-rec__cta" href="test-concepts.html">개념 다시 보러 가기 →</a>
        </div>
      </div>
    `}V.innerHTML=`
    <div class="result-hero">
      <span class="result-hero__chip result-hero__chip--correct">테스트 완료</span>
      <div class="summary-score">${f}<span class="summary-score__total"> / ${u}</span></div>
      <p class="summary-score__sub">정답 ${o} · 오답 ${c} · 시간 초과 ${n}${l?` · 미채점 ${l}`:""}${i?` · 미제출 ${i}`:""}</p>
      <h1 class="result-hero__title">${v[g].title}</h1>
      <p class="result-hero__sub">${v[g].sub}</p>
    </div>

    <div class="dash-section">
      <div class="dash-section__head">
        <h2 class="dash-section__h">전체 결과 한눈에 보기</h2>
        <span class="dash-section__pct">정답률 ${b}%</span>
      </div>
      <div class="summary-bar" role="img" aria-label="문제별 결과 막대">
        ${W}
      </div>
      <div class="summary-bar__legend">
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--correct"></i>정답 ${o}</span>
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--wrong"></i>오답 ${c}</span>
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--timeout"></i>시간 초과 ${n}</span>
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--missing"></i>미제출 ${i}</span>
      </div>
    </div>

    <div class="dash-stats">
      <div class="dash-stat">
        <span class="dash-stat__num">${b}<span class="dash-stat__unit">%</span></span>
        <span class="dash-stat__label">정답률</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat__num">${o}<span class="dash-stat__unit">/${u}</span></span>
        <span class="dash-stat__label">맞힌 문제</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat__num">${z}</span>
        <span class="dash-stat__label">${Q}</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat__num">${c+n+i}</span>
        <span class="dash-stat__label">복습할 문제</span>
      </div>
    </div>

    <div class="dash-section">
      <div class="dash-section__head">
        <h2 class="dash-section__h">문제별 결과</h2>
        <span class="dash-section__pct">${u}문제</span>
      </div>
      <div class="summary-grid">
        ${_.map(({p:e,v:r,slot:m})=>{const h=H[r],y=I(e);return`
            <div class="summary-card ${h.cardClass}">
              <span class="summary-card__icon" aria-hidden="true">${h.icon}</span>
              <span class="summary-card__num">문제 ${m}</span>
              <span class="summary-card__title">${d(e.title)}</span>
              <span class="summary-card__concept">${d(y)}</span>
              <span class="summary-card__verdict">${h.label}</span>
            </div>
          `}).join("")}
      </div>
    </div>

    <div class="summary-rec">
      <div class="summary-rec__head">
        <span class="summary-rec__badge">학습 추천</span>
        <h2 class="summary-rec__title">다음에 무엇을 해볼까요?</h2>
      </div>
      ${w}
    </div>

    <div class="result-encouragement" id="email-status" data-state="idle">
      <span class="result-encouragement__icon" aria-hidden="true">✨</span>
      <p class="result-encouragement__text" id="email-status-text">
        <strong>이 진단 결과를 바탕으로 학습 경로를 추천해드릴게요.</strong>
        잠시 후 결과와 추천 트레일이 이메일로 발송됩니다.
      </p>
    </div>

    <div class="result-actions">
      <button type="button" class="result-back" id="restart-btn">다시 시작하기</button>
      <button type="button" class="result-back" id="email-result-btn">이메일로 결과 받기</button>
      <a href="index.html" class="result-next result-next--final" id="home-btn" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;">
        메인으로 돌아가기 →
      </a>
    </div>
  `,document.getElementById("restart-btn").addEventListener("click",()=>{if(confirm("진행 기록을 모두 지우고 처음부터 다시 시작할까요?")){for(const e of[x,M,O,D])try{sessionStorage.removeItem(e)}catch{}C&&C.classList.remove("is-hidden"),setTimeout(()=>{window.location.href="test-concepts.html"},180)}});const B={correct:o,wrong:c,timeout:n,missing:i,ungraded:l,total:u},A=document.getElementById("email-status"),P=document.getElementById("email-status-text");function p(e,r){!A||!P||(A.dataset.state=e,P.innerHTML=r)}const k=`${ss}:${JSON.stringify(a)}:${o}-${c}-${n}-${i}`,R=sessionStorage.getItem(k);(async()=>{if(R){p("done",`<strong>✅ 결과가 이미 이메일(<code>${d(R)}</code>)로 발송되었어요.</strong> 받은 메일에서 추천 트레일을 바로 시작할 수 있습니다.`);return}const e=await K();if(!e){p("no-email","<strong>📭 등록된 이메일이 없어요.</strong> 아래 “이메일로 결과 받기”에서 받을 주소를 입력하시면 상세 분석과 추천 트레일을 보내드릴게요.");return}p("sending",`<strong>📨 결과를 <code>${d(e)}</code>로 보내는 중…</strong>`);try{await Y(N(e,_,B));try{sessionStorage.setItem(k,e)}catch{}p("done",`<strong>✅ 결과가 <code>${d(e)}</code>로 발송되었어요.</strong> 메일에서 추천 트레일을 바로 시작할 수 있습니다.`)}catch(r){p("error",`<strong>⚠️ 이메일 전송에 실패했어요.</strong> 잠시 후 “이메일로 결과 받기” 버튼으로 다시 시도해 주세요. (${d(r.message||"알 수 없는 오류")})`)}})(),document.getElementById("email-result-btn").addEventListener("click",async()=>{const e=await K(),r=prompt("결과를 받을 이메일을 입력해주세요:",e||"");if(r){if(!r.includes("@")){alert("올바른 이메일을 입력해 주세요.");return}p("sending",`<strong>📨 결과를 <code>${d(r)}</code>로 보내는 중…</strong>`);try{await Y(N(r,_,B));try{sessionStorage.setItem(k,r)}catch{}p("done",`<strong>✅ 결과가 <code>${d(r)}</code>로 발송되었어요.</strong> 메일에서 추천 트레일을 바로 시작할 수 있습니다.`)}catch(m){p("error",`<strong>⚠️ 이메일 전송에 실패했어요.</strong> ${d(m.message||"알 수 없는 오류")}`)}}})}function is(){if(confirm("정말 테스트를 종료할까요? 진행 상황이 사라집니다.")){for(const s of[x,M,O,D])try{sessionStorage.removeItem(s)}catch{}window.location.href="index.html"}}const S=es(),ls=as(),L=Z()??$.map(s=>s.id);S.total!==L.length&&(S.total=L.length,F(S));cs(S,ls,L);
