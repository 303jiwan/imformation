/* =====================================================================
   Hardcoded problem pool for the C-language coding test.

   Three difficulty tiers, gated by the survey "level" answer
   (sessionStorage `survey.level`):
     - "easy"   : single integer A on stdin. JS reference `expected(A)`
                  returns the canonical stdout. Used by all skill levels.
     - "medium" : multi-line stdin parsed as named inputs (A, B, X, Y, ...).
                  JS reference `expected({ A, B, ... })` returns canonical
                  output. Unlocked when survey level == "intermediate" or
                  "advanced".
     - "killer" : long simulation/algorithm problem. Inputs are too big to
                  parameterize, so each killer ships with a hardcoded
                  `testCases: [{ input, expected }, ...]` array used both
                  for case display and for grading. Unlocked only at
                  "advanced".

   Problems without a `difficulty` field default to "easy" — the legacy
   105 problems below predate the difficulty field, so the helpers treat
   missing `difficulty` as easy without bulk-rewriting each entry.

   When a real backend (gcc sandbox) is wired in, this module is the only
   place that needs to change — the page logic uses it as the source of
   truth for both per-case verdicts and "제출 및 채점" full-range checks.
   ===================================================================== */

export const TOTAL_PROBLEMS = 5;
export const TIME_PER_PROBLEM_MS = 10 * 60 * 1000;

/** Maps survey Q2 level → allowed difficulties. */
export const LEVEL_TO_DIFFICULTIES = {
  none:         ["easy"],
  basic:        ["easy"],
  intermediate: ["easy", "medium"],
  advanced:     ["easy", "medium", "killer"],
};

/** Pull the saved survey level out of sessionStorage. Returns "none" when missing. */
function readSurveyLevel() {
  try {
    const raw = sessionStorage.getItem("survey");
    if (!raw) return "none";
    const data = JSON.parse(raw);
    return typeof data?.level === "string" ? data.level : "none";
  } catch (_) {
    return "none";
  }
}

/** Returns the array of allowed difficulties for the current survey level. */
export function allowedDifficulties() {
  return LEVEL_TO_DIFFICULTIES[readSurveyLevel()] ?? ["easy"];
}

/** Returns the difficulty of a problem, defaulting to "easy" for legacy entries. */
export function problemDifficulty(problem) {
  return problem?.difficulty ?? "easy";
}

const STARTER = (todo) =>
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);

    // TODO: ${todo}

    return 0;
}
`;

export const PROBLEMS = [
  {
    id: 1,
    tag: "기초 · 산술",
    title: "두 수의 합",
    description:
      "정수 <code>A</code>가 입력으로 주어집니다. <code>A</code>와 <code>A + 1</code>의 합을 한 줄에 출력하는 프로그램을 작성하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "첫 줄에 <code>A + (A + 1)</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 10"],
    examples: [
      { input: "3", output: "7" },
      { input: "5", output: "11" },
    ],
    aMin: 1,
    aMax: 10,
    aDefault: 3,
    concepts: ["vars", "io", "operators"],
    starter: STARTER("A와 A+1의 합을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", A + (A + 1));
    return 0;
}
`,
    expected: (A) => String(A + (A + 1)),
  },
  {
    id: 2,
    tag: "기초 · 조건문",
    title: "짝수 / 홀수 판정",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>가 짝수면 <code>even</code>, 홀수면 <code>odd</code>를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>가 짝수면 <code>even</code>, 홀수면 <code>odd</code>를 출력합니다.",
    constraints: ["1 ≤ A ≤ 20"],
    examples: [
      { input: "4", output: "even" },
      { input: "7", output: "odd" },
    ],
    aMin: 1,
    aMax: 20,
    aDefault: 4,
    concepts: ["cond", "operators", "io"],
    starter: STARTER("짝수면 even, 홀수면 odd를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    if (A % 2 == 0) printf("even\\n");
    else            printf("odd\\n");
    return 0;
}
`,
    expected: (A) => (A % 2 === 0 ? "even" : "odd"),
  },
  {
    id: 3,
    tag: "기본 · 반복문",
    title: "1부터 A까지의 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>1</code>부터 <code>A</code>까지 모든 정수의 합을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>1 + 2 + ... + A</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "15" },
      { input: "10", output: "55" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["loops", "operators", "io"],
    starter: STARTER("1부터 A까지의 합을 출력하세요 (반복문 사용)"),
    solution:
`#include <stdio.h>

int main(void) {
    int A, sum = 0;
    scanf("%d", &A);
    for (int i = 1; i <= A; i++) sum += i;
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) => String((A * (A + 1)) / 2),
  },
  {
    id: 4,
    tag: "기본 · 자릿수",
    title: "자연수 A의 자릿수",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>가 몇 자리 수인지 출력하세요. " +
      "예를 들어 <code>A = 1234</code>면 <code>4</code>를 출력합니다.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 자릿수 개수를 출력합니다.",
    constraints: ["1 ≤ A ≤ 10000"],
    examples: [
      { input: "987", output: "3" },
      { input: "1234", output: "4" },
    ],
    aMin: 1,
    aMax: 10000,
    aDefault: 987,
    concepts: ["loops", "operators", "cond"],
    starter: STARTER("A의 자릿수 개수를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A, digits = 0;
    scanf("%d", &A);
    while (A > 0) { digits++; A /= 10; }
    printf("%d\\n", digits);
    return 0;
}
`,
    expected: (A) => String(String(A).length),
  },
  {
    id: 5,
    tag: "응용 · 약수",
    title: "약수의 개수",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>의 양의 약수의 개수를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 약수의 개수를 출력합니다.",
    constraints: ["1 ≤ A ≤ 50"],
    examples: [
      { input: "12", output: "6" },
      { input: "7", output: "2" },
    ],
    aMin: 1,
    aMax: 50,
    aDefault: 12,
    concepts: ["loops", "cond", "operators"],
    starter: STARTER("A의 약수 개수를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A, count = 0;
    scanf("%d", &A);
    for (int i = 1; i <= A; i++) {
        if (A % i == 0) count++;
    }
    printf("%d\\n", count);
    return 0;
}
`,
    expected: (A) => {
      let count = 0;
      for (let i = 1; i <= A; i++) if (A % i === 0) count++;
      return String(count);
    },
  },
  {
    id: 6,
    tag: "응용 · 재귀",
    title: "팩토리얼 A!",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A! = 1 × 2 × ... × A</code>의 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A!</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 10"],
    examples: [
      { input: "3", output: "6" },
      { input: "5", output: "120" },
    ],
    aMin: 1,
    aMax: 10,
    aDefault: 5,
    concepts: ["recursion", "functions", "io"],
    starter: STARTER("A 팩토리얼을 출력하세요 (재귀 함수 권장)"),
    solution:
`#include <stdio.h>

long long fact(int n) {
    if (n <= 1) return 1;
    return (long long)n * fact(n - 1);
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%lld\\n", fact(A));
    return 0;
}
`,
    expected: (A) => {
      let f = 1;
      for (let i = 2; i <= A; i++) f *= i;
      return String(f);
    },
  },
  {
    id: 7,
    tag: "응용 · 재귀",
    title: "피보나치 수 fib(A)",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>fib(1) = 1</code>, <code>fib(2) = 1</code>이고 " +
      "<code>fib(n) = fib(n-1) + fib(n-2)</code>로 정의되는 수열의 <code>A</code>번째 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>fib(A)</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 30"],
    examples: [
      { input: "1", output: "1" },
      { input: "10", output: "55" },
    ],
    aMin: 1,
    aMax: 30,
    aDefault: 10,
    concepts: ["recursion", "functions", "loops"],
    starter: STARTER("피보나치 수 fib(A)를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    long long a = 1, b = 1;
    for (int i = 3; i <= A; i++) { long long c = a + b; a = b; b = c; }
    printf("%lld\\n", b);
    return 0;
}
`,
    expected: (A) => {
      let a = 1, b = 1;
      for (let i = 3; i <= A; i++) { const c = a + b; a = b; b = c; }
      return String(b);
    },
  },
  {
    id: 8,
    tag: "기본 · 문자열",
    title: "별 A개 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>'*'</code> 문자를 <code>A</code>개 한 줄에 이어서 출력하세요. " +
      "예를 들어 <code>A = 4</code>면 <code>****</code>를 출력합니다.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>'*'</code>를 <code>A</code>개 출력합니다.",
    constraints: ["1 ≤ A ≤ 50"],
    examples: [
      { input: "3", output: "***" },
      { input: "7", output: "*******" },
    ],
    aMin: 1,
    aMax: 50,
    aDefault: 5,
    concepts: ["loops", "strings", "io"],
    starter: STARTER("별 A개를 한 줄에 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 0; i < A; i++) printf("*");
    printf("\\n");
    return 0;
}
`,
    expected: (A) => "*".repeat(A),
  },
  {
    id: 9,
    tag: "응용 · 소수",
    title: "소수 판정",
    description:
      "<code>2</code> 이상의 정수 <code>A</code>가 주어집니다. " +
      "<code>A</code>가 소수면 <code>prime</code>, 아니면 <code>not prime</code>을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>가 소수면 <code>prime</code>, 아니면 <code>not prime</code>을 출력합니다.",
    constraints: ["2 ≤ A ≤ 100"],
    examples: [
      { input: "7", output: "prime" },
      { input: "12", output: "not prime" },
    ],
    aMin: 2,
    aMax: 100,
    aDefault: 7,
    concepts: ["loops", "cond", "operators"],
    starter: STARTER("A가 소수면 prime, 아니면 not prime을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int isPrime = (A >= 2);
    for (int i = 2; i * i <= A; i++) {
        if (A % i == 0) { isPrime = 0; break; }
    }
    printf("%s\\n", isPrime ? "prime" : "not prime");
    return 0;
}
`,
    expected: (A) => {
      if (A < 2) return "not prime";
      for (let i = 2; i * i <= A; i++) if (A % i === 0) return "not prime";
      return "prime";
    },
  },
  {
    id: 10,
    tag: "기초 · 산술",
    title: "A의 세제곱",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A의 세제곱(A × A × A)</code>을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A × A × A</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "2", output: "8" },
      { input: "5", output: "125" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["vars", "operators", "io"],
    starter: STARTER("A의 세제곱을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", A * A * A);
    return 0;
}
`,
    expected: (A) => String(A * A * A),
  },
  {
    id: 11,
    tag: "기본 · 문자열",
    title: "알파벳 A개 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>'a'</code>부터 시작해 알파벳 <code>A</code>개를 한 줄에 이어서 출력하세요. " +
      "예) <code>A = 3</code> → <code>abc</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>'a'</code>부터 <code>A</code>개의 알파벳을 출력합니다.",
    constraints: ["1 ≤ A ≤ 26"],
    examples: [
      { input: "3", output: "abc" },
      { input: "5", output: "abcde" },
    ],
    aMin: 1,
    aMax: 26,
    aDefault: 5,
    concepts: ["loops", "strings", "vars", "io"],
    starter: STARTER("'a'부터 A개의 알파벳을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 0; i < A; i++) printf("%c", 'a' + i);
    printf("\\n");
    return 0;
}
`,
    expected: (A) => "abcdefghijklmnopqrstuvwxyz".slice(0, A),
  },
  {
    id: 12,
    tag: "기본 · 문자열",
    title: "Hello를 A번 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 문자열 <code>Hello</code>를 한 줄에 <code>A</code>번 이어서 출력하세요. " +
      "예) <code>A = 2</code> → <code>HelloHello</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>Hello</code>를 <code>A</code>번 이어서 출력합니다.",
    constraints: ["1 ≤ A ≤ 10"],
    examples: [
      { input: "2", output: "HelloHello" },
      { input: "3", output: "HelloHelloHello" },
    ],
    aMin: 1,
    aMax: 10,
    aDefault: 3,
    concepts: ["loops", "strings", "functions", "io"],
    starter: STARTER("Hello를 A번 이어서 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 0; i < A; i++) printf("Hello");
    printf("\\n");
    return 0;
}
`,
    expected: (A) => "Hello".repeat(A),
  },
  {
    id: 13,
    tag: "응용 · 자릿수",
    title: "A의 자릿수 거꾸로 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>의 각 자릿수를 거꾸로 한 줄에 출력하세요. " +
      "예) <code>A = 1234</code> → <code>4321</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 자릿수를 끝자리부터 차례로 출력합니다.",
    constraints: ["10 ≤ A ≤ 99999"],
    examples: [
      { input: "1234", output: "4321" },
      { input: "98", output: "89" },
    ],
    aMin: 10,
    aMax: 99999,
    aDefault: 1234,
    concepts: ["loops", "strings", "operators", "vars"],
    starter: STARTER("A의 자릿수를 거꾸로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    while (A > 0) {
        printf("%d", A % 10);
        A /= 10;
    }
    printf("\\n");
    return 0;
}
`,
    expected: (A) => String(A).split("").reverse().join(""),
  },
  {
    id: 14,
    tag: "응용 · 재귀",
    title: "1부터 A까지 합 (재귀)",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>1 + 2 + ... + A</code>의 값을 " +
      "<strong>재귀 함수</strong>로 계산해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>1</code>부터 <code>A</code>까지의 합을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "15" },
      { input: "10", output: "55" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["recursion", "functions", "operators"],
    starter: STARTER("재귀 함수로 1부터 A까지의 합을 출력하세요"),
    solution:
`#include <stdio.h>

int sum(int n) {
    if (n <= 0) return 0;
    return n + sum(n - 1);
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", sum(A));
    return 0;
}
`,
    expected: (A) => String((A * (A + 1)) / 2),
  },
  {
    id: 15,
    tag: "응용 · 재귀",
    title: "2의 A제곱 (재귀)",
    description:
      "<code>0</code> 이상의 정수 <code>A</code>가 주어집니다. <code>2의 A제곱(2^A)</code>을 " +
      "<strong>재귀 함수</strong>로 계산해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>2^A</code>의 값을 출력합니다.",
    constraints: ["0 ≤ A ≤ 30"],
    examples: [
      { input: "0", output: "1" },
      { input: "10", output: "1024" },
    ],
    aMin: 0,
    aMax: 30,
    aDefault: 10,
    concepts: ["recursion", "functions", "operators"],
    starter: STARTER("재귀 함수로 2^A를 출력하세요"),
    solution:
`#include <stdio.h>

long long power(int n) {
    if (n == 0) return 1;
    return 2LL * power(n - 1);
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%lld\\n", power(A));
    return 0;
}
`,
    expected: (A) => String(2 ** A),
  },
  {
    id: 16,
    tag: "응용 · 재귀",
    title: "하노이 탑 최소 이동 횟수",
    description:
      "원판 <code>A</code>개로 하노이 탑 문제를 풀 때 필요한 최소 이동 횟수 <code>2^A − 1</code>을 출력하세요. " +
      "<strong>재귀 함수</strong>로 풀어보세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "최소 이동 횟수를 출력합니다.",
    constraints: ["1 ≤ A ≤ 25"],
    examples: [
      { input: "1", output: "1" },
      { input: "5", output: "31" },
    ],
    aMin: 1,
    aMax: 25,
    aDefault: 5,
    concepts: ["recursion", "functions", "operators"],
    starter: STARTER("재귀로 하노이 탑 최소 이동 횟수를 출력하세요"),
    solution:
`#include <stdio.h>

