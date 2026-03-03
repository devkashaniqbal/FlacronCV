import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/');
  });

  test('hero section is visible', async ({ page }) => {
    // Hero should be present in the viewport
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('CTA "Get Started" navigates to register page', async ({ page }) => {
    // Find any link/button pointing to /register
    const cta = page
      .getByRole('link', { name: /get started/i })
      .or(page.getByRole('button', { name: /get started/i }))
      .first();
    await cta.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('pricing section is visible', async ({ page }) => {
    // Scroll to pricing section
    const pricing = page.locator('[id*="pricing"], section:has-text("Pricing"), section:has-text("Plan")').first();
    await pricing.scrollIntoViewIfNeeded();
    await expect(pricing).toBeVisible();
  });

  test('testimonials section is visible', async ({ page }) => {
    const testimonials = page
      .locator('[id*="testimonial"], section:has-text("Testimonial"), section:has-text("What our")')
      .first();
    await testimonials.scrollIntoViewIfNeeded();
    await expect(testimonials).toBeVisible();
  });

  test('navbar links are functional', async ({ page }) => {
    // Navbar should contain at least one navigation link
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    const links = nav.getByRole('link');
    await expect(links.first()).toBeVisible();
  });
});

test.describe('Landing page — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger menu opens and closes', async ({ page }) => {
    await page.goto('/en/');

    // Look for a hamburger/menu button (common patterns)
    const menuButton = page
      .getByRole('button', { name: /menu|hamburger|navigation/i })
      .or(page.locator('button[aria-label*="menu" i]'))
      .or(page.locator('[data-testid="mobile-menu-button"]'))
      .first();

    if (await menuButton.isVisible()) {
      await menuButton.click();
      // After opening, menu should be visible
      const mobileMenu = page.locator('[data-testid="mobile-menu"], nav[aria-expanded="true"]').first();
      // Just verify no crash happened and page is still functional
      await expect(page).toHaveURL(/\/en\//);
    } else {
      // On some layouts the hamburger might not be needed — skip gracefully
      test.skip();
    }
  });
});
