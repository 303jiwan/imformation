import"./main-DqEMkCuE.js";import{T as f,P as g}from"./test-problems-D2aXybzh.js";const h="codenergy:test:progress",v="codenergy:test:answers",b="codenergy:test:timer",m=document.getElementById("page-fade"),x=document.getElementById("result-shell");function E(){try{const t=sessionStorage.getItem(h);if(t){const e=JSON.parse(t);if(typeof(e==null?void 0:e.current)=="number")return{current:e.current,total:e.total??f}}}catch{}return{current:1,total:f}}function S(t){try{sessionStorage.setItem(h,JSON.stringify(t))}catch{}}function w(){try{const t=sessionStorage.getItem(v);return t?JSON.parse(t):{}}catch{return{}}}const I={correct:{chip:"정답",chipClass:"result-hero__chip--correct",icon:"🎉",title:["훌륭해요!","완벽해요!","잘 풀어내셨어요!"],sub:"모든 테스트 케이스를 통과했습니다. 다음 문제도 그대로 가봐요.",enc:["이 흐름이라면 다음 문제도 무리 없겠어요.","한 번에 통과! 자신감을 가지고 가도 좋습니다.","정확하고 깔끔하네요 — 그대로 진행해주세요."]},wrong:{chip:"오답",chipClass:"result-hero__chip--wrong",icon:"💡",title:["조금만 더!","거의 다 왔어요.","다시 한 번 차분히."],sub:"일부 케이스에서 기대 출력과 달랐어요. 정답 코드와 비교해보면서 다음에 적용해보세요.",enc:["오답은 가장 좋은 학습 재료예요. 다음 문제는 더 잘 풀 수 있을 거예요.","한 발 한 발 나아가고 있어요. 흐름을 잃지 마세요.","비교 코드의 패턴을 메모해두면 다음에 큰 도움이 돼요."]},timeout:{chip:"시간 초과",chipClass:"result-hero__chip--timeout",icon:"⏳",title:["시간이 부족했어요.","아쉽게 시간 초과!","다음엔 페이스 조절!"],sub:"10분 안에 제출하지 못해 자동 제출되었습니다. 정답 코드를 살펴보고 흐름을 익혀보세요.",enc:["속도는 익숙해지면 자연스럽게 따라옵니다.","처음엔 누구나 시간이 빠듯해요 — 다음 문제로 가볼까요?","다음엔 1분 단위로 나눠서 풀어보세요."]},missing:{chip:"미제출",chipClass:"result-hero__chip--wrong",icon:"🤔",title:["제출 기록이 없어요"],sub:"이 문제를 풀고 결과 페이지로 돌아온 게 맞나요? 다시 시도하려면 처음부터 시작해주세요.",enc:["메인으로 돌아가 다시 시작할 수 있어요."]}};function y(t){return t[Math.floor(Math.random()*t.length)]}function $(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function C(t,e){var p;const o=g.find(n=>n.id===t.current)??g[0],s=e[o.id],a=(s==null?void 0:s.verdict)||"missing",r=I[a],_=(s==null?void 0:s.code)??"// (제출된 코드가 없습니다)",d=o.solution,i=((p=s==null?void 0:s.cases)==null?void 0:p.length)??0,u=t.current>=t.total;x.innerHTML=`
    <div class="result-hero">
      <span class="result-hero__chip ${r.chipClass}">${r.chip}</span>
      <div class="result-hero__icon" aria-hidden="true">${r.icon}</div>
      <h1 class="result-hero__title">${y(r.title)}</h1>
      <p class="result-hero__sub">${r.sub}</p>
      <div class="result-hero__meta">
        <span>문제 <strong>${o.id} / ${t.total}</strong></span>
        <span>·</span>
        <span><strong>${o.title}</strong></span>
        ${a==="correct"?`<span>·</span><span>테스트 케이스 <strong>${i}/${i}</strong> 통과</span>`:a==="wrong"?"<span>·</span><span>테스트 케이스 일부 실패</span>":""}
      </div>
    </div>

    <div class="result-compare">
      <div class="code-card">
        <div class="code-card__head">
          <span>내가 작성한 코드</span>
          <span class="code-card__badge code-card__badge--mine">MY CODE</span>
        </div>
        <pre class="code-card__body">${$(_)}</pre>
      </div>
      <div class="code-card">
        <div class="code-card__head">
          <span>참고 정답 코드</span>
          <span class="code-card__badge code-card__badge--ans">REFERENCE</span>
        </div>
        <pre class="code-card__body">${$(d)}</pre>
      </div>
    </div>

    <div class="result-encouragement">
      <span class="result-encouragement__icon" aria-hidden="true">💪</span>
      <p class="result-encouragement__text">
        <strong>${y(r.enc)}</strong>
      </p>
    </div>

    <div class="result-actions">
      <button type="button" class="result-back" id="exit-btn">테스트 종료하고 메인으로</button>
      ${u?'<button type="button" class="result-next result-next--final" id="next-btn">최종 결과 보기 →</button>':'<button type="button" class="result-next" id="next-btn">다음 문제 풀기 →</button>'}
    </div>
  `,document.getElementById("next-btn").addEventListener("click",()=>{if(u){L(t,e),window.scrollTo({top:0,behavior:"smooth"});return}const n={current:t.current+1,total:t.total};S(n);try{sessionStorage.removeItem(b)}catch{}m&&m.classList.remove("is-hidden"),setTimeout(()=>{window.location.href="test-gauge.html"},180)}),document.getElementById("exit-btn").addEventListener("click",M)}function L(t,e){let o=0,s=0,a=0,r=0;const _=g.map(n=>{const c=e[n.id],l=(c==null?void 0:c.verdict)||"missing";return l==="correct"?o++:l==="wrong"?s++:l==="timeout"?a++:r++,{p:n,v:l}}),d=o,i=t.total,u=d===i?"perfect":d>=Math.ceil(i*.6)?"good":"tryAgain",p={perfect:{title:"축하합니다 — 완벽해요!",sub:"5문제 모두 정답이에요. 코딩테스트 자신감을 얻으셨길 바랍니다."},good:{title:"잘 하셨어요!",sub:"좋은 페이스입니다. 부족한 부분은 정답 코드를 참고해 다듬어보세요."},tryAgain:{title:"여기서부터가 시작이에요.",sub:"오늘의 결과보다 더 중요한 건 흐름이에요. 한 번 더 도전해볼까요?"}};x.innerHTML=`
    <div class="result-hero">
      <span class="result-hero__chip result-hero__chip--correct">테스트 완료</span>
      <div class="summary-score">${d}<span style="font-size:24px;color:#9ca3af;font-weight:800;"> / ${i}</span></div>
      <p class="summary-score__sub">정답 ${o} · 오답 ${s} · 시간 초과 ${a}${r?` · 미제출 ${r}`:""}</p>
      <h1 class="result-hero__title">${p[u].title}</h1>
      <p class="result-hero__sub">${p[u].sub}</p>
    </div>

    <div>
      <h2 class="problem-panel__h" style="margin: 4px 0 12px; padding: 0;">문제별 결과</h2>
      <div class="summary-grid">
        ${_.map(({p:n,v:c})=>{const l=c==="correct"?"정답":c==="wrong"?"오답":c==="timeout"?"시간 초과":"미제출";return`
            <div class="summary-card summary-card--${c}">
              <span class="summary-card__num">문제 ${n.id}</span>
              <span class="summary-card__title">${n.title}</span>
              <span class="summary-card__verdict">${l}</span>
            </div>
          `}).join("")}
      </div>
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
  `,document.getElementById("restart-btn").addEventListener("click",()=>{if(confirm("진행 기록을 모두 지우고 처음부터 다시 시작할까요?")){for(const n of[h,v,b])try{sessionStorage.removeItem(n)}catch{}m&&m.classList.remove("is-hidden"),setTimeout(()=>{window.location.href="test-concepts.html"},180)}})}function M(){if(confirm("정말 테스트를 종료할까요? 진행 상황이 사라집니다.")){for(const t of[h,v,b])try{sessionStorage.removeItem(t)}catch{}window.location.href="index.html"}}const T=E(),O=w();C(T,O);
