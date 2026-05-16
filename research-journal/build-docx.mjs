// 정보영재원 연구일지 (.docx) 생성기
// 영재성 기준(학문적 능력 / 창의성 / 과제집착력 / 자기주도성 / 협업·의사소통)에 맞춰 정리
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  ImageRun, PageBreak, LevelFormat, convertInchesToTwip
} from "docx";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const SHOTS = resolve(process.cwd(), "screenshots");
const OUT = resolve(process.cwd(), "Codenergy_연구일지_2026.docx");

// ─── 팀 / 개인 정보 ───────────────────────────────────────────────────────
const TEAM = {
  title: "Codenergy — 코딩테스트 기반 맞춤형 학습 플랫폼 개발",
  subtitle: "지식에서 스킬로: 약점 진단 → 개인화 학습 → 게임화 동기부여",
  period: "2026-04-26 ~ 2026-05-16 (약 3주)",
  members: [
    { name: "하준호 (본인)", role: "팀장 / 풀스택 개발 (프론트엔드 + 백엔드)", email: "ferrari5712@gmail.com", github: "goatjoatgoat" },
    { name: "이지완",        role: "백엔드 / 데이터 모델링 / 머지 관리", github: "303jiwan" },
  ],
  repo: "https://github.com/303jiwan/imformation"
};

// ─── 영재성 기준 매핑 ────────────────────────────────────────────────────
const GIFTEDNESS = [
  {
    key: "학문적 능력",
    desc: "정보과학(자료구조·알고리즘·언어·시스템) 지식을 실제 코드와 시스템 설계에 적용하는 역량",
    evidence: [
      "C언어 문법(출력/변수/자료형/연산자/입출력) 학습 콘텐츠를 직접 설계하고 28문제 이상의 예제 코드를 작성",
      "Express 4 + node:sqlite + bcryptjs 기반의 세션 인증·CORS·WAL 모드 DB 등 백엔드 아키텍처를 구성",
      "Vite 멀티페이지 빌드와 Rollup 엔트리 분리, 외부 채점 API(Judge0/RapidAPI) 연동 등 시스템 통합을 수행"
    ]
  },
  {
    key: "창의성",
    desc: "기존 학습 도구와 차별되는 새로운 접근(약점 진단 → 트레일형 학습 → 아바타 보상 게임화)을 제안",
    evidence: [
      "'코딩테스트를 학습의 입력 신호로 사용한다'는 역발상 (테스트 결과로 약점 개념을 추출해 학습 추천)",
      "Trail(트레일) 육각형 노드 UI로 학습 경로를 시각화하여 학습 진척도를 게임처럼 표현",
      "학습량에 따라 포인트를 얻고 상점에서 아이템을 구매해 아바타를 꾸미는 보상 시스템 구상",
      "data-tilt 속성 한 줄로 어떤 카드든 3D 틸트 효과가 자동 적용되도록 한 재사용 가능한 인터랙션 설계"
    ]
  },
  {
    key: "과제집착력",
    desc: "장기간(약 3주) 동안 동일한 목표를 향해 반복적으로 코드를 개선하고 콘텐츠를 누적",
    evidence: [
      "2026-04-26 초기 커밋부터 5/16까지 50여 차례의 변경을 누적하며 단일 프로젝트를 끝까지 진행",
      "Trail 0 (8 레슨 / 16 문제) → Trail 1 (14 레슨 / 28 문제) 으로 학습 콘텐츠를 단계적으로 확장",
      "Codex 자동 코드리뷰의 P1/P2 지적 사항을 별도 커밋으로 수정해 품질을 마무리"
    ]
  },
  {
    key: "자기주도성",
    desc: "주제 선정 · 기술 선택 · 일정 관리를 스스로 결정하고 학습 격차를 메우며 진행",
    evidence: [
      "프레임워크 없이 바닐라 JS + Vite 멀티페이지 라는 가벼운 스택을 능동적으로 선택",
      "Judge0 무료 티어가 일 50회 제한이라는 외부 제약을 직접 파악하고 mock-mode 폴백 로직을 추가",
      "외부 도구(Claude Code, Codex CLI) 를 보조로 활용하되 설계와 의사결정은 직접 수행"
    ]
  },
  {
    key: "협업 · 의사소통",
    desc: "Git 브랜치 / Pull Request 워크플로로 팀원과 코드를 통합하고, 한국어 UI·문서로 의사소통",
    evidence: [
      "이지완 팀원의 PR #1 (jiwan 브랜치) 을 main 으로 머지하고 db.js 충돌(lectures + surveys + email_auth_codes)을 해결",
      "두 머신(USER/seok 등 다른 윈도우 사용자명)에서 동시에 작업하면서도 경로를 하드코딩하지 않는 규칙을 유지",
      "11개 페이지 전반의 한국어 카피와 에러 메시지를 일관된 톤으로 유지"
    ]
  }
];

