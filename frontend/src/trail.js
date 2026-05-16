// Codenergy 트레일 페이지 (trail.html) — 7개 트레일을 ?trail=0..6 으로 분기.
// 좌측 챕터/노드 트리, 우측 갭체크 + Lesson 1 표 + CTA 를 동적으로 채운다.
// 각 트레일의 챕터/노드 이름은 codetrails.html 카드에 노출된 태그 + 첨부 시안에
// 보이는 챕터 라벨을 합쳐 만든 정적 데이터. 실제 학습 콘텐츠는 후속 작업.

import { getLesson as getLessonDisplay } from "./lesson-data.js";

const COLORS = {
  green:  { hex: "#22c55e", deep: "#16a34a", soft: "#ecfdf5", chip: "#dcfce7" },
  yellow: { hex: "#eab308", deep: "#ca8a04", soft: "#fefce8", chip: "#fef9c3" },
  orange: { hex: "#f97316", deep: "#ea580c", soft: "#fff7ed", chip: "#ffedd5" },
  red:    { hex: "#ef4444", deep: "#dc2626", soft: "#fef2f2", chip: "#fee2e2" },
  blue:   { hex: "#3b82f6", deep: "#2563eb", soft: "#eff6ff", chip: "#dbeafe" },
  purple: { hex: "#a855f7", deep: "#7c3aed", soft: "#faf5ff", chip: "#ede9fe" },
  dark:   { hex: "#111111", deep: "#000000", soft: "#f3f4f6", chip: "#e5e7eb" },
};

