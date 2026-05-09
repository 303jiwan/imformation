import { PROBLEMS, TOTAL_PROBLEMS, TIME_PER_PROBLEM_MS, getTestCases } from "./test-problems.js";

/* =====================================================================
   Test problem screen — Codetree-style focused workspace.

   - Left: problem statement with 입력 / 제한 조건 / 출력 / 입력 예제 sections.
   - Right top: Monaco C editor (CDN AMD with textarea fallback).
   - Right bottom: result dock with Case1..N tabs, IO comparison, details.
   - Bottom action bar: 테스트케이스 / 결과 (dock tabs) / 코드 실행 / 제출 및 채점.
   - 10-min countdown per problem, persisted across refreshes.
   - Demo execution: JS reference solver stands in for real C compilation;
     swap test-problems.js's `expected` for backend output when ready.
   ===================================================================== */

const PROGRESS_KEY = "codenergy:test:progress";
const ANSWERS_KEY  = "codenergy:test:answers";
const TIMER_KEY    = "codenergy:test:timer";
const NEXT_PAGE    = "test-result.html";

/* ---------- Storage ---------- */

function loadProgress() {
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p?.current === "number") {
        return { current: p.current, total: p.total ?? TOTAL_PROBLEMS };
      }
    }
  } catch (_) {}
  return { current: 1, total: TOTAL_PROBLEMS };
}
function saveProgress(p) {
  try { sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch (_) {}
}
function loadAnswers() {
  try {
    const raw = sessionStorage.getItem(ANSWERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) { return {}; }
}
function saveAnswer(problemId, payload) {
  const all = loadAnswers();
  all[problemId] = { ...(all[problemId] || {}), ...payload };
  try { sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(all)); } catch (_) {}
}

const progress = loadProgress();
const problem = PROBLEMS.find((p) => p.id === progress.current) ?? PROBLEMS[0];

/**
 * Per-case state (editable). Each entry tracks both the user-supplied input
 * and any result from the most recent run. Recreated on "테스트케이스 초기화".
 */
function freshCases() {
  return getTestCases(problem).map((c) => ({
    id: c.id,
    input: c.input,
    expected: c.expected,
    A: c.A,
    ran: false,
    pass: null,
    actual: "",
  }));
}
let cases = freshCases();

/* ---------- DOM refs ---------- */
const $ = (id) => document.getElementById(id);
const fade            = $("page-fade");
const featureLabel    = $("feature-label");
const timerEl         = $("problem-timer");
const timerText       = $("timer-text");
const skipBtn         = $("skip-btn");
const exitBtn         = $("exit-btn");
const headingEl       = $("problem-heading");
const descEl          = $("problem-desc");
const inBodyEl        = $("section-input-body");
const consListEl      = $("section-constraints-list");
const outBodyEl       = $("section-output-body");
const examplesEl      = $("examples-body");
const editorContainer = $("editor-container");
const editorLoading   = $("editor-loading");
const editorFallback  = $("editor-fallback");
const resetBtn        = $("reset-btn");

const dockEl          = $("dock");
const dockCases       = $("dock-cases");
const dockAdd         = $("dock-add");
const dockReset       = $("dock-reset");
const dockClose       = $("dock-close");
const verdictEl       = $("dock-verdict");
const caseInputEl     = $("case-input");
const caseActualEl    = $("case-actual");
const caseExpectedEl  = $("case-expected");
const caseInputEdit   = $("case-input-edit");
const caseInputErr    = $("case-input-error");
const caseInputHint   = $("case-input-hint");
const detailTime      = $("detail-time");
const detailMem       = $("detail-mem");

const actCases        = $("action-cases");
const actResult       = $("action-result");
const actRun          = $("action-run");
const actSubmit       = $("action-submit");
const overlay         = $("grading-overlay");
const overlayTitle    = $("grading-title");
const overlaySub      = $("grading-sub");

/* ---------- Render problem ---------- */

featureLabel.textContent = `Gap Check · ${progress.current}/${progress.total}`;
headingEl.textContent = problem.title;
descEl.innerHTML = problem.description;
inBodyEl.innerHTML = `<p>${problem.inputDesc}</p>`;
outBodyEl.innerHTML = `<p>${problem.outputDesc}</p>`;
consListEl.innerHTML = problem.constraints.map((c) => `<li>${c}</li>`).join("");

examplesEl.innerHTML = problem.examples.map((ex, i) => `
  <div class="problem-example__case-h">예제 ${i + 1}</div>
  <div class="problem-example__io">
    <div class="problem-example__cell">
      <h4>입력</h4>
      <pre>${ex.input}</pre>
    </div>
    <div class="problem-example__cell">
      <h4>출력</h4>
      <pre>${ex.output}</pre>
    </div>
  </div>
`).join("");

/* ---------- Cases dock setup ---------- */

// Per-case state: { ran: boolean, pass: boolean|null, actual: string }
const caseState = cases.map(() => ({ ran: false, pass: null, actual: "" }));
let activeCaseIdx = 0;

function renderCaseTabs() {
  dockCases.innerHTML = "";
  cases.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "problem-case";
    if (i === activeCaseIdx) btn.classList.add("is-active");
    if (caseState[i].ran) {
      btn.classList.add(caseState[i].pass ? "is-pass" : "is-fail");
    }
    btn.textContent = `Case${c.id}`;
    btn.addEventListener("click", () => selectCase(i));
    dockCases.appendChild(btn);
  });
}

