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
        example: { input: "5\n", output: "5" } },
    ],
    practice: [
      { id: "t0-ch2-2-p1", title: "입력값 두 줄 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 한 개를 입력받아 같은 값을 두 줄에 걸쳐 출력하세요.",
        example: { input: "7\n", output: "7\n7" } },
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
        example: { input: "3 5\n", output: "8" } },
    ],
    practice: [
      { id: "t0-ch2-3-p1", title: "두 수 그대로 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 두 개를 입력받아 한 줄에 하나씩 그대로 출력하세요.",
        example: { input: "1 2\n", output: "1\n2" } },
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
        example: { input: "3 4\n", output: "12" } },
    ],
    practice: [
      { id: "t0-ch2-4-p1", title: "두 수의 차", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 두 개 a, b 를 입력받아 a - b 의 값을 출력하세요.",
        example: { input: "10 3\n", output: "7" } },
    ],
  },
};

// --- Ch 3. 조건문 1 ---

LESSONS["t0-ch3-1"] = {
  trail: 0, ch: 3, no: 1, title: "조건문 입문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "조건에 따라 다른 코드를 실행하는 if 문의 기본 사용법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n = 5;\n  if (n > 0) {\n    printf(\"양수\\n\");\n  }\n  return 0;\n}" },
      { type: "h3",   text: "if 문 구조" },
      { type: "list", items: ["if (조건) { … } — 조건이 참이면 {} 안을 실행", "조건은 비교 연산자(==, !=, <, >, <=, >=)로 작성", "조건이 거짓이면 {} 안을 건너뜀"] },
      { type: "callout", text: "조건식이 0이 아니면 참, 0이면 거짓으로 평가됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch3-1-b1", title: "양수 판별", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 한 개를 입력받아 양수이면 'positive' 를 출력하세요. 아니면 아무것도 출력하지 않습니다.",
        example: { input: "5\n", output: "positive" } },
    ],
    practice: [
      { id: "t0-ch3-1-p1", title: "짝수 판별", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 한 개를 입력받아 짝수이면 'even' 을 출력하세요. 아니면 아무것도 출력하지 않습니다.",
        example: { input: "4\n", output: "even" } },
    ],
  },
};

LESSONS["t0-ch3-2"] = {
  trail: 0, ch: 3, no: 2, title: "조건문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "if-else 와 else if 를 사용해 여러 경우 중 하나를 선택하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  if (n > 0) {\n    printf(\"positive\\n\");\n  } else if (n < 0) {\n    printf(\"negative\\n\");\n  } else {\n    printf(\"zero\\n\");\n  }\n  return 0;\n}" },
      { type: "h3",   text: "if-else if-else" },
      { type: "list", items: ["if — 첫 번째 조건 검사", "else if — 이전 조건이 거짓일 때 다음 조건 검사", "else — 모든 조건이 거짓일 때 실행"] },
      { type: "callout", text: "조건은 위에서 아래로 순서대로 검사되며, 처음 참이 되는 블록만 실행됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch3-2-b1", title: "양수/음수/영 판별", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 한 개를 입력받아 양수이면 'positive', 음수이면 'negative', 0이면 'zero' 를 출력하세요.",
        example: { input: "3\n", output: "positive" } },
    ],
    practice: [
      { id: "t0-ch3-2-p1", title: "두 수 중 최댓값", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 두 개를 입력받아 더 큰 값을 출력하세요. 같으면 그 값을 출력합니다.",
        example: { input: "3 7\n", output: "7" } },
    ],
  },
};

// --- Ch 3 (continued). if/else, switch ---

LESSONS["t0-ch3-3"] = {
  trail: 0, ch: 3, no: 3, title: "if/else",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "if-else 로 두 갈래(참/거짓)를 나눠 실행하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int x;\n  scanf(\"%d\", &x);\n  if (x > 0) {\n    printf(\"positive\\n\");\n  } else {\n    printf(\"negative\\n\");\n  }\n  return 0;\n}" },
      { type: "h3",   text: "if-else 구조" },
      { type: "list", items: ["if (조건) { … } — 조건이 참이면 실행", "else { … } — 조건이 거짓이면 실행", "둘 중 하나만 반드시 실행됨"] },
      { type: "callout", text: "함정: 비교는 == (등호 두 개), 대입은 = (등호 하나). 혼동하면 의도치 않은 결과가 납니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch3-3-b1", title: "양수/음수/영 판별", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 한 개를 입력받아 양수이면 'positive', 음수이면 'negative', 0이면 'zero'를 출력하세요.",
        example: { input: "5\n", output: "positive" } },
    ],
    practice: [
      { id: "t0-ch3-3-p1", title: "합격/불합격 판별", diff: "Easy", xp: 10, time: "3m",
        desc: "점수 한 개를 입력받아 60점 이상이면 'pass', 미만이면 'fail'을 출력하세요.",
        example: { input: "75\n", output: "pass" } },
    ],
  },
};

LESSONS["t0-ch3-4"] = {
  trail: 0, ch: 3, no: 4, title: "switch",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "정수 값에 따라 여러 case 중 하나를 선택해 실행하는 switch 문을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int d;\n  scanf(\"%d\", &d);\n  switch (d) {\n    case 1: printf(\"Mon\\n\"); break;\n    case 2: printf(\"Tue\\n\"); break;\n    default: printf(\"Other\\n\");\n  }\n  return 0;\n}" },
      { type: "h3",   text: "switch 핵심 규칙" },
      { type: "list", items: ["case 값: — 해당 값이면 여기서 실행 시작", "break; — 빠져나옴. 빠뜨리면 다음 case 까지 흘러내림(fall-through)", "default: — 어떤 case 도 해당 없을 때 실행"] },
      { type: "callout", text: "break 를 빠뜨리는 것이 가장 흔한 실수입니다. 각 case 끝에 반드시 break 를 넣으세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch3-4-b1", title: "요일 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "1~7 사이의 정수를 입력받아 해당 요일 약자(Mon/Tue/Wed/Thu/Fri/Sat/Sun)를 출력하세요.",
        example: { input: "3\n", output: "Wed" } },
    ],
    practice: [
      { id: "t0-ch3-4-p1", title: "등급 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "1~5 사이의 정수를 입력받아 1=A, 2=B, 3=C, 4=D, 5=F 를 출력하세요.",
        example: { input: "2\n", output: "B" } },
    ],
  },
};

// --- Ch 4. 반복문 ---

LESSONS["t0-ch4-1"] = {
  trail: 0, ch: 4, no: 1, title: "for 입문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "for 문으로 정해진 횟수만큼 코드를 반복 실행하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n, sum = 0;\n  scanf(\"%d\", &n);\n  for (int i = 1; i <= n; i++) {\n    sum += i;\n  }\n  printf(\"%d\\n\", sum);\n  return 0;\n}" },
      { type: "h3",   text: "for 문 구조" },
      { type: "list", items: ["for (초기화; 조건; 증감) { … }", "초기화: 루프 시작 전 한 번 실행", "조건: 매 반복 전에 검사 — 거짓이면 종료", "증감: 매 반복 후 실행"] },
      { type: "callout", text: "함정: 세미콜론(;) 빠뜨리기, i <= n 인지 i < n 인지 헷갈리는 off-by-one 오류." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch4-1-b1", title: "1부터 N까지 합", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N을 입력받아 1부터 N까지의 합을 출력하세요.",
        example: { input: "5\n", output: "15" } },
    ],
    practice: [
      { id: "t0-ch4-1-p1", title: "1부터 N까지 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N을 입력받아 1부터 N까지 한 줄에 하나씩 출력하세요.",
        example: { input: "3\n", output: "1\n2\n3" } },
    ],
  },
};

LESSONS["t0-ch4-2"] = {
  trail: 0, ch: 4, no: 2, title: "while",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "조건이 참인 동안 반복하는 while 문을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n, i = 1, sum = 0;\n  scanf(\"%d\", &n);\n  while (i <= n) {\n    sum += i;\n    i++;\n  }\n  printf(\"%d\\n\", sum);\n  return 0;\n}" },
      { type: "h3",   text: "while 구조" },
      { type: "list", items: ["while (조건) { … } — 조건이 참인 동안 반복", "조건이 처음부터 거짓이면 한 번도 실행 안 됨", "루프 안에서 조건 변수를 바꾸지 않으면 무한 루프"] },
      { type: "callout", text: "무한 루프 함정: 조건 변수를 반드시 루프 안에서 갱신하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch4-2-b1", title: "1부터 N까지 합 (while)", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N을 입력받아 while 문으로 1부터 N까지의 합을 출력하세요.",
        example: { input: "4\n", output: "10" } },
    ],
    practice: [
      { id: "t0-ch4-2-p1", title: "N부터 1까지 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N을 입력받아 N부터 1까지 한 줄에 하나씩 출력하세요.",
        example: { input: "3\n", output: "3\n2\n1" } },
    ],
  },
};

LESSONS["t0-ch4-3"] = {
  trail: 0, ch: 4, no: 3, title: "do-while",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "본문을 먼저 실행하고 조건을 나중에 검사하는 do-while 문을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  do {\n    printf(\"%d\\n\", n);\n    n--;\n  } while (n > 0);\n  return 0;\n}" },
      { type: "h3",   text: "do-while 특징" },
      { type: "list", items: ["do { … } while (조건);  ← 세미콜론 필수", "본문을 먼저 실행한 뒤 조건 검사", "조건이 처음부터 거짓이어도 최소 1회는 실행"] },
      { type: "callout", text: "while 끝에 세미콜론(;)을 꼭 붙이세요. 빠뜨리면 컴파일 오류." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch4-3-b1", title: "첫 입력값 그대로 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N을 입력받아 do-while 문으로 N을 출력하세요. (조건과 무관하게 1회 실행 확인)",
        example: { input: "7\n", output: "7" } },
    ],
    practice: [
      { id: "t0-ch4-3-p1", title: "카운트다운 후 GO", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N을 입력받아 N부터 1까지 한 줄씩 출력하고, 마지막에 'GO'를 출력하세요.",
        example: { input: "3\n", output: "3\n2\n1\nGO" } },
    ],
  },
};

LESSONS["t0-ch4-4"] = {
  trail: 0, ch: 4, no: 4, title: "중첩 반복",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "반복문 안에 또 다른 반복문을 넣어 2차원 패턴을 출력하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= i; j++)\n      printf(\"*\");\n    printf(\"\\n\");\n  }\n  return 0;\n}" },
      { type: "h3",   text: "중첩 for 구조" },
      { type: "list", items: ["바깥 루프: 행(row) 제어", "안쪽 루프: 각 행에 출력할 열(column) 제어", "안쪽 루프가 끝나면 printf(\"\\n\") 으로 줄바꿈"] },
      { type: "callout", text: "바깥 변수 i 와 안쪽 변수 j 를 이름이 겹치지 않게 구분하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch4-4-b1", title: "직각삼각형 별 찍기", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 N을 입력받아 N행의 직각삼각형 별 패턴을 출력하세요. i행에는 별이 i개.",
        example: { input: "4\n", output: "*\n**\n***\n****" } },
    ],
    practice: [
      { id: "t0-ch4-4-p1", title: "역직각삼각형 별 찍기", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 N을 입력받아 역방향 직각삼각형 별 패턴을 출력하세요. 첫 행에 별이 N개, 마지막 행에 1개.",
        example: { input: "4\n", output: "****\n***\n**\n*" } },
    ],
  },
};

// --- Ch 5. 배열 ---

LESSONS["t0-ch5-1"] = {
  trail: 0, ch: 5, no: 1, title: "배열 선언",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "여러 값을 하나의 이름으로 묶어 관리하는 배열의 선언과 초기화를 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int arr[5] = {10, 20, 30, 40, 50};\n  printf(\"%d\\n\", arr[0]); // 첫 번째 요소\n  return 0;\n}" },
      { type: "h3",   text: "배열 기본" },
      { type: "list", items: ["int arr[5]; — 정수 5개를 담는 배열 선언", "인덱스는 0부터 시작: arr[0] ~ arr[4]", "초기화: int arr[5] = {1, 2, 3, 4, 5};"] },
      { type: "callout", text: "인덱스 범위를 넘으면 메모리 오류가 납니다. arr[5]는 존재하지 않습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch5-1-b1", title: "첫 번째 요소 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 정수 5개를 입력받아 첫 번째 값을 출력하세요.",
        example: { input: "10 20 30 40 50\n", output: "10" } },
    ],
    practice: [
      { id: "t0-ch5-1-p1", title: "마지막 요소 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 정수 5개를 입력받아 마지막 값을 출력하세요.",
        example: { input: "10 20 30 40 50\n", output: "50" } },
    ],
  },
};

LESSONS["t0-ch5-2"] = {
  trail: 0, ch: 5, no: 2, title: "배열 입출력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "for 루프로 배열 요소를 차례로 입력받고 출력하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int arr[5];\n  for (int i = 0; i < 5; i++)\n    scanf(\"%d\", &arr[i]);\n  for (int i = 0; i < 5; i++)\n    printf(\"%d\\n\", arr[i]);\n  return 0;\n}" },
      { type: "h3",   text: "루프로 배열 다루기" },
      { type: "list", items: ["scanf 루프: i = 0 ~ 4 반복하며 각 요소를 입력받음", "printf 루프: 같은 방식으로 출력", "역순 출력: i = 4 ~ 0 으로 내려가며 출력"] },
      { type: "callout", text: "배열 입력 시 &arr[i] 처럼 반드시 & 를 붙여야 합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch5-2-b1", title: "배열 순서대로 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 정수 5개를 입력받아 한 줄에 하나씩 순서대로 출력하세요.",
        example: { input: "1 2 3 4 5\n", output: "1\n2\n3\n4\n5" } },
    ],
    practice: [
      { id: "t0-ch5-2-p1", title: "배열 역순 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 정수 5개를 입력받아 역순으로 한 줄에 하나씩 출력하세요.",
        example: { input: "1 2 3 4 5\n", output: "5\n4\n3\n2\n1" } },
    ],
  },
};

LESSONS["t0-ch5-3"] = {
  trail: 0, ch: 5, no: 3, title: "2차원 배열",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "행과 열로 이루어진 2차원 배열을 선언하고 이중 for 루프로 접근하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int m[2][2];\n  for (int i = 0; i < 2; i++)\n    for (int j = 0; j < 2; j++)\n      scanf(\"%d\", &m[i][j]);\n  printf(\"%d\\n\", m[0][0] + m[0][1] + m[1][0] + m[1][1]);\n  return 0;\n}" },
      { type: "h3",   text: "2차원 배열 구조" },
      { type: "list", items: ["int m[행][열]; 로 선언", "m[i][j] — i번째 행, j번째 열", "이중 for 로 전체 순회"] },
      { type: "callout", text: "2차원 배열도 인덱스는 0부터 시작합니다. m[2][2] 에서 유효한 인덱스는 0, 1 뿐." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch5-3-b1", title: "2×2 배열 합", diff: "Easy", xp: 10, time: "4m",
        desc: "공백으로 구분된 정수 4개(2×2 행렬 행 우선)를 입력받아 모든 요소의 합을 출력하세요.",
        example: { input: "1 2 3 4\n", output: "10" } },
    ],
    practice: [
      { id: "t0-ch5-3-p1", title: "대각선 합", diff: "Easy", xp: 10, time: "4m",
        desc: "공백으로 구분된 정수 4개(2×2 행렬 행 우선)를 입력받아 주대각선(m[0][0]+m[1][1])의 합을 출력하세요.",
        example: { input: "1 2 3 4\n", output: "5" } },
    ],
  },
};

LESSONS["t0-ch5-4"] = {
  trail: 0, ch: 5, no: 4, title: "배열 순회",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "배열을 순회하며 합계, 최댓값, 평균 등을 구하는 패턴을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int arr[5], max;\n  for (int i = 0; i < 5; i++) scanf(\"%d\", &arr[i]);\n  max = arr[0];\n  for (int i = 1; i < 5; i++)\n    if (arr[i] > max) max = arr[i];\n  printf(\"%d\\n\", max);\n  return 0;\n}" },
      { type: "h3",   text: "누적 변수 패턴" },
      { type: "list", items: ["합계: sum = 0; 후 루프에서 sum += arr[i]", "최댓값: max = arr[0]; 후 루프에서 갱신", "평균: 합계 / 개수 (정수 나누기 주의)"] },
      { type: "callout", text: "최댓값 변수는 배열 첫 요소로 초기화하세요. 0으로 초기화하면 음수 배열에서 틀립니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch5-4-b1", title: "최댓값 구하기", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 정수 5개를 입력받아 가장 큰 값을 출력하세요.",
        example: { input: "3 7 1 9 5\n", output: "9" } },
    ],
    practice: [
      { id: "t0-ch5-4-p1", title: "평균 구하기", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 정수 5개를 입력받아 평균을 정수로 출력하세요.",
        example: { input: "10 20 30 40 50\n", output: "30" } },
    ],
  },
};

// --- Ch 6. 문자/문자열 ---

LESSONS["t0-ch6-1"] = {
  trail: 0, ch: 6, no: 1, title: "char 배열",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "문자 하나(char) 와 문자 배열(문자열)을 선언하고 입출력하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  char s[20];\n  scanf(\"%s\", s);\n  printf(\"%s\\n\", s);\n  return 0;\n}" },
      { type: "h3",   text: "char 배열과 null 종단자" },
      { type: "list", items: ["char s[20]; — 최대 19글자 + '\\0' 저장 가능", "scanf(\"%s\", s) — & 없이 배열 이름만 전달", "'\\0' (null 종단자): 문자열 끝을 알리는 특수 문자"] },
      { type: "callout", text: "배열 크기는 저장할 문자 수보다 최소 1 이상 크게 선언하세요 (null 종단자 공간)." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch6-1-b1", title: "문자 그대로 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "문자 한 개를 입력받아 그대로 출력하세요.",
        example: { input: "A\n", output: "A" } },
    ],
    practice: [
      { id: "t0-ch6-1-p1", title: "단어 그대로 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "단어 한 개를 입력받아 그대로 출력하세요.",
        example: { input: "hello\n", output: "hello" } },
    ],
  },
};

LESSONS["t0-ch6-2"] = {
  trail: 0, ch: 6, no: 2, title: "문자열 출력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "scanf 로 입력받은 문자 배열을 printf %s 형식으로 출력하고, 여러 단어를 다양한 형태로 조합하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  char a[50], b[50];\n  scanf(\"%s %s\", a, b);\n  printf(\"%s%s\\n\", a, b);\n  return 0;\n}" },
      { type: "h3",   text: "printf 문자열 출력" },
      { type: "list", items: ["%s — char 배열을 '\\0' 전까지 출력", "여러 %s 를 한 줄에 이어 쓰면 단어가 붙어 출력됨", "줄바꿈을 원하면 printf 끝에 \\n 추가"] },
      { type: "callout", text: "scanf(\"%s\", s) 는 공백 전까지만 한 단어를 읽습니다. 두 단어는 두 번 scanf 하거나 \"%s %s\" 형식으로 한 번에 받으세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch6-2-b1", title: "두 단어 붙여 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 두 단어를 입력받아 공백 없이 붙여서 한 줄에 출력하세요.",
        example: { input: "hi bye\n", output: "hibye" } },
    ],
    practice: [
      { id: "t0-ch6-2-p1", title: "단어 두 줄 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "단어 한 개를 입력받아 같은 단어를 두 줄에 걸쳐 출력하세요.",
        example: { input: "hi\n", output: "hi\nhi" } },
    ],
  },
};

LESSONS["t0-ch6-3"] = {
  trail: 0, ch: 6, no: 3, title: "문자열 길이",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "문자열의 길이를 구하는 strlen 함수 사용법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n  char s[100];\n  scanf(\"%s\", s);\n  printf(\"%lu\\n\", strlen(s));\n  return 0;\n}" },
      { type: "h3",   text: "strlen 특징" },
      { type: "list", items: ["#include <string.h> 필요", "strlen(s) — '\\0' 전까지의 문자 수 반환", "결과 자료형은 size_t (unsigned). %lu 또는 %d 로 출력"] },
      { type: "callout", text: "strlen 은 '\\0' 자체는 길이에 포함하지 않습니다. \"hello\" 의 길이는 5." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch6-3-b1", title: "단어 길이 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "단어 한 개를 입력받아 그 길이를 출력하세요.",
        example: { input: "hello\n", output: "5" } },
    ],
    practice: [
      { id: "t0-ch6-3-p1", title: "두 단어 길이 합", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 두 단어를 입력받아 두 단어 길이의 합을 출력하세요.",
        example: { input: "hi bye\n", output: "5" } },
    ],
  },
};

LESSONS["t0-ch6-4"] = {
  trail: 0, ch: 6, no: 4, title: "문자열 비교",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "두 문자열이 같은지 비교하는 strcmp 함수 사용법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n  char a[50], b[50];\n  scanf(\"%s %s\", a, b);\n  if (strcmp(a, b) == 0)\n    printf(\"same\\n\");\n  else\n    printf(\"diff\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "strcmp 반환값" },
      { type: "list", items: ["0 — 두 문자열이 같음", "양수 — a 가 사전순으로 b 보다 뒤", "음수 — a 가 사전순으로 b 보다 앞"] },
      { type: "callout", text: "문자열 비교에 == 연산자를 쓰면 주소를 비교하게 됩니다. 반드시 strcmp 를 쓰세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t0-ch6-4-b1", title: "두 단어 같은지 비교", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 두 단어를 입력받아 같으면 'same', 다르면 'diff'를 출력하세요.",
        example: { input: "hi hi\n", output: "same" } },
    ],
    practice: [
      { id: "t0-ch6-4-p1", title: "특정 단어 일치 확인", diff: "Easy", xp: 10, time: "3m",
        desc: "단어 한 개를 입력받아 'hello' 와 같으면 'yes', 다르면 'no'를 출력하세요.",
        example: { input: "hello\n", output: "yes" } },
    ],
  },
};

// === END Trail 0 ===

// ===== Trail 1 (Novice Low — 프로그래밍 기초) =====
// Trail 1 agent: insert lessons here.

LESSONS["t1-ch1-1"] = {
  trail: 1, ch: 1, no: 1, title: "기본 출력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "C 프로그램의 기본 골격을 익히고, printf 함수로 화면에 글자를 출력하는 방법을 배웁니다." },
      { type: "h3",   text: "기본 골격" },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  printf(\"hello\");\n  return 0;\n}" },
      { type: "list", items: [
        "#include <stdio.h>: 입출력 함수를 사용하기 위한 헤더 선언",
        "int main(): 프로그램이 시작되는 함수",
        "printf(\"문자열\"): 큰따옴표 안의 글자를 그대로 출력",
        "return 0;: 정상 종료를 의미",
      ] },
      { type: "callout", text: "큰따옴표 \"…\" 안의 내용은 줄바꿈 없이 그대로 화면에 찍힙니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch1-1-b1", title: "단어 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "화면에 hello 한 단어를 출력하세요.", example: { input: "", output: "hello" } },
    ],
    practice: [
      { id: "t1-ch1-1-p1", title: "문장 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "화면에 Hello, World! 문장을 출력하세요.", example: { input: "", output: "Hello, World!" } },
    ],
  },
};

LESSONS["t1-ch1-2"] = {
  trail: 1, ch: 1, no: 2, title: "변수와 자료형",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "값을 담을 수 있는 변수의 개념과 가장 자주 쓰는 자료형 int, double, char를 배웁니다." },
      { type: "h3",   text: "선언과 초기화" },
      { type: "code", text: "int a = 7;\ndouble pi = 3.14;\nchar c = 'A';" },
      { type: "list", items: [
        "int: 정수 (예: -3, 0, 42)",
        "double: 실수 (예: 1.5, -0.7)",
        "char: 한 글자 (예: 'A', '7') — 작은따옴표 사용",
      ] },
      { type: "h3",   text: "출력 서식" },
      { type: "code", text: "printf(\"%d\\n\", a);   // 정수\nprintf(\"%lf\\n\", pi); // 실수\nprintf(\"%c\\n\", c);  // 문자" },
      { type: "callout", text: "%d, %lf, %c 같은 표시를 서식 지정자라고 부릅니다. 변수 값이 그 자리에 채워져 출력돼요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch1-2-b1", title: "정수 상수 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "정수 42를 한 줄에 그대로 출력하세요.", example: { input: "", output: "42" } },
    ],
    practice: [
      { id: "t1-ch1-2-p1", title: "여러 자료형 한 번에 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 7, 문자 A, 그리고 문자열 hi 를 줄바꿈으로 구분해 차례로 출력하세요.",
        example: { input: "", output: "7\nA\nhi" } },
    ],
  },
};

LESSONS["t1-ch1-3"] = {
  trail: 1, ch: 1, no: 3, title: "출력 형식",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "여러 값을 한 줄에 사이 문자(공백, 콤마 등)로 구분해 출력하는 방법과 줄바꿈을 다루는 법을 배웁니다." },
      { type: "code", text: "printf(\"%d %d\\n\", 3, 5);   // 3 5\nprintf(\"%d, %d\\n\", 3, 5);  // 3, 5" },
      { type: "list", items: [
        "\\n: 줄바꿈",
        "\\t: 탭(공백 여러 칸)",
        "서식 문자열 안의 일반 문자는 그대로 출력",
      ] },
      { type: "callout", text: "출력 사이에 무엇이 들어가는지(공백, 콤마, 줄바꿈)는 형식 문자열로 결정됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch1-3-b1", title: "공백으로 구분해 두 정수 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "두 정수 3과 5를 한 줄에 공백으로 구분해 출력하세요.",
        example: { input: "", output: "3 5" } },
    ],
    practice: [
      { id: "t1-ch1-3-p1", title: "콤마로 구분해 세 정수 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "세 정수 1, 2, 3을 한 줄에 \"콤마+공백\"으로 구분해 출력하세요.",
        example: { input: "", output: "1, 2, 3" } },
    ],
  },
};

