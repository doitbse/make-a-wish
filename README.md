# Acme Analytics (`make-a-wish`)

A sample web product surface ("Acme Analytics") featuring charts, KPI metrics, account lists, and an embedded in-app **Make-a-Wish feedback widget**.

This repository serves as the dedicated testbed application to exercise the feedback widget and triage agent flow.

> **Platform Repository**: The autonomous triage agent, Ops Dashboard, embeddable widget engine, and Terraform infrastructure reside in [`doitbse/make-a-wish-platform`](https://github.com/doitbse/make-a-wish-platform).

## Features

- **Analytics Dashboard (`src/app/page.tsx`)**: A realistic analytics page with revenue overview charts, KPIs, and accounts table with deliberate interactive fixtures for testing.
- **Embedded Widget (`src/app/layout.tsx`)**: Embedded via the Make-a-Wish script tag with full shadow DOM isolation, element annotation, and screen capture.
- **Feedback Ingestion Route (`src/app/api/feedback/route.ts`)**: Ingestion route saving submissions directly to Firestore and forwarding to the triage agent service.

## The widget

- **Categories:** Bug, Wish, Confusing, Wrong data, Praise.
- **Free text:** Describing the issue or feature request.
- **Annotate screen:** Hover to highlight any element, click to capture it.
  Each capture records a CSS selector, tag, visible text, and bounding rect,
  and drops a numbered marker on the page. On "Done", a full-page screenshot is
  taken with the numbered markers drawn onto it.
- **Submit:** Sends category, text, annotations, screenshot, and page metadata
  to `/api/feedback`.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>, click the ✨ button bottom-right, and submit feedback.

## Pointing at the triage service

Copy `.env.example` to `.env.local` and set the triage service URL:

```bash
cp .env.example .env.local
echo "TRIAGE_SERVICE_URL=http://localhost:8081" >> .env.local
```

- `TRIAGE_SERVICE_URL`: Base URL of the triage agent service (server-side;
  the widget never calls it directly, avoiding CORS and keeping the screenshot
  off the browser to triage path). When unset, submissions are stored locally but
  not triaged.
- `NEXT_PUBLIC_FEEDBACK_DEBUG=1`: Render the triage agent verdict in the
  widget after a successful submit (handy for demos).

## Inspecting submissions

Stored submissions can be read back via the API:

```bash
curl http://localhost:3000/api/feedback
```

## Notes

- This is a testing UI: the dashboard filter dropdown and refresh button are intentionally inert so that there is something to report.
- The screenshot is captured with [`html-to-image`](https://github.com/bubkoo/html-to-image).
  If a capture fails (e.g. a tainted canvas), the submission still goes through with `screenshot: null`.

