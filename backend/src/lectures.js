// Lecture upload + listing routes.
// Two source types are supported:
//   - "url"  → external link (YouTube, Vimeo, raw video URL). Just stored.
//   - "file" → multipart upload. Stored on disk under backend/uploads/lectures
//             and served back via the /uploads/lectures static mount.
//
// Listing is public (anyone can browse). Uploading requires an authenticated
// session — we reuse the existing cookie-session via requireAuth.

import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { stmts } from "./db.js";
import { requireAuth } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Disk storage layout: backend/uploads/lectures/<random>.<ext>
export const LECTURES_DIR = path.resolve(
  __dirname,
  "..",
  "uploads",
  "lectures"
);
if (!fs.existsSync(LECTURES_DIR)) {
  fs.mkdirSync(LECTURES_DIR, { recursive: true });
}

const ALLOWED_VIDEO_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-matroska",
]);

const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB
const MAX_TITLE_LEN = 120;
const MAX_DESC_LEN = 2000;

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, LECTURES_DIR);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname || "").slice(0, 8) || ".mp4";
    const safeExt = /^[.\w]+$/.test(ext) ? ext : ".mp4";
    cb(null, `${crypto.randomBytes(16).toString("hex")}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_BYTES },
  fileFilter(_req, file, cb) {
    if (!ALLOWED_VIDEO_MIME.has(file.mimetype)) {
      return cb(
        Object.assign(new Error("지원하지 않는 동영상 형식입니다."), {
          status: 400,
        })
      );
    }
    cb(null, true);
  },
});

// Tolerate the fact that multer streams the file BEFORE we authenticate —
// wrap the upload middleware so an unauthenticated request still cleans up the
// temp file rather than leaving it on disk.
function uploadVideoOptional(req, res, next) {
  // Only run multer when the request looks like multipart. URL-only submissions
  // come in as application/json and skip the multer pipeline entirely.
  const ct = String(req.headers["content-type"] || "");
  if (!ct.startsWith("multipart/")) return next();
  upload.single("video")(req, res, (err) => {
    if (err) return next(err);
    if (!req.user && req.file) {
      // Auth check happens after multer because requireAuth runs after this
      // middleware in the chain. If the user wasn't authenticated, drop the
      // file rather than orphan it.
      fs.unlink(req.file.path, () => {});
    }
    next();
  });
}

function publicLecture(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    sourceType: row.source_type,
    // For files we expose a public URL the frontend can <video src=...> against.
    source:
      row.source_type === "file"
        ? `/uploads/lectures/${row.source}`
        : row.source,
    createdAt: row.created_at,
    uploader: row.uploader,
    uploaderId: row.user_id,
  };
}

function isHttpUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export const lecturesRouter = express.Router();

// GET /api/lectures — public listing. Returns newest first.
lecturesRouter.get("/", (_req, res) => {
  const rows = stmts.listLectures.all();
  res.json({ lectures: rows.map(publicLecture) });
});

// GET /api/lectures/:id — single lecture (for the player view).
lecturesRouter.get("/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  const row = stmts.findLecture.get(id);
  if (!row) return res.status(404).json({ error: "not found" });
  res.json({ lecture: publicLecture(row) });
});

// POST /api/lectures — auth required. Two body shapes:
//   - multipart/form-data: title, description, sourceType=file, video=<file>
//   - application/json:    { title, description, sourceType: "url", url }
lecturesRouter.post(
  "/",
  uploadVideoOptional,
  requireAuth,
  (req, res, next) => {
    try {
      const title = String(req.body?.title ?? "").trim();
      const description = String(req.body?.description ?? "").trim();
      const sourceType = String(req.body?.sourceType ?? "").trim();

      if (!title) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: "title is required" });
      }
      if (title.length > MAX_TITLE_LEN) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: "title too long" });
      }
      if (description.length > MAX_DESC_LEN) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: "description too long" });
      }

      let sourceValue;
      if (sourceType === "file") {
        if (!req.file) {
          return res
            .status(400)
            .json({ error: "video file is required for sourceType=file" });
        }
        sourceValue = path.basename(req.file.path);
      } else if (sourceType === "url") {
        const url = String(req.body?.url ?? "").trim();
        if (!isHttpUrl(url)) {
          return res
            .status(400)
            .json({ error: "valid http(s) url is required for sourceType=url" });
        }
        sourceValue = url;
      } else {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: "sourceType must be url or file" });
      }

      const result = stmts.insertLecture.run(
        req.user.id,
        title,
        description,
        sourceType,
        sourceValue
      );
      const row = stmts.findLecture.get(Number(result.lastInsertRowid));
      res.json({ lecture: publicLecture(row) });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/lectures/:id — only the original uploader may remove their lecture.
lecturesRouter.delete("/:id", requireAuth, (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  const row = stmts.findLecture.get(id);
  if (!row) return res.status(404).json({ error: "not found" });
  if (row.user_id !== req.user.id) {
    return res.status(403).json({ error: "forbidden" });
  }
  if (row.source_type === "file") {
    fs.unlink(path.join(LECTURES_DIR, row.source), () => {});
  }
  stmts.deleteLecture.run(id, req.user.id);
  res.json({ ok: true });
});