LESSONS["t1-ch1-4"] = {
  trail: 1, ch: 1, no: 4, title: "소수점 맞춰 출력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "double 값을 원하는 소수점 자리수에 맞춰 출력하는 방법을 익힙니다." },
      { type: "code", text: "double x = 3.141592;\nprintf(\"%.2lf\\n\", x); // 3.14\nprintf(\"%.4lf\\n\", x); // 3.1416" },
      { type: "list", items: [
        "%.Nlf: 소수점 아래 N자리까지 출력 (반올림)",
        "%lf: 자리수 지정 없이 기본 6자리 출력",
      ] },
      { type: "callout", text: "%.2lf 라고 쓰면 자동으로 반올림되어 두 자리까지만 보여줍니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch1-4-b1", title: "원주율 두 자리", diff: "Easy", xp: 10, time: "2m",
        desc: "원주율 3.141592를 소수점 두 자리까지 반올림해 출력하세요.",
        example: { input: "", output: "3.14" } },
    ],
    practice: [
      { id: "t1-ch1-4-p1", title: "소수 네 자리 출력", diff: "Medium", xp: 20, time: "3m",
        desc: "값 2.7182818을 소수점 네 자리까지 반올림해 출력하세요.",
        example: { input: "", output: "2.7183" } },
    ],
  },
};

LESSONS["t1-ch1-5"] = {
  trail: 1, ch: 1, no: 5, title: "변수 값 변경",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "이미 만들어진 변수에 새로운 값을 다시 대입할 수 있다는 점을 익힙니다." },
      { type: "code", text: "int a = 1;\nprintf(\"%d\\n\", a); // 1\na = 5;\nprintf(\"%d\\n\", a); // 5" },
      { type: "list", items: [
        "선언은 한 번만, 이후에는 \"a = 값;\" 으로 새 값을 대입",
        "마지막에 대입된 값이 변수의 현재 값",
      ] },
      { type: "callout", text: "변수 값을 바꾸는 것을 \"갱신\" 이라고 부릅니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch1-5-b1", title: "값 갱신 후 출력", diff: "Easy", xp: 10, time: "1m",
        desc: "정수 변수 a에 1을 넣은 뒤, 다시 5를 대입하고 a의 값을 한 줄에 출력하세요.",
        example: { input: "", output: "5" } },
    ],
    practice: [
      { id: "t1-ch1-5-p1", title: "변경 전후 모두 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "변수 a에 처음 10을 대입한 뒤 출력하고, 다시 20으로 바꿔 출력하세요. 두 값을 줄바꿈으로 구분합니다.",
        example: { input: "", output: "10\n20" } },
    ],
  },
};

LESSONS["t1-ch1-6"] = {
  trail: 1, ch: 1, no: 6, title: "다른 변수로부터 값 변경",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "한 변수의 값을 다른 변수에 복사해 사용하는 방법을 익힙니다." },
      { type: "code", text: "int a = 3;\nint b = 7;\na = b;          // a 에 b 의 값(7)을 복사\nprintf(\"%d %d\\n\", a, b);" },
      { type: "list", items: [
        "오른쪽 값을 평가해서 왼쪽 변수에 대입",
        "복사한 후에도 b의 값은 변하지 않음",
      ] },
      { type: "callout", text: "\"a = b\" 는 a 와 b 를 같게 만드는 것이 아니라, b 의 \"현재 값\"을 a 에 복사하는 동작입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch1-6-b1", title: "다른 변수 값으로 덮어쓰기", diff: "Easy", xp: 10, time: "2m",
        desc: "a = 3, b = 7로 시작한다. a에 b 값을 복사한 뒤 a와 b를 한 줄에 공백으로 출력하세요.",
        example: { input: "", output: "7 7" } },
    ],
    practice: [
      { id: "t1-ch1-6-p1", title: "사슬 복사", diff: "Easy", xp: 10, time: "2m",
        desc: "a = 1, b = 2, c = 3 으로 시작합니다. b = c, a = b 를 차례대로 수행한 뒤 a, b, c를 공백으로 구분해 출력하세요.",
        example: { input: "", output: "3 3 3" } },
    ],
  },
};

LESSONS["t1-ch1-7"] = {
  trail: 1, ch: 1, no: 7, title: "두 변수 값을 교환",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "두 변수의 값을 바꿔치기(swap) 하려면 임시 변수가 왜 필요한지 이해합니다." },
      { type: "code", text: "int a = 3, b = 7;\nint tmp = a;\na = b;\nb = tmp;\nprintf(\"%d %d\\n\", a, b); // 7 3" },
      { type: "list", items: [
        "tmp 없이 a = b; b = a; 를 그대로 하면 둘 다 같은 값이 됨",
        "tmp 에 한 쪽 값을 잠시 보관해야 손실 없이 교환 가능",
      ] },
      { type: "callout", text: "임시 변수를 두는 패턴은 앞으로도 자주 등장합니다. 손에 익혀두세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch1-7-b1", title: "두 정수 swap", diff: "Medium", xp: 20, time: "3m",
        desc: "a = 3, b = 7로 시작합니다. 임시 변수를 사용해 두 값을 교환한 뒤 a와 b를 한 줄에 공백으로 출력하세요.",
        example: { input: "", output: "7 3" } },
    ],
    practice: [
      { id: "t1-ch1-7-p1", title: "swap 후 차이 출력", diff: "Medium", xp: 20, time: "3m",
        desc: "a = 10, b = 4로 시작합니다. 두 값을 교환한 뒤 a와 b를 \"a b\" 형식으로 출력하세요.",
        example: { input: "", output: "4 10" } },
    ],
  },
};

LESSONS["t1-ch1-8"] = {
  trail: 1, ch: 1, no: 8, title: "변수값 동시에 복사",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "여러 변수를 동시에 같은 값으로 맞추거나, 한 줄에 여러 대입을 묶어 처리하는 방법을 익힙니다." },
      { type: "code", text: "int a, b, c;\na = b = c = 5;            // 모두 5\nprintf(\"%d %d %d\\n\", a, b, c);" },
      { type: "list", items: [
        "대입은 오른쪽에서 왼쪽으로 이루어집니다",
        "선언과 동시에 같은 값으로 초기화하려면 a = b = c = 값;",
      ] },
      { type: "callout", text: "여러 변수에 같은 값을 한 번에 넣고 싶을 때 자주 쓰이는 표현입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch1-8-b1", title: "세 변수 동시 초기화", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 변수 a, b, c를 모두 5로 동시에 초기화한 뒤, 세 값을 공백으로 구분해 출력하세요.",
        example: { input: "", output: "5 5 5" } },
    ],
    practice: [
      { id: "t1-ch1-8-p1", title: "복사 사슬", diff: "Medium", xp: 20, time: "3m",
        desc: "정수 변수 a, b, c, d를 모두 0으로 동시 초기화한 뒤, 한 줄에 공백으로 구분해 출력하세요.",
        example: { input: "", output: "0 0 0 0" } },
    ],
  },
};

LESSONS["t1-ch2-1"] = {
  trail: 1, ch: 2, no: 1, title: "정수 입력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "사용자가 키보드로 입력한 정수를 scanf 로 받아오는 방법을 익힙니다." },
      { type: "code", text: "int n;\nscanf(\"%d\", &n);\nprintf(\"%d\\n\", n);" },
      { type: "list", items: [
        "scanf 의 첫 인자는 형식 문자열 (\"%d\" → 정수)",
        "두 번째 인자에는 변수 이름 앞에 & 를 붙여 주소를 전달",
      ] },
      { type: "callout", text: "& 를 빠뜨리는 실수가 자주 발생합니다. scanf 인자에는 항상 변수 앞에 & 가 필요합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch2-1-b1", title: "정수 그대로 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 한 개를 입력 받아 그대로 한 줄에 출력하세요.",
        example: { input: "42", output: "42" } },
    ],
    practice: [
      { id: "t1-ch2-1-p1", title: "두 정수의 합", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 두 정수를 입력 받아 두 값의 합을 한 줄에 출력하세요.",
        example: { input: "3 5", output: "8" } },
    ],
  },
};

LESSONS["t1-ch2-2"] = {
  trail: 1, ch: 2, no: 2, title: "실수 입력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "double 형 실수를 scanf 로 받아오는 방법과, 출력할 때 자리수를 맞추는 법을 익힙니다." },
      { type: "code", text: "double x;\nscanf(\"%lf\", &x);\nprintf(\"%.2lf\\n\", x);" },
      { type: "list", items: [
        "double 입력 형식은 %lf",
        "출력 형식은 %f 또는 %lf 모두 사용 가능 (자리수 지정은 %.Nlf)",
      ] },
      { type: "callout", text: "입력 형식과 출력 형식 지정자가 살짝 다릅니다. 입력은 항상 %lf 라고 외워두세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch2-2-b1", title: "실수 두 자리 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "실수 한 개를 입력 받아 소수점 두 자리까지 반올림해 출력하세요.",
        example: { input: "3.14159", output: "3.14" } },
    ],
    practice: [
      { id: "t1-ch2-2-p1", title: "두 실수의 평균", diff: "Medium", xp: 20, time: "4m",
        desc: "공백으로 구분된 두 실수를 입력 받아 평균을 소수점 두 자리까지 출력하세요.",
        example: { input: "1.0 2.0", output: "1.50" } },
    ],
  },
};

LESSONS["t1-ch2-3"] = {
  trail: 1, ch: 2, no: 3, title: "공백을 사이에 두고 입력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "여러 값을 공백으로 구분해 한 번의 scanf 로 받아오는 방법을 익힙니다." },
      { type: "code", text: "int a, b, c;\nscanf(\"%d %d %d\", &a, &b, &c);\nprintf(\"%d %d %d\\n\", c, b, a);" },
      { type: "list", items: [
        "scanf(\"%d %d %d\", …) 한 줄로 세 값을 받음",
        "변수 인자도 차례대로 주소(&) 를 전달",
      ] },
      { type: "callout", text: "scanf 형식 문자열의 공백은 \"공백/탭/줄바꿈을 건너뛴다\" 는 뜻입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch2-3-b1", title: "세 정수 거꾸로 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 세 정수를 입력 받아 입력의 역순으로 공백을 사이에 두고 출력하세요.",
        example: { input: "1 2 3", output: "3 2 1" } },
    ],
    practice: [
      { id: "t1-ch2-3-p1", title: "세 정수의 합", diff: "Easy", xp: 10, time: "3m",
        desc: "공백으로 구분된 세 정수를 입력 받아 합을 한 줄에 출력하세요.",
        example: { input: "10 20 30", output: "60" } },
    ],
  },
};

LESSONS["t1-ch2-4"] = {
  trail: 1, ch: 2, no: 4, title: "2개씩 줄에 실수 입력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "여러 줄에 걸쳐 입력되는 실수 쌍을 받아 처리하는 방법을 익힙니다." },
      { type: "code", text: "double a, b, c, d;\nscanf(\"%lf %lf\", &a, &b);\nscanf(\"%lf %lf\", &c, &d);" },
      { type: "list", items: [
        "scanf 는 줄바꿈도 공백처럼 건너뛰므로 한 번의 scanf 로 여러 줄을 받아도 됩니다",
        "필요에 따라 줄마다 scanf 를 분리해도 결과는 같습니다",
      ] },
      { type: "callout", text: "출력 형식은 문제가 요구하는 자리수를 정확히 맞추세요. 끝의 줄바꿈도 빠뜨리지 않습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch2-4-b1", title: "두 줄 실수 합", diff: "Medium", xp: 20, time: "5m",
        desc: "첫 줄에 두 실수, 둘째 줄에 두 실수가 주어집니다. 네 실수의 합을 소수점 두 자리까지 출력하세요.",
        example: { input: "1.0 2.0\n3.0 4.0", output: "10.00" } },
    ],
    practice: [
      { id: "t1-ch2-4-p1", title: "두 직사각형 넓이의 합", diff: "Hard", xp: 50, time: "8m",
        desc: "직사각형 두 개의 가로/세로 길이가 두 줄에 걸쳐 실수로 주어집니다. 두 직사각형의 넓이의 합을 소수점 두 자리까지 출력하세요.",
        example: { input: "1.5 2.0\n3.0 4.0", output: "15.00" } },
    ],
  },
};

LESSONS["t1-ch2-5"] = {
  trail: 1, ch: 2, no: 5, title: "문자, 문자열 입력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "한 글자(char) 와 한 단어(문자열) 를 scanf 로 입력 받는 방법을 익힙니다." },
      { type: "code", text: "char c;\nchar s[100];\nscanf(\" %c\", &c);   // %c 앞 공백 주의\nscanf(\"%s\", s);     // 문자열은 & 없이" },
      { type: "list", items: [
        "char 한 글자: %c (앞에 공백을 두면 이전의 줄바꿈을 건너뜀)",
        "문자열: %s — 공백 전까지의 한 단어를 받음, 변수에 & 불필요",
      ] },
      { type: "callout", text: "%s 는 공백을 만나면 멈춥니다. 공백 포함 문장을 받으려면 다른 함수가 필요해요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch2-5-b1", title: "문자 그대로 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "문자 하나를 입력 받아 그대로 한 줄에 출력하세요.",
        example: { input: "A", output: "A" } },
    ],
    practice: [
      { id: "t1-ch2-5-p1", title: "단어 받아 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백 없는 단어 하나를 입력 받아 그대로 한 줄에 출력하세요.",
        example: { input: "hello", output: "hello" } },
    ],
  },
};

LESSONS["t1-ch2-6"] = {
  trail: 1, ch: 2, no: 6, title: "특정 문자를 사이에 두고 입력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "콤마(,)나 콜론(:) 같은 특정 문자를 구분자로 사용하는 입력을 받는 방법을 익힙니다." },
      { type: "code", text: "int h, m;\nscanf(\"%d:%d\", &h, &m);\nprintf(\"%d %d\\n\", h, m);" },
      { type: "list", items: [
        "형식 문자열 사이에 그대로 적은 문자(예: \":\") 는 입력에서 그 자리에 같은 문자가 나와야 한다는 뜻",
        "콤마 구분이라면 \"%d,%d\" 를 사용",
      ] },
      { type: "callout", text: "구분 문자 위치에 공백이 끼어 있을 수도 있다면 \"%d , %d\" 처럼 사이에 공백을 둘 수 있습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch2-6-b1", title: "시:분 분해", diff: "Medium", xp: 20, time: "5m",
        desc: "시각이 \"시:분\" 형식으로 주어집니다. 두 정수를 공백으로 구분해 한 줄에 출력하세요.",
        example: { input: "13:45", output: "13 45" } },
    ],
    practice: [
      { id: "t1-ch2-6-p1", title: "콤마로 구분된 두 정수 합", diff: "Medium", xp: 20, time: "5m",
        desc: "콤마로 구분된 두 정수가 주어집니다. 두 값의 합을 한 줄에 출력하세요.",
        example: { input: "7,8", output: "15" } },
    ],
  },
};

// --- Ch 3. 연산자 ---

LESSONS["t1-ch3-1"] = {
  trail: 1, ch: 3, no: 1, title: "산술 연산자",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "C의 기본 산술 연산자 +, -, *, /, %를 사용해 정수 계산을 수행합니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int a = 3, b = 5;\n  printf(\"%d\\n\", a + b);\n  printf(\"%d\\n\", b - a);\n  printf(\"%d\\n\", a * b);\n  printf(\"%d\\n\", b / a);\n  printf(\"%d\\n\", b % a);\n  return 0;\n}" },
      { type: "h3",   text: "연산자 종류" },
      { type: "list", items: ["+ 덧셈, - 뺄셈, * 곱셈", "/ 나눗셈 (정수 나눗셈은 소수점 버림)", "% 나머지 (mod)"] },
      { type: "callout", text: "정수끼리 나누면 결과도 정수입니다. 7 / 2 는 3이 됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch3-1-b1", title: "두 수의 합", diff: "Easy", xp: 10, time: "2m",
        desc: "두 정수 a, b가 공백으로 주어집니다. a + b를 출력하세요.",
        example: { input: "3 5", output: "8" } },
    ],
    practice: [
      { id: "t1-ch3-1-p1", title: "나머지 계산", diff: "Easy", xp: 10, time: "2m",
        desc: "두 정수 a, b가 공백으로 주어집니다. a % b를 출력하세요.",
        example: { input: "10 3", output: "1" } },
    ],
  },
};

LESSONS["t1-ch3-2"] = {
  trail: 1, ch: 3, no: 2, title: "관계 연산자",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "두 값을 비교하는 관계 연산자(==, !=, <, >, <=, >=)를 배웁니다. 결과는 참(1) 또는 거짓(0)입니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int a = 3, b = 5;\n  printf(\"%d\\n\", a < b);   // 1\n  printf(\"%d\\n\", a == b);  // 0\n  return 0;\n}" },
      { type: "h3",   text: "비교 연산자 목록" },
      { type: "list", items: ["== 같다, != 다르다", "< 작다, > 크다", "<= 작거나 같다, >= 크거나 같다", "결과값: 참이면 1, 거짓이면 0"] },
      { type: "callout", text: "= 는 대입, == 는 비교입니다. 혼동하지 않도록 주의하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch3-2-b1", title: "크기 비교", diff: "Easy", xp: 10, time: "2m",
        desc: "두 정수 a, b가 공백으로 주어집니다. a < b 의 결과(0 또는 1)를 출력하세요.",
        example: { input: "3 5", output: "1" } },
    ],
    practice: [
      { id: "t1-ch3-2-p1", title: "같은지 확인", diff: "Easy", xp: 10, time: "2m",
        desc: "두 정수 a, b가 공백으로 주어집니다. a == b 의 결과(0 또는 1)를 출력하세요.",
        example: { input: "4 4", output: "1" } },
    ],
  },
};

LESSONS["t1-ch3-3"] = {
  trail: 1, ch: 3, no: 3, title: "논리 연산자",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "논리 연산자 &&(AND), ||(OR), !(NOT)을 사용해 조건을 결합하거나 반전합니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int a = 1, b = 0;\n  printf(\"%d\\n\", a && b);  // 0\n  printf(\"%d\\n\", a || b);  // 1\n  printf(\"%d\\n\", !a);      // 0\n  return 0;\n}" },
      { type: "h3",   text: "논리 연산 진리표" },
      { type: "list", items: ["&& : 양쪽 모두 참이어야 1", "|| : 하나라도 참이면 1", "! : 참↔거짓 반전"] },
      { type: "callout", text: "C에서 0은 거짓, 0이 아닌 값은 모두 참으로 취급합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch3-3-b1", title: "AND 연산", diff: "Easy", xp: 10, time: "2m",
        desc: "두 정수 a, b가 공백으로 주어집니다. a && b 의 결과(0 또는 1)를 출력하세요.",
        example: { input: "1 0", output: "0" } },
    ],
    practice: [
      { id: "t1-ch3-3-p1", title: "OR 연산", diff: "Easy", xp: 10, time: "2m",
        desc: "두 정수 a, b가 공백으로 주어집니다. a || b 의 결과(0 또는 1)를 출력하세요.",
        example: { input: "0 1", output: "1" } },
    ],
  },
};

LESSONS["t1-ch3-4"] = {
  trail: 1, ch: 3, no: 4, title: "비트 연산자",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "비트 단위 연산자 &, |, ^, ~, <<, >>를 익히고 정수의 이진 표현을 이해합니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int a = 5, b = 3;\n  printf(\"%d\\n\", a & b);   // 1\n  printf(\"%d\\n\", a | b);   // 7\n  printf(\"%d\\n\", a ^ b);   // 6\n  printf(\"%d\\n\", a << 1);  // 10\n  return 0;\n}" },
      { type: "h3",   text: "비트 연산 정리" },
      { type: "list", items: ["& : 비트 AND (둘 다 1이어야 1)", "| : 비트 OR (하나라도 1이면 1)", "^ : 비트 XOR (다를 때 1)", "~ : 비트 NOT (전체 반전)", "<< n : 왼쪽 n칸 이동 (×2ⁿ)", ">> n : 오른쪽 n칸 이동 (÷2ⁿ)"] },
      { type: "callout", text: "5 = 0101₂, 3 = 0011₂ → 5 & 3 = 0001₂ = 1" },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch3-4-b1", title: "비트 AND/OR", diff: "Easy", xp: 10, time: "3m",
        desc: "두 정수 a, b가 공백으로 주어집니다. a & b 와 a | b 를 각 줄에 출력하세요.",
        example: { input: "5 3", output: "1\n7" } },
    ],
    practice: [
      { id: "t1-ch3-4-p1", title: "비트 XOR", diff: "Easy", xp: 10, time: "3m",
        desc: "두 정수 a, b가 공백으로 주어집니다. a ^ b 를 출력하세요.",
        example: { input: "5 3", output: "6" } },
    ],
  },
};

// --- Ch 4. 단순 반복문 ---

LESSONS["t1-ch4-1"] = {
  trail: 1, ch: 4, no: 1, title: "for 입문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "for 루프를 사용해 정해진 횟수만큼 코드를 반복 실행합니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int sum = 0;\n  for (int i = 1; i <= 5; i++) {\n    sum += i;\n  }\n  printf(\"%d\\n\", sum);\n  return 0;\n}" },
      { type: "h3",   text: "for 문 구조" },
      { type: "list", items: ["초기식 : 루프 시작 전 한 번 실행 (int i = 1)", "조건식 : 매 반복 전 검사 (i <= 5)", "증감식 : 매 반복 후 실행 (i++)", "세 부분 모두 생략 가능"] },
      { type: "callout", text: "1부터 N까지의 합 = N×(N+1)/2 공식으로도 구할 수 있지만, for 루프를 익히는 것이 먼저입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch4-1-b1", title: "1부터 N까지 합", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N이 주어집니다. 1부터 N까지의 합을 출력하세요.",
        example: { input: "5", output: "15" } },
    ],
    practice: [
      { id: "t1-ch4-1-p1", title: "1부터 N까지 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N이 주어집니다. 1부터 N까지를 한 줄에 하나씩 출력하세요.",
        example: { input: "3", output: "1\n2\n3" } },
    ],
  },
};

LESSONS["t1-ch4-2"] = {
  trail: 1, ch: 4, no: 2, title: "while 입문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "while 루프를 사용해 조건이 참인 동안 코드를 반복 실행합니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int i = 1, sum = 0;\n  while (i <= 5) {\n    sum += i;\n    i++;\n  }\n  printf(\"%d\\n\", sum);\n  return 0;\n}" },
      { type: "h3",   text: "while 문 구조" },
      { type: "list", items: ["while (조건) { 반복할 코드 }", "조건이 거짓이 되면 루프 종료", "반복 변수는 루프 바깥에서 선언", "루프 안에서 조건 변수를 변경해야 무한루프 방지"] },
      { type: "callout", text: "while은 반복 횟수를 모를 때, for는 반복 횟수를 알 때 주로 사용합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch4-2-b1", title: "while로 1부터 N까지 합", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N이 주어집니다. while 루프를 사용해 1부터 N까지의 합을 출력하세요.",
        example: { input: "4", output: "10" } },
    ],
    practice: [
      { id: "t1-ch4-2-p1", title: "N부터 1까지 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N이 주어집니다. N부터 1까지를 한 줄에 하나씩 출력하세요.",
        example: { input: "3", output: "3\n2\n1" } },
    ],
  },
};

LESSONS["t1-ch4-3"] = {
  trail: 1, ch: 4, no: 3, title: "for vs while",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "for 루프와 while 루프를 비교하여 같은 문제를 두 방식으로 작성해 봅니다." },
      { type: "code", text: "// for 버전\nfor (int i = 0; i < 3; i++) printf(\"%d\\n\", i);\n\n// while 버전\nint i = 0;\nwhile (i < 3) { printf(\"%d\\n\", i); i++; }" },
      { type: "h3",   text: "선택 기준" },
      { type: "list", items: ["for : 반복 횟수가 정해진 경우 (배열 순회, 카운팅)", "while : 조건 기반 반복 (입력이 끝날 때까지, 특정 값까지)", "기능적으로는 서로 변환 가능"] },
      { type: "callout", text: "가독성을 위해 관례적으로 쓰는 방식을 따르는 것이 좋습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch4-3-b1", title: "짝수 합 (for)", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N이 주어집니다. for 루프를 사용해 1부터 N까지의 짝수의 합을 출력하세요.",
        example: { input: "6", output: "12" } },
    ],
    practice: [
      { id: "t1-ch4-3-p1", title: "짝수 합 (while)", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N이 주어집니다. while 루프를 사용해 1부터 N까지의 짝수의 합을 출력하세요.",
        example: { input: "6", output: "12" } },
    ],
  },
};

LESSONS["t1-ch4-4"] = {
  trail: 1, ch: 4, no: 4, title: "do-while",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "do-while 루프를 사용해 조건 검사 전에 코드를 최소 한 번 실행합니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int n;\n  do {\n    scanf(\"%d\", &n);\n  } while (n <= 0);\n  printf(\"%d\\n\", n);\n  return 0;\n}" },
      { type: "h3",   text: "do-while 구조" },
      { type: "list", items: ["do { 본체 } while (조건);", "본체를 먼저 실행 → 이후 조건 확인", "조건이 참이면 다시 본체 실행, 거짓이면 종료", "최소 1회 실행이 보장되어야 할 때 유용"] },
      { type: "callout", text: "do-while의 while 뒤에는 세미콜론(;)이 필요합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch4-4-b1", title: "양수 입력 보장", diff: "Easy", xp: 10, time: "3m",
        desc: "양수가 입력될 때까지 반복해서 읽습니다. 양수를 읽으면 그 값을 출력하세요. (입력은 항상 양수 하나만 주어진다고 가정하세요.)",
        example: { input: "7", output: "7" } },
    ],
    practice: [
      { id: "t1-ch4-4-p1", title: "do-while로 카운트다운", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 N이 주어집니다. do-while을 사용해 N부터 1까지 한 줄에 하나씩 출력하세요.",
        example: { input: "3", output: "3\n2\n1" } },
    ],
  },
};

