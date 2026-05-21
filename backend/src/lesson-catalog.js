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

CATALOG["t0-ch1-1"] = {
  trail: 0, ch: 1, no: 1, prereq: null,
  problems: {
    "t0-ch1-1-b1": { kind: "basic",    expected: "Hello\n",       input: "", judge0Lang: "c" },
    "t0-ch1-1-p1": { kind: "practice", expected: "Hello\nWorld\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t0-ch1-2"] = {
  trail: 0, ch: 1, no: 2, prereq: "t0-ch1-1",
  problems: {
    "t0-ch1-2-b1": { kind: "basic",    expected: "20\n",   input: "", judge0Lang: "c" },
    "t0-ch1-2-p1": { kind: "practice", expected: "1\n2\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t0-ch1-3"] = {
  trail: 0, ch: 1, no: 3, prereq: "t0-ch1-2",
  problems: {
    "t0-ch1-3-b1": { kind: "basic",    expected: "7\n",    input: "", judge0Lang: "c" },
    "t0-ch1-3-p1": { kind: "practice", expected: "3.14\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t0-ch1-4"] = {
  trail: 0, ch: 1, no: 4, prereq: "t0-ch1-3",
  problems: {
    "t0-ch1-4-b1": { kind: "basic",    expected: "8\n",  input: "", judge0Lang: "c" },
    "t0-ch1-4-p1": { kind: "practice", expected: "24\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t0-ch2-1"] = {
  trail: 0, ch: 2, no: 1, prereq: "t0-ch1-4",
  problems: {
    "t0-ch2-1-b1": { kind: "basic",    expected: "Codenergy\n",  input: "", judge0Lang: "c" },
    "t0-ch2-1-p1": { kind: "practice", expected: "Hello\nWorld\n", input: "", judge0Lang: "c" },
  },
};

CATALOG["t0-ch2-2"] = {
  trail: 0, ch: 2, no: 2, prereq: "t0-ch2-1",
  problems: {
    "t0-ch2-2-b1": { kind: "basic",    expected: "5\n",   input: "5\n", judge0Lang: "c" },
    "t0-ch2-2-p1": { kind: "practice", expected: "7\n7\n", input: "7\n", judge0Lang: "c" },
  },
};

CATALOG["t0-ch2-3"] = {
  trail: 0, ch: 2, no: 3, prereq: "t0-ch2-2",
  problems: {
    "t0-ch2-3-b1": { kind: "basic",    expected: "8\n",   input: "3 5\n", judge0Lang: "c" },
    "t0-ch2-3-p1": { kind: "practice", expected: "1\n2\n", input: "1 2\n", judge0Lang: "c" },
  },
};

CATALOG["t0-ch2-4"] = {
  trail: 0, ch: 2, no: 4, prereq: "t0-ch2-3",
  problems: {
    "t0-ch2-4-b1": { kind: "basic",    expected: "12\n", input: "3 4\n",  judge0Lang: "c" },
    "t0-ch2-4-p1": { kind: "practice", expected: "7\n",  input: "10 3\n", judge0Lang: "c" },
  },
};

// --- Ch 3. 조건문 1 ---

CATALOG["t0-ch3-1"] = {
  trail: 0, ch: 3, no: 1, prereq: "t0-ch2-4",
  problems: {
    "t0-ch3-1-b1": { kind: "basic",    expected: "positive\n", input: "5\n",  judge0Lang: "c" },
    "t0-ch3-1-p1": { kind: "practice", expected: "even\n",     input: "4\n",  judge0Lang: "c" },
  },
};

CATALOG["t0-ch3-2"] = {
  trail: 0, ch: 3, no: 2, prereq: "t0-ch3-1",
  problems: {
    "t0-ch3-2-b1": { kind: "basic",    expected: "positive\n", input: "3\n",   judge0Lang: "c" },
    "t0-ch3-2-p1": { kind: "practice", expected: "7\n",        input: "3 7\n", judge0Lang: "c" },
  },
};

// --- Ch 3 (continued). if/else, switch ---

CATALOG["t0-ch3-3"] = {
  trail: 0, ch: 3, no: 3, prereq: "t0-ch3-2",
  problems: {
    "t0-ch3-3-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "positive\n", input: "5\n",
      cases: [
        { input: "5\n",  expected: "positive\n", public: true  },
        { input: "-3\n", expected: "negative\n", public: false },
        { input: "0\n",  expected: "zero\n",     public: false },
      ],
    },
    "t0-ch3-3-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "pass\n", input: "75\n",
      cases: [
        { input: "75\n", expected: "pass\n", public: true  },
        { input: "59\n", expected: "fail\n", public: false },
        { input: "60\n", expected: "pass\n", public: false },
      ],
    },
  },
};

CATALOG["t0-ch3-4"] = {
  trail: 0, ch: 3, no: 4, prereq: "t0-ch3-3",
  problems: {
    "t0-ch3-4-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "Wed\n", input: "3\n",
      cases: [
        { input: "3\n", expected: "Wed\n", public: true  },
        { input: "1\n", expected: "Mon\n", public: false },
        { input: "7\n", expected: "Sun\n", public: false },
      ],
    },
    "t0-ch3-4-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "B\n", input: "2\n",
      cases: [
        { input: "2\n", expected: "B\n", public: true  },
        { input: "1\n", expected: "A\n", public: false },
        { input: "5\n", expected: "F\n", public: false },
      ],
    },
  },
};

// --- Ch 4. 반복문 ---

CATALOG["t0-ch4-1"] = {
  trail: 0, ch: 4, no: 1, prereq: "t0-ch3-4",
  problems: {
    "t0-ch4-1-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "15\n", input: "5\n",
      cases: [
        { input: "5\n",  expected: "15\n", public: true  },
        { input: "1\n",  expected: "1\n",  public: false },
        { input: "10\n", expected: "55\n", public: false },
      ],
    },
    "t0-ch4-1-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "1\n2\n3\n", input: "3\n",
      cases: [
        { input: "3\n", expected: "1\n2\n3\n",         public: true  },
        { input: "1\n", expected: "1\n",                public: false },
        { input: "5\n", expected: "1\n2\n3\n4\n5\n",   public: false },
      ],
    },
  },
};

CATALOG["t0-ch4-2"] = {
  trail: 0, ch: 4, no: 2, prereq: "t0-ch4-1",
  problems: {
    "t0-ch4-2-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "10\n", input: "4\n",
      cases: [
        { input: "4\n",   expected: "10\n",   public: true  },
        { input: "1\n",   expected: "1\n",    public: false },
        { input: "100\n", expected: "5050\n", public: false },
      ],
    },
    "t0-ch4-2-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "3\n2\n1\n", input: "3\n",
      cases: [
        { input: "3\n", expected: "3\n2\n1\n",         public: true  },
        { input: "1\n", expected: "1\n",                public: false },
        { input: "5\n", expected: "5\n4\n3\n2\n1\n",   public: false },
      ],
    },
  },
};

