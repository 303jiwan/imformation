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

// Concept slug → human-readable Korean label + which trail/chapter teaches it.
// Used to translate weak/strong concepts into a concrete study starting point.
// Pointed at the trail.html?trail=N landing page so the user can click straight in.
const CONCEPT_INFO = {
  vars:      { label: "변수와 자료형", trail: 0, chapter: "Ch 1. 기본" },
  io:        { label: "입출력",         trail: 0, chapter: "Ch 2. 입출력" },
  operators: { label: "연산자",         trail: 0, chapter: "Ch 1. 기본" },
  cond:      { label: "조건문",         trail: 0, chapter: "Ch 3. 조건문 1" },
  loops:     { label: "반복문",         trail: 1, chapter: "Ch 1. 출력" },
  strings:   { label: "문자열",         trail: 1, chapter: "Ch 2. 입출력" },
  functions: { label: "함수",           trail: 2, chapter: "Ch 1. 함수" },
  recursion: { label: "재귀함수",       trail: 2, chapter: "Ch 2. 재귀함수" },
  arrays:    { label: "배열",           trail: 3, chapter: "Ch 2. 배열, 연결 리스트" },
  pointers:  { label: "포인터",         trail: 3, chapter: "Ch 2. 배열, 연결 리스트" },
  structs:   { label: "구조체",         trail: 3, chapter: "Ch 2. 배열, 연결 리스트" },
  memory:    { label: "동적 메모리",    trail: 3, chapter: "Ch 2. 배열, 연결 리스트" },
};

const TRAIL_LABELS = [
  "Trail 0 · Codetree 101 (프로그래밍 시작)",
  "Trail 1 · Novice Low (프로그래밍 기초)",
  "Trail 2 · Novice Mid (프로그래밍 연습)",
  "Trail 3 · Novice High (자료구조 알고리즘)",
  "Trail 4 · Intermediate Low (알고리즘 입문)",
  "Trail 5 · Intermediate Mid (알고리즘 기본)",
  "Trail 6 · Intermediate High (알고리즘 실전)",
];

const VERDICT_LABEL = {
  correct:  { text: "정답",     color: "#16a34a" },
  wrong:    { text: "오답",     color: "#dc2626" },
  timeout:  { text: "시간 초과", color: "#ca8a04" },
  missing:  { text: "미제출",   color: "#6b7280" },
  ungraded: { text: "미채점",   color: "#6b7280" },
};

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Pick the single trail/chapter the student should start from.
 * Strategy: take the *earliest* (lowest-trail) weak concept — that is the
 * earliest gap in the curriculum, so fixing it first unblocks everything
 * downstream. Fall back to Trail 0 when nothing is weak (perfect score → bump
 * to the next tier based on score band).
 */
function pickStartPoint(weakConcepts, scorePercent) {
  const weakKnown = weakConcepts
    .map((c) => CONCEPT_INFO[c])
    .filter(Boolean);
  if (weakKnown.length > 0) {
    weakKnown.sort((a, b) => a.trail - b.trail);
    return weakKnown[0];
  }
  // Perfect run — recommend the next tier up based on band.
  let trail = 1;
  if (scorePercent >= 90) trail = 4;
  else if (scorePercent >= 80) trail = 3;
  else if (scorePercent >= 70) trail = 2;
  return { label: "다음 단계", trail, chapter: "Ch 1." };
}

