import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const FRONTEND = resolve(process.cwd(), "..", "frontend");
const PORT = 4319;

const srv = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  cwd: FRONTEND, stdio: ["ignore", "pipe", "pipe"], shell: true
});
srv.stderr.on("data", () => {});

const waitServer = async () => {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) return; } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error("vite preview did not start");
};

try {
  await waitServer();
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
  page.on("console", m => { if (m.type() === "error") errs.push("CONSOLE: " + m.text()); });

  const results = [];
  for (const path of ["/test-intro.html", "/avatar.html", "/lectures.html"]) {
    errs.length = 0;
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const before = await page.evaluate(() => document.getElementById("auth-modal")?.hidden);
    await page.click("#login-btn").catch(e => errs.push("CLICK_ERR: " + e.message));
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => document.getElementById("auth-modal")?.hidden);
    results.push({ path, before, after, errs: [...errs] });
  }
  await browser.close();
  const fs = await import("node:fs");
  fs.writeFileSync("debug-modal.json", JSON.stringify(results, null, 2));
} finally {
  srv.kill();
}
