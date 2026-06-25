export const PARIS_LP_PATH = "/lp/paris";

/** Site-wide quote form entry — Paris LP compact form at the tunnel URL. */
export const TUNNEL_DEVIS_FORM_PATH = "/tunnel/devis";
export const DEVIS_FORM_PATH = TUNNEL_DEVIS_FORM_PATH;

export const PARIS_LP_VOLUME_CALC_PATH = "/lp/paris/calcule-volume";
export const TUNNEL_VOLUME_CALC_PATH = "/tunnel/mon-volume/liste";
export const PARIS_LP_CALCULATED_VOLUME_KEY = "parisLpCalculatedVolume";
export const PARIS_LP_CALCULATED_OBJECTS_KEY = "parisLpCalculatedObjects";
export const PARIS_LP_FORM_DRAFT_KEY = "parisLpFormDraft";
export const PARIS_LP_ACTIVE_FLOW_KEY = "parisLpActiveFlow";

function normalizeRoutePath(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

export function isParisLpRoute(pathname: string): boolean {
  const path = normalizeRoutePath(pathname);
  return (
    path === PARIS_LP_PATH ||
    path === PARIS_LP_VOLUME_CALC_PATH ||
    path === TUNNEL_DEVIS_FORM_PATH ||
    path === TUNNEL_VOLUME_CALC_PATH
  );
}

export function isCompactVolumeCalcRoute(pathname: string): boolean {
  const path = normalizeRoutePath(pathname);
  return path === PARIS_LP_VOLUME_CALC_PATH || path === TUNNEL_VOLUME_CALC_PATH;
}

export function getVolumeCalcReturnPath(pathname: string): string {
  const path = normalizeRoutePath(pathname);
  return path === TUNNEL_VOLUME_CALC_PATH ? TUNNEL_DEVIS_FORM_PATH : PARIS_LP_PATH;
}

export function isParisLpActiveFlow(): boolean {
  return sessionStorage.getItem(PARIS_LP_ACTIVE_FLOW_KEY) === "true";
}

export function setParisLpActiveFlow(): void {
  sessionStorage.setItem(PARIS_LP_ACTIVE_FLOW_KEY, "true");
}

/** Clears Paris LP form draft and pending calculated volume/objects from sessionStorage. */
export function clearParisLpSession(): void {
  sessionStorage.removeItem(PARIS_LP_FORM_DRAFT_KEY);
  sessionStorage.removeItem(PARIS_LP_CALCULATED_VOLUME_KEY);
  sessionStorage.removeItem(PARIS_LP_CALCULATED_OBJECTS_KEY);
  sessionStorage.removeItem(PARIS_LP_ACTIVE_FLOW_KEY);
}
