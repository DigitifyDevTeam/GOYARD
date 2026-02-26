# Code quality, security & reliability

This project uses **ESLint** (frontend) and **SonarQube/SonarCloud** for **both the React frontend and the Python backend**. You can run analysis and **read the list of issues automatically** so you can fix them in a dedicated “quality day”.

---

## 1. Run SonarQube analysis and read the report (frontend + backend)

From the **repo root**:

```bash
# 1. Set your SonarCloud (or SonarQube) token
set SONAR_TOKEN=your_token_here          # Windows
# export SONAR_TOKEN=your_token_here     # Linux/macOS

# 2. Optional: set project key if different from sonar-project.properties
# set SONAR_PROJECT_KEY=your-org_brasenplus

# 3. Run analysis and export issues to a report
python scripts/sonar_analyze_and_report.py
```

Or, if you have a root `package.json` and Node:

```bash
npm run sonar
```

**What this does:**

1. Runs **sonar-scanner** (analyzes **react/src** and **backend** Python).
2. Waits for the analysis to finish on SonarCloud/SonarQube.
3. Fetches all issues via the API and writes:
   - **`sonar-issues-report.md`** – readable list by file (for your “day to fix”).
   - **`sonar-issues.json`** – full data for tooling.

**Options:**

- **Only fetch current issues (no new scan):**  
  `python scripts/sonar_analyze_and_report.py --fetch-only`  
  or `npm run sonar:fetch`
- **Skip waiting for analysis:**  
  `python scripts/sonar_analyze_and_report.py --skip-wait`

**Requirements:**

- **SONAR_TOKEN** – from [SonarCloud](https://sonarcloud.io) (or your SonarQube server).
- **Node/npx** – for running `sonar-scanner` (script calls `npx sonar-scanner` from repo root).
- **Python 3** – for the script. Optional: `requests` for nicer API calls (`pip install requests`).

**SonarCloud one-time setup:**

1. Sign up at [sonarcloud.io](https://sonarcloud.io) and add the repo.
2. Create a project; set **Project key** (e.g. `my-org_brasenplus`) in SonarCloud and/or in **`sonar-project.properties`** as `sonar.projectKey=...`.
3. Get your **User token** (Account → Security) and set **SONAR_TOKEN**.

For **SonarQube (self-hosted)** set **SONAR_HOST_URL** (e.g. `https://sonar.mycompany.com`) and use that server’s token.

---

## 2. Frontend-only: ESLint (no Sonar server)

From **`react/`**:

```bash
cd react
npm run lint
```

- **Fails** if there are errors or warnings (`--max-warnings 0`).
- To only **report** without failing:  
  `npm run lint:report`  
  → output in **`react/eslint-report.txt`**.

### What ESLint catches (SonarQube-style)

| Category      | Examples |
|---------------|----------|
| **Security**  | `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url` |
| **Reliability** | `no-floating-promises`, `no-misused-promises`, `require-await` |
| **Type safety** | `no-explicit-any`, `no-unsafe-*` |
| **React**     | `react-hooks/rules-of-hooks` |

---

## 3. How to fix issues (frontend + backend)

- Use **`sonar-issues-report.md`** as your checklist for the “day to fix”.
- Fix **security** and **reliability** first, then **type safety** and style.
- For **frontend** tips (unsafe `any`, floating promises, etc.), see the “How to fix common issues” section in **`react/docs/QUALITY_AND_SECURITY.md`** (if present) or the ESLint rule docs.
- For **backend** Python: follow Sonar rule messages (e.g. add types, avoid `# noqa` without fixing, fix SQL/crypto/security findings).

---

## 4. Summary

| Goal | Command / File |
|------|----------------|
| **Analyze frontend + backend and read issues** | From repo root: `python scripts/sonar_analyze_and_report.py` (set `SONAR_TOKEN`) |
| **Read last analysis only** | `python scripts/sonar_analyze_and_report.py --fetch-only` |
| **Readable issue list** | Open **`sonar-issues-report.md`** after running the script |
| **Frontend lint only** | In `react/`: `npm run lint` |

Config: **`sonar-project.properties`** at repo root (sources: **react/src**, **backend**; exclusions for node_modules, migrations, venv, etc.).
