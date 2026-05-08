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

// ---------------- Navigation Menu ----------------
const menuLinks = document.querySelectorAll('.menu a');
const pricingModal = document.getElementById('pricing-modal');
const challengeModal = document.getElementById('challenge-modal');
const reviewsModal = document.getElementById('reviews-modal');
const inviteModal = document.getElementById('invite-modal');
const universitiesModal = document.getElementById('universities-modal');

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const menuText = link.textContent.trim().split(' ')[0]; // Remove "New" badge text

    switch(menuText) {
      case '코드트레일':
        showCodeTrail();
        break;
      case '요금제':
        showPricing();
        break;
      case '청약챌린지':
        showChallenge();
        break;
      case '후기':
        showReviews();
        break;
      case '친구초대':
        showInvite();
        break;
      case '제휴대학':
        showUniversities();
        break;
    }
  });
});

function showCodeTrail() {
  alert('🚀 코드트레일 기능이 곧 제공됩니다!\n\n알고리즘 문제 풀이부터 실전 코딩 테스트까지,\n단계별 학습 경로를 따라 실력을 키워보세요.');
}

function showPricing() {
  pricingModal.hidden = false;
}

function showChallenge() {
  challengeModal.hidden = false;
}

function showReviews() {
  reviewsModal.hidden = false;
}

function showInvite() {
  if (!document.getElementById('my-wrap').hidden) {
    inviteModal.hidden = false;
  } else {
    alert('로그인 후 친구 초대 기능을 이용할 수 있습니다.');
  }
}

function showUniversities() {
  universitiesModal.hidden = false;
}

// Close modals when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) {
    const modal = e.target.closest('.modal');
    if (modal) modal.hidden = true;
  }
});

// Copy invite link function
function copyInviteLink() {
  const linkInput = document.getElementById('invite-link');
  linkInput.select();
  document.execCommand('copy');
  alert('초대 링크가 복사되었습니다!');
}

// Copy Gmail address function
function copyGmailAddress() {
  const gmailInput = document.getElementById('friend-gmail');
  const email = gmailInput.value.trim();
  if (email) {
    navigator.clipboard.writeText(email).then(() => {
      alert('Gmail 주소가 복사되었습니다!');
    }).catch(() => {
      // Fallback for older browsers
      gmailInput.select();
      document.execCommand('copy');
      alert('Gmail 주소가 복사되었습니다!');
    });
  } else {
    alert('Gmail 주소를 입력해주세요.');
  }
}
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
const infoEl = document.getElementById("modal-info");
const emailField = document.getElementById("email-field");
const recoveryLinks = document.getElementById("modal-recovery");
const recoveryLinksAlt = document.getElementById("modal-recovery-alt");
const findIdBtn = document.getElementById("find-id-btn");
const findPasswordBtn = document.getElementById("find-password-btn");
const altFindIdBtn = document.getElementById("alt-find-id-btn");
const altFindPasswordBtn = document.getElementById("alt-find-password-btn");

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

function setMode(nextMode) {
  mode = nextMode;
  modalTitle.textContent =
    nextMode === "signup"
      ? "회원가입"
      : nextMode === "find-id"
      ? "아이디 찾기"
      : nextMode === "find-password"
      ? "비밀번호 찾기"
      : "로그인";
  submitBtn.textContent =
    nextMode === "signup"
      ? "회원가입"
      : nextMode === "login"
      ? "로그인"
      : "전송";

  const usernameLabel = form.querySelector(".field-username");
  const passwordLabel = form.querySelector(".field-password");
  const emailLabel = emailField;

  const showEmail = nextMode !== "login";
  const showRecovery = nextMode === "login";
  const showRecoveryAlt = nextMode === "find-id" || nextMode === "find-password";
  const showUsername = nextMode === "login" || nextMode === "signup";
  const showPassword = nextMode === "login" || nextMode === "signup";

  usernameLabel.hidden = !showUsername;
  passwordLabel.hidden = !showPassword;
  emailLabel.hidden = !showEmail;
  recoveryLinks.hidden = !showRecovery;
  recoveryLinksAlt.hidden = !showRecoveryAlt;

  usernameLabel.style.display = showUsername ? "block" : "none";
  passwordLabel.style.display = showPassword ? "block" : "none";
  emailLabel.style.display = showEmail ? "block" : "none";
  recoveryLinks.style.display = showRecovery ? "flex" : "none";
  recoveryLinksAlt.style.display = showRecoveryAlt ? "flex" : "none";

  // 각 모드에서 특정 버튼만 표시
  if (nextMode === "find-id") {
    altFindIdBtn.style.display = "none";
    altFindPasswordBtn.style.display = "block";
  } else if (nextMode === "find-password") {
    altFindIdBtn.style.display = "block";
    altFindPasswordBtn.style.display = "none";
  }

  form.querySelector("input[name=username]").required = showUsername;
  form.querySelector("input[name=password]").required = showPassword;
  form.querySelector("input[name=email]").required = showEmail;

  errorEl.hidden = true;
  errorEl.textContent = "";
  infoEl.hidden = true;
  form.reset();
  if (!emailLabel.hidden) {
    form.querySelector("input[name=email]").value = "";
  }
  if (!usernameLabel.hidden) {
    form.querySelector("input[name=username]").focus();
  } else {
    form.querySelector("input[name=email]").focus();
  }
}

function openModal(nextMode) {
  setMode(nextMode);
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

loginBtn.addEventListener("click", () => openModal("login"));
signupBtn.addEventListener("click", () => openModal("signup"));
findIdBtn.addEventListener("click", () => openModal("find-id"));
findPasswordBtn.addEventListener("click", () => openModal("find-password"));
altFindIdBtn.addEventListener("click", () => openModal("find-id"));
altFindPasswordBtn.addEventListener("click", () => openModal("find-password"));
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
  infoEl.hidden = true;

  try {
    let endpoint = "login";
    if (mode === "signup") endpoint = "signup";
    if (mode === "find-id") endpoint = "find-username";
    if (mode === "find-password") endpoint = "forgot-password";

    const res = await fetch(`${API_BASE}/api/${endpoint}`, {
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

    if (mode === "signup") {
      openModal("login");
      infoEl.textContent = "회원가입이 완료되었습니다. 이제 로그인해주세요.";
      infoEl.hidden = false;
      return;
    }

    if (mode === "find-id") {
      infoEl.textContent = body.message || "아이디 찾기 안내를 Gmail로 보냈습니다.";
      infoEl.hidden = false;
      return;
    }

    if (mode === "find-password") {
      infoEl.textContent = body.message || "비밀번호 재설정 안내를 Gmail로 보냈습니다.";
      infoEl.hidden = false;
      return;
    }

    setLoggedIn(body);
    closeModal();
  } catch (err) {
    errorEl.textContent = err?.message || "서버에 연결할 수 없습니다.";
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
