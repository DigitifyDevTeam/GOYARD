import { useEffect } from "react";
import { ParisLandingHeroDesktop, ParisLandingHeroMobile } from "./ParisLandingHero";
import { ParisLpFormProvider } from "./ParisLpFormContext";
import type { LandingHeroConfig } from "./landingHeroConfig";
import { usePageMeta } from "../../hooks/usePageMeta";
import type { PageMetaOptions } from "../../hooks/usePageMeta";
import { clearParisLpSession } from "../../constants/parisLp";

/** Shared shell for regional campaign LPs (Paris, Hauts-de-Seine, etc.). */
export function RegionalLandingPage({
  config,
  meta,
}: Readonly<{
  config: LandingHeroConfig;
  meta: PageMetaOptions;
}>) {
  usePageMeta(meta);

  useEffect(() => {
    if (config.fieldSlug !== "paris") return;

    const handlePageHide = () => {
      clearParisLpSession();
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [config.fieldSlug]);

  return (
    <div className="min-h-screen bg-white">
      {config.fieldSlug === "paris" ? (
        <ParisLpFormProvider>
          <ParisLandingHeroDesktop config={config} />
          <ParisLandingHeroMobile config={config} />
        </ParisLpFormProvider>
      ) : (
        <>
          <ParisLandingHeroDesktop config={config} />
          <ParisLandingHeroMobile config={config} />
        </>
      )}
    </div>
  );
}
