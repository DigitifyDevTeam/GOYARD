import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { clearParisLpSession, isParisLpRoute } from "../constants/parisLp";

function normalizePath(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

/**
 * Clears Paris LP sessionStorage when the user leaves /lp/paris and /lp/paris/calcule-volume.
 * Must run in a component that stays mounted across all routes (e.g. AppRoutes), not AppContent.
 */
export function useParisLpSessionCleanup(onLeaveParisLp?: () => void): void {
  const location = useLocation();
  const prevPathRef = useRef(normalizePath(location.pathname));
  const onLeaveRef = useRef(onLeaveParisLp);
  onLeaveRef.current = onLeaveParisLp;

  useEffect(() => {
    const prev = normalizePath(prevPathRef.current);
    const current = normalizePath(location.pathname);

    if (isParisLpRoute(prev) && !isParisLpRoute(current)) {
      clearParisLpSession();
      onLeaveRef.current?.();
    }

    prevPathRef.current = current;
  }, [location.pathname]);
}
