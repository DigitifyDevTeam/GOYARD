/**
 * ARCHIVED — not imported by the application.
 *
 * Reference for restoring legacy tunnel routes in App.tsx → AppRoutes.
 * As of 2026-06-18 these paths redirect to DEVIS_FORM_PATH (/lp/paris).
 */
import { Navigate, Route } from "react-router-dom";
import RouteGuard from "../../components/RouteGuard";
import { DEVIS_FORM_PATH } from "../../constants/parisLp";

/** Replace Navigate stubs with AppContent (or dedicated step components) when restoring. */
export const LEGACY_TUNNEL_ROUTE_PATHS = [
  "/tunnel/mes-coordonnees",
  "/tunnel/choix-volume",
  "/tunnel/mon-volume",
  "/tunnel/mon-volume/liste",
  "/tunnel/mon-volume/ai",
  "/tunnel/mon-volume/surface",
  "/tunnel/ai-results",
  "/tunnel/adresses",
  "/tunnel/devis",
  "/tunnel/devis/confirmation",
  "/tunnel/info",
  "/tunnel/options",
] as const;

export type LegacyTunnelRoutePath = (typeof LEGACY_TUNNEL_ROUTE_PATHS)[number];

/**
 * Example JSX to paste into AppRoutes when restoring (wrap AppContent with RouteGuard per step).
 *
 * ```tsx
 * <Route path="/tunnel/mes-coordonnees" element={<RouteGuard><AppContent /></RouteGuard>} />
 * <Route path="/tunnel/choix-volume" element={<RouteGuard><AppContent /></RouteGuard>} />
 * ...
 * ```
 */
export function LegacyTunnelRedirectRoutes() {
  return (
    <>
      <Route path="/tunnel/mes-coordonnees" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/choix-volume" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/mon-volume" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/mon-volume/liste" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/mon-volume/ai" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/mon-volume/surface" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/ai-results" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/adresses" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/devis" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/info" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
      <Route path="/tunnel/options" element={<Navigate to={DEVIS_FORM_PATH} replace />} />
    </>
  );
}
