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

// --- Ch 1. 기본 ---

LESSONS["t0-ch1-1"] = {
  trail: 0, ch: 1, no: 1, title: "출력 입문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "C 언어로 화면에 텍스트를 출력하는 가장 기본적인 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  printf(\"Hello\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "printf 함수" },
      { type: "p",    text: "printf(\"...\")는 큰따옴표 안의 텍스트를 화면에 그대로 출력합니다." },
      { type: "list", items: ["줄 바꿈은 \\n", "탭은 \\t", "백슬래시 자체는 \\\\", "큰따옴표 자체는 \\\""] },
      { type: "callout", text: "출력문은 위에서 아래로 작성한 순서대로 실행됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch1-1-b1", title: "Hello 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "Hello 라는 단어를 출력하는 프로그램을 작성하세요.",
        example: { input: "", output: "Hello" } },
    ],
    practice: [
      { id: "t0-ch1-1-p1", title: "두 줄 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "Hello 와 World 를 각각 다른 줄에 출력하세요.",
        example: { input: "", output: "Hello\nWorld" } },
    ],
  },
};

LESSONS["t0-ch1-2"] = {
  trail: 0, ch: 1, no: 2, title: "변수",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "값을 저장해두고 이름으로 다시 꺼내 쓸 수 있는 변수의 개념을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int age = 20;\n  printf(\"나이: 20\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "변수 선언과 초기화" },
      { type: "p",    text: "int age = 20; 처럼 자료형, 이름, 값을 한 줄에 적어 변수를 만듭니다." },
      { type: "list", items: ["자료형: 어떤 종류의 값을 담을지 (int, double, char ...)", "이름: 코드에서 부를 이름", "값: 처음 담아둘 값(초기화)"] },
      { type: "callout", text: "변수 이름은 의미가 드러나도록 짓는 것이 가독성에 좋습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch1-2-b1", title: "변수 값 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "정수 변수에 20을 담고 \"20\" 을 출력하세요.",
        example: { input: "", output: "20" } },
    ],
    practice: [
      { id: "t0-ch1-2-p1", title: "두 변수 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "두 정수 변수에 각각 1, 2 를 담고 한 줄에 하나씩 출력하세요.",
        example: { input: "", output: "1\n2" } },
    ],
  },
};

LESSONS["t0-ch1-3"] = {
  trail: 0, ch: 1, no: 3, title: "기본 자료형",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "C 의 기본 자료형(int, double, char)이 어떤 값을 담는지 살펴봅니다." },
      { type: "code", text: "int    n = 7;\ndouble pi = 3.14;\nchar   c = 'A';" },
      { type: "h3",   text: "대표 자료형" },
      { type: "table", rows: [
        ["자료형", "예시 값", "설명"],
        ["int",    "7",       "정수"],
        ["double", "3.14",    "실수(소수점)"],
        ["char",   "'A'",     "문자 한 글자"],
      ] },
      { type: "callout", text: "자료형이 정해지면 그 변수에 담을 수 있는 값의 종류와 표현 방식이 결정됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch1-3-b1", title: "정수 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "정수 7 을 출력하세요.",
        example: { input: "", output: "7" } },
    ],
    practice: [
      { id: "t0-ch1-3-p1", title: "실수 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "실수 3.14 를 그대로 출력하세요.",
        example: { input: "", output: "3.14" } },
    ],
  },
};

LESSONS["t0-ch1-4"] = {
  trail: 0, ch: 1, no: 4, title: "연산자",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "사칙연산을 코드로 표현하고 결과를 출력해봅니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int a = 3, b = 5;\n  printf(\"8\\n\");   // 3 + 5\n  return 0;\n}" },
      { type: "h3",   text: "산술 연산자" },
      { type: "list", items: ["+ 더하기", "- 빼기", "* 곱하기", "/ 나누기 (정수끼리는 몫)", "% 나머지"] },
      { type: "callout", text: "정수끼리의 / 연산은 소수점 이하를 버리고 몫만 남습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch1-4-b1", title: "덧셈 결과", diff: "Easy", xp: 10, time: "1m",
        desc: "3 더하기 5 의 결과를 출력하세요.",
        example: { input: "", output: "8" } },
    ],
    practice: [
      { id: "t0-ch1-4-p1", title: "곱셈 결과", diff: "Easy", xp: 10, time: "1m",
        desc: "4 곱하기 6 의 결과를 출력하세요.",
        example: { input: "", output: "24" } },
    ],
  },
};

