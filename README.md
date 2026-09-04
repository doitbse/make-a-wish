# Acme Analytics (`make-a-wish`)

A sample web product surface ("Acme Analytics") featuring charts, KPI metrics, account lists, and an embedded in-app **Make-a-Wish feedback widget**.

This repository serves as the dedicated testbed application to exercise the feedback widget and triage agent flow.

> **Platform Repository**: The autonomous triage agent, Ops Dashboard, embeddable widget engine, and Terraform infrastructure reside in [`doitbse/make-a-wish-agent`](https://github.com/doitbse/make-a-wish-agent).

## Features

- **Analytics Dashboard (`src/app/page.tsx`)**: A realistic analytics page with revenue overview charts, KPIs, and accounts table with deliberate interactive fixtures for testing.
- **Embedded Widget (`layout.tsx`)**: Embedded via the Make-a-Wish script tag with full shadow DOM isolation, element annotation, and screen capture.
- **Feedback Ingestion Route (`src/app/api/feedback/route.ts`)**: Local ingestion route forwarding submissions to the triage agent service.

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

- This is a testing UI: the dashboard filter dropdown and refresh button are intentionally inert so that there is something to report.
- The screenshot is captured with [`html-to-image`](https://github.com/bubkoo/html-to-image).
  If a capture fails (e.g. a tainted canvas), the submission still goes through with `screenshot: null`.
