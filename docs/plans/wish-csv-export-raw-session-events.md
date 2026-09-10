# Implementation Plan: CSV Export for Raw Session Events on Metrics Dashboard

## 1. Executive Summary & Objectives
This specification defines the architecture and phased rollout for enabling raw session event CSV downloads directly from the Acme Analytics metrics dashboard. Currently, the dashboard aggregates metrics and accounts but lacks raw session-level clickstream exports. This feature will allow data analysts to extract filtered, unaggregated session events for offline behavioral analysis, cohort modeling, and auditing without stressing application memory.

## 2. User Requirements & Acceptance Criteria
- Provide an intuitive 'Export CSV' action button in the metrics dashboard header/table toolbar.
- Allow analysts to select time ranges (e.g., Last 24 Hours, Last 7 Days, Last 30 Days, Custom Range).
- Stream raw session event attributes including timestamp, session ID, user ID, event name, page URL, referrer, and custom properties.
- Handle large exports asynchronously with stream piping to avoid server memory saturation and HTTP connection timeouts.
- Support defensive rate-limiting and access permissions so only authorized analysts can extract raw telemetry.

## 3. Proposed Architecture & Impacted Components
- Ingestion & Storage: `src/lib/session-events.ts` (collection helper and query builder over Firestore/BigQuery session event collections).
- Backend Streaming Endpoint: `src/app/api/analytics/events/export/route.ts` (Next.js Route Handler using `TransformStream` and `fast-csv` or native text streaming for Chunked Transfer Encoding).
- Frontend Dashboard: `src/app/page.tsx` (or dedicated client component `src/components/analytics/ExportEventsButton.tsx`) to trigger file download with loading spinners and status toasts.
- Type Definitions: `src/types/analytics.ts` (raw session event schema and export filter query parameters).

## 4. Data Models & API Contracts
```typescript
export interface SessionEventRecord {
  eventId: string;
  sessionId: string;
  userId: string | null;
  timestamp: string;
  eventName: string;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
  properties: Record<string, unknown>;
}

export interface SessionExportQuery {
  startDate: string;
  endDate: string;
  eventName?: string;
  limit?: number;
}
```
API Endpoint:
`GET /api/analytics/events/export?startDate=...&endDate=...`
Response: `Content-Type: text/csv`, `Content-Disposition: attachment; filename="session-events-YYYYMMDD.csv"` with streamed row chunks.

## 5. Phased Implementation Steps
- Phase 1 (Data & Backend): Implement `src/lib/session-events.ts` query abstraction and create `src/app/api/analytics/events/export/route.ts` with streaming response headers and CSV header sanitization to prevent CSV formula injection.
- Phase 2 (Frontend & UI): Build client-side `ExportEventsModal` or button component in `src/app/page.tsx` handling trigger states, date parameters, and direct blob/stream file download.
- Phase 3 (Verification & Documentation): Add unit tests for CSV encoding and stream handling, end-to-end download verification, and update developer documentation.

## 6. Testing, Verification & Rollout Strategy
- Automated unit tests covering CSV formatting, field escaping, and null handling.
- Integration tests ensuring stream cancellation cleans up database query cursors without resource leaks.
- Manual verification of CSV downloads in Excel, Google Sheets, and Pandas.
- Phased rollout gated by feature flag `NEXT_PUBLIC_ENABLE_RAW_EVENT_EXPORT=true`.

## 7. Risks & Mitigation
- Risk: Massive queries causing server memory exhaustion or database query timeouts. Mitigation: Enforce strict maximum export windows (e.g. 30 days) and stream directly via HTTP Chunked Transfer Encoding.
- Risk: CSV Injection (Formula Injection via `=` or `@` characters in user inputs). Mitigation: Sanitize leading formula characters by prefixing single quotes on untrusted strings.
- Risk: Data privacy leaks (PII in event metadata). Mitigation: Filter out sensitive keys (passwords, tokens, credentials) at serialization time.