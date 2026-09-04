# make-a-wish

A dummy product surface ("Acme Analytics") with an embedded in-app **feedback
widget**. This is the public testing website for a feedback + triage flow: end
users submit feedback (a wish, bug, confusion, wrong-data report, or praise),
annotate elements directly on the page, and the submission is forwarded to a
companion Gemini triage agent.

> The triage agent itself lives in a **private** companion repo
> (`doitbse/make-a-wish-agent`). This repo is just the UI + capture layer.

## What's here

- **Sample dashboard** (`src/app/page.tsx`) — a realistic-looking analytics page
  (KPIs, a chart, an accounts table) full of distinct DOM elements to annotate.
- **Feedback widget** (`src/components/feedback-widget/`) — a floating ✨ button
  that opens a top-right "Make a wish" modal.
- **Capture API** (`src/app/api/feedback/route.ts`) — persists submissions to
  `data/feedback.json` and forwards them to the triage service.

## The widget

- **Categories:** Bug, Wish, Confusing, Wrong data, Praise.
- **Free text** describing the issue.
- **Annotate screen** — hover to highlight any element, click to capture it.
  Each capture records a CSS selector, tag, visible text, and bounding rect,
  and drops a numbered marker on the page. On "Done", a full-page screenshot is
  taken with the numbered markers drawn onto it.
- **Submit** sends category, text, annotations, screenshot, and page metadata
  to `/api/feedback`.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>, click the ✨ button bottom-right, and submit a
wish.

## Pointing at the triage service

Copy `.env.example` to `.env.local` and set the triage service URL:

```bash
cp .env.example .env.local
echo "TRIAGE_SERVICE_URL=http://localhost:8081" >> .env.local
```

- `TRIAGE_SERVICE_URL` — base URL of the triage agent service (server-side;
  the widget never calls it directly, avoiding CORS and keeping the screenshot
  off the browser→triage path). When unset, submissions are stored locally but
  not triaged.
- `NEXT_PUBLIC_FEEDBACK_DEBUG=1` — render the triage agent's verdict in the
  widget after a successful submit (handy for demos).

## Inspecting submissions

Stored submissions are appended to `data/feedback.json` (gitignored) and can be
read back:

```bash
curl http://localhost:3000/api/feedback
```

## Notes

- This is a **testing** UI — the dashboard's filter dropdown and refresh button
  are intentionally inert so there's something to report.
- The screenshot is captured with [`html-to-image`](https://github.com/bubkoo/html-to-image).
  If a capture fails (e.g. a tainted canvas), the submission still goes through
  with `screenshot: null`.
