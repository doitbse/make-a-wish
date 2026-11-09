"""Decide whether a cost-review pass should run on this pull request. No model call.

  python3 .github/scripts/cost_trigger.py --pass A --pr 123     # writes run=true|false to $GITHUB_OUTPUT

Pass A (cloud and data) and pass B (model and agent) each run only when a changed file matches
that pass, by path or by a pattern in the lines the PR adds. Docs never match on content, and
pass B ignores model names in config files. The reasons go to the job summary, so a skipped or
started pass can be checked against the PR.
Needs GH_TOKEN and GITHUB_REPOSITORY (set by Actions); `gh` is on the runner.
"""
import argparse, fnmatch, json, os, re, subprocess

PATHS_A = ["firestore*.json", "**/firestore*", "**/bigquery*", "**/*.sql", "**/api/**", "**/cron/**",
           "**/middleware.*", "**/proxy.*", "cloudbuild*.yaml", "**/cloudbuild*.yaml", "Dockerfile",
           "**/Dockerfile", "terraform/**", "**/*.tf", "firebase.json", "**/sitemap*", "**/auth.*",
           # event-driven handlers run once per event, so any change to them is a cost change
           "**/functions/**"]
PATHS_B = ["**/SKILL.md", "**/skills/**", "**/prompts/**", "**/prompt*", "**/agent/**", "**/agents/**",
           "**/*_agent/**", "agent/**", "AGENTS.md", "**/AGENTS.md", "CLAUDE.md", "**/CLAUDE.md",
           "GEMINI.md", "**/GEMINI.md"]
CONTENT_A = [r"\.collection\(", r"\.where\(", r"collectionGroup\(", r"onSnapshot\(", r"\.getAll\(",
             r"bigquery", r"BigQuery\(", r"--min-instances", r"--concurrency", r"--no-cpu-throttling",
             r"min_instance_count", r"cpu_idle", r"google_sql_database_instance", r"availability_type",
             r"google_firestore_database", r"setInterval\(", r"schedule\s*[:=]",
             r"\* \* \* \*",
             # BigQuery behind a client wrapper, and SQL that loses the result cache
             r"getReport\(", r"runQuery\(", r"createQueryJob", r"[aA]nalyticsClient", r"[rR]eportsClient",
             r"CREATE TEMP FUNCTION",
             # Firestore and Storage event handlers, and Cloud Storage calls
             r"functions\.firestore", r"functions\.storage", r"onDocument(Written|Created|Updated|Deleted)\(",
             r"onObject(Finalized|Deleted)\(", r"\.bucket\(", r"getFiles\("]
CONTENT_B = [r"@google/genai", r"google\.genai", r"from google import genai", r"generate_?[cC]ontent",
             r"google\.adk", r"LlmAgent", r"\bAgent\(", r"root_agent", r"anthropic", r"openai",
             r"vertexai", r"\bgemini-", r"\bclaude-", r"system_instruction", r"systemInstruction",
             r"context_cache", r"max_output_tokens", r"maxOutputTokens"]
DOCS = re.compile(r"\.(md|mdx|txt|rst)$", re.I)          # content checks skip prose; agent .md files match by path
CONFIG = re.compile(r"\.(ya?ml|json|toml|env|ini)$", re.I)  # pass B content checks skip config (model names in env vars)
SKIP = re.compile(r"(^|/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|uv\.lock|poetry\.lock|go\.sum)$"
                  r"|\.(png|jpe?g|gif|webp|svg|ico|woff2?|ttf|pdf|lock)$|(^|/)(test|tests|__tests__)/|\.test\.|_test\.")


def path_match(path, globs):
    return any(fnmatch.fnmatch(path, g) or fnmatch.fnmatch("/" + path, "*/" + g.lstrip("*/")) for g in globs)


def decide(files):
    """files: list of (path, added_text). Returns {'A': [...reasons], 'B': [...reasons]}."""
    why = {"A": [], "B": []}
    for path, added in files:
        if SKIP.search(path):
            continue
        for k, globs, pats in (("A", PATHS_A, CONTENT_A), ("B", PATHS_B, CONTENT_B)):
            if path_match(path, globs):
                why[k].append(f"path {path}")
                continue
            if DOCS.search(path) or (k == "B" and CONFIG.search(path)):
                continue
            hit = next((p for p in pats if re.search(p, added)), None)
            if hit:
                why[k].append(f"content {path} ~ {hit}")
    return why


def files_from_pr(ref):
    repo, n = ref.split("#")
    # --slurp wraps every page in one JSON array, whatever gh puts between pages.
    raw = subprocess.run(["gh", "api", "--paginate", "--slurp", f"repos/{repo}/pulls/{n}/files?per_page=100"],
                         capture_output=True, text=True, check=True).stdout
    items = [f for page in (json.loads(raw) if raw.strip() else []) for f in page]
    return [(f["filename"], "\n".join(l[1:] for l in (f.get("patch") or "").splitlines() if l.startswith("+")))
            for f in items]



def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pass", dest="which", choices=["A", "B"], required=True)
    ap.add_argument("--pr", required=True)
    a = ap.parse_args()
    why = decide(files_from_pr(f"{os.environ['GITHUB_REPOSITORY']}#{a.pr}"))[a.which]
    run = "true" if why else "false"
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a") as f:
            f.write(f"run={run}\n")
    lines = [f"Cost pass {a.which}: {'runs' if why else 'skipped, no matching file'}"] + [f"- {w}" for w in why[:20]]
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as f:
            f.write("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
