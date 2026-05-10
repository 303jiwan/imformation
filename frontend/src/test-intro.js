/* =====================================================================
   Test intro screen — Step 2 of the coding-test flow.
   - Renders selected concepts (from sessionStorage) as a summary chip.
   - Centered down-arrow toggles the extended explanation (Image #5).
   - "설명 건너뛰기" and "로그인하고 시작하기" both lead to test-login.html.
   ===================================================================== */

const STORAGE_KEY = "codenergy:test:concepts";

// Same concept registry as test-concepts.js — kept in sync by hand.
// If this list grows, factor it out into src/concepts.js as a shared module.
const CONCEPT_NAMES = {
  vars:      "변수와 자료형",
  operators: "연산자",
  cond:      "조건문",
  loops:     "반복문",
  arrays:    "배열",
  strings:   "문자열",
  functions: "함수",
  io:        "표준 입출력",
  pointers:  "포인터",
  structs:   "구조체",
  memory:    "동적 메모리",
  recursion: "재귀",
};

const summary = document.getElementById("intro-summary");
const conceptListEl = document.getElementById("intro-concept-list");
const toggle = document.getElementById("intro-toggle");
const toggleText = document.getElementById("intro-toggle-text");
const extended = document.getElementById("intro-extended");
const skipBtn = document.getElementById("skip-btn");
const nextBtn = document.getElementById("next-btn");
const fade = document.getElementById("page-fade");

function loadConcepts() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.concepts) ? parsed.concepts : [];
  } catch (_) {
    return [];
  }
}

function renderSummary() {
  const ids = loadConcepts();
  if (ids.length === 0) {
    // No concept selection found — user landed here directly. Hide chip.
    summary.hidden = true;
    return;
  }
  const names = ids.map((id) => CONCEPT_NAMES[id] || id);
  conceptListEl.textContent = names.join(", ");
  summary.hidden = false;
}

function setExtendedOpen(open) {
  extended.classList.toggle("is-open", open);
  extended.setAttribute("aria-hidden", open ? "false" : "true");
  toggle.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggleText.textContent = open ? "안내 접기" : "더 자세한 안내 보기";
  if (open) {
    // Scroll the extended block into view smoothly so users see the new content.
    requestAnimationFrame(() => {
      extended.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

toggle.addEventListener("click", () => {
  const isOpen = extended.classList.contains("is-open");
  setExtendedOpen(!isOpen);
});

function navigateNext() {
  if (fade) fade.classList.remove("is-hidden");
  setTimeout(() => {
    window.location.href = "test-login.html";
  }, 180);
}

skipBtn.addEventListener("click", navigateNext);
nextBtn.addEventListener("click", navigateNext);

renderSummary();