function renderCaseBody() {
  const c = cases[activeCaseIdx];
  const s = caseState[activeCaseIdx];
  caseInputEl.textContent = c.input;
  caseExpectedEl.textContent = c.expected;
  if (s.ran) {
    caseActualEl.textContent = s.actual;
    if (s.pass) {
      verdictEl.className = "problem-verdict is-pass";
      verdictEl.textContent = "맞았습니다";
    } else {
      verdictEl.className = "problem-verdict is-fail";
      verdictEl.textContent = "틀렸습니다";
    }
  } else {
    caseActualEl.innerHTML = `<span class="problem-io__placeholder">— 실행 결과가 여기 표시됩니다 —</span>`;
    verdictEl.className = "problem-verdict is-pending";
    verdictEl.innerHTML = `아직 실행하지 않았어요. <span style="color:#fff;text-decoration:underline;">코드 실행</span>을 눌러보세요.`;
  }
}

function selectCase(idx) {
  activeCaseIdx = idx;
  renderCaseTabs();
  renderCaseBody();
}

renderCaseTabs();
renderCaseBody();

dockClose.addEventListener("click", () => {
  dockEl.hidden = true;
  actResult.classList.remove("is-active");
  actCases.classList.remove("is-active");
});

actCases.addEventListener("click", () => {
  dockEl.hidden = false;
  actCases.classList.add("is-active");
  actResult.classList.remove("is-active");
});
actResult.addEventListener("click", () => {
  dockEl.hidden = false;
  actResult.classList.add("is-active");
  actCases.classList.remove("is-active");
});

/* ---------- Editor ---------- */

const ANSWER_PREV = loadAnswers()[problem.id];
const initialCode = ANSWER_PREV?.code ?? problem.starter;

let editorImpl = {
  getValue: () => initialCode,
  setValue: () => {},
  layout: () => {},
};

function mountMonaco() {
  if (!window.monaco) return false;
  editorLoading.hidden = true;
  const editor = window.monaco.editor.create(editorContainer, {
    value: initialCode,
    language: "c",
    theme: "vs-dark",
    automaticLayout: true,
    fontSize: 14,
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    tabSize: 4,
    insertSpaces: true,
  });
  editorImpl = {
    getValue: () => editor.getValue(),
    setValue: (v) => editor.setValue(v),
    layout: () => editor.layout(),
  };
  return true;
}
function mountFallback() {
  editorContainer.hidden = true;
  editorLoading.hidden = true;
  editorFallback.hidden = false;
  editorFallback.value = initialCode;
  editorImpl = {
    getValue: () => editorFallback.value,
    setValue: (v) => { editorFallback.value = v; },
    layout: () => {},
  };
}

if (window.monaco) mountMonaco();
else {
  window.addEventListener("monaco-ready", () => mountMonaco());
  setTimeout(() => { if (!window.monaco) mountFallback(); }, 6000);
}

resetBtn.addEventListener("click", () => {
  if (confirm("작성한 코드를 모두 지우고 시작 코드로 되돌릴까요?")) {
    editorImpl.setValue(problem.starter);
  }
});

