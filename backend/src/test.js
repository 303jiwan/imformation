// Coding-test progress + answer routes.
// All authenticated endpoints require a session (`requireAuth`).
// `/email-sample` is intentionally open — non-members may submit their email
// from the test-login page.

import express from "express";
import { stmts } from "./db.js";
import { requireAuth } from "./auth.js";
import { sendMail } from "./mailer.js";

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

// POST /api/test/result-email  { email, testType, score, weakConcepts }
// Send test result via email with learning recommendations
testRouter.post("/result-email", requireAuth, async (req, res) => {
  const { email, testType, score, weakConcepts } = req.body || {};
  
  // Validate inputs
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "valid email is required" });
  }
  if (score == null || typeof score !== "number") {
    return res.status(400).json({ error: "score is required and must be a number" });
  }
  
  const emailLower = email.trim().toLowerCase();
  const username = req.user?.username || "학습자";
  const testTypeLabel = testType === "survey" ? "실력 진단" : "코드테스트";
  const weakList = Array.isArray(weakConcepts) ? weakConcepts.join(", ") : "미분류";
  
  // Generate learning recommendation
  const scorePercent = Number.isFinite(score)
    ? score <= 1 ? Math.round(score * 100) : Math.round(score)
    : 0;
  let recommendedTrail = "Codetree 101";
  if (scorePercent >= 70) recommendedTrail = "Novice Low";
  if (scorePercent >= 80) recommendedTrail = "Novice Mid";
  if (scorePercent >= 85) recommendedTrail = "Novice High";
  if (scorePercent >= 90) recommendedTrail = "Intermediate Low";
  
  const subject = `[Codenergy] 당신의 ${testTypeLabel} 결과입니다`;
  const htmlBody = `
    <h2>안녕하세요, ${username}님!</h2>
    <p>귀하의 <strong>${testTypeLabel}</strong> 결과를 알려드립니다.</p>
    
    <hr />
    <h3>📊 결과 요약</h3>
    <ul>
      <li><strong>점수:</strong> ${scorePercent}%</li>
      <li><strong>약점 개념:</strong> ${weakList}</li>
    </ul>
    
    <h3>🎯 추천 학습 경로</h3>
    <p>
      당신의 현재 수준에 맞춰 <strong>${recommendedTrail}</strong> 트레일부터 시작하시길 추천합니다.
    </p>
    
    <p style="margin-top: 30px; color: #666; font-size: 12px;">
      Codenergy - 지식에서 스킬로<br />
      <a href="http://localhost:3000">codenergy.com</a>
    </p>
  `;
  
  try {
    await sendMail({
      to: emailLower,
      subject,
      html: htmlBody,
    });
    res.json({ ok: true, message: "결과가 이메일로 전송되었습니다." });
  } catch (err) {
    console.error("Failed to send result email:", err);
    res.status(500).json({ error: "이메일 전송에 실패했습니다." });
  }
});
