import { test, expect } from '@playwright/test';

/**
 * Concept selection screen — first step of the coding-test flow.
 * Source: frontend/test-concepts.html + frontend/src/test-concepts.js
 *
 * The concept-tile inputs are styled (opacity:0, pointer-events:none) so the
 * label receives clicks instead. Tests use { force: true } to drive the input
 * directly without depending on label hit-testing.
 */
test.describe('개념 선택 화면', () => {
  test.beforeEach(async ({ page }) => {
    // Fresh contexts already have empty storage; just navigate.
    await page.goto('/test-concepts.html');
  });

  test('아무 개념도 선택하지 않으면 시작 버튼이 비활성화된다', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /선택한 개념으로 시작하기/ });
    await expect(startBtn).toBeDisabled();
  });

  test('개념을 하나 체크하면 시작 버튼이 활성화된다', async ({ page }) => {
    await page.locator('input[name=concept][value=loops]').check({ force: true });
    const startBtn = page.getByRole('button', { name: /선택한 개념으로 시작하기/ });
    await expect(startBtn).toBeEnabled();
  });

  test('"전체 선택"을 누르면 12개 개념이 모두 체크된다', async ({ page }) => {
    await page.getByRole('button', { name: '전체 선택' }).click();
    const checked = page.locator('input[name=concept]:checked');
    await expect(checked).toHaveCount(12);
  });

  test('"모두 해제"를 누르면 모든 개념 체크가 해제된다', async ({ page }) => {
    await page.getByRole('button', { name: '전체 선택' }).click();
    await page.getByRole('button', { name: '모두 해제' }).click();
    const checked = page.locator('input[name=concept]:checked');
    await expect(checked).toHaveCount(0);
  });

  test('여러 개념을 선택하면 카운터가 갱신된다', async ({ page }) => {
    await page.locator('input[name=concept][value=vars]').check({ force: true });
    await page.locator('input[name=concept][value=loops]').check({ force: true });
    await page.locator('input[name=concept][value=arrays]').check({ force: true });
    await expect(page.locator('#concept-count strong')).toHaveText('3');
  });

  test('"설정 없이 시작"을 누르면 기본 5개 개념이 sessionStorage에 저장된다', async ({
    page,
  }) => {
    // Capture the saved value before the click triggers a navigation away.
    let stored: string | null = null;
    page.once('framenavigated', async () => {
      // no-op — we read storage on the new page below
    });
    await page.getByRole('button', { name: '설정 없이 시작' }).click();
    await expect(page).toHaveURL(/test-intro\.html$/);

    stored = await page.evaluate(() =>
      sessionStorage.getItem('codenergy:test:concepts'),
    );
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.concepts).toEqual(
      expect.arrayContaining(['vars', 'cond', 'loops', 'arrays', 'functions']),
    );
    expect(parsed.concepts).toHaveLength(5);
  });

  test('"설정 없이 시작"을 누르면 안내 페이지로 이동한다', async ({ page }) => {
    await page.getByRole('button', { name: '설정 없이 시작' }).click();
    await expect(page).toHaveURL(/test-intro\.html$/);
  });
});
