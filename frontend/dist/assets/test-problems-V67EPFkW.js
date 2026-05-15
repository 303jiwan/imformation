const l=5,f=6e5,n=t=>`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);

    // TODO: ${t}

    return 0;
}
`,a=[{id:1,tag:"기초 · 산술",title:"두 수의 합",description:"정수 <code>A</code>가 입력으로 주어집니다. <code>A</code>와 <code>A + 1</code>의 합을 한 줄에 출력하는 프로그램을 작성하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"첫 줄에 <code>A + (A + 1)</code>의 값을 출력합니다.",constraints:["1 ≤ A ≤ 10"],examples:[{input:"3",output:"7"},{input:"5",output:"11"}],aMin:1,aMax:10,aDefault:3,concepts:["vars","io","operators"],starter:n("A와 A+1의 합을 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", A + (A + 1));
    return 0;
}
`,expected:t=>String(t+(t+1))},{id:2,tag:"기초 · 조건문",title:"짝수 / 홀수 판정",description:"양의 정수 <code>A</code>가 주어집니다. <code>A</code>가 짝수면 <code>even</code>, 홀수면 <code>odd</code>를 출력하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>A</code>가 짝수면 <code>even</code>, 홀수면 <code>odd</code>를 출력합니다.",constraints:["1 ≤ A ≤ 20"],examples:[{input:"4",output:"even"},{input:"7",output:"odd"}],aMin:1,aMax:20,aDefault:4,concepts:["cond","operators","io"],starter:n("짝수면 even, 홀수면 odd를 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    if (A % 2 == 0) printf("even\\n");
    else            printf("odd\\n");
    return 0;
}
`,expected:t=>t%2===0?"even":"odd"},{id:3,tag:"기본 · 반복문",title:"1부터 A까지의 합",description:"양의 정수 <code>A</code>가 주어집니다. <code>1</code>부터 <code>A</code>까지 모든 정수의 합을 출력하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>1 + 2 + ... + A</code>의 값을 출력합니다.",constraints:["1 ≤ A ≤ 100"],examples:[{input:"5",output:"15"},{input:"10",output:"55"}],aMin:1,aMax:100,aDefault:5,concepts:["loops","operators","io"],starter:n("1부터 A까지의 합을 출력하세요 (반복문 사용)"),solution:`#include <stdio.h>

int main(void) {
    int A, sum = 0;
    scanf("%d", &A);
    for (int i = 1; i <= A; i++) sum += i;
    printf("%d\\n", sum);
    return 0;
}
`,expected:t=>String(t*(t+1)/2)},{id:4,tag:"기본 · 자릿수",title:"자연수 A의 자릿수",description:"양의 정수 <code>A</code>가 주어집니다. <code>A</code>가 몇 자리 수인지 출력하세요. 예를 들어 <code>A = 1234</code>면 <code>4</code>를 출력합니다.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>A</code>의 자릿수 개수를 출력합니다.",constraints:["1 ≤ A ≤ 10000"],examples:[{input:"987",output:"3"},{input:"1234",output:"4"}],aMin:1,aMax:1e4,aDefault:987,concepts:["loops","operators","cond"],starter:n("A의 자릿수 개수를 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A, digits = 0;
    scanf("%d", &A);
    while (A > 0) { digits++; A /= 10; }
    printf("%d\\n", digits);
    return 0;
}
`,expected:t=>String(String(t).length)},{id:5,tag:"응용 · 약수",title:"약수의 개수",description:"양의 정수 <code>A</code>가 주어집니다. <code>A</code>의 양의 약수의 개수를 출력하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>A</code>의 약수의 개수를 출력합니다.",constraints:["1 ≤ A ≤ 50"],examples:[{input:"12",output:"6"},{input:"7",output:"2"}],aMin:1,aMax:50,aDefault:12,concepts:["loops","cond","operators"],starter:n("A의 약수 개수를 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A, count = 0;
    scanf("%d", &A);
    for (int i = 1; i <= A; i++) {
        if (A % i == 0) count++;
    }
    printf("%d\\n", count);
    return 0;
}
`,expected:t=>{let e=0;for(let o=1;o<=t;o++)t%o===0&&e++;return String(e)}},{id:6,tag:"응용 · 재귀",title:"팩토리얼 A!",description:"양의 정수 <code>A</code>가 주어집니다. <code>A! = 1 × 2 × ... × A</code>의 값을 출력하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>A!</code>의 값을 출력합니다.",constraints:["1 ≤ A ≤ 10"],examples:[{input:"3",output:"6"},{input:"5",output:"120"}],aMin:1,aMax:10,aDefault:5,concepts:["recursion","functions","io"],starter:n("A 팩토리얼을 출력하세요 (재귀 함수 권장)"),solution:`#include <stdio.h>

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
`,expected:t=>{let e=1;for(let o=2;o<=t;o++)e*=o;return String(e)}},{id:7,tag:"응용 · 재귀",title:"피보나치 수 fib(A)",description:"양의 정수 <code>A</code>가 주어집니다. <code>fib(1) = 1</code>, <code>fib(2) = 1</code>이고 <code>fib(n) = fib(n-1) + fib(n-2)</code>로 정의되는 수열의 <code>A</code>번째 값을 출력하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>fib(A)</code>의 값을 출력합니다.",constraints:["1 ≤ A ≤ 30"],examples:[{input:"1",output:"1"},{input:"10",output:"55"}],aMin:1,aMax:30,aDefault:10,concepts:["recursion","functions","loops"],starter:n("피보나치 수 fib(A)를 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    long long a = 1, b = 1;
    for (int i = 3; i <= A; i++) { long long c = a + b; a = b; b = c; }
    printf("%lld\\n", b);
    return 0;
}
`,expected:t=>{let e=1,o=1;for(let c=3;c<=t;c++){const d=e+o;e=o,o=d}return String(o)}},{id:8,tag:"기본 · 문자열",title:"별 A개 출력",description:"양의 정수 <code>A</code>가 주어집니다. <code>'*'</code> 문자를 <code>A</code>개 한 줄에 이어서 출력하세요. 예를 들어 <code>A = 4</code>면 <code>****</code>를 출력합니다.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>'*'</code>를 <code>A</code>개 출력합니다.",constraints:["1 ≤ A ≤ 50"],examples:[{input:"3",output:"***"},{input:"7",output:"*******"}],aMin:1,aMax:50,aDefault:5,concepts:["loops","strings","io"],starter:n("별 A개를 한 줄에 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 0; i < A; i++) printf("*");
    printf("\\n");
    return 0;
}
`,expected:t=>"*".repeat(t)},{id:9,tag:"응용 · 소수",title:"소수 판정",description:"<code>2</code> 이상의 정수 <code>A</code>가 주어집니다. <code>A</code>가 소수면 <code>prime</code>, 아니면 <code>not prime</code>을 출력하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>A</code>가 소수면 <code>prime</code>, 아니면 <code>not prime</code>을 출력합니다.",constraints:["2 ≤ A ≤ 100"],examples:[{input:"7",output:"prime"},{input:"12",output:"not prime"}],aMin:2,aMax:100,aDefault:7,concepts:["loops","cond","operators"],starter:n("A가 소수면 prime, 아니면 not prime을 출력하세요"),solution:`#include <stdio.h>

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
`,expected:t=>{if(t<2)return"not prime";for(let e=2;e*e<=t;e++)if(t%e===0)return"not prime";return"prime"}},{id:10,tag:"기초 · 산술",title:"A의 세제곱",description:"양의 정수 <code>A</code>가 주어집니다. <code>A의 세제곱(A × A × A)</code>을 출력하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>A × A × A</code>의 값을 출력합니다.",constraints:["1 ≤ A ≤ 100"],examples:[{input:"2",output:"8"},{input:"5",output:"125"}],aMin:1,aMax:100,aDefault:5,concepts:["vars","operators","io"],starter:n("A의 세제곱을 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    printf("%d\\n", A * A * A);
    return 0;
}
`,expected:t=>String(t*t*t)},{id:11,tag:"기본 · 문자열",title:"알파벳 A개 출력",description:"양의 정수 <code>A</code>가 주어집니다. <code>'a'</code>부터 시작해 알파벳 <code>A</code>개를 한 줄에 이어서 출력하세요. 예) <code>A = 3</code> → <code>abc</code>",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>'a'</code>부터 <code>A</code>개의 알파벳을 출력합니다.",constraints:["1 ≤ A ≤ 26"],examples:[{input:"3",output:"abc"},{input:"5",output:"abcde"}],aMin:1,aMax:26,aDefault:5,concepts:["loops","strings","vars","io"],starter:n("'a'부터 A개의 알파벳을 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 0; i < A; i++) printf("%c", 'a' + i);
    printf("\\n");
    return 0;
}
`,expected:t=>"abcdefghijklmnopqrstuvwxyz".slice(0,t)},{id:12,tag:"기본 · 문자열",title:"Hello를 A번 출력",description:"양의 정수 <code>A</code>가 주어집니다. 문자열 <code>Hello</code>를 한 줄에 <code>A</code>번 이어서 출력하세요. 예) <code>A = 2</code> → <code>HelloHello</code>",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>Hello</code>를 <code>A</code>번 이어서 출력합니다.",constraints:["1 ≤ A ≤ 10"],examples:[{input:"2",output:"HelloHello"},{input:"3",output:"HelloHelloHello"}],aMin:1,aMax:10,aDefault:3,concepts:["loops","strings","functions","io"],starter:n("Hello를 A번 이어서 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 0; i < A; i++) printf("Hello");
    printf("\\n");
    return 0;
}
`,expected:t=>"Hello".repeat(t)},{id:13,tag:"응용 · 자릿수",title:"A의 자릿수 거꾸로 출력",description:"양의 정수 <code>A</code>가 주어집니다. <code>A</code>의 각 자릿수를 거꾸로 한 줄에 출력하세요. 예) <code>A = 1234</code> → <code>4321</code>",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>A</code>의 자릿수를 끝자리부터 차례로 출력합니다.",constraints:["10 ≤ A ≤ 99999"],examples:[{input:"1234",output:"4321"},{input:"98",output:"89"}],aMin:10,aMax:99999,aDefault:1234,concepts:["loops","strings","operators","vars"],starter:n("A의 자릿수를 거꾸로 출력하세요"),solution:`#include <stdio.h>

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
`,expected:t=>String(t).split("").reverse().join("")},{id:14,tag:"응용 · 재귀",title:"1부터 A까지 합 (재귀)",description:"양의 정수 <code>A</code>가 주어집니다. <code>1 + 2 + ... + A</code>의 값을 <strong>재귀 함수</strong>로 계산해 출력하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>1</code>부터 <code>A</code>까지의 합을 출력합니다.",constraints:["1 ≤ A ≤ 100"],examples:[{input:"5",output:"15"},{input:"10",output:"55"}],aMin:1,aMax:100,aDefault:5,concepts:["recursion","functions","operators"],starter:n("재귀 함수로 1부터 A까지의 합을 출력하세요"),solution:`#include <stdio.h>

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
`,expected:t=>String(t*(t+1)/2)},{id:15,tag:"응용 · 재귀",title:"2의 A제곱 (재귀)",description:"<code>0</code> 이상의 정수 <code>A</code>가 주어집니다. <code>2의 A제곱(2^A)</code>을 <strong>재귀 함수</strong>로 계산해 출력하세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>2^A</code>의 값을 출력합니다.",constraints:["0 ≤ A ≤ 30"],examples:[{input:"0",output:"1"},{input:"10",output:"1024"}],aMin:0,aMax:30,aDefault:10,concepts:["recursion","functions","operators"],starter:n("재귀 함수로 2^A를 출력하세요"),solution:`#include <stdio.h>

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
`,expected:t=>String(2**t)},{id:16,tag:"응용 · 재귀",title:"하노이 탑 최소 이동 횟수",description:"원판 <code>A</code>개로 하노이 탑 문제를 풀 때 필요한 최소 이동 횟수 <code>2^A − 1</code>을 출력하세요. <strong>재귀 함수</strong>로 풀어보세요.",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"최소 이동 횟수를 출력합니다.",constraints:["1 ≤ A ≤ 25"],examples:[{input:"1",output:"1"},{input:"5",output:"31"}],aMin:1,aMax:25,aDefault:5,concepts:["recursion","functions","operators"],starter:n("재귀로 하노이 탑 최소 이동 횟수를 출력하세요"),solution:`#include <stdio.h>

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
`,expected:t=>String(2**t-1)},{id:17,tag:"기본 · 문자열",title:"Z부터 A개 알파벳 거꾸로",description:"양의 정수 <code>A</code>가 주어집니다. <code>'Z'</code>부터 알파벳을 거꾸로 <code>A</code>개 한 줄에 출력하세요. 예) <code>A = 3</code> → <code>ZYX</code>",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>'Z'</code>부터 <code>A</code>개의 알파벳을 거꾸로 출력합니다.",constraints:["1 ≤ A ≤ 26"],examples:[{input:"3",output:"ZYX"},{input:"5",output:"ZYXWV"}],aMin:1,aMax:26,aDefault:5,concepts:["loops","strings","vars","io"],starter:n("'Z'부터 A개의 알파벳을 거꾸로 출력하세요"),solution:`#include <stdio.h>

