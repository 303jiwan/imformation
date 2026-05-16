const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
} = require("docx");

// ===== 페이지 사이즈 (A4 LANDSCAPE) =====
const PAGE_W = 11906;
const PAGE_H = 16838;
const MARGIN_TOP = 1080;
const MARGIN_BOTTOM = 1080;
const MARGIN_LEFT = 1440;
const MARGIN_RIGHT = 1440;
const CONTENT_W = PAGE_H - MARGIN_LEFT - MARGIN_RIGHT; // 13958

const border = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
const borders = { top: border, bottom: border, left: border, right: border };

// ===== 데이터 =====
const phases = [
  {
    title: "Phase 1 — 첫날: 프런트엔드 초안",
    subtitle: "정적 HTML + 페이지 골격을 일괄 투입",
    range: "2026-04-26 ~ 2026-05-06",
    narrative:
      "리포지터리 초기화와 함께 프런트엔드의 골격을 일괄 투입한 단계. " +
      "2026-04-26 첫 커밋과 backend/ 디렉터리 분리로 \"프런트엔드 + Express 백엔드\" 구조를 확정했고, " +
      "2026-05-06 에는 18개 페이지 HTML 과 공유 모듈을 단일 커밋으로 일괄 투입했다.",
    days: [
      {
        date: "2026-04-26",
        oneliner: "프로젝트 초기화 + 백엔드 디렉터리 분리",
        commits: [
          { author: "이지완", message: "Initial commit" },
          { author: "이지완", message: "Add backend directory — 프런트/백엔드 분리 구조 결정" },
        ],
        highlights: [
          "Git 저장소 초기 생성 및 기본 구조 확립",
          "backend/ 디렉터리 신설 — 프런트엔드와 API 서버를 분리하는 모노레포 구조 결정",
        ],
        note: "이 한 줄의 결정이 이후 백엔드 라우터 분리·DB 격리·CORS 정책 모두의 출발점이 됨.",
        next: [
          "Vite 멀티페이지 골격을 잡고 18개 페이지 HTML(랜딩/요금제/설문/결과/테스트 6단계 등) 초안을 일괄 투입한다.",
          "공유 모듈(main.js, style.css, judge.js)을 만들어 페이지별 공통 동작을 한 곳에 모은다.",
          "Express 서버 진입점·CORS 화이트리스트·세션 쿠키 구조 등 백엔드 골격을 함께 잡는다.",
        ],
      },
      {
        date: "2026-05-06",
        oneliner: "프런트엔드 위주 초기 코드 일괄 투입",
        commits: [
          { author: "하준호", message: "Vite 멀티페이지 골격 + 18개 페이지 HTML 일괄 투입 (랜딩/요금제/설문/결과/테스트 6단계 등)" },
        ],
        highlights: [
          "Vite 멀티페이지 골격 (각 .html 이 별도 엔트리)",
          "랜딩/요금제/설문/결과 페이지 + 테스트 플로우 6단계 페이지 초안",
          "공유 모듈(main.js, style.css, judge.js) 초기 형태 — Judge0 클라이언트 mock-mode 포함",
          "테스트 문제 풀(test-problems.js) 자료 구조 도입",
        ],
        note: "한 커밋 안에 큰 덤프가 들어와 추적성이 약한 시점. 다음 단계에서 페이지 단위로 분리 시작.",
        next: [
          "다음 날부터 페이지 단위로 동작·스타일을 분리해서 채워 넣는다.",
          "Judge0 mock-mode 동작을 확인하고, 실 API 키가 없는 환경에서도 흐름이 끊기지 않도록 폴백을 검증한다.",
          "sessionStorage 키 네이밍(codenergy:test:*) 컨벤션을 정리해 페이지 간 상태가 충돌하지 않게 한다.",
          "큰 덤프 커밋을 페이지/모듈 단위로 분할 커밋하는 컨벤션을 도입한다.",
        ],
      },
    ],
  },
  {
    title: "Phase 2 — 둘째날: Vite 기반 프런트엔드 보강",
    subtitle: "페이지 단위 동작·스타일 다듬기 + 빌드 산출물(dist) 갱신",
    range: "2026-05-07 ~ 2026-05-10",
    narrative:
      "Vite 멀티페이지를 본격적으로 보강한 단계. 각 .html 엔트리의 동작과 스타일을 페이지 단위로 채우고, " +
      "자원(이미지/CSS) 을 정리하며, 다중 페이지 동시 작업을 진행했다. " +
      "후반에는 원격 머지에서 image.png 충돌을 해결하면서 dist/ 산출물도 함께 정리한다.",
    days: [
      {
        date: "2026-05-07",
        oneliner: "프런트엔드 페이지 보강",
        commits: [
          { author: "하준호", message: "여러 페이지의 동작/스타일 보강" },
          { author: "하준호", message: "폴더 정리 (파일 이동·리네이밍)" },
        ],
        highlights: [
          "여러 페이지의 동작과 스타일 보강",
          "폴더 정리를 위한 파일 이동·리네이밍",
        ],
        note: "",
        next: [
          "페이지 단위 보강을 이어 가되, 한 커밋 = 한 페이지 단위로 자르는 방향을 유지한다.",
          "폴더 구조가 안정화되면 신규 페이지(아바타·트레일 등)를 추가할 자리만 미리 비워 둔다.",
        ],
      },
      {
        date: "2026-05-08",
        oneliner: "페이지/스타일 다듬기",
        commits: [
          { author: "이지완", message: "페이지 단위 동작/스타일 다듬기" },
        ],
        highlights: [
          "페이지 단위로 동작·스타일 보강",
        ],
        note: "",
        next: [
          "다음 날 다중 페이지 동시 작업으로 확장한다 — 공통 자원(이미지/스타일) 일관성 점검을 함께.",
          "백엔드 라우터·세션 도입을 준비한다(현재는 프런트만 동작).",
        ],
      },
      {
        date: "2026-05-09",
        oneliner: "집중 개발 — 다중 페이지 동시 진행",
        commits: [
          { author: "하준호", message: "프런트엔드 다수 페이지 기능 보강" },
          { author: "하준호", message: "파일 정리·이동" },
          { author: "하준호", message: "단일 모듈 기능 보강" },
          { author: "하준호", message: "프런트엔드 다중 페이지 보강" },
          { author: "하준호", message: "공통 자원(이미지/스타일) 정리·추가" },
          { author: "하준호", message: "단일 모듈 보강" },
          { author: "하준호", message: "전체 자원 갱신 (이미지·스타일·페이지)" },
        ],
        highlights: [
          "다중 페이지 동시 보강",
          "공통 자원(이미지/스타일) 정리·추가",
          "dist 빌드 산출물 갱신",
        ],
        note: "추후 분리 커밋 컨벤션 도입 필요한 시점.",
        next: [
          "다음 작업일에 원격 브랜치와 머지하면서 image.png 등 자원 충돌을 정리한다.",
          "type(scope): subject 형태의 커밋 메시지 컨벤션을 합의·도입한다.",
          "공통 자원(이미지/스타일)이 흩어지지 않게 디렉터리 규칙을 문서화한다.",
        ],
      },
      {
        date: "2026-05-10",
        oneliner: "원격 머지 + image.png 충돌 해결",
        commits: [
          { author: "하준호", message: "Merge origin/main: image.png 삭제 충돌 해결" },
          { author: "하준호", message: "머지 후속 자원 정리" },
        ],
        highlights: [
          "이미지 자원 머지 충돌 해소",
          "병합 후속 자원 일관성 회복",
        ],
        note: "다른 협업자 작업과 결합되는 시점.",
        next: [
          "이제 백엔드 데이터·통합 작업으로 무게중심을 옮긴다 — db.js·라우터 통합 준비.",
          "협업 브랜치 간 충돌이 잦은 파일(db.js, style.css, image.png)을 식별해 작업 순서를 조율한다.",
          "프런트엔드 dist/ 산출물은 빌드 직후 한 번에 커밋해 머지 비용을 줄인다.",
        ],
      },
    ],
  },
  {
    title: "Phase 3 — 그 후: 백엔드 중심",
    subtitle: "Express + node:sqlite 라우터 통합, 학습 인프라·Trail 콘텐츠 구축",
    range: "2026-05-14 ~ 2026-05-16",
    narrative:
      "프런트엔드 골격이 안정된 뒤 백엔드 중심으로 무게가 옮겨가는 단계. " +
      "2026-05-15 에는 백엔드 라우터·DB·페이지 통합이 함께 진행되고, " +
      "2026-05-16 에는 0단계 학습 인프라(서버 catalog + learn API + lesson 페이지 골격), " +
      "Trail 0/1 콘텐츠, 강의 페이지(썸네일/조회수/카테고리/삭제 UI), 회원가입 모달 + Trail 육각형 UI, " +
      "db.js 머지 충돌 해결, codex 리뷰 P1+P2 반영까지 한 사이클이 정돈된다.",
    days: [
      {
        date: "2026-05-14",
        oneliner: "백엔드/프런트엔드 접점 다듬기",
        commits: [
          { author: "하준호", message: "백엔드/프런트 접점 모듈 다듬기" },
          { author: "하준호", message: "추가 다듬기" },
        ],
        highlights: ["백엔드/프런트엔드 접점 다듬기"],
        note: "",
        next: [
          "다음 작업일에 단일 PR 단위의 대규모 백엔드·프런트 통합을 진행한다.",
          "인증(/api/signup, /api/login, /api/me)과 세션 쿠키 흐름을 먼저 동작시킨 뒤 페이지에 연결한다.",
        ],
      },
      {
        date: "2026-05-15",
        oneliner: "대형 통합 — 백엔드 기능군 도입",
        commits: [
          { author: "이지완", message: "백엔드·프런트엔드 대형 통합 (인증/세션/페이지 라우팅)" },
          { author: "이지완", message: "통합 후속 정리" },
          { author: "이지완", message: "마이크로 픽스" },
          { author: "이지완", message: "통합 후속 정리" },
        ],
        highlights: [
          "단일 PR 단위의 대규모 백엔드/프런트엔드 통합",
          "본격적인 백엔드 기능군 도입",
        ],
        note: "",
        next: [
          "다음 작업일은 \"학습 인프라\" 일로 잡는다 — 서버 catalog + /api/learn API + lesson 페이지 골격.",
          "Trail 0 / Trail 1 콘텐츠 작성과 강의(lectures) 시스템·trail 육각형 UI·회원가입 모달 통합을 같은 사이클 안에 끝낸다.",
          "큰 통합 PR 이후엔 마이크로 픽스(주석/명명/누락 export)들이 따라붙으므로, 끝나면 한 번에 모아 squash 가능 여부 검토.",
        ],
      },
      {
        date: "2026-05-16",
        oneliner: "트레일/학습 인프라/강의 시스템 완성 + codex 리뷰 반영",
        commits: [
          { author: "이지완", message: "준비 작업" },
          { author: "하준호", message: "백엔드 라우터·페이지 통합 작업" },
          { author: "하준호", message: "Merge branch 'main'" },
          { author: "하준호", message: "백엔드 라우터·페이지 통합 작업 (계속)" },
          { author: "하준호", message: "단일 모듈 대량 추가" },
          { author: "이지완", message: "보강 작업" },
          { author: "하준호", message: "콘텐츠 추가" },
          { author: "하준호", message: "마이크로 픽스" },
          { author: "하준호", message: "단일 모듈 대량 추가" },
          { author: "이지완", message: "보강 작업" },
          { author: "하준호", message: "대규모 백엔드 통합" },
          { author: "이지완", message: "Merge PR #1 — 협업 브랜치 통합" },
          { author: "이지완", message: "통합 작업" },
          { author: "이지완", message: "정리/삭제" },
          { author: "하준호", message: "강의 페이지 추가 + 후기 영역 제거 + 11개 페이지 nav 에 강의 링크 일괄 등록" },
          { author: "하준호", message: "강의 페이지에 본인 업로드 삭제 버튼 추가" },
          { author: "하준호", message: "backend uploads/, data/, .env 를 .gitignore 에 추가" },
          { author: "하준호", message: "강의 썸네일·조회수·카테고리 기능 추가" },
          { author: "하준호", message: "강의 빌드 산출물(dist) 갱신" },
          { author: "하준호", message: "후속 정리" },
          { author: "하준호", message: "Merge origin/main — db.js 충돌 해결 (lectures + surveys + email_auth_codes)" },
          { author: "하준호", message: "trail 육각형 선택 UI + 회원가입 모달 입력창 통합" },
          { author: "하준호", message: "정리" },
          { author: "하준호", message: "0단계 코딩 학습 인프라 — 서버 catalog + /api/learn API + lesson 페이지 골격" },
          { author: "하준호", message: "Trail 0 콘텐츠 — 8개 레슨(출력/변수/자료형/연산자/입출력) + e2e 흐름" },
          { author: "하준호", message: "Trail 1 콘텐츠 — Ch1 출력 8 + Ch2 입출력 6 (14 레슨 / 28 문제)" },
          { author: "하준호", message: "Trail 0 콘텐츠 머지 (8 레슨, 16 문제)" },
          { author: "하준호", message: "Trail 1 콘텐츠 머지 (14 레슨, 28 문제)" },
          { author: "하준호", message: "trail.js Trail 1 Ch2 노드 6개로 확장 + dist 리빌드" },
          { author: "하준호", message: "codex 리뷰 P1+P2 지적 사항 반영" },
          { author: "이지완", message: "추가 보강" },
          { author: "이지완", message: "마이크로 픽스" },
        ],
        highlights: [
          "0단계 학습 인프라: 서버 catalog + learn API + lesson 페이지 골격",
          "Trail 0 콘텐츠: 8개 레슨(출력/변수/자료형/연산자/입출력) + e2e 흐름",
          "Trail 1 콘텐츠: Ch1 출력 8 + Ch2 입출력 6 = 14 레슨 / 28 문제",
          "trail.js Trail 1 Ch2 노드 6개 확장 + dist 리빌드",
          "강의 페이지(썸네일·조회수·카테고리·본인 업로드 삭제 UI) + 11개 페이지 nav 강의 링크",
          "회원가입 모달 입력창 통합 + Trail 육각형 선택 UI",
          "db.js 머지 충돌 해결 (lectures + surveys + email_auth_codes)",
          "backend uploads/, data/, .env 를 .gitignore 등록 (보안/저장공간 정리)",
          "codex review P1+P2 후속 수정 적용",
        ],
        note:
          "\"코딩테스트 → 학습\" 루프의 학습 측 콘텐츠(Trail) 와 입출력 페이지(강의/회원가입) 가 한 번에 정돈된 날.",
        next: [
          "Trail 2~6 콘텐츠를 확장한다 — 함수/재귀/정렬/시뮬레이션/자료구조/알고리즘(코드트레일 카드의 7색 테마 그대로 매핑).",
          "문법 학습(C 문법) 모듈을 별도로 만들어 test-problems.js 의 문제를 \"교재 예제\" 로 재활용하는 구조를 명세화한다.",
          "Judge0 50회/일 한계를 고려한 배치/캐싱 정책 문서화 — 동일 (코드 해시, 문제 ID) 결과 캐싱 + 호출량 모니터링.",
          "lesson_attempts 테이블이 무한 누적되지 않도록 retention 정책(최근 N건/사용자) 추가 검토.",
          "uploads/, data/ 운영 백업 정책 수립 (.gitignore 에 등록된 만큼 별도 관리 필요).",
          "Playwright e2e 스펙을 늘려 \"트레일 진행률 4상태\" 와 \"레슨 잠금 422/423\" 시나리오를 회귀로 잡는다.",
          "관리자 페이지(admin.html / analytics.html) 의 권한 분리 — 현재는 라우팅만 존재.",
          "한·영 i18n 누락 키 정리 + 영어 카피의 톤 점검.",
        ],
      },
    ],
  },
];

