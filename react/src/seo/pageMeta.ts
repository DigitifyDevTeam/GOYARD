import type { PageMetaOptions } from "../hooks/usePageMeta";

/**
 * Campaign landing pages under /lp/* — must stay noindex (paid ads, not organic SEO).
 * Excluded from sitemap.xml and scripts/prerender.mjs; blocked in robots.txt.
 */
export const LANDING_PAGE_PATHS = [
  "/lp/paris",
  "/lp/hauts-de-seine",
  "/lp/longue-distance",
  "/lp/pro",
  "/lp/particulier",
] as const;

/** @deprecated Use LANDING_PAGE_PATHS */
export const PAID_LANDING_PATHS = LANDING_PAGE_PATHS;

export function isLandingPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  return path === "/lp" || path.startsWith("/lp/");
}

export function isPaidLandingPath(pathname: string): boolean {
  return isLandingPath(pathname);
}

export function isNoIndexPath(pathname: string): boolean {
  return isLandingPath(pathname) || pathname.startsWith("/tunnel/");
}

function pageMeta(
  title: string,
  description: string,
  canonicalPath: string,
  options?: { robotsNoIndex?: boolean },
): PageMetaOptions {
  return {
    title,
    description,
    canonicalPath,
    robotsNoIndex: options?.robotsNoIndex,
  };
}

/** Minimal meta for /lp/* pages (not meant for organic SEO) */
function landingPageMeta(
  canonicalPath: string,
  title: string,
  description: string,
): PageMetaOptions {
  return pageMeta(title, description, canonicalPath, { robotsNoIndex: true });
}

