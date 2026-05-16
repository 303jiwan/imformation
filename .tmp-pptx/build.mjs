import PptxGenJS from "pptxgenjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inch (16:9)
pptx.title = "Codenergy";
pptx.author = "하준호, 이지완";

// ── 색상 팔레트 ────────────────────────────────────────
const COLOR = {
  bg:        "0B1020",
  bgLight:   "F4F6FB",
  accent:    "4F8CFF",
  accent2:   "8C5BFF",
  text:      "FFFFFF",
  textDark:  "111827",
  textMute:  "9AA3B2",
  line:      "2A3146",
};

const TOTAL = 9;

// 공용: 상단 액센트 바
function addAccentBar(slide) {
  slide.addShape("rect", { x: 0, y: 0, w: 13.33, h: 0.18, fill: { color: COLOR.accent } });
  slide.addShape("rect", { x: 0, y: 0.18, w: 13.33, h: 0.04, fill: { color: COLOR.accent2 } });
}

// 공용: 페이지 번호만 (팀원 표기 없음)
function addPageNum(slide, n, total) {
  slide.addText(`${n} / ${total}`, {
    x: 12.0, y: 7.05, w: 1.0, h: 0.3,
    fontSize: 10, color: COLOR.textMute, fontFace: "맑은 고딕",
    align: "right",
  });
}

// 좌측 텍스트 + 우측 이미지 레이아웃 (스크린샷 슬라이드용)
function addImageSlide(slide, { number, title, bullets, image, pageNum, totalPages }) {
  slide.background = { color: COLOR.bgLight };
  addAccentBar(slide);

  slide.addText(number, {
    x: 0.6, y: 0.6, w: 5.5, h: 0.5,
    fontSize: 13, color: COLOR.accent, bold: true,
    fontFace: "맑은 고딕", charSpacing: 4,
  });
  slide.addText(title, {
    x: 0.6, y: 1.05, w: 5.5, h: 1.6,
    fontSize: 34, color: COLOR.textDark, bold: true,
    fontFace: "맑은 고딕",
  });
  slide.addShape("line", {
    x: 0.6, y: 2.7, w: 1.0, h: 0,
    line: { color: COLOR.accent, width: 3 },
  });

  if (bullets && bullets.length) {
    const bulletTexts = bullets.map((b) => ({
      text: b,
      options: { bullet: { code: "25A0" }, color: COLOR.textDark, fontSize: 15 },
    }));
    slide.addText(bulletTexts, {
      x: 0.6, y: 3.0, w: 5.5, h: 3.5,
      fontFace: "맑은 고딕",
      paraSpaceAfter: 10,
    });
  }

  slide.addShape("roundRect", {
    x: 6.4, y: 0.7, w: 6.5, h: 6.1,
    fill: { color: "FFFFFF" },
    line: { color: COLOR.line, width: 1 },
    rectRadius: 0.12,
  });
  slide.addImage({
    path: image.path,
    x: image.x ?? 6.6,
    y: image.y ?? 0.9,
    w: image.w ?? 6.1,
    h: image.h ?? 5.7,
    sizing: { type: "contain", w: image.w ?? 6.1, h: image.h ?? 5.7 },
  });

  addPageNum(slide, pageNum, totalPages);
}

// ── Slide 1: 타이틀 (유일하게 팀원 표기) ────────────────
{
  const s = pptx.addSlide();
  s.background = { color: COLOR.bg };

  s.addShape("ellipse", {
    x: -2, y: -2, w: 6, h: 6,
    fill: { color: COLOR.accent, transparency: 80 },
    line: { color: COLOR.accent, transparency: 100 },
  });
  s.addShape("ellipse", {
    x: 9.5, y: 3.5, w: 7, h: 7,
    fill: { color: COLOR.accent2, transparency: 85 },
    line: { color: COLOR.accent2, transparency: 100 },
  });

  s.addText("CODING TEST → PERSONALIZED LEARNING", {
    x: 0.8, y: 1.6, w: 11, h: 0.4,
    fontSize: 14, color: COLOR.accent, bold: true,
    fontFace: "Consolas", charSpacing: 6,
  });
  s.addText("Codenergy", {
    x: 0.8, y: 2.1, w: 11, h: 2.0,
    fontSize: 96, bold: true, color: COLOR.text,
    fontFace: "맑은 고딕",
  });
  s.addText("코딩테스트, 지식에서 스킬로", {
    x: 0.8, y: 4.2, w: 11, h: 0.7,
    fontSize: 28, color: COLOR.text,
    fontFace: "맑은 고딕",
  });
  s.addShape("line", {
    x: 0.85, y: 5.2, w: 4, h: 0,
    line: { color: COLOR.accent, width: 2 },
  });
  s.addText("팀원", {
    x: 0.8, y: 5.4, w: 4, h: 0.4,
    fontSize: 14, color: COLOR.textMute,
    fontFace: "맑은 고딕", bold: true, charSpacing: 4,
  });
  s.addText("하준호  ·  이지완", {
    x: 0.8, y: 5.8, w: 8, h: 0.6,
    fontSize: 26, color: COLOR.text,
    fontFace: "맑은 고딕", bold: true,
  });
  s.addText("2026. 05. 16.", {
    x: 0.8, y: 6.6, w: 6, h: 0.4,
    fontSize: 12, color: COLOR.textMute, fontFace: "맑은 고딕",
  });
}