const totalPhases = phases.length;
const totalDays = phases.reduce((s, p) => s + p.days.length, 0);
const totalCommits = phases.reduce((s, p) => s + p.days.reduce((s2, d) => s2 + d.commits.length, 0), 0);

// ===== 헬퍼 =====
function p(text, opts = {}) {
  const { para = {}, ...runOpts } = opts;
  return new Paragraph({ children: [new TextRun({ text, ...runOpts })], ...para });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun(text)],
  });
}
function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] }); }

function cell({ widthDxa, text, header = false, mono = false, shade, size = 20, align = AlignmentType.LEFT }) {
  return new TableCell({
    borders,
    width: { size: widthDxa, type: WidthType.DXA },
    shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 70, bottom: 70, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold: header, size, font: mono ? "Consolas" : undefined })],
    })],
  });
}

function phaseSummaryTable(phase) {
  const cols = [1800, 1400, 10758];
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      cell({ widthDxa: cols[0], text: "일자", header: true, shade: "E8EEF7", align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[1], text: "커밋 수", header: true, shade: "E8EEF7", align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[2], text: "그날 추가된 기능", header: true, shade: "E8EEF7" }),
    ],
  });
  const rows = phase.days.map((d) => new TableRow({
    children: [
      cell({ widthDxa: cols[0], text: d.date, mono: true, align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[1], text: String(d.commits.length), align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[2], text: d.highlights.join(" / ") }),
    ],
  }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cols, rows: [headerRow, ...rows] });
}

