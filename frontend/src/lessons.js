import { LESSONS, getLesson } from "./lesson-data.js";
import { runC, normalizeOutput, judgeAvailable } from "./judge.js";

const API_BASE = "http://localhost:3000";

function $(id) { return document.getElementById(id); }

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readLessonId() {
  const id = new URLSearchParams(location.search).get("lesson");
  return id || null;
}

function trailColor(trail) {
  return ["green", "yellow", "orange", "red", "blue", "purple", "dark"][trail] ?? "green";
}
function trailHex(trail) {
  return ({
    green: "#22c55e", yellow: "#eab308", orange: "#f97316",
    red: "#ef4444", blue: "#3b82f6", purple: "#a855f7", dark: "#111111",
  })[trailColor(trail)];
}

function setThemeFor(trail) {
  const root = $("lessons-page");
  if (!root) return;
  root.style.setProperty("--lesson-hex", trailHex(trail));
}

// ---------------------------------------------------------------------------
// Section renderers (concept tab)
// ---------------------------------------------------------------------------
function renderSection(section) {
  switch (section.type) {
    case "h":    return `<h2 class="lesson-section__h">${escapeHtml(section.text)}</h2>`;
    case "h3":   return `<h3 class="lesson-section__h3">${escapeHtml(section.text)}</h3>`;
    case "p":    return `<p class="lesson-section__p">${escapeHtml(section.text)}</p>`;
    case "code": return `<pre class="lesson-section__code"><code>${escapeHtml(section.text)}</code></pre>`;
    case "list":
      return `<ul class="lesson-section__list">${
        section.items.map((it) => `<li>${escapeHtml(it)}</li>`).join("")
      }</ul>`;
    case "table":
      return `<table class="lesson-section__table"><tbody>${
        section.rows.map((row) =>
          `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`
        ).join("")
      }</tbody></table>`;
    case "callout":
      return `<aside class="lesson-section__callout">${escapeHtml(section.text)}</aside>`;
    default:
      return "";
  }
}

function renderConcept(lesson) {
  const pane = $("pane-concept");
  if (!pane) return;
  if (!lesson?.concept?.sections?.length) {
    pane.innerHTML = `<p class="lesson-section__p">개념 설명이 아직 준비 중입니다.</p>`;
    return;
  }
  pane.innerHTML = lesson.concept.sections.map(renderSection).join("");
}

// ---------------------------------------------------------------------------
// Problem tab — gap-check workspace style
// ---------------------------------------------------------------------------
const STARTER_CODE = `#include <stdio.h>\n\nint main() {\n  // 여기에 코드를 작성하세요\n\n  return 0;\n}\n`;
const SPLIT_KEY = "codenergy:lesson:split";
const SPLIT_MIN = 25;
const SPLIT_MAX = 75;

const state = {
  lessonId: null,
  serverMeta: null,
  displayLesson: null,
  flatProblems: [],
  selectedProblemId: null,
  verdicts: new Map(),
  // single case per problem (example)
  currentCase: { input: "", expected: "", ran: false, pass: null, actual: "" },
};

function flattenProblems(displayLesson) {
  if (!displayLesson?.problems) return [];
  const basics = (displayLesson.problems.basic || []).map((p) => ({ ...p, kind: "basic" }));
  const practice = (displayLesson.problems.practice || []).map((p) => ({ ...p, kind: "practice" }));
  return [...basics, ...practice];
}

// ---------------------------------------------------------------------------
// Monaco editor
// ---------------------------------------------------------------------------
let editorImpl = {
  getValue: () => $("lp-editor-fallback")?.value ?? STARTER_CODE,
  setValue: (v) => { const f = $("lp-editor-fallback"); if (f) f.value = v; },
  layout: () => {},
};

