// Authentication routes + session helpers.
// Sessions are stored server-side in SQLite, identified by an opaque
// 32-byte hex token sent as an httpOnly cookie ("sid").

import express from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { stmts, publicUser } from "./db.js";
import { sendMail } from "./mailer.js";

export const SESSION_COOKIE = "sid";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const BCRYPT_ROUNDS = 10;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
function validateUsername(username) {
  if (typeof username !== "string") return "username is required";
  if (username.trim().length < 2) return "username must be at least 2 characters";
  return null;
}
function validatePassword(password) {
  if (typeof password !== "string") return "password is required";
  if (password.length < 6) return "password must be at least 6 characters";
  return null;
}
function validateEmail(email) {
  if (typeof email !== "string") return "email is required";
  if (!email.includes("@")) return "invalid email";
  return null;
}

// ---------------------------------------------------------------------------
// Session helpers
// ---------------------------------------------------------------------------
function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  stmts.insertSession.run(token, userId, expiresAt);

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // localhost dev
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
  return token;
}

function destroySession(req, res) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) stmts.deleteSession.run(token);
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

/**
 * Express middleware: looks up the session cookie and attaches `req.user`
 * (or null) to the request. Does NOT block unauthenticated requests.
 */
export function loadSession(req, _res, next) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    req.user = null;
    return next();
  }
  const row = stmts.findSession.get(token);
  if (!row) {
    req.user = null;
    return next();
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    stmts.deleteSession.run(token);
    req.user = null;
    return next();
  }
  req.user = {
    id: row.user_id,
    username: row.username,
    email: row.email,
  };
  next();
}

/** Express middleware: requires a logged-in user (else 401). */
export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "not logged in" });
  next();
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
export const authRouter = express.Router();

// POST /api/signup
authRouter.post("/signup", async (req, res) => {
  const { username, password, email } = req.body || {};
  const err =
    validateUsername(username) ||
    validatePassword(password) ||
    validateEmail(email);
  if (err) return res.status(400).json({ error: err });

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  const existing = stmts.findUserByUsername.get(cleanUsername);
  if (existing) {
    return res.status(409).json({ error: "username already taken" });
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  let info;
  try {
    info = stmts.insertUser.run(cleanUsername, cleanEmail, hash);
  } catch (e) {
    if (String(e.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "username already taken" });
    }
    throw e;
  }

  const userId = Number(info.lastInsertRowid);
  createSession(res, userId);
  const user = stmts.findUserById.get(userId);
  res.status(201).json(publicUser(user));
});

// POST /api/login
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  const row = stmts.findUserByUsername.get(String(username).trim());
  if (!row) return res.status(401).json({ error: "invalid credentials" });

  const ok = await bcrypt.compare(String(password), row.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });

  createSession(res, row.id);
  res.json(publicUser(row));
});

// POST /api/logout
authRouter.post("/logout", (req, res) => {
  destroySession(req, res);
  res.status(200).json({ ok: true });
});

// GET /api/me
authRouter.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "not logged in" });
  const row = stmts.findUserById.get(req.user.id);
  if (!row) return res.status(401).json({ error: "not logged in" });
  res.json(publicUser(row));
});

// POST /api/find-username
authRouter.post("/find-username", async (req, res) => {
  const { email } = req.body || {};
  const err = validateEmail(email);
  if (err) return res.status(400).json({ error: err });

  const cleanEmail = email.trim().toLowerCase();
  const row = stmts.findUserByEmail.get(cleanEmail);

  // Do not leak whether the email exists. Always return success.
  if (row) {
    await sendMail({
      to: cleanEmail,
      subject: "[Codenergy] 아이디 찾기 안내",
      text:
        `안녕하세요, Codenergy입니다.\n\n` +
        `요청하신 이메일(${cleanEmail})로 등록된 아이디는 다음과 같습니다:\n\n` +
        `    ${row.username}\n\n` +
        `본인이 요청하지 않았다면 이 메일을 무시해주세요.`,
    });
  } else {
    // Still log so the developer notices the request.
    console.log(`[find-username] no user matches email=${cleanEmail}`);
  }

  res.json({
    message: `아이디 찾기 안내를 ${cleanEmail}로 보냈습니다.`,
  });
});

