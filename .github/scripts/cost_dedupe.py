"""Delete cost-review comments that repeat a finding already on the PR. Runs after each cost pass.

Every push re-runs the cost review over the whole diff, and the model does not reliably remember what it said
last time: on doitbse/resolve-ai#120 (2026-11) the same 🔴 landed three times on one line and its author
answered it three times. A new comment from this run is a repeat when an earlier comment of the same pass sits
on the same file within SLACK lines and is not outdated. Outdated means GitHub no longer maps it to a line
(`line` is null) because the code under it changed: then the new comment is about new code and stays.

Resolved and answered threads count as earlier comments: an author who answered "intentional" has decided.
Only the same pass counts: passes A and B review different things on every push, so a pass B finding next to a
pass A one is a second finding, not a repeat. And only a review of the PR's current head commit is "this run":
if the review step failed and posted nothing, the newest review is an earlier run's and is left alone.

  python3 cost_dedupe.py --pass A --pr 123      # GH_TOKEN and GITHUB_REPOSITORY from the workflow

Never fails the job: a cleanup that errors leaves the repeats in place and says so.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys

MARKER = re.compile(r"Cost review ([AB]):")
SLACK = 2


def cost_reviews(reviews, which=None):
    """{review id: pass} for reviews whose summary carries the cost marker (of `which`, or either pass)."""
    out = {}
    for r in reviews:
        m = MARKER.search(r.get("body") or "")
        if m and (which is None or m.group(1) == which):
            out[r["id"]] = m.group(1)
    return out


def repeats(comments, reviews, which, head_sha=None):
    """Ids of top-level comments in the newest `which` cost review that repeat an earlier one of the same pass.
    With head_sha, the newest review must be on that commit (this run's), else nothing is touched."""
    mine = cost_reviews(reviews, which)
    if not mine:
        return []
    by_id = {r["id"]: r for r in reviews}
    # Review ids only grow, so they break a tie between reviews submitted in the same second.
    latest = max(mine, key=lambda rid: (by_id[rid].get("submitted_at") or "", rid))
    if head_sha and by_id[latest].get("commit_id") != head_sha:
        return []
    top = [c for c in comments if not c.get("in_reply_to_id")]
    new = [c for c in top if c.get("pull_request_review_id") == latest and c.get("line") is not None]
    old = [c for c in top if c.get("pull_request_review_id") in mine and c.get("pull_request_review_id") != latest
           and c.get("line") is not None]
    return [n["id"] for n in new
            if any(o["path"] == n["path"] and abs(o["line"] - n["line"]) <= SLACK for o in old)]


def gh(args):
    res = subprocess.run(["gh", "api", *args], capture_output=True, text=True, check=False)
    if res.returncode:
        raise RuntimeError(res.stderr.strip()[-300:] or f"exit status {res.returncode}")
    return res.stdout


def pages(path):
    raw = gh(["--paginate", "--slurp", f"{path}?per_page=100"])
    return [x for page in (json.loads(raw) if raw.strip() else []) for x in page]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pass", dest="which", choices=["A", "B"], required=True)
    ap.add_argument("--pr", required=True)
    a = ap.parse_args()
    repo = os.environ["GITHUB_REPOSITORY"]
    try:
        head = json.loads(gh([f"repos/{repo}/pulls/{a.pr}"]))["head"]["sha"]
        comments = pages(f"repos/{repo}/pulls/{a.pr}/comments")
        reviews = pages(f"repos/{repo}/pulls/{a.pr}/reviews")
        ids = repeats(comments, reviews, a.which, head)
        for cid in ids:
            gh(["-X", "DELETE", f"repos/{repo}/pulls/comments/{cid}"])
        msg = f"Cost pass {a.which}: removed {len(ids)} repeated finding(s)" if ids else \
            f"Cost pass {a.which}: no repeated findings"
    except Exception as e:  # noqa: BLE001  never fail the review over its cleanup
        msg = f"::warning::Cost pass {a.which}: could not remove repeated findings: {e}"
    print(msg)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as f:
            f.write(msg.replace("::warning::", "") + "\n")


if __name__ == "__main__":
    sys.exit(main())
