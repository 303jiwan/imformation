import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const FRONTEND = resolve(process.cwd(), "..", "frontend");
const PORT = 4320;
const srv = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  cwd: FRONTEND, stdio: ["ignore", "pipe", "pipe"], shell: true
});
srv.stderr.on("data", () => {});
const waitServer = async () => {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) return; } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
};
try {
  await waitServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  for (const [path, name, btn] of [
    ["/test-intro.html", "test-intro-login", "#login-btn"],
    ["/lectures.html",   "lectures-signup",  "#signup-btn"],
    ["/pricing.html",    "pricing-login",    "#login-btn"],
  ]) {
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.click(btn);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `screenshots/modal_${name}.png` });
    console.log("captured", name);
  }
  await browser.close();
} finally {
  srv.kill();
}
