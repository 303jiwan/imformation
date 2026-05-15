import { test, expect } from '@playwright/test';

/**
 * Avatar customization page.
 * Source: frontend/avatar.html + frontend/src/avatar.js (+ src/avatar/*).
 *
 * The avatar page is auth-gated: when logged out it shows an empty CTA;
 * when logged in it renders a character SVG and a wardrobe panel with
 * category tabs (top/bottom/hat/face, plus an upcoming "skin" tab).
 *
 * Auth state is detected by avatar.js via `#my-wrap` not being hidden.
 * Tests log in by injecting a demo user into localStorage before page
 * load — the same shape main.js uses when the backend is unreachable
 * (see DEMO_USER_KEY / readDemoUser in src/main.js). Because tests run
 * against `npm run dev` (Vite dev server) with no backend, /api/me will
 * fail with a TypeError and main.js will fall back to the stored demo
 * user, flipping `#my-wrap` open and unblocking the avatar UI.
 */

const DEMO_USER_KEY = 'codenergy:demo:user';
const EQUIPPED_KEY = 'codenergy:avatar:equipped';
const DEFAULT_SKIN_BASE = '#fde68a'; // matches DEFAULT_SKIN_TONE in character.js

/**
 * Block any call to the /api/* backend at localhost:3000 with a network
 * failure. main.js treats `fetch` TypeError as "backend down" and falls
 * back to the demo user in localStorage; this keeps tests deterministic
 * regardless of whether anything happens to be running on port 3000.
 */
async function blockBackend(page: import('@playwright/test').Page) {
  await page.route('http://localhost:3000/**', (route) => route.abort());
}

