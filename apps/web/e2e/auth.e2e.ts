import { test, expect } from '@playwright/test';
import { loginAsUser, mockApiRoute } from './fixtures/auth';

const PENDING_TEMPLATE_KEY = 'flacroncv_pending_template';

test.describe('Auth flows', () => {
  test('login flow redirects to dashboard', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/en/login');

    await page.getByLabel(/email/i).fill('e2e@example.com');
    await page.getByLabel(/password/i).fill('Test1234!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    await expect(page).toHaveURL(/\/en\/dashboard/, { timeout: 10000 });
  });

  test('register flow redirects to verify-email', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/en/register');

    await page.getByLabel(/name/i).fill('New User');
    await page.getByLabel(/email/i).fill('e2e@example.com');
    // Find password field — may have two (password + confirm)
    const passwordFields = page.getByLabel(/password/i);
    await passwordFields.first().fill('Test1234!');
    if ((await passwordFields.count()) > 1) {
      await passwordFields.nth(1).fill('Test1234!');
    }
    await page.getByRole('button', { name: /sign up|register|create account/i }).click();

    await expect(page).toHaveURL(/\/en\/(verify-email|dashboard)/, { timeout: 10000 });
  });

  test('pending template redirect — login sends user to cv/new?template=modern', async ({ page }) => {
    await loginAsUser(page);

    // Set pending template in localStorage before navigating
    await page.goto('/en/login');
    await page.evaluate(
      ([key, value]) => localStorage.setItem(key, value),
      [PENDING_TEMPLATE_KEY, 'modern'],
    );

    await page.getByLabel(/email/i).fill('e2e@example.com');
    await page.getByLabel(/password/i).fill('Test1234!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    await expect(page).toHaveURL(/\/en\/cv\/new\?template=modern/, { timeout: 10000 });
  });

  test('password reset page sends email and shows success', async ({ page }) => {
    await mockApiRoute(page, '/auth/reset-password', { message: 'Password reset email sent' });
    await page.goto('/en/forgot-password');

    await page.getByLabel(/email/i).fill('e2e@example.com');
    await page.getByRole('button', { name: /send|reset/i }).click();

    // Should show a success toast or message
    await expect(
      page.locator('[data-sonner-toast], [role="status"], .toast, [data-testid="success-toast"]').first()
        .or(page.getByText(/sent|check your email/i).first()),
    ).toBeVisible({ timeout: 5000 });
  });

  test('Firebase auth error shows error toast', async ({ page }) => {
    // Override Firebase to return an error
    await page.route('**/identitytoolkit.googleapis.com/**', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { code: 400, message: 'EMAIL_NOT_FOUND', status: 'INVALID_ARGUMENT' },
        }),
      });
    });

    await page.goto('/en/login');
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpass');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    // Should show an error toast
    await expect(
      page
        .locator('[data-sonner-toast][data-type="error"], [role="alert"]')
        .first()
        .or(page.getByText(/invalid|error|not found|wrong/i).first()),
    ).toBeVisible({ timeout: 5000 });
  });
});
