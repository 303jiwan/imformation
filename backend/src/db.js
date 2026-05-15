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
`);

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
    "SELECT id, username, email, created_at FROM users WHERE id = ?"
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
      "u.username AS username, u.email AS email " +
      "FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?"
  ),
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
};

// Light periodic cleanup: nuke expired sessions on startup.
stmts.deleteExpiredSessions.run();

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    created_at: row.created_at ?? null,
  };
}
