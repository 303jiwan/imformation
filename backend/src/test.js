// Coding-test progress + answer routes.
// All authenticated endpoints require a session (`requireAuth`).
// `/email-sample` is intentionally open — non-members may submit their email
// from the test-login page.

import express from "express";
import { stmts } from "./db.js";
import { requireAuth } from "./auth.js";

export const testRouter = express.Router();

// POST /api/test/progress  { current, total }
testRouter.post("/progress", requireAuth, (req, res) => {
  const { current, total } = req.body || {};
  const c = Number(current);
  const t = Number(total);
  if (!Number.isFinite(c) || !Number.isFinite(t) || c < 0 || t < 0) {
    return res.status(400).json({ error: "current and total must be non-negative numbers" });
  }
  stmts.upsertProgress.run(req.user.id, Math.floor(c), Math.floor(t));
  res.json({ ok: true, current: Math.floor(c), total: Math.floor(t) });
});

// POST /api/test/answer  { problemId, code, verdict }
testRouter.post("/answer", requireAuth, (req, res) => {
  const { problemId, code, verdict } = req.body || {};
  if (!problemId || typeof problemId !== "string") {
    return res.status(400).json({ error: "problemId is required" });
  }
  if (typeof code !== "string") {
    return res.status(400).json({ error: "code must be a string" });
  }
  const v = verdict == null ? null : String(verdict);
  const info = stmts.insertAnswer.run(req.user.id, problemId, code, v);
  res.json({ ok: true, id: Number(info.lastInsertRowid) });
});

// GET /api/test/state
testRouter.get("/state", requireAuth, (req, res) => {
  const progress = stmts.getProgress.get(req.user.id) || {
    current: 0,
    total: 0,
    updated_at: null,
  };
  const answers = stmts.listAnswers.all(req.user.id);
  res.json({ progress, answers });
});

// POST /api/test/email-sample  { email }   — public (logged-in optional)
testRouter.post("/email-sample", (req, res) => {
  const { email } = req.body || {};
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "valid email is required" });
  }
  const userId = req.user ? req.user.id : null;
  stmts.insertEmailSample.run(email.trim().toLowerCase(), userId);
  res.json({ ok: true });
});
