// Display-only lesson metadata (concept text, problem descriptions/examples).
// IMPORTANT: This file MUST NOT contain expected outputs or prerequisite data.
// Those live exclusively in `backend/src/lesson-catalog.js` so users can't
// inspect the bundle to forge progress.
//
// `backend/scripts/check-catalog-sync.mjs` enforces that every id present
// here is also present in the server catalog (and vice versa).

export const LESSONS = {};

// ===== Trail 0 (Codetree 101 — 프로그래밍 시작) =====
// Trail 0 agent: insert lessons here.
// === END Trail 0 ===

// ===== Trail 1 (Novice Low — 프로그래밍 기초) =====
// Trail 1 agent: insert lessons here.
// === END Trail 1 ===

/** Returns the lesson display data for `lessonId`, or null. */
export function getLesson(lessonId) {
  return Object.prototype.hasOwnProperty.call(LESSONS, lessonId) ? LESSONS[lessonId] : null;
}

/** All lesson ids in order (trail, ch, no). */
export function allLessonIds() {
  return Object.entries(LESSONS)
    .sort(([, a], [, b]) => (a.trail - b.trail) || (a.ch - b.ch) || (a.no - b.no))
    .map(([id]) => id);
}

/** Lessons in a trail, ch/no ordered. */
export function lessonsForTrail(trail) {
  return Object.entries(LESSONS)
    .filter(([, l]) => l.trail === trail)
    .sort(([, a], [, b]) => (a.ch - b.ch) || (a.no - b.no))
    .map(([id, l]) => ({ id, ...l }));
}