CATALOG["t0-ch4-3"] = {
  trail: 0, ch: 4, no: 3, prereq: "t0-ch4-2",
  problems: {
    "t0-ch4-3-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "7\n", input: "7\n",
      cases: [
        { input: "7\n",  expected: "7\n",  public: true  },
        { input: "1\n",  expected: "1\n",  public: false },
        { input: "42\n", expected: "42\n", public: false },
      ],
    },
    "t0-ch4-3-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "3\n2\n1\nGO\n", input: "3\n",
      cases: [
        { input: "3\n", expected: "3\n2\n1\nGO\n",         public: true  },
        { input: "1\n", expected: "1\nGO\n",                public: false },
        { input: "5\n", expected: "5\n4\n3\n2\n1\nGO\n",   public: false },
      ],
    },
  },
};

CATALOG["t0-ch4-4"] = {
  trail: 0, ch: 4, no: 4, prereq: "t0-ch4-3",
  problems: {
    "t0-ch4-4-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "*\n**\n***\n****\n", input: "4\n",
      cases: [
        { input: "4\n", expected: "*\n**\n***\n****\n",                    public: true  },
        { input: "1\n", expected: "*\n",                                    public: false },
        { input: "6\n", expected: "*\n**\n***\n****\n*****\n******\n",     public: false },
      ],
    },
    "t0-ch4-4-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "****\n***\n**\n*\n", input: "4\n",
      cases: [
        { input: "4\n", expected: "****\n***\n**\n*\n",             public: true  },
        { input: "1\n", expected: "*\n",                             public: false },
        { input: "5\n", expected: "*****\n****\n***\n**\n*\n",      public: false },
      ],
    },
  },
};

// --- Ch 5. 배열 ---

CATALOG["t0-ch5-1"] = {
  trail: 0, ch: 5, no: 1, prereq: "t0-ch4-4",
  problems: {
    "t0-ch5-1-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "10\n", input: "10 20 30 40 50\n",
      cases: [
        { input: "10 20 30 40 50\n",  expected: "10\n",  public: true  },
        { input: "7 8 9 1 2\n",       expected: "7\n",   public: false },
        { input: "100 0 0 0 0\n",     expected: "100\n", public: false },
      ],
    },
    "t0-ch5-1-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "50\n", input: "10 20 30 40 50\n",
      cases: [
        { input: "10 20 30 40 50\n", expected: "50\n", public: true  },
        { input: "1 2 3 4 99\n",     expected: "99\n", public: false },
        { input: "5 4 3 2 1\n",      expected: "1\n",  public: false },
      ],
    },
  },
};

CATALOG["t0-ch5-2"] = {
  trail: 0, ch: 5, no: 2, prereq: "t0-ch5-1",
  problems: {
    "t0-ch5-2-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "1\n2\n3\n4\n5\n", input: "1 2 3 4 5\n",
      cases: [
        { input: "1 2 3 4 5\n",   expected: "1\n2\n3\n4\n5\n",   public: true  },
        { input: "10 9 8 7 6\n",  expected: "10\n9\n8\n7\n6\n",  public: false },
        { input: "0 0 0 0 0\n",   expected: "0\n0\n0\n0\n0\n",   public: false },
      ],
    },
    "t0-ch5-2-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "5\n4\n3\n2\n1\n", input: "1 2 3 4 5\n",
      cases: [
        { input: "1 2 3 4 5\n",   expected: "5\n4\n3\n2\n1\n",   public: true  },
        { input: "10 9 8 7 6\n",  expected: "6\n7\n8\n9\n10\n",  public: false },
        { input: "1 1 2 2 3\n",   expected: "3\n2\n2\n1\n1\n",   public: false },
      ],
    },
  },
};

CATALOG["t0-ch5-3"] = {
  trail: 0, ch: 5, no: 3, prereq: "t0-ch5-2",
  problems: {
    "t0-ch5-3-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "10\n", input: "1 2 3 4\n",
      cases: [
        { input: "1 2 3 4\n",  expected: "10\n", public: true  },
        { input: "0 0 0 0\n",  expected: "0\n",  public: false },
        { input: "5 5 5 5\n",  expected: "20\n", public: false },
      ],
    },
    "t0-ch5-3-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "5\n", input: "1 2 3 4\n",
      cases: [
        { input: "1 2 3 4\n",   expected: "5\n",  public: true  },
        { input: "10 0 0 10\n", expected: "20\n", public: false },
        { input: "3 7 5 9\n",   expected: "12\n", public: false },
      ],
    },
  },
};

CATALOG["t0-ch5-4"] = {
  trail: 0, ch: 5, no: 4, prereq: "t0-ch5-3",
  problems: {
    "t0-ch5-4-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "9\n", input: "3 7 1 9 5\n",
      cases: [
        { input: "3 7 1 9 5\n",    expected: "9\n",  public: true  },
        { input: "1 1 1 1 1\n",    expected: "1\n",  public: false },
        { input: "10 20 30 5 25\n", expected: "30\n", public: false },
      ],
    },
    "t0-ch5-4-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "30\n", input: "10 20 30 40 50\n",
      cases: [
        { input: "10 20 30 40 50\n", expected: "30\n", public: true  },
        { input: "1 2 3 4 5\n",      expected: "3\n",  public: false },
        { input: "0 0 0 0 100\n",    expected: "20\n", public: false },
      ],
    },
  },
};

// --- Ch 6. 문자/문자열 ---

CATALOG["t0-ch6-1"] = {
  trail: 0, ch: 6, no: 1, prereq: "t0-ch5-4",
  problems: {
    "t0-ch6-1-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "A\n", input: "A\n",
      cases: [
        { input: "A\n", expected: "A\n", public: true  },
        { input: "z\n", expected: "z\n", public: false },
        { input: "!\n", expected: "!\n", public: false },
      ],
    },
    "t0-ch6-1-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "hello\n", input: "hello\n",
      cases: [
        { input: "hello\n", expected: "hello\n", public: true  },
        { input: "world\n", expected: "world\n", public: false },
        { input: "C\n",     expected: "C\n",     public: false },
      ],
    },
  },
};

CATALOG["t0-ch6-2"] = {
  trail: 0, ch: 6, no: 2, prereq: "t0-ch6-1",
  problems: {
    "t0-ch6-2-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "hibye\n", input: "hi bye\n",
      cases: [
        { input: "hi bye\n",      expected: "hibye\n",      public: true  },
        { input: "hello world\n", expected: "helloworld\n", public: false },
        { input: "a b\n",         expected: "ab\n",         public: false },
      ],
    },
    "t0-ch6-2-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "hi\nhi\n", input: "hi\n",
      cases: [
        { input: "hi\n",    expected: "hi\nhi\n",       public: true  },
        { input: "hello\n", expected: "hello\nhello\n", public: false },
        { input: "C\n",     expected: "C\nC\n",         public: false },
      ],
    },
  },
};

