import { test, expect } from '@playwright/test';

/**
 * E2E: i18n — Language switching and bilingual content parity
 */

test.describe('Language switching via header', () => {
  test('EN → VI switch on homepage', async ({ page }) => {
    await page.goto('/');
    const viLink = page.locator('header .lang a[hreflang="vi"]');
    await expect(viLink).toBeVisible();
    await viLink.click();
    await expect(page).toHaveURL(/\/vi\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
  });

  test('VI → EN switch on homepage', async ({ page }) => {
    await page.goto('/vi/');
    const enLink = page.locator('header .lang a[hreflang="en"]');
    await expect(enLink).toBeVisible();
    await enLink.click();
    await expect(page).toHaveURL(/^(?!.*\/vi\/).*\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test.describe('Language switching via footer', () => {
  test('Footer EN → VI preserves current page', async ({ page }) => {
    await page.goto('/about/');
    const footerLang = page.locator('footer .lang');
    // Footer links don't have hreflang; click the off-state link (inactive lang)
    const viLink = footerLang.locator('a.off');
    await expect(viLink).toBeVisible();
    await viLink.click();
    await expect(page).toHaveURL(/\/vi\/about\/$/);
  });

  test('Footer VI → EN preserves current page', async ({ page }) => {
    await page.goto('/vi/about/');
    const footerLang = page.locator('footer .lang');
    const enLink = footerLang.locator('a.off');
    await expect(enLink).toBeVisible();
    await enLink.click();
    await expect(page).toHaveURL(/\/about\/$/);
  });
});

test.describe('Bilingual question pages exist', () => {
  const slug = 'must-try-dishes-hoi-an';
  const city = 'hoi-an';

  test(`EN question page exists: /questions/${city}/${slug}/`, async ({ page }) => {
    const res = await page.goto(`/questions/${city}/${slug}/`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test(`VI question page exists: /vi/questions/${city}/${slug}/`, async ({ page }) => {
    const res = await page.goto(`/vi/questions/${city}/${slug}/`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
  });
});

test.describe('Slug parity EN ↔ VI', () => {
  test('hreflang links point to matching slugs', async ({ page }) => {
    await page.goto('/questions/hoi-an/must-try-dishes-hoi-an/');
    const viHref = await page.locator('link[hreflang="vi"]').getAttribute('href');
    expect(viHref).toContain('/vi/questions/hoi-an/must-try-dishes-hoi-an/');
  });
});

test.describe('VI pages do not have /vi prefix in canonical when EN is root', () => {
  test('VI homepage canonical is correct', async ({ page }) => {
    await page.goto('/vi/');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('/vi/');
  });
});