// ── Slide 2: 프로젝트 소개 ────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: COLOR.bgLight };
  addAccentBar(s);

  s.addText("01.  프로젝트 소개", {
    x: 0.6, y: 0.5, w: 12, h: 0.6,
    fontSize: 14, color: COLOR.accent, bold: true,
    fontFace: "맑은 고딕", charSpacing: 4,
  });
  s.addText("Codenergy 는 어떤 서비스인가요?", {
    x: 0.6, y: 0.95, w: 12, h: 0.9,
    fontSize: 34, color: COLOR.textDark, bold: true,
    fontFace: "맑은 고딕",
  });
  s.addShape("line", {
    x: 0.6, y: 1.95, w: 1.2, h: 0,
    line: { color: COLOR.accent, width: 3 },
  });

  s.addText(
    [
      { text: "코딩테스트를 입력 신호로 사용하는 ", options: { fontSize: 22 } },
      { text: "맞춤형 코딩 학습 플랫폼", options: { fontSize: 22, bold: true, color: COLOR.accent } },
      { text: " 입니다.", options: { fontSize: 22 } },
    ],
    {
      x: 0.6, y: 2.3, w: 12, h: 0.7,
      color: COLOR.textDark, fontFace: "맑은 고딕",
    }
  );

  const stepY = 3.6;
  const stepW = 3.8;
  const gap = 0.35;
  const startX = 0.6;
  const steps = [
    { n: "01", title: "코딩테스트 응시", desc: "사용자가 C 문제 풀이를 통해\n현재 실력을 진단" },
    { n: "02", title: "약점 개념 분석", desc: "정·오답 데이터를 기반으로\n부족한 개념을 추출" },
    { n: "03", title: "맞춤 학습 제공", desc: "약점 개념에 맞춘\n레슨·예제를 자동 큐레이션" },
  ];
  steps.forEach((step, i) => {
    const x = startX + i * (stepW + gap);
    s.addShape("roundRect", {
      x, y: stepY, w: stepW, h: 2.6,
      fill: { color: "FFFFFF" },
      line: { color: COLOR.line, width: 1 },
      rectRadius: 0.15,
    });
    s.addText(step.n, {
      x: x + 0.3, y: stepY + 0.2, w: 1.5, h: 0.5,
      fontSize: 28, bold: true, color: COLOR.accent,
      fontFace: "Consolas",
    });
    s.addText(step.title, {
      x: x + 0.3, y: stepY + 0.85, w: stepW - 0.6, h: 0.5,
      fontSize: 18, bold: true, color: COLOR.textDark,
      fontFace: "맑은 고딕",
    });
    s.addText(step.desc, {
      x: x + 0.3, y: stepY + 1.45, w: stepW - 0.6, h: 1.0,
      fontSize: 13, color: "555B6E", fontFace: "맑은 고딕",
    });

    if (i < steps.length - 1) {
      s.addText("▶", {
        x: x + stepW + 0.02, y: stepY + 1.1, w: gap, h: 0.4,
        fontSize: 16, color: COLOR.accent, align: "center",
      });
    }
  });

  addPageNum(s, 2, TOTAL);
}

