import"./main-C3NtFZ6_.js";const u="http://localhost:3000",r={status:document.getElementById("lectures-status"),empty:document.getElementById("lectures-empty"),list:document.getElementById("lectures-list"),openUpload:document.getElementById("open-upload"),emptyUpload:document.getElementById("empty-upload"),uploadModal:document.getElementById("upload-modal"),uploadForm:document.getElementById("upload-form"),uploadError:document.getElementById("upload-error"),uploadSubmit:document.getElementById("upload-submit"),urlField:document.getElementById("upload-url-field"),fileField:document.getElementById("upload-file-field"),playerModal:document.getElementById("player-modal"),playerTitle:document.getElementById("player-title"),playerStage:document.getElementById("player-stage"),playerMeta:document.getElementById("player-meta")};function i(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function f(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"})}function y(e,t="info"){r.status&&(r.status.textContent=e,r.status.className=`lectures-status lectures-status--${t}`,r.status.hidden=!1)}function E(){r.status&&(r.status.hidden=!0)}function d(e){!r.empty||!r.list||(r.empty.hidden=!e,r.list.hidden=e)}function v(e){try{const t=new URL(e);if(t.hostname==="youtu.be"){const o=t.pathname.slice(1);return o?`https://www.youtube.com/embed/${o}`:null}if(t.hostname.endsWith("youtube.com")){if(t.pathname==="/watch"){const o=t.searchParams.get("v");return o?`https://www.youtube.com/embed/${o}`:null}if(t.pathname.startsWith("/embed/"))return e;if(t.pathname.startsWith("/shorts/")){const o=t.pathname.split("/")[2];return o?`https://www.youtube.com/embed/${o}`:null}}return null}catch{return null}}function w(e){try{const t=new URL(e);if(!t.hostname.endsWith("vimeo.com"))return null;const o=t.pathname.split("/").filter(Boolean)[0];return o&&/^\d+$/.test(o)?`https://player.vimeo.com/video/${o}`:null}catch{return null}}function $(e){return/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(e)}function _(e){if(!e.length){d(!0);return}d(!1),r.list.innerHTML=e.map(t=>`
        <article class="lecture-item" data-tilt>
          <div class="lecture-item__thumb" aria-hidden="true">
            ${t.sourceType==="file"?"🎞":"▶"}
          </div>
          <div class="lecture-item__body">
            <h3 class="lecture-item__title">${i(t.title)}</h3>
            ${t.description?`<p class="lecture-item__desc">${i(t.description)}</p>`:""}
            <p class="lecture-item__meta">
              <span>${i(t.uploader)}</span>
              <span>·</span>
              <span>${f(t.createdAt)}</span>
            </p>
            <button type="button" class="lecture-item__play" data-id="${t.id}">▶ 강의 재생</button>
          </div>
        </article>
      `).join(""),r.list.querySelectorAll(".lecture-item__play").forEach(t=>{t.addEventListener("click",()=>{const o=Number(t.getAttribute("data-id")),n=e.find(a=>a.id===o);n&&S(n)})})}function T(e){return e.sourceType==="file"?e.source.startsWith("http")?e.source:`${u}${e.source}`:e.source}function S(e){r.playerTitle.textContent=e.title,r.playerMeta.textContent=`업로더: ${e.uploader} · ${f(e.createdAt)}`;let t="";if(e.sourceType==="file")t=`
      <video controls preload="metadata" class="player-modal__video">
        <source src="${i(T(e))}" />
      </video>
    `;else{const o=v(e.source),n=!o&&w(e.source);o||n?t=`
        <iframe class="player-modal__iframe" src="${i(o||n)}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
      `:$(e.source)?t=`
        <video controls preload="metadata" class="player-modal__video">
          <source src="${i(e.source)}" />
        </video>
      `:t=`
        <p class="player-modal__fallback">
          이 링크를 직접 열어 시청해주세요:
          <a href="${i(e.source)}" target="_blank" rel="noopener">${i(e.source)}</a>
        </p>
      `}r.playerStage.innerHTML=t,r.playerModal.hidden=!1}function B(){r.playerModal.hidden=!0,r.playerStage.innerHTML=""}function m(){r.uploadError.hidden=!0,r.uploadForm.reset(),g(),r.uploadModal.hidden=!1}function h(){r.uploadModal.hidden=!0}function g(){const e=r.uploadForm.elements.sourceType.value;r.urlField.hidden=e!=="url",r.fileField.hidden=e!=="file"}async function L(e){var t;e.preventDefault(),r.uploadError.hidden=!0,r.uploadSubmit.disabled=!0,r.uploadSubmit.textContent="올리는 중…";try{const o=r.uploadForm,n=o.elements.sourceType.value;let a;if(n==="url"){const s={title:o.elements.title.value.trim(),description:o.elements.description.value.trim(),sourceType:"url",url:o.elements.url.value.trim()};a=await fetch(`${u}/api/lectures`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})}else{const s=new FormData;s.set("title",o.elements.title.value.trim()),s.set("description",o.elements.description.value.trim()),s.set("sourceType","file");const c=(t=o.elements.video.files)==null?void 0:t[0];if(!c)throw new Error("동영상 파일을 선택해주세요.");s.set("video",c),a=await fetch(`${u}/api/lectures`,{method:"POST",credentials:"include",body:s})}if(a.status===401)throw new Error("로그인 후 강의를 올릴 수 있어요.");const l=await a.json().catch(()=>({}));if(!a.ok)throw new Error((l==null?void 0:l.error)||`업로드 실패 (HTTP ${a.status})`);h(),y("강의를 올렸어요.","ok"),setTimeout(E,2400),await b()}catch(o){r.uploadError.textContent=o.message||"업로드에 실패했어요.",r.uploadError.hidden=!1}finally{r.uploadSubmit.disabled=!1,r.uploadSubmit.textContent="올리기"}}async function b(){try{const e=await fetch(`${u}/api/lectures`,{credentials:"include"});if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json();_(Array.isArray(t.lectures)?t.lectures:[])}catch(e){d(!0),y(`강의 목록을 불러오지 못했어요 (${e.message}). 백엔드가 실행 중인지 확인해주세요.`,"error")}}function p(){var e,t,o,n;!r.list||!r.empty||((e=r.openUpload)==null||e.addEventListener("click",m),(t=r.emptyUpload)==null||t.addEventListener("click",m),(o=r.uploadForm)==null||o.addEventListener("submit",L),(n=r.uploadForm)==null||n.querySelectorAll('input[name="sourceType"]').forEach(a=>a.addEventListener("change",g)),document.addEventListener("click",a=>{if(!(a.target instanceof Element)||!a.target.matches("[data-close]"))return;const l=a.target.closest(".modal");l&&(l.id==="player-modal"?B():l.id==="upload-modal"?h():l.hidden=!0)}),b())}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p();