// ─── 날짜별 활동 (한 줄 결과물 설명 + 담당자) ──────────────────────────
const DAILY = [
  { date: "2026-04-26", who: "이지완", result: "프로젝트 저장소 초기화 및 백엔드 디렉터리 골격 생성. Express 서버와 SQLite 폴더 구조를 잡아 팀 작업의 출발선을 만듦." },
  { date: "2026-05-06", who: "하준호", result: "로컬 개발환경 점검 및 첫 작업 커밋. Vite + Express 동시 구동(npm run dev) 흐름을 확인하고 작업 베이스라인 확보." },
  { date: "2026-05-07", who: "하준호", result: "랜딩 페이지(index.html) 카드 레이아웃과 data-tilt 3D 인터랙션 적용. '코딩테스트, 지식에서 스킬로' 슬로건 시각화." },
  { date: "2026-05-08", who: "이지완", result: "백엔드 라우터·미들웨어 정리. 추후 인증·테스트·아바타 라우터를 분리하기 위한 모듈 경계를 잡음." },
  { date: "2026-05-09", who: "하준호", result: "회원 인증 흐름(signup/login/logout/me) 구현. bcryptjs 해시 + 쿠키 세션(sid)으로 보안 기본기를 갖춤. 로그인 페이지 UI 연결." },
  { date: "2026-05-10", who: "하준호", result: "충돌 머지 정리 및 이미지/정적 자원 동기화. 두 머신에서의 작업 결과를 main에 통합." },
  { date: "2026-05-14", who: "하준호", result: "테스트 진행 페이지(test-intro → test-concepts → test-problem → test-result) 라우팅과 sessionStorage 키(codenergy:test:*) 기반 상태 저장 안정화." },
  { date: "2026-05-15", who: "이지완", result: "백엔드 데이터 모델 확장: lectures(강의) + surveys(설문) + email_auth_codes(이메일 인증) 스키마 작업. 머지 준비 완료." },
  { date: "2026-05-16 ①", who: "하준호", result: "강의 페이지(lectures.html)와 11개 페이지 네비게이션에 '강의' 링크 추가. 동시에 후기 섹션은 정리해 정보 밀도를 높임." },
  { date: "2026-05-16 ②", who: "하준호", result: "강의 업로드 본인 삭제 버튼 추가. 본인이 올린 강의만 자신의 화면에서 제거할 수 있도록 권한 체크 포함." },
  { date: "2026-05-16 ③", who: "하준호", result: "backend/.env, uploads/, data/ 디렉터리를 .gitignore에 추가해 비밀값과 사용자 업로드 파일이 저장소에 올라가지 않도록 보호." },
  { date: "2026-05-16 ④", who: "하준호", result: "강의 카드에 썸네일·조회수·카테고리 필드를 추가해 검색·정렬·노출의 기반을 마련. 백엔드 스키마와 UI를 동시 수정." },
  { date: "2026-05-16 ⑤", who: "이지완", result: "본인 작업 브랜치(jiwan)에서 PR #1을 올리고 main으로 머지. 백엔드 변경 사항을 팀 트렁크에 반영." },
  { date: "2026-05-16 ⑥", who: "하준호", result: "Trail(트레일) 페이지에 육각형 노드 선택 UI를 도입하고, 회원가입 모달의 입력 필드를 하나의 일관된 컴포넌트로 통합." },
  { date: "2026-05-16 ⑦", who: "하준호", result: "0단계: 코딩 학습 인프라 구축. 서버에 catalog/learn API를 추가하고 lesson 페이지 골격을 만듦 — 향후 문법 학습 모듈의 기반." },
  { date: "2026-05-16 ⑧", who: "하준호", result: "Trail 0 콘텐츠 작성: 출력/변수/자료형/연산자/입출력 8개 레슨 + e2e 학습 흐름. 16개 예제 문제 포함." },
  { date: "2026-05-16 ⑨", who: "하준호", result: "Trail 1 콘텐츠 작성: Ch1(출력) 8개 + Ch2(입출력) 6개 = 총 14 레슨 / 28 문제. 각 문제는 개념 태그와 모범 풀이를 함께 보관." },
  { date: "2026-05-16 ⑩", who: "하준호", result: "Trail 1을 2단계 통합으로 머지: trail.js의 Ch2 노드를 6개로 확장하고 dist 리빌드까지 마쳐 배포 가능한 상태로 만듦." },
  { date: "2026-05-16 ⑪", who: "하준호", result: "Codex 자동 코드리뷰의 P1·P2 지적 사항(보안/일관성)을 후속 커밋으로 수정. 외부 리뷰를 코드에 반영하는 사이클을 마무리." },
];

