import { test, expect } from '@playwright/test';

/**
 * E2E: AEO / SEO Validation
 * Validates structured data, meta tags, canonicals, hreflang, and Open Graph.
 */

// Helpers
async function getJsonLd(page) {
  return page.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    return Array.from(scripts).map((s) => {
      try { return JSON.parse(s.textContent || '{}'); } catch { return null; }
    }).filter(Boolean);
  });
}

async function getMeta(page, name: string) {
  const meta = page.locator(`meta[name="${name}"], meta[property="${name}"]`);
  return meta.getAttribute('content');
}

test.describe('Homepage SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct meta title and description', async ({ page }) => {
    await expect(page).toHaveTitle(/Pholio/);
    const desc = await getMeta(page, 'description');
    expect(desc).toContain('Vietnam');
  });

  test('has canonical link', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /pholio/);
  });

  test('has Open Graph tags', async ({ page }) => {
    expect(await getMeta(page, 'og:title')).toContain('Pholio');
    expect(await getMeta(page, 'og:description')).toBeTruthy();
    expect(await getMeta(page, 'og:image')).toBeTruthy();
    expect(await getMeta(page, 'og:type')).toBe('website');
    expect(await getMeta(page, 'og:locale')).toBe('en_US');
  });

  test('has Twitter Card tags', async ({ page }) => {
    expect(await getMeta(page, 'twitter:card')).toBe('summary_large_image');
    expect(await getMeta(page, 'twitter:title')).toBeTruthy();
    expect(await getMeta(page, 'twitter:image')).toBeTruthy();
  });

  test('has WebSite JSON-LD schema', async ({ page }) => {
    const jsonLd = await getJsonLd(page);
    const website = jsonLd.find((s) => s['@type'] === 'WebSite');
    expect(website).toBeDefined();
    expect(website.name).toBe('Pholio');
    expect(website.potentialAction?.['@type']).toBe('SearchAction');
  });
});

test.describe('Question Article SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/questions/hoi-an/must-try-dishes-hoi-an/');
  });

  test('has Article JSON-LD schema', async ({ page }) => {
    const jsonLd = await getJsonLd(page);
    const article = jsonLd.find((s) => s['@type'] === 'Article');
    expect(article).toBeDefined();
    expect(article.headline).toBeTruthy();
    expect(article.author?.name).toBeTruthy();
    expect(article.datePublished).toMatch(/^\d{4}/);
  });

  test('has FAQPage JSON-LD schema with ≥3 Q&A', async ({ page }) => {
    const jsonLd = await getJsonLd(page);
    const faq = jsonLd.find((s) => s['@type'] === 'FAQPage');
    expect(faq).toBeDefined();
    expect(faq.mainEntity?.length).toBeGreaterThanOrEqual(3);
    expect(faq.mainEntity[0]['@type']).toBe('Question');
    expect(faq.mainEntity[0].acceptedAnswer?.['@type']).toBe('Answer');
  });

  test('has hreflang alternates', async ({ page }) => {
    const enAlt = page.locator('link[hreflang="en"]');
    const viAlt = page.locator('link[hreflang="vi"]');
    const xDefault = page.locator('link[hreflang="x-default"]');
    await expect(enAlt).toHaveCount(1);
    await expect(viAlt).toHaveCount(1);
    await expect(xDefault).toHaveCount(1);
    await expect(enAlt).toHaveAttribute('href', /\/questions\/hoi-an\/must-try-dishes-hoi-an\/$/);
    await expect(viAlt).toHaveAttribute('href', /\/vi\/questions\/hoi-an\/must-try-dishes-hoi-an\/$/);
  });

  test('has article-specific meta tags', async ({ page }) => {
    expect(await getMeta(page, 'og:type')).toBe('article');
    const pub = await getMeta(page, 'article:published_time');
    if (pub) expect(pub).toMatch(/^\d{4}/);
  });
});

test.describe('VI Homepage SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vi/');
  });

  test('has correct VI Open Graph locale', async ({ page }) => {
    expect(await getMeta(page, 'og:locale')).toBe('vi_VN');
  });

  test('has VI html lang', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
  });
});

test.describe('No index on missing content', () => {
  test('404 page has no JSON-LD Article schema', async ({ page }) => {
    await page.goto('/does-not-exist/');
    const jsonLd = await getJsonLd(page);
    const article = jsonLd.find((s) => s['@type'] === 'Article');
    expect(article).toBeUndefined();
  });
});