// ── Slide 3: 핵심 컨셉 ────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: COLOR.bg };
  addAccentBar(s);

  s.addText("02.  CORE CONCEPT", {
    x: 0.6, y: 0.5, w: 12, h: 0.6,
    fontSize: 14, color: COLOR.accent, bold: true,
    fontFace: "Consolas", charSpacing: 4,
  });
  s.addText("지식에서 ─→ 스킬로", {
    x: 0.6, y: 1.1, w: 12, h: 1.0,
    fontSize: 44, color: COLOR.text, bold: true,
    fontFace: "맑은 고딕",
  });
  s.addText("기존 학습은 '아는 것'을 늘리는 데 그쳤습니다.\nCodenergy는 시험을 통해 '쓸 수 있는' 스킬로 전환합니다.", {
    x: 0.6, y: 2.3, w: 12, h: 1.0,
    fontSize: 18, color: COLOR.textMute, fontFace: "맑은 고딕",
  });

  const cardY = 4.0;
  const cardH = 2.6;

  // Before
  s.addShape("roundRect", {
    x: 0.6, y: cardY, w: 5.9, h: cardH,
    fill: { color: "1A2138" },
    line: { color: COLOR.line, width: 1 },
    rectRadius: 0.15,
  });
  s.addText("BEFORE", {
    x: 0.9, y: cardY + 0.25, w: 3, h: 0.4,
    fontSize: 12, bold: true, color: COLOR.textMute,
    fontFace: "Consolas", charSpacing: 4,
  });
  s.addText("강의 → 암기 → 망각", {
    x: 0.9, y: cardY + 0.7, w: 5.3, h: 0.6,
    fontSize: 22, bold: true, color: COLOR.text,
    fontFace: "맑은 고딕",
  });
  s.addText([
    { text: "•  진단 없는 일괄 커리큘럼\n", options: {} },
    { text: "•  본인의 약점을 모르고 학습\n", options: {} },
    { text: "•  실제 코드 작성으로 이어지지 않음", options: {} },
  ], {
    x: 0.9, y: cardY + 1.4, w: 5.3, h: 1.2,
    fontSize: 14, color: COLOR.textMute, fontFace: "맑은 고딕",
    paraSpaceAfter: 4,
  });

  // After
  s.addShape("roundRect", {
    x: 6.83, y: cardY, w: 5.9, h: cardH,
    fill: { color: COLOR.accent },
    line: { color: COLOR.accent, width: 1 },
    rectRadius: 0.15,
  });
  s.addText("AFTER  ·  CODENERGY", {
    x: 7.13, y: cardY + 0.25, w: 5.3, h: 0.4,
    fontSize: 12, bold: true, color: "DCE7FF",
    fontFace: "Consolas", charSpacing: 4,
  });
  s.addText("응시 → 진단 → 맞춤 학습", {
    x: 7.13, y: cardY + 0.7, w: 5.3, h: 0.6,
    fontSize: 22, bold: true, color: COLOR.text,
    fontFace: "맑은 고딕",
  });
  s.addText([
    { text: "•  코딩테스트로 실력을 객관적으로 진단\n", options: {} },
    { text: "•  약점 개념을 자동 추출\n", options: {} },
    { text: "•  부족한 영역만 골라 학습 → 시간 절약", options: {} },
  ], {
    x: 7.13, y: cardY + 1.4, w: 5.3, h: 1.2,
    fontSize: 14, color: "EAF0FF", fontFace: "맑은 고딕",
    paraSpaceAfter: 4,
  });

  addPageNum(s, 3, TOTAL);
}

