import { test, expect } from '@playwright/test';

/**
 * Problem-solving screen — fifth step.
 * Source: frontend/test-problem.html + frontend/src/test-problem.js
 *
 * Problem 1 has aMin=1, aMax=10 — useful for input-range validation.
 * The Judge0 key is forced empty in playwright.config.ts so "코드 실행"
 * always takes the mock path.
 */

// Pre-handle the "테스트 케이스를 기본값으로…" / 종료 confirms by accepting the dialog
// only where needed — most tests never trigger one. We register a no-op default
// here so an unexpected confirm doesn't hang Playwright.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      sessionStorage.clear();
      // Seed progress so test-problem.js loads problem 1 deterministically.
      sessionStorage.setItem(
        'codenergy:test:progress',
        JSON.stringify({ current: 1, total: 5 }),
      );
    } catch (_) {
      /* ignore */
    }
  });
});

test.describe('문제 풀이 화면', () => {
  test('Monaco 에디터 또는 textarea fallback 중 하나가 마운트된다', async ({
    page,
  }) => {
    await page.goto('/test-problem.html');
    // Either Monaco's textarea (.monaco-editor textarea) is present, or the
    // fallback textarea becomes visible. We poll a single locator covering both.
    const editorReady = page.locator(
      '#editor-container .monaco-editor, #editor-fallback:not([hidden])',
    );
    await expect(editorReady.first()).toBeVisible({ timeout: 10_000 });
  });

  test('"테스트케이스" 모드에서 범위 밖 값을 입력하면 에러 메시지가 표시된다', async ({
    page,
  }) => {
    await page.goto('/test-problem.html');
    await page.locator('#action-cases').click();
    const editor = page.locator('#case-input-edit');
    await expect(editor).toBeVisible();

    // Problem 1's allowed range is 1..10. 99 is comfortably out of range.
    await editor.fill('99');

    const errorEl = page.locator('#case-input-error');
    await expect(errorEl).toBeVisible();
    await expect(errorEl).toContainText('범위 밖입니다. 다른 값으로 바꿔주십시오.');
  });

  test('범위 안의 값을 입력하면 에러 메시지가 사라진다', async ({ page }) => {
    await page.goto('/test-problem.html');
    await page.locator('#action-cases').click();
    const editor = page.locator('#case-input-edit');
    await editor.fill('99');
    await expect(page.locator('#case-input-error')).toBeVisible();
    await editor.fill('5');
    await expect(page.locator('#case-input-error')).toBeHidden();
  });

  test('분할바를 드래그하면 --problem-split CSS 변수가 변한다', async ({ page }) => {
    await page.goto('/test-problem.html');
    const splitter = page.locator('#splitter');
    await expect(splitter).toBeVisible();

    // Read initial split (will be empty unless previously set, so default to 50).
    const before = await page.evaluate(() => {
      const ws = document.getElementById('workspace');
      return ws?.style.getPropertyValue('--problem-split') || '';
    });

    const box = await splitter.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    // Drag the splitter ~200px to the right via pointer events.
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 200, startY, { steps: 10 });
    await page.mouse.up();

    const after = await page.evaluate(() => {
      const ws = document.getElementById('workspace');
      return ws?.style.getPropertyValue('--problem-split') || '';
    });

    expect(after).not.toBe('');
    expect(after).not.toBe(before);
  });

  test('"+" 버튼을 누르면 테스트케이스가 추가된다', async ({ page }) => {
    await page.goto('/test-problem.html');
    // The add button only appears once the dock is in tests mode.
    await page.locator('#action-cases').click();

    const cases = page.locator('#dock-cases .problem-case');
    const initialCount = await cases.count();

    // The hidden attribute is removed on tests mode (CSS controls visibility).
    const addBtn = page.locator('#dock-add');
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    await expect(cases).toHaveCount(initialCount + 1);
  });

  test('Judge0 키가 없을 때 "코드 실행"을 누르면 mock 모드로 결과가 채워진다', async ({
    page,
  }) => {
    await page.goto('/test-problem.html');

    // Wait for the editor (Monaco or fallback) to be ready before clicking run.
    const editorReady = page.locator(
      '#editor-container .monaco-editor, #editor-fallback:not([hidden])',
    );
    await expect(editorReady.first()).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: /코드 실행/ }).click();

    // Mock mode flips dock to result mode and renders a verdict synchronously.
    const verdict = page.locator('#dock-verdict');
    await expect(verdict).toHaveClass(/is-pass|is-fail/, { timeout: 5_000 });

    // Detail rows get filled with non-placeholder values in mock mode.
    await expect(page.locator('#detail-time')).not.toHaveText('—');
  });
});