CATALOG["t0-ch6-3"] = {
  trail: 0, ch: 6, no: 3, prereq: "t0-ch6-2",
  problems: {
    "t0-ch6-3-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "5\n", input: "hello\n",
      cases: [
        { input: "hello\n",     expected: "5\n", public: true  },
        { input: "hi\n",        expected: "2\n", public: false },
        { input: "codenergy\n", expected: "9\n", public: false },
      ],
    },
    "t0-ch6-3-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "5\n", input: "hi bye\n",
      cases: [
        { input: "hi bye\n",      expected: "5\n",  public: true  },
        { input: "a b\n",         expected: "2\n",  public: false },
        { input: "hello world\n", expected: "10\n", public: false },
      ],
    },
  },
};

CATALOG["t0-ch6-4"] = {
  trail: 0, ch: 6, no: 4, prereq: "t0-ch6-3",
  problems: {
    "t0-ch6-4-b1": {
      kind: "basic", judge0Lang: "c",
      expected: "same\n", input: "hi hi\n",
      cases: [
        { input: "hi hi\n",  expected: "same\n", public: true  },
        { input: "hi bye\n", expected: "diff\n", public: false },
        { input: "C C\n",    expected: "same\n", public: false },
      ],
    },
    "t0-ch6-4-p1": {
      kind: "practice", judge0Lang: "c",
      expected: "yes\n", input: "hello\n",
      cases: [
        { input: "hello\n", expected: "yes\n", public: true  },
        { input: "world\n", expected: "no\n",  public: false },
        { input: "Hello\n", expected: "no\n",  public: false },
      ],
    },
  },
};

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

// --- Ch 3. 연산자 ---

CATALOG["t1-ch3-1"] = {
  trail: 1, ch: 3, no: 1, prereq: "t1-ch2-6",
  problems: {
    "t1-ch3-1-b1": { kind: "basic",    expected: "8\n",  input: "3 5",  judge0Lang: "c" },
    "t1-ch3-1-p1": { kind: "practice", expected: "1\n",  input: "10 3", judge0Lang: "c" },
  },
};

CATALOG["t1-ch3-2"] = {
  trail: 1, ch: 3, no: 2, prereq: "t1-ch3-1",
  problems: {
    "t1-ch3-2-b1": { kind: "basic",    expected: "1\n", input: "3 5", judge0Lang: "c" },
    "t1-ch3-2-p1": { kind: "practice", expected: "1\n", input: "4 4", judge0Lang: "c" },
  },
};

CATALOG["t1-ch3-3"] = {
  trail: 1, ch: 3, no: 3, prereq: "t1-ch3-2",
  problems: {
    "t1-ch3-3-b1": { kind: "basic",    expected: "0\n", input: "1 0", judge0Lang: "c" },
    "t1-ch3-3-p1": { kind: "practice", expected: "1\n", input: "0 1", judge0Lang: "c" },
  },
};

CATALOG["t1-ch3-4"] = {
  trail: 1, ch: 3, no: 4, prereq: "t1-ch3-3",
  problems: {
    "t1-ch3-4-b1": { kind: "basic",    expected: "1\n7\n", input: "5 3", judge0Lang: "c" },
    "t1-ch3-4-p1": { kind: "practice", expected: "6\n",    input: "5 3", judge0Lang: "c" },
  },
};

// --- Ch 4. 단순 반복문 ---

CATALOG["t1-ch4-1"] = {
  trail: 1, ch: 4, no: 1, prereq: "t1-ch3-4",
  problems: {
    "t1-ch4-1-b1": { kind: "basic",    expected: "15\n",      input: "5", judge0Lang: "c" },
    "t1-ch4-1-p1": { kind: "practice", expected: "1\n2\n3\n", input: "3", judge0Lang: "c" },
  },
};

CATALOG["t1-ch4-2"] = {
  trail: 1, ch: 4, no: 2, prereq: "t1-ch4-1",
  problems: {
    "t1-ch4-2-b1": { kind: "basic",    expected: "10\n",      input: "4", judge0Lang: "c" },
    "t1-ch4-2-p1": { kind: "practice", expected: "3\n2\n1\n", input: "3", judge0Lang: "c" },
  },
};

CATALOG["t1-ch4-3"] = {
  trail: 1, ch: 4, no: 3, prereq: "t1-ch4-2",
  problems: {
    "t1-ch4-3-b1": { kind: "basic",    expected: "12\n", input: "6", judge0Lang: "c" },
    "t1-ch4-3-p1": { kind: "practice", expected: "12\n", input: "6", judge0Lang: "c" },
  },
};

CATALOG["t1-ch4-4"] = {
  trail: 1, ch: 4, no: 4, prereq: "t1-ch4-3",
  problems: {
    "t1-ch4-4-b1": { kind: "basic",    expected: "7\n",      input: "7", judge0Lang: "c" },
    "t1-ch4-4-p1": { kind: "practice", expected: "3\n2\n1\n", input: "3", judge0Lang: "c" },
  },
};

// --- Ch 5. 다중 반복문 ---

CATALOG["t1-ch5-1"] = {
  trail: 1, ch: 5, no: 1, prereq: "t1-ch4-4",
  problems: {
    "t1-ch5-1-b1": { kind: "basic",    expected: "1 1\n1 2\n2 1\n2 2\n", input: "2 2", judge0Lang: "c" },
    "t1-ch5-1-p1": { kind: "practice", expected: "1\n2\n3\n2\n4\n6\n",   input: "2 3", judge0Lang: "c" },
  },
};

CATALOG["t1-ch5-2"] = {
  trail: 1, ch: 5, no: 2, prereq: "t1-ch5-1",
  problems: {
    "t1-ch5-2-b1": { kind: "basic",    expected: "*\n**\n***\n",   input: "3", judge0Lang: "c" },
    "t1-ch5-2-p1": { kind: "practice", expected: "***\n**\n*\n",   input: "3", judge0Lang: "c" },
  },
};

CATALOG["t1-ch5-3"] = {
  trail: 1, ch: 5, no: 3, prereq: "t1-ch5-2",
  problems: {
    "t1-ch5-3-b1": { kind: "basic",    expected: "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18\n", input: "2", judge0Lang: "c" },
    "t1-ch5-3-p1": { kind: "practice", expected: "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18\n3 * 1 = 3\n3 * 2 = 6\n3 * 3 = 9\n3 * 4 = 12\n3 * 5 = 15\n3 * 6 = 18\n3 * 7 = 21\n3 * 8 = 24\n3 * 9 = 27\n", input: "3", judge0Lang: "c" },
  },
};

// --- Ch 6. 1차원 배열 ---

CATALOG["t1-ch6-1"] = {
  trail: 1, ch: 6, no: 1, prereq: "t1-ch5-3",
  problems: {
    "t1-ch6-1-b1": { kind: "basic",    expected: "10\n", input: "10 20 30 40 50", judge0Lang: "c" },
    "t1-ch6-1-p1": { kind: "practice", expected: "50\n", input: "10 20 30 40 50", judge0Lang: "c" },
  },
};

CATALOG["t1-ch6-2"] = {
  trail: 1, ch: 6, no: 2, prereq: "t1-ch6-1",
  problems: {
    "t1-ch6-2-b1": { kind: "basic",    expected: "4\n3\n2\n1\n", input: "4\n1 2 3 4", judge0Lang: "c" },
    "t1-ch6-2-p1": { kind: "practice", expected: "7\n2\n5\n",    input: "3\n7 2 5",   judge0Lang: "c" },
  },
};

