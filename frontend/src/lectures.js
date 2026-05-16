// Lectures page controller — fetches the lecture list, handles upload
// (URL or file), and plays back via the player modal.
//
// Anyone may browse and watch. Upload requires an authenticated session
// (the cookie is sent automatically because we use credentials: "include").

const API_BASE = "http://localhost:3000";

// Current authenticated user id, or null if not signed in / fetch failed.
// Looked up once on page load so renderList can decide which lectures the
// viewer is allowed to delete (only their own).
let currentUserId = null;

const els = {
  status:      document.getElementById("lectures-status"),
  empty:       document.getElementById("lectures-empty"),
  list:        document.getElementById("lectures-list"),
  tabs:        document.getElementById("lectures-tabs"),
  openUpload:  document.getElementById("open-upload"),
  emptyUpload: document.getElementById("empty-upload"),
  uploadModal: document.getElementById("upload-modal"),
  uploadForm:  document.getElementById("upload-form"),
  uploadError: document.getElementById("upload-error"),
  uploadSubmit:document.getElementById("upload-submit"),
  urlField:    document.getElementById("upload-url-field"),
  fileField:   document.getElementById("upload-file-field"),
  thumbField:  document.getElementById("upload-thumb-field"),
  playerModal: document.getElementById("player-modal"),
  playerTitle: document.getElementById("player-title"),
  playerStage: document.getElementById("player-stage"),
  playerMeta:  document.getElementById("player-meta"),
};

// Korean labels for the category chip displayed on each card.
const CATEGORY_LABELS = {
  algorithm: "알고리즘",
  "data-structure": "자료구조",
  "programming-basic": "프로그래밍 기초",
  other: "기타",
};

let currentCategory = "";  // "" means all categories

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
  // Same as escapeHtml but separated for readability where we're explicitly
  // building an attribute value (e.g. an <img src="…">).
  return escapeHtml(s);
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function showStatus(msg, kind = "info") {
  if (!els.status) return;
  els.status.textContent = msg;
  els.status.className = `lectures-status lectures-status--${kind}`;
  els.status.hidden = false;
}

function hideStatus() {
  if (els.status) els.status.hidden = true;
}

function setVisibility(empty) {
  if (!els.empty || !els.list) return;
  els.empty.hidden = !empty;
  els.list.hidden = empty;
}

// ---------------- Source URL helpers (YouTube/Vimeo embedding) ----------------

function youtubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function vimeoEmbed(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith("vimeo.com")) return null;
    const id = u.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  } catch {
    return null;
  }
}

function looksLikeRawVideoUrl(url) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
}

// ---------------- Rendering ----------------

function thumbnailUrl(lec) {
  if (!lec.thumbnail) return null;
  // Server returns either an absolute http(s) URL (YouTube) or a relative
  // /uploads/thumbnails/... path. Relative paths need the API origin prefixed
  // because this page is served by Vite on a different port in dev.
  if (/^https?:\/\//i.test(lec.thumbnail)) return lec.thumbnail;
  return `${API_BASE}${lec.thumbnail}`;
}

function categoryChip(category) {
  const label = CATEGORY_LABELS[category] || CATEGORY_LABELS.other;
  return `<span class="lecture-item__chip">${escapeHtml(label)}</span>`;
}

function thumbBlock(lec) {
  const url = thumbnailUrl(lec);
  if (url) {
    return `
      <div class="lecture-item__thumb lecture-item__thumb--image">
        <img src="${escapeAttr(url)}" alt="" loading="lazy" />
      </div>
    `;
  }
  return `
    <div class="lecture-item__thumb" aria-hidden="true">
      ${lec.sourceType === "file" ? "🎞" : "▶"}
    </div>
  `;
}

function renderList(lectures) {
  if (!lectures.length) {
    setVisibility(true);
    return;
  }
  setVisibility(false);
  els.list.innerHTML = lectures
    .map(
      (lec) => {
        const ownsLecture =
          currentUserId !== null && lec.uploaderId === currentUserId;
        return `
        <article class="lecture-item" data-tilt>
          ${thumbBlock(lec)}
          <div class="lecture-item__body">
            <div class="lecture-item__head">
              <h3 class="lecture-item__title">${escapeHtml(lec.title)}</h3>
              ${categoryChip(lec.category)}
            </div>
            ${lec.description
              ? `<p class="lecture-item__desc">${escapeHtml(lec.description)}</p>`
              : ""}
            <p class="lecture-item__meta">
              <span>${escapeHtml(lec.uploader)}</span>
              <span>·</span>
              <span>${formatDate(lec.createdAt)}</span>
              <span>·</span>
              <span>▶ ${Number(lec.viewCount ?? 0).toLocaleString("ko-KR")}회</span>
            </p>
            <div class="lecture-item__actions">
              <button type="button" class="lecture-item__play" data-id="${lec.id}">▶ 강의 재생</button>
              ${ownsLecture
                ? `<button type="button" class="lecture-item__delete" data-id="${lec.id}">삭제</button>`
                : ""}
            </div>
          </div>
        </article>
      `;
      }
    )
    .join("");

  els.list.querySelectorAll(".lecture-item__play").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      const lec = lectures.find((l) => l.id === id);
      if (lec) openPlayer(lec);
    });
  });

  els.list.querySelectorAll(".lecture-item__delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      const lec = lectures.find((l) => l.id === id);
      if (lec) deleteLecture(lec, btn);
    });
  });
}

