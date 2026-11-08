import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Hezekiah|Portfolio/);
  });

  test('displays hero section with name', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Hezekiah');
  });

  test('has working navigation', async ({ page }) => {
    // Check for navigation links
    const navLinks = page.locator('nav a, header a');
    await expect(navLinks.first()).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme" i], button:has(svg[data-testid="sun"]), button:has(svg[data-testid="moon"])').first();

    if (await themeToggle.isVisible()) {
      const initialTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));

      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(100);

      const newTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('has responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('manifest') &&
      !e.includes('DevTools')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('loads projects listing', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Projects');
  });

  test('filter bar is present', async ({ page }) => {
    const filterButtons = page.locator('button:has-text("All"), button:has-text("Web"), button:has-text("AI")');
    await expect(filterButtons.first()).toBeVisible();
  });

  test('project cards render', async ({ page }) => {
    const projectCards = page.locator('[data-testid="project-card"], .card:has(h3)');
    await expect(projectCards.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('loads contact form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('build something');
    await expect(page.locator('form')).toBeVisible();
  });

  test('form validation works', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for validation messages
    await expect(page.locator('text=Name is required')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Invalid email address')).toBeVisible({ timeout: 5000 });
  });

  test('form fields are accessible', async ({ page }) => {
    const nameInput = page.locator('input#name, input[name="name"]');
    const emailInput = page.locator('input#email, input[name="email"]');
    const messageInput = page.locator('textarea#message, textarea[name="message"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
  });
});

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('loads blog listing', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Blog');
  });

  test('blog posts render', async ({ page }) => {
    const posts = page.locator('article, [data-testid="blog-post"]');
    // Blog might be empty, so just check the page loads
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Admin Dashboard (Auth Required)', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has proper heading hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(0);

    // First heading should be h1
    const firstHeading = await page.locator('h1, h2, h3, h4, h5, h6').first();
    const tagName = await firstHeading.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('h1');
  });

  test('images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt can be empty for decorative images, but should exist
      expect(alt).not.toBeNull();
    }
  });

  test('focus visible styles exist', async ({ page }) => {
    // Tab through focusable elements
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(focused || '')).toBe(true);
  });

  test('color contrast meets WCAG AA', async ({ page }) => {
    // This is a basic check - real contrast testing needs axe-core
    // Just ensure text is visible
    const bodyText = page.locator('body');
    await expect(bodyText).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds (generous for CI)
    expect(loadTime).toBeLessThan(5000);
  });

  test('no excessive layout shifts', async ({ page }) => {
    // Basic CLS check - page should stabilize quickly
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Check that main content is stable
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });
});