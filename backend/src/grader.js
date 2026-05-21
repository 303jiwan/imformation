// grader.js — 자체 채점 모듈 + Express 라우터
// gcc (또는 Docker 샌드박스) 기반 C 코드 컴파일·실행.
//
// 환경변수 (backend/.env):
//   GRADER_UNSAFE_NOCONTAINER=1  → Docker 없이 직접 실행 (개발 전용)
//   GRADER_UNSAFE_NOCONTAINER=0  → Docker 샌드박스 사용 (기본; Docker 없으면 503)
//   나머지 GRADER_* 변수는 아래 CONFIG 참조.

import express from "express";
import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import { loadSession } from "./auth.js";
import { stmts, withTx } from "./db.js";

// ---------------------------------------------------------------------------
// 설정
// ---------------------------------------------------------------------------
const CONFIG = {
  dockerImage:      process.env.GRADER_DOCKER_IMAGE       || "gcc:9",
  compileTimeoutMs: Number(process.env.GRADER_COMPILE_TIMEOUT_MS) || 10_000,
  runTimeoutMs:     Number(process.env.GRADER_RUN_TIMEOUT_MS)     || 2_000,
  memoryMb:         Number(process.env.GRADER_MEMORY_MB)          || 128,
  maxCases:         Number(process.env.GRADER_MAX_CASES)          || 200,
  maxSourceBytes:   Number(process.env.GRADER_MAX_SOURCE_BYTES)   || 102_400,
  maxStdinBytes:    Number(process.env.GRADER_MAX_STDIN_BYTES)    || 16_384,
  maxOutputBytes:   Number(process.env.GRADER_MAX_OUTPUT_BYTES)   || 65_536,
  jobTimeoutMs:     Number(process.env.GRADER_JOB_TIMEOUT_MS)     || 30_000,
  maxConcurrent:    Number(process.env.GRADER_MAX_CONCURRENT)     || 4,
  queueMax:         Number(process.env.GRADER_QUEUE_MAX)          || 20,
  queueWaitMs:      Number(process.env.GRADER_QUEUE_WAIT_MS)      || 10_000,
  ratePerMin:       Number(process.env.GRADER_RATE_PER_MIN)       || 30,
  unsafeNoContainer: process.env.GRADER_UNSAFE_NOCONTAINER === "1",
};

// ---------------------------------------------------------------------------
// Docker 가용성 확인 (startup-time, best-effort)
// ---------------------------------------------------------------------------
let dockerAvailable = false;

async function checkDocker() {
  return new Promise((resolve) => {
    const p = spawn("docker", ["info"], { stdio: "ignore", shell: true });
    const t = setTimeout(() => { p.kill(); resolve(false); }, 3000);
    p.on("close", (code) => { clearTimeout(t); resolve(code === 0); });
    p.on("error", () => { clearTimeout(t); resolve(false); });
  });
}

// ---------------------------------------------------------------------------
// 글로벌 동시성 큐
// ---------------------------------------------------------------------------
let activeConcurrent = 0;
const waitQueue = []; // { resolve, reject, timer }

function acquireSemaphore() {
  if (activeConcurrent < CONFIG.maxConcurrent) {
    activeConcurrent++;
    return Promise.resolve();
  }
  if (waitQueue.length >= CONFIG.queueMax) {
    return Promise.reject(Object.assign(new Error("채점 큐가 가득 찼습니다. 잠시 후 다시 시도해주세요."), { status: 503 }));
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const idx = waitQueue.findIndex((e) => e.resolve === resolve);
      if (idx >= 0) waitQueue.splice(idx, 1);
      reject(Object.assign(new Error("채점 큐 대기 시간이 초과되었습니다."), { status: 408 }));
    }, CONFIG.queueWaitMs);
    waitQueue.push({ resolve, reject, timer });
  });
}

function releaseSemaphore() {
  if (waitQueue.length > 0) {
    const next = waitQueue.shift();
    clearTimeout(next.timer);
    next.resolve();
  } else {
    activeConcurrent--;
  }
}

