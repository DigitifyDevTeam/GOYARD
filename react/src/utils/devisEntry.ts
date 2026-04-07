/** Session key: page the user was on when entering the tunnel (first step of devis). */
const STORAGE_KEY = "devis_entry_source";

/** Stored when the user opens the tunnel without an in-app referrer (favori, lien direct, etc.). */
export const DEVIS_ENTRY_DIRECT = "__direct__";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Accueil",
  "/solution": "Solution",
  "/contact": "Contact",
  "/demenagement-particulier": "Déménagement particulier",
  "/demenagement-entreprise": "Déménagement entreprise",
  "/ile-de-france": "Île-de-France",
  "/paris": "Paris (landing)",
  "/lp/paris": "Landing Paris",
  "/versailles-92": "Versailles 92 (landing)",
  "/lp/versailles-92": "Landing Versailles 92",
  "/demenagement-national": "France métropolitaine",
  "/international": "International",
  "/blog": "Blog",
  "/faq": "FAQ",
  "/tarification": "Tarification",
  "/formules-demenagement": "Formules déménagement",
  "/mentions-legales": "Mentions légales",
  "/rgpd": "RGPD",
  "/en-construction": "En construction",
  "/lp/demenagement-entreprise": "Landing entreprise",
  "/lp/demenagement-particulier": "Landing particulier",
  "/lp/ile-de-france": "Landing Île-de-France",
};

function storageSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
    return;
  } catch {
    /* sessionStorage unavailable (e.g. private mode) */
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function storageGet(key: string): string | null {
  try {
    const s = sessionStorage.getItem(key);
    if (s != null) return s;
  } catch {
    /* ignore */
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageRemove(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function setDevisEntryPage(pathWithOptionalQuery: string): void {
  storageSet(STORAGE_KEY, pathWithOptionalQuery);
}

export function getDevisEntryPage(): string | null {
  return storageGet(STORAGE_KEY);
}

export function clearDevisEntryPage(): void {
  storageRemove(STORAGE_KEY);
}

function formatPathForDisplay(raw: string): string {
  const pathPart = raw.split("?")[0] || raw;
  const search = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";

  if (pathPart.startsWith("/blog/") && pathPart.length > "/blog/".length) {
    const slug = pathPart.slice("/blog/".length);
    return `Blog (${slug})${search}`;
  }

  const label = ROUTE_LABELS[pathPart];
  if (label) {
    return search ? `${label}${search}` : label;
  }

  return raw || "—";
}

/** Human-readable string for API / admin email. */
export function getDevisEntryPageDisplay(): string {
  const raw = getDevisEntryPage();
  if (!raw) {
    return "Non renseigné";
  }
  if (raw === DEVIS_ENTRY_DIRECT) {
    return "Accès direct, favori ou site externe";
  }
  return formatPathForDisplay(raw);
}
