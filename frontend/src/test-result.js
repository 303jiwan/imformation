import { PROBLEMS, TOTAL_PROBLEMS, loadProblemQueue, QUEUE_KEY } from "./test-problems.js";

/* =====================================================================
   Test result screen — Step 6 of the coding-test flow.

   Two render modes, picked from sessionStorage["codenergy:test:progress"]:
     - per-problem (current ≤ 4): show this problem's verdict + code
       comparison + "다음 문제 풀기" button → goes back to test-gauge.html.
     - final summary (current === 5 after submit): show all 5 results +
       overall score + "처음으로" / "다시 시작".
   ===================================================================== */

const PROGRESS_KEY = "codenergy:test:progress";
const ANSWERS_KEY  = "codenergy:test:answers";
const TIMER_KEY    = "codenergy:test:timer";

const fade  = document.getElementById("page-fade");
const shell = document.getElementById("result-shell");

/* ---------- Storage ---------- */

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

/* ---------- Verdict-driven copy ---------- */

const COPY = {
  correct: {
    chip: "정답",
    chipClass: "result-hero__chip--correct",
    icon: "🎉",
    title: ["훌륭해요!", "완벽해요!", "잘 풀어내셨어요!"],
    sub:  "모든 테스트 케이스를 통과했습니다. 다음 문제도 그대로 가봐요.",
    enc:  ["이 흐름이라면 다음 문제도 무리 없겠어요.", "한 번에 통과! 자신감을 가지고 가도 좋습니다.", "정확하고 깔끔하네요 — 그대로 진행해주세요."],
  },
  wrong: {
    chip: "오답",
    chipClass: "result-hero__chip--wrong",
    icon: "💡",
    title: ["조금만 더!", "거의 다 왔어요.", "다시 한 번 차분히."],
    sub:  "일부 케이스에서 기대 출력과 달랐어요. 정답 코드와 비교해보면서 다음에 적용해보세요.",
    enc:  ["오답은 가장 좋은 학습 재료예요. 다음 문제는 더 잘 풀 수 있을 거예요.", "한 발 한 발 나아가고 있어요. 흐름을 잃지 마세요.", "비교 코드의 패턴을 메모해두면 다음에 큰 도움이 돼요."],
  },
  timeout: {
    chip: "시간 초과",
    chipClass: "result-hero__chip--timeout",
    icon: "⏳",
    title: ["시간이 부족했어요.", "아쉽게 시간 초과!", "다음엔 페이스 조절!"],
    sub:  "10분 안에 제출하지 못해 자동 제출되었습니다. 정답 코드를 살펴보고 흐름을 익혀보세요.",
    enc:  ["속도는 익숙해지면 자연스럽게 따라옵니다.", "처음엔 누구나 시간이 빠듯해요 — 다음 문제로 가볼까요?", "다음엔 1분 단위로 나눠서 풀어보세요."],
  },
  missing: {
    chip: "미제출",
    chipClass: "result-hero__chip--wrong",
    icon: "🤔",
    title: ["제출 기록이 없어요"],
    sub:  "이 문제를 풀고 결과 페이지로 돌아온 게 맞나요? 다시 시도하려면 처음부터 시작해주세요.",
    enc:  ["메인으로 돌아가 다시 시작할 수 있어요."],
  },
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ---------- Renderers ---------- */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderPerProblem(progress, answers, queue) {
  const problemId = queue[progress.current - 1] ?? queue[0];
  const problem = PROBLEMS.find((p) => p.id === problemId) ?? PROBLEMS[0];
  const answer = answers[problem.id];
  const verdict = answer?.verdict || "missing";
  const copy = COPY[verdict];
  const userCode = answer?.code ?? "// (제출된 코드가 없습니다)";
  const ansCode = problem.solution;
  const passedCount = answer?.cases?.length ?? 0;
  const isLast = progress.current >= progress.total;

  shell.innerHTML = `
    <div class="result-hero">
      <span class="result-hero__chip ${copy.chipClass}">${copy.chip}</span>
      <div class="result-hero__icon" aria-hidden="true">${copy.icon}</div>
      <h1 class="result-hero__title">${pick(copy.title)}</h1>
      <p class="result-hero__sub">${copy.sub}</p>
      <div class="result-hero__meta">
        <span>문제 <strong>${progress.current} / ${progress.total}</strong></span>
        <span>·</span>
        <span><strong>${problem.title}</strong></span>
        ${verdict === "correct"
          ? `<span>·</span><span>테스트 케이스 <strong>${passedCount}/${passedCount}</strong> 통과</span>`
          : verdict === "wrong"
          ? `<span>·</span><span>테스트 케이스 일부 실패</span>`
          : ""}
      </div>
    </div>

    <div class="result-compare">
      <div class="code-card">
        <div class="code-card__head">
          <span>내가 작성한 코드</span>
          <span class="code-card__badge code-card__badge--mine">MY CODE</span>
        </div>
        <pre class="code-card__body">${escapeHtml(userCode)}</pre>
      </div>
      <div class="code-card">
        <div class="code-card__head">
          <span>참고 정답 코드</span>
          <span class="code-card__badge code-card__badge--ans">REFERENCE</span>
        </div>
        <pre class="code-card__body">${escapeHtml(ansCode)}</pre>
      </div>
    </div>

    <div class="result-encouragement">
      <span class="result-encouragement__icon" aria-hidden="true">💪</span>
      <p class="result-encouragement__text">
        <strong>${pick(copy.enc)}</strong>
      </p>
    </div>

    <div class="result-actions">
      <button type="button" class="result-back" id="exit-btn">테스트 종료하고 메인으로</button>
      ${isLast
        ? `<button type="button" class="result-next result-next--final" id="next-btn">최종 결과 보기 →</button>`
        : `<button type="button" class="result-next" id="next-btn">다음 문제 풀기 →</button>`}
    </div>
  `;

  document.getElementById("next-btn").addEventListener("click", () => {
    if (isLast) {
      // Stay on this page but switch to summary mode.
      renderSummary(progress, answers, queue);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Bump progress and head back to the gauge for the next problem.
    const next = { current: progress.current + 1, total: progress.total };
    saveProgress(next);
    try { sessionStorage.removeItem(TIMER_KEY); } catch (_) {}
    if (fade) fade.classList.remove("is-hidden");
    setTimeout(() => { window.location.href = "test-gauge.html"; }, 180);
  });

  document.getElementById("exit-btn").addEventListener("click", exitFlow);
}

/* ---------- Summary helpers ---------- */

const VERDICT_META = {
  correct: { label: "정답",     icon: "✓", segClass: "summary-bar__seg--correct", cardClass: "summary-card--correct" },
  wrong:   { label: "오답",     icon: "✗", segClass: "summary-bar__seg--wrong",   cardClass: "summary-card--wrong"   },
  timeout: { label: "시간 초과", icon: "⏱", segClass: "summary-bar__seg--timeout", cardClass: "summary-card--timeout" },
  missing: { label: "미제출",   icon: "—", segClass: "summary-bar__seg--missing", cardClass: "summary-card--missing" },
};

/**
 * Extract concept/topic labels from a problem. PROBLEMS use a `tag` like
 * "기초 · 산술" or "기본 · 반복문" — we treat the second token as the concept.
 * Falls back to the full tag, then problem.title, so we always have something
 * to show in the recommendation block.
 */
function conceptOf(problem) {
  const tag = problem?.tag;
  if (!tag) return problem?.title || `문제 ${problem?.id}`;
  const parts = String(tag).split("·").map((s) => s.trim()).filter(Boolean);
  return parts[1] || parts[0] || tag;
}

/**
 * Compute weak concepts: every concept where the student got at least one
 * non-correct verdict. Returned in problem-id order, deduplicated.
 */
function weakConcepts(cards) {
  const seen = new Set();
  const out = [];
  for (const { p, v } of cards) {
    if (v === "correct") continue;
    const c = conceptOf(p);
    if (!seen.has(c)) { seen.add(c); out.push(c); }
  }
  return out;
}

function renderSummary(progress, answers, queue) {
  let correct = 0, wrong = 0, timeout = 0, missing = 0;
  const cards = queue.map((id, idx) => {
    const p = PROBLEMS.find((pp) => pp.id === id) ?? PROBLEMS[0];
    const a = answers[p.id];
    const v = a?.verdict || "missing";
    if (v === "correct") correct++;
    else if (v === "wrong") wrong++;
    else if (v === "timeout") timeout++;
    else missing++;
    return { p, v, a, slot: idx + 1 };
  });

  const score = correct;
  const total = progress.total;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  const headlineKey =
    score === total ? "perfect" : score >= Math.ceil(total * 0.6) ? "good" : "tryAgain";
  const headlineMap = {
    perfect: { title: "축하합니다 — 완벽해요!",   sub: `5문제 모두 정답이에요. 코딩테스트 자신감을 얻으셨길 바랍니다.` },
    good:    { title: "잘 하셨어요!",            sub: `좋은 페이스입니다. 부족한 부분은 정답 코드를 참고해 다듬어보세요.` },
    tryAgain:{ title: "여기서부터가 시작이에요.", sub: `오늘의 결과보다 더 중요한 건 흐름이에요. 한 번 더 도전해볼까요?` },
  };

  // Concepts attempted (deduplicated). Falls back to "도전한 문제 수" if
  // no tags resolve (defensive — queued problems all have tags).
  const conceptSet = new Set(cards.map(({ p }) => conceptOf(p)).filter(Boolean));
  const conceptCount = conceptSet.size;
  const conceptStatLabel = conceptCount > 0 ? "도전한 개념 수" : "도전한 문제 수";
  const conceptStatValue = conceptCount > 0 ? conceptCount : total;

  // Stacked progress-bar segments — one per queued problem so each segment
  // maps 1:1 onto the user's actual lineup.
  const barSegs = cards.map(({ slot, v }) => {
    const meta = VERDICT_META[v];
    return `<span class="summary-bar__seg ${meta.segClass}" title="문제 ${slot} — ${meta.label}"></span>`;
  }).join("");

  // Build the recommendation block from actual results.
  const weak = weakConcepts(cards);
  let recHtml = "";
  if (headlineKey === "perfect") {
    recHtml = `
      <div class="summary-rec__row">
        <span class="summary-rec__icon" aria-hidden="true">🚀</span>
        <div class="summary-rec__body">
          <h3 class="summary-rec__h">더 어려운 문제에 도전해보세요</h3>
          <p class="summary-rec__p">기본기는 충분합니다. 한 단계 위 개념으로 시야를 넓혀볼까요?</p>
          <a class="summary-rec__cta" href="test-concepts.html">개념 다시 보러 가기 →</a>
        </div>
      </div>
    `;
  } else if (headlineKey === "good") {
    const focus = weak.length
      ? weak.slice(0, 3).map((c) => `<span class="summary-rec__chip">${escapeHtml(c)}</span>`).join("")
      : "";
    recHtml = `
      <div class="summary-rec__row">
        <span class="summary-rec__icon" aria-hidden="true">🎯</span>
        <div class="summary-rec__body">
          <h3 class="summary-rec__h">이 개념을 더 연습해보세요</h3>
          ${focus
            ? `<div class="summary-rec__chips">${focus}</div>
               <p class="summary-rec__p">위 개념을 중심으로 비슷한 문제를 한 번 더 풀어보세요.</p>`
            : `<p class="summary-rec__p">전반적으로 잘 하셨어요. 아쉬운 문제만 다시 한 번 살펴보세요.</p>`}
          <a class="summary-rec__cta" href="test-concepts.html">개념 다시 보러 가기 →</a>
        </div>
      </div>
    `;
  } else {
    const focus = weak.length
      ? weak.slice(0, 3).map((c) => `<span class="summary-rec__chip">${escapeHtml(c)}</span>`).join("")
      : "";
    recHtml = `
      <div class="summary-rec__row">
        <span class="summary-rec__icon" aria-hidden="true">📘</span>
        <div class="summary-rec__body">
          <h3 class="summary-rec__h">기초부터 차근차근</h3>
          ${focus
            ? `<div class="summary-rec__chips">${focus}</div>
               <p class="summary-rec__p">이 개념들을 다시 익히고 비슷한 문제로 감을 잡아보세요.</p>`
            : `<p class="summary-rec__p">개념 정리부터 다시 한 번 살펴보고 차근차근 풀어볼까요?</p>`}
          <a class="summary-rec__cta" href="test-concepts.html">개념 다시 보러 가기 →</a>
        </div>
      </div>
    `;
  }

  shell.innerHTML = `
    <div class="result-hero">
      <span class="result-hero__chip result-hero__chip--correct">테스트 완료</span>
      <div class="summary-score">${score}<span class="summary-score__total"> / ${total}</span></div>
      <p class="summary-score__sub">정답 ${correct} · 오답 ${wrong} · 시간 초과 ${timeout}${missing ? ` · 미제출 ${missing}` : ""}</p>
      <h1 class="result-hero__title">${headlineMap[headlineKey].title}</h1>
      <p class="result-hero__sub">${headlineMap[headlineKey].sub}</p>
    </div>

    <div class="dash-section">
      <div class="dash-section__head">
        <h2 class="dash-section__h">전체 결과 한눈에 보기</h2>
        <span class="dash-section__pct">정답률 ${pct}%</span>
      </div>
      <div class="summary-bar" role="img" aria-label="문제별 결과 막대">
        ${barSegs}
      </div>
      <div class="summary-bar__legend">
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--correct"></i>정답 ${correct}</span>
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--wrong"></i>오답 ${wrong}</span>
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--timeout"></i>시간 초과 ${timeout}</span>
        <span class="summary-bar__lg"><i class="summary-bar__dot summary-bar__dot--missing"></i>미제출 ${missing}</span>
      </div>
    </div>

    <div class="dash-stats">
      <div class="dash-stat">
        <span class="dash-stat__num">${pct}<span class="dash-stat__unit">%</span></span>
        <span class="dash-stat__label">정답률</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat__num">${correct}<span class="dash-stat__unit">/${total}</span></span>
        <span class="dash-stat__label">맞힌 문제</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat__num">${conceptStatValue}</span>
        <span class="dash-stat__label">${conceptStatLabel}</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat__num">${wrong + timeout + missing}</span>
        <span class="dash-stat__label">복습할 문제</span>
      </div>
    </div>

    <div class="dash-section">
      <div class="dash-section__head">
        <h2 class="dash-section__h">문제별 결과</h2>
        <span class="dash-section__pct">${total}문제</span>
      </div>
      <div class="summary-grid">
        ${cards.map(({ p, v, slot }) => {
          const meta = VERDICT_META[v];
          const concept = conceptOf(p);
          return `
            <div class="summary-card ${meta.cardClass}">
              <span class="summary-card__icon" aria-hidden="true">${meta.icon}</span>
              <span class="summary-card__num">문제 ${slot}</span>
              <span class="summary-card__title">${escapeHtml(p.title)}</span>
              <span class="summary-card__concept">${escapeHtml(concept)}</span>
              <span class="summary-card__verdict">${meta.label}</span>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <div class="summary-rec">
      <div class="summary-rec__head">
        <span class="summary-rec__badge">학습 추천</span>
        <h2 class="summary-rec__title">다음에 무엇을 해볼까요?</h2>
      </div>
      ${recHtml}
    </div>

    <div class="result-encouragement">
      <span class="result-encouragement__icon" aria-hidden="true">✨</span>
      <p class="result-encouragement__text">
        <strong>이 진단 결과를 바탕으로 학습 경로를 추천해드릴게요.</strong>
        곧 등록하신 이메일로 상세 분석을 보내드립니다.
      </p>
    </div>

    <div class="result-actions">
      <button type="button" class="result-back" id="restart-btn">다시 시작하기</button>
      <a href="index.html" class="result-next result-next--final" id="home-btn" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;">
        메인으로 돌아가기 →
      </a>
    </div>
  `;

  document.getElementById("restart-btn").addEventListener("click", () => {
    if (!confirm("진행 기록을 모두 지우고 처음부터 다시 시작할까요?")) return;
    for (const k of [PROGRESS_KEY, ANSWERS_KEY, TIMER_KEY, QUEUE_KEY]) {
      try { sessionStorage.removeItem(k); } catch (_) {}
    }
    if (fade) fade.classList.remove("is-hidden");
    setTimeout(() => { window.location.href = "test-concepts.html"; }, 180);
  });
}

function exitFlow() {
  if (!confirm("정말 테스트를 종료할까요? 진행 상황이 사라집니다.")) return;
  for (const k of [PROGRESS_KEY, ANSWERS_KEY, TIMER_KEY, QUEUE_KEY]) {
    try { sessionStorage.removeItem(k); } catch (_) {}
  }
  window.location.href = "index.html";
}

/* ---------- Entry ---------- */

const progress = loadProgress();
const answers = loadAnswers();
const queue = loadProblemQueue() ?? PROBLEMS.map((p) => p.id);
// Sync total to queue length in case the user landed here without a fresh queue.
if (progress.total !== queue.length) {
  progress.total = queue.length;
  saveProgress(progress);
}

renderPerProblem(progress, answers, queue);
