// Postgres (Supabase) data layer.
//
// Replaces the previous local SQLite implementation so that user accounts and
// data sync across machines: any backend instance pointed at the same
// DATABASE_URL sees the same rows.
//
// The exported `stmts` object preserves the call shape the rest of the codebase
// already uses (`.get(...)`, `.all(...)`, `.run(...)`), but every method is now
// async — callers must `await` them. `run()` returns `{ changes, lastInsertRowid }`
// so existing call sites that read `result.lastInsertRowid` keep working.
//
// For multi-statement atomicity (e.g. learn.js's submit flow), use `withTx`:
//
//     const result = await withTx(async (tx) => {
//       await tx.insertLessonAttempt.run(...);
//       const cur = await tx.getLessonStatus.get(...);
//       ...
//     });

import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy your Supabase Postgres connection string " +
      "(Supabase Dashboard → Project Settings → Database → Connection string → URI) " +
      "into backend/.env as DATABASE_URL=postgresql://..."
  );
}

// Supabase requires TLS. The default node-postgres SSL handshake against
// Supabase succeeds with this minimal config.
export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
});

pool.on("error", (err) => {
  console.error("[pg pool error]", err);
});

// ---------------------------------------------------------------------------
// Statement factory
// ---------------------------------------------------------------------------
// `querier` is either the Pool (default) or a per-transaction Client. Both
// expose .query(text, params); building stmts against the right object lets
// transactions share a single connection.
function makeStmt(querier, text) {
  return {
    text,
    async get(...args) {
      const res = await querier.query(text, args);
      return res.rows[0] ?? null;
    },
    async all(...args) {
      const res = await querier.query(text, args);
      return res.rows;
    },
    async run(...args) {
      const res = await querier.query(text, args);
      // For INSERT…RETURNING id, expose the new id under the SQLite-style key.
      const lastInsertRowid = res.rows?.[0]?.id ?? null;
      return { changes: res.rowCount ?? 0, lastInsertRowid };
    },
  };
}

