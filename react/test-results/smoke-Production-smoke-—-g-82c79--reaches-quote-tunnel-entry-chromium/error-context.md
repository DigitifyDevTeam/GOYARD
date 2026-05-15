# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Production smoke — guivarche-demenagement.fr >> sticky devis button reaches quote tunnel entry
- Location: e2e\smoke.spec.ts:56:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('a[href="/tunnel/mes-coordonnees"], a[href*="mes-coordonnees"]').first()
    - locator resolved to <a data-discover="true" aria-label="Demander un devis" href="/tunnel/mes-coordonnees" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1c3957] hover:bg-[#2a4f6b] text-white shadow-lg border border-white/10 transition-colors flex items-center justify-center pointer-events-auto">…</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="cky-overlay"></div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="cky-overlay"></div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    60 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="cky-overlay"></div> intercepts pointer events
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
      - generic [ref=e70]:
        - generic [ref=e72]:
          - img [ref=e74]
          - heading "Guivarche Déménagement L'exigence des grands déménageurs" [level=1] [ref=e79]:
            - generic [ref=e80]: Guivarche Déménagement
            - generic [ref=e81]: L'exigence des grands déménageurs
        - paragraph [ref=e82]: Une structure solide, des équipes 100 % salariées, aucun recours à la sous-traitance et une logistique parfaitement maîtrisée pour un déménagement en toute confiance.
        - generic [ref=e83]:
          - generic [ref=e84]:
            - generic [ref=e86]: ★★★★★
            - generic [ref=e87]: 5/5
            - generic [ref=e88]: 70 avis Google
          - generic [ref=e89]:
            - generic [ref=e90]: ✓
            - generic [ref=e91]: Devis sous 24h
        - generic [ref=e93]:
          - textbox "Adresse de départ" [ref=e97]
          - img [ref=e99]
          - button "obtenir un devis gratuit" [ref=e104] [cursor=pointer]:
            - paragraph [ref=e105]: obtenir un devis gratuit
      - generic [ref=e106]:
        - img
        - generic [ref=e107]:
          - generic [ref=e108]:
            - img [ref=e112]
            - paragraph [ref=e119]: 950 déménagements par année
          - generic [ref=e120]:
            - img "Pages Jaunes - 5 étoiles" [ref=e122]
            - paragraph [ref=e123]: 5 étoiles sur Pages Jaunes
          - generic [ref=e124]:
            - img [ref=e126]
            - paragraph [ref=e129]: 0 Litige 2025-2026
          - generic [ref=e130]:
            - img "Trustpilot" [ref=e133]
            - paragraph [ref=e134]: 4,8 / Excellent sur TrustPilot
      - generic [ref=e135]:
        - heading "Ce que nos clients disent de nous !" [level=2] [ref=e137]
        - generic [ref=e148]:
          - generic [ref=e150]:
            - generic [ref=e151]:
              - generic [ref=e152]:
                - img [ref=e156]
                - generic [ref=e164]: avis
              - generic [ref=e165]:
                - 'img "Rating: 5.0 out of 5" [ref=e166]':
                  - generic [ref=e167]: "5.0"
                  - generic [ref=e168]:
                    - generic [ref=e169]:
                      - img [ref=e171]
                      - img [ref=e175]
                    - generic [ref=e178]:
                      - img [ref=e180]
                      - img [ref=e184]
                    - generic [ref=e187]:
                      - img [ref=e189]
                      - img [ref=e193]
                    - generic [ref=e196]:
                      - img [ref=e198]
                      - img [ref=e202]
                    - generic [ref=e205]:
                      - img [ref=e207]
                      - img [ref=e211]
                - generic [ref=e214]: (66)
            - button "Laissez-nous un avis sur Google" [ref=e216] [cursor=pointer]:
              - generic [ref=e218]: Laissez-nous un avis sur Google
          - generic [ref=e222]:
            - button [ref=e223] [cursor=pointer]
            - region "Carousel" [ref=e224]:
              - generic [ref=e227]:
                - generic [ref=e231]:
                  - generic [ref=e232]:
                    - link "Voir sur Google" [ref=e233] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pjdGVFTjFkbU5DTkhKTVdrdHFOVGs1ZUVoTVNFRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOjcteEN1dmNCNHJMWktqNTk5eEhMSEE%7C%7C
                      - generic [ref=e234]:
                        - img "Aziz SAIDJ" [ref=e238]
                        - img [ref=e243]
                    - generic [ref=e255]:
                      - link "Review by Aziz SAIDJ" [ref=e256] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pjdGVFTjFkbU5DTkhKTVdrdHFOVGs1ZUVoTVNFRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOjcteEN1dmNCNHJMWktqNTk5eEhMSEE%7C%7C
                        - generic [ref=e257]: Aziz SAIDJ
                        - img "Client vérifié" [ref=e258]:
                          - img [ref=e259]
                      - generic [ref=e265]: il y a 1 jour
                  - generic [ref=e267]:
                    - 'img "Rating: 5.0 out of 5" [ref=e268]':
                      - generic [ref=e269]:
                        - generic [ref=e270]:
                          - img [ref=e272]
                          - img [ref=e276]
                        - generic [ref=e279]:
                          - img [ref=e281]
                          - img [ref=e285]
                        - generic [ref=e288]:
                          - img [ref=e290]
                          - img [ref=e294]
                        - generic [ref=e297]:
                          - img [ref=e299]
                          - img [ref=e303]
                        - generic [ref=e306]:
                          - img [ref=e308]
                          - img [ref=e312]
                    - generic [ref=e318]: Équipe professionnelle je recommande Oren mon déménagement Paris 17e Paris 16e c'est bien déroulé je peux que les recommander
                - generic [ref=e322]:
                  - generic [ref=e323]:
                    - link "Voir sur Google" [ref=e324] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tGcmFuTlhTWE5FYlU1WlVscEZXV0V6ZFVWNU5VRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOkFranNXSXNEbU5ZUlpFWWEzdUV5NUE%7C%7C
                      - generic [ref=e325]:
                        - img "Mohamed Lahyany" [ref=e329]
                        - img [ref=e334]
                    - generic [ref=e346]:
                      - link "Review by Mohamed Lahyany" [ref=e347] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tGcmFuTlhTWE5FYlU1WlVscEZXV0V6ZFVWNU5VRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOkFranNXSXNEbU5ZUlpFWWEzdUV5NUE%7C%7C
                        - generic [ref=e348]: Mohamed Lahyany
                        - img "Client vérifié" [ref=e349]:
                          - img [ref=e350]
                      - generic [ref=e356]: il y a 3 jours
                  - generic [ref=e357]:
                    - generic [ref=e358]:
                      - 'img "Rating: 5.0 out of 5" [ref=e359]':
                        - generic [ref=e360]:
                          - generic [ref=e361]:
                            - img [ref=e363]
                            - img [ref=e367]
                          - generic [ref=e370]:
                            - img [ref=e372]
                            - img [ref=e376]
                          - generic [ref=e379]:
                            - img [ref=e381]
                            - img [ref=e385]
                          - generic [ref=e388]:
                            - img [ref=e390]
                            - img [ref=e394]
                          - generic [ref=e397]:
                            - img [ref=e399]
                            - img [ref=e403]
                      - generic [ref=e408]:
                        - generic [ref=e409]: Excellent transfert de société à Paris avec Guivarche Déménagement￼. Équipe professionnelle, rapide et très soigneuse pour notre déménagement de bureaux et le transport du matériel informatique. Respect des délais, excellente organisation et aucune casse. Je recommande fortement cette entreprise de déménagement à Paris pour tout transfert d’entreprise en Île-de-France.
                        - button "Lire la suite" [ref=e410] [cursor=pointer]
                    - generic [ref=e411]:
                      - img "Mohamed Lahyany review image 1 of 2" [ref=e416] [cursor=pointer]
                      - img "Mohamed Lahyany review image 2 of 2" [ref=e421] [cursor=pointer]
                - generic [ref=e425]:
                  - generic [ref=e426]:
                    - link "Voir sur Google" [ref=e427] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tSdGRsRlBRMVJhYVZSMk5sTkVORGRXYm5sUWNGRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOkRtdlFPQ1RaaVR2NlNENDdWbnlQcFE%7C%7C
                      - generic [ref=e428]:
                        - img "veronique boute" [ref=e432]
                        - img [ref=e437]
                    - generic [ref=e449]:
                      - link "Review by veronique boute" [ref=e450] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tSdGRsRlBRMVJhYVZSMk5sTkVORGRXYm5sUWNGRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOkRtdlFPQ1RaaVR2NlNENDdWbnlQcFE%7C%7C
                        - generic [ref=e451]: veronique boute
                        - img "Client vérifié" [ref=e452]:
                          - img [ref=e453]
                      - generic [ref=e459]: il y a 4 jours
                  - generic [ref=e461]:
                    - 'img "Rating: 5.0 out of 5" [ref=e462]':
                      - generic [ref=e463]:
                        - generic [ref=e464]:
                          - img [ref=e466]
                          - img [ref=e470]
                        - generic [ref=e473]:
                          - img [ref=e475]
                          - img [ref=e479]
                        - generic [ref=e482]:
                          - img [ref=e484]
                          - img [ref=e488]
                        - generic [ref=e491]:
                          - img [ref=e493]
                          - img [ref=e497]
                        - generic [ref=e500]:
                          - img [ref=e502]
                          - img [ref=e506]
                    - generic [ref=e512]: Équipe très sympathique et efficace Je recommande vivement
                - generic [ref=e516]:
                  - generic [ref=e517]:
                    - link "Voir sur Google" [ref=e518] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2s1UExYZFVOM2RzVldSamFqTTJNR1ZET1doT2MwRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOk5PLXdUN3dsVWRjajM2MGVDOWhOc0E%7C%7C
                      - generic [ref=e519]:
                        - img "Mehdi KHENFRI" [ref=e523]
                        - img [ref=e528]
                    - generic [ref=e540]:
                      - link "Review by Mehdi KHENFRI" [ref=e541] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2s1UExYZFVOM2RzVldSamFqTTJNR1ZET1doT2MwRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOk5PLXdUN3dsVWRjajM2MGVDOWhOc0E%7C%7C
                        - generic [ref=e542]: Mehdi KHENFRI
                        - img "Client vérifié" [ref=e543]:
                          - img [ref=e544]
                      - generic [ref=e550]: il y a 8 jours
                  - generic [ref=e552]:
                    - 'img "Rating: 5.0 out of 5" [ref=e553]':
                      - generic [ref=e554]:
                        - generic [ref=e555]:
                          - img [ref=e557]
                          - img [ref=e561]
                        - generic [ref=e564]:
                          - img [ref=e566]
                          - img [ref=e570]
                        - generic [ref=e573]:
                          - img [ref=e575]
                          - img [ref=e579]
                        - generic [ref=e582]:
                          - img [ref=e584]
                          - img [ref=e588]
                        - generic [ref=e591]:
                          - img [ref=e593]
                          - img [ref=e597]
                    - generic [ref=e603]: Merci pour tout ! Entreprise respectueuse et très serviable sur Paris. Continuez comme ça
                - generic [ref=e607]:
                  - generic [ref=e608]:
                    - link "Voir sur Google" [ref=e609] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2sxTU0zcG1hMXB5TnpKVllsZzBXa3hwVGtzdFluYxAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOk1MM3pma1pyNzJVYlg0WkxpTkstYnc%7C%7C
                      - generic [ref=e610]:
                        - img "Sav Hayati" [ref=e614]
                        - img [ref=e619]
                    - generic [ref=e631]:
                      - link "Review by Sav Hayati" [ref=e632] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2sxTU0zcG1hMXB5TnpKVllsZzBXa3hwVGtzdFluYxAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOk1MM3pma1pyNzJVYlg0WkxpTkstYnc%7C%7C
                        - generic [ref=e633]: Sav Hayati
                        - img "Client vérifié" [ref=e634]:
                          - img [ref=e635]
                      - generic [ref=e641]: il y a 8 jours
                  - generic [ref=e643]:
                    - 'img "Rating: 5.0 out of 5" [ref=e644]':
                      - generic [ref=e645]:
                        - generic [ref=e646]:
                          - img [ref=e648]
                          - img [ref=e652]
                        - generic [ref=e655]:
                          - img [ref=e657]
                          - img [ref=e661]
                        - generic [ref=e664]:
                          - img [ref=e666]
                          - img [ref=e670]
                        - generic [ref=e673]:
                          - img [ref=e675]
                          - img [ref=e679]
                        - generic [ref=e682]:
                          - img [ref=e684]
                          - img [ref=e688]
                    - generic [ref=e694]: Excellent service ! Très professionnel, efficace, à l’heure, organisé, serviable. Je recommande. Les meilleurs sur Paris
                - generic [ref=e698]:
                  - generic [ref=e699]:
                    - link "Voir sur Google" [ref=e700] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2sxd1JHODRSRmx6WnpoaVIwTkZlSEZRWjFCVVMyYxAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOk1wRG84RFlzZzhiR0NFeHFQZ1BUS2c%7C%7C
                      - img [ref=e709]
                    - generic [ref=e721]:
                      - link "Review by Abdelrrazak Laamouri" [ref=e722] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2sxd1JHODRSRmx6WnpoaVIwTkZlSEZRWjFCVVMyYxAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOk1wRG84RFlzZzhiR0NFeHFQZ1BUS2c%7C%7C
                        - generic [ref=e723]: Abdelrrazak Laamouri
                        - img "Client vérifié" [ref=e724]:
                          - img [ref=e725]
                      - generic [ref=e731]: il y a 13 jours
                  - generic [ref=e733]:
                    - 'img "Rating: 5.0 out of 5" [ref=e734]':
                      - generic [ref=e735]:
                        - generic [ref=e736]:
                          - img [ref=e738]
                          - img [ref=e742]
                        - generic [ref=e745]:
                          - img [ref=e747]
                          - img [ref=e751]
                        - generic [ref=e754]:
                          - img [ref=e756]
                          - img [ref=e760]
                        - generic [ref=e763]:
                          - img [ref=e765]
                          - img [ref=e769]
                        - generic [ref=e772]:
                          - img [ref=e774]
                          - img [ref=e778]
                    - generic [ref=e784]: "Un grand merci à toute l'équipe pour ce déménagement réalisé aujourd'hui. Tout s'est parfaitement déroulé : ils étaient à l'heure, très professionnels et ont pris grand soin de mes meubles. Efficaces et souriants, je recommande les yeux fermés"
                - generic [ref=e788]:
                  - generic [ref=e789]:
                    - link "Voir sur Google" [ref=e790] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2w5c1EyNVFRV3d5YmpKTU1VeFNRekp5Tkd4V1ZtYxAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOl9sQ25QQWwybjJMMUxSQzJyNGxWVmc%7C%7C
                      - img [ref=e799]
                    - generic [ref=e811]:
                      - link "Review by Zakaria" [ref=e812] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2w5c1EyNVFRV3d5YmpKTU1VeFNRekp5Tkd4V1ZtYxAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOl9sQ25QQWwybjJMMUxSQzJyNGxWVmc%7C%7C
                        - generic [ref=e813]: Zakaria
                        - img "Client vérifié" [ref=e814]:
                          - img [ref=e815]
                      - generic [ref=e821]: il y a 21 jours
                  - generic [ref=e823]:
                    - 'img "Rating: 5.0 out of 5" [ref=e824]':
                      - generic [ref=e825]:
                        - generic [ref=e826]:
                          - img [ref=e828]
                          - img [ref=e832]
                        - generic [ref=e835]:
                          - img [ref=e837]
                          - img [ref=e841]
                        - generic [ref=e844]:
                          - img [ref=e846]
                          - img [ref=e850]
                        - generic [ref=e853]:
                          - img [ref=e855]
                          - img [ref=e859]
                        - generic [ref=e862]:
                          - img [ref=e864]
                          - img [ref=e868]
                    - generic [ref=e874]: Merci à guivarche société au top je recommande fortement franchement réalisé ce jour et tout était bien fait merci bcp
                - generic [ref=e878]:
                  - generic [ref=e879]:
                    - link "Voir sur Google" [ref=e880] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tkRk4waGZYekZ1WXkxSmEwbHRUVWhyY0dsNWVFRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOkdFN0hfXzFuYy1Ja0ltTUhrcGl5eEE%7C%7C
                      - img [ref=e889]
                    - generic [ref=e901]:
                      - link "Review by Ilyès Lahcène" [ref=e902] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tkRk4waGZYekZ1WXkxSmEwbHRUVWhyY0dsNWVFRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOkdFN0hfXzFuYy1Ja0ltTUhrcGl5eEE%7C%7C
                        - generic [ref=e903]: Ilyès Lahcène
                        - img "Client vérifié" [ref=e904]:
                          - img [ref=e905]
                      - generic [ref=e911]: il y a 21 jours
                  - generic [ref=e913]:
                    - 'img "Rating: 5.0 out of 5" [ref=e914]':
                      - generic [ref=e915]:
                        - generic [ref=e916]:
                          - img [ref=e918]
                          - img [ref=e922]
                        - generic [ref=e925]:
                          - img [ref=e927]
                          - img [ref=e931]
                        - generic [ref=e934]:
                          - img [ref=e936]
                          - img [ref=e940]
                        - generic [ref=e943]:
                          - img [ref=e945]
                          - img [ref=e949]
                        - generic [ref=e952]:
                          - img [ref=e954]
                          - img [ref=e958]
                    - generic [ref=e964]: Excellent experience je conseille fortement. Professionnel et aimable
                - generic [ref=e968]:
                  - generic [ref=e969]:
                    - link "Voir sur Google" [ref=e970] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tKTWJsRm1Xbm8xY2t0WmFETm1XVU5XZUUxbk5IYxAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOkJMblFmWno1cktZaDNmWUNWeE1nNHc%7C%7C
                      - img [ref=e979]
                    - generic [ref=e991]:
                      - link "Review by khalifa sl" [ref=e992] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2tKTWJsRm1Xbm8xY2t0WmFETm1XVU5XZUUxbk5IYxAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOkJMblFmWno1cktZaDNmWUNWeE1nNHc%7C%7C
                        - generic [ref=e993]: khalifa sl
                        - img "Client vérifié" [ref=e994]:
                          - img [ref=e995]
                      - generic [ref=e1001]: il y a 21 jours
                  - generic [ref=e1003]:
                    - 'img "Rating: 5.0 out of 5" [ref=e1004]':
                      - generic [ref=e1005]:
                        - generic [ref=e1006]:
                          - img [ref=e1008]
                          - img [ref=e1012]
                        - generic [ref=e1015]:
                          - img [ref=e1017]
                          - img [ref=e1021]
                        - generic [ref=e1024]:
                          - img [ref=e1026]
                          - img [ref=e1030]
                        - generic [ref=e1033]:
                          - img [ref=e1035]
                          - img [ref=e1039]
                        - generic [ref=e1042]:
                          - img [ref=e1044]
                          - img [ref=e1048]
                    - generic [ref=e1054]: Merci beaucoup a l'équipe de Yani pour leur professionnalisme. Équipe serviable et très gentil. Tarif pas les moins chère mais au moins ils sont bien équipé et pas de surcharge ça se sent ds leur équipes
                - generic [ref=e1058]:
                  - generic [ref=e1059]:
                    - link "Voir sur Google" [ref=e1060] [cursor=pointer]:
                      - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25jMFR6RmZNRTVDYldaaE1YSXpha050TW1GV1FWRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOnc0TzFfME5CbWZhMXIzakNtMmFWQVE%7C%7C
                      - img [ref=e1069]
                    - generic [ref=e1081]:
                      - link "Review by Rdw Akn" [ref=e1082] [cursor=pointer]:
                        - /url: https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT25jMFR6RmZNRTVDYldaaE1YSXpha050TW1GV1FWRRAB!2m1!1s0x0:0x63b9ebabad39d74!3m1!1s2@1:CAIQACodChtycF9oOnc0TzFfME5CbWZhMXIzakNtMmFWQVE%7C%7C
                        - generic [ref=e1083]: Rdw Akn
                        - img "Client vérifié" [ref=e1084]:
                          - img [ref=e1085]
                      - generic [ref=e1091]: il y a 21 jours
                  - generic [ref=e1093]:
                    - 'img "Rating: 5.0 out of 5" [ref=e1094]':
                      - generic [ref=e1095]:
                        - generic [ref=e1096]:
                          - img [ref=e1098]
                          - img [ref=e1102]
                        - generic [ref=e1105]:
                          - img [ref=e1107]
                          - img [ref=e1111]
                        - generic [ref=e1114]:
                          - img [ref=e1116]
                          - img [ref=e1120]
                        - generic [ref=e1123]:
                          - img [ref=e1125]
                          - img [ref=e1129]
                        - generic [ref=e1132]:
                          - img [ref=e1134]
                          - img [ref=e1138]
                    - generic [ref=e1144]: Déménagement super , équipé au top, commercial et personnel sympa déménagement de Paris 12 à Cannes tout est protégé promesse tenue
            - button "Next" [ref=e1391] [cursor=pointer]:
              - img [ref=e1395]
      - generic [ref=e1488]:
        - generic [ref=e1489]:
          - heading "Comment ça marche ?" [level=2] [ref=e1490]
          - generic [ref=e1491]:
            - generic [ref=e1492]:
              - generic [ref=e1493]: "1"
              - paragraph [ref=e1494]: "Remplissez le formulaire: Indiquez les informations de votre déménagement."
            - generic [ref=e1495]:
              - generic [ref=e1496]: "2"
              - paragraph [ref=e1497]: "Recevez votre estimation : Nous vous envoyons un tarif clair et personnalisé."
            - generic [ref=e1498]:
              - generic [ref=e1499]: "3"
              - paragraph [ref=e1500]: "Réservez votre déménagement : Validez simplement votre date au prix annoncé."
        - generic [ref=e1501]:
          - button "Lire / arrêter la vidéo" [ref=e1505] [cursor=pointer]:
            - generic [ref=e1506]: Lire / arrêter la vidéo
          - button "Lire la vidéo" [ref=e1510] [cursor=pointer]:
            - img [ref=e1511]
          - button "Lire la vidéo" [ref=e1515] [cursor=pointer]:
            - img [ref=e1516]
      - generic [ref=e1519]:
        - generic [ref=e1520]:
          - paragraph [ref=e1521]: Services
          - heading "Nos services de déménagement" [level=2] [ref=e1522]
          - paragraph [ref=e1523]: Des solutions claires et adaptées pour chaque étape de votre déménagement, que vous soyez un particulier ou une entreprise.
        - generic [ref=e1524]:
          - generic [ref=e1525]:
            - img "Déménagement particulier" [ref=e1527]
            - generic [ref=e1529]:
              - heading "Déménagement particulier" [level=3] [ref=e1530]
              - paragraph [ref=e1531]: Accompagnement complet pour les déménagements d'appartements et de maisons, du studio à la grande villa.
            - link "Commencer" [ref=e1533] [cursor=pointer]:
              - /url: /tunnel/mes-coordonnees
              - text: Commencer
              - img [ref=e1534]
          - generic [ref=e1536]:
            - img "Déménagement d’entreprise" [ref=e1538]
            - generic [ref=e1540]:
              - heading "Déménagement d’entreprise" [level=3] [ref=e1541]
              - paragraph [ref=e1542]: Transfert de bureaux, de postes de travail et d’archives avec une organisation millimétrée.
            - link "Commencer" [ref=e1544] [cursor=pointer]:
              - /url: /tunnel/mes-coordonnees
              - text: Commencer
              - img [ref=e1545]
          - generic [ref=e1547]:
            - img "Déménagement longue distance" [ref=e1549]
            - generic [ref=e1551]:
              - heading "Déménagement longue distance" [level=3] [ref=e1552]
              - paragraph [ref=e1553]: Solutions optimisées pour vos déménagements partout en France et en Europe.
            - link "Commencer" [ref=e1555] [cursor=pointer]:
              - /url: /tunnel/mes-coordonnees
              - text: Commencer
              - img [ref=e1556]
          - generic [ref=e1558]:
            - img "Garde-meubles" [ref=e1560]
            - generic [ref=e1562]:
              - heading "Garde-meubles" [level=3] [ref=e1563]
              - paragraph [ref=e1564]: Stockage sécurisé de vos biens en box individuels, pour quelques jours ou plusieurs mois.
            - link "Commencer" [ref=e1566] [cursor=pointer]:
              - /url: /tunnel/mes-coordonnees
              - text: Commencer
              - img [ref=e1567]
          - generic [ref=e1569]:
            - img "Déménagement groupé" [ref=e1571]
            - generic [ref=e1573]:
              - heading "Déménagement groupé" [level=3] [ref=e1574]
              - paragraph [ref=e1575]: Réduisez vos coûts en partageant le même camion avec d’autres clients sur des trajets similaires.
            - link "Commencer" [ref=e1577] [cursor=pointer]:
              - /url: /tunnel/mes-coordonnees
              - text: Commencer
              - img [ref=e1578]
      - generic [ref=e1582]:
        - heading "Prêt à déménager en toute sérénité ?" [level=2] [ref=e1583]
        - paragraph [ref=e1584]: Rejoignez des milliers de clients qui ont déjà fait confiance à Guivarche. Obtenez votre devis gratuit maintenant !
        - generic [ref=e1585]:
          - button "Obtenir un devis gratuit" [ref=e1586] [cursor=pointer]
          - link "Nous contacter" [ref=e1587] [cursor=pointer]:
            - /url: /contact
      - generic [ref=e1589]:
        - generic [ref=e1590]:
          - heading "Tarification" [level=2] [ref=e1591]
          - paragraph [ref=e1592]: "Des solutions sur-mesure pour un déménagement réussi : choisissez la formule qui vous convient."
        - generic [ref=e1593]:
          - generic [ref=e1595]:
            - img [ref=e1598]
            - heading "Économique" [level=3] [ref=e1601]
            - paragraph [ref=e1602]: L'essentiel, maîtrisé.
            - list [ref=e1603]:
              - listitem [ref=e1604]:
                - img [ref=e1606]
                - generic [ref=e1608]: Chargement - Transport - Livraison, Mise en place du Mobilier
              - listitem [ref=e1609]:
                - img [ref=e1611]
                - generic [ref=e1613]: Protection du mobilier sous couvertures
              - listitem [ref=e1614]:
                - img [ref=e1616]
                - generic [ref=e1618]: Protection de la literie sous housses
              - listitem [ref=e1619]:
                - img [ref=e1621]
                - generic [ref=e1623]: Protection de la HI-FI et de l'électronique
              - listitem [ref=e1624]:
                - img [ref=e1626]
                - generic [ref=e1628]: Emballage des vêtements sur cintres en penderies
              - listitem [ref=e1629]:
                - img [ref=e1631]
                - generic [ref=e1633]: Débranchement et branchement de l'électroménager
              - listitem [ref=e1634]:
                - img [ref=e1636]
                - generic [ref=e1638]: Protection des éléments fragiles
            - button "Choisir" [ref=e1639] [cursor=pointer]
          - generic [ref=e1640]:
            - generic [ref=e1642]: Le plus choisi
            - generic [ref=e1643]:
              - img [ref=e1646]
              - heading "Standard" [level=3] [ref=e1650]
              - paragraph [ref=e1651]: Le choix de la sérénité.
              - list [ref=e1652]:
                - listitem [ref=e1653]:
                  - img [ref=e1655]
                  - generic [ref=e1657]: Formule Économique +
                - listitem [ref=e1658]:
                  - img [ref=e1660]
                  - generic [ref=e1662]: Démontage et remontage du mobilier non fixé au mur
              - button "Choisir" [ref=e1663] [cursor=pointer]
          - generic [ref=e1665]:
            - img [ref=e1668]
            - heading "Luxe" [level=3] [ref=e1670]
            - paragraph [ref=e1671]: L'excellence absolue.
            - list [ref=e1672]:
              - listitem [ref=e1673]:
                - img [ref=e1675]
                - generic [ref=e1677]: Formule Standard +
              - listitem [ref=e1678]:
                - img [ref=e1680]
                - generic [ref=e1682]: Emballage et déballage des objets fragiles
              - listitem [ref=e1683]:
                - img [ref=e1685]
                - generic [ref=e1687]: Emballage de la vaisselle fragile
              - listitem [ref=e1688]:
                - img [ref=e1690]
                - generic [ref=e1692]: Décrochage mural (hors électricité et vissé)
              - listitem [ref=e1693]:
                - img [ref=e1695]
                - generic [ref=e1697]: Emballage des objets non fragiles
              - listitem [ref=e1698]:
                - img [ref=e1700]
                - generic [ref=e1702]: Emballage des vêtements non sur cintres
              - listitem [ref=e1703]:
                - img [ref=e1705]
                - generic [ref=e1707]: Déballage des cartons
            - button "Choisir" [ref=e1708] [cursor=pointer]
      - generic [ref=e1709]:
        - img [ref=e1714]
        - generic [ref=e1720]:
          - generic [ref=e1721]:
            - generic [ref=e1722]:
              - img [ref=e1726]
              - heading "Saisie manuelle organisée" [level=3] [ref=e1731]
            - paragraph [ref=e1732]: Choisissez vos objets depuis une liste organisée (meubles, électroménagers, cartons, etc.)
          - generic [ref=e1733]:
            - generic [ref=e1734]:
              - img [ref=e1736]
              - heading "Scan intelligent par IA" [level=3] [ref=e1744]
            - paragraph [ref=e1745]: Prenez une photo, l'IA détecte vos objets et calcule en temps réel.
          - generic [ref=e1746]:
            - generic [ref=e1747]:
              - img [ref=e1749]
              - heading "Estimation par surface" [level=3] [ref=e1752]
            - paragraph [ref=e1753]: Renseignez vos m² et obtenez une estimation rapide du volume.
        - heading "Déclarez vos affaires en toute simplicité, rapidité et précision" [level=2] [ref=e1754]
        - paragraph [ref=e1755]: 3 méthodes simples pour estimer votre déménagement.
      - img [ref=e1757]
      - generic [ref=e1761]:
        - generic [ref=e1764]:
          - img "FedEx" [ref=e1766]
          - img "Sorbonne" [ref=e1768]
          - img "Sephora" [ref=e1770]
          - img "Dior" [ref=e1772]
          - img "Ixina" [ref=e1774]
          - img "BWT Alpine F1 Team" [ref=e1776]
          - img "Longchamp" [ref=e1778]
          - img "Pinsent Masons" [ref=e1780]
          - img "Espot" [ref=e1782]
          - img "Polène" [ref=e1784]
          - img "Le Tanneur" [ref=e1786]
          - img "Givenchy" [ref=e1788]
          - img "Le Meurice" [ref=e1790]
          - img "Gallery Dept" [ref=e1792]
          - img "Hilton" [ref=e1794]
          - img "FedEx" [ref=e1796]
          - img "Sorbonne" [ref=e1798]
          - img "Sephora" [ref=e1800]
          - img "Dior" [ref=e1802]
          - img "Ixina" [ref=e1804]
          - img "BWT Alpine F1 Team" [ref=e1806]
          - img "Longchamp" [ref=e1808]
          - img "Pinsent Masons" [ref=e1810]
          - img "Espot" [ref=e1812]
          - img "Polène" [ref=e1814]
          - img "Le Tanneur" [ref=e1816]
          - img "Givenchy" [ref=e1818]
          - img "Le Meurice" [ref=e1820]
          - img "Gallery Dept" [ref=e1822]
          - img "Hilton" [ref=e1824]
        - generic:
          - heading "Les sociétés qui nous ont fait confiance" [level=2]
        - generic:
          - generic:
            - img
      - generic [ref=e1825]:
        - generic [ref=e1826]:
          - img [ref=e1830]
          - img [ref=e1838]
          - paragraph [ref=e1844]: L'info fraîche, claire et rapide
          - img [ref=e1847]
          - heading "Nos actualités" [level=2] [ref=e1850]
          - generic [ref=e1851]:
            - generic [ref=e1852]:
              - link "Guide complet pour un déménagement réussi" [ref=e1853] [cursor=pointer]:
                - /url: /blog/guide-complet-demenagement-reussi
              - generic [ref=e1856]:
                - generic [ref=e1857]:
                  - generic [ref=e1858]:
                    - paragraph [ref=e1859]: 15 Oct 2025
                    - img [ref=e1863]
                  - generic [ref=e1866]:
                    - paragraph [ref=e1867]: 5 min
                    - img [ref=e1871]
                - heading "Guide complet pour un déménagement réussi" [level=3] [ref=e1874]
                - paragraph [ref=e1875]: Découvrez nos meilleurs conseils pour organiser votre déménagement de A à Z sans stress. De la préparation à l'installation dans votre nouveau logement.
                - paragraph [ref=e1878]: Conseils
                - link "Lire l'article" [ref=e1879] [cursor=pointer]:
                  - /url: /blog/guide-complet-demenagement-reussi
                  - img [ref=e1884]
            - link "12 Oct 2025 4 min Comment emballer vos obje... Les techniques professionnelles pour protéger votre vaisselle, vos œuvres d'art et vos objets précieux pendant le transport. Astuces" [ref=e1887] [cursor=pointer]:
              - /url: /blog/comment-emballer-objets-fragiles
              - generic [ref=e1890]:
                - generic [ref=e1891]:
                  - generic [ref=e1892]:
                    - paragraph [ref=e1893]: 12 Oct 2025
                    - img [ref=e1897]
                  - generic [ref=e1900]:
                    - paragraph [ref=e1901]: 4 min
                    - img [ref=e1905]
                - paragraph [ref=e1908]: Comment emballer vos obje...
                - generic [ref=e1909]:
                  - paragraph [ref=e1910]: Les techniques professionnelles pour protéger votre vaisselle, vos œuvres d'art et vos objets précieux pendant le transport.
                  - paragraph [ref=e1913]: Astuces
            - link "28 Sep 2025 8 min Déménagement longue dista... Toutes les informations essentielles pour organiser un déménagement vers une autre région ou un autre pays. Organisation" [ref=e1914] [cursor=pointer]:
              - /url: /blog/demenagement-longue-distance
              - generic [ref=e1917]:
                - generic [ref=e1918]:
                  - generic [ref=e1919]:
                    - paragraph [ref=e1920]: 28 Sep 2025
                    - img [ref=e1924]
                  - generic [ref=e1927]:
                    - paragraph [ref=e1928]: 8 min
                    - img [ref=e1932]
                - paragraph [ref=e1935]: Déménagement longue dista...
                - generic [ref=e1936]:
                  - paragraph [ref=e1937]: Toutes les informations essentielles pour organiser un déménagement vers une autre région ou un autre pays.
                  - paragraph [ref=e1940]: Organisation
        - generic [ref=e1941]:
          - link "Voir tous les articles" [ref=e1942] [cursor=pointer]:
            - /url: /blog
          - img [ref=e1948]
      - generic [ref=e1952]:
        - generic [ref=e1953]:
          - heading "Notre Gallerie" [level=2] [ref=e1954]
          - paragraph [ref=e1955]: "Découvrez nos missions en images : déménagements résidentiels, corporate et logistique. Glissez pour explorer, cliquez pour agrandir."
        - generic [ref=e1956]:
          - button "Voir les images suivantes" [ref=e1957] [cursor=pointer]:
            - img [ref=e1958]
          - generic [ref=e1961]:
            - button "Voir Livraison & manutention" [ref=e1962] [cursor=pointer]:
              - img "Livraison & manutention" [ref=e1963]
              - generic [ref=e1964]:
                - heading "Livraison & manutention" [level=3] [ref=e1965]
                - paragraph [ref=e1966]: Acheminement des cartons et des équipements sur site.
            - button "Voir Emballage sur place" [ref=e1967] [cursor=pointer]:
              - img "Emballage sur place" [ref=e1968]
              - generic [ref=e1969]:
                - heading "Emballage sur place" [level=3] [ref=e1970]
                - paragraph [ref=e1971]: Protection et conditionnement des biens avant transport.
            - button "Voir Objets précieux" [ref=e1972] [cursor=pointer]:
              - img "Objets précieux" [ref=e1973]
              - generic [ref=e1974]:
                - heading "Objets précieux" [level=3] [ref=e1975]
                - paragraph [ref=e1976]: Manutention soignée pour pièces fragiles et de valeur.
            - button "Voir Déménagement corporate" [ref=e1977] [cursor=pointer]:
              - img "Déménagement corporate" [ref=e1978]
              - generic [ref=e1979]:
                - heading "Déménagement corporate" [level=3] [ref=e1980]
                - paragraph [ref=e1981]: Interventions en environnement professionnel et événements.
            - button "Voir Manutention lourde" [ref=e1982] [cursor=pointer]:
              - img "Manutention lourde" [ref=e1983]
              - generic [ref=e1984]:
                - heading "Manutention lourde" [level=3] [ref=e1985]
                - paragraph [ref=e1986]: Déplacement sécurisé de mobilier volumineux.
            - button "Voir Mobilier protégé" [ref=e1987] [cursor=pointer]:
              - img "Mobilier protégé" [ref=e1988]
              - generic [ref=e1989]:
                - heading "Mobilier protégé" [level=3] [ref=e1990]
                - paragraph [ref=e1991]: Meubles emballés et prêts pour le transport.
        - generic [ref=e1992]:
          - button "Page 1" [ref=e1993] [cursor=pointer]
          - button "Page 2" [ref=e1994] [cursor=pointer]
          - button "Page 3" [ref=e1995] [cursor=pointer]
          - button "Page 4" [ref=e1996] [cursor=pointer]
          - button "Page 5" [ref=e1997] [cursor=pointer]
          - button "Page 6" [ref=e1998] [cursor=pointer]
          - button "Page 7" [ref=e1999] [cursor=pointer]
      - generic [ref=e2002]:
        - generic [ref=e2003]:
          - generic [ref=e2004]:
            - generic [ref=e2007]: Offres limitées
            - heading "Vente Flash" [level=2] [ref=e2008]
            - paragraph [ref=e2009]: Profitez de nos offres exceptionnelles sur des déménagements à prix réduit.
          - generic [ref=e2010]:
            - button "Précédent" [ref=e2011] [cursor=pointer]:
              - img [ref=e2012]
            - button "Suivant" [ref=e2014] [cursor=pointer]:
              - img [ref=e2015]
        - generic [ref=e2018]:
          - generic [ref=e2019]:
            - generic [ref=e2021]: "-41%"
            - generic [ref=e2022]:
              - generic [ref=e2028]:
                - generic [ref=e2029]:
                  - paragraph [ref=e2030]: Départ
                  - paragraph [ref=e2031]: Paris
                - generic [ref=e2032]:
                  - paragraph [ref=e2033]: Arrivée
                  - paragraph [ref=e2034]: Lyon
              - paragraph [ref=e2036]: Studio 25m² — Déménagement express avec 2 déménageurs, véhicule 12m³ inclus.
              - generic [ref=e2037]:
                - generic [ref=e2038]:
                  - generic [ref=e2039]: 349€
                  - generic [ref=e2040]: 589€
                - button "Réserver" [ref=e2041] [cursor=pointer]
          - generic [ref=e2042]:
            - generic [ref=e2044]: "-39%"
            - generic [ref=e2045]:
              - generic [ref=e2051]:
                - generic [ref=e2052]:
                  - paragraph [ref=e2053]: Départ
                  - paragraph [ref=e2054]: Marseille
                - generic [ref=e2055]:
                  - paragraph [ref=e2056]: Arrivée
                  - paragraph [ref=e2057]: Paris
              - paragraph [ref=e2059]: "T2 45m² — Formule complète : emballage, transport et installation."
              - generic [ref=e2060]:
                - generic [ref=e2061]:
                  - generic [ref=e2062]: 499€
                  - generic [ref=e2063]: 820€
                - button "Réserver" [ref=e2064] [cursor=pointer]
          - generic [ref=e2065]:
            - generic [ref=e2067]: "-41%"
            - generic [ref=e2068]:
              - generic [ref=e2074]:
                - generic [ref=e2075]:
                  - paragraph [ref=e2076]: Départ
                  - paragraph [ref=e2077]: Paris
                - generic [ref=e2078]:
                  - paragraph [ref=e2079]: Arrivée
                  - paragraph [ref=e2080]: Barcelona
              - paragraph [ref=e2082]: T3 65m² — Déménagement France–Espagne, équipe de 3, camion 20m³.
              - generic [ref=e2083]:
                - generic [ref=e2084]:
                  - generic [ref=e2085]: 679€
                  - generic [ref=e2086]: 1150€
                - button "Réserver" [ref=e2087] [cursor=pointer]
          - generic [ref=e2088]:
            - generic [ref=e2090]: "-39%"
            - generic [ref=e2091]:
              - generic [ref=e2097]:
                - generic [ref=e2098]:
                  - paragraph [ref=e2099]: Départ
                  - paragraph [ref=e2100]: Madrid
                - generic [ref=e2101]:
                  - paragraph [ref=e2102]: Arrivée
                  - paragraph [ref=e2103]: Paris
              - paragraph [ref=e2105]: Studio 30m² — Déménagement international France–Espagne, formalités incluses.
              - generic [ref=e2106]:
                - generic [ref=e2107]:
                  - generic [ref=e2108]: 599€
                  - generic [ref=e2109]: 980€
                - button "Réserver" [ref=e2110] [cursor=pointer]
          - generic [ref=e2111]:
            - generic [ref=e2113]: "-40%"
            - generic [ref=e2114]:
              - generic [ref=e2120]:
                - generic [ref=e2121]:
                  - paragraph [ref=e2122]: Départ
                  - paragraph [ref=e2123]: Paris
                - generic [ref=e2124]:
                  - paragraph [ref=e2125]: Arrivée
                  - paragraph [ref=e2126]: Toulouse
              - paragraph [ref=e2128]: T2 50m² — Transport soigné avec assurance tous risques incluse.
              - generic [ref=e2129]:
                - generic [ref=e2130]:
                  - generic [ref=e2131]: 389€
                  - generic [ref=e2132]: 650€
                - button "Réserver" [ref=e2133] [cursor=pointer]
          - generic [ref=e2134]:
            - generic [ref=e2136]: "-39%"
            - generic [ref=e2137]:
              - generic [ref=e2143]:
                - generic [ref=e2144]:
                  - paragraph [ref=e2145]: Départ
                  - paragraph [ref=e2146]: Valencia
                - generic [ref=e2147]:
                  - paragraph [ref=e2148]: Arrivée
                  - paragraph [ref=e2149]: Paris
              - paragraph [ref=e2151]: T4 80m² — Déménagement Espagne–France, équipe de 4, démontage/remontage meubles compris.
              - generic [ref=e2152]:
                - generic [ref=e2153]:
                  - generic [ref=e2154]: 799€
                  - generic [ref=e2155]: 1320€
                - button "Réserver" [ref=e2156] [cursor=pointer]
          - generic [ref=e2157]:
            - generic [ref=e2159]: "-41%"
            - generic [ref=e2160]:
              - generic [ref=e2166]:
                - generic [ref=e2167]:
                  - paragraph [ref=e2168]: Départ
                  - paragraph [ref=e2169]: Paris
                - generic [ref=e2170]:
                  - paragraph [ref=e2171]: Arrivée
                  - paragraph [ref=e2172]: Bordeaux
              - paragraph [ref=e2174]: Studio 20m² — Déménagement express, idéal étudiant.
              - generic [ref=e2175]:
                - generic [ref=e2176]:
                  - generic [ref=e2177]: 249€
                  - generic [ref=e2178]: 420€
                - button "Réserver" [ref=e2179] [cursor=pointer]
          - generic [ref=e2180]:
            - generic [ref=e2182]: "-38%"
            - generic [ref=e2183]:
              - generic [ref=e2189]:
                - generic [ref=e2190]:
                  - paragraph [ref=e2191]: Départ
                  - paragraph [ref=e2192]: Nice
                - generic [ref=e2193]:
                  - paragraph [ref=e2194]: Arrivée
                  - paragraph [ref=e2195]: Paris
              - paragraph [ref=e2197]: T3 70m² — Pack sérénité Côte d'Azur–Paris, emballage fragile et suivi GPS.
              - generic [ref=e2198]:
                - generic [ref=e2199]:
                  - generic [ref=e2200]: 549€
                  - generic [ref=e2201]: 890€
                - button "Réserver" [ref=e2202] [cursor=pointer]
        - generic [ref=e2203]:
          - button "Page 1" [ref=e2204] [cursor=pointer]
          - button "Page 2" [ref=e2205] [cursor=pointer]
          - button "Page 3" [ref=e2206] [cursor=pointer]
          - button "Page 4" [ref=e2207] [cursor=pointer]
          - button "Page 5" [ref=e2208] [cursor=pointer]
          - button "Page 6" [ref=e2209] [cursor=pointer]
      - generic [ref=e2211]:
        - img [ref=e2213]
        - img [ref=e2217]
        - heading "La presse parle de nous !" [level=2] [ref=e2226]
        - img [ref=e2229]
      - generic [ref=e2233]:
        - heading "Prêt à déménager en toute sérénité ?" [level=2] [ref=e2234]
        - paragraph [ref=e2235]: Rejoignez des milliers de clients qui ont déjà fait confiance à Guivarche. Obtenez votre devis gratuit maintenant !
        - generic [ref=e2236]:
          - button "Obtenir un devis gratuit" [ref=e2237] [cursor=pointer]
          - link "Nous contacter" [ref=e2238] [cursor=pointer]:
            - /url: /contact
      - contentinfo [ref=e2239]:
        - generic [ref=e2241]:
          - generic [ref=e2242]:
            - generic [ref=e2243]:
              - img "Guivarche Déménagement" [ref=e2244]
              - generic [ref=e2245]:
                - paragraph [ref=e2246]: Contact@guivarche-demenagement.fr
                - paragraph [ref=e2247]: +33 7 46 32 66 78
                - paragraph [ref=e2248]: +33 1 89 70 33 24
                - paragraph [ref=e2249]: 25 Rue de Cîteaux, 75012 Paris, France
            - generic [ref=e2250]:
              - heading "Accès Rapide" [level=3] [ref=e2251]
              - generic [ref=e2252]:
                - link "Accueil" [ref=e2253] [cursor=pointer]:
                  - /url: /
                - link "Solution" [ref=e2254] [cursor=pointer]:
                  - /url: /solution
                - link "Déménagement entreprise" [ref=e2255] [cursor=pointer]:
                  - /url: /demenagement-entreprise
                - link "Déménagement particulier" [ref=e2256] [cursor=pointer]:
                  - /url: /demenagement-particulier
                - link "Blog" [ref=e2257] [cursor=pointer]:
                  - /url: /blog
                - link "FAQ" [ref=e2258] [cursor=pointer]:
                  - /url: /faq
                - link "Tarification" [ref=e2259] [cursor=pointer]:
                  - /url: /tarif
                - link "Contact" [ref=e2260] [cursor=pointer]:
                  - /url: /contact
            - generic [ref=e2261]:
              - heading "Articles Récents" [level=3] [ref=e2262]
              - generic [ref=e2263]:
                - link "Guide complet pour un déménagement réussi" [ref=e2264] [cursor=pointer]:
                  - /url: /blog/guide-complet-demenagement-reussi
                - link "Comment emballer vos objets fragiles" [ref=e2265] [cursor=pointer]:
                  - /url: /blog/comment-emballer-objets-fragiles
                - 'link "Déménagement écologique : nos solutions durables" [ref=e2266] [cursor=pointer]':
                  - /url: /blog/demenagement-ecologique-solutions-durables
            - generic [ref=e2267]:
              - heading "Informations" [level=3] [ref=e2268]
              - generic [ref=e2269]:
                - link "Mentions Légales" [ref=e2270] [cursor=pointer]:
                  - /url: /mentions-legales
                - link "RGPD" [ref=e2271] [cursor=pointer]:
                  - /url: /rgpd
                - generic [ref=e2272]:
                  - link "Nous Contacter" [ref=e2273] [cursor=pointer]:
                    - /url: /contact
                  - generic [ref=e2280] [cursor=pointer]:
                    - img [ref=e2285]
                    - generic [ref=e2296]:
                      - text: Excellent activé Google
                      - img "Vérifié par Google" [ref=e2297]:
                        - img [ref=e2298]
                    - generic [ref=e2301]:
                      - 'img "Rating: 5.0 out of 5" [ref=e2302]':
                        - generic [ref=e2303]: "5.0"
                        - generic [ref=e2304]:
                          - generic [ref=e2305]:
                            - img [ref=e2307]
                            - img [ref=e2311]
                          - generic [ref=e2314]:
                            - img [ref=e2316]
                            - img [ref=e2320]
                          - generic [ref=e2323]:
                            - img [ref=e2325]
                            - img [ref=e2329]
                          - generic [ref=e2332]:
                            - img [ref=e2334]
                            - img [ref=e2338]
                          - generic [ref=e2341]:
                            - img [ref=e2343]
                            - img [ref=e2347]
                      - generic [ref=e2350]: 66 avis
                  - link "Voir nos avis Trustpilot" [ref=e2351] [cursor=pointer]:
                    - /url: https://www.trustpilot.com/review/guivarchedemenagement.fr
                    - img "Trustpilot - Avis clients" [ref=e2352]
          - generic [ref=e2354]:
            - generic [ref=e2355]:
              - paragraph [ref=e2356]: © 2025 Copyright, All Right Reserved, Guivarche Déménagement
              - link "Mentions légales" [ref=e2357] [cursor=pointer]:
                - /url: /mentions-legales
              - link "RGPD" [ref=e2358] [cursor=pointer]:
                - /url: /rgpd
            - generic [ref=e2359]:
              - link "Facebook" [ref=e2360] [cursor=pointer]:
                - /url: https://www.facebook.com/profile.php?id=61587408931997
                - img [ref=e2361]
              - link "Instagram" [ref=e2363] [cursor=pointer]:
                - /url: https://www.instagram.com/guivarche_demenagement/
                - img [ref=e2364]
              - link "LinkedIn" [ref=e2368] [cursor=pointer]:
                - /url: https://www.linkedin.com/company/guivarche-d%C3%A9m%C3%A9nagement/about/?viewAsMember=true
                - img [ref=e2369]
              - link "YouTube" [ref=e2371] [cursor=pointer]:
                - /url: https://www.youtube.com/@Guivarchedem
                - img [ref=e2372]
              - link "TikTok" [ref=e2374] [cursor=pointer]:
                - /url: https://www.tiktok.com/@guivarche_demenagement
                - img [ref=e2375]
              - link "Pages Jaunes" [ref=e2377] [cursor=pointer]:
                - /url: https://www.pagesjaunes.fr/pros/64768014
                - img [ref=e2378]
              - link "Reddit" [ref=e2380] [cursor=pointer]:
                - /url: https://www.reddit.com/user/Accurate-Throat6716/
                - img [ref=e2381]
              - link "Pinterest" [ref=e2383] [cursor=pointer]:
                - /url: https://pin.it/1mMMhJJrZ
                - img [ref=e2384]
              - link "Tumblr" [ref=e2386] [cursor=pointer]:
                - /url: https://www.tumblr.com/guivarche-demenagement
                - img [ref=e2387]
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
> 60  |     await devisLink.click();
      |                     ^ Error: locator.click: Test timeout of 60000ms exceeded.
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