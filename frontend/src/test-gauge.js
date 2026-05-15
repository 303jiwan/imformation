/* =====================================================================
   Test gauge screen — Step 4 of the coding-test flow.
   - Animates a circular gauge from 0 → 100 over ~3.5s.
   - Ticks off four stage checks as the gauge progresses.
   - Activates the "시작하기" button when complete.
   - Reused between problems 1..5; reads/writes
     sessionStorage["codenergy:test:progress"] = { current, total }.
   ===================================================================== */

const API_BASE = "http://localhost:3000";
const PROGRESS_KEY = "codenergy:test:progress";
const NEXT_PAGE = "test-problem.html";
const TOTAL_PROBLEMS = 5;
const FILL_DURATION_MS = 3500; // total animation time
const CIRCUMFERENCE = 263.89;  // 2π × 42 (matches the SVG circle r=42)

async function trySaveProgressToServer(progress) {
  try {
    await fetch(`${API_BASE}/api/test/progress`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progress),
    });
  } catch (_) {
    // Ignore network/auth failures; local session still works.
  }
}

const STAGE_LABELS = [
  "주제 분석 중…",
  "난이도 조정 중…",
  "테스트 케이스 생성 중…",
  "문제 검수 중…",
];

const fade = document.getElementById("page-fade");
const ring = document.getElementById("gauge-ring");
const ringFill = document.getElementById("gauge-ring-fill");
const pctEl = document.getElementById("gauge-pct");
const stageLabelEl = document.getElementById("gauge-stage-label");
const statusEl = document.getElementById("gauge-status");
const statusTextEl = document.getElementById("gauge-status-text");
const checklist = document.getElementById("gauge-checklist");
const checks = Array.from(checklist.querySelectorAll(".gauge-check"));
const startBtn = document.getElementById("start-btn");
const cancelBtn = document.getElementById("cancel-btn");
const eyebrow = document.getElementById("gauge-eyebrow");

/* ---------- Progress tracking ---------- */

function loadProgress() {
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.current === "number") return parsed;
    }
  } catch (_) {}
  return { current: 1, total: TOTAL_PROBLEMS };
}

function saveProgress(progress) {
  try {
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (_) {}
}

const progress = loadProgress();
saveProgress(progress);
eyebrow.textContent = `문제 ${progress.current} / ${progress.total} · 출제 중`;

/* ---------- Gauge animation ---------- */

let pct = 0;
let activeStage = -1;

function setStage(idx) {
  if (idx === activeStage) return;
  activeStage = idx;
  for (let i = 0; i < checks.length; i++) {
    const el = checks[i];
    el.classList.toggle("is-active", i === idx);
    el.classList.toggle("is-done", i < idx);
  }
  if (idx >= 0 && idx < STAGE_LABELS.length) {
    stageLabelEl.textContent = STAGE_LABELS[idx];
    statusTextEl.textContent = STAGE_LABELS[idx];
  }
}

function applyPct(value) {
  const clamped = Math.max(0, Math.min(100, value));
  pct = clamped;
  const offset = CIRCUMFERENCE * (1 - clamped / 100);
  ringFill.setAttribute("stroke-dashoffset", offset.toFixed(2));
  pctEl.innerHTML = `${Math.round(clamped)}<span class="pct-symbol">%</span>`;
  ring.setAttribute("aria-valuenow", String(Math.round(clamped)));

  // Map percentage to one of 4 stages (each ~25%)
  const stage = Math.min(3, Math.floor(clamped / 25));
  setStage(stage);
}

function finish() {
  applyPct(100);
  // Mark every stage as done.
  for (const el of checks) {
    el.classList.remove("is-active");
    el.classList.add("is-done");
  }
  ring.classList.add("is-done");
  stageLabelEl.textContent = "준비 완료!";
  statusEl.classList.add("is-done");
  statusTextEl.textContent = "출제가 완료되었어요. 시작 버튼을 눌러주세요.";
  startBtn.disabled = false;
  startBtn.classList.add("is-ready");
  startBtn.textContent = "시작하기 →";
}

function startAnimation() {
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / FILL_DURATION_MS);
    // Ease-out cubic for a slightly natural fill curve.
    const eased = 1 - Math.pow(1 - t, 3);
    applyPct(eased * 100);
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      finish();
    }
  }

  requestAnimationFrame(tick);
}

/* ---------- Wiring ---------- */

startBtn.addEventListener("click", async () => {
  if (startBtn.disabled) return;
  saveProgress(progress);
  await trySaveProgressToServer(progress);
  if (fade) fade.classList.remove("is-hidden");
  setTimeout(() => {
    window.location.href = NEXT_PAGE;
  }, 180);
});

cancelBtn.addEventListener("click", () => {
  // Drop progress and return to the landing page.
  try { sessionStorage.removeItem(PROGRESS_KEY); } catch (_) {}
  window.location.href = "index.html";
});

// Kick the animation on the next frame so the initial 0% is painted first.
requestAnimationFrame(() => {
  startAnimation();
});
