// Admin-only routes for managing users (suspend/unsuspend) and lectures
// (delete any). Mount under /api/admin; every endpoint is guarded by
// requireAdmin so we don't have to re-check inside each handler.

import express from "express";
import path from "node:path";
import fs from "node:fs";
import { stmts } from "./db.js";
import { requireAdmin } from "./auth.js";
import { LECTURES_DIR, THUMBNAILS_DIR } from "./lectures.js";

export const adminRouter = express.Router();

function publicAdminUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    is_admin: row.is_admin ? 1 : 0,
    is_suspended: row.is_suspended ? 1 : 0,
    created_at: row.created_at ?? null,
    lecture_count: Number(row.lecture_count ?? 0),
  };
}

function publicAdminLecture(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    sourceType: row.source_type,
    source:
      row.source_type === "file"
        ? `/uploads/lectures/${row.source}`
        : row.source,
    thumbnail:
      row.thumbnail && /^https?:\/\//i.test(row.thumbnail)
        ? row.thumbnail
        : row.thumbnail
        ? `/uploads/thumbnails/${row.thumbnail}`
        : null,
    viewCount: Number(row.view_count ?? 0),
    category: row.category ?? "other",
    createdAt: row.created_at,
    uploader: row.uploader,
    uploaderId: row.user_id,
    uploaderSuspended: row.uploader_suspended ? 1 : 0,
  };
}

// GET /api/admin/users — list every user with their lecture count and flags.
adminRouter.get("/users", requireAdmin, (_req, res) => {
  const rows = stmts.listAllUsers.all();
  res.json({ users: rows.map(publicAdminUser) });
});

// POST /api/admin/users/:id/suspend — set is_suspended=1 and drop the user's
// active sessions so they're kicked out immediately.
adminRouter.post("/users/:id/suspend", requireAdmin, (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  if (id === req.user.id) {
    return res.status(400).json({ error: "본인 계정은 정지할 수 없습니다." });
  }
  const target = stmts.findUserById.get(id);
  if (!target) return res.status(404).json({ error: "user not found" });
  stmts.setUserSuspended.run(1, id);
  stmts.deleteSessionsForUser.run(id);
  res.json({ ok: true });
});

// POST /api/admin/users/:id/unsuspend — clear is_suspended.
adminRouter.post("/users/:id/unsuspend", requireAdmin, (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  const target = stmts.findUserById.get(id);
  if (!target) return res.status(404).json({ error: "user not found" });
  stmts.setUserSuspended.run(0, id);
  res.json({ ok: true });
});

// GET /api/admin/lectures — every lecture, including those from suspended
// uploaders (the public /api/lectures filters those out).
adminRouter.get("/lectures", requireAdmin, (_req, res) => {
  const rows = stmts.listAllLectures.all();
  res.json({ lectures: rows.map(publicAdminLecture) });
});

// DELETE /api/admin/lectures/:id — admin can remove anyone's lecture.
// Also cleans up the underlying video and thumbnail files on disk so we
// don't accumulate orphan uploads.
adminRouter.delete("/lectures/:id", requireAdmin, (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  const row = stmts.findLecture.get(id);
  if (!row) return res.status(404).json({ error: "not found" });
  if (row.source_type === "file") {
    fs.unlink(path.join(LECTURES_DIR, row.source), () => {});
  }
  if (row.thumbnail && !/^https?:\/\//i.test(row.thumbnail)) {
    fs.unlink(path.join(THUMBNAILS_DIR, row.thumbnail), () => {});
  }
  stmts.adminDeleteLecture.run(id);
  res.json({ ok: true });
});
