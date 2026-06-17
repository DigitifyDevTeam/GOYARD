export const PARIS_LP_PATH = "/lp/paris";
export const PARIS_LP_VOLUME_CALC_PATH = "/lp/paris/calcule-volume";
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
  return path === PARIS_LP_PATH || path === PARIS_LP_VOLUME_CALC_PATH;
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