// ── Slide 4: 주요 기능 ───────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: COLOR.bgLight };
  addAccentBar(s);

  s.addText("03.  주요 기능", {
    x: 0.6, y: 0.5, w: 12, h: 0.6,
    fontSize: 14, color: COLOR.accent, bold: true,
    fontFace: "맑은 고딕", charSpacing: 4,
  });
  s.addText("우리 웹이 제공하는 것", {
    x: 0.6, y: 0.95, w: 12, h: 0.9,
    fontSize: 34, color: COLOR.textDark, bold: true,
    fontFace: "맑은 고딕",
  });
  s.addShape("line", {
    x: 0.6, y: 1.95, w: 1.2, h: 0,
    line: { color: COLOR.accent, width: 3 },
  });

  const features = [
    {
      icon: "▣",
      title: "코딩테스트 플로우",
      desc: "로그인 → 개념 진단 → 게이지 측정 → 문제 풀이 →\n결과 리포트까지 한 번에 이어지는 통합 응시 경험",
    },
    {
      icon: "◈",
      title: "실시간 C 코드 채점",
      desc: "Judge0 (RapidAPI) 기반 컴파일/실행으로\n작성한 코드의 정·오답을 즉시 판별",
    },
    {
      icon: "✦",
      title: "맞춤형 학습 큐레이션",
      desc: "테스트 결과의 약점 개념을 분석해\n부족한 부분에 맞는 레슨과 예제를 추천",
    },
    {
      icon: "◉",
      title: "아바타 / 사용자 시스템",
      desc: "회원가입·세션 쿠키 로그인 기반의\n나만의 캐릭터 커스터마이징과 학습 진척도 저장",
    },
  ];

  const cols = 2;
  const cellW = 6.05;
  const cellH = 2.3;
  const x0 = 0.6;
  const y0 = 2.35;
  const gap = 0.25;

  features.forEach((f, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = x0 + c * (cellW + gap);
    const y = y0 + r * (cellH + gap);

    s.addShape("roundRect", {
      x, y, w: cellW, h: cellH,
      fill: { color: "FFFFFF" },
      line: { color: COLOR.line, width: 1 },
      rectRadius: 0.12,
    });
    s.addShape("roundRect", {
      x, y, w: 0.12, h: cellH,
      fill: { color: COLOR.accent },
      line: { color: COLOR.accent, width: 0 },
      rectRadius: 0.06,
    });
    s.addText(f.icon, {
      x: x + 0.35, y: y + 0.3, w: 0.7, h: 0.7,
      fontSize: 28, color: COLOR.accent2, bold: true,
    });
    s.addText(f.title, {
      x: x + 1.1, y: y + 0.35, w: cellW - 1.3, h: 0.6,
      fontSize: 20, bold: true, color: COLOR.textDark,
      fontFace: "맑은 고딕",
    });
    s.addText(f.desc, {
      x: x + 1.1, y: y + 1.0, w: cellW - 1.3, h: 1.2,
      fontSize: 13, color: "555B6E", fontFace: "맑은 고딕",
    });
  });

  addPageNum(s, 4, TOTAL);
}

// ── Slide 5: 기술 스택 ───────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: COLOR.bgLight };
  addAccentBar(s);

  s.addText("04.  기술 스택", {
    x: 0.6, y: 0.5, w: 12, h: 0.6,
    fontSize: 14, color: COLOR.accent, bold: true,
    fontFace: "맑은 고딕", charSpacing: 4,
  });
  s.addText("어떻게 만들었나요?", {
    x: 0.6, y: 0.95, w: 12, h: 0.9,
    fontSize: 34, color: COLOR.textDark, bold: true,
    fontFace: "맑은 고딕",
  });
  s.addShape("line", {
    x: 0.6, y: 1.95, w: 1.2, h: 0,
    line: { color: COLOR.accent, width: 3 },
  });

  const stacks = [
    {
      title: "Frontend",
      color: COLOR.accent,
      items: ["Vite Multi-Page App", "Vanilla JS (No Framework)", "Playwright E2E"],
    },
    {
      title: "Backend",
      color: COLOR.accent2,
      items: ["Express 4", "node:sqlite (Node ≥ 22.5)", "bcryptjs · nodemailer"],
    },
    {
      title: "Execution",
      color: "F26B6B",
      items: ["Judge0 via RapidAPI", "C 컴파일 / 실행", "결과 자동 판정"],
    },
  ];

  const cardW = 4.0;
  const cardH = 3.6;
  const startX = 0.6;
  const startY = 2.45;
  const gap = 0.25;

  stacks.forEach((st, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape("roundRect", {
      x, y: startY, w: cardW, h: cardH,
      fill: { color: "FFFFFF" },
      line: { color: COLOR.line, width: 1 },
      rectRadius: 0.15,
    });
    s.addShape("rect", {
      x, y: startY, w: cardW, h: 0.7,
      fill: { color: st.color },
      line: { color: st.color, width: 0 },
    });
    s.addText(st.title, {
      x: x + 0.3, y: startY + 0.15, w: cardW - 0.6, h: 0.5,
      fontSize: 20, bold: true, color: COLOR.text,
      fontFace: "맑은 고딕",
    });
    st.items.forEach((it, k) => {
      s.addText(`•  ${it}`, {
        x: x + 0.4, y: startY + 1.0 + k * 0.55, w: cardW - 0.8, h: 0.5,
        fontSize: 15, color: COLOR.textDark, fontFace: "맑은 고딕",
      });
    });
  });

  s.addText("Dev: `npm run dev`  →  frontend :5173  +  backend :3000", {
    x: 0.6, y: 6.3, w: 12, h: 0.4,
    fontSize: 13, color: COLOR.textMute, fontFace: "Consolas",
  });

  addPageNum(s, 5, TOTAL);
}

