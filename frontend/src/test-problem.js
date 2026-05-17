import {
  PROBLEMS,
  TOTAL_PROBLEMS,
  TIME_PER_PROBLEM_MS,
  getTestCases,
  getGradingCases,
  buildProblemQueue,
  loadProblemQueue,
  saveProblemQueue,
  problemDifficulty,
  QUEUE_KEY,
} from "./test-problems.js";
import { runCMany, submitCMany, normalizeOutput, gradingSample, judgeAvailable } from "./judge.js";

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

const API_BASE     = "http://localhost:3000";
const PROGRESS_KEY = "codenergy:test:progress";
const ANSWERS_KEY  = "codenergy:test:answers";
const TIMER_KEY    = "codenergy:test:timer";
const CONCEPTS_KEY = "codenergy:test:concepts";
const NEXT_PAGE    = "test-result.html";

/* ---------- Battery reward toast ---------- */

function showBatteryToast(awarded) {
  if (!awarded || awarded <= 0) return;
  let toast = document.getElementById("battery-reward-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "battery-reward-toast";
    toast.style.cssText = [
      "position:fixed", "bottom:80px", "left:50%", "transform:translateX(-50%) translateY(20px)",
      "background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%)",
      "color:#fff", "font-weight:700", "font-size:15px", "padding:12px 24px",
      "border-radius:999px", "box-shadow:0 8px 24px rgba(34,197,94,0.45)",
      "opacity:0", "pointer-events:none",
      "transition:opacity 220ms ease,transform 220ms cubic-bezier(0.22,1,0.36,1)",
      "z-index:9999", "white-space:nowrap",
    ].join(";");
    document.body.appendChild(toast);
  }
  toast.textContent = `+${awarded} 🔋 적립`;
  // Trigger paint
  void toast.offsetWidth;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 2200);
}

/* ---------- POST answer to backend (fire-and-forget) ---------- */

async function postAnswerToBackend(problemId, code, verdict) {
  // 단순 기록. 배터리 적립은 grader 응답에서 처리된다 (showBatteryToast는 submit 흐름에서 호출).
  try {
    await fetch(`${API_BASE}/api/test/answer`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, code, verdict }),
    });
  } catch (_) {
    // 백엔드 없어도 무시 (demo mode)
  }
}

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

function loadSelectedConcepts() {
  try {
    const raw = sessionStorage.getItem(CONCEPTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.concepts) ? parsed.concepts : [];
  } catch (_) { return []; }
}

// Resolve the queue lazily — concepts page normally builds it, but this guards
// against direct navigation to test-problem.html with no queue saved.
let queue = loadProblemQueue();
if (!queue) {
  queue = buildProblemQueue(loadSelectedConcepts(), TOTAL_PROBLEMS);
  saveProblemQueue(queue);
}

const progress = loadProgress();
if (progress.total !== queue.length || progress.current > queue.length || progress.current < 1) {
  progress.total = queue.length;
  if (progress.current < 1) progress.current = 1;
  if (progress.current > queue.length) progress.current = queue.length;
  saveProgress(progress);
}

const problemId = queue[progress.current - 1];
const problem = PROBLEMS.find((p) => p.id === problemId) ?? PROBLEMS[0];

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

const MAX_CASES = 10;
let activeCaseIdx = 0;

function renderCaseTabs() {
  dockCases.innerHTML = "";
  cases.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "problem-case";
    if (i === activeCaseIdx) btn.classList.add("is-active");
    if (c.ran) btn.classList.add(c.pass ? "is-pass" : "is-fail");
    btn.textContent = `Case${c.id}`;
    btn.addEventListener("click", () => selectCase(i));
    dockCases.appendChild(btn);
  });
  dockAdd.disabled = cases.length >= MAX_CASES;
}

