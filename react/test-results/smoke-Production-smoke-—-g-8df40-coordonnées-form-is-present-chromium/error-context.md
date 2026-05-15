# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Production smoke — guivarche-demenagement.fr >> quote tunnel — coordonnées form is present
- Location: e2e\smoke.spec.ts:70:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="email"], input[name*="email" i]').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('input[type="email"], input[name*="email" i]').first()

```

```yaml
- region "Nous respectons votre vie privée.":
  - heading "Nous respectons votre vie privée." [level=2]
  - paragraph: Nous utilisons des cookies pour améliorer votre expérience de navigation, diffuser des publicités ou des contenus personnalisés et analyser notre trafic. En cliquant sur « Tout accepter », vous consentez à notre utilisation des cookies.
  - button "Personnaliser"
  - button "Tout rejeter"
  - button "Accepter tout"
  - text: Powered by
  - link "Visit CookieYes website":
    - /url: https://www.cookieyes.com/product/cookie-consent/?ref=cypbcyb&utm_source=cookie-banner&utm_medium=fl-branding
    - img
- link "Appeler":
  - /url: tel:+33 7 46 32 66 78
  - img
- link "WhatsApp":
  - /url: https://wa.me/33746326678
  - text: WA
- link "Demander un devis":
  - /url: /tunnel/mes-coordonnees
  - img
- banner:
  - button "Accueil":
    - img "Guivarche Déménagement"
  - paragraph: Déménagement professionnel pour tous
  - link "Appeler au +33 1 89 70 33 24":
    - /url: tel:+33189703324
    - img
    - text: +33 1 89 70 33 24 Numéro non surtaxé
- img "Sophie"
- heading "Sophie" [level=2]
- paragraph: Bonjour ! Je suis Sophie.
- paragraph: En quelques questions, je vais vous trouver le service de déménagement qui vous convient au meilleur prix.
- text: Mon service de déménagement
- img
- textbox "Quelle est votre adresse ?"
- text: Date de déménagement préférée
- img
- textbox "Date de déménagement préférée": 2025-12-25
- paragraph: En soumettant ce formulaire, j'accepte d'être contacté par Guivarche et ses partenaires pour l'organisation de mon service de déménagement.
- button "CONTINUER →"
- heading "Mes étapes" [level=3]
- paragraph: Étape 1 sur 3 - gardez le cap, vous y êtes presque.
- list:
  - listitem:
    - text: "1"
    - paragraph: Étape 1 - Mes informations
    - paragraph: Vos coordonnées
  - listitem:
    - text: "2"
    - paragraph: Étape 2 - Mon déménagement
    - paragraph: Choix de méthode
  - listitem:
    - text: "3"
    - paragraph: Étape 3 - Mes adresses
    - paragraph: Départ et arrivée
