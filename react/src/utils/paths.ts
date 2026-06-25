/**
 * Public URL path without trailing slash (except site root `/`).
 * Used for canonical URLs, sitemap entries, and internal navigation.
 */
export function normalizePublicPath(path: string): string {
  if (!path || path === "/") return "/";
  const hashIndex = path.search(/[#?]/);
  const pathname = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const suffix = hashIndex === -1 ? "" : path.slice(hashIndex);
  const normalized = pathname.replace(/\/+$/, "");
  return `${normalized}${suffix}`;
}

export function blogArticlePath(slug: string): string {
  return normalizePublicPath(`/blog/${slug}`);
}