function renderResultBody() {
  const c = cases[activeCaseIdx];
  if (!c) return;
  caseInputEl.textContent = c.input;
  caseExpectedEl.textContent = c.expected;
  if (c.ran) {
    caseActualEl.textContent = c.actual || "";
    if (c.pass) {
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

/* ---------- Input parsing & validation ---------- */

const DIFFICULTY = problemDifficulty(problem);

function parseAFromInput(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return null;
  const first = trimmed.split(/\s+/)[0];
  const n = Number(first);
  if (!Number.isInteger(n)) return null;
  return n;
}

/**
 * Parse the case-input textarea into the shape `problem.expected` wants.
 *   easy   → integer (the single A) or null
 *   medium → { [name]: int } object matching problem.inputs, or null
 *   killer → null (cases are immutable, expected stays from getTestCases)
 */
function parseInputsForProblem(value) {
  if (DIFFICULTY === "killer") return null;
  if (DIFFICULTY === "medium" && Array.isArray(problem.inputs)) {
    const tokens = (value || "").trim().split(/\s+/);
    if (tokens.length < problem.inputs.length) return null;
    const values = {};
    for (let i = 0; i < problem.inputs.length; i++) {
      const inp = problem.inputs[i];
      const n = Number(tokens[i]);
      if (!Number.isInteger(n)) return null;
      if (n < inp.min || n > inp.max) return null;
      values[inp.name] = n;
    }
    return values;
  }
  // easy
  const A = parseAFromInput(value);
  if (A === null) return null;
  if (A < problem.aMin || A > problem.aMax) return null;
  return A;
}

/** Returns "ok" | "empty" | "out-of-range" | "frozen" (killer). */
function classifyInput(value) {
  if (DIFFICULTY === "killer") return "frozen";
  const trimmed = (value || "").trim();
  if (!trimmed) return "empty";
  const parsed = parseInputsForProblem(value);
  return parsed === null ? "out-of-range" : "ok";
}

function computeExpected(parsed) {
  if (DIFFICULTY === "killer") return null; // expected fixed by testCases
  if (typeof problem.expected === "function") {
    return problem.expected(parsed);
  }
  return null;
}

function inputHintText() {
  if (DIFFICULTY === "killer") {
    return "이 문제는 미리 정해진 테스트 케이스로만 채점됩니다 (편집 불가).";
  }
  if (DIFFICULTY === "medium" && Array.isArray(problem.inputs)) {
    return (
      "허용 범위 · " +
      problem.inputs
        .map((inp) => `${inp.name}: ${inp.min}~${inp.max}`)
        .join(" / ") +
      " (각 줄에 정수 하나씩)"
    );
  }
  return `허용 범위: ${problem.aMin} ~ ${problem.aMax} 사이의 정수`;
}

function refreshActiveCaseFromTextarea() {
  const c = cases[activeCaseIdx];
  if (!c) return;
  c.input = caseInputEdit.value;
  c.ran = false;
  c.pass = null;
  c.actual = "";

  if (DIFFICULTY === "killer") {
    // Killer cases are read-only: keep whatever getTestCases gave us.
    caseInputEdit.classList.remove("is-error");
    caseInputErr.hidden = true;
    renderCaseTabs();
    return;
  }

  const status = classifyInput(c.input);
  if (status === "ok") {
    const parsed = parseInputsForProblem(c.input);
    if (DIFFICULTY === "easy") c.A = parsed;
    else c.values = parsed;
    c.expected = computeExpected(parsed) ?? c.expected ?? "";
    caseInputEdit.classList.remove("is-error");
    caseInputErr.hidden = true;
  } else if (status === "out-of-range") {
    if (DIFFICULTY === "easy") c.A = null;
    else c.values = null;
    c.expected = "";
    caseInputEdit.classList.add("is-error");
    caseInputErr.hidden = false;
  } else { // empty
    if (DIFFICULTY === "easy") c.A = null;
    else c.values = null;
    c.expected = "";
    caseInputEdit.classList.remove("is-error");
    caseInputErr.hidden = true;
  }
  renderCaseTabs(); // refresh dot color (cleared after edit)
}

function renderTestsBody() {
  const c = cases[activeCaseIdx];
  if (!c) return;
  caseInputEdit.value = c.input ?? "";
  caseInputHint.textContent = inputHintText();
  // Killer cases are not editable.
  caseInputEdit.readOnly = DIFFICULTY === "killer";
  // Re-run validation against the synced value so the error styling stays correct.
  refreshActiveCaseFromTextarea();
}

function renderCaseBody() {
  if (dockEl.dataset.mode === "tests") renderTestsBody();
  else renderResultBody();
}

function selectCase(idx) {
  activeCaseIdx = idx;
  renderCaseTabs();
  renderCaseBody();
}

renderCaseTabs();
renderCaseBody();

caseInputEdit.addEventListener("input", refreshActiveCaseFromTextarea);

/* ---------- Dock open / close / mode ---------- */

function setDockMode(mode) {
  dockEl.dataset.mode = mode;
  dockEl.hidden = false;
  actCases.classList.toggle("is-active", mode === "tests");
  actResult.classList.toggle("is-active", mode === "result");
  renderCaseBody();
}

dockClose.addEventListener("click", () => {
  dockEl.hidden = true;
  actResult.classList.remove("is-active");
  actCases.classList.remove("is-active");
});

actCases.addEventListener("click", () => setDockMode("tests"));
actResult.addEventListener("click", () => setDockMode("result"));

/* ---------- Add / reset cases ---------- */

dockAdd.addEventListener("click", () => {
  if (cases.length >= MAX_CASES) return;
  // Killer problems ship a fixed set of cases — no manual additions.
  if (DIFFICULTY === "killer") return;
  const nextId = (cases[cases.length - 1]?.id || 0) + 1;
  if (DIFFICULTY === "medium" && Array.isArray(problem.inputs)) {
    const values = {};
    const lines = [];
    for (const inp of problem.inputs) {
      values[inp.name] = inp.min;
      lines.push(String(inp.min));
    }
    cases.push({
      id: nextId,
      input: lines.join("\n"),
      expected: problem.expected(values),
      A: null,
      values,
      ran: false,
      pass: null,
      actual: "",
    });
  } else {
    const A = problem.aMin;
    cases.push({
      id: nextId,
      input: String(A),
      expected: problem.expected(A),
      A,
      values: null,
      ran: false,
      pass: null,
      actual: "",
    });
  }
  activeCaseIdx = cases.length - 1;
  renderCaseTabs();
  renderCaseBody();
});

dockReset.addEventListener("click", () => {
  if (!confirm("테스트 케이스를 기본값으로 되돌릴까요? 추가/수정한 케이스는 사라집니다.")) return;
  cases = freshCases();
  activeCaseIdx = 0;
  renderCaseTabs();
  renderCaseBody();
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

function setRunLoading(isLoading) {
  if (isLoading) {
    actRun.disabled = true;
    if (!actRun.dataset.prev) actRun.dataset.prev = actRun.innerHTML;
    actRun.innerHTML = `<span class="problem-action__icon problem-action__icon--spin" aria-hidden="true">⟳</span> 실행 중…`;
    actRun.classList.add("is-loading");
  } else {
    actRun.disabled = false;
    actRun.classList.remove("is-loading");
    if (actRun.dataset.prev) {
      actRun.innerHTML = actRun.dataset.prev;
      delete actRun.dataset.prev;
    }
  }
}

async function runAllCases() {
  // Block the run if any case input is currently invalid — surface the error
  // by switching to tests mode on the offending case so the user can fix it.
  // Killer's "frozen" cases are always considered valid.
  const badIdx = cases.findIndex((c) => {
    const s = classifyInput(c.input);
    return s !== "ok" && s !== "frozen";
  });
  if (badIdx >= 0) {
    activeCaseIdx = badIdx;
    setDockMode("tests");
    caseInputEdit.focus();
    return;
  }

  const code = editorImpl.getValue();

  // Refresh expected from current input + clear any previous run state.
  cases.forEach((c) => {
    if (DIFFICULTY !== "killer") {
      const parsed = parseInputsForProblem(c.input);
      if (DIFFICULTY === "easy") c.A = parsed;
      else c.values = parsed;
      const e = computeExpected(parsed);
      if (e !== null) c.expected = e;
    }
    c.ran = false;
    c.pass = null;
    c.actual = "";
    delete c.verdict;
  });
  setDockMode("result");
  renderCaseTabs();
  renderCaseBody();

  if (!judgeAvailable()) {
    runMockAllCases(code);
    return;
  }

  setRunLoading(true);
  let totalTimeMs = 0;
  let maxMemKb = 0;

  try {
    const out = await runCMany(code, cases.map((c) => c.input + "\n"));

    if (out.compile?.ok === false) {
      // 컴파일 오류 — 모든 케이스에 동일 메시지
      const msg = (out.compile.output || "(컴파일 오류)").trim();
      for (const c of cases) {
        c.ran = true;
        c.pass = false;
        c.actual = msg;
        c.verdict = "compile";
      }
    } else {
      const caseResults = out.cases || [];
      for (let i = 0; i < cases.length; i++) {
        const c = cases[i];
        const r = caseResults[i] || { verdict: "system", stdout: "", stderr: "", statusDescription: "결과 없음", timeMs: null, memoryKb: null };

        const actual = normalizeOutput(r.stdout);
        const expected = normalizeOutput(c.expected);
        const ok = r.verdict === "ok" && actual === expected;

        c.ran = true;
        c.pass = ok;
        c.verdict = r.verdict;
        c.actual =
          r.verdict === "ok"           ? actual :
          r.verdict === "tle"          ? "(시간 초과)" :
          r.verdict === "runtime"      ? `(런타임 오류)\n${r.stderr || r.statusDescription}` :
          r.verdict === "output_limit" ? `(출력 초과)\n${r.stdout.slice(0, 200)}` :
          r.verdict === "system"       ? `(시스템 오류)\n${r.statusDescription}` :
          actual || `(${r.statusDescription})`;

        if (r.timeMs)   totalTimeMs += r.timeMs;
        if (r.memoryKb) maxMemKb = Math.max(maxMemKb, r.memoryKb);

        renderCaseTabs();
      }
    }
  } catch (err) {
    // 503/네트워크 실패 → mock 폴백
    if (!judgeAvailable()) {
      setRunLoading(false);
      runMockAllCases(code);
      return;
    }
    const msg = `(시스템 오류)\n${err?.message || String(err)}`;
    for (const c of cases) {
      c.ran = true;
      c.pass = false;
      c.actual = msg;
      c.verdict = "system";
    }
  }

  detailTime.textContent = totalTimeMs ? `${totalTimeMs}ms (총 ${cases.length}개)` : "—";
  detailMem.textContent  = maxMemKb ? `${(maxMemKb / 1024).toFixed(1)}MB` : "—";

  setRunLoading(false);

  const firstFailIdx = cases.findIndex((c) => !c.pass);
  if (firstFailIdx >= 0) activeCaseIdx = firstFailIdx;
  renderCaseTabs();
  renderCaseBody();
}

/** Demo-mode fallback used when no Judge0 key is configured. */
function runMockAllCases(code) {
  const looksReasonable = basicSanityChecks(code);
  cases.forEach((c) => {
    c.actual = looksReasonable ? c.expected : "";
    c.ran = true;
    c.pass = looksReasonable && c.actual === c.expected;
  });
  detailTime.textContent = `${Math.round(40 + Math.random() * 80)}ms`;
  detailMem.textContent  = `${(8 + Math.floor(Math.random() * 6))}MB`;
  const firstFailIdx = cases.findIndex((c) => !c.pass);
  if (firstFailIdx >= 0) activeCaseIdx = firstFailIdx;
  setDockMode("result");
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

  overlay.classList.add("is-visible");
  overlay.setAttribute("aria-hidden", "false");
  overlayTitle.textContent = reason === "timeout" ? "시간 초과 — 자동 제출" : "채점 중…";

  // Build the grading plan up-front so the submit loop is difficulty-agnostic:
  //   easy   → sample 100 A values across [aMin, aMax] (or sweep all if span < 100)
  //   medium → visible cases + hidden boundary/random cases (getGradingCases)
  //   killer → visible cases + problem.hiddenTestCases when provided
  let plan;
  if (DIFFICULTY === "easy") {
    let As = gradingSample(problem, 100);
    if (As.length > 200) {
      console.warn(`[grader] easy 케이스 ${As.length}개 → 200개로 잘라냄`);
      As = As.slice(0, 200);
    }
    plan = As.map((A) => ({
      input: String(A),
      expected: problem.expected(A),
      label: `A = ${A}`,
      A,
      hidden: false,
    }));
  } else {
    plan = getGradingCases(problem).map((c) => ({
      input: c.input,
      expected: c.expected,
      label: c.hidden ? `Hidden${c.id}` : `Case${c.id}`,
      A: c.A ?? null,
      values: c.values ?? null,
      hidden: !!c.hidden,
    }));
  }

  overlaySub.textContent = `테스트 케이스 ${plan.length}개를 검증하고 있어요.`;

  let verdict;
  if (reason === "timeout") {
    verdict = "timeout";
  } else {
    // 백엔드 채점 시도 → 실패 시 ungraded 폴백
    try {
      const casesPlan = plan.map((tc) => ({
        stdin: tc.input + "\n",
        expected: tc.expected,
        hidden: !!tc.hidden,
      }));
      const result = await submitCMany(code, casesPlan, { problemId: problem.id });

      if (result.compile?.ok === false) {
        overlaySub.textContent = "컴파일 오류 — 채점 종료";
        verdict = "wrong";
      } else {
        verdict = result.passed === result.total ? "correct" : "wrong";
        if (result.firstFail != null && verdict === "wrong") {
          const failLabel = plan[result.firstFail]?.label || `케이스 ${result.firstFail + 1}`;
          overlaySub.textContent = `${failLabel}에서 오답 — ${result.passed}/${result.total} 통과`;
        } else if (verdict === "correct") {
          overlaySub.textContent = `${result.passed}/${result.total} 모두 통과`;
        }
      }

      // 배터리 적립 토스트는 grader 응답에서 읽는다 (서버가 verdict 직접 판정).
      if (result && typeof result.awarded === "number" && result.awarded > 0) {
        showBatteryToast(result.awarded);
      }
    } catch (err) {
      // 503/네트워크 오류 → ungraded
      if (!judgeAvailable()) {
        let idx = 0;
        const stepEvery = Math.max(40, Math.min(200, Math.floor(1200 / plan.length)));
        await new Promise((resolve) => {
          const animator = setInterval(() => {
            if (idx >= plan.length) { clearInterval(animator); resolve(); return; }
            const tc = plan[idx];
            const hint = tc.hidden ? "기대 출력 (숨김)" : `기대 출력 ${tc.expected}`;
            overlaySub.textContent = `${tc.label} → ${hint}`;
            idx++;
          }, stepEvery);
        });
        overlaySub.textContent = "채점 서비스에 연결할 수 없어 자동 채점이 불가능해요 — 결과는 미채점으로 기록됩니다.";
      } else {
        overlaySub.textContent = `채점 오류: ${err?.message || String(err)}`;
      }
      verdict = "ungraded";
    }
  }

  saveAnswer(problem.id, {
    code,
    verdict,
    cases: plan.map((tc) => ({
      A: tc.A,
      values: tc.values,
      label: tc.label,
      // Hidden cases are part of grading only — never persist their
      // expected output to sessionStorage, since the result page would
      // otherwise leak them back into the DOM.
      expected: tc.hidden ? null : tc.expected,
      hidden: !!tc.hidden,
    })),
    submittedAt: Date.now(),
    reason,
  });

  // 백엔드에 답안 전송 + 배터리 적립 토스트 (verdict === "correct" → "AC" 로 변환)
  const backendVerdict = verdict === "correct" ? "AC" : verdict === "wrong" ? "WA" : verdict;
  postAnswerToBackend(problem.id, code, backendVerdict);

  try { sessionStorage.removeItem(TIMER_KEY); } catch (_) {}
  setTimeout(() => {
    if (fade) fade.classList.remove("is-hidden");
    setTimeout(() => { window.location.href = NEXT_PAGE; }, 200);
  }, 800);
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
  for (const k of [PROGRESS_KEY, ANSWERS_KEY, TIMER_KEY, QUEUE_KEY]) {
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