export const PAGE_META = {
  home: pageMeta(
    "Déménageur Paris & IDF : Particuliers et Pro - Guivarche",
    "Guivarche, déménageur à Paris et Île-de-France. Équipes salariées, devis sous 24h, solutions particuliers et entreprises. Estimez votre projet en ligne.",
    "/",
  ),
  tarif: pageMeta(
    "Tarifs Déménagement : Estimez Votre Budget - Guivarche",
    "Découvrez nos tarifs de déménagement adaptés à tous les budgets. Obtenez un devis personnalisé rapidement, transparent et sans engagement pour votre projet.",
    "/tarif",
  ),
  solution: pageMeta(
    "Nos Solutions de Déménagement sur Mesure - Guivarche",
    "Découvrez nos solutions de déménagement pour particuliers et entreprises, avec des services sur mesure, un accompagnement complet et un transport sécurisé.",
    "/solution",
  ),
  faq: pageMeta(
    "FAQ Déménagement : Tarifs, Délais, Devis | Guivarche",
    "Tarifs, délais, assurance, emballage : toutes vos questions sur le déménagement avec Guivarche. Réponses claires et devis gratuit sous 24 h pour votre projet.",
    "/faq",
  ),
  demenagementParticulier: pageMeta(
    "Service de Déménagement pour Particuliers - Guivarche",
    "Déménagement particulier clé en main à Paris et en Île-de-France. Équipe expérimentée, emballage, transport sécurisé et devis gratuit sous 24 h.",
    "/demenagement-particulier",
  ),
  demenagementEntreprise: pageMeta(
    "Déménagement d'Entreprise: Service Professionnel - Guivarche",
    "Organisez le transfert de votre entreprise avec des experts du déménagement professionnel et assurez la continuité de votre activité sans interruption.",
    "/demenagement-entreprise",
  ),
  blog: pageMeta(
    "Conseils et Astuces pour un Déménagement Réussi - Guivarche",
    "Découvrez nos conseils, astuces et actualités du déménagement à travers des guides pratiques pour préparer votre projet et déménager en toute sérénité.",
    "/blog",
  ),
  contact: pageMeta(
    "Contactez Nos Experts du Déménagement - Guivarche",
    "Contactez notre équipe pour obtenir un devis gratuit, poser vos questions, bénéficier de conseils personnalisés et planifier votre déménagement rapidement.",
    "/contact",
  ),
  rgpd: pageMeta(
    "Politique RGPD et Protection des Données - Guivarche",
    "Consultez notre politique RGPD et découvrez comment nous collectons, utilisons, stockons et protégeons vos données personnelles en toute sécurité.",
    "/rgpd",
  ),
  mentionsLegales: pageMeta(
    "Mentions Légales du Site Guivarche Déménagement - Guivarche",
    "Retrouvez toutes les informations légales concernant Guivarche Déménagement, l'éditeur du site, son hébergement et ses obligations réglementaires.",
    "/mentions-legales",
  ),
  ileDeFrance: pageMeta(
    "Déménageur Île-de-France : Paris & Banlieue - Guivarche",
    "Guivarche vous accompagne en Île-de-France : Paris, petite couronne et départements limitrophes. Équipes salariées, devis sous 24 h et transport sécurisé.",
    "/ile-de-france",
  ),
  versaille: pageMeta(
    "Déménagement Paris Versailles : Devis Gratuit sous 24h - Guivarche",
    "Déménagement Paris Versailles avec Guivarche : déménageur Paris Versailles, devis gratuit sous 24 h, assurance incluse et excellent rapport qualité-prix. Route Paris → Versailles maîtrisée.",
    "/demenagement-paris-versaille",
  ),
  longueDistance: pageMeta(
    "Déménagement Longue Distance : Devis Gratuit sous 24h - Guivarche",
    "Déménagement longue distance en France avec Guivarche : transport sécurisé, protection renforcée, devis gratuit sous 24 h et suivi personnalisé de bout en bout.",
    "/longue",
  ),
  demenagementNational: pageMeta(
    "Déménagement National & Longue Distance - Guivarche",
    "Organisez votre déménagement longue distance en France avec Guivarche. Transport sécurisé, planification rigoureuse et suivi personnalisé de bout en bout.",
    "/demenagement-national",
  ),
  international: pageMeta(
    "Déménagement International : Europe et Monde - Guivarche",
    "Déménagement international clé en main : emballage, logistique, formalités et coordination. Un accompagnement expert pour vos projets à l'étranger.",
    "/international",
  ),
  formulesDemenagement: pageMeta(
    "Formules Déménagement : Éco, Standard, Luxe | Guivarche",
    "Prix au m³, kilomètres et accès : comparez nos formules Économique, Standard et Luxe. Estimez votre budget à Paris et en IDF. Devis ferme gratuit sous 24 h.",
    "/formules-demenagement",
  ),
  enConstruction: pageMeta(
    "Page en Construction - Guivarche Déménagement",
    "Cette page est en cours de préparation. Découvrez nos services de déménagement sur Guivarche ou contactez-nous pour obtenir un devis personnalisé.",
    "/en-construction",
  ),
  notFound: pageMeta(
    "Page Introuvable - Guivarche Déménagement",
    "La page demandée est introuvable. Retournez à l'accueil ou contactez Guivarche Déménagement pour votre projet de déménagement.",
    "/",
  ),
  lpParis: landingPageMeta(
    "/lp/paris",
    "Déménageur à Paris : Devis Gratuit sous 24h - Guivarche",
    "Demandez votre devis de déménagement à Paris. Guivarche intervient dans tous les arrondissements avec des équipes salariées et un accompagnement sur mesure.",
  ),
  lpHautsDeSeine: landingPageMeta(
    "/lp/hauts-de-seine",
    "Déménageur Hauts-de-Seine (92) : Devis Gratuit - Guivarche",
    "Déménagement dans les Hauts-de-Seine (92) avec Guivarche. Devis gratuit et interventions soignées à Neuilly, Boulogne, La Défense et alentours.",
  ),
  lpPro: landingPageMeta(
    "/lp/pro",
    "Déménagement Professionnel : Devis Entreprise - Guivarche",
    "Transférez vos bureaux ou locaux professionnels avec Guivarche. Planification rigoureuse et continuité d'activité garantie pour votre entreprise.",
  ),
  lpParticulier: landingPageMeta(
    "/lp/particulier",
    "Déménagement Particulier : Devis Gratuit - Guivarche",
    "Préparez votre déménagement particulier sereinement avec Guivarche. Emballage, transport sécurisé et devis personnalisé sous 24 h en Île-de-France.",
  ),
  lpDemenagementEntreprise: landingPageMeta(
    "/lp/demenagement-entreprise",
    "Déménagement d'Entreprise : Devis Pro - Guivarche",
    "Organisez le déménagement de votre entreprise avec Guivarche. Transfert de bureaux, matériel et archives avec une équipe dédiée et un planning maîtrisé.",
  ),
  lpDemenagementParticulier: landingPageMeta(
    "/lp/demenagement-particulier",
    "Déménagement Particulier Paris : Devis - Guivarche",
    "Estimez votre déménagement particulier en ligne avec Guivarche. Formules adaptées, équipes 100 % salariées et intervention rapide à Paris et en Île-de-France.",
  ),
  lpIleDeFrance: landingPageMeta(
    "/lp/ile-de-france",
    "Déménageur Île-de-France : Devis sous 24h - Guivarche",
    "Déménagement en Île-de-France avec Guivarche. Paris, petite couronne et départements limitrophes : devis gratuit, protection du mobilier et équipes expérimentées.",
  ),
  lpLongueDistance: landingPageMeta(
    "/lp/longue-distance",
    "Déménagement Longue Distance : Devis Gratuit sous 24h - Guivarche",
    "Demandez votre devis de déménagement longue distance en France. Transport sécurisé, protection renforcée et équipes salariées partout en France métropolitaine.",
  ),
} as const satisfies Record<string, PageMetaOptions>;

