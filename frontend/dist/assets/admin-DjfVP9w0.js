import"./modulepreload-polyfill-B5Qt9EMX.js";const b="http://localhost:3000",d=document.getElementById("admin-status"),m=document.getElementById("lectures-list"),p=document.getElementById("users-list"),$=document.getElementById("count-lectures"),w=document.getElementById("count-users");function r(t,e=!1){if(d){if(!t){d.hidden=!0,d.textContent="";return}d.hidden=!1,d.textContent=t,d.classList.toggle("is-error",!!e)}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function f(t){if(!t)return"";const e=new Date(t.replace(" ","T")+"Z");return Number.isNaN(e.getTime())?t:e.toLocaleString("ko-KR")}async function o(t,e={}){const n=await fetch(`${b}${t}`,{credentials:"include",headers:{"Content-Type":"application/json"},...e});if(!n.ok){const a=await n.json().catch(()=>({})),s=new Error(a.error||`HTTP ${n.status}`);throw s.status=n.status,s}return n.json()}document.querySelectorAll(".admin-tab").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.tab;document.querySelectorAll(".admin-tab").forEach(n=>{n.classList.toggle("is-active",n===t)}),document.querySelectorAll(".admin-panel").forEach(n=>{n.classList.toggle("is-active",n.dataset.panel===e)})})});function v(t){if($.textContent=String(t.length),!t.length){m.innerHTML='<div class="empty">등록된 강의가 없습니다.</div>';return}const e=s=>s.thumbnail?`<img class="admin-thumb" src="${c(/^https?:/i.test(s.thumbnail)?s.thumbnail:b+s.thumbnail)}" alt="" loading="lazy" />`:'<div class="admin-thumb"></div>',n=s=>{const i=s.uploaderSuspended?'<span class="pill pill--suspended">정지됨</span>':"";return`${c(s.uploader)} ${i}`},a=t.map(s=>`
    <tr data-lecture-id="${s.id}">
      <td>${e(s)}</td>
      <td>
        <div style="font-weight:700">${c(s.title)}</div>
        <div style="color:#6b7280;font-size:12px;margin-top:2px">${c(s.category)} · ${s.sourceType==="url"?"URL":"파일"}</div>
      </td>
      <td>${n(s)}</td>
      <td class="num">${s.viewCount}</td>
      <td>${f(s.createdAt)}</td>
      <td>
        <button type="button" class="btn btn--danger" data-action="delete-lecture" data-id="${s.id}">삭제</button>
      </td>
    </tr>`).join("");m.innerHTML=`
    <table class="admin-table">
      <thead>
        <tr>
          <th>썸네일</th>
          <th>제목</th>
          <th>업로더</th>
          <th class="num">조회수</th>
          <th>업로드일</th>
          <th>작업</th>
        </tr>
      </thead>
      <tbody>${a}</tbody>
    </table>`}async function u(){try{const{lectures:t}=await o("/api/admin/lectures");v(t)}catch(t){r(`강의 목록을 불러오지 못했습니다: ${t.message}`,!0)}}async function E(t,e){var s;const n=e.closest("tr"),a=((s=n==null?void 0:n.querySelector("td:nth-child(2) div"))==null?void 0:s.textContent)??"";if(confirm(`이 강의를 삭제할까요?

${a}

파일도 같이 지워지며 복구할 수 없습니다.`)){e.disabled=!0;try{await o(`/api/admin/lectures/${t}`,{method:"DELETE"}),await u(),r("강의를 삭제했습니다.")}catch(i){r(`삭제 실패: ${i.message}`,!0),e.disabled=!1}}}function L(t,e){if(w.textContent=String(t.length),!t.length){p.innerHTML='<div class="empty">사용자가 없습니다.</div>';return}const n=t.map(a=>{const s=a.id===e.id,i=[];a.is_admin&&i.push('<span class="pill pill--admin">관리자</span>'),a.is_suspended&&i.push('<span class="pill pill--suspended">정지</span>'),i.length||i.push('<span class="pill pill--ok">정상</span>');let l;return s?l='<button type="button" class="btn" disabled>본인</button>':a.is_suspended?l=`<button type="button" class="btn" data-action="unsuspend-user" data-id="${a.id}">정지 해제</button>`:l=`<button type="button" class="btn btn--warning" data-action="suspend-user" data-id="${a.id}">계정 정지</button>`,`
        <tr data-user-id="${a.id}">
          <td>
            <div style="font-weight:700">${c(a.username)}</div>
            <div style="color:#6b7280;font-size:12px">${c(a.email)}</div>
          </td>
          <td>${i.join(" ")}</td>
          <td class="num">${a.lecture_count}</td>
          <td>${f(a.created_at)}</td>
          <td>${l}</td>
        </tr>`}).join("");p.innerHTML=`
    <table class="admin-table">
      <thead>
        <tr>
          <th>사용자</th>
          <th>상태</th>
          <th class="num">강의 수</th>
          <th>가입일</th>
          <th>작업</th>
        </tr>
      </thead>
      <tbody>${n}</tbody>
    </table>`}let g=null;async function y(){try{const{users:t}=await o("/api/admin/users");L(t,g)}catch(t){r(`사용자 목록을 불러오지 못했습니다: ${t.message}`,!0)}}async function h(t,e,n){n.disabled=!0;try{await o(`/api/admin/users/${t}/${e?"suspend":"unsuspend"}`,{method:"POST"}),await Promise.all([y(),u()]),r(e?"계정을 정지했습니다.":"정지를 해제했습니다.")}catch(a){r(`처리 실패: ${a.message}`,!0),n.disabled=!1}}document.addEventListener("click",t=>{const e=t.target.closest("button[data-action]");if(!e)return;const n=Number(e.dataset.id);if(!Number.isFinite(n))return;const a=e.dataset.action;a==="delete-lecture"?E(n,e):a==="suspend-user"?h(n,!0,e):a==="unsuspend-user"&&h(n,!1,e)});async function S(){let t;try{t=await o("/api/me")}catch(e){if(e.status===401){alert("로그인 후 이용해주세요."),window.location.replace("index.html");return}r(`인증 확인 실패: ${e.message}`,!0);return}if(!t.is_admin){alert("관리자 권한이 필요합니다."),window.location.replace("index.html");return}g=t,await Promise.all([u(),y()])}S();