// ---------------------------------------------------------------------------
// 퍼-유저 토큰버킷 레이트리밋
// ---------------------------------------------------------------------------
const rateBuckets = new Map(); // key → { tokens, lastRefill }

function checkRateLimit(key) {
  const now = Date.now();
  let bucket = rateBuckets.get(key);
  if (!bucket) {
    bucket = { tokens: CONFIG.ratePerMin, lastRefill: now };
    rateBuckets.set(key, bucket);
  }
  // 1분마다 전체 토큰 복원
  const elapsedMin = (now - bucket.lastRefill) / 60_000;
  if (elapsedMin >= 1) {
    bucket.tokens = CONFIG.ratePerMin;
    bucket.lastRefill = now;
  }
  if (bucket.tokens <= 0) return false;
  bucket.tokens--;
  return true;
}

// 메모리 누수 방지: 1시간마다 비활성 버킷 정리
setInterval(() => {
  const threshold = Date.now() - 60 * 60 * 1000;
  for (const [k, v] of rateBuckets) {
    if (v.lastRefill < threshold) rateBuckets.delete(k);
  }
}, 60 * 60 * 1000);

// ---------------------------------------------------------------------------
// 저수준: 프로세스 실행 헬퍼
// ---------------------------------------------------------------------------
function spawnWithTimeout(cmd, args, { stdinData, timeoutMs, maxOutputBytes, shell = false } = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"], shell });
    let stdout = "";
    let stderr = "";
    let outputLimitHit = false;
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      try { p.kill("SIGKILL"); } catch (_) {}
    }, timeoutMs);

    p.stdout.on("data", (chunk) => {
      if (outputLimitHit) return;
      stdout += chunk.toString("utf8");
      if (Buffer.byteLength(stdout) > maxOutputBytes) {
        outputLimitHit = true;
        stdout = stdout.slice(0, maxOutputBytes);
        try { p.kill("SIGKILL"); } catch (_) {}
      }
    });
    p.stderr.on("data", (chunk) => { stderr += chunk.toString("utf8").slice(0, 4096); });

    p.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut, outputLimitHit });
    });
    p.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: -1, stdout, stderr: err.message, timedOut: false, outputLimitHit: false });
    });

    if (stdinData != null) {
      try { p.stdin.write(stdinData); p.stdin.end(); } catch (_) {}
    } else {
      try { p.stdin.end(); } catch (_) {}
    }
  });
}

// ---------------------------------------------------------------------------
// 컴파일 (공통)
// ---------------------------------------------------------------------------
// unsafeNoContainer=1 → 호스트 gcc 직접 호출 (호스트에 gcc 필요)
// unsafeNoContainer=0 → gcc:9 컨테이너 내부에서 컴파일 (Linux ELF 산출 → runOneDocker 가 그대로 실행)
async function compileOnce(source, workDir) {
  await writeFile(join(workDir, "sol.c"), source, "utf8");

  let r;
  if (CONFIG.unsafeNoContainer) {
    r = await spawnWithTimeout(
      "gcc",
      ["-O2", "-std=c11", "-o", join(workDir, "sol"), join(workDir, "sol.c")],
      { timeoutMs: CONFIG.compileTimeoutMs, maxOutputBytes: CONFIG.maxOutputBytes, shell: true }
    );
  } else {
    r = await spawnWithTimeout(
      "docker",
      [
        "run", "--rm",
        "-v", `${workDir}:/work`,
        CONFIG.dockerImage,
        "gcc", "-O2", "-std=c11", "-o", "/work/sol", "/work/sol.c",
      ],
      { timeoutMs: CONFIG.compileTimeoutMs, maxOutputBytes: CONFIG.maxOutputBytes, shell: false }
    );
  }

  if (r.timedOut) {
    return { ok: false, output: "(컴파일 타임아웃)" };
  }
  if (r.code !== 0) {
    return { ok: false, output: (r.stderr || r.stdout || "(컴파일 오류)").trim() };
  }
  return { ok: true, output: r.stderr.trim() };
}

