import { test, expect } from '@playwright/test';

/**
 * Trail 0 (Codetree 101 — 프로그래밍 시작) UI flow.
 *
 * - trail.html?trail=0 의 첫 육각형이 "출력 입문" 라벨을 가진다.
 * - 첫 육각형을 클릭하면 우측 레슨 패널의 제목과 CTA 가 갱신된다.
 * - CTA 를 누르면 lessons.html?lesson=t0-ch1-1 로 이동한다.
 * - lessons.html 은 개념 탭이 기본 활성, 문제 탭으로 전환하면 기본 1 + 연습 1 항목이 보인다.
 *
 * 로그인이 필요한 제출/채점 흐름은 이 스펙의 범위가 아니므로 다루지 않는다.
 */
test.describe('Trail 0 — 콘텐츠 흐름', () => {
  test('trail.html 의 첫 육각형 라벨이 "출력 입문" 이다', async ({ page }) => {
    await page.goto('/trail.html?trail=0');
    await page.waitForSelector('.chapter-node');
    const firstLabel = page.locator('.chapter-node').first().locator('.chapter-node__label');
    await expect(firstLabel).toHaveText('출력 입문');
  });

  test('첫 육각형을 클릭하면 우측 패널 제목과 CTA 가 "출력 입문" 레슨으로 바뀐다', async ({ page }) => {
    await page.goto('/trail.html?trail=0');
    await page.waitForSelector('.chapter-node');
    await page.locator('.chapter-node').first().click();

    await expect(page.locator('#lesson-title')).toHaveText('출력 입문');
    const cta = page.locator('#lesson-cta');
    await expect(cta).toHaveText('레슨 시작하기 →');
    await expect(cta).toBeEnabled();
  });

  test('CTA 클릭 시 lessons.html?lesson=t0-ch1-1 로 이동한다', async ({ page }) => {
    await page.goto('/trail.html?trail=0');
    await page.waitForSelector('.chapter-node');
    await page.locator('.chapter-node').first().click();
    await page.locator('#lesson-cta').click();
    await expect(page).toHaveURL(/lessons\.html\?lesson=t0-ch1-1$/);
  });

  test('lessons.html 진입 시 레슨 제목이 노출되고 개념 탭이 기본 활성이다', async ({ page }) => {
    await page.goto('/lessons.html?lesson=t0-ch1-1');
    // 표시 데이터는 클라이언트가 들고 있으므로 백엔드가 꺼져 있어도 셸 자체는 그려진다.
    await expect(page.locator('#lesson-name')).toHaveText('출력 입문', { timeout: 10_000 });

    // 개념 탭이 기본 활성, 문제 탭은 비활성
    const conceptTab = page.locator('.lesson-tab[data-tab="concept"]');
    const problemTab = page.locator('.lesson-tab[data-tab="problem"]');
    await expect(conceptTab).toHaveClass(/is-active/);
    await expect(problemTab).not.toHaveClass(/is-active/);

    // 개념 패널이 표시 상태이고 내부에 컨텐츠가 채워져 있다
    await expect(page.locator('#pane-concept')).toBeVisible();
    await expect(page.locator('#pane-concept')).not.toBeEmpty();
  });

  test('문제 탭으로 전환하면 기본 1 + 연습 1 항목이 보인다', async ({ page }) => {
    await page.goto('/lessons.html?lesson=t0-ch1-1');
    await expect(page.locator('#lesson-name')).toHaveText('출력 입문', { timeout: 10_000 });

    await page.locator('.lesson-tab[data-tab="problem"]').click();
    await expect(page.locator('#pane-problem')).toBeVisible();

    const items = page.locator('.lesson-problem-item');
    await expect(items).toHaveCount(2);

    const kinds = page.locator('.lesson-problem-item__kind');
    await expect(kinds.nth(0)).toHaveText('기본');
    await expect(kinds.nth(1)).toHaveText('연습');
  });
});
