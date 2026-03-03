import { test, expect } from '@playwright/test';
import { mockApiRoute } from './fixtures/auth';

const PENDING_TEMPLATE_KEY = 'flacroncv_pending_template';

const MOCK_TEMPLATES = [
  {
    id: 'modern',
    slug: 'modern',
    name: 'Modern',
    description: 'Clean and modern design',
    category: 'cv',
    tier: 'free',
    thumbnailURL: '',
    isActive: true,
    usageCount: 100,
    rating: 4.5,
  },
  {
    id: 'classic',
    slug: 'classic',
    name: 'Classic',
    description: 'Traditional professional CV',
    category: 'cv',
    tier: 'free',
    thumbnailURL: '',
    isActive: true,
    usageCount: 80,
    rating: 4.2,
  },
];

test.describe('Templates page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoute(page, '/templates', MOCK_TEMPLATES);
    // Also cover templates with query params
    await page.route('**/api/v1/templates**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: MOCK_TEMPLATES,
          timestamp: new Date().toISOString(),
        }),
      });
    });
  });

  test('template cards are visible', async ({ page }) => {
    await page.goto('/en/templates');
    // Should see at least one template card
    await expect(page.getByText('Modern').first()).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('Classic').first()).toBeVisible({ timeout: 5000 });
  });

  test('category filter updates URL params', async ({ page }) => {
    await page.goto('/en/templates');
    await page.waitForLoadState('networkidle');

    // Look for a category filter button/tab
    const categoryFilter = page
      .getByRole('button', { name: /cv|resume/i })
      .or(page.getByRole('tab', { name: /cv|resume/i }))
      .first();

    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      // URL should update with category query
      await expect(page).toHaveURL(/[?&]category=/);
    } else {
      test.skip();
    }
  });

  test('clicking template when unauthenticated redirects to login and stores pending template', async ({
    page,
  }) => {
    await page.goto('/en/templates');
    await page.waitForLoadState('networkidle');

    // Click "Modern" template (any use/select/preview button)
    const templateCard = page.locator('text=Modern').first();
    await templateCard.scrollIntoViewIfNeeded();

    // Try to find a use/select button near the template card
    const useButton = page
      .locator('[data-testid*="use-template"], a[href*="/cv/new"]')
      .first()
      .or(page.getByRole('button', { name: /use|select|try/i }).first());

    if (await useButton.isVisible({ timeout: 3000 })) {
      await useButton.click();
    } else {
      // Click the template card itself
      await templateCard.click();
    }

    // Should redirect to login (unauthenticated)
    await expect(page).toHaveURL(/\/en\/login/, { timeout: 8000 });

    // localStorage should have pending template
    const pendingTemplate = await page.evaluate((key) => localStorage.getItem(key), PENDING_TEMPLATE_KEY);
    expect(pendingTemplate).toBeTruthy();
  });
});
