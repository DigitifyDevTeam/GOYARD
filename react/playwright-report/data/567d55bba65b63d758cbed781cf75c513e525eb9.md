# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Production smoke — guivarche-demenagement.fr >> blog article opens from listing
- Location: e2e\smoke.spec.ts:77:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('a[href^="/blog/"]').first()
    - locator resolved to <a class="hover:opacity-70 transition-opacity" href="/blog/guide-complet-demenagement-reussi">Guide complet pour un déménagement réussi</a>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <p>Nous utilisons des cookies pour améliorer votre e…</p> from <div tabindex="-1" role="region" class="cky-consent-container cky-popup-center" aria-label="Nous respectons votre vie privée.">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="cky-overlay"></div> intercepts pointer events
  - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <p>Nous utilisons des cookies pour améliorer votre e…</p> from <div tabindex="-1" role="region" class="cky-consent-container cky-popup-center" aria-label="Nous respectons votre vie privée.">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="cky-notice-content-wrapper">…</div> from <div tabindex="-1" role="region" class="cky-consent-container cky-popup-center" aria-label="Nous respectons votre vie privée.">…</div> subtree intercepts pointer events
  11 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="cky-overlay"></div> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <p>Nous utilisons des cookies pour améliorer votre e…</p> from <div tabindex="-1" role="region" class="cky-consent-container cky-popup-center" aria-label="Nous respectons votre vie privée.">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="cky-notice-content-wrapper">…</div> from <div tabindex="-1" role="region" class="cky-consent-container cky-popup-center" aria-label="Nous respectons votre vie privée.">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="cky-notice-content-wrapper">…</div> from <div tabindex="-1" role="region" class="cky-consent-container cky-popup-center" aria-label="Nous respectons votre vie privée.">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="cky-overlay"></div> intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <p>Nous utilisons des cookies pour améliorer votre e…</p> from <div tabindex="-1" role="region" class="cky-consent-container cky-popup-center" aria-label="Nous respectons votre vie privée.">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="cky-notice-content-wrapper">…</div> from <div tabindex="-1" role="region" class="cky-consent-container cky-popup-center" aria-label="Nous respectons votre vie privée.">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - region "Nous respectons votre vie privée." [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e6]:
        - heading "Nous respectons votre vie privée." [level=2] [ref=e7]
        - generic [ref=e8]:
          - paragraph [ref=e10]: Nous utilisons des cookies pour améliorer votre expérience de navigation, diffuser des publicités ou des contenus personnalisés et analyser notre trafic. En cliquant sur « Tout accepter », vous consentez à notre utilisation des cookies.
          - generic [ref=e11]:
            - button "Personnaliser" [ref=e12] [cursor=pointer]
            - button "Tout rejeter" [ref=e13] [cursor=pointer]
            - button "Accepter tout" [ref=e14] [cursor=pointer]
      - generic [ref=e17]:
        - text: Powered by
        - link "Visit CookieYes website" [ref=e18] [cursor=pointer]:
          - /url: https://www.cookieyes.com/product/cookie-consent/?ref=cypbcyb&utm_source=cookie-banner&utm_medium=fl-branding
          - img [ref=e19]
  - generic [ref=e32]:
    - generic [ref=e33]:
      - link "Appeler" [ref=e34] [cursor=pointer]:
        - /url: tel:+33 7 46 32 66 78
        - img [ref=e35]
      - link "WhatsApp" [ref=e37] [cursor=pointer]:
        - /url: https://wa.me/33746326678
        - generic [ref=e38]: WA
      - link "Demander un devis" [ref=e39] [cursor=pointer]:
        - /url: /tunnel/mes-coordonnees
        - img [ref=e40]
    - generic [ref=e42]:
      - banner [ref=e43]:
        - generic [ref=e45]:
          - generic [ref=e46]:
            - link "Accueil" [ref=e47] [cursor=pointer]:
              - /url: /
              - img "BrasenPlus" [ref=e48]
            - navigation "Navigation principale" [ref=e49]:
              - link "Accueil" [ref=e50] [cursor=pointer]:
                - /url: /
              - link "Solution" [ref=e51] [cursor=pointer]:
                - /url: /solution
              - link "Déménagement particulier" [ref=e52] [cursor=pointer]:
                - /url: /demenagement-particulier
              - link "Déménagement entreprise" [ref=e53] [cursor=pointer]:
                - /url: /demenagement-entreprise
              - button "Zone ▾" [ref=e55] [cursor=pointer]:
                - text: Zone
                - generic [ref=e56]: ▾
              - link "Blog" [ref=e57] [cursor=pointer]:
                - /url: /blog
              - button "Outils ▾" [ref=e59] [cursor=pointer]:
                - text: Outils
                - generic [ref=e60]: ▾
              - link "FAQ" [ref=e61] [cursor=pointer]:
                - /url: /faq
              - link "Contact" [ref=e62] [cursor=pointer]:
                - /url: /contact
          - generic [ref=e63]:
            - button "Devis en un clic" [ref=e64] [cursor=pointer]
            - link "Appeler le +33 1 89 70 33 24" [ref=e65] [cursor=pointer]:
              - /url: tel:+33 1 89 70 33 24
              - img [ref=e66]
              - generic [ref=e68]: 1 89 70 33 24
      - generic [ref=e72]:
        - generic [ref=e73]: Blog & Actualités
        - heading "Conseils & Astuces pour votre déménagement" [level=1] [ref=e74]:
          - text: Conseils & Astuces
          - generic [ref=e75]: pour votre déménagement
        - paragraph [ref=e76]: Découvrez nos guides complets, astuces pratiques et dernières actualités pour réussir votre déménagement en toute sérénité.
        - generic [ref=e78]:
          - img [ref=e79]
          - textbox "Rechercher un article..." [ref=e82]
      - generic [ref=e87]:
        - button "Tous" [ref=e88] [cursor=pointer]
        - button "Conseils" [ref=e89] [cursor=pointer]
        - button "Astuces" [ref=e90] [cursor=pointer]
        - button "Organisation" [ref=e91] [cursor=pointer]
        - button "Environnement" [ref=e92] [cursor=pointer]
        - button "Famille" [ref=e93] [cursor=pointer]
        - button "Finance" [ref=e94] [cursor=pointer]
        - button "Juridique" [ref=e95] [cursor=pointer]
        - button "Nos Travaux" [ref=e96] [cursor=pointer]
      - main [ref=e97]:
        - generic [ref=e98]:
          - generic [ref=e99]:
            - heading "Articles à la une" [level=2] [ref=e101]
            - generic [ref=e102]: 2 articles
          - generic [ref=e103]:
            - article [ref=e104] [cursor=pointer]:
              - generic [ref=e105]:
                - img "Guide complet pour un déménagement réussi" [ref=e106]
                - generic [ref=e109]: Conseils
              - generic [ref=e110]:
                - heading "Guide complet pour un déménagement réussi" [level=3] [ref=e111]
                - paragraph [ref=e112]: Découvrez nos meilleurs conseils pour organiser votre déménagement de A à Z sans stress. De la préparation à l'installation dans votre nouveau logement.
                - generic [ref=e113]:
                  - generic [ref=e114]:
                    - generic [ref=e115]:
                      - img [ref=e116]
                      - generic [ref=e119]: Sophie Martin
                    - generic [ref=e120]:
                      - img [ref=e121]
                      - generic [ref=e123]: 15 Oct 2025
                    - generic [ref=e124]:
                      - img [ref=e125]
                      - generic [ref=e128]: 5 min
                  - img [ref=e129]
            - article [ref=e131] [cursor=pointer]:
              - generic [ref=e132]:
                - 'img "Déménagement écologique : nos solutions durables" [ref=e133]'
                - generic [ref=e136]: Environnement
              - generic [ref=e137]:
                - 'heading "Déménagement écologique : nos solutions durables" [level=3] [ref=e138]'
                - paragraph [ref=e139]: Adoptez une approche respectueuse de l'environnement pour votre déménagement avec nos cartons recyclables et nos véhicules propres.
                - generic [ref=e140]:
                  - generic [ref=e141]:
                    - generic [ref=e142]:
                      - img [ref=e143]
                      - generic [ref=e146]: Claire Leblanc
                    - generic [ref=e147]:
                      - img [ref=e148]
                      - generic [ref=e150]: 10 Oct 2025
                    - generic [ref=e151]:
                      - img [ref=e152]
                      - generic [ref=e155]: 6 min
                  - img [ref=e156]
        - generic [ref=e158]:
          - generic [ref=e159]:
            - heading "Tous les articles" [level=2] [ref=e161]
            - generic [ref=e162]: 7 articles
          - generic [ref=e163]:
            - article [ref=e164] [cursor=pointer]:
              - generic [ref=e165]:
                - img "Comment emballer vos objets fragiles" [ref=e166]
                - generic [ref=e169]: Astuces
              - generic [ref=e170]:
                - heading "Comment emballer vos objets fragiles" [level=3] [ref=e171]
                - paragraph [ref=e172]: Les techniques professionnelles pour protéger votre vaisselle, vos œuvres d'art et vos objets précieux pendant le transport.
                - generic [ref=e173]:
                  - generic [ref=e174]:
                    - generic [ref=e175]:
                      - img [ref=e176]
                      - generic [ref=e178]: 12 Oct 2025
                    - generic [ref=e179]:
                      - img [ref=e180]
                      - generic [ref=e183]: 4 min de lecture
                  - generic [ref=e184]:
                    - text: Lire
                    - img [ref=e185]
            - article [ref=e187] [cursor=pointer]:
              - generic [ref=e188]:
                - img "Check-list ultime pour votre déménagement" [ref=e189]
                - generic [ref=e192]: Organisation
              - generic [ref=e193]:
                - heading "Check-list ultime pour votre déménagement" [level=3] [ref=e194]
                - paragraph [ref=e195]: Ne rien oublier grâce à notre liste complète des tâches à effectuer avant, pendant et après votre déménagement.
                - generic [ref=e196]:
                  - generic [ref=e197]:
                    - generic [ref=e198]:
                      - img [ref=e199]
                      - generic [ref=e201]: 8 Oct 2025
                    - generic [ref=e202]:
                      - img [ref=e203]
                      - generic [ref=e206]: 7 min de lecture
                  - generic [ref=e207]:
                    - text: Lire
                    - img [ref=e208]
            - article [ref=e210] [cursor=pointer]:
              - generic [ref=e211]:
                - 'img "Déménager avec des enfants : guide pratique" [ref=e212]'
                - generic [ref=e215]: Famille
              - generic [ref=e216]:
                - 'heading "Déménager avec des enfants : guide pratique" [level=3] [ref=e217]'
                - paragraph [ref=e218]: Comment impliquer vos enfants dans le processus et rendre cette transition plus facile pour toute la famille.
                - generic [ref=e219]:
                  - generic [ref=e220]:
                    - generic [ref=e221]:
                      - img [ref=e222]
                      - generic [ref=e224]: 5 Oct 2025
                    - generic [ref=e225]:
                      - img [ref=e226]
                      - generic [ref=e229]: 5 min de lecture
                  - generic [ref=e230]:
                    - text: Lire
                    - img [ref=e231]
            - article [ref=e233] [cursor=pointer]:
              - generic [ref=e234]:
                - img "Les erreurs à éviter lors d'un déménagement" [ref=e235]
                - generic [ref=e238]: Conseils
              - generic [ref=e239]:
                - heading "Les erreurs à éviter lors d'un déménagement" [level=3] [ref=e240]
                - paragraph [ref=e241]: Apprenez des expériences des autres et évitez les pièges les plus courants pour un déménagement sans accroc.
                - generic [ref=e242]:
                  - generic [ref=e243]:
                    - generic [ref=e244]:
                      - img [ref=e245]
                      - generic [ref=e247]: 3 Oct 2025
                    - generic [ref=e248]:
                      - img [ref=e249]
                      - generic [ref=e252]: 6 min de lecture
                  - generic [ref=e253]:
                    - text: Lire
                    - img [ref=e254]
            - article [ref=e256] [cursor=pointer]:
              - generic [ref=e257]:
                - 'img "Budget déménagement : comment faire des économies" [ref=e258]'
                - generic [ref=e261]: Finance
              - generic [ref=e262]:
                - 'heading "Budget déménagement : comment faire des économies" [level=3] [ref=e263]'
                - paragraph [ref=e264]: Nos astuces pour réduire les coûts de votre déménagement sans compromettre la qualité du service.
                - generic [ref=e265]:
                  - generic [ref=e266]:
                    - generic [ref=e267]:
                      - img [ref=e268]
                      - generic [ref=e270]: 1 Oct 2025
                    - generic [ref=e271]:
                      - img [ref=e272]
                      - generic [ref=e275]: 5 min de lecture
                  - generic [ref=e276]:
                    - text: Lire
                    - img [ref=e277]
            - article [ref=e279] [cursor=pointer]:
              - generic [ref=e280]:
                - 'img "Déménagement longue distance : ce qu''il faut savoir" [ref=e281]'
                - generic [ref=e284]: Organisation
              - generic [ref=e285]:
                - 'heading "Déménagement longue distance : ce qu''il faut savoir" [level=3] [ref=e286]'
                - paragraph [ref=e287]: Toutes les informations essentielles pour organiser un déménagement vers une autre région ou un autre pays.
                - generic [ref=e288]:
                  - generic [ref=e289]:
                    - generic [ref=e290]:
                      - img [ref=e291]
                      - generic [ref=e293]: 28 Sep 2025
                    - generic [ref=e294]:
                      - img [ref=e295]
                      - generic [ref=e298]: 8 min de lecture
                  - generic [ref=e299]:
                    - text: Lire
                    - img [ref=e300]
            - article [ref=e302] [cursor=pointer]:
              - generic [ref=e303]:
                - 'img "Assurance déménagement : tout comprendre" [ref=e304]'
                - generic [ref=e307]: Juridique
              - generic [ref=e308]:
                - 'heading "Assurance déménagement : tout comprendre" [level=3] [ref=e309]'
                - paragraph [ref=e310]: Les différentes options d'assurance pour protéger vos biens pendant le transport et éviter les mauvaises surprises.
                - generic [ref=e311]:
                  - generic [ref=e312]:
                    - generic [ref=e313]:
                      - img [ref=e314]
                      - generic [ref=e316]: 25 Sep 2025
                    - generic [ref=e317]:
                      - img [ref=e318]
                      - generic [ref=e321]: 6 min de lecture
                  - generic [ref=e322]:
                    - text: Lire
                    - img [ref=e323]
        - generic [ref=e326]:
          - img [ref=e328]
          - heading "Restez informé de nos derniers articles" [level=2] [ref=e330]
          - paragraph [ref=e331]: Inscrivez-vous à notre newsletter pour recevoir nos meilleurs conseils et astuces directement dans votre boîte mail.
          - generic [ref=e332]:
            - textbox "Votre adresse email" [ref=e333]
            - button "S'abonner" [ref=e334] [cursor=pointer]
          - paragraph [ref=e335]: 🔒 Vos données sont protégées et ne seront jamais partagées.
      - contentinfo [ref=e336]:
        - generic [ref=e338]:
          - generic [ref=e339]:
            - generic [ref=e340]:
              - img "Guivarche Déménagement" [ref=e341]
              - generic [ref=e342]:
                - paragraph [ref=e343]: Contact@guivarche-demenagement.fr
                - paragraph [ref=e344]: +33 7 46 32 66 78
                - paragraph [ref=e345]: +33 1 89 70 33 24
                - paragraph [ref=e346]: 25 Rue de Cîteaux, 75012 Paris, France
            - generic [ref=e347]:
              - heading "Accès Rapide" [level=3] [ref=e348]
              - generic [ref=e349]:
                - link "Accueil" [ref=e350] [cursor=pointer]:
                  - /url: /
                - link "Solution" [ref=e351] [cursor=pointer]:
                  - /url: /solution
                - link "Déménagement entreprise" [ref=e352] [cursor=pointer]:
                  - /url: /demenagement-entreprise
                - link "Déménagement particulier" [ref=e353] [cursor=pointer]:
                  - /url: /demenagement-particulier
                - link "Blog" [ref=e354] [cursor=pointer]:
                  - /url: /blog
                - link "FAQ" [ref=e355] [cursor=pointer]:
                  - /url: /faq
                - link "Tarification" [ref=e356] [cursor=pointer]:
                  - /url: /tarif
                - link "Contact" [ref=e357] [cursor=pointer]:
                  - /url: /contact
            - generic [ref=e358]:
              - heading "Articles Récents" [level=3] [ref=e359]
              - generic [ref=e360]:
                - link "Guide complet pour un déménagement réussi" [ref=e361] [cursor=pointer]:
                  - /url: /blog/guide-complet-demenagement-reussi
                - link "Comment emballer vos objets fragiles" [ref=e362] [cursor=pointer]:
                  - /url: /blog/comment-emballer-objets-fragiles
                - 'link "Déménagement écologique : nos solutions durables" [ref=e363] [cursor=pointer]':
                  - /url: /blog/demenagement-ecologique-solutions-durables
            - generic [ref=e364]:
              - heading "Informations" [level=3] [ref=e365]
              - generic [ref=e366]:
                - link "Mentions Légales" [ref=e367] [cursor=pointer]:
                  - /url: /mentions-legales
                - link "RGPD" [ref=e368] [cursor=pointer]:
                  - /url: /rgpd
                - generic [ref=e369]:
                  - link "Nous Contacter" [ref=e370] [cursor=pointer]:
                    - /url: /contact
                  - generic [ref=e377] [cursor=pointer]:
                    - img [ref=e382]
                    - generic [ref=e393]:
                      - text: Excellent activé Google
                      - img "Vérifié par Google" [ref=e394]:
                        - img [ref=e395]
                    - generic [ref=e398]:
                      - 'img "Rating: 5.0 out of 5" [ref=e399]':
                        - generic [ref=e400]: "5.0"
                        - generic [ref=e401]:
                          - generic [ref=e402]:
                            - img [ref=e404]
                            - img [ref=e408]
                          - generic [ref=e411]:
                            - img [ref=e413]
                            - img [ref=e417]
                          - generic [ref=e420]:
                            - img [ref=e422]
                            - img [ref=e426]
                          - generic [ref=e429]:
                            - img [ref=e431]
                            - img [ref=e435]
                          - generic [ref=e438]:
                            - img [ref=e440]
                            - img [ref=e444]
                      - generic [ref=e447]: 66 avis
                  - link "Voir nos avis Trustpilot" [ref=e448] [cursor=pointer]:
                    - /url: https://www.trustpilot.com/review/guivarchedemenagement.fr
                    - img "Trustpilot - Avis clients" [ref=e449]
          - generic [ref=e451]:
            - generic [ref=e452]:
              - paragraph [ref=e453]: © 2025 Copyright, All Right Reserved, Guivarche Déménagement
              - link "Mentions légales" [ref=e454] [cursor=pointer]:
                - /url: /mentions-legales
              - link "RGPD" [ref=e455] [cursor=pointer]:
                - /url: /rgpd
            - generic [ref=e456]:
              - link "Facebook" [ref=e457] [cursor=pointer]:
                - /url: https://www.facebook.com/profile.php?id=61587408931997
                - img [ref=e458]
              - link "Instagram" [ref=e460] [cursor=pointer]:
                - /url: https://www.instagram.com/guivarche_demenagement/
                - img [ref=e461]
              - link "LinkedIn" [ref=e465] [cursor=pointer]:
                - /url: https://www.linkedin.com/company/guivarche-d%C3%A9m%C3%A9nagement/about/?viewAsMember=true
                - img [ref=e466]
              - link "YouTube" [ref=e468] [cursor=pointer]:
                - /url: https://www.youtube.com/@Guivarchedem
                - img [ref=e469]
              - link "TikTok" [ref=e471] [cursor=pointer]:
                - /url: https://www.tiktok.com/@guivarche_demenagement
                - img [ref=e472]
              - link "Pages Jaunes" [ref=e474] [cursor=pointer]:
                - /url: https://www.pagesjaunes.fr/pros/64768014
                - img [ref=e475]
              - link "Reddit" [ref=e477] [cursor=pointer]:
                - /url: https://www.reddit.com/user/Accurate-Throat6716/
                - img [ref=e478]
              - link "Pinterest" [ref=e480] [cursor=pointer]:
                - /url: https://pin.it/1mMMhJJrZ
                - img [ref=e481]
              - link "Tumblr" [ref=e483] [cursor=pointer]:
                - /url: https://www.tumblr.com/guivarche-demenagement
                - img [ref=e484]
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
  72  |     await expect(page.locator('input[type="email"], input[name*="email" i]').first()).toBeVisible({
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
> 83  |     await articleLink.click();
      |                       ^ Error: locator.click: Test timeout of 60000ms exceeded.
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