- img
- text: +100 000 clients satisfaits depuis 2011
- img
- text: Déménageurs professionnels suivis
- img
- text: Service client 7j/7 de 9h à 18h
- img
- text: Gratuit et sans engagement
- img
- text: RGPD Respecté
- img
- text: Devis instantané
- paragraph: Guivarche est une société française de services de déménagement professionnel fondée en 2018. Nous sommes entièrement agréés, assurés et cautionnés. Notre équipe de déménageurs professionnels certifiés subit des vérifications d'antécédents approfondies et une formation approfondie pour garantir un service de la plus haute qualité. Guivarche s'engage à utiliser des techniques de déménagement modernes et à maintenir les normes les plus élevées de sécurité et de satisfaction client.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const STATIC_PAGES: { path: string; heading: RegExp | string }[] = [
  4   |   { path: '/', heading: /Guivarche|déménagement/i },
  5   |   { path: '/solution', heading: /solution|déménagement/i },
  6   |   { path: '/demenagement-particulier', heading: /particulier|déménagement/i },
  7   |   { path: '/demenagement-entreprise', heading: /entreprise|déménagement/i },
  8   |   { path: '/blog', heading: /blog|actualit/i },
  9   |   { path: '/faq', heading: /faq|question/i },
  10  |   { path: '/contact', heading: /contact/i },
  11  |   { path: '/tarification', heading: /tarif|formule|prix/i },
  12  |   { path: '/mentions-legales', heading: /mention|légal/i },
  13  |   { path: '/rgpd', heading: /rgpd|donnée|confidentialité/i },
  14  | ];
  15  | 
  16  | test.describe('Production smoke — guivarche-demenagement.fr', () => {
  17  |   test('home page loads with hero and primary CTA', async ({ page }) => {
  18  |     const consoleErrors: string[] = [];
  19  |     page.on('console', (msg) => {
  20  |       if (msg.type() === 'error') consoleErrors.push(msg.text());
  21  |     });
  22  | 
  23  |     const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  24  |     expect(response?.status()).toBeLessThan(400);
  25  | 
  26  |     await expect(page).toHaveTitle(/Guivarche|déménagement/i);
  27  |     await expect(page.getByRole('link', { name: /devis/i }).first()).toBeVisible();
  28  | 
  29  |     const criticalErrors = consoleErrors.filter(
  30  |       (e) =>
  31  |         !e.includes('favicon') &&
  32  |         !e.includes('third-party') &&
  33  |         !e.includes('cookie') &&
  34  |         !e.includes('Didomi')
  35  |     );
  36  |     expect(criticalErrors, `Console errors: ${criticalErrors.join('\n')}`).toEqual([]);
  37  |   });
  38  | 
  39  |   for (const { path, heading } of STATIC_PAGES) {
  40  |     test(`page loads: ${path}`, async ({ page }) => {
  41  |       const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  42  |       expect(response?.status()).toBeLessThan(400);
  43  |       await expect(page.locator('body')).toContainText(heading, { timeout: 15_000 });
  44  |     });
  45  |   }
  46  | 
  47  |   test('header navigation — Accueil and Blog', async ({ page }) => {
  48  |     await page.goto('/');
  49  |     await page.getByRole('link', { name: /^accueil$/i }).first().click();
  50  |     await expect(page).toHaveURL(/\/$/);
  51  | 
  52  |     await page.getByRole('link', { name: /^blog$/i }).first().click();
  53  |     await expect(page).toHaveURL(/\/blog/);
  54  |   });
  55  | 
  56  |   test('sticky devis button reaches quote tunnel entry', async ({ page }) => {
  57  |     await page.goto('/');
  58  |     const devisLink = page.locator('a[href="/tunnel/mes-coordonnees"], a[href*="mes-coordonnees"]').first();
  59  |     await expect(devisLink).toBeVisible({ timeout: 10_000 });
  60  |     await devisLink.click();
  61  |     await expect(page).toHaveURL(/\/tunnel\/mes-coordonnees/);
  62  |     await expect(page.locator('body')).toContainText(/coordonn|contact|devis/i);
  63  |   });
  64  | 
  65  |   test('quote tunnel — protected route redirects without session', async ({ page }) => {
  66  |     await page.goto('/tunnel/devis');
  67  |     await expect(page).toHaveURL(/\/tunnel\/mes-coordonnees/, { timeout: 15_000 });
  68  |   });
  69  | 
  70  |   test('quote tunnel — coordonnées form is present', async ({ page }) => {
  71  |     await page.goto('/tunnel/mes-coordonnees');
> 72  |     await expect(page.locator('input[type="email"], input[name*="email" i]').first()).toBeVisible({
      |                                                                                       ^ Error: expect(locator).toBeVisible() failed
  73  |       timeout: 15_000,
  74  |     });
  75  |   });
  76  | 
  77  |   test('blog article opens from listing', async ({ page }) => {
  78  |     await page.goto('/blog');
  79  |     const articleLink = page.locator('a[href^="/blog/"]').first();
  80  |     await expect(articleLink).toBeVisible({ timeout: 15_000 });
  81  |     const href = await articleLink.getAttribute('href');
  82  |     expect(href).toMatch(/^\/blog\/.+/);
  83  |     await articleLink.click();
  84  |     await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  85  |   });
  86  | 
  87  |   test('404 for unknown route', async ({ page }) => {
  88  |     const response = await page.goto('/this-route-does-not-exist-e2e', {
  89  |       waitUntil: 'domcontentloaded',
  90  |     });
  91  |     expect(response?.status()).toBeLessThan(500);
  92  |     await expect(page.locator('body')).toContainText(/404|introuvable|existe pas/i, {
  93  |       timeout: 10_000,
  94  |     });
  95  |   });
  96  | 
  97  |   test('API health — client-info endpoint responds', async ({ request }) => {
  98  |     const res = await request.post('/api/demenagement/client-info/', {
  99  |       data: {
  100 |         prenom: 'E2E',
  101 |         nom: 'Test',
  102 |         email: `e2e-${Date.now()}@example.com`,
  103 |         telephone: '0612345678',
  104 |       },
  105 |       failOnStatusCode: false,
  106 |     });
  107 |     expect(
  108 |       res.status(),
  109 |       `client-info returned ${res.status()}: ${await res.text()}`
  110 |     ).toBeLessThan(500);
  111 |   });
  112 | 
  113 |   test('phone and WhatsApp sticky links have valid hrefs', async ({ page }) => {
  114 |     await page.goto('/');
  115 |     const tel = page.locator('a[href^="tel:"]').first();
  116 |     await expect(tel).toBeVisible();
  117 |     const telHref = await tel.getAttribute('href');
  118 |     expect(telHref).toMatch(/^tel:\+?\d/);
  119 | 
  120 |     const wa = page.locator('a[href*="wa.me"]').first();
  121 |     await expect(wa).toBeVisible();
  122 |     expect(await wa.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\d+/);
  123 |   });
  124 | });
  125 | 
```