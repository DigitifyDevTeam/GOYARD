# Legacy multi-step quote tunnel (3 methods)

**Archived:** 2026-06-18  
**Replaced by:** Paris LP compact form at `/lp/paris` (`DEVIS_FORM_PATH`)

## What was archived

The old quote tunnel let users estimate moving volume via **three methods**:

| Method | Route | Description |
|--------|-------|-------------|
| **Liste** | `/tunnel/mon-volume/liste` | Room-by-room object inventory |
| **Surface** | `/tunnel/mon-volume/surface` | Estimation from habitable surface (m² ÷ 2) |
| **IA / Photos** | `/tunnel/mon-volume/ai` | Photo upload + AI object detection |

### Full tunnel flow (archived)

1. `/tunnel/mes-coordonnees` — contact info + departure address (Sophie intro)
2. `/tunnel/choix-volume` — pick one of the 3 methods
3. `/tunnel/mon-volume/*` — volume estimation (method-specific)
4. `/tunnel/ai-results` — AI results review (photo method only)
5. `/tunnel/adresses` — departure, stopovers, arrival addresses
6. `/tunnel/info` — included services info
7. `/tunnel/options` — optional services
8. `/tunnel/devis` — quote summary + PDF
9. `/tunnel/devis/confirmation` — success page

## What is still active

| Route | Purpose |
|-------|---------|
| `/lp/paris` | Compact quote form (replaces step 1 + addresses + submit) |
| `/lp/paris/calcule-volume` | **List method only** — linked from Paris LP “calculer mon volume” |
| `/tunnel/devis/confirmation` | Post-submit confirmation (after Paris LP form) |

All other `/tunnel/*` routes **redirect** to `/lp/paris`.

## Archive contents

| File | Purpose |
|------|---------|
| `AppContent.legacy.snapshot.tsx` | Full `App.tsx` copy at archive time (reference / diff) |
| `legacyTunnelRoutes.tsx` | Route definitions to restore in `AppRoutes` |
| `routeGuard.legacy.ts` | Protected-route list for `RouteGuard` |

## How to restore (summary)

1. Copy relevant sections from `AppContent.legacy.snapshot.tsx` back into `src/App.tsx` (or split into dedicated page components).
2. In `App.tsx` → `AppRoutes`, replace `<Navigate to={DEVIS_FORM_PATH} />` with real routes using `legacyTunnelRoutes.tsx` as reference.
3. Restore `RouteGuard` protected routes from `routeGuard.legacy.ts`.
4. Point CTAs (home, solution, bento demo, etc.) back to `/tunnel/mes-coordonnees` or `/tunnel/choix-volume` as needed.
5. Remove `exclude` for this folder in `tsconfig.json` if you compile archive files.
6. Run e2e smoke tests and walk through all 3 methods end-to-end.

## Related files (outside this folder)

- `src/constants/parisLp.ts` — `DEVIS_FORM_PATH`, Paris LP session keys
- `src/pages/paris.tsx` — `DevisForm` (replacement entry)
- `src/components/RouteGuard.tsx` — still lists legacy protected routes
- `src/components/DevisEntryTracker.tsx` — tracks `/tunnel/*` and `/lp/paris`