function commitTable(commits) {
  const cols = [2000, 11958];
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      cell({ widthDxa: cols[0], text: "작성자", header: true, shade: "EEF2F7", align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[1], text: "추가된 기능 / 작업", header: true, shade: "EEF2F7" }),
    ],
  });
  const rows = commits.map((c) => new TableRow({
    children: [
      cell({ widthDxa: cols[0], text: c.author, align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[1], text: c.message }),
    ],
  }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cols, rows: [headerRow, ...rows] });
}

// ===== 본문 =====
const children = [];

// 표지
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 1400, after: 200 },
    children: [new TextRun({ text: "정보영재원 연구일지", bold: true, size: 32, color: "555555" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({ text: "Codenergy 프로젝트", bold: true, size: 36 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({ text: "C언어를 게임처럼 — 아바타·트레일 기반 코딩 학습 웹", bold: true, size: 52 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 400 },
    children: [new TextRun({ text: "코딩테스트, 지식에서 스킬로", italics: true, size: 26, color: "555555" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 200, after: 80 },
    children: [new TextRun({ text: "연구자", bold: true, size: 24, color: "555555" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 400 },
    children: [new TextRun({ text: "이지완  ·  하준호", bold: true, size: 36 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "대상 기간: 2026-04-26 ~ 2026-05-16", size: 24 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `총 ${totalPhases} 단계 / ${totalDays} 일 / ${totalCommits} 커밋 분석`, size: 24 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 200 },
    children: [new TextRun({ text: "작성일: 2026-05-16  ·  레이아웃: A4 가로", size: 22, color: "555555" })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// 1. 연구 개요
children.push(
  h1("1. 연구 개요"),
  h2("연구 주제"),
  p("C언어를 처음 배우는 학습자가 \"지루한 문법 암기\" 가 아니라 \"게임을 클리어하듯\" 단계를 올리며 배울 수 있도록, " +
    "아바타·트레일·진행률 게이지를 가진 풀스택 코딩 학습 웹 Codenergy 를 직접 설계·구현한다. " +
    "코딩테스트는 최종 산출물이 아니라 학습 진입 신호로 사용한다(설문 결과 → 난이도 게이팅 → 취약 개념 식별 → 맞춤 학습)."),
  p(""),
  h2("연구 동기"),
  bullet("C언어 입문자가 흔히 \"문법은 알지만 손이 안 움직인다\" 라는 벽에 부딪히는 점에서 출발."),
  bullet("게임의 단계 상승·꾸미기 요소(레벨·아바타·획득 보상) 가 동기 유발에 효과적이라는 점을 학습 도메인에 옮긴다."),
  bullet("기존 강의·문제풀이 도구는 \"콘텐츠\" 중심이라 학습자의 현재 상태를 모른다. 우리는 \"코딩테스트\"를 진단 도구로 결합한다."),
  p(""),
  h2("연구자"),
  bullet("이지완 — 프런트엔드 페이지·UI 컴포넌트, 회원가입 모달, 강의 페이지 기능"),
  bullet("하준호 — Vite 멀티페이지 구조, 트레일/아바타/학습 인프라(백엔드 catalog + learn API), Trail 0/1 콘텐츠"),
  p("두 사람이 GitHub 저장소를 공동 운영하며 PR/머지·코드 리뷰로 협업했다."),
  p(""),
  h2("기술 스택"),
  bullet("프런트엔드: Vite 멀티페이지 (바닐라 JS, 프레임워크/라우터 없음) — 각 .html 이 자체 엔트리, 18개 페이지"),
  bullet("백엔드: Express 4 + node:sqlite (Node ≥ 22.5) + bcryptjs + nodemailer"),
  bullet("코드 채점: Judge0 (RapidAPI) — 무료 티어 ~50 회/일, mock 모드 폴백 지원"),
  bullet("E2E 테스트: Playwright (5174 포트, mock judge0 환경)"),
  bullet("DB: SQLite (WAL 모드, 외래키 ON) — users / sessions / test_progress / test_answers / lectures / surveys / email_auth_codes / lesson_progress / lesson_attempts"),
  p(""),
  h2("문서 구성"),
  bullet("1장 연구 개요 / 2장 영재성 평가 기준 매핑 / 3장 코딩 산출물 / 4장 단계(일자)별 연구일지 / 5장 종합 회고"),
  new Paragraph({ children: [new PageBreak()] }),
);

// 2. 영재성 매핑
children.push(
  h1("2. 영재성 평가 기준 매핑"),
  p("정보영재교육 분야에서 일반적으로 사용되는 영재성 평가 5축에 본 연구의 산출과 과정을 매핑했다."),
  p(""),
);

{
  const cols = [1900, 5200, 6858];
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      cell({ widthDxa: cols[0], text: "영재성 축", header: true, shade: "D5E1F2", align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[1], text: "이 프로젝트에서의 근거", header: true, shade: "D5E1F2" }),
      cell({ widthDxa: cols[2], text: "확인 가능한 산출물 (코드/페이지/커밋)", header: true, shade: "D5E1F2" }),
    ],
  });
  const rows = [
    {
      axis: "창의성",
      basis:
        "①\"코딩테스트 = 학습 진입 신호\" 라는 발상으로 진단과 학습을 한 루프로 묶었다. " +
        "②\"단계 상승 + 꾸미기\" 라는 게임 요소를 학습에 결합 — 7색 트레일·육각형 노드·아바타 커스터마이즈로 동기를 유발한다.",
      product:
        "trail.html / trail.js(7색·육각형 노드 UI) · avatar.html / avatar/character.js / outfits.js(6 스킨톤 + hat/glasses/earrings + 5 배경) · codetrails.html(4상태 진행률 게이지) · 슬로건 \"코딩테스트, 지식에서 스킬로\"",
    },
    {
      axis: "문제해결력",
      basis:
        "①Judge0 무료 50/일 한계 → mock 폴백 + ungraded 분리로 \"연습은 가능하되 진도는 실제 채점에만\" 으로 해결. " +
        "②진행률 게이지를 unauthenticated / loading / error / ok 4상태로 분리해 \"비로그인 0%\"와 \"로그인했는데 0%\" 의 의미 충돌을 제거. " +
        "③원격 머지 시 db.js 충돌(lectures + surveys + email_auth_codes 동시 변경)을 수기 해결.",
      product:
        "judge.js (mock-mode 폴백) · codetrails.js (4상태 게이지) · db.js merge resolve 커밋 · codex review P1+P2 후속 수정 커밋",
    },
    {
      axis: "산출물의 우수성",
      basis:
        "①21일 만에 풀스택 웹 한 사이클(인증·테스트·학습·강의·아바타) 완성. " +
        "②백엔드는 prepared statement / bcrypt / httpOnly 쿠키 / CORS 화이트리스트 등 보안 기본을 갖춤. " +
        "③프런트엔드는 18 HTML / 19 JS 모듈로 분리되어 페이지별로 독립 동작.",
      product:
        "auth.js 6 엔드포인트 · test.js 4 엔드포인트 · learn.js 3 엔드포인트 · 18 HTML 페이지 · Trail 0 8 레슨 + Trail 1 14 레슨 = 22 레슨 / 44 문제",
    },
    {
      axis: "자기주도성",
      basis:
        "①프레임워크 없는 바닐라 JS + 자체 멀티페이지 구조를 직접 설계 — 외부 보일러플레이트에 의존하지 않음. " +
        "②codex 리뷰의 P1·P2 지적사항을 스스로 식별·반영. " +
        "③한국어 UI 를 \"기본\" 으로 두고 한·영 i18n 토글까지 자체 구축.",
      product:
        "vite.config.js (직접 작성한 18 엔트리 매핑) · main.js (tilt 효과·i18n) · codex P1+P2 반영 커밋",
    },
    {
      axis: "협업·소통",
      basis:
        "①이지완·하준호가 같은 저장소를 공동 운영하며 PR/머지로 작업을 합쳤다. " +
        "②다른 브랜치의 작업을 머지하면서 db.js·image.png 등 자원 충돌을 협력해 해결. " +
        "③커밋·디렉터리 단위로 작업을 나눠 동시 진행.",
      product:
        "PR #1 (jiwan → main) · 다수의 Merge 커밋 · 공동 작업자 git log 기준 52 커밋 협업",
    },
  ];
  const tableRows = [headerRow, ...rows.map((r) => new TableRow({
    children: [
      cell({ widthDxa: cols[0], text: r.axis, header: true, shade: "EEF2F7", align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[1], text: r.basis }),
      cell({ widthDxa: cols[2], text: r.product, size: 18 }),
    ],
  }))];
  children.push(new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cols, rows: tableRows }));
}
children.push(new Paragraph({ children: [new PageBreak()] }));

// 3. 코딩 산출물
children.push(
  h1("3. 코딩 산출물 (직접 구현한 것)"),
  p("실제로 작성·동작하는 웹의 구성 요소를 영역별로 정리한다. 항목 수치는 2026-05-16 기준."),
  p(""),
  h2("3.1 게임화 학습 핵심: 트레일 & 아바타"),
);
{
  const cols = [2400, 4400, 7158];
  const header = new TableRow({
    tableHeader: true,
    children: [
      cell({ widthDxa: cols[0], text: "영역", header: true, shade: "EEF2F7", align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[1], text: "페이지 / 모듈", header: true, shade: "EEF2F7" }),
      cell({ widthDxa: cols[2], text: "핵심 기능", header: true, shade: "EEF2F7" }),
    ],
  });
  const rows = [
    ["트레일 UI", "trail.html · trail.js · codetrails.html · codetrails.js",
     "7개 트레일(0~6) · 7색 테마(green/yellow/orange/red/blue/purple/dark) · 육각형 노드 선택 UI · 좌측 챕터 트리 + 우측 갭체크 + Lesson 표 + CTA · 4상태 진행률 게이지(unauth/loading/error/ok)"],
    ["트레일 콘텐츠", "lesson-data.js (표시) + backend/src/lesson-catalog.js (검증)",
     "Trail 0: Ch1 기본 4 + Ch2 입출력 4 = 8 레슨 / 16 문제 · Trail 1: Ch1 출력 8 + Ch2 입출력 6 = 14 레슨 / 28 문제 · 총 22 레슨 / 44 문제"],
    ["아바타 시스템", "avatar.html · avatar.js · avatar/character.js · avatar/outfits.js · avatar/avatar.css",
     "320×480 SVG 캐릭터 · 6 스킨톤(가장 밝은~가장 어두운) · 12계층 z-order(배경→그림자→다리→몸통→하의→팔→상의→머리→귀걸이→머리카락→얼굴→안경→모자) · 5 배경(default/sky/sunset/mint/lavender)"],
    ["진행률 게이지", "codetrails.js",
     "AR 리뷰 피드백 기반 4상태 분리: ①unauthenticated → \"로그인하면 진도 기록\" 배지 ②loading → 스켈레톤 펄스 ③error → 마지막 캐시값 + 재시도 ④ok → 트레일 색상 + 실제 % · localStorage 캐시 키 codenergy:learn:progress:v1"],
  ];
  children.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cols,
    rows: [header, ...rows.map((r) => new TableRow({
      children: r.map((t, i) => cell({ widthDxa: cols[i], text: t, header: i === 0, align: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT })),
    }))],
  }));
}

children.push(p(""));
children.push(h2("3.2 코딩테스트 플로우 (진단 도구)"));
{
  const cols = [2400, 4400, 7158];
  const header = new TableRow({
    tableHeader: true,
    children: [
      cell({ widthDxa: cols[0], text: "단계", header: true, shade: "EEF2F7", align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[1], text: "페이지", header: true, shade: "EEF2F7" }),
      cell({ widthDxa: cols[2], text: "역할", header: true, shade: "EEF2F7" }),
    ],
  });
  const rows = [
    ["1", "test-login.html / test-login.js", "이메일로 결과 받기 옵션, 로그인/비로그인 모두 진입 가능"],
    ["2", "test-intro.html / test-intro.js", "테스트 안내, sessionStorage codenergy:test:* 초기화"],
    ["3", "test-concepts.html / test-concepts.js", "사전 개념 체크"],
    ["4", "test-gauge.html / test-gauge.js", "현재 실력 게이지 + 설문 level 저장(none/basic/intermediate/advanced)"],
    ["5", "test-problem.html / test-problem.js", "C 코드 에디터 + Judge0 채점. 난이도 게이팅: easy(전원) / medium(intermediate+) / killer(advanced)"],
    ["6", "test-result.html / test-result.js", "결과 시각화 + 취약 개념 추출"],
  ];
  children.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cols,
    rows: [header, ...rows.map((r) => new TableRow({
      children: r.map((t, i) => cell({
        widthDxa: cols[i], text: t, header: i === 0, mono: i === 0,
        align: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
      })),
    }))],
  }));
}

children.push(p(""));
children.push(p("문제 풀: test-problems.js — 5문제 / 문제당 10분(TIME_PER_PROBLEM_MS = 10×60×1000). easy 는 단일 정수 입력 + JS 참조 함수 expected(A), medium 은 다중 입력, killer 는 시뮬레이션 문제(testCases 하드코딩).", { size: 20 }));

children.push(p(""));
children.push(h2("3.3 백엔드 API"));
{
  const cols = [1900, 2400, 4500, 5158];
  const header = new TableRow({
    tableHeader: true,
    children: [
      cell({ widthDxa: cols[0], text: "메서드", header: true, shade: "EEF2F7", align: AlignmentType.CENTER }),
      cell({ widthDxa: cols[1], text: "경로", header: true, shade: "EEF2F7" }),
      cell({ widthDxa: cols[2], text: "용도", header: true, shade: "EEF2F7" }),
      cell({ widthDxa: cols[3], text: "비고", header: true, shade: "EEF2F7" }),
    ],
  });
  const rows = [
    ["POST", "/api/signup",          "회원가입 + 자동 로그인",        "bcrypt 10 rounds, 409 중복"],
    ["POST", "/api/login",           "로그인",                        "401 on bad creds"],
    ["POST", "/api/logout",          "로그아웃",                      "세션 + 쿠키 삭제"],
    ["GET",  "/api/me",              "현재 사용자",                   "401 if unauth"],
    ["POST", "/api/find-username",   "아이디 찾기 (이메일 전송)",     "always 200 (no enumeration)"],
    ["POST", "/api/forgot-password", "임시 비밀번호 발급 + 이메일",   "always 200"],
    ["POST", "/api/test/progress",   "테스트 진행률 upsert",          "auth required"],
    ["POST", "/api/test/answer",     "답안 제출 저장",                "verdict 같이 저장"],
    ["GET",  "/api/test/state",      "내 진행 상태 조회",             "{progress, answers[]}"],
    ["POST", "/api/test/email-sample","로그인 화면의 이메일 캡처",    "public"],
    ["GET",  "/api/learn/progress",  "트레일별 진도",                 "401 if unauth"],
    ["GET",  "/api/learn/lesson/:id","레슨 잠금/다음 레슨",           "서버 catalog 진실의 원천"],
    ["POST", "/api/learn/submit",    "레슨 채점 (트랜잭션)",          "422 멤버십 / 423 잠금 / mock=ungraded"],
  ];
  children.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cols,
    rows: [header, ...rows.map((r) => new TableRow({
      children: r.map((t, i) => cell({
        widthDxa: cols[i], text: t, header: i === 0, mono: i <= 1,
        align: i <= 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
      })),
    }))],
  }));
}

