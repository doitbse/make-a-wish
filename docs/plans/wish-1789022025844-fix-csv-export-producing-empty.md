# Implementation Spec & Proposed Patch: Fix CSV export producing empty 0-byte file on billing report page

**Target Repository**: `doitbse/make-a-wish`
**Target Source File**: `src/app/billing/page.tsx`
**Category**: `bug`
**Change Scope**: `small`

> [!NOTE]
> Automated direct patch application encountered line drift against `main`.
> The validated patch and root cause analysis are committed below for engineering review and 1-click merge.

## User Feedback
> The export to CSV button on the billing report page produces an empty file with zero bytes.

## Root Cause & Diagnosis
The 'Export to CSV' button on the billing report page (src/app/billing/page.tsx) downloads a 0-byte file. The export handler initializes the Blob payload with an empty array `new Blob([])` instead of passing the generated CSV content string, resulting in an empty downloaded file.

## Proposed Patch
```diff
--- a/src/app/billing/page.tsx
+++ b/src/app/billing/page.tsx
@@ -45,3 +45,3 @@
-    const blob = new Blob([], { type: 'text/csv;charset=utf-8;' });
+    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

```
