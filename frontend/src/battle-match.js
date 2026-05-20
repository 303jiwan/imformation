// battle-match.js — 배틀 매치 진행 로직 (battle-match.html 전용)

const API_BASE = 'http://localhost:3000';

// ---- matchId 읽기 ----
function getMatchId() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('matchId');
  if (fromUrl) return fromUrl;
  try { return sessionStorage.getItem('codenergy:battle:matchId') || null; } catch (_) { return null; }
}

const matchId = getMatchId();
if (!matchId) {
  window.location.href = 'battle.html';
  throw new Error('No matchId');
}

// ---- DOM refs ----
const problemTitle    = document.getElementById('battle-problem-title');
const problemBody     = document.getElementById('battle-problem-body');
const problemExamples = document.getElementById('battle-problem-examples');

const meAvatar   = document.getElementById('me-avatar');
const meName     = document.getElementById('me-name');
const meScore    = document.getElementById('me-score');
const oppAvatar  = document.getElementById('opp-avatar');
const oppWaiting = document.getElementById('opp-waiting');
const oppName    = document.getElementById('opp-name');
const oppScore   = document.getElementById('opp-score');

const progressEl   = document.getElementById('battle-progress');
const editorContainer = document.getElementById('battle-editor-container');
const editorLoading   = document.getElementById('battle-editor-loading');
const editorFallback  = document.getElementById('battle-editor-fallback');
const resetBtn        = document.getElementById('battle-reset-btn');
const submitBtn       = document.getElementById('battle-submit-btn');

const countdownEl    = document.getElementById('battle-countdown');
const countdownNum   = document.getElementById('battle-countdown-num');

const resultModal    = document.getElementById('battle-result-modal');
const resultTitle    = document.getElementById('battle-result-title');
const resultSub      = document.getElementById('battle-result-sub');

const verdictToast   = document.getElementById('battle-verdict-toast');

// ---- State ----
let myUserId = null;
let monacoEditor = null;
let monacoReady = false;
let currentStarterCode = '';
let currentProblemIdx = -1;
let pollTimer = null;
let submitInProgress = false;
let matchFinished = false;
let countdownInterval = null;

// ---- Get own userId ----
async function fetchMyUserId() {
  try {
    const res = await fetch(`${API_BASE}/api/me`, { credentials: 'include' });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      myUserId = body.id ?? body.userId ?? null;
    }
  } catch (_) {}
}

// ---- Monaco editor init ----
function getEditorCode() {
  if (monacoEditor) return monacoEditor.getValue();
  return editorFallback ? editorFallback.value : '';
}

function setEditorCode(code) {
  currentStarterCode = code;
  if (monacoEditor) {
    monacoEditor.setValue(code);
  } else if (editorFallback) {
    editorFallback.value = code;
  }
}

function initEditor() {
  if (!window.monaco) {
    // Monaco not available — show fallback textarea
    if (editorLoading) editorLoading.hidden = true;
    if (editorFallback) editorFallback.hidden = false;
    monacoReady = false;
    return;
  }
  try {
    monacoEditor = window.monaco.editor.create(editorContainer, {
      value: currentStarterCode || '// C 코드를 작성하세요\n',
      language: 'c',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
    });
    if (editorLoading) editorLoading.hidden = true;
    monacoReady = true;
  } catch (_) {
    if (editorLoading) editorLoading.hidden = true;
    if (editorFallback) editorFallback.hidden = false;
    monacoReady = false;
  }
}

// Monaco CDN AMD 로더가 완료되면 이벤트 발생
window.addEventListener('monaco-ready', () => {
  initEditor();
});

// Fallback: window.monaco 폴링 (이미 로드됐을 경우 대비)
let monacoCheckCount = 0;
const monacoCheckInterval = setInterval(() => {
  monacoCheckCount++;
  if (window.monaco) {
    clearInterval(monacoCheckInterval);
    if (!monacoReady) initEditor();
  }
  if (monacoCheckCount > 20) {
    clearInterval(monacoCheckInterval);
    if (!monacoReady) {
      if (editorLoading) editorLoading.hidden = true;
      if (editorFallback) editorFallback.hidden = false;
    }
  }
}, 500);

