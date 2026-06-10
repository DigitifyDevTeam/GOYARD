import { RegionalLandingPage } from "../components/paris/RegionalLandingPage";
import { LONGUE_DISTANCE_LANDING_CONFIG } from "../components/paris/landingHeroConfig";
import { PAGE_META } from "../seo/pageMeta";

export default function LongueDistance() {
  return (
    <RegionalLandingPage
      config={LONGUE_DISTANCE_LANDING_CONFIG}
      meta={PAGE_META.lpLongueDistance}
    />
  );
}
