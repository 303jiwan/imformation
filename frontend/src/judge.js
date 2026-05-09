/* =====================================================================
   Judge0 CE client (RapidAPI hosted version).

   Sends C source + stdin to Judge0, returns a normalized result.
   Reads credentials from Vite env vars (set in `.env.local` or `.env`):
     VITE_JUDGE0_KEY   = <your RapidAPI key>
     VITE_JUDGE0_HOST  = judge0-ce.p.rapidapi.com   (default if unset)

   ⚠️  In a production build the key is bundled into client JS — anyone
   loading the page can read it. For a class/demo this is acceptable;
   for public deployment, put a thin server proxy in front and remove
   the key from the frontend bundle.

   The free RapidAPI tier is ~50 calls/day. We minimize calls by:
     - Running visible test cases only (3 per problem) on "코드 실행"
     - Sampling representative inputs on "제출 및 채점" (≤10 per problem)
     - Short-circuiting the case loop on compile errors (1 call covers all)
   ===================================================================== */

const KEY  = import.meta.env.VITE_JUDGE0_KEY  || "";
const HOST = import.meta.env.VITE_JUDGE0_HOST || "judge0-ce.p.rapidapi.com";

// base64_encoded=true is required: GCC's compile-error output contains bytes
// that aren't valid UTF-8 (column carets, terminal control chars), and Judge0
// rejects the submission with HTTP 400 unless we use the encoded path.
const ENDPOINT = `https://${HOST}/submissions?base64_encoded=true&wait=true`;

// Judge0 language id 50 = C (GCC 9.2.0). Stable for years.
const LANGUAGE_ID_C = 50;

/** UTF-8 safe base64 encoder (btoa only handles Latin-1). */
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str ?? "");
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/** UTF-8 safe base64 decoder. Returns "" for null/undefined/empty. */
function base64ToUtf8(b64) {
  if (!b64) return "";
  try {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch (_) {
    return "";
  }
}

/** Whether a Judge0 key is configured. Caller can branch to mock if not. */
export const judgeAvailable = Boolean(KEY);

/**
 * Status codes Judge0 can return. We collapse them into a small set the
 * UI cares about: pass / wrong / compile / runtime / tle / system.
 * Reference: https://ce.judge0.com/statuses
 */
const STATUS = {
  3:  "accepted",          // matches expected (we don't use Judge0's expected_output, but kept for completeness)
  4:  "wrong",
  5:  "tle",               // time limit exceeded
  6:  "compile",
  7:  "runtime",           // SIGSEGV
  8:  "runtime",           // SIGXFSZ
  9:  "runtime",           // SIGFPE
  10: "runtime",           // SIGABRT
  11: "runtime",           // NZEC (non-zero exit)
  12: "runtime",           // other runtime
  13: "system",            // internal error
  14: "system",            // exec format error
};

/**
 * Normalized run result. Caller compares `stdout` against the expected
 * output computed from the JS reference solver.
 *
 * @typedef {Object} RunResult
 * @property {"ok"|"wrong"|"compile"|"runtime"|"tle"|"system"|"network"} verdict
 * @property {string} stdout
 * @property {string} stderr
 * @property {string} compileOutput
 * @property {string} statusDescription
 * @property {number|null} timeMs
 * @property {number|null} memoryKb
 */

/**
 * Compile + run a C program with a single stdin payload.
 *
 * @param {string} sourceCode  - full C source (include directives, main, etc.)
 * @param {string} stdin       - data piped to scanf
 * @param {{ cpuTimeLimit?: number, memoryLimit?: number }} [opts]
 * @returns {Promise<RunResult>}
 */
export async function runC(sourceCode, stdin, opts = {}) {
  if (!KEY) {
    // Caller is expected to short-circuit on `judgeAvailable` first; this is
    // a safety net so a missing key surfaces obviously rather than silently.
    throw new Error("Judge0 key not configured. Set VITE_JUDGE0_KEY in .env.local.");
  }

  const body = {
    source_code: utf8ToBase64(sourceCode),
    language_id: LANGUAGE_ID_C,
    stdin: utf8ToBase64(stdin ?? ""),
    cpu_time_limit: opts.cpuTimeLimit ?? 2,        // seconds
    memory_limit:   opts.memoryLimit   ?? 128000,  // KB (128 MB)
    redirect_stderr_to_stdout: false,
  };

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key":  KEY,
        "X-RapidAPI-Host": HOST,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return {
      verdict: "network",
      stdout: "", stderr: "", compileOutput: "",
      statusDescription: `네트워크 오류: ${err?.message || err}`,
      timeMs: null, memoryKb: null,
    };
  }

  if (!res.ok) {
    let text = "";
    try { text = await res.text(); } catch (_) {}
    return {
      verdict: "network",
      stdout: "", stderr: "", compileOutput: "",
      statusDescription: `Judge0 ${res.status}: ${text || res.statusText}`,
      timeMs: null, memoryKb: null,
    };
  }

  /** @type {{stdout: string|null, stderr: string|null, compile_output: string|null,
   *          status: { id: number, description: string }, time: string|null,
   *          memory: number|null}} */
  const data = await res.json();

  // Outputs are returned base64-encoded since we sent base64_encoded=true.
  const stdout        = base64ToUtf8(data.stdout);
  const stderr        = base64ToUtf8(data.stderr);
  const compileOutput = base64ToUtf8(data.compile_output);

  const verdict =
    compileOutput && data.status?.id === 6 ? "compile" :
    STATUS[data.status?.id] || "system";

  return {
    verdict,
    stdout,
    stderr,
    compileOutput,
    statusDescription: data.status?.description || "Unknown",
    timeMs:   data.time   ? Math.round(parseFloat(data.time) * 1000) : null,
    memoryKb: typeof data.memory === "number" ? data.memory : null,
  };
}

/** Trim trailing whitespace/newlines so stdout-vs-expected comparisons are
 *  forgiving of `printf("%d\n", ...)` vs reference output without `\n`. */
export function normalizeOutput(s) {
  return String(s ?? "").replace(/\s+$/g, "");
}

/**
 * Build a small representative sample of A values for "제출 및 채점".
 * The full A range can be huge (e.g. 1..10000), which would burn through
 * the free RapidAPI tier in a single submission. 10 carefully-chosen
 * samples (boundaries + spread + a few randoms) is plenty for grading.
 */
export function gradingSample(problem, count = 10) {
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
