import { PROBLEMS, TOTAL_PROBLEMS, TIME_PER_PROBLEM_MS } from "./test-problems.js";

/* =====================================================================
   Test problem screen — Step 5 of the coding-test flow.

   - Loads the current problem from sessionStorage["codenergy:test:progress"].
   - Mounts Monaco editor (loaded by HTML via AMD); falls back to a textarea
     if Monaco fails to load within ~6s.
   - Per-problem 10-minute countdown, persisted across refreshes.
   - "코드 실행": evaluates the JS reference for the chosen A value (mock).
   - "제출 및 채점": runs every A in [aMin, aMax] through the reference and
     records the verdict. Demo mode — see test-problems.js for the contract
     a real backend compiler would replace.
   ===================================================================== */

const PROGRESS_KEY = "codenergy:test:progress";
const ANSWERS_KEY  = "codenergy:test:answers";   // map { [problemId]: { code, verdict, durationMs } }
const TIMER_KEY    = "codenergy:test:timer";     // { problemId, deadline }
const NEXT_PAGE    = "test-result.html";

/* ---------- Progress ---------- */

function loadProgress() {
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.current === "number") {
        return { current: parsed.current, total: parsed.total ?? TOTAL_PROBLEMS };
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

/* ---------- DOM refs ---------- */

const fade            = document.getElementById("page-fade");
const chip            = document.getElementById("problem-chip");
const titleMini       = document.getElementById("problem-title-mini");
const pipsEl          = document.getElementById("problem-pips");
const titleTag        = document.getElementById("problem-tag");
const titleEl         = document.getElementById("problem-title");
const descEl          = document.getElementById("problem-desc");
const sampleInputEl   = document.getElementById("sample-input");
const sampleOutputEl  = document.getElementById("sample-output");
const constraintsEl   = document.getElementById("problem-constraints");
const editorContainer = document.getElementById("editor-container");
const editorLoading   = document.getElementById("editor-loading");
const editorFallback  = document.getElementById("editor-fallback");
const resetBtn        = document.getElementById("reset-btn");
const aInput          = document.getElementById("a-input");
const aRange          = document.getElementById("a-range");
const aHint           = document.getElementById("a-hint");
const runBtn          = document.getElementById("run-btn");
const placeholder     = document.getElementById("output-placeholder");
const outputContent   = document.getElementById("output-content");
const outputExpected  = document.getElementById("output-expected");
const outputStatus    = document.getElementById("output-status");
const tabTests        = document.getElementById("tab-tests");
const tabOutput       = document.getElementById("tab-output");
const submitBtn       = document.getElementById("submit-test-btn");
const exitBtn         = document.getElementById("exit-btn");
const timerText       = document.getElementById("timer-text");
const timerEl         = document.getElementById("problem-timer");
const overlay         = document.getElementById("grading-overlay");
const overlayTitle    = document.getElementById("grading-title");
const overlaySub      = document.getElementById("grading-sub");

/* ---------- Render problem metadata ---------- */

function renderPips() {
  pipsEl.innerHTML = "";
  for (let i = 1; i <= progress.total; i++) {
    const pip = document.createElement("span");
    pip.className =
      "problem-pip" +
      (i < progress.current ? " is-done" : i === progress.current ? " is-current" : "");
    pipsEl.appendChild(pip);
  }
}

function renderProblem() {
  chip.textContent = `문제 ${progress.current} / ${progress.total}`;
  titleMini.textContent = problem.title;
  titleTag.textContent = problem.tag;
  titleEl.textContent = problem.title;
  descEl.innerHTML = problem.description;
  sampleInputEl.textContent = problem.sample.input;
  sampleOutputEl.textContent = problem.sample.output;
  constraintsEl.innerHTML = problem.constraints
    .map((c) => `<li>${c}</li>`)
    .join("");
  aInput.min = String(problem.aMin);
  aInput.max = String(problem.aMax);
  aRange.min = String(problem.aMin);
  aRange.max = String(problem.aMax);
  aInput.value = String(problem.aDefault);
  aRange.value = String(problem.aDefault);
  aHint.textContent = `범위: ${problem.aMin} ~ ${problem.aMax}`;
  renderPips();
}

renderProblem();

/* ---------- Editor (Monaco with textarea fallback) ---------- */

const ANSWER_PREV = loadAnswers()[problem.id];
const initialCode = ANSWER_PREV?.code ?? problem.starter;

let editorImpl = {
  // Filled in once Monaco loads, or by the textarea fallback.
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

if (window.monaco) {
  mountMonaco();
} else {
  window.addEventListener("monaco-ready", () => mountMonaco());
  setTimeout(() => {
    if (!window.monaco) mountFallback();
  }, 6000);
}

resetBtn.addEventListener("click", () => {
  if (confirm("현재 작성한 코드를 모두 지우고 시작 코드로 되돌릴까요?")) {
    editorImpl.setValue(problem.starter);
  }
});

/* ---------- Test-case range controls ---------- */

function syncARange(source) {
  let v = parseInt(source.value, 10);
  if (Number.isNaN(v)) v = problem.aDefault;
  if (v < problem.aMin) v = problem.aMin;
  if (v > problem.aMax) v = problem.aMax;
  aInput.value = String(v);
  aRange.value = String(v);
}

aInput.addEventListener("input", () => syncARange(aInput));
aRange.addEventListener("input", () => syncARange(aRange));

/* ---------- Run code (mock) ---------- */

function runForA(A) {
  const expected = problem.expected(A);
  placeholder.hidden = true;
  outputContent.hidden = false;
  outputExpected.textContent = expected;
  outputStatus.textContent = "통과";
  outputStatus.className = "problem-output__diff--ok";
  // Auto-switch to output tab so the user sees the result.
  setActiveTab("output");
}

runBtn.addEventListener("click", () => {
  const A = parseInt(aInput.value, 10);
  if (Number.isNaN(A)) return;
  runForA(A);
});

/* ---------- Tabs ---------- */

function setActiveTab(which) {
  const isTests = which === "tests";
  tabTests.classList.toggle("is-active", isTests);
  tabOutput.classList.toggle("is-active", !isTests);
  tabTests.setAttribute("aria-selected", isTests ? "true" : "false");
  tabOutput.setAttribute("aria-selected", !isTests ? "true" : "false");
}
tabTests.addEventListener("click", () => setActiveTab("tests"));
tabOutput.addEventListener("click", () => setActiveTab("output"));

/* ---------- Timer ---------- */

function loadTimer() {
  try {
    const raw = sessionStorage.getItem(TIMER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.problemId === problem.id && typeof parsed.deadline === "number") {
        return parsed;
      }
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

/* ---------- Submit & grade ---------- */

function basicSanityChecks(code) {
  // Rough heuristic so an empty submission doesn't auto-pass in demo mode.
  if (!code || code.trim().length < 20) return false;
  if (!/main\s*\(/.test(code)) return false;
  if (!/printf\s*\(/.test(code)) return false;
  return true;
}

function gradeAllCases() {
  const cases = [];
  for (let A = problem.aMin; A <= problem.aMax; A++) {
    cases.push({ A, expected: problem.expected(A) });
  }
  return cases;
}

async function submitTest(reason = "manual") {
  if (submitBtn.disabled) return;
  submitBtn.disabled = true;
  clearInterval(timerInterval);

  const code = editorImpl.getValue();
  const cases = gradeAllCases();
  const looksReasonable = basicSanityChecks(code);
  const verdict = reason === "timeout"
    ? "timeout"
    : looksReasonable ? "correct" : "wrong";

  saveAnswer(problem.id, {
    code,
    verdict,
    cases,
    submittedAt: Date.now(),
    reason,
  });

  // Show grading overlay for a beat so it feels alive.
  overlay.classList.add("is-visible");
  overlay.setAttribute("aria-hidden", "false");
  overlayTitle.textContent = reason === "timeout" ? "시간 초과 — 자동 제출" : "채점 중…";
  overlaySub.textContent = `테스트 케이스 ${cases.length}개를 검증하고 있어요.`;

  // Animate sub text through the case range briefly.
  let i = 0;
  const stepEvery = Math.max(40, Math.min(400, Math.floor(1400 / cases.length)));
  const animator = setInterval(() => {
    if (i >= cases.length) { clearInterval(animator); return; }
    overlaySub.textContent =
      `A = ${cases[i].A} → 기대 출력 ${cases[i].expected}` +
      (i === cases.length - 1 ? " · 검증 완료" : "");
    i++;
  }, stepEvery);

  // Cleanup timer record for this problem.
  try { sessionStorage.removeItem(TIMER_KEY); } catch (_) {}

  setTimeout(() => {
    if (fade) fade.classList.remove("is-hidden");
    setTimeout(() => {
      window.location.href = NEXT_PAGE;
    }, 200);
  }, 1500);
}

submitBtn.addEventListener("click", () => submitTest("manual"));

/* ---------- Exit ---------- */

exitBtn.addEventListener("click", () => {
  if (!confirm("정말 테스트를 종료할까요? 진행 상황이 사라집니다.")) return;
  for (const k of [PROGRESS_KEY, ANSWERS_KEY, TIMER_KEY]) {
    try { sessionStorage.removeItem(k); } catch (_) {}
  }
  window.location.href = "index.html";
});