// --- Ch 5. 다중 반복문 ---

LESSONS["t1-ch5-1"] = {
  trail: 1, ch: 5, no: 1, title: "중첩 for",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "for 루프 안에 또 다른 for 루프를 넣어 2차원 격자를 다루는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int n = 2, m = 3;\n  for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= m; j++) {\n      printf(\"%d %d\\n\", i, j);\n    }\n  }\n  return 0;\n}" },
      { type: "h3",   text: "중첩 루프 원리" },
      { type: "list", items: ["바깥 루프 1회 돌 때 안쪽 루프가 전체 실행", "총 반복 횟수 = 바깥 × 안쪽", "2차원 배열, 표, 격자 패턴 출력에 활용"] },
      { type: "callout", text: "중첩이 깊을수록 복잡도가 곱으로 증가합니다. 불필요한 중첩은 피하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch5-1-b1", title: "NxM 좌표 출력", diff: "Easy", xp: 10, time: "4m",
        desc: "두 정수 N, M이 공백으로 주어집니다. (1,1)부터 (N,M)까지 행 우선으로 각 좌표를 한 줄에 출력하세요.",
        example: { input: "2 2", output: "1 1\n1 2\n2 1\n2 2" } },
    ],
    practice: [
      { id: "t1-ch5-1-p1", title: "두 수의 곱 표", diff: "Easy", xp: 10, time: "4m",
        desc: "두 정수 N, M이 공백으로 주어집니다. i×j 값을 행 우선으로 각 줄에 출력하세요. (1≤i≤N, 1≤j≤M)",
        example: { input: "2 3", output: "1\n2\n3\n2\n4\n6" } },
    ],
  },
};

LESSONS["t1-ch5-2"] = {
  trail: 1, ch: 5, no: 2, title: "별 찍기",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "중첩 for 루프로 다양한 별(*) 패턴을 출력하는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int n = 3;\n  for (int i = 1; i <= n; i++) {\n    for (int j = 0; j < i; j++) {\n      printf(\"*\");\n    }\n    printf(\"\\n\");\n  }\n  return 0;\n}" },
      { type: "h3",   text: "패턴 출력 전략" },
      { type: "list", items: ["행 번호 i에 따라 안쪽 루프 범위를 조절", "직각삼각형: j < i", "역삼각형: j < n-i+1", "각 행 끝에 printf(\"\\n\") 추가"] },
      { type: "callout", text: "별 찍기 문제는 i와 j의 관계식을 찾는 연습입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch5-2-b1", title: "직각삼각형 별", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 N이 주어집니다. N행짜리 직각삼각형 별을 출력하세요. i번째 줄에는 별 i개를 출력합니다.",
        example: { input: "3", output: "*\n**\n***" } },
    ],
    practice: [
      { id: "t1-ch5-2-p1", title: "역삼각형 별", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 N이 주어집니다. N행짜리 역삼각형 별을 출력하세요. i번째 줄에는 별 N-i+1개를 출력합니다.",
        example: { input: "3", output: "***\n**\n*" } },
    ],
  },
};

LESSONS["t1-ch5-3"] = {
  trail: 1, ch: 5, no: 3, title: "구구단",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "중첩 for 루프로 구구단 표를 출력합니다. N단을 1~9까지 계산해 출력합니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  for (int i = 1; i <= 9; i++) {\n    printf(\"%d * %d = %d\\n\", n, i, n * i);\n  }\n  return 0;\n}" },
      { type: "h3",   text: "구구단 패턴" },
      { type: "list", items: ["단 수 n은 입력받거나 고정", "i를 1부터 9까지 순회하며 n*i 계산", "형식: \"n * i = 결과\" 출력", "전체 구구단: 바깥 루프로 n을 2~9 순회"] },
      { type: "callout", text: "printf 형식 문자열로 표 형태를 맞추면 더 보기 좋습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch5-3-b1", title: "N단 구구단", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 N이 주어집니다. N단 구구단을 \"N * i = 결과\" 형식으로 i=1~9 순서로 출력하세요.",
        example: { input: "2", output: "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18" } },
    ],
    practice: [
      { id: "t1-ch5-3-p1", title: "2단~N단 구구단", diff: "Easy", xp: 10, time: "5m",
        desc: "정수 N(2≤N≤9)이 주어집니다. 2단부터 N단까지 구구단을 같은 형식으로 출력하세요. 각 단 사이에 빈 줄을 넣지 마세요.",
        example: { input: "3", output: "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18\n3 * 1 = 3\n3 * 2 = 6\n3 * 3 = 9\n3 * 4 = 12\n3 * 5 = 15\n3 * 6 = 18\n3 * 7 = 21\n3 * 8 = 24\n3 * 9 = 27" } },
    ],
  },
};

// --- Ch 6. 1차원 배열 ---

LESSONS["t1-ch6-1"] = {
  trail: 1, ch: 6, no: 1, title: "배열 선언",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "C에서 1차원 배열을 선언하고 초기화하는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int arr[5] = {10, 20, 30, 40, 50};\n  printf(\"%d\\n\", arr[0]);\n  return 0;\n}" },
      { type: "h3",   text: "배열 기본" },
      { type: "list", items: ["선언: 자료형 배열명[크기];", "인덱스는 0부터 시작", "초기화: int arr[5] = {1,2,3,4,5};", "선언만 하면 쓰레기 값이 들어있음"] },
      { type: "callout", text: "배열 인덱스 범위를 벗어나면 정의되지 않은 동작(UB)이 발생합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch6-1-b1", title: "배열 첫 원소 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 5개를 한 줄에 공백으로 입력받아 배열에 저장한 뒤, 첫 번째 원소를 출력하세요.",
        example: { input: "10 20 30 40 50", output: "10" } },
    ],
    practice: [
      { id: "t1-ch6-1-p1", title: "배열 마지막 원소 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 5개를 한 줄에 공백으로 입력받아 배열에 저장한 뒤, 마지막(5번째) 원소를 출력하세요.",
        example: { input: "10 20 30 40 50", output: "50" } },
    ],
  },
};

LESSONS["t1-ch6-2"] = {
  trail: 1, ch: 6, no: 2, title: "배열 입출력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "반복문으로 배열 원소를 입력받고 순서대로 출력하는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int n = 4;\n  int arr[4];\n  for (int i = 0; i < n; i++) {\n    scanf(\"%d\", &arr[i]);\n  }\n  for (int i = 0; i < n; i++) {\n    printf(\"%d\\n\", arr[i]);\n  }\n  return 0;\n}" },
      { type: "h3",   text: "배열 입출력 패턴" },
      { type: "list", items: ["scanf로 인덱스 0부터 n-1까지 입력", "printf로 인덱스 순서대로 출력", "for 루프와 배열 인덱스를 결합"] },
      { type: "callout", text: "배열 크기를 초과해 쓰거나 읽지 않도록 항상 n을 확인하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch6-2-b1", title: "배열 원소 역순 출력", diff: "Easy", xp: 10, time: "4m",
        desc: "첫 줄에 N(1≤N≤5), 둘째 줄에 정수 N개가 공백으로 주어집니다. 입력받은 원소를 역순으로 한 줄씩 출력하세요.",
        example: { input: "4\n1 2 3 4", output: "4\n3\n2\n1" } },
    ],
    practice: [
      { id: "t1-ch6-2-p1", title: "배열 원소 순서대로 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "첫 줄에 N(1≤N≤5), 둘째 줄에 정수 N개가 공백으로 주어집니다. 입력받은 원소를 순서대로 한 줄씩 출력하세요.",
        example: { input: "3\n7 2 5", output: "7\n2\n5" } },
    ],
  },
};

LESSONS["t1-ch6-3"] = {
  trail: 1, ch: 6, no: 3, title: "배열 합계",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "배열에 저장된 원소를 모두 더해 합계를 구하는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int n, arr[100], sum = 0;\n  scanf(\"%d\", &n);\n  for (int i = 0; i < n; i++) {\n    scanf(\"%d\", &arr[i]);\n    sum += arr[i];\n  }\n  printf(\"%d\\n\", sum);\n  return 0;\n}" },
      { type: "h3",   text: "누적 합계" },
      { type: "list", items: ["sum 변수를 0으로 초기화", "for 루프에서 sum += arr[i]", "배열 전부 읽은 뒤 sum 출력", "입력과 동시에 누적해도 결과 동일"] },
      { type: "callout", text: "합계가 int 범위를 넘을 수 있으면 long long을 사용하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch6-3-b1", title: "N개 정수의 합", diff: "Easy", xp: 10, time: "4m",
        desc: "첫 줄에 N(1≤N≤5), 둘째 줄에 정수 N개가 공백으로 주어집니다. 모든 원소의 합을 출력하세요.",
        example: { input: "5\n1 2 3 4 5", output: "15" } },
    ],
    practice: [
      { id: "t1-ch6-3-p1", title: "짝수 인덱스 원소의 합", diff: "Easy", xp: 10, time: "4m",
        desc: "첫 줄에 N(1≤N≤5), 둘째 줄에 정수 N개가 공백으로 주어집니다. 인덱스 0, 2, 4 … 위치의 원소들의 합을 출력하세요.",
        example: { input: "5\n1 2 3 4 5", output: "9" } },
    ],
  },
};

LESSONS["t1-ch6-4"] = {
  trail: 1, ch: 6, no: 4, title: "최대/최소",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "배열에서 최대값과 최소값을 찾는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int n, arr[100];\n  scanf(\"%d\", &n);\n  for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n  int mx = arr[0], mn = arr[0];\n  for (int i = 1; i < n; i++) {\n    if (arr[i] > mx) mx = arr[i];\n    if (arr[i] < mn) mn = arr[i];\n  }\n  printf(\"%d %d\\n\", mx, mn);\n  return 0;\n}" },
      { type: "h3",   text: "최대/최소 탐색" },
      { type: "list", items: ["초기값은 arr[0]으로 설정", "i=1부터 비교 시작", "최대: arr[i] > mx 이면 갱신", "최소: arr[i] < mn 이면 갱신"] },
      { type: "callout", text: "배열이 비어있을 때를 대비해 항상 n >= 1을 가정하거나 예외 처리하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch6-4-b1", title: "최대값과 최소값", diff: "Easy", xp: 10, time: "4m",
        desc: "첫 줄에 N(1≤N≤5), 둘째 줄에 정수 N개가 공백으로 주어집니다. 최대값과 최소값을 공백으로 구분해 한 줄에 출력하세요.",
        example: { input: "5\n3 1 4 1 5", output: "5 1" } },
    ],
    practice: [
      { id: "t1-ch6-4-p1", title: "최대값의 인덱스", diff: "Easy", xp: 10, time: "4m",
        desc: "첫 줄에 N(1≤N≤5), 둘째 줄에 정수 N개가 공백으로 주어집니다. 최대값이 처음 등장하는 인덱스(0-based)를 출력하세요.",
        example: { input: "5\n3 1 5 2 5", output: "2" } },
    ],
  },
};

// --- Ch 7. 2차원 배열 ---

LESSONS["t1-ch7-1"] = {
  trail: 1, ch: 7, no: 1, title: "2차원 배열 선언",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "2차원 배열을 선언·초기화하고 행·열 인덱스로 원소에 접근하는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int mat[2][3] = {{1,2,3},{4,5,6}};\n  printf(\"%d\\n\", mat[1][2]);\n  return 0;\n}" },
      { type: "h3",   text: "2차원 배열 구조" },
      { type: "list", items: ["선언: 자료형 배열명[행][열];", "인덱스: arr[i][j] (i=행, j=열)", "메모리에는 행 우선(row-major)으로 연속 저장", "초기화: {{…},{…}} 중괄호 중첩"] },
      { type: "callout", text: "행과 열 크기를 상수로 정의하면 코드 수정이 쉬워집니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch7-1-b1", title: "2×2 배열 원소 접근", diff: "Easy", xp: 10, time: "3m",
        desc: "2×2 행렬을 행 우선으로 한 줄에 공백으로 입력받습니다 (첫 줄: a00 a01, 둘째 줄: a10 a11). [1][1] 위치의 값을 출력하세요.",
        example: { input: "1 2\n3 4", output: "4" } },
    ],
    practice: [
      { id: "t1-ch7-1-p1", title: "2×2 배열 대각합", diff: "Easy", xp: 10, time: "4m",
        desc: "2×2 행렬을 행 우선으로 입력받습니다 (첫 줄: a00 a01, 둘째 줄: a10 a11). 주대각선 원소(a00, a11)의 합을 출력하세요.",
        example: { input: "1 2\n3 4", output: "5" } },
    ],
  },
};

LESSONS["t1-ch7-2"] = {
  trail: 1, ch: 7, no: 2, title: "2차원 입출력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "중첩 for 루프로 2차원 배열을 입력받고, 모든 원소를 행 우선으로 출력하는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int n = 2, m = 3;\n  int a[2][3];\n  for (int i = 0; i < n; i++)\n    for (int j = 0; j < m; j++)\n      scanf(\"%d\", &a[i][j]);\n  for (int i = 0; i < n; i++) {\n    for (int j = 0; j < m; j++)\n      printf(\"%d \", a[i][j]);\n    printf(\"\\n\");\n  }\n  return 0;\n}" },
      { type: "h3",   text: "2차원 입출력 패턴" },
      { type: "list", items: ["바깥 루프: 행(i)", "안쪽 루프: 열(j)", "scanf(&a[i][j])로 입력", "각 행 출력 후 개행"] },
      { type: "callout", text: "출력 형식(공백, 개행)을 문제 요구사항에 맞게 정확히 맞추세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch7-2-b1", title: "2×3 행렬 합", diff: "Easy", xp: 10, time: "4m",
        desc: "2×3 행렬을 2줄(각 줄에 3개 정수, 공백 구분)로 입력받아 모든 원소의 합을 출력하세요.",
        example: { input: "1 2 3\n4 5 6", output: "21" } },
    ],
    practice: [
      { id: "t1-ch7-2-p1", title: "2×3 행렬 그대로 출력", diff: "Easy", xp: 10, time: "4m",
        desc: "2×3 행렬을 2줄로 입력받아 동일한 형태로 출력하세요. 각 줄에서 숫자 사이는 공백 하나, 각 줄 끝에 개행.",
        example: { input: "1 2 3\n4 5 6", output: "1 2 3\n4 5 6" } },
    ],
  },
};

LESSONS["t1-ch7-3"] = {
  trail: 1, ch: 7, no: 3, title: "행렬 전치",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "N×N 정방행렬의 전치(transpose)를 구해 출력하는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  int n = 2;\n  int a[2][2], t[2][2];\n  for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n      scanf(\"%d\", &a[i][j]);\n  for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n      t[i][j] = a[j][i];\n  for (int i = 0; i < n; i++) {\n    for (int j = 0; j < n; j++)\n      printf(\"%d \", t[i][j]);\n    printf(\"\\n\");\n  }\n  return 0;\n}" },
      { type: "h3",   text: "전치 행렬" },
      { type: "list", items: ["전치: t[i][j] = a[j][i]", "행과 열을 교환한 결과", "원래 배열을 수정하지 않고 새 배열에 저장", "정방 행렬(N×N)에서만 크기가 같음"] },
      { type: "callout", text: "비정방 행렬(N×M → M×N)을 전치할 때는 크기가 바뀌므로 주의하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch7-3-b1", title: "2×2 행렬 전치", diff: "Easy", xp: 10, time: "4m",
        desc: "2×2 행렬을 2줄로 입력받아 전치 행렬을 같은 형식으로 출력하세요. 각 줄에서 숫자 사이는 공백 하나.",
        example: { input: "1 2\n3 4", output: "1 3\n2 4" } },
    ],
    practice: [
      { id: "t1-ch7-3-p1", title: "3×3 행렬 전치", diff: "Easy", xp: 10, time: "4m",
        desc: "3×3 행렬을 3줄로 입력받아 전치 행렬을 같은 형식으로 출력하세요. 각 줄에서 숫자 사이는 공백 하나.",
        example: { input: "1 2 3\n4 5 6\n7 8 9", output: "1 4 7\n2 5 8\n3 6 9" } },
    ],
  },
};

// --- Ch 8. 문자열 ---

LESSONS["t1-ch8-1"] = {
  trail: 1, ch: 8, no: 1, title: "문자열 입력",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "char 배열로 문자열을 입력받고 출력하는 기본 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\nint main() {\n  char s[101];\n  scanf(\"%s\", s);\n  printf(\"%s\\n\", s);\n  return 0;\n}" },
      { type: "h3",   text: "문자열 기초" },
      { type: "list", items: ["C 문자열은 char 배열 + 널 종료 문자('\\0')", "scanf(\"%s\", s): 공백 전까지 읽음", "배열 크기는 최대 길이+1 (널 문자 공간)", "printf(\"%s\", s): 널 문자까지 출력"] },
      { type: "callout", text: "공백 포함 입력은 fgets나 scanf(\"%[^\\n]\")를 사용하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch8-1-b1", title: "문자열 그대로 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백 없는 문자열 하나를 입력받아 그대로 출력하세요.",
        example: { input: "hello", output: "hello" } },
    ],
    practice: [
      { id: "t1-ch8-1-p1", title: "문자열 두 번 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백 없는 문자열 하나를 입력받아 두 줄에 걸쳐 반복 출력하세요.",
        example: { input: "hi", output: "hi\nhi" } },
    ],
  },
};

LESSONS["t1-ch8-2"] = {
  trail: 1, ch: 8, no: 2, title: "strlen",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "string.h의 strlen 함수로 문자열 길이를 구하는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\nint main() {\n  char s[101];\n  scanf(\"%s\", s);\n  printf(\"%d\\n\", (int)strlen(s));\n  return 0;\n}" },
      { type: "h3",   text: "strlen 함수" },
      { type: "list", items: ["strlen(s): 널 문자 제외 길이 반환", "반환형 size_t → printf 시 (int) 캐스팅 권장", "#include <string.h> 필요", "빈 문자열이면 0 반환"] },
      { type: "callout", text: "strlen은 O(n)이므로 루프 조건에 반복 호출하면 비효율적입니다. 변수에 저장 후 사용하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch8-2-b1", title: "문자열 길이 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "공백 없는 문자열 하나를 입력받아 그 길이를 출력하세요.",
        example: { input: "hello", output: "5" } },
    ],
    practice: [
      { id: "t1-ch8-2-p1", title: "더 긴 문자열 길이", diff: "Easy", xp: 10, time: "4m",
        desc: "공백 없는 문자열 두 개를 각각 한 줄씩 입력받아 둘 중 더 긴 문자열의 길이를 출력하세요. (길이가 같으면 그 길이를 출력)",
        example: { input: "hi\nhello", output: "5" } },
    ],
  },
};

LESSONS["t1-ch8-3"] = {
  trail: 1, ch: 8, no: 3, title: "strcpy/strcmp",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "strcpy로 문자열을 복사하고 strcmp로 두 문자열을 비교하는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\nint main() {\n  char a[101], b[101];\n  scanf(\"%s%s\", a, b);\n  if (strcmp(a, b) == 0)\n    printf(\"same\\n\");\n  else\n    printf(\"diff\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "strcpy / strcmp" },
      { type: "list", items: ["strcpy(dst, src): src를 dst로 복사", "strcmp(a, b): 같으면 0, a<b면 음수, a>b면 양수", "문자열 대입에 = 연산자 사용 불가", "#include <string.h> 필요"] },
      { type: "callout", text: "strcpy 대신 안전한 strncpy를 사용하면 버퍼 오버플로를 방지할 수 있습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch8-3-b1", title: "두 문자열 비교", diff: "Easy", xp: 10, time: "4m",
        desc: "공백 없는 문자열 두 개를 각각 한 줄씩 입력받아, 같으면 \"same\", 다르면 \"diff\"를 출력하세요.",
        example: { input: "abc\nabc", output: "same" } },
    ],
    practice: [
      { id: "t1-ch8-3-p1", title: "두 문자열 비교 (다른 경우)", diff: "Easy", xp: 10, time: "4m",
        desc: "공백 없는 문자열 두 개를 각각 한 줄씩 입력받아, 같으면 \"same\", 다르면 \"diff\"를 출력하세요.",
        example: { input: "abc\ndef", output: "diff" } },
    ],
  },
};

LESSONS["t1-ch8-4"] = {
  trail: 1, ch: 8, no: 4, title: "문자열 뒤집기",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "문자 배열을 직접 조작해 문자열을 역순으로 뒤집는 방법을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\nint main() {\n  char s[101];\n  scanf(\"%s\", s);\n  int len = (int)strlen(s);\n  for (int i = 0, j = len - 1; i < j; i++, j--) {\n    char tmp = s[i];\n    s[i] = s[j];\n    s[j] = tmp;\n  }\n  printf(\"%s\\n\", s);\n  return 0;\n}" },
      { type: "h3",   text: "문자열 뒤집기 알고리즘" },
      { type: "list", items: ["양 끝 포인터 i, j를 안쪽으로 이동", "s[i]와 s[j]를 swap", "i < j 조건이 될 때까지 반복", "strlen으로 길이 구한 뒤 처리"] },
      { type: "callout", text: "string.h의 strrev는 표준 함수가 아닙니다. 직접 구현하는 습관을 들이세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t1-ch8-4-b1", title: "문자열 뒤집어 출력", diff: "Easy", xp: 10, time: "4m",
        desc: "공백 없는 문자열 하나를 입력받아 역순으로 출력하세요.",
        example: { input: "hello", output: "olleh" } },
    ],
    practice: [
      { id: "t1-ch8-4-p1", title: "회문 판별", diff: "Easy", xp: 10, time: "5m",
        desc: "공백 없는 문자열 하나를 입력받아 회문(앞뒤가 같은 문자열)이면 \"yes\", 아니면 \"no\"를 출력하세요.",
        example: { input: "racecar", output: "yes" } },
    ],
  },
};

// === END Trail 1 ===

// ===== Trail 2 (Novice Mid — 프로그래밍 연습) =====

// --- Ch 1. 함수 ---

LESSONS["t2-ch1-1"] = {
  trail: 2, ch: 1, no: 1, title: "값을 반환하지 않는 함수",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "반환값이 없는 void 함수를 정의하고 호출하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nvoid greet() {\n  printf(\"Hello\\n\");\n}\n\nint main() {\n  greet();\n  greet();\n  return 0;\n}" },
      { type: "h3",   text: "void 함수" },
      { type: "list", items: ["void 를 반환형으로 쓰면 값을 돌려주지 않는 함수", "함수 이름() { … } 형태로 정의", "main() 에서 함수 이름(); 으로 호출", "같은 코드를 여러 번 재사용할 수 있어 코드가 짧아짐"] },
      { type: "callout", text: "함수를 정의하는 코드는 호출하는 코드보다 위에 있어야 합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch1-1-b1", title: "인사 함수 호출", diff: "Easy", xp: 10, time: "2m",
        desc: "'Hi' 를 출력하는 void 함수를 만들고, 그 함수를 두 번 호출하세요.",
        example: { input: "", output: "Hi\nHi" } },
    ],
    practice: [
      { id: "t2-ch1-1-p1", title: "구분선 함수", diff: "Easy", xp: 10, time: "3m",
        desc: "'----' (하이픈 4개) 를 출력하는 void 함수를 만들고 세 번 호출하세요.",
        example: { input: "", output: "----\n----\n----" } },
    ],
  },
};

LESSONS["t2-ch1-2"] = {
  trail: 2, ch: 1, no: 2, title: "값을 반환하는 함수",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "계산 결과를 return 으로 돌려주는 함수를 정의하고 활용하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint square(int x) {\n  return x * x;\n}\n\nint main() {\n  printf(\"%d\\n\", square(4)); // 16\n  return 0;\n}" },
      { type: "h3",   text: "반환형과 return" },
      { type: "list", items: ["반환형을 int, double 등으로 선언하면 return 으로 값을 돌려줄 수 있음", "return 값; 이 실행되면 함수가 즉시 종료되고 값이 호출한 곳으로 전달됨", "반환된 값을 변수에 저장하거나 printf 에 직접 사용 가능"] },
      { type: "callout", text: "return 뒤의 코드는 실행되지 않으니 주의하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch1-2-b1", title: "절댓값 함수", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 하나를 입력받아 그 절댓값을 반환하는 함수를 만들고, 결과를 출력하세요.",
        example: { input: "-7\n", output: "7" } },
    ],
    practice: [
      { id: "t2-ch1-2-p1", title: "두 수의 최솟값", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 두 개를 입력받아 더 작은 값을 반환하는 함수를 만들고, 결과를 출력하세요.",
        example: { input: "3 8\n", output: "3" } },
    ],
  },
};

LESSONS["t2-ch1-3"] = {
  trail: 2, ch: 1, no: 3, title: "Call by value / Call by reference",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "함수에 값을 복사해서 넘기는 방식(call by value)과 주소를 넘겨 원본을 바꾸는 방식(call by reference)의 차이를 이해합니다." },
      { type: "code", text: "#include <stdio.h>\n\nvoid addOne(int *p) {\n  *p = *p + 1;\n}\n\nint main() {\n  int a = 5;\n  addOne(&a);\n  printf(\"%d\\n\", a); // 6\n  return 0;\n}" },
      { type: "h3",   text: "Call by value vs Call by reference" },
      { type: "list", items: ["Call by value: 변수의 복사본이 전달 → 함수 안에서 바꿔도 원본 불변", "Call by reference: 주소(&)를 전달 → 함수 안에서 포인터(*)로 원본 수정 가능", "포인터 매개변수 선언: int *p", "역참조 연산자 *p 로 원본 값 읽기/쓰기"] },
      { type: "callout", text: "swap 같이 두 변수를 교환하는 함수는 call by reference 로 구현해야 합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch1-3-b1", title: "포인터로 값 두 배", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 한 개를 입력받아, 포인터 매개변수로 받아 값을 2배로 만드는 함수를 작성하고 결과를 출력하세요.",
        example: { input: "6\n", output: "12" } },
    ],
    practice: [
      { id: "t2-ch1-3-p1", title: "포인터 swap", diff: "Medium", xp: 20, time: "5m",
        desc: "정수 두 개를 입력받아 포인터를 이용해 두 값을 교환하는 함수를 작성하고, 교환 후 두 값을 공백으로 구분해 출력하세요.",
        example: { input: "3 7\n", output: "7 3" } },
    ],
  },
};