// POST /api/test/result-email
// Body: {
//   email,
//   testType: "default" | "survey",
//   summary: { correct, wrong, timeout, missing, total },
//   results: [{ slot, title, concept, verdict }, ...],
//   weakConcepts: string[],
//   strongConcepts: string[],
// }
// Open endpoint — guests can also request their result via email.
testRouter.post("/result-email", async (req, res) => {
  const {
    email,
    testType,
    summary,
    results,
    weakConcepts,
    strongConcepts,
  } = req.body || {};

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "valid email is required" });
  }
  if (!summary || typeof summary.correct !== "number" || typeof summary.total !== "number") {
    return res.status(400).json({ error: "summary.{correct,total} is required" });
  }

  const emailLower = email.trim().toLowerCase();
  const username = req.user?.username || "학습자";
  const testTypeLabel = testType === "survey" ? "실력 진단" : "코드테스트";

  const correct = Number(summary.correct) || 0;
  const total   = Number(summary.total)   || 1;
  const wrong   = Number(summary.wrong)   || 0;
  const timeout = Number(summary.timeout) || 0;
  const missing = Number(summary.missing) || 0;
  const scorePercent = Math.round((correct / total) * 100);

  const weak   = Array.isArray(weakConcepts)   ? weakConcepts   : [];
  const strong = Array.isArray(strongConcepts) ? strongConcepts : [];

  const start = pickStartPoint(weak, scorePercent);
  const trailUrl = `http://localhost:5173/trail.html?trail=${start.trail}`;
  const trailLabel = TRAIL_LABELS[start.trail] ?? `Trail ${start.trail}`;

  // Headline based on score band.
  let headline;
  if (scorePercent === 100) {
    headline = `5문제를 모두 맞히셨어요. 한 단계 더 어려운 트레일로 넘어가실 시점이에요.`;
  } else if (scorePercent >= 60) {
    headline = `기본기는 잡혀 있어요. 약점 개념만 보강하면 다음 단계로 무리 없이 갑니다.`;
  } else {
    headline = `걱정 마세요 — 첫 진단은 출발선을 정확히 찾기 위한 거예요. 추천 트레일부터 차근차근 가봅시다.`;
  }

  const weakLabels   = weak.map((c)   => CONCEPT_INFO[c]?.label || c);
  const strongLabels = strong.map((c) => CONCEPT_INFO[c]?.label || c);

  // Per-problem table rows.
  const resultRows = Array.isArray(results) && results.length
    ? results.map((r) => {
        const v = VERDICT_LABEL[r?.verdict] || VERDICT_LABEL.missing;
        return `
          <tr>
            <td style="padding:8px 10px;border-bottom:1px solid #eee;">문제 ${escapeHtml(r?.slot ?? "")}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #eee;">${escapeHtml(r?.title ?? "")}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #eee;color:#666;">${escapeHtml(r?.concept ?? "")}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #eee;color:${v.color};font-weight:600;">${v.text}</td>
          </tr>`;
      }).join("")
    : `<tr><td colspan="4" style="padding:12px;color:#888;text-align:center;">문제별 기록이 없습니다.</td></tr>`;

  const conceptChips = (arr, color) => arr.length
    ? arr.map((c) => `<span style="display:inline-block;padding:4px 10px;margin:2px 4px 2px 0;border-radius:999px;background:${color};color:#fff;font-size:12px;">${escapeHtml(c)}</span>`).join("")
    : `<span style="color:#888;font-size:13px;">없음</span>`;

  const subject = `[Codenergy] 첫 ${testTypeLabel} 결과 — ${correct}/${total}점, 다음 학습은 ${trailLabel.split(" · ")[0]}`;

  const htmlBody = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;color:#222;">
      <h2 style="margin-bottom:4px;">안녕하세요, ${escapeHtml(username)}님!</h2>
      <p style="color:#555;margin-top:0;">첫 ${escapeHtml(testTypeLabel)}를 마치셨네요. 결과를 정리해 보내드립니다.</p>

      <div style="background:#f5f7fb;border-radius:12px;padding:20px;margin:20px 0;">
        <div style="font-size:14px;color:#666;">총점</div>
        <div style="font-size:36px;font-weight:700;color:#111;">${correct}<span style="font-size:18px;color:#888;"> / ${total}</span> <span style="font-size:16px;color:#666;">(${scorePercent}%)</span></div>
        <div style="font-size:13px;color:#666;margin-top:6px;">
          정답 ${correct} · 오답 ${wrong} · 시간 초과 ${timeout}${missing ? ` · 미제출 ${missing}` : ""}
        </div>
      </div>

      <p style="font-size:15px;line-height:1.6;">${escapeHtml(headline)}</p>

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

      <h3 style="margin-bottom:8px;">📊 문제별 결과</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#fafafa;text-align:left;">
            <th style="padding:8px 10px;border-bottom:1px solid #ddd;">#</th>
            <th style="padding:8px 10px;border-bottom:1px solid #ddd;">문제</th>
            <th style="padding:8px 10px;border-bottom:1px solid #ddd;">개념</th>
            <th style="padding:8px 10px;border-bottom:1px solid #ddd;">결과</th>
          </tr>
        </thead>
        <tbody>${resultRows}</tbody>
      </table>

      <h3 style="margin-top:28px;margin-bottom:8px;">🔎 결과 분석</h3>
      <p style="margin:6px 0;"><strong>강점:</strong><br/>${conceptChips(strongLabels, "#16a34a")}</p>
      <p style="margin:14px 0 6px;"><strong>약점:</strong><br/>${conceptChips(weakLabels, "#dc2626")}</p>
      <p style="font-size:13px;color:#666;margin-top:10px;">
        ${weakLabels.length === 0
          ? "모든 문제를 통과해 약점 개념이 없습니다. 더 도전적인 단계로 넘어가세요."
          : "약점 개념은 같은 개념을 다루는 다른 문제에서도 반복적으로 막힐 가능성이 큰 항목이에요. 추천 트레일에서 해당 개념을 다시 짚어보세요."}
      </p>

      <h3 style="margin-top:28px;margin-bottom:8px;">🎯 공부는 여기서부터 시작하세요</h3>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:18px;">
        <div style="font-size:13px;color:#92400e;font-weight:600;">추천 시작 지점</div>
        <div style="font-size:18px;font-weight:700;margin-top:4px;">${escapeHtml(trailLabel)}</div>
        <div style="font-size:14px;color:#444;margin-top:4px;">${escapeHtml(start.chapter)} → <strong>${escapeHtml(start.label)}</strong>부터</div>
        <p style="font-size:13px;color:#555;margin:10px 0 14px;">
          ${weakLabels.length
            ? `약점으로 분류된 <strong>${escapeHtml(weakLabels[0])}</strong> 개념이 이 챕터에서 다뤄집니다. 여기서부터 시작하면 막힌 지점부터 정확히 채울 수 있어요.`
            : `현재 점수대에 맞춰 다음 단계의 첫 챕터를 추천드립니다.`}
        </p>
        <a href="${trailUrl}" style="display:inline-block;padding:10px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">학습 시작하기 →</a>
      </div>

      <p style="margin-top:30px;color:#888;font-size:12px;">
        Codenergy — 코딩테스트, 지식에서 스킬로<br/>
        이 메일은 ${escapeHtml(emailLower)}로 발송되었습니다.
      </p>
    </div>
  `;

  try {
    await sendMail({
      to: emailLower,
      subject,
      text: `첫 ${testTypeLabel} 결과: ${correct}/${total}점(${scorePercent}%). 추천 시작: ${trailLabel} → ${start.chapter} → ${start.label}. ${trailUrl}`,
      html: htmlBody,
    });
    res.json({ ok: true, message: "결과가 이메일로 전송되었습니다." });
  } catch (err) {
    console.error("Failed to send result email:", err);
    res.status(500).json({ error: "이메일 전송에 실패했습니다." });
  }
});
