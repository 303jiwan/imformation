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
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
const existingColumns = db.prepare("PRAGMA table_info(users)").all().map((row) => row.name);
if (!existingColumns.includes("email")) {
  db.exec("ALTER TABLE users ADD COLUMN email TEXT");
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)");
}

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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
  "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
);
const findByUsername = db.prepare("SELECT * FROM users WHERE username = ?");
const findByEmail = db.prepare("SELECT * FROM users WHERE email = ?");
const findById = db.prepare(
  "SELECT id, username, email, created_at FROM users WHERE id = ?"
);

app.post("/api/signup", async (req, res) => {
  const { username, password, email } = req.body || {};
  if (!username || !password || !email) {
    return res.status(400).json({ error: "username, email, password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "password must be at least 6 chars" });
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  if (!normalizedEmail.endsWith("@gmail.com")) {
    return res.status(400).json({ error: "Gmail 주소를 입력해주세요" });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const info = insertUser.run(username, normalizedEmail, hash);
    res.status(201).json({ id: info.lastInsertRowid, username });
  } catch (e) {
    const message = String(e.message);
    if (message.includes("UNIQUE")) {
      if (message.includes("email")) {
        return res.status(409).json({ error: "이미 등록된 이메일입니다" });
      }
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

app.post("/api/find-username", (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = findByEmail.get(normalizedEmail);
  if (!user) {
    return res.status(404).json({ error: "등록된 이메일이 없습니다" });
  }
  res.json({ message: `아이디 찾기 안내를 ${normalizedEmail}로 보냈습니다.` });
});

app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = findByEmail.get(normalizedEmail);
  if (!user) {
    return res.status(404).json({ error: "등록된 이메일이 없습니다" });
  }
  res.json({ message: `비밀번호 재설정 안내를 ${normalizedEmail}로 보냈습니다.` });
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

app.get("/", (req, res) => {
  res.json({ message: "Auth API running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth server running at http://localhost:${PORT}`);
});