LESSONS["t2-ch1-4"] = {
  trail: 2, ch: 1, no: 4, title: "변수의 영역",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "변수가 어디서 선언됐는지에 따라 사용 가능한 범위(scope)가 달라지는 원리를 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint g = 10; // 전역 변수\n\nvoid show() {\n  int local = 5; // 지역 변수\n  printf(\"%d %d\\n\", g, local);\n}\n\nint main() {\n  show();\n  return 0;\n}" },
      { type: "h3",   text: "지역 변수와 전역 변수" },
      { type: "table", rows: [
        ["구분",      "선언 위치",       "유효 범위"],
        ["지역 변수", "함수 { } 안",     "해당 함수 안에서만"],
        ["전역 변수", "모든 함수 바깥", "프로그램 전체"],
      ] },
      { type: "callout", text: "이름이 같은 지역 변수와 전역 변수가 있으면 지역 변수가 우선됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch1-4-b1", title: "전역 변수 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "전역 변수 g 에 42 를 저장하고, 함수 안에서 g 값을 출력하세요.",
        example: { input: "", output: "42" } },
    ],
    practice: [
      { id: "t2-ch1-4-p1", title: "지역/전역 합산", diff: "Easy", xp: 10, time: "3m",
        desc: "전역 변수 g = 10, 함수 안 지역 변수 local = 5 를 선언하고, 두 값의 합을 출력하세요.",
        example: { input: "", output: "15" } },
    ],
  },
};

// --- Ch 2. 재귀함수 ---

LESSONS["t2-ch2-1"] = {
  trail: 2, ch: 2, no: 1, title: "값을 반환하지 않는 재귀함수",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "자기 자신을 호출하는 재귀 함수로 반복 출력을 구현하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nvoid count(int n) {\n  if (n <= 0) return;\n  printf(\"%d\\n\", n);\n  count(n - 1);\n}\n\nint main() {\n  count(3);\n  return 0;\n}" },
      { type: "h3",   text: "재귀 함수의 구조" },
      { type: "list", items: ["기저 조건(base case): 재귀를 멈추는 조건 — 반드시 필요", "재귀 호출: 자기 자신을 더 작은 인자로 호출", "기저 조건 없이 계속 호출하면 스택 오버플로우 발생"] },
      { type: "callout", text: "재귀 함수를 작성할 때는 항상 기저 조건을 먼저 생각하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch2-1-b1", title: "카운트다운", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n 을 입력받아 n 부터 1 까지 한 줄씩 출력하는 재귀 함수를 작성하세요.",
        example: { input: "3\n", output: "3\n2\n1" } },
    ],
    practice: [
      { id: "t2-ch2-1-p1", title: "오름차순 재귀 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n 을 입력받아 1 부터 n 까지 한 줄씩 출력하는 재귀 함수를 작성하세요.",
        example: { input: "4\n", output: "1\n2\n3\n4" } },
    ],
  },
};

LESSONS["t2-ch2-2"] = {
  trail: 2, ch: 2, no: 2, title: "값을 반환하는 재귀함수",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "계산 결과를 return 으로 돌려주는 재귀 함수로 팩토리얼과 같은 수학적 문제를 해결하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nint main() {\n  printf(\"%d\\n\", factorial(5)); // 120\n  return 0;\n}" },
      { type: "h3",   text: "반환값 있는 재귀" },
      { type: "list", items: ["기저 조건에서 특정 값을 return", "재귀 단계에서 하위 호출 결과를 받아 계산 후 return", "팩토리얼: n! = n × (n-1)!", "피보나치: fib(n) = fib(n-1) + fib(n-2)"] },
      { type: "callout", text: "반환값 재귀는 작은 문제의 답을 조합해 큰 문제의 답을 만드는 방식입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch2-2-b1", title: "팩토리얼", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n 을 입력받아 n! (팩토리얼) 을 재귀로 계산해 출력하세요.",
        example: { input: "5\n", output: "120" } },
    ],
    practice: [
      { id: "t2-ch2-2-p1", title: "1부터 n까지의 합 (재귀)", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n 을 입력받아 1 + 2 + … + n 의 합을 재귀 함수로 계산해 출력하세요.",
        example: { input: "5\n", output: "15" } },
    ],
  },
};

// --- Ch 3. 정렬 ---

LESSONS["t2-ch3-1"] = {
  trail: 2, ch: 3, no: 1, title: "일반 정렬",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "정수 배열을 버블 정렬로 오름차순 정렬하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int a[] = {3, 1, 4, 1, 5};\n  int n = 5;\n  for (int i = 0; i < n - 1; i++)\n    for (int j = 0; j < n - 1 - i; j++)\n      if (a[j] > a[j+1]) {\n        int tmp = a[j]; a[j] = a[j+1]; a[j+1] = tmp;\n      }\n  for (int i = 0; i < n; i++) printf(\"%d \", a[i]);\n  printf(\"\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "버블 정렬" },
      { type: "list", items: ["인접한 두 원소를 비교해 순서가 잘못됐으면 교환", "패스(pass) 한 번에 가장 큰 원소가 맨 끝으로 이동", "시간 복잡도: O(n²)"] },
      { type: "callout", text: "정렬은 알고리즘 학습의 출발점입니다. 손으로 시뮬레이션하며 흐름을 익히세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch3-1-b1", title: "배열 오름차순 정렬", diff: "Easy", xp: 10, time: "5m",
        desc: "정수 5개를 입력받아 오름차순으로 정렬하여 공백으로 구분해 출력하세요.",
        example: { input: "5 3 1 4 2\n", output: "1 2 3 4 5" } },
    ],
    practice: [
      { id: "t2-ch3-1-p1", title: "배열 내림차순 정렬", diff: "Easy", xp: 10, time: "5m",
        desc: "정수 5개를 입력받아 내림차순으로 정렬하여 공백으로 구분해 출력하세요.",
        example: { input: "5 3 1 4 2\n", output: "5 4 3 2 1" } },
    ],
  },
};

LESSONS["t2-ch3-2"] = {
  trail: 2, ch: 3, no: 2, title: "객체",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "C 의 구조체(struct)를 사용해 여러 데이터를 묶어 하나의 객체처럼 다루는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nstruct Point {\n  int x;\n  int y;\n};\n\nint main() {\n  struct Point p;\n  p.x = 3;\n  p.y = 7;\n  printf(\"%d %d\\n\", p.x, p.y);\n  return 0;\n}" },
      { type: "h3",   text: "struct 구조체" },
      { type: "list", items: ["struct 이름 { 멤버; … }; 형태로 정의", "struct 이름 변수명; 으로 변수 선언", "변수.멤버 로 접근 (점 연산자)", "여러 멤버를 논리적으로 묶어 코드 가독성 향상"] },
      { type: "callout", text: "구조체는 C++ 의 클래스와 비슷하지만 기본적으로 메서드가 없습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch3-2-b1", title: "좌표 입출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 두 개를 입력받아 x, y 로 구조체에 저장하고 'x y' 형식으로 출력하세요.",
        example: { input: "3 7\n", output: "3 7" } },
    ],
    practice: [
      { id: "t2-ch3-2-p1", title: "학생 점수 구조체", diff: "Easy", xp: 10, time: "4m",
        desc: "이름(문자열)과 점수(정수)를 입력받아 구조체에 저장하고 '이름 점수' 형식으로 출력하세요.",
        example: { input: "Alice 95\n", output: "Alice 95" } },
    ],
  },
};

// ===== Trail 3 (자료구조 알고리즘) =====

// --- Ch 1. 시간, 공간복잡도 ---

LESSONS["t3-ch1-1"] = {
  trail: 3, ch: 1, no: 1, title: "수도코드",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "알고리즘을 구현 언어에 구애받지 않고 논리 흐름만 표현하는 수도코드(pseudocode)의 개념과 작성법을 배웁니다." },
      { type: "code", text: "// 수도코드 예시: 1부터 N까지 합\n// INPUT: 정수 N\n// OUTPUT: 1+2+...+N\nsum = 0\nfor i from 1 to N:\n    sum = sum + i\nprint sum" },
      { type: "h3",   text: "수도코드란?" },
      { type: "p",    text: "수도코드는 실제 프로그래밍 문법이 아닌 자연어와 기호를 혼합해 알고리즘의 단계를 서술합니다. 코드 작성 전 설계 단계에서 사용합니다." },
      { type: "list", items: ["특정 언어 문법 불필요 — 로직 전달이 목적", "INPUT/OUTPUT 명시로 함수 계약을 표현", "반복은 for/while, 분기는 if/else 키워드 사용 가능", "한 줄 = 한 동작 원칙으로 읽기 쉽게 작성"] },
      { type: "callout", text: "수도코드를 먼저 쓰면 실제 코딩 실수를 줄일 수 있습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch1-1-b1", title: "1부터 N까지 합", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 N을 입력받아 1부터 N까지의 합을 출력하세요. (수도코드 로직을 C로 구현)",
        example: { input: "5\n", output: "15" } },
    ],
    practice: [
      { id: "t3-ch1-1-p1", title: "1부터 N까지 곱", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 N을 입력받아 1×2×…×N (N 팩토리얼)을 출력하세요.",
        example: { input: "4\n", output: "24" } },
    ],
  },
};

LESSONS["t3-ch1-2"] = {
  trail: 3, ch: 1, no: 2, title: "점근 표기법",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "알고리즘의 성능을 입력 크기 n 에 대한 함수로 표현하는 점근 표기법(Big-O, Ω, Θ)의 의미를 이해합니다." },
      { type: "code", text: "// O(1)  — 상수 시간: 배열 인덱스 접근\n// O(n)  — 선형 시간: 단순 반복\n// O(n²) — 이차 시간: 중첩 반복\n// O(log n) — 로그 시간: 이진 탐색" },
      { type: "h3",   text: "Big-O 표기법" },
      { type: "p",    text: "Big-O는 최악의 경우 성장률을 나타냅니다. 상수 계수와 낮은 차수 항은 무시합니다." },
      { type: "list", items: ["O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) 순으로 느려짐", "계수 무시: 3n → O(n)", "낮은 항 무시: n² + n → O(n²)", "최악 케이스 기준이 일반적"] },
      { type: "callout", text: "Big-O는 알고리즘 선택의 언어입니다. n이 클수록 차수 차이가 결정적입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch1-2-b1", title: "복잡도 비교", diff: "Easy", xp: 10, time: "2m",
        desc: "n이 1000일 때 O(n)과 O(n²)의 연산 횟수를 계산하여 각각 한 줄씩 출력하세요. 첫 줄에 n, 둘째 줄에 n*n을 출력합니다.",
        example: { input: "1000\n", output: "1000\n1000000" } },
    ],
    practice: [
      { id: "t3-ch1-2-p1", title: "더 빠른 알고리즘 판별", diff: "Easy", xp: 10, time: "3m",
        desc: "두 정수 a, b를 입력받습니다. a < b이면 'faster', a > b이면 'slower', 같으면 'same'을 출력하세요. (두 알고리즘의 연산 횟수를 비교한다고 가정)",
        example: { input: "100 200\n", output: "faster" } },
    ],
  },
};

LESSONS["t3-ch1-3"] = {
  trail: 3, ch: 1, no: 3, title: "시간복잡도의 정의",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "시간복잡도가 '입력 크기 n에 따른 기본 연산 횟수'임을 정확히 이해하고, 코드에서 시간복잡도를 직접 읽어냅니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  int cnt = 0;\n  for (int i = 0; i < n; i++)   // n번 실행\n    cnt++;\n  printf(\"%d\\n\", cnt);  // O(n)\n  return 0;\n}" },
      { type: "h3",   text: "기본 연산 세기" },
      { type: "p",    text: "시간복잡도는 '핵심 연산(비교, 대입 등)이 몇 번 실행되는가'를 n의 함수로 표현합니다." },
      { type: "list", items: ["단순 대입/비교 1회 = O(1)", "for i in 0..n 루프 = O(n)", "중첩 이중 루프 = O(n²)", "연산 횟수를 실제로 세어 보며 감각 익히기"] },
      { type: "callout", text: "시간복잡도는 실제 실행 시간이 아닌 성장 패턴입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch1-3-b1", title: "연산 횟수 출력", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 n을 입력받아, 0부터 n-1까지 반복하며 카운터를 증가시킨 후 최종 카운터 값을 출력하세요.",
        example: { input: "7\n", output: "7" } },
    ],
    practice: [
      { id: "t3-ch1-3-p1", title: "이중 루프 연산 횟수", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n을 입력받아 이중 for 루프(i: 0..n-1, j: 0..n-1)에서 카운터를 증가시킨 후 최종 카운터 값을 출력하세요.",
        example: { input: "3\n", output: "9" } },
    ],
  },
};

LESSONS["t3-ch1-4"] = {
  trail: 3, ch: 1, no: 4, title: "반복문의 시간복잡도",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "단순 반복문, 중첩 반복문, 반복 변수가 배증(doubling)하는 반복문의 시간복잡도를 분석합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n = 8;\n  // O(log n): 매 단계 i를 2배씩 키움\n  for (int i = 1; i <= n; i *= 2)\n    printf(\"%d\\n\", i);\n  return 0;\n}" },
      { type: "h3",   text: "반복 유형별 복잡도" },
      { type: "list", items: ["for i = 0..n-1 → O(n)", "이중 for (i, j 각각 0..n-1) → O(n²)", "for i = 1; i <= n; i *= 2 → O(log n) (배증 반복)", "삼중 for → O(n³)"] },
      { type: "callout", text: "배증 반복은 n을 반으로 줄이는 이진 탐색과 같은 O(log n) 입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch1-4-b1", title: "배증 반복 단계 수", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n을 입력받아 i=1 부터 시작해 매 단계 i를 2배씩 키우면서 i <= n 인 동안 반복 횟수를 세어 출력하세요.",
        example: { input: "8\n", output: "4" } },
    ],
    practice: [
      { id: "t3-ch1-4-p1", title: "중첩 루프 합", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n을 입력받아 i: 1..n, j: 1..n 이중 반복에서 i+j의 총합을 출력하세요.",
        example: { input: "2\n", output: "12" } },
    ],
  },
};

LESSONS["t3-ch1-5"] = {
  trail: 3, ch: 1, no: 5, title: "재귀함수의 시간복잡도",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "재귀 호출 횟수를 세는 방식으로 재귀 함수의 시간복잡도를 분석하고, 마스터 정리의 직관을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\n\nint cnt = 0;\n\nvoid recur(int n) {\n  if (n <= 0) return;\n  cnt++;\n  recur(n - 1);\n}\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  recur(n);\n  printf(\"%d\\n\", cnt);  // O(n)\n  return 0;\n}" },
      { type: "h3",   text: "호출 횟수 분석" },
      { type: "p",    text: "재귀 함수의 시간복잡도는 호출 트리의 노드 수입니다. 매 호출마다 n-1씩 줄면 O(n), 2개로 분기하면 O(2ⁿ) 입니다." },
      { type: "list", items: ["선형 재귀 (n-1 분기 없음): O(n)", "이진 재귀 (두 번 호출): O(2ⁿ)", "반씩 줄이는 재귀 (n/2): O(log n)", "병합 정렬 (n/2 두 번 + O(n) 병합): O(n log n)"] },
      { type: "callout", text: "재귀 깊이 × 각 단계 작업량 = 총 시간복잡도." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch1-5-b1", title: "재귀 호출 횟수 세기", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n을 입력받아 재귀적으로 n, n-1, …, 1 순서로 각 값을 출력하세요. (재귀 호출 패턴 직접 관찰)",
        example: { input: "4\n", output: "4\n3\n2\n1" } },
    ],
    practice: [
      { id: "t3-ch1-5-p1", title: "피보나치 수", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n을 입력받아 n번째 피보나치 수를 재귀로 계산해 출력하세요. (fib(1)=1, fib(2)=1, fib(n)=fib(n-1)+fib(n-2))",
        example: { input: "6\n", output: "8" } },
    ],
  },
};

LESSONS["t3-ch1-6"] = {
  trail: 3, ch: 1, no: 6, title: "공간복잡도",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "알고리즘이 사용하는 메모리 양을 입력 크기 n의 함수로 표현하는 공간복잡도를 이해합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  int a[1000];          // O(n) 공간\n  for (int i = 0; i < n; i++)\n    a[i] = i + 1;\n  int sum = 0;\n  for (int i = 0; i < n; i++)\n    sum += a[i];\n  printf(\"%d\\n\", sum);\n  return 0;\n}" },
      { type: "h3",   text: "공간복잡도란?" },
      { type: "p",    text: "공간복잡도는 알고리즘이 실행 중 추가로 사용하는 메모리(스택 포함)를 Big-O로 나타낸 것입니다." },
      { type: "list", items: ["상수 개의 변수만 사용: O(1)", "n 크기 배열 하나: O(n)", "n×n 2D 배열: O(n²)", "재귀 깊이 n: 호출 스택 O(n)"] },
      { type: "callout", text: "시간과 공간은 트레이드오프 관계입니다. 빠른 알고리즘이 더 많은 메모리를 쓰기도 합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch1-6-b1", title: "배열 합 (O(n) 공간)", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 n과 n개의 정수를 입력받아 배열에 저장한 후 전체 합을 출력하세요.",
        example: { input: "4\n1 2 3 4\n", output: "10" } },
    ],
    practice: [
      { id: "t3-ch1-6-p1", title: "배열 최댓값", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n과 n개의 정수를 입력받아 배열에 저장한 후 최댓값을 출력하세요.",
        example: { input: "5\n3 7 1 9 4\n", output: "9" } },
    ],
  },
};

// --- Ch 2. 배열, 연결 리스트 ---

LESSONS["t3-ch2-1"] = {
  trail: 3, ch: 2, no: 1, title: "배열",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "C의 정적 배열 선언, 인덱스 접근, 순회 패턴을 배우고 배열의 시간복잡도 특성을 이해합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int a[5] = {10, 20, 30, 40, 50};\n  // 인덱스 접근: O(1)\n  printf(\"%d\\n\", a[2]);  // 30\n  // 순회: O(n)\n  for (int i = 0; i < 5; i++)\n    printf(\"%d \", a[i]);\n  printf(\"\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "배열의 특성" },
      { type: "list", items: ["임의 접근(random access): a[i] — O(1)", "연속 메모리 할당 → 캐시 친화적", "삽입/삭제: 이동 필요 — O(n)", "크기 고정: 선언 시 결정"] },
      { type: "callout", text: "배열은 인덱스 접근이 O(1)인 가장 기본적인 자료구조입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch2-1-b1", title: "배열 역순 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n과 n개의 정수를 입력받아 역순으로 공백 구분하여 출력하세요.",
        example: { input: "5\n1 2 3 4 5\n", output: "5 4 3 2 1" } },
    ],
    practice: [
      { id: "t3-ch2-1-p1", title: "배열 평균", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n과 n개의 정수를 입력받아 평균을 정수 나눗셈으로 출력하세요.",
        example: { input: "4\n10 20 30 40\n", output: "25" } },
    ],
  },
};

LESSONS["t3-ch2-2"] = {
  trail: 3, ch: 2, no: 2, title: "Dynamic Array",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "정적 배열의 크기 제한을 극복하기 위해 malloc/realloc 으로 동적 배열을 구현하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n  int cap = 2, size = 0;\n  int *a = malloc(cap * sizeof(int));\n  int x;\n  while (scanf(\"%d\", &x) == 1) {\n    if (size == cap) {\n      cap *= 2;\n      a = realloc(a, cap * sizeof(int));\n    }\n    a[size++] = x;\n  }\n  for (int i = 0; i < size; i++)\n    printf(\"%d \", a[i]);\n  printf(\"\\n\");\n  free(a);\n  return 0;\n}" },
      { type: "h3",   text: "동적 배열의 동작 원리" },
      { type: "list", items: ["초기 용량 cap, 실제 크기 size 두 변수 관리", "size == cap 이면 cap을 2배로 늘리고 realloc", "분할상환(amortized) 삽입 비용: O(1)", "free()로 메모리 해제 필수"] },
      { type: "callout", text: "C++ vector, Java ArrayList 모두 이 동적 배열 패턴을 내부적으로 사용합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch2-2-b1", title: "동적 배열 합", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n과 n개의 정수를 입력받아 malloc으로 크기 n짜리 배열을 동적 할당하고 전체 합을 출력한 후 free하세요.",
        example: { input: "3\n10 20 30\n", output: "60" } },
    ],
    practice: [
      { id: "t3-ch2-2-p1", title: "동적 배열 최솟값", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n과 n개의 정수를 입력받아 동적 배열에 저장하고 최솟값을 출력하세요.",
        example: { input: "5\n4 2 7 1 9\n", output: "1" } },
    ],
  },
};

LESSONS["t3-ch2-3"] = {
  trail: 3, ch: 2, no: 3, title: "단일 연결 리스트",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "struct와 배열 인덱스로 단일 연결 리스트(singly linked list)의 노드 체인을 흉내 내며 동작 원리를 이해합니다." },
      { type: "code", text: "#include <stdio.h>\n\n#define MAXN 100\n\nstruct Node {\n  int val;\n  int next; // 다음 노드 인덱스 (-1: 없음)\n};\n\nstruct Node nodes[MAXN];\n\nint main() {\n  // 노드 3개 연결: 10 -> 20 -> 30 -> NULL\n  nodes[0] = (struct Node){10,  1};\n  nodes[1] = (struct Node){20,  2};\n  nodes[2] = (struct Node){30, -1};\n  int cur = 0;\n  while (cur != -1) {\n    printf(\"%d\\n\", nodes[cur].val);\n    cur = nodes[cur].next;\n  }\n  return 0;\n}" },
      { type: "h3",   text: "연결 리스트 특성" },
      { type: "list", items: ["각 노드: 데이터 + 다음 노드 포인터(인덱스)", "헤드(head)에서 시작해 next를 따라 순회", "삽입/삭제: 포인터만 변경 — O(1) (위치 알 때)", "임의 접근: O(n) (배열과 반대)"] },
      { type: "callout", text: "연결 리스트는 삽입·삭제에 강하지만 임의 접근에 약합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch2-3-b1", title: "연결 리스트 마지막 값", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n과 n개의 정수를 입력받아 배열 인덱스 기반 단일 연결 리스트로 구성한 뒤 마지막 노드의 값을 출력하세요.",
        example: { input: "4\n10 20 30 40\n", output: "40" } },
    ],
    practice: [
      { id: "t3-ch2-3-p1", title: "연결 리스트 순회 합", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n과 n개의 정수를 입력받아 배열 인덱스 기반 단일 연결 리스트로 구성하고 순회하며 모든 값의 합을 출력하세요.",
        example: { input: "4\n10 20 30 40\n", output: "100" } },
    ],
  },
};

LESSONS["t3-ch2-4"] = {
  trail: 3, ch: 2, no: 4, title: "Doubly-LinkedList",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "prev 포인터를 추가해 양방향 순회가 가능한 이중 연결 리스트(doubly linked list)를 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n\n#define MAXN 100\n\nstruct DNode {\n  int val;\n  int prev; // 이전 인덱스 (-1: 없음)\n  int next; // 다음 인덱스 (-1: 없음)\n};\n\nstruct DNode nodes[MAXN];\n\nint main() {\n  // 10 <-> 20 <-> 30\n  nodes[0] = (struct DNode){10, -1,  1};\n  nodes[1] = (struct DNode){20,  0,  2};\n  nodes[2] = (struct DNode){30,  1, -1};\n  // 역방향 순회\n  int cur = 2;\n  while (cur != -1) {\n    printf(\"%d\\n\", nodes[cur].val);\n    cur = nodes[cur].prev;\n  }\n  return 0;\n}" },
      { type: "h3",   text: "이중 연결 리스트 특성" },
      { type: "list", items: ["각 노드: 데이터 + prev + next 두 포인터", "앞뒤 양방향 순회 가능", "단일 연결 리스트보다 삭제 연산이 편리", "메모리 사용량은 단일 대비 포인터 하나 추가"] },
      { type: "callout", text: "이중 연결 리스트는 브라우저 방문 기록, 텍스트 에디터 커서 이동에 사용됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t3-ch2-4-b1", title: "역방향 순회 출력", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n과 n개의 정수를 입력받아 이중 연결 리스트(배열 인덱스 기반)로 구성하고 마지막 노드부터 역방향으로 순회하며 각 값을 한 줄씩 출력하세요.",
        example: { input: "3\n1 2 3\n", output: "3\n2\n1" } },
    ],
    practice: [
      { id: "t3-ch2-4-p1", title: "정방향 + 역방향 합", diff: "Easy", xp: 10, time: "5m",
        desc: "정수 n과 n개의 정수를 입력받아 이중 연결 리스트로 구성하고, 정방향 합과 역방향 합을 각각 한 줄씩 출력하세요. (두 합은 같아야 합니다)",
        example: { input: "3\n1 2 3\n", output: "6\n6" } },
    ],
  },
};

