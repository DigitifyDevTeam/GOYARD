import type { Plugin } from "vite";
import { injectHeadMeta } from "./injectHeadMeta";

function requestPathname(url: string | undefined): string {
  if (!url) return "/";
  return url.split("?")[0]?.split("#")[0] || "/";
}

function isSpaDocumentRequest(pathname: string): boolean {
  if (pathname === "/" || pathname === "/index.html") return true;
  const lastSegment = pathname.split("/").pop() ?? "";
  return !lastSegment.includes(".");
}

export function injectPageMetaPlugin(): Plugin {
  return {
    name: "inject-page-meta",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const pathname = requestPathname(
          "originalUrl" in ctx && typeof ctx.originalUrl === "string"
            ? ctx.originalUrl
            : ctx.path,
        );
        if (!isSpaDocumentRequest(pathname)) return html;
        return injectHeadMeta(html, pathname);
      },
    },
  };
}
