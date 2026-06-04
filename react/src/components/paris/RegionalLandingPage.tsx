import { ParisLandingHeroDesktop, ParisLandingHeroMobile } from "./ParisLandingHero";
import type { LandingHeroConfig } from "./landingHeroConfig";
import { usePageMeta } from "../../hooks/usePageMeta";
import type { PageMetaOptions } from "../../hooks/usePageMeta";

/** Shared shell for regional campaign LPs (Paris, Hauts-de-Seine, etc.). */
export function RegionalLandingPage({
  config,
  meta,
}: Readonly<{
  config: LandingHeroConfig;
  meta: PageMetaOptions;
}>) {
  usePageMeta(meta);

  return (
    <div className="min-h-screen bg-white">
      <ParisLandingHeroDesktop config={config} />
      <ParisLandingHeroMobile config={config} />
    </div>
  );
}
