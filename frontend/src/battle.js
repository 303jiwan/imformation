// battle.js — 배틀 로비 로직 (battle.html 전용)

const API_BASE = 'http://localhost:3000';

let queuePollingTimer = null;
let roomPollingTimer = null;
let currentRoomCode = null;
let inQueue = false;

// ---- DOM refs ----
const btnRandomPvp   = document.getElementById('btn-random-pvp');
const btnRoomEntry   = document.getElementById('btn-room-entry');
const btnCreateRoom  = document.getElementById('btn-create-room');
const btnJoinRoom    = document.getElementById('btn-join-room');
const btnJoinConfirm = document.getElementById('btn-join-confirm');
const btnQueueCancel = document.getElementById('btn-queue-cancel');
const btnCreateCancel = document.getElementById('btn-create-cancel');

const battleRoomModal   = document.getElementById('battle-room-modal');
const battleCreateModal = document.getElementById('battle-create-modal');
const battleJoinModal   = document.getElementById('battle-join-modal');
const battleQueueModal  = document.getElementById('battle-queue-modal');

const battleRoomCode  = document.getElementById('battle-room-code');
const battleJoinCode  = document.getElementById('battle-join-code');
const battleJoinError = document.getElementById('battle-join-error');

// ---- helpers ----
function openModal(modal) {
  if (modal) modal.hidden = false;
}
function closeModal(modal) {
  if (modal) modal.hidden = true;
}

function goToMatch(matchId) {
  try { sessionStorage.setItem('codenergy:battle:matchId', String(matchId)); } catch (_) {}
  window.location.href = `battle-match.html?matchId=${encodeURIComponent(matchId)}`;
}

// ---- Random PvP / Queue ----
async function joinQueue() {
  try {
    const res = await fetch(`${API_BASE}/api/battle/queue/join`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.status === 200) {
      const body = await res.json().catch(() => ({}));
      if (body.matchId) {
        stopQueuePolling();
        inQueue = false;
        goToMatch(body.matchId);
        return;
      }
    }
    // 202 = still waiting, keep polling
    if (res.status === 202 || res.status === 200) {
      queuePollingTimer = setTimeout(joinQueue, 1500);
    } else {
      // Unexpected status — stop polling
      stopQueuePolling();
      inQueue = false;
      closeModal(battleQueueModal);
    }
  } catch (_) {
    // Network error — retry
    queuePollingTimer = setTimeout(joinQueue, 1500);
  }
}

function stopQueuePolling() {
  if (queuePollingTimer) {
    clearTimeout(queuePollingTimer);
    queuePollingTimer = null;
  }
}

async function leaveQueue() {
  try {
    navigator.sendBeacon(`${API_BASE}/api/battle/queue/leave`, new Blob([], { type: 'application/json' }));
  } catch (_) {}
}

btnRandomPvp.addEventListener('click', () => {
  openModal(battleQueueModal);
  inQueue = true;
  joinQueue();
});

btnQueueCancel.addEventListener('click', async () => {
  stopQueuePolling();
  inQueue = false;
  await leaveQueue();
  closeModal(battleQueueModal);
});

// ---- Room entry modal ----
btnRoomEntry.addEventListener('click', () => {
  openModal(battleRoomModal);
});

// ---- Create room ----
btnCreateRoom.addEventListener('click', async () => {
  closeModal(battleRoomModal);
  try {
    const res = await fetch(`${API_BASE}/api/battle/rooms`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      let detail = '';
      try {
        const errBody = await res.json();
        detail = errBody.error || '';
      } catch (_) {}
      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        window.location.href = 'test-login.html';
        return;
      }
      alert(`방 생성에 실패했습니다. (${res.status}) ${detail}`);
      return;
    }
    const body = await res.json().catch(() => ({}));
    currentRoomCode = body.code;
    if (battleRoomCode) battleRoomCode.textContent = body.code || '------';
    openModal(battleCreateModal);
    startRoomPolling(body.code);
  } catch (_) {
    alert('서버에 연결할 수 없습니다.');
  }
});

function startRoomPolling(code) {
  stopRoomPolling();
  roomPollingTimer = setTimeout(() => pollRoomState(code), 1500);
}

function stopRoomPolling() {
  if (roomPollingTimer) {
    clearTimeout(roomPollingTimer);
    roomPollingTimer = null;
  }
}

async function pollRoomState(code) {
  try {
    const res = await fetch(`${API_BASE}/api/battle/rooms/${encodeURIComponent(code)}/state`, {
      credentials: 'include',
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.state === 'matched' && body.matchId) {
        stopRoomPolling();
        currentRoomCode = null;
        goToMatch(body.matchId);
        return;
      }
    }
    roomPollingTimer = setTimeout(() => pollRoomState(code), 1500);
  } catch (_) {
    roomPollingTimer = setTimeout(() => pollRoomState(code), 1500);
  }
}

btnCreateCancel.addEventListener('click', async () => {
  stopRoomPolling();
  const code = currentRoomCode;
  currentRoomCode = null;
  closeModal(battleCreateModal);
  if (code) {
    try {
      navigator.sendBeacon(
        `${API_BASE}/api/battle/rooms/${encodeURIComponent(code)}/leave`,
        new Blob([], { type: 'application/json' }),
      );
    } catch (_) {}
  }
});

// ---- Join room ----
btnJoinRoom.addEventListener('click', () => {
  closeModal(battleRoomModal);
  if (battleJoinCode) battleJoinCode.value = '';
  if (battleJoinError) { battleJoinError.textContent = ''; battleJoinError.hidden = true; }
  openModal(battleJoinModal);
});

btnJoinConfirm.addEventListener('click', async () => {
  const code = battleJoinCode ? battleJoinCode.value.trim().toUpperCase() : '';
  if (!code) return;
  if (battleJoinError) { battleJoinError.textContent = ''; battleJoinError.hidden = true; }
  try {
    const res = await fetch(`${API_BASE}/api/battle/rooms/${encodeURIComponent(code)}/join`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.matchId) {
        closeModal(battleJoinModal);
        goToMatch(body.matchId);
        return;
      }
    }
    if (res.status === 404) {
      if (battleJoinError) { battleJoinError.textContent = '없는 방 코드입니다'; battleJoinError.hidden = false; }
    } else if (res.status === 409) {
      if (battleJoinError) { battleJoinError.textContent = '이미 시작된 방입니다'; battleJoinError.hidden = false; }
    } else {
      if (battleJoinError) { battleJoinError.textContent = '방 입장에 실패했습니다'; battleJoinError.hidden = false; }
    }
  } catch (_) {
    if (battleJoinError) { battleJoinError.textContent = '서버에 연결할 수 없습니다'; battleJoinError.hidden = false; }
  }
});

// Allow pressing Enter in code input
if (battleJoinCode) {
  battleJoinCode.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnJoinConfirm.click();
  });
}

// ---- beforeunload cleanup ----
window.addEventListener('beforeunload', () => {
  if (inQueue) {
    navigator.sendBeacon(`${API_BASE}/api/battle/queue/leave`, new Blob([], { type: 'application/json' }));
  }
  if (currentRoomCode) {
    navigator.sendBeacon(
      `${API_BASE}/api/battle/rooms/${encodeURIComponent(currentRoomCode)}/leave`,
      new Blob([], { type: 'application/json' }),
    );
  }
});