/** Inject a demo user into localStorage before any page script runs. */
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
  test('로그아웃 상태에서 아바타 페이지를 열면 로그인 안내 CTA가 보인다', async ({
    page,
  }) => {
    await page.goto('/avatar.html');

    await expect(
      page.getByRole('heading', { name: /로그인이 필요해요/ }),
    ).toBeVisible({ timeout: 5000 });

    await expect(
      page.getByRole('button', { name: '로그인하기' }),
    ).toBeVisible();
  });

  test('데모 사용자로 로그인하면 캐릭터와 카테고리 탭이 보인다', async ({
    page,
  }) => {
    await loginAsDemoUser(page);
    await page.goto('/avatar.html');

    // Character SVG appears (rendered by renderCharacter()).
    await expect(page.locator('.codenergy-character')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('.avatar-stage')).toBeVisible();

    // Category tabs: 4 (top/bottom/hat/face) baseline. Agent 4 is adding
    // a "skin" tab, so accept either 4 or 5.
    const tabs = page.locator('.avatar-tab');
    const tabCount = await tabs.count();
    expect(tabCount === 4 || tabCount === 5).toBe(true);

    await expect(page.locator('.avatar-tab[data-cat="top"]')).toBeVisible();
    await expect(page.locator('.avatar-tab[data-cat="bottom"]')).toBeVisible();
    await expect(page.locator('.avatar-tab[data-cat="hat"]')).toBeVisible();
    await expect(page.locator('.avatar-tab[data-cat="face"]')).toBeVisible();
  });

  test('상의를 변경하면 캐릭터 SVG에 새 옷 클래스가 반영되고 localStorage에 저장된다', async ({
    page,
  }) => {
    await loginAsDemoUser(page);
    await page.goto('/avatar.html');

    // Top tab is the default active tab (activeCategory='top'), so the grid
    // should already show top items.
    await expect(page.locator('.avatar-tab[data-cat="top"]')).toBeVisible({
      timeout: 5000,
    });

    // Click the second top item in the wardrobe grid (index 1).
    const items = page.locator('#avatar-grid .avatar-item');
    await expect(items.nth(1)).toBeVisible();

    const newTopId = await items.nth(1).getAttribute('data-id');
    expect(newTopId).toBeTruthy();
    expect(newTopId).not.toBe('__none__');

    await items.nth(1).click();

    // Character SVG should now contain a <g> with the equipped outfit class
    // (e.g. "top-hoodie-purple"). svgFragments in outfits.js apply the id as
    // a class on the wrapping <g>.
    await expect(
      page.locator(`.codenergy-character g.${newTopId as string}`),
    ).toHaveCount(1, { timeout: 5000 });

    // localStorage persistence
    const stored = await page.evaluate(
      (key) => localStorage.getItem(key),
      EQUIPPED_KEY,
    );
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.top).toBe(newTopId);
  });

  test('피부톤을 변경하면 캐릭터 머리 fill 색상이 기본값과 달라진다', async ({
    page,
  }) => {
    await loginAsDemoUser(page);
    await page.goto('/avatar.html');

    // Wait for the wardrobe to render so we know auth has resolved.
    await expect(page.locator('.avatar-tab[data-cat="top"]')).toBeVisible({
      timeout: 5000,
    });

    // The skin tab is added by Agent 4 — fail loudly with a clear message
    // if it's missing rather than producing a silent empty-locator timeout.
    const skinTab = page.locator('.avatar-tab[data-cat="skin"]');
    await expect(skinTab).toBeVisible({ timeout: 5000 });

    await skinTab.click();

    // Wardrobe grid now shows skin tone swatches. SKIN_TONES in
    // character.js exposes 6 entries; the skin category disallows "none",
    // so the grid should hold 5–6 swatches.
    const swatches = page.locator('#avatar-grid .avatar-item');
    const swatchCount = await swatches.count();
    expect(swatchCount).toBeGreaterThanOrEqual(5);
    expect(swatchCount).toBeLessThanOrEqual(6);

    // Click the last swatch (darkest tone).
    await swatches.last().click();

    // Head circle in the character SVG should no longer use the default
    // skin base. char-head <g> contains a <circle> for the head; check its
    // fill attribute via DOM rather than computed style (SVG fills are set
    // via the fill attribute in character.js).
    const headFill = await page
      .locator('.codenergy-character g.char-head circle')
      .first()
      .getAttribute('fill');

    expect(headFill).not.toBeNull();
    expect((headFill as string).toLowerCase()).not.toBe(
      DEFAULT_SKIN_BASE.toLowerCase(),
    );
  });

  test('헤더 "아바타" 메뉴 → 로그인 모달 → 데모 모드로 → /avatar.html 로 이동', async ({
    page,
  }) => {
    // No demo user pre-seeded — exercise the real logged-out -> logged-in
    // transition that main.js' setLoggedIn() uses to redirect.
    await blockBackend(page);
    await page.goto('/');

    // Desktop Chrome viewport (1280x720) is above the 1000px breakpoint, so
    // the menu link is rendered inline and clickable directly. The avatar
    // menu item uses data-action="avatar" with href="#"; main.js intercepts
    // the click and opens the auth modal when logged-out.
    const avatarMenu = page.locator('.menu a[data-action="avatar"]');
    await expect(avatarMenu).toBeVisible({ timeout: 5000 });
    await avatarMenu.click();

    // Auth modal becomes visible. main.js opens it via login-btn.click(),
    // which sets mode="login" — but signup mode would also be acceptable
    // per the task spec.
    const authModal = page.locator('#auth-modal');
    await expect(authModal).toBeVisible({ timeout: 5000 });

    // Fill credentials. minlength on inputs is 2/6, so use values that pass.
    await page.locator('#auth-form input[name=username]').fill('tester');
    await page.locator('#auth-form input[name=password]').fill('password123');

    // The email field is hidden in login mode but shown in signup mode. If
    // it's currently visible, populate it so the submit doesn't bail on a
    // required-but-empty input.
    const emailInput = page.locator('#auth-form input[name=email]');
    const emailVisible = await emailInput.isVisible();
    if (emailVisible) {
      await emailInput.fill('tester@gmail.com');
    }

    // Submit. With no backend running, fetch throws TypeError and main.js
    // renders the demo-mode fallback button inside #modal-error.
    await page.locator('#auth-form').evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
    });

    // Demo-mode fallback button appears.
    const demoBtn = page.getByRole('button', {
      name: /데모 모드로 계속하기/,
    });
    await expect(demoBtn).toBeVisible({ timeout: 5000 });

    // Clicking it logs the user in via the demo path. main.js' setLoggedIn()
    // sees a logged-out -> logged-in transition with the modal still open
    // and the redirect intent set, and navigates to avatar.html.
    await demoBtn.click();

    await expect(page).toHaveURL(/avatar\.html$/, { timeout: 5000 });
  });
});