children.push(p(""));
children.push(h2("3.4 강의 시스템 + 부가 페이지"));
children.push(bullet("lectures.html — 강의 페이지(썸네일·조회수·카테고리), 본인 업로드 삭제 버튼, 11개 페이지 nav 에 강의 링크 일괄 등록"));
children.push(bullet("admin.html / analytics.html — 운영/분석 페이지"));
children.push(bullet("components-demo.html — 공통 컴포넌트 데모"));
children.push(bullet("i18n: 한국어(기본) ↔ English 토글(lang-menu) — 모든 페이지의 data-i18n 키로 일관 처리"));
children.push(bullet("UX: tilt 효과(data-tilt 속성만 붙이면 mousemove 로 rotateX/rotateY ±14° 자동 적용)"));

children.push(new Paragraph({ children: [new PageBreak()] }));

// 4. 단계별
children.push(h1("4. 단계(일자)별 연구일지"));

for (const phase of phases) {
  children.push(h1(phase.title));
  children.push(p(phase.subtitle, { italics: true, color: "555555" }));
  children.push(p(`기간: ${phase.range}`, { color: "555555" }));
  children.push(p(""));
  children.push(h2("단계 서사"));
  children.push(p(phase.narrative));
  children.push(p(""));
  children.push(h2("단계 요약"));
  children.push(phaseSummaryTable(phase));
  children.push(p(""));

  for (const d of phase.days) {
    children.push(h2(`${d.date} — ${d.oneliner}`));
    children.push(h3("커밋"));
    children.push(commitTable(d.commits));
    children.push(p(""));
    children.push(h3("하이라이트"));
    for (const hl of d.highlights) children.push(bullet(hl));
    if (d.note) {
      children.push(h3("메모"));
      children.push(p(d.note, { italics: true, color: "555555" }));
    }
    if (Array.isArray(d.next) && d.next.length) {
      children.push(h3("다음에 할 일 — 구상"));
      for (const n of d.next) children.push(bullet(n));
    }
    children.push(p(""));
  }

  children.push(new Paragraph({ children: [new PageBreak()] }));
}