// ---------------------------------------------------------------------------
// 실행: 직접 (GRADER_UNSAFE_NOCONTAINER=1)
// ---------------------------------------------------------------------------
async function runOneDirect(binPath, stdinData) {
  const r = await spawnWithTimeout(
    binPath,
    [],
    {
      stdinData,
      timeoutMs: CONFIG.runTimeoutMs,
      maxOutputBytes: CONFIG.maxOutputBytes,
      shell: false,
    }
  );
  if (r.timedOut)       return { verdict: "tle",    stdout: "", stderr: "" };
  if (r.outputLimitHit) return { verdict: "output_limit", stdout: r.stdout, stderr: r.stderr };
  if (r.code !== 0)     return { verdict: "runtime", stdout: r.stdout, stderr: r.stderr };
  return { verdict: "ok", stdout: r.stdout, stderr: r.stderr };
}

// ---------------------------------------------------------------------------
// 실행: Docker 샌드박스
// ---------------------------------------------------------------------------
async function runOneDocker(workDir, stdinData) {
  // Docker 컨테이너 안에서 컴파일된 /work/sol 실행
  const args = [
    "run", "--rm", "-i",
    "--network=none",
    `--memory=${CONFIG.memoryMb}m`,
    `--memory-swap=${CONFIG.memoryMb}m`,
    "--cpus=0.5",
    "--pids-limit=64",
    "--read-only",
    "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m",
    "-v", `${workDir}:/work:ro`,
    "--user", "65534:65534",
    CONFIG.dockerImage,
    "/work/sol",
  ];

  const raceTimeout = CONFIG.runTimeoutMs + 1500;
  const r = await Promise.race([
    spawnWithTimeout("docker", args, {
      stdinData,
      timeoutMs: raceTimeout,
      maxOutputBytes: CONFIG.maxOutputBytes,
      shell: false,
    }),
    new Promise((resolve) =>
      setTimeout(() => resolve({ code: -1, stdout: "", stderr: "", timedOut: true, outputLimitHit: false }), raceTimeout + 200)
    ),
  ]);

  if (r.timedOut)       return { verdict: "tle",    stdout: "", stderr: "" };
  if (r.outputLimitHit) return { verdict: "output_limit", stdout: r.stdout, stderr: r.stderr };
  if (r.code !== 0)     return { verdict: "runtime", stdout: r.stdout, stderr: r.stderr };
  return { verdict: "ok", stdout: r.stdout, stderr: r.stderr };
}

// ---------------------------------------------------------------------------
// gradeMany — 메인 채점 로직
// ---------------------------------------------------------------------------
async function gradeMany({ source, stdins, expected }) {
  const workDir = join(tmpdir(), `codenergy-${randomBytes(8).toString("hex")}`);
  await mkdir(workDir, { recursive: true });

  const jobTimeout = new Promise((_, reject) =>
    setTimeout(() => reject(Object.assign(new Error("채점 작업 시간이 초과되었습니다."), { status: 408 })), CONFIG.jobTimeoutMs)
  );

  try {
    return await Promise.race([jobTimeout, _gradeManyInner({ source, stdins, expected, workDir })]);
  } finally {
    rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function _gradeManyInner({ source, stdins, expected, workDir }) {
  const compile = await compileOnce(source, workDir);
  if (!compile.ok) {
    return {
      compile,
      cases: stdins.map(() => ({
        verdict: "compile",
        stdout: "",
        stderr: compile.output,
        statusDescription: "컴파일 오류",
        timeMs: null,
        memoryKb: null,
      })),
    };
  }

  const binPath = join(workDir, "sol");
  const cases = [];

  for (let i = 0; i < stdins.length; i++) {
    const stdinData = stdins[i] ?? "";
    const t0 = Date.now();

    let runResult;
    if (CONFIG.unsafeNoContainer) {
      runResult = await runOneDirect(binPath, stdinData);
    } else {
      runResult = await runOneDocker(workDir, stdinData);
    }

    const timeMs = Date.now() - t0;

    // verdict 결정
    let verdict = runResult.verdict;
    if (verdict === "ok" && expected && expected[i] != null) {
      const norm = (s) => String(s ?? "").replace(/\s+$/g, "");
      verdict = norm(runResult.stdout) === norm(expected[i]) ? "ok" : "wrong";
    }

    const statusMap = {
      ok: "정답",
      wrong: "오답",
      tle: "시간 초과",
      runtime: "런타임 오류",
      output_limit: "출력 초과",
      compile: "컴파일 오류",
      system: "시스템 오류",
    };

    cases.push({
      verdict,
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      statusDescription: statusMap[verdict] || verdict,
      timeMs,
      memoryKb: null, // 직접 실행 모드에서는 메모리 측정 불가
    });
  }

  return { compile, cases };
}

// ---------------------------------------------------------------------------
// Express 라우터
// ---------------------------------------------------------------------------
export const graderRouter = express.Router();

// 모든 채점 라우트에 세션 인증 적용
graderRouter.use(loadSession);
graderRouter.use((req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "로그인이 필요합니다." });
  next();
});

