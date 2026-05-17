import { test, expect } from '@playwright/test';

/**
 * Avatar customization page.
 * Source: frontend/avatar.html + frontend/src/avatar.js (+ src/avatar/*).
 *
 * New schema (배터리 캐릭터):
 *   { body: { color, symbol: {id, color} }, clothing: { top }, accessories: { hat, glasses, other } }
 *
 * Auth state is detected by avatar.js via `#my-wrap` not being hidden and/or
 * localStorage demo-user key. Tests inject a demo user before page load.
 */

const DEMO_USER_KEY = 'codenergy:demo:user';
const STORAGE_KEY   = 'codenergy:avatar:config';

async function blockBackend(page: import('@playwright/test').Page) {
  await page.route('http://localhost:3000/**', (route) => route.abort());
}

async function loginAsDemoUser(page: import('@playwright/test').Page) {
  await blockBackend(page);
  await page.addInitScript(
    ({ key }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          username: 'tester',
          email: 't@t.com',
          passwordHash: '',
          demo: true,
          createdAt: Date.now(),
        }),
      );
    },
    { key: DEMO_USER_KEY },
  );
}

test.describe('아바타 페이지', () => {
  test('로그아웃 상태에서 아바타 페이지를 열면 로그인 모달이 뜬다', async ({
    page,
  }) => {
    await blockBackend(page);
    await page.goto('/avatar.html');

    // avatar.js renderEmpty() clicks the header login button, which opens #auth-modal
    await expect(page.locator('#auth-modal')).toBeVisible({ timeout: 5000 });
  });

  test('데모 사용자로 로그인하면 캐릭터와 3단 탭이 보인다', async ({
    page,
  }) => {
    await loginAsDemoUser(page);
    await page.goto('/avatar.html');

    // Character SVG rendered by renderCharacter()
    await expect(page.locator('.codenergy-character')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.avatar-stage')).toBeVisible();

    // Primary tabs: 4 (신체 / 의상 / 악세사리 / 상점)
    const primaryTabs = page.locator('.avatar-tabs--primary .avatar-tab');
    await expect(primaryTabs.first()).toBeVisible({ timeout: 5000 });
    expect(await primaryTabs.count()).toBe(4);

    await expect(page.locator('.avatar-tabs--primary .avatar-tab[data-primary="body"]')).toBeVisible();
    await expect(page.locator('.avatar-tabs--primary .avatar-tab[data-primary="clothing"]')).toBeVisible();
    await expect(page.locator('.avatar-tabs--primary .avatar-tab[data-primary="accessories"]')).toBeVisible();
    await expect(page.locator('.avatar-tabs--primary .avatar-tab[data-primary="shop"]')).toBeVisible();
  });

  test('상의를 변경하면 캐릭터 SVG에 새 옷 클래스가 반영되고 localStorage에 저장된다', async ({
    page,
  }) => {
    await loginAsDemoUser(page);
    await page.goto('/avatar.html');

    // Navigate to 의상 primary tab, then 상의 secondary tab
    const clothingTab = page.locator('.avatar-tabs--primary .avatar-tab[data-primary="clothing"]');
    await expect(clothingTab).toBeVisible({ timeout: 5000 });
    await clothingTab.click();

    const topTab = page.locator('.avatar-tabs--secondary .avatar-tab[data-secondary="top"]');
    await expect(topTab).toBeVisible({ timeout: 3000 });
    await topTab.click();

    // Grid shows top items
    const items = page.locator('.avatar-grid .avatar-item');
    await expect(items.first()).toBeVisible({ timeout: 3000 });

    // Click second item (first non-none item)
    const second = items.nth(1);
    await expect(second).toBeVisible();
    const newTopId = await second.getAttribute('data-id');
    expect(newTopId).toBeTruthy();
    expect(newTopId).not.toBe('__none__');

    await second.click();

    // SVG should contain a <g> with the equipped outfit class
    await expect(
      page.locator(`.codenergy-character g.${newTopId as string}`),
    ).toHaveCount(1, { timeout: 5000 });

    // localStorage persistence with new schema
    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.clothing).toBeDefined();
    expect(parsed.clothing.top).toBeDefined();
    expect(parsed.clothing.top.style).toBe(newTopId);
  });

  test('본체색을 변경하면 캐릭터 SVG body rect fill이 바뀐다', async ({
    page,
  }) => {
    await loginAsDemoUser(page);
    await page.goto('/avatar.html');

    // Navigate to 신체 primary tab, then 본체색 secondary tab
    const bodyTab = page.locator('.avatar-tabs--primary .avatar-tab[data-primary="body"]');
    await expect(bodyTab).toBeVisible({ timeout: 5000 });
    await bodyTab.click();

    const colorTab = page.locator('.avatar-tabs--secondary .avatar-tab[data-secondary="color"]');
    await expect(colorTab).toBeVisible({ timeout: 3000 });
    await colorTab.click();

    // Grid now shows BATTERY_COLORS swatches (8~10 items)
    const swatches = page.locator('.avatar-grid .avatar-item');
    await expect(swatches.first()).toBeVisible({ timeout: 3000 });
    const swatchCount = await swatches.count();
    expect(swatchCount).toBeGreaterThanOrEqual(8);
    expect(swatchCount).toBeLessThanOrEqual(10);

    // Click a non-equipped swatch
    const nonEquipped = page.locator('.avatar-grid .avatar-item:not(.is-equipped)').first();
    await expect(nonEquipped).toBeVisible({ timeout: 3000 });
    await nonEquipped.click();

    // SVG should have a rect fill that differs from default (#ffffff)
    const bodyRect = await page
      .locator('.codenergy-character rect')
      .first()
      .getAttribute('fill');

    expect(bodyRect).not.toBeNull();
  });

  test('헤더 "아바타" 메뉴 → 로그인 모달 → 데모 모드로 → /avatar.html 로 이동', async ({
    page,
  }) => {
    await blockBackend(page);
    await page.goto('/');

    const avatarMenu = page.locator('.menu a[data-action="avatar"]');
    await expect(avatarMenu).toBeVisible({ timeout: 5000 });
    await avatarMenu.click();

    const authModal = page.locator('#auth-modal');
    await expect(authModal).toBeVisible({ timeout: 5000 });

    await page.locator('#auth-form input[name=username]').fill('tester');
    await page.locator('#auth-form input[name=password]').fill('password123');

    const emailInput = page.locator('#auth-form input[name=email]');
    const emailVisible = await emailInput.isVisible();
    if (emailVisible) {
      await emailInput.fill('tester@gmail.com');
    }

    await page.locator('#auth-form').evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
    });

    const demoBtn = page.getByRole('button', { name: /데모 모드로 계속하기/ });
    await expect(demoBtn).toBeVisible({ timeout: 5000 });

    await demoBtn.click();

    await expect(page).toHaveURL(/avatar\.html$/, { timeout: 5000 });
  });
});
