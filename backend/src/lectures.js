// Lecture upload + listing routes.
// Two source types are supported:
//   - "url"  → external link (YouTube, Vimeo, raw video URL). Just stored.
//   - "file" → multipart upload. Stored on disk under backend/uploads/lectures
//             and served back via the /uploads/lectures static mount.
//
// Each lecture also carries:
//   - thumbnail  : optional cover image. Auto-derived for YouTube URLs, or
//                  uploaded as a multipart `thumbnail` part for file lectures.
//   - view_count : integer, bumped via POST /api/lectures/:id/view (public).
//   - category   : one of CATEGORIES (defaults to 'other').
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

// Thumbnail uploads land under backend/uploads/thumbnails/<random>.<ext>.
export const THUMBNAILS_DIR = path.resolve(
  __dirname,
  "..",
  "uploads",
  "thumbnails"
);
if (!fs.existsSync(THUMBNAILS_DIR)) {
  fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

const ALLOWED_VIDEO_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-matroska",
]);

const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;   // 5 MB
const MAX_TITLE_LEN = 120;
const MAX_DESC_LEN = 2000;

// Allowed lecture categories. Stays in sync with the frontend tab list.
export const CATEGORIES = new Set([
  "algorithm",
  "data-structure",
  "programming-basic",
  "other",
]);

function pickCategory(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return "other";
  return CATEGORIES.has(value) ? value : null;
}

