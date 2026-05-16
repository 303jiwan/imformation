// SQLite initialization and schema migrations.
// Uses Node's built-in `node:sqlite` (stable since Node 22.5) — no native build,
// no Python toolchain required. The exposed `stmts` shape matches a
// better-sqlite3-style call site (`.run`, `.get`, `.all`).

import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "app.db");

export const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// --- Schema -----------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,
    email         TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin      INTEGER NOT NULL DEFAULT 0,
    is_suspended  INTEGER NOT NULL DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

  CREATE TABLE IF NOT EXISTS sessions (
    token       TEXT PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at  DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

  CREATE TABLE IF NOT EXISTS test_progress (
    user_id    INTEGER PRIMARY KEY,
    current    INTEGER NOT NULL DEFAULT 0,
    total      INTEGER NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS test_answers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    problem_id  TEXT NOT NULL,
    code        TEXT NOT NULL,
    verdict     TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_answers_user ON test_answers(user_id);

  CREATE TABLE IF NOT EXISTS email_samples (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL,
    user_id    INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS avatars (
    user_id    INTEGER PRIMARY KEY,
    config     TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS lectures (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL DEFAULT '',
    source_type  TEXT NOT NULL CHECK (source_type IN ('url', 'file')),
    source       TEXT NOT NULL,
    thumbnail    TEXT,
    view_count   INTEGER NOT NULL DEFAULT 0,
    category     TEXT NOT NULL DEFAULT 'other',
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_lectures_created ON lectures(created_at DESC);
  -- idx_lectures_category is created AFTER the column-migration block below.
  -- Creating it here would crash on legacy databases whose lectures table
  -- pre-dates the category column (CREATE TABLE IF NOT EXISTS is a no-op
  -- on existing tables, so the column would not exist yet at this point).

  CREATE TABLE IF NOT EXISTS surveys (
    user_id    INTEGER PRIMARY KEY,
    interest   TEXT NOT NULL,
    level      TEXT NOT NULL,
    time       TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS email_auth_codes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL,
    code       TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_email_auth_codes_email ON email_auth_codes(email);

  CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id      INTEGER NOT NULL,
    lesson_id    TEXT    NOT NULL,
    status       TEXT    NOT NULL CHECK (status IN ('locked','in_progress','done')),
    completed_at DATETIME,
    PRIMARY KEY (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);

  CREATE TABLE IF NOT EXISTS lesson_attempts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL,
    lesson_id    TEXT    NOT NULL,
    problem_id   TEXT    NOT NULL,
    code         TEXT    NOT NULL,
    verdict      TEXT    NOT NULL,
    ungraded     INTEGER NOT NULL DEFAULT 0,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_lesson_attempts_user_lesson
    ON lesson_attempts(user_id, lesson_id);
`);

// --- Lightweight column migrations -----------------------------------------
// SQLite has no IF NOT EXISTS for ADD COLUMN, so we try each one and swallow
// the "duplicate column name" failure. This keeps existing app.db files in
// sync with the schema above without dropping data.
const lectureColumnMigrations = [
  "ALTER TABLE lectures ADD COLUMN thumbnail TEXT",
  "ALTER TABLE lectures ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE lectures ADD COLUMN category TEXT NOT NULL DEFAULT 'other'",
];
for (const sql of lectureColumnMigrations) {
  try {
    db.exec(sql);
  } catch (err) {
    // Ignore "duplicate column name: …" — that means the migration already ran.
    if (!/duplicate column name/i.test(err?.message ?? "")) {
      throw err;
    }
  }
}
// Fail loudly if a migration silently no-op'd — otherwise the issue surfaces
// later as an opaque "no such column" during a prepared-statement compile.
const lectureCols = new Set(
  db.prepare("PRAGMA table_info(lectures)").all().map((c) => c.name)
);
const expectedLectureCols = ["thumbnail", "view_count", "category"];
const missing = expectedLectureCols.filter((c) => !lectureCols.has(c));
if (missing.length) {
  throw new Error(
    `lectures table is missing expected columns: ${missing.join(", ")}. ` +
      `Migrations may have failed silently — inspect backend/data/app.db.`
  );
}

// Now that we know `category` exists, create its index.
db.exec("CREATE INDEX IF NOT EXISTS idx_lectures_category ON lectures(category)");

// Same idempotent ADD COLUMN dance for the users table. Adds admin/suspension
// flags to databases that pre-date the admin feature.
const userColumnMigrations = [
  "ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE users ADD COLUMN is_suspended INTEGER NOT NULL DEFAULT 0",
];
for (const sql of userColumnMigrations) {
  try {
    db.exec(sql);
  } catch (err) {
    if (!/duplicate column name/i.test(err?.message ?? "")) {
      throw err;
    }
  }
}
const userCols = new Set(
  db.prepare("PRAGMA table_info(users)").all().map((c) => c.name)
);
const expectedUserCols = ["is_admin", "is_suspended"];
const missingUserCols = expectedUserCols.filter((c) => !userCols.has(c));
if (missingUserCols.length) {
  throw new Error(
    `users table is missing expected columns: ${missingUserCols.join(", ")}. ` +
      `Migrations may have failed silently — inspect backend/data/app.db.`
  );
}

// --- Prepared statements ----------------------------------------------------
export const stmts = {
  // users
  insertUser: db.prepare(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
  ),
  findUserByUsername: db.prepare("SELECT * FROM users WHERE username = ?"),
  findUserByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
  findUserByEmailAndUsername: db.prepare(
    "SELECT * FROM users WHERE email = ? AND username = ?"
  ),
  findUserById: db.prepare(
    "SELECT id, username, email, is_admin, is_suspended, created_at FROM users WHERE id = ?"
  ),
  updatePasswordHash: db.prepare(
    "UPDATE users SET password_hash = ? WHERE id = ?"
  ),

  // sessions
  insertSession: db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)"
  ),
  findSession: db.prepare(
    "SELECT s.token AS token, s.user_id AS user_id, s.expires_at AS expires_at, " +
      "u.username AS username, u.email AS email, " +
      "u.is_admin AS is_admin, u.is_suspended AS is_suspended " +
      "FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?"
  ),
  deleteSessionsForUser: db.prepare("DELETE FROM sessions WHERE user_id = ?"),
  deleteSession: db.prepare("DELETE FROM sessions WHERE token = ?"),
  deleteExpiredSessions: db.prepare(
    "DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP"
  ),

  // test progress
  upsertProgress: db.prepare(
    `INSERT INTO test_progress (user_id, current, total, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
       current = excluded.current,
       total = excluded.total,
       updated_at = CURRENT_TIMESTAMP`
  ),
  getProgress: db.prepare(
    "SELECT current, total, updated_at FROM test_progress WHERE user_id = ?"
  ),

  // test answers
  insertAnswer: db.prepare(
    "INSERT INTO test_answers (user_id, problem_id, code, verdict) VALUES (?, ?, ?, ?)"
  ),
  listAnswers: db.prepare(
    "SELECT id, problem_id, code, verdict, submitted_at FROM test_answers " +
      "WHERE user_id = ? ORDER BY submitted_at DESC"
  ),

  // email samples
  insertEmailSample: db.prepare(
    "INSERT INTO email_samples (email, user_id) VALUES (?, ?)"
  ),

  // avatars
  getAvatar: db.prepare(
    "SELECT config, updated_at FROM avatars WHERE user_id = ?"
  ),
  upsertAvatar: db.prepare(
    `INSERT INTO avatars (user_id, config, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
       config = excluded.config,
       updated_at = CURRENT_TIMESTAMP`
  ),

  // surveys (one row per user; latest write wins via upsert)
  getSurvey: db.prepare(
    "SELECT interest, level, time, updated_at FROM surveys WHERE user_id = ?"
  ),
  upsertSurvey: db.prepare(
    `INSERT INTO surveys (user_id, interest, level, time, updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
       interest = excluded.interest,
       level = excluded.level,
       time = excluded.time,
       updated_at = CURRENT_TIMESTAMP`
  ),

  // lectures
  insertLecture: db.prepare(
    `INSERT INTO lectures
       (user_id, title, description, source_type, source, thumbnail, category)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ),
  // Public listings exclude lectures uploaded by suspended users. Admin views
  // use listAllLectures below to see everything (including suspended).
  listLectures: db.prepare(
    `SELECT l.id, l.title, l.description, l.source_type, l.source,
            l.thumbnail, l.view_count, l.category,
            l.created_at, l.user_id, u.username AS uploader
       FROM lectures l
       JOIN users u ON u.id = l.user_id
       WHERE u.is_suspended = 0
       ORDER BY l.created_at DESC`
  ),
  listLecturesByCategory: db.prepare(
    `SELECT l.id, l.title, l.description, l.source_type, l.source,
            l.thumbnail, l.view_count, l.category,
            l.created_at, l.user_id, u.username AS uploader
       FROM lectures l
       JOIN users u ON u.id = l.user_id
       WHERE l.category = ? AND u.is_suspended = 0
       ORDER BY l.created_at DESC`
  ),
  findLecture: db.prepare(
    `SELECT l.id, l.title, l.description, l.source_type, l.source,
            l.thumbnail, l.view_count, l.category,
            l.created_at, l.user_id, u.username AS uploader,
            u.is_suspended AS uploader_suspended
       FROM lectures l
       JOIN users u ON u.id = l.user_id
       WHERE l.id = ?`
  ),
  deleteLecture: db.prepare("DELETE FROM lectures WHERE id = ? AND user_id = ?"),
  incrementLectureView: db.prepare(
    "UPDATE lectures SET view_count = view_count + 1 WHERE id = ?"
  ),
  getLectureViewCount: db.prepare(
    "SELECT view_count FROM lectures WHERE id = ?"
  ),

  // admin: user management
  listAllUsers: db.prepare(
    `SELECT u.id, u.username, u.email, u.is_admin, u.is_suspended, u.created_at,
            (SELECT COUNT(*) FROM lectures l WHERE l.user_id = u.id) AS lecture_count
       FROM users u
       ORDER BY u.created_at DESC`
  ),
  setUserSuspended: db.prepare(
    "UPDATE users SET is_suspended = ? WHERE id = ?"
  ),

  // admin: lecture management (includes lectures from suspended users)
  listAllLectures: db.prepare(
    `SELECT l.id, l.title, l.description, l.source_type, l.source,
            l.thumbnail, l.view_count, l.category,
            l.created_at, l.user_id,
            u.username AS uploader, u.is_suspended AS uploader_suspended
       FROM lectures l
       JOIN users u ON u.id = l.user_id
       ORDER BY l.created_at DESC`
  ),
  adminDeleteLecture: db.prepare("DELETE FROM lectures WHERE id = ?"),

  // email auth codes
  insertEmailAuthCode: db.prepare(
    "INSERT INTO email_auth_codes (email, code, expires_at) VALUES (?, ?, ?)"
  ),
  findEmailAuthCode: db.prepare(
    "SELECT * FROM email_auth_codes WHERE email = ? AND code = ? AND expires_at > CURRENT_TIMESTAMP"
  ),
  deleteEmailAuthCode: db.prepare(
    "DELETE FROM email_auth_codes WHERE email = ? AND code = ?"
  ),
  deleteEmailAuthCodesByEmail: db.prepare(
    "DELETE FROM email_auth_codes WHERE email = ?"
  ),
  deleteExpiredEmailAuthCodes: db.prepare(
    "DELETE FROM email_auth_codes WHERE expires_at <= CURRENT_TIMESTAMP"
  ),

  // learn: lesson progress
  getLessonProgress: db.prepare(
    "SELECT lesson_id, status, completed_at FROM lesson_progress WHERE user_id = ?"
  ),
  getLessonStatus: db.prepare(
    "SELECT status, completed_at FROM lesson_progress WHERE user_id = ? AND lesson_id = ?"
  ),
  upsertLessonProgress: db.prepare(
    `INSERT INTO lesson_progress (user_id, lesson_id, status, completed_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET
       status = excluded.status,
       completed_at = CASE
         WHEN excluded.status = 'done' THEN COALESCE(lesson_progress.completed_at, CURRENT_TIMESTAMP)
         ELSE lesson_progress.completed_at
       END`
  ),

  // learn: lesson attempts
  insertLessonAttempt: db.prepare(
    `INSERT INTO lesson_attempts (user_id, lesson_id, problem_id, code, verdict, ungraded)
     VALUES (?, ?, ?, ?, ?, ?)`
  ),
  // Latest non-ungraded verdict per problem within a lesson, used to detect
  // when the lesson should flip to 'done'. Mock attempts (ungraded=1) are
  // ignored so they never grant credit.
  listLatestGradedVerdicts: db.prepare(
    `SELECT problem_id, verdict
       FROM lesson_attempts
      WHERE user_id = ? AND lesson_id = ? AND ungraded = 0
      GROUP BY problem_id
      HAVING submitted_at = MAX(submitted_at)`
  ),
};

// Light periodic cleanup: nuke expired sessions on startup.
stmts.deleteExpiredSessions.run();

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    is_admin: row.is_admin ? 1 : 0,
    created_at: row.created_at ?? null,
  };
}
