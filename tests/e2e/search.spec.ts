import { test, expect } from '@playwright/test';

/**
 * E2E: Search (Pagefind)
 * Validates search page UI and query behavior.
 * Note: Pagefind index is generated at build time via `npm run build`.
 * Pagefind UI renders dynamically into #search.
 */

test.describe('Search page UI', () => {
  test('search container exists in DOM', async ({ page }) => {
    await page.goto('/search/');
    const container = page.locator('#search');
    // Container exists even if hidden before Pagefind hydrates
    await expect(container).toHaveCount(1);
  });

  test('search page has correct title', async ({ page }) => {
    await page.goto('/search/');
    await expect(page).toHaveTitle(/Search/);
  });
});

test.describe('Homepage search shortcut', () => {
  test('hero search input exists and is interactive', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[type="search"]').first();
    await expect(input).toBeVisible();
    await input.fill('budget');
    await input.press('Enter');
    await expect(page).toHaveURL(/\/search\//);
  });
});
