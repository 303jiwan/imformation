// Trail card progress gauge wiring for codetrails.html.
//
// 4-state UI per AR review feedback:
//   - unauthenticated (401)        → grey "로그인하면 진도 기록" badge, 0%
//   - loading (initial fetch)      → animated skeleton bar
//   - error (network or 4xx/5xx ≠ 401) → last-cached value + ⚠ + retry
//   - ok                            → real progress, trail color
//
// We never collapse "not signed in" with "signed in but 0%" — the former is
// not a real progress reading; the latter is.

const API_BASE = "http://localhost:3000";
const CACHE_KEY = "codenergy:learn:progress:v1";

const TRAIL_HEX = ["#22c55e", "#eab308", "#f97316", "#ef4444", "#3b82f6", "#a855f7", "#111111"];

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) { return null; }
}
function writeCache(payload) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch (_) {}
}

/** Maps each card to its trail id by reading its start button. */
function findCards() {
  const cards = [];
  document.querySelectorAll(".trail-primary[data-trail]").forEach((btn) => {
    const card = btn.closest(".trail-card");
    if (!card) return;
    cards.push({ trail: Number(btn.dataset.trail), card });
  });
  return cards;
}

function ensureGaugeNodes(card) {
  // Replace existing static .trail-progress block with our 4-state gauge.
  // If we've already injected our gauge, reuse it.
  let host = card.querySelector(".trail-card__gauge-wrap");
  if (host) return host;

  host = document.createElement("div");
  host.className = "trail-card__gauge-wrap";
  host.innerHTML = `
    <div class="trail-card__gauge">
      <div class="trail-card__gauge-skeleton" data-skel></div>
      <div class="trail-card__gauge-fill" data-fill style="width:0%"></div>
    </div>
    <div class="trail-card__gauge-meta" data-meta></div>
  `;
  const old = card.querySelector(".trail-progress");
  if (old) old.replaceWith(host);
  else {
    const tags = card.querySelector(".trail-tags");
    (tags || card).insertAdjacentElement("beforebegin", host);
  }
  return host;
}

function setLoading(host) {
  host.querySelector("[data-skel]").style.display = "block";
  host.querySelector("[data-fill]").style.width = "0%";
  const meta = host.querySelector("[data-meta]");
  meta.className = "trail-card__gauge-meta";
  meta.innerHTML = "진행률 불러오는 중…";
}
function setUnauth(host) {
  host.querySelector("[data-skel]").style.display = "none";
  host.querySelector("[data-fill]").style.width = "0%";
  const meta = host.querySelector("[data-meta]");
  meta.className = "trail-card__gauge-meta trail-card__gauge-meta--auth";
  meta.innerHTML = "로그인하면 진도 기록 시작";
}
function setError(host, cachedPct, cachedDone, cachedTotal, onRetry) {
  host.querySelector("[data-skel]").style.display = "none";
  const fill = host.querySelector("[data-fill]");
  fill.style.width = `${cachedPct}%`;
  const meta = host.querySelector("[data-meta]");
  meta.className = "trail-card__gauge-meta trail-card__gauge-meta--err";
  meta.innerHTML = `진도 정보를 불러오지 못했어요 ${
    cachedTotal > 0 ? `(마지막 기록: ${cachedDone}/${cachedTotal})` : ""
  } <button type="button">다시 시도</button>`;
  meta.querySelector("button").addEventListener("click", onRetry);
}
function setOk(host, color, done, total) {
  host.querySelector("[data-skel]").style.display = "none";
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const fill = host.querySelector("[data-fill]");
  fill.style.width = `${pct}%`;
  fill.style.color = color;
  const meta = host.querySelector("[data-meta]");
  meta.className = "trail-card__gauge-meta";
  meta.innerHTML = `${done}/${total} Completed (${pct}%)`;
}

async function fetchProgress() {
  const res = await fetch(`${API_BASE}/api/learn/progress`, {
    credentials: "include",
  });
  if (res.status === 401) return { kind: "unauth" };
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { kind: "err", status: res.status, text };
  }
  const body = await res.json().catch(() => null);
  if (!body || !Array.isArray(body.trails)) return { kind: "err", status: 0, text: "bad payload" };
  return { kind: "ok", body };
}

function applyOkOrPlaceholder(cards, body) {
  const byTrail = new Map(body.trails.map((t) => [t.trail, t]));
  cards.forEach(({ trail, card }) => {
    const host = ensureGaugeNodes(card);
    const t = byTrail.get(trail);
    if (t) {
      setOk(host, TRAIL_HEX[trail] || "#111", t.done, t.total);
    } else {
      // Lesson catalog has no lessons for this trail yet → show 0/0.
      setOk(host, TRAIL_HEX[trail] || "#111", 0, 0);
    }
  });
}

async function loadAndRender() {
  const cards = findCards();
  cards.forEach(({ card }) => setLoading(ensureGaugeNodes(card)));

  let result;
  try {
    result = await fetchProgress();
  } catch (err) {
    result = { kind: "err", status: 0, text: String(err?.message ?? err) };
  }

  if (result.kind === "unauth") {
    cards.forEach(({ card }) => setUnauth(ensureGaugeNodes(card)));
    return;
  }
  if (result.kind === "err") {
    const cached = readCache();
    cards.forEach(({ trail, card }) => {
      const t = cached?.trails?.find((x) => x.trail === trail);
      const total = t?.total ?? 0;
      const done = t?.done ?? 0;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      setError(ensureGaugeNodes(card), pct, done, total, loadAndRender);
    });
    return;
  }
  // ok
  writeCache(result.body);
  applyOkOrPlaceholder(cards, result.body);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadAndRender);
} else {
  loadAndRender();
}
