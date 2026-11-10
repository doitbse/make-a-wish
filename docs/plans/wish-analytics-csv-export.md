# Feature Specification: Metrics Dashboard CSV Export

## Executive Summary
Provide a CSV export mechanism within the metrics dashboard (`/analytics`) enabling data analysts and product managers to export session events and key performance indicators directly for offline analysis in spreadsheet tools.

## User Requirements
1. Add an 'Export CSV' button to the header of the metrics dashboard table.
2. Respect currently applied filters (e.g., date ranges, session types, event categories) when exporting data.
3. Trigger client-side generation or streamed server download of a properly formatted RFC 4180 CSV file.
4. Include session metadata: `timestamp`, `session_id`, `user_id`, `event_name`, `page_url`, `duration`, and `properties`.
5. Provide clear loading/disabled feedback during file preparation for large datasets.

## Impacted Components
- `src/app/analytics/page.tsx` or `src/components/analytics/MetricsTable.tsx`: UI button and export trigger.
- `src/lib/export/csv.ts`: Utility function for serializing nested JSON records into RFC 4180 compliant CSV strings with blob download helper.
- `src/app/api/analytics/export/route.ts` (optional/future): Streaming endpoint if dataset size exceeds client-side memory limits.

## Phased Implementation Plan
1. **Phase 1: CSV Utility & Client Download Helper**
   - Implement `exportToCsv(filename: string, rows: Record<string, unknown>[])` using `Blob` and temporary object URL anchor download.
2. **Phase 2: UI Integration**
   - Place an 'Export CSV' button with a download icon next to existing filter controls in the analytics table toolbar.
   - Wire the button click handler to flatten current filtered dataset rows into CSV columns.
3. **Phase 3: Validation & Error Handling**
   - Test edge cases such as empty datasets, values containing commas/quotes/newlines, and large row counts.
   - Ensure accessible button labeling (`aria-label='Export metrics table as CSV'`).

## Testing Strategy
- **Unit Tests**: Test CSV serializer against edge cases (nulls, escaped quotes, special characters).
- **Integration Tests**: Verify click on export button generates valid blob link and file name format (`metrics-export-YYYY-MM-DD.csv`).