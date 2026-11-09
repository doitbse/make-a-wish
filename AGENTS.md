<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cost review

**Cost review (layer 4)** runs as two passes, `Cost review A` (cloud and data: reads, indexes, caching,
  crons, paid APIs, Cloud Run, tiers) and `Cost review B` (model and agent: prompts, skills, context
  caching, repeated model work, agent output, model tier), each started only when the PR touches what it
  is about (`.github/scripts/cost_trigger.py`, no model call). Their checks never fail and are not
  required, but their comments are review threads like any other: fix them or answer why not. The
  checklists are `.github/cost-review/pass-a.md` and `pass-b.md`; a new kind of cost bug becomes a new
  item there.