LESSONS["t2-ch3-3"] = {
  trail: 2, ch: 3, no: 3, title: "객체 정렬",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "구조체 배열을 특정 멤버 기준으로 정렬하는 방법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nstruct Student {\n  int score;\n  int id;\n};\n\nint main() {\n  struct Student s[3] = {{80,1},{50,2},{90,3}};\n  // 버블 정렬 — score 기준 오름차순\n  for (int i = 0; i < 2; i++)\n    for (int j = 0; j < 2 - i; j++)\n      if (s[j].score > s[j+1].score) {\n        struct Student tmp = s[j]; s[j] = s[j+1]; s[j+1] = tmp;\n      }\n  for (int i = 0; i < 3; i++) printf(\"%d %d\\n\", s[i].id, s[i].score);\n  return 0;\n}" },
      { type: "h3",   text: "구조체 배열 정렬" },
      { type: "list", items: ["구조체 배열도 일반 배열처럼 인덱스로 접근", "비교 기준을 원하는 멤버(예: .score)로 설정", "구조체 전체를 임시 변수에 저장해 swap 가능"] },
      { type: "callout", text: "정렬 기준 멤버만 바꾸면 다양한 키(이름, 점수, 나이 등)로 정렬할 수 있습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch3-3-b1", title: "학생 점수 오름차순 정렬", diff: "Medium", xp: 20, time: "8m",
        desc: "학생 수 n 과 각 학생의 번호와 점수를 입력받아 점수 오름차순으로 정렬 후 '번호 점수' 형식으로 한 줄씩 출력하세요.",
        example: { input: "3\n1 80\n2 50\n3 90\n", output: "2 50\n1 80\n3 90" } },
    ],
    practice: [
      { id: "t2-ch3-3-p1", title: "학생 점수 내림차순 정렬", diff: "Medium", xp: 20, time: "8m",
        desc: "학생 수 n 과 각 학생의 번호와 점수를 입력받아 점수 내림차순으로 정렬 후 '번호 점수' 형식으로 한 줄씩 출력하세요.",
        example: { input: "3\n1 80\n2 50\n3 90\n", output: "3 90\n1 80\n2 50" } },
    ],
  },
};

// --- Ch 5. 포인터 ---

LESSONS["t2-ch5-1"] = {
  trail: 2, ch: 5, no: 1, title: "포인터 입문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "포인터(pointer)란 변수의 메모리 주소를 저장하는 변수입니다. '&' 연산자로 주소를 얻고 '*' 연산자로 포인터를 선언합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int a = 10, b = 20;\n  int tmp = a; a = b; b = tmp;\n  printf(\"%d %d\\n\", a, b);\n  return 0;\n}" },
      { type: "h3",   text: "포인터 기초" },
      { type: "list", items: ["int *p; — int형 포인터 선언", "p = &a; — 변수 a의 주소를 p에 저장", "포인터는 메모리 주소를 담는 특별한 변수", "swap 패턴: tmp 임시 변수로 두 값 교환"] },
      { type: "callout", text: "포인터는 C 언어의 핵심 개념입니다. 주소와 값의 관계를 그림으로 그려가며 이해하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch5-1-b1", title: "두 변수 swap", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 두 개를 입력받아 서로 교환(swap)한 뒤 공백으로 구분해 출력하세요.",
        example: { input: "3 7\n", output: "7 3" } },
    ],
    practice: [
      { id: "t2-ch5-1-p1", title: "세 수 최솟값", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 세 개를 입력받아 가장 작은 값을 출력하세요.",
        example: { input: "5 2 8\n", output: "2" } },
    ],
  },
};

LESSONS["t2-ch5-2"] = {
  trail: 2, ch: 5, no: 2, title: "주소와 역참조",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "'&' 연산자로 변수의 주소를 얻고, '*' 연산자(역참조)로 포인터가 가리키는 값을 읽거나 수정합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int x = 5;\n  int *p = &x;\n  *p = 10;\n  printf(\"%d\\n\", x);\n  return 0;\n}" },
      { type: "h3",   text: "역참조 연산자 *" },
      { type: "list", items: ["*p 로 포인터가 가리키는 주소의 값을 읽음", "*p = 값; 으로 해당 주소의 값을 변경", "p 자체는 주소, *p 는 그 주소에 있는 값", "포인터를 통한 수정은 원본 변수에 즉시 반영"] },
      { type: "callout", text: "역참조는 포인터의 핵심 연산입니다. *p 와 p 를 혼동하지 마세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch5-2-b1", title: "포인터로 값 변경", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 하나를 입력받아 포인터로 역참조하여 값을 두 배로 만든 뒤 출력하세요.",
        example: { input: "5\n", output: "10" } },
    ],
    practice: [
      { id: "t2-ch5-2-p1", title: "두 포인터 합", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 두 개를 입력받아 각각의 포인터를 선언하고 역참조하여 두 값의 합을 출력하세요.",
        example: { input: "4 6\n", output: "10" } },
    ],
  },
};

LESSONS["t2-ch5-3"] = {
  trail: 2, ch: 5, no: 3, title: "함수 인자 포인터",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "함수에 포인터를 인자로 전달하면 함수 내부에서 원본 변수의 값을 수정할 수 있습니다. 이를 '참조에 의한 전달(pass by reference)'이라 합니다." },
      { type: "code", text: "#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n  int tmp = *a;\n  *a = *b;\n  *b = tmp;\n}\n\nint main() {\n  int x = 3, y = 7;\n  swap(&x, &y);\n  printf(\"%d %d\\n\", x, y);\n  return 0;\n}" },
      { type: "h3",   text: "포인터 인자" },
      { type: "list", items: ["void swap(int *a, int *b) — 포인터를 매개변수로 선언", "함수 호출 시 &x, &y 로 주소 전달", "함수 내부에서 *a, *b 로 원본 값 수정", "값에 의한 전달(by value)과 달리 원본이 바뀜"] },
      { type: "callout", text: "C에서 함수가 여러 값을 반환하려면 포인터 인자를 활용합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch5-3-b1", title: "swap 함수", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 두 개를 입력받아 swap 함수를 호출하여 교환한 뒤 공백으로 구분해 출력하세요.",
        example: { input: "10 20\n", output: "20 10" } },
    ],
    practice: [
      { id: "t2-ch5-3-p1", title: "포인터로 두 수 더하기", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 두 개를 입력받아 포인터 인자를 가진 add 함수로 합을 세 번째 변수에 저장하고 출력하세요.",
        example: { input: "3 4\n", output: "7" } },
    ],
  },
};

LESSONS["t2-ch5-4"] = {
  trail: 2, ch: 5, no: 4, title: "포인터와 배열",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "배열 이름은 첫 번째 원소의 주소입니다. 포인터 산술로 배열 원소에 접근할 수 있습니다: arr[i] 와 *(arr+i) 는 동일합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int arr[] = {10, 20, 30, 40, 50};\n  int *p = arr;\n  for (int i = 0; i < 5; i++)\n    printf(\"%d\\n\", *(p + i));\n  return 0;\n}" },
      { type: "h3",   text: "배열과 포인터 관계" },
      { type: "list", items: ["배열 이름 arr 은 &arr[0] 과 같음", "*(arr+i) == arr[i] 동일한 접근", "포인터 p++ 로 다음 원소로 이동 가능", "함수에 배열 전달 시 포인터로 변환됨"] },
      { type: "callout", text: "배열과 포인터의 동등성을 이해하면 C 언어의 메모리 모델이 명확해집니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch5-4-b1", title: "포인터로 배열 원소 출력", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 5개를 입력받아 배열에 저장하고 포인터 산술(*(arr+i))로 각 원소를 한 줄씩 출력하세요.",
        example: { input: "1 2 3 4 5\n", output: "1\n2\n3\n4\n5" } },
    ],
    practice: [
      { id: "t2-ch5-4-p1", title: "배열 역순 출력", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 5개를 입력받아 배열에 저장하고 포인터를 이용해 역순으로 한 줄씩 출력하세요.",
        example: { input: "1 2 3 4 5\n", output: "5\n4\n3\n2\n1" } },
    ],
  },
};

// --- Ch 6. 구조체 ---

LESSONS["t2-ch6-1"] = {
  trail: 2, ch: 6, no: 1, title: "struct 입문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "struct(구조체)로 서로 다른 타입의 데이터를 하나로 묶습니다. 점 연산자(.)로 멤버에 접근합니다." },
      { type: "code", text: "#include <stdio.h>\n\nstruct Point {\n  int x;\n  int y;\n};\n\nint main() {\n  struct Point p;\n  p.x = 3;\n  p.y = 4;\n  printf(\"%d\\n\", p.x + p.y);\n  return 0;\n}" },
      { type: "h3",   text: "struct 정의와 사용" },
      { type: "list", items: ["struct 이름 { 타입 멤버; … }; 로 정의", "struct 이름 변수; 로 변수 선언", "변수.멤버 로 접근 및 수정", "초기화: struct Point p = {1, 2};"] },
      { type: "callout", text: "구조체는 관련 데이터를 논리적으로 묶어 코드 가독성을 높입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch6-1-b1", title: "좌표 합 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 두 개를 입력받아 Point 구조체의 x, y 멤버에 저장하고 두 값의 합을 출력하세요.",
        example: { input: "3 4\n", output: "7" } },
    ],
    practice: [
      { id: "t2-ch6-1-p1", title: "사각형 넓이", diff: "Easy", xp: 10, time: "4m",
        desc: "가로와 세로 정수 두 개를 입력받아 Rect 구조체에 저장하고 넓이(w*h)를 출력하세요.",
        example: { input: "5 3\n", output: "15" } },
    ],
  },
};

LESSONS["t2-ch6-2"] = {
  trail: 2, ch: 6, no: 2, title: "typedef",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "typedef를 사용하면 'struct Point' 대신 'Point'처럼 짧은 이름으로 구조체 타입을 사용할 수 있습니다." },
      { type: "code", text: "#include <stdio.h>\n\ntypedef struct {\n  int x;\n  int y;\n} Point;\n\nint main() {\n  Point p = {3, 4};\n  printf(\"%d\\n\", p.x + p.y);\n  return 0;\n}" },
      { type: "h3",   text: "typedef 활용" },
      { type: "list", items: ["typedef 기존타입 새이름; 형태로 별칭 지정", "typedef struct { … } 이름; 으로 구조체 별칭 동시 정의", "struct 키워드 없이 Point p; 처럼 선언 가능", "코드 간결성과 가독성 향상"] },
      { type: "callout", text: "실무 C 코드에서는 typedef struct 패턴이 매우 자주 사용됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch6-2-b1", title: "typedef Point 좌표 합", diff: "Easy", xp: 10, time: "3m",
        desc: "typedef Point 를 정의하고 정수 두 개를 입력받아 Point 변수에 저장한 뒤 x+y 를 출력하세요.",
        example: { input: "6 2\n", output: "8" } },
    ],
    practice: [
      { id: "t2-ch6-2-p1", title: "typedef Student 평균", diff: "Easy", xp: 10, time: "4m",
        desc: "typedef Student { int id; int score; } 를 정의하고 id와 score를 입력받아 score를 출력하세요.",
        example: { input: "1 90\n", output: "90" } },
    ],
  },
};

LESSONS["t2-ch6-3"] = {
  trail: 2, ch: 6, no: 3, title: "구조체 배열",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "구조체 타입의 배열을 선언하면 여러 개의 구조체 변수를 한 번에 관리할 수 있습니다." },
      { type: "code", text: "#include <stdio.h>\n\ntypedef struct {\n  int id;\n  int score;\n} Student;\n\nint main() {\n  Student s[3];\n  int sum = 0;\n  for (int i = 0; i < 3; i++) {\n    scanf(\"%d %d\", &s[i].id, &s[i].score);\n    sum += s[i].score;\n  }\n  printf(\"%d\\n\", sum);\n  return 0;\n}" },
      { type: "h3",   text: "구조체 배열 사용" },
      { type: "list", items: ["Student s[N]; 으로 N개의 Student 배열 선언", "s[i].멤버 로 i번째 구조체의 멤버에 접근", "반복문으로 구조체 배열 순회 가능", "메모리에 구조체들이 연속으로 배치됨"] },
      { type: "callout", text: "구조체 배열은 학생 명부, 상품 목록 등 동일 형태 데이터 집합을 표현하기 적합합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch6-3-b1", title: "학생 점수 합", diff: "Easy", xp: 10, time: "5m",
        desc: "학생 수 n과 각 학생의 id, score를 입력받아 모든 점수의 합을 출력하세요.",
        example: { input: "3\n1 80\n2 70\n3 90\n", output: "240" } },
    ],
    practice: [
      { id: "t2-ch6-3-p1", title: "최고 점수 학생 id", diff: "Easy", xp: 10, time: "5m",
        desc: "학생 수 n과 각 학생의 id, score를 입력받아 점수가 가장 높은 학생의 id를 출력하세요.",
        example: { input: "3\n1 80\n2 95\n3 70\n", output: "2" } },
    ],
  },
};

LESSONS["t2-ch6-4"] = {
  trail: 2, ch: 6, no: 4, title: "구조체 포인터",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "구조체 포인터를 사용하면 화살표 연산자(->)로 멤버에 접근할 수 있습니다. (*ptr).멤버 와 ptr->멤버 는 동일합니다." },
      { type: "code", text: "#include <stdio.h>\n\ntypedef struct {\n  int x;\n  int y;\n} Point;\n\nint main() {\n  Point p = {3, 4};\n  Point *ptr = &p;\n  ptr->x = 10;\n  printf(\"%d %d\\n\", ptr->x, ptr->y);\n  return 0;\n}" },
      { type: "h3",   text: "화살표 연산자 ->" },
      { type: "list", items: ["Point *ptr = &p; — 구조체 포인터 선언", "ptr->멤버 == (*ptr).멤버 동일한 접근", "포인터를 통해 구조체 멤버 직접 수정 가능", "함수에 구조체 포인터 전달 시 복사 없이 원본 수정"] },
      { type: "callout", text: "-> 연산자는 구조체 포인터 사용 시 가장 많이 보이는 연산자입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch6-4-b1", title: "포인터로 멤버 수정", diff: "Easy", xp: 10, time: "4m",
        desc: "Point 구조체 변수를 선언하고 포인터를 이용해 x값을 입력받은 값으로 수정한 뒤 x를 출력하세요.",
        example: { input: "42\n", output: "42" } },
    ],
    practice: [
      { id: "t2-ch6-4-p1", title: "구조체 포인터 합", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 두 개를 입력받아 Point 구조체에 저장하고 구조체 포인터의 -> 연산자로 x+y를 출력하세요.",
        example: { input: "7 8\n", output: "15" } },
    ],
  },
};

// --- Ch 7. 동적 메모리 ---

LESSONS["t2-ch7-1"] = {
  trail: 2, ch: 7, no: 1, title: "malloc 입문",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "malloc 함수로 실행 중 힙(heap)에 메모리를 동적으로 할당합니다. 사용 후 반드시 free로 해제합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n  int *p = (int *)malloc(sizeof(int));\n  *p = 99;\n  printf(\"%d\\n\", *p);\n  free(p);\n  return 0;\n}" },
      { type: "h3",   text: "malloc 사용법" },
      { type: "list", items: ["malloc(바이트 수) — 힙에 메모리 할당, 포인터 반환", "반환 타입은 void* — 원하는 타입으로 캐스팅", "할당 실패 시 NULL 반환 — 확인 필수", "free(포인터) 로 힙 메모리 해제"] },
      { type: "callout", text: "동적 메모리를 사용하면 컴파일 시 크기를 모르는 데이터도 처리할 수 있습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch7-1-b1", title: "malloc으로 정수 저장", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 하나를 입력받아 malloc으로 할당한 공간에 저장하고 출력한 뒤 free하세요.",
        example: { input: "42\n", output: "42" } },
    ],
    practice: [
      { id: "t2-ch7-1-p1", title: "동적 두 수 합", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 두 개를 입력받아 각각 malloc으로 할당한 뒤 두 값의 합을 출력하고 free하세요.",
        example: { input: "5 3\n", output: "8" } },
    ],
  },
};

LESSONS["t2-ch7-2"] = {
  trail: 2, ch: 7, no: 2, title: "calloc/realloc",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "calloc은 0으로 초기화된 메모리를 할당합니다. realloc은 이미 할당된 메모리 블록의 크기를 변경합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n  int n = 3;\n  int *arr = (int *)calloc(n, sizeof(int));\n  for (int i = 0; i < n; i++) arr[i] = i + 1;\n  arr = (int *)realloc(arr, (n + 1) * sizeof(int));\n  arr[n] = 99;\n  printf(\"%d\\n\", arr[n]);\n  free(arr);\n  return 0;\n}" },
      { type: "h3",   text: "calloc과 realloc" },
      { type: "list", items: ["calloc(개수, 크기) — 0으로 초기화된 배열 할당", "realloc(포인터, 새크기) — 기존 데이터 유지하며 크기 변경", "realloc은 새 주소를 반환할 수 있음 — 반드시 받아야 함", "realloc 실패 시 NULL 반환 — 원본 포인터는 유효"] },
      { type: "callout", text: "calloc은 초기값이 보장되어 버그를 줄여주고, realloc은 가변 크기 배열 구현에 사용됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch7-2-b1", title: "calloc 배열 합", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n과 n개의 정수를 입력받아 calloc으로 배열 할당, 값을 채운 뒤 합을 출력하고 free하세요.",
        example: { input: "3\n1 2 3\n", output: "6" } },
    ],
    practice: [
      { id: "t2-ch7-2-p1", title: "realloc으로 마지막 원소", diff: "Medium", xp: 20, time: "5m",
        desc: "정수 n개를 calloc으로 할당해 채운 뒤 realloc으로 한 칸 늘리고 마지막 칸에 0 저장 후 마지막 원소를 출력하세요.",
        example: { input: "3\n10 20 30\n", output: "0" } },
    ],
  },
};

LESSONS["t2-ch7-3"] = {
  trail: 2, ch: 7, no: 3, title: "free와 메모리 누수",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "동적 할당된 메모리를 free하지 않으면 메모리 누수(memory leak)가 발생합니다. 할당한 모든 메모리는 반드시 해제해야 합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n  int *p = (int *)malloc(sizeof(int));\n  *p = 42;\n  // 사용 완료\n  free(p);\n  p = NULL; // dangling pointer 방지\n  printf(\"ok\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "메모리 누수 방지" },
      { type: "list", items: ["할당한 모든 포인터에 대해 free 호출", "free 후 포인터를 NULL로 초기화 — dangling pointer 방지", "이중 free(double free)는 undefined behavior", "프로그램 종료 전 모든 동적 메모리 해제"] },
      { type: "callout", text: "메모리 누수는 장시간 실행되는 프로그램에서 치명적입니다. valgrind 등 도구로 검사하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch7-3-b1", title: "할당 사용 해제", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 하나를 malloc으로 할당해 입력받은 값 저장, 출력, free 순서로 수행하고 마지막에 'ok'를 출력하세요.",
        example: { input: "7\n", output: "7\nok" } },
    ],
    practice: [
      { id: "t2-ch7-3-p1", title: "배열 할당 해제 확인", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n개를 malloc으로 할당해 값 저장 후 합을 출력하고 free한 뒤 'freed'를 출력하세요.",
        example: { input: "3\n1 2 3\n", output: "6\nfreed" } },
    ],
  },
};

LESSONS["t2-ch7-4"] = {
  trail: 2, ch: 7, no: 4, title: "동적 배열",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "실행 중에 크기를 결정해야 하는 배열을 malloc으로 동적 할당합니다. N을 입력받아 N개짜리 int 배열을 만들 수 있습니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  int *arr = (int *)malloc(n * sizeof(int));\n  int sum = 0;\n  for (int i = 0; i < n; i++) {\n    scanf(\"%d\", &arr[i]);\n    sum += arr[i];\n  }\n  printf(\"%d\\n\", sum);\n  free(arr);\n  return 0;\n}" },
      { type: "h3",   text: "동적 배열 패턴" },
      { type: "list", items: ["n을 먼저 읽고 malloc(n * sizeof(타입)) 으로 할당", "arr[i] 로 일반 배열처럼 접근", "사용 후 free(arr) 필수", "크기를 컴파일 타임에 몰라도 됨 — 유연한 프로그래밍"] },
      { type: "callout", text: "동적 배열은 가변 입력을 처리하는 현실적인 프로그램의 기본 패턴입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch7-4-b1", title: "동적 배열 합", diff: "Easy", xp: 10, time: "5m",
        desc: "정수 n을 입력받아 malloc으로 n개짜리 배열 할당, n개 정수를 입력받아 합을 출력하고 free하세요.",
        example: { input: "4\n1 2 3 4\n", output: "10" } },
    ],
    practice: [
      { id: "t2-ch7-4-p1", title: "동적 배열 최댓값", diff: "Easy", xp: 10, time: "5m",
        desc: "정수 n을 입력받아 malloc으로 n개 배열 할당, n개 정수 입력받아 최댓값을 출력하고 free하세요.",
        example: { input: "4\n3 1 4 2\n", output: "4" } },
    ],
  },
};

// --- Ch 8. 파일 입출력 ---

LESSONS["t2-ch8-1"] = {
  trail: 2, ch: 8, no: 1, title: "fopen/fclose",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "fopen으로 파일을 열고 fclose로 닫습니다. FILE* 포인터로 파일을 식별합니다. 이 레슨의 채점 문제는 개념 이해를 위해 표준 입출력(stdin/stdout)으로 진행합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  // 실제 파일 사용 예시 (채점 환경에서는 stdin/stdout 사용)\n  // FILE *fp = fopen(\"data.txt\", \"r\");\n  // if (fp == NULL) { printf(\"error\\n\"); return 1; }\n  // fclose(fp);\n\n  // 채점용: 표준 입출력\n  int n;\n  scanf(\"%d\", &n);\n  printf(\"%d\\n\", n * 2);\n  return 0;\n}" },
      { type: "h3",   text: "fopen/fclose 기초" },
      { type: "list", items: ["FILE *fp = fopen(\"파일명\", \"모드\"); — 파일 열기", "모드: \"r\"(읽기), \"w\"(쓰기), \"a\"(추가)", "fclose(fp); — 파일 닫기 필수 (버퍼 플러시)", "실패 시 NULL 반환 — 반드시 확인"] },
      { type: "callout", text: "파일을 열었으면 반드시 fclose로 닫아야 합니다. 닫지 않으면 데이터 손실이 발생할 수 있습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch8-1-b1", title: "두 배 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 하나를 입력받아 두 배 값을 출력하세요.",
        example: { input: "5\n", output: "10" } },
    ],
    practice: [
      { id: "t2-ch8-1-p1", title: "세 배 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 하나를 입력받아 세 배 값을 출력하세요.",
        example: { input: "4\n", output: "12" } },
    ],
  },
};

LESSONS["t2-ch8-2"] = {
  trail: 2, ch: 8, no: 2, title: "fprintf/fscanf",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "fprintf는 파일에 형식화된 출력을 합니다. fprintf(stdout, ...) 처럼 stdout을 지정하면 printf와 동일하게 동작합니다. fscanf는 파일에서 형식화된 입력을 읽습니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int a, b;\n  fscanf(stdin, \"%d %d\", &a, &b);\n  fprintf(stdout, \"%d\\n\", a + b);\n  return 0;\n}" },
      { type: "h3",   text: "fprintf/fscanf 사용법" },
      { type: "list", items: ["fprintf(FILE*, 형식, ...) — 파일에 형식화 출력", "fscanf(FILE*, 형식, ...) — 파일에서 형식화 입력", "fprintf(stdout, ...) == printf(...)", "fscanf(stdin, ...) == scanf(...)"] },
      { type: "callout", text: "fprintf/fscanf는 printf/scanf의 파일 버전입니다. stdout/stdin을 인자로 주면 동일하게 동작합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch8-2-b1", title: "fprintf로 합 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 두 개를 fscanf(stdin,...)으로 읽어 합을 fprintf(stdout,...)으로 출력하세요.",
        example: { input: "3 4\n", output: "7" } },
    ],
    practice: [
      { id: "t2-ch8-2-p1", title: "fprintf로 곱 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 두 개를 fscanf(stdin,...)으로 읽어 곱을 fprintf(stdout,...)으로 출력하세요.",
        example: { input: "3 4\n", output: "12" } },
    ],
  },
};

LESSONS["t2-ch8-3"] = {
  trail: 2, ch: 8, no: 3, title: "fread/fwrite",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "fread/fwrite는 이진(binary) 데이터를 블록 단위로 읽고 씁니다. 이 레슨에서는 getchar()로 문자를 읽어 개수를 세는 단순화된 형태로 익힙니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n, cnt = 0;\n  scanf(\"%d\", &n);\n  int c;\n  // getchar로 공백 건너뜀\n  while ((c = getchar()) != '\\n' && c != EOF);\n  for (int i = 0; i < n; i++) {\n    c = getchar();\n    if (c != EOF) cnt++;\n  }\n  printf(\"%d\\n\", cnt);\n  return 0;\n}" },
      { type: "h3",   text: "fread/fwrite 개념" },
      { type: "list", items: ["fread(버퍼, 크기, 개수, FILE*) — 이진 데이터 읽기", "fwrite(버퍼, 크기, 개수, FILE*) — 이진 데이터 쓰기", "반환값: 실제로 읽거나 쓴 개수", "텍스트 모드와 달리 개행 변환 없음"] },
      { type: "callout", text: "fread/fwrite는 이미지, 음성 등 바이너리 파일 처리에 사용됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch8-3-b1", title: "문자 개수 세기", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n을 입력받고 이어서 정확히 n개의 문자를 getchar로 읽어 읽은 문자 개수를 출력하세요.",
        example: { input: "3\nabc", output: "3" } },
    ],
    practice: [
      { id: "t2-ch8-3-p1", title: "알파벳 개수", diff: "Easy", xp: 10, time: "5m",
        desc: "한 줄의 문자열을 입력받아 알파벳(a-z, A-Z)의 개수를 출력하세요.",
        example: { input: "Hello123\n", output: "5" } },
    ],
  },
};

