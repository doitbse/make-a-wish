# Review instructions: cost pass A, cloud and data

One of two focused cost passes (pass B covers model and agent cost). Started by `.github/scripts/cost_trigger.py` only
when the PR changes files this pass is about. Its check never fails; its comments are review threads
like any other, so fix or answer them.

## Your only job

Find changes that will make the **cloud bill** grow through data access, scheduled work, paid APIs,
compute settings or paid tiers: per request, per page view, per cron run, per document written, or
as a fixed monthly charge. **Ignore model and LLM cost: another pass reviews prompts, model calls
and agents.** Ignore correctness, style, security and tests unless they change cost.

For every finding, estimate **how often it runs** (per request, per page render, per 404, per cron
tick, per webhook) and **how much it reads or keeps running**, and say what that costs if the guess
is right. A small read on a hot path is worth more than a large read in an admin script.

Go through every numbered item below against the diff before you answer.

**Read past the changed lines.** When the diff touches a function that reads data (a store or
repository function, a query builder, a pagination helper, an API route that lists things), read the
whole function and every helper it calls, and look up who calls it. The diff is where to start, not the
limit: a PR that adds one filter to a query is also a PR about what that query already reads. Judge
the read at the size the data will reach (after an import, a backfill or a year of growth: say what
size you assume), not at today's size. An unbounded read on a screen or list endpoint is a finding
even when the PR only changed one line of it: no limit, a loop that pages through every matching
document, every field loaded when the caller shows a few, or closed and archived records loaded by
default. Name the callers that render it and how often they run.

### Programmatic cost (code)

1. **Firestore / Datastore reads.**
   - A query on a public or hot path (page render, middleware, sitemap, API called by a page) that
     reads a whole collection, a collection group, or every subcollection in a loop (N+1).
   - A query whose filters have **no matching index**. Check any index manifest you can see
     (`firestore*.indexes.json`, Terraform `google_firestore_index`). **On Firestore Enterprise
     edition a query with no index does not fail: it scans the whole collection and bills every
     document scanned.** On Standard it fails with FAILED_PRECONDITION, which is safer. Name the
     composite or single-field index that is missing.
   - A filter applied in memory after a broad query (`.get()` then `.filter(...)`), a fallback that
     scans when the fast path misses (a 404 path is a bot path), a lookup that runs on every request
     and almost always returns nothing.
   - A read whose result could be cached (React `cache`, `unstable_cache`, a CDN, an in-process TTL)
     but is not, on a page that changes rarely.
   - A dedupe or existence check by query when a deterministic document id would make it a single
     `get`.
2. **Writes and index fan-out.** A write on every page view or event into a collection with many
   indexes; a field that holds large text being indexed.
3. **Listeners and polling.** `onSnapshot` on broad queries, client polling loops, `setInterval`
   refreshes, crons that run far more often than the data changes.
4. **BigQuery.** `SELECT *`, no partition filter, a query in a request path, a scheduled query
   rescanning full history.
   - **Queries behind a client.** A call to a report, analytics, warehouse or query client
     (`getReport`, `runQuery`, `createQueryJob`, an `analyticsClient` or `reportsClient`) is a
     BigQuery scan even when the word BigQuery is not in the diff. Count how often it runs: once per
     region, account, customer or item inside a loop or a per-resource provider multiplies the scan.
     Ask whether a free API call (a list call, an existence check) could skip it, or one shared
     account-wide query could replace the per-item ones.
   - **Result cache defeated.** BigQuery serves a repeated identical query from its result cache for
     free, but not when the query is a multi-statement script (`CREATE TEMP FUNCTION`,
     `DECLARE`, `SET`, several statements), uses non-deterministic functions (`CURRENT_TIMESTAMP()`,
     `CURRENT_DATE()`, `RAND()`, `SESSION_USER()`), or writes to a destination table. On a job that
     re-runs the same query (a cron, a cache refresh, a dashboard) say that the cache is lost and how
     to keep it (inline the function as SQL, pass dates as parameters).
5. **Paid third-party APIs.** Search, enrichment, scraping and data APIs billed per call or per
   result (Exa, Tavily, BrightData, SerpAPI, Clearbit, Apollo, and so on). Count calls per day: per
   page view, per webhook, per cron tick, per item. Watch for a sync, reconcile or retry job that
   **creates new paid searches or enrichments on every run** instead of re-reading results it already
   paid for, and for a cron whose frequency multiplies a paid call.
6. **Cloud Run / compute.** `min-instances`, `--no-cpu-throttling` (CPU billed for the whole
   instance lifetime, not per request), low `--concurrency` on an I/O-bound Node service (more
   instances for the same traffic), oversized CPU/memory, `max-instances` raised without a reason.
   - **Slow external calls on the request path.** Auth, session, middleware or layout code that
     calls another API (Google Admin or Groups, a CRM, an identity provider) on every request,
     sequentially or without caching. Seconds per request keep instances busy, and at low
     concurrency that means more instances. Watch for a refresh that is meant to run once an hour
     but cannot persist its result, so it runs on every request after the first hour.

### Tier and licence choices (infra and config)

7. A paid tier or edition chosen without a stated need: Firestore **Enterprise** vs Standard, Cloud
   SQL **HA / Enterprise Plus** for an internal tool with few users, Memorystore Standard vs Basic,
   premium network tier, a reserved/committed resource, a seat-based SaaS plan. Say what feature
   would justify it, and whether the diff uses that feature.

## Severity tags

Start every comment with exactly one tag:

- 🔴 **Important**: likely to cost more than about **$100/month** at the traffic this code will see,
  or a tier choice that multiplies a bill. Give the path, how often it runs, and your estimate.
- 🟡 **Nit**: a real cost leak that is probably small (under about $100/month). At most 3 per review.
- ⚪ **Pre-existing**: a cost problem this PR did not introduce.

Do not use 🟠 or 🟢. In the JSON `severity` field use `🔴` for Important and `🟡` for Nit and Pre-existing;
the tag word (`🔴 **Important**`, `🟡 **Nit**`, `⚪ **Pre-existing**`) starts `comment_text`. If you cannot see the traffic or the index manifest, say what you would check
instead of asserting.

## Evidence

Every finding names `path:line`, how often the code runs, and the fix (index, cache, batch, id
lookup, limit, field mask, config value). Inline comments go on changed lines only: a cost problem in
unchanged lines of a function the diff touches goes on the nearest changed line or in the summary, as
⚪ **Pre-existing** with its own estimate, and it still counts. The summary MUST begin with the exact text `Cost review A:` followed by the counts, for example
`Cost review A: 1 Important, 0 Nit, 0 Pre-existing.`, so this review can be told apart from the general
review and counted. If you find nothing, the summary is exactly `Cost review A: no issues found.`