// Multer destinations are decided per-field so we can route video and image
// parts to different folders inside one multipart request.
const storage = multer.diskStorage({
  destination(_req, file, cb) {
    if (file.fieldname === "thumbnail") return cb(null, THUMBNAILS_DIR);
    cb(null, LECTURES_DIR);
  },
  filename(_req, file, cb) {
    const fallbackExt = file.fieldname === "thumbnail" ? ".jpg" : ".mp4";
    const ext = path.extname(file.originalname || "").slice(0, 8) || fallbackExt;
    const safeExt = /^[.\w]+$/.test(ext) ? ext : fallbackExt;
    cb(null, `${crypto.randomBytes(16).toString("hex")}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_BYTES },
  fileFilter(_req, file, cb) {
    if (file.fieldname === "thumbnail") {
      if (!ALLOWED_IMAGE_MIME.has(file.mimetype)) {
        return cb(
          Object.assign(new Error("지원하지 않는 이미지 형식입니다."), {
            status: 400,
          })
        );
      }
      // Enforce the smaller image size cap manually because multer's `limits`
      // is global to the request and we don't want to lower it for videos.
      if (typeof file.size === "number" && file.size > MAX_IMAGE_BYTES) {
        return cb(
          Object.assign(new Error("썸네일 이미지는 5MB 이하만 가능합니다."), {
            status: 400,
          })
        );
      }
      return cb(null, true);
    }
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

const uploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

function takeFirst(files, name) {
  if (!files) return null;
  const arr = files[name];
  return Array.isArray(arr) && arr.length ? arr[0] : null;
}

function unlinkSafe(file) {
  if (file?.path) fs.unlink(file.path, () => {});
}

// Tolerate the fact that multer streams the file BEFORE we authenticate —
// wrap the upload middleware so an unauthenticated request still cleans up
// any temp files rather than leaving them on disk.
function uploadVideoOptional(req, res, next) {
  // Only run multer when the request looks like multipart. URL-only submissions
  // come in as application/json and skip the multer pipeline entirely.
  const ct = String(req.headers["content-type"] || "");
  if (!ct.startsWith("multipart/")) return next();
  uploadFields(req, res, (err) => {
    if (err) return next(err);
    if (!req.user) {
      // Auth check happens after multer because requireAuth runs after this
      // middleware in the chain. If the user wasn't authenticated, drop the
      // files rather than orphan them.
      unlinkSafe(takeFirst(req.files, "video"));
      unlinkSafe(takeFirst(req.files, "thumbnail"));
    }
    // Enforce per-image size cap server-side too: multer's fileFilter sees
    // file.size as undefined while streaming, so re-check after the file is
    // fully written.
    const thumb = takeFirst(req.files, "thumbnail");
    if (thumb && typeof thumb.size === "number" && thumb.size > MAX_IMAGE_BYTES) {
      unlinkSafe(thumb);
      if (req.files) delete req.files.thumbnail;
      return next(
        Object.assign(new Error("썸네일 이미지는 5MB 이하만 가능합니다."), {
          status: 400,
        })
      );
    }
    next();
  });
}

// Resolve a YouTube video id from any of the common URL shapes we accept.
// Returns `null` if it doesn't look like a YouTube link.
function youtubeVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return /^[\w-]{6,}$/.test(id) ? id : null;
    }
    if (u.hostname === "www.youtube.com" || u.hostname === "youtube.com" ||
        u.hostname === "m.youtube.com" || u.hostname === "music.youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id && /^[\w-]{6,}$/.test(id) ? id : null;
      }
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.split("/")[2];
        return id && /^[\w-]{6,}$/.test(id) ? id : null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id && /^[\w-]{6,}$/.test(id) ? id : null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function deriveYoutubeThumbnail(url) {
  const id = youtubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

function publicThumbnail(row) {
  const t = row.thumbnail;
  if (!t) return null;
  // Stored values are either a full URL (YouTube) or a bare filename for
  // uploaded thumbnails. Files get exposed via the static mount; URLs flow
  // through unchanged.
  if (/^https?:\/\//i.test(t)) return t;
  return `/uploads/thumbnails/${t}`;
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
    thumbnail: publicThumbnail(row),
    viewCount: Number(row.view_count ?? 0),
    category: row.category ?? "other",
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
// Optional ?category=<algorithm|data-structure|programming-basic|other>.
lecturesRouter.get("/", (req, res) => {
  const rawCategory = req.query?.category;
  let rows;
  if (rawCategory != null && String(rawCategory).trim() !== "") {
    const category = pickCategory(rawCategory);
    if (!category) {
      return res.status(400).json({ error: "invalid category" });
    }
    rows = stmts.listLecturesByCategory.all(category);
  } else {
    rows = stmts.listLectures.all();
  }
  res.json({ lectures: rows.map(publicLecture) });
});

// GET /api/lectures/:id — single lecture (for the player view).
// Suspended uploaders are hidden from non-admins (404) so direct URLs don't
// leak content after a moderation action (Codex review P2, 2026-05-16).
lecturesRouter.get("/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  const row = stmts.findLecture.get(id);
  if (!row) return res.status(404).json({ error: "not found" });
  if (row.uploader_suspended && !req.user?.is_admin) {
    return res.status(404).json({ error: "not found" });
  }
  res.json({ lecture: publicLecture(row) });
});

// POST /api/lectures/:id/view — bump the view counter. Public on purpose:
// we want anonymous viewers to count too. Returns the new total.
// Same suspension gate as GET /:id so view counts can't be inflated on
// hidden lectures.
lecturesRouter.post("/:id/view", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid id" });
  }
  const lec = stmts.findLecture.get(id);
  if (!lec) return res.status(404).json({ error: "not found" });
  if (lec.uploader_suspended && !req.user?.is_admin) {
    return res.status(404).json({ error: "not found" });
  }
  const result = stmts.incrementLectureView.run(id);
  if (!result.changes) {
    return res.status(404).json({ error: "not found" });
  }
  const row = stmts.getLectureViewCount.get(id);
  res.json({ viewCount: Number(row?.view_count ?? 0) });
});

// POST /api/lectures — auth required. Two body shapes:
//   - multipart/form-data: title, description, sourceType=file, video=<file>,
//                          [thumbnail=<file>], [category]
//   - application/json:    { title, description, sourceType: "url", url,
//                            [category] }
lecturesRouter.post(
  "/",
  uploadVideoOptional,
  requireAuth,
  (req, res, next) => {
    const videoFile = takeFirst(req.files, "video");
    const thumbFile = takeFirst(req.files, "thumbnail");
    const cleanupAll = () => {
      unlinkSafe(videoFile);
      unlinkSafe(thumbFile);
    };
    try {
      const title = String(req.body?.title ?? "").trim();
      const description = String(req.body?.description ?? "").trim();
      const sourceType = String(req.body?.sourceType ?? "").trim();
      const category = pickCategory(req.body?.category);

      if (!title) {
        cleanupAll();
        return res.status(400).json({ error: "title is required" });
      }
      if (title.length > MAX_TITLE_LEN) {
        cleanupAll();
        return res.status(400).json({ error: "title too long" });
      }
      if (description.length > MAX_DESC_LEN) {
        cleanupAll();
        return res.status(400).json({ error: "description too long" });
      }
      if (category === null) {
        cleanupAll();
        return res.status(400).json({ error: "invalid category" });
      }

      let sourceValue;
      let thumbnailValue = null;
      if (sourceType === "file") {
        if (!videoFile) {
          unlinkSafe(thumbFile);
          return res
            .status(400)
            .json({ error: "video file is required for sourceType=file" });
        }
        sourceValue = path.basename(videoFile.path);
        if (thumbFile) {
          thumbnailValue = path.basename(thumbFile.path);
        }
      } else if (sourceType === "url") {
        // Reject any video file that snuck in alongside a URL submission.
        unlinkSafe(videoFile);
        const url = String(req.body?.url ?? "").trim();
        if (!isHttpUrl(url)) {
          unlinkSafe(thumbFile);
          return res
            .status(400)
            .json({ error: "valid http(s) url is required for sourceType=url" });
        }
        sourceValue = url;
        // Auto-derive thumbnail for YouTube URLs. Other providers stay null.
        const ytThumb = deriveYoutubeThumbnail(url);
        if (ytThumb) {
          thumbnailValue = ytThumb;
          // Drop any redundant uploaded thumbnail — auto one wins.
          unlinkSafe(thumbFile);
        } else if (thumbFile) {
          thumbnailValue = path.basename(thumbFile.path);
        }
      } else {
        cleanupAll();
        return res.status(400).json({ error: "sourceType must be url or file" });
      }

      const result = stmts.insertLecture.run(
        req.user.id,
        title,
        description,
        sourceType,
        sourceValue,
        thumbnailValue,
        category
      );
      const row = stmts.findLecture.get(Number(result.lastInsertRowid));
      res.json({ lecture: publicLecture(row) });
    } catch (err) {
      cleanupAll();
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
  // Remove uploaded thumbnail if it's a local file (not a YouTube URL).
  if (row.thumbnail && !/^https?:\/\//i.test(row.thumbnail)) {
    fs.unlink(path.join(THUMBNAILS_DIR, row.thumbnail), () => {});
  }
  stmts.deleteLecture.run(id, req.user.id);
  res.json({ ok: true });
});
