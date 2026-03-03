import { test, expect } from '@playwright/test';

const PUBLIC_PAGES = [
  {
    path: '/en/about-us',
    expectedContent: /about|our mission|team|FlacronCV/i,
  },
  {
    path: '/en/contact-us',
    expectedContent: /contact|get in touch|reach out|email/i,
  },
  {
    path: '/en/privacy-policy',
    expectedContent: /privacy|data|information/i,
  },
  {
    path: '/en/terms-of-service',
    expectedContent: /terms|service|agreement|conditions/i,
  },
  {
    path: '/en/testimonials',
    expectedContent: /testimonial|review|customer|user/i,
  },
];

test.describe('Public pages smoke tests', () => {
  for (const { path, expectedContent } of PUBLIC_PAGES) {
    test(`${path} loads without errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      // Page should have expected content
      await expect(page.locator('body')).toContainText(expectedContent, { timeout: 8000 });

      // Filter out known browser noise (extensions, unrelated network errors)
      const significantErrors = consoleErrors.filter(
        (e) =>
          !e.includes('net::ERR_') &&
          !e.includes('favicon') &&
          !e.includes('chrome-extension'),
      );
      expect(significantErrors).toHaveLength(0);
    });
  }

  test('nonexistent page renders custom 404', async ({ page }) => {
    const response = await page.goto('/en/nonexistent-xyz-page-that-does-not-exist');
    // Next.js returns 404 status for not-found pages
    expect(response?.status()).toBe(404);

    // Custom not-found page should render (not a generic browser 404)
    await expect(page.locator('body')).not.toBeEmpty();

    // Should contain some "not found" or "404" content
    await expect(
      page.getByText(/not found|404|page doesn't exist|doesn't exist/i).first(),
    ).toBeVisible({ timeout: 5000 });
  });
});
