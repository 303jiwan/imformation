import { test, expect } from '@playwright/test';

/**
 * Login screen — third step.
 * The email-only path requires a valid Gmail address. Login via header buttons
 * is delegated to main.js's auth modal and is not exercised here.
 * Source: frontend/test-login.html + frontend/src/test-login.js
 */
test.describe('테스트 로그인 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-login.html');
  });

  test('잘못된 이메일을 입력하면 빨간 에러 메시지가 표시된다', async ({ page }) => {
    await page.locator('#email-input').fill('not-an-email');
    await page.locator('#email-form').evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
    });
    const errorEl = page.locator('#email-error');
    await expect(errorEl).toBeVisible();
    await expect(errorEl).toContainText('Gmail');
    await expect(page.locator('#email-input')).toHaveClass(/is-error/);
  });

  test('Gmail이 아닌 도메인을 입력하면 에러 메시지가 표시된다', async ({ page }) => {
    await page.locator('#email-input').fill('user@yahoo.com');
    await page.locator('#email-form').evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
    });
    await expect(page.locator('#email-error')).toBeVisible();
  });

  test('유효한 Gmail을 입력하고 제출하면 sessionStorage에 이메일이 저장된다', async ({
    page,
  }) => {
    await page.locator('#email-input').fill('tester@gmail.com');
    await page.getByRole('button', { name: /이메일로 시작하기/ }).click();
    await expect(page).toHaveURL(/test-gauge\.html$/);

    const stored = await page.evaluate(() =>
      sessionStorage.getItem('codenergy:test:email'),
    );
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.email).toBe('tester@gmail.com');
  });

  test('유효한 Gmail을 입력하고 제출하면 게이지 페이지로 이동한다', async ({
    page,
  }) => {
    await page.locator('#email-input').fill('tester@gmail.com');
    await page.getByRole('button', { name: /이메일로 시작하기/ }).click();
    await expect(page).toHaveURL(/test-gauge\.html$/);
  });
});