async function deleteLecture(lec, btn) {
  const ok = window.confirm("이 강의를 삭제할까요? 되돌릴 수 없어요.");
  if (!ok) return;
  if (btn) {
    btn.disabled = true;
    btn.textContent = "삭제 중…";
  }
  try {
    const res = await fetch(`${API_BASE}/api/lectures/${lec.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) {
      throw new Error("로그인 후 삭제할 수 있어요.");
    }
    if (res.status === 403) {
      throw new Error("본인이 올린 강의만 삭제할 수 있어요.");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `삭제 실패 (HTTP ${res.status})`);
    }
    showStatus("삭제했어요.", "ok");
    setTimeout(hideStatus, 2400);
    await loadLectures();
  } catch (err) {
    showStatus(err.message || "삭제에 실패했어요.", "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "삭제";
    }
  }
}

function fullSourceUrl(lec) {
  // file sources come back from the API as `/uploads/lectures/<name>` —
  // prefix with the API base since this page lives on a different origin.
  if (lec.sourceType === "file") {
    if (lec.source.startsWith("http")) return lec.source;
    return `${API_BASE}${lec.source}`;
  }
  return lec.source;
}

// Fire-and-forget view bump. Failure here must NOT block playback because
// the backend may simply be offline in demo mode.
function bumpView(id) {
  fetch(`${API_BASE}/api/lectures/${id}/view`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
}

function openPlayer(lec) {
  els.playerTitle.textContent = lec.title;
  els.playerMeta.textContent = `업로더: ${lec.uploader} · ${formatDate(lec.createdAt)}`;

  let stageHtml = "";
  if (lec.sourceType === "file") {
    stageHtml = `
      <video controls preload="metadata" class="player-modal__video">
        <source src="${escapeHtml(fullSourceUrl(lec))}" />
      </video>
    `;
  } else {
    const yt = youtubeEmbed(lec.source);
    const vm = !yt && vimeoEmbed(lec.source);
    if (yt || vm) {
      stageHtml = `
        <iframe class="player-modal__iframe" src="${escapeHtml(yt || vm)}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
      `;
    } else if (looksLikeRawVideoUrl(lec.source)) {
      stageHtml = `
        <video controls preload="metadata" class="player-modal__video">
          <source src="${escapeHtml(lec.source)}" />
        </video>
      `;
    } else {
      // Unknown provider — surface a link rather than break with a blank player.
      stageHtml = `
        <p class="player-modal__fallback">
          이 링크를 직접 열어 시청해주세요:
          <a href="${escapeHtml(lec.source)}" target="_blank" rel="noopener">${escapeHtml(lec.source)}</a>
        </p>
      `;
    }
  }
  els.playerStage.innerHTML = stageHtml;
  els.playerModal.hidden = false;
  bumpView(lec.id);
}

function closePlayer() {
  els.playerModal.hidden = true;
  // Stop playback by tearing down the embed.
  els.playerStage.innerHTML = "";
}

// ---------------- Upload modal ----------------

function openUpload() {
  els.uploadError.hidden = true;
  els.uploadForm.reset();
  syncSourceFields();
  els.uploadModal.hidden = false;
}

function closeUpload() {
  els.uploadModal.hidden = true;
}

function syncSourceFields() {
  const choice = els.uploadForm.elements.sourceType.value;
  els.urlField.hidden = choice !== "url";
  els.fileField.hidden = choice !== "file";
  // Custom thumbnail upload only makes sense for file lectures — YouTube URLs
  // get an auto-derived thumbnail server-side, and we don't want to surface a
  // confusing input that gets ignored for non-YouTube URL submissions.
  if (els.thumbField) els.thumbField.hidden = choice !== "file";
}

async function submitUpload(event) {
  event.preventDefault();
  els.uploadError.hidden = true;
  els.uploadSubmit.disabled = true;
  els.uploadSubmit.textContent = "올리는 중…";

  try {
    const form = els.uploadForm;
    const sourceType = form.elements.sourceType.value;
    const category = form.elements.category?.value || "other";
    let res;
    if (sourceType === "url") {
      const body = {
        title: form.elements.title.value.trim(),
        description: form.elements.description.value.trim(),
        sourceType: "url",
        url: form.elements.url.value.trim(),
        category,
      };
      res = await fetch(`${API_BASE}/api/lectures`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      const fd = new FormData();
      fd.set("title", form.elements.title.value.trim());
      fd.set("description", form.elements.description.value.trim());
      fd.set("sourceType", "file");
      fd.set("category", category);
      const file = form.elements.video.files?.[0];
      if (!file) throw new Error("동영상 파일을 선택해주세요.");
      fd.set("video", file);
      const thumb = form.elements.thumbnail?.files?.[0];
      if (thumb) fd.set("thumbnail", thumb);
      res = await fetch(`${API_BASE}/api/lectures`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
    }

    if (res.status === 401) {
      throw new Error("로그인 후 강의를 올릴 수 있어요.");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `업로드 실패 (HTTP ${res.status})`);
    }

    closeUpload();
    showStatus("강의를 올렸어요.", "ok");
    setTimeout(hideStatus, 2400);
    await loadLectures();
  } catch (err) {
    els.uploadError.textContent = err.message || "업로드에 실패했어요.";
    els.uploadError.hidden = false;
  } finally {
    els.uploadSubmit.disabled = false;
    els.uploadSubmit.textContent = "올리기";
  }
}

// ---------------- Initial load ----------------

async function loadCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/api/me`, { credentials: "include" });
    if (!res.ok) {
      currentUserId = null;
      return;
    }
    const data = await res.json().catch(() => ({}));
    currentUserId = data?.user?.id ?? null;
  } catch {
    currentUserId = null;
  }
}