// 채점 가용 여부 체크 미들웨어
graderRouter.use((_req, res, next) => {
  if (!CONFIG.unsafeNoContainer && !dockerAvailable) {
    return res.status(503).json({ error: "채점 서비스를 사용할 수 없습니다. Docker가 설치되어 있지 않습니다." });
  }
  next();
});

// 레이트리밋 미들웨어
graderRouter.use((req, res, next) => {
  const key = req.user?.id ? `user:${req.user.id}` : `ip:${req.ip}`;
  if (!checkRateLimit(key)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "요청이 너무 많습니다. 1분 후 다시 시도해주세요." });
  }
  next();
});

// 바디 검증 헬퍼
function validateBody(body) {
  const { source, stdins } = body;
  if (typeof source !== "string" || Buffer.byteLength(source) > CONFIG.maxSourceBytes) {
    return `소스 코드가 너무 깁니다 (최대 ${CONFIG.maxSourceBytes / 1024}KB).`;
  }
  if (!Array.isArray(stdins)) return "stdins 배열이 필요합니다.";
  if (stdins.length > CONFIG.maxCases) return `테스트 케이스가 너무 많습니다 (최대 ${CONFIG.maxCases}개).`;
  for (const s of stdins) {
    if (typeof s === "string" && Buffer.byteLength(s) > CONFIG.maxStdinBytes) {
      return `stdin 입력이 너무 깁니다 (최대 ${CONFIG.maxStdinBytes / 1024}KB).`;
    }
  }
  return null;
}

// POST /api/grade/run — 실행만 (expected 비교 없음)
graderRouter.post("/run", async (req, res) => {
  const err = validateBody(req.body);
  if (err) return res.status(400).json({ error: err });

  const { source, stdins, cpuTimeLimit, memoryLimit } = req.body;

  // cpuTimeLimit, memoryLimit은 현재 CONFIG 전역 사용 (요청별 오버라이드 미지원)
  void cpuTimeLimit; void memoryLimit;

  let acquired = false;
  try {
    await acquireSemaphore();
    acquired = true;
    const result = await gradeMany({ source, stdins });
    res.json(result);
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({ error: e.message || "채점 중 오류가 발생했습니다." });
  } finally {
    if (acquired) releaseSemaphore();
  }
});

// 배터리 보상 규칙: 모든 케이스가 통과한 첫 채점에만 +10.
// problemId는 알려진 문제 풀(1~MAX_PROBLEM_ID) 내 정수여야 함.
//
// 멱등성: problem_awards (user_id, problem_id) PK가 단일 진리.
// 같은 문제를 다시 통과해도 ON CONFLICT DO NOTHING으로 grant 없음.
const GRANT_AMOUNT     = 10;
const MAX_PROBLEM_ID   = 1000;

function normalizeProblemId(raw) {
  if (raw == null) return null;
  const s = String(raw);
  if (!/^[0-9]+$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isInteger(n) || n < 1 || n > MAX_PROBLEM_ID) return null;
  return s;
}

