import { useEffect } from "react";

export type LandingMetaOptions = {
  title: string;
  description: string;
  /** Path only, e.g. `/lp/demenagement-entreprise` — used for self-canonical */
  canonicalPath: string;
};

export function useLandingMeta({ title, description, canonicalPath }: LandingMetaOptions): void {
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
  }, [title, description, canonicalPath]);
}