function mountMonaco(initialCode) {
  if (!window.monaco) return false;
  const container = $("lp-editor-container");
  const loading = $("lp-editor-loading");
  if (!container) return false;
  if (loading) loading.hidden = true;
  const editor = window.monaco.editor.create(container, {
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

function mountFallback(initialCode) {
  const container = $("lp-editor-container");
  const loading = $("lp-editor-loading");
  const fallback = $("lp-editor-fallback");
  if (container) container.hidden = true;
  if (loading) loading.hidden = true;
  if (fallback) { fallback.hidden = false; fallback.value = initialCode; }
  editorImpl = {
    getValue: () => fallback?.value ?? initialCode,
    setValue: (v) => { if (fallback) fallback.value = v; },
    layout: () => {},
  };
}

// ---------------------------------------------------------------------------
// Dock
// ---------------------------------------------------------------------------
function renderCaseTabs() {
  const cases = $("lp-dock-cases");
  if (!cases) return;
  const c = state.currentCase;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "problem-case is-active";
  if (c.ran) btn.classList.add(c.pass ? "is-pass" : "is-fail");
  btn.textContent = "Case1";
  cases.innerHTML = "";
  cases.appendChild(btn);
}

function renderResultBody() {
  const c = state.currentCase;
  const inputEl = $("lp-case-input");
  const actualEl = $("lp-case-actual");
  const expectedEl = $("lp-case-expected");
  const verdictEl = $("lp-dock-verdict");
  if (!inputEl) return;
  inputEl.textContent = c.input || "(없음)";
  expectedEl.textContent = c.expected || "";
  if (c.ran) {
    actualEl.textContent = c.actual || "";
    if (c.pass) {
      verdictEl.className = "problem-verdict is-pass";
      verdictEl.textContent = "맞았습니다";
    } else {
      verdictEl.className = "problem-verdict is-fail";
      verdictEl.textContent = "틀렸습니다";
    }
  } else {
    actualEl.innerHTML = `<span class="problem-io__placeholder">— 실행 결과가 여기 표시됩니다 —</span>`;
    verdictEl.className = "problem-verdict is-pending";
    verdictEl.innerHTML = `아직 실행하지 않았어요. <span style="color:#fff;text-decoration:underline;">코드 실행</span>을 눌러보세요.`;
  }
}

function renderTestsBody() {
  const editEl = $("lp-case-input-edit");
  if (editEl) editEl.value = state.currentCase.input || "";
}

function setDockMode(mode) {
  const dock = $("lp-dock");
  if (!dock) return;
  dock.dataset.mode = mode;
  dock.hidden = false;
  $("lp-action-cases")?.classList.toggle("is-active", mode === "tests");
  $("lp-action-result")?.classList.toggle("is-active", mode === "result");
  if (mode === "tests") renderTestsBody();
  else renderResultBody();
}

// ---------------------------------------------------------------------------
// Problem panel rendering
// ---------------------------------------------------------------------------
function renderProblemPanel(p) {
  if (!p) return;
  $("lp-problem-heading").textContent = p.title || p.id;
  $("lp-problem-desc").textContent = p.desc || "";

  const inputBody = $("lp-section-input-body");
  if (inputBody) {
    const ex = p.example;
    inputBody.innerHTML = ex?.input
      ? `<p>${escapeHtml(ex.input)}</p>`
      : `<p>(없음)</p>`;
  }

  const examplesBody = $("lp-examples-body");
  if (examplesBody) {
    const ex = p.example;
    examplesBody.innerHTML = `
      <div class="problem-example__case-h">예제 1</div>
      <div class="problem-example__io">
        <div class="problem-example__cell">
          <h4>입력</h4>
          <pre>${escapeHtml(ex?.input || "(없음)")}</pre>
        </div>
        <div class="problem-example__cell">
          <h4>출력</h4>
          <pre>${escapeHtml(ex?.output || "")}</pre>
        </div>
      </div>`;
  }

  // Update feature label
  const idx = state.flatProblems.findIndex((x) => x.id === p.id);
  const label = $("lp-feature-label");
  if (label) label.textContent = `Lesson · ${idx + 1}/${state.flatProblems.length}`;

  // Reset case
  state.currentCase = {
    input: p.example?.input || "",
    expected: p.example?.output || "",
    ran: false, pass: null, actual: "",
  };
  renderCaseTabs();
  renderResultBody();
}

// ---------------------------------------------------------------------------
// selectProblem
// ---------------------------------------------------------------------------
function selectProblem(problemId) {
  state.selectedProblemId = problemId;
  const p = state.flatProblems.find((x) => x.id === problemId);
  if (!p) return;

  renderProblemPanel(p);

  const key = `codenergy:lesson:code:${state.lessonId}:${problemId}`;
  const saved = sessionStorage.getItem(key) ?? STARTER_CODE;
  editorImpl.setValue(saved);

  // Clear verdict banner
  const dock = $("lp-dock");
  if (dock && dock.dataset.mode === "result") renderResultBody();
}

// ---------------------------------------------------------------------------
// Code run
// ---------------------------------------------------------------------------
function setRunLoading(on) {
  const btn = $("lp-action-run");
  if (!btn) return;
  if (on) {
    btn.disabled = true;
    if (!btn.dataset.prev) btn.dataset.prev = btn.innerHTML;
    btn.innerHTML = `<span class="problem-action__icon problem-action__icon--spin" aria-hidden="true">⟳</span> 실행 중…`;
    btn.classList.add("is-loading");
  } else {
    btn.disabled = false;
    btn.classList.remove("is-loading");
    if (btn.dataset.prev) { btn.innerHTML = btn.dataset.prev; delete btn.dataset.prev; }
  }
}

async function runCode() {
  const code = editorImpl.getValue();
  const c = state.currentCase;
  c.ran = false; c.pass = null; c.actual = "";
  setDockMode("result");
  renderCaseTabs();
  renderResultBody();

  if (!judgeAvailable) {
    // mock
    const ok = code.trim().length >= 20 && /main\s*\(/.test(code) && /printf\s*\(/.test(code);
    c.actual = ok ? normalizeOutput(c.expected) : "";
    c.ran = true;
    c.pass = ok && normalizeOutput(c.actual) === normalizeOutput(c.expected);
    $("lp-detail-time").textContent = `${Math.round(40 + Math.random() * 80)}ms`;
    $("lp-detail-mem").textContent = `${8 + Math.floor(Math.random() * 6)}MB`;
    renderCaseTabs();
    renderResultBody();
    return;
  }

  setRunLoading(true);
  let result;
  try {
    result = await runC(code, c.input ? c.input + "\n" : "");
  } catch (err) {
    result = { verdict: "system", stdout: "", stderr: "", compileOutput: "", statusDescription: err?.message || String(err), timeMs: null, memoryKb: null };
  }
  const actual = normalizeOutput(result.stdout);
  const expected = normalizeOutput(c.expected);
  const ok = result.verdict === "accepted" && actual === expected;
  c.ran = true;
  c.pass = ok;
  c.actual =
    result.verdict === "accepted" ? actual :
    result.verdict === "compile" ? (result.compileOutput || "(컴파일 오류)").trim() :
    result.verdict === "tle" ? "(시간 초과)" :
    result.verdict === "runtime" ? `(런타임 오류)\n${result.stderr || result.statusDescription}` :
    actual || `(${result.statusDescription})`;

  if (result.timeMs) $("lp-detail-time").textContent = `${result.timeMs}ms`;
  if (result.memoryKb) $("lp-detail-mem").textContent = `${(result.memoryKb / 1024).toFixed(1)}MB`;
  setRunLoading(false);
  renderCaseTabs();
  renderResultBody();
}

// ---------------------------------------------------------------------------
// Submit
// ---------------------------------------------------------------------------
async function submitCurrent() {
  if (!state.selectedProblemId) return;
  const code = editorImpl.getValue();
  const overlay = $("lp-grading-overlay");

  overlay.classList.add("is-visible");
  overlay.setAttribute("aria-hidden", "false");
  $("lp-action-submit").disabled = true;

  try {
    const res = await fetch(`${API_BASE}/api/learn/submit`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: state.lessonId,
        problemId: state.selectedProblemId,
        code,
      }),
    });
    const body = await res.json().catch(() => ({}));

    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");

    const verdictEl = $("lp-dock-verdict");
    setDockMode("result");

    if (!res.ok) {
      const map = { 401: "로그인 후 제출할 수 있어요.", 422: "이 문제는 해당 레슨에 속하지 않습니다.", 423: "아직 잠긴 레슨이에요." };
      verdictEl.className = "problem-verdict is-fail";
      verdictEl.textContent = map[res.status] || body.error || "제출 실패";
      return;
    }

    state.verdicts.set(state.selectedProblemId, { verdict: body.verdict, ungraded: body.ungraded });

    if (body.verdict === "correct" && body.ungraded) {
      verdictEl.className = "problem-verdict is-pending";
      verdictEl.textContent = "정답이지만 Judge0 미설정으로 미채점 처리됩니다.";
    } else if (body.verdict === "correct") {
      verdictEl.className = "problem-verdict is-pass";
      verdictEl.textContent = "맞았습니다 ✓";
    } else {
      verdictEl.className = "problem-verdict is-fail";
      verdictEl.textContent = "틀렸습니다. 출력값을 다시 확인해보세요.";
    }

    if (body.lessonStatus === "done") {
      $("lesson-foot").hidden = false;
      $("lesson-badge").hidden = false;
      $("lesson-badge").textContent = "✓ 완료";
      $("lesson-next").onclick = () => {
        if (body.nextLessonId) location.href = `lessons.html?lesson=${encodeURIComponent(body.nextLessonId)}`;
        else location.href = "codetrails.html";
      };
    }

    if (body.verdict === "correct") {
      // Auto-advance to next unsolved problem after brief pause
      setTimeout(() => {
        const nextP = state.flatProblems.find(
          (p) => p.id !== state.selectedProblemId && state.verdicts.get(p.id)?.verdict !== "correct"
        );
        if (nextP) {
          selectProblem(nextP.id);
        } else if (body.lessonStatus === "done") {
          verdictEl.className = "problem-verdict is-pass";
          verdictEl.textContent = "레슨 완료! 다음 레슨 버튼을 눌러주세요.";
        }
      }, 1200);
    }
  } catch (_err) {
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    setDockMode("result");
    const verdictEl = $("lp-dock-verdict");
    verdictEl.className = "problem-verdict is-fail";
    verdictEl.textContent = "서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.";
  } finally {
    $("lp-action-submit").disabled = false;
  }
}

// ---------------------------------------------------------------------------
// Splitter
// ---------------------------------------------------------------------------
function initSplitter() {
  const splitter = $("lp-splitter");
  const workspace = $("lp-workspace");
  if (!splitter || !workspace) return;

  function applySplit(pct) {
    const clamped = Math.max(SPLIT_MIN, Math.min(SPLIT_MAX, pct));
    workspace.style.setProperty("--problem-split", `${clamped}%`);
    editorImpl.layout();
  }

  try {
    const saved = parseFloat(sessionStorage.getItem(SPLIT_KEY));
    if (Number.isFinite(saved)) applySplit(saved);
  } catch (_) {}

  let dragging = false;
  splitter.addEventListener("pointerdown", (e) => {
    dragging = true;
    splitter.classList.add("is-dragging");
    document.body.classList.add("is-resizing-problem");
    splitter.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const rect = workspace.getBoundingClientRect();
    if (rect.width <= 0) return;
    applySplit(((e.clientX - rect.left) / rect.width) * 100);
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    splitter.classList.remove("is-dragging");
    document.body.classList.remove("is-resizing-problem");
    const cur = parseFloat(workspace.style.getPropertyValue("--problem-split"));
    if (Number.isFinite(cur)) try { sessionStorage.setItem(SPLIT_KEY, String(cur)); } catch (_) {}
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  splitter.addEventListener("dblclick", () => {
    applySplit(50);
    try { sessionStorage.setItem(SPLIT_KEY, "50"); } catch (_) {}
  });

  splitter.addEventListener("keydown", (e) => {
    const cur = parseFloat(workspace.style.getPropertyValue("--problem-split")) || 50;
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") applySplit(cur - step);
    else if (e.key === "ArrowRight") applySplit(cur + step);
    else return;
    e.preventDefault();
    const next = parseFloat(workspace.style.getPropertyValue("--problem-split"));
    if (Number.isFinite(next)) try { sessionStorage.setItem(SPLIT_KEY, String(next)); } catch (_) {}
  });
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
function bindTabs() {
  const tabs = document.querySelectorAll(".lesson-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      const which = tab.dataset.tab;
      if (which === "problem") {
        document.body.classList.add("lp-problem-active");
        $("pane-concept").hidden = true;
        $("pane-problem").hidden = false;
        // Give Monaco a tick to measure its container
        setTimeout(() => editorImpl.layout(), 50);
      } else {
        document.body.classList.remove("lp-problem-active");
        $("pane-concept").hidden = false;
        $("pane-problem").hidden = true;
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
async function init() {
  const id = readLessonId();
  if (!id) {
    $("lesson-empty").hidden = false;
    $("lesson-empty-sub").textContent = "레슨 id가 지정되지 않았어요.";
    return;
  }
  state.lessonId = id;

  const display = getLesson(id);

  let serverMeta = null;
  try {
    const res = await fetch(`${API_BASE}/api/learn/lesson/${encodeURIComponent(id)}`, {
      credentials: "include",
    });
    if (res.ok) serverMeta = await res.json();
    else if (res.status === 404 && !display) {
      $("lesson-empty").hidden = false;
      return;
    }
  } catch (_err) {}
  state.serverMeta = serverMeta;
  state.displayLesson = display;

  if (!display) {
    $("lesson-empty").hidden = false;
    $("lesson-empty-sub").textContent = "표시 가능한 레슨 데이터가 아직 준비되지 않았어요.";
    return;
  }
  if (serverMeta && !serverMeta.unlocked) {
    $("lesson-locked").hidden = false;
    return;
  }

  setThemeFor(display.trail);
  $("lesson-shell").hidden = false;
  $("lesson-crumb").textContent = `Trail ${display.trail} · Ch ${display.ch}-${display.no}`;
  $("lesson-name").textContent = display.title;
  if (serverMeta?.status === "done") {
    $("lesson-badge").hidden = false;
    $("lesson-badge").textContent = "✓ 완료";
    $("lesson-foot").hidden = false;
    $("lesson-next").onclick = () => {
      if (serverMeta.nextLessonId) location.href = `lessons.html?lesson=${encodeURIComponent(serverMeta.nextLessonId)}`;
      else location.href = "codetrails.html";
    };
  }

  state.flatProblems = flattenProblems(display);
  renderConcept(display);

  // Wire Monaco (or fallback after 6s)
  const firstProblem = state.flatProblems[0];
  const initialCode = firstProblem
    ? (sessionStorage.getItem(`codenergy:lesson:code:${id}:${firstProblem.id}`) ?? STARTER_CODE)
    : STARTER_CODE;

  if (window.monaco) {
    mountMonaco(initialCode);
  } else {
    window.addEventListener("monaco-ready", () => mountMonaco(editorImpl.getValue()));
    setTimeout(() => { if (!window.monaco) mountFallback(initialCode); }, 6000);
  }

  // Wire editor auto-save
  const editEl = $("lp-editor-fallback");
  if (editEl) {
    editEl.addEventListener("input", () => {
      if (!state.selectedProblemId) return;
      const key = `codenergy:lesson:code:${state.lessonId}:${state.selectedProblemId}`;
      sessionStorage.setItem(key, editEl.value);
    });
  }

  if (state.flatProblems.length) selectProblem(state.flatProblems[0].id);

  bindTabs();
  initSplitter();

  // Dock buttons
  $("lp-action-cases")?.addEventListener("click", () => setDockMode("tests"));
  $("lp-action-result")?.addEventListener("click", () => setDockMode("result"));
  $("lp-dock-close")?.addEventListener("click", () => {
    const dock = $("lp-dock");
    if (dock) dock.hidden = true;
    $("lp-action-result")?.classList.remove("is-active");
    $("lp-action-cases")?.classList.remove("is-active");
  });

  $("lp-action-run")?.addEventListener("click", runCode);
  $("lp-action-submit")?.addEventListener("click", submitCurrent);

  $("lp-reset-btn")?.addEventListener("click", () => {
    if (!confirm("작성한 코드를 모두 지우고 시작 코드로 되돌릴까요?")) return;
    editorImpl.setValue(STARTER_CODE);
    if (state.selectedProblemId) {
      const key = `codenergy:lesson:code:${state.lessonId}:${state.selectedProblemId}`;
      sessionStorage.removeItem(key);
    }
  });

  // "← 개념 보기" button
  $("lp-back-btn")?.addEventListener("click", () => {
    const conceptTab = document.querySelector(".lesson-tab[data-tab='concept']");
    conceptTab?.click();
  });

  // Copy buttons in dock
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = document.getElementById(btn.getAttribute("data-copy"))?.textContent ?? "";
      navigator.clipboard?.writeText(text).catch(() => {});
    });
  });

  // Save code on Monaco changes (Monaco fires onChange events; poll via a simple interval)
  setInterval(() => {
    if (!state.selectedProblemId || !window.monaco) return;
    const key = `codenergy:lesson:code:${state.lessonId}:${state.selectedProblemId}`;
    try { sessionStorage.setItem(key, editorImpl.getValue()); } catch (_) {}
  }, 2000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
