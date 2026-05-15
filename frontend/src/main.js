import "./style.css";

const API_BASE = "http://localhost:3000";
const MAX_TILT = 14;

// ---------------- Demo-mode fallback ----------------
// When the backend at API_BASE is unreachable (TypeError on fetch — typically
// "Failed to fetch"), we let the user continue in a stub demo session that is
// stored locally. Compare with `judgeAvailable` in src/judge.js: same shape —
// detect missing remote, fall back to a local mock so the UI keeps working.
const DEMO_USER_KEY = "codenergy:demo:user";
const REDIRECT_AFTER_LOGIN_KEY = "codenergy:redirectAfterLogin";
// Persisted across page loads so other pages (e.g. avatar.js) can make a fast
// initial render decision without waiting for /api/me to resolve in main.js.
const AUTH_HINT_KEY = "codenergy:auth:hint";

function writeAuthHint(state) {
  try { localStorage.setItem(AUTH_HINT_KEY, state); } catch (_) {}
}

function readAuthHint() {
  try { return localStorage.getItem(AUTH_HINT_KEY); } catch (_) { return null; }
}

/** Whitelist of pages we allow redirecting to after login. Keeps the
 *  sessionStorage value from being abused as an open-redirect vector. */
const REDIRECT_TARGETS = new Set(["avatar.html"]);

function readRedirectIntent() {
  try {
    const raw = sessionStorage.getItem(REDIRECT_AFTER_LOGIN_KEY);
    if (raw && REDIRECT_TARGETS.has(raw)) return raw;
    return null;
  } catch (_) {
    return null;
  }
}

function clearRedirectIntent() {
  try { sessionStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY); } catch (_) {}
}

/** Network errors from `fetch` surface as TypeError in every browser. */
function isNetworkError(err) {
  return err instanceof TypeError;
}

/** SHA-256 hex of a string (best-effort; returns "" if subtle crypto fails). */
async function sha256Hex(str) {
  try {
    const buf = new TextEncoder().encode(String(str ?? ""));
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (_) {
    return "";
  }
}

function readDemoUser() {
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.username === "string") return parsed;
    return null;
  } catch (_) {
    return null;
  }
}

function clearDemoUser() {
  try { localStorage.removeItem(DEMO_USER_KEY); } catch (_) {}
}

