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
};

export const PARIS_LANDING_CONFIG: LandingHeroConfig = {
  entryPage: "/lp/paris",
  fieldSlug: "paris",
  heroLine1Prefix: "Déménagement à ",
  heroLine1Accent: "Paris",
  mobileLocationParts: [
    { label: "Paris", accent: true },
    { label: "Province" },
    { label: "France entière" },
  ],
  moverTitle: "Votre déménageur à Paris",
  moverDescription:
    "Une équipe fiable, claire et réactive pour votre déménagement à Paris.",
  formTitle: "Recevoir mon devis de déménagement à Paris",
  formCtaDesktop: "Recevoir mon devis gratuit à Paris",
  formCtaMobile: "Recevoir mon devis gratuit à Paris immédiatement",
  mobilePriceBanner: "Prix les moins chers de Paris !",
};

export const HAUTS_DE_SEINE_LANDING_CONFIG: LandingHeroConfig = {
  entryPage: "/lp/hauts-de-seine",
  fieldSlug: "hds",
  heroLine1Prefix: "Déménagement dans les ",
  heroLine1Accent: "Hauts-de-Seine (92)",
  mobileLocationParts: [
    { label: "Hauts-de-Seine (92)", accent: true },
    { label: "Neuilly" },
    { label: "Boulogne" },
    { label: "La Défense" },
  ],
  moverTitle: "Votre déménageur dans les Hauts-de-Seine (92)",
  moverDescription:
    "Une équipe fiable, claire et réactive pour votre déménagement dans les Hauts-de-Seine (92).",
  formTitle: "Recevoir mon devis de déménagement dans les Hauts-de-Seine (92)",
  formCtaDesktop: "Recevoir mon devis gratuit dans les Hauts-de-Seine (92)",
  formCtaMobile: "Recevoir mon devis gratuit dans les Hauts-de-Seine (92) immédiatement",
  mobilePriceBanner: "Prix les moins chers des Hauts-de-Seine (92) !",
};
