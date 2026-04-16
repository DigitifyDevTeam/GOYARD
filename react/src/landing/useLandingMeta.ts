import { useEffect } from "react";

export type LandingMetaOptions = {
  title: string;
  description: string;
  /** Path only, e.g. `/lp/demenagement-entreprise` — used for self-canonical */
  canonicalPath: string;
  /**
   * If true, injects `<meta name="robots" content="noindex,follow">`.
   * Useful for campaign/LP pages you don't want indexed.
   */
  noindex?: boolean;
};

export function useLandingMeta({ title, description, canonicalPath, noindex }: LandingMetaOptions): void {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    const canonicalHref = `${globalThis.location.origin}${canonicalPath}`;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalHref);

    const robotsNameSelector = 'meta[name="robots"]';
    const robots = document.querySelector(robotsNameSelector);
    if (noindex) {
      let robotsMeta = robots as HTMLMetaElement | null;
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", "noindex,follow");
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, canonicalPath, noindex]);
}
