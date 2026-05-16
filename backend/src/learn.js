// /api/learn — lesson catalog read + grading + progress.
//
// Server-side enforcement:
//   - submit validates problem ∈ lesson and lesson is unlocked (by prereq)
//   - mock grading verdicts are stored ungraded=1 and never grant `done`
//   - lesson_progress flips to 'done' only when all problems have a graded
//     "correct" verdict
//
// Judge0 wiring is intentionally minimal: when the JUDGE0_KEY env var is
// missing the server uses mockGrade and tags the attempt as ungraded.

import express from "express";
import { stmts, db } from "./db.js";
import { requireAuth } from "./auth.js";
import {
  CATALOG,
  getLesson,
  validateMembership,
  isUnlocked,
  problemIds,
  nextLessonId,
  trailTotals,
  mockGrade,
} from "./lesson-catalog.js";

export const learnRouter = express.Router();

// ---------------------------------------------------------------------------
// GET /api/learn/progress — per-trail completion counts.
// 401 when unauthenticated so the UI can distinguish from authenticated-zero.
// ---------------------------------------------------------------------------
learnRouter.get("/progress", requireAuth, (req, res) => {
  const userId = req.user.id;
  const totals = trailTotals(); // [{ trail, total }]
  const rows = stmts.getLessonProgress.all(userId);
  const doneByLesson = new Map(
    rows.filter((r) => r.status === "done").map((r) => [r.lesson_id, r.completed_at]),
  );
  // Tally done per trail by intersecting with catalog.
  const doneByTrail = new Map();
  let lastUpdatedAt = null;
  for (const [lessonId, completedAt] of doneByLesson) {
    const lesson = getLesson(lessonId);
    if (!lesson) continue; // stale row from a removed lesson
    doneByTrail.set(lesson.trail, (doneByTrail.get(lesson.trail) ?? 0) + 1);
    if (!lastUpdatedAt || completedAt > lastUpdatedAt) lastUpdatedAt = completedAt;
  }
  res.json({
    trails: totals.map(({ trail, total }) => ({
      trail,
      total,
      done: doneByTrail.get(trail) ?? 0,
    })),
    lastUpdatedAt,
  });
});

// ---------------------------------------------------------------------------
// GET /api/learn/lesson/:id — lesson metadata + lock state + next lesson.
// Public-ish: returns 200 with locked=true when the user (or anon) can't open
// it; the actual problem expected outputs are NEVER returned here.
// ---------------------------------------------------------------------------
learnRouter.get("/lesson/:id", (req, res) => {
  const lessonId = req.params.id;
  const lesson = getLesson(lessonId);
  if (!lesson) return res.status(404).json({ error: "unknown lesson" });

  let unlocked = false;
  let status = "locked";
  if (req.user) {
    unlocked = isUnlocked(lessonId, (id) => {
      const row = stmts.getLessonStatus.get(req.user.id, id);
      return row?.status ?? null;
    });
    const myRow = stmts.getLessonStatus.get(req.user.id, lessonId);
    if (myRow) status = myRow.status;
    else if (unlocked) status = "in_progress";
  } else {
    // Anonymous: only first lessons (no prereq) are "browsable"; never done.
    unlocked = !lesson.prereq;
  }

  res.json({
    id: lessonId,
    trail: lesson.trail,
    ch: lesson.ch,
    no: lesson.no,
    unlocked,
    status,
    problems: problemIds(lessonId),
    nextLessonId: nextLessonId(lessonId),
  });
});

// ---------------------------------------------------------------------------
// POST /api/learn/submit — grade a problem submission.
//
//   body: { lessonId, problemId, code }
//   200: { verdict, ungraded, lessonStatus, nextLessonId }
//   401: not logged in (requireAuth)
//   422: problemId not in lessonId
//   423: lesson is locked
// ---------------------------------------------------------------------------
learnRouter.post("/submit", requireAuth, (req, res) => {
  const userId = req.user.id;
  const { lessonId, problemId, code } = req.body || {};

  if (typeof lessonId !== "string" || typeof problemId !== "string" || typeof code !== "string") {
    return res.status(400).json({ error: "lessonId, problemId, code required" });
  }
  if (code.length > 100_000) {
    return res.status(413).json({ error: "code too large" });
  }

  if (!validateMembership(lessonId, problemId)) {
    return res.status(422).json({ error: "problemId not in lessonId" });
  }

  const unlocked = isUnlocked(lessonId, (id) => {
    const row = stmts.getLessonStatus.get(userId, id);
    return row?.status ?? null;
  });
  if (!unlocked) return res.status(423).json({ error: "lesson is locked" });

  const lesson = getLesson(lessonId);
  const problem = lesson.problems[problemId];

  // Grade. Until a real server-side judge0 client lands, every submission is
  // graded by `mockGrade` and stored ungraded=1 — never credit-bearing. The
  // previous version flipped credit on when JUDGE0_KEY+HOST env vars were set
  // even though no real call was wired, letting users complete lessons by
  // matching string literals (Codex review P1, 2026-05-16).
  const verdict = mockGrade(code, problem.expected);
  const ungraded = 1;

  // Persist attempt + (optionally) flip lesson_progress in one transaction.
  const apply = db.transaction(() => {
    stmts.insertLessonAttempt.run(userId, lessonId, problemId, code, verdict, ungraded);

    let lessonStatus;
    if (ungraded === 0 && verdict === "correct") {
      // Did this submission complete the lesson? Re-read latest graded
      // verdicts and check that every problemId has a "correct" one.
      const latest = stmts.listLatestGradedVerdicts.all(userId, lessonId);
      const passedSet = new Set(
        latest.filter((r) => r.verdict === "correct").map((r) => r.problem_id),
      );
      const allRequired = problemIds(lessonId);
      const allPassed = allRequired.every((pid) => passedSet.has(pid));
      lessonStatus = allPassed ? "done" : "in_progress";
      stmts.upsertLessonProgress.run(userId, lessonId, lessonStatus);
    } else {
      // Mock or wrong → at most leave it as in_progress; never demote a done.
      const cur = stmts.getLessonStatus.get(userId, lessonId);
      if (!cur || cur.status === "locked") {
        stmts.upsertLessonProgress.run(userId, lessonId, "in_progress");
        lessonStatus = "in_progress";
      } else {
        lessonStatus = cur.status;
      }
    }
    return lessonStatus;
  });

  let lessonStatus;
  try {
    lessonStatus = apply();
  } catch (err) {
    console.error("[learn/submit] transaction failed", err);
    return res.status(500).json({ error: "submit failed" });
  }

  res.json({
    verdict,
    ungraded: Boolean(ungraded),
    lessonStatus,
    nextLessonId: lessonStatus === "done" ? nextLessonId(lessonId) : null,
  });
});

// Expose CATALOG as a sanity diagnostic (no expected outputs — just ids).
learnRouter.get("/_debug/catalog-ids", (_req, res) => {
  res.json({ count: Object.keys(CATALOG).length, ids: Object.keys(CATALOG) });
});
