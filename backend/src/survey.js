// Survey persistence routes.
// One row per user. Values are constrained to the radio-button choices in
// frontend/survey.html so we don't end up with junk levels feeding the
// difficulty gate in test-problems.js.

import express from "express";
import { stmts } from "./db.js";
import { requireAuth } from "./auth.js";

export const surveyRouter = express.Router();

const VALID = {
  interest: new Set(["curious", "light", "serious", "passionate"]),
  level: new Set(["none", "basic", "intermediate", "advanced"]),
  time: new Set(["under30", "30to60", "1to2", "over2"]),
};

// GET /api/survey
surveyRouter.get("/", requireAuth, (req, res) => {
  const row = stmts.getSurvey.get(req.user.id);
  if (!row) return res.json({ survey: null });
  res.json({
    survey: {
      interest: row.interest,
      level: row.level,
      time: row.time,
      updated_at: row.updated_at,
    },
  });
});

// POST /api/survey  { interest, level, time }
surveyRouter.post("/", requireAuth, (req, res) => {
  const { interest, level, time } = req.body || {};
  if (!VALID.interest.has(interest)) {
    return res.status(400).json({ error: "invalid interest" });
  }
  if (!VALID.level.has(level)) {
    return res.status(400).json({ error: "invalid level" });
  }
  if (!VALID.time.has(time)) {
    return res.status(400).json({ error: "invalid time" });
  }
  stmts.upsertSurvey.run(req.user.id, interest, level, time);
  res.json({ ok: true, survey: { interest, level, time } });
});
