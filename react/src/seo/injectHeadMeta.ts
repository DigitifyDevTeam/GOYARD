import type { PageMetaOptions } from "../hooks/usePageMeta";
import { canonicalUrl, robotsContent } from "../hooks/usePageMeta";
import { resolvePageMetaForPath } from "./resolvePageMeta";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function upsertTag(html: string, pattern: RegExp, replacement: string): string {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function injectBeforeHeadClose(html: string, tags: string): string {
  if (!tags) return html;
  return html.replace("</head>", `    ${tags}\n  </head>`);
}

export function injectHeadMetaForOptions(html: string, meta: PageMetaOptions): string {
  let next = html;

  next = upsertTag(
    next,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(meta.title)}</title>`,
  );

  const descriptionTag = `<meta name="description" content="${escapeHtml(meta.description)}" />`;
  next = upsertTag(
    next,
    /<meta\s+name="description"[^>]*>/i,
    descriptionTag,
  );

  const robots = robotsContent(meta);
  const robotsTag = `<meta name="robots" content="${robots}" />`;
  next = upsertTag(next, /<meta\s+name="robots"[^>]*>/i, robotsTag);

  next = next.replace(/<link\s+rel="canonical"[^>]*>/gi, "");

  if (!meta.robotsNoIndex && meta.canonicalPath) {
    const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonicalUrl(meta.canonicalPath))}" />`;
    next = injectBeforeHeadClose(next, canonicalTag);
  }

  return next;
}

export function injectHeadMeta(html: string, pathname: string): string {
  const meta = resolvePageMetaForPath(pathname);
  if (!meta) return html;
  return injectHeadMetaForOptions(html, meta);
}
