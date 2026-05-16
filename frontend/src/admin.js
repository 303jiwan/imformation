// Admin page controller (admin.html).
// Gates the page behind is_admin === 1 from /api/me, then loads and renders
// two tabs: 강의 (suspicious lectures → delete) and 사용자 (account suspend / unsuspend).

const API_BASE = "http://localhost:3000";

const statusEl     = document.getElementById("admin-status");
const lecturesHost = document.getElementById("lectures-list");
const usersHost    = document.getElementById("users-list");
const countLect    = document.getElementById("count-lectures");
const countUsers   = document.getElementById("count-users");

function setStatus(message, isError = false) {
  if (!statusEl) return;
  if (!message) {
    statusEl.hidden = true;
    statusEl.textContent = "";
    return;
  }
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.classList.toggle("is-error", !!isError);
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR");
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// ---------------- Tabs ----------------
document.querySelectorAll(".admin-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll(".admin-tab").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
    });
    document.querySelectorAll(".admin-panel").forEach((p) => {
      p.classList.toggle("is-active", p.dataset.panel === tab);
    });
  });
});

// ---------------- Lectures ----------------
function renderLectures(lectures) {
  countLect.textContent = String(lectures.length);
  if (!lectures.length) {
    lecturesHost.innerHTML = `<div class="empty">등록된 강의가 없습니다.</div>`;
    return;
  }
  const thumb = (l) =>
    l.thumbnail
      ? `<img class="admin-thumb" src="${escapeHtml(
          /^https?:/i.test(l.thumbnail) ? l.thumbnail : API_BASE + l.thumbnail
        )}" alt="" loading="lazy" />`
      : `<div class="admin-thumb"></div>`;
  const uploaderCell = (l) => {
    const tag = l.uploaderSuspended
      ? `<span class="pill pill--suspended">정지됨</span>`
      : "";
    return `${escapeHtml(l.uploader)} ${tag}`;
  };
  const rows = lectures
    .map(
      (l) => `
    <tr data-lecture-id="${l.id}">
      <td>${thumb(l)}</td>
      <td>
        <div style="font-weight:700">${escapeHtml(l.title)}</div>
        <div style="color:#6b7280;font-size:12px;margin-top:2px">${escapeHtml(
          l.category
        )} · ${l.sourceType === "url" ? "URL" : "파일"}</div>
      </td>
      <td>${uploaderCell(l)}</td>
      <td class="num">${l.viewCount}</td>
      <td>${formatDate(l.createdAt)}</td>
      <td>
        <button type="button" class="btn btn--danger" data-action="delete-lecture" data-id="${
          l.id
        }">삭제</button>
      </td>
    </tr>`
    )
    .join("");
  lecturesHost.innerHTML = `
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
      <tbody>${rows}</tbody>
    </table>`;
}

async function loadLectures() {
  try {
    const { lectures } = await api("/api/admin/lectures");
    renderLectures(lectures);
  } catch (err) {
    setStatus(`강의 목록을 불러오지 못했습니다: ${err.message}`, true);
  }
}

async function deleteLecture(id, btn) {
  const row = btn.closest("tr");
  const title = row?.querySelector("td:nth-child(2) div")?.textContent ?? "";
  if (!confirm(`이 강의를 삭제할까요?\n\n${title}\n\n파일도 같이 지워지며 복구할 수 없습니다.`)) {
    return;
  }
  btn.disabled = true;
  try {
    await api(`/api/admin/lectures/${id}`, { method: "DELETE" });
    await loadLectures();
    setStatus("강의를 삭제했습니다.");
  } catch (err) {
    setStatus(`삭제 실패: ${err.message}`, true);
    btn.disabled = false;
  }
}

// ---------------- Users ----------------
function renderUsers(users, me) {
  countUsers.textContent = String(users.length);
  if (!users.length) {
    usersHost.innerHTML = `<div class="empty">사용자가 없습니다.</div>`;
    return;
  }
  const rows = users
    .map((u) => {
      const isMe = u.id === me.id;
      const flags = [];
      if (u.is_admin) flags.push(`<span class="pill pill--admin">관리자</span>`);
      if (u.is_suspended) flags.push(`<span class="pill pill--suspended">정지</span>`);
      if (!flags.length) flags.push(`<span class="pill pill--ok">정상</span>`);

      let actionBtn;
      if (isMe) {
        actionBtn = `<button type="button" class="btn" disabled>본인</button>`;
      } else if (u.is_suspended) {
        actionBtn = `<button type="button" class="btn" data-action="unsuspend-user" data-id="${u.id}">정지 해제</button>`;
      } else {
        actionBtn = `<button type="button" class="btn btn--warning" data-action="suspend-user" data-id="${u.id}">계정 정지</button>`;
      }
      return `
        <tr data-user-id="${u.id}">
          <td>
            <div style="font-weight:700">${escapeHtml(u.username)}</div>
            <div style="color:#6b7280;font-size:12px">${escapeHtml(u.email)}</div>
          </td>
          <td>${flags.join(" ")}</td>
          <td class="num">${u.lecture_count}</td>
          <td>${formatDate(u.created_at)}</td>
          <td>${actionBtn}</td>
        </tr>`;
    })
    .join("");
  usersHost.innerHTML = `
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
      <tbody>${rows}</tbody>
    </table>`;
}

let currentMe = null;
async function loadUsers() {
  try {
    const { users } = await api("/api/admin/users");
    renderUsers(users, currentMe);
  } catch (err) {
    setStatus(`사용자 목록을 불러오지 못했습니다: ${err.message}`, true);
  }
}

async function toggleSuspend(id, suspend, btn) {
  btn.disabled = true;
  try {
    await api(
      `/api/admin/users/${id}/${suspend ? "suspend" : "unsuspend"}`,
      { method: "POST" }
    );
    await Promise.all([loadUsers(), loadLectures()]);
    setStatus(suspend ? "계정을 정지했습니다." : "정지를 해제했습니다.");
  } catch (err) {
    setStatus(`처리 실패: ${err.message}`, true);
    btn.disabled = false;
  }
}

// Event delegation for action buttons (rows are re-rendered on every reload).
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (!Number.isFinite(id)) return;
  const action = btn.dataset.action;
  if (action === "delete-lecture") deleteLecture(id, btn);
  else if (action === "suspend-user") toggleSuspend(id, true, btn);
  else if (action === "unsuspend-user") toggleSuspend(id, false, btn);
});

// ---------------- Boot ----------------
async function boot() {
  let me;
  try {
    me = await api("/api/me");
  } catch (err) {
    if (err.status === 401) {
      alert("로그인 후 이용해주세요.");
      window.location.replace("index.html");
      return;
    }
    setStatus(`인증 확인 실패: ${err.message}`, true);
    return;
  }
  if (!me.is_admin) {
    alert("관리자 권한이 필요합니다.");
    window.location.replace("index.html");
    return;
  }
  currentMe = me;
  await Promise.all([loadLectures(), loadUsers()]);
}

boot();