LESSONS["t2-ch8-4"] = {
  trail: 2, ch: 8, no: 4, title: "파일 모드",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "fopen의 모드 문자열은 파일을 어떻게 열지 결정합니다. r/w/a 의 차이를 이해하고 적절한 모드를 선택합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  // 파일 모드 요약 (채점 문제는 stdin/stdout 사용)\n  // \"r\"  — 읽기 전용, 파일 없으면 NULL\n  // \"w\"  — 쓰기, 기존 내용 삭제 후 새로 씀\n  // \"a\"  — 추가(append), 기존 내용 유지하고 끝에 추가\n  // \"rb\", \"wb\" — 이진 모드\n\n  char mode;\n  scanf(\"%c\", &mode);\n  if (mode == 'r') printf(\"read\\n\");\n  else if (mode == 'w') printf(\"write\\n\");\n  else if (mode == 'a') printf(\"append\\n\");\n  else printf(\"unknown\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "파일 모드 종류" },
      { type: "list", items: ["\"r\" — 읽기 전용 (파일 없으면 오류)", "\"w\" — 쓰기 (기존 내용 덮어씀, 없으면 생성)", "\"a\" — 추가 (기존 내용 보존, 끝에 추가)", "\"rb\", \"wb\", \"ab\" — 이진 모드 (바이너리 파일)"] },
      { type: "callout", text: "잘못된 모드로 열면 데이터를 잃을 수 있습니다. 특히 \"w\" 모드는 기존 파일을 지웁니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t2-ch8-4-b1", title: "모드 이름 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "문자 하나(r/w/a)를 입력받아 r이면 'read', w이면 'write', a이면 'append'를 출력하세요.",
        example: { input: "w\n", output: "write" } },
    ],
    practice: [
      { id: "t2-ch8-4-p1", title: "모드 설명 출력", diff: "Easy", xp: 10, time: "4m",
        desc: "문자 하나(r/w/a)를 입력받아 r이면 'read-only', w이면 'overwrite', a이면 'append-only'를 출력하세요.",
        example: { input: "a\n", output: "append-only" } },
    ],
  },
};

// === END Trail 2 ===

// ===== Trail 4 (알고리즘 입문) =====

// --- Ch 1. Simulation ---

LESSONS["t4-ch1-1"] = {
  trail: 4, ch: 1, no: 1, title: "격자 안에서 완전탐색",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "2차원 격자(grid)의 모든 셀을 이중 for문으로 순회하며 조건에 맞는 값을 탐색하는 완전탐색 패턴을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  int grid[20][20];\n  for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n      scanf(\"%d\", &grid[i][j]);\n\n  int sum = 0;\n  for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n      sum += grid[i][j];\n  printf(\"%d\\n\", sum);\n  return 0;\n}" },
      { type: "h3",   text: "격자 완전탐색 핵심" },
      { type: "list", items: ["이중 for문: 행(i) × 열(j) 전체 순회 — O(n²)", "grid[i][j]로 각 셀 접근", "조건 체크 후 누적/기록 가능", "상하좌우 이동은 dx[], dy[] 배열로 표현"] },
      { type: "callout", text: "격자 완전탐색은 시뮬레이션의 출발점입니다. 모든 셀을 빠짐없이 보는 것이 핵심입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch1-1-b1", title: "격자 합 구하기", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 n을 입력받고 n×n 격자를 입력받아 모든 원소의 합을 출력하세요.",
        example: { input: "3\n1 2 3\n4 5 6\n7 8 9\n", output: "45" } },
    ],
    practice: [
      { id: "t4-ch1-1-p1", title: "격자에서 최댓값 위치", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n을 입력받고 n×n 격자를 입력받아 최댓값이 있는 행과 열(1-indexed)을 공백으로 구분해 출력하세요. 최댓값이 여러 개면 가장 먼저 나오는 것의 위치를 출력합니다.",
        example: { input: "3\n1 2 3\n4 9 6\n7 8 5\n", output: "2 2" } },
    ],
  },
};

LESSONS["t4-ch1-2"] = {
  trail: 4, ch: 1, no: 2, title: "격자 안에서 밀고 당기기",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "격자 셀의 값을 이동/복사하는 시뮬레이션 — 행 또는 열 전체를 한 칸씩 밀거나 당기는 패턴을 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  int a[20];\n  for (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n\n  // 오른쪽으로 한 칸 밀기 (마지막 값 소멸)\n  for (int i = n - 1; i > 0; i--)\n    a[i] = a[i - 1];\n  a[0] = 0;\n\n  for (int i = 0; i < n; i++)\n    printf(\"%d \", a[i]);\n  printf(\"\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "밀고 당기기 패턴" },
      { type: "list", items: ["오른쪽 밀기: 뒤에서 앞으로 순회하며 a[i]=a[i-1]", "왼쪽 밀기: 앞에서 뒤로 순회하며 a[i]=a[i+1]", "2D 격자는 행/열 단위로 같은 패턴 반복", "경계 값은 별도 처리(0 채우기 또는 wrap-around)"] },
      { type: "callout", text: "순회 방향을 밀기 방향에 맞춰야 덮어쓰기 오류가 없습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch1-2-b1", title: "행 오른쪽 밀기", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n과 n개의 정수를 입력받아 배열을 오른쪽으로 한 칸 밀고(맨 앞은 0으로 채움) 결과를 공백 구분으로 출력하세요.",
        example: { input: "5\n1 2 3 4 5\n", output: "0 1 2 3 4" } },
    ],
    practice: [
      { id: "t4-ch1-2-p1", title: "행 왼쪽 밀기", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n과 n개의 정수를 입력받아 배열을 왼쪽으로 한 칸 밀고(맨 뒤는 0으로 채움) 결과를 공백 구분으로 출력하세요.",
        example: { input: "5\n1 2 3 4 5\n", output: "2 3 4 5 0" } },
    ],
  },
};

LESSONS["t4-ch1-3"] = {
  trail: 4, ch: 1, no: 3, title: "격자 안에서 터지고 떨어지는 경우",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "격자에서 특정 조건의 셀을 제거(터트리기)하고, 위 칸의 값들이 아래로 떨어지는 중력 시뮬레이션을 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n;\n  scanf(\"%d\", &n);\n  int a[20];\n  for (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n\n  // 0인 원소 제거 후 위로 당기기 (중력: 아래 방향)\n  int top = n - 1;\n  for (int i = n - 1; i >= 0; i--) {\n    if (a[i] != 0) a[top--] = a[i];\n  }\n  while (top >= 0) a[top--] = 0;\n\n  for (int i = 0; i < n; i++)\n    printf(\"%d \", a[i]);\n  printf(\"\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "터지고 떨어지기 구현 순서" },
      { type: "list", items: ["1단계: 제거 대상 셀을 0(또는 특수값)으로 마킹", "2단계: 열(column)별로 0이 아닌 값을 아래로 압축", "3단계: 빈 위쪽 칸을 0으로 채움", "반복 처리: 연쇄 터짐은 1~3을 반복"] },
      { type: "callout", text: "열 압축(gravity)은 0이 아닌 값만 골라 아래부터 채운 뒤 나머지를 0으로 채우면 됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch1-3-b1", title: "0 제거 후 중력 적용", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n과 n개의 정수를 입력받아 0을 제거하고 나머지 값을 오른쪽으로 붙인 뒤 왼쪽 빈 자리는 0으로 채워 출력하세요.",
        example: { input: "6\n3 0 1 0 2 0\n", output: "0 0 0 3 1 2" } },
    ],
    practice: [
      { id: "t4-ch1-3-p1", title: "특정 값 터뜨리기", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n, 제거값 k, n개의 정수를 입력받아 k와 같은 원소를 제거하고 나머지를 오른쪽 정렬(왼쪽 0 채움)하여 출력하세요.",
        example: { input: "6 2\n1 2 3 2 4 2\n", output: "0 0 0 1 3 4" } },
    ],
  },
};

LESSONS["t4-ch1-4"] = {
  trail: 4, ch: 1, no: 4, title: "격자 안에서 단일 객체로 이동",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "격자 위 단일 객체(로봇, 캐릭터 등)의 이동 명령을 시뮬레이션하고 최종 위치를 구합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n, r = 0, c = 0;\n  scanf(\"%d\", &n);\n  // U D L R 명령 처리\n  int dr[] = {-1, 1,  0, 0};\n  int dc[] = { 0, 0, -1, 1};\n  char dir[4][2] = {\"U\", \"D\", \"L\", \"R\"};\n  for (int i = 0; i < n; i++) {\n    char cmd[4];\n    scanf(\"%s\", cmd);\n    for (int d = 0; d < 4; d++) {\n      if (cmd[0] == dir[d][0]) {\n        int nr = r + dr[d], nc = c + dc[d];\n        r = nr; c = nc;\n      }\n    }\n  }\n  printf(\"%d %d\\n\", r, c);\n  return 0;\n}" },
      { type: "h3",   text: "단일 객체 이동 패턴" },
      { type: "list", items: ["dr[], dc[] 배열로 방향별 이동량 정의", "명령어 문자로 방향 선택", "격자 범위 체크: 0 ≤ r < N, 0 ≤ c < N", "이동 후 위치(r, c) 업데이트"] },
      { type: "callout", text: "방향 배열 dr/dc를 쓰면 UDLR 어떤 명령도 같은 코드로 처리할 수 있습니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch1-4-b1", title: "단일 객체 최종 위치", diff: "Easy", xp: 10, time: "3m",
        desc: "격자 크기 n과 이동 횟수 m, m개의 명령(U/D/L/R)을 입력받아 (0,0)에서 출발해 최종 위치 행 열을 출력하세요. 격자 밖으로 나가는 명령은 무시합니다.",
        example: { input: "5 3\nD R D\n", output: "2 1" } },
    ],
    practice: [
      { id: "t4-ch1-4-p1", title: "방문 칸 수 세기", diff: "Easy", xp: 10, time: "4m",
        desc: "격자 크기 n과 이동 횟수 m, m개의 명령(U/D/L/R)을 입력받아 (0,0)에서 출발해 방문한 서로 다른 칸의 수를 출력하세요. 범위 밖 명령은 무시합니다.",
        example: { input: "5 4\nD R U L\n", output: "3" } },
    ],
  },
};

LESSONS["t4-ch1-5"] = {
  trail: 4, ch: 1, no: 5, title: "격자 안에서 여러 객체로 이동",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "격자 위의 여러 객체를 동시에 같은 명령으로 이동시키고 충돌 또는 최종 상태를 처리합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint main() {\n  int n, k;\n  scanf(\"%d %d\", &n, &k);\n  int r[10], c[10];\n  for (int i = 0; i < k; i++) scanf(\"%d %d\", &r[i], &c[i]);\n\n  int m;\n  scanf(\"%d\", &m);\n  int dr[] = {-1,1,0,0};\n  int dc[] = {0,0,-1,1};\n  for (int t = 0; t < m; t++) {\n    char cmd[4];\n    scanf(\"%s\", cmd);\n    int d = (cmd[0]=='D') ? 1 : (cmd[0]=='L') ? 2 : (cmd[0]=='R') ? 3 : 0;\n    for (int i = 0; i < k; i++) {\n      int nr = r[i]+dr[d], nc = c[i]+dc[d];\n      if (nr>=0 && nr<n && nc>=0 && nc<n) { r[i]=nr; c[i]=nc; }\n    }\n  }\n  for (int i = 0; i < k; i++) printf(\"%d %d\\n\", r[i], c[i]);\n  return 0;\n}" },
      { type: "h3",   text: "여러 객체 동시 이동" },
      { type: "list", items: ["객체 수 k를 배열로 관리: r[k], c[k]", "명령 1개에 모든 객체 동시 이동", "각 객체 독립 범위 체크", "충돌 감지: 이동 후 같은 셀 여부 확인"] },
      { type: "callout", text: "여러 객체도 단일 객체 로직을 반복문으로 k번 적용하면 됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch1-5-b1", title: "여러 객체 최종 위치", diff: "Easy", xp: 10, time: "4m",
        desc: "격자 크기 n, 객체 수 k, 각 객체 초기 위치(행 열), 이동 횟수 m, m개의 명령(U/D/L/R)을 입력받아 각 객체의 최종 위치를 한 줄씩 출력하세요. 범위 밖 명령은 무시합니다.",
        example: { input: "5 2\n0 0\n4 4\n2\nD R\n", output: "1 1\n4 4" } },
    ],
    practice: [
      { id: "t4-ch1-5-p1", title: "충돌 횟수 세기", diff: "Easy", xp: 10, time: "5m",
        desc: "격자 크기 n, 객체 수 k, 각 객체 초기 위치, 이동 횟수 m, m개의 명령(U/D/L/R)을 입력받아 이동 후 같은 위치에 2개 이상의 객체가 있는 칸의 수를 출력하세요.",
        example: { input: "5 2\n0 0\n0 1\n1\nR\n", output: "1" } },
    ],
  },
};

// --- Ch 2. Backtracking ---

LESSONS["t4-ch2-1"] = {
  trail: 4, ch: 2, no: 1, title: "K개 중 하나를 N번 선택하기(Simple)",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "K가지 선택지 중 하나를 N번 뽑는 경우의 수(중복 허용)를 재귀로 완전탐색합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint n, k;\nint cnt = 0;\n\nvoid rec(int depth) {\n  if (depth == n) { cnt++; return; }\n  for (int i = 0; i < k; i++)\n    rec(depth + 1);\n}\n\nint main() {\n  scanf(\"%d %d\", &n, &k);\n  rec(0);\n  printf(\"%d\\n\", cnt);\n  return 0;\n}" },
      { type: "h3",   text: "중복 허용 선택 패턴" },
      { type: "list", items: ["depth == n: 선택 완료 → 카운트 증가", "각 단계에서 k가지 선택지 모두 시도", "총 경우의 수 = k^n", "상태 배열 없이 카운트만 할 때 가장 단순한 형태"] },
      { type: "callout", text: "k^n이 너무 크면 재귀 대신 수식으로 계산하지만, 이 패턴이 백트래킹의 기초입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch2-1-b1", title: "중복 선택 경우의 수", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 n과 k를 입력받아 k가지 선택지에서 중복 허용으로 n번 선택하는 경우의 수를 출력하세요. (n, k ≤ 4)",
        example: { input: "2 3\n", output: "9" } },
    ],
    practice: [
      { id: "t4-ch2-1-p1", title: "중복 선택 합 목표", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n, k, target을 입력받아 1부터 k까지 정수에서 중복 허용으로 n번 선택해 합이 target이 되는 경우의 수를 출력하세요. (n, k ≤ 4)",
        example: { input: "2 3 4\n", output: "3" } },
    ],
  },
};

LESSONS["t4-ch2-2"] = {
  trail: 4, ch: 2, no: 2, title: "K개 중 하나를 N번 선택하기(Conditional)",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "K가지 선택지에서 N번 선택하되, 이전 선택 결과에 따라 가지치기(pruning)하는 조건부 백트래킹을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint n, k, target;\nint cnt = 0;\n\nvoid rec(int depth, int sum) {\n  if (sum > target) return; // 가지치기\n  if (depth == n) {\n    if (sum == target) cnt++;\n    return;\n  }\n  for (int i = 1; i <= k; i++)\n    rec(depth + 1, sum + i);\n}\n\nint main() {\n  scanf(\"%d %d %d\", &n, &k, &target);\n  rec(0, 0);\n  printf(\"%d\\n\", cnt);\n  return 0;\n}" },
      { type: "h3",   text: "조건부 백트래킹 핵심" },
      { type: "list", items: ["가지치기(pruning): 조기에 불가능 경로 차단", "현재 상태(sum)를 재귀 인자로 전달", "조건 위반 시 즉시 return으로 탐색 중단", "가지치기가 많을수록 실행 시간 단축"] },
      { type: "callout", text: "가지치기는 백트래킹의 핵심 최적화 기법입니다. 유효하지 않은 가지를 일찍 자를수록 빠릅니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch2-2-b1", title: "합 조건 경우의 수", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n, k, target을 입력받아 1~k에서 중복 허용 n번 선택 시 합이 target 이하인 경우의 수를 출력하세요. (n, k ≤ 4)",
        example: { input: "2 3 4\n", output: "6" } },
    ],
    practice: [
      { id: "t4-ch2-2-p1", title: "홀수만 선택 경우의 수", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n과 k를 입력받아 1~k에서 중복 허용 n번 선택 시 선택한 값이 모두 홀수인 경우의 수를 출력하세요. (n, k ≤ 4)",
        example: { input: "2 4\n", output: "4" } },
    ],
  },
};

LESSONS["t4-ch2-3"] = {
  trail: 4, ch: 2, no: 3, title: "N개 중에 M개 고르기(Simple)",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "N개의 원소 중 M개를 중복 없이 고르는 조합(combination)을 재귀로 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint n, m;\nint cnt = 0;\n\nvoid rec(int start, int depth) {\n  if (depth == m) { cnt++; return; }\n  for (int i = start; i < n; i++)\n    rec(i + 1, depth + 1);\n}\n\nint main() {\n  scanf(\"%d %d\", &n, &m);\n  rec(0, 0);\n  printf(\"%d\\n\", cnt);\n  return 0;\n}" },
      { type: "h3",   text: "조합 생성 패턴" },
      { type: "list", items: ["start 인자로 이미 선택한 인덱스 이후만 탐색", "depth == m: m개 선택 완료", "같은 원소 중복 선택 없음 (i+1부터 시작)", "총 경우의 수 = C(n,m)"] },
      { type: "callout", text: "start를 i+1로 넘기는 것이 조합과 순열의 차이점입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch2-3-b1", title: "조합 경우의 수", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 n과 m을 입력받아 n개 중 m개를 중복 없이 고르는 경우의 수를 출력하세요. (n ≤ 6, m ≤ n)",
        example: { input: "4 2\n", output: "6" } },
    ],
    practice: [
      { id: "t4-ch2-3-p1", title: "조합 합 목표", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n, m, target을 입력받아 1~n 중 m개를 중복 없이 골라 합이 target인 경우의 수를 출력하세요. (n ≤ 6, m ≤ n)",
        example: { input: "4 2 5\n", output: "2" } },
    ],
  },
};

LESSONS["t4-ch2-4"] = {
  trail: 4, ch: 2, no: 4, title: "순열 만들기",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "N개의 원소로 만들 수 있는 모든 순열(permutation)을 visited 배열과 재귀로 생성합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint n;\nint visited[8] = {0};\nint cnt = 0;\n\nvoid rec(int depth) {\n  if (depth == n) { cnt++; return; }\n  for (int i = 0; i < n; i++) {\n    if (!visited[i]) {\n      visited[i] = 1;\n      rec(depth + 1);\n      visited[i] = 0; // 원상복구\n    }\n  }\n}\n\nint main() {\n  scanf(\"%d\", &n);\n  rec(0);\n  printf(\"%d\\n\", cnt);\n  return 0;\n}" },
      { type: "h3",   text: "순열 생성 패턴" },
      { type: "list", items: ["visited[] 배열로 이미 선택된 원소 추적", "선택 → 재귀 → 원상복구(backtrack) 3단계", "총 경우의 수 = n!", "start 인자 없음: 항상 0부터 전체 탐색"] },
      { type: "callout", text: "원상복구(visited[i]=0)가 백트래킹의 핵심입니다. 이것이 없으면 순열이 아닌 잘못된 결과가 나옵니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch2-4-b1", title: "순열 경우의 수", diff: "Easy", xp: 10, time: "2m",
        desc: "정수 n을 입력받아 n개의 원소로 만들 수 있는 순열의 수를 출력하세요. (n ≤ 6)",
        example: { input: "3\n", output: "6" } },
    ],
    practice: [
      { id: "t4-ch2-4-p1", title: "순열 합 목표", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n과 target을 입력받아 1~n의 순열 중 첫 번째 원소가 target인 경우의 수를 출력하세요. (n ≤ 6)",
        example: { input: "3 2\n", output: "2" } },
    ],
  },
};

// --- Ch 3. DFS ---

LESSONS["t4-ch3-1"] = {
  trail: 4, ch: 3, no: 1, title: "DFS 기본",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "인접 행렬로 표현된 그래프에서 깊이 우선 탐색(DFS)을 재귀로 구현하고 방문 노드 수를 구합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint adj[10][10], visited[10];\nint n;\nint cnt = 0;\n\nvoid dfs(int v) {\n  visited[v] = 1;\n  cnt++;\n  for (int u = 0; u < n; u++) {\n    if (adj[v][u] && !visited[u])\n      dfs(u);\n  }\n}\n\nint main() {\n  int e;\n  scanf(\"%d %d\", &n, &e);\n  for (int i = 0; i < e; i++) {\n    int u, v;\n    scanf(\"%d %d\", &u, &v);\n    adj[u][v] = adj[v][u] = 1;\n  }\n  dfs(0);\n  printf(\"%d\\n\", cnt);\n  return 0;\n}" },
      { type: "h3",   text: "DFS 핵심 구조" },
      { type: "list", items: ["visited[] 배열로 방문 여부 추적", "현재 노드 방문 표시 후 인접 미방문 노드 재귀 호출", "인접 행렬: adj[u][v]==1 이면 u-v 연결", "연결 컴포넌트 탐색, 경로 탐색에 활용"] },
      { type: "callout", text: "DFS는 '한 방향으로 끝까지 파고들다 막히면 되돌아오는' 탐색입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch3-1-b1", title: "DFS 방문 노드 수", diff: "Easy", xp: 10, time: "3m",
        desc: "노드 수 n과 간선 수 e, e개의 간선(무방향)을 입력받아 노드 0에서 DFS로 방문 가능한 노드 수를 출력하세요.",
        example: { input: "4 3\n0 1\n1 2\n2 3\n", output: "4" } },
    ],
    practice: [
      { id: "t4-ch3-1-p1", title: "연결 컴포넌트 수", diff: "Easy", xp: 10, time: "4m",
        desc: "노드 수 n과 간선 수 e, e개의 간선(무방향)을 입력받아 연결 컴포넌트의 수를 출력하세요.",
        example: { input: "5 2\n0 1\n2 3\n", output: "3" } },
    ],
  },
};

LESSONS["t4-ch3-2"] = {
  trail: 4, ch: 3, no: 2, title: "DFS와 백트래킹",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "DFS 탐색 중 조건에 맞는 경로를 찾거나 카운트하는 백트래킹 응용 패턴을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint adj[10][10], visited[10];\nint n;\nint cnt = 0;\n\nvoid dfs(int v, int goal, int depth) {\n  if (v == goal) { cnt++; return; }\n  for (int u = 0; u < n; u++) {\n    if (adj[v][u] && !visited[u]) {\n      visited[u] = 1;\n      dfs(u, goal, depth + 1);\n      visited[u] = 0; // 백트래킹\n    }\n  }\n}\n\nint main() {\n  int e, s, g;\n  scanf(\"%d %d\", &n, &e);\n  for (int i = 0; i < e; i++) {\n    int u, v;\n    scanf(\"%d %d\", &u, &v);\n    adj[u][v] = adj[v][u] = 1;\n  }\n  scanf(\"%d %d\", &s, &g);\n  visited[s] = 1;\n  dfs(s, g, 0);\n  printf(\"%d\\n\", cnt);\n  return 0;\n}" },
      { type: "h3",   text: "DFS + 백트래킹 패턴" },
      { type: "list", items: ["목표 노드 도달 시 카운트 증가", "방문 후 재귀 호출 전 visited[u]=1", "재귀 복귀 후 visited[u]=0으로 원상복구", "단순 DFS(방문 취소 없음)와 달리 모든 경로 탐색 가능"] },
      { type: "callout", text: "백트래킹 DFS에서 visited 원상복구를 빠뜨리면 경로를 중복 차단해 카운트가 틀립니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch3-2-b1", title: "두 노드 간 경로 수", diff: "Easy", xp: 10, time: "4m",
        desc: "노드 수 n, 간선 수 e, e개의 무방향 간선, 출발 노드 s와 목표 노드 g를 입력받아 s에서 g까지의 단순 경로(같은 노드 두 번 방문 금지) 수를 출력하세요.",
        example: { input: "4 4\n0 1\n0 2\n1 3\n2 3\n0 3\n", output: "2" } },
    ],
    practice: [
      { id: "t4-ch3-2-p1", title: "정확히 k 간선 경로 수", diff: "Easy", xp: 10, time: "5m",
        desc: "노드 수 n, 간선 수 e, e개의 무방향 간선, 출발 s, 목표 g, 간선 수 k를 입력받아 정확히 k개의 간선을 사용하는 s→g 단순 경로 수를 출력하세요.",
        example: { input: "4 4\n0 1\n0 2\n1 3\n2 3\n0 3 2\n", output: "2" } },
    ],
  },
};

LESSONS["t4-ch3-3"] = {
  trail: 4, ch: 3, no: 3, title: "DFS vs BFS",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "DFS(깊이 우선)와 BFS(너비 우선) 탐색의 방문 순서 차이를 직접 구현해 비교합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint adj[10][10], vis[10];\nint n;\n// BFS용 큐\nint q[100], qh, qt;\n\nvoid dfs(int v) {\n  vis[v] = 1; printf(\"%d \", v);\n  for (int u = 0; u < n; u++)\n    if (adj[v][u] && !vis[u]) dfs(u);\n}\n\nvoid bfs(int s) {\n  qh = qt = 0;\n  q[qt++] = s; vis[s] = 1;\n  while (qh < qt) {\n    int v = q[qh++];\n    printf(\"%d \", v);\n    for (int u = 0; u < n; u++)\n      if (adj[v][u] && !vis[u]) { vis[u]=1; q[qt++]=u; }\n  }\n}" },
      { type: "h3",   text: "DFS vs BFS 비교" },
      { type: "list", items: ["DFS: 스택(재귀) — 한 방향 끝까지, 경로/사이클 탐지에 강점", "BFS: 큐 — 거리 순 탐색, 최단 경로(가중치 없는 그래프)에 강점", "같은 그래프도 시작 노드에 따라 방문 순서 달라짐", "두 방법 모두 O(V+E) 시간복잡도"] },
      { type: "callout", text: "최단 경로가 필요하면 BFS, 경로 존재 여부·백트래킹이 필요하면 DFS를 선택하세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t4-ch3-3-b1", title: "BFS 방문 노드 수", diff: "Easy", xp: 10, time: "3m",
        desc: "노드 수 n과 간선 수 e, e개의 무방향 간선을 입력받아 노드 0에서 BFS로 방문 가능한 노드 수를 출력하세요.",
        example: { input: "4 3\n0 1\n1 2\n2 3\n", output: "4" } },
    ],
    practice: [
      { id: "t4-ch3-3-p1", title: "BFS 최단 거리", diff: "Easy", xp: 10, time: "4m",
        desc: "노드 수 n, 간선 수 e, e개의 무방향 간선, 출발 s와 목표 g를 입력받아 s에서 g까지 BFS 최단 경로의 간선 수를 출력하세요. 경로 없으면 -1을 출력합니다.",
        example: { input: "4 3\n0 1\n1 2\n2 3\n0 3\n", output: "3" } },
    ],
  },
};

