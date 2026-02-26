# Code quality, security & reliability (frontend)

For **full-project SonarQube analysis (frontend + Python backend)** and **automatic issue report**, see the root doc: **[docs/QUALITY_AND_SECURITY.md](../../docs/QUALITY_AND_SECURITY.md)**.

This file covers **frontend-only** ESLint.

## 1. Run ESLint (local, no Sonar server)

```bash
npm run lint
```

- **Fails** if there are errors or warnings (strict: `--max-warnings 0`).
- To only **report** without failing (e.g. to get a file to share):  
  `npm run lint:report`  
  Output is in `eslint-report.txt`.

### What the rules catch (SonarQube-style)

| Category    | Examples |
|------------|----------|
| **Security** | `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url` |
| **Reliability** | `no-floating-promises`, `no-misused-promises`, `require-await`, `await-thenable` |
| **Type safety** | `no-explicit-any`, `no-unsafe-*` (assignment, call, member-access, return, argument) |
| **React** | `react-hooks/rules-of-hooks` |

## 2. How to fix common issues

- **Unsafe `any`**  
  Add proper types (interfaces/types for API responses, event types, etc.) and avoid `any`. Use `unknown` and narrow with type guards if needed.

- **Floating promises**  
  Either `await` the promise or attach `.catch()` / use `void promise` when you intentionally don’t await (e.g. fire-and-forget).

- **Unsafe member access on `any`**  
  Type the object (e.g. response type from API) so properties are known; then the rule stops flagging.

- **Promise in event handler (`no-misused-promises`)**  
  Wrap the async handler so the callback is synchronous, e.g.  
  `onClick={() => { void handleAsync(); }}`  
  or use a small wrapper that returns `void`.

- **`no-explicit-any`**  
  Replace `any` with a concrete type or `unknown` and narrow.

Fixing these incrementally (file by file or by rule) is a good approach.

## 3. SonarQube / SonarCloud

Config is in **`sonar-project.properties`** (sources, exclusions, encoding).

- **SonarCloud (SaaS)**  
  1. Sign up at [sonarcloud.io](https://sonarcloud.io), add the repo.  
  2. Install scanner: `npm install -D sonar-scanner` (or use the one from SonarCloud).  
  3. Run: `npm run sonar` (or the command SonarCloud gives you; you may need to set `SONAR_TOKEN` and org/key in the UI).

- **SonarQube (self-hosted)**  
  1. Run SonarQube (e.g. via Docker).  
  2. Create a project and get the token.  
  3. Install and run `sonar-scanner` with the server URL and token.

After analysis, fix issues from the SonarQube/SonarCloud UI; many will overlap with the ESLint rules above.

## 4. Summary

- Use **`npm run lint`** regularly to enforce security and reliability in the repo.
- Fix **security** and **reliability** issues first, then tighten **type safety** (e.g. `no-unsafe-*`, `no-explicit-any`) over time.
- Use **SonarQube/SonarCloud** for a dashboard and history; the same kinds of issues are already enforced by ESLint locally.
