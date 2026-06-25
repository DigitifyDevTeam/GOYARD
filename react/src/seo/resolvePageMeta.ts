import type { PageMetaOptions } from "../hooks/usePageMeta";
import { BLOG_ARTICLE_META, PAGE_META } from "./pageMeta";

function normalizePath(pathname: string): string {
  const path = pathname.split("?")[0]?.split("#")[0] ?? "/";
  if (path === "/") return "/";
  return path.replace(/\/+$/, "");
}

/** Route paths that differ from their canonicalPath in PAGE_META. */
const ROUTE_META_ALIASES: Record<string, PageMetaOptions> = {
  "/demenagement-paris-versailles": PAGE_META.versaille,
  "/demenagement-paris-75": PAGE_META.demenagementParis75,
  "/demenagement-hauts-de-seine-92": PAGE_META.demenagementHautsDeSeine92,
  "/demenagement-val-de-marne-94": PAGE_META.demenagementValDeMarne94,
  "/demenagement-yvelines-78": PAGE_META.demenagementYvelines78,
  "/demenagement-essonne-91": PAGE_META.demenagementEssonne91,
  "/demenagement-seine-et-marne-77": PAGE_META.demenagementSeineEtMarne77,
  "/demenagement-seine-saint-denis-93": PAGE_META.demenagementSeineSaintDenis93,
  "/demenagement-val-doise-95": PAGE_META.demenagementValDoise95,
  "/versaille": PAGE_META.versaille,
  "/ile-de-france": PAGE_META.ileDeFrance,
  "/international": PAGE_META.international,
  "/tunnel/mes-coordonnees": PAGE_META.tunnelDevis,
};

const canonicalMetaByPath = new Map<string, PageMetaOptions>();
for (const meta of Object.values(PAGE_META)) {
  if (meta.canonicalPath) {
    canonicalMetaByPath.set(normalizePath(meta.canonicalPath), meta);
  }
}

export function resolvePageMetaForPath(pathname: string): PageMetaOptions | undefined {
  const path = normalizePath(pathname);

  if (path.startsWith("/blog/") && path.length > "/blog/".length) {
    const slug = path.slice("/blog/".length);
    const article = BLOG_ARTICLE_META[slug];
    if (article) {
      return { ...article, canonicalPath: `/blog/${slug}` };
    }
    return undefined;
  }

  const alias = ROUTE_META_ALIASES[path];
  if (alias) return alias;

  const byCanonical = canonicalMetaByPath.get(path);
  if (byCanonical) return byCanonical;

  return undefined;
}