CATALOG["t1-ch6-3"] = {
  trail: 1, ch: 6, no: 3, prereq: "t1-ch6-2",
  problems: {
    "t1-ch6-3-b1": { kind: "basic",    expected: "15\n", input: "5\n1 2 3 4 5", judge0Lang: "c" },
    "t1-ch6-3-p1": { kind: "practice", expected: "9\n",  input: "5\n1 2 3 4 5", judge0Lang: "c" },
  },
};

CATALOG["t1-ch6-4"] = {
  trail: 1, ch: 6, no: 4, prereq: "t1-ch6-3",
  problems: {
    "t1-ch6-4-b1": { kind: "basic",    expected: "5 1\n", input: "5\n3 1 4 1 5", judge0Lang: "c" },
    "t1-ch6-4-p1": { kind: "practice", expected: "2\n",   input: "5\n3 1 5 2 5", judge0Lang: "c" },
  },
};

// --- Ch 7. 2차원 배열 ---

CATALOG["t1-ch7-1"] = {
  trail: 1, ch: 7, no: 1, prereq: "t1-ch6-4",
  problems: {
    "t1-ch7-1-b1": { kind: "basic",    expected: "4\n", input: "1 2\n3 4", judge0Lang: "c" },
    "t1-ch7-1-p1": { kind: "practice", expected: "5\n", input: "1 2\n3 4", judge0Lang: "c" },
  },
};

CATALOG["t1-ch7-2"] = {
  trail: 1, ch: 7, no: 2, prereq: "t1-ch7-1",
  problems: {
    "t1-ch7-2-b1": { kind: "basic",    expected: "21\n",          input: "1 2 3\n4 5 6", judge0Lang: "c" },
    "t1-ch7-2-p1": { kind: "practice", expected: "1 2 3\n4 5 6\n", input: "1 2 3\n4 5 6", judge0Lang: "c" },
  },
};

CATALOG["t1-ch7-3"] = {
  trail: 1, ch: 7, no: 3, prereq: "t1-ch7-2",
  problems: {
    "t1-ch7-3-b1": { kind: "basic",    expected: "1 3\n2 4\n",         input: "1 2\n3 4",       judge0Lang: "c" },
    "t1-ch7-3-p1": { kind: "practice", expected: "1 4 7\n2 5 8\n3 6 9\n", input: "1 2 3\n4 5 6\n7 8 9", judge0Lang: "c" },
  },
};

// --- Ch 8. 문자열 ---

CATALOG["t1-ch8-1"] = {
  trail: 1, ch: 8, no: 1, prereq: "t1-ch7-3",
  problems: {
    "t1-ch8-1-b1": { kind: "basic",    expected: "hello\n",    input: "hello", judge0Lang: "c" },
    "t1-ch8-1-p1": { kind: "practice", expected: "hi\nhi\n",   input: "hi",    judge0Lang: "c" },
  },
};

CATALOG["t1-ch8-2"] = {
  trail: 1, ch: 8, no: 2, prereq: "t1-ch8-1",
  problems: {
    "t1-ch8-2-b1": { kind: "basic",    expected: "5\n", input: "hello",        judge0Lang: "c" },
    "t1-ch8-2-p1": { kind: "practice", expected: "5\n", input: "hi\nhello",    judge0Lang: "c" },
  },
};

CATALOG["t1-ch8-3"] = {
  trail: 1, ch: 8, no: 3, prereq: "t1-ch8-2",
  problems: {
    "t1-ch8-3-b1": { kind: "basic",    expected: "same\n", input: "abc\nabc", judge0Lang: "c" },
    "t1-ch8-3-p1": { kind: "practice", expected: "diff\n", input: "abc\ndef", judge0Lang: "c" },
  },
};

CATALOG["t1-ch8-4"] = {
  trail: 1, ch: 8, no: 4, prereq: "t1-ch8-3",
  problems: {
    "t1-ch8-4-b1": { kind: "basic",    expected: "olleh\n", input: "hello",   judge0Lang: "c" },
    "t1-ch8-4-p1": { kind: "practice", expected: "yes\n",   input: "racecar", judge0Lang: "c" },
  },
};

// === END Trail 1 ===

// ===== Trail 2 (Novice Mid — 프로그래밍 연습) =====

// --- Ch 1. 함수 ---

CATALOG["t2-ch1-1"] = {
  trail: 2, ch: 1, no: 1, prereq: null,
  problems: {
    "t2-ch1-1-b1": { kind: "basic",    expected: "Hi\nHi\n",             input: "",  judge0Lang: "c" },
    "t2-ch1-1-p1": { kind: "practice", expected: "----\n----\n----\n",   input: "",  judge0Lang: "c" },
  },
};