// === END Trail 4 ===

// ===== Trail 5 (알고리즘 기본) =====

// --- Ch 1. 중급 자료구조 ---

LESSONS["t5-ch1-1"] = {
  trail: 5, ch: 1, no: 1, title: "HashMap",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "키-값 쌍을 저장하는 HashMap의 개념을 C에서 배열과 선형 탐색으로 직접 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\n\n#define MAX 100\n\nchar keys[MAX][20];\nint  vals[MAX];\nint  sz = 0;\n\nvoid put(const char *k, int v) {\n  for (int i = 0; i < sz; i++)\n    if (strcmp(keys[i], k) == 0) { vals[i] = v; return; }\n  strcpy(keys[sz], k); vals[sz] = v; sz++;\n}\n\nint get(const char *k) {\n  for (int i = 0; i < sz; i++)\n    if (strcmp(keys[i], k) == 0) return vals[i];\n  return -1;\n}\n\nint main() {\n  put(\"apple\", 3); put(\"banana\", 7);\n  printf(\"%d\\n\", get(\"banana\"));\n  return 0;\n}" },
      { type: "h3",   text: "HashMap 핵심 연산" },
      { type: "list", items: ["put(key, value): 키가 이미 있으면 갱신, 없으면 삽입", "get(key): 키로 값 조회, 없으면 -1", "선형 탐색 O(n) — 입문 구현으로 충분", "실제 HashMap은 해시 함수로 O(1) 평균 달성"] },
      { type: "callout", text: "C 표준 라이브러리에는 HashMap이 없으므로 직접 구현하거나 별도 라이브러리를 사용해야 합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch1-1-b1", title: "값 조회", diff: "Easy", xp: 10, time: "2m",
        desc: "키-값 쌍 n개를 입력받은 뒤 쿼리 키 q에 해당하는 값을 출력하세요. (첫 줄: n, 이후 n줄: 키 값, 마지막 줄: q)",
        example: { input: "3\napple 3\nbanana 7\ncherry 2\nbanana\n", output: "7" } },
    ],
    practice: [
      { id: "t5-ch1-1-p1", title: "값 합산", diff: "Easy", xp: 10, time: "3m",
        desc: "키-값 쌍 n개를 입력받고, 이후 m개의 쿼리 키에 해당하는 값들의 합을 출력하세요. (첫 줄: n, n줄: 키 값, 다음 줄: m, m줄: 쿼리 키)",
        example: { input: "3\napple 3\nbanana 7\ncherry 2\n2\napple\ncherry\n", output: "5" } },
    ],
  },
};

LESSONS["t5-ch1-2"] = {
  trail: 5, ch: 1, no: 2, title: "TreeMap",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "키 기준 정렬된 맵인 TreeMap을 C에서 정렬 배열과 bsearch로 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct { char key[20]; int val; } Entry;\nEntry map[100]; int sz = 0;\n\nint cmp(const void *a, const void *b) {\n  return strcmp(((Entry*)a)->key, ((Entry*)b)->key);\n}\n\nvoid put(const char *k, int v) {\n  strcpy(map[sz].key, k); map[sz].val = v; sz++;\n  qsort(map, sz, sizeof(Entry), cmp);\n}\n\nint get(const char *k) {\n  Entry key; strcpy(key.key, k);\n  Entry *r = bsearch(&key, map, sz, sizeof(Entry), cmp);\n  return r ? r->val : -1;\n}\n\nint main() {\n  put(\"banana\", 7); put(\"apple\", 3); put(\"cherry\", 2);\n  printf(\"%d\\n\", get(\"apple\"));\n  return 0;\n}" },
      { type: "h3",   text: "TreeMap 특징" },
      { type: "list", items: ["삽입 시 qsort로 정렬 유지", "조회 시 bsearch로 O(log n) 이진 탐색", "Java TreeMap처럼 키가 항상 정렬된 순서", "순서 있는 iteration이 필요할 때 HashMap보다 유리"] },
      { type: "callout", text: "bsearch는 배열이 반드시 정렬되어 있어야 동작합니다. 삽입 직후 qsort 호출을 잊지 마세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch1-2-b1", title: "정렬 맵 조회", diff: "Easy", xp: 10, time: "2m",
        desc: "키-값 쌍 n개를 입력받아 정렬 맵에 저장한 뒤 쿼리 키 q의 값을 출력하세요. 없으면 -1. (첫 줄: n, n줄: 키 값, 마지막 줄: q)",
        example: { input: "3\nbanana 7\napple 3\ncherry 2\napple\n", output: "3" } },
    ],
    practice: [
      { id: "t5-ch1-2-p1", title: "최솟값 키의 값", diff: "Easy", xp: 10, time: "3m",
        desc: "키-값 쌍 n개를 입력받아 정렬 맵에 저장한 뒤 사전순 가장 작은 키의 값을 출력하세요. (첫 줄: n, 이후 n줄: 키 값)",
        example: { input: "3\nbanana 7\napple 3\ncherry 2\n", output: "3" } },
    ],
  },
};

LESSONS["t5-ch1-3"] = {
  trail: 5, ch: 1, no: 3, title: "HashSet",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "중복 없는 원소 집합인 HashSet을 C에서 배열과 선형 탐색으로 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\n\nchar set[100][20]; int sz = 0;\n\nvoid insert(const char *v) {\n  for (int i = 0; i < sz; i++)\n    if (strcmp(set[i], v) == 0) return;\n  strcpy(set[sz++], v);\n}\n\nint contains(const char *v) {\n  for (int i = 0; i < sz; i++)\n    if (strcmp(set[i], v) == 0) return 1;\n  return 0;\n}\n\nint main() {\n  insert(\"apple\"); insert(\"banana\"); insert(\"apple\");\n  printf(\"%d\\n\", contains(\"apple\")); // 1\n  printf(\"%d\\n\", contains(\"grape\")); // 0\n  return 0;\n}" },
      { type: "h3",   text: "HashSet 핵심 연산" },
      { type: "list", items: ["insert: 이미 있으면 무시, 없으면 추가", "contains: 원소 존재 여부 1/0 반환", "중복 허용 안 함 — 집합의 정의", "실제 HashSet은 해시 함수로 O(1) 평균"] },
      { type: "callout", text: "HashSet은 값의 존재 여부만 필요할 때 사용합니다. 값과 함께 키가 필요하면 HashMap을 쓰세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch1-3-b1", title: "멤버 여부 확인", diff: "Easy", xp: 10, time: "2m",
        desc: "단어 n개를 집합에 삽입한 뒤 쿼리 단어 q가 집합에 있으면 1, 없으면 0을 출력하세요. (첫 줄: n, n줄: 단어, 마지막 줄: q)",
        example: { input: "3\napple\nbanana\ncherry\nbanana\n", output: "1" } },
    ],
    practice: [
      { id: "t5-ch1-3-p1", title: "중복 제거 후 개수", diff: "Easy", xp: 10, time: "3m",
        desc: "단어 n개를 입력받아 집합에 삽입한 뒤 고유 원소의 수를 출력하세요. (첫 줄: n, 이후 n줄: 단어)",
        example: { input: "5\napple\nbanana\napple\ncherry\nbanana\n", output: "3" } },
    ],
  },
};

LESSONS["t5-ch1-4"] = {
  trail: 5, ch: 1, no: 4, title: "TreeSet",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "정렬된 집합인 TreeSet을 C에서 정렬 배열로 구현하고 이진 탐색으로 조회합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nchar set[100][20]; int sz = 0;\n\nint cmp(const void *a, const void *b) {\n  return strcmp((char*)a, (char*)b);\n}\n\nvoid insert(const char *v) {\n  if (!bsearch(v, set, sz, sizeof(set[0]), cmp)) {\n    strcpy(set[sz++], v);\n    qsort(set, sz, sizeof(set[0]), cmp);\n  }\n}\n\nint contains(const char *v) {\n  return bsearch(v, set, sz, sizeof(set[0]), cmp) != NULL;\n}\n\nint main() {\n  insert(\"banana\"); insert(\"apple\"); insert(\"banana\");\n  printf(\"%d\\n\", contains(\"apple\")); // 1\n  printf(\"%d\\n\", sz); // 2\n  return 0;\n}" },
      { type: "h3",   text: "TreeSet 특징" },
      { type: "list", items: ["삽입 시 중복 체크 후 qsort로 정렬 유지", "contains: bsearch O(log n)", "Java TreeSet처럼 항상 정렬 순서 보장", "최솟값/최댓값 접근이 쉬움 (set[0] / set[sz-1])"] },
      { type: "callout", text: "TreeSet은 중복 제거 + 정렬이 동시에 필요한 경우에 적합합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch1-4-b1", title: "정렬 집합 멤버 확인", diff: "Easy", xp: 10, time: "2m",
        desc: "단어 n개를 TreeSet에 삽입한 뒤 쿼리 단어 q가 있으면 1, 없으면 0을 출력하세요. (첫 줄: n, n줄: 단어, 마지막 줄: q)",
        example: { input: "3\nbanana\napple\ncherry\napple\n", output: "1" } },
    ],
    practice: [
      { id: "t5-ch1-4-p1", title: "정렬 집합 첫 원소", diff: "Easy", xp: 10, time: "3m",
        desc: "단어 n개를 TreeSet에 삽입한 뒤 사전순 가장 작은 원소를 출력하세요. (첫 줄: n, 이후 n줄: 단어)",
        example: { input: "4\ncherry\napple\ndate\nbanana\n", output: "apple" } },
    ],
  },
};

LESSONS["t5-ch1-5"] = {
  trail: 5, ch: 1, no: 5, title: "Priority Queue",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "우선순위 큐(Priority Queue)의 개념을 이해하고 C에서 정렬 기반으로 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n\nint pq[100], sz = 0;\n\nvoid push(int v) {\n  pq[sz++] = v;\n}\n\nint popMin() {\n  int mi = 0;\n  for (int i = 1; i < sz; i++) if (pq[i] < pq[mi]) mi = i;\n  int v = pq[mi];\n  pq[mi] = pq[--sz];\n  return v;\n}\n\nint main() {\n  push(5); push(1); push(3);\n  printf(\"%d\\n\", popMin()); // 1\n  printf(\"%d\\n\", popMin()); // 3\n  return 0;\n}" },
      { type: "h3",   text: "Priority Queue 핵심" },
      { type: "list", items: ["항상 최솟값(또는 최댓값)을 먼저 꺼냄", "push: O(1), popMin: O(n) — 입문 구현", "실제 구현은 이진 힙(Binary Heap) 사용 → O(log n)", "다익스트라, 허프만 코딩 등에 핵심 역할"] },
      { type: "callout", text: "우선순위 큐는 단순 큐와 달리 삽입 순서가 아니라 값의 크기(우선순위)로 꺼내는 순서가 결정됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch1-5-b1", title: "최솟값 k개 합", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n개를 우선순위 큐에 삽입한 뒤 가장 작은 k개를 차례로 꺼내 그 합을 출력하세요. (첫 줄: n k, 둘째 줄: n개 정수)",
        example: { input: "5 3\n4 1 7 2 9\n", output: "7" } },
    ],
    practice: [
      { id: "t5-ch1-5-p1", title: "k번째 최솟값", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n개를 우선순위 큐에 삽입한 뒤 k번째로 작은 값을 출력하세요. (첫 줄: n k, 둘째 줄: n개 정수)",
        example: { input: "5 2\n4 1 7 2 9\n", output: "2" } },
    ],
  },
};

LESSONS["t5-ch1-6"] = {
  trail: 5, ch: 1, no: 6, title: "Doubly-LinkedList",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "앞뒤 양방향으로 순회할 수 있는 이중 연결 리스트를 C 구조체로 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n  int val;\n  struct Node *prev, *next;\n} Node;\n\nNode *newNode(int v) {\n  Node *n = malloc(sizeof(Node));\n  n->val = v; n->prev = n->next = NULL;\n  return n;\n}\n\nint main() {\n  Node *head = newNode(1);\n  Node *mid  = newNode(2);\n  Node *tail = newNode(3);\n  head->next = mid;  mid->prev = head;\n  mid->next  = tail; tail->prev = mid;\n  // 정방향 출력\n  for (Node *c = head; c; c = c->next) printf(\"%d \", c->val);\n  printf(\"\\n\");\n  // 역방향 출력\n  for (Node *c = tail; c; c = c->prev) printf(\"%d \", c->val);\n  printf(\"\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "이중 연결 리스트 구조" },
      { type: "list", items: ["각 노드에 prev(이전)와 next(다음) 포인터", "양방향 순회 가능 — 단순 연결 리스트보다 유연", "삽입/삭제 O(1) (해당 노드 포인터를 알 때)", "C++ std::list, Java LinkedList 내부 구조"] },
      { type: "callout", text: "이중 연결 리스트를 수정할 때 prev와 next 두 포인터를 모두 갱신해야 합니다. 하나라도 빠뜨리면 메모리 오류가 발생합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch1-6-b1", title: "정방향 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n개를 순서대로 이중 연결 리스트에 삽입한 뒤 head부터 정방향으로 공백 구분 출력하세요. (첫 줄: n, 둘째 줄: n개 정수)",
        example: { input: "4\n1 2 3 4\n", output: "1 2 3 4" } },
    ],
    practice: [
      { id: "t5-ch1-6-p1", title: "역방향 출력", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n개를 순서대로 이중 연결 리스트에 삽입한 뒤 tail부터 역방향으로 공백 구분 출력하세요. (첫 줄: n, 둘째 줄: n개 정수)",
        example: { input: "4\n1 2 3 4\n", output: "4 3 2 1" } },
    ],
  },
};

// --- Ch 2. Shorten time Technique ---

LESSONS["t5-ch2-1"] = {
  trail: 5, ch: 2, no: 1, title: "Prefix Sum",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "누적 합(Prefix Sum) 배열을 이용해 구간 합 쿼리를 O(n)→O(1)으로 단축하는 기법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint a[100], prefix[101];\n\nint main() {\n  int n; scanf(\"%d\", &n);\n  for (int i = 1; i <= n; i++) scanf(\"%d\", &a[i]);\n  for (int i = 1; i <= n; i++) prefix[i] = prefix[i-1] + a[i];\n  int l, r; scanf(\"%d %d\", &l, &r);\n  printf(\"%d\\n\", prefix[r] - prefix[l-1]);\n  return 0;\n}" },
      { type: "h3",   text: "Prefix Sum 원리" },
      { type: "list", items: ["prefix[i] = a[1]+a[2]+...+a[i]", "구간 합 [l,r] = prefix[r] - prefix[l-1]", "전처리 O(n), 쿼리 O(1)", "쿼리 m개 → 전체 O(n+m)으로 O(nm)을 대체"] },
      { type: "callout", text: "인덱스를 1-based로 맞추면 prefix[0]=0으로 경계 처리가 간단해집니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch2-1-b1", title: "구간 합 쿼리", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n개와 구간 [l, r]을 입력받아 l번째부터 r번째까지의 합을 출력하세요. 인덱스는 1-based. (첫 줄: n, 둘째 줄: n개 정수, 셋째 줄: l r)",
        example: { input: "5\n1 2 3 4 5\n2 4\n", output: "9" } },
    ],
    practice: [
      { id: "t5-ch2-1-p1", title: "다중 구간 합", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n개와 쿼리 m개를 입력받아 각 구간 합을 한 줄씩 출력하세요. (첫 줄: n, 둘째 줄: n개 정수, 셋째 줄: m, 이후 m줄: l r)",
        example: { input: "5\n1 2 3 4 5\n2\n1 3\n2 5\n", output: "6\n14" } },
    ],
  },
};

LESSONS["t5-ch2-2"] = {
  trail: 5, ch: 2, no: 2, title: "Grid Compression",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "좌표 압축(Coordinate Compression)으로 큰 좌표값을 인덱스로 변환해 공간·시간을 절약하는 기법을 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n\nint a[100], b[100], n;\n\nint cmp(const void *x, const void *y) { return *(int*)x - *(int*)y; }\n\nint compress(int v) {\n  int lo=0, hi=n-1;\n  while (lo<=hi) {\n    int mid=(lo+hi)/2;\n    if (b[mid]==v) return mid;\n    if (b[mid]<v) lo=mid+1; else hi=mid-1;\n  }\n  return -1;\n}\n\nint main() {\n  scanf(\"%d\", &n);\n  for (int i=0;i<n;i++) { scanf(\"%d\",&a[i]); b[i]=a[i]; }\n  qsort(b,n,sizeof(int),cmp);\n  // remove duplicates\n  int m=0;\n  for(int i=0;i<n;i++) if(i==0||b[i]!=b[i-1]) b[m++]=b[i];\n  n=m;\n  printf(\"%d\\n\",n);\n  return 0;\n}" },
      { type: "h3",   text: "좌표 압축 절차" },
      { type: "list", items: ["원본 배열 복사 후 정렬", "중복 제거로 unique 배열 생성", "원본 값 → unique 배열 내 인덱스로 변환", "값 범위 10^9이어도 인덱스는 최대 n-1"] },
      { type: "callout", text: "좌표 압축 후 unique한 좌표 수가 실제 배열 크기가 됩니다. 메모리 절약에 핵심입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch2-2-b1", title: "고유 좌표 수", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n개를 입력받아 좌표 압축 후 unique 좌표의 수를 출력하세요. (첫 줄: n, 둘째 줄: n개 정수)",
        example: { input: "6\n10 20 10 30 20 40\n", output: "4" } },
    ],
    practice: [
      { id: "t5-ch2-2-p1", title: "압축 인덱스 출력", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n개를 입력받아 각 값의 압축 인덱스(0-based, 중복 제거 후 정렬 순서)를 공백 구분으로 출력하세요. (첫 줄: n, 둘째 줄: n개 정수)",
        example: { input: "5\n30 10 20 10 30\n", output: "2 0 1 0 2" } },
    ],
  },
};

LESSONS["t5-ch2-3"] = {
  trail: 5, ch: 2, no: 3, title: "LR Technique",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "Left-Right 누적 합 기법으로 각 원소 기준 왼쪽/오른쪽 부분 합을 O(n)에 계산합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint a[100], L[100], R[100];\n\nint main() {\n  int n; scanf(\"%d\", &n);\n  for (int i=0;i<n;i++) scanf(\"%d\",&a[i]);\n  L[0]=0;\n  for (int i=1;i<n;i++) L[i]=L[i-1]+a[i-1];\n  R[n-1]=0;\n  for (int i=n-2;i>=0;i--) R[i]=R[i+1]+a[i+1];\n  for (int i=0;i<n;i++) printf(\"%d \",L[i]+R[i]);\n  printf(\"\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "LR Technique 원리" },
      { type: "list", items: ["L[i] = a[0]+...+a[i-1] (왼쪽 합)", "R[i] = a[i+1]+...+a[n-1] (오른쪽 합)", "L+R = i를 제외한 나머지 합", "O(n) 두 번 스캔으로 모든 위치 계산"] },
      { type: "callout", text: "LR Technique은 '자신을 제외한 나머지 곱/합' 유형 문제에 자주 활용됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch2-3-b1", title: "자신 제외 합", diff: "Easy", xp: 10, time: "3m",
        desc: "정수 n개를 입력받아 각 위치에서 자신을 제외한 나머지 원소의 합을 공백 구분으로 출력하세요. (첫 줄: n, 둘째 줄: n개 정수)",
        example: { input: "4\n1 2 3 4\n", output: "9 8 7 6" } },
    ],
    practice: [
      { id: "t5-ch2-3-p1", title: "최대 LR 합 위치", diff: "Easy", xp: 10, time: "4m",
        desc: "정수 n개를 입력받아 자신을 제외한 나머지 합이 가장 큰 위치의 인덱스(0-based)를 출력하세요. 동점이면 가장 작은 인덱스를 출력하세요. (첫 줄: n, 둘째 줄: n개 정수)",
        example: { input: "4\n1 2 3 4\n", output: "0" } },
    ],
  },
};

LESSONS["t5-ch2-4"] = {
  trail: 5, ch: 2, no: 4, title: "+1-1 technique",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "차이 배열(Difference Array / +1-1 기법)로 범위 업데이트를 O(n)→O(1)으로 처리합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint diff[105];\n\nint main() {\n  int n, q; scanf(\"%d %d\", &n, &q);\n  while (q--) {\n    int l, r, v; scanf(\"%d %d %d\", &l, &r, &v);\n    diff[l] += v; diff[r+1] -= v; // [l,r] 구간에 v 더하기\n  }\n  int cur = 0;\n  for (int i=1;i<=n;i++) {\n    cur += diff[i];\n    printf(\"%d \", cur);\n  }\n  printf(\"\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "+1-1 기법 원리" },
      { type: "list", items: ["diff[l] += v, diff[r+1] -= v 로 구간 업데이트 O(1)", "마지막에 누적 합으로 실제 배열 복원", "m번 업데이트 → O(m+n), 직접 갱신 대비 O(mn)→O(m+n)", "이벤트 스케줄링, 페인트 문제 등에 활용"] },
      { type: "callout", text: "차이 배열 기법은 범위 업데이트가 많을 때 강력합니다. 단, 특정 인덱스를 바로 조회하려면 누적 합으로 복원해야 합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t5-ch2-4-b1", title: "범위 업데이트 후 합", diff: "Easy", xp: 10, time: "3m",
        desc: "길이 n의 0 배열에 쿼리 q개를 적용 후 전체 합을 출력하세요. 각 쿼리: [l, r] 구간에 1을 더합니다. 인덱스 1-based. (첫 줄: n q, 이후 q줄: l r)",
        example: { input: "5 2\n1 3\n2 5\n", output: "7" } },
    ],
    practice: [
      { id: "t5-ch2-4-p1", title: "범위 업데이트 후 배열", diff: "Easy", xp: 10, time: "4m",
        desc: "길이 n의 0 배열에 쿼리 q개를 적용 후 최종 배열을 공백 구분으로 출력하세요. 각 쿼리: [l, r] 구간에 v를 더합니다. 인덱스 1-based. (첫 줄: n q, 이후 q줄: l r v)",
        example: { input: "5 2\n1 3 2\n2 4 3\n", output: "2 5 5 3 0" } },
    ],
  },
};

// === END Trail 5 ===

// ===== Trail 6 (알고리즘 실전) =====

// --- Ch 1. Tree ---

LESSONS["t6-ch1-1"] = {
  trail: 6, ch: 1, no: 1, title: "트리",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "트리(Tree)는 사이클이 없는 연결 그래프입니다. 노드 수와 깊이(depth) 계산을 익힙니다." },
      { type: "code", text: "#include <stdio.h>\n\n// 인접 리스트를 배열로 구현\nint head[15], nxt[25], to[25], ecnt;\nvoid addEdge(int u, int v) { to[++ecnt]=v; nxt[ecnt]=head[u]; head[u]=ecnt; }\n\nint depth[15], visited[15];\nvoid dfs(int u, int d) {\n  visited[u]=1; depth[u]=d;\n  for (int e=head[u];e;e=nxt[e]) if (!visited[to[e]]) dfs(to[e], d+1);\n}\n\nint main() {\n  int n; scanf(\"%d\", &n);\n  for (int i=0;i<n-1;i++) {\n    int u, v; scanf(\"%d %d\", &u, &v);\n    addEdge(u,v); addEdge(v,u);\n  }\n  dfs(1, 0);\n  int mx=0;\n  for (int i=1;i<=n;i++) if (depth[i]>mx) mx=depth[i];\n  printf(\"%d\\n\", mx);\n  return 0;\n}" },
      { type: "h3",   text: "트리 기본 개념" },
      { type: "list", items: ["노드(Node)와 간선(Edge)으로 구성", "루트(Root): 최상위 노드", "깊이(Depth): 루트에서 해당 노드까지 간선 수", "N개 노드, N-1개 간선 — 사이클 없음"] },
      { type: "callout", text: "트리 순회는 DFS/BFS 모두 가능합니다. 인접 리스트를 head/nxt/to 배열로 표현하는 패턴을 익혀두세요." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch1-1-b1", title: "트리 최대 깊이", diff: "Easy", xp: 10, time: "3m",
        desc: "노드 수 n과 n-1개의 간선이 주어질 때, 루트를 1로 할 때 최대 깊이를 출력하세요. (첫 줄: n, 이후 n-1줄: u v)",
        example: { input: "5\n1 2\n1 3\n3 4\n3 5\n", output: "2" } },
    ],
    practice: [
      { id: "t6-ch1-1-p1", title: "트리 노드 수", diff: "Easy", xp: 10, time: "4m",
        desc: "루트 r이 주어진 트리에서 루트의 자식 노드 수를 출력하세요. (첫 줄: n r, 이후 n-1줄: u v)",
        example: { input: "5 1\n1 2\n1 3\n3 4\n3 5\n", output: "2" } },
    ],
  },
};

