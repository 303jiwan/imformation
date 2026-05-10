/* =====================================================================
   Test login screen — Step 3 of the coding-test flow.
   - Two paths: email-only (Gmail subscribe) or login (existing auth).
   - If already logged in, show a status banner + "이어서 진행" button.
   - Listens for the codenergy:auth event dispatched by main.js after
     a successful login or signup, then navigates to the gauge screen.
   ===================================================================== */

const NEXT_PAGE = "test-gauge.html";
const EMAIL_KEY = "codenergy:test:email";

const fade = document.getElementById("page-fade");
const statusBox = document.getElementById("login-status");
const statusName = document.getElementById("login-status-name");
const continueBtn = document.getElementById("continue-btn");

const emailForm = document.getElementById("email-form");
const emailInput = document.getElementById("email-input");
const emailError = document.getElementById("email-error");
const emailSuccess = document.getElementById("email-success");
const emailSubmit = document.getElementById("email-submit");

const openLoginBtn = document.getElementById("open-login");
const openSignupBtn = document.getElementById("open-signup");

// The header's auth controls (managed by main.js).
const headerLoginBtn = document.getElementById("login-btn");
const headerSignupBtn = document.getElementById("signup-btn");
const headerMyWrap = document.getElementById("my-wrap");

function navigateNext() {
  if (fade) fade.classList.remove("is-hidden");
  setTimeout(() => {
    window.location.href = NEXT_PAGE;
  }, 180);
}

/* ---------- Email-only path ---------- */

const GMAIL_RE = /^[^\s@]+@gmail\.com$/i;

emailInput.addEventListener("input", () => {
  emailInput.classList.remove("is-error");
  emailError.hidden = true;
});

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = emailInput.value.trim();

  if (!GMAIL_RE.test(value)) {
    emailInput.classList.add("is-error");
    emailError.textContent = "올바른 Gmail 주소를 입력해주세요. (예: example@gmail.com)";
    emailError.hidden = false;
    emailSuccess.hidden = true;
    emailInput.focus();
    return;
  }

  try {
    sessionStorage.setItem(
      EMAIL_KEY,
      JSON.stringify({ email: value, savedAt: Date.now() }),
    );
  } catch (_) {}

  emailError.hidden = true;
  emailSuccess.textContent = "이메일이 등록되었어요. 잠시 후 이동합니다…";
  emailSuccess.hidden = false;
  emailSubmit.disabled = true;
  setTimeout(navigateNext, 600);
});

/* ---------- Login / signup path — delegate to header buttons ---------- */

openLoginBtn.addEventListener("click", () => {
  if (headerLoginBtn && !headerLoginBtn.hidden) headerLoginBtn.click();
});

openSignupBtn.addEventListener("click", () => {
  if (headerSignupBtn && !headerSignupBtn.hidden) headerSignupBtn.click();
});

/* ---------- React to auth state ---------- */

function showLoggedInBanner(user) {
  if (!user) return;
  statusName.textContent = user.username || "사용자";
  statusBox.hidden = false;
  // Hide the email-only card's submit since logging in is the better path now.
  emailSubmit.disabled = true;
  emailSubmit.textContent = "로그인되어 있어요";
}

window.addEventListener("codenergy:auth", (e) => {
  const detail = e.detail || {};
  if (detail.status === "logged-in" && detail.user) {
    showLoggedInBanner(detail.user);
    // After a fresh login, auto-advance after a short beat.
    setTimeout(navigateNext, 700);
  }
});

continueBtn.addEventListener("click", navigateNext);

/* ---------- Detect existing session on page load ---------- */
// main.js fires the codenergy:auth event from /api/me, but if the user is
// already logged in by the time this script runs we may also want to detect
// via the visible #my-wrap. Use a short MutationObserver as a fallback.

if (headerMyWrap && !headerMyWrap.hidden) {
  const myName = document.getElementById("my-name");
  showLoggedInBanner({ username: myName?.textContent?.trim() });
}
