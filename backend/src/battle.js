// battle.js — PvP 배틀 시스템
//
// 엔드포인트:
//   POST   /api/battle/queue/join
//   POST   /api/battle/queue/leave
//   POST   /api/battle/rooms
//   POST   /api/battle/rooms/:code/join
//   POST   /api/battle/rooms/:code/leave
//   GET    /api/battle/rooms/:code/state
//   GET    /api/battle/match/:id/state
//   POST   /api/battle/match/:id/submit
//
// 모든 엔드포인트: requireAuth 필수, 응답에 serverNow 포함.
//
// 채점: grader.js 의 내부 함수는 export 되지 않으므로
//       /api/grade/submit HTTP 엔드포인트를 localhost에서 직접 호출한다.

import express from "express";
import crypto from "node:crypto";
import http from "node:http";
import { pool } from "./db.js";
import { requireAuth } from "./auth.js";

export const battleRouter = express.Router();

// ---------------------------------------------------------------------------
// 상수
// ---------------------------------------------------------------------------
const QUEUE_ZOMBIE_SEC    = 60;   // 큐 좀비 TTL (초)
const MATCH_FORFEIT_SEC   = 180;  // 무활동 forfeit (초)
const ROOM_EXPIRE_MIN     = 10;   // 방 만료 (분)
const SCORES_TO_WIN       = 3;    // 선취 점수
const BATTERY_WIN_REWARD  = 5;    // 승리 보상 배터리
const MATCH_START_DELAY_MS = 3000; // 매치 시작 딜레이

// ---------------------------------------------------------------------------
// 퍼-유저 레이트리밋 (분당 30회)
// ---------------------------------------------------------------------------
const RATE_PER_MIN = 30;
const rateBuckets = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  let bucket = rateBuckets.get(userId);
  if (!bucket) {
    bucket = { tokens: RATE_PER_MIN, lastRefill: now };
    rateBuckets.set(userId, bucket);
  }
  const elapsed = (now - bucket.lastRefill) / 60_000;
  if (elapsed >= 1) {
    bucket.tokens = RATE_PER_MIN;
    bucket.lastRefill = now;
  }
  if (bucket.tokens <= 0) return false;
  bucket.tokens--;
  return true;
}

// 1시간마다 비활성 버킷 정리
setInterval(() => {
  const threshold = Date.now() - 60 * 60 * 1000;
  for (const [k, v] of rateBuckets) {
    if (v.lastRefill < threshold) rateBuckets.delete(k);
  }
}, 60 * 60 * 1000).unref();

// 레이트리밋 미들웨어
function rateLimit(req, res, next) {
  if (!checkRateLimit(req.user.id)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "요청이 너무 많습니다. 1분 후 다시 시도해주세요." });
  }
  next();
}

// serverNow 헬퍼
const now = () => new Date().toISOString();

// ---------------------------------------------------------------------------
// DB 헬퍼 (직접 pool.query 사용 — 배틀 전용)
// ---------------------------------------------------------------------------

async function getProblemById(id) {
  const res = await pool.query("SELECT * FROM battle_problems WHERE id = $1", [id]);
  return res.rows[0] ?? null;
}

async function getMatchById(id) {
  const res = await pool.query("SELECT * FROM battle_matches WHERE id = $1", [id]);
  return res.rows[0] ?? null;
}

async function getMatchPlayers(matchId) {
  const res = await pool.query(
    `SELECT bmp.user_id, bmp.score, bmp.current_problem_idx,
            u.username
       FROM battle_match_players bmp
       JOIN users u ON u.id = bmp.user_id
      WHERE bmp.match_id = $1`,
    [matchId]
  );
  return res.rows;
}

async function getPlayerInMatch(matchId, userId) {
  const res = await pool.query(
    "SELECT * FROM battle_match_players WHERE match_id = $1 AND user_id = $2",
    [matchId, userId]
  );
  return res.rows[0] ?? null;
}

// 지갑 배터리 적립 (트랜잭션 외부에서 호출)
async function grantBattleWin(userId) {
  try {
    await pool.query(
      `INSERT INTO user_wallet (user_id, balance, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (user_id) DO UPDATE SET
         balance = user_wallet.balance + EXCLUDED.balance,
         updated_at = now()`,
      [userId, BATTERY_WIN_REWARD]
    );
  } catch (e) {
    console.error("[battle] grantBattleWin error:", e);
  }
}

