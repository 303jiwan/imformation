// Authentication routes + session helpers.
// Sessions are stored in Postgres (shared across machines via Supabase),
// identified by an opaque 32-byte hex token sent as an httpOnly cookie ("sid").

import express from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { stmts, publicUser } from "./db.js";
import { sendMail } from "./mailer.js";

export const SESSION_COOKIE = "sid";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const BCRYPT_ROUNDS = 10;

// Postgres unique-violation SQLSTATE. Used to convert a duplicate-username
// race condition into a clean 409 instead of a 500.
const PG_UNIQUE_VIOLATION = "23505";

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
async function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  await stmts.insertSession.run(token, userId, expiresAt);

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // localhost dev
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
  return token;
}

async function destroySession(req, res) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) await stmts.deleteSession.run(token);
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

/**
 * Express middleware: looks up the session cookie and attaches `req.user`
 * (or null) to the request. Does NOT block unauthenticated requests.
 */
export async function loadSession(req, res, next) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) {
      req.user = null;
      return next();
    }
    const row = await stmts.findSession.get(token);
    if (!row) {
      req.user = null;
      return next();
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await stmts.deleteSession.run(token);
      req.user = null;
      return next();
    }
    // Suspended accounts: wipe every session for the user and clear the cookie
    // so an admin's suspension takes effect even for already-logged-in users.
    if (row.is_suspended) {
      await stmts.deleteSessionsForUser.run(row.user_id);
      res.clearCookie(SESSION_COOKIE, { path: "/" });
      req.user = null;
      return next();
    }
    req.user = {
      id: Number(row.user_id),
      username: row.username,
      email: row.email,
      is_admin: row.is_admin ? 1 : 0,
    };
    next();
  } catch (err) {
    next(err);
  }
}

/** Express middleware: requires a logged-in user (else 401). */
export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "not logged in" });
  next();
}

/** Express middleware: requires the logged-in user to be an admin (else 403). */
export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "not logged in" });
  if (!req.user.is_admin) return res.status(403).json({ error: "admin only" });
  next();
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
export const authRouter = express.Router();

// POST /api/signup
authRouter.post("/signup", async (req, res, next) => {
  try {
    const { username, password, email } = req.body || {};
    const err =
      validateUsername(username) ||
      validatePassword(password) ||
      validateEmail(email);
    if (err) return res.status(400).json({ error: err });

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    const existing = await stmts.findUserByUsername.get(cleanUsername);
    if (existing) {
      return res.status(409).json({ error: "username already taken" });
    }

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    let info;
    try {
      info = await stmts.insertUser.run(cleanUsername, cleanEmail, hash);
    } catch (e) {
      if (e?.code === PG_UNIQUE_VIOLATION) {
        return res.status(409).json({ error: "username already taken" });
      }
      throw e;
    }

    const userId = Number(info.lastInsertRowid);
    await createSession(res, userId);
    const user = await stmts.findUserById.get(userId);
    res.status(201).json(publicUser(user));
  } catch (err) {
    next(err);
  }
});

// POST /api/login
authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }
    const row = await stmts.findUserByUsername.get(String(username).trim());
    if (!row) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(String(password), row.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    if (row.is_suspended) {
      return res.status(403).json({ error: "계정이 정지되었습니다." });
    }

    await createSession(res, row.id);
    res.json(publicUser(row));
  } catch (err) {
    next(err);
  }
});

// POST /api/logout
authRouter.post("/logout", async (req, res, next) => {
  try {
    await destroySession(req, res);
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/me
authRouter.get("/me", async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: "not logged in" });
    const row = await stmts.findUserById.get(req.user.id);
    if (!row) return res.status(401).json({ error: "not logged in" });
    res.json(publicUser(row));
  } catch (err) {
    next(err);
  }
});

