import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Codenergy frontend.
 *
 * - Runs only Chromium for fast CI feedback.
 * - Boots `npm run dev` automatically on port 5174.
 * - Forces Judge0 env vars to empty so the problem screen falls back to
 *   mock-mode execution (no external network calls during tests).
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
      // Force the problem page into mock-execution mode so tests don't need
      // to hit RapidAPI's Judge0 endpoint (avoids flake + quota burn).
      VITE_JUDGE0_KEY: '',
      VITE_JUDGE0_HOST: '',
    },
  },
});
