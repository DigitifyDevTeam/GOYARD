import { useLayoutEffect } from "react";
import { normalizePublicPath } from "../utils/paths";

export const SITE_ORIGIN = "https://guivarche-demenagement.fr";

export function canonicalUrl(canonicalPath: string): string {
  const path = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  return `${SITE_ORIGIN}${normalizePublicPath(path)}`;
}

export function robotsContent(meta: Pick<PageMetaOptions, "robotsNoIndex">): string {
  return meta.robotsNoIndex ? "noindex, follow" : "index, follow";
}

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

export function applyPageMeta({
  title,
  description,
  canonicalPath,
  robotsNoIndex,
}: PageMetaOptions): void {
  document.title = title;
  setMetaDescription(description);
  setRobots(robotsContent({ robotsNoIndex }));

  if (robotsNoIndex || !canonicalPath) {
    removeCanonical();
    return;
  }

  setCanonical(canonicalUrl(canonicalPath));
}

export function usePageMeta(options: PageMetaOptions) {
  useLayoutEffect(() => {
    applyPageMeta(options);
  }, [options.title, options.description, options.canonicalPath, options.robotsNoIndex]);
}
