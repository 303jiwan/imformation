import "./style.css";

const API_BASE = "http://localhost:3000";
const MAX_TILT = 14;

function attachTilt(el) {
  const baseTransform = getComputedStyle(el).transform;
  const base = baseTransform && baseTransform !== "none" ? baseTransform : "";

  function onMove(e) {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 2 * MAX_TILT;
    const rotateX = -(y - 0.5) * 2 * MAX_TILT;

    el.style.transform =
      `${base} perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    el.dataset.active = "true";
  }

  function onLeave() {
    el.style.transform = base;
    el.dataset.active = "false";
  }

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
}

document.querySelectorAll("[data-tilt]").forEach(attachTilt);

// ---------------- Auth ----------------
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const myWrap = document.getElementById("my-wrap");
const myBtn = document.getElementById("my-btn");
const myMenu = document.getElementById("my-menu");
const myName = document.getElementById("my-name");
const myEmail = document.getElementById("my-email");
const logoutBtn = document.getElementById("logout-btn");
const modal = document.getElementById("auth-modal");
const form = document.getElementById("auth-form");
const modalTitle = document.getElementById("modal-title");
const submitBtn = document.getElementById("submit-btn");
const errorEl = document.getElementById("modal-error");

let mode = "login";

function setLoggedIn(user) {
  if (user) {
    loginBtn.hidden = true;
    signupBtn.hidden = true;
    myWrap.hidden = false;
    myName.textContent = user.username;
    myEmail.textContent = `${user.username}@example.com`;
  } else {
    loginBtn.hidden = false;
    signupBtn.hidden = false;
    myWrap.hidden = true;
    myMenu.hidden = true;
  }
}

myBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  myMenu.hidden = !myMenu.hidden;
});
document.addEventListener("click", (e) => {
  if (myMenu.hidden) return;
  if (myWrap.contains(e.target)) return;
  myMenu.hidden = true;
});
logoutBtn.addEventListener("click", async () => {
  myMenu.hidden = true;
  try {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (_) {}
  setLoggedIn(null);
  alert("로그아웃되었습니다");
});

function openModal(nextMode) {
  mode = nextMode;
  modalTitle.textContent = nextMode === "signup" ? "회원가입" : "로그인";
  submitBtn.textContent = nextMode === "signup" ? "회원가입" : "로그인";
  form.reset();
  errorEl.hidden = true;
  errorEl.textContent = "";
  modal.hidden = false;
  form.querySelector("input[name=username]").focus();
}

function closeModal() {
  modal.hidden = true;
}

loginBtn.addEventListener("click", () => openModal("login"));
signupBtn.addEventListener("click", () => openModal("signup"));
modal.addEventListener("click", (e) => {
  if (e.target.matches("[data-close]")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  submitBtn.disabled = true;
  errorEl.hidden = true;
  try {
    const res = await fetch(`${API_BASE}/api/${mode === "signup" ? "signup" : "login"}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      errorEl.textContent = body.error || "요청 실패";
      errorEl.hidden = false;
      return;
    }
    setLoggedIn(body);
    closeModal();
  } catch (err) {
    errorEl.textContent = "서버에 연결할 수 없습니다.";
    errorEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
});

// initial session check
fetch(`${API_BASE}/api/me`, { credentials: "include" })
  .then((r) => (r.ok ? r.json() : null))
  .then((u) => setLoggedIn(u))
  .catch(() => setLoggedIn(null));

// ---------------- Mascot eye tracking ----------------
const eye = document.getElementById("mascot-eye");
const pupil = document.getElementById("mascot-pupil");
if (eye && pupil) {
  const EYE_SVG_RADIUS = 38;
  const PUPIL_SVG_RADIUS = 20;
  const MAX_OFFSET_SVG = EYE_SVG_RADIUS - PUPIL_SVG_RADIUS - 2;

  // spring physics — pupil eases toward target with capped speed
  const STIFFNESS = 0.07;
  const DAMPING = 0.78;
  const MAX_SPEED = 2.4;
  const SHAKE_REVERSALS = 4;
  const SHAKE_WINDOW_MS = 400;

  let targetX = 0;
  let targetY = 0;
  let posX = 0;
  let posY = 0;
  let velX = 0;
  let velY = 0;

  let lastMouseX = null;
  let lastDxSign = 0;
  const reversals = [];
  let shaking = false;

  document.addEventListener("mousemove", (e) => {
    const now = performance.now();

    // detect rapid left-right reversals
    if (lastMouseX !== null) {
      const sign = Math.sign(e.clientX - lastMouseX);
      if (sign !== 0) {
        if (lastDxSign !== 0 && sign !== lastDxSign) reversals.push(now);
        lastDxSign = sign;
      }
    }
    lastMouseX = e.clientX;
    while (reversals.length && now - reversals[0] > SHAKE_WINDOW_MS) {
      reversals.shift();
    }

    const wasShaking = shaking;
    shaking = reversals.length >= SHAKE_REVERSALS;

    if (shaking) {
      if (!wasShaking) {
        targetX = posX;
        targetY = posY;
        velX = 0;
        velY = 0;
      }
      return;
    }

    const rect = eye.getBoundingClientRect();
    if (!rect.width) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const scale = rect.width / (EYE_SVG_RADIUS * 2);
    const dx = (e.clientX - cx) / scale;
    const dy = (e.clientY - cy) / scale;
    const dist = Math.hypot(dx, dy);
    const ratio = dist > MAX_OFFSET_SVG ? MAX_OFFSET_SVG / dist : 1;
    targetX = dx * ratio;
    targetY = dy * ratio;
  });

  function animate() {
    const ax = (targetX - posX) * STIFFNESS;
    const ay = (targetY - posY) * STIFFNESS;
    velX = (velX + ax) * DAMPING;
    velY = (velY + ay) * DAMPING;
    const speed = Math.hypot(velX, velY);
    if (speed > MAX_SPEED) {
      velX = (velX / speed) * MAX_SPEED;
      velY = (velY / speed) * MAX_SPEED;
    }
    posX += velX;
    posY += velY;
    const r = Math.hypot(posX, posY);
    if (r > MAX_OFFSET_SVG) {
      posX = (posX / r) * MAX_OFFSET_SVG;
      posY = (posY / r) * MAX_OFFSET_SVG;
      velX = 0;
      velY = 0;
    }
    pupil.setAttribute(
      "transform",
      `translate(${posX.toFixed(2)} ${posY.toFixed(2)})`
    );
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
