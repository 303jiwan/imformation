import"./main-B9pJA4vz.js";const d="http://localhost:3000";let f=null;const r={status:document.getElementById("lectures-status"),empty:document.getElementById("lectures-empty"),list:document.getElementById("lectures-list"),tabs:document.getElementById("lectures-tabs"),openUpload:document.getElementById("open-upload"),emptyUpload:document.getElementById("empty-upload"),uploadModal:document.getElementById("upload-modal"),uploadForm:document.getElementById("upload-form"),uploadError:document.getElementById("upload-error"),uploadSubmit:document.getElementById("upload-submit"),urlField:document.getElementById("upload-url-field"),fileField:document.getElementById("upload-file-field"),thumbField:document.getElementById("upload-thumb-field"),playerModal:document.getElementById("player-modal"),playerTitle:document.getElementById("player-title"),playerStage:document.getElementById("player-stage"),playerMeta:document.getElementById("player-meta")},$={algorithm:"알고리즘","data-structure":"자료구조","programming-basic":"프로그래밍 기초",other:"기타"};let m="";function l(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function I(e){return l(e)}function S(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"})}function y(e,t="info"){r.status&&(r.status.textContent=e,r.status.className=`lectures-status lectures-status--${t}`,r.status.hidden=!1)}function E(){r.status&&(r.status.hidden=!0)}function b(e){!r.empty||!r.list||(r.empty.hidden=!e,r.list.hidden=e)}function A(e){try{const t=new URL(e);if(t.hostname==="youtu.be"){const n=t.pathname.slice(1);return n?`https://www.youtube.com/embed/${n}`:null}if(t.hostname.endsWith("youtube.com")){if(t.pathname==="/watch"){const n=t.searchParams.get("v");return n?`https://www.youtube.com/embed/${n}`:null}if(t.pathname.startsWith("/embed/"))return e;if(t.pathname.startsWith("/shorts/")){const n=t.pathname.split("/")[2];return n?`https://www.youtube.com/embed/${n}`:null}}return null}catch{return null}}function C(e){try{const t=new URL(e);if(!t.hostname.endsWith("vimeo.com"))return null;const n=t.pathname.split("/").filter(Boolean)[0];return n&&/^\d+$/.test(n)?`https://player.vimeo.com/video/${n}`:null}catch{return null}}function F(e){return/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(e)}function U(e){return e.thumbnail?/^https?:\/\//i.test(e.thumbnail)?e.thumbnail:`${d}${e.thumbnail}`:null}function M(e){const t=$[e]||$.other;return`<span class="lecture-item__chip">${l(t)}</span>`}function P(e){const t=U(e);return t?`
      <div class="lecture-item__thumb lecture-item__thumb--image">
        <img src="${I(t)}" alt="" loading="lazy" />
      </div>
    `:`
    <div class="lecture-item__thumb" aria-hidden="true">
      ${e.sourceType==="file"?"🎞":"▶"}
    </div>
  `}function x(e){if(!e.length){b(!0);return}b(!1),r.list.innerHTML=e.map(t=>{const n=f!==null&&t.uploaderId===f;return`
        <article class="lecture-item" data-tilt>
          ${P(t)}
          <div class="lecture-item__body">
            <div class="lecture-item__head">
              <h3 class="lecture-item__title">${l(t.title)}</h3>
              ${M(t.category)}
            </div>
            ${t.description?`<p class="lecture-item__desc">${l(t.description)}</p>`:""}
            <p class="lecture-item__meta">
              <span>${l(t.uploader)}</span>
              <span>·</span>
              <span>${S(t.createdAt)}</span>
              <span>·</span>
              <span>▶ ${Number(t.viewCount??0).toLocaleString("ko-KR")}회</span>
            </p>
            <div class="lecture-item__actions">
              <button type="button" class="lecture-item__play" data-id="${t.id}">▶ 강의 재생</button>
              ${n?`<button type="button" class="lecture-item__delete" data-id="${t.id}">삭제</button>`:""}
            </div>
          </div>
        </article>
      `}).join(""),r.list.querySelectorAll(".lecture-item__play").forEach(t=>{t.addEventListener("click",()=>{const n=Number(t.getAttribute("data-id")),a=e.find(i=>i.id===n);a&&R(a)})}),r.list.querySelectorAll(".lecture-item__delete").forEach(t=>{t.addEventListener("click",()=>{const n=Number(t.getAttribute("data-id")),a=e.find(i=>i.id===n);a&&H(a,t)})})}async function H(e,t){if(window.confirm("이 강의를 삭제할까요? 되돌릴 수 없어요.")){t&&(t.disabled=!0,t.textContent="삭제 중…");try{const a=await fetch(`${d}/api/lectures/${e.id}`,{method:"DELETE",credentials:"include"});if(a.status===401)throw new Error("로그인 후 삭제할 수 있어요.");if(a.status===403)throw new Error("본인이 올린 강의만 삭제할 수 있어요.");const i=await a.json().catch(()=>({}));if(!a.ok)throw new Error((i==null?void 0:i.error)||`삭제 실패 (HTTP ${a.status})`);y("삭제했어요.","ok"),setTimeout(E,2400),await h()}catch(a){y(a.message||"삭제에 실패했어요.","error"),t&&(t.disabled=!1,t.textContent="삭제")}}}function N(e){return e.sourceType==="file"?e.source.startsWith("http")?e.source:`${d}${e.source}`:e.source}function D(e){fetch(`${d}/api/lectures/${e}/view`,{method:"POST",credentials:"include"}).catch(()=>{})}function R(e){r.playerTitle.textContent=e.title,r.playerMeta.textContent=`업로더: ${e.uploader} · ${S(e.createdAt)}`;let t="";if(e.sourceType==="file")t=`
      <video controls preload="metadata" class="player-modal__video">
        <source src="${l(N(e))}" />
      </video>
    `;else{const n=A(e.source),a=!n&&C(e.source);n||a?t=`
        <iframe class="player-modal__iframe" src="${l(n||a)}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
      `:F(e.source)?t=`
        <video controls preload="metadata" class="player-modal__video">
          <source src="${l(e.source)}" />
        </video>
      `:t=`
        <p class="player-modal__fallback">
          이 링크를 직접 열어 시청해주세요:
          <a href="${l(e.source)}" target="_blank" rel="noopener">${l(e.source)}</a>
        </p>
      `}r.playerStage.innerHTML=t,r.playerModal.hidden=!1,D(e.id)}function j(){r.playerModal.hidden=!0,r.playerStage.innerHTML=""}function _(){r.uploadError.hidden=!0,r.uploadForm.reset(),B(),r.uploadModal.hidden=!1}function k(){r.uploadModal.hidden=!0}function B(){const e=r.uploadForm.elements.sourceType.value;r.urlField.hidden=e!=="url",r.fileField.hidden=e!=="file",r.thumbField&&(r.thumbField.hidden=e!=="file")}async function O(e){var t,n,a,i;e.preventDefault(),r.uploadError.hidden=!0,r.uploadSubmit.disabled=!0,r.uploadSubmit.textContent="올리는 중…";try{const o=r.uploadForm,s=o.elements.sourceType.value,p=((t=o.elements.category)==null?void 0:t.value)||"other";let c;if(s==="url"){const u={title:o.elements.title.value.trim(),description:o.elements.description.value.trim(),sourceType:"url",url:o.elements.url.value.trim(),category:p};c=await fetch(`${d}/api/lectures`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)})}else{const u=new FormData;u.set("title",o.elements.title.value.trim()),u.set("description",o.elements.description.value.trim()),u.set("sourceType","file"),u.set("category",p);const w=(n=o.elements.video.files)==null?void 0:n[0];if(!w)throw new Error("동영상 파일을 선택해주세요.");u.set("video",w);const v=(i=(a=o.elements.thumbnail)==null?void 0:a.files)==null?void 0:i[0];v&&u.set("thumbnail",v),c=await fetch(`${d}/api/lectures`,{method:"POST",credentials:"include",body:u})}if(c.status===401)throw new Error("로그인 후 강의를 올릴 수 있어요.");const g=await c.json().catch(()=>({}));if(!c.ok)throw new Error((g==null?void 0:g.error)||`업로드 실패 (HTTP ${c.status})`);k(),y("강의를 올렸어요.","ok"),setTimeout(E,2400),await h()}catch(o){r.uploadError.textContent=o.message||"업로드에 실패했어요.",r.uploadError.hidden=!1}finally{r.uploadSubmit.disabled=!1,r.uploadSubmit.textContent="올리기"}}async function q(){var e;try{const t=await fetch(`${d}/api/me`,{credentials:"include"});if(!t.ok){f=null;return}const n=await t.json().catch(()=>({}));f=((e=n==null?void 0:n.user)==null?void 0:e.id)??null}catch{f=null}}async function h(){try{const e=m?`${d}/api/lectures?category=${encodeURIComponent(m)}`:`${d}/api/lectures`,t=await fetch(e,{credentials:"include"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const n=await t.json();x(Array.isArray(n.lectures)?n.lectures:[])}catch(e){b(!0),y(`강의 목록을 불러오지 못했어요 (${e.message}). 백엔드가 실행 중인지 확인해주세요.`,"error")}}function T(e){r.tabs&&r.tabs.querySelectorAll(".lectures-tab").forEach(t=>{const n=(t.dataset.category||"")===e;t.classList.toggle("is-active",n),t.setAttribute("aria-selected",n?"true":"false")})}function L(){var e,t,n,a,i;!r.list||!r.empty||((e=r.openUpload)==null||e.addEventListener("click",_),(t=r.emptyUpload)==null||t.addEventListener("click",_),(n=r.uploadForm)==null||n.addEventListener("submit",O),(a=r.uploadForm)==null||a.querySelectorAll('input[name="sourceType"]').forEach(o=>o.addEventListener("change",B)),(i=r.tabs)==null||i.addEventListener("click",o=>{const s=o.target instanceof Element?o.target.closest(".lectures-tab"):null;if(!s)return;const p=s.dataset.category||"";p!==m&&(m=p,T(m),E(),h())}),document.addEventListener("click",o=>{if(!(o.target instanceof Element)||!o.target.matches("[data-close]"))return;const s=o.target.closest(".modal");s&&(s.id==="player-modal"?j():s.id==="upload-modal"?k():s.hidden=!0)}),T(m),q().finally(h))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",L):L();