// ---------------- i18n ----------------
const TRANSLATIONS = {
  en: {
    "title": "Codenergy — From Knowledge to Skill",
    "nav.codetrail": "Code Trail",
    "nav.pricing": "Pricing",
    "nav.reviews": "Reviews",
    "nav.invite": "Invite",
    "nav.universities": "Universities",
    "nav.avatar": "Avatar",
    "action.login": "Log in",
    "action.signup": "Sign up",
    "action.my": "My",
    "action.cta": "Start Learning →",
    "action.cancel": "Cancel",
    "action.close": "Close",
    "my.name": "User Name",
    "my.mypage": "My Page",
    "my.history": "Learning History",
    "my.subscription": "Billing & Subscription",
    "my.invite": "Invite Friends",
    "my.settings": "Settings",
    "my.logout": "Log out",
    "auth.login": "Log in",
    "auth.signup": "Sign up",
    "auth.findId": "Find ID",
    "auth.findPw": "Find Password",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.submit": "Submit",
    "auth.signupSuccess": "Sign up complete. Please log in.",
    "auth.findIdSuccess": "ID recovery instructions sent to your email.",
    "auth.findPwSuccess": "Password reset instructions sent to your email.",
    "auth.fail": "Request failed",
    "auth.serverError": "Cannot connect to server.",
    "auth.logoutDone": "You have been logged out.",
    "auth.offlinePrompt": "Cannot reach the server. Continue in demo mode?",
    "auth.demoContinue": "Continue in demo mode",
    "auth.demoBadge": "(demo)",
    "pricing.pageTitle": "Codenergy — Pricing",
    "pricing.heading": "Access every problem-solving principle.",
    "pricing.secure": "Secure payment",
    "pricing.monthly": "Monthly (1 month)",
    "pricing.monthlyTagline": "Target your weakest spots with focus",
    "pricing.normal": "Regular price",
    "pricing.subscribe": "Start Subscription",
    "pricing.quarterly": "Quarterly (3 months)",
    "pricing.quarterlyTagline": "Reset everything in 100 days",
    "pricing.discount48": "48% off",
    "pricing.yearly": "Yearly (12 months)",
    "pricing.yearlyTagline": "Aim for your dream stage",
    "pricing.discount64": "64% off",
    "pricing.student": "Are you a student?",
    "pricing.companies3m": "Hired in 3 months",
    "pricing.companies1y": "Hired in 1 year",
    "pricing.realData": "Based on real hire data.",
    "pricing.won": "KRW",
    "pricing.title": "Choose a Plan",
    "pricing.free": "Free",
    "pricing.freeF1": "50 basic problems",
    "pricing.freeF2": "Basic explanations",
    "pricing.freeF3": "Community access",
    "pricing.freeBtn": "Current plan",
    "pricing.popular": "Popular",
    "pricing.premium": "Premium",
    "pricing.perMonth": "/mo",
    "pricing.premiumF1": "Unlimited problem solving",
    "pricing.premiumF2": "Detailed solutions and walkthroughs",
    "pricing.premiumF3": "Practice mock exams",
    "pricing.premiumF4": "Progress analytics",
    "pricing.premiumBtn": "Get started",
    "pricing.pro": "Pro",
    "pricing.proF1": "All Premium features",
    "pricing.proF2": "1-on-1 expert coaching",
    "pricing.proF3": "Company-tailored problems",
    "pricing.proF4": "Career consulting",
    "pricing.proF5": "Priority application alerts",
    "pricing.proBtn": "Start Pro",
    "reviews.title": "⭐ User Reviews",
    "reviews.r1Text": "\"It was crucial in passing my coding tests. The realistic problems gave me confidence.\"",
    "reviews.r1Name": "Kim Dev",
    "reviews.r1Co": "Hired at Samsung",
    "reviews.r2Text": "\"The step-by-step learning system was excellent. I could learn systematically from basics to advanced.\"",
    "reviews.r2Name": "Park Coding",
    "reviews.r2Co": "Hired at Naver",
    "reviews.r3Text": "\"I started after a friend recommended it — no regrets. I even landed a job!\"",
    "reviews.r3Name": "Lee Programmer",
    "reviews.r3Co": "Hired at Kakao",
    "invite.title": "🎁 Invite Friends",
    "invite.hero": "Grow together with friends!",
    "invite.heroSub": "Invite friends and you both get rewards",
    "invite.b1": "When your friend signs up",
    "invite.b1Desc": "1 month free Premium pass",
    "invite.b2": "When your friend pays",
    "invite.b2Desc": "Earn 5,000 KRW in points",
    "invite.link": "Invite link",
    "invite.copy": "Copy",
    "invite.gmailLabel": "Friend's email address",
    "invite.gmailCopy": "Copy address",
    "invite.share": "Share via KakaoTalk",
    "uni.title": "🎓 Partner Universities",
    "uni.intro": "We offer special benefits in partnership with these universities:",
    "uni.snuLogo": "SNU",
    "uni.snu": "Seoul National University",
    "uni.snuDept": "Computer Science & Engineering",
    "uni.kaistDept": "School of Computing",
    "uni.postechLogo": "POSTECH",
    "uni.postech": "POSTECH",
    "uni.postechDept": "Computer Science",
    "uni.yonseiLogo": "Yonsei",
    "uni.yonsei": "Yonsei University",
    "uni.yonseiDept": "Computer Science",
    "uni.koreaLogo": "Korea U",
    "uni.korea": "Korea University",
    "uni.koreaDept": "Computer Science",
    "uni.hanyangLogo": "Hanyang",
    "uni.hanyang": "Hanyang University",
    "uni.hanyangDept": "Computer Software",
    "uni.d30": "30% student discount",
    "uni.d25": "25% student discount",
    "uni.d20": "20% student discount",
    "uni.note": "✨ Verified students can receive special discounts via school email verification.",
    "uni.verify": "Verify school",
    "hero.title": "Test your<br/>skills.",
    "hero.subtitle": "All the problem-solving skills for coding tests,<br/>find them at Codenergy.",
    "hero.pill": "Curious about what's right for you?",
    "hero.pillCta": "Get started →",
    "cards.title": "There's a specific skill<br/>for sharpening problem-solving.",
    "cards.subtitle": "Most learners are at this stage.",
    "cards.c1Title": "Need confidence turning<br/>thoughts into code?",
    "cards.c1L1Title": "Recursion",
    "cards.c1L1Sub": "Recursion without return values",
    "cards.c1L2Title": "Simulation I",
    "cards.c1L2Sub": "Range painting",
    "cards.c1L3Title": "Simulation II",
    "cards.c1L3Sub": "dx dy technique",
    "cards.c1L4Title": "Brute Force III",
    "cards.c1L4Sub": "Brute force by enumerating cases",
    "cards.c2Title": "Want to tackle unfamiliar<br/>problems with confidence?",
    "cards.c2L1Sub": "Pop and drop in a grid",
    "cards.c2L2Sub": "Moving a single object in a grid",
    "cards.c2L3Sub": "Pick one of K, N times (Conditional)",
    "cards.c2L4Sub": "Pick M out of N (Simple)",
    "cards.c2L5Sub": "Breadth-first search",
    "cards.c3Title": "Want to leap to<br/>top-tier skill?",
    "cards.c3L1Sub": "Use strings like array indices",
    "cards.c3L2Sub": "Find adjacent numbers quickly",
    "cards.c3L3Sub": "+1 -1 Technique",
    "cards.c3L4Sub": "Shortest path from all points to one",
    "alert.codetrail": "🚀 Code Trail is coming soon!\n\nFollow a step-by-step learning path from algorithm practice\nto real coding tests.",
    "alert.inviteLogin": "Please log in to use the invite friends feature.",
    "alert.linkCopied": "Invite link copied!",
    "alert.emailCopied": "Email address copied!",
    "alert.emailEmpty": "Please enter an email address.",
    "lang.label": "English",
  },
};

let currentLang = localStorage.getItem("lang") === "en" ? "en" : "ko";