long long hanoi(int n) {
    if (n == 1) return 1;
    return 2 * hanoi(n - 1) + 1;
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%lld\\n", hanoi(A));
    return 0;
}
`,
    expected: (A) => String(2 ** A - 1),
  },
  {
    id: 17,
    tag: "기본 · 문자열",
    title: "Z부터 A개 알파벳 거꾸로",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>'Z'</code>부터 알파벳을 거꾸로 <code>A</code>개 한 줄에 출력하세요. " +
      "예) <code>A = 3</code> → <code>ZYX</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>'Z'</code>부터 <code>A</code>개의 알파벳을 거꾸로 출력합니다.",
    constraints: ["1 ≤ A ≤ 26"],
    examples: [
      { input: "3", output: "ZYX" },
      { input: "5", output: "ZYXWV" },
    ],
    aMin: 1,
    aMax: 26,
    aDefault: 5,
    concepts: ["loops", "strings", "vars", "io"],
    starter: STARTER("'Z'부터 A개의 알파벳을 거꾸로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 0; i < A; i++) printf("%c", 'Z' - i);
    printf("\\n");
    return 0;
}
`,
    expected: (A) => "ZYXWVUTSRQPONMLKJIHGFEDCBA".slice(0, A),
  },
  {
    id: 18,
    tag: "응용 · 진수 변환",
    title: "A를 2진수로 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>를 2진수 표현으로 한 줄에 출력하세요. " +
      "예) <code>A = 10</code> → <code>1010</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 2진수 표현을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1023"],
    examples: [
      { input: "5", output: "101" },
      { input: "10", output: "1010" },
    ],
    aMin: 1,
    aMax: 1023,
    aDefault: 10,
    concepts: ["loops", "cond", "operators", "vars", "io"],
    starter: STARTER("A를 2진수로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    char buf[16];
    int len = 0;
    while (A > 0) { buf[len++] = '0' + (A & 1); A >>= 1; }
    for (int i = len - 1; i >= 0; i--) printf("%c", buf[i]);
    printf("\\n");
    return 0;
}
`,
    expected: (A) => A.toString(2),
  },
  {
    id: 19,
    tag: "기본 · 배열",
    title: "1부터 A까지 배열에 담아 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이가 <code>A</code>인 정수 배열에 <code>1, 2, ..., A</code>를 차례로 저장한 뒤, 공백으로 구분해 한 줄에 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>1</code>부터 <code>A</code>까지의 값을 공백으로 구분해 출력합니다.",
    constraints: ["1 ≤ A ≤ 30"],
    examples: [
      { input: "3", output: "1 2 3" },
      { input: "5", output: "1 2 3 4 5" },
    ],
    aMin: 1,
    aMax: 30,
    aDefault: 5,
    concepts: ["arrays", "loops", "io"],
    starter: STARTER("길이 A 배열에 1~A를 저장하고 공백 구분으로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[100];
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    for (int i = 0; i < A; i++) {
        if (i > 0) printf(" ");
        printf("%d", arr[i]);
    }
    printf("\\n");
    return 0;
}
`,
    expected: (A) => Array.from({ length: A }, (_, i) => i + 1).join(" "),
  },
  {
    id: 20,
    tag: "기본 · 배열",
    title: "배열을 거꾸로 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열에 <code>1, 2, ..., A</code>를 저장한 뒤, 끝에서부터 거꾸로 한 줄에 공백 구분으로 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A, A-1, ..., 1</code>을 공백으로 구분해 출력합니다.",
    constraints: ["1 ≤ A ≤ 30"],
    examples: [
      { input: "3", output: "3 2 1" },
      { input: "5", output: "5 4 3 2 1" },
    ],
    aMin: 1,
    aMax: 30,
    aDefault: 5,
    concepts: ["arrays", "loops", "io"],
    starter: STARTER("배열에 1~A를 저장한 뒤 거꾸로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[100];
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    for (int i = A - 1; i >= 0; i--) {
        if (i < A - 1) printf(" ");
        printf("%d", arr[i]);
    }
    printf("\\n");
    return 0;
}
`,
    expected: (A) => Array.from({ length: A }, (_, i) => A - i).join(" "),
  },
  {
    id: 21,
    tag: "기본 · 배열",
    title: "제곱수의 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열에 <code>1², 2², ..., A²</code>을 저장한 뒤 그 합을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>1² + 2² + ... + A²</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 50"],
    examples: [
      { input: "3", output: "14" },
      { input: "5", output: "55" },
    ],
    aMin: 1,
    aMax: 50,
    aDefault: 5,
    concepts: ["arrays", "loops", "operators"],
    starter: STARTER("배열에 1²~A²을 저장한 뒤 합을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[100];
    for (int i = 0; i < A; i++) arr[i] = (i + 1) * (i + 1);
    int sum = 0;
    for (int i = 0; i < A; i++) sum += arr[i];
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) => {
      let s = 0;
      for (let i = 1; i <= A; i++) s += i * i;
      return String(s);
    },
  },
  {
    id: 22,
    tag: "기본 · 배열",
    title: "짝수 인덱스 원소의 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열에 <code>1, 2, ..., A</code>를 저장한 뒤, 인덱스가 짝수(0, 2, 4, ...)인 원소들의 합을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "짝수 인덱스 원소들의 합을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "9" },
      { input: "4", output: "4" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["arrays", "loops", "cond"],
    starter: STARTER("배열의 짝수 인덱스 원소들의 합을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[100];
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    int sum = 0;
    for (int i = 0; i < A; i++) {
        if (i % 2 == 0) sum += arr[i];
    }
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) => {
      let s = 0;
      for (let i = 0; i < A; i += 2) s += i + 1;
      return String(s);
    },
  },
  {
    id: 23,
    tag: "기본 · 배열",
    title: "최댓값과 최솟값",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열에 <code>A, A-1, ..., 1</code>을 저장한 뒤 최댓값과 최솟값을 공백으로 구분해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>최댓값 최솟값</code> 순서로 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "5 1" },
      { input: "1", output: "1 1" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["arrays", "loops", "cond"],
    starter: STARTER("배열을 순회하며 최댓값과 최솟값을 구해 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[100];
    for (int i = 0; i < A; i++) arr[i] = A - i;
    int mx = arr[0], mn = arr[0];
    for (int i = 1; i < A; i++) {
        if (arr[i] > mx) mx = arr[i];
        if (arr[i] < mn) mn = arr[i];
    }
    printf("%d %d\\n", mx, mn);
    return 0;
}
`,
    expected: (A) => `${A} 1`,
  },
  {
    id: 24,
    tag: "중급 · 포인터",
    title: "포인터로 값 읽기",
    description:
      "정수 <code>A</code>가 주어집니다. <code>A</code>를 가리키는 포인터 <code>p</code>를 만들고, " +
      "포인터 역참조(<code>*p</code>)를 사용해 <code>A</code>의 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "포인터로 읽은 <code>A</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "7", output: "7" },
      { input: "123", output: "123" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 42,
    concepts: ["pointers", "vars", "io"],
    starter: STARTER("A를 가리키는 포인터를 만들어 *p로 값을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int *p = &A;
    printf("%d\\n", *p);
    return 0;
}
`,
    expected: (A) => String(A),
  },
  {
    id: 25,
    tag: "중급 · 포인터",
    title: "포인터로 두 값 교환 (swap)",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>a = A</code>, <code>b = A + 10</code>인 두 변수를 " +
      "포인터를 받는 <code>swap</code> 함수로 교환한 뒤, <code>a b</code> 순서로 공백 구분 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "교환 후의 <code>a b</code>를 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "3", output: "13 3" },
      { input: "5", output: "15 5" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 3,
    concepts: ["pointers", "functions", "io"],
    starter: STARTER("포인터를 받는 swap 함수로 a와 b를 교환하세요"),
    solution:
`#include <stdio.h>

void swap(int *x, int *y) {
    int t = *x;
    *x = *y;
    *y = t;
}

int main(void) {
    int A;
    scanf("%d", &A);
    int a = A, b = A + 10;
    swap(&a, &b);
    printf("%d %d\\n", a, b);
    return 0;
}
`,
    expected: (A) => `${A + 10} ${A}`,
  },
  {
    id: 26,
    tag: "중급 · 포인터",
    title: "포인터 산술로 배열 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열에 <code>1, 2, ..., A</code>를 저장하고, " +
      "포인터 산술(<code>*(p + i)</code>)로 배열을 순회하며 합을 구해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "배열 원소들의 합을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "15" },
      { input: "10", output: "55" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["pointers", "arrays", "loops"],
    starter: STARTER("포인터 산술로 배열을 순회하며 합을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[100];
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    int *p = arr;
    int sum = 0;
    for (int i = 0; i < A; i++) sum += *(p + i);
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) => String((A * (A + 1)) / 2),
  },
  {
    id: 27,
    tag: "중급 · 포인터",
    title: "배열의 첫 원소와 끝 원소",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열에 <code>1, 2, ..., A</code>를 저장한 뒤, " +
      "포인터로 첫 원소와 마지막 원소를 가리키고 두 값을 공백 구분으로 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>arr[0]</code>과 <code>arr[A-1]</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "1 5" },
      { input: "1", output: "1 1" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["pointers", "arrays", "io"],
    starter: STARTER("포인터로 첫 원소와 마지막 원소를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[100];
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    int *first = arr;
    int *last = arr + (A - 1);
    printf("%d %d\\n", *first, *last);
    return 0;
}
`,
    expected: (A) => `1 ${A}`,
  },
  {
    id: 28,
    tag: "중급 · 구조체",
    title: "구조체 Point 출력",
    description:
      "정수 <code>A</code>가 주어집니다. <code>x</code>, <code>y</code> 멤버를 가진 구조체 <code>Point</code>를 정의하고, " +
      "<code>x = A</code>, <code>y = A + 1</code>로 초기화한 뒤 <code>x y</code> 순서로 공백 구분 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>Point</code>의 <code>x</code>와 <code>y</code>를 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "3", output: "3 4" },
      { input: "10", output: "10 11" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 3,
    concepts: ["structs", "vars", "io"],
    starter: STARTER("Point 구조체를 만들어 x, y를 출력하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int main(void) {
    int A;
    scanf("%d", &A);
    Point p;
    p.x = A;
    p.y = A + 1;
    printf("%d %d\\n", p.x, p.y);
    return 0;
}
`,
    expected: (A) => `${A} ${A + 1}`,
  },
  {
    id: 29,
    tag: "중급 · 구조체",
    title: "직사각형 넓이",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>width</code>, <code>height</code> 멤버를 가진 구조체 <code>Rect</code>를 " +
      "<code>width = A</code>, <code>height = A + 1</code>로 초기화한 뒤 넓이(<code>width × height</code>)를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "직사각형의 넓이를 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "3", output: "12" },
      { input: "5", output: "30" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 3,
    concepts: ["structs", "operators", "io"],
    starter: STARTER("Rect 구조체로 넓이를 계산해 출력하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int width;
    int height;
} Rect;

int main(void) {
    int A;
    scanf("%d", &A);
    Rect r;
    r.width = A;
    r.height = A + 1;
    printf("%d\\n", r.width * r.height);
    return 0;
}
`,
    expected: (A) => String(A * (A + 1)),
  },
  {
    id: 30,
    tag: "중급 · 구조체",
    title: "학생 점수 평균",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 학생 <code>A</code>명의 점수가 각각 <code>1, 2, ..., A</code>일 때, " +
      "<code>name</code>과 <code>score</code> 멤버를 가진 <code>Student</code> 구조체 배열에 저장한 뒤 " +
      "<code>score</code>의 평균을 정수 나눗셈(소수점 버림)으로 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "점수의 평균(정수)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 50"],
    examples: [
      { input: "5", output: "3" },
      { input: "4", output: "2" },
    ],
    aMin: 1,
    aMax: 50,
    aDefault: 5,
    concepts: ["structs", "arrays", "loops"],
    starter: STARTER("Student 구조체 배열에 점수를 저장하고 평균을 출력하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int id;
    int score;
} Student;

int main(void) {
    int A;
    scanf("%d", &A);
    Student s[100];
    for (int i = 0; i < A; i++) {
        s[i].id = i + 1;
        s[i].score = i + 1;
    }
    int sum = 0;
    for (int i = 0; i < A; i++) sum += s[i].score;
    printf("%d\\n", sum / A);
    return 0;
}
`,
    expected: (A) => String(Math.floor(((A * (A + 1)) / 2) / A)),
  },
  {
    id: 31,
    tag: "중급 · 동적 메모리",
    title: "malloc으로 배열 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>malloc</code>으로 길이 <code>A</code>인 <code>int</code> 배열을 할당해 " +
      "<code>1, 2, ..., A</code>를 저장하고 그 합을 출력한 뒤 <code>free</code>로 메모리를 반납하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>1 + 2 + ... + A</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "15" },
      { input: "10", output: "55" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["memory", "arrays", "loops"],
    starter: STARTER("malloc으로 배열을 잡고 합을 출력한 뒤 free하세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int *arr = (int *)malloc(sizeof(int) * A);
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    int sum = 0;
    for (int i = 0; i < A; i++) sum += arr[i];
    printf("%d\\n", sum);
    free(arr);
    return 0;
}
`,
    expected: (A) => String((A * (A + 1)) / 2),
  },
  {
    id: 32,
    tag: "중급 · 동적 메모리",
    title: "malloc으로 배열 거꾸로 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>malloc</code>으로 길이 <code>A</code>인 <code>int</code> 배열을 할당해 " +
      "<code>A, A-1, ..., 1</code>을 차례로 저장하고 공백 구분으로 출력한 뒤 <code>free</code>하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A, A-1, ..., 1</code>을 공백으로 구분해 출력합니다.",
    constraints: ["1 ≤ A ≤ 30"],
    examples: [
      { input: "3", output: "3 2 1" },
      { input: "5", output: "5 4 3 2 1" },
    ],
    aMin: 1,
    aMax: 30,
    aDefault: 5,
    concepts: ["memory", "arrays", "loops"],
    starter: STARTER("malloc으로 배열을 잡고 A,A-1,...,1을 저장한 뒤 free하세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int *arr = (int *)malloc(sizeof(int) * A);
    for (int i = 0; i < A; i++) arr[i] = A - i;
    for (int i = 0; i < A; i++) {
        if (i > 0) printf(" ");
        printf("%d", arr[i]);
    }
    printf("\\n");
    free(arr);
    return 0;
}
`,
    expected: (A) => Array.from({ length: A }, (_, i) => A - i).join(" "),
  },
  {
    id: 33,
    tag: "중급 · 동적 메모리",
    title: "calloc으로 0 채우고 짝수 인덱스에 1",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>calloc</code>으로 길이 <code>A</code>인 <code>int</code> 배열을 0으로 " +
      "초기화한 뒤, 인덱스가 짝수(0, 2, 4, ...)인 칸만 1로 바꾸세요. 그 후 배열 전체의 합을 출력하고 <code>free</code>하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "배열 원소들의 합(= 짝수 인덱스 개수)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "3" },
      { input: "4", output: "2" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["memory", "arrays", "cond"],
    starter: STARTER("calloc으로 배열을 0으로 잡고 짝수 인덱스만 1로 채우세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int *arr = (int *)calloc(A, sizeof(int));
    for (int i = 0; i < A; i++) {
        if (i % 2 == 0) arr[i] = 1;
    }
    int sum = 0;
    for (int i = 0; i < A; i++) sum += arr[i];
    printf("%d\\n", sum);
    free(arr);
    return 0;
}
`,
    expected: (A) => String(Math.ceil(A / 2)),
  },
  {
    id: 34,
    tag: "기본 · 문자열",
    title: "strlen으로 길이 구하기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>char</code> 배열에 <code>'a'</code>를 <code>A</code>번 채우고 마지막에 " +
      "<code>'\\0'</code>을 넣어 문자열로 만든 뒤, <code>strlen</code>으로 길이를 구해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "만든 문자열의 길이를 출력합니다.",
    constraints: ["1 ≤ A ≤ 50"],
    examples: [
      { input: "5", output: "5" },
      { input: "12", output: "12" },
    ],
    aMin: 1,
    aMax: 50,
    aDefault: 5,
    concepts: ["strings", "loops", "io"],
    starter: STARTER("'a'를 A번 채워 문자열을 만들고 strlen으로 길이를 출력하세요"),
    solution:
`#include <stdio.h>
#include <string.h>

int main(void) {
    int A;
    scanf("%d", &A);
    char buf[64];
    for (int i = 0; i < A; i++) buf[i] = 'a';
    buf[A] = '\\0';
    printf("%lu\\n", (unsigned long)strlen(buf));
    return 0;
}
`,
    expected: (A) => String(A),
  },
  {
    id: 35,
    tag: "기본 · 문자열",
    title: "strcpy로 문자열 복사",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>'a'</code>를 <code>A</code>번 이어 붙인 문자열을 만들고, " +
      "<code>strcpy</code>로 다른 <code>char</code> 배열에 복사한 뒤 복사된 문자열을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "복사된 문자열을 출력합니다.",
    constraints: ["1 ≤ A ≤ 30"],
    examples: [
      { input: "3", output: "aaa" },
      { input: "5", output: "aaaaa" },
    ],
    aMin: 1,
    aMax: 30,
    aDefault: 5,
    concepts: ["strings", "memory", "io"],
    starter: STARTER("문자열을 strcpy로 복사한 뒤 출력하세요"),
    solution:
`#include <stdio.h>
#include <string.h>

int main(void) {
    int A;
    scanf("%d", &A);
    char src[64];
    char dst[64];
    for (int i = 0; i < A; i++) src[i] = 'a';
    src[A] = '\\0';
    strcpy(dst, src);
    printf("%s\\n", dst);
    return 0;
}
`,
    expected: (A) => "a".repeat(A),
  },
  {
    id: 36,
    tag: "응용 · 문자열",
    title: "자릿수의 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>의 각 자릿수를 더한 값을 출력하세요. " +
      "예) <code>A = 123</code> → <code>1 + 2 + 3 = 6</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 자릿수 합을 출력합니다.",
    constraints: ["1 ≤ A ≤ 99999"],
    examples: [
      { input: "123", output: "6" },
      { input: "99", output: "18" },
    ],
    aMin: 1,
    aMax: 99999,
    aDefault: 123,
    concepts: ["strings", "loops", "operators"],
    starter: STARTER("A의 각 자릿수를 합쳐 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int sum = 0;
    while (A > 0) {
        sum += A % 10;
        A /= 10;
    }
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) =>
      String(
        String(A)
          .split("")
          .reduce((s, d) => s + Number(d), 0)
      ),
  },
  {
    id: 37,
    tag: "응용 · 문자열",
    title: "16진수로 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>를 16진수(소문자) 표현으로 출력하세요. " +
      "예) <code>A = 255</code> → <code>ff</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 16진수 표현(소문자)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 4095"],
    examples: [
      { input: "10", output: "a" },
      { input: "255", output: "ff" },
    ],
    aMin: 1,
    aMax: 4095,
    aDefault: 255,
    concepts: ["strings", "io", "operators"],
    starter: STARTER("A를 16진수로 출력하세요 (%x 형식 지정자)"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%x\\n", A);
    return 0;
}
`,
    expected: (A) => A.toString(16),
  },
  {
    id: 38,
    tag: "기본 · 함수",
    title: "두 수 더하기 함수",
    description:
      "정수 <code>A</code>가 주어집니다. <code>int add(int x, int y)</code> 함수를 정의해 " +
      "<code>add(A, A * 2)</code>의 결과를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A + 2A = 3A</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "3", output: "9" },
      { input: "10", output: "30" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 3,
    concepts: ["functions", "operators", "io"],
    starter: STARTER("add(A, A*2)의 값을 출력하세요"),
    solution:
`#include <stdio.h>

int add(int x, int y) {
    return x + y;
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", add(A, A * 2));
    return 0;
}
`,
    expected: (A) => String(A * 3),
  },
  {
    id: 39,
    tag: "기본 · 함수",
    title: "최댓값 함수 max",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>int max(int x, int y)</code> 함수를 정의해 " +
      "<code>max(A, 100 - A)</code>의 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "두 값 중 큰 쪽을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "30", output: "70" },
      { input: "80", output: "80" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 30,
    concepts: ["functions", "cond", "io"],
    starter: STARTER("max(A, 100-A)의 값을 출력하세요"),
    solution:
`#include <stdio.h>

int max(int x, int y) {
    if (x > y) return x;
    return y;
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", max(A, 100 - A));
    return 0;
}
`,
    expected: (A) => String(Math.max(A, 100 - A)),
  },
  {
    id: 40,
    tag: "기본 · 함수",
    title: "절댓값 함수",
    description:
      "정수 <code>A</code>가 주어집니다. <code>int absVal(int x)</code> 함수를 정의해 " +
      "<code>absVal(A - 50)</code>의 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>|A - 50|</code>을 출력합니다.",
    constraints: ["0 ≤ A ≤ 100"],
    examples: [
      { input: "30", output: "20" },
      { input: "75", output: "25" },
    ],
    aMin: 0,
    aMax: 100,
    aDefault: 30,
    concepts: ["functions", "cond", "io"],
    starter: STARTER("절댓값 함수로 |A-50|을 출력하세요"),
    solution:
`#include <stdio.h>

int absVal(int x) {
    if (x < 0) return -x;
    return x;
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", absVal(A - 50));
    return 0;
}
`,
    expected: (A) => String(Math.abs(A - 50)),
  },
  {
    id: 41,
    tag: "응용 · 재귀",
    title: "재귀로 카운트다운",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 재귀 함수를 사용해 <code>A, A-1, ..., 1</code>을 공백으로 구분해 한 줄에 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>부터 <code>1</code>까지 거꾸로 출력합니다.",
    constraints: ["1 ≤ A ≤ 30"],
    examples: [
      { input: "3", output: "3 2 1" },
      { input: "5", output: "5 4 3 2 1" },
    ],
    aMin: 1,
    aMax: 30,
    aDefault: 5,
    concepts: ["recursion", "functions", "io"],
    starter: STARTER("재귀 함수로 A부터 1까지 거꾸로 출력하세요"),
    solution:
`#include <stdio.h>

void countdown(int n) {
    if (n <= 0) return;
    printf("%d", n);
    if (n > 1) printf(" ");
    countdown(n - 1);
}

int main(void) {
    int A;
    scanf("%d", &A);
    countdown(A);
    printf("\\n");
    return 0;
}
`,
    expected: (A) => Array.from({ length: A }, (_, i) => A - i).join(" "),
  },
  {
    id: 42,
    tag: "응용 · 재귀",
    title: "최대공약수 (재귀 유클리드)",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 재귀 함수 <code>gcd(a, b)</code>로 " +
      "<code>gcd(A, 36)</code>의 값을 구해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>와 <code>36</code>의 최대공약수를 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "24", output: "12" },
      { input: "5", output: "1" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 24,
    concepts: ["recursion", "functions", "operators"],
    starter: STARTER("재귀 유클리드 호제법으로 gcd(A, 36)을 출력하세요"),
    solution:
`#include <stdio.h>

int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", gcd(A, 36));
    return 0;
}
`,
    expected: (A) => {
      const g = (a, b) => (b === 0 ? a : g(b, a % b));
      return String(g(A, 36));
    },
  },
  {
    id: 43,
    tag: "기초 · 자료형",
    title: "A번째 알파벳 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>'A'</code>를 1번째라고 할 때 <code>A</code>번째 대문자 알파벳을 출력하세요. " +
      "(char와 int 사이 형변환 활용)",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>번째 대문자 알파벳을 출력합니다.",
    constraints: ["1 ≤ A ≤ 26"],
    examples: [
      { input: "1", output: "A" },
      { input: "5", output: "E" },
    ],
    aMin: 1,
    aMax: 26,
    aDefault: 5,
    concepts: ["vars", "operators", "io"],
    starter: STARTER("'A' + (A - 1)을 char로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    char c = 'A' + (A - 1);
    printf("%c\\n", c);
    return 0;
}
`,
    expected: (A) => String.fromCharCode("A".charCodeAt(0) + (A - 1)),
  },
  {
    id: 44,
    tag: "기초 · 연산자",
    title: "비트 시프트로 2배",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 비트 연산자 <code>&lt;&lt;</code>(왼쪽 시프트)를 사용해 <code>A</code>의 2배를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A &lt;&lt; 1</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "5", output: "10" },
      { input: "100", output: "200" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["operators", "vars", "io"],
    starter: STARTER("A << 1을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", A << 1);
    return 0;
}
`,
    expected: (A) => String(A * 2),
  },
  {
    id: 45,
    tag: "기초 · 조건문",
    title: "switch로 등급 매기기",
    description:
      "<code>0</code> 이상 <code>9</code> 이하의 정수 <code>A</code>가 주어집니다. <code>switch</code>문을 사용해 " +
      "<code>A</code>가 0~3이면 <code>low</code>, 4~6이면 <code>mid</code>, 7~9이면 <code>high</code>를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "구간 이름(<code>low</code>/<code>mid</code>/<code>high</code>)을 출력합니다.",
    constraints: ["0 ≤ A ≤ 9"],
    examples: [
      { input: "2", output: "low" },
      { input: "5", output: "mid" },
      { input: "8", output: "high" },
    ],
    aMin: 0,
    aMax: 9,
    aDefault: 5,
    concepts: ["cond", "vars", "io"],
    starter: STARTER("switch문으로 low/mid/high를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    switch (A) {
        case 0: case 1: case 2: case 3:
            printf("low\\n");
            break;
        case 4: case 5: case 6:
            printf("mid\\n");
            break;
        case 7: case 8: case 9:
            printf("high\\n");
            break;
    }
    return 0;
}
`,
    expected: (A) => (A <= 3 ? "low" : A <= 6 ? "mid" : "high"),
  },
  {
    id: 46,
    tag: "기초 · 조건문",
    title: "삼항 연산자로 큰 수",
    description:
      "정수 <code>A</code>가 주어집니다. <strong>삼항 연산자</strong>(<code>?:</code>)를 사용해 <code>A</code>와 <code>50</code> 중 큰 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>와 <code>50</code> 중 큰 값을 출력합니다.",
    constraints: ["0 ≤ A ≤ 100"],
    examples: [
      { input: "30", output: "50" },
      { input: "80", output: "80" },
    ],
    aMin: 0,
    aMax: 100,
    aDefault: 30,
    concepts: ["cond", "operators", "io"],
    starter: STARTER("삼항 연산자로 max(A, 50)을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int m = (A > 50) ? A : 50;
    printf("%d\\n", m);
    return 0;
}
`,
    expected: (A) => String(Math.max(A, 50)),
  },
  {
    id: 47,
    tag: "기본 · 반복문",
    title: "1부터 A까지 짝수 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>1</code>부터 <code>A</code>까지의 정수 중 짝수만 공백으로 구분해 한 줄에 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code> 이하의 짝수를 공백으로 구분해 출력합니다.",
    constraints: ["2 ≤ A ≤ 50"],
    examples: [
      { input: "5", output: "2 4" },
      { input: "10", output: "2 4 6 8 10" },
    ],
    aMin: 2,
    aMax: 50,
    aDefault: 10,
    concepts: ["loops", "cond", "io"],
    starter: STARTER("A 이하 짝수를 공백 구분으로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int first = 1;
    for (int i = 2; i <= A; i += 2) {
        if (!first) printf(" ");
        printf("%d", i);
        first = 0;
    }
    printf("\\n");
    return 0;
}
`,
    expected: (A) => {
      const out = [];
      for (let i = 2; i <= A; i += 2) out.push(i);
      return out.join(" ");
    },
  },
  {
    id: 48,
    tag: "기본 · 반복문",
    title: "구구단 A단",
    description:
      "<code>2</code> 이상 <code>9</code> 이하의 정수 <code>A</code>가 주어집니다. <code>A</code>단 구구단을 " +
      "<code>A * i = 결과</code> 형식으로 <code>i = 1</code>부터 <code>i = 9</code>까지 한 줄씩 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A * i = 결과</code> 형식으로 9줄을 출력합니다.",
    constraints: ["2 ≤ A ≤ 9"],
    examples: [
      { input: "2", output: "2 * 1 = 2\n2 * 2 = 4\n2 * 3 = 6\n2 * 4 = 8\n2 * 5 = 10\n2 * 6 = 12\n2 * 7 = 14\n2 * 8 = 16\n2 * 9 = 18" },
    ],
    aMin: 2,
    aMax: 9,
    aDefault: 3,
    concepts: ["loops", "operators", "io"],
    starter: STARTER("A단 구구단을 한 줄씩 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 1; i <= 9; i++) {
        printf("%d * %d = %d\\n", A, i, A * i);
    }
    return 0;
}
`,
    expected: (A) => {
      const lines = [];
      for (let i = 1; i <= 9; i++) lines.push(`${A} * ${i} = ${A * i}`);
      return lines.join("\n");
    },
  },
  {
    id: 49,
    tag: "기본 · 반복문",
    title: "별 삼각형 (높이 A)",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>i</code>번째 줄에 <code>'*'</code>을 <code>i</code>개 출력하는 형태로 " +
      "높이가 <code>A</code>인 별 삼각형을 출력하세요. 예) <code>A = 3</code> → <code>*</code> / <code>**</code> / <code>***</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "별로 이루어진 직각삼각형을 출력합니다.",
    constraints: ["1 ≤ A ≤ 20"],
    examples: [
      { input: "3", output: "*\n**\n***" },
      { input: "1", output: "*" },
    ],
    aMin: 1,
    aMax: 20,
    aDefault: 4,
    concepts: ["loops", "strings", "io"],
    starter: STARTER("높이 A인 별 삼각형을 출력하세요 (중첩 반복문)"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 1; i <= A; i++) {
        for (int j = 0; j < i; j++) printf("*");
        printf("\\n");
    }
    return 0;
}
`,
    expected: (A) =>
      Array.from({ length: A }, (_, i) => "*".repeat(i + 1)).join("\n"),
  },
  {
    id: 50,
    tag: "응용 · 산술",
    title: "약수의 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>의 양의 약수를 모두 더한 값을 출력하세요. " +
      "예) <code>A = 6</code> → <code>1 + 2 + 3 + 6 = 12</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 약수의 합을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "6", output: "12" },
      { input: "10", output: "18" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 6,
    concepts: ["loops", "cond", "operators"],
    starter: STARTER("A의 약수의 합을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int sum = 0;
    for (int i = 1; i <= A; i++) {
        if (A % i == 0) sum += i;
    }
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) => {
      let s = 0;
      for (let i = 1; i <= A; i++) if (A % i === 0) s += i;
      return String(s);
    },
  },
  {
    id: 51,
    tag: "중급 · 포인터",
    title: "함수에 포인터로 값 수정",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>void addFive(int *p)</code> 함수를 정의해 " +
      "<code>*p</code>에 5를 더한 뒤, 변경된 <code>A</code>의 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "함수 호출 이후 <code>A</code>의 값(<code>A + 5</code>)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "3", output: "8" },
      { input: "10", output: "15" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 3,
    concepts: ["pointers", "functions", "io"],
    starter: STARTER("addFive(&A)로 A에 5를 더한 뒤 출력하세요"),
    solution:
`#include <stdio.h>

void addFive(int *p) {
    *p += 5;
}

int main(void) {
    int A;
    scanf("%d", &A);
    addFive(&A);
    printf("%d\\n", A);
    return 0;
}
`,
    expected: (A) => String(A + 5),
  },
  {
    id: 52,
    tag: "중급 · 포인터",
    title: "함수로 배열 합 구하기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열에 <code>1, 2, ..., A</code>를 저장한 뒤, " +
      "<code>int arraySum(int *arr, int n)</code> 함수에 포인터로 넘겨 합을 구해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "배열 원소들의 합을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "15" },
      { input: "10", output: "55" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["pointers", "arrays", "functions"],
    starter: STARTER("arraySum 함수로 배열의 합을 구해 출력하세요"),
    solution:
`#include <stdio.h>

int arraySum(int *arr, int n) {
    int s = 0;
    for (int i = 0; i < n; i++) s += arr[i];
    return s;
}

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[100];
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    printf("%d\\n", arraySum(arr, A));
    return 0;
}
`,
    expected: (A) => String((A * (A + 1)) / 2),
  },
  {
    id: 53,
    tag: "중급 · 구조체",
    title: "구조체 포인터와 화살표 연산자",
    description:
      "정수 <code>A</code>가 주어집니다. <code>Point</code> 구조체를 만들고 그 주소를 <code>Point *p</code>에 담아 " +
      "<code>p-&gt;x = A</code>, <code>p-&gt;y = A * 2</code>로 설정한 뒤 <code>x y</code> 순서로 공백 구분 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>p-&gt;x</code>와 <code>p-&gt;y</code>를 출력합니다.",
    constraints: ["1 ≤ A ≤ 500"],
    examples: [
      { input: "3", output: "3 6" },
      { input: "10", output: "10 20" },
    ],
    aMin: 1,
    aMax: 500,
    aDefault: 3,
    concepts: ["structs", "pointers", "io"],
    starter: STARTER("구조체 포인터와 -> 연산자로 멤버에 접근하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int main(void) {
    int A;
    scanf("%d", &A);
    Point pt;
    Point *p = &pt;
    p->x = A;
    p->y = A * 2;
    printf("%d %d\\n", p->x, p->y);
    return 0;
}
`,
    expected: (A) => `${A} ${A * 2}`,
  },
  {
    id: 54,
    tag: "중급 · 구조체",
    title: "구조체 안의 배열 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>int scores[3]</code> 멤버를 가진 <code>Student</code> 구조체에 " +
      "<code>scores = {A, A + 1, A + 2}</code>를 채운 뒤 세 점수의 합을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "세 점수의 합(<code>3A + 3</code>)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "1", output: "6" },
      { input: "10", output: "33" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 10,
    concepts: ["structs", "arrays", "loops"],
    starter: STARTER("Student 구조체 안의 scores 배열 합을 출력하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int scores[3];
} Student;

int main(void) {
    int A;
    scanf("%d", &A);
    Student s;
    s.scores[0] = A;
    s.scores[1] = A + 1;
    s.scores[2] = A + 2;
    int sum = 0;
    for (int i = 0; i < 3; i++) sum += s.scores[i];
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) => String(3 * A + 3),
  },
  {
    id: 55,
    tag: "중급 · 동적 메모리",
    title: "realloc으로 배열 키우기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 1짜리 배열로 <code>malloc</code>한 뒤 <code>realloc</code>으로 " +
      "길이 <code>A</code>까지 키우고, <code>1, 2, ..., A</code>를 저장한 후 합을 출력하고 <code>free</code>하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>1 + 2 + ... + A</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "15" },
      { input: "10", output: "55" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["memory", "arrays", "loops"],
    starter: STARTER("realloc으로 배열을 키운 뒤 합을 출력하세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int *arr = (int *)malloc(sizeof(int));
    arr = (int *)realloc(arr, sizeof(int) * A);
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    int sum = 0;
    for (int i = 0; i < A; i++) sum += arr[i];
    printf("%d\\n", sum);
    free(arr);
    return 0;
}
`,
    expected: (A) => String((A * (A + 1)) / 2),
  },
  {
    id: 56,
    tag: "중급 · 동적 메모리",
    title: "동적 2차원 배열 대각선 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>malloc</code>으로 <code>A × A</code> 크기의 2차원 " +
      "<code>int</code> 배열을 동적 할당하고, 대각선 칸(<code>i == j</code>)만 1로, 나머지는 0으로 채운 뒤 " +
      "모든 원소의 합을 출력하고 <code>free</code>하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "행렬 원소들의 합(= 대각선 길이 <code>A</code>)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 30"],
    examples: [
      { input: "3", output: "3" },
      { input: "5", output: "5" },
    ],
    aMin: 1,
    aMax: 30,
    aDefault: 4,
    concepts: ["memory", "arrays", "loops"],
    starter: STARTER("malloc으로 A x A 2차원 배열을 만들어 단위행렬을 채우세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int **mat = (int **)malloc(sizeof(int *) * A);
    for (int i = 0; i < A; i++) {
        mat[i] = (int *)malloc(sizeof(int) * A);
        for (int j = 0; j < A; j++) mat[i][j] = (i == j) ? 1 : 0;
    }
    int sum = 0;
    for (int i = 0; i < A; i++)
        for (int j = 0; j < A; j++) sum += mat[i][j];
    printf("%d\\n", sum);
    for (int i = 0; i < A; i++) free(mat[i]);
    free(mat);
    return 0;
}
`,
    expected: (A) => String(A),
  },
  {
    id: 57,
    tag: "응용 · 재귀",
    title: "자릿수 합 (재귀)",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <strong>재귀 함수</strong>로 <code>A</code>의 각 자릿수의 합을 구해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 자릿수 합을 출력합니다.",
    constraints: ["1 ≤ A ≤ 99999"],
    examples: [
      { input: "123", output: "6" },
      { input: "99", output: "18" },
    ],
    aMin: 1,
    aMax: 99999,
    aDefault: 123,
    concepts: ["recursion", "functions", "operators"],
    starter: STARTER("재귀로 A의 자릿수 합을 출력하세요"),
    solution:
`#include <stdio.h>

int digitSum(int n) {
    if (n == 0) return 0;
    return (n % 10) + digitSum(n / 10);
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", digitSum(A));
    return 0;
}
`,
    expected: (A) =>
      String(
        String(A)
          .split("")
          .reduce((s, d) => s + Number(d), 0)
      ),
  },
  {
    id: 58,
    tag: "응용 · 재귀",
    title: "3의 거듭제곱 (재귀)",
    description:
      "<code>0</code> 이상의 정수 <code>A</code>가 주어집니다. <strong>재귀 함수</strong>로 <code>3^A</code>를 계산해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>3의 A제곱</code> 값을 출력합니다.",
    constraints: ["0 ≤ A ≤ 18"],
    examples: [
      { input: "0", output: "1" },
      { input: "5", output: "243" },
    ],
    aMin: 0,
    aMax: 18,
    aDefault: 5,
    concepts: ["recursion", "functions", "operators"],
    starter: STARTER("재귀로 3^A를 출력하세요"),
    solution:
`#include <stdio.h>

long long pow3(int n) {
    if (n == 0) return 1;
    return 3LL * pow3(n - 1);
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%lld\\n", pow3(A));
    return 0;
}
`,
    expected: (A) => String(3 ** A),
  },
  {
    id: 59,
    tag: "응용 · 재귀",
    title: "재귀로 2진수 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <strong>재귀 함수</strong>로 <code>A</code>의 2진수 표현을 한 줄에 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 2진수 표현을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1023"],
    examples: [
      { input: "5", output: "101" },
      { input: "10", output: "1010" },
    ],
    aMin: 1,
    aMax: 1023,
    aDefault: 10,
    concepts: ["recursion", "functions", "strings"],
    starter: STARTER("재귀 함수로 A의 2진수 표현을 출력하세요"),
    solution:
`#include <stdio.h>

void printBin(int n) {
    if (n == 0) return;
    printBin(n / 2);
    printf("%d", n % 2);
    return;
}

int main(void) {
    int A;
    scanf("%d", &A);
    printBin(A);
    printf("\\n");
    return 0;
}
`,
    expected: (A) => A.toString(2),
  },
  {
    id: 60,
    tag: "응용 · 문자열",
    title: "문자열 뒤집어 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>'a'</code>부터 시작해 <code>A</code>개의 알파벳을 " +
      "<code>char</code> 배열에 채운 뒤, 배열 양 끝에서 인덱스를 교환하는 방법으로 문자열을 뒤집어 출력하세요. " +
      "예) <code>A = 4</code> → <code>abcd</code>를 만들어 뒤집은 결과 <code>dcba</code>.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "뒤집은 문자열을 출력합니다.",
    constraints: ["1 ≤ A ≤ 26"],
    examples: [
      { input: "4", output: "dcba" },
      { input: "1", output: "a" },
    ],
    aMin: 1,
    aMax: 26,
    aDefault: 5,
    concepts: ["strings", "arrays", "loops"],
    starter: STARTER("char 배열에 'a'~'a'+A-1을 채우고 양 끝에서 swap해 뒤집으세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    char s[32];
    for (int i = 0; i < A; i++) s[i] = 'a' + i;
    s[A] = '\\0';
    for (int i = 0, j = A - 1; i < j; i++, j--) {
        char t = s[i]; s[i] = s[j]; s[j] = t;
    }
    printf("%s\\n", s);
    return 0;
}
`,
    expected: (A) =>
      "abcdefghijklmnopqrstuvwxyz".slice(0, A).split("").reverse().join(""),
  },
  {
    id: 61,
    tag: "중급 · 구조체",
    title: "두 점 사이의 거리 제곱",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>Point</code> 구조체 두 개를 만들어 " +
      "<code>p1 = (0, 0)</code>, <code>p2 = (A, A)</code>로 두고, 두 점 사이 거리의 제곱 " +
      "(<code>(x1 - x2)² + (y1 - y2)²</code>)을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "거리의 제곱(<code>2A²</code>)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "3", output: "18" },
      { input: "5", output: "50" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["structs", "operators", "io"],
    starter: STARTER("두 Point 구조체 사이 거리의 제곱을 출력하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int main(void) {
    int A;
    scanf("%d", &A);
    Point p1 = {0, 0};
    Point p2 = {A, A};
    int dx = p1.x - p2.x;
    int dy = p1.y - p2.y;
    printf("%d\\n", dx * dx + dy * dy);
    return 0;
}
`,
    expected: (A) => String(2 * A * A),
  },
  {
    id: 62,
    tag: "기초 · 자료형",
    title: "실수 나눗셈으로 평균",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>(A + 1)</code>을 <code>2.0</code>(<code>double</code>)으로 나눈 평균을 " +
      "소수점 한 자리까지 출력하세요. 예) <code>A = 3</code> → <code>2.0</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "평균을 소수점 한 자리로 출력합니다.",
    constraints: ["1 ≤ A ≤ 99"],
    examples: [
      { input: "3", output: "2.0" },
      { input: "4", output: "2.5" },
    ],
    aMin: 1,
    aMax: 99,
    aDefault: 3,
    concepts: ["vars", "operators", "io"],
    starter: STARTER("(A + 1) / 2.0을 %.1f로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    double avg = (A + 1) / 2.0;
    printf("%.1f\\n", avg);
    return 0;
}
`,
    expected: (A) => ((A + 1) / 2).toFixed(1),
  },
  {
    id: 63,
    tag: "기본 · 배열",
    title: "A x A 단위행렬",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 2차원 배열을 사용해 <code>A × A</code> 단위행렬(대각선은 1, 나머지는 0)을 " +
      "각 행마다 공백 구분으로 한 줄씩 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>개의 줄에 걸쳐 행렬을 출력합니다.",
    constraints: ["1 ≤ A ≤ 10"],
    examples: [
      { input: "3", output: "1 0 0\n0 1 0\n0 0 1" },
      { input: "1", output: "1" },
    ],
    aMin: 1,
    aMax: 10,
    aDefault: 3,
    concepts: ["arrays", "loops", "cond"],
    starter: STARTER("A x A 단위행렬을 줄 단위로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int mat[10][10];
    for (int i = 0; i < A; i++)
        for (int j = 0; j < A; j++)
            mat[i][j] = (i == j) ? 1 : 0;
    for (int i = 0; i < A; i++) {
        for (int j = 0; j < A; j++) {
            if (j > 0) printf(" ");
            printf("%d", mat[i][j]);
        }
        printf("\\n");
    }
    return 0;
}
`,
    expected: (A) => {
      const rows = [];
      for (let i = 0; i < A; i++) {
        const row = [];
        for (let j = 0; j < A; j++) row.push(i === j ? "1" : "0");
        rows.push(row.join(" "));
      }
      return rows.join("\n");
    },
  },
  {
    id: 64,
    tag: "기본 · 반복문",
    title: "do-while로 자릿수 합산",
    description:
      "<code>0</code> 이상의 정수 <code>A</code>가 주어집니다. <strong><code>do-while</code></strong> 반복문으로 " +
      "<code>A</code>의 자릿수를 하나씩 떼어내며 합산해 출력하세요. <code>A = 0</code>인 경우 0이 출력되어야 하므로 " +
      "<code>do-while</code>이 적절합니다.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "자릿수 합을 출력합니다.",
    constraints: ["0 ≤ A ≤ 99999"],
    examples: [
      { input: "0", output: "0" },
      { input: "456", output: "15" },
    ],
    aMin: 0,
    aMax: 99999,
    aDefault: 456,
    concepts: ["loops", "operators", "io"],
    starter: STARTER("do-while로 자릿수 합을 계산해 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int sum = 0;
    do {
        sum += A % 10;
        A /= 10;
    } while (A > 0);
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) =>
      String(
        String(A)
          .split("")
          .reduce((s, d) => s + Number(d), 0)
      ),
  },
  {
    id: 65,
    tag: "기초 · 연산자",
    title: "비트 AND로 홀짝 판정",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 비트 AND 연산(<code>A & 1</code>)을 사용해 " +
      "<code>A</code>가 홀수면 <code>1</code>, 짝수면 <code>0</code>을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A & 1</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "7", output: "1" },
      { input: "10", output: "0" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 7,
    concepts: ["operators", "vars", "io"],
    starter: STARTER("A & 1의 결과를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", A & 1);
    return 0;
}
`,
    expected: (A) => String(A & 1),
  },
  {
    id: 66,
    tag: "기본 · 문자열",
    title: "strcat으로 문자열 이어붙이기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>\"hi\"</code> 뒤에 <code>'!'</code> 문자를 <code>A</code>번 " +
      "<code>strcat</code>으로 이어붙인 결과를 출력하세요. 예) <code>A = 3</code> → <code>hi!!!</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "이어붙인 문자열을 출력합니다.",
    constraints: ["1 ≤ A ≤ 30"],
    examples: [
      { input: "1", output: "hi!" },
      { input: "3", output: "hi!!!" },
    ],
    aMin: 1,
    aMax: 30,
    aDefault: 3,
    concepts: ["strings", "loops", "io"],
    starter: STARTER("strcat으로 \"hi\"에 '!'를 A번 이어붙이세요"),
    solution:
`#include <stdio.h>
#include <string.h>

int main(void) {
    int A;
    scanf("%d", &A);
    char buf[64] = "hi";
    for (int i = 0; i < A; i++) strcat(buf, "!");
    printf("%s\\n", buf);
    return 0;
}
`,
    expected: (A) => "hi" + "!".repeat(A),
  },
  {
    id: 67,
    tag: "기초 · 조건문",
    title: "if-else로 점수 등급",
    description:
      "<code>0</code> 이상 <code>100</code> 이하의 정수 <code>A</code>가 주어집니다. <code>A &gt;= 90</code>이면 " +
      "<code>A</code>, <code>80 &lt;= A &lt; 90</code>이면 <code>B</code>, <code>70 &lt;= A &lt; 80</code>이면 " +
      "<code>C</code>, 그 외에는 <code>F</code>를 출력하세요. (다중 <code>if-else</code> 분기)",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "등급 한 글자를 출력합니다.",
    constraints: ["0 ≤ A ≤ 100"],
    examples: [
      { input: "95", output: "A" },
      { input: "72", output: "C" },
      { input: "40", output: "F" },
    ],
    aMin: 0,
    aMax: 100,
    aDefault: 85,
    concepts: ["cond", "vars", "io"],
    starter: STARTER("점수 A에 따라 A/B/C/F 등급을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    if (A >= 90)      printf("A\\n");
    else if (A >= 80) printf("B\\n");
    else if (A >= 70) printf("C\\n");
    else              printf("F\\n");
    return 0;
}
`,
    expected: (A) => (A >= 90 ? "A" : A >= 80 ? "B" : A >= 70 ? "C" : "F"),
  },
  {
    id: 68,
    tag: "기본 · 함수",
    title: "void 함수로 줄 그리기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>void printDashes(int n)</code> 함수를 정의해 " +
      "<code>'-'</code> 문자를 <code>n</code>개 한 줄에 출력하도록 만들고, <code>printDashes(A)</code>를 호출하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>'-'</code>를 <code>A</code>개 출력합니다.",
    constraints: ["1 ≤ A ≤ 50"],
    examples: [
      { input: "3", output: "---" },
      { input: "7", output: "-------" },
    ],
    aMin: 1,
    aMax: 50,
    aDefault: 5,
    concepts: ["functions", "loops", "io"],
    starter: STARTER("void printDashes 함수로 '-'를 A개 출력하세요"),
    solution:
`#include <stdio.h>

void printDashes(int n) {
    for (int i = 0; i < n; i++) printf("-");
    printf("\\n");
}

int main(void) {
    int A;
    scanf("%d", &A);
    printDashes(A);
    return 0;
}
`,
    expected: (A) => "-".repeat(A),
  },
  {
    id: 69,
    tag: "중급 · 포인터",
    title: "NULL 체크",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>int *p = NULL</code>로 초기화한 뒤, 만약 <code>A</code>가 " +
      "양수면 <code>p</code>가 <code>A</code>를 가리키도록 바꾸세요. 그 후 <code>p == NULL</code> 여부를 검사해 " +
      "<code>NULL</code>이면 <code>null</code>, 아니면 <code>*p</code>의 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>*p</code> 값을 출력합니다(이 문제에서는 항상 양수이므로 <code>A</code>).",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "5", output: "5" },
      { input: "100", output: "100" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["pointers", "cond", "io"],
    starter: STARTER("NULL 체크 후 *p 또는 null을 출력하세요"),
    solution:
`#include <stdio.h>
#include <stddef.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int *p = NULL;
    if (A > 0) p = &A;
    if (p == NULL) printf("null\\n");
    else           printf("%d\\n", *p);
    return 0;
}
`,
    expected: (A) => String(A),
  },
  {
    id: 70,
    tag: "중급 · 동적 메모리",
    title: "free 후 NULL 대입",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>malloc</code>으로 길이 <code>A</code>인 배열에 <code>1, 2, ..., A</code>를 " +
      "저장해 합을 출력한 뒤, <code>free</code>하고 포인터에 <code>NULL</code>을 대입한 다음 " +
      "포인터가 <code>NULL</code>인지 확인해 <code>freed</code>를 출력하세요. (두 줄 출력)",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "첫 줄에 합, 두 번째 줄에 <code>freed</code>를 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "15\nfreed" },
      { input: "3", output: "6\nfreed" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["memory", "pointers", "cond"],
    starter: STARTER("malloc/free 후 NULL 대입과 NULL 체크까지 수행하세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int *arr = (int *)malloc(sizeof(int) * A);
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    int sum = 0;
    for (int i = 0; i < A; i++) sum += arr[i];
    printf("%d\\n", sum);
    free(arr);
    arr = NULL;
    if (arr == NULL) printf("freed\\n");
    return 0;
}
`,
    expected: (A) => `${(A * (A + 1)) / 2}\nfreed`,
  },
  {
    id: 71,
    tag: "중급 · 구조체",
    title: "구조체를 함수 인자로",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>Rect</code> 구조체(<code>width</code>, <code>height</code>)를 " +
      "인자로 받는 <code>int area(Rect r)</code> 함수를 정의하고, <code>width = A</code>, <code>height = A + 2</code>인 " +
      "<code>Rect</code>를 넘겨 넓이를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "직사각형 넓이(<code>A × (A + 2)</code>)를 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "3", output: "15" },
      { input: "5", output: "35" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 3,
    concepts: ["structs", "functions", "io"],
    starter: STARTER("Rect를 받는 area 함수로 넓이를 출력하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int width;
    int height;
} Rect;

int area(Rect r) {
    return r.width * r.height;
}

int main(void) {
    int A;
    scanf("%d", &A);
    Rect r = { A, A + 2 };
    printf("%d\\n", area(r));
    return 0;
}
`,
    expected: (A) => String(A * (A + 2)),
  },
  {
    id: 72,
    tag: "중급 · 구조체",
    title: "구조체를 반환하는 함수",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>Point makePoint(int v)</code> 함수를 정의해 " +
      "<code>x = v</code>, <code>y = v</code>인 <code>Point</code>를 반환하도록 만들고, <code>makePoint(A)</code>를 호출한 뒤 " +
      "<code>x + y</code>의 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>x + y</code>의 값(<code>2A</code>)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "5", output: "10" },
      { input: "7", output: "14" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["structs", "functions", "io"],
    starter: STARTER("makePoint(A)의 x+y를 출력하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

Point makePoint(int v) {
    Point p;
    p.x = v;
    p.y = v;
    return p;
}

int main(void) {
    int A;
    scanf("%d", &A);
    Point p = makePoint(A);
    printf("%d\\n", p.x + p.y);
    return 0;
}
`,
    expected: (A) => String(2 * A),
  },
  {
    id: 73,
    tag: "중급 · 동적 메모리",
    title: "동적 문자열 만들기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>malloc</code>으로 길이 <code>A + 1</code>인 <code>char</code> 배열을 " +
      "할당해 <code>'a'</code>를 <code>A</code>번 채우고 마지막에 <code>'\\0'</code>을 넣어 문자열을 만든 뒤 " +
      "출력하고 <code>free</code>하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "만든 문자열을 출력합니다.",
    constraints: ["1 ≤ A ≤ 50"],
    examples: [
      { input: "3", output: "aaa" },
      { input: "5", output: "aaaaa" },
    ],
    aMin: 1,
    aMax: 50,
    aDefault: 5,
    concepts: ["memory", "strings", "loops"],
    starter: STARTER("malloc으로 길이 A+1의 char 배열을 만들어 문자열을 채우세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int A;
    scanf("%d", &A);
    char *s = (char *)malloc(sizeof(char) * (A + 1));
    for (int i = 0; i < A; i++) s[i] = 'a';
    s[A] = '\\0';
    printf("%s\\n", s);
    free(s);
    return 0;
}
`,
    expected: (A) => "a".repeat(A),
  },
  {
    id: 74,
    tag: "응용 · 재귀",
    title: "재귀로 짝수 개수 세기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <strong>재귀 함수</strong>로 <code>1</code>부터 <code>A</code>까지의 " +
      "정수 중 짝수의 개수를 구해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "짝수의 개수를 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "10", output: "5" },
      { input: "7", output: "3" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 10,
    concepts: ["recursion", "functions", "cond"],
    starter: STARTER("재귀로 1~A 중 짝수 개수를 출력하세요"),
    solution:
`#include <stdio.h>

int evens(int n) {
    if (n <= 0) return 0;
    if (n % 2 == 0) return 1 + evens(n - 1);
    return evens(n - 1);
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", evens(A));
    return 0;
}
`,
    expected: (A) => String(Math.floor(A / 2)),
  },
  {
    id: 75,
    tag: "기초 · 연산자",
    title: "복합 대입 연산자로 2의 거듭제곱",
    description:
      "<code>0</code> 이상의 정수 <code>A</code>가 주어집니다. <code>x</code>를 <code>1</code>로 시작해 " +
      "<code>x *= 2</code>를 <code>A</code>번 반복한 뒤 <code>x</code>를 출력하세요. (결과: <code>2^A</code>)",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>2^A</code>의 값을 출력합니다.",
    constraints: ["0 ≤ A ≤ 30"],
    examples: [
      { input: "0", output: "1" },
      { input: "5", output: "32" },
    ],
    aMin: 0,
    aMax: 30,
    aDefault: 5,
    concepts: ["operators", "loops", "vars"],
    starter: STARTER("x *= 2를 A번 반복해 2^A를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    long long x = 1;
    for (int i = 0; i < A; i++) x *= 2;
    printf("%lld\\n", x);
    return 0;
}
`,
    expected: (A) => String(2 ** A),
  },
  {
    id: 76,
    tag: "기초 · 자료형",
    title: "문자의 ASCII 값",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 알파벳 <code>'A'</code>부터 <code>A</code>번째 글자의 " +
      "ASCII 값을 정수로 출력하세요. 예) <code>A = 1</code> → <code>'A'</code>의 ASCII값 <code>65</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "ASCII 값을 정수로 출력합니다.",
    constraints: ["1 ≤ A ≤ 26"],
    examples: [
      { input: "1", output: "65" },
      { input: "26", output: "90" },
    ],
    aMin: 1,
    aMax: 26,
    aDefault: 1,
    concepts: ["vars", "operators", "io"],
    starter: STARTER("'A'+(A-1)을 int로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    char c = 'A' + (A - 1);
    printf("%d\\n", (int)c);
    return 0;
}
`,
    expected: (A) => String(64 + A),
  },
  {
    id: 77,
    tag: "기본 · 반복문",
    title: "5의 배수 만나면 break",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>1</code>부터 <code>A</code>까지 반복하면서 <code>5의 배수</code>를 만나면 " +
      "<code>break</code>하고, 그 전까지의 합을 출력하세요. (5의 배수 자체는 합산하지 않음)",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "5의 배수 직전까지의 누적합을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "3", output: "6" },
      { input: "10", output: "10" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 10,
    concepts: ["loops", "cond", "operators"],
    starter: STARTER("반복문에서 5의 배수를 만나면 break하고 그 전까지의 합을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int sum = 0;
    for (int i = 1; i <= A; i++) {
        if (i % 5 == 0) break;
        sum += i;
    }
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) => {
      let s = 0;
      for (let i = 1; i <= A; i++) {
        if (i % 5 === 0) break;
        s += i;
      }
      return String(s);
    },
  },
  {
    id: 78,
    tag: "중급 · 포인터",
    title: "함수 포인터로 연산",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>int doubleIt(int x)</code> 함수를 정의한 뒤, " +
      "<code>int (*fp)(int)</code> 함수 포인터에 <code>doubleIt</code>의 주소를 담아 " +
      "<code>fp(A)</code>의 결과를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>doubleIt(A) = 2A</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "5", output: "10" },
      { input: "21", output: "42" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["pointers", "functions", "io"],
    starter: STARTER("함수 포인터 fp에 doubleIt을 담아 fp(A)를 출력하세요"),
    solution:
`#include <stdio.h>

int doubleIt(int x) {
    return x * 2;
}

int main(void) {
    int A;
    scanf("%d", &A);
    int (*fp)(int) = doubleIt;
    printf("%d\\n", fp(A));
    return 0;
}
`,
    expected: (A) => String(A * 2),
  },
  {
    id: 79,
    tag: "중급 · 구조체",
    title: "typedef로 별칭 정의",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>typedef</code>로 <code>unsigned int</code>의 별칭 " +
      "<code>uint</code>를 정의하고, <code>uint x = A</code>로 선언한 뒤 <code>x</code>를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>x</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100000"],
    examples: [
      { input: "5", output: "5" },
      { input: "12345", output: "12345" },
    ],
    aMin: 1,
    aMax: 100000,
    aDefault: 5,
    concepts: ["structs", "vars", "io"],
    starter: STARTER("typedef로 uint 별칭을 만들어 사용하세요"),
    solution:
`#include <stdio.h>

typedef unsigned int uint;

int main(void) {
    int A;
    scanf("%d", &A);
    uint x = (uint)A;
    printf("%u\\n", x);
    return 0;
}
`,
    expected: (A) => String(A),
  },
  {
    id: 80,
    tag: "중급 · 동적 메모리",
    title: "연결 리스트 노드 한 개",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>int value</code>와 <code>struct Node *next</code>를 멤버로 가진 " +
      "<code>Node</code> 구조체를 <code>malloc</code>으로 한 개 만들어 <code>value = A</code>, <code>next = NULL</code>로 " +
      "초기화한 뒤 <code>value</code>를 출력하고 <code>free</code>하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>node-&gt;value</code>를 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "5", output: "5" },
      { input: "42", output: "42" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["memory", "structs", "pointers"],
    starter: STARTER("Node 한 개를 malloc해서 value=A로 초기화한 뒤 출력하세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

int main(void) {
    int A;
    scanf("%d", &A);
    Node *n = (Node *)malloc(sizeof(Node));
    n->value = A;
    n->next = NULL;
    printf("%d\\n", n->value);
    free(n);
    return 0;
}
`,
    expected: (A) => String(A),
  },
  {
    id: 81,
    tag: "기초 · 연산자",
    title: "비트 XOR로 마지막 비트 토글",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A ^ 1</code>(비트 XOR)을 계산해 출력하세요. " +
      "이 연산은 <code>A</code>의 마지막 비트를 뒤집습니다.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A ^ 1</code>의 값을 출력합니다.",
    constraints: ["0 ≤ A ≤ 1000"],
    examples: [
      { input: "5", output: "4" },
      { input: "8", output: "9" },
    ],
    aMin: 0,
    aMax: 1000,
    aDefault: 5,
    concepts: ["operators", "vars", "io"],
    starter: STARTER("A ^ 1의 값을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", A ^ 1);
    return 0;
}
`,
    expected: (A) => String(A ^ 1),
  },
  {
    id: 82,
    tag: "기본 · 배열",
    title: "문자열 배열에서 고르기",
    description:
      "<code>1</code> 이상 <code>3</code> 이하의 정수 <code>A</code>가 주어집니다. " +
      "<code>char *colors[3] = {\"red\", \"green\", \"blue\"}</code>로 문자열 배열을 만든 뒤, " +
      "<code>A - 1</code>번째 문자열을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "선택된 색 이름을 출력합니다.",
    constraints: ["1 ≤ A ≤ 3"],
    examples: [
      { input: "1", output: "red" },
      { input: "3", output: "blue" },
    ],
    aMin: 1,
    aMax: 3,
    aDefault: 2,
    concepts: ["arrays", "strings", "pointers"],
    starter: STARTER("문자열 배열에서 A-1번째 원소를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    const char *colors[3] = { "red", "green", "blue" };
    printf("%s\\n", colors[A - 1]);
    return 0;
}
`,
    expected: (A) => ["red", "green", "blue"][A - 1],
  },
  {
    id: 83,
    tag: "기초 · 조건문",
    title: "switch default 분기",
    description:
      "정수 <code>A</code>가 주어집니다. <code>switch</code>문으로 <code>A</code>가 <code>1</code>이면 <code>one</code>, " +
      "<code>2</code>면 <code>two</code>, <code>3</code>이면 <code>three</code>를 출력하고, 그 외 모든 값에는 " +
      "<code>default</code> 분기에서 <code>other</code>를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "분기 결과를 출력합니다.",
    constraints: ["0 ≤ A ≤ 10"],
    examples: [
      { input: "1", output: "one" },
      { input: "3", output: "three" },
      { input: "7", output: "other" },
    ],
    aMin: 0,
    aMax: 10,
    aDefault: 1,
    concepts: ["cond", "vars", "io"],
    starter: STARTER("switch문에 default 분기를 두어 분기 결과를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    switch (A) {
        case 1: printf("one\\n"); break;
        case 2: printf("two\\n"); break;
        case 3: printf("three\\n"); break;
        default: printf("other\\n"); break;
    }
    return 0;
}
`,
    expected: (A) =>
      A === 1 ? "one" : A === 2 ? "two" : A === 3 ? "three" : "other",
  },
  {
    id: 84,
    tag: "기본 · 반복문",
    title: "while(1) + break로 제곱 찾기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>while(1)</code> 무한 반복 안에서 <code>i</code>를 1부터 늘려가며 " +
      "<code>i * i &gt; A</code>인 가장 작은 <code>i</code>를 찾으면 <code>break</code>하고 그 <code>i</code>를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>i * i &gt; A</code>를 만족하는 최소 <code>i</code>를 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "10", output: "4" },
      { input: "16", output: "5" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 10,
    concepts: ["loops", "cond", "operators"],
    starter: STARTER("while(1)과 break로 i*i > A를 만족하는 최소 i를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int i = 1;
    while (1) {
        if (i * i > A) break;
        i++;
    }
    printf("%d\\n", i);
    return 0;
}
`,
    expected: (A) => {
      let i = 1;
      while (true) {
        if (i * i > A) break;
        i++;
      }
      return String(i);
    },
  },
  {
    id: 85,
    tag: "기초 · 자료형",
    title: "const 변수 사용",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>const int PI3 = 314</code>로 상수를 선언한 뒤, " +
      "<code>A * PI3</code>의 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A * 314</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "1", output: "314" },
      { input: "10", output: "3140" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 1,
    concepts: ["vars", "operators", "io"],
    starter: STARTER("const int 상수를 선언해 사용하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    const int PI3 = 314;
    printf("%d\\n", A * PI3);
    return 0;
}
`,
    expected: (A) => String(A * 314),
  },
  {
    id: 86,
    tag: "응용 · 배열",
    title: "버블 정렬",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열에 <code>A, A-1, ..., 1</code>을 저장한 뒤 " +
      "버블 정렬로 오름차순 정렬해 공백 구분으로 한 줄에 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "정렬된 결과(<code>1 2 3 ... A</code>)를 공백 구분으로 출력합니다.",
    constraints: ["1 ≤ A ≤ 20"],
    examples: [
      { input: "3", output: "1 2 3" },
      { input: "5", output: "1 2 3 4 5" },
    ],
    aMin: 1,
    aMax: 20,
    aDefault: 5,
    concepts: ["arrays", "loops", "cond"],
    starter: STARTER("배열에 A,A-1,...,1을 저장한 뒤 버블 정렬로 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[32];
    for (int i = 0; i < A; i++) arr[i] = A - i;
    for (int i = 0; i < A - 1; i++) {
        for (int j = 0; j < A - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
            }
        }
    }
    for (int i = 0; i < A; i++) {
        if (i > 0) printf(" ");
        printf("%d", arr[i]);
    }
    printf("\\n");
    return 0;
}
`,
    expected: (A) => Array.from({ length: A }, (_, i) => i + 1).join(" "),
  },
  {
    id: 87,
    tag: "기본 · 함수",
    title: "static 변수로 호출 횟수 세기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>int counter(void)</code> 함수를 정의해 " +
      "내부에 <code>static int</code> 변수를 두고 호출마다 1 증가시켜 반환하도록 만든 뒤, " +
      "이 함수를 <code>A</code>번 호출하고 마지막 반환값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>번째 호출의 반환값(<code>A</code>)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "3", output: "3" },
      { input: "10", output: "10" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 3,
    concepts: ["functions", "vars", "loops"],
    starter: STARTER("static 변수를 가진 counter()를 A번 호출하고 마지막 값을 출력하세요"),
    solution:
`#include <stdio.h>

int counter(void) {
    static int n = 0;
    n++;
    return n;
}

int main(void) {
    int A;
    scanf("%d", &A);
    int last = 0;
    for (int i = 0; i < A; i++) last = counter();
    printf("%d\\n", last);
    return 0;
}
`,
    expected: (A) => String(A),
  },
  {
    id: 88,
    tag: "기초 · 연산자",
    title: "비트 OR로 두 비트 합치기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A | (A &lt;&lt; 1)</code>의 값을 출력하세요. " +
      "(<code>A</code>와 <code>2A</code>의 비트를 OR로 합친 결과)",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A | (A &lt;&lt; 1)</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "1", output: "3" },
      { input: "5", output: "15" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["operators", "vars", "io"],
    starter: STARTER("A | (A << 1)의 값을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", A | (A << 1));
    return 0;
}
`,
    expected: (A) => String(A | (A << 1)),
  },
  {
    id: 89,
    tag: "기초 · 조건문",
    title: "논리 연산자로 범위 검사",
    description:
      "<code>0</code> 이상 <code>200</code> 이하의 정수 <code>A</code>가 주어집니다. 논리 연산자 <code>&amp;&amp;</code>로 " +
      "<code>A</code>가 <code>1</code> 이상 <code>99</code> 이하인지 검사해 그렇다면 <code>yes</code>, 아니면 <code>no</code>를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "범위 내면 <code>yes</code>, 아니면 <code>no</code>를 출력합니다.",
    constraints: ["0 ≤ A ≤ 200"],
    examples: [
      { input: "50", output: "yes" },
      { input: "0", output: "no" },
      { input: "150", output: "no" },
    ],
    aMin: 0,
    aMax: 200,
    aDefault: 50,
    concepts: ["cond", "operators", "io"],
    starter: STARTER("A가 [1, 99] 범위면 yes, 아니면 no를 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    if (A >= 1 && A <= 99) printf("yes\\n");
    else                   printf("no\\n");
    return 0;
}
`,
    expected: (A) => (A >= 1 && A <= 99 ? "yes" : "no"),
  },
  {
    id: 90,
    tag: "응용 · 재귀",
    title: "최소공배수 (gcd 활용)",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <strong>재귀로 정의된 <code>gcd</code></strong>를 만든 뒤, " +
      "<code>lcm(A, 12) = A × 12 / gcd(A, 12)</code>를 계산해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>lcm(A, 12)</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "4", output: "12" },
      { input: "5", output: "60" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["recursion", "functions", "operators"],
    starter: STARTER("재귀 gcd로 lcm(A, 12)를 계산해 출력하세요"),
    solution:
`#include <stdio.h>

int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}

int main(void) {
    int A;
    scanf("%d", &A);
    int g = gcd(A, 12);
    printf("%d\\n", (A * 12) / g);
    return 0;
}
`,
    expected: (A) => {
      const g = (a, b) => (b === 0 ? a : g(b, a % b));
      return String((A * 12) / g(A, 12));
    },
  },
  {
    id: 91,
    tag: "응용 · 배열",
    title: "2차원 배열 행 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A × A</code> 2차원 배열의 <code>mat[i][j] = i + j</code>로 채운 뒤, " +
      "각 행의 합을 한 줄에 공백 구분으로 출력하세요. (i, j는 0부터)",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>개의 행 합을 공백으로 구분해 출력합니다.",
    constraints: ["1 ≤ A ≤ 10"],
    examples: [
      { input: "3", output: "3 6 9" },
      { input: "2", output: "1 3" },
    ],
    aMin: 1,
    aMax: 10,
    aDefault: 3,
    concepts: ["arrays", "loops", "operators"],
    starter: STARTER("A x A 행렬을 i+j로 채우고 각 행의 합을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int mat[10][10];
    for (int i = 0; i < A; i++)
        for (int j = 0; j < A; j++) mat[i][j] = i + j;
    for (int i = 0; i < A; i++) {
        int s = 0;
        for (int j = 0; j < A; j++) s += mat[i][j];
        if (i > 0) printf(" ");
        printf("%d", s);
    }
    printf("\\n");
    return 0;
}
`,
    expected: (A) => {
      const rows = [];
      for (let i = 0; i < A; i++) {
        let s = 0;
        for (let j = 0; j < A; j++) s += i + j;
        rows.push(s);
      }
      return rows.join(" ");
    },
  },
  {
    id: 92,
    tag: "기초 · 자료형",
    title: "enum으로 요일 번호 매기기",
    description:
      "<code>0</code> 이상 <code>6</code> 이하의 정수 <code>A</code>가 주어집니다. " +
      "<code>enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }</code>을 정의하고, " +
      "<code>A</code>에 해당하는 요일을 짧은 이름(<code>MON</code>/<code>TUE</code>/...)으로 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "요일 약자를 출력합니다.",
    constraints: ["0 ≤ A ≤ 6"],
    examples: [
      { input: "0", output: "MON" },
      { input: "5", output: "SAT" },
    ],
    aMin: 0,
    aMax: 6,
    aDefault: 2,
    concepts: ["vars", "cond", "io"],
    starter: STARTER("enum과 switch로 요일 약자를 출력하세요"),
    solution:
`#include <stdio.h>

enum Day { MON, TUE, WED, THU, FRI, SAT, SUN };

int main(void) {
    int A;
    scanf("%d", &A);
    enum Day d = (enum Day)A;
    switch (d) {
        case MON: printf("MON\\n"); break;
        case TUE: printf("TUE\\n"); break;
        case WED: printf("WED\\n"); break;
        case THU: printf("THU\\n"); break;
        case FRI: printf("FRI\\n"); break;
        case SAT: printf("SAT\\n"); break;
        case SUN: printf("SUN\\n"); break;
    }
    return 0;
}
`,
    expected: (A) => ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][A],
  },
  {
    id: 93,
    tag: "중급 · 구조체",
    title: "중첩 구조체 (Rect의 중심점)",
    description:
      "양의 짝수 <code>A</code>가 주어집니다. <code>Point</code>(<code>x, y</code>)를 멤버로 갖는 " +
      "<code>Rect</code>(<code>width, height, Point center</code>)를 정의하고, " +
      "<code>width = A</code>, <code>height = A</code>, <code>center = (A/2, A/2)</code>로 초기화한 뒤 " +
      "<code>center.x + center.y</code>를 출력하세요.",
    inputDesc: "첫 줄에 짝수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>center.x + center.y</code>의 값(<code>A</code>)을 출력합니다.",
    constraints: ["2 ≤ A ≤ 1000", "A는 짝수"],
    examples: [
      { input: "4", output: "4" },
      { input: "10", output: "10" },
    ],
    aMin: 2,
    aMax: 1000,
    aDefault: 4,
    concepts: ["structs", "vars", "io"],
    starter: STARTER("중첩 구조체로 center.x + center.y를 출력하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

typedef struct {
    int width;
    int height;
    Point center;
} Rect;

int main(void) {
    int A;
    scanf("%d", &A);
    Rect r;
    r.width = A;
    r.height = A;
    r.center.x = A / 2;
    r.center.y = A / 2;
    printf("%d\\n", r.center.x + r.center.y);
    return 0;
}
`,
    expected: (A) => String(2 * Math.floor(A / 2)),
  },
  {
    id: 94,
    tag: "중급 · 동적 메모리",
    title: "두 노드 연결 리스트 합",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>value</code>와 <code>next</code> 멤버를 가진 " +
      "<code>Node</code> 구조체를 두 개 <code>malloc</code>하고, 첫 번째 노드는 <code>value = A</code>, " +
      "두 번째는 <code>value = A + 1</code>로 연결한 뒤, 리스트를 순회하며 <code>value</code>들의 합을 " +
      "출력하고 두 노드를 모두 <code>free</code>하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "두 노드 값의 합(<code>2A + 1</code>)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "5", output: "11" },
      { input: "10", output: "21" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["memory", "structs", "pointers"],
    starter: STARTER("Node 두 개를 연결해 합을 출력하고 free하세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>
#include <stddef.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

int main(void) {
    int A;
    scanf("%d", &A);
    Node *n1 = (Node *)malloc(sizeof(Node));
    Node *n2 = (Node *)malloc(sizeof(Node));
    n1->value = A;
    n1->next = n2;
    n2->value = A + 1;
    n2->next = NULL;
    int sum = 0;
    for (Node *cur = n1; cur != NULL; cur = cur->next) sum += cur->value;
    printf("%d\\n", sum);
    free(n2);
    free(n1);
    return 0;
}
`,
    expected: (A) => String(2 * A + 1),
  },
  {
    id: 95,
    tag: "응용 · 재귀",
    title: "재귀로 알파벳 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <strong>재귀 함수</strong>로 <code>'a'</code>부터 <code>A</code>개의 " +
      "알파벳을 한 줄에 이어서 출력하세요. 예) <code>A = 4</code> → <code>abcd</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>'a'</code>부터 <code>A</code>개 알파벳을 출력합니다.",
    constraints: ["1 ≤ A ≤ 26"],
    examples: [
      { input: "3", output: "abc" },
      { input: "5", output: "abcde" },
    ],
    aMin: 1,
    aMax: 26,
    aDefault: 5,
    concepts: ["recursion", "functions", "strings"],
    starter: STARTER("재귀로 'a'부터 A개 알파벳을 출력하세요"),
    solution:
`#include <stdio.h>

void printAlpha(int n, int total) {
    if (n > total) return;
    printf("%c", 'a' + n - 1);
    printAlpha(n + 1, total);
}

int main(void) {
    int A;
    scanf("%d", &A);
    printAlpha(1, A);
    printf("\\n");
    return 0;
}
`,
    expected: (A) => "abcdefghijklmnopqrstuvwxyz".slice(0, A),
  },
  {
    id: 96,
    tag: "기본 · 함수",
    title: "함수가 다른 함수 호출",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>int twice(int x) { return x * 2; }</code>와 " +
      "<code>int addTen(int x) { return twice(x) + 10; }</code>를 정의한 뒤, <code>addTen(A)</code>의 결과를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>2A + 10</code>의 값을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "3", output: "16" },
      { input: "5", output: "20" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 3,
    concepts: ["functions", "operators", "io"],
    starter: STARTER("addTen(A) = twice(A) + 10의 값을 출력하세요"),
    solution:
`#include <stdio.h>

int twice(int x) {
    return x * 2;
}

int addTen(int x) {
    return twice(x) + 10;
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", addTen(A));
    return 0;
}
`,
    expected: (A) => String(2 * A + 10),
  },
  {
    id: 97,
    tag: "응용 · 배열",
    title: "배열 오른쪽 회전",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열에 <code>1, 2, ..., A</code>를 저장한 뒤, " +
      "오른쪽으로 한 칸 회전한 결과 (<code>A, 1, 2, ..., A-1</code>)를 공백 구분으로 한 줄에 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "회전된 배열을 공백으로 구분해 출력합니다.",
    constraints: ["1 ≤ A ≤ 30"],
    examples: [
      { input: "3", output: "3 1 2" },
      { input: "5", output: "5 1 2 3 4" },
    ],
    aMin: 1,
    aMax: 30,
    aDefault: 5,
    concepts: ["arrays", "loops", "operators"],
    starter: STARTER("배열을 오른쪽으로 한 칸 회전해 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[32];
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    int last = arr[A - 1];
    for (int i = A - 1; i > 0; i--) arr[i] = arr[i - 1];
    arr[0] = last;
    for (int i = 0; i < A; i++) {
        if (i > 0) printf(" ");
        printf("%d", arr[i]);
    }
    printf("\\n");
    return 0;
}
`,
    expected: (A) => {
      if (A === 1) return "1";
      const out = [A];
      for (let i = 1; i < A; i++) out.push(i);
      return out.join(" ");
    },
  },
  {
    id: 98,
    tag: "기초 · 연산자",
    title: "단항 마이너스로 부호 반전",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 단항 마이너스 연산자(<code>-A</code>)로 부호를 바꾼 값을 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>-A</code>를 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "5", output: "-5" },
      { input: "100", output: "-100" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["operators", "vars", "io"],
    starter: STARTER("-A의 값을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", -A);
    return 0;
}
`,
    expected: (A) => String(-A),
  },
  {
    id: 99,
    tag: "기초 · 조건문",
    title: "논리 부정 연산자",
    description:
      "<code>0</code> 이상의 정수 <code>A</code>가 주어집니다. 논리 부정 연산자 <code>!</code>를 사용해 " +
      "<code>!A</code>가 참이면 <code>zero</code>, 그렇지 않으면 <code>nonzero</code>를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>가 0이면 <code>zero</code>, 아니면 <code>nonzero</code>.",
    constraints: ["0 ≤ A ≤ 1000"],
    examples: [
      { input: "0", output: "zero" },
      { input: "5", output: "nonzero" },
    ],
    aMin: 0,
    aMax: 1000,
    aDefault: 5,
    concepts: ["cond", "operators", "io"],
    starter: STARTER("!A로 0/nonzero를 분기해 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    if (!A) printf("zero\\n");
    else    printf("nonzero\\n");
    return 0;
}
`,
    expected: (A) => (A === 0 ? "zero" : "nonzero"),
  },
  {
    id: 100,
    tag: "응용 · 반복문",
    title: "역삼각형 별 패턴",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>i</code>번째 줄(1~<code>A</code>)에 별 <code>'*'</code>을 " +
      "<code>(A - i + 1)</code>개 출력해 역삼각형을 만드세요. 예) <code>A = 3</code> → <code>***</code> / <code>**</code> / <code>*</code>",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>줄로 이루어진 역삼각형을 출력합니다.",
    constraints: ["1 ≤ A ≤ 20"],
    examples: [
      { input: "3", output: "***\n**\n*" },
      { input: "1", output: "*" },
    ],
    aMin: 1,
    aMax: 20,
    aDefault: 4,
    concepts: ["loops", "strings", "operators"],
    starter: STARTER("높이 A인 역삼각형(별)을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 1; i <= A; i++) {
        int count = A - i + 1;
        for (int j = 0; j < count; j++) printf("*");
        printf("\\n");
    }
    return 0;
}
`,
    expected: (A) =>
      Array.from({ length: A }, (_, i) => "*".repeat(A - i)).join("\n"),
  },
  {
    id: 101,
    tag: "중급 · 동적 메모리",
    title: "동적 배열로 평균",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>malloc</code>으로 길이 <code>A</code>인 배열을 잡고 " +
      "<code>1, 2, ..., A</code>를 저장한 뒤 평균(정수 나눗셈)을 출력하고 <code>free</code>하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>1 + 2 + ... + A</code>의 평균을 정수로 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "3" },
      { input: "4", output: "2" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["memory", "arrays", "operators"],
    starter: STARTER("malloc 배열로 1~A 평균을 정수 출력하세요"),
    solution:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int *arr = (int *)malloc(sizeof(int) * A);
    for (int i = 0; i < A; i++) arr[i] = i + 1;
    int sum = 0;
    for (int i = 0; i < A; i++) sum += arr[i];
    printf("%d\\n", sum / A);
    free(arr);
    return 0;
}
`,
    expected: (A) => String(Math.floor(((A * (A + 1)) / 2) / A)),
  },
  {
    id: 102,
    tag: "중급 · 구조체",
    title: "두 Point 더하기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>Point</code> 구조체 두 개 <code>p1 = (A, A + 1)</code>과 " +
      "<code>p2 = (1, 2)</code>를 만든 뒤, 각 좌표를 더해 합 좌표의 <code>x + y</code>를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>(p1.x + p2.x) + (p1.y + p2.y)</code> 값(<code>2A + 4</code>)을 출력합니다.",
    constraints: ["1 ≤ A ≤ 1000"],
    examples: [
      { input: "3", output: "10" },
      { input: "5", output: "14" },
    ],
    aMin: 1,
    aMax: 1000,
    aDefault: 5,
    concepts: ["structs", "operators", "io"],
    starter: STARTER("두 Point를 더한 결과의 x+y를 출력하세요"),
    solution:
`#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int main(void) {
    int A;
    scanf("%d", &A);
    Point p1 = { A, A + 1 };
    Point p2 = { 1, 2 };
    Point sum;
    sum.x = p1.x + p2.x;
    sum.y = p1.y + p2.y;
    printf("%d\\n", sum.x + sum.y);
    return 0;
}
`,
    expected: (A) => String(2 * A + 4),
  },
  {
    id: 103,
    tag: "중급 · 포인터",
    title: "두 포인터 사이 거리",
    description:
      "양의 정수 <code>A</code>가 주어집니다. 길이 <code>A</code>인 배열을 만들고, 두 포인터 <code>start = arr</code>와 " +
      "<code>end = arr + A</code>를 만들어 <code>end - start</code>(원소 개수)를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "두 포인터 사이 원소 개수(<code>A</code>)를 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "5" },
      { input: "10", output: "10" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 5,
    concepts: ["pointers", "arrays", "operators"],
    starter: STARTER("포인터 산술로 end - start의 값을 출력하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int arr[100];
    int *start = arr;
    int *end = arr + A;
    printf("%ld\\n", (long)(end - start));
    return 0;
}
`,
    expected: (A) => String(A),
  },
  {
    id: 104,
    tag: "응용 · 재귀",
    title: "재귀로 자릿수 개수",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <strong>재귀 함수</strong>로 <code>A</code>가 몇 자리 수인지 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code>의 자릿수 개수를 출력합니다.",
    constraints: ["1 ≤ A ≤ 99999"],
    examples: [
      { input: "9", output: "1" },
      { input: "1234", output: "4" },
    ],
    aMin: 1,
    aMax: 99999,
    aDefault: 1234,
    concepts: ["recursion", "functions", "operators"],
    starter: STARTER("재귀로 A의 자릿수 개수를 출력하세요"),
    solution:
`#include <stdio.h>

int digits(int n) {
    if (n < 10) return 1;
    return 1 + digits(n / 10);
}

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", digits(A));
    return 0;
}
`,
    expected: (A) => String(String(A).length),
  },
  {
    id: 105,
    tag: "기본 · 반복문",
    title: "continue로 홀수 건너뛰기",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>1</code>부터 <code>A</code>까지 반복하면서 <code>continue</code>로 " +
      "홀수를 건너뛰고, 짝수만 합산한 결과를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>A</code> 이하 짝수의 합을 출력합니다.",
    constraints: ["1 ≤ A ≤ 100"],
    examples: [
      { input: "5", output: "6" },
      { input: "10", output: "30" },
    ],
    aMin: 1,
    aMax: 100,
    aDefault: 10,
    concepts: ["loops", "cond", "operators"],
    starter: STARTER("continue로 홀수를 건너뛰고 짝수만 합산하세요"),
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int sum = 0;
    for (int i = 1; i <= A; i++) {
        if (i % 2 != 0) continue;
        sum += i;
    }
    printf("%d\\n", sum);
    return 0;
}
`,
    expected: (A) => {
      let s = 0;
      for (let i = 1; i <= A; i++) {
        if (i % 2 !== 0) continue;
        s += i;
      }
      return String(s);
    },
  },
  /* =====================================================================
     MEDIUM tier — multi-input "Codetree-style" problems.
     Unlocked when survey level == "intermediate" or "advanced".
     Each entry sets difficulty:"medium" and `inputs: [{ name, min, max, desc }]`.
     `expected({ A, B, ... })` receives an object keyed by `inputs[i].name`.
     ===================================================================== */
  {
    id: 106,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "두 과목 시험 결과",
    description:
      "Paul과 Bob이 두 교과목에 대해 시험을 봤습니다. " +
      "Paul의 점수는 각각 <code>A</code>, <code>B</code>이고, Bob의 점수는 각각 <code>X</code>, <code>Y</code>입니다. " +
      "다음 조건에 따라 시험 결과를 출력하는 프로그램을 작성하세요.<br>" +
      "1. 각 교과목에 대한 두 사람의 점수의 합이 두 교과목 모두 홀수이면, <code>odd</code>를 출력합니다.<br>" +
      "2. 각 교과목에 대한 두 사람의 점수의 합이 두 교과목 모두 짝수이면, <code>even</code>을 출력합니다.<br>" +
      "3. 위 조건들에 모두 해당하지 않을 경우, <code>mix</code>를 출력합니다.",
    inputDesc:
      "첫 줄에 정수 <code>A</code>가 주어집니다.<br>" +
      "그다음 줄에 정수 <code>B</code>가 주어집니다.<br>" +
      "그다음 줄에 정수 <code>X</code>가 주어집니다.<br>" +
      "그다음 줄에 정수 <code>Y</code>가 주어집니다.",
    outputDesc:
      "조건에 따라 <code>odd</code>, <code>even</code>, <code>mix</code> 중 하나를 출력합니다.",
    constraints: ["0 ≤ A, B, X, Y ≤ 100"],
    examples: [
      { input: "3\n5\n4\n6", output: "mix" },
      { input: "1\n3\n5\n7", output: "odd" },
      { input: "2\n4\n6\n8", output: "even" },
    ],
    inputs: [
      { name: "A", min: 0, max: 100, desc: "Paul의 첫 교과목 점수" },
      { name: "B", min: 0, max: 100, desc: "Paul의 두 번째 교과목 점수" },
      { name: "X", min: 0, max: 100, desc: "Bob의 첫 교과목 점수" },
      { name: "Y", min: 0, max: 100, desc: "Bob의 두 번째 교과목 점수" },
    ],
    // Override the auto min/mid/max sampling so the dock surfaces one case
    // of each verdict (odd / even / mix) instead of three identical "even"s.
    testCases: [
      { input: "1\n3\n5\n7", expected: "odd" },
      { input: "2\n4\n6\n8", expected: "even" },
      { input: "3\n5\n4\n6", expected: "mix" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B, X, Y;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &X);
    scanf("%d", &Y);

    // TODO: 두 과목의 점수 합 패리티로 odd / even / mix를 분기 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B, X, Y;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &X);
    scanf("%d", &Y);
    int s1 = A + X;
    int s2 = B + Y;
    if (s1 % 2 == 1 && s2 % 2 == 1) {
        printf("odd\\n");
    } else if (s1 % 2 == 0 && s2 % 2 == 0) {
        printf("even\\n");
    } else {
        printf("mix\\n");
    }
    return 0;
}
`,
    expected: ({ A, B, X, Y }) => {
      const s1 = A + X, s2 = B + Y;
      if (s1 % 2 === 1 && s2 % 2 === 1) return "odd";
      if (s1 % 2 === 0 && s2 % 2 === 0) return "even";
      return "mix";
    },
  },
  /* =====================================================================
     KILLER tier — long simulation/algorithm problems.
     Unlocked only at survey level == "advanced".
     Each entry sets difficulty:"killer" and ships hardcoded `testCases`.
     The `expected` function is omitted; getTestCases reads testCases directly.
     ===================================================================== */
  {
    id: 107,
    difficulty: "killer",
    tag: "킬러 · 시뮬레이션",
    title: "달팽이 행렬",
    description:
      "양의 정수 <code>N</code>이 주어집니다. <code>N × N</code> 격자의 좌상단(0,0)에서 시작해 오른쪽 방향부터 " +
      "시계 방향으로 빙글빙글 돌며 <code>1</code>부터 <code>N²</code>까지의 숫자를 채워 넣은 결과를 " +
      "행 단위로 한 줄씩 출력하세요. 같은 행의 숫자들은 공백으로 구분합니다.",
    inputDesc: "첫 줄에 정수 <code>N</code>이 주어집니다.",
    outputDesc: "<code>N</code>개의 줄에 걸쳐 채워진 격자를 출력합니다.",
    constraints: ["1 ≤ N ≤ 20"],
    examples: [
      { input: "1", output: "1" },
      { input: "3", output: "1 2 3\n8 9 4\n7 6 5" },
      { input: "4", output: "1 2 3 4\n12 13 14 5\n11 16 15 6\n10 9 8 7" },
    ],
    testCases: [
      { input: "1", expected: "1" },
      { input: "3", expected: "1 2 3\n8 9 4\n7 6 5" },
      {
        input: "5",
        expected:
          "1 2 3 4 5\n16 17 18 19 6\n15 24 25 20 7\n14 23 22 21 8\n13 12 11 10 9",
      },
    ],
    concepts: ["arrays", "loops", "cond"],
    starter:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);

    int grid[25][25];
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            grid[i][j] = 0;

    // TODO: 1부터 N*N까지 시계 방향 달팽이로 grid 채우기

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            if (j > 0) printf(" ");
            printf("%d", grid[i][j]);
        }
        printf("\\n");
    }
    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);
    int grid[25][25];
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            grid[i][j] = 0;
    int dr[4] = {0, 1, 0, -1};
    int dc[4] = {1, 0, -1, 0};
    int r = 0, c = 0, d = 0;
    for (int v = 1; v <= N * N; v++) {
        grid[r][c] = v;
        int nr = r + dr[d];
        int nc = c + dc[d];
        if (nr < 0 || nr >= N || nc < 0 || nc >= N || grid[nr][nc] != 0) {
            d = (d + 1) % 4;
        }
        r += dr[d];
        c += dc[d];
    }
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            if (j > 0) printf(" ");
            printf("%d", grid[i][j]);
        }
        printf("\\n");
    }
    return 0;
}
`,
  },
  /* --- cond medium (9 more, to total 10 for cond) --- */
  {
    id: 108,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "세 과목 평균 등급",
    description:
      "세 과목 점수 <code>A</code>, <code>B</code>, <code>C</code>가 주어집니다. " +
      "세 점수의 평균(정수 나눗셈)에 따라 등급을 출력하세요.<br>" +
      "- 평균이 90 이상이면 <code>A</code><br>" +
      "- 80 이상이면 <code>B</code><br>" +
      "- 70 이상이면 <code>C</code><br>" +
      "- 그 외에는 <code>F</code>",
    inputDesc:
      "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>, 그다음 줄에 <code>C</code>가 주어집니다.",
    outputDesc: "등급 한 글자를 출력합니다.",
    constraints: ["0 ≤ A, B, C ≤ 100"],
    examples: [
      { input: "95\n90\n92", output: "A" },
      { input: "70\n80\n60", output: "C" },
      { input: "50\n40\n30", output: "F" },
    ],
    inputs: [
      { name: "A", min: 0, max: 100, desc: "1번 과목 점수" },
      { name: "B", min: 0, max: 100, desc: "2번 과목 점수" },
      { name: "C", min: 0, max: 100, desc: "3번 과목 점수" },
    ],
    testCases: [
      { input: "95\n90\n92", expected: "A" },
      { input: "70\n80\n60", expected: "C" },
      { input: "50\n40\n30", expected: "F" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);

    // TODO: 평균을 구해 A/B/C/F 등급 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);
    int avg = (A + B + C) / 3;
    if (avg >= 90)      printf("A\\n");
    else if (avg >= 80) printf("B\\n");
    else if (avg >= 70) printf("C\\n");
    else                printf("F\\n");
    return 0;
}
`,
    expected: ({ A, B, C }) => {
      const avg = Math.floor((A + B + C) / 3);
      if (avg >= 90) return "A";
      if (avg >= 80) return "B";
      if (avg >= 70) return "C";
      return "F";
    },
  },
  {
    id: 109,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "자판기 거스름돈",
    description:
      "물건의 가격 <code>P</code>와 손님이 낸 금액 <code>M</code>이 주어집니다. " +
      "<code>M</code>이 <code>P</code> 이상이면 거스름돈 <code>M - P</code>를 출력하고, " +
      "그렇지 않으면 <code>need more</code>를 출력하세요.",
    inputDesc:
      "첫 줄에 가격 <code>P</code>, 그다음 줄에 지불 금액 <code>M</code>이 주어집니다.",
    outputDesc: "거스름돈 또는 <code>need more</code>를 출력합니다.",
    constraints: ["1 ≤ P, M ≤ 100000"],
    examples: [
      { input: "1500\n2000", output: "500" },
      { input: "3000\n1000", output: "need more" },
    ],
    inputs: [
      { name: "P", min: 1, max: 100000, desc: "물건 가격" },
      { name: "M", min: 1, max: 100000, desc: "낸 금액" },
    ],
    testCases: [
      { input: "1500\n2000", expected: "500" },
      { input: "3000\n1000", expected: "need more" },
      { input: "500\n500", expected: "0" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int P, M;
    scanf("%d", &P);
    scanf("%d", &M);

    // TODO: M >= P 이면 거스름돈, 아니면 need more

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int P, M;
    scanf("%d", &P);
    scanf("%d", &M);
    if (M >= P) printf("%d\\n", M - P);
    else        printf("need more\\n");
    return 0;
}
`,
    expected: ({ P, M }) => (M >= P ? String(M - P) : "need more"),
  },
  {
    id: 110,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "윤년 판정",
    description:
      "양의 정수 <code>Y</code>(연도)가 주어집니다. <code>Y</code>가 윤년이면 <code>leap</code>, " +
      "그렇지 않으면 <code>common</code>을 출력하세요.<br>" +
      "윤년 규칙: 4의 배수이고 100의 배수가 아니거나, 400의 배수이면 윤년입니다.",
    inputDesc: "첫 줄에 연도 <code>Y</code>가 주어집니다.",
    outputDesc: "<code>leap</code> 또는 <code>common</code>을 출력합니다.",
    constraints: ["1900 ≤ Y ≤ 2100"],
    examples: [
      { input: "2024", output: "leap" },
      { input: "2023", output: "common" },
      { input: "2000", output: "leap" },
      { input: "1900", output: "common" },
    ],
    inputs: [
      { name: "Y", min: 1900, max: 2100, desc: "연도" },
    ],
    testCases: [
      { input: "2024", expected: "leap" },
      { input: "2023", expected: "common" },
      { input: "2000", expected: "leap" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int Y;
    scanf("%d", &Y);

    // TODO: 윤년 판정

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int Y;
    scanf("%d", &Y);
    int leap = (Y % 4 == 0 && Y % 100 != 0) || (Y % 400 == 0);
    if (leap) printf("leap\\n");
    else      printf("common\\n");
    return 0;
}
`,
    expected: ({ Y }) =>
      (Y % 4 === 0 && Y % 100 !== 0) || Y % 400 === 0 ? "leap" : "common",
  },
  {
    id: 111,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "삼각형 종류 판별",
    description:
      "삼각형의 세 변 길이 <code>A</code>, <code>B</code>, <code>C</code>가 주어집니다. " +
      "세 변이 모두 같으면 <code>equilateral</code>, 두 변만 같으면 <code>isosceles</code>, " +
      "모두 다르면 <code>scalene</code>을 출력하세요.",
    inputDesc:
      "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>, 그다음 줄에 <code>C</code>가 주어집니다.",
    outputDesc: "삼각형 종류를 출력합니다.",
    constraints: ["1 ≤ A, B, C ≤ 100"],
    examples: [
      { input: "3\n3\n3", output: "equilateral" },
      { input: "5\n5\n7", output: "isosceles" },
      { input: "3\n4\n5", output: "scalene" },
    ],
    inputs: [
      { name: "A", min: 1, max: 100, desc: "변 A" },
      { name: "B", min: 1, max: 100, desc: "변 B" },
      { name: "C", min: 1, max: 100, desc: "변 C" },
    ],
    testCases: [
      { input: "3\n3\n3", expected: "equilateral" },
      { input: "5\n5\n7", expected: "isosceles" },
      { input: "3\n4\n5", expected: "scalene" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);

    // TODO: 세 변 비교로 삼각형 종류 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);
    if (A == B && B == C)       printf("equilateral\\n");
    else if (A == B || B == C || A == C) printf("isosceles\\n");
    else                        printf("scalene\\n");
    return 0;
}
`,
    expected: ({ A, B, C }) => {
      if (A === B && B === C) return "equilateral";
      if (A === B || B === C || A === C) return "isosceles";
      return "scalene";
    },
  },
  {
    id: 112,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "시간 차이를 분으로",
    description:
      "시작 시각 <code>h1</code>시 <code>m1</code>분과 종료 시각 <code>h2</code>시 <code>m2</code>분이 주어집니다. " +
      "두 시각 사이의 시간 차이를 분 단위로 출력하세요. (24시간 시계, 같은 날 기준)",
    inputDesc:
      "첫 줄에 <code>h1</code>, 그다음 줄에 <code>m1</code>, 그다음 줄에 <code>h2</code>, 그다음 줄에 <code>m2</code>가 주어집니다.",
    outputDesc: "<code>(h2*60 + m2) - (h1*60 + m1)</code>의 값을 출력합니다.",
    constraints: ["0 ≤ h1, h2 ≤ 23", "0 ≤ m1, m2 ≤ 59"],
    examples: [
      { input: "9\n30\n10\n45", output: "75" },
      { input: "10\n0\n9\n0", output: "-60" },
    ],
    inputs: [
      { name: "h1", min: 0, max: 23, desc: "시작 시" },
      { name: "m1", min: 0, max: 59, desc: "시작 분" },
      { name: "h2", min: 0, max: 23, desc: "종료 시" },
      { name: "m2", min: 0, max: 59, desc: "종료 분" },
    ],
    testCases: [
      { input: "9\n30\n10\n45", expected: "75" },
      { input: "10\n0\n9\n0", expected: "-60" },
      { input: "0\n0\n23\n59", expected: "1439" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int h1, m1, h2, m2;
    scanf("%d", &h1);
    scanf("%d", &m1);
    scanf("%d", &h2);
    scanf("%d", &m2);

    // TODO: 분 단위 차이 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int h1, m1, h2, m2;
    scanf("%d", &h1);
    scanf("%d", &m1);
    scanf("%d", &h2);
    scanf("%d", &m2);
    printf("%d\\n", (h2 * 60 + m2) - (h1 * 60 + m1));
    return 0;
}
`,
    expected: ({ h1, m1, h2, m2 }) =>
      String((h2 * 60 + m2) - (h1 * 60 + m1)),
  },
  {
    id: 113,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "좌표 사분면",
    description:
      "정수 좌표 <code>(x, y)</code>가 주어집니다. <code>x</code> 또는 <code>y</code>가 0이면 <code>axis</code>를, " +
      "아니면 점이 위치한 사분면 번호(<code>1</code>~<code>4</code>)를 출력하세요.",
    inputDesc: "첫 줄에 <code>x</code>, 그다음 줄에 <code>y</code>가 주어집니다.",
    outputDesc: "사분면 번호 또는 <code>axis</code>를 출력합니다.",
    constraints: ["-1000 ≤ x, y ≤ 1000"],
    examples: [
      { input: "3\n4", output: "1" },
      { input: "-2\n5", output: "2" },
      { input: "-3\n-1", output: "3" },
      { input: "0\n5", output: "axis" },
    ],
    inputs: [
      { name: "x", min: -1000, max: 1000, desc: "x 좌표" },
      { name: "y", min: -1000, max: 1000, desc: "y 좌표" },
    ],
    testCases: [
      { input: "3\n4", expected: "1" },
      { input: "-2\n5", expected: "2" },
      { input: "0\n5", expected: "axis" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int x, y;
    scanf("%d", &x);
    scanf("%d", &y);

    // TODO: 사분면 번호 또는 axis 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int x, y;
    scanf("%d", &x);
    scanf("%d", &y);
    if (x == 0 || y == 0)      printf("axis\\n");
    else if (x > 0 && y > 0)   printf("1\\n");
    else if (x < 0 && y > 0)   printf("2\\n");
    else if (x < 0 && y < 0)   printf("3\\n");
    else                       printf("4\\n");
    return 0;
}
`,
    expected: ({ x, y }) => {
      if (x === 0 || y === 0) return "axis";
      if (x > 0 && y > 0) return "1";
      if (x < 0 && y > 0) return "2";
      if (x < 0 && y < 0) return "3";
      return "4";
    },
  },
  {
    id: 114,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "가위바위보",
    description:
      "두 사람이 가위바위보를 합니다. 각 사람의 손은 <code>1=rock</code>, <code>2=scissors</code>, " +
      "<code>3=paper</code>로 입력됩니다. 첫 번째 사람의 손이 <code>A</code>, 두 번째 사람의 손이 <code>B</code>입니다. " +
      "<code>A</code>가 이기면 <code>first</code>, <code>B</code>가 이기면 <code>second</code>, 비기면 <code>draw</code>를 출력하세요.",
    inputDesc:
      "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "<code>first</code>, <code>second</code>, <code>draw</code> 중 하나를 출력합니다.",
    constraints: ["A, B ∈ {1, 2, 3}"],
    examples: [
      { input: "1\n2", output: "first" },
      { input: "3\n1", output: "first" },
      { input: "2\n2", output: "draw" },
    ],
    inputs: [
      { name: "A", min: 1, max: 3, desc: "첫 번째 사람의 손" },
      { name: "B", min: 1, max: 3, desc: "두 번째 사람의 손" },
    ],
    testCases: [
      { input: "1\n2", expected: "first" },
      { input: "2\n1", expected: "second" },
      { input: "3\n3", expected: "draw" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: 가위바위보 결과 출력 (1=rock, 2=scissors, 3=paper)

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    if (A == B) printf("draw\\n");
    else if ((A == 1 && B == 2) || (A == 2 && B == 3) || (A == 3 && B == 1))
        printf("first\\n");
    else
        printf("second\\n");
    return 0;
}
`,
    expected: ({ A, B }) => {
      if (A === B) return "draw";
      if ((A === 1 && B === 2) || (A === 2 && B === 3) || (A === 3 && B === 1))
        return "first";
      return "second";
    },
  },
  {
    id: 115,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "직각삼각형 판정",
    description:
      "세 변 <code>A</code>, <code>B</code>, <code>C</code>가 주어집니다. 세 변으로 직각삼각형을 만들 수 있으면 " +
      "<code>yes</code>, 아니면 <code>no</code>를 출력하세요. (<code>a² + b² = c²</code>이 어떤 순서로든 성립하면 yes)",
    inputDesc:
      "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>, 그다음 줄에 <code>C</code>가 주어집니다.",
    outputDesc: "<code>yes</code> 또는 <code>no</code>를 출력합니다.",
    constraints: ["1 ≤ A, B, C ≤ 100"],
    examples: [
      { input: "3\n4\n5", output: "yes" },
      { input: "5\n12\n13", output: "yes" },
      { input: "2\n3\n4", output: "no" },
    ],
    inputs: [
      { name: "A", min: 1, max: 100, desc: "변 A" },
      { name: "B", min: 1, max: 100, desc: "변 B" },
      { name: "C", min: 1, max: 100, desc: "변 C" },
    ],
    testCases: [
      { input: "3\n4\n5", expected: "yes" },
      { input: "5\n12\n13", expected: "yes" },
      { input: "2\n3\n4", expected: "no" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);

    // TODO: 직각삼각형 판정 후 yes/no 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);
    int a2 = A * A, b2 = B * B, c2 = C * C;
    if (a2 + b2 == c2 || a2 + c2 == b2 || b2 + c2 == a2)
        printf("yes\\n");
    else
        printf("no\\n");
    return 0;
}
`,
    expected: ({ A, B, C }) => {
      const a2 = A * A, b2 = B * B, c2 = C * C;
      if (a2 + b2 === c2 || a2 + c2 === b2 || b2 + c2 === a2) return "yes";
      return "no";
    },
  },
  {
    id: 116,
    difficulty: "medium",
    tag: "중급 · 조건문",
    title: "회원 등급",
    description:
      "누적 구매액 <code>S</code>(원)와 누적 포인트 <code>P</code>가 주어집니다. 다음 규칙으로 등급을 출력하세요.<br>" +
      "- <code>S ≥ 1000000</code> 그리고 <code>P ≥ 10000</code>: <code>VIP</code><br>" +
      "- <code>S ≥ 500000</code> 또는 <code>P ≥ 5000</code>: <code>GOLD</code><br>" +
      "- <code>S ≥ 100000</code> 또는 <code>P ≥ 1000</code>: <code>SILVER</code><br>" +
      "- 그 외: <code>BRONZE</code><br>" +
      "(위에서 먼저 만족하는 등급으로 결정합니다.)",
    inputDesc:
      "첫 줄에 <code>S</code>, 그다음 줄에 <code>P</code>가 주어집니다.",
    outputDesc: "<code>VIP</code>/<code>GOLD</code>/<code>SILVER</code>/<code>BRONZE</code> 중 하나를 출력합니다.",
    constraints: ["0 ≤ S ≤ 10000000", "0 ≤ P ≤ 100000"],
    examples: [
      { input: "2000000\n15000", output: "VIP" },
      { input: "600000\n2000", output: "GOLD" },
      { input: "150000\n500", output: "SILVER" },
      { input: "50000\n100", output: "BRONZE" },
    ],
    inputs: [
      { name: "S", min: 0, max: 10000000, desc: "누적 구매액(원)" },
      { name: "P", min: 0, max: 100000, desc: "누적 포인트" },
    ],
    testCases: [
      { input: "2000000\n15000", expected: "VIP" },
      { input: "150000\n500", expected: "SILVER" },
      { input: "0\n0", expected: "BRONZE" },
    ],
    concepts: ["cond", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int S, P;
    scanf("%d", &S);
    scanf("%d", &P);

    // TODO: 위에서 먼저 만족하는 등급 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int S, P;
    scanf("%d", &S);
    scanf("%d", &P);
    if (S >= 1000000 && P >= 10000)        printf("VIP\\n");
    else if (S >= 500000 || P >= 5000)     printf("GOLD\\n");
    else if (S >= 100000 || P >= 1000)     printf("SILVER\\n");
    else                                   printf("BRONZE\\n");
    return 0;
}
`,
    expected: ({ S, P }) => {
      if (S >= 1000000 && P >= 10000) return "VIP";
      if (S >= 500000 || P >= 5000) return "GOLD";
      if (S >= 100000 || P >= 1000) return "SILVER";
      return "BRONZE";
    },
  },
  /* --- operators medium (10) --- */
  {
    id: 117,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "두 수의 평균",
    description:
      "두 정수 <code>A</code>, <code>B</code>가 주어집니다. <code>(A + B) / 2.0</code>을 소수점 한 자리까지 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "평균을 소수점 한 자리로 출력합니다.",
    constraints: ["0 ≤ A, B ≤ 100"],
    examples: [
      { input: "3\n5", output: "4.0" },
      { input: "1\n2", output: "1.5" },
    ],
    inputs: [
      { name: "A", min: 0, max: 100, desc: "정수 A" },
      { name: "B", min: 0, max: 100, desc: "정수 B" },
    ],
    testCases: [
      { input: "3\n5", expected: "4.0" },
      { input: "1\n2", expected: "1.5" },
      { input: "100\n0", expected: "50.0" },
    ],
    concepts: ["operators", "vars", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: (A + B) / 2.0을 %.1f로 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    printf("%.1f\\n", (A + B) / 2.0);
    return 0;
}
`,
    expected: ({ A, B }) => ((A + B) / 2).toFixed(1),
  },
  {
    id: 118,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "최대공약수 (유클리드)",
    description:
      "두 양의 정수 <code>A</code>, <code>B</code>가 주어집니다. 유클리드 호제법으로 두 수의 최대공약수를 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "<code>gcd(A, B)</code>를 출력합니다.",
    constraints: ["1 ≤ A, B ≤ 100000"],
    examples: [
      { input: "12\n18", output: "6" },
      { input: "7\n13", output: "1" },
    ],
    inputs: [
      { name: "A", min: 1, max: 100000, desc: "정수 A" },
      { name: "B", min: 1, max: 100000, desc: "정수 B" },
    ],
    testCases: [
      { input: "12\n18", expected: "6" },
      { input: "100\n75", expected: "25" },
      { input: "7\n13", expected: "1" },
    ],
    concepts: ["operators", "loops", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: 유클리드 호제법으로 gcd 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    int a = A, b = B;
    while (b != 0) {
        int t = a % b;
        a = b;
        b = t;
    }
    printf("%d\\n", a);
    return 0;
}
`,
    expected: ({ A, B }) => {
      let a = A, b = B;
      while (b !== 0) {
        const t = a % b;
        a = b;
        b = t;
      }
      return String(a);
    },
  },
  {
    id: 119,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "최소공배수",
    description:
      "두 양의 정수 <code>A</code>, <code>B</code>가 주어집니다. <code>lcm(A, B) = A × B / gcd(A, B)</code>로 " +
      "최소공배수를 구해 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "<code>lcm(A, B)</code>를 출력합니다.",
    constraints: ["1 ≤ A, B ≤ 1000"],
    examples: [
      { input: "4\n6", output: "12" },
      { input: "7\n5", output: "35" },
    ],
    inputs: [
      { name: "A", min: 1, max: 1000, desc: "정수 A" },
      { name: "B", min: 1, max: 1000, desc: "정수 B" },
    ],
    testCases: [
      { input: "4\n6", expected: "12" },
      { input: "10\n15", expected: "30" },
      { input: "7\n5", expected: "35" },
    ],
    concepts: ["operators", "loops", "functions"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: lcm(A, B) 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int gcd(int a, int b) {
    while (b != 0) { int t = a % b; a = b; b = t; }
    return a;
}

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    printf("%d\\n", (A * B) / gcd(A, B));
    return 0;
}
`,
    expected: ({ A, B }) => {
      const g = (a, b) => (b === 0 ? a : g(b, a % b));
      return String((A * B) / g(A, B));
    },
  },
  {
    id: 120,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "두 점 사이 거리의 제곱",
    description:
      "두 점 <code>(x1, y1)</code>과 <code>(x2, y2)</code>가 주어집니다. 두 점 사이 거리의 제곱 " +
      "<code>(x1 - x2)² + (y1 - y2)²</code>을 출력하세요.",
    inputDesc:
      "첫 줄에 <code>x1</code>, 그다음 줄에 <code>y1</code>, 그다음 줄에 <code>x2</code>, 그다음 줄에 <code>y2</code>가 주어집니다.",
    outputDesc: "거리의 제곱을 출력합니다.",
    constraints: ["-100 ≤ x1, y1, x2, y2 ≤ 100"],
    examples: [
      { input: "0\n0\n3\n4", output: "25" },
      { input: "1\n1\n4\n5", output: "25" },
    ],
    inputs: [
      { name: "x1", min: -100, max: 100, desc: "첫 점 x" },
      { name: "y1", min: -100, max: 100, desc: "첫 점 y" },
      { name: "x2", min: -100, max: 100, desc: "두 번째 점 x" },
      { name: "y2", min: -100, max: 100, desc: "두 번째 점 y" },
    ],
    testCases: [
      { input: "0\n0\n3\n4", expected: "25" },
      { input: "1\n1\n4\n5", expected: "25" },
      { input: "-1\n-1\n2\n3", expected: "25" },
    ],
    concepts: ["operators", "vars", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int x1, y1, x2, y2;
    scanf("%d", &x1);
    scanf("%d", &y1);
    scanf("%d", &x2);
    scanf("%d", &y2);

    // TODO: 거리의 제곱 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int x1, y1, x2, y2;
    scanf("%d", &x1);
    scanf("%d", &y1);
    scanf("%d", &x2);
    scanf("%d", &y2);
    int dx = x1 - x2, dy = y1 - y2;
    printf("%d\\n", dx * dx + dy * dy);
    return 0;
}
`,
    expected: ({ x1, y1, x2, y2 }) => {
      const dx = x1 - x2, dy = y1 - y2;
      return String(dx * dx + dy * dy);
    },
  },
  {
    id: 121,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "비트 연산 종합",
    description:
      "두 양의 정수 <code>A</code>, <code>B</code>가 주어집니다. " +
      "<code>A &amp; B</code>, <code>A | B</code>, <code>A ^ B</code>의 값을 각각 한 줄씩 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "세 줄에 걸쳐 AND / OR / XOR 결과를 출력합니다.",
    constraints: ["0 ≤ A, B ≤ 255"],
    examples: [
      { input: "5\n3", output: "1\n7\n6" },
      { input: "12\n10", output: "8\n14\n6" },
    ],
    inputs: [
      { name: "A", min: 0, max: 255, desc: "정수 A" },
      { name: "B", min: 0, max: 255, desc: "정수 B" },
    ],
    testCases: [
      { input: "5\n3", expected: "1\n7\n6" },
      { input: "12\n10", expected: "8\n14\n6" },
      { input: "255\n0", expected: "0\n255\n255" },
    ],
    concepts: ["operators", "vars", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: AND, OR, XOR을 각각 한 줄씩 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    printf("%d\\n", A & B);
    printf("%d\\n", A | B);
    printf("%d\\n", A ^ B);
    return 0;
}
`,
    expected: ({ A, B }) => `${A & B}\n${A | B}\n${A ^ B}`,
  },
  {
    id: 122,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "자릿수 합이 더 큰 쪽",
    description:
      "두 양의 정수 <code>A</code>, <code>B</code>가 주어집니다. 각 수의 자릿수 합을 비교해, " +
      "더 큰 쪽의 자릿수 합을 출력하세요. 같으면 <code>tie</code>를 출력합니다.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "더 큰 자릿수 합 또는 <code>tie</code>를 출력합니다.",
    constraints: ["1 ≤ A, B ≤ 99999"],
    examples: [
      { input: "99\n123", output: "18" },
      { input: "123\n321", output: "tie" },
    ],
    inputs: [
      { name: "A", min: 1, max: 99999, desc: "정수 A" },
      { name: "B", min: 1, max: 99999, desc: "정수 B" },
    ],
    testCases: [
      { input: "99\n123", expected: "18" },
      { input: "12\n345", expected: "12" },
      { input: "321\n123", expected: "tie" },
    ],
    concepts: ["operators", "loops", "cond"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: 두 수의 자릿수 합을 비교해 큰 쪽 또는 tie 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int digitSum(int n) {
    int s = 0;
    while (n > 0) { s += n % 10; n /= 10; }
    return s;
}

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    int sa = digitSum(A);
    int sb = digitSum(B);
    if (sa > sb)      printf("%d\\n", sa);
    else if (sb > sa) printf("%d\\n", sb);
    else              printf("tie\\n");
    return 0;
}
`,
    expected: ({ A, B }) => {
      const ds = (n) => String(n).split("").reduce((s, d) => s + Number(d), 0);
      const sa = ds(A), sb = ds(B);
      if (sa > sb) return String(sa);
      if (sb > sa) return String(sb);
      return "tie";
    },
  },
  {
    id: 123,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "초를 시·분·초로 환산",
    description:
      "양의 정수 <code>S</code>(초)가 주어집니다. <code>S</code>를 <code>시:분:초</code> 형식으로 출력하세요. " +
      "예) <code>S = 3661</code> → <code>1:1:1</code>",
    inputDesc: "첫 줄에 정수 <code>S</code>가 주어집니다.",
    outputDesc: "<code>시:분:초</code> 형식으로 출력합니다.",
    constraints: ["1 ≤ S ≤ 86400"],
    examples: [
      { input: "3661", output: "1:1:1" },
      { input: "60", output: "0:1:0" },
    ],
    inputs: [
      { name: "S", min: 1, max: 86400, desc: "총 초" },
    ],
    testCases: [
      { input: "3661", expected: "1:1:1" },
      { input: "60", expected: "0:1:0" },
      { input: "86399", expected: "23:59:59" },
    ],
    concepts: ["operators", "vars", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int S;
    scanf("%d", &S);

    // TODO: 시:분:초 형식으로 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int S;
    scanf("%d", &S);
    int h = S / 3600;
    int m = (S % 3600) / 60;
    int s = S % 60;
    printf("%d:%d:%d\\n", h, m, s);
    return 0;
}
`,
    expected: ({ S }) =>
      `${Math.floor(S / 3600)}:${Math.floor((S % 3600) / 60)}:${S % 60}`,
  },
  {
    id: 124,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "n진수 변환",
    description:
      "양의 정수 <code>N</code>과 진법 <code>B</code>(2 ≤ B ≤ 16)가 주어집니다. <code>N</code>을 " +
      "<code>B</code>진수로 변환한 결과를 출력하세요. 10 이상의 자리는 소문자 <code>a</code>~<code>f</code>로 표기합니다.",
    inputDesc: "첫 줄에 <code>N</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "<code>N</code>을 <code>B</code>진수로 표현한 문자열을 출력합니다.",
    constraints: ["1 ≤ N ≤ 100000", "2 ≤ B ≤ 16"],
    examples: [
      { input: "10\n2", output: "1010" },
      { input: "255\n16", output: "ff" },
      { input: "15\n8", output: "17" },
    ],
    inputs: [
      { name: "N", min: 1, max: 100000, desc: "변환할 수" },
      { name: "B", min: 2, max: 16, desc: "진법" },
    ],
    testCases: [
      { input: "10\n2", expected: "1010" },
      { input: "255\n16", expected: "ff" },
      { input: "15\n8", expected: "17" },
    ],
    concepts: ["operators", "loops", "strings"],
    starter:
`#include <stdio.h>

int main(void) {
    int N, B;
    scanf("%d", &N);
    scanf("%d", &B);

    // TODO: N을 B진수로 변환해 출력 (10~15는 소문자)

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N, B;
    scanf("%d", &N);
    scanf("%d", &B);
    char buf[40];
    int len = 0;
    while (N > 0) {
        int d = N % B;
        buf[len++] = d < 10 ? ('0' + d) : ('a' + d - 10);
        N /= B;
    }
    for (int i = len - 1; i >= 0; i--) printf("%c", buf[i]);
    printf("\\n");
    return 0;
}
`,
    expected: ({ N, B }) => N.toString(B),
  },
  {
    id: 125,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "거듭제곱 (mod)",
    description:
      "양의 정수 <code>A</code>, <code>B</code>, <code>M</code>이 주어집니다. " +
      "<code>A^B mod M</code>의 값을 출력하세요.",
    inputDesc:
      "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>, 그다음 줄에 <code>M</code>이 주어집니다.",
    outputDesc: "<code>A^B</code>를 <code>M</code>으로 나눈 나머지를 출력합니다.",
    constraints: ["1 ≤ A ≤ 100", "0 ≤ B ≤ 20", "2 ≤ M ≤ 1000"],
    examples: [
      { input: "2\n10\n1000", output: "24" },
      { input: "3\n5\n7", output: "5" },
    ],
    inputs: [
      { name: "A", min: 1, max: 100, desc: "밑" },
      { name: "B", min: 0, max: 20, desc: "지수" },
      { name: "M", min: 2, max: 1000, desc: "나누는 수" },
    ],
    testCases: [
      { input: "2\n10\n1000", expected: "24" },
      { input: "3\n5\n7", expected: "5" },
      { input: "5\n0\n100", expected: "1" },
    ],
    concepts: ["operators", "loops", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B, M;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &M);

    // TODO: A^B mod M 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B, M;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &M);
    long long r = 1 % M;
    long long base = A % M;
    for (int i = 0; i < B; i++) {
        r = (r * base) % M;
    }
    printf("%lld\\n", r);
    return 0;
}
`,
    expected: ({ A, B, M }) => {
      let r = 1n % BigInt(M);
      const base = BigInt(A) % BigInt(M);
      const m = BigInt(M);
      for (let i = 0; i < B; i++) r = (r * base) % m;
      return String(r);
    },
  },
  {
    id: 126,
    difficulty: "medium",
    tag: "중급 · 연산자",
    title: "두 수의 절댓값 차이",
    description:
      "두 정수 <code>A</code>, <code>B</code>가 주어집니다. <code>|A - B|</code>를 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "<code>|A - B|</code>의 값을 출력합니다.",
    constraints: ["-1000 ≤ A, B ≤ 1000"],
    examples: [
      { input: "3\n8", output: "5" },
      { input: "10\n-3", output: "13" },
    ],
    inputs: [
      { name: "A", min: -1000, max: 1000, desc: "정수 A" },
      { name: "B", min: -1000, max: 1000, desc: "정수 B" },
    ],
    testCases: [
      { input: "3\n8", expected: "5" },
      { input: "10\n-3", expected: "13" },
      { input: "5\n5", expected: "0" },
    ],
    concepts: ["operators", "cond", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: |A - B| 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    int d = A - B;
    if (d < 0) d = -d;
    printf("%d\\n", d);
    return 0;
}
`,
    expected: ({ A, B }) => String(Math.abs(A - B)),
  },
  /* --- operators killer --- */
  {
    id: 127,
    difficulty: "killer",
    tag: "킬러 · 시뮬레이션",
    title: "주식 매매 최대 이익",
    description:
      "어느 주식의 <code>N</code>일치 종가가 차례대로 주어집니다. 단 한 번 사고 한 번 판다고 할 때 (사기 전에 팔 수는 없습니다) " +
      "얻을 수 있는 최대 이익을 출력하세요. 이익이 없으면 <code>0</code>을 출력합니다.",
    inputDesc:
      "첫 줄에 정수 <code>N</code>이 주어집니다.<br>" +
      "둘째 줄에 <code>N</code>개의 종가가 공백으로 구분되어 주어집니다.",
    outputDesc: "단일 매매로 얻을 수 있는 최대 이익을 출력합니다.",
    constraints: ["1 ≤ N ≤ 100000", "1 ≤ 종가 ≤ 100000"],
    examples: [
      { input: "6\n7 1 5 3 6 4", output: "5" },
      { input: "5\n7 6 4 3 1", output: "0" },
      { input: "1\n10", output: "0" },
    ],
    testCases: [
      { input: "6\n7 1 5 3 6 4", expected: "5" },
      { input: "5\n7 6 4 3 1", expected: "0" },
      { input: "7\n2 4 1 7 3 6 8", expected: "7" },
    ],
    concepts: ["loops", "cond", "operators", "vars"],
    starter:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);
    int prices[100000];
    for (int i = 0; i < N; i++) scanf("%d", &prices[i]);

    // TODO: 한 번 사고 한 번 팔아 얻을 수 있는 최대 이익 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);
    int prices[100000];
    for (int i = 0; i < N; i++) scanf("%d", &prices[i]);
    if (N <= 1) { printf("0\\n"); return 0; }
    int minPrice = prices[0];
    int best = 0;
    for (int i = 1; i < N; i++) {
        int profit = prices[i] - minPrice;
        if (profit > best) best = profit;
        if (prices[i] < minPrice) minPrice = prices[i];
    }
    printf("%d\\n", best);
    return 0;
}
`,
  },
  /* --- vars medium (10) --- */
  {
    id: 128,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "두 변수 교환",
    description:
      "두 정수 <code>A</code>, <code>B</code>가 주어집니다. 임시 변수를 사용해 두 값을 교환한 뒤 " +
      "<code>B A</code> 순서로 공백 구분으로 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "교환 후 첫 변수와 두 번째 변수의 값을 출력합니다.",
    constraints: ["-1000 ≤ A, B ≤ 1000"],
    examples: [
      { input: "3\n7", output: "7 3" },
      { input: "0\n9", output: "9 0" },
    ],
    inputs: [
      { name: "A", min: -1000, max: 1000, desc: "정수 A" },
      { name: "B", min: -1000, max: 1000, desc: "정수 B" },
    ],
    testCases: [
      { input: "3\n7", expected: "7 3" },
      { input: "0\n9", expected: "9 0" },
      { input: "-5\n5", expected: "5 -5" },
    ],
    concepts: ["vars", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: 임시 변수로 A와 B 교환 후 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    int t = A;
    A = B;
    B = t;
    printf("%d %d\\n", A, B);
    return 0;
}
`,
    expected: ({ A, B }) => `${B} ${A}`,
  },
  {
    id: 129,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "평균 절대 편차",
    description:
      "세 정수 <code>A</code>, <code>B</code>, <code>C</code>가 주어집니다. 세 수의 평균(정수 나눗셈)에 대한 " +
      "각 값의 절대 편차 합 <code>|A-avg| + |B-avg| + |C-avg|</code>를 출력하세요.",
    inputDesc:
      "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>, 그다음 줄에 <code>C</code>가 주어집니다.",
    outputDesc: "절대 편차들의 합을 출력합니다.",
    constraints: ["0 ≤ A, B, C ≤ 100"],
    examples: [
      { input: "1\n2\n3", output: "2" },
      { input: "5\n5\n5", output: "0" },
    ],
    inputs: [
      { name: "A", min: 0, max: 100, desc: "정수 A" },
      { name: "B", min: 0, max: 100, desc: "정수 B" },
      { name: "C", min: 0, max: 100, desc: "정수 C" },
    ],
    testCases: [
      { input: "1\n2\n3", expected: "2" },
      { input: "10\n4\n7", expected: "6" },
      { input: "5\n5\n5", expected: "0" },
    ],
    concepts: ["vars", "operators", "cond"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);

    // TODO: 평균에 대한 절대 편차 합 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int absVal(int x) { return x < 0 ? -x : x; }

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);
    int avg = (A + B + C) / 3;
    printf("%d\\n", absVal(A - avg) + absVal(B - avg) + absVal(C - avg));
    return 0;
}
`,
    expected: ({ A, B, C }) => {
      const avg = Math.floor((A + B + C) / 3);
      return String(
        Math.abs(A - avg) + Math.abs(B - avg) + Math.abs(C - avg)
      );
    },
  },
  {
    id: 130,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "정수 나눗셈 vs 실수 나눗셈",
    description:
      "두 양의 정수 <code>A</code>, <code>B</code>가 주어집니다. 첫 줄에 <code>A / B</code>의 정수 나눗셈 결과를, " +
      "둘째 줄에 <code>(double)A / B</code>를 소수점 둘째 자리까지 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "두 줄에 걸쳐 정수 나눗셈과 실수 나눗셈 결과를 출력합니다.",
    constraints: ["1 ≤ A ≤ 10000", "1 ≤ B ≤ 100"],
    examples: [
      { input: "10\n3", output: "3\n3.33" },
      { input: "7\n2", output: "3\n3.50" },
    ],
    inputs: [
      { name: "A", min: 1, max: 10000, desc: "분자" },
      { name: "B", min: 1, max: 100, desc: "분모" },
    ],
    testCases: [
      { input: "10\n3", expected: "3\n3.33" },
      { input: "7\n2", expected: "3\n3.50" },
      { input: "100\n4", expected: "25\n25.00" },
    ],
    concepts: ["vars", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: A/B (정수) 줄1, (double)A/B 줄2 (%.2f)

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    printf("%d\\n", A / B);
    printf("%.2f\\n", (double)A / B);
    return 0;
}
`,
    expected: ({ A, B }) =>
      `${Math.floor(A / B)}\n${(A / B).toFixed(2)}`,
  },
  {
    id: 131,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "대소문자 한 줄에 출력",
    description:
      "양의 정수 <code>N</code>(1~26)이 주어집니다. <code>'A'</code>에서 <code>N - 1</code> 만큼 떨어진 대문자와 " +
      "<code>'a'</code>에서 <code>N - 1</code> 만큼 떨어진 소문자를 한 줄에 공백으로 구분해 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>N</code>이 주어집니다.",
    outputDesc: "대문자와 소문자를 공백 구분으로 출력합니다.",
    constraints: ["1 ≤ N ≤ 26"],
    examples: [
      { input: "1", output: "A a" },
      { input: "5", output: "E e" },
      { input: "26", output: "Z z" },
    ],
    inputs: [
      { name: "N", min: 1, max: 26, desc: "알파벳 순서" },
    ],
    testCases: [
      { input: "1", expected: "A a" },
      { input: "5", expected: "E e" },
      { input: "26", expected: "Z z" },
    ],
    concepts: ["vars", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);

    // TODO: 'A'+(N-1)과 'a'+(N-1)을 공백 구분으로 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);
    char up = 'A' + (N - 1);
    char lo = 'a' + (N - 1);
    printf("%c %c\\n", up, lo);
    return 0;
}
`,
    expected: ({ N }) =>
      `${String.fromCharCode(64 + N)} ${String.fromCharCode(96 + N)}`,
  },
  {
    id: 132,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "비트 1의 개수 (popcount)",
    description:
      "양의 정수 <code>A</code>와 양의 정수 <code>B</code>가 주어집니다. 각 수의 이진 표현에서 <code>1</code>의 개수를 " +
      "한 줄에 공백으로 구분해 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "<code>popcount(A) popcount(B)</code> 형식으로 출력합니다.",
    constraints: ["0 ≤ A, B ≤ 65535"],
    examples: [
      { input: "5\n7", output: "2 3" },
      { input: "0\n15", output: "0 4" },
    ],
    inputs: [
      { name: "A", min: 0, max: 65535, desc: "정수 A" },
      { name: "B", min: 0, max: 65535, desc: "정수 B" },
    ],
    testCases: [
      { input: "5\n7", expected: "2 3" },
      { input: "0\n15", expected: "0 4" },
      { input: "255\n256", expected: "8 1" },
    ],
    concepts: ["vars", "operators", "loops"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: 각 수의 이진 표현에서 1의 개수를 공백 구분으로 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int popcount(int n) {
    int c = 0;
    while (n > 0) { c += n & 1; n >>= 1; }
    return c;
}

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    printf("%d %d\\n", popcount(A), popcount(B));
    return 0;
}
`,
    expected: ({ A, B }) => {
      const pc = (n) => {
        let c = 0; while (n > 0) { c += n & 1; n >>>= 1; } return c;
      };
      return `${pc(A)} ${pc(B)}`;
    },
  },
  {
    id: 133,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "가장 큰 자릿수",
    description:
      "두 양의 정수 <code>A</code>, <code>B</code>가 주어집니다. 각 수의 자릿수 중 가장 큰 숫자를 찾아 " +
      "한 줄에 공백으로 구분해 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "<code>maxDigit(A) maxDigit(B)</code> 형식으로 출력합니다.",
    constraints: ["1 ≤ A, B ≤ 99999"],
    examples: [
      { input: "1234\n9876", output: "4 9" },
      { input: "111\n222", output: "1 2" },
    ],
    inputs: [
      { name: "A", min: 1, max: 99999, desc: "정수 A" },
      { name: "B", min: 1, max: 99999, desc: "정수 B" },
    ],
    testCases: [
      { input: "1234\n9876", expected: "4 9" },
      { input: "5\n50", expected: "5 5" },
      { input: "111\n222", expected: "1 2" },
    ],
    concepts: ["vars", "loops", "operators"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: 각 수의 최대 자릿수를 공백 구분으로 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int maxDigit(int n) {
    int m = 0;
    while (n > 0) { int d = n % 10; if (d > m) m = d; n /= 10; }
    return m;
}

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    printf("%d %d\\n", maxDigit(A), maxDigit(B));
    return 0;
}
`,
    expected: ({ A, B }) => {
      const md = (n) => Math.max(...String(n).split("").map(Number));
      return `${md(A)} ${md(B)}`;
    },
  },
  {
    id: 134,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "자릿수 분리해 줄마다 출력",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>의 각 자릿수를 최상위부터 한 줄씩 출력하세요. " +
      "예) <code>A = 123</code> → <code>1</code> / <code>2</code> / <code>3</code> (세 줄)",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "각 자릿수를 한 줄씩 출력합니다.",
    constraints: ["1 ≤ A ≤ 99999"],
    examples: [
      { input: "123", output: "1\n2\n3" },
      { input: "7", output: "7" },
    ],
    inputs: [
      { name: "A", min: 1, max: 99999, desc: "정수 A" },
    ],
    testCases: [
      { input: "123", expected: "1\n2\n3" },
      { input: "7", expected: "7" },
      { input: "10000", expected: "1\n0\n0\n0\n0" },
    ],
    concepts: ["vars", "loops", "operators"],
    starter:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);

    // TODO: A의 자릿수를 최상위부터 한 줄씩 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    int buf[10];
    int len = 0;
    if (A == 0) { printf("0\\n"); return 0; }
    while (A > 0) { buf[len++] = A % 10; A /= 10; }
    for (int i = len - 1; i >= 0; i--) printf("%d\\n", buf[i]);
    return 0;
}
`,
    expected: ({ A }) => String(A).split("").join("\n"),
  },
  {
    id: 135,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "더한 요일 번호",
    description:
      "오늘이 요일 번호 <code>D</code>(0=월, 1=화, ..., 6=일)일 때, <code>K</code>일 뒤의 요일 번호를 출력하세요.",
    inputDesc: "첫 줄에 <code>D</code>, 그다음 줄에 <code>K</code>가 주어집니다.",
    outputDesc: "K일 뒤의 요일 번호(<code>0</code>~<code>6</code>)를 출력합니다.",
    constraints: ["0 ≤ D ≤ 6", "0 ≤ K ≤ 10000"],
    examples: [
      { input: "0\n7", output: "0" },
      { input: "3\n10", output: "6" },
    ],
    inputs: [
      { name: "D", min: 0, max: 6, desc: "오늘 요일 번호" },
      { name: "K", min: 0, max: 10000, desc: "더할 일수" },
    ],
    testCases: [
      { input: "0\n7", expected: "0" },
      { input: "3\n10", expected: "6" },
      { input: "6\n1", expected: "0" },
    ],
    concepts: ["vars", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int D, K;
    scanf("%d", &D);
    scanf("%d", &K);

    // TODO: (D + K) % 7 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int D, K;
    scanf("%d", &D);
    scanf("%d", &K);
    printf("%d\\n", (D + K) % 7);
    return 0;
}
`,
    expected: ({ D, K }) => String((D + K) % 7),
  },
  {
    id: 136,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "unsigned char 캐스팅",
    description:
      "양의 정수 <code>A</code>가 주어집니다. <code>A</code>를 <code>unsigned char</code>로 형변환했을 때의 값을 " +
      "출력하세요. (실질적으로 <code>A % 256</code>)",
    inputDesc: "첫 줄에 정수 <code>A</code>가 주어집니다.",
    outputDesc: "<code>(unsigned char)A</code>의 값을 출력합니다.",
    constraints: ["0 ≤ A ≤ 100000"],
    examples: [
      { input: "300", output: "44" },
      { input: "255", output: "255" },
      { input: "1000", output: "232" },
    ],
    inputs: [
      { name: "A", min: 0, max: 100000, desc: "정수 A" },
    ],
    testCases: [
      { input: "300", expected: "44" },
      { input: "255", expected: "255" },
      { input: "1000", expected: "232" },
    ],
    concepts: ["vars", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);

    // TODO: (unsigned char)A의 값 출력 (= A % 256)

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    unsigned char c = (unsigned char)A;
    printf("%u\\n", (unsigned)c);
    return 0;
}
`,
    expected: ({ A }) => String(A % 256),
  },
  {
    id: 137,
    difficulty: "medium",
    tag: "중급 · 자료형",
    title: "짝수와 홀수 개수",
    description:
      "두 정수 <code>A</code>, <code>B</code>가 주어집니다 (<code>A ≤ B</code>). 구간 <code>[A, B]</code>에 포함된 " +
      "짝수와 홀수의 개수를 한 줄에 공백으로 구분해 출력하세요.",
    inputDesc: "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>가 주어집니다.",
    outputDesc: "<code>짝수 개수 홀수 개수</code>를 출력합니다.",
    constraints: ["0 ≤ A ≤ B ≤ 100000"],
    examples: [
      { input: "1\n10", output: "5 5" },
      { input: "0\n0", output: "1 0" },
    ],
    inputs: [
      { name: "A", min: 0, max: 100000, desc: "구간 시작" },
      { name: "B", min: 0, max: 100000, desc: "구간 끝" },
    ],
    testCases: [
      { input: "1\n10", expected: "5 5" },
      { input: "0\n0", expected: "1 0" },
      { input: "3\n7", expected: "2 3" },
    ],
    concepts: ["vars", "operators", "loops"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);

    // TODO: [A, B] 내 짝수/홀수 개수를 공백 구분으로 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B;
    scanf("%d", &A);
    scanf("%d", &B);
    int evens = 0, odds = 0;
    for (int i = A; i <= B; i++) {
        if (i % 2 == 0) evens++;
        else            odds++;
    }
    printf("%d %d\\n", evens, odds);
    return 0;
}
`,
    expected: ({ A, B }) => {
      let e = 0, o = 0;
      for (let i = A; i <= B; i++) {
        if (i % 2 === 0) e++;
        else o++;
      }
      return `${e} ${o}`;
    },
  },
  /* --- loops medium (10) --- */
  {
    id: 138,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "1부터 N까지의 합과 곱",
    description:
      "양의 정수 <code>N</code>이 주어집니다. <code>1</code>부터 <code>N</code>까지의 합을 첫 줄에, " +
      "<code>N!</code>(<code>1 × 2 × ... × N</code>)을 둘째 줄에 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>N</code>이 주어집니다.",
    outputDesc: "두 줄에 걸쳐 합과 곱을 출력합니다.",
    constraints: ["1 ≤ N ≤ 12"],
    examples: [
      { input: "3", output: "6\n6" },
      { input: "5", output: "15\n120" },
    ],
    inputs: [
      { name: "N", min: 1, max: 12, desc: "정수 N" },
    ],
    testCases: [
      { input: "3", expected: "6\n6" },
      { input: "5", expected: "15\n120" },
      { input: "1", expected: "1\n1" },
    ],
    concepts: ["loops", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);

    // TODO: 1부터 N까지의 합과 곱을 두 줄에 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);
    long long sum = 0, prod = 1;
    for (int i = 1; i <= N; i++) { sum += i; prod *= i; }
    printf("%lld\\n", sum);
    printf("%lld\\n", prod);
    return 0;
}
`,
    expected: ({ N }) => {
      let s = 0, p = 1;
      for (let i = 1; i <= N; i++) { s += i; p *= i; }
      return `${s}\n${p}`;
    },
  },
  {
    id: 139,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "다섯 수의 합과 평균",
    description:
      "다섯 개의 정수 <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code>, <code>E</code>가 " +
      "각각 한 줄씩 주어집니다. 합을 첫 줄에, 정수 평균을 둘째 줄에 출력하세요.",
    inputDesc:
      "총 다섯 줄에 걸쳐 <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code>, <code>E</code>가 주어집니다.",
    outputDesc: "두 줄에 걸쳐 합과 평균(정수)을 출력합니다.",
    constraints: ["0 ≤ A, B, C, D, E ≤ 1000"],
    examples: [
      { input: "1\n2\n3\n4\n5", output: "15\n3" },
      { input: "10\n20\n30\n40\n50", output: "150\n30" },
    ],
    inputs: [
      { name: "A", min: 0, max: 1000, desc: "정수 A" },
      { name: "B", min: 0, max: 1000, desc: "정수 B" },
      { name: "C", min: 0, max: 1000, desc: "정수 C" },
      { name: "D", min: 0, max: 1000, desc: "정수 D" },
      { name: "E", min: 0, max: 1000, desc: "정수 E" },
    ],
    testCases: [
      { input: "1\n2\n3\n4\n5", expected: "15\n3" },
      { input: "10\n20\n30\n40\n50", expected: "150\n30" },
      { input: "0\n0\n0\n0\n0", expected: "0\n0" },
    ],
    concepts: ["loops", "arrays", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int arr[5];
    for (int i = 0; i < 5; i++) scanf("%d", &arr[i]);

    // TODO: 합과 평균(정수)을 각 줄에 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int arr[5];
    for (int i = 0; i < 5; i++) scanf("%d", &arr[i]);
    int sum = 0;
    for (int i = 0; i < 5; i++) sum += arr[i];
    printf("%d\\n", sum);
    printf("%d\\n", sum / 5);
    return 0;
}
`,
    expected: ({ A, B, C, D, E }) => {
      const sum = A + B + C + D + E;
      return `${sum}\n${Math.floor(sum / 5)}`;
    },
  },
  {
    id: 140,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "네 수의 최댓값과 최솟값",
    description:
      "네 정수 <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code>가 주어집니다. 최댓값과 최솟값을 " +
      "한 줄에 공백으로 구분해 출력하세요.",
    inputDesc:
      "총 네 줄에 걸쳐 <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code>가 주어집니다.",
    outputDesc: "<code>최댓값 최솟값</code> 형식으로 출력합니다.",
    constraints: ["-1000 ≤ A, B, C, D ≤ 1000"],
    examples: [
      { input: "1\n5\n3\n2", output: "5 1" },
      { input: "-1\n0\n7\n-3", output: "7 -3" },
    ],
    inputs: [
      { name: "A", min: -1000, max: 1000, desc: "정수 A" },
      { name: "B", min: -1000, max: 1000, desc: "정수 B" },
      { name: "C", min: -1000, max: 1000, desc: "정수 C" },
      { name: "D", min: -1000, max: 1000, desc: "정수 D" },
    ],
    testCases: [
      { input: "1\n5\n3\n2", expected: "5 1" },
      { input: "-1\n0\n7\n-3", expected: "7 -3" },
      { input: "4\n4\n4\n4", expected: "4 4" },
    ],
    concepts: ["loops", "arrays", "cond"],
    starter:
`#include <stdio.h>

int main(void) {
    int arr[4];
    for (int i = 0; i < 4; i++) scanf("%d", &arr[i]);

    // TODO: 최댓값과 최솟값을 공백 구분으로 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int arr[4];
    for (int i = 0; i < 4; i++) scanf("%d", &arr[i]);
    int mx = arr[0], mn = arr[0];
    for (int i = 1; i < 4; i++) {
        if (arr[i] > mx) mx = arr[i];
        if (arr[i] < mn) mn = arr[i];
    }
    printf("%d %d\\n", mx, mn);
    return 0;
}
`,
    expected: ({ A, B, C, D }) => {
      const a = [A, B, C, D];
      return `${Math.max(...a)} ${Math.min(...a)}`;
    },
  },
  {
    id: 141,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "세 수의 중앙값",
    description:
      "세 정수 <code>A</code>, <code>B</code>, <code>C</code>가 주어집니다. 세 수의 중앙값을 출력하세요.",
    inputDesc:
      "첫 줄에 <code>A</code>, 그다음 줄에 <code>B</code>, 그다음 줄에 <code>C</code>가 주어집니다.",
    outputDesc: "중앙값을 출력합니다.",
    constraints: ["-1000 ≤ A, B, C ≤ 1000"],
    examples: [
      { input: "1\n2\n3", output: "2" },
      { input: "10\n2\n7", output: "7" },
    ],
    inputs: [
      { name: "A", min: -1000, max: 1000, desc: "정수 A" },
      { name: "B", min: -1000, max: 1000, desc: "정수 B" },
      { name: "C", min: -1000, max: 1000, desc: "정수 C" },
    ],
    testCases: [
      { input: "1\n2\n3", expected: "2" },
      { input: "10\n2\n7", expected: "7" },
      { input: "5\n5\n5", expected: "5" },
    ],
    concepts: ["loops", "cond", "operators"],
    starter:
`#include <stdio.h>

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);

    // TODO: 세 수의 중앙값 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int A, B, C;
    scanf("%d", &A);
    scanf("%d", &B);
    scanf("%d", &C);
    int arr[3] = { A, B, C };
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2 - i; j++)
            if (arr[j] > arr[j + 1]) {
                int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
            }
    printf("%d\\n", arr[1]);
    return 0;
}
`,
    expected: ({ A, B, C }) => {
      const a = [A, B, C].sort((x, y) => x - y);
      return String(a[1]);
    },
  },
  {
    id: 142,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "N x M 곱셈표",
    description:
      "양의 정수 <code>N</code>, <code>M</code>이 주어집니다. <code>N</code>행 <code>M</code>열의 곱셈표를 " +
      "출력하세요. 각 칸은 행 번호와 열 번호(1부터 시작)의 곱이며, 같은 행의 값들은 공백으로 구분합니다.",
    inputDesc: "첫 줄에 <code>N</code>, 그다음 줄에 <code>M</code>이 주어집니다.",
    outputDesc: "<code>N</code>개의 줄에 걸쳐 각 행을 출력합니다.",
    constraints: ["1 ≤ N, M ≤ 10"],
    examples: [
      { input: "2\n3", output: "1 2 3\n2 4 6" },
      { input: "3\n3", output: "1 2 3\n2 4 6\n3 6 9" },
    ],
    inputs: [
      { name: "N", min: 1, max: 10, desc: "행 수" },
      { name: "M", min: 1, max: 10, desc: "열 수" },
    ],
    testCases: [
      { input: "2\n3", expected: "1 2 3\n2 4 6" },
      { input: "3\n3", expected: "1 2 3\n2 4 6\n3 6 9" },
      { input: "1\n5", expected: "1 2 3 4 5" },
    ],
    concepts: ["loops", "operators", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int N, M;
    scanf("%d", &N);
    scanf("%d", &M);

    // TODO: N행 M열 곱셈표 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N, M;
    scanf("%d", &N);
    scanf("%d", &M);
    for (int i = 1; i <= N; i++) {
        for (int j = 1; j <= M; j++) {
            if (j > 1) printf(" ");
            printf("%d", i * j);
        }
        printf("\\n");
    }
    return 0;
}
`,
    expected: ({ N, M }) => {
      const rows = [];
      for (let i = 1; i <= N; i++) {
        const row = [];
        for (let j = 1; j <= M; j++) row.push(i * j);
        rows.push(row.join(" "));
      }
      return rows.join("\n");
    },
  },
  {
    id: 143,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "K의 배수 개수",
    description:
      "양의 정수 <code>N</code>, <code>K</code>가 주어집니다. <code>1</code>부터 <code>N</code>까지의 정수 중 " +
      "<code>K</code>의 배수의 개수를 출력하세요.",
    inputDesc: "첫 줄에 <code>N</code>, 그다음 줄에 <code>K</code>가 주어집니다.",
    outputDesc: "<code>K</code>의 배수 개수(<code>⌊N / K⌋</code>)를 출력합니다.",
    constraints: ["1 ≤ N ≤ 100000", "1 ≤ K ≤ 100"],
    examples: [
      { input: "20\n3", output: "6" },
      { input: "10\n2", output: "5" },
    ],
    inputs: [
      { name: "N", min: 1, max: 100000, desc: "상한" },
      { name: "K", min: 1, max: 100, desc: "배수의 기준" },
    ],
    testCases: [
      { input: "20\n3", expected: "6" },
      { input: "10\n2", expected: "5" },
      { input: "100\n7", expected: "14" },
    ],
    concepts: ["loops", "cond", "operators"],
    starter:
`#include <stdio.h>

int main(void) {
    int N, K;
    scanf("%d", &N);
    scanf("%d", &K);

    // TODO: 1~N 중 K의 배수 개수 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N, K;
    scanf("%d", &N);
    scanf("%d", &K);
    int count = 0;
    for (int i = 1; i <= N; i++) {
        if (i % K == 0) count++;
    }
    printf("%d\\n", count);
    return 0;
}
`,
    expected: ({ N, K }) => String(Math.floor(N / K)),
  },
  {
    id: 144,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "별 피라미드",
    description:
      "양의 정수 <code>N</code>이 주어집니다. 높이 <code>N</code>인 별 피라미드를 가운데 정렬로 출력하세요. " +
      "<code>i</code>번째 줄(1부터 시작)에는 앞쪽에 공백 <code>N - i</code>개, 그 뒤에 별 <code>2i - 1</code>개를 출력합니다.",
    inputDesc: "첫 줄에 정수 <code>N</code>이 주어집니다.",
    outputDesc: "<code>N</code>개의 줄에 걸쳐 피라미드를 출력합니다.",
    constraints: ["1 ≤ N ≤ 20"],
    examples: [
      { input: "3", output: "  *\n ***\n*****" },
      { input: "1", output: "*" },
    ],
    inputs: [
      { name: "N", min: 1, max: 20, desc: "피라미드 높이" },
    ],
    testCases: [
      { input: "3", expected: "  *\n ***\n*****" },
      { input: "1", expected: "*" },
      { input: "5", expected: "    *\n   ***\n  *****\n *******\n*********" },
    ],
    concepts: ["loops", "strings", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);

    // TODO: 높이 N인 별 피라미드 (가운데 정렬) 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);
    for (int i = 1; i <= N; i++) {
        for (int j = 0; j < N - i; j++) printf(" ");
        for (int j = 0; j < 2 * i - 1; j++) printf("*");
        printf("\\n");
    }
    return 0;
}
`,
    expected: ({ N }) => {
      const lines = [];
      for (let i = 1; i <= N; i++) {
        lines.push(" ".repeat(N - i) + "*".repeat(2 * i - 1));
      }
      return lines.join("\n");
    },
  },
  {
    id: 145,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "별 직사각형",
    description:
      "양의 정수 <code>N</code>, <code>M</code>이 주어집니다. <code>N</code>행 <code>M</code>열의 직사각형을 " +
      "<code>'*'</code>로 채워 출력하세요.",
    inputDesc: "첫 줄에 <code>N</code>, 그다음 줄에 <code>M</code>이 주어집니다.",
    outputDesc: "<code>N</code>개의 줄에 걸쳐 <code>'*'</code>를 출력합니다.",
    constraints: ["1 ≤ N, M ≤ 20"],
    examples: [
      { input: "2\n3", output: "***\n***" },
      { input: "3\n1", output: "*\n*\n*" },
    ],
    inputs: [
      { name: "N", min: 1, max: 20, desc: "행 수" },
      { name: "M", min: 1, max: 20, desc: "열 수" },
    ],
    testCases: [
      { input: "2\n3", expected: "***\n***" },
      { input: "3\n1", expected: "*\n*\n*" },
      { input: "1\n5", expected: "*****" },
    ],
    concepts: ["loops", "strings", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int N, M;
    scanf("%d", &N);
    scanf("%d", &M);

    // TODO: N행 M열 별 직사각형 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N, M;
    scanf("%d", &N);
    scanf("%d", &M);
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < M; j++) printf("*");
        printf("\\n");
    }
    return 0;
}
`,
    expected: ({ N, M }) =>
      Array.from({ length: N }, () => "*".repeat(M)).join("\n"),
  },
  {
    id: 146,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "범위를 방향에 맞춰 출력",
    description:
      "두 정수 <code>N</code>, <code>M</code>이 주어집니다. <code>N ≤ M</code>이면 오름차순으로, 아니면 내림차순으로 " +
      "두 수를 포함한 모든 정수를 공백 구분으로 출력하세요.",
    inputDesc: "첫 줄에 <code>N</code>, 그다음 줄에 <code>M</code>이 주어집니다.",
    outputDesc: "방향에 따라 모든 정수를 공백으로 구분해 출력합니다.",
    constraints: ["-100 ≤ N, M ≤ 100"],
    examples: [
      { input: "3\n7", output: "3 4 5 6 7" },
      { input: "7\n3", output: "7 6 5 4 3" },
      { input: "5\n5", output: "5" },
    ],
    inputs: [
      { name: "N", min: -100, max: 100, desc: "시작" },
      { name: "M", min: -100, max: 100, desc: "끝" },
    ],
    testCases: [
      { input: "3\n7", expected: "3 4 5 6 7" },
      { input: "7\n3", expected: "7 6 5 4 3" },
      { input: "5\n5", expected: "5" },
    ],
    concepts: ["loops", "cond", "io"],
    starter:
`#include <stdio.h>

int main(void) {
    int N, M;
    scanf("%d", &N);
    scanf("%d", &M);

    // TODO: 방향에 맞춰 N부터 M까지 공백 구분 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N, M;
    scanf("%d", &N);
    scanf("%d", &M);
    int step = (N <= M) ? 1 : -1;
    int i = N;
    int first = 1;
    while (1) {
        if (!first) printf(" ");
        printf("%d", i);
        first = 0;
        if (i == M) break;
        i += step;
    }
    printf("\\n");
    return 0;
}
`,
    expected: ({ N, M }) => {
      const arr = [];
      if (N <= M) for (let i = N; i <= M; i++) arr.push(i);
      else for (let i = N; i >= M; i--) arr.push(i);
      return arr.join(" ");
    },
  },
  {
    id: 147,
    difficulty: "medium",
    tag: "중급 · 반복문",
    title: "Collatz 단계 수",
    description:
      "양의 정수 <code>N</code>이 주어집니다. <code>N</code>이 짝수면 <code>N = N / 2</code>, 홀수면 " +
      "<code>N = 3N + 1</code>을 반복해 <code>N</code>이 <code>1</code>이 될 때까지 걸리는 횟수를 출력하세요.",
    inputDesc: "첫 줄에 정수 <code>N</code>이 주어집니다.",
    outputDesc: "<code>1</code>이 될 때까지 걸리는 단계 수를 출력합니다.",
    constraints: ["1 ≤ N ≤ 100000"],
    examples: [
      { input: "1", output: "0" },
      { input: "6", output: "8" },
      { input: "27", output: "111" },
    ],
    inputs: [
      { name: "N", min: 1, max: 100000, desc: "시작 수" },
    ],
    testCases: [
      { input: "1", expected: "0" },
      { input: "6", expected: "8" },
      { input: "27", expected: "111" },
    ],
    concepts: ["loops", "cond", "operators"],
    starter:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);

    // TODO: Collatz 단계 수 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    long long N;
    scanf("%lld", &N);
    int steps = 0;
    while (N > 1) {
        if (N % 2 == 0) N /= 2;
        else            N = 3 * N + 1;
        steps++;
    }
    printf("%d\\n", steps);
    return 0;
}
`,
    expected: ({ N }) => {
      let n = BigInt(N);
      let s = 0;
      while (n > 1n) {
        if (n % 2n === 0n) n /= 2n;
        else n = 3n * n + 1n;
        s++;
      }
      return String(s);
    },
  },
  /* --- loops/vars killer --- */
  {
    id: 148,
    difficulty: "killer",
    tag: "킬러 · 시뮬레이션",
    title: "에라토스테네스의 체",
    description:
      "양의 정수 <code>N</code>이 주어집니다. <code>2</code>부터 <code>N</code>까지의 모든 소수를 " +
      "에라토스테네스의 체로 구해 공백 구분으로 한 줄에 출력하세요. <code>N &lt; 2</code>이면 빈 줄을 출력합니다.",
    inputDesc: "첫 줄에 정수 <code>N</code>이 주어집니다.",
    outputDesc: "<code>2</code> 이상 <code>N</code> 이하 모든 소수를 공백 구분으로 출력합니다.",
    constraints: ["1 ≤ N ≤ 10000"],
    examples: [
      { input: "10", output: "2 3 5 7" },
      { input: "2", output: "2" },
      { input: "1", output: "" },
    ],
    testCases: [
      { input: "10", expected: "2 3 5 7" },
      { input: "30", expected: "2 3 5 7 11 13 17 19 23 29" },
      { input: "2", expected: "2" },
    ],
    concepts: ["loops", "arrays", "cond", "vars"],
    starter:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);

    // TODO: 에라토스테네스의 체로 2~N 사이 소수를 공백 구분으로 출력

    return 0;
}
`,
    solution:
