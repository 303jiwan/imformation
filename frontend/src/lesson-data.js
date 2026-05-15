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
