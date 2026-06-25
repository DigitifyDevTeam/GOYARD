import { test, expect } from '@playwright/test';

const STATIC_PAGES: { path: string; heading: RegExp | string }[] = [
  { path: '/', heading: /Guivarche|déménagement/i },
  { path: '/solution', heading: /solution|déménagement/i },
  { path: '/demenagement-particulier', heading: /particulier|déménagement/i },
  { path: '/demenagement-entreprise', heading: /entreprise|déménagement/i },
  { path: '/blog', heading: /blog|actualit/i },
  { path: '/faq', heading: /faq|question/i },
  { path: '/contact', heading: /contact/i },
  { path: '/tarif/', heading: /tarif|formule|prix/i },
  { path: '/mentions-legales', heading: /mention|légal/i },
  { path: '/rgpd', heading: /rgpd|donnée|confidentialité/i },
];

test.describe('Production smoke — guivarche-demenagement.fr', () => {
  test('home page loads with hero and primary CTA', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBeLessThan(400);

    await expect(page).toHaveTitle(/Guivarche|déménagement/i);
    await expect(page.getByRole('link', { name: /devis/i }).first()).toBeVisible();

    const criticalErrors = consoleErrors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('third-party') &&
        !e.includes('cookie') &&
        !e.includes('Didomi')
    );
    expect(criticalErrors, `Console errors: ${criticalErrors.join('\n')}`).toEqual([]);
  });

  for (const { path, heading } of STATIC_PAGES) {
    test(`page loads: ${path}`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator('body')).toContainText(heading, { timeout: 15_000 });
    });
  }

  test('header navigation — Accueil and Blog', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^accueil$/i }).first().click();
    await expect(page).toHaveURL(/\/$/);

    await page.getByRole('link', { name: /^blog$/i }).first().click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('sticky devis button reaches quote form entry', async ({ page }) => {
    await page.goto('/');
    const devisLink = page.locator('a[href="/tunnel/devis"], a[href*="tunnel/devis"]').first();
    await expect(devisLink).toBeVisible({ timeout: 10_000 });
    await devisLink.click();
    await expect(page).toHaveURL(/\/tunnel\/devis/);
    await expect(page.locator('body')).toContainText(/coordonn|contact|devis/i);
  });

  test('quote form — protected tunnel route stays on tunnel devis', async ({ page }) => {
    await page.goto('/tunnel/devis');
    await expect(page).toHaveURL(/\/tunnel\/devis/, { timeout: 15_000 });
  });

  test('quote form — tunnel form is present', async ({ page }) => {
    await page.goto('/tunnel/devis');
    await expect(page.locator('input[type="email"], input[name*="email" i]').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('blog article opens from listing', async ({ page }) => {
    await page.goto('/blog');
    const articleLink = page.locator('a[href^="/blog/"]').first();
    await expect(articleLink).toBeVisible({ timeout: 15_000 });
    const href = await articleLink.getAttribute('href');
    expect(href).toMatch(/^\/blog\/.+/);
    await articleLink.click();
    await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  test('404 for unknown route', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-e2e', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toContainText(/404|introuvable|existe pas/i, {
      timeout: 10_000,
    });
  });

  test('API health — client-info endpoint responds', async ({ request }) => {
    const res = await request.post('/api/demenagement/client-info/', {
      data: {
        nom: 'Test E2E',
        prenom: '',
        email: `e2e-${Date.now()}@example.com`,
        phone: '0612345678',
        date_demenagement: '2026-12-15',
        adresse_depart: '1 rue Test, Paris',
        adresse_arrivee: '2 rue Test, Lyon',
      },
      failOnStatusCode: false,
    });
    expect(
      res.status(),
      `client-info returned ${res.status()}: ${await res.text()}`
    ).toBeLessThan(500);
  });

  test('phone and WhatsApp sticky links have valid hrefs', async ({ page }) => {
    await page.goto('/');
    const tel = page.locator('a[href^="tel:"]').first();
    await expect(tel).toBeVisible();
    const telHref = await tel.getAttribute('href');
    expect(telHref).toMatch(/^tel:\+?\d/);

    const wa = page.locator('a[href*="wa.me"]').first();
    await expect(wa).toBeVisible();
    expect(await wa.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\d+/);
  });
});