// ─── 결과물 화면 (스크린샷) ───────────────────────────────────────────
const SHOTS_META = [
  { file: "01_landing.png",      caption: "랜딩 페이지 (Codenergy 소개 + 슬로건)" },
  { file: "02_test_intro.png",   caption: "코딩테스트 안내 화면 (테스트 진입점)" },
  { file: "03_test_concepts.png",caption: "자가진단 개념 선택 화면" },
  { file: "04_test_problem.png", caption: "C 문제 풀이 페이지 (Judge0 연동)" },
  { file: "05_test_result.png",  caption: "테스트 결과 + 약점 개념 분석" },
  { file: "06_codetrails.png",   caption: "코드트레일 — 단계별 학습 트랙 안내" },
  { file: "07_trail.png",        caption: "Trail 육각형 노드 선택 UI" },
  { file: "08_lessons.png",      caption: "레슨 페이지 (이론 + 예제 코드)" },
  { file: "09_lectures.png",     caption: "강의 페이지 (썸네일 / 카테고리 / 조회수)" },
  { file: "10_avatar.png",       caption: "아바타 커스터마이즈 화면 (보상 시스템)" },
  { file: "11_pricing.png",      caption: "요금제 / 플랜 안내" },
];

// ─── 메모: 다음에 할 일 + 구상 ────────────────────────────────────────
const MEMO = {
  next: [
    { title: "맞춤형 학습 추천 엔진", body: "테스트 결과로 추출된 약점 개념에 가중치를 매겨, 다음 풀어야 할 문제 큐를 자동으로 구성. 현재는 sessionStorage 큐(buildProblemQueue)에 정적으로 담겨있는 구조를 동적 추천으로 확장." },
    { title: "오류코드 해설 모듈",       body: "사용자가 제출한 C 코드의 컴파일·런타임 오류 메시지를 한국어로 풀어 설명하는 기능. Judge0의 stderr를 분류해 패턴별 친절한 해설을 제공." },
    { title: "메모리·포인터 시각화",     body: "포인터가 가리키는 메모리를 그림으로 보여주는 학습 보조 위젯. 스택/힙 구분, 배열 인덱싱, 문자열 종료문자 등을 단계별 애니메이션으로 표현." },
    { title: "아바타·포인트 경제",       body: "학습량(레슨 완료, 문제 정답) 만큼 포인트 적립 → 상점에서 outfits.js 의 아이템 구매. character.js와 백엔드 /api/avatar/* 를 연결해 영속화." },
    { title: "사용자 대결 모드",         body: "두 사용자가 같은 문제를 동시에 풀고 시간/정답률로 승부. 실시간 통신을 위해 WebSocket 도입을 검토 (현재 스택과의 비용 대비 효과를 먼저 측정)." },
    { title: "Trail 2 이상 콘텐츠 확장", body: "조건문·반복문·함수·배열·포인터·구조체로 트레일을 추가. test-problems.js를 단일 진리원천(single source of truth)으로 유지하면서 문법 학습 모듈과 공유." },
  ],
  ideas: [
    "/claude_move 슬래시 커맨드로 prompt.md 의 작업 단위를 일관된 형식으로 다시 입력 — 회의록 → 작업 지시 자동화의 실험.",
    "한국어 학습자에게 친숙한 변수명(예: 합계, 개수)을 허용하는 'C 한글 모드'를 옵션으로 제공해 입문자의 진입 장벽을 낮추는 아이디어.",
    "테스트 결과 페이지의 약점 그래프를 6각형 레이더 차트로 표현하면 Trail 육각형 UI 와 시각 언어를 통일할 수 있음.",
    "Judge0 무료 티어(일 50회) 한계를 고려해, 클라이언트 mock-mode 와 실제 채점을 자동 전환하는 어댑터 패턴을 더 명시적으로 분리.",
  ]
};

