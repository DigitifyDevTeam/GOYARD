/**
 * ARCHIVED — reference for RouteGuard protected routes when restoring the legacy tunnel.
 * Current app: src/components/RouteGuard.tsx (still mirrors this list).
 */

export const LEGACY_TUNNEL_PROTECTED_ROUTES = [
  "/tunnel/choix-volume",
  "/tunnel/mon-volume/liste",
  "/tunnel/mon-volume/ai",
  "/tunnel/mon-volume/surface",
  "/tunnel/ai-results",
  "/tunnel/adresses",
  "/tunnel/devis",
  "/tunnel/info",
  "/tunnel/options",
] as const;

/** First step before method selection (replaced by DEVIS_FORM_PATH). */
export const LEGACY_TUNNEL_FIRST_STEP = "/tunnel/mes-coordonnees";