export const BLOG_ARTICLE_META: Record<
  string,
  Pick<PageMetaOptions, "title" | "description">
> = {
  "guide-complet-demenagement-reussi": {
    title: "Guide Complet pour Réussir son Déménagement Facilement",
    description:
      "Préparez votre déménagement sereinement grâce à nos conseils pratiques, étapes clés et astuces efficaces pour éviter les erreurs et gagner du temps.",
  },
  "comment-emballer-objets-fragiles": {
    title: "Comment Emballer des Objets Fragiles pour un Déménagement",
    description:
      "Apprenez à protéger efficacement vos objets fragiles grâce à nos conseils d'emballage, astuces pratiques et techniques pour un transport sans casse.",
  },
  "demenagement-ecologique-solutions-durables": {
    title: "Comment Réussir un Déménagement Écologique - Guivarche",
    description:
      "Découvrez des solutions de déménagement écologique pour réduire votre impact environnemental grâce à nos conseils durables et gestes écoresponsables.",
  },
  "demenagement-longue-distance": {
    title: "Réussir un Déménagement Longue Distance : Conseils et Astuces",
    description:
      "Préparez votre déménagement longue distance grâce à nos conseils d'experts, recommandations pratiques et solutions logistiques adaptées à votre projet.",
  },
  "checklist-ultime-demenagement": {
    title: "Check-list Ultime pour un Déménagement Sans Oublis - Guivarche",
    description:
      "Ne rien oublier avant votre déménagement : notre check-list complète des tâches à planifier avant, pendant et après le jour J, avec conseils pratiques de Guivarche.",
  },
  "demenager-avec-enfants-guide-pratique": {
    title: "Déménager avec des Enfants : Guide Pratique - Guivarche",
    description:
      "Comment impliquer vos enfants dans le déménagement et rendre cette transition plus sereine. Conseils concrets pour organiser le jour J en famille.",
  },
  "erreurs-eviter-demenagement": {
    title: "Erreurs à Éviter Lors d'un Déménagement - Guivarche",
    description:
      "Découvrez les erreurs les plus fréquentes lors d'un déménagement et comment les éviter. Retours d'expérience et conseils pour un transfert sans surprise.",
  },
  "budget-demenagement-economies": {
    title: "Budget Déménagement : Astuces pour Économiser - Guivarche",
    description:
      "Réduisez le coût de votre déménagement sans sacrifier la qualité. Astuces de planification, choix de formule et bonnes pratiques pour optimiser votre budget.",
  },
  "assurance-demenagement-guide-complet": {
    title: "Assurance Déménagement : Guide Complet - Guivarche",
    description:
      "Comprenez les options d'assurance déménagement pour protéger vos biens pendant le transport. Garanties, franchises et conseils pour choisir la bonne couverture.",
  },
};