function buildStmts(q) {
  return {
    // --- users ---------------------------------------------------------------
    insertUser: makeStmt(
      q,
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id"
    ),
    findUserByUsername: makeStmt(q, "SELECT * FROM users WHERE username = $1"),
    findUserByEmail: makeStmt(q, "SELECT * FROM users WHERE email = $1"),
    findUserByEmailAndUsername: makeStmt(
      q,
      "SELECT * FROM users WHERE email = $1 AND username = $2"
    ),
    findUserById: makeStmt(
      q,
      "SELECT id, username, email, is_admin, is_suspended, created_at FROM users WHERE id = $1"
    ),
    updatePasswordHash: makeStmt(
      q,
      "UPDATE users SET password_hash = $1 WHERE id = $2"
    ),

    // --- sessions ------------------------------------------------------------
    insertSession: makeStmt(
      q,
      "INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)"
    ),
    findSession: makeStmt(
      q,
      `SELECT s.token AS token, s.user_id AS user_id, s.expires_at AS expires_at,
              u.username AS username, u.email AS email,
              u.is_admin AS is_admin, u.is_suspended AS is_suspended
         FROM sessions s
         JOIN users u ON u.id = s.user_id
        WHERE s.token = $1`
    ),
    deleteSessionsForUser: makeStmt(q, "DELETE FROM sessions WHERE user_id = $1"),
    deleteSession: makeStmt(q, "DELETE FROM sessions WHERE token = $1"),
    deleteExpiredSessions: makeStmt(
      q,
      "DELETE FROM sessions WHERE expires_at < now()"
    ),

    // --- test progress -------------------------------------------------------
    upsertProgress: makeStmt(
      q,
      `INSERT INTO test_progress (user_id, current, total, updated_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (user_id) DO UPDATE SET
         current = EXCLUDED.current,
         total = EXCLUDED.total,
         updated_at = now()`
    ),
    getProgress: makeStmt(
      q,
      "SELECT current, total, updated_at FROM test_progress WHERE user_id = $1"
    ),

    // --- test answers --------------------------------------------------------
    insertAnswer: makeStmt(
      q,
      "INSERT INTO test_answers (user_id, problem_id, code, verdict) VALUES ($1, $2, $3, $4) RETURNING id"
    ),
    listAnswers: makeStmt(
      q,
      `SELECT id, problem_id, code, verdict, submitted_at
         FROM test_answers
        WHERE user_id = $1
        ORDER BY submitted_at DESC`
    ),

    // --- email samples -------------------------------------------------------
    insertEmailSample: makeStmt(
      q,
      "INSERT INTO email_samples (email, user_id) VALUES ($1, $2) RETURNING id"
    ),

    // --- avatars -------------------------------------------------------------
    getAvatar: makeStmt(
      q,
      "SELECT config, updated_at FROM avatars WHERE user_id = $1"
    ),
    upsertAvatar: makeStmt(
      q,
      `INSERT INTO avatars (user_id, config, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (user_id) DO UPDATE SET
         config = EXCLUDED.config,
         updated_at = now()`
    ),

    // --- surveys -------------------------------------------------------------
    getSurvey: makeStmt(
      q,
      `SELECT interest, level, "time" AS time, updated_at
         FROM surveys WHERE user_id = $1`
    ),
    upsertSurvey: makeStmt(
      q,
      `INSERT INTO surveys (user_id, interest, level, "time", updated_at)
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (user_id) DO UPDATE SET
         interest = EXCLUDED.interest,
         level = EXCLUDED.level,
         "time" = EXCLUDED."time",
         updated_at = now()`
    ),

    // --- lectures ------------------------------------------------------------
    insertLecture: makeStmt(
      q,
      `INSERT INTO lectures
         (user_id, title, description, source_type, source, thumbnail, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`
    ),
    listLectures: makeStmt(
      q,
      `SELECT l.id, l.title, l.description, l.source_type, l.source,
              l.thumbnail, l.view_count, l.category,
              l.created_at, l.user_id, u.username AS uploader
         FROM lectures l
         JOIN users u ON u.id = l.user_id
        WHERE u.is_suspended = 0
        ORDER BY l.created_at DESC`
    ),
    listLecturesByCategory: makeStmt(
      q,
      `SELECT l.id, l.title, l.description, l.source_type, l.source,
              l.thumbnail, l.view_count, l.category,
              l.created_at, l.user_id, u.username AS uploader
         FROM lectures l
         JOIN users u ON u.id = l.user_id
        WHERE l.category = $1 AND u.is_suspended = 0
        ORDER BY l.created_at DESC`
    ),
    findLecture: makeStmt(
      q,
      `SELECT l.id, l.title, l.description, l.source_type, l.source,
              l.thumbnail, l.view_count, l.category,
              l.created_at, l.user_id, u.username AS uploader,
              u.is_suspended AS uploader_suspended
         FROM lectures l
         JOIN users u ON u.id = l.user_id
        WHERE l.id = $1`
    ),
    deleteLecture: makeStmt(
      q,
      "DELETE FROM lectures WHERE id = $1 AND user_id = $2"
    ),
    incrementLectureView: makeStmt(
      q,
      "UPDATE lectures SET view_count = view_count + 1 WHERE id = $1"
    ),
    getLectureViewCount: makeStmt(
      q,
      "SELECT view_count FROM lectures WHERE id = $1"
    ),

    // --- admin ---------------------------------------------------------------
    listAllUsers: makeStmt(
      q,
      `SELECT u.id, u.username, u.email, u.is_admin, u.is_suspended, u.created_at,
              (SELECT COUNT(*) FROM lectures l WHERE l.user_id = u.id) AS lecture_count
         FROM users u
         ORDER BY u.created_at DESC`
    ),
    setUserSuspended: makeStmt(
      q,
      "UPDATE users SET is_suspended = $1 WHERE id = $2"
    ),
    listAllLectures: makeStmt(
      q,
      `SELECT l.id, l.title, l.description, l.source_type, l.source,
              l.thumbnail, l.view_count, l.category,
              l.created_at, l.user_id,
              u.username AS uploader, u.is_suspended AS uploader_suspended
         FROM lectures l
         JOIN users u ON u.id = l.user_id
         ORDER BY l.created_at DESC`
    ),
    adminDeleteLecture: makeStmt(q, "DELETE FROM lectures WHERE id = $1"),

    // --- email auth codes ----------------------------------------------------
    // Codes are stored hashed (sha256) so a DB leak doesn't reveal active codes.
    // `attempts` is bumped on every failed verify to cap brute-force tries.
    insertEmailAuthCode: makeStmt(
      q,
      `INSERT INTO email_auth_codes (email, code_hash, expires_at)
       VALUES ($1, $2, $3) RETURNING id`
    ),
    // Latest active (non-expired) code for an email, used by verify.
    findLatestEmailAuthCode: makeStmt(
      q,
      `SELECT id, email, code_hash, attempts, created_at, expires_at
         FROM email_auth_codes
        WHERE email = $1 AND expires_at > now()
        ORDER BY created_at DESC
        LIMIT 1`
    ),
    // Most-recent code regardless of expiry, used by send-code to enforce
    // a per-email resend cooldown.
    findMostRecentEmailAuthCode: makeStmt(
      q,
      `SELECT created_at
         FROM email_auth_codes
        WHERE email = $1
        ORDER BY created_at DESC
        LIMIT 1`
    ),
    incrementEmailAuthCodeAttempts: makeStmt(
      q,
      "UPDATE email_auth_codes SET attempts = attempts + 1 WHERE id = $1"
    ),
    deleteEmailAuthCodeById: makeStmt(
      q,
      "DELETE FROM email_auth_codes WHERE id = $1"
    ),
    deleteEmailAuthCodesForEmail: makeStmt(
      q,
      "DELETE FROM email_auth_codes WHERE email = $1"
    ),
    deleteExpiredEmailAuthCodes: makeStmt(
      q,
      "DELETE FROM email_auth_codes WHERE expires_at < now()"
    ),

    // --- learn: lesson progress ---------------------------------------------
    getLessonProgress: makeStmt(
      q,
      "SELECT lesson_id, status, completed_at FROM lesson_progress WHERE user_id = $1"
    ),
    getLessonStatus: makeStmt(
      q,
      "SELECT status, completed_at FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2"
    ),
    upsertLessonProgress: makeStmt(
      q,
      `INSERT INTO lesson_progress (user_id, lesson_id, status, completed_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET
         status = EXCLUDED.status,
         completed_at = CASE
           WHEN EXCLUDED.status = 'done'
             THEN COALESCE(lesson_progress.completed_at, now())
           ELSE lesson_progress.completed_at
         END`
    ),

    // --- learn: lesson attempts ---------------------------------------------
    insertLessonAttempt: makeStmt(
      q,
      `INSERT INTO lesson_attempts (user_id, lesson_id, problem_id, code, verdict, ungraded)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
    ),
    // SQLite's "GROUP BY problem_id HAVING submitted_at = MAX(submitted_at)"
    // is invalid in standard SQL; use DISTINCT ON to get the latest row per
    // problem_id deterministically.
    listLatestGradedVerdicts: makeStmt(
      q,
      `SELECT DISTINCT ON (problem_id) problem_id, verdict
         FROM lesson_attempts
        WHERE user_id = $1 AND lesson_id = $2 AND ungraded = 0
        ORDER BY problem_id, submitted_at DESC`
    ),
  };
}

// Default statement set bound to the connection pool.
export const stmts = buildStmts(pool);

/**
 * Run `fn` inside a Postgres transaction. The argument passed to `fn` is a
 * stmts-shaped object bound to the dedicated transaction client, so all
 * statements executed via it share one connection and one BEGIN…COMMIT.
 *
 *     const status = await withTx(async (tx) => {
 *       await tx.insertLessonAttempt.run(...);
 *       const cur = await tx.getLessonStatus.get(...);
 *       ...
 *       return computedStatus;
 *     });
 */
export async function withTx(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const txStmts = buildStmts(client);
    const result = await fn(txStmts);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // ignore rollback errors; surface the original
    }
    throw err;
  } finally {
    client.release();
  }
}

// One-shot connectivity check + housekeeping at startup. Logs a clear hint if
// the connection string is wrong so the dev knows what to fix.
(async () => {
  try {
    await stmts.deleteExpiredSessions.run();
    await stmts.deleteExpiredEmailAuthCodes.run();
    console.log("[db] connected to Postgres, expired sessions/codes cleaned");
  } catch (err) {
    console.error(
      "[db] failed to connect to Postgres. Check DATABASE_URL in backend/.env.\n" +
        "    Underlying error:",
      err?.message ?? err
    );
  }
})();

export function publicUser(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    username: row.username,
    email: row.email,
    is_admin: row.is_admin ? 1 : 0,
    created_at: row.created_at ?? null,
  };
}