CATALOG["t2-ch1-2"] = {
  trail: 2, ch: 1, no: 2, prereq: "t2-ch1-1",
  problems: {
    "t2-ch1-2-b1": { kind: "basic",    expected: "7\n",  input: "-7\n", judge0Lang: "c" },
    "t2-ch1-2-p1": { kind: "practice", expected: "3\n",  input: "3 8\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch1-3"] = {
  trail: 2, ch: 1, no: 3, prereq: "t2-ch1-2",
  problems: {
    "t2-ch1-3-b1": { kind: "basic",    expected: "12\n", input: "6\n",  judge0Lang: "c" },
    "t2-ch1-3-p1": { kind: "practice", expected: "7 3\n", input: "3 7\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch1-4"] = {
  trail: 2, ch: 1, no: 4, prereq: "t2-ch1-3",
  problems: {
    "t2-ch1-4-b1": { kind: "basic",    expected: "42\n", input: "",  judge0Lang: "c" },
    "t2-ch1-4-p1": { kind: "practice", expected: "15\n", input: "",  judge0Lang: "c" },
  },
};

// --- Ch 2. 재귀함수 ---

CATALOG["t2-ch2-1"] = {
  trail: 2, ch: 2, no: 1, prereq: "t2-ch1-4",
  problems: {
    "t2-ch2-1-b1": { kind: "basic",    expected: "3\n2\n1\n",     input: "3\n", judge0Lang: "c" },
    "t2-ch2-1-p1": { kind: "practice", expected: "1\n2\n3\n4\n",  input: "4\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch2-2"] = {
  trail: 2, ch: 2, no: 2, prereq: "t2-ch2-1",
  problems: {
    "t2-ch2-2-b1": { kind: "basic",    expected: "120\n", input: "5\n", judge0Lang: "c" },
    "t2-ch2-2-p1": { kind: "practice", expected: "15\n",  input: "5\n", judge0Lang: "c" },
  },
};

// --- Ch 3. 정렬 ---

CATALOG["t2-ch3-1"] = {
  trail: 2, ch: 3, no: 1, prereq: "t2-ch2-2",
  problems: {
    "t2-ch3-1-b1": { kind: "basic",    expected: "1 2 3 4 5\n", input: "5 3 1 4 2\n", judge0Lang: "c" },
    "t2-ch3-1-p1": { kind: "practice", expected: "5 4 3 2 1\n", input: "5 3 1 4 2\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch3-2"] = {
  trail: 2, ch: 3, no: 2, prereq: "t2-ch3-1",
  problems: {
    "t2-ch3-2-b1": { kind: "basic",    expected: "3 7\n",    input: "3 7\n",    judge0Lang: "c" },
    "t2-ch3-2-p1": { kind: "practice", expected: "Alice 95\n", input: "Alice 95\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch3-3"] = {
  trail: 2, ch: 3, no: 3, prereq: "t2-ch3-2",
  problems: {
    "t2-ch3-3-b1": { kind: "basic",    expected: "2 50\n1 80\n3 90\n", input: "3\n1 80\n2 50\n3 90\n", judge0Lang: "c" },
    "t2-ch3-3-p1": { kind: "practice", expected: "3 90\n1 80\n2 50\n", input: "3\n1 80\n2 50\n3 90\n", judge0Lang: "c" },
  },
};

// --- Ch 5. 포인터 ---

CATALOG["t2-ch5-1"] = {
  trail: 2, ch: 5, no: 1, prereq: "t2-ch3-3",
  problems: {
    "t2-ch5-1-b1": { kind: "basic",    expected: "7 3\n",  input: "3 7\n", judge0Lang: "c" },
    "t2-ch5-1-p1": { kind: "practice", expected: "2\n",    input: "5 2 8\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch5-2"] = {
  trail: 2, ch: 5, no: 2, prereq: "t2-ch5-1",
  problems: {
    "t2-ch5-2-b1": { kind: "basic",    expected: "10\n", input: "5\n",   judge0Lang: "c" },
    "t2-ch5-2-p1": { kind: "practice", expected: "10\n", input: "4 6\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch5-3"] = {
  trail: 2, ch: 5, no: 3, prereq: "t2-ch5-2",
  problems: {
    "t2-ch5-3-b1": { kind: "basic",    expected: "20 10\n", input: "10 20\n", judge0Lang: "c" },
    "t2-ch5-3-p1": { kind: "practice", expected: "7\n",     input: "3 4\n",   judge0Lang: "c" },
  },
};

CATALOG["t2-ch5-4"] = {
  trail: 2, ch: 5, no: 4, prereq: "t2-ch5-3",
  problems: {
    "t2-ch5-4-b1": { kind: "basic",    expected: "1\n2\n3\n4\n5\n", input: "1 2 3 4 5\n", judge0Lang: "c" },
    "t2-ch5-4-p1": { kind: "practice", expected: "5\n4\n3\n2\n1\n", input: "1 2 3 4 5\n", judge0Lang: "c" },
  },
};

// --- Ch 6. 구조체 ---

CATALOG["t2-ch6-1"] = {
  trail: 2, ch: 6, no: 1, prereq: "t2-ch5-4",
  problems: {
    "t2-ch6-1-b1": { kind: "basic",    expected: "7\n",  input: "3 4\n", judge0Lang: "c" },
    "t2-ch6-1-p1": { kind: "practice", expected: "15\n", input: "5 3\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch6-2"] = {
  trail: 2, ch: 6, no: 2, prereq: "t2-ch6-1",
  problems: {
    "t2-ch6-2-b1": { kind: "basic",    expected: "8\n",  input: "6 2\n", judge0Lang: "c" },
    "t2-ch6-2-p1": { kind: "practice", expected: "90\n", input: "1 90\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch6-3"] = {
  trail: 2, ch: 6, no: 3, prereq: "t2-ch6-2",
  problems: {
    "t2-ch6-3-b1": { kind: "basic",    expected: "240\n", input: "3\n1 80\n2 70\n3 90\n", judge0Lang: "c" },
    "t2-ch6-3-p1": { kind: "practice", expected: "2\n",   input: "3\n1 80\n2 95\n3 70\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch6-4"] = {
  trail: 2, ch: 6, no: 4, prereq: "t2-ch6-3",
  problems: {
    "t2-ch6-4-b1": { kind: "basic",    expected: "42\n", input: "42\n",  judge0Lang: "c" },
    "t2-ch6-4-p1": { kind: "practice", expected: "15\n", input: "7 8\n", judge0Lang: "c" },
  },
};

// --- Ch 7. 동적 메모리 ---

CATALOG["t2-ch7-1"] = {
  trail: 2, ch: 7, no: 1, prereq: "t2-ch6-4",
  problems: {
    "t2-ch7-1-b1": { kind: "basic",    expected: "42\n", input: "42\n",  judge0Lang: "c" },
    "t2-ch7-1-p1": { kind: "practice", expected: "8\n",  input: "5 3\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch7-2"] = {
  trail: 2, ch: 7, no: 2, prereq: "t2-ch7-1",
  problems: {
    "t2-ch7-2-b1": { kind: "basic",    expected: "6\n", input: "3\n1 2 3\n",    judge0Lang: "c" },
    "t2-ch7-2-p1": { kind: "practice", expected: "0\n", input: "3\n10 20 30\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch7-3"] = {
  trail: 2, ch: 7, no: 3, prereq: "t2-ch7-2",
  problems: {
    "t2-ch7-3-b1": { kind: "basic",    expected: "7\nok\n",     input: "7\n",        judge0Lang: "c" },
    "t2-ch7-3-p1": { kind: "practice", expected: "6\nfreed\n",  input: "3\n1 2 3\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch7-4"] = {
  trail: 2, ch: 7, no: 4, prereq: "t2-ch7-3",
  problems: {
    "t2-ch7-4-b1": { kind: "basic",    expected: "10\n", input: "4\n1 2 3 4\n",  judge0Lang: "c" },
    "t2-ch7-4-p1": { kind: "practice", expected: "4\n",  input: "4\n3 1 4 2\n",  judge0Lang: "c" },
  },
};

// --- Ch 8. 파일 입출력 ---

CATALOG["t2-ch8-1"] = {
  trail: 2, ch: 8, no: 1, prereq: "t2-ch7-4",
  problems: {
    "t2-ch8-1-b1": { kind: "basic",    expected: "10\n", input: "5\n", judge0Lang: "c" },
    "t2-ch8-1-p1": { kind: "practice", expected: "12\n", input: "4\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch8-2"] = {
  trail: 2, ch: 8, no: 2, prereq: "t2-ch8-1",
  problems: {
    "t2-ch8-2-b1": { kind: "basic",    expected: "7\n",  input: "3 4\n", judge0Lang: "c" },
    "t2-ch8-2-p1": { kind: "practice", expected: "12\n", input: "3 4\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch8-3"] = {
  trail: 2, ch: 8, no: 3, prereq: "t2-ch8-2",
  problems: {
    "t2-ch8-3-b1": { kind: "basic",    expected: "3\n", input: "3\nabc", judge0Lang: "c" },
    "t2-ch8-3-p1": { kind: "practice", expected: "5\n", input: "Hello123\n", judge0Lang: "c" },
  },
};

CATALOG["t2-ch8-4"] = {
  trail: 2, ch: 8, no: 4, prereq: "t2-ch8-3",
  problems: {
    "t2-ch8-4-b1": { kind: "basic",    expected: "write\n",       input: "w\n", judge0Lang: "c" },
    "t2-ch8-4-p1": { kind: "practice", expected: "append-only\n", input: "a\n", judge0Lang: "c" },
  },
};

// === END Trail 2 ===

// ===== Trail 3 (자료구조 알고리즘) =====

// --- Ch 1. 시간, 공간복잡도 ---

CATALOG["t3-ch1-1"] = {
  trail: 3, ch: 1, no: 1, prereq: null,
  problems: {
    "t3-ch1-1-b1": { kind: "basic",    expected: "15\n", input: "5\n", judge0Lang: "c" },
    "t3-ch1-1-p1": { kind: "practice", expected: "24\n", input: "4\n", judge0Lang: "c" },
  },
};

CATALOG["t3-ch1-2"] = {
  trail: 3, ch: 1, no: 2, prereq: "t3-ch1-1",
  problems: {
    "t3-ch1-2-b1": { kind: "basic",    expected: "1000\n1000000\n", input: "1000\n",   judge0Lang: "c" },
    "t3-ch1-2-p1": { kind: "practice", expected: "faster\n",        input: "100 200\n", judge0Lang: "c" },
  },
};

CATALOG["t3-ch1-3"] = {
  trail: 3, ch: 1, no: 3, prereq: "t3-ch1-2",
  problems: {
    "t3-ch1-3-b1": { kind: "basic",    expected: "7\n", input: "7\n", judge0Lang: "c" },
    "t3-ch1-3-p1": { kind: "practice", expected: "9\n", input: "3\n", judge0Lang: "c" },
  },
};

CATALOG["t3-ch1-4"] = {
  trail: 3, ch: 1, no: 4, prereq: "t3-ch1-3",
  problems: {
    "t3-ch1-4-b1": { kind: "basic",    expected: "4\n",  input: "8\n", judge0Lang: "c" },
    "t3-ch1-4-p1": { kind: "practice", expected: "12\n", input: "2\n", judge0Lang: "c" },
  },
};

CATALOG["t3-ch1-5"] = {
  trail: 3, ch: 1, no: 5, prereq: "t3-ch1-4",
  problems: {
    "t3-ch1-5-b1": { kind: "basic",    expected: "4\n3\n2\n1\n", input: "4\n", judge0Lang: "c" },
    "t3-ch1-5-p1": { kind: "practice", expected: "8\n",           input: "6\n", judge0Lang: "c" },
  },
};

CATALOG["t3-ch1-6"] = {
  trail: 3, ch: 1, no: 6, prereq: "t3-ch1-5",
  problems: {
    "t3-ch1-6-b1": { kind: "basic",    expected: "10\n", input: "4\n1 2 3 4\n",   judge0Lang: "c" },
    "t3-ch1-6-p1": { kind: "practice", expected: "9\n",  input: "5\n3 7 1 9 4\n", judge0Lang: "c" },
  },
};

// --- Ch 2. 배열, 연결 리스트 ---

CATALOG["t3-ch2-1"] = {
  trail: 3, ch: 2, no: 1, prereq: "t3-ch1-6",
  problems: {
    "t3-ch2-1-b1": { kind: "basic",    expected: "5 4 3 2 1\n", input: "5\n1 2 3 4 5\n",  judge0Lang: "c" },
    "t3-ch2-1-p1": { kind: "practice", expected: "25\n",         input: "4\n10 20 30 40\n", judge0Lang: "c" },
  },
};

CATALOG["t3-ch2-2"] = {
  trail: 3, ch: 2, no: 2, prereq: "t3-ch2-1",
  problems: {
    "t3-ch2-2-b1": { kind: "basic",    expected: "60\n", input: "3\n10 20 30\n",   judge0Lang: "c" },
    "t3-ch2-2-p1": { kind: "practice", expected: "1\n",  input: "5\n4 2 7 1 9\n", judge0Lang: "c" },
  },
};

CATALOG["t3-ch2-3"] = {
  trail: 3, ch: 2, no: 3, prereq: "t3-ch2-2",
  problems: {
    "t3-ch2-3-b1": { kind: "basic",    expected: "40\n",  input: "4\n10 20 30 40\n", judge0Lang: "c" },
    "t3-ch2-3-p1": { kind: "practice", expected: "100\n", input: "4\n10 20 30 40\n", judge0Lang: "c" },
  },
};

CATALOG["t3-ch2-4"] = {
  trail: 3, ch: 2, no: 4, prereq: "t3-ch2-3",
  problems: {
    "t3-ch2-4-b1": { kind: "basic",    expected: "3\n2\n1\n", input: "3\n1 2 3\n", judge0Lang: "c" },
    "t3-ch2-4-p1": { kind: "practice", expected: "6\n6\n",    input: "3\n1 2 3\n", judge0Lang: "c" },
  },
};

// === END Trail 3 ===

// ===== Trail 4 (알고리즘 입문) =====

CATALOG["t4-ch1-1"] = {
  trail: 4, ch: 1, no: 1, prereq: null,
  problems: {
    "t4-ch1-1-b1": { kind: "basic",    expected: "45\n",  input: "3\n1 2 3\n4 5 6\n7 8 9\n", judge0Lang: "c" },
    "t4-ch1-1-p1": { kind: "practice", expected: "2 2\n", input: "3\n1 2 3\n4 9 6\n7 8 5\n", judge0Lang: "c" },
  },
};

CATALOG["t4-ch1-2"] = {
  trail: 4, ch: 1, no: 2, prereq: "t4-ch1-1",
  problems: {
    "t4-ch1-2-b1": { kind: "basic",    expected: "0 1 2 3 4\n", input: "5\n1 2 3 4 5\n", judge0Lang: "c" },
    "t4-ch1-2-p1": { kind: "practice", expected: "2 3 4 5 0\n", input: "5\n1 2 3 4 5\n", judge0Lang: "c" },
  },
};

CATALOG["t4-ch1-3"] = {
  trail: 4, ch: 1, no: 3, prereq: "t4-ch1-2",
  problems: {
    "t4-ch1-3-b1": { kind: "basic",    expected: "0 0 0 3 1 2\n", input: "6\n3 0 1 0 2 0\n",   judge0Lang: "c" },
    "t4-ch1-3-p1": { kind: "practice", expected: "0 0 0 1 3 4\n", input: "6 2\n1 2 3 2 4 2\n", judge0Lang: "c" },
  },
};

CATALOG["t4-ch1-4"] = {
  trail: 4, ch: 1, no: 4, prereq: "t4-ch1-3",
  problems: {
    "t4-ch1-4-b1": { kind: "basic",    expected: "2 1\n", input: "5 3\nD R D\n", judge0Lang: "c" },
    "t4-ch1-4-p1": { kind: "practice", expected: "3\n",   input: "5 4\nD R U L\n", judge0Lang: "c" },
  },
};

CATALOG["t4-ch1-5"] = {
  trail: 4, ch: 1, no: 5, prereq: "t4-ch1-4",
  problems: {
    "t4-ch1-5-b1": { kind: "basic",    expected: "1 1\n4 4\n", input: "5 2\n0 0\n4 4\n2\nD R\n", judge0Lang: "c" },
    "t4-ch1-5-p1": { kind: "practice", expected: "1\n",        input: "5 2\n0 0\n0 1\n1\nR\n",   judge0Lang: "c" },
  },
};

CATALOG["t4-ch2-1"] = {
  trail: 4, ch: 2, no: 1, prereq: "t4-ch1-5",
  problems: {
    "t4-ch2-1-b1": { kind: "basic",    expected: "9\n", input: "2 3\n",     judge0Lang: "c" },
    "t4-ch2-1-p1": { kind: "practice", expected: "3\n", input: "2 3 4\n",   judge0Lang: "c" },
  },
};

CATALOG["t4-ch2-2"] = {
  trail: 4, ch: 2, no: 2, prereq: "t4-ch2-1",
  problems: {
    "t4-ch2-2-b1": { kind: "basic",    expected: "6\n", input: "2 3 4\n", judge0Lang: "c" },
    "t4-ch2-2-p1": { kind: "practice", expected: "4\n", input: "2 4\n",   judge0Lang: "c" },
  },
};

CATALOG["t4-ch2-3"] = {
  trail: 4, ch: 2, no: 3, prereq: "t4-ch2-2",
  problems: {
    "t4-ch2-3-b1": { kind: "basic",    expected: "6\n", input: "4 2\n",   judge0Lang: "c" },
    "t4-ch2-3-p1": { kind: "practice", expected: "2\n", input: "4 2 5\n", judge0Lang: "c" },
  },
};

CATALOG["t4-ch2-4"] = {
  trail: 4, ch: 2, no: 4, prereq: "t4-ch2-3",
  problems: {
    "t4-ch2-4-b1": { kind: "basic",    expected: "6\n", input: "3\n",   judge0Lang: "c" },
    "t4-ch2-4-p1": { kind: "practice", expected: "2\n", input: "3 2\n", judge0Lang: "c" },
  },
};

CATALOG["t4-ch3-1"] = {
  trail: 4, ch: 3, no: 1, prereq: "t4-ch2-4",
  problems: {
    "t4-ch3-1-b1": { kind: "basic",    expected: "4\n", input: "4 3\n0 1\n1 2\n2 3\n",   judge0Lang: "c" },
    "t4-ch3-1-p1": { kind: "practice", expected: "3\n", input: "5 2\n0 1\n2 3\n",         judge0Lang: "c" },
  },
};

CATALOG["t4-ch3-2"] = {
  trail: 4, ch: 3, no: 2, prereq: "t4-ch3-1",
  problems: {
    "t4-ch3-2-b1": { kind: "basic",    expected: "2\n", input: "4 4\n0 1\n0 2\n1 3\n2 3\n0 3\n",   judge0Lang: "c" },
    "t4-ch3-2-p1": { kind: "practice", expected: "2\n", input: "4 4\n0 1\n0 2\n1 3\n2 3\n0 3 2\n", judge0Lang: "c" },
  },
};

CATALOG["t4-ch3-3"] = {
  trail: 4, ch: 3, no: 3, prereq: "t4-ch3-2",
  problems: {
    "t4-ch3-3-b1": { kind: "basic",    expected: "4\n", input: "4 3\n0 1\n1 2\n2 3\n",         judge0Lang: "c" },
    "t4-ch3-3-p1": { kind: "practice", expected: "3\n", input: "4 3\n0 1\n1 2\n2 3\n0 3\n",   judge0Lang: "c" },
  },
};

// === END Trail 4 ===

// ===== Trail 5 (알고리즘 기본) =====

CATALOG["t5-ch1-1"] = {
  trail: 5, ch: 1, no: 1, prereq: null,
  problems: {
    "t5-ch1-1-b1": { kind: "basic",    expected: "7\n",  input: "3\napple 3\nbanana 7\ncherry 2\nbanana\n", judge0Lang: "c" },
    "t5-ch1-1-p1": { kind: "practice", expected: "5\n",  input: "3\napple 3\nbanana 7\ncherry 2\n2\napple\ncherry\n", judge0Lang: "c" },
  },
};

CATALOG["t5-ch1-2"] = {
  trail: 5, ch: 1, no: 2, prereq: "t5-ch1-1",
  problems: {
    "t5-ch1-2-b1": { kind: "basic",    expected: "3\n",  input: "3\nbanana 7\napple 3\ncherry 2\napple\n", judge0Lang: "c" },
    "t5-ch1-2-p1": { kind: "practice", expected: "3\n",  input: "3\nbanana 7\napple 3\ncherry 2\n", judge0Lang: "c" },
  },
};

CATALOG["t5-ch1-3"] = {
  trail: 5, ch: 1, no: 3, prereq: "t5-ch1-2",
  problems: {
    "t5-ch1-3-b1": { kind: "basic",    expected: "1\n",  input: "3\napple\nbanana\ncherry\nbanana\n", judge0Lang: "c" },
    "t5-ch1-3-p1": { kind: "practice", expected: "3\n",  input: "5\napple\nbanana\napple\ncherry\nbanana\n", judge0Lang: "c" },
  },
};

CATALOG["t5-ch1-4"] = {
  trail: 5, ch: 1, no: 4, prereq: "t5-ch1-3",
  problems: {
    "t5-ch1-4-b1": { kind: "basic",    expected: "1\n",  input: "3\nbanana\napple\ncherry\napple\n", judge0Lang: "c" },
    "t5-ch1-4-p1": { kind: "practice", expected: "apple\n", input: "4\ncherry\napple\ndate\nbanana\n", judge0Lang: "c" },
  },
};

CATALOG["t5-ch1-5"] = {
  trail: 5, ch: 1, no: 5, prereq: "t5-ch1-4",
  problems: {
    "t5-ch1-5-b1": { kind: "basic",    expected: "7\n",  input: "5 3\n4 1 7 2 9\n", judge0Lang: "c" },
    "t5-ch1-5-p1": { kind: "practice", expected: "2\n",  input: "5 2\n4 1 7 2 9\n", judge0Lang: "c" },
  },
};

CATALOG["t5-ch1-6"] = {
  trail: 5, ch: 1, no: 6, prereq: "t5-ch1-5",
  problems: {
    "t5-ch1-6-b1": { kind: "basic",    expected: "1 2 3 4\n", input: "4\n1 2 3 4\n", judge0Lang: "c" },
    "t5-ch1-6-p1": { kind: "practice", expected: "4 3 2 1\n", input: "4\n1 2 3 4\n", judge0Lang: "c" },
  },
};

CATALOG["t5-ch2-1"] = {
  trail: 5, ch: 2, no: 1, prereq: "t5-ch1-6",
  problems: {
    "t5-ch2-1-b1": { kind: "basic",    expected: "9\n",     input: "5\n1 2 3 4 5\n2 4\n", judge0Lang: "c" },
    "t5-ch2-1-p1": { kind: "practice", expected: "6\n14\n", input: "5\n1 2 3 4 5\n2\n1 3\n2 5\n", judge0Lang: "c" },
  },
};

CATALOG["t5-ch2-2"] = {
  trail: 5, ch: 2, no: 2, prereq: "t5-ch2-1",
  problems: {
    "t5-ch2-2-b1": { kind: "basic",    expected: "4\n",         input: "6\n10 20 10 30 20 40\n", judge0Lang: "c" },
    "t5-ch2-2-p1": { kind: "practice", expected: "2 0 1 0 2\n", input: "5\n30 10 20 10 30\n", judge0Lang: "c" },
  },
};

CATALOG["t5-ch2-3"] = {
  trail: 5, ch: 2, no: 3, prereq: "t5-ch2-2",
  problems: {
    "t5-ch2-3-b1": { kind: "basic",    expected: "9 8 7 6\n", input: "4\n1 2 3 4\n", judge0Lang: "c" },
    "t5-ch2-3-p1": { kind: "practice", expected: "0\n",        input: "4\n1 2 3 4\n", judge0Lang: "c" },
  },
};

CATALOG["t5-ch2-4"] = {
  trail: 5, ch: 2, no: 4, prereq: "t5-ch2-3",
  problems: {
    "t5-ch2-4-b1": { kind: "basic",    expected: "7\n",           input: "5 2\n1 3\n2 5\n", judge0Lang: "c" },
    "t5-ch2-4-p1": { kind: "practice", expected: "2 5 5 3 0\n",   input: "5 2\n1 3 2\n2 4 3\n", judge0Lang: "c" },
  },
};

// === END Trail 5 ===

// ===== Trail 6 (알고리즘 실전) =====

CATALOG["t6-ch1-1"] = {
  trail: 6, ch: 1, no: 1, prereq: null,
  problems: {
    "t6-ch1-1-b1": { kind: "basic",    expected: "2\n", input: "5\n1 2\n1 3\n3 4\n3 5\n", judge0Lang: "c" },
    "t6-ch1-1-p1": { kind: "practice", expected: "2\n", input: "5 1\n1 2\n1 3\n3 4\n3 5\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch1-2"] = {
  trail: 6, ch: 1, no: 2, prereq: "t6-ch1-1",
  problems: {
    "t6-ch1-2-b1": { kind: "basic",    expected: "2 1 3\n", input: "3\n1 2 3\n2 0 0\n3 0 0\n", judge0Lang: "c" },
    "t6-ch1-2-p1": { kind: "practice", expected: "2\n",     input: "3\n1 2 3\n2 0 0\n3 0 0\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch1-3"] = {
  trail: 6, ch: 1, no: 3, prereq: "t6-ch1-2",
  problems: {
    "t6-ch1-3-b1": { kind: "basic",    expected: "10\n", input: "4\n1 2 3 4\n1 2\n1 3\n3 4\n", judge0Lang: "c" },
    "t6-ch1-3-p1": { kind: "practice", expected: "10\n", input: "4\n1 2 3 4\n1 2\n1 3\n3 4\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch1-4"] = {
  trail: 6, ch: 1, no: 4, prereq: "t6-ch1-3",
  problems: {
    "t6-ch1-4-b1": { kind: "basic",    expected: "3\n", input: "5\n1 2\n1 3\n3 4\n3 5\n4 5\n", judge0Lang: "c" },
    "t6-ch1-4-p1": { kind: "practice", expected: "1\n", input: "5\n1 2\n1 3\n3 4\n3 5\n4 5\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch2-1"] = {
  trail: 6, ch: 2, no: 1, prereq: "t6-ch1-4",
  problems: {
    "t6-ch2-1-b1": { kind: "basic",    expected: "3\n",  input: "5 2\n1 2\n3 4\n", judge0Lang: "c" },
    "t6-ch2-1-p1": { kind: "practice", expected: "no\n", input: "5 2\n1 2\n3 4\n1 3\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch2-2"] = {
  trail: 6, ch: 2, no: 2, prereq: "t6-ch2-1",
  problems: {
    "t6-ch2-2-b1": { kind: "basic",    expected: "5\n", input: "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 2\n", judge0Lang: "c" },
    "t6-ch2-2-p1": { kind: "practice", expected: "3\n", input: "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 2\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch2-3"] = {
  trail: 6, ch: 2, no: 3, prereq: "t6-ch2-2",
  problems: {
    "t6-ch2-3-b1": { kind: "basic",    expected: "5\n", input: "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 2\n", judge0Lang: "c" },
    "t6-ch2-3-p1": { kind: "practice", expected: "2\n", input: "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 2\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch3-1"] = {
  trail: 6, ch: 3, no: 1, prereq: "t6-ch2-3",
  problems: {
    "t6-ch3-1-b1": { kind: "basic",    expected: "1 2 3 4\n", input: "4 3\n1 2\n1 3\n2 4\n", judge0Lang: "c" },
    "t6-ch3-1-p1": { kind: "practice", expected: "4\n",       input: "4 3\n1 2\n1 3\n2 4\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch3-2"] = {
  trail: 6, ch: 3, no: 2, prereq: "t6-ch3-1",
  problems: {
    "t6-ch3-2-b1": { kind: "basic",    expected: "2\n", input: "4 3\n1 2\n2 3\n2 4\n", judge0Lang: "c" },
    "t6-ch3-2-p1": { kind: "practice", expected: "1\n", input: "4 3\n1 2\n2 3\n2 4\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch4-1"] = {
  trail: 6, ch: 4, no: 1, prereq: "t6-ch3-2",
  problems: {
    "t6-ch4-1-b1": { kind: "basic",    expected: "4\n", input: "abababab\nab\n", judge0Lang: "c" },
    "t6-ch4-1-p1": { kind: "practice", expected: "0\n", input: "abababab\naba\n", judge0Lang: "c" },
  },
};

CATALOG["t6-ch4-2"] = {
  trail: 6, ch: 4, no: 2, prereq: "t6-ch4-1",
  problems: {
    "t6-ch4-2-b1": { kind: "basic",    expected: "2\n", input: "aabaab\naab\n",  judge0Lang: "c" },
    "t6-ch4-2-p1": { kind: "practice", expected: "3\n", input: "aabaab\n",       judge0Lang: "c" },
  },
};

CATALOG["t6-ch4-3"] = {
  trail: 6, ch: 4, no: 3, prereq: "t6-ch4-2",
  problems: {
    "t6-ch4-3-b1": { kind: "basic",    expected: "yes\nno\n", input: "3\napple\napp\nban\n2\napp\ncat\n", judge0Lang: "c" },
    "t6-ch4-3-p1": { kind: "practice", expected: "2\n",       input: "3\napple\napp\nban\nap\n",          judge0Lang: "c" },
  },
};

// === END Trail 6 ===

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