const TRAILS = [
  {
    id: 0, color: "green", eyebrow: "Trail 0. Codetree 101", title: "프로그래밍 시작",
    chapters: [
      { name: "Ch 1. 기본",     nodes: ["출력 입문", "변수", "기본 자료형", "연산자"] },
      { name: "Ch 2. 입출력",   nodes: ["출력", "입력 입문", "입력", "입출력 연습"] },
      { name: "Ch 3. 조건문 1", nodes: ["조건문 입문", "조건문"] },
    ],
    lesson: {
      title: "출력 입문",
      rows: [
        { step: "기본 문제", prob: "출력 입문 퀴즈", time: "1m", xp: 0,  diff: "Easy" },
        { step: "연습 문제", prob: "2줄 출력",       time: "1m", xp: 10, diff: "Easy" },
      ],
    },
  },
  {
    id: 1, color: "yellow", eyebrow: "Trail 1. Novice Low", title: "프로그래밍 기초",
    chapters: [
      { name: "Ch 1. 출력",   nodes: ["기본 출력", "변수와 자료형", "출력 형식", "소수점 맞춰 출력", "변수 값 변경", "다른 변수로부터 값 변경", "두 변수 값을 교환", "변수값 동시에 복사"] },
      { name: "Ch 2. 입출력", nodes: ["정수 입력", "실수 입력", "공백을 사이에 두고 입력", "2개씩 줄에 실수 입력", "문자, 문자열 입력", "특정 문자를 사이에 두고 입력"] },
    ],
    lesson: {
      title: "기본 출력",
      rows: [
        { step: "기본 문제", prob: "단어 출력",         time: "1m", xp: 10, diff: "Easy" },
        { step: "기본 문제", prob: "문장 출력",         time: "1m", xp: 10, diff: "Easy" },
        { step: "기본 문제", prob: "따옴표 출력",       time: "2m", xp: 10, diff: "Easy" },
        { step: "기본 문제", prob: "2줄 출력",          time: "1m", xp: 10, diff: "Easy" },
        { step: "기본 문제", prob: "숫자 출력하기",     time: "1m", xp: 10, diff: "Easy" },
        { step: "기본 문제", prob: "숫자 2개 출력하기", time: "1m", xp: 10, diff: "Easy" },
        { step: "연습 문제", prob: "한 줄 출력",        time: "1m", xp: 10, diff: "Easy" },
        { step: "연습 문제", prob: "두 줄 출력",        time: "1m", xp: 10, diff: "Easy" },
        { step: "테스트 문제", prob: "다양하게 출력",   time: "2m", xp: 10, diff: "Easy" },
      ],
    },
    ctaText: "이어서 학습하기 →",
  },
  {
    id: 2, color: "orange", eyebrow: "Trail 2. Novice Mid", title: "프로그래밍 연습",
    chapters: [
      { name: "Ch 1. 함수",     nodes: ["값을 반환하지 않는 함수", "값을 반환하는 함수", "Call by value / Call by reference", "변수의 영역"] },
      { name: "Ch 2. 재귀함수", nodes: ["값을 반환하지 않는 재귀함수", "값을 반환하는 재귀함수"] },
      { name: "Ch 3. 정렬",     nodes: ["일반 정렬", "객체", "객체 정렬"] },
      { name: "Ch 4. 시뮬레이션 I", nodes: [] },
    ],
    lesson: {
      title: "값을 반환하지 않는 함수",
      rows: [
        { step: "기본 문제", prob: "별 찍는 것을 5번 반복하기",     time: "2m",  xp: 10, diff: "Easy" },
        { step: "기본 문제", prob: "반복 출력하기",                 time: "2m",  xp: 10, diff: "Easy" },
        { step: "기본 문제", prob: "함수를 이용해 직사각형 만들기", time: "3m",  xp: 10, diff: "Easy" },
        { step: "연습 문제", prob: "숫자로 이루어진 사각형",         time: "8m",  xp: 10, diff: "Easy" },
        { step: "연습 문제", prob: "출력결과 80",                    time: "4m",  xp: 10, diff: "Easy" },
        { step: "연습 문제", prob: "최대공약수 구하기",              time: "11m", xp: 10, diff: "Easy" },
        { step: "연습 문제", prob: "출력결과 72",                    time: "2m",  xp: 10, diff: "Easy" },
        { step: "연습 문제", prob: "출력결과 20",                    time: "9m",  xp: 50, diff: "Hard" },
        { step: "테스트 문제", prob: "최소공배수 구하기",            time: "11m", xp: 30, diff: "Easy" },
      ],
    },
  },
  {
    id: 3, color: "red", eyebrow: "Trail 3. Novice High", title: "자료구조 알고리즘",
    chapters: [
      { name: "Ch 1. 시간, 공간복잡도", nodes: ["수도코드", "점근 표기법", "시간복잡도의 정의", "반복문의 시간복잡도", "재귀함수의 시간복잡도", "공간복잡도"] },
      { name: "Ch 2. 배열, 연결 리스트", nodes: ["배열", "Dynamic Array", "단일 연결 리스트", "Doubly-LinkedList"] },
    ],
    lesson: {
      title: "수도코드",
      rows: [
        { step: "기본 문제",   prob: "수도코드",   time: "1m", xp: 10, diff: "Easy" },
        { step: "연습 문제",   prob: "수도코드 2", time: "1m", xp: 10, diff: "Easy" },
        { step: "테스트 문제", prob: "수도코드 3", time: "1m", xp: 10, diff: "Medium" },
      ],
    },
  },
  {
    id: 4, color: "blue", eyebrow: "Trail 4. Intermediate Low", title: "알고리즘 입문",
    chapters: [
      { name: "Ch 1. Simulation", nodes: ["격자 안에서 완전탐색", "격자 안에서 밀고 당기기", "격자 안에서 터지고 떨어지는 경우", "격자 안에서 단일 객체로 이동", "격자 안에서 여러 객체로 이동"] },
      { name: "Ch 2. Backtracking", nodes: ["K개 중 하나를 N번 선택하기(Simple)", "K개 중 하나를 N번 선택하기(Conditional)", "N개 중에 M개 고르기(Simple)", "순열 만들기"] },
      { name: "Ch 3. DFS", nodes: [] },
    ],
    lesson: {
      title: "격자 안에서 완전탐색",
      rows: [
        { step: "기본 문제",   prob: "최고의 33위치",            time: "18m",  xp: 40, diff: "Easy" },
        { step: "연습 문제",   prob: "행복한 수열의 개수",        time: "79m",  xp: 60, diff: "Easy" },
        { step: "연습 문제",   prob: "트로미노",                  time: "79m",  xp: 90, diff: "Medium" },
        { step: "연습 문제",   prob: "금 채굴하기",               time: "180m", xp: 90, diff: "Medium" },
        { step: "연습 문제",   prob: "기울어진 직사각형",         time: "180m", xp: 90, diff: "Hard" },
        { step: "연습 문제",   prob: "겹쳐지지 않는 두 직사각형", time: "180m", xp: 90, diff: "Hard" },
        { step: "테스트 문제", prob: "양수 직사각형의 최대 크기", time: "180m", xp: 90, diff: "Medium" },
      ],
    },
  },
  {
    id: 5, color: "purple", eyebrow: "Trail 5. Intermediate Mid", title: "알고리즘 기본",
    chapters: [
      { name: "Ch 1. 중급 자료구조", nodes: ["HashMap", "TreeMap", "HashSet", "TreeSet", "Priority Queue", "Doubly-LinkedList"] },
      { name: "Ch 2. Shorten time Technique", nodes: ["Prefix Sum", "Grid Compression", "LR Technique", "+1-1 technique"] },
    ],
    lesson: {
      title: "HashMap",
      tags: ["Foundation", "Data Structure"],
      rows: [
        { step: "기본 문제",   prob: "hashmap 기본",                          time: "14m",  xp: 20, diff: "Easy" },
        { step: "기본 문제",   prob: "수 등장 횟수",                           time: "9m",   xp: 20, diff: "Easy" },
        { step: "기본 문제",   prob: "가장 많은 데이터",                       time: "6m",   xp: 20, diff: "Easy" },
        { step: "연습 문제",   prob: "대응되는 수와 문자",                     time: "22m",  xp: 20, diff: "Easy" },
        { step: "연습 문제",   prob: "두 수의 합",                             time: "49m",  xp: 60, diff: "Medium" },
        { step: "연습 문제",   prob: "세 수의 합",                             time: "101m", xp: 60, diff: "Medium" },
        { step: "연습 문제",   prob: "자주 등장한 top K 숫자",                 time: "40m",  xp: 60, diff: "Medium" },
        { step: "연습 문제",   prob: "원소의 합이 0",                          time: "71m",  xp: 90, diff: "Hard" },
        { step: "연습 문제",   prob: "순서를 바꾸었을 때 같은 단어 그룹화하기", time: "26m",  xp: 30, diff: "Easy" },
        { step: "연습 문제",   prob: "특별한 문자",                             time: "11m",  xp: 20, diff: "Easy" },
        { step: "테스트 문제", prob: "낮은 지점들",                             time: "12m",  xp: 20, diff: "Easy" },
      ],
    },
  },
  {
    id: 6, color: "dark", eyebrow: "Trail 6. Intermediate High", title: "알고리즘 실전",
    chapters: [
      { name: "Ch 1. Tree", nodes: ["트리", "이진 트리와 탐색", "Tree DP", "LCA"] },
      { name: "Ch 2. MST",  nodes: ["Disjoint Set (Union Find)", "Kruskal", "Prim"] },
      { name: "Ch 3. 위상정렬", nodes: ["Topological Sort", "Graph DP"] },
      { name: "Ch 4. String", nodes: [] },
    ],
    lesson: {
      title: "트리",
      tags: ["Foundation", "Graph"],
      rows: [
        { step: "기본 문제",   prob: "트리의 부모 노드",  time: "21m", xp: 20, diff: "Easy" },
        { step: "기본 문제",   prob: "트리의 지름",       time: "28m", xp: 20, diff: "Easy" },
        { step: "연습 문제",   prob: "트리 노드 제거",    time: "37m", xp: 30, diff: "Easy" },
        { step: "연습 문제",   prob: "트리 판별",         time: "44m", xp: 30, diff: "Easy" },
        { step: "연습 문제",   prob: "트리 정점 거리",    time: "24m", xp: 30, diff: "Easy" },
        { step: "연습 문제",   prob: "트리 파악",         time: "26m", xp: 30, diff: "Easy" },
        { step: "연습 문제",   prob: "트리 사촌",         time: "46m", xp: 30, diff: "Easy" },
        { step: "연습 문제",   prob: "트리 간선의 길이",  time: "14m", xp: 30, diff: "Easy" },
        { step: "연습 문제",   prob: "트리 최적의 노드",  time: "33m", xp: 60, diff: "Medium" },
        { step: "연습 문제",   prob: "간선 순회",         time: "24m", xp: 90, diff: "Hard" },
        { step: "연습 문제",   prob: "트리의 지름 3",     time: "23m", xp: 90, diff: "Hard" },
        { step: "연습 문제",   prob: "트리 수정",         time: "11m", xp: 90, diff: "Hard" },
        { step: "테스트 문제", prob: "그래프와 트리",     time: "24m", xp: 60, diff: "Medium" },
      ],
    },
  },
];