async function grantBatteryIfFirstAC(userId, problemId) {
  if (!problemId) return { awarded: 0, balance: null };
  return await withTx(async (tx) => {
    await tx.ensureWallet.run(userId);
    const awardRow = await tx.insertProblemAward.get(userId, problemId, GRANT_AMOUNT);
    if (awardRow) {
      const balRow = await tx.incrementWallet.get(userId, GRANT_AMOUNT);
      return {
        awarded: GRANT_AMOUNT,
        balance: balRow ? Number(balRow.balance) : GRANT_AMOUNT,
      };
    }
    const w = await tx.getWallet.get(userId);
    return { awarded: 0, balance: w ? Number(w.balance) : 0 };
  });
}

// POST /api/grade/submit — 채점 (expected 비교 + hidden 마스킹 + 첫 AC grant)
graderRouter.post("/submit", async (req, res) => {
  const err = validateBody(req.body);
  if (err) return res.status(400).json({ error: err });

  const { source, stdins, expected, hidden, problemId, cpuTimeLimit, memoryLimit } = req.body;
  void cpuTimeLimit; void memoryLimit;

  const hiddenFlags = Array.isArray(hidden) ? hidden : stdins.map(() => false);
  const validProblemId = normalizeProblemId(problemId);

  let acquired = false;
  try {
    await acquireSemaphore();
    acquired = true;
    const result = await gradeMany({ source, stdins, expected });

    // 통계 계산
    let passed = 0;
    let firstFail = null;
    const maskedCases = result.cases.map((c, i) => {
      const isHidden = !!hiddenFlags[i];
      if (c.verdict === "ok") passed++;
      else if (firstFail === null) firstFail = i;

      if (isHidden) {
        // hidden 케이스: stdout·expected 마스킹, pass 여부만 노출
        return {
          verdict: c.verdict === "ok" ? "ok" : c.verdict,
          pass: c.verdict === "ok",
          statusDescription: c.statusDescription,
          timeMs: c.timeMs,
          memoryKb: c.memoryKb,
          // stdout/stderr/expected 노출 안 함
        };
      }
      return c;
    });

    // 전 케이스 통과 + 알려진 problemId일 때만 grant 시도.
    // 실패 시에도 grant 없음 (compile.ok===false면 passed=0이라 자연히 통과).
    let awarded = 0;
    let balance = null;
    if (
      passed === stdins.length &&
      stdins.length > 0 &&
      result.compile?.ok !== false &&
      validProblemId
    ) {
      try {
        const grant = await grantBatteryIfFirstAC(req.user.id, validProblemId);
        awarded = grant.awarded;
        balance = grant.balance;
      } catch (gErr) {
        // grant 실패는 채점 결과에 영향 주지 않음. 로그만.
        console.error("[grader] grant failed", gErr);
      }
    }

    res.json({
      compile: result.compile,
      passed,
      total: stdins.length,
      firstFail,
      cases: maskedCases,
      awarded,
      balance,
    });
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({ error: e.message || "채점 중 오류가 발생했습니다." });
  } finally {
    if (acquired) releaseSemaphore();
  }
});

// ---------------------------------------------------------------------------
// 모듈 초기화 (Docker 가용성 비동기 확인)
// ---------------------------------------------------------------------------
(async () => {
  if (CONFIG.unsafeNoContainer) {
    console.log("[grader] GRADER_UNSAFE_NOCONTAINER=1 — 직접 실행 모드 (개발 전용)");
    dockerAvailable = false; // 직접 실행이므로 docker 체크 불필요
  } else {
    dockerAvailable = await checkDocker();
    if (dockerAvailable) {
      console.log(`[grader] Docker 가용 — 이미지: ${CONFIG.dockerImage}`);
    } else {
      console.warn("[grader] Docker를 사용할 수 없습니다. /api/grade/* 는 503을 반환합니다.");
      console.warn("[grader] 개발 환경에서는 GRADER_UNSAFE_NOCONTAINER=1 을 설정하세요.");
    }
  }
})();