// ─── 헬퍼 ───────────────────────────────────────────────────────────────
const txt = (text, opts={}) => new TextRun({ text, font: "맑은 고딕", ...opts });
const p = (text, opts={}) => new Paragraph({ children: [txt(text, opts)], spacing: { after: 80 } });
const h = (text, level) => new Paragraph({ heading: level, children: [txt(text, { bold: true, font: "맑은 고딕" })], spacing: { before: 200, after: 100 } });
const bullet = (text) => new Paragraph({ children: [txt(text)], bullet: { level: 0 }, spacing: { after: 40 } });

const cell = (text, opts={}) => new TableCell({
  width: opts.width,
  shading: opts.shading,
  children: [new Paragraph({ children: [txt(text, { bold: !!opts.bold, color: opts.color, size: opts.size ?? 20 })], alignment: opts.align ?? AlignmentType.LEFT })],
  margins: { top: 80, bottom: 80, left: 100, right: 100 }
});

const headerShade = { type: ShadingType.CLEAR, color: "auto", fill: "1F3A5F" };

// 표지
const cover = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 200 },
    children: [txt("정보영재원 연구일지", { bold: true, size: 48 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
    children: [txt(TEAM.title, { bold: true, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [txt(TEAM.subtitle, { italics: true, size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800, after: 80 },
    children: [txt(`연구 기간: ${TEAM.period}`, { size: 24 })] }),
];

// 팀 정보 표
const memberTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ tableHeader: true, children: [
      cell("구분", { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
      cell("이름", { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
      cell("역할", { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
      cell("연락처 / GitHub", { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
    ]}),
    ...TEAM.members.map((m, i) => new TableRow({ children: [
      cell(i === 0 ? "팀장" : "팀원", { align: AlignmentType.CENTER }),
      cell(m.name, { bold: i === 0 }),
      cell(m.role),
      cell([m.email, m.github && `@${m.github}`].filter(Boolean).join(" / ")),
    ]}))
  ]
});

// 영재성 기준 매핑 표
const gTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ tableHeader: true, children: [
      cell("영재성 영역", { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
      cell("정의", { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
      cell("본 프로젝트에서의 발현 근거", { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
    ]}),
    ...GIFTEDNESS.map(g => new TableRow({ children: [
      cell(g.key, { bold: true, align: AlignmentType.CENTER }),
      cell(g.desc),
      new TableCell({
        children: g.evidence.map(e => new Paragraph({ children: [txt("• " + e, { size: 20 })], spacing: { after: 40 } })),
        margins: { top: 80, bottom: 80, left: 100, right: 100 }
      }),
    ]}))
  ]
});

// 날짜별 활동 표
const dailyTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ tableHeader: true, children: [
      cell("날짜",   { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
      cell("담당",   { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
      cell("결과물 설명", { bold: true, color: "FFFFFF", shading: headerShade, align: AlignmentType.CENTER }),
    ]}),
    ...DAILY.map(d => new TableRow({ children: [
      cell(d.date, { align: AlignmentType.CENTER }),
      cell(d.who,  { align: AlignmentType.CENTER, bold: true, color: d.who === "하준호" ? "1F3A5F" : "9C2A2A" }),
      cell(d.result),
    ]}))
  ]
});

// 스크린샷 섹션 - 이미지 + 캡션
function shotsSection() {
  const out = [];
  for (const s of SHOTS_META) {
    const path = resolve(SHOTS, s.file);
    if (existsSync(path)) {
      const buf = readFileSync(path);
      out.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 80 },
        children: [new ImageRun({ data: buf, transformation: { width: 520, height: 340 } })]
      }));
      out.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [txt(`[그림] ${s.caption}`, { italics: true, size: 20, color: "555555" })]
      }));
    } else {
      // 캡처 실패 → 위치 표시 + 사용자에게 요청
      out.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 80 },
        children: [txt(`[스크린샷 삽입 위치 — ${s.file}]`, { bold: true, color: "B22222", size: 22 })]
      }));
      out.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [txt(`▶ 캡처 실패: 이 위치에 '${s.caption}' 화면 캡처본을 직접 첨부해 주세요.`, { color: "B22222", size: 20 })]
      }));
      out.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [txt(`(파일 경로 가이드: research-journal/screenshots/${s.file})`, { italics: true, size: 18, color: "777777" })]
      }));
    }
  }
  return out;
}

