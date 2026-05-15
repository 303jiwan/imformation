import { test, expect } from '@playwright/test';

/**
 * Intro screen — second step.
 * Source: frontend/test-intro.html + frontend/src/test-intro.js
 */
test.describe('테스트 안내 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-intro.html');
  });

  test('초기 진입 시 추가 안내(intro-extended)는 닫혀 있다', async ({ page }) => {
    const extended = page.locator('#intro-extended');
    await expect(extended).not.toHaveClass(/is-open/);
    await expect(page.locator('#intro-toggle')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  test('화살표 토글을 누르면 추가 안내가 펼쳐진다', async ({ page }) => {
    await page.locator('#intro-toggle').click();
    await expect(page.locator('#intro-extended')).toHaveClass(/is-open/);
    await expect(page.locator('#intro-toggle')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  test('펼친 추가 안내를 다시 누르면 접힌다', async ({ page }) => {
    const toggle = page.locator('#intro-toggle');
    const extended = page.locator('#intro-extended');
    await toggle.click();
    await expect(extended).toHaveClass(/is-open/);
    await toggle.click();
    await expect(extended).not.toHaveClass(/is-open/);
  });

  test('"설명 건너뛰기"를 누르면 로그인 페이지로 이동한다', async ({ page }) => {
    await page.getByRole('button', { name: /설명 건너뛰기/ }).click();
    await expect(page).toHaveURL(/test-login\.html$/);
  });

  test('"로그인하고 시작하기"를 누르면 로그인 페이지로 이동한다', async ({ page }) => {
    await page.getByRole('button', { name: /로그인하고 시작하기/ }).click();
    await expect(page).toHaveURL(/test-login\.html$/);
  });
});
