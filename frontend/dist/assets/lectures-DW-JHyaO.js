import"./main-CTj2Xg_3.js";const d="http://localhost:3000",r={status:document.getElementById("lectures-status"),empty:document.getElementById("lectures-empty"),list:document.getElementById("lectures-list"),tabs:document.getElementById("lectures-tabs"),openUpload:document.getElementById("open-upload"),emptyUpload:document.getElementById("empty-upload"),uploadModal:document.getElementById("upload-modal"),uploadForm:document.getElementById("upload-form"),uploadError:document.getElementById("upload-error"),uploadSubmit:document.getElementById("upload-submit"),urlField:document.getElementById("upload-url-field"),fileField:document.getElementById("upload-file-field"),thumbField:document.getElementById("upload-thumb-field"),playerModal:document.getElementById("player-modal"),playerTitle:document.getElementById("player-title"),playerStage:document.getElementById("player-stage"),playerMeta:document.getElementById("player-meta")},v={algorithm:"알고리즘","data-structure":"자료구조","programming-basic":"프로그래밍 기초",other:"기타"};let m="";function l(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function I(e){return l(e)}function _(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"})}function T(e,t="info"){r.status&&(r.status.textContent=e,r.status.className=`lectures-status lectures-status--${t}`,r.status.hidden=!1)}function S(){r.status&&(r.status.hidden=!0)}function y(e){!r.empty||!r.list||(r.empty.hidden=!e,r.list.hidden=e)}function A(e){try{const t=new URL(e);if(t.hostname==="youtu.be"){const a=t.pathname.slice(1);return a?`https://www.youtube.com/embed/${a}`:null}if(t.hostname.endsWith("youtube.com")){if(t.pathname==="/watch"){const a=t.searchParams.get("v");return a?`https://www.youtube.com/embed/${a}`:null}if(t.pathname.startsWith("/embed/"))return e;if(t.pathname.startsWith("/shorts/")){const a=t.pathname.split("/")[2];return a?`https://www.youtube.com/embed/${a}`:null}}return null}catch{return null}}function k(e){try{const t=new URL(e);if(!t.hostname.endsWith("vimeo.com"))return null;const a=t.pathname.split("/").filter(Boolean)[0];return a&&/^\d+$/.test(a)?`https://player.vimeo.com/video/${a}`:null}catch{return null}}function F(e){return/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(e)}function C(e){return e.thumbnail?/^https?:\/\//i.test(e.thumbnail)?e.thumbnail:`${d}${e.thumbnail}`:null}function U(e){const t=v[e]||v.other;return`<span class="lecture-item__chip">${l(t)}</span>`}function M(e){const t=C(e);return t?`
      <div class="lecture-item__thumb lecture-item__thumb--image">
        <img src="${I(t)}" alt="" loading="lazy" />
      </div>
    `:`
    <div class="lecture-item__thumb" aria-hidden="true">
      ${e.sourceType==="file"?"🎞":"▶"}
    </div>
  `}function P(e){if(!e.length){y(!0);return}y(!1),r.list.innerHTML=e.map(t=>`
        <article class="lecture-item" data-tilt>
          ${M(t)}
          <div class="lecture-item__body">
            <div class="lecture-item__head">
              <h3 class="lecture-item__title">${l(t.title)}</h3>
              ${U(t.category)}
            </div>
            ${t.description?`<p class="lecture-item__desc">${l(t.description)}</p>`:""}
            <p class="lecture-item__meta">
              <span>${l(t.uploader)}</span>
              <span>·</span>
              <span>${_(t.createdAt)}</span>
              <span>·</span>
              <span>▶ ${Number(t.viewCount??0).toLocaleString("ko-KR")}회</span>
            </p>
            <button type="button" class="lecture-item__play" data-id="${t.id}">▶ 강의 재생</button>
          </div>
        </article>
      `).join(""),r.list.querySelectorAll(".lecture-item__play").forEach(t=>{t.addEventListener("click",()=>{const a=Number(t.getAttribute("data-id")),o=e.find(u=>u.id===a);o&&N(o)})})}function x(e){return e.sourceType==="file"?e.source.startsWith("http")?e.source:`${d}${e.source}`:e.source}function H(e){fetch(`${d}/api/lectures/${e}/view`,{method:"POST",credentials:"include"}).catch(()=>{})}function N(e){r.playerTitle.textContent=e.title,r.playerMeta.textContent=`업로더: ${e.uploader} · ${_(e.createdAt)}`;let t="";if(e.sourceType==="file")t=`
      <video controls preload="metadata" class="player-modal__video">
        <source src="${l(x(e))}" />
      </video>
    `;else{const a=A(e.source),o=!a&&k(e.source);a||o?t=`
        <iframe class="player-modal__iframe" src="${l(a||o)}"
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
      `}r.playerStage.innerHTML=t,r.playerModal.hidden=!1,H(e.id)}function R(){r.playerModal.hidden=!0,r.playerStage.innerHTML=""}function E(){r.uploadError.hidden=!0,r.uploadForm.reset(),B(),r.uploadModal.hidden=!1}function L(){r.uploadModal.hidden=!0}function B(){const e=r.uploadForm.elements.sourceType.value;r.urlField.hidden=e!=="url",r.fileField.hidden=e!=="file",r.thumbField&&(r.thumbField.hidden=e!=="file")}async function D(e){var t,a,o,u;e.preventDefault(),r.uploadError.hidden=!0,r.uploadSubmit.disabled=!0,r.uploadSubmit.textContent="올리는 중…";try{const n=r.uploadForm,i=n.elements.sourceType.value,p=((t=n.elements.category)==null?void 0:t.value)||"other";let c;if(i==="url"){const s={title:n.elements.title.value.trim(),description:n.elements.description.value.trim(),sourceType:"url",url:n.elements.url.value.trim(),category:p};c=await fetch(`${d}/api/lectures`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})}else{const s=new FormData;s.set("title",n.elements.title.value.trim()),s.set("description",n.elements.description.value.trim()),s.set("sourceType","file"),s.set("category",p);const g=(a=n.elements.video.files)==null?void 0:a[0];if(!g)throw new Error("동영상 파일을 선택해주세요.");s.set("video",g);const b=(u=(o=n.elements.thumbnail)==null?void 0:o.files)==null?void 0:u[0];b&&s.set("thumbnail",b),c=await fetch(`${d}/api/lectures`,{method:"POST",credentials:"include",body:s})}if(c.status===401)throw new Error("로그인 후 강의를 올릴 수 있어요.");const f=await c.json().catch(()=>({}));if(!c.ok)throw new Error((f==null?void 0:f.error)||`업로드 실패 (HTTP ${c.status})`);L(),T("강의를 올렸어요.","ok"),setTimeout(S,2400),await h()}catch(n){r.uploadError.textContent=n.message||"업로드에 실패했어요.",r.uploadError.hidden=!1}finally{r.uploadSubmit.disabled=!1,r.uploadSubmit.textContent="올리기"}}async function h(){try{const e=m?`${d}/api/lectures?category=${encodeURIComponent(m)}`:`${d}/api/lectures`,t=await fetch(e,{credentials:"include"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const a=await t.json();P(Array.isArray(a.lectures)?a.lectures:[])}catch(e){y(!0),T(`강의 목록을 불러오지 못했어요 (${e.message}). 백엔드가 실행 중인지 확인해주세요.`,"error")}}function $(e){r.tabs&&r.tabs.querySelectorAll(".lectures-tab").forEach(t=>{const a=(t.dataset.category||"")===e;t.classList.toggle("is-active",a),t.setAttribute("aria-selected",a?"true":"false")})}function w(){var e,t,a,o,u;!r.list||!r.empty||((e=r.openUpload)==null||e.addEventListener("click",E),(t=r.emptyUpload)==null||t.addEventListener("click",E),(a=r.uploadForm)==null||a.addEventListener("submit",D),(o=r.uploadForm)==null||o.querySelectorAll('input[name="sourceType"]').forEach(n=>n.addEventListener("change",B)),(u=r.tabs)==null||u.addEventListener("click",n=>{const i=n.target instanceof Element?n.target.closest(".lectures-tab"):null;if(!i)return;const p=i.dataset.category||"";p!==m&&(m=p,$(m),S(),h())}),document.addEventListener("click",n=>{if(!(n.target instanceof Element)||!n.target.matches("[data-close]"))return;const i=n.target.closest(".modal");i&&(i.id==="player-modal"?R():i.id==="upload-modal"?L():i.hidden=!0)}),$(m),h())}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",w):w();