// --- Ch 2. 입출력 ---

LESSONS["t0-ch2-1"] = {
  trail: 0, ch: 2, no: 1, title: "출력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "여러 줄을 한 번에 출력하고, 다양한 형식으로 화면에 보여주는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  printf(\"Codenergy\\n\");\n  printf(\"Hello, World!\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "여러 줄 출력" },
      { type: "p",    text: "printf 를 여러 번 호출하거나, \\n 을 활용해 한 번에 여러 줄을 출력할 수 있습니다." },
      { type: "callout", text: "줄바꿈을 깜빡하면 두 줄이 한 줄로 붙어 보일 수 있어요." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch2-1-b1", title: "Codenergy 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "Codenergy 라는 단어를 출력하세요.",
        example: { input: "", output: "Codenergy" } },
    ],
    practice: [
      { id: "t0-ch2-1-p1", title: "인사 두 줄", diff: "Easy", xp: 10, time: "1m",
        desc: "첫 줄에 Hello, 둘째 줄에 World 를 출력하세요.",
        example: { input: "", output: "Hello\nWorld" } },
    ],
  },
};

LESSONS["t0-ch2-2"] = {
  trail: 0, ch: 2, no: 2, title: "입력 입문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "사용자가 입력한 정수를 받아서 그대로 화면에 출력해봅니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  printf(\"%d\\n\", n);\n  return 0;\n}" },
      { type: "h3",   text: "scanf 와 printf" },
      { type: "list", items: ["scanf(\"%d\", &n) — 정수를 입력받아 변수 n 에 저장", "printf(\"%d\\n\", n) — 정수 변수 n 의 값을 출력", "& 기호: 변수에 \"여기에 값을 넣어줘\" 라고 알려주는 표시"] },
      { type: "callout", text: "scanf 의 변수 앞에 & 를 빼먹지 않도록 조심하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch2-2-b1", title: "정수 그대로 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 한 개를 입력받아 그대로 출력하세요.",
        example: { input: "5", output: "5" } },
    ],
    practice: [
      { id: "t0-ch2-2-p1", title: "입력값 두 줄 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 한 개를 입력받아 같은 값을 두 줄에 걸쳐 출력하세요.",
        example: { input: "7", output: "7\n7" } },
    ],
  },
};

LESSONS["t0-ch2-3"] = {
  trail: 0, ch: 2, no: 3, title: "입력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "정수 두 개를 입력받아 활용하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int a, b;\n  scanf(\"%d %d\", &a, &b);\n  printf(\"%d\\n\", a + b);\n  return 0;\n}" },
      { type: "h3",   text: "여러 값 입력받기" },
      { type: "p",    text: "scanf 의 형식 문자열에 %d 를 여러 번 적으면 여러 값을 한 번에 받을 수 있습니다." },
      { type: "callout", text: "입력값 사이는 공백이나 줄바꿈 어느 쪽이든 구분자로 쓸 수 있어요." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch2-3-b1", title: "두 수의 합", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 두 개를 입력받아 합을 출력하세요.",
        example: { input: "3 5", output: "8" } },
    ],
    practice: [
      { id: "t0-ch2-3-p1", title: "두 수 그대로 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 두 개를 입력받아 한 줄에 하나씩 그대로 출력하세요.",
        example: { input: "1 2", output: "1\n2" } },
    ],
  },
};

LESSONS["t0-ch2-4"] = {
  trail: 0, ch: 2, no: 4, title: "입출력 연습",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "지금까지 배운 입력과 출력을 합쳐, 입력을 가공해 결과를 출력하는 흐름을 연습합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int a, b;\n  scanf(\"%d %d\", &a, &b);\n  printf(\"%d\\n\", a * b);\n  return 0;\n}" },
      { type: "h3",   text: "입력 → 처리 → 출력" },
      { type: "list", items: ["입력: scanf 로 값을 받는다", "처리: 받은 값으로 계산한다", "출력: 결과를 printf 로 보여준다"] },
      { type: "callout", text: "거의 모든 프로그램이 이 세 단계의 반복으로 이루어져 있어요." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch2-4-b1", title: "두 수의 곱", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 두 개를 입력받아 두 수의 곱을 출력하세요.",
        example: { input: "3 4", output: "12" } },
    ],
    practice: [
      { id: "t0-ch2-4-p1", title: "두 수의 차", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 두 개 a, b 를 입력받아 a - b 의 값을 출력하세요.",
        example: { input: "10 3", output: "7" } },
    ],
  },
};

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