function pickTrail() {
  const param = new URLSearchParams(location.search).get("trail");
  const idx = Number.parseInt(param ?? "0", 10);
  if (Number.isNaN(idx) || idx < 0 || idx >= TRAILS.length) return TRAILS[0];
  return TRAILS[idx];
}

function setColor(trail) {
  const root = document.getElementById("trail-page");
  if (!root) return;
  const c = COLORS[trail.color];
  root.dataset.color = trail.color;
  root.style.setProperty("--trail-hex", c.hex);
  root.style.setProperty("--trail-deep", c.deep);
  root.style.setProperty("--trail-soft", c.soft);
  root.style.setProperty("--trail-chip", c.chip);
}

function diffClass(diff) {
  switch (diff) {
    case "Easy":   return "diff diff--easy";
    case "Medium": return "diff diff--medium";
    case "Hard":   return "diff diff--hard";
    default:       return "diff";
  }
}

function renderTopbar(trail) {
  const eyebrow = document.getElementById("trail-eyebrow");
  const title   = document.getElementById("trail-title");
  if (eyebrow) eyebrow.textContent = trail.eyebrow;
  if (title)   title.textContent   = trail.title;
  document.title = `Codenergy — ${trail.title}`;
}

function renderTrailMenu(currentTrail) {
  const btn  = document.getElementById("trail-name-btn");
  const menu = document.getElementById("trail-name-menu");
  if (!btn || !menu) return;

  menu.innerHTML = "";
  TRAILS.forEach((t) => {
    const a = document.createElement("a");
    a.className = "trail-page__name-menu__item";
    a.href = `trail.html?trail=${t.id}`;
    a.setAttribute("role", "menuitem");
    if (t.id === currentTrail.id) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
    a.innerHTML = `
      <span class="trail-page__name-menu__item-eyebrow"></span>
      <span class="trail-page__name-menu__item-title"></span>
    `;
    a.querySelector(".trail-page__name-menu__item-eyebrow").textContent = t.eyebrow;
    a.querySelector(".trail-page__name-menu__item-title").textContent   = t.title;
    menu.appendChild(a);
  });

  const close = () => {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (menu.hidden) open(); else close();
  });
  document.addEventListener("click", (e) => {
    if (menu.hidden) return;
    if (btn.contains(e.target) || menu.contains(e.target)) return;
    close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      close();
      btn.focus();
    }
  });
}

