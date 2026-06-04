import { RegionalLandingPage } from "../components/paris/RegionalLandingPage";
import { HAUTS_DE_SEINE_LANDING_CONFIG } from "../components/paris/landingHeroConfig";
import { PAGE_META } from "../seo/pageMeta";

export default function Seine92() {
  return (
    <RegionalLandingPage config={HAUTS_DE_SEINE_LANDING_CONFIG} meta={PAGE_META.lpHautsDeSeine} />
  );
}
