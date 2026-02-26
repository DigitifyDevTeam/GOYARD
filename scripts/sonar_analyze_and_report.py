#!/usr/bin/env python3
"""
Run SonarQube/SonarCloud analysis (frontend + backend) and export issues to a report.

Usage (from repo root):
  Set SONAR_TOKEN (required) and optionally SONAR_PROJECT_KEY, SONAR_HOST_URL.
  Then run:
    python scripts/sonar_analyze_and_report.py              # run scanner + fetch report
    python scripts/sonar_analyze_and_report.py --fetch-only  # only fetch current issues (no scan)

Output:
  - sonar-issues-report.md  (readable list for fixing)
  - sonar-issues.json       (full data for tooling)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

import urllib.request
import urllib.error
import ssl

# Prefer requests if available (cleaner)
try:
    import requests
    _HAS_REQUESTS = True
except ImportError:
    _HAS_REQUESTS = False

REPO_ROOT = Path(__file__).resolve().parent.parent
SONAR_PROPS = REPO_ROOT / "sonar-project.properties"
DEFAULT_HOST = "https://sonarcloud.io"
REPORT_MD = REPO_ROOT / "sonar-issues-report.md"
REPORT_JSON = REPO_ROOT / "sonar-issues.json"


def get_project_key() -> str:
    """Read sonar.projectKey from sonar-project.properties or env."""
    key = os.environ.get("SONAR_PROJECT_KEY", "").strip()
    if key:
        return key
    if not SONAR_PROPS.exists():
        print("ERROR: sonar-project.properties not found and SONAR_PROJECT_KEY not set.", file=sys.stderr)
        sys.exit(1)
    text = SONAR_PROPS.read_text(encoding="utf-8")
    m = re.search(r"sonar\.projectKey\s*=\s*(.+)", text)
    if m:
        return m.group(1).strip().split("#")[0].strip()
    print("ERROR: sonar.projectKey not found in sonar-project.properties.", file=sys.stderr)
    sys.exit(1)


def get_token() -> str:
    token = os.environ.get("SONAR_TOKEN", "").strip()
    if not token:
        print("ERROR: SONAR_TOKEN is required. Set it in the environment.", file=sys.stderr)
        sys.exit(1)
    return token


def get_host() -> str:
    return os.environ.get("SONAR_HOST_URL", DEFAULT_HOST).rstrip("/")


def run_sonar_scanner() -> bool:
    """Run sonar-scanner from repo root. Returns True on success."""
    os.chdir(REPO_ROOT)
    # Prefer npx so we don't require global install
    cmd = ["npx", "--yes", "sonar-scanner"]
    print("Running:", " ".join(cmd), flush=True)
    try:
        result = subprocess.run(cmd, env={**os.environ})
        return result.returncode == 0
    except FileNotFoundError:
        print("ERROR: npx not found. Install Node.js or run sonar-scanner manually.", file=sys.stderr)
        return False


def api_get(url: str, token: str, host: str) -> dict:
    """GET JSON from Sonar API."""
    full_url = f"{host}{url}" if url.startswith("/") else url
    headers = {"Authorization": f"Bearer {token}"}
    if _HAS_REQUESTS:
        r = requests.get(full_url, headers=headers, timeout=60)
        r.raise_for_status()
        return r.json()
    req = urllib.request.Request(full_url, headers=headers)
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        raise RuntimeError(f"API {e.code}: {body}") from e


def wait_for_analysis(host: str, token: str, project_key: str, max_wait_sec: int = 300) -> bool:
    """Poll ce/activity until no pending/in_progress tasks for this project."""
    start = time.time()
    while (time.time() - start) < max_wait_sec:
        try:
            data = api_get(f"/api/ce/activity?component={project_key}", token, host)
        except Exception as e:
            print(f"  Poll ce/activity: {e}")
            time.sleep(10)
            continue
        tasks = data.get("tasks", [])
        active = [t for t in tasks if t.get("status") in ("PENDING", "IN_PROGRESS")]
        if not active:
            return True
        print(f"  Waiting for analysis... ({len(active)} task(s))")
        time.sleep(15)
    print("  Timeout waiting for analysis; fetching issues anyway.", file=sys.stderr)
    return False


def fetch_all_issues(host: str, token: str, project_key: str) -> list[dict]:
    """Fetch all issues for the project via api/issues/search."""
    issues: list[dict] = []
    page = 1
    page_size = 100
    while True:
        url = f"/api/issues/search?componentKeys={project_key}&ps={page_size}&p={page}"
        try:
            data = api_get(url, token, host)
        except Exception as e:
            print(f"ERROR fetching issues: {e}", file=sys.stderr)
            break
        batch = data.get("issues", [])
        if not batch:
            break
        issues.extend(batch)
        total = data.get("total", 0)
        if page * page_size >= total:
            break
        page += 1
    return issues


def severity_order(s: str) -> int:
    order = {"BLOCKER": 0, "CRITICAL": 1, "MAJOR": 2, "MINOR": 3, "INFO": 4}
    return order.get(s.upper(), 5)


def write_report_md(issues: list[dict]) -> None:
    """Write a readable Markdown report grouped by file and severity."""
    by_file: dict[str, list[dict]] = {}
    for i in issues:
        comp = i.get("component", "").split(":")[-1] if isinstance(i.get("component"), str) else ""
        by_file.setdefault(comp or "(unknown)", []).append(i)
    for key in by_file:
        by_file[key].sort(key=lambda x: (severity_order(x.get("severity", "")), x.get("line", 0)))
    lines = [
        "# SonarQube / SonarCloud issues report",
        "",
        f"Total issues: **{len(issues)}**",
        "",
        "---",
        "",
    ]
    for filepath in sorted(by_file.keys()):
        file_issues = by_file[filepath]
        lines.append(f"## `{filepath}` ({len(file_issues)} issues)")
        lines.append("")
        for iss in file_issues:
            sev = iss.get("severity", "")
            rule = iss.get("rule", "")
            line = iss.get("line")
            msg = iss.get("message", "")
            typ = iss.get("type", "")
            line_part = f" (line {line})" if line else ""
            lines.append(f"- **[{sev}]**{line_part} {msg}")
            lines.append(f"  - Rule: `{rule}` | Type: {typ}")
            lines.append("")
        lines.append("")
    REPORT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"Written: {REPORT_MD}")


def write_report_json(issues: list[dict]) -> None:
    """Write full JSON for tooling."""
    REPORT_JSON.write_text(json.dumps({"total": len(issues), "issues": issues}, indent=2), encoding="utf-8")
    print(f"Written: {REPORT_JSON}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Sonar analysis and export issues report.")
    parser.add_argument("--fetch-only", action="store_true", help="Only fetch current issues (do not run scanner)")
    parser.add_argument("--skip-wait", action="store_true", help="Do not wait for analysis to finish after scanner")
    args = parser.parse_args()

    token = get_token()
    project_key = get_project_key()
    host = get_host()

    if not args.fetch_only:
        if not run_sonar_scanner():
            sys.exit(1)
        if not args.skip_wait:
            print("Waiting for analysis to complete...")
            wait_for_analysis(host, token, project_key)
        else:
            print("Waiting 30s for analysis to be queued...")
            time.sleep(30)

    print("Fetching issues...")
    issues = fetch_all_issues(host, token, project_key)
    print(f"Found {len(issues)} issues.")
    if issues:
        write_report_md(issues)
        write_report_json(issues)
    else:
        print("No issues to report.")


if __name__ == "__main__":
    main()
