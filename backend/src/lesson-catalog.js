// Server-owned lesson catalog — single source of truth for grading & unlock.
//
// Frontend (`frontend/src/lesson-data.js`) holds display-only metadata. This
// file holds the secrets (expected outputs, prerequisites). They MUST stay in
// sync on lesson/problem ids — verified by `backend/scripts/check-catalog-sync.mjs`.
//
// Each lesson is keyed by id (e.g. "t0-ch1-1") and contains:
//   - trail: trail number (0..6)
//   - prereq: id of the lesson that must be `done` first, or null for first
//   - problems: { [problemId]: { kind, expected, input, judge0Lang } }
//
// `kind` is "basic" or "practice"; a lesson is `done` only when ALL problems
// (basic + practice) have a graded (ungraded=0) "correct" verdict.

export const CATALOG = {};

// ===== Trail 0 (Codetree 101 — 프로그래밍 시작) =====
// Trail 0 agent: insert lessons here.
// === END Trail 0 ===

// ===== Trail 1 (Novice Low — 프로그래밍 기초) =====
// Trail 1 agent: insert lessons here.

CATALOG["t1-ch1-1"] = {
  trail: 1, ch: 1, no: 1, prereq: null,
  problems: {
    "t1-ch1-1-b1": { kind: "basic",    expected: "hello\n",        input: "", judge0Lang: "c" },
    "t1-ch1-1-p1": { kind: "practice", expected: "Hello, World!\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t1-ch1-2"] = {
  trail: 1, ch: 1, no: 2, prereq: "t1-ch1-1",
  problems: {
    "t1-ch1-2-b1": { kind: "basic",    expected: "42\n",      input: "", judge0Lang: "c" },
    "t1-ch1-2-p1": { kind: "practice", expected: "7\nA\nhi\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t1-ch1-3"] = {
  trail: 1, ch: 1, no: 3, prereq: "t1-ch1-2",
  problems: {
    "t1-ch1-3-b1": { kind: "basic",    expected: "3 5\n",     input: "", judge0Lang: "c" },
    "t1-ch1-3-p1": { kind: "practice", expected: "1, 2, 3\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t1-ch1-4"] = {
  trail: 1, ch: 1, no: 4, prereq: "t1-ch1-3",
  problems: {
    "t1-ch1-4-b1": { kind: "basic",    expected: "3.14\n",   input: "", judge0Lang: "c" },
    "t1-ch1-4-p1": { kind: "practice", expected: "2.7183\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t1-ch1-5"] = {
  trail: 1, ch: 1, no: 5, prereq: "t1-ch1-4",
  problems: {
    "t1-ch1-5-b1": { kind: "basic",    expected: "5\n",      input: "", judge0Lang: "c" },
    "t1-ch1-5-p1": { kind: "practice", expected: "10\n20\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t1-ch1-6"] = {
  trail: 1, ch: 1, no: 6, prereq: "t1-ch1-5",
  problems: {
    "t1-ch1-6-b1": { kind: "basic",    expected: "7 7\n",   input: "", judge0Lang: "c" },
    "t1-ch1-6-p1": { kind: "practice", expected: "3 3 3\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t1-ch1-7"] = {
  trail: 1, ch: 1, no: 7, prereq: "t1-ch1-6",
  problems: {
    "t1-ch1-7-b1": { kind: "basic",    expected: "7 3\n",  input: "", judge0Lang: "c" },
    "t1-ch1-7-p1": { kind: "practice", expected: "4 10\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t1-ch1-8"] = {
  trail: 1, ch: 1, no: 8, prereq: "t1-ch1-7",
  problems: {
    "t1-ch1-8-b1": { kind: "basic",    expected: "5 5 5\n",   input: "", judge0Lang: "c" },
    "t1-ch1-8-p1": { kind: "practice", expected: "0 0 0 0\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t1-ch2-1"] = {
  trail: 1, ch: 2, no: 1, prereq: "t1-ch1-8",
  problems: {
    "t1-ch2-1-b1": { kind: "basic",    expected: "42\n", input: "42",  judge0Lang: "c" },
    "t1-ch2-1-p1": { kind: "practice", expected: "8\n",  input: "3 5", judge0Lang: "c" },
  },
};

CATALOG["t1-ch2-2"] = {
  trail: 1, ch: 2, no: 2, prereq: "t1-ch2-1",
  problems: {
    "t1-ch2-2-b1": { kind: "basic",    expected: "3.14\n", input: "3.14159",  judge0Lang: "c" },
    "t1-ch2-2-p1": { kind: "practice", expected: "1.50\n", input: "1.0 2.0", judge0Lang: "c" },
  },
};

CATALOG["t1-ch2-3"] = {
  trail: 1, ch: 2, no: 3, prereq: "t1-ch2-2",
  problems: {
    "t1-ch2-3-b1": { kind: "basic",    expected: "3 2 1\n", input: "1 2 3",    judge0Lang: "c" },
    "t1-ch2-3-p1": { kind: "practice", expected: "60\n",    input: "10 20 30", judge0Lang: "c" },
  },
};

CATALOG["t1-ch2-4"] = {
  trail: 1, ch: 2, no: 4, prereq: "t1-ch2-3",
  problems: {
    "t1-ch2-4-b1": { kind: "basic",    expected: "10.00\n", input: "1.0 2.0\n3.0 4.0", judge0Lang: "c" },
    "t1-ch2-4-p1": { kind: "practice", expected: "15.00\n", input: "1.5 2.0\n3.0 4.0", judge0Lang: "c" },
  },
};

CATALOG["t1-ch2-5"] = {
  trail: 1, ch: 2, no: 5, prereq: "t1-ch2-4",
  problems: {
    "t1-ch2-5-b1": { kind: "basic",    expected: "A\n",     input: "A",     judge0Lang: "c" },
    "t1-ch2-5-p1": { kind: "practice", expected: "hello\n", input: "hello", judge0Lang: "c" },
  },
};

CATALOG["t1-ch2-6"] = {
  trail: 1, ch: 2, no: 6, prereq: "t1-ch2-5",
  problems: {
    "t1-ch2-6-b1": { kind: "basic",    expected: "13 45\n", input: "13:45", judge0Lang: "c" },
    "t1-ch2-6-p1": { kind: "practice", expected: "15\n",    input: "7,8",   judge0Lang: "c" },
  },
};

// === END Trail 1 ===

/** Returns the lesson definition for `lessonId`, or null if unknown. */
export function getLesson(lessonId) {
  return Object.prototype.hasOwnProperty.call(CATALOG, lessonId)
    ? CATALOG[lessonId]
    : null;
}

/** Returns all lesson ids in catalog. */
export function allLessonIds() {
  return Object.keys(CATALOG);
}

/** Lessons that belong to a given trail, in ch/no order. */
export function lessonsForTrail(trail) {
  return Object.entries(CATALOG)
    .filter(([, l]) => l.trail === trail)
    .sort(([, a], [, b]) => (a.ch - b.ch) || (a.no - b.no))
    .map(([id, l]) => ({ id, ...l }));
}

/** True iff problemId is one of lessonId's problems. */
export function validateMembership(lessonId, problemId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return false;
  return Object.prototype.hasOwnProperty.call(lesson.problems, problemId);
}

/**
 * Whether `userId` may submit to `lessonId`. The first lesson of a trail (no
 * prereq) is always unlocked; otherwise the prereq lesson must already be
 * `done`. `getStatus(lessonId)` is a function that returns the current
 * status string for a given lesson id (or null if no row).
 */
export function isUnlocked(lessonId, getStatus) {
  const lesson = getLesson(lessonId);
  if (!lesson) return false;
  if (!lesson.prereq) return true;
  const prereqStatus = getStatus(lesson.prereq);
  return prereqStatus === "done";
}

/** Total number of credit-bearing problems in a lesson. */
export function problemCount(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return 0;
  return Object.keys(lesson.problems).length;
}

/** All problem ids in a lesson. */
export function problemIds(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return [];
  return Object.keys(lesson.problems);
}

/** Find the next lesson id in the same trail (by ch/no). null if last. */
export function nextLessonId(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return null;
  const peers = lessonsForTrail(lesson.trail);
  const idx = peers.findIndex((p) => p.id === lessonId);
  if (idx === -1 || idx === peers.length - 1) return null;
  return peers[idx + 1].id;
}

/** Per-trail totals — used by /api/learn/progress. */
export function trailTotals() {
  const counts = new Map();
  for (const l of Object.values(CATALOG)) {
    counts.set(l.trail, (counts.get(l.trail) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([trail, total]) => ({ trail, total }))
    .sort((a, b) => a.trail - b.trail);
}

/**
 * Mock grading: compare submitted code's static printf string output against
 * `expected`. Intentionally weak — used only when judge0 is unavailable, and
 * its verdict is always stored as `ungraded=1` so it cannot grant lesson done.
 *
 * Returns "correct" if the concatenated string literals from `printf("...")`
 * calls (with simple \n / \t handling) match expected output. Otherwise
 * "wrong". Never throws.
 */
export function mockGrade(code, expected) {
  if (typeof code !== "string" || typeof expected !== "string") return "wrong";
  // Pull every printf("...") string literal in order; concatenate.
  const re = /printf\s*\(\s*"((?:\\.|[^"\\])*)"/g;
  let out = "";
  let m;
  while ((m = re.exec(code)) !== null) {
    out += m[1]
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\\\/g, "\\")
      .replace(/\\"/g, '"');
  }
  return out.trim() === expected.trim() ? "correct" : "wrong";
}
