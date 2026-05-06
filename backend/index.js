import express from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { DatabaseSync } from "node:sqlite";
import cors from "cors";

const db = new DatabaseSync("users.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

const insertUser = db.prepare(
  "INSERT INTO users (username, password_hash) VALUES (?, ?)"
);
const findByUsername = db.prepare("SELECT * FROM users WHERE username = ?");
const findById = db.prepare(
  "SELECT id, username, created_at FROM users WHERE id = ?"
);

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "password must be at least 6 chars" });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const info = insertUser.run(username, hash);
    req.session.userId = info.lastInsertRowid;
    res.status(201).json({ id: info.lastInsertRowid, username });
  } catch (e) {
    if (String(e.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "username already exists" });
    }
    throw e;
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  const user = findByUsername.get(username);
  if (!user) return res.status(401).json({ error: "invalid credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });
  req.session.userId = user.id;
  res.json({ id: user.id, username: user.username });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "not logged in" });
  }
  const user = findById.get(req.session.userId);
  if (!user) return res.status(401).json({ error: "not logged in" });
  res.json(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth server running at http://localhost:${PORT}`);
});