function t(key) {
  if (currentLang === "ko") return null;
  return TRANSLATIONS[currentLang]?.[key] ?? null;
}

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang === "en" ? "en" : "ko";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!el.dataset.i18nOriginal) el.dataset.i18nOriginal = el.textContent;
    if (lang === "ko") {
      el.textContent = el.dataset.i18nOriginal;
    } else {
      const val = TRANSLATIONS[lang]?.[key];
      if (typeof val === "string") el.textContent = val;
    }
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (!el.dataset.i18nOriginal) el.dataset.i18nOriginal = el.innerHTML;
    if (lang === "ko") {
      el.innerHTML = el.dataset.i18nOriginal;
    } else {
      const val = TRANSLATIONS[lang]?.[key];
      if (typeof val === "string") el.innerHTML = val;
    }
  });

  const titleEl = document.querySelector("title[data-i18n]");
  if (titleEl) document.title = titleEl.textContent;

  const langCurrent = document.getElementById("lang-current");
  if (langCurrent) {
    langCurrent.textContent = lang === "en" ? "English" : "한국어";
  }
  document.querySelectorAll(".lang-menu__item").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
}

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

// ---------------- Page fade transition ----------------
const pageFade = document.getElementById("page-fade");
const PAGE_FADE_MS = 180;

if (pageFade) {
  // fade out the white overlay on initial load
  requestAnimationFrame(() => {
    requestAnimationFrame(() => pageFade.classList.add("is-hidden"));
  });

  // fade in the overlay before navigating to another internal HTML page
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.endsWith(".html")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target && link.target !== "_self") return;
      const target = new URL(href, window.location.href);
      if (
        target.pathname === window.location.pathname &&
        target.search === window.location.search
      ) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      pageFade.classList.remove("is-hidden");
      setTimeout(() => {
        window.location.href = href;
      }, PAGE_FADE_MS);
    },
    true
  );

  // restore overlay state when returning via browser back/forward (bfcache)
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      pageFade.classList.add("is-hidden");
    }
  });
}

// ---------------- Hamburger menu ----------------
const hamburger = document.getElementById("hamburger");
const navCollapse = document.getElementById("nav-collapse");

function closeMenu() {
  hamburger.classList.remove("open");
  navCollapse.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
}

if (hamburger && navCollapse) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !navCollapse.classList.contains("open");
    hamburger.classList.toggle("open", willOpen);
    navCollapse.classList.toggle("open", willOpen);
    hamburger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!navCollapse.classList.contains("open")) return;
    if (navCollapse.contains(e.target) || hamburger.contains(e.target)) return;
    closeMenu();
  });

  navCollapse.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeMenu();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    document.documentElement.classList.add("nav-resizing");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.documentElement.classList.remove("nav-resizing");
    }, 120);
    if (window.innerWidth > 1000) closeMenu();
  });
}

// ---------------- Language dropdown ----------------
const langWrap = document.getElementById("lang-wrap");
const langBtn = document.getElementById("lang-btn");
const langMenu = document.getElementById("lang-menu");

if (langWrap && langBtn && langMenu) {
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.hidden = !langMenu.hidden;
  });
  document.addEventListener("click", (e) => {
    if (langMenu.hidden) return;
    if (langWrap.contains(e.target)) return;
    langMenu.hidden = true;
  });
  langMenu.querySelectorAll(".lang-menu__item").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLang(btn.dataset.lang);
      langMenu.hidden = true;
    });
  });
}

// initial language application
applyLang(currentLang);

// ---------------- Navigation Menu ----------------
const menuLinks = document.querySelectorAll('.menu a');
const reviewsModal = document.getElementById('reviews-modal');
const inviteModal = document.getElementById('invite-modal');
const universitiesModal = document.getElementById('universities-modal');

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const action = link.dataset.action;
    if (!action) return; // navigate naturally to href
    e.preventDefault();

    switch(action) {
      case 'codetrail':
        showCodeTrail();
        break;
      case 'reviews':
        showReviews();
        break;
      case 'invite':
        showInvite();
        break;
      case 'universities':
        showUniversities();
        break;
      case 'avatar':
        goAvatar();
        break;
    }
  });
});

function goAvatar() {
  const navigateToAvatar = () => {
    if (pageFade) pageFade.classList.remove('is-hidden');
    setTimeout(() => {
      window.location.href = 'avatar.html';
    }, PAGE_FADE_MS);
  };
  const openLoginModal = () => {
    try {
      sessionStorage.setItem(REDIRECT_AFTER_LOGIN_KEY, 'avatar.html');
    } catch (_) {}
    const headerLoginBtn = document.getElementById('login-btn');
    if (headerLoginBtn && !headerLoginBtn.hidden) {
      headerLoginBtn.click();
    }
  };
  const decideFromDom = () => {
    const myWrapEl = document.getElementById('my-wrap');
    const domLoggedIn = !!(myWrapEl && !myWrapEl.hidden);
    if (domLoggedIn || readDemoUser()) {
      navigateToAvatar();
    } else {
      openLoginModal();
    }
  };

  if (lastAuthState === 'logged-in') {
    navigateToAvatar();
    return;
  }
  if (lastAuthState === 'logged-out') {
    if (readDemoUser()) {
      navigateToAvatar();
    } else {
      openLoginModal();
    }
    return;
  }
  // Auth not yet resolved — try the persisted hint for an instant decision.
  const hint = readAuthHint();
  if (hint === 'logged-in' || readDemoUser()) {
    navigateToAvatar();
    return;
  }
  if (hint === 'logged-out') {
    openLoginModal();
    return;
  }
  // No hint either — fall back to waiting for the next codenergy:auth event.
  if (pageFade) pageFade.classList.remove('is-hidden');
  let settled = false;
  const onAuth = (e) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    window.removeEventListener('codenergy:auth', onAuth);
    if (e && e.detail && e.detail.status === 'logged-in') {
      setTimeout(() => { window.location.href = 'avatar.html'; }, PAGE_FADE_MS);
    } else if (readDemoUser()) {
      setTimeout(() => { window.location.href = 'avatar.html'; }, PAGE_FADE_MS);
    } else {
      if (pageFade) pageFade.classList.add('is-hidden');
      openLoginModal();
    }
  };
  const timer = setTimeout(() => {
    if (settled) return;
    settled = true;
    window.removeEventListener('codenergy:auth', onAuth);
    if (pageFade) pageFade.classList.add('is-hidden');
    decideFromDom();
  }, 2000);
  window.addEventListener('codenergy:auth', onAuth);
}

