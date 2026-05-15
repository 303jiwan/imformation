import { test, expect, type Page, type Request } from '@playwright/test';

/**
 * E2E tests for the revamped avatar editor (Agent 3).
 *
 * Contract this file depends on (selectors / behavior):
 *   - .avatar-character svg          live SVG preview
 *   - .avatar-tabs > .avatar-tab     category tabs; one has .is-active
 *   - .avatar-grid > .avatar-item    style options; one has .is-equipped
 *   - .avatar-color-row >
 *       .avatar-color-chip           color chips; one has .is-selected
 *   - .avatar-save-btn               save button (accessible name "저장")
 *   - #avatar-toast.is-show          toast visible; .is-error on failure
 *   - .avatar-empty                  logged-out empty state
 *   - GET  /api/avatar  -> { avatar: <config|null> }
 *   - POST /api/avatar  body: { avatar: <config> }, expects 200 { ok, avatar }
 *
 * Backend is mocked via page.route(); the real backend is never hit.
 */

const AUTH_HINT_KEY = 'codenergy:auth:hint';
const DEMO_USER_KEY = 'codenergy:demo:user';

/** Canonical avatar config used as the default mocked response. */
const DEFAULT_CONFIG = {
  hair: { style: 'short', color: '#3b2a20' },
  top: { style: 'tee', color: '#2563eb' },
  bottom: { style: 'jeans', color: '#1f2937' },
  face: { style: 'face-smile' },
  skinTone: '#fde68a',
  accessories: [] as Array<{ type: string; style: string; color: string }>,
  background: 'default',
};

const DEMO_USER = {
  username: 'tester',
  email: 'tester@example.com',
  passwordHash: '',
  demo: true,
  createdAt: 1_700_000_000_000,
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Seed localStorage so avatar.js / main.js consider the session logged-in
 * before the page scripts run. This bypasses /api/me waiting and the
 * initial logged-out flash.
 */
async function setupLoggedInUser(page: Page) {
  await page.addInitScript(
    ({ hintKey, userKey, user }) => {
      try {
        localStorage.setItem(hintKey, 'logged-in');
        localStorage.setItem(userKey, JSON.stringify(user));
      } catch (_) {
        /* ignore quota / privacy errors */
      }
    },
    { hintKey: AUTH_HINT_KEY, userKey: DEMO_USER_KEY, user: DEMO_USER },
  );
}

/** Make sure no leftover storage from a previous test pollutes the next one. */
async function clearAuthStorage(page: Page) {
  await page.addInitScript(
    ({ hintKey, userKey }) => {
      try {
        localStorage.removeItem(hintKey);
        localStorage.removeItem(userKey);
        localStorage.removeItem('codenergy:avatar:config');
        localStorage.removeItem('codenergy:avatar:equipped');
      } catch (_) {
        /* ignore */
      }
    },
    { hintKey: AUTH_HINT_KEY, userKey: DEMO_USER_KEY },
  );
}

interface MockOpts {
  /** Config returned by GET /api/avatar. `null` means "no saved avatar". */
  savedConfig?: typeof DEFAULT_CONFIG | null;
  /** HTTP status for POST /api/avatar. Defaults to 200. */
  postStatus?: number;
  /** Body for POST /api/avatar. Defaults to echoing the request body. */
  postBody?: Record<string, unknown>;
  /** If true, GET /api/me returns 401 and GET /api/avatar returns 401 too. */
  unauthenticated?: boolean;
}

interface MockHandle {
  /** All POST /api/avatar requests captured in order. */
  postRequests: Request[];
}

/**
 * Set up route mocks for the avatar API + auth.
 *
 * Returns a handle exposing the captured POST requests so tests can assert
 * against them.
 */
async function mockAvatarApi(page: Page, opts: MockOpts = {}): Promise<MockHandle> {
  const handle: MockHandle = { postRequests: [] };
  const savedConfig = opts.savedConfig === undefined ? null : opts.savedConfig;
  const postStatus = opts.postStatus ?? 200;

  // /api/me — auth probe used by main.js
  await page.route('**/api/me', async (route) => {
    if (opts.unauthenticated) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'unauthenticated' }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: DEMO_USER }),
    });
  });

  // /api/avatar — GET returns saved config, POST echoes / errors
  await page.route('**/api/avatar', async (route) => {
    const req = route.request();
    const method = req.method();

    if (method === 'GET') {
      if (opts.unauthenticated) {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'unauthenticated' }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ avatar: savedConfig }),
      });
      return;
    }

    if (method === 'POST') {
      handle.postRequests.push(req);
      let avatarFromBody: unknown = null;
      try {
        const parsed = JSON.parse(req.postData() ?? '{}');
        avatarFromBody = parsed?.avatar ?? null;
      } catch (_) {
        /* malformed body — leave avatarFromBody null */
      }
      const body =
        opts.postBody ??
        (postStatus >= 400
          ? { error: 'boom' }
          : { ok: true, avatar: avatarFromBody });
      await route.fulfill({
        status: postStatus,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
      return;
    }

    await route.continue();
  });

  return handle;
}