`#include <stdio.h>

int main(void) {
    int N;
    scanf("%d", &N);
    if (N < 2) { printf("\\n"); return 0; }
    char isComposite[10001] = {0};
    for (int i = 2; (long long)i * i <= N; i++) {
        if (!isComposite[i]) {
            for (int j = i * i; j <= N; j += i) isComposite[j] = 1;
        }
    }
    int first = 1;
    for (int i = 2; i <= N; i++) {
        if (!isComposite[i]) {
            if (!first) printf(" ");
            printf("%d", i);
            first = 0;
        }
    }
    printf("\\n");
    return 0;
}
`,
  },
];

/* =====================================================================
   Problem queue — built from the user's selected concepts on test-concepts
   page, persisted in sessionStorage so it stays stable across the timer,
   refreshes, and gauge → problem → result navigation. Picked problems are
   shuffled so two consecutive sessions with the same selection don't show
   the exact same lineup.
   ===================================================================== */

export const QUEUE_KEY = "codenergy:test:queue";

export function buildProblemQueue(selectedConceptIds, count = TOTAL_PROBLEMS) {
  const selected = new Set(selectedConceptIds || []);
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  // Restrict the pool to difficulties the user's survey level unlocks.
  const allowed = new Set(allowedDifficulties());
  const pool = PROBLEMS.filter((p) => allowed.has(problemDifficulty(p)));
  const matched = shuffle(
    pool.filter(
      (p) => Array.isArray(p.concepts) && p.concepts.some((c) => selected.has(c))
    )
  );
  // Always return `count` problems. Prefer concept-matched ones; if fewer
  // exist, pad with the rest of the level-allowed pool so the lineup
  // length is fixed at `count` regardless of selection.
  const matchedIds = new Set(matched.map((p) => p.id));
  const padding = shuffle(pool.filter((p) => !matchedIds.has(p.id)));
  return [...matched, ...padding].slice(0, count).map((p) => p.id);
}