/* ---------- Copy buttons in dock ---------- */

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-copy");
    const text = document.getElementById(targetId)?.textContent ?? "";
    navigator.clipboard?.writeText(text).catch(() => {});
  });
});

/* ---------- Timer ---------- */

function loadTimer() {
  try {
    const raw = sessionStorage.getItem(TIMER_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p.problemId === problem.id && typeof p.deadline === "number") return p;
    }
  } catch (_) {}
  const deadline = Date.now() + TIME_PER_PROBLEM_MS;
  const next = { problemId: problem.id, deadline };
  try { sessionStorage.setItem(TIMER_KEY, JSON.stringify(next)); } catch (_) {}
  return next;
}

const timer = loadTimer();
let timerInterval;
function formatMs(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function tickTimer() {
  const remaining = timer.deadline - Date.now();
  timerText.textContent = formatMs(remaining);
  timerEl.classList.toggle("is-low", remaining <= 60_000 && remaining > 0);
  if (remaining <= 0) {
    clearInterval(timerInterval);
    timerText.textContent = "00:00";
    submitTest("timeout");
  }
}
timerInterval = setInterval(tickTimer, 250);
tickTimer();

/* ---------- Run code (mock) ---------- */

function basicSanityChecks(code) {
  if (!code || code.trim().length < 20) return false;
  if (!/main\s*\(/.test(code)) return false;
  if (!/printf\s*\(/.test(code)) return false;
  return true;
}

function runAllCases() {
  const code = editorImpl.getValue();
  const looksReasonable = basicSanityChecks(code);
  const startedAt = performance.now();
  cases.forEach((c, i) => {
    // Demo mode: when the code passes basic shape checks, treat the run as
    // successful and surface the reference output. Otherwise, surface a
    // mock empty stdout to convey that nothing was produced.
    const actual = looksReasonable ? c.expected : "";
    caseState[i] = {
      ran: true,
      pass: looksReasonable && actual === c.expected,
      actual,
    };
  });
  const elapsed = Math.max(1, Math.round(performance.now() - startedAt));
  detailTime.textContent = `${elapsed + 40}ms`;
  detailMem.textContent  = `${(8 + Math.floor(Math.random() * 6))}MB`;

  // Switch to result mode in dock
  dockEl.hidden = false;
  actResult.classList.add("is-active");
  actCases.classList.remove("is-active");

  // Jump to first failing case (or stay on current if all pass)
  const firstFailIdx = caseState.findIndex((s) => !s.pass);
  if (firstFailIdx >= 0) activeCaseIdx = firstFailIdx;
  renderCaseTabs();
  renderCaseBody();
}

actRun.addEventListener("click", runAllCases);

/* ---------- Submit ---------- */

async function submitTest(reason = "manual") {
  if (actSubmit.disabled) return;
  actSubmit.disabled = true;
  clearInterval(timerInterval);

  const code = editorImpl.getValue();
  const fullCases = [];
  for (let A = problem.aMin; A <= problem.aMax; A++) {
    fullCases.push({ A, expected: problem.expected(A) });
  }
  const looksReasonable = basicSanityChecks(code);
  const verdict = reason === "timeout"
    ? "timeout"
    : looksReasonable ? "correct" : "wrong";

  saveAnswer(problem.id, {
    code,
    verdict,
    cases: fullCases,
    submittedAt: Date.now(),
    reason,
  });

  overlay.classList.add("is-visible");
  overlay.setAttribute("aria-hidden", "false");
  overlayTitle.textContent = reason === "timeout" ? "시간 초과 — 자동 제출" : "채점 중…";
  overlaySub.textContent = `테스트 케이스 ${fullCases.length}개를 검증하고 있어요.`;

  let i = 0;
  const stepEvery = Math.max(40, Math.min(400, Math.floor(1400 / fullCases.length)));
  const animator = setInterval(() => {
    if (i >= fullCases.length) { clearInterval(animator); return; }
    overlaySub.textContent =
      `A = ${fullCases[i].A} → 기대 출력 ${fullCases[i].expected}` +
      (i === fullCases.length - 1 ? " · 검증 완료" : "");
    i++;
  }, stepEvery);

  try { sessionStorage.removeItem(TIMER_KEY); } catch (_) {}
  setTimeout(() => {
    if (fade) fade.classList.remove("is-hidden");
    setTimeout(() => { window.location.href = NEXT_PAGE; }, 200);
  }, 1500);
}

actSubmit.addEventListener("click", () => submitTest("manual"));

/* ---------- Skip / Exit ---------- */

skipBtn.addEventListener("click", () => {
  if (!confirm("이 문제를 건너뛰고 다음 문제로 넘어갈까요? 미제출 처리됩니다.")) return;
  saveAnswer(problem.id, {
    code: editorImpl.getValue(),
    verdict: "wrong",
    cases: [],
    submittedAt: Date.now(),
    reason: "skipped",
  });
  clearInterval(timerInterval);
  try { sessionStorage.removeItem(TIMER_KEY); } catch (_) {}
  if (fade) fade.classList.remove("is-hidden");
  setTimeout(() => { window.location.href = NEXT_PAGE; }, 180);
});

exitBtn.addEventListener("click", () => {
  if (!confirm("정말 갭체크를 종료할까요? 진행 상황이 사라집니다.")) return;
  for (const k of [PROGRESS_KEY, ANSWERS_KEY, TIMER_KEY]) {
    try { sessionStorage.removeItem(k); } catch (_) {}
  }
  window.location.href = "index.html";
});

/* ---------- Column splitter (drag-to-resize) ---------- */

const SPLIT_KEY = "codenergy:test:split";
const SPLIT_MIN = 25;  // % — never let either column collapse fully
const SPLIT_MAX = 75;
const splitter = $("splitter");
const workspace = $("workspace");

function applySplit(pct) {
  const clamped = Math.max(SPLIT_MIN, Math.min(SPLIT_MAX, pct));
  workspace.style.setProperty("--problem-split", `${clamped}%`);
  // Monaco's automaticLayout handles editor resize via ResizeObserver, but
  // calling explicitly during drag avoids a brief frame where the gutter
  // overlaps content on slower machines.
  editorImpl.layout();
}

// Restore previous session's split, if any.
try {
  const saved = parseFloat(sessionStorage.getItem(SPLIT_KEY));
  if (Number.isFinite(saved)) applySplit(saved);
} catch (_) {}

let draggingSplit = false;
splitter.addEventListener("pointerdown", (e) => {
  draggingSplit = true;
  splitter.classList.add("is-dragging");
  document.body.classList.add("is-resizing-problem");
  splitter.setPointerCapture?.(e.pointerId);
  e.preventDefault();
});
window.addEventListener("pointermove", (e) => {
  if (!draggingSplit) return;
  const rect = workspace.getBoundingClientRect();
  if (rect.width <= 0) return;
  const pct = ((e.clientX - rect.left) / rect.width) * 100;
  applySplit(pct);
});
function endSplitDrag() {
  if (!draggingSplit) return;
  draggingSplit = false;
  splitter.classList.remove("is-dragging");
  document.body.classList.remove("is-resizing-problem");
  const cur = parseFloat(workspace.style.getPropertyValue("--problem-split"));
  if (Number.isFinite(cur)) {
    try { sessionStorage.setItem(SPLIT_KEY, String(cur)); } catch (_) {}
  }
}
window.addEventListener("pointerup", endSplitDrag);
window.addEventListener("pointercancel", endSplitDrag);

// Double-click splitter to reset to 50/50.
splitter.addEventListener("dblclick", () => {
  applySplit(50);
  try { sessionStorage.setItem(SPLIT_KEY, "50"); } catch (_) {}
});

// Keyboard nudge when the splitter has focus (←/→ = 2%, Shift = 10%).
splitter.addEventListener("keydown", (e) => {
  const cur = parseFloat(workspace.style.getPropertyValue("--problem-split")) || 50;
  const step = e.shiftKey ? 10 : 2;
  if (e.key === "ArrowLeft")       applySplit(cur - step);
  else if (e.key === "ArrowRight") applySplit(cur + step);
  else return;
  e.preventDefault();
  const next = parseFloat(workspace.style.getPropertyValue("--problem-split"));
  if (Number.isFinite(next)) {
    try { sessionStorage.setItem(SPLIT_KEY, String(next)); } catch (_) {}
  }
});