int main(void) {
    int A;
    scanf("%d", &A);
    for (int i = 0; i < A; i++) printf("%c", 'Z' - i);
    printf("\\n");
    return 0;
}
`,expected:t=>"ZYXWVUTSRQPONMLKJIHGFEDCBA".slice(0,t)},{id:18,tag:"응용 · 진수 변환",title:"A를 2진수로 출력",description:"양의 정수 <code>A</code>가 주어집니다. <code>A</code>를 2진수 표현으로 한 줄에 출력하세요. 예) <code>A = 10</code> → <code>1010</code>",inputDesc:"첫 줄에 정수 <code>A</code>가 주어집니다.",outputDesc:"<code>A</code>의 2진수 표현을 출력합니다.",constraints:["1 ≤ A ≤ 1023"],examples:[{input:"5",output:"101"},{input:"10",output:"1010"}],aMin:1,aMax:1023,aDefault:10,concepts:["loops","cond","operators","vars","io"],starter:n("A를 2진수로 출력하세요"),solution:`#include <stdio.h>

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
`,expected:t=>t.toString(2)}],A="codenergy:test:queue";function g(t,e=5){const o=new Set(t||[]),c=i=>{for(let s=i.length-1;s>0;s--){const p=Math.floor(Math.random()*(s+1));[i[s],i[p]]=[i[p],i[s]]}return i},d=c(a.filter(i=>Array.isArray(i.concepts)&&i.concepts.some(s=>o.has(s)))),u=new Set(d.map(i=>i.id)),r=c(a.filter(i=>!u.has(i.id)));return[...d,...r].slice(0,e).map(i=>i.id)}function m(){try{const t=sessionStorage.getItem(A);if(!t)return null;const e=JSON.parse(t);if(!Array.isArray(e)||e.length===0)return null;const o=e.filter(c=>a.some(d=>d.id===c));return o.length?o:null}catch{return null}}function x(t){try{sessionStorage.setItem(A,JSON.stringify(t))}catch{}}function D(t){const e=t.aMin,o=t.aMax,c=Math.floor((e+o)/2);return(e===o?[e]:e+1===o?[e,o]:[e,c,o]).map((u,r)=>({id:r+1,input:String(u),expected:t.expected(u),A:u}))}export{a as P,A as Q,l as T,f as a,g as b,D as g,m as l,x as s};
