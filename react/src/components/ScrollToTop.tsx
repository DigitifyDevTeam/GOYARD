import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isNoIndexPath } from "../seo/pageMeta";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }

    robotsMeta.setAttribute(
      "content",
      isNoIndexPath(pathname) ? "noindex, follow" : "index, follow",
    );
  }, [pathname]);

  return null;
}

