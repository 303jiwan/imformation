import { test, expect, type Page, type Request } from '@playwright/test';

/**
 * E2E tests for the revamped avatar editor (new schema).
 *
 * Contract this file depends on (selectors / behavior):
 *   - .avatar-character svg                   live SVG preview
 *   - .avatar-tabs--primary .avatar-tab       primary tabs (3: 신체/의상/악세사리); one has .is-active
 *   - .avatar-tabs--secondary .avatar-tab     secondary tabs; one has .is-active
 *   - .avatar-grid > .avatar-item             style options; one has .is-equipped
 *   - .avatar-color-row > .avatar-color-chip  color chips; one has .is-selected
 *   - [data-action="finish"]                  Finish Editing button
 *   - #avatar-toast.is-show                   toast visible; .is-error on failure
 *   - GET  /api/avatar  -> { avatar: <config|null> }
 *   - POST /api/avatar  body: { avatar: <config> }, expects 200 { ok, avatar }
 *
 * Backend is mocked via page.route(); the real backend is never hit.
 */

const AUTH_HINT_KEY = 'codenergy:auth:hint';
const DEMO_USER_KEY = 'codenergy:demo:user';

/** New schema DEFAULT_CONFIG (배터리 캐릭터, must match character.js) */
const DEFAULT_CONFIG = {
  body: {
    color: '#ffffff',
    symbol: { id: 'sym-bolt', color: '#22c55e' },
  },
  clothing: {
    top: { style: 'top-tee', color: '#2563eb' },
  },
  accessories: {
    hat:     null as null | { style: string; color: string },
    glasses: null as null | { style: string; color: string },
    other:   null as null | { style: string; color: string },
  },
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

async function setupLoggedInUser(page: Page) {
  await page.addInitScript(
    ({ hintKey, userKey, user }) => {
      try {
        localStorage.setItem(hintKey, 'logged-in');
        localStorage.setItem(userKey, JSON.stringify(user));
      } catch (_) {}
    },
    { hintKey: AUTH_HINT_KEY, userKey: DEMO_USER_KEY, user: DEMO_USER },
  );
}

async function clearAuthStorage(page: Page) {
  await page.addInitScript(
    ({ hintKey, userKey }) => {
      try {
        localStorage.removeItem(hintKey);
        localStorage.removeItem(userKey);
        localStorage.removeItem('codenergy:avatar:config');
        localStorage.removeItem('codenergy:avatar:equipped');
      } catch (_) {}
    },
    { hintKey: AUTH_HINT_KEY, userKey: DEMO_USER_KEY },
  );
}

interface MockOpts {
  savedConfig?: typeof DEFAULT_CONFIG | null;
  postStatus?: number;
  postBody?: Record<string, unknown>;
  unauthenticated?: boolean;
}

interface MockHandle {
  postRequests: Request[];
}

async function mockAvatarApi(page: Page, opts: MockOpts = {}): Promise<MockHandle> {
  const handle: MockHandle = { postRequests: [] };
  const savedConfig = opts.savedConfig === undefined ? null : opts.savedConfig;
  const postStatus = opts.postStatus ?? 200;

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
      } catch (_) {}
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

async function readPreviewSvg(page: Page): Promise<string> {
  return await page.locator('.avatar-character').innerHTML();
}

async function clickPrimaryTab(page: Page, label: string) {
  const byData = page.locator(`.avatar-tabs--primary .avatar-tab`, { hasText: label });
  if (await byData.count()) {
    await byData.first().click();
    return;
  }
  await page.getByRole('button', { name: label }).and(
    page.locator('.avatar-tabs--primary .avatar-tab'),
  ).first().click();
}

async function clickSecondaryTab(page: Page, label: string) {
  const byData = page.locator(`.avatar-tabs--secondary .avatar-tab`, { hasText: label });
  if (await byData.count()) {
    await byData.first().click();
    return;
  }
  await page.getByRole('button', { name: label }).and(
    page.locator('.avatar-tabs--secondary .avatar-tab'),
  ).first().click();
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

    // Live preview SVG visible
    await expect(page.locator('.avatar-character svg')).toBeVisible({ timeout: 5000 });

    // Primary tabs: exactly 4 (신체/의상/악세사리/상점)
    const primaryTabs = page.locator('.avatar-tabs--primary .avatar-tab');
    await expect(primaryTabs.first()).toBeVisible({ timeout: 5000 });
    expect(await primaryTabs.count()).toBe(4);

    // Secondary tabs visible (신체 → 본체색/문양)
    const secondaryTabs = page.locator('.avatar-tabs--secondary .avatar-tab');
    await expect(secondaryTabs.first()).toBeVisible({ timeout: 5000 });
    expect(await secondaryTabs.count()).toBeGreaterThanOrEqual(2);

    // First primary tab (신체) is active
    await expect(primaryTabs.first()).toHaveClass(/\bis-active\b/);
  });

  test('2) 상의 옵션을 변경하면 미리보기 SVG가 갱신된다', async ({ page }) => {
    await setupLoggedInUser(page);
    await mockAvatarApi(page, { savedConfig: null });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({ timeout: 5000 });

    // Navigate to 의상 > 상의
    await clickPrimaryTab(page, '의상');
    await clickSecondaryTab(page, '상의');

    const items = page.locator('.avatar-grid .avatar-item');
    await expect(items.first()).toBeVisible({ timeout: 5000 });

    const before = await readPreviewSvg(page);

    // Find an item that is NOT currently equipped, capture its data-id, then click
    const candidateEl = page.locator('.avatar-grid .avatar-item:not(.is-equipped)').first();
    await expect(candidateEl).toBeVisible({ timeout: 5000 });
    const candidateId = await candidateEl.getAttribute('data-id');
    await candidateEl.click();

    // After clicking, find the now-equipped item by its stable data-id
    if (candidateId) {
      const equippedItem = page.locator(`.avatar-grid .avatar-item[data-id="${candidateId}"]`);
      await expect(equippedItem).toHaveClass(/\bis-equipped\b/, { timeout: 5000 });
    }

    // SVG content should differ.
    await expect
      .poll(async () => (await readPreviewSvg(page)) !== before, { timeout: 5000 })
      .toBe(true);
  });

  test('3) 모자 + 색상 칩 변경이 미리보기에 반영된다', async ({ page }) => {
    await setupLoggedInUser(page);
    await mockAvatarApi(page, { savedConfig: null });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({ timeout: 5000 });

    // Navigate to 악세사리 > 모자
    await clickPrimaryTab(page, '악세사리');
    await clickSecondaryTab(page, '모자');

    const items = page.locator('.avatar-grid .avatar-item');
    await expect(items.first()).toBeVisible({ timeout: 5000 });

    // Pick second item (first is "none" for accessories)
    const secondItem = items.nth(Math.min(1, (await items.count()) - 1));
    await secondItem.click();
    await expect(secondItem).toHaveClass(/\bis-equipped\b/, { timeout: 5000 });

    // Color row should now be visible
    const chips = page.locator('.avatar-color-row .avatar-color-chip');
    await expect(chips.first()).toBeVisible({ timeout: 5000 });

    const TARGET = '#ef4444';
    const targetChip = await chips.evaluateAll((nodes, target) => {
      const norm = (s: string | null | undefined) => (s ?? '').toLowerCase().trim();
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i] as HTMLElement;
        const dataColor = norm(el.getAttribute('data-color'));
        const style = norm(el.getAttribute('style'));
        const bg = norm(getComputedStyle(el).backgroundColor);
        if (
          dataColor === target.toLowerCase() ||
          style.includes(target.toLowerCase()) ||
          bg === 'rgb(239, 68, 68)'
        ) {
          return i;
        }
      }
      return -1;
    }, TARGET);

    expect(
      targetChip,
      'expected a .avatar-color-chip representing #ef4444',
    ).toBeGreaterThanOrEqual(0);

    await chips.nth(targetChip).click();

    await expect
      .poll(
        async () => {
          const lower = await page.locator('.avatar-character svg [fill="#ef4444"]').count();
          const upper = await page.locator('.avatar-character svg [fill="#EF4444"]').count();
          return lower + upper;
        },
        { timeout: 5000 },
      )
      .toBeGreaterThan(0);
  });

  test('4) Finish Editing 버튼을 누르면 토스트가 뜨고 POST /api/avatar 가 호출된다', async ({
    page,
  }) => {
    await setupLoggedInUser(page);
    const handle = await mockAvatarApi(page, { savedConfig: null });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({ timeout: 5000 });

    const finishBtn = page.locator('[data-action="finish"]').first();
    await expect(finishBtn).toBeVisible({ timeout: 5000 });
    await finishBtn.click();

    // Toast appears with is-show
    await expect(page.locator('#avatar-toast.is-show')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#avatar-toast')).toContainText('저장');

    // POST request sent with avatar key
    expect(handle.postRequests.length).toBeGreaterThanOrEqual(1);
    const lastReq = handle.postRequests[handle.postRequests.length - 1];
    expect(lastReq.method()).toBe('POST');
    let parsedBody: unknown = null;
    try {
      parsedBody = JSON.parse(lastReq.postData() ?? '{}');
    } catch (_) {}
    expect(parsedBody).toHaveProperty('avatar');
  });

  test('5) 새로고침해도 저장된 아바타 색상이 복원된다', async ({ page }) => {
    await setupLoggedInUser(page);
    const saved = {
      ...DEFAULT_CONFIG,
      clothing: {
        ...DEFAULT_CONFIG.clothing,
        top: { style: 'top-tee', color: '#ef4444' },
      },
    };
    await mockAvatarApi(page, { savedConfig: saved });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({ timeout: 5000 });

    await page.reload();
    await expect(page.locator('.avatar-character svg')).toBeVisible({ timeout: 5000 });

    await expect
      .poll(
        async () => {
          const lower = await page.locator('.avatar-character svg [fill="#ef4444"]').count();
          const upper = await page.locator('.avatar-character svg [fill="#EF4444"]').count();
          return lower + upper;
        },
        { timeout: 5000 },
      )
      .toBeGreaterThan(0);
  });

  test('6) 비로그인 상태에서는 #auth-modal이 뜨고 editor는 렌더되지 않는다', async ({
    page,
  }) => {
    await mockAvatarApi(page, { unauthenticated: true });

    await page.goto('/avatar.html');

    // avatar.js renderEmpty() triggers header login btn click → modal opens
    await expect(page.locator('#auth-modal')).toBeVisible({ timeout: 5000 });

    // Character SVG should not be present
    const charSvg = page.locator('.avatar-character svg');
    if ((await charSvg.count()) > 0) {
      await expect(charSvg.first()).toBeHidden();
    }

    // Finish Editing / avatar-save-btn should not exist
    await expect(page.locator('[data-action="finish"]')).toHaveCount(0);
  });

  test('7) 저장 실패 시 에러 토스트가 표시된다', async ({ page }) => {
    await setupLoggedInUser(page);
    await mockAvatarApi(page, {
      savedConfig: null,
      postStatus: 500,
      postBody: { error: 'boom' },
    });

    await page.goto('/avatar.html');
    await expect(page.locator('.avatar-character svg')).toBeVisible({ timeout: 5000 });

    const finishBtn = page.locator('[data-action="finish"]').first();
    await expect(finishBtn).toBeVisible({ timeout: 5000 });
    await finishBtn.click();

    await expect(page.locator('#avatar-toast.is-show.is-error')).toBeVisible({ timeout: 2000 });
  });
});