/** Read the canonical innerHTML of the live preview SVG. */
async function readPreviewSvg(page: Page): Promise<string> {
  return await page.locator('.avatar-character').innerHTML();
}

/**
 * Click the tab whose visible label matches `label`. Tabs are buttons with
 * Korean labels (헤어, 상의, …); we prefer accessible name lookup but fall
 * back to a text-content scan if the role isn't button.
 */
async function clickTab(page: Page, label: string) {
  const byRole = page.getByRole('button', { name: label }).and(
    page.locator('.avatar-tab'),
  );
  if (await byRole.count()) {
    await byRole.first().click();
    return;
  }
  await page.locator('.avatar-tab', { hasText: label }).first().click();
}

/* -------------------------------------------------------------------------- */
/* Tests                                                                      */
/* -------------------------------------------------------------------------- */

test.describe('아바타 에디터', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthStorage(page);
  });

  test('1) 로그인 + 저장된 아바타 없음 → 기본 캐릭터와 탭이 렌더된다', async ({
    page,
  }) => {
    await setupLoggedInUser(page);
    await mockAvatarApi(page, { savedConfig: null });

    await page.goto('/avatar.html');

    // Live preview SVG visible.
    await expect(page.locator('.avatar-character svg')).toBeVisible({
      timeout: 5000,
    });

    // Category tabs: at least 7 (헤어, 상의, 하의, 표정, 모자, 안경, 귀걸이[, 피부톤, 배경]).
    const tabs = page.locator('.avatar-tabs .avatar-tab');
    await expect(tabs.first()).toBeVisible({ timeout: 5000 });
    expect(await tabs.count()).toBeGreaterThanOrEqual(7);

    // First tab (헤어) is active.
    await expect(tabs.first()).toHaveClass(/\bis-active\b/);
  });

  test('2) 상의 옵션을 변경하면 미리보기 SVG가 갱신된다', async ({ page }) => {
    await setupLoggedInUser(page);
    await mockAvatarApi(page, { savedConfig: null });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({
      timeout: 5000,
    });

    await clickTab(page, '상의');

    // Wait for the grid to render top items.
    const items = page.locator('.avatar-grid .avatar-item');
    await expect(items.first()).toBeVisible({ timeout: 5000 });

    const before = await readPreviewSvg(page);

    // Click an item that is NOT currently equipped.
    const candidate = items.locator(':not(.is-equipped)').first();
    await expect(candidate).toBeVisible({ timeout: 5000 });
    await candidate.click();

    // The clicked item should now be equipped.
    await expect(candidate).toHaveClass(/\bis-equipped\b/, { timeout: 5000 });

    // SVG content should differ.
    await expect
      .poll(async () => (await readPreviewSvg(page)) !== before, {
        timeout: 5000,
      })
      .toBe(true);
  });

  test('3) 모자 + 색상 칩 변경이 미리보기에 반영된다', async ({ page }) => {
    await setupLoggedInUser(page);
    await mockAvatarApi(page, { savedConfig: null });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({
      timeout: 5000,
    });

    await clickTab(page, '모자');

    const items = page.locator('.avatar-grid .avatar-item');
    await expect(items.first()).toBeVisible({ timeout: 5000 });

    // Pick the second item — first might be a "none" option.
    const secondItem = items.nth(Math.min(1, (await items.count()) - 1));
    await secondItem.click();
    await expect(secondItem).toHaveClass(/\bis-equipped\b/, { timeout: 5000 });

    // Find a color chip whose color is #ef4444 (red).
    const TARGET = '#ef4444';
    const chips = page.locator('.avatar-color-row .avatar-color-chip');
    await expect(chips.first()).toBeVisible({ timeout: 5000 });

    const targetChip = await chips
      .evaluateAll((nodes, target) => {
        const norm = (s: string | null | undefined) =>
          (s ?? '').toLowerCase().trim();
        for (let i = 0; i < nodes.length; i += 1) {
          const el = nodes[i] as HTMLElement;
          const style = norm(el.getAttribute('style'));
          const dataColor = norm(el.getAttribute('data-color'));
          const bg = norm(getComputedStyle(el).backgroundColor);
          if (
            style.includes(target.toLowerCase()) ||
            dataColor === target.toLowerCase() ||
            bg === 'rgb(239, 68, 68)'
          ) {
            return i;
          }
        }
        return -1;
      }, TARGET);

    expect(
      targetChip,
      'expected a .avatar-color-chip representing #ef4444 — agents 1/2: please expose color via inline style or data-color',
    ).toBeGreaterThanOrEqual(0);

    await chips.nth(targetChip).click();

    // SVG should now contain a fill="#ef4444" element (case-insensitive).
    await expect
      .poll(
        async () => {
          const lowerHits = await page
            .locator('.avatar-character svg [fill="#ef4444"]')
            .count();
          const upperHits = await page
            .locator('.avatar-character svg [fill="#EF4444"]')
            .count();
          return lowerHits + upperHits;
        },
        { timeout: 5000 },
      )
      .toBeGreaterThan(0);
  });

  test('4) 저장 버튼을 누르면 토스트가 뜨고 POST /api/avatar 가 호출된다', async ({
    page,
  }) => {
    await setupLoggedInUser(page);
    const handle = await mockAvatarApi(page, { savedConfig: null });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({
      timeout: 5000,
    });

    const saveBtn = page.locator('.avatar-save-btn').first();
    await expect(saveBtn).toBeVisible({ timeout: 5000 });
    await saveBtn.click();

    // Toast appears.
    await expect(page.locator('#avatar-toast.is-show')).toBeVisible({
      timeout: 2000,
    });
    await expect(page.locator('#avatar-toast')).toContainText('저장');

    // At least one POST request, body has `avatar` key.
    expect(handle.postRequests.length).toBeGreaterThanOrEqual(1);
    const lastReq = handle.postRequests[handle.postRequests.length - 1];
    expect(lastReq.method()).toBe('POST');
    let parsedBody: unknown = null;
    try {
      parsedBody = JSON.parse(lastReq.postData() ?? '{}');
    } catch (_) {
      /* leave null */
    }
    expect(parsedBody).toHaveProperty('avatar');
  });

  test('5) 새로고침해도 저장된 아바타 색상이 복원된다', async ({ page }) => {
    await setupLoggedInUser(page);
    const saved = {
      ...DEFAULT_CONFIG,
      top: { style: 'tee', color: '#ef4444' },
    };
    await mockAvatarApi(page, { savedConfig: saved });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({
      timeout: 5000,
    });

    await page.reload();
    await expect(page.locator('.avatar-character svg')).toBeVisible({
      timeout: 5000,
    });

    await expect
      .poll(
        async () => {
          const lower = await page
            .locator('.avatar-character svg [fill="#ef4444"]')
            .count();
          const upper = await page
            .locator('.avatar-character svg [fill="#EF4444"]')
            .count();
          return lower + upper;
        },
        { timeout: 5000 },
      )
      .toBeGreaterThan(0);
  });

  test('6) 비로그인 상태에서는 empty state(로그인 CTA)만 보인다', async ({
    page,
  }) => {
    // No setupLoggedInUser. Mock /api/me as 401 to make sure no path
    // accidentally promotes us to logged-in.
    await mockAvatarApi(page, { unauthenticated: true });

    await page.goto('/avatar.html');

    await expect(page.locator('.avatar-empty')).toBeVisible({ timeout: 5000 });

    // The character SVG should not be visible (either not rendered or hidden).
    const charSvg = page.locator('.avatar-character svg');
    if ((await charSvg.count()) > 0) {
      await expect(charSvg.first()).toBeHidden();
    }

    await expect(page.locator('.avatar-save-btn')).toHaveCount(0);
  });

  test('7) 저장 실패 시 에러 토스트가 표시된다', async ({ page }) => {
    await setupLoggedInUser(page);
    await mockAvatarApi(page, {
      savedConfig: null,
      postStatus: 500,
      postBody: { error: 'boom' },
    });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({
      timeout: 5000,
    });

    const saveBtn = page.locator('.avatar-save-btn').first();
    await expect(saveBtn).toBeVisible({ timeout: 5000 });
    await saveBtn.click();

    await expect(page.locator('#avatar-toast.is-show.is-error')).toBeVisible({
      timeout: 2000,
    });
  });
});