function renderChapters(trail) {
  const host = document.getElementById("trail-chapters");
  if (!host) return;
  host.innerHTML = "";

  trail.chapters.forEach((chapter, ci) => {
    const head = document.createElement("button");
    head.type = "button";
    head.className = "chapter-head";
    head.innerHTML = `<span>${chapter.name}</span><span aria-hidden="true">▾</span>`;
    host.appendChild(head);

    const list = document.createElement("ol");
    list.className = "chapter-list";

    chapter.nodes.forEach((node, ni) => {
      const item = document.createElement("li");
      item.className = "chapter-node is-locked";
      const offset = ni % 2 === 0 ? "left" : "right";
      item.dataset.offset = offset;
      const lessonId = `t${trail.id}-ch${ci + 1}-${ni + 1}`;
      item.dataset.lessonId = lessonId;
      item.innerHTML = `
        <span class="chapter-node__ring" aria-hidden="true"></span>
        <span class="hex" aria-hidden="true">
          <span class="hex-num">${ni + 1}</span>
        </span>
        <span class="chapter-node__label">${node}</span>
      `;
      item.addEventListener("click", () => {
        if (item.classList.contains("is-selected")) return;
        document.querySelectorAll(".chapter-node.is-selected").forEach((n) => {
          n.classList.remove("is-selected");
        });
        item.classList.add("is-selected");
        renderLessonForNode(trail, lessonId, node);
      });
      list.appendChild(item);
    });

    host.appendChild(list);
  });
}

