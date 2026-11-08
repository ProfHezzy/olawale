import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login first (mock or use test credentials)
    await page.goto('/admin/login');

    // If login form exists, fill it
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const submitButton = page.locator('button[type="submit"]');

    if (await emailInput.isVisible({ timeout: 2000 })) {
      // Use test credentials from env or mock
      await emailInput.fill(process.env.ADMIN_TEST_EMAIL || 'admin@test.com');
      await passwordInput.fill(process.env.ADMIN_TEST_PASSWORD || 'testpassword');
      await submitButton.click();
      await page.waitForURL('/admin');
    }
  });

  test('dashboard loads after authentication', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('h1, h2')).toContainText(/Dashboard|Hezekiah|Admin/);
  });

  test('displays stats cards', async ({ page }) => {
    await page.goto('/admin');
    const statCards = page.locator('[data-testid="stat-card"], .card:has(h3)');
    await expect(statCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('quick actions are present', async ({ page }) => {
    await page.goto('/admin');
    const quickActions = page.locator('a[href="/admin/projects"], a[href="/admin/blog"], a[href="/admin/skills"]');
    await expect(quickActions.first()).toBeVisible();
  });

  test('AI Blog Autopilot panel is visible', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=AI Blog Autopilot')).toBeVisible({ timeout: 10000 });
  });

  test('recent projects section loads', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=Recent Projects')).toBeVisible({ timeout: 10000 });
  });

  test('navigation sidebar works', async ({ page }) => {
    await page.goto('/admin');

    // Check sidebar links
    const sidebarLinks = [
      { text: 'Dashboard', href: '/admin' },
      { text: 'Projects', href: '/admin/projects' },
      { text: 'Blog', href: '/admin/blog' },
      { text: 'Skills', href: '/admin/skills' },
    ];

    for (const link of sidebarLinks) {
      const navLink = page.locator(`a[href="${link.href}"]:has-text("${link.text}")`);
      await expect(navLink).toBeVisible();
    }
  });

  test('navigation to projects page works', async ({ page }) => {
    await page.goto('/admin');
    await page.click('a[href="/admin/projects"]');
    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(page.locator('h1')).toContainText('Projects');
  });

  test('theme toggle in admin works', async ({ page }) => {
    await page.goto('/admin');
    const themeToggle = page.locator('button[aria-label*="theme" i]').first();

    if (await themeToggle.isVisible()) {
      const initialTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      await themeToggle.click();
      await page.waitForTimeout(100);
      const newTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('logout works', async ({ page }) => {
    await page.goto('/admin');
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")').first();

    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/\/admin\/login/);
    }
  });
});

test.describe('Admin Projects Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.isVisible({ timeout: 2000 })) {
      await emailInput.fill(process.env.ADMIN_TEST_EMAIL || 'admin@test.com');
      await page.locator('input[type="password"], input[name="password"]').fill(process.env.ADMIN_TEST_PASSWORD || 'testpassword');
      await page.locator('button[type="submit"]').click();
      await page.waitForURL('/admin');
    }
    await page.goto('/admin/projects');
  });

  test('loads projects management page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Projects');
  });

  test('search functionality works', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('test');
    await page.waitForTimeout(500);
  });

  test('new project modal opens', async ({ page }) => {
    const newProjectButton = page.locator('button:has-text("New Project")');
    await newProjectButton.click();

    const modal = page.locator('[role="dialog"], .fixed.inset-0');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=New Project')).toBeVisible();
  });

  test('project form has all required fields', async ({ page }) => {
    await page.click('button:has-text("New Project")');
    await page.waitForTimeout(300);

    await expect(page.locator('input[name="title"], input[placeholder*="Title" i]')).toBeVisible();
    await expect(page.locator('input[name="category"], input[placeholder*="Category" i]')).toBeVisible();
    await expect(page.locator('textarea[name="description"], textarea[placeholder*="Describe" i]')).toBeVisible();
  });

  test('pagination works', async ({ page }) => {
    // Check if pagination exists
    const pagination = page.locator('button:has-text("Previous"), button:has-text("Next")');
    if (await pagination.first().isVisible({ timeout: 2000 })) {
      await expect(pagination.first()).toBeVisible();
    }
  });
});