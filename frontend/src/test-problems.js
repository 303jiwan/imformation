/* =====================================================================
   Hardcoded problem set for the C-language coding test (5 problems).
   Each problem ships with a JS reference `expected(A)` that mocks what
   the user's compiled C code should print to stdout for a given A.
   When a real backend (gcc sandbox) is wired in, this module is the only
   place that needs to change — the page logic uses it as the source of
   truth for both per-case verdicts and "제출 및 채점" full-range checks.
   ===================================================================== */

export const TOTAL_PROBLEMS = 5;
export const TIME_PER_PROBLEM_MS = 10 * 60 * 1000;

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
];

/**
 * Build 3 representative test cases for a problem (min / mid / max).
 * Codetree-style dock displays them as Case1/Case2/Case3 tabs.
 */
export function getTestCases(problem) {
  const a = problem.aMin;
  const c = problem.aMax;
  const b = Math.floor((a + c) / 2);
  const values = a === c ? [a] : a + 1 === c ? [a, c] : [a, b, c];
  return values.map((A, i) => ({
    id: i + 1,
    input: String(A),
    expected: problem.expected(A),
    A,
  }));
}
