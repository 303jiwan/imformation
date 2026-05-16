import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const FRONTEND = resolve(process.cwd(), "..", "frontend");
const OUT = resolve(process.cwd(), "screenshots");
mkdirSync(OUT, { recursive: true });

const PORT = 4318;
const targets = [
  { name: "01_landing",      path: "/",                  caption: "랜딩 페이지 (Codenergy 소개)" },
  { name: "02_test_intro",   path: "/test-intro.html",   caption: "코딩테스트 소개 페이지" },
  { name: "03_test_concepts",path: "/test-concepts.html",caption: "개념 선택 화면 (자가진단)" },
  { name: "04_test_problem", path: "/test-problem.html", caption: "C 문제 풀이 페이지 (Judge0 연동)" },
  { name: "05_test_result",  path: "/test-result.html",  caption: "테스트 결과 & 약점 개념 분석" },
  { name: "06_codetrails",   path: "/codetrails.html",   caption: "코드트레일 - 단계별 학습 트랙" },
  { name: "07_trail",        path: "/trail.html",        caption: "Trail 육각형 노드 선택 UI" },
  { name: "08_lessons",      path: "/lessons.html",      caption: "레슨 페이지 (이론 + 예제)" },
  { name: "09_lectures",     path: "/lectures.html",     caption: "강의 페이지 (썸네일/카테고리/조회수)" },
  { name: "10_avatar",       path: "/avatar.html",       caption: "아바타 커스터마이즈 화면" },
  { name: "11_pricing",      path: "/pricing.html",      caption: "요금제/플랜 안내" },
];

const srv = spawn(
  "npx",
  ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { cwd: FRONTEND, stdio: ["ignore", "pipe", "pipe"], shell: true }
);
srv.stdout.on("data", d => process.stdout.write("[vite] " + d));
srv.stderr.on("data", d => process.stderr.write("[vite!] " + d));

const waitServer = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/`);
      if (r.ok) return;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error("vite preview did not start in 30s");
};

try {
  await waitServer();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const ok = [];
  for (const t of targets) {
    try {
      await page.goto(`http://localhost:${PORT}${t.path}`, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(800);
      const file = `${OUT}/${t.name}.png`;
      await page.screenshot({ path: file, fullPage: false });
      ok.push({ ...t, file });
      console.log("captured", t.name);
    } catch (e) {
      console.error("FAIL", t.name, e.message);
    }
  }
  await browser.close();
  console.log("\nCAPTURED_COUNT=" + ok.length);
} finally {
  srv.kill();
}