LESSONS["t6-ch1-2"] = {
  trail: 6, ch: 1, no: 2, title: "이진 트리와 탐색",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "이진 트리(Binary Tree)에서 전위/중위/후위 순회와 레벨 순회를 배웁니다." },
      { type: "code", text: "#include <stdio.h>\n\nint L[15], R[15]; // 왼쪽/오른쪽 자식\n\nvoid inorder(int u) {\n  if (!u) return;\n  inorder(L[u]);\n  printf(\"%d \", u);\n  inorder(R[u]);\n}\n\nint main() {\n  int n; scanf(\"%d\", &n);\n  for (int i=0;i<n;i++) {\n    int u, l, r; scanf(\"%d %d %d\", &u, &l, &r);\n    L[u]=l; R[u]=r;\n  }\n  inorder(1);\n  printf(\"\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "이진 트리 순회" },
      { type: "list", items: ["전위(preorder): root → left → right", "중위(inorder): left → root → right", "후위(postorder): left → right → root", "중위 순회 결과로 BST 정렬 확인 가능"] },
      { type: "callout", text: "이진 트리에서 L[u]=0, R[u]=0 이면 리프 노드입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch1-2-b1", title: "이진 트리 중위 순회", diff: "Easy", xp: 10, time: "3m",
        desc: "이진 트리 노드 n개가 주어질 때 루트 1에서 중위 순회 결과를 공백 구분으로 출력하세요. (첫 줄: n, 이후 n줄: u left right, 없으면 0)",
        example: { input: "3\n1 2 3\n2 0 0\n3 0 0\n", output: "2 1 3" } },
    ],
    practice: [
      { id: "t6-ch1-2-p1", title: "이진 트리 리프 수", diff: "Easy", xp: 10, time: "4m",
        desc: "이진 트리에서 리프 노드(자식 없는 노드)의 개수를 출력하세요. (첫 줄: n, 이후 n줄: u left right)",
        example: { input: "3\n1 2 3\n2 0 0\n3 0 0\n", output: "2" } },
    ],
  },
};

LESSONS["t6-ch1-3"] = {
  trail: 6, ch: 1, no: 3, title: "Tree DP",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "Tree DP는 트리 위에서 DP를 수행하는 기법입니다. 각 노드의 서브트리 합을 계산합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint head[15], nxt[25], to[25], ecnt;\nint val[15], dp[15], visited[15];\nvoid addEdge(int u, int v) { to[++ecnt]=v; nxt[ecnt]=head[u]; head[u]=ecnt; }\n\nvoid dfs(int u) {\n  visited[u]=1;\n  dp[u]=val[u];\n  for (int e=head[u];e;e=nxt[e]) {\n    int v=to[e];\n    if (!visited[v]) { dfs(v); dp[u]+=dp[v]; }\n  }\n}\n\nint main() {\n  int n; scanf(\"%d\", &n);\n  for (int i=1;i<=n;i++) scanf(\"%d\", &val[i]);\n  for (int i=0;i<n-1;i++) {\n    int u, v; scanf(\"%d %d\", &u, &v);\n    addEdge(u,v); addEdge(v,u);\n  }\n  dfs(1);\n  printf(\"%d\\n\", dp[1]);\n  return 0;\n}" },
      { type: "h3",   text: "Tree DP 원리" },
      { type: "list", items: ["dp[u] = val[u] + 자식들의 dp 합", "후위 순서(post-order)로 계산", "루트부터 DFS, 리프에서 값 올라옴", "서브트리 합, 최대 독립 집합 등 다양한 응용"] },
      { type: "callout", text: "Tree DP의 핵심: 자식 결과를 모두 구한 뒤 부모를 계산합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch1-3-b1", title: "서브트리 합", diff: "Easy", xp: 10, time: "3m",
        desc: "각 노드에 값이 있는 트리에서 루트의 서브트리 합(전체 합)을 출력하세요. (첫 줄: n, 둘째 줄: 노드 1~n의 값, 이후 n-1줄: u v)",
        example: { input: "4\n1 2 3 4\n1 2\n1 3\n3 4\n", output: "10" } },
    ],
    practice: [
      { id: "t6-ch1-3-p1", title: "최대 서브트리 합", diff: "Easy", xp: 10, time: "4m",
        desc: "각 노드의 서브트리 합 중 최댓값을 출력하세요. (첫 줄: n, 둘째 줄: 노드 값, 이후 n-1줄: u v)",
        example: { input: "4\n1 2 3 4\n1 2\n1 3\n3 4\n", output: "10" } },
    ],
  },
};

LESSONS["t6-ch1-4"] = {
  trail: 6, ch: 1, no: 4, title: "LCA",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "LCA(Lowest Common Ancestor)는 두 노드의 최소 공통 조상을 구하는 알고리즘입니다." },
      { type: "code", text: "#include <stdio.h>\n\nint head[15], nxt[25], to[25], ecnt;\nint depth[15], parent[15], visited[15];\nvoid addEdge(int u, int v) { to[++ecnt]=v; nxt[ecnt]=head[u]; head[u]=ecnt; }\n\nvoid dfs(int u, int p, int d) {\n  visited[u]=1; parent[u]=p; depth[u]=d;\n  for (int e=head[u];e;e=nxt[e]) if (!visited[to[e]]) dfs(to[e],u,d+1);\n}\n\nint lca(int a, int b) {\n  while (depth[a]>depth[b]) a=parent[a];\n  while (depth[b]>depth[a]) b=parent[b];\n  while (a!=b) { a=parent[a]; b=parent[b]; }\n  return a;\n}\n\nint main() {\n  int n; scanf(\"%d\", &n);\n  for (int i=0;i<n-1;i++) {\n    int u,v; scanf(\"%d %d\",&u,&v);\n    addEdge(u,v); addEdge(v,u);\n  }\n  dfs(1,1,0);\n  int a,b; scanf(\"%d %d\",&a,&b);\n  printf(\"%d\\n\", lca(a,b));\n  return 0;\n}" },
      { type: "h3",   text: "LCA 알고리즘" },
      { type: "list", items: ["DFS로 depth와 parent 배열 초기화", "두 노드의 깊이를 맞춤 (더 깊은 쪽을 올림)", "같은 깊이에서 동시에 위로 올라가며 만나는 노드가 LCA", "O(N) 전처리, O(N) 쿼리 — sparse table로 O(log N) 가능"] },
      { type: "callout", text: "소규모 트리(N≤1000)에서는 선형 LCA로도 충분합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch1-4-b1", title: "LCA 찾기", diff: "Easy", xp: 10, time: "4m",
        desc: "트리가 주어지고 두 노드 a, b의 LCA를 출력하세요. (첫 줄: n, 이후 n-1줄: u v, 마지막 줄: a b)",
        example: { input: "5\n1 2\n1 3\n3 4\n3 5\n4 5\n", output: "3" } },
    ],
    practice: [
      { id: "t6-ch1-4-p1", title: "LCA 깊이", diff: "Easy", xp: 10, time: "4m",
        desc: "두 노드의 LCA 깊이(루트=0)를 출력하세요. (첫 줄: n, 이후 n-1줄: u v, 마지막 줄: a b)",
        example: { input: "5\n1 2\n1 3\n3 4\n3 5\n4 5\n", output: "1" } },
    ],
  },
};

// --- Ch 2. MST ---

LESSONS["t6-ch2-1"] = {
  trail: 6, ch: 2, no: 1, title: "Disjoint Set (Union Find)",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "Union-Find(Disjoint Set) 자료구조로 집합 합치기와 같은 집합 여부 판별을 O(α(N))에 수행합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint par[15];\nint find(int x) { return par[x]==x ? x : (par[x]=find(par[x])); }\nvoid unite(int a, int b) { par[find(a)]=find(b); }\n\nint main() {\n  int n, m; scanf(\"%d %d\", &n, &m);\n  for (int i=1;i<=n;i++) par[i]=i;\n  while (m--) {\n    int u, v; scanf(\"%d %d\", &u, &v);\n    unite(u, v);\n  }\n  int cnt=0;\n  for (int i=1;i<=n;i++) if (find(i)==i) cnt++;\n  printf(\"%d\\n\", cnt);\n  return 0;\n}" },
      { type: "h3",   text: "Union-Find 원리" },
      { type: "list", items: ["find: 경로 압축(path compression)으로 루트 찾기", "union: 두 집합의 루트를 연결", "컴포넌트 수 = find(i)==i 인 i의 개수", "크루스칼 MST, 사이클 감지에 필수"] },
      { type: "callout", text: "경로 압축(par[x]=find(par[x]))이 핵심 최적화입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch2-1-b1", title: "컴포넌트 수", diff: "Easy", xp: 10, time: "3m",
        desc: "n개 노드, m개 간선이 주어질 때 연결 컴포넌트 수를 출력하세요. (첫 줄: n m, 이후 m줄: u v)",
        example: { input: "5 2\n1 2\n3 4\n", output: "3" } },
    ],
    practice: [
      { id: "t6-ch2-1-p1", title: "같은 집합 판별", diff: "Easy", xp: 10, time: "4m",
        desc: "union 연산 후 두 노드 a, b가 같은 집합인지 yes/no로 출력하세요. (첫 줄: n m, 이후 m줄: u v, 마지막 줄: a b)",
        example: { input: "5 2\n1 2\n3 4\n1 3\n", output: "no" } },
    ],
  },
};

LESSONS["t6-ch2-2"] = {
  trail: 6, ch: 2, no: 2, title: "Kruskal",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "Kruskal 알고리즘으로 최소 신장 트리(MST)의 총 가중치를 구합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <stdlib.h>\n\nint par[15];\nint find(int x) { return par[x]==x ? x : (par[x]=find(par[x])); }\nvoid unite(int a, int b) { par[find(a)]=find(b); }\n\ntypedef struct { int u,v,w; } Edge;\nEdge edges[50];\nint cmp(const void*a,const void*b) { return ((Edge*)a)->w - ((Edge*)b)->w; }\n\nint main() {\n  int n, m; scanf(\"%d %d\", &n, &m);\n  for (int i=1;i<=n;i++) par[i]=i;\n  for (int i=0;i<m;i++) scanf(\"%d %d %d\",&edges[i].u,&edges[i].v,&edges[i].w);\n  qsort(edges,m,sizeof(Edge),cmp);\n  int total=0;\n  for (int i=0;i<m;i++) {\n    if (find(edges[i].u)!=find(edges[i].v)) {\n      unite(edges[i].u,edges[i].v);\n      total+=edges[i].w;\n    }\n  }\n  printf(\"%d\\n\", total);\n  return 0;\n}" },
      { type: "h3",   text: "Kruskal 알고리즘" },
      { type: "list", items: ["간선을 가중치 오름차순 정렬", "Union-Find로 사이클 여부 확인", "사이클 없으면 MST에 포함, 가중치 합산", "N-1개 간선 선택 시 MST 완성"] },
      { type: "callout", text: "Kruskal은 간선 수 E가 적을 때 유리합니다. O(E log E)." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch2-2-b1", title: "MST 가중치 합", diff: "Easy", xp: 10, time: "4m",
        desc: "n개 노드 m개 간선 그래프에서 MST의 가중치 합을 출력하세요. (첫 줄: n m, 이후 m줄: u v w)",
        example: { input: "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 2\n", output: "5" } },
    ],
    practice: [
      { id: "t6-ch2-2-p1", title: "MST 간선 수", diff: "Easy", xp: 10, time: "4m",
        desc: "MST에 포함된 간선의 수를 출력하세요. (첫 줄: n m, 이후 m줄: u v w)",
        example: { input: "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 2\n", output: "3" } },
    ],
  },
};

LESSONS["t6-ch2-3"] = {
  trail: 6, ch: 2, no: 3, title: "Prim",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "Prim 알고리즘으로 최소 신장 트리를 구합니다. 노드 기반으로 MST를 확장합니다." },
      { type: "code", text: "#include <stdio.h>\n\n#define INF 1000000\nint dist[10], inMST[10];\nint graph[10][10];\n\nint main() {\n  int n; scanf(\"%d\", &n);\n  for (int i=1;i<=n;i++) for (int j=1;j<=n;j++) graph[i][j]=INF;\n  int m; scanf(\"%d\", &m);\n  while (m--) {\n    int u,v,w; scanf(\"%d %d %d\",&u,&v,&w);\n    if (w<graph[u][v]) { graph[u][v]=w; graph[v][u]=w; }\n  }\n  for (int i=1;i<=n;i++) dist[i]=INF;\n  dist[1]=0;\n  int total=0;\n  for (int iter=0;iter<n;iter++) {\n    int u=-1;\n    for (int i=1;i<=n;i++) if (!inMST[i]&&(u==-1||dist[i]<dist[u])) u=i;\n    inMST[u]=1; total+=dist[u];\n    for (int v=1;v<=n;v++) if (!inMST[v]&&graph[u][v]<dist[v]) dist[v]=graph[u][v];\n  }\n  printf(\"%d\\n\", total);\n  return 0;\n}" },
      { type: "h3",   text: "Prim 알고리즘" },
      { type: "list", items: ["시작 노드 dist=0, 나머지 INF", "MST에 포함 안 된 노드 중 dist 최솟값 선택", "선택된 노드의 인접 노드 dist 갱신", "모든 노드 포함 시 종료 — O(V²), 우선순위 큐로 O(E log V)"] },
      { type: "callout", text: "Prim은 간선 수 E가 많을 때(밀집 그래프) Kruskal보다 유리합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch2-3-b1", title: "Prim MST 가중치", diff: "Easy", xp: 10, time: "4m",
        desc: "n개 노드 m개 간선 그래프에서 Prim으로 MST 가중치 합을 출력하세요. (첫 줄: n m, 이후 m줄: u v w)",
        example: { input: "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 2\n", output: "5" } },
    ],
    practice: [
      { id: "t6-ch2-3-p1", title: "Prim 최대 간선 가중치", diff: "Easy", xp: 10, time: "4m",
        desc: "MST에 포함된 간선 가중치 중 최댓값을 출력하세요. (첫 줄: n m, 이후 m줄: u v w)",
        example: { input: "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 2\n", output: "2" } },
    ],
  },
};

// --- Ch 3. 위상정렬 ---

LESSONS["t6-ch3-1"] = {
  trail: 6, ch: 3, no: 1, title: "Topological Sort",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "위상 정렬(Topological Sort)은 DAG에서 의존 관계를 만족하는 순서를 구합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint head[10], nxt[20], to[20], ecnt;\nint indeg[10];\nvoid addEdge(int u, int v) { to[++ecnt]=v; nxt[ecnt]=head[u]; head[u]=ecnt; indeg[v]++; }\n\nint queue[10], qf, qb;\n\nint main() {\n  int n, m; scanf(\"%d %d\", &n, &m);\n  for (int i=0;i<m;i++) {\n    int u,v; scanf(\"%d %d\",&u,&v);\n    addEdge(u,v);\n  }\n  for (int i=1;i<=n;i++) if (!indeg[i]) queue[qb++]=i;\n  while (qf<qb) {\n    int u=queue[qf++];\n    printf(\"%d \", u);\n    for (int e=head[u];e;e=nxt[e]) {\n      indeg[to[e]]--;\n      if (!indeg[to[e]]) queue[qb++]=to[e];\n    }\n  }\n  printf(\"\\n\");\n  return 0;\n}" },
      { type: "h3",   text: "위상 정렬 원리 (Kahn's algorithm)" },
      { type: "list", items: ["진입 차수(in-degree) 0인 노드를 큐에 넣기", "큐에서 꺼내 출력 → 인접 노드의 진입 차수 감소", "진입 차수 0이 된 노드를 큐에 추가", "큐가 빌 때까지 반복 — 사이클 있으면 일부 노드 미출력"] },
      { type: "callout", text: "위상 정렬은 DAG(Directed Acyclic Graph)에서만 유효합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch3-1-b1", title: "위상 정렬 순서", diff: "Easy", xp: 10, time: "4m",
        desc: "DAG의 위상 정렬 결과를 공백 구분으로 출력하세요. 진입 차수 0인 노드가 여러 개면 번호 오름차순. (첫 줄: n m, 이후 m줄: u v — u→v 방향)",
        example: { input: "4 3\n1 2\n1 3\n2 4\n", output: "1 2 3 4" } },
    ],
    practice: [
      { id: "t6-ch3-1-p1", title: "위상 정렬 마지막 노드", diff: "Easy", xp: 10, time: "4m",
        desc: "위상 정렬에서 마지막으로 출력되는 노드 번호를 출력하세요. (첫 줄: n m, 이후 m줄: u v)",
        example: { input: "4 3\n1 2\n1 3\n2 4\n", output: "4" } },
    ],
  },
};

LESSONS["t6-ch3-2"] = {
  trail: 6, ch: 3, no: 2, title: "Graph DP",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "DAG 위에서 DP를 수행해 최장 경로 길이를 구합니다." },
      { type: "code", text: "#include <stdio.h>\n\nint head[10], nxt[20], to[20], ecnt;\nint dp[10], visited[10];\nvoid addEdge(int u, int v) { to[++ecnt]=v; nxt[ecnt]=head[u]; head[u]=ecnt; }\n\nint dfs(int u) {\n  if (visited[u]) return dp[u];\n  visited[u]=1; dp[u]=0;\n  for (int e=head[u];e;e=nxt[e]) {\n    int v=to[e];\n    int cand=dfs(v)+1;\n    if (cand>dp[u]) dp[u]=cand;\n  }\n  return dp[u];\n}\n\nint main() {\n  int n, m; scanf(\"%d %d\", &n, &m);\n  for (int i=0;i<m;i++) {\n    int u,v; scanf(\"%d %d\",&u,&v);\n    addEdge(u,v);\n  }\n  int ans=0;\n  for (int i=1;i<=n;i++) { int r=dfs(i); if (r>ans) ans=r; }\n  printf(\"%d\\n\", ans);\n  return 0;\n}" },
      { type: "h3",   text: "Graph DP 원리" },
      { type: "list", items: ["dp[u] = u에서 출발하는 최장 경로 길이", "메모이제이션으로 중복 계산 방지", "위상 정렬 순서로 계산해도 동일", "DAG에서만 유효 — 사이클이 있으면 무한 루프"] },
      { type: "callout", text: "Graph DP = DAG 최장 경로 = 위상 정렬 + DP의 조합입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch3-2-b1", title: "DAG 최장 경로", diff: "Easy", xp: 10, time: "4m",
        desc: "DAG에서 어느 노드에서 출발해도 되는 최장 경로 길이(간선 수)를 출력하세요. (첫 줄: n m, 이후 m줄: u v — u→v)",
        example: { input: "4 3\n1 2\n2 3\n2 4\n", output: "2" } },
    ],
    practice: [
      { id: "t6-ch3-2-p1", title: "DAG 최장 경로 노드", diff: "Easy", xp: 10, time: "5m",
        desc: "최장 경로를 시작하는 노드 번호를 출력하세요. 동점이면 가장 작은 번호. (첫 줄: n m, 이후 m줄: u v)",
        example: { input: "4 3\n1 2\n2 3\n2 4\n", output: "1" } },
    ],
  },
};

// --- Ch 4. String ---

LESSONS["t6-ch4-1"] = {
  trail: 6, ch: 4, no: 1, title: "문자열 매칭 기본",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "문자열 T 안에서 패턴 P가 몇 번 등장하는지 브루트 포스로 찾습니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n  char T[105], P[55];\n  scanf(\"%s %s\", T, P);\n  int n=strlen(T), m=strlen(P), cnt=0;\n  for (int i=0;i<=n-m;i++) {\n    int ok=1;\n    for (int j=0;j<m;j++) if (T[i+j]!=P[j]) { ok=0; break; }\n    if (ok) cnt++;\n  }\n  printf(\"%d\\n\", cnt);\n  return 0;\n}" },
      { type: "h3",   text: "브루트 포스 문자열 매칭" },
      { type: "list", items: ["T의 각 위치에서 P와 비교", "O(NM) 시간 복잡도", "짧은 패턴에는 충분히 빠름", "긴 텍스트+긴 패턴은 KMP/Boyer-Moore 필요"] },
      { type: "callout", text: "C의 strstr() 함수로 첫 번째 등장 위치를 찾을 수 있지만, 개수를 세려면 직접 루프가 필요합니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch4-1-b1", title: "패턴 등장 횟수", diff: "Easy", xp: 10, time: "3m",
        desc: "텍스트 T와 패턴 P가 주어질 때 T에서 P가 등장하는 횟수를 출력하세요. (첫 줄: T, 둘째 줄: P)",
        example: { input: "abababab\nab\n", output: "4" } },
    ],
    practice: [
      { id: "t6-ch4-1-p1", title: "패턴 첫 위치", diff: "Easy", xp: 10, time: "3m",
        desc: "T에서 P가 처음 등장하는 0-based 인덱스를 출력하세요. 없으면 -1. (첫 줄: T, 둘째 줄: P)",
        example: { input: "abababab\naba\n", output: "0" } },
    ],
  },
};

LESSONS["t6-ch4-2"] = {
  trail: 6, ch: 4, no: 2, title: "KMP",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "KMP 알고리즘으로 O(N+M)에 문자열 매칭을 수행합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\n\nvoid buildPi(const char*P, int m, int*pi) {\n  pi[0]=0; int k=0;\n  for (int i=1;i<m;i++) {\n    while (k>0&&P[i]!=P[k]) k=pi[k-1];\n    if (P[i]==P[k]) k++;\n    pi[i]=k;\n  }\n}\n\nint kmp(const char*T, const char*P) {\n  int n=strlen(T), m=strlen(P);\n  int pi[55]; buildPi(P,m,pi);\n  int cnt=0, k=0;\n  for (int i=0;i<n;i++) {\n    while (k>0&&T[i]!=P[k]) k=pi[k-1];\n    if (T[i]==P[k]) k++;\n    if (k==m) { cnt++; k=pi[k-1]; }\n  }\n  return cnt;\n}\n\nint main() {\n  char T[105], P[55];\n  scanf(\"%s %s\", T, P);\n  printf(\"%d\\n\", kmp(T,P));\n  return 0;\n}" },
      { type: "h3",   text: "KMP 원리" },
      { type: "list", items: ["실패 함수(pi 배열): P의 접두사이면서 접미사인 최대 길이", "불일치 시 pi로 점프 — 비교 위치 재설정 O(1)", "전체 O(N+M)", "DNA 서열 검색, 로그 패턴 매칭 등에 활용"] },
      { type: "callout", text: "KMP의 핵심은 실패 함수(failure function / pi 배열) 구축입니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch4-2-b1", title: "KMP 패턴 횟수", diff: "Easy", xp: 10, time: "4m",
        desc: "KMP로 T에서 P 등장 횟수를 출력하세요. (첫 줄: T, 둘째 줄: P)",
        example: { input: "aabaab\naab\n", output: "2" } },
    ],
    practice: [
      { id: "t6-ch4-2-p1", title: "pi 배열 값", diff: "Easy", xp: 10, time: "4m",
        desc: "패턴 P의 마지막 원소의 pi 값(실패 함수 값)을 출력하세요. (단 한 줄: P)",
        example: { input: "aabaab\n", output: "3" } },
    ],
  },
};

LESSONS["t6-ch4-3"] = {
  trail: 6, ch: 4, no: 3, title: "Trie",
  concept: {
    sections: [
      { type: "h",    text: "강의 목표" },
      { type: "p",    text: "Trie(트라이) 자료구조로 문자열 집합에서 O(L) 삽입/검색을 구현합니다." },
      { type: "code", text: "#include <stdio.h>\n#include <string.h>\n\ntypedef struct {\n  int child[26];\n  int end;\n} Node;\n\nNode trie[500]; int tcnt=1;\n\nvoid insert(const char*s) {\n  int cur=0;\n  for (int i=0;s[i];i++) {\n    int c=s[i]-'a';\n    if (!trie[cur].child[c]) trie[cur].child[c]=tcnt++;\n    cur=trie[cur].child[c];\n  }\n  trie[cur].end=1;\n}\n\nint search(const char*s) {\n  int cur=0;\n  for (int i=0;s[i];i++) {\n    int c=s[i]-'a';\n    if (!trie[cur].child[c]) return 0;\n    cur=trie[cur].child[c];\n  }\n  return trie[cur].end;\n}\n\nint main() {\n  int n; scanf(\"%d\",&n);\n  char w[55];\n  while (n--) { scanf(\"%s\",w); insert(w); }\n  int q; scanf(\"%d\",&q);\n  while (q--) {\n    scanf(\"%s\",w);\n    printf(\"%s\\n\", search(w)?\"yes\":\"no\");\n  }\n  return 0;\n}" },
      { type: "h3",   text: "Trie 구조" },
      { type: "list", items: ["각 노드 = 알파벳 26개 자식 포인터 + 단어 끝 표시", "삽입: 문자 하나씩 자식으로 이동, 없으면 생성", "검색: 경로 따라가다 end 플래그 확인", "공간 O(총 글자 수 × 26), 시간 O(L)"] },
      { type: "callout", text: "Trie는 자동완성, 사전 검색, IP 라우팅 등에 폭넓게 활용됩니다." },
    ],
  },
  problems: {
    basic: [
      { id: "t6-ch4-3-b1", title: "Trie 검색", diff: "Easy", xp: 10, time: "4m",
        desc: "단어 n개를 Trie에 삽입 후 쿼리 q개를 검색해 yes/no를 각 줄에 출력하세요. (첫 줄: n, 이후 n줄: 단어, 다음 줄: q, 이후 q줄: 검색어)",
        example: { input: "3\napple\napp\nban\n2\napp\ncat\n", output: "yes\nno" } },
    ],
    practice: [
      { id: "t6-ch4-3-p1", title: "Trie 접두사 개수", diff: "Easy", xp: 10, time: "5m",
        desc: "단어 n개를 삽입 후 쿼리 문자열을 접두사로 가지는 단어 수를 출력하세요. (첫 줄: n, 이후 n줄: 단어, 마지막 줄: 쿼리)",
        example: { input: "3\napple\napp\nban\nap\n", output: "2" } },
    ],
  },
};

// === END Trail 6 ===

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