// POST /api/forgot-password
authRouter.post("/forgot-password", async (req, res) => {
  const { email, username } = req.body || {};
  const errEmail = validateEmail(email);
  if (errEmail) return res.status(400).json({ error: errEmail });
  const errUser = validateUsername(username);
  if (errUser) return res.status(400).json({ error: errUser });

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim();
  const row = stmts.findUserByEmailAndUsername.get(cleanEmail, cleanUsername);

  if (row) {
    // Generate a temporary password and email it. (Real reset-token flow
    // would email a one-time link; this is a simpler dev-friendly version.)
    const tempPassword = crypto.randomBytes(6).toString("base64url");
    const hash = await bcrypt.hash(tempPassword, BCRYPT_ROUNDS);
    stmts.updatePasswordHash.run(hash, row.id);

    await sendMail({
      to: cleanEmail,
      subject: "[Codenergy] 임시 비밀번호 안내",
      text:
        `안녕하세요, Codenergy입니다.\n\n` +
        `요청에 따라 임시 비밀번호를 발급했습니다.\n\n` +
        `    아이디:        ${row.username}\n` +
        `    임시 비밀번호: ${tempPassword}\n\n` +
        `로그인 후 반드시 비밀번호를 변경해주세요.`,
    });
  } else {
    console.log(
      `[forgot-password] no match for username=${cleanUsername} email=${cleanEmail}`
    );
  }

  res.json({
    message: `비밀번호 재설정 안내를 ${cleanEmail}로 보냈습니다.`,
  });
});

// POST /api/signup/send-code  { email }
// Send verification code to email for signup
authRouter.post("/signup/send-code", async (req, res) => {
  const { email } = req.body || {};
  const errEmail = validateEmail(email);
  if (errEmail) return res.status(400).json({ error: errEmail });

  const cleanEmail = email.trim().toLowerCase();

  // Check if email already exists
  const existing = stmts.findUserByEmail.get(cleanEmail);
  if (existing) {
    return res.status(400).json({
      error: "이미 가입된 이메일주소입니다.",
    });
  }

  // Generate 5-digit code and keep code valid for 3 minutes only
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString(); // 3 minutes

  stmts.deleteExpiredEmailAuthCodes.run();
  stmts.deleteEmailAuthCodesByEmail.run(cleanEmail);
  stmts.insertEmailAuthCode.run(cleanEmail, code, expiresAt);

  try {
    const mailResult = await sendMail({
      to: cleanEmail,
      subject: "[Codenergy] 이메일 인증 코드",
      html: `
        <h2>안녕하세요, Codenergy입니다.</h2>
        <p>이메일 인증 코드는 다음과 같습니다:</p>
        <h1 style="letter-spacing: 8px; font-family: monospace; background: #f5f5f5; padding: 20px; text-align: center;">
          ${code}
        </h1>
        <p style="color: #666; font-size: 12px;">
          이 코드는 3분간 유효합니다.<br />
          본인이 요청하지 않은 경우 무시해주세요.
        </p>
      `,
    });
    
    if (mailResult.dev) {
      res.json({ ok: true, message: "개발 모드: 인증코드가 서버 콘솔에 출력되었습니다.", devCode: code });
    } else {
      res.json({ ok: true, message: "인증코드를 이메일로 전송했습니다." });
    }
  } catch (err) {
    console.error("Failed to send auth code:", err);
    res.status(500).json({ error: "이메일 전송에 실패했습니다." });
  }
});

// POST /api/signup/verify-code  { email, code, username, password }
// Verify code and create account
authRouter.post("/signup/verify-code", async (req, res) => {
  const { email, code, username, password } = req.body || {};

  // Validate email and code first
  const errEmail = validateEmail(email);
  if (errEmail) return res.status(400).json({ error: errEmail });

  if (typeof code !== "string" || code.trim().length === 0) {
    return res.status(400).json({ error: "인증코드가 필요합니다." });
  }
  const cleanCode = code.trim();
  if (!/^[0-9]{5}$/.test(cleanCode)) {
    return res.status(400).json({ error: "인증코드는 5자리 숫자여야 합니다." });
  }

  // Check code validity
  const cleanEmail = email.trim().toLowerCase();
  const authRow = stmts.findEmailAuthCode.get(cleanEmail, cleanCode);

  if (!authRow) {
    return res.status(400).json({
      error: "유효하지 않거나 만료된 인증코드입니다.",
    });
  }

  // Validate username and password
  const errUser = validateUsername(username);
  if (errUser) return res.status(400).json({ error: errUser });

  const errPass = validatePassword(password);
  if (errPass) return res.status(400).json({ error: errPass });

  const cleanUsername = username.trim();

  // Check if username already exists
  const existing = stmts.findUserByUsername.get(cleanUsername);
  if (existing) {
    return res.status(400).json({ error: "이미 사용 중인 아이디입니다." });
  }

  // Hash password and create user
  try {
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const info = stmts.insertUser.run(cleanUsername, cleanEmail, hash);
    const userId = Number(info.lastInsertRowid);

    // Delete used code
    stmts.deleteEmailAuthCode.run(cleanEmail, cleanCode);

    // Create session
    createSession(res, userId);
    const user = stmts.findUserById.get(userId);

    res.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ error: "회원가입에 실패했습니다." });
  }
});