function navigateToHref(href) {
  if (pageFade) pageFade.classList.remove('is-hidden');
  setTimeout(() => {
    window.location.href = href;
  }, PAGE_FADE_MS);
}

const MY_MENU_ROUTES = {
  'my.mypage': 'mypage.html',
  'my.history': 'history.html',
  'my.subscription': 'pricing.html',
  'my.invite': 'index.html',
  'my.settings': 'settings.html',
};

function initMyMenuNavigation() {
  if (!myMenu) return;
  myMenu.querySelectorAll('.my-menu__item').forEach((btn) => {
    const route = MY_MENU_ROUTES[btn.dataset.i18n];
    if (!route) return;
    btn.addEventListener('click', () => {
      myMenu.hidden = true;
      navigateToHref(route);
    });
  });
}

async function getAuthenticatedUser() {
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (_) {
    return null;
  }
}

async function getTestState() {
  try {
    const res = await fetch(`${API_BASE}/api/test/state`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (_) {
    return null;
  }
}

function showLoginPrompt(container, message) {
  if (!container) return;
  container.innerHTML = `
    <div style="padding: 20px; background: #fff; border-radius: 8px; border: 1px solid #ddd;">
      <p>${message}</p>
      <button class="cta" type="button" id="login-prompt-btn">로그인</button>
    </div>
  `;
  container.querySelector('#login-prompt-btn')?.addEventListener('click', () => {
    openModal('login');
  });
}

function showCodeTrail() {
  navigateToHref('codetrails.html');
}

function initResultsPage() {
  const startCard = document.querySelector('.result-card--start');
  const diagnoseCard = document.querySelector('.result-card--diagnose');

  if (startCard) {
    startCard.addEventListener('click', () => navigateToHref('codetrails.html'));
  }
  if (diagnoseCard) {
    diagnoseCard.addEventListener('click', () => navigateToHref('survey.html'));
  }
}

function initCodeTrailsPage() {
  const trailStartModal = document.getElementById('trail-start-modal');
  const trailStartTitle = trailStartModal?.querySelector('.trail-start__title');
  const trailStartDesc = trailStartModal?.querySelector('.trail-start__desc');
  const trailStartConfirm = document.getElementById('trail-start-confirm');
  let trailTarget = 'test-intro.html';

  document.querySelectorAll('.trail-card').forEach((card) => {
    const detailButton = card.querySelector('.trail-secondary');
    const startButton = card.querySelector('.trail-primary');
    const trailName = card.querySelector('.trail-name')?.textContent?.trim() || '선택한 트레일';
    const trailSubtitle = card.querySelector('.trail-subname')?.textContent?.trim() || '';

    if (detailButton) {
      detailButton.addEventListener('click', () => {
        alert('트레일 상세 정보는 곧 준비됩니다.');
      });
    }
    if (startButton) {
      startButton.addEventListener('click', () => {
        if (!trailStartModal) {
          navigateToHref(trailTarget);
          return;
        }
        if (trailStartTitle) {
          trailStartTitle.textContent = `${trailName} 시작하기`;
        }
        if (trailStartDesc) {
          trailStartDesc.textContent = trailSubtitle
            ? `${trailSubtitle} 트레일을 지금 시작하시겠습니까?`
            : '트레일을 지금 시작하시겠습니까?';
        }
        trailTarget = 'test-intro.html';
        trailStartModal.hidden = false;
      });
    }
  });

  if (trailStartConfirm) {
    trailStartConfirm.addEventListener('click', () => {
      navigateToHref(trailTarget);
    });
  }
}

function initMypagePage() {
  const nameEl = document.getElementById('mypage-name');
  const emailEl = document.getElementById('mypage-email');
  const statusEl = document.getElementById('mypage-status');

  getAuthenticatedUser().then((user) => {
    if (!user) {
      if (statusEl) statusEl.textContent = '로그인하면 내 정보를 확인할 수 있습니다.';
      if (nameEl) nameEl.textContent = '로그인 필요';
      if (emailEl) emailEl.textContent = '-';
      return;
    }
    if (statusEl) statusEl.textContent = `${user.username}님 환영합니다.`;
    if (nameEl) nameEl.textContent = user.username;
    if (emailEl) emailEl.textContent = user.email;
  });
}

function initHistoryPage() {
  const progressEl = document.getElementById('history-progress');
  const listEl = document.getElementById('history-list');
  const statusEl = document.getElementById('history-status');

  getTestState().then((state) => {
    if (!state) {
      if (statusEl) statusEl.textContent = '로그인 후 학습 기록을 확인할 수 있습니다.';
      if (listEl) listEl.innerHTML = '<li style="padding: 10px;">기록을 불러올 수 없습니다.</li>';
      return;
    }

    if (statusEl) statusEl.textContent = '최근 학습 기록입니다.';
    if (progressEl) {
      const p = state.progress || { current: 0, total: 0 };
      progressEl.innerHTML = `
        <p><strong>진행도:</strong> ${p.current} / ${p.total}</p>
      `;
    }

    if (!listEl) return;
    const answers = Array.isArray(state.answers) ? state.answers : [];
    if (!answers.length) {
      listEl.innerHTML = '<li style="padding: 10px;">등록된 기록이 없습니다.</li>';
      return;
    }

    listEl.innerHTML = answers
      .map((item) => {
        const when = item.submitted_at ? new Date(item.submitted_at).toLocaleString() : '알 수 없음';
        const verdict = item.verdict || '미제출';
        return `
          <li style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.problem_id}</strong> - ${verdict}
            <div style="color: #888; font-size: 0.9em; margin-top: 4px;">${when}</div>
          </li>
        `;
      })
      .join('');
  });
}

function initSettingsPage() {
  const statusEl = document.getElementById('settings-status');
  const emailCheckbox = document.getElementById('settings-email-notifications');
  const marketingCheckbox = document.getElementById('settings-marketing');
  const saveButton = document.getElementById('settings-save-btn');

  const saved = JSON.parse(localStorage.getItem('codenergy:settings') || '{}');
  if (emailCheckbox) emailCheckbox.checked = saved.emailNotifications !== false;
  if (marketingCheckbox) marketingCheckbox.checked = saved.marketingOptIn !== false;

  if (saveButton) {
    saveButton.addEventListener('click', () => {
      const payload = {
        emailNotifications: emailCheckbox?.checked ?? false,
        marketingOptIn: marketingCheckbox?.checked ?? false,
      };
      localStorage.setItem('codenergy:settings', JSON.stringify(payload));
      alert('설정이 저장되었습니다.');
    });
  }

  getAuthenticatedUser().then((user) => {
    if (!user) {
      if (statusEl) statusEl.textContent = '로그인하면 개인 설정을 더 쉽게 관리할 수 있습니다.';
      return;
    }
    if (statusEl) statusEl.textContent = `${user.username}님이 로그인 중입니다.`;
  });
}

function initHomePage() {
  const homeCta = document.getElementById('home-cta-btn');
  if (homeCta) {
    homeCta.addEventListener('click', () => navigateToHref('survey.html'));
  }
}

const currentPage = window.location.pathname.split('/').pop();
if (currentPage === 'results.html') initResultsPage();
if (currentPage === 'codetrails.html') initCodeTrailsPage();
if (currentPage === 'mypage.html') initMypagePage();
if (currentPage === 'history.html') initHistoryPage();
if (currentPage === 'settings.html') initSettingsPage();
if (currentPage === 'index.html' || currentPage === '') initHomePage();

function showReviews() {
  if (!reviewsModal) { window.location.href = 'index.html'; return; }
  reviewsModal.hidden = false;
}

function showInvite() {
  if (!inviteModal) { window.location.href = 'index.html'; return; }
  if (!document.getElementById('my-wrap').hidden) {
    inviteModal.hidden = false;
  } else {
    alert(t('alert.inviteLogin') || '로그인 후 친구 초대 기능을 이용할 수 있습니다.');
  }
}

function showUniversities() {
  if (!universitiesModal) { window.location.href = 'index.html'; return; }
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
  alert(t('alert.linkCopied') || '초대 링크가 복사되었습니다!');
}

// Copy Email address function
function copyGmailAddress() {
  const gmailInput = document.getElementById('friend-gmail');
  const email = gmailInput.value.trim();
  if (email) {
    navigator.clipboard.writeText(email).then(() => {
      alert(t('alert.emailCopied') || '이메일 주소가 복사되었습니다!');
    }).catch(() => {
      // Fallback for older browsers
      gmailInput.select();
      document.execCommand('copy');
      alert(t('alert.emailCopied') || '이메일 주소가 복사되었습니다!');
    });
  } else {
    alert(t('alert.emailEmpty') || '이메일 주소를 입력해주세요.');
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
// Tracks the most recent auth state so we can detect a logged-out -> logged-in
// transition. Starts as null so a real login (not page-load auto-restore) is
// the only thing that fires the post-login redirect. The initial /api/me
// resolver bumps this to whatever the backend says before any user-driven
// login can happen, preventing the redirect from running on page reload.
let lastAuthState = null;

function setLoggedIn(user) {
  const wasLoggedIn = lastAuthState === "logged-in";
  if (user) {
    loginBtn.hidden = true;
    signupBtn.hidden = true;
    myWrap.hidden = false;
    const isDemo = !!user.demo;
    const demoBadge = isDemo ? ` ${t("auth.demoBadge") || "(데모)"}` : "";
    myName.textContent = `${user.username}${demoBadge}`;
    myName.dataset.i18nOriginal = `${user.username}${demoBadge}`;
    myEmail.textContent = user.email || `${user.username}@example.com`;
    myWrap.dataset.demo = isDemo ? "true" : "false";
    lastAuthState = "logged-in";
    writeAuthHint("logged-in");
    // Notify pages (e.g. test-login.html) that auth state changed.
    window.dispatchEvent(new CustomEvent("codenergy:auth", {
      detail: { user, status: "logged-in" },
    }));
    // Post-login redirect: only on an actual logged-out -> logged-in
    // transition AND only when the auth modal is currently open. This guards
    // against:
    //   - Initial /api/me / demo-restore at page load (modal is hidden, so no
    //     redirect even if a stale intent is in sessionStorage from a prior
    //     reload-while-modal-open).
    //   - The narrower case where lastAuthState was logged-out (e.g. user
    //     just logged out, then reloaded) but the intent is stale.
    const modalOpen = modal && !modal.hidden;
    if (!wasLoggedIn && modalOpen) {
      const target = readRedirectIntent();
      if (target) {
        clearRedirectIntent();
        if (pageFade) pageFade.classList.remove("is-hidden");
        setTimeout(() => {
          window.location.href = target;
        }, PAGE_FADE_MS);
      }
    }
  } else {
    loginBtn.hidden = false;
    signupBtn.hidden = false;
    myWrap.hidden = true;
    myMenu.hidden = true;
    delete myWrap.dataset.demo;
    lastAuthState = "logged-out";
    writeAuthHint("logged-out");
    window.dispatchEvent(new CustomEvent("codenergy:auth", {
      detail: { user: null, status: "logged-out" },
    }));
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
  let networkFailed = false;
  try {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    if (isNetworkError(err)) networkFailed = true;
  }
  // If the backend was unreachable but we still have a demo session stored,
  // remove it so the user really logs out instead of auto-restoring on reload.
  if (networkFailed && readDemoUser()) clearDemoUser();
  // Always clear demo creds on explicit logout — mirrors the backend wipe.
  clearDemoUser();
  setLoggedIn(null);
  alert(t("auth.logoutDone") || "로그아웃되었습니다");
});

initMyMenuNavigation();

function setMode(nextMode) {
  mode = nextMode;
  const titleKey =
    nextMode === "signup-email" ? "auth.signup"
    : nextMode === "signup-verify" ? "auth.signup"
    : nextMode === "find-id" ? "auth.findId"
    : nextMode === "find-password" ? "auth.findPw"
    : "auth.login";
  const submitKey =
    nextMode === "signup-email" ? "auth.submit"
    : nextMode === "signup-verify" ? "auth.signup"
    : nextMode === "login" ? "auth.login"
    : "auth.submit";
  const titleKo =
    nextMode === "signup-email" ? "회원가입"
    : nextMode === "signup-verify" ? "회원가입"
    : nextMode === "find-id" ? "아이디 찾기"
    : nextMode === "find-password" ? "비밀번호 찾기"
    : "로그인";
  const submitKo =
    nextMode === "signup-email" ? "인증코드 받기"
    : nextMode === "signup-verify" ? "회원가입"
    : nextMode === "login" ? "로그인"
    : "전송";
  modalTitle.textContent = t(titleKey) || titleKo;
  modalTitle.dataset.i18n = titleKey;
  modalTitle.dataset.i18nOriginal = titleKo;
  submitBtn.textContent = submitKo;
  submitBtn.dataset.i18nOriginal = submitKo;

  const usernameLabel = form.querySelector(".field-username");
  const passwordLabel = form.querySelector(".field-password");
  const emailLabel = emailField;
  const codeLabel = document.getElementById("code-field");

  const showEmail = nextMode === "signup-email" || nextMode === "find-id" || nextMode === "find-password";
  const showCode = nextMode === "signup-verify";
  const showRecovery = nextMode === "login";
  const showRecoveryAlt = nextMode === "find-id" || nextMode === "find-password";
  const showUsername = nextMode === "login" || nextMode === "signup-verify" || nextMode === "signup-email";
  const showPassword = nextMode === "login" || nextMode === "signup-verify" || nextMode === "signup-email";

  usernameLabel.hidden = !showUsername;
  passwordLabel.hidden = !showPassword;
  emailLabel.hidden = !showEmail;
  if (codeLabel) codeLabel.hidden = !showCode;
  recoveryLinks.hidden = !showRecovery;
  recoveryLinksAlt.hidden = !showRecoveryAlt;

  usernameLabel.style.display = showUsername ? "flex" : "none";
  passwordLabel.style.display = showPassword ? "flex" : "none";
  emailLabel.style.display = showEmail ? "flex" : "none";
  if (codeLabel) codeLabel.style.display = showCode ? "flex" : "none";
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
  if (codeLabel) {
    form.querySelector("input[name=code]").required = showCode;
  }

  // Tell the browser/password manager whether this is sign-in vs sign-up so
  // it doesn't surface a "save existing password" popup over a fresh signup
  // (which can synthesize stray click events that look like backdrop clicks).
  const pwInput = form.querySelector("input[name=password]");
  if (pwInput) {
    pwInput.autocomplete = nextMode === "signup-verify" ? "new-password" : "current-password";
  }

  // Reset error region (also strips any demo-fallback button if present).
  errorEl.hidden = true;
  errorEl.textContent = "";
  errorEl.innerHTML = "";
  errorEl.classList.remove("modal-error--offline");
  infoEl.hidden = true;

  const preserveSignupFields = mode === "login" && nextMode === "signup-email";
  const preservedUsername = preserveSignupFields
    ? form.querySelector("input[name=username]")?.value || ""
    : "";
  const preservedPassword = preserveSignupFields
    ? form.querySelector("input[name=password]")?.value || ""
    : "";

  if (!(mode === "signup-email" && nextMode === "signup-verify")) {
    form.reset();
  }
  if (preserveSignupFields) {
    const usernameInput = form.querySelector("input[name=username]");
    const passwordInput = form.querySelector("input[name=password]");
    if (usernameInput) usernameInput.value = preservedUsername;
    if (passwordInput) passwordInput.value = preservedPassword;
  }

  if (!emailLabel.hidden) {
    form.querySelector("input[name=email]").focus();
  } else if (!codeLabel?.hidden) {
    form.querySelector("input[name=code]").focus();
  } else if (!usernameLabel.hidden) {
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
  // If the user dismisses the modal (cancel button, backdrop, ESC) without
  // logging in, drop the avatar redirect intent — otherwise a later, unrelated
  // login (header login button) would surprise them by jumping to avatar.html.
  // The successful-login path clears the intent itself before calling
  // closeModal(), so this clear is a no-op on that path.
  clearRedirectIntent();
}

loginBtn.addEventListener("click", () => openModal("login"));
signupBtn.addEventListener("click", () => openModal("signup-email"));
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

// Defensive: clicks anywhere inside the auth FORM must not bubble to the
// document-level outside-click handlers (hamburger / lang / my-menu close,
// data-close matcher, etc.). Browser-injected UI — password manager popups,
// autofill overlays, IME composition on Korean input — can synthesize click
// events that hit unexpected DOM positions, and several users have reported
// the modal disappearing when they click into the password field. The
// cancel/backdrop close paths are preserved by letting [data-close] clicks
// bubble through normally.
form.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) return;
  e.stopPropagation();
});
form.addEventListener("mousedown", (e) => {
  if (e.target.closest("[data-close]")) return;
  e.stopPropagation();
});

/**
 * Render a demo-mode prompt inside `#modal-error`. Shown when fetch itself
 * threw (server unreachable). Clicking the inline button promotes the user
 * to a local demo session — same effect as a successful /api/login.
 */
function showDemoFallback(data) {
  errorEl.innerHTML = "";
  errorEl.classList.add("modal-error--offline");

  const msg = document.createElement("span");
  msg.className = "modal-error__msg";
  msg.textContent = t("auth.offlinePrompt") || "서버에 연결할 수 없어요. 데모 모드로 진행할까요?";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "modal-error__demo-btn";
  btn.textContent = t("auth.demoContinue") || "데모 모드로 계속하기";
  btn.addEventListener("click", async () => {
    const username = (data.username || data.email || "demo").toString().trim() || "demo";
    const email = (data.email || "").toString().trim() || `${username}@example.com`;
    const passwordHash = data.password ? await sha256Hex(data.password) : "";
    const demoUser = {
      username,
      email,
      passwordHash,           // hashed only — never store the plaintext password
      demo: true,
      createdAt: Date.now(),
    };
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    } catch (_) {}
    setLoggedIn(demoUser);
    closeModal();
  });

  errorEl.appendChild(msg);
  errorEl.appendChild(btn);
  errorEl.hidden = false;
}

/** Reset the error element back to a plain text message slot. */
function resetErrorEl() {
  errorEl.classList.remove("modal-error--offline");
  errorEl.innerHTML = "";
  errorEl.textContent = "";
  errorEl.hidden = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  submitBtn.disabled = true;
  resetErrorEl();
  infoEl.hidden = true;

  try {
    // Handle email verification step
    if (mode === "signup-email") {
      try {
        const res = await fetch(`${API_BASE}/api/signup/send-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          errorEl.textContent = body.error || "인증코드 전송 실패";
          errorEl.hidden = false;
          return;
        }

        // Success: move to signup-verify mode
        infoEl.textContent = "인증코드를 이메일로 전송했습니다. 3분 이내에 입력해주세요.";
        infoEl.hidden = false;
        // Store email for next step
        sessionStorage.setItem("signup-email", data.email);
        // Switch to verify mode
        setMode("signup-verify");
      } catch (netErr) {
        if (isNetworkError(netErr)) {
          errorEl.textContent = t("auth.serverError") || "서버에 연결할 수 없습니다.";
          errorEl.hidden = false;
        } else {
          throw netErr;
        }
      }
      return;
    }

    // Handle verification + signup
    if (mode === "signup-verify") {
      const storedEmail = sessionStorage.getItem("signup-email");
      const verifyData = {
        email: storedEmail || data.email,
        code: data.code,
        username: data.username,
        password: data.password,
      };

      try {
        const res = await fetch(`${API_BASE}/api/signup/verify-code`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(verifyData),
        });
        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          errorEl.textContent = body.error || "회원가입 실패";
          errorEl.hidden = false;
          return;
        }

        clearDemoUser();
        setLoggedIn(body.user);
        sessionStorage.removeItem("signup-email");
        closeModal();
      } catch (netErr) {
        if (isNetworkError(netErr)) {
          errorEl.textContent = t("auth.serverError") || "서버에 연결할 수 없습니다.";
          errorEl.hidden = false;
        } else {
          throw netErr;
        }
      }
      return;
    }

    let endpoint = "login";
    if (mode === "find-id") endpoint = "find-username";
    if (mode === "find-password") endpoint = "forgot-password";

    let res;
    try {
      res = await fetch(`${API_BASE}/api/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (netErr) {
      // TypeError === network-level failure (DNS, connection refused, CORS
      // preflight blocked, offline). The backend wasn't reached at all, so we
      // offer the user a local demo session instead of a dead-end error.
      if (isNetworkError(netErr)) {
        if (mode === "login") {
          showDemoFallback(data);
        } else {
          // find-id / find-password require real email delivery; demo cannot help.
          errorEl.textContent = t("auth.serverError") || "서버에 연결할 수 없습니다.";
          errorEl.hidden = false;
        }
        return;
      }
      throw netErr;
    }

    // From here on, the server responded — could still be 4xx/5xx but it's
    // a real response, so we treat it as a normal "request failed" path.
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      errorEl.textContent = body.error || t("auth.fail") || "요청 실패";
      errorEl.hidden = false;
      return;
    }

    if (mode === "find-id") {
      infoEl.textContent = body.message || t("auth.findIdSuccess") || "아이디 찾기 안내를 이메일로 보냈습니다.";
      infoEl.hidden = false;
      return;
    }

    if (mode === "find-password") {
      infoEl.textContent = body.message || t("auth.findPwSuccess") || "비밀번호 재설정 안내를 이메일로 보냈습니다.";
      infoEl.hidden = false;      return;
    }

    // Successful real login — the backend is up, so any stale demo creds
    // should be cleared so we never auto-fall-back on next reload.
    clearDemoUser();
    setLoggedIn(body);
    closeModal();
  } catch (err) {
    errorEl.textContent = err?.message || t("auth.serverError") || "서버에 연결할 수 없습니다.";
    errorEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
});

// initial session check
//
// Three-way outcome:
//   1. backend up + has session         -> setLoggedIn(real user); clear demo creds
//   2. backend up + no session          -> setLoggedIn(null); clear demo creds
//   3. backend unreachable (TypeError)  -> if a demo user is stored locally,
//                                          restore that session so the user
//                                          stays logged in across reloads while
//                                          the backend is offline.
fetch(`${API_BASE}/api/me`, { credentials: "include" })
  .then((r) => (r.ok ? r.json() : null))
  .then((u) => {
    // Backend responded — authoritative answer. Drop any stale demo creds.
    clearDemoUser();
    setLoggedIn(u);
  })
  .catch((err) => {
    if (isNetworkError(err)) {
      const demo = readDemoUser();
      if (demo) {
        setLoggedIn(demo);
        return;
      }
    }
    setLoggedIn(null);
  });

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

// ---------------- Notification dropdown ----------------
const notifBtn = document.getElementById("notif-btn");
const notifMenu = document.getElementById("notif-menu");
const notifList = document.getElementById("notif-list");
const notifEmpty = document.getElementById("notif-empty");
const notifSignin = document.getElementById("notif-signin");
const notifWrap = document.getElementById("notif-wrap");

const NOTIFICATIONS_KEY = "codenergy:notifications";

const DEFAULT_NOTIFICATIONS = [
  { id: "n1", title: "오늘 학습 챌린지가 시작됐어요",
    body: "30분만 투자해서 새로운 문제 한 개를 풀어보세요.",
    createdAt: Date.now() - 1000 * 60 * 14, read: false },
  { id: "n2", title: "친구가 회원가입했어요",
    body: "초대 보상으로 7일 프리미엄이 적립됐습니다.",
    createdAt: Date.now() - 1000 * 60 * 60 * 3, read: false },
  { id: "n3", title: "학습 리포트가 준비됐어요",
    body: "지난 주 진척도를 마이페이지에서 확인해 보세요.",
    createdAt: Date.now() - 1000 * 60 * 60 * 26, read: true },
];

function loadNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return DEFAULT_NOTIFICATIONS.slice();
}

function saveNotifications(list) {
  try { localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list)); } catch (_) {}
}

