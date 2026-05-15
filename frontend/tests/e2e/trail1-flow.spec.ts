import { test, expect } from '@playwright/test';

/**
 * Trail 1 (Novice Low — 프로그래밍 기초) flow.
 *
 * 트레일 페이지에서 첫 육각형(기본 출력)을 눌러 우측 패널이 갱신되는지,
 * CTA 가 lessons.html?lesson=t1-ch1-1 로 연결되는지, 그리고 레슨 페이지가
 * 정상적으로 로드되어 문제 탭에 1 basic + 1 practice 가 보이는지 검증한다.
 */
test.describe('Trail 1 흐름', () => {
  test('첫 육각형 라벨이 "기본 출력" 이다', async ({ page }) => {
    await page.goto('/trail.html?trail=1');
    await page.waitForSelector('.chapter-node');
    const firstNode = page.locator('.chapter-node').nth(0);
    await expect(firstNode.locator('.chapter-node__label')).toHaveText('기본 출력');
  });

  test('첫 육각형 클릭 시 우측 lesson 패널과 CTA 가 갱신된다', async ({ page }) => {
    await page.goto('/trail.html?trail=1');
    await page.waitForSelector('.chapter-node');
    await page.locator('.chapter-node').nth(0).click();
    await expect(page.locator('#lesson-title')).toHaveText('기본 출력');
    const cta = page.locator('#lesson-cta');
    await expect(cta).toBeEnabled();
    await expect(cta).toHaveText(/레슨 시작하기/);
  });

  test('CTA 클릭 시 lessons.html?lesson=t1-ch1-1 로 이동한다', async ({ page }) => {
    await page.goto('/trail.html?trail=1');
    await page.waitForSelector('.chapter-node');
    await page.locator('.chapter-node').nth(0).click();
    await page.locator('#lesson-cta').click();
    await page.waitForURL('**/lessons.html?lesson=t1-ch1-1');
    expect(page.url()).toContain('lesson=t1-ch1-1');
  });

  test('lessons.html 의 문제 탭에 1 basic + 1 practice 가 표시된다', async ({ page }) => {
    await page.goto('/lessons.html?lesson=t1-ch1-1');
    // shell 이 보여야 비로소 데이터가 로드된 것
    await page.waitForSelector('#lesson-shell:not([hidden])');
    await expect(page.locator('#lesson-name')).toHaveText('기본 출력');
    // 문제 탭으로 전환
    await page.locator('.lesson-tab[data-tab="problem"]').click();
    await expect(page.locator('#pane-problem')).toBeVisible();
    const items = page.locator('#problem-list .lesson-problem-item');
    await expect(items).toHaveCount(2);
    // 기본/연습 라벨 확인
    await expect(items.nth(0).locator('.lesson-problem-item__kind')).toHaveText('기본');
    await expect(items.nth(1).locator('.lesson-problem-item__kind')).toHaveText('연습');
  });
});