/**
 * Update the right-side lesson panel to reflect the clicked hex node.
 * Falls back to whatever the trail's static lesson rows define when the
 * lesson isn't yet wired in lesson-data.js.
 */
function renderLessonForNode(trail, lessonId, nodeTitle) {
  const display = getLessonDisplay(lessonId);
  const titleEl = document.getElementById("lesson-title");
  if (titleEl) titleEl.textContent = display?.title || nodeTitle || trail.lesson.title;

  const tbody = document.getElementById("lesson-rows");
  if (tbody) {
    tbody.innerHTML = "";
    if (display?.problems) {
      const all = [
        ...(display.problems.basic    || []).map((p) => ({ ...p, step: "기본 문제" })),
        ...(display.problems.practice || []).map((p) => ({ ...p, step: "연습 문제" })),
      ];
      let prevStep = "";
      all.forEach((row) => {
        const tr = document.createElement("tr");
        const stepCell = row.step === prevStep ? "" : row.step;
        prevStep = row.step;
        tr.innerHTML = `
          <td class="col-step">${stepCell}</td>
          <td class="col-prob"><span class="bean" aria-hidden="true">●</span> ${row.title || row.id}</td>
          <td class="col-time">${row.time || "—"}</td>
          <td class="col-xp">${row.xp ?? 10}</td>
          <td class="col-diff"><span class="${diffClass(row.diff || "Easy")}">${row.diff || "Easy"}</span></td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5" style="text-align:center;color:#888;padding:18px">아직 준비 중인 레슨이에요.</td>`;
      tbody.appendChild(tr);
    }
  }

  const cta = document.getElementById("lesson-cta");
  if (cta) {
    cta.textContent = display ? "레슨 시작하기 →" : "준비 중";
    cta.disabled = !display;
    cta.onclick = display ? () => { location.href = `lessons.html?lesson=${encodeURIComponent(lessonId)}`; } : null;
  }
}

function renderLesson(trail) {
  const titleEl = document.getElementById("lesson-title");
  if (titleEl) titleEl.textContent = trail.lesson.title;

  const tagHost = document.querySelector(".trail-lesson__tag");
  if (tagHost && trail.lesson.tags) {
    tagHost.replaceWith(...trail.lesson.tags.map((t) => {
      const span = document.createElement("span");
      span.className = "trail-lesson__tag";
      span.textContent = t;
      return span;
    }));
  }

  const tbody = document.getElementById("lesson-rows");
  if (!tbody) return;
  tbody.innerHTML = "";
  let prevStep = "";
  trail.lesson.rows.forEach((row) => {
    const tr = document.createElement("tr");
    const stepCell = row.step === prevStep ? "" : row.step;
    prevStep = row.step;
    tr.innerHTML = `
      <td class="col-step">${stepCell}</td>
      <td class="col-prob"><span class="bean" aria-hidden="true">●</span> ${row.prob}</td>
      <td class="col-time">${row.time}</td>
      <td class="col-xp">${row.xp}</td>
      <td class="col-diff"><span class="${diffClass(row.diff)}">${row.diff}</span></td>
    `;
    tbody.appendChild(tr);
  });

  const cta = document.getElementById("lesson-cta");
  if (cta) {
    cta.textContent = trail.ctaText || "레슨 시작하기 →";
    const firstLessonId = `t${trail.id}-ch1-1`;
    const display = getLessonDisplay(firstLessonId);
    cta.disabled = !display;
    cta.onclick = display ? () => { location.href = `lessons.html?lesson=${encodeURIComponent(firstLessonId)}`; } : null;
  }
}

function init() {
  const trail = pickTrail();
  setColor(trail);
  renderTopbar(trail);
  renderTrailMenu(trail);
  renderChapters(trail);
  renderLesson(trail);
  document.querySelector(".chapter-node")?.click();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