// POST /api/find-username
authRouter.post("/find-username", async (req, res, next) => {
  try {
    const { email } = req.body || {};
    const err = validateEmail(email);
    if (err) return res.status(400).json({ error: err });

    const cleanEmail = email.trim().toLowerCase();
    const row = await stmts.findUserByEmail.get(cleanEmail);

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
      console.log(`[find-username] no user matches email=${cleanEmail}`);
    }

    res.json({
      message: `아이디 찾기 안내를 ${cleanEmail}로 보냈습니다.`,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/forgot-password
authRouter.post("/forgot-password", async (req, res, next) => {
  try {
    const { email, username } = req.body || {};
    const errEmail = validateEmail(email);
    if (errEmail) return res.status(400).json({ error: errEmail });
    const errUser = validateUsername(username);
    if (errUser) return res.status(400).json({ error: errUser });

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    const row = await stmts.findUserByEmailAndUsername.get(
      cleanEmail,
      cleanUsername
    );

    if (row) {
      const tempPassword = crypto.randomBytes(6).toString("base64url");
      const hash = await bcrypt.hash(tempPassword, BCRYPT_ROUNDS);
      await stmts.updatePasswordHash.run(hash, row.id);

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
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Email-verified signup flow
// ---------------------------------------------------------------------------
// Codes are 6-digit numeric, stored only as a sha256 hex digest. Plaintext
// codes exist only in the outgoing email and the user's submission.
//
//   send-code   → generate code, drop prior codes for the email, send mail
//   verify-code → match hash, increment attempts on miss, create user on hit
//
// Guards:
//   * 60-second resend cooldown per email (prevents mailbomb)
//   * 10-minute TTL
//   * 5 failed attempts invalidate the code
const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

function hashAuthCode(code) {
  return crypto.createHash("sha256").update(code, "utf8").digest("hex");
}

function timingSafeEqualHex(aHex, bHex) {
  if (typeof aHex !== "string" || typeof bHex !== "string") return false;
  if (aHex.length !== bHex.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(aHex, "hex"), Buffer.from(bHex, "hex"));
  } catch {
    return false;
  }
}

// POST /api/signup/send-code  { email }
authRouter.post("/signup/send-code", async (req, res, next) => {
  try {
    const { email } = req.body || {};
    const errEmail = validateEmail(email);
    if (errEmail) return res.status(400).json({ error: errEmail });

    const cleanEmail = email.trim().toLowerCase();

    if (await stmts.findUserByEmail.get(cleanEmail)) {
      return res.status(400).json({ error: "이미 가입된 이메일주소입니다." });
    }

    // Resend cooldown: refuse if we sent a code to this address within the
    // last RESEND_COOLDOWN_MS. retryAfter (seconds) lets the frontend show
    // a live countdown without guessing.
    const recent = await stmts.findMostRecentEmailAuthCode.get(cleanEmail);
    if (recent) {
      const elapsedMs = Date.now() - new Date(recent.created_at).getTime();
      const remainMs = RESEND_COOLDOWN_MS - elapsedMs;
      if (remainMs > 0) {
        const retryAfter = Math.ceil(remainMs / 1000);
        res.set("Retry-After", String(retryAfter));
        return res.status(429).json({
          error: `잠시 후 다시 시도해주세요. (${retryAfter}초)`,
          retryAfter,
        });
      }
    }

    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
    const codeHash = hashAuthCode(code);
    const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

    // Single active code per email: drop any prior rows before inserting.
    await stmts.deleteEmailAuthCodesForEmail.run(cleanEmail);
    await stmts.insertEmailAuthCode.run(cleanEmail, codeHash, expiresAt);

    try {
      await sendMail({
        to: cleanEmail,
        subject: "[Codenergy] 이메일 인증 코드",
        html: `
          <h2>안녕하세요, Codenergy입니다.</h2>
          <p>이메일 인증 코드는 다음과 같습니다:</p>
          <h1 style="letter-spacing: 8px; font-family: monospace; background: #f5f5f5; padding: 20px; text-align: center;">
            ${code}
          </h1>
          <p style="color: #666; font-size: 12px;">
            이 코드는 10분간 유효합니다.<br />
            본인이 요청하지 않은 경우 무시해주세요.
          </p>
        `,
      });
    } catch (mailErr) {
      // Roll back the just-inserted code so the cooldown doesn't lock the
      // user out of retrying after a transient SMTP failure.
      await stmts.deleteEmailAuthCodesForEmail.run(cleanEmail).catch(() => {});
      console.error("Failed to send auth code:", mailErr);
      return res.status(500).json({ error: "이메일 전송에 실패했습니다." });
    }

    res.json({
      ok: true,
      message: "인증코드를 이메일로 전송했습니다.",
      expiresInSec: Math.floor(CODE_TTL_MS / 1000),
      resendAfterSec: Math.floor(RESEND_COOLDOWN_MS / 1000),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/signup/verify-code  { email, code, username, password }
authRouter.post("/signup/verify-code", async (req, res, next) => {
  try {
    const { email, code, username, password } = req.body || {};

    const errEmail = validateEmail(email);
    if (errEmail) return res.status(400).json({ error: errEmail });
    if (typeof code !== "string" || code.trim().length === 0) {
      return res.status(400).json({ error: "인증코드가 필요합니다." });
    }
    const errUser = validateUsername(username);
    if (errUser) return res.status(400).json({ error: errUser });
    const errPass = validatePassword(password);
    if (errPass) return res.status(400).json({ error: errPass });

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    const cleanUsername = username.trim();

    const authRow = await stmts.findLatestEmailAuthCode.get(cleanEmail);
    if (!authRow) {
      return res.status(400).json({
        error: "유효하지 않거나 만료된 인증코드입니다.",
      });
    }

    if (authRow.attempts >= MAX_VERIFY_ATTEMPTS) {
      await stmts.deleteEmailAuthCodeById.run(authRow.id);
      return res.status(400).json({
        error: "인증 시도 횟수를 초과했습니다. 코드를 다시 요청해주세요.",
      });
    }

    const expectedHash = hashAuthCode(cleanCode);
    if (!timingSafeEqualHex(expectedHash, authRow.code_hash)) {
      await stmts.incrementEmailAuthCodeAttempts.run(authRow.id);
      const remaining = Math.max(0, MAX_VERIFY_ATTEMPTS - (authRow.attempts + 1));
      return res.status(400).json({
        error: `인증코드가 일치하지 않습니다. (남은 횟수: ${remaining})`,
        attemptsRemaining: remaining,
      });
    }

    if (await stmts.findUserByUsername.get(cleanUsername)) {
      return res.status(400).json({ error: "이미 사용 중인 아이디입니다." });
    }
    if (await stmts.findUserByEmail.get(cleanEmail)) {
      // Race: someone else completed signup with the same email between
      // send-code and verify-code. Clean up the now-unusable code.
      await stmts.deleteEmailAuthCodeById.run(authRow.id);
      return res.status(400).json({ error: "이미 가입된 이메일주소입니다." });
    }

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    let info;
    try {
      info = await stmts.insertUser.run(cleanUsername, cleanEmail, hash);
    } catch (err) {
      if (err?.code === PG_UNIQUE_VIOLATION) {
        return res.status(409).json({ error: "이미 사용 중인 아이디입니다." });
      }
      throw err;
    }
    const userId = Number(info.lastInsertRowid);

    await stmts.deleteEmailAuthCodeById.run(authRow.id);
    await createSession(res, userId);
    const user = await stmts.findUserById.get(userId);

    res.json({
      ok: true,
      user: {
        id: Number(user.id),
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});