// 메모 섹션
const memoChildren = [
  h("9. 메모 — 다음에 할 일 (Next Steps)", HeadingLevel.HEADING_2),
  p("연구일지 작성 시점 기준, 이어서 진행할 작업과 그 이유를 정리한다. 우선순위는 학습 효과 → 동기부여 → 확장성 순."),
  ...MEMO.next.flatMap((n, i) => [
    new Paragraph({ spacing: { before: 120, after: 40 }, children: [txt(`${i+1}) ${n.title}`, { bold: true, size: 22 })] }),
    new Paragraph({ spacing: { after: 80 }, children: [txt("   " + n.body, { size: 20 })] }),
  ]),
  h("10. 메모 — 구상 (Ideas / 가설)", HeadingLevel.HEADING_2),
  p("아직 검증 전이지만 이번 연구 과정에서 떠오른 가설과 아이디어를 기록해 둔다."),
  ...MEMO.ideas.map(s => bullet(s))
];

// 자기평가
const reflection = [
  h("11. 자기평가 및 영재성 종합", HeadingLevel.HEADING_2),
  p("이번 연구는 '코딩테스트 → 약점 진단 → 맞춤 학습 → 게임화'라는 4-단 루프를 작은 규모로 끝까지 구현해 본 시도다. 11개 페이지, 22개 이상의 레슨, 44문제 분량의 콘텐츠, 인증·강의·아바타·테스트의 4개 도메인을 한 사람(팀장)이 설계·구현하고 다른 팀원이 백엔드 모델과 머지를 보강하는 형태로, 영재성 5개 영역 모두에서 구체적 산출물이 남았다."),
  p("특히 '학문적 능력 × 창의성'의 결합이 강하게 드러난 부분은 Trail UI 와 학습 데이터 모델이다. 단순히 문제를 푸는 사이트가 아니라 '약점 개념을 노드로 시각화하는 학습 지도'라는 새로운 형태를 작동하는 코드로 만들어 냈다."),
  p("앞으로의 핵심은 추천 엔진(약점 → 다음 문제)과 시각화 모듈(메모리/포인터)의 결합이다. 이 두 가지가 들어가야 본 플랫폼이 '문제집 사이트'가 아닌 '진단형 학습 도구'로 자리 잡을 수 있다."),
];

