import { useEffect } from "react";
import { withTrailingSlash } from "../utils/paths";

const SITE_ORIGIN = "https://guivarche-demenagement.fr";

export type PageMetaOptions = {
  title: string;
  description: string;
  canonicalPath?: string;
  /** When true, sets meta robots to noindex,follow (landing pages, tunnel, etc.) */
  robotsNoIndex?: boolean;
};

function setMetaDescription(content: string) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function setRobots(content: string) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "robots";
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function setCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

function removeCanonical() {
  document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
}

const NOINDEX_ROBOTS = "noindex, follow";

export function usePageMeta({
  title,
  description,
  canonicalPath,
  robotsNoIndex,
}: PageMetaOptions) {
  useEffect(() => {
    document.title = title;
    setMetaDescription(description);

    if (robotsNoIndex) {
      setRobots(NOINDEX_ROBOTS);
      removeCanonical();
      return;
    }

    setRobots("index, follow");
    if (canonicalPath) {
      const path = canonicalPath.startsWith("/")
        ? canonicalPath
        : `/${canonicalPath}`;
      setCanonical(`${SITE_ORIGIN}${withTrailingSlash(path)}`);
    }
  }, [title, description, canonicalPath, robotsNoIndex]);
}
