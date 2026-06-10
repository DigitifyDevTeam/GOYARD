export type LandingHeroLocationPart = {
  label: string;
  accent?: boolean;
};

export type LandingHeroConfig = {
  entryPage: string;
  fieldSlug: string;
  heroLine1Prefix: string;
  heroLine1Accent: string;
  mobileLocationParts: LandingHeroLocationPart[];
  moverTitle: string;
  moverDescription: string;
  formTitle: string;
  formCtaDesktop: string;
  formCtaMobile: string;
  mobilePriceBanner: string;
  /** When false, hides the red price band on desktop and mobile. */
  showPriceBanner?: boolean;
  /** When true, price banner renders below "Devis gratuit immédiat" instead of above. */
  mobilePriceBannerAfterDevis?: boolean;
};

export const PARIS_LANDING_CONFIG: LandingHeroConfig = {
  entryPage: "/lp/paris",
  fieldSlug: "paris",
  heroLine1Prefix: "Déménagement à ",
  heroLine1Accent: "Paris",
  mobileLocationParts: [],
  mobilePriceBannerAfterDevis: true,
  showPriceBanner: false,
  moverTitle: "Votre déménageur à Paris",
  moverDescription:
    "Une équipe fiable, claire et réactive pour votre déménagement à Paris.",
  formTitle: "Recevoir mon devis de déménagement à Paris",
  formCtaDesktop: "Recevoir mon devis immédiatement",
  formCtaMobile: "Recevoir mon devis immédiatement",
  mobilePriceBanner: "Prix les moins chers de Paris !",
};

export const HAUTS_DE_SEINE_LANDING_CONFIG: LandingHeroConfig = {
  entryPage: "/lp/hauts-de-seine",
  fieldSlug: "hds",
  heroLine1Prefix: "Déménagement dans les ",
  heroLine1Accent: "Hauts-de-Seine (92)",
  mobileLocationParts: [],
  mobilePriceBannerAfterDevis: true,
  showPriceBanner: false,
  moverTitle: "Votre déménageur dans les Hauts-de-Seine",
  moverDescription:
    "Une équipe fiable, claire et réactive\npour votre déménagement dans les Hauts-de-Seine.",
  formTitle: "Recevoir mon devis de déménagement dans les Hauts-de-Seine",
  formCtaDesktop: "Recevoir mon devis immédiatement",
  formCtaMobile: "Recevoir mon devis  immédiatement",
  mobilePriceBanner: "Prix les moins chers des Hauts-de-Seine !",
};

export const LONGUE_DISTANCE_LANDING_CONFIG: LandingHeroConfig = {
  entryPage: "/lp/longue-distance",
  fieldSlug: "ld",
  heroLine1Prefix: "Déménagement ",
  heroLine1Accent: "longue distance",
  mobileLocationParts: [],
  mobilePriceBannerAfterDevis: true,
  showPriceBanner: false,
  moverTitle: "Votre déménageur longue distance",
  moverDescription:
    "Une équipe fiable, claire et réactive\npour votre déménagement longue distance en France.",
  formTitle: "Recevoir mon devis de déménagement longue distance",
  formCtaDesktop: "Recevoir mon devis immédiatement",
  formCtaMobile: "Recevoir mon devis immédiatement",
  mobilePriceBanner: "Prix compétitifs longue distance !",
};