export function loadProblemQueue() {
  try {
    const raw = sessionStorage.getItem(QUEUE_KEY);
    if (!raw) return null;
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids) || ids.length === 0) return null;
    const valid = ids.filter((id) => PROBLEMS.some((p) => p.id === id));
    return valid.length ? valid : null;
  } catch (_) {
    return null;
  }
}

export function saveProblemQueue(ids) {
  try {
    sessionStorage.setItem(QUEUE_KEY, JSON.stringify(ids));
  } catch (_) {}
}

/**
 * Build representative test cases for a problem.
 *   easy   → 3 cases sampled from aMin / mid / aMax of single input A.
 *   medium → 3 cases sampled from each input's min / mid / max, joined as
 *            newline-separated stdin matching the C scanf order.
 *   killer → returns the hardcoded `testCases` array verbatim.
 * Codetree-style dock displays them as Case1/Case2/Case3 tabs.
 */
export function getTestCases(problem) {
  // Killer (and any problem that hardcodes testCases) ships its own cases.
  if (Array.isArray(problem.testCases) && problem.testCases.length > 0) {
    return problem.testCases.map((tc, i) => ({
      id: i + 1,
      input: tc.input,
      expected: tc.expected,
      A: null,
      values: tc.values ?? null,
    }));
  }
  // Medium: parse inputs[] descriptor and build 3 cases.
  if (problemDifficulty(problem) === "medium" && Array.isArray(problem.inputs)) {
    const modes = ["min", "mid", "max"];
    return modes.map((mode, i) => {
      const values = {};
      const lines = [];
      for (const inp of problem.inputs) {
        const v =
          mode === "min"
            ? inp.min
            : mode === "max"
            ? inp.max
            : Math.floor((inp.min + inp.max) / 2);
        values[inp.name] = v;
        lines.push(String(v));
      }
      return {
        id: i + 1,
        input: lines.join("\n"),
        expected: problem.expected(values),
        A: null,
        values,
      };
    });
  }
  // Easy: legacy single-A behavior.
  const a = problem.aMin;
  const c = problem.aMax;
  const b = Math.floor((a + c) / 2);
  const values = a === c ? [a] : a + 1 === c ? [a, c] : [a, b, c];
  return values.map((A, i) => ({
    id: i + 1,
    input: String(A),
    expected: problem.expected(A),
    A,
    values: null,
  }));
}
