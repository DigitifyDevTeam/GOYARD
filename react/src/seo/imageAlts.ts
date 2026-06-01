/** Shared alt text for site images (SEO & accessibility) */
export const SITE_IMAGE_ALTS = {
  heroDesktop: "Services déménagement sur mesure",
  heroMobile: "Équipe Guivarche Déménagement",
  aiFeature: "Équipe déménageurs professionnels expérimentés",
  press: {
    revueDurable: "Logo La Revue Durable",
    laProvence: "Logo la provence",
    lExpress: "Logo l'express",
    midiLibre: "Logo midi libre",
  },
} as const;

const BLOG_IMAGE_ALTS_BY_PHOTO_ID: Record<string, string> = {
  "photo-1600585154340": "Déménagement résidentiel sécurisé France",
  "photo-1600607687939": "Maison moderne à déménager",
  "photo-1600566753086": "Maison prête au déménagement",
  "photo-1532996122724": "Cartons recyclables pour un déménagement écologique",
  "photo-1586023492125": "Salon organisé avant un déménagement",
  "photo-1560448204": "Famille préparant un déménagement avec enfants",
  "photo-1600585154363": "Cartons et préparation pour éviter les erreurs",
  "photo-1633158829875": "Planification du budget d'un déménagement",
  "photo-1450101499163": "Documents et assurance pour un déménagement",
};

export function getBlogImageAlt(imageUrl: string, fallbackTitle: string): string {
  for (const [photoId, alt] of Object.entries(BLOG_IMAGE_ALTS_BY_PHOTO_ID)) {
    if (imageUrl.includes(photoId)) return alt;
  }
  return fallbackTitle;
}
