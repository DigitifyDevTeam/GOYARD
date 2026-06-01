import type { PageMetaOptions } from "../hooks/usePageMeta";

/** Paid ad landing pages — noindex, excluded from sitemap/prerender SEO */
export const PAID_LANDING_PATHS = [
  "/lp/paris",
  "/lp/hauts-de-seine",
  "/lp/pro",
  "/lp/particulier",
] as const;

export function isPaidLandingPath(pathname: string): boolean {
  return PAID_LANDING_PATHS.some(
    (p) => pathname === p || pathname === `${p}/`,
  );
}

export function isNoIndexPath(pathname: string): boolean {
  return (
    isPaidLandingPath(pathname) ||
    pathname.startsWith("/lp/") ||
    pathname.startsWith("/tunnel/")
  );
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
function landingPageMeta(canonicalPath: string): PageMetaOptions {
  return pageMeta(
    "Guivarche Déménagement",
    "Demandez votre devis de déménagement en ligne.",
    canonicalPath,
    { robotsNoIndex: true },
  );
}

export const PAGE_META = {
  home: pageMeta(
    "Entreprise de Déménagement pour Particuliers et Pro - Guivarche",
    "Guivarche Déménagement, entreprise spécialisée pour particuliers et professionnels. Profitez d'un accompagnement fiable et adapté à tous vos projets de déménagement.",
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
    "FAQ Déménagement : Tarifs, Délais et Organisation - Guivarche",
    "Retrouvez les réponses aux questions fréquentes sur nos services de déménagement, nos tarifs, délais d'intervention et modalités d'organisation.",
    "/faq",
  ),
  demenagementParticulier: pageMeta(
    "Service de Déménagement pour Particuliers - Guivarche",
    "Simplifiez votre déménagement particulier avec une équipe expérimentée, des services adaptés et un suivi complet.",
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
    "Déménagement en Île-de-France : Paris et Banlieue - Guivarche",
    "Déménagement en Île-de-France avec une équipe réactive à Paris et en petite couronne. Devis rapide, protection du mobilier et interventions soignées.",
    "/ile-de-france",
  ),
  demenagementNational: pageMeta(
    "Déménagement National : Longue Distance en France - Guivarche",
    "Organisez votre déménagement national en toute sérénité : transport sécurisé, planification rigoureuse et suivi clair partout en France métropolitaine.",
    "/demenagement-national",
  ),
  international: pageMeta(
    "Déménagement International : Europe et Monde - Guivarche",
    "Déménagement international clé en main : emballage, logistique, formalités et coordination. Un accompagnement expert pour vos projets à l'étranger.",
    "/international",
  ),
  formulesDemenagement: pageMeta(
    "Formules de Déménagement : Économique, Standard, Premium - Guivarche",
    "Comparez nos formules de déménagement et estimez votre budget. Choisissez l'offre adaptée à votre volume, vos dates et votre niveau de service.",
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
  lpParis: landingPageMeta("/lp/paris"),
  lpHautsDeSeine: landingPageMeta("/lp/hauts-de-seine"),
  lpPro: landingPageMeta("/lp/pro"),
  lpParticulier: landingPageMeta("/lp/particulier"),
  lpDemenagementEntreprise: landingPageMeta("/lp/demenagement-entreprise"),
  lpDemenagementParticulier: landingPageMeta("/lp/demenagement-particulier"),
  lpIleDeFrance: landingPageMeta("/lp/ile-de-france"),
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
      "Ne rien oublier grâce à notre liste complète des tâches à effectuer avant, pendant et après votre déménagement.",
  },
  "demenager-avec-enfants-guide-pratique": {
    title: "Déménager avec des Enfants : Guide Pratique - Guivarche",
    description:
      "Comment impliquer vos enfants dans le processus et rendre cette transition plus facile pour toute la famille.",
  },
  "erreurs-eviter-demenagement": {
    title: "Erreurs à Éviter Lors d'un Déménagement - Guivarche",
    description:
      "Apprenez des expériences des autres et évitez les pièges les plus courants pour un déménagement sans accroc.",
  },
  "budget-demenagement-economies": {
    title: "Budget Déménagement : Astuces pour Faire des Économies - Guivarche",
    description:
      "Nos astuces pour réduire les coûts de votre déménagement sans compromettre la qualité du service.",
  },
  "assurance-demenagement-guide-complet": {
    title: "Assurance Déménagement : Guide Complet - Guivarche",
    description:
      "Les différentes options d'assurance pour protéger vos biens pendant le transport et éviter les mauvaises surprises.",
  },
};