// forfeit 처리: 무활동 플레이어 패배 처리
async function checkAndApplyForfeit(match) {
  if (match.state !== "in_progress") return match;
  const lastActivity = new Date(match.last_activity_at).getTime();
  const elapsed = (Date.now() - lastActivity) / 1000;
  if (elapsed < MATCH_FORFEIT_SEC) return match;

  // forfeit: last_activity_at 이 오래된 쪽이 진 것 — 상대가 승리
  // 여기서는 단순히 "활동이 없는" 매치를 forfeit_timeout으로 처리
  // 어느 쪽이 마지막 활동인지 알 수 없으니 draw(no_winner)로 ended 처리
  await pool.query(
    `UPDATE battle_matches SET state = 'finished', ended_at = now()
      WHERE id = $1 AND state = 'in_progress'`,
    [match.id]
  );
  return { ...match, state: "finished", winner_user_id: null };
}

// ---------------------------------------------------------------------------
// POST /api/battle/queue/join
// ---------------------------------------------------------------------------
battleRouter.post("/queue/join", requireAuth, rateLimit, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 좀비 청소
      await client.query(
        "DELETE FROM battle_queue WHERE joined_at < now() - ($1 || ' seconds')::interval",
        [QUEUE_ZOMBIE_SEC]
      );

      // 상대 찾기 (본인 제외, SKIP LOCKED)
      const opponentRes = await client.query(
        `SELECT user_id FROM battle_queue
          WHERE user_id != $1
          LIMIT 1
          FOR UPDATE SKIP LOCKED`,
        [userId]
      );

      if (opponentRes.rows.length === 0) {
        // 대기 큐에 추가 (이미 있으면 무시)
        await client.query(
          "INSERT INTO battle_queue (user_id) VALUES ($1) ON CONFLICT DO NOTHING",
          [userId]
        );
        await client.query("COMMIT");
        return res.status(202).json({ status: "waiting", serverNow: now() });
      }

      const opponentId = opponentRes.rows[0].user_id;

      // 두 플레이어 모두 큐에서 제거
      await client.query(
        "DELETE FROM battle_queue WHERE user_id = ANY($1::bigint[])",
        [[userId, opponentId]]
      );

      // 랜덤 문제 5개 선택
      const probRes = await client.query(
        "SELECT id FROM battle_problems ORDER BY random() LIMIT 5"
      );
      const problemIds = probRes.rows.map((r) => r.id);
      if (problemIds.length === 0) {
        await client.query("ROLLBACK");
        return res.status(503).json({ error: "배틀 문제가 없습니다. 관리자에게 문의하세요." });
      }

      // 매치 생성
      const startedAt = new Date(Date.now() + MATCH_START_DELAY_MS).toISOString();
      const matchRes = await client.query(
        `INSERT INTO battle_matches (started_at, problem_ids, state)
         VALUES ($1, $2::int[], 'in_progress')
         RETURNING id`,
        [startedAt, problemIds]
      );
      const matchId = matchRes.rows[0].id;

      // 두 플레이어 삽입
      await client.query(
        `INSERT INTO battle_match_players (match_id, user_id) VALUES ($1, $2), ($1, $3)`,
        [matchId, userId, opponentId]
      );

      await client.query("COMMIT");

      const serverNow = now();
      return res.status(200).json({ status: "matched", matchId, startedAt, serverNow });
    } catch (e) {
      await client.query("ROLLBACK").catch(() => {});
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/battle/queue/leave
// ---------------------------------------------------------------------------
battleRouter.post("/queue/leave", requireAuth, rateLimit, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM battle_queue WHERE user_id = $1", [req.user.id]);
    res.json({ ok: true, serverNow: now() });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/battle/rooms
// ---------------------------------------------------------------------------
battleRouter.post("/rooms", requireAuth, rateLimit, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 만료된 waiting 방 lazy 정리
    await pool.query(
      `DELETE FROM battle_rooms
        WHERE state = 'waiting' AND created_at < now() - interval '${ROOM_EXPIRE_MIN} minutes'`
    );

    // code 생성 (UNIQUE 충돌 시 3회 재시도)
    let roomId, code;
    for (let attempt = 0; attempt < 3; attempt++) {
      code = crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 6);
      try {
        const r = await pool.query(
          "INSERT INTO battle_rooms (code, host_user_id) VALUES ($1, $2) RETURNING id",
          [code, userId]
        );
        roomId = r.rows[0].id;
        break;
      } catch (e) {
        // PostgreSQL unique violation: 23505
        if (e.code === "23505" && attempt < 2) continue;
        throw e;
      }
    }

    res.status(201).json({ ok: true, code, roomId, serverNow: now() });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/battle/rooms/:code/join
// ---------------------------------------------------------------------------
battleRouter.post("/rooms/:code/join", requireAuth, rateLimit, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const code = (req.params.code || "").toUpperCase();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 방 조회 (FOR UPDATE)
      const roomRes = await client.query(
        "SELECT * FROM battle_rooms WHERE code = $1 FOR UPDATE",
        [code]
      );
      if (roomRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "방을 찾을 수 없습니다." });
      }

      const room = roomRes.rows[0];

      if (room.state !== "waiting") {
        await client.query("ROLLBACK");
        return res.status(409).json({ error: "이미 시작되었거나 종료된 방입니다." });
      }
      if (room.host_user_id === userId) {
        await client.query("ROLLBACK");
        return res.status(409).json({ error: "본인이 만든 방에 참가할 수 없습니다." });
      }

      // 방 만료 확인
      const roomAge = (Date.now() - new Date(room.created_at).getTime()) / 60000;
      if (roomAge > ROOM_EXPIRE_MIN) {
        await client.query("DELETE FROM battle_rooms WHERE id = $1", [room.id]);
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "방이 만료되었습니다." });
      }

      // 랜덤 문제 5개
      const probRes = await client.query(
        "SELECT id FROM battle_problems ORDER BY random() LIMIT 5"
      );
      const problemIds = probRes.rows.map((r) => r.id);
      if (problemIds.length === 0) {
        await client.query("ROLLBACK");
        return res.status(503).json({ error: "배틀 문제가 없습니다. 관리자에게 문의하세요." });
      }

      const startedAt = new Date(Date.now() + MATCH_START_DELAY_MS).toISOString();
      const matchRes = await client.query(
        `INSERT INTO battle_matches (started_at, problem_ids, state)
         VALUES ($1, $2::int[], 'in_progress')
         RETURNING id`,
        [startedAt, problemIds]
      );
      const matchId = matchRes.rows[0].id;

      await client.query(
        `INSERT INTO battle_match_players (match_id, user_id) VALUES ($1, $2), ($1, $3)`,
        [matchId, room.host_user_id, userId]
      );

      await client.query(
        "UPDATE battle_rooms SET state = 'matched', match_id = $1 WHERE id = $2",
        [matchId, room.id]
      );

      await client.query("COMMIT");

      res.status(200).json({ matchId, startedAt, serverNow: now() });
    } catch (e) {
      await client.query("ROLLBACK").catch(() => {});
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/battle/rooms/:code/leave (호스트만, waiting 상태만)
// ---------------------------------------------------------------------------
battleRouter.post("/rooms/:code/leave", requireAuth, rateLimit, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const code = (req.params.code || "").toUpperCase();

    const r = await pool.query(
      "DELETE FROM battle_rooms WHERE code = $1 AND host_user_id = $2 AND state = 'waiting' RETURNING id",
      [code, userId]
    );

    if (r.rowCount === 0) {
      // 방이 없거나 호스트가 아니거나 이미 시작된 경우 — 멱등으로 처리
      return res.json({ ok: true, serverNow: now() });
    }

    res.json({ ok: true, serverNow: now() });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/battle/rooms/:code/state
// ---------------------------------------------------------------------------
battleRouter.get("/rooms/:code/state", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const code = (req.params.code || "").toUpperCase();

    // 방 + joiner 조회
    const roomRes = await pool.query(
      `SELECT r.*,
              j.user_id AS joiner_user_id
         FROM battle_rooms r
         LEFT JOIN battle_match_players bmp
           ON bmp.match_id = r.match_id AND bmp.user_id != r.host_user_id
         LEFT JOIN users j ON j.id = bmp.user_id
        WHERE r.code = $1`,
      [code]
    );

    if (roomRes.rows.length === 0) {
      return res.status(404).json({ error: "방을 찾을 수 없습니다." });
    }

    const room = roomRes.rows[0];

    // 호스트나 joiner만 접근 가능
    const isHost = room.host_user_id === userId;
    const isJoiner = room.joiner_user_id === userId;
    if (!isHost && !isJoiner) {
      return res.status(404).json({ error: "방을 찾을 수 없습니다." });
    }

    res.json({
      state: room.state,
      matchId: room.match_id ?? null,
      hostUserId: room.host_user_id,
      joinerUserId: room.joiner_user_id ?? null,
      serverNow: now(),
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/battle/match/:id/state
// ---------------------------------------------------------------------------
battleRouter.get("/match/:id/state", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const matchId = req.params.id;

    // 인가 확인
    const playerRow = await getPlayerInMatch(matchId, userId);
    if (!playerRow) {
      return res.status(403).json({ error: "이 매치에 접근할 권한이 없습니다." });
    }

    let match = await getMatchById(matchId);
    if (!match) {
      return res.status(404).json({ error: "매치를 찾을 수 없습니다." });
    }

    // last_activity_at 업데이트
    await pool.query(
      "UPDATE battle_matches SET last_activity_at = now() WHERE id = $1 AND state = 'in_progress'",
      [matchId]
    );

    // forfeit 확인
    match = await checkAndApplyForfeit(match);

    // 플레이어 목록
    const players = await getMatchPlayers(matchId);

    // 본인의 현재 문제
    const myPlayer = players.find((p) => Number(p.user_id) === Number(userId));
    const currentProblemIdx = myPlayer?.current_problem_idx ?? 0;
    const problemId = match.problem_ids?.[currentProblemIdx];

    let currentProblem = null;
    if (problemId && match.state === "in_progress") {
      const prob = await getProblemById(problemId);
      if (prob) {
        // testcases/expected 제외
        currentProblem = {
          id:           prob.id,
          title:        prob.title,
          description:  prob.description,
          input_desc:   prob.input_desc,
          output_desc:  prob.output_desc,
          constraints:  prob.constraints,
          examples:     prob.examples,
          starter_code: prob.starter_code,
        };
      }
    }

    res.json({
      state:         match.state,
      winnerUserId:  match.winner_user_id ? Number(match.winner_user_id) : null,
      startedAt:     match.started_at,
      serverNow:     now(),
      players: players.map((p) => ({
        userId:            Number(p.user_id),
        username:          p.username,
        score:             p.score,
        currentProblemIdx: p.current_problem_idx,
      })),
      currentProblem,
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// 내부 채점 HTTP 호출 헬퍼
// grader.js 의 gradeMany 는 export 되지 않으므로 localhost HTTP로 호출한다.
// 요청자의 세션 쿠키를 그대로 전달해 requireAuth 를 통과시킨다.
// ---------------------------------------------------------------------------
const GRADER_PORT = Number(process.env.PORT) || 3000;

function callGraderSubmit({ source, stdins, expected, cookie }) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ source, stdins, expected });
    const options = {
      hostname: "127.0.0.1",
      port: GRADER_PORT,
      path: "/api/grade/submit",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        ...(cookie ? { Cookie: cookie } : {}),
      },
    };

    const req = http.request(options, (httpRes) => {
      let data = "";
      httpRes.on("data", (chunk) => { data += chunk; });
      httpRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (httpRes.statusCode === 503 || httpRes.statusCode === 408 || httpRes.statusCode === 429) {
            const err = new Error(parsed.error || "grader busy");
            err.status = httpRes.statusCode;
            return reject(err);
          }
          resolve(parsed);
        } catch (e) {
          reject(new Error("grader response parse error"));
        }
      });
    });

    req.on("error", (e) => reject(e));
    req.setTimeout(35_000, () => {
      req.destroy();
      const err = new Error("grader HTTP timeout");
      err.status = 503;
      reject(err);
    });
    req.write(body);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// POST /api/battle/match/:id/submit
// ---------------------------------------------------------------------------
battleRouter.post("/match/:id/submit", requireAuth, rateLimit, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const matchId = req.params.id;
    const { source, problemIdx } = req.body || {};

    if (typeof source !== "string" || source.length === 0) {
      return res.status(400).json({ error: "source 코드가 필요합니다." });
    }

    // 인가 확인
    const playerRow = await getPlayerInMatch(matchId, userId);
    if (!playerRow) {
      return res.status(403).json({ error: "이 매치에 접근할 권한이 없습니다." });
    }

    // problemIdx 검증
    if (typeof problemIdx !== "number" || problemIdx !== playerRow.current_problem_idx) {
      return res.status(400).json({
        error: "잘못된 problemIdx입니다.",
        expected: playerRow.current_problem_idx,
      });
    }

    // 매치 상태 확인
    const match = await getMatchById(matchId);
    if (!match || match.state !== "in_progress") {
      return res.status(409).json({ error: "진행 중인 매치가 아닙니다." });
    }

    // 문제 가져오기
    const problemId = match.problem_ids?.[problemIdx];
    if (!problemId) {
      return res.status(400).json({ error: "문제를 찾을 수 없습니다." });
    }

    const prob = await getProblemById(problemId);
    if (!prob) {
      return res.status(404).json({ error: "문제를 찾을 수 없습니다." });
    }

    const testcases = Array.isArray(prob.testcases) ? prob.testcases : [];
    const stdins    = testcases.map((tc) => tc.input ?? "");
    const expected  = testcases.map((tc) => tc.expected ?? "");

    // 채점: /api/grade/submit 내부 HTTP 호출
    // grader.js 는 export 된 함수가 없으므로 localhost 에서 HTTP로 호출한다.
    // 요청 쿿키를 그대로 전달해 grader 의 requireAuth 를 통과한다.
    let gradeResult;
    try {
      gradeResult = await callGraderSubmit({
        source,
        stdins,
        expected,
        cookie: req.headers.cookie || "",
      });
    } catch (e) {
      if (e.status === 503 || e.status === 408 || e.status === 429) {
        return res.status(503).json({
          verdict: "pending",
          retryAfterMs: 2000,
          error: e.message,
          serverNow: now(),
        });
      }
      throw e;
    }

    // 판정
    const allPassed = gradeResult.cases.every((c) => c.verdict === "ok");
    const failedCase = gradeResult.cases.find((c) => c.verdict !== "ok");

    if (!allPassed) {
      return res.json({
        verdict: "wrong",
        failedCase: failedCase
          ? { verdict: failedCase.verdict, statusDescription: failedCase.statusDescription }
          : undefined,
        serverNow: now(),
      });
    }

    // 정답 처리 — score++, current_problem_idx++
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 최신 상태 재확인 (다른 요청이 이미 끝냈을 수 있음)
      const freshMatch = await client.query(
        "SELECT * FROM battle_matches WHERE id = $1 FOR UPDATE",
        [matchId]
      );
      if (!freshMatch.rows[0] || freshMatch.rows[0].state !== "in_progress") {
        await client.query("ROLLBACK");
        return res.json({ verdict: "correct", matchState: freshMatch.rows[0]?.state ?? "finished", serverNow: now() });
      }

      // 플레이어 업데이트
      const updRes = await client.query(
        `UPDATE battle_match_players
            SET score = score + 1,
                current_problem_idx = current_problem_idx + 1
          WHERE match_id = $1 AND user_id = $2
          RETURNING score, current_problem_idx`,
        [matchId, userId]
      );

      const newScore = updRes.rows[0]?.score ?? 0;
      let matchState = "in_progress";
      let winnerId = null;

      if (newScore >= SCORES_TO_WIN) {
        // 승리
        await client.query(
          `UPDATE battle_matches
              SET state = 'finished',
                  winner_user_id = $1,
                  ended_at = now()
            WHERE id = $2`,
          [userId, matchId]
        );
        matchState = "finished";
        winnerId = userId;

        // 배터리 보상 (best-effort, 트랜잭션 밖에서)
        client.query("COMMIT").then(async () => {
          await grantBattleWin(userId);
        });
      } else {
        await client.query("COMMIT");
      }

      return res.json({
        verdict: "correct",
        score: newScore,
        matchState,
        winnerUserId: winnerId,
        serverNow: now(),
      });
    } catch (e) {
      await client.query("ROLLBACK").catch(() => {});
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});
