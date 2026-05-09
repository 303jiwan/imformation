/* =====================================================================
   Concept selection screen — Step 1 of the coding-test flow.
   Language: C only. Purple/green Codenergy theme via style.css (loaded
   by main.js on this page).
   ===================================================================== */

const CONCEPTS = [
  { id: "vars",       name: "변수와 자료형",   tag: "기초",   desc: "int, float, char, 형변환 등 기본 자료형" },
  { id: "operators",  name: "연산자",         tag: "기초",   desc: "산술·논리·비트 연산자, 우선순위" },
  { id: "cond",       name: "조건문",         tag: "기초",   desc: "if / else if / switch 분기" },
  { id: "loops",      name: "반복문",         tag: "기초",   desc: "for, while, do-while, 중첩 반복" },
  { id: "arrays",     name: "배열",           tag: "기본",   desc: "1차원·2차원 배열, 인덱스 접근" },
  { id: "strings",    name: "문자열",         tag: "기본",   desc: "char 배열과 문자열 처리 함수" },
  { id: "functions",  name: "함수",           tag: "기본",   desc: "함수 정의, 파라미터, 반환 값" },
  { id: "io",         name: "표준 입출력",     tag: "기본",   desc: "scanf, printf, 형식 지정자" },
  { id: "pointers",   name: "포인터",         tag: "중급",   desc: "주소·역참조, 포인터 산술" },
  { id: "structs",    name: "구조체",         tag: "중급",   desc: "struct, typedef, 멤버 접근" },
  { id: "memory",     name: "동적 메모리",     tag: "중급",   desc: "malloc / calloc / free" },
  { id: "recursion",  name: "재귀",           tag: "응용",   desc: "재귀 함수, 호출 스택, 종료 조건" },
];

const DEFAULT_SELECTION = ["vars", "cond", "loops", "arrays", "functions"];
const STORAGE_KEY = "codenergy:test:concepts";

const grid = document.getElementById("concept-grid");
const countEl = document.getElementById("concept-count");
const startBtn = document.getElementById("start-btn");
const skipBtn = document.getElementById("skip-btn");
const selectAllBtn = document.getElementById("select-all-btn");
const clearBtn = document.getElementById("clear-btn");
const fade = document.getElementById("page-fade");

function renderTiles() {
  grid.innerHTML = "";
  const restored = loadSelection();
  for (const concept of CONCEPTS) {
    const label = document.createElement("label");
    label.className = "concept-tile";
    label.innerHTML = `
      <input type="checkbox" name="concept" value="${concept.id}" ${
        restored.includes(concept.id) ? "checked" : ""
      } />
      <span class="concept-tile__tag">${concept.tag}</span>
      <div class="concept-tile__head">
        <h3 class="concept-tile__name">${concept.name}</h3>
        <span class="concept-tile__check" aria-hidden="true">✓</span>
      </div>
      <p class="concept-tile__desc">${concept.desc}</p>
    `;
    label.querySelector("input").addEventListener("change", updateCount);
    grid.appendChild(label);
  }
  updateCount();
}

function getCheckedIds() {
  return Array.from(grid.querySelectorAll("input[name=concept]:checked")).map(
    (el) => el.value
  );
}

function setCheckedIds(ids) {
  for (const input of grid.querySelectorAll("input[name=concept]")) {
    input.checked = ids.includes(input.value);
  }
  updateCount();
}

function updateCount() {
  const n = getCheckedIds().length;
  countEl.innerHTML = `<strong>${n}</strong>개 개념 선택됨`;
  startBtn.disabled = n === 0;
}

function loadSelection() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.concepts)) return parsed.concepts;
  } catch (_) {}
  return [];
}

function saveAndNavigate(ids) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ concepts: ids, savedAt: Date.now() })
    );
  } catch (_) {}
  if (fade) fade.classList.remove("is-hidden");
  setTimeout(() => {
    window.location.href = "test-intro.html";
  }, 180);
}

startBtn.addEventListener("click", () => {
  const ids = getCheckedIds();
  if (ids.length === 0) return;
  saveAndNavigate(ids);
});

skipBtn.addEventListener("click", () => {
  saveAndNavigate(DEFAULT_SELECTION);
});

selectAllBtn.addEventListener("click", () => {
  setCheckedIds(CONCEPTS.map((c) => c.id));
});

clearBtn.addEventListener("click", () => {
  setCheckedIds([]);
});

renderTiles();
