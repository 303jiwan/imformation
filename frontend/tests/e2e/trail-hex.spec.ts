import { test, expect } from '@playwright/test';

/**
 * Trail page hex selection — clicking a hex shows a colored ring; clicking
 * another hex moves the ring; clicking the same hex again clears it.
 */
test.describe('트레일 육각형 선택', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trail.html?trail=0');
    await page.waitForSelector('.chapter-node');
  });

  test('처음에는 어떤 노드도 is-selected 상태가 아니다', async ({ page }) => {
    const selected = page.locator('.chapter-node.is-selected');
    await expect(selected).toHaveCount(0);
  });

  test('첫 육각형 클릭 시 is-selected 클래스가 붙는다', async ({ page }) => {
    const nodes = page.locator('.chapter-node');
    await nodes.nth(0).click();
    await expect(nodes.nth(0)).toHaveClass(/is-selected/);
  });

  test('다른 육각형을 클릭하면 선택이 옮겨간다', async ({ page }) => {
    const nodes = page.locator('.chapter-node');
    await nodes.nth(0).click();
    await expect(nodes.nth(0)).toHaveClass(/is-selected/);
    await nodes.nth(1).click();
    await expect(nodes.nth(0)).not.toHaveClass(/is-selected/);
    await expect(nodes.nth(1)).toHaveClass(/is-selected/);
    // 정확히 1개만 선택되어 있어야 한다
    await expect(page.locator('.chapter-node.is-selected')).toHaveCount(1);
  });

  test('같은 육각형을 다시 클릭하면 선택이 풀린다', async ({ page }) => {
    const node = page.locator('.chapter-node').nth(2);
    await node.click();
    await expect(node).toHaveClass(/is-selected/);
    await node.click();
    await expect(node).not.toHaveClass(/is-selected/);
  });

  test('선택 시 ring 요소가 visible(opacity > 0) 상태가 된다', async ({ page }) => {
    const node = page.locator('.chapter-node').nth(1);
    const ring = node.locator('.chapter-node__ring');
    // 선택 전: opacity 0
    const before = await ring.evaluate((el) => getComputedStyle(el).opacity);
    expect(before).toBe('0');
    // 선택 후: opacity 1
    await node.click();
    await expect(ring).toHaveCSS('opacity', '1');
  });

  test('ring 의 background-color가 트레일 색(green = rgb(34,197,94))이다', async ({ page }) => {
    const node = page.locator('.chapter-node').nth(1);
    await node.click();
    const ring = node.locator('.chapter-node__ring');
    await expect(ring).toHaveCSS('background-color', 'rgb(34, 197, 94)');
  });
});
