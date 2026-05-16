/* =====================================================================
   자체 채점기 클라이언트.

   백엔드 /api/grade/* 엔드포인트로 C 코드를 전송하고 채점 결과를 받습니다.
   Judge0 (RapidAPI) 의존을 완전히 제거하였습니다.

   verdict 표준:
     "ok" | "wrong" | "tle" | "runtime" | "compile" | "system" | "output_limit"

   환경변수:
     VITE_API_BASE  — 백엔드 URL (기본: http://localhost:3000)
   ===================================================================== */

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

// 채점 서비스 가용 여부 (503 수신 시 false로 전환)
let _judgeAvailable = true;

/** 채점 서비스가 현재 사용 가능한지 반환합니다. */
export function judgeAvailable() { return _judgeAvailable; }

/**
 * C 소스를 여러 stdin으로 한 번에 실행합니다 (expected 비교 없음).
 *
 * @param {string} source  — 전체 C 소스코드
 * @param {string[]} stdins — 각 케이스에 전달할 stdin 배열
 * @param {{ cpuTimeLimit?: number, memoryLimit?: number }} [opts]
 * @returns {Promise<{ compile: {ok:boolean, output:string}, cases: CaseResult[] }>}
 */
export async function runCMany(source, stdins, { cpuTimeLimit, memoryLimit } = {}) {
  const res = await fetch(`${API_BASE}/api/grade/run`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, stdins, cpuTimeLimit, memoryLimit }),
  });
  if (res.status === 503) {
    _judgeAvailable = false;
    throw new Error("grader unavailable");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `grader ${res.status}`);
  }
  return await res.json();
}

/**
 * C 소스를 여러 케이스로 채점합니다 (expected 비교 + hidden 마스킹).
 *
 * @param {string} source
 * @param {{ stdin: string, expected: string, hidden?: boolean }[]} casesPlan
 * @param {{ cpuTimeLimit?: number, memoryLimit?: number }} [opts]
 * @returns {Promise<{ compile, passed, total, firstFail?, cases? }>}
 */
export async function submitCMany(source, casesPlan, { cpuTimeLimit, memoryLimit } = {}) {
  const res = await fetch(`${API_BASE}/api/grade/submit`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source,
      stdins:   casesPlan.map((c) => c.stdin),
      expected: casesPlan.map((c) => c.expected),
      hidden:   casesPlan.map((c) => !!c.hidden),
      cpuTimeLimit,
      memoryLimit,
    }),
  });
  if (res.status === 503) {
    _judgeAvailable = false;
    throw new Error("grader unavailable");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `grader ${res.status}`);
  }
  return await res.json();
}

/**
 * C 소스를 stdin 하나로 실행합니다 (단일 케이스 호환 래퍼).
 * 기존 judge.js의 runC 시그니처를 유지합니다.
 *
 * @param {string} source
 * @param {string} stdin
 * @param {{ cpuTimeLimit?: number, memoryLimit?: number }} [opts]
 * @returns {Promise<RunResult>}
 */
export async function runC(source, stdin, opts = {}) {
  const out = await runCMany(source, [stdin ?? ""], opts);
  const c = out.cases?.[0] || {};
  return {
    verdict:           out.compile?.ok === false ? "compile" : (c.verdict || "system"),
    stdout:            c.stdout            || "",
    stderr:            c.stderr            || "",
    compileOutput:     out.compile?.output || "",
    statusDescription: c.statusDescription || "",
    timeMs:            c.timeMs   ?? null,
    memoryKb:          c.memoryKb ?? null,
  };
}

/** 후행 공백/개행을 제거하여 출력 비교를 관대하게 만듭니다. */
export function normalizeOutput(s) {
  return String(s ?? "").replace(/\s+$/g, "");
}

/**
 * "제출 및 채점"용 대표 A값 샘플을 생성합니다.
 * aMin..aMax 범위에서 count개를 경계값·고정 비율·랜덤으로 선택합니다.
 */
export function gradingSample(problem, count = 100) {
  const { aMin, aMax } = problem;
  const span = aMax - aMin;
  if (span <= 0) return [aMin];
  if (span + 1 <= count) {
    const arr = [];
    for (let A = aMin; A <= aMax; A++) arr.push(A);
    return arr;
  }
  const samples = new Set([aMin, aMax, Math.floor((aMin + aMax) / 2)]);
  const fixedSpread = [0.1, 0.25, 0.4, 0.6, 0.75, 0.9];
  for (const f of fixedSpread) {
    samples.add(Math.round(aMin + span * f));
    if (samples.size >= count) break;
  }
  while (samples.size < count) {
    samples.add(aMin + Math.floor(Math.random() * (span + 1)));
  }
  return Array.from(samples).sort((a, b) => a - b);
}