// 5. 회고
children.push(
  h1("5. 종합 회고"),
  h2("관찰"),
  bullet("작업이 큰 덩어리로 들어오는 패턴 — 2026-05-06, 05-09, 05-15, 05-16 단일 일자에 변경의 대부분이 집중."),
  bullet("Phase 가 진행될수록 작업의 무게가 \"정적 페이지 → Vite 통합 → 백엔드 라우터·DB\" 로 이동."),
  bullet("Trail 0/1 콘텐츠 총 22 레슨 / 44 문제가 한 사이클 안에 정돈되어 첫 학습 루프 검증이 가능한 상태가 됨."),
  p(""),
  h2("앞으로의 과제"),
  bullet("Trail 2~6 콘텐츠 확장 (함수/재귀/정렬/시뮬레이션/자료구조/알고리즘)"),
  bullet("큰 커밋의 분할(테마/모듈 단위) — PR 리뷰 효율 개선"),
  bullet("문법 학습 모듈과의 문제 풀 공유 구조 명세화"),
  bullet("Judge0 무료 티어 한계(50 회/일) 를 고려한 배치/캐싱 정책 문서화"),
  bullet("backend uploads/, data/ 의 운영 백업 정책 수립 (.gitignore 에 등록된 만큼 별도 관리 필요)"),
);

const doc = new Document({
  creator: "Codenergy 연구일지 생성기",
  title: "Codenergy 프로젝트 단계(일자)별 연구일지 (가로)",
  styles: {
    default: { document: { run: { font: "맑은 고딕", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "맑은 고딕", color: "1F3864" },
        paragraph: { spacing: { before: 320, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "맑은 고딕", color: "2E5597" },
        paragraph: { spacing: { before: 220, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "맑은 고딕", color: "404040" },
        paragraph: { spacing: { before: 140, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H, orientation: PageOrientation.LANDSCAPE },
        margin: { top: MARGIN_TOP, right: MARGIN_RIGHT, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Codenergy 연구일지 (가로)", size: 18, color: "808080" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "— ", size: 18, color: "808080" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" }),
            new TextRun({ text: " —", size: 18, color: "808080" }),
          ],
        })],
      }),
    },
    children,
  }],
});

const outPath = path.join(__dirname, "Codenergy_연구일지_landscape_2026-05-16_v4.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log("OK:", outPath);
});