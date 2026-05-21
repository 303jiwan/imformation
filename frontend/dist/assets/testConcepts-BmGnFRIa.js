import"./modulepreload-polyfill-B5Qt9EMX.js";import"./main-DfJuubAV.js";import{b as E,T as S,s as _}from"./test-problems-DTQSoVo9.js";const l=[{id:"vars",name:"변수와 자료형",tag:"기초",desc:"int, float, char, 형변환 등 기본 자료형",detail:{summary:"변수는 데이터를 저장하는 이름 붙은 메모리 공간입니다. C는 자료형에 따라 메모리 크기와 저장 범위가 달라지므로, 데이터 성격에 맞는 자료형을 선택하는 습관이 중요합니다. 형변환(cast)을 이용하면 자료형 간 값 변환도 가능합니다.",example:`#include <stdio.h>

int main(void) {
    int    나이   = 20;          /* 정수 */
    float  키     = 172.5f;      /* 단정밀도 실수 */
    double 몸무게 = 68.3;        /* 배정밀도 실수 */
    char   등급   = 'A';         /* 문자 1개 */

    printf("나이: %d\\n", 나이);
    printf("키: %.1f cm\\n", 키);
    printf("몸무게: %.1f kg\\n", 몸무게);
    printf("등급: %c\\n", 등급);

    /* int → double 형변환 */
    int a = 7, b = 2;
    printf("7/2 (int): %d\\n", a / b);
    printf("7/2 (double): %.1f\\n", (double)a / b);
    return 0;
}`,pitfalls:["`int` 변수끼리 나누면 소수점이 버려집니다. 예를 들어 `7 / 2`는 `3`입니다. 실수 결과가 필요하면 `(double)a / b` 처럼 명시적 형변환이 필요합니다.","변수를 선언만 하고 초기화하지 않으면 쓰레기 값(garbage value)이 들어 있습니다. 선언과 동시에 `= 0` 등으로 초기화하는 습관을 들이세요."]}},{id:"operators",name:"연산자",tag:"기초",desc:"산술·논리·비트 연산자, 우선순위",detail:{summary:"연산자는 값을 계산하거나 비교·결합하는 기호입니다. C에는 산술(+−*/%), 관계(== != < >), 논리(&& || !), 비트(&|^~<<>>), 대입(= += 등) 연산자가 있습니다. 연산자 우선순위를 모르면 의도치 않은 결과가 나오므로, 복잡한 식은 괄호로 명확히 표현하는 것이 좋습니다.",example:`#include <stdio.h>

int main(void) {
    int a = 10, b = 3;

    /* 산술 연산자 */
    printf("%d + %d = %d\\n", a, b, a + b);
    printf("%d %% %d = %d\\n", a, b, a % b); /* 나머지 */

    /* 관계 연산자 — 결과는 1(참) 또는 0(거짓) */
    printf("10 == 3 : %d\\n", a == b);
    printf("10 > 3  : %d\\n", a > b);

    /* 논리 연산자 */
    int x = 1, y = 0;
    printf("x && y : %d\\n", x && y);
    printf("x || y : %d\\n", x || y);

    /* 비트 연산자 */
    printf("5 & 3 = %d\\n", 5 & 3);   /* AND: 001 */
    printf("5 | 3 = %d\\n", 5 | 3);   /* OR:  111 */
    printf("5 << 1 = %d\\n", 5 << 1); /* 왼쪽 시프트: 10 */
    return 0;
}`,pitfalls:["비교할 때 `==` 대신 `=`를 쓰면 대입이 일어나 항상 참(또는 항상 거짓)으로 처리됩니다. `if (x = 0)` 처럼 실수하기 쉬우니 주의하세요.","`%` 연산자는 정수형에만 사용할 수 있습니다. 실수(float/double)에 `%`를 쓰면 컴파일 오류가 발생합니다."]}},{id:"cond",name:"조건문",tag:"기초",desc:"if / else if / switch 분기",detail:{summary:"조건문은 프로그램이 상황에 따라 다른 코드를 실행하도록 분기합니다. `if-else if-else` 구조는 다양한 조건을 순서대로 검사하고, `switch`는 하나의 값에 대해 여러 경우를 깔끔하게 나열할 때 유리합니다. 조건문을 적절히 사용하면 불필요한 연산을 줄이고 코드 가독성을 높일 수 있습니다.",example:`#include <stdio.h>

int main(void) {
    int score = 75;

    /* if-else if-else */
    if (score >= 90) {
        printf("A 등급\\n");
    } else if (score >= 80) {
        printf("B 등급\\n");
    } else if (score >= 70) {
        printf("C 등급\\n");
    } else {
        printf("F 등급\\n");
    }

    /* switch */
    int day = 3; /* 1=월, 2=화, 3=수 ... */
    switch (day) {
        case 1: printf("월요일\\n"); break;
        case 2: printf("화요일\\n"); break;
        case 3: printf("수요일\\n"); break;
        default: printf("기타\\n");  break;
    }
    return 0;
}`,pitfalls:["`switch` 문의 각 `case` 끝에 `break`를 빠뜨리면 다음 `case`로 실행이 흘러내려가는 fall-through 현상이 발생합니다. 의도하지 않은 동작이므로 반드시 `break`를 붙이세요.","`if (x = 5)` 처럼 조건식 안에서 `==` 대신 `=`를 쓰면 항상 참이 됩니다. 비교는 항상 `==`를 사용하세요."]}},{id:"loops",name:"반복문",tag:"기초",desc:"for, while, do-while, 중첩 반복",detail:{summary:"반복문은 동일한 코드를 여러 번 실행해야 할 때 사용합니다. 반복 횟수가 명확하면 `for`가 적합하고, 조건이 거짓이 될 때까지 계속 실행해야 하면 `while`을 씁니다. `do-while`은 본문을 최소 한 번은 실행한 뒤 조건을 검사합니다.",example:`#include <stdio.h>

int main(void) {
    /* for 반복문: 1부터 5까지 합 */
    int sum = 0;
    for (int i = 1; i <= 5; i++) {
        sum += i;
    }
    printf("1~5 합계: %d\\n", sum); /* 15 */

    /* while 반복문 */
    int n = 1;
    while (n <= 3) {
        printf("while: %d\\n", n);
        n++;
    }

    /* do-while: 최소 1회 실행 */
    int x = 10;
    do {
        printf("do-while: %d\\n", x);
        x++;
    } while (x < 10); /* 조건 거짓이지만 한 번은 출력됨 */

    /* 중첩 반복: 구구단 일부 */
    for (int i = 2; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            printf("%d x %d = %d\\n", i, j, i * j);
        }
    }
    return 0;
}`,pitfalls:["종료 조건을 잘못 설정하면 무한 루프에 빠집니다. `for (int i = 0; i < 10; i--)` 처럼 카운터가 반대 방향으로 움직이는 실수를 주의하세요.","`for` 문 끝에 세미콜론 `;`을 붙이면(`for (...);`) 반복 본문이 빈 문장이 되어 루프 바디가 전혀 실행되지 않습니다."]}},{id:"arrays",name:"배열",tag:"기본",desc:"1차원·2차원 배열, 인덱스 접근",detail:{summary:"배열은 같은 자료형의 값을 연속된 메모리에 저장하는 자료구조입니다. 인덱스(0부터 시작)로 각 요소에 빠르게 접근할 수 있으며, 반복문과 함께 쓰면 대량의 데이터를 효율적으로 처리할 수 있습니다. 2차원 배열은 행렬이나 표 형태의 데이터를 표현할 때 유용합니다.",example:`#include <stdio.h>

int main(void) {
    /* 1차원 배열 선언 및 초기화 */
    int scores[5] = {85, 90, 78, 92, 88};

    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += scores[i];
        printf("scores[%d] = %d\\n", i, scores[i]);
    }
    printf("평균: %.1f\\n", (double)sum / 5);

    /* 2차원 배열: 2행 3열 */
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            printf("%d ", matrix[r][c]);
        }
        printf("\\n");
    }
    return 0;
}`,pitfalls:["배열 인덱스는 0부터 시작합니다. 크기가 5인 배열에서 `scores[5]`에 접근하면 범위를 벗어난 메모리를 읽거나 쓰게 되어(out-of-bounds) 정의되지 않은 동작이 발생합니다.","배열을 함수에 넘길 때는 포인터로 전달되므로 `sizeof(arr)`로 크기를 구하면 배열 전체 크기가 아니라 포인터 크기(보통 8바이트)가 반환됩니다. 배열 크기는 별도 인자로 넘겨야 합니다."]}},{id:"strings",name:"문자열",tag:"기본",desc:"char 배열과 문자열 처리 함수",detail:{summary:"C에서 문자열은 `char` 배열로 표현되며, 마지막에 null 문자(`'\\0'`)가 반드시 있어야 합니다. `<string.h>` 라이브러리의 `strlen`, `strcpy`, `strcat`, `strcmp` 등의 함수를 이용해 문자열을 안전하게 다룰 수 있습니다.",example:`#include <stdio.h>
#include <string.h>

int main(void) {
    char name[20] = "Alice";    /* 자동으로 '\\0' 추가됨 */
    char greeting[50];

    printf("이름: %s\\n", name);
    printf("길이: %zu\\n", strlen(name)); /* 5 */

    /* strcpy: 문자열 복사 */
    strcpy(greeting, "안녕하세요, ");
    /* strcat: 문자열 이어 붙이기 */
    strcat(greeting, name);
    printf("%s!\\n", greeting);

    /* strcmp: 문자열 비교 (같으면 0) */
    if (strcmp(name, "Alice") == 0) {
        printf("이름이 Alice입니다.\\n");
    }

    /* 문자 단위 접근 */
    for (int i = 0; name[i] != '\\0'; i++) {
        printf("%c ", name[i]);
    }
    printf("\\n");
    return 0;
}`,pitfalls:['`char str[5] = "Hello"` 처럼 배열 크기를 문자 수와 똑같이 잡으면 null 문자(`\\0`)를 저장할 공간이 없어 문자열 함수가 오동작합니다. 항상 필요한 크기 + 1 이상으로 선언하세요.','`scanf`로 문자열을 입력받을 때 `&` 없이 배열 이름만 쓰는 건 맞지만, 입력 길이가 버퍼보다 길면 버퍼 오버플로우가 발생합니다. `scanf("%19s", str)` 처럼 최대 길이를 지정하는 것이 안전합니다.']}},{id:"functions",name:"함수",tag:"기본",desc:"함수 정의, 파라미터, 반환 값",detail:{summary:"함수는 특정 작업을 수행하는 코드 블록으로, 이름을 붙여 여러 곳에서 재사용할 수 있게 합니다. 파라미터로 값을 받고 `return`으로 결과를 돌려주며, 같은 코드를 반복하지 않아도 되므로 프로그램이 간결해집니다. C는 함수를 호출하기 전에 선언(프로토타입) 또는 정의가 먼저 나와야 합니다.",example:`#include <stdio.h>

/* 함수 프로토타입 선언 */
int add(int a, int b);
double average(int arr[], int n);

int main(void) {
    printf("3 + 4 = %d\\n", add(3, 4));

    int scores[4] = {80, 90, 70, 100};
    printf("평균: %.1f\\n", average(scores, 4));
    return 0;
}

/* 함수 정의 */
int add(int a, int b) {
    return a + b;
}

double average(int arr[], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }
    return (double)sum / n;
}`,pitfalls:["함수가 정의되기 전에 호출하면서 프로토타입도 없으면 컴파일 오류 또는 경고가 발생합니다. 파일 상단에 프로토타입을 미리 선언하는 습관을 들이세요.","C는 값에 의한 복사(pass by value)로 인자를 전달합니다. 함수 안에서 파라미터 값을 바꿔도 호출부의 원본 변수는 변하지 않습니다. 원본을 바꾸려면 포인터를 넘겨야 합니다."]}},{id:"io",name:"표준 입출력",tag:"기본",desc:"scanf, printf, 형식 지정자",detail:{summary:"표준 입출력은 키보드로 값을 받고 화면에 결과를 출력하는 가장 기본적인 사용자 인터페이스입니다. `printf`는 형식 문자열로 다양한 자료형을 출력하고, `scanf`는 형식 지정자에 맞게 입력을 파싱해 변수에 저장합니다. 형식 지정자와 변수 자료형이 맞지 않으면 예상치 못한 결과가 생깁니다.",example:`#include <stdio.h>

int main(void) {
    int    age;
    double height;
    char   name[30];

    /* 입력 */
    printf("이름을 입력하세요: ");
    scanf("%29s", name);          /* 버퍼 크기 - 1 */

    printf("나이를 입력하세요: ");
    scanf("%d", &age);            /* int는 & 필수 */

    printf("키(cm)를 입력하세요: ");
    scanf("%lf", &height);        /* double은 %lf */

    /* 출력 */
    printf("\\n=== 입력 결과 ===\\n");
    printf("이름: %s\\n", name);
    printf("나이: %d세\\n", age);
    printf("키: %.1f cm\\n", height);
    return 0;
}`,pitfalls:['`scanf`로 정수나 실수를 받을 때 변수 앞에 `&`를 빠뜨리면 주소가 아니라 쓰레기 값에 데이터를 쓰게 되어 프로그램이 충돌(segfault)합니다. `scanf("%d", &n)` 처럼 항상 `&`를 붙이세요.',"`double` 변수에는 `scanf`에서 `%lf`를 써야 합니다. `%f`를 사용하면 값이 잘못 읽히거나 경고가 발생합니다. `printf`에서는 `%f`로도 `double`을 출력할 수 있지만, `scanf`는 구별합니다."]}},{id:"pointers",name:"포인터",tag:"중급",desc:"주소·역참조, 포인터 산술",detail:{summary:"포인터는 다른 변수의 메모리 주소를 저장하는 변수입니다. `&` 연산자로 주소를 얻고, `*` 연산자로 그 주소의 값에 접근(역참조)합니다. 포인터를 통해 함수가 원본 데이터를 수정하거나, 배열을 효율적으로 다루거나, 동적 메모리를 사용할 수 있습니다.",example:`#include <stdio.h>

/* 포인터로 두 값 교환 */
void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void) {
    int x = 10, y = 20;
    int *p = &x; /* p는 x의 주소를 가리킴 */

    printf("x = %d, 주소 = %p\\n", x, (void *)p);
    printf("*p = %d\\n", *p); /* 역참조: 10 */

    *p = 99; /* x 값을 포인터로 변경 */
    printf("x = %d (포인터로 변경 후)\\n", x);

    swap(&x, &y);
    printf("swap 후: x=%d, y=%d\\n", x, y);

    /* 포인터 산술: 배열 순회 */
    int arr[3] = {1, 2, 3};
    int *q = arr;
    for (int i = 0; i < 3; i++) {
        printf("arr[%d] = %d\\n", i, *(q + i));
    }
    return 0;
}`,pitfalls:["포인터를 선언만 하고 초기화하지 않은 채 역참조하면(wild pointer) 정의되지 않은 동작이 발생합니다. 사용 전에 반드시 `int *p = &x;` 또는 `NULL`로 초기화하고, `NULL` 여부를 확인하세요.","`NULL` 포인터를 역참조하면 프로그램이 즉시 종료됩니다. 포인터를 반환하는 함수의 결과는 사용 전에 항상 `if (p != NULL)` 검사를 해야 합니다."]}},{id:"structs",name:"구조체",tag:"중급",desc:"struct, typedef, 멤버 접근",detail:{summary:"구조체(struct)는 서로 다른 자료형의 데이터를 묶어 하나의 새로운 타입으로 정의합니다. 이름, 나이, 점수처럼 논리적으로 연관된 데이터를 하나의 변수로 관리할 수 있어 코드가 명확해집니다. `typedef`를 함께 쓰면 `struct` 키워드를 생략하고 더 간결하게 사용할 수 있습니다.",example:`#include <stdio.h>
#include <string.h>

/* typedef로 구조체 타입 별칭 부여 */
typedef struct {
    char name[30];
    int  age;
    double score;
} Student;

void printStudent(const Student *s) {
    printf("이름: %s, 나이: %d, 점수: %.1f\\n",
           s->name, s->age, s->score);
}

int main(void) {
    Student s1;
    strcpy(s1.name, "김철수");
    s1.age   = 21;
    s1.score = 88.5;

    /* 직접 접근: . 연산자 */
    printf("이름: %s\\n", s1.name);

    /* 포인터 접근: -> 연산자 */
    Student *p = &s1;
    printf("나이: %d\\n", p->age);

    printStudent(&s1);
    return 0;
}`,pitfalls:["구조체 변수를 직접 접근할 때는 `.` 연산자, 포인터로 접근할 때는 `->` 연산자를 사용합니다. 혼동하면 컴파일 오류가 발생합니다.","구조체를 함수에 값으로 전달하면 전체가 복사되어 성능이 저하될 수 있습니다. 크기가 큰 구조체는 포인터(`const Student *`)로 전달하는 것이 효율적입니다."]}},{id:"memory",name:"동적 메모리",tag:"중급",desc:"malloc / calloc / free",detail:{summary:"동적 메모리 할당은 프로그램 실행 중에 필요한 만큼 메모리를 힙(heap)에서 요청하는 방법입니다. `malloc`은 초기화 없이, `calloc`은 0으로 초기화하며 할당합니다. 사용이 끝나면 반드시 `free`로 해제해야 메모리 누수(leak)를 막을 수 있습니다.",example:`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;

    /* malloc: n개의 int 공간 할당 */
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("메모리 할당 실패\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10; /* 10, 20, 30, 40, 50 */
    }
    for (int i = 0; i < n; i++) {
        printf("arr[%d] = %d\\n", i, arr[i]);
    }

    free(arr);   /* 반드시 해제 */
    arr = NULL;  /* 해제 후 NULL로 초기화 — dangling pointer 방지 */

    /* calloc: 0으로 초기화된 3개의 double 할당 */
    double *buf = (double *)calloc(3, sizeof(double));
    if (buf != NULL) {
        printf("buf[0] = %.1f (0으로 초기화됨)\\n", buf[0]);
        free(buf);
    }
    return 0;
}`,pitfalls:["`malloc`이 `NULL`을 반환할 수 있습니다(메모리 부족 등). 반드시 `if (ptr == NULL)` 로 검사하고 실패 처리를 해야 합니다.","`free` 한 포인터를 다시 역참조하거나(use-after-free) 두 번 해제(double free)하면 프로그램이 충돌하거나 보안 취약점이 생깁니다. `free` 직후 포인터를 `NULL`로 설정하세요."]}},{id:"recursion",name:"재귀",tag:"응용",desc:"재귀 함수, 호출 스택, 종료 조건",detail:{summary:"재귀는 함수가 자기 자신을 호출하는 기법으로, 분할 정복(큰 문제를 작은 문제로 나누기)에 적합합니다. 반드시 '종료 조건(base case)'이 있어야 하며, 각 재귀 호출은 종료 조건에 가까워져야 합니다. 재귀 호출 깊이가 너무 깊어지면 스택 오버플로우가 발생하므로 주의해야 합니다.",example:`#include <stdio.h>

/* 팩토리얼: n! = n * (n-1)! */
int factorial(int n) {
    if (n <= 1) return 1;      /* 종료 조건 */
    return n * factorial(n - 1);
}

/* 피보나치 수열 */
int fib(int n) {
    if (n <= 1) return n;      /* 종료 조건 */
    return fib(n - 1) + fib(n - 2);
}

/* 재귀로 배열 합산 */
int sumArray(int arr[], int n) {
    if (n == 0) return 0;      /* 종료 조건 */
    return arr[n - 1] + sumArray(arr, n - 1);
}

int main(void) {
    printf("5! = %d\\n", factorial(5));   /* 120 */
    printf("fib(7) = %d\\n", fib(7));     /* 13 */

    int nums[4] = {1, 2, 3, 4};
    printf("합: %d\\n", sumArray(nums, 4)); /* 10 */
    return 0;
}`,pitfalls:["종료 조건을 빠뜨리거나 잘못 설정하면 함수가 무한히 자기 자신을 호출해 스택 오버플로우로 프로그램이 강제 종료됩니다. 재귀 함수를 작성할 때는 종료 조건을 먼저 설계하세요.","재귀로 피보나치를 단순 구현하면 같은 값을 중복 계산해 입력이 조금만 커져도 실행 시간이 폭발적으로 늘어납니다(지수 시간). 성능이 중요한 경우 반복문이나 메모이제이션을 고려하세요."]}}],w=["vars","cond","loops","arrays","functions"],b="codenergy:test:concepts",s=document.getElementById("concept-grid"),k=document.getElementById("concept-count"),h=document.getElementById("start-btn"),A=document.getElementById("skip-btn"),C=document.getElementById("select-all-btn"),N=document.getElementById("clear-btn"),g=document.getElementById("page-fade");let a=null;function I(){s.innerHTML="";const t=T();for(const e of l){const n=document.createElement("div");n.className="concept-tile";const r=document.createElement("label");r.className="concept-tile__select",r.innerHTML=`
      <input type="checkbox" name="concept" value="${e.id}" ${t.includes(e.id)?"checked":""} />
      <span class="concept-tile__tag">${e.tag}</span>
      <div class="concept-tile__head">
        <h3 class="concept-tile__name">${e.name}</h3>
        <span class="concept-tile__check" aria-hidden="true">✓</span>
      </div>
      <p class="concept-tile__desc">${e.desc}</p>
    `,r.querySelector("input").addEventListener("change",o);const i=document.createElement("button");i.type="button",i.className="concept-tile__detail-btn",i.dataset.conceptId=e.id,i.setAttribute("aria-haspopup","dialog"),i.setAttribute("aria-controls","concept-detail-modal"),i.textContent="자세히",i.addEventListener("click",()=>B(i.dataset.conceptId)),n.appendChild(r),n.appendChild(i),s.appendChild(n)}o()}function B(t){const e=l.find(d=>d.id===t);if(!e)return;const n=document.getElementById("concept-detail-modal");if(!n){console.warn("concept-detail-modal element not found");return}const r=n.querySelector(".detail__tag");r&&(r.textContent=e.tag);const i=n.querySelector(".detail__name");i&&(i.textContent=e.name);const f=n.querySelector(".detail__summary");f&&(f.textContent=e.detail.summary);const u=n.querySelector(".detail__example");u&&(u.textContent=e.detail.example);const c=n.querySelector(".detail__pitfalls");if(c){c.innerHTML="";for(const d of e.detail.pitfalls){const m=document.createElement("li");m.textContent=d,c.appendChild(m)}}a=document.activeElement,n.removeAttribute("hidden");const p=n.querySelector("button[data-close]");p&&p.focus()}function y(){const t=document.getElementById("concept-detail-modal");t&&(t.hidden=!0,a&&(a.focus(),a=null))}document.addEventListener("click",t=>{t.target.closest("[data-close]")&&y()});document.addEventListener("keydown",t=>{if(t.key!=="Escape")return;const e=document.getElementById("concept-detail-modal");e&&!e.hidden&&y()});function x(){return Array.from(s.querySelectorAll("input[name=concept]:checked")).map(t=>t.value)}function v(t){for(const e of s.querySelectorAll("input[name=concept]"))e.checked=t.includes(e.value);o()}function o(){const t=x().length;k.innerHTML=`<strong>${t}</strong>개 개념 선택됨`,h.disabled=t===0}function T(){try{const t=sessionStorage.getItem(b);if(!t)return[];const e=JSON.parse(t);if(Array.isArray(e==null?void 0:e.concepts))return e.concepts}catch{}return[]}function L(t){try{sessionStorage.setItem(b,JSON.stringify({concepts:t,savedAt:Date.now()}));const e=E(t,S);_(e),sessionStorage.setItem("codenergy:test:progress",JSON.stringify({current:1,total:e.length})),sessionStorage.removeItem("codenergy:test:answers"),sessionStorage.removeItem("codenergy:test:timer")}catch{}g&&g.classList.remove("is-hidden"),setTimeout(()=>{window.location.href="test-intro.html"},180)}h.addEventListener("click",()=>{const t=x();t.length!==0&&L(t)});A.addEventListener("click",()=>{L(w)});C.addEventListener("click",()=>{v(l.map(t=>t.id))});N.addEventListener("click",()=>{v([])});I();
