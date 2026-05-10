// Avatar persistence routes.
// One row per user; config is an opaque JSON blob (<= 16KB stringified).
// Auth is required for both GET and POST.

import express from "express";
import { stmts } from "./db.js";
import { requireAuth } from "./auth.js";

export const avatarRouter = express.Router();

const MAX_BYTES = 16 * 1024; // 16 KB

// GET /api/avatar
avatarRouter.get("/", requireAuth, (req, res) => {
  const row = stmts.getAvatar.get(req.user.id);
  if (!row) return res.json({ avatar: null });
  try {
    const avatar = JSON.parse(row.config);
    res.json({ avatar });
  } catch {
    // Corrupt row — don't 500; treat as no saved avatar.
    res.json({ avatar: null });
  }
});

// POST /api/avatar  { avatar: {...} }
avatarRouter.post("/", requireAuth, (req, res) => {
  const { avatar } = req.body || {};
  if (
    avatar == null ||
    typeof avatar !== "object" ||
    Array.isArray(avatar)
  ) {
    return res.status(400).json({ error: "avatar must be an object" });
  }
  const json = JSON.stringify(avatar);
  if (json.length > MAX_BYTES) {
    return res.status(400).json({ error: "avatar too large" });
  }
  stmts.upsertAvatar.run(req.user.id, json);
  res.json({ ok: true, avatar });
});