function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "방금 전";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}분 전`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}시간 전`;
  const days = Math.floor(diff / 86_400_000);
  if (days < 7) return `${days}일 전`;
  return new Date(ts).toLocaleDateString();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

let notifications = loadNotifications();

function renderNotifications() {
  if (!notifList || !notifEmpty || !notifSignin) return;
  const loggedIn = !!(myWrap && !myWrap.hidden);
  if (!loggedIn) {
    notifList.innerHTML = "";
    notifEmpty.hidden = true;
    notifSignin.hidden = false;
    return;
  }
  notifSignin.hidden = true;
  if (!notifications.length) {
    notifList.innerHTML = "";
    notifEmpty.hidden = false;
    return;
  }
  notifEmpty.hidden = true;
  notifList.innerHTML = notifications.map((n) => `
    <li class="notif-item ${n.read ? "is-read" : "is-unread"}" data-id="${escapeHtml(n.id)}">
      <span class="notif-item__title">${escapeHtml(n.title || "")}</span>
      <span class="notif-item__body">${escapeHtml(n.body || "")}</span>
      <span class="notif-item__time">${escapeHtml(formatRelativeTime(n.createdAt))}</span>
    </li>
  `).join("");
}

if (notifBtn && notifMenu && notifWrap) {
  notifBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = notifMenu.hidden;
    notifMenu.hidden = !willOpen;
    notifBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    if (willOpen) renderNotifications();
  });

  document.addEventListener("click", (e) => {
    if (notifMenu.hidden) return;
    if (notifWrap.contains(e.target)) return;
    notifMenu.hidden = true;
    notifBtn.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !notifMenu.hidden) {
      notifMenu.hidden = true;
      notifBtn.setAttribute("aria-expanded", "false");
    }
  });

  if (notifList) {
    notifList.addEventListener("click", (e) => {
      const li = e.target.closest(".notif-item");
      if (!li) return;
      const item = notifications.find((n) => n.id === li.dataset.id);
      if (item && !item.read) {
        item.read = true;
        saveNotifications(notifications);
        renderNotifications();
      }
    });
  }

  window.addEventListener("codenergy:auth", () => {
    if (!notifMenu.hidden) renderNotifications();
  });
}
