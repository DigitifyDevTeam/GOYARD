/**
 * Prerender outputs `path/index.html`; Apache serves those URLs with a trailing slash.
 * Internal links and canonicals must match to avoid 301 redirects in crawlers.
 */
export function withTrailingSlash(path: string): string {
  if (!path || path === "/") return "/";
  const hashIndex = path.search(/[#?]/);
  const pathname = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const suffix = hashIndex === -1 ? "" : path.slice(hashIndex);
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${normalized}${suffix}`;
}

export function blogArticlePath(slug: string): string {
  return withTrailingSlash(`/blog/${slug}`);
}