// ── Slide 6: 학습 트레일 (스크린샷) ───────────────────
{
  const s = pptx.addSlide();
  addImageSlide(s, {
    number: "05.  학습 트레일",
    title: "헥사 노드 트리로\n레슨을 따라가요",
    bullets: [
      "한 노드 = 한 레슨",
      "왼쪽 트리에서 진행 위치 확인",
      "오른쪽에서 바로 문제 시작",
    ],
    image: {
      path: path.join(REPO, "image copy 13.png"),
      x: 6.6, y: 0.85, w: 6.1, h: 5.8,
    },
    pageNum: 6, totalPages: TOTAL,
  });
}

// ── Slide 7: 레슨 콘텐츠 (스크린샷) ────────────────────
{
  const s = pptx.addSlide();
  addImageSlide(s, {
    number: "06.  레슨 콘텐츠",
    title: "이론 + 예제 코드를\n한 페이지에",
    bullets: [
      "목차로 흐름 파악",
      "C 코드 예제와 출력 비교",
      "표·예시로 개념 정리",
    ],
    image: {
      path: path.join(REPO, "image copy 10.png"),
      x: 6.6, y: 0.85, w: 6.1, h: 5.8,
    },
    pageNum: 7, totalPages: TOTAL,
  });
}

// ── Slide 8: 코딩테스트 (스크린샷) ─────────────────────
{
  const s = pptx.addSlide();
  addImageSlide(s, {
    number: "07.  코딩테스트",
    title: "문제 + 에디터를\n한 화면에서",
    bullets: [
      "왼쪽에 문제, 오른쪽에 코드 에디터",
      "C / C++ 코드를 바로 작성",
      "Judge0 로 즉시 채점",
    ],
    image: {
      path: path.join(REPO, "image copy 8.png"),
      x: 6.55, y: 1.8, w: 6.2, h: 3.9,
    },
    pageNum: 8, totalPages: TOTAL,
  });
}

// ── Slide 9: Thank You ────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: COLOR.bg };

  s.addShape("ellipse", {
    x: 8, y: -2, w: 8, h: 8,
    fill: { color: COLOR.accent2, transparency: 80 },
    line: { color: COLOR.accent2, transparency: 100 },
  });
  s.addShape("ellipse", {
    x: -3, y: 4, w: 7, h: 7,
    fill: { color: COLOR.accent, transparency: 85 },
    line: { color: COLOR.accent, transparency: 100 },
  });

  s.addText("Thank You", {
    x: 0.6, y: 2.6, w: 12, h: 1.5,
    fontSize: 96, bold: true, color: COLOR.text,
    fontFace: "맑은 고딕",
  });
  s.addText("Codenergy", {
    x: 0.6, y: 4.3, w: 12, h: 0.7,
    fontSize: 28, color: COLOR.text, fontFace: "맑은 고딕",
  });

  s.addShape("line", {
    x: 0.65, y: 5.3, w: 4, h: 0,
    line: { color: COLOR.accent, width: 2 },
  });
  s.addText("Q & A", {
    x: 0.6, y: 5.4, w: 12, h: 0.6,
    fontSize: 18, color: COLOR.accent, bold: true,
    fontFace: "Consolas", charSpacing: 6,
  });
}

// ── 저장 (잠겨있으면 타임스탬프 suffix 로 폴백) ───────
const candidates = [
  "Codenergy_발표.pptx",
  "Codenergy_발표_v2.pptx",
  `Codenergy_발표_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.pptx`,
];
let outPath = null;
let lastErr = null;
for (const name of candidates) {
  outPath = path.resolve(REPO, name);
  try {
    await pptx.writeFile({ fileName: outPath });
    lastErr = null;
    break;
  } catch (err) {
    lastErr = err;
    if (err?.code !== "EBUSY") throw err;
  }
}
if (lastErr) throw lastErr;
console.log("✓ saved:", outPath);