// 본문 어셈블
const body = [
  ...cover,
  new Paragraph({ children: [new PageBreak()] }),

  h("1. 연구 개요", HeadingLevel.HEADING_1),
  p(`프로젝트: ${TEAM.title}`),
  p(`주제 요약: ${TEAM.subtitle}`),
  p(`연구 기간: ${TEAM.period}`),
  p(`저장소: ${TEAM.repo}`),

  h("2. 팀 구성", HeadingLevel.HEADING_2),
  memberTable,

  h("3. 연구 동기 및 목표", HeadingLevel.HEADING_1),
  p("기존의 코딩 학습 사이트는 강의 시청이나 문제 풀이를 '입력'으로 사용하지만, 정작 '내가 무엇을 모르는지'는 학습자 스스로 추측해야 한다. 본 연구의 핵심 가설은 '코딩테스트 결과 자체가 약점 진단의 가장 좋은 신호'라는 점이다."),
  p("따라서 본 프로젝트는 (1) 짧은 코딩테스트로 학습자의 약점 개념을 추출하고, (2) 추출된 개념에 맞춰 학습 콘텐츠를 추천하며, (3) 학습 진척을 Trail 형태로 시각화하고, (4) 아바타·포인트로 동기를 유지하는 통합 플랫폼을 목표로 한다."),

  h("4. 영재성 발현 영역 매핑", HeadingLevel.HEADING_1),
  p("정보영재원 영재성 5개 영역(학문적 능력 / 창의성 / 과제집착력 / 자기주도성 / 협업·의사소통)을 기준으로, 본 연구의 어떤 활동이 해당 영역의 발현 근거가 되는지 정리한다."),
  gTable,

  h("5. 연구 수행 방법", HeadingLevel.HEADING_1),
  bullet("기술 스택: Vite 멀티페이지 + 바닐라 JS (프론트엔드), Express 4 + node:sqlite (백엔드), Judge0/RapidAPI (C 코드 채점), Playwright (E2E 테스트)."),
  bullet("작업 흐름: GitHub Flow (main + feature 브랜치 + Pull Request). 팀원의 변경은 PR로 받고 main에서 머지."),
  bullet("품질 보증: Codex 자동 코드리뷰의 P1/P2 지적을 후속 커밋으로 반영. Playwright 기반의 E2E 테스트를 위한 환경 분리(테스트 시 Judge0 키 비움)."),
  bullet("개발 도구: Claude Code(/claude_move 슬래시 커맨드 활용)로 prompt.md → 작업 지시 자동화 실험."),

  h("6. 날짜별 연구 활동 (결과물 중심)", HeadingLevel.HEADING_1),
  p("아래 표는 날짜별로 그 날의 대표 결과물 한 가지와 담당자(누가 했는지)를 정리한 것이다. 결과물은 '동작하는 산출물' 중심으로 기록했다."),
  dailyTable,

  h("7. 결과물 화면 (스크린샷)", HeadingLevel.HEADING_1),
  p("자동 캡처 도구(Playwright)로 production 빌드(dist) 의 주요 화면을 캡처했다. 자동 캡처가 실패한 항목에는 [스크린샷 삽입 위치] 표시를 남겨두었으므로, 해당 위치에 직접 캡처한 이미지를 붙여 넣으면 된다."),
  ...shotsSection(),

  h("8. 핵심 결과물 요약", HeadingLevel.HEADING_2),
  bullet("학습 콘텐츠: Trail 0 (8 레슨 / 16 문제) + Trail 1 (14 레슨 / 28 문제) = 총 22 레슨 / 44 문제."),
  bullet("프론트엔드 페이지: 랜딩 / 테스트 4종 / 결과 / 코드트레일 / 트레일 / 레슨 / 강의 / 아바타 / 요금제 등 11종."),
  bullet("백엔드 API: 인증(/api/signup, /login, /logout, /me, /find-username, /forgot-password), 테스트(/api/test/*), 아바타(/api/avatar/*), 강의(lectures), 학습(/api/learn, catalog)."),
  bullet("데이터 모델: users, sessions, test_progress, avatars, lectures, surveys, email_auth_codes 등 7+ 테이블."),
  bullet("게임화 요소: Trail 육각형 노드 UI / 아바타 outfits / data-tilt 3D 인터랙션."),

  ...memoChildren,
  ...reflection,
];

const doc = new Document({
  creator: "하준호 (Codenergy Team)",
  title: "정보영재원 연구일지 — Codenergy",
  description: "코딩테스트 기반 맞춤형 학습 플랫폼 연구일지",
  styles: {
    default: {
      document: { run: { font: "맑은 고딕" } },
      heading1: { run: { font: "맑은 고딕", size: 32, bold: true, color: "1F3A5F" }, paragraph: { spacing: { before: 240, after: 120 } } },
      heading2: { run: { font: "맑은 고딕", size: 26, bold: true, color: "2E4D72" }, paragraph: { spacing: { before: 200, after: 100 } } },
    }
  },
  sections: [{
    properties: { page: { margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } } },
    children: body,
  }]
});

const buf = await Packer.toBuffer(doc);
writeFileSync(OUT, buf);
console.log("WROTE", OUT, "size=" + buf.length);
