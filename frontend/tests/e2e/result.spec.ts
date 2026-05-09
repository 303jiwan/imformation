import { test, expect } from '@playwright/test';

/**
 * Result screen — sixth step.
 * Source: frontend/test-result.html + frontend/src/test-result.js
 *
 * - Per-problem mode (current ≤ 4): "다음 문제 풀기" → bumps progress + nav to gauge.
 * - Final mode (current === total): "최종 결과 보기" → swaps to summary view in-place.
 *
 * Pattern: navigate to a benign page first to obtain a same-origin context,
 * seed sessionStorage, then navigate to the result page. We avoid
 * `addInitScript` here because it would also run on the post-click navigation
 * to test-gauge.html and wipe the value we want to verify.
 */

async function seedProgress(
  page: import('@playwright/test').Page,
  progress: { current: number; total: number },
  answers: Record<string, unknown>,
) {
  // Land on any same-origin page so we can write sessionStorage.
  await page.goto('/test-result.html');
  await page.evaluate(
    ({ progress, answers }) => {
      sessionStorage.setItem('codenergy:test:progress', JSON.stringify(progress));
      sessionStorage.setItem('codenergy:test:answers', JSON.stringify(answers));
    },
    { progress, answers },
  );
  // Reload so test-result.js picks up the seeded values.
  await page.reload();
}

test.describe('테스트 결과 화면', () => {
  test('초기 진입 시 (current=1) "다음 문제 풀기" 버튼이 보인다', async ({ page }) => {
    await seedProgress(
      page,
      { current: 1, total: 5 },
      {
        1: {
          code: '#include <stdio.h>\nint main(){printf("7\\n");return 0;}',
          verdict: 'correct',
          cases: [{ A: 1 }, { A: 2 }],
        },
      },
    );

    await expect(page.getByRole('button', { name: /다음 문제 풀기/ })).toBeVisible();
  });

  test('"다음 문제 풀기"를 누르면 progress.current가 1 증가한다', async ({ page }) => {
    await seedProgress(
      page,
      { current: 1, total: 5 },
      { 1: { code: 'x', verdict: 'correct', cases: [] } },
    );

    await page.getByRole('button', { name: /다음 문제 풀기/ }).click();
    await expect(page).toHaveURL(/test-gauge\.html$/);

    const stored = await page.evaluate(() =>
      sessionStorage.getItem('codenergy:test:progress'),
    );
    const parsed = JSON.parse(stored as string);
    expect(parsed.current).toBe(2);
    expect(parsed.total).toBe(5);
  });

  test('"다음 문제 풀기"를 누르면 게이지로 이동한다', async ({ page }) => {
    await seedProgress(
      page,
      { current: 1, total: 5 },
      { 1: { code: 'x', verdict: 'correct', cases: [] } },
    );

    await page.getByRole('button', { name: /다음 문제 풀기/ }).click();
    await expect(page).toHaveURL(/test-gauge\.html$/);
  });

  test('current=5일 때 "최종 결과 보기" 버튼이 보인다', async ({ page }) => {
    await seedProgress(
      page,
      { current: 5, total: 5 },
      {
        1: { code: 'x', verdict: 'correct', cases: [] },
        2: { code: 'x', verdict: 'wrong', cases: [] },
        3: { code: 'x', verdict: 'correct', cases: [] },
        4: { code: 'x', verdict: 'correct', cases: [] },
        5: { code: 'x', verdict: 'correct', cases: [] },
      },
    );

    await expect(page.getByRole('button', { name: /최종 결과 보기/ })).toBeVisible();
  });

  test('"최종 결과 보기"를 누르면 같은 페이지에서 요약 모드로 전환된다', async ({
    page,
  }) => {
    await seedProgress(
      page,
      { current: 5, total: 5 },
      {
        1: { code: 'x', verdict: 'correct', cases: [] },
        2: { code: 'x', verdict: 'wrong', cases: [] },
        3: { code: 'x', verdict: 'correct', cases: [] },
        4: { code: 'x', verdict: 'correct', cases: [] },
        5: { code: 'x', verdict: 'correct', cases: [] },
      },
    );

    await page.getByRole('button', { name: /최종 결과 보기/ }).click();

    // URL stays on test-result.html — summary renders in-place.
    await expect(page).toHaveURL(/test-result\.html$/);
    await expect(
      page.getByRole('heading', { name: '전체 결과 한눈에 보기' }),
    ).toBeVisible();
  });

  test('요약 모드는 정답 4 / 오답 1을 정확히 집계해 표시한다', async ({ page }) => {
    await seedProgress(
      page,
      { current: 5, total: 5 },
      {
        1: { code: 'x', verdict: 'correct', cases: [] },
        2: { code: 'x', verdict: 'wrong', cases: [] },
        3: { code: 'x', verdict: 'correct', cases: [] },
        4: { code: 'x', verdict: 'correct', cases: [] },
        5: { code: 'x', verdict: 'correct', cases: [] },
      },
    );

    await page.getByRole('button', { name: /최종 결과 보기/ }).click();
    const score = page.locator('.summary-score').first();
    await expect(score).toContainText('4');
    await expect(score).toContainText('5');
  });
});
