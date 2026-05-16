// Lesson learning page controller.
//
// Flow:
//   ?lesson=<id> → fetch lesson catalog meta from server (lock state, problem ids)
//                 + read display text from `frontend/src/lesson-data.js`
//                 → render concept tab + problem tab
//   submit → POST /api/learn/submit → render verdict + (when lesson done) "next lesson" button
//
// The expected outputs are NEVER in the client bundle — server grades.

import { LESSONS, getLesson } from "./lesson-data.js";

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
  const root = document.getElementById("lessons-page");
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
// Problem tab (list + detail + editor + submit)
// ---------------------------------------------------------------------------
const STARTER_CODE = `#include <stdio.h>\n\nint main() {\n  // 여기에 코드를 작성하세요\n\n  return 0;\n}\n`;

const state = {
  lessonId: null,
  serverMeta: null, // { unlocked, status, problems: [...], nextLessonId }
  displayLesson: null,
  flatProblems: [], // [{ id, kind, ...display }]
  selectedProblemId: null,
  // Track per-problem verdict locally so the user can see progress in this
  // page session even before the lesson is fully done.
  verdicts: new Map(), // problemId -> { verdict, ungraded }
};

function flattenProblems(displayLesson) {
  if (!displayLesson?.problems) return [];
  const basics = (displayLesson.problems.basic || []).map((p) => ({ ...p, kind: "basic" }));
  const practice = (displayLesson.problems.practice || []).map((p) => ({ ...p, kind: "practice" }));
  return [...basics, ...practice];
}

function renderProblemList() {
  const host = $("problem-list");
  if (!host) return;
  host.innerHTML = state.flatProblems.map((p) => {
    const v = state.verdicts.get(p.id);
    const status = v?.verdict === "correct" ? (v.ungraded ? "ungraded" : "passed") : v ? "wrong" : "todo";
    const dot =
      status === "passed" ? "✅" :
      status === "ungraded" ? "🟡" :
      status === "wrong" ? "❌" : "⚪";
    const sel = p.id === state.selectedProblemId ? " is-selected" : "";
    return `<button type="button" class="lesson-problem-item${sel}" data-pid="${escapeHtml(p.id)}">
      <span class="lesson-problem-item__dot">${dot}</span>
      <span class="lesson-problem-item__kind">${p.kind === "basic" ? "기본" : "연습"}</span>
      <span class="lesson-problem-item__title">${escapeHtml(p.title || p.id)}</span>
    </button>`;
  }).join("");
  host.querySelectorAll("[data-pid]").forEach((btn) => {
    btn.addEventListener("click", () => selectProblem(btn.dataset.pid));
  });
}

function selectProblem(problemId) {
  state.selectedProblemId = problemId;
  const p = state.flatProblems.find((x) => x.id === problemId);
  if (!p) return;
  $("problem-title").textContent = p.title || problemId;
  const diffEl = $("problem-diff");
  diffEl.textContent = p.diff || "";
  diffEl.className = "diff" + (p.diff ? ` diff--${p.diff.toLowerCase()}` : "");
  $("problem-desc").innerHTML = `<p>${escapeHtml(p.desc || "")}</p>`;
  const ex = p.example;
  $("problem-example").innerHTML = ex
    ? `<div class="lesson-example">
         <div><strong>입력</strong><pre>${escapeHtml(ex.input || "(없음)")}</pre></div>
         <div><strong>출력</strong><pre>${escapeHtml(ex.output || "")}</pre></div>
       </div>`
    : "";
  // Editor: keep what user typed for this problem in sessionStorage.
  const key = `codenergy:lesson:code:${state.lessonId}:${problemId}`;
  const editor = $("lesson-editor");
  editor.value = sessionStorage.getItem(key) ?? STARTER_CODE;
  editor.oninput = () => sessionStorage.setItem(key, editor.value);
  $("lesson-result").hidden = true;
  renderProblemList();
}

async function submitCurrent() {
  if (!state.selectedProblemId) return;
  const code = $("lesson-editor").value;
  const btn = $("lesson-submit");
  btn.disabled = true;
  btn.textContent = "채점 중…";
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
    const result = $("lesson-result");
    result.hidden = false;
    if (!res.ok) {
      const map = { 401: "로그인 후 제출할 수 있어요.", 422: "이 문제는 해당 레슨에 속하지 않습니다.", 423: "아직 잠긴 레슨이에요." };
      result.className = "lesson-result is-error";
      result.textContent = map[res.status] || body.error || "제출 실패";
      return;
    }
    state.verdicts.set(state.selectedProblemId, { verdict: body.verdict, ungraded: body.ungraded });
    if (body.verdict === "correct" && body.ungraded) {
      result.className = "lesson-result is-warn";
      result.innerHTML = "🟡 정답이지만 채점 모드(judge0 미설정)라 진도에 반영되지 않아요. <code>JUDGE0_KEY</code>가 설정되어야 정식 통과 처리됩니다.";
    } else if (body.verdict === "correct") {
      result.className = "lesson-result is-ok";
      result.textContent = "✅ 통과!";
    } else {
      result.className = "lesson-result is-error";
      result.textContent = "❌ 정답이 아니에요. 출력값을 다시 확인해보세요.";
    }
    renderProblemList();
    if (body.lessonStatus === "done") {
      $("lesson-foot").hidden = false;
      $("lesson-badge").hidden = false;
      $("lesson-badge").textContent = "✓ 완료";
      $("lesson-next").onclick = () => {
        if (body.nextLessonId) location.href = `lessons.html?lesson=${encodeURIComponent(body.nextLessonId)}`;
        else location.href = "codetrails.html";
      };
    }
  } catch (err) {
    const result = $("lesson-result");
    result.hidden = false;
    result.className = "lesson-result is-error";
    result.textContent = "서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.";
  } finally {
    btn.disabled = false;
    btn.textContent = "제출";
  }
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
      $("pane-concept").hidden = which !== "concept";
      $("pane-problem").hidden = which !== "problem";
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

  // Hit server for lock state + canonical problem ids.
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
  } catch (_err) {
    // Backend unreachable — show display-only mode (no submit possible).
  }
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
  renderProblemList();
  if (state.flatProblems.length) selectProblem(state.flatProblems[0].id);

  bindTabs();
  $("lesson-submit").addEventListener("click", submitCurrent);
  $("lesson-reset").addEventListener("click", () => {
    if (!state.selectedProblemId) return;
    const key = `codenergy:lesson:code:${state.lessonId}:${state.selectedProblemId}`;
    sessionStorage.removeItem(key);
    $("lesson-editor").value = STARTER_CODE;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