// ---- Countdown ----
function startCountdown(remainMs) {
  if (countdownInterval) clearInterval(countdownInterval);
  let remain = Math.ceil(remainMs / 1000);

  if (remain <= 0) {
    if (countdownEl) countdownEl.hidden = true;
    enableSubmit();
    return;
  }

  if (countdownEl) countdownEl.hidden = false;
  if (countdownNum) countdownNum.textContent = String(remain);
  if (submitBtn) submitBtn.disabled = true;

  countdownInterval = setInterval(() => {
    remain--;
    if (countdownNum) countdownNum.textContent = String(Math.max(0, remain));
    if (remain <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      if (countdownEl) countdownEl.hidden = true;
      enableSubmit();
    }
  }, 1000);
}

function enableSubmit() {
  if (submitBtn && !submitInProgress) submitBtn.disabled = false;
}

// ---- Progress dots ----
function updateProgressDots(myS, oppS) {
  if (!progressEl) return;
  const dots = progressEl.querySelectorAll('.battle-progress__dot');
  dots.forEach((dot, i) => {
    dot.classList.remove('me-won', 'opp-won');
    if (i < myS) dot.classList.add('me-won');
    else if (i < myS + oppS) dot.classList.add('opp-won');
  });
}

// ---- Problem rendering ----
function renderProblem(problem) {
  if (!problem) return;
  if (problemTitle) problemTitle.textContent = problem.title || '문제';
  if (problemBody) {
    problemBody.innerHTML = `
      <p>${escapeHtml(problem.description || '')}</p>
      ${problem.input_desc  ? `<p><strong>입력:</strong> ${escapeHtml(problem.input_desc)}</p>`  : ''}
      ${problem.output_desc ? `<p><strong>출력:</strong> ${escapeHtml(problem.output_desc)}</p>` : ''}
      ${problem.constraints ? `<p><strong>제약:</strong> ${escapeHtml(problem.constraints)}</p>` : ''}
    `;
  }
  if (problemExamples && Array.isArray(problem.examples)) {
    problemExamples.innerHTML = problem.examples.map((ex, i) => `
      <div class="example-block">
        <div><strong>예제 입력 ${i + 1}</strong><pre>${escapeHtml(ex.input ?? '')}</pre></div>
        <div><strong>예제 출력 ${i + 1}</strong><pre>${escapeHtml(ex.output ?? '')}</pre></div>
      </div>
    `).join('');
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- Avatar rendering ----
// avatar API가 불명확하여 기본 SVG 캐릭터(이모지)로 렌더
function renderAvatar(container, username) {
  if (!container) return;
  container.innerHTML = `<span style="font-size:2.5rem;line-height:1">🤖</span>`;
}

// ---- Toast ----
let toastTimer = null;
function showToast(text, type) {
  if (!verdictToast) return;
  if (toastTimer) clearTimeout(toastTimer);
  verdictToast.textContent = text;
  verdictToast.className = 'battle-verdict-toast';
  if (type) verdictToast.classList.add(`battle-verdict-toast--${type}`);
  verdictToast.hidden = false;
  toastTimer = setTimeout(() => { verdictToast.hidden = true; }, 2000);
}

// ---- Result modal ----
function showResult(won, draw) {
  if (!resultModal) return;
  matchFinished = true;
  stopPolling();
  if (resultTitle) {
    if (draw) resultTitle.textContent = '무승부';
    else resultTitle.textContent = won ? '승리!' : '패배';
  }
  if (resultSub) {
    if (won) resultSub.textContent = '배터리 +5';
    else resultSub.textContent = won === false ? '' : '';
  }
  resultModal.hidden = false;
}

// ---- Polling ----
let countdownInitialized = false;

async function pollState() {
  if (matchFinished) return;
  try {
    const res = await fetch(`${API_BASE}/api/battle/match/${encodeURIComponent(matchId)}/state`, {
      credentials: 'include',
    });
    if (!res.ok) {
      schedulePoll();
      return;
    }
    const state = await res.json().catch(() => null);
    if (!state) { schedulePoll(); return; }

    // Ensure we know our own userId
    if (!myUserId) await fetchMyUserId();

    const players = state.players || [];
    const me  = players.find(p => String(p.userId) === String(myUserId));
    const opp = players.find(p => String(p.userId) !== String(myUserId));

    // My info
    if (me) {
      if (meName) meName.textContent = me.username || '나';
      if (meScore) meScore.textContent = String(me.score ?? 0);
      renderAvatar(meAvatar, me.username);
    }

    // Opponent info
    if (opp) {
      if (oppWaiting) oppWaiting.hidden = true;
      if (oppName) { oppName.hidden = false; oppName.textContent = opp.username || '상대'; }
      if (oppScore) { oppScore.hidden = false; oppScore.textContent = String(opp.score ?? 0); }
      renderAvatar(oppAvatar, opp.username);
    } else {
      // No opponent yet
      if (oppWaiting) oppWaiting.hidden = false;
      if (oppName) oppName.hidden = true;
      if (oppScore) oppScore.hidden = true;
    }

    // Progress dots
    const myS  = me  ? (me.score  ?? 0) : 0;
    const oppS = opp ? (opp.score ?? 0) : 0;
    updateProgressDots(myS, oppS);

    // Problem update
    const problem = state.currentProblem;
    if (problem) {
      const serverProblemIdx = me ? (me.currentProblemIdx ?? 0) : 0;
      if (serverProblemIdx !== currentProblemIdx) {
        // Problem changed: show toast if advancing, reset editor
        if (currentProblemIdx >= 0 && serverProblemIdx > currentProblemIdx) {
          showToast('정답!', 'correct');
        }
        currentProblemIdx = serverProblemIdx;
        renderProblem(problem);
        setEditorCode(problem.starter_code || '// C 코드를 작성하세요\n');
      } else if (currentProblemIdx === -1) {
        // First load
        currentProblemIdx = serverProblemIdx;
        renderProblem(problem);
        if (!monacoEditor) {
          currentStarterCode = problem.starter_code || '// C 코드를 작성하세요\n';
        } else {
          setEditorCode(problem.starter_code || '// C 코드를 작성하세요\n');
        }
      }
    }

    // Countdown: only initialize once
    if (!countdownInitialized && state.startedAt && state.serverNow) {
      countdownInitialized = true;
      const remainMs = new Date(state.startedAt).getTime() - new Date(state.serverNow).getTime();
      if (remainMs > 0) {
        startCountdown(remainMs);
      } else {
        if (countdownEl) countdownEl.hidden = true;
        enableSubmit();
      }
    }

    // Match finished
    if (state.state === 'finished' || state.state === 'forfeit') {
      const won = state.winnerUserId != null && String(state.winnerUserId) === String(myUserId);
      const draw = state.winnerUserId == null;
      showResult(won, draw);
      return;
    }

    schedulePoll();
  } catch (_) {
    schedulePoll();
  }
}

function schedulePoll() {
  if (matchFinished) return;
  pollTimer = setTimeout(pollState, 1500);
}

function stopPolling() {
  if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
}

// ---- Submit ----
submitBtn.addEventListener('click', async () => {
  if (submitInProgress || matchFinished) return;
  const code = getEditorCode();
  submitInProgress = true;
  submitBtn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/api/battle/match/${encodeURIComponent(matchId)}/submit`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemIdx: currentProblemIdx, code }),
    });
    const body = await res.json().catch(() => ({}));
    const verdict = body.verdict;
    if (verdict === 'correct') {
      showToast('정답!', 'correct');
    } else if (verdict === 'wrong') {
      showToast('오답', 'wrong');
    } else if (verdict === 'pending') {
      showToast('채점 대기 중...', 'pending');
      const retryAfter = body.retryAfterMs || 2000;
      setTimeout(() => {
        submitInProgress = false;
        enableSubmit();
      }, retryAfter);
      return;
    }
  } catch (_) {
    showToast('제출 실패', 'wrong');
  }
  submitInProgress = false;
  enableSubmit();
});

// ---- Reset ----
resetBtn.addEventListener('click', () => {
  setEditorCode(currentStarterCode);
});

// ---- Init ----
async function init() {
  await fetchMyUserId();
  if (submitBtn) submitBtn.disabled = true;
  pollState();
}

init();
