import { ParisLandingHeroDesktop, ParisLandingHeroMobile } from "../components/paris/ParisLandingHero";
import { HAUTS_DE_SEINE_LANDING_CONFIG } from "../components/paris/landingHeroConfig";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";

export default function Seine92() {
  usePageMeta(PAGE_META.lpHautsDeSeine);

  return (
    <div className="min-h-screen bg-white">
      <ParisLandingHeroDesktop config={HAUTS_DE_SEINE_LANDING_CONFIG} />
      <ParisLandingHeroMobile config={HAUTS_DE_SEINE_LANDING_CONFIG} />
    </div>
  );
}
