import { test, expect } from '@playwright/test';

/**
 * Gauge screen — fourth step. Animates 0 → 100% in ~3.5s, then enables the
 * "시작하기" button. Source: frontend/test-gauge.html + frontend/src/test-gauge.js
 */
test.describe('출제 게이지 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-gauge.html');
  });

  test('진입 직후 시작 버튼은 비활성 상태이다', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /시작하기/ });
    await expect(startBtn).toBeDisabled();
  });

  test('게이지가 100%에 도달하면 시작 버튼이 활성화된다', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /시작하기/ });
    // The fill animation is ~3.5s; allow generous slack for slow machines.
    await expect(startBtn).toBeEnabled({ timeout: 8_000 });
  });

  test('100%에 도달하면 progressbar의 aria-valuenow가 100이 된다', async ({
    page,
  }) => {
    const ring = page.locator('#gauge-ring');
    await expect(ring).toHaveAttribute('aria-valuenow', '100', { timeout: 8_000 });
  });

  test('시작 버튼을 누르면 문제 풀이 페이지로 이동한다', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /시작하기/ });
    await expect(startBtn).toBeEnabled({ timeout: 8_000 });
    await startBtn.click();
    await expect(page).toHaveURL(/test-problem\.html$/);
  });

  test('진행 정보가 sessionStorage에 저장된다', async ({ page }) => {
    // The gauge writes progress on load (default { current: 1, total: 5 }).
    await expect
      .poll(
        async () =>
          await page.evaluate(() =>
            sessionStorage.getItem('codenergy:test:progress'),
          ),
        { timeout: 5_000 },
      )
      .not.toBeNull();

    const stored = await page.evaluate(() =>
      sessionStorage.getItem('codenergy:test:progress'),
    );
    const parsed = JSON.parse(stored as string);
    expect(parsed.current).toBe(1);
    expect(parsed.total).toBe(5);
  });
});