async function loadLectures() {
  try {
    const url = currentCategory
      ? `${API_BASE}/api/lectures?category=${encodeURIComponent(currentCategory)}`
      : `${API_BASE}/api/lectures`;
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderList(Array.isArray(data.lectures) ? data.lectures : []);
  } catch (err) {
    setVisibility(true);
    showStatus(`강의 목록을 불러오지 못했어요 (${err.message}). 백엔드가 실행 중인지 확인해주세요.`, "error");
  }
}

function setActiveTab(category) {
  if (!els.tabs) return;
  els.tabs.querySelectorAll(".lectures-tab").forEach((btn) => {
    const isActive = (btn.dataset.category || "") === category;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function init() {
  if (!els.list || !els.empty) return;

  els.openUpload?.addEventListener("click", openUpload);
  els.emptyUpload?.addEventListener("click", openUpload);
  els.uploadForm?.addEventListener("submit", submitUpload);
  els.uploadForm?.querySelectorAll('input[name="sourceType"]').forEach((r) =>
    r.addEventListener("change", syncSourceFields)
  );

  els.tabs?.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target.closest(".lectures-tab") : null;
    if (!target) return;
    const next = target.dataset.category || "";
    if (next === currentCategory) return;
    currentCategory = next;
    setActiveTab(currentCategory);
    hideStatus();
    loadLectures();
  });

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    if (!e.target.matches("[data-close]")) return;
    const modal = e.target.closest(".modal");
    if (!modal) return;
    if (modal.id === "player-modal") closePlayer();
    else if (modal.id === "upload-modal") closeUpload();
    else modal.hidden = true;
  });

  setActiveTab(currentCategory);
  // Resolve current user before the first list render so the delete button can
  // be drawn for the viewer's own lectures on the initial paint.
  loadCurrentUser().finally(loadLectures);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
