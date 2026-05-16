import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Codenergy frontend.
 *
 * - Runs only Chromium for fast CI feedback.
 * - Boots `npm run dev` automatically on port 5174.
 * - 채점 백엔드(localhost:3000)가 없을 때 /api/grade/* 는 503/네트워크 오류를
 *   반환하고, judge.js 는 자동으로 mock 경로로 폴백합니다.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 5174 --strictPort',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      // 테스트 환경에서는 백엔드가 없으므로 /api/grade/* 호출이 네트워크 오류로
      // 실패하고, judge.js 내부에서 mock 경로로 자동 폴백됩니다.
      VITE_API_BASE: 'http://localhost:3000',
    },
  },
});
