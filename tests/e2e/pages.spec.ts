import { test, expect } from '@playwright/test';

/**
 * E2E: Core Pages Rendering
 * Validates that all major pages render correctly with expected elements.
 */

const enPages = [
  { path: '/', title: 'Real answers from locals about traveling Vietnam.', check: 'hero' },
  { path: '/about/', title: 'About', check: 'content' },
  { path: '/cities/', title: 'Cities', check: 'grid' },
  { path: '/questions/', title: 'All questions', check: 'list' },
  { path: '/search/', title: 'Search', check: 'search' },
  { path: '/ask/', title: 'Ask', check: 'form' },
  { path: '/app/', title: 'App', check: 'content' },
  { path: '/contact/', title: 'Contact', check: 'content' },
  { path: '/contributors/', title: 'Contributors', check: 'content' },
  { path: '/editorial/', title: 'Editorial', check: 'content' },
  { path: '/privacy/', title: 'Privacy', check: 'content' },
  { path: '/terms/', title: 'Terms', check: 'content' },
];

const viPages = [
  { path: '/vi/', title: 'Pholio', check: 'hero' },
  { path: '/vi/about/', title: 'Giới thiệu', check: 'content' },
  { path: '/vi/cities/', title: 'Thành phố', check: 'grid' },
  { path: '/vi/questions/', title: 'Câu hỏi', check: 'list' },
  { path: '/vi/search/', title: 'Tìm kiếm', check: 'search' },
];

// Shared layout assertions
async function assertLayout(page, lang: 'en' | 'vi') {
  // Header exists with logo
  const header = page.locator('header.hdr');
  await expect(header).toBeVisible();
  await expect(header.locator('a.logo')).toContainText('Pholio');

  // Navigation links visible
  const nav = header.locator('nav[aria-label="Primary"]');
  await expect(nav).toBeVisible();

  // Footer exists
  const footer = page.locator('footer.footer');
  await expect(footer).toBeVisible();

  // Language switcher
  const langSwitcher = footer.locator('[role="group"][aria-label="Language switcher"]');
  await expect(langSwitcher).toBeVisible();

  // Main content area
  const main = page.locator('main[data-pagefind-body]');
  await expect(main).toBeVisible();

  // Correct html lang attribute
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
}

// EN pages
for (const p of enPages) {
  test(`EN page renders: ${p.path}`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page).toHaveTitle(new RegExp(p.title, 'i'));
    await assertLayout(page, 'en');
  });
}

// VI pages
for (const p of viPages) {
  test(`VI page renders: ${p.path}`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page).toHaveTitle(new RegExp(p.title, 'i'));
    await assertLayout(page, 'vi');
  });
}

// 404 page
test('404 page renders for unknown route', async ({ page }) => {
  await page.goto('/does-not-exist/');
  await expect(page.locator('main')).toContainText(/404|not found|không tìm thấy/i);
});

// Question article page (if content exists)
test('Question article page renders with AnswerBox', async ({ page }) => {
  await page.goto('/questions/hoi-an/must-try-dishes-hoi-an/');
  await expect(page.locator('main')).toBeVisible();
  // AnswerBox should be present (use first() since multiple .answer elements exist)
  await expect(page.locator('.answer-box').first()).toBeVisible();
});

// City page (if content exists)
test('City page renders with city info', async ({ page }) => {
  await page.goto('/cities/hoi-an/');
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('main')).toContainText(/Hoi An/i);
});
