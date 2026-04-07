import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  DEVIS_ENTRY_DIRECT,
  getDevisEntryPage,
  setDevisEntryPage,
} from "../utils/devisEntry";

function isTunnelPath(path: string): boolean {
  return path === "/tunnel" || path.startsWith("/tunnel/");
}

/**
 * Remembers the last non-tunnel URL, then when the user enters /tunnel/* copies it
 * as the "page d'origine" for the admin email. More reliable than comparing
 * previous route in useEffect (SPA + Strict Mode edge cases).
 */
export default function DevisEntryTracker() {
  const location = useLocation();
  const lastNonTunnelPathRef = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    const fullPath = `${path}${location.search || ""}`;

    if (!isTunnelPath(path)) {
      lastNonTunnelPathRef.current = fullPath;
      return;
    }

    const fromPublic = lastNonTunnelPathRef.current;
    if (fromPublic) {
      setDevisEntryPage(fromPublic);
      return;
    }

    if (!getDevisEntryPage()) {
      const refUrl = typeof document !== "undefined" ? document.referrer : "";
      if (refUrl) {
        try {
          const u = new URL(refUrl);
          if (u.origin === globalThis.location.origin) {
            setDevisEntryPage(u.pathname + (u.search || ""));
          } else {
            setDevisEntryPage(DEVIS_ENTRY_DIRECT);
          }
        } catch {
          setDevisEntryPage(DEVIS_ENTRY_DIRECT);
        }
      } else {
        setDevisEntryPage(DEVIS_ENTRY_DIRECT);
      }
    }
  }, [location.pathname, location.search]);

  return null;
}
