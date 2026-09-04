import { NextRequest, NextResponse } from "next/server";
import type { FeedbackSubmission, TriageResult } from "@/components/feedback-widget/types";
import { saveFeedback, getFeedbackList, type StoredFeedback } from "@/lib/feedback-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Persist a feedback submission and forward it to the companion
 * triage service. Stored in Firestore (sascha-playground-doit) with local fallback.
 */
export async function POST(req: NextRequest) {
  let body: FeedbackSubmission;
  try {
    body = (await req.json()) as FeedbackSubmission;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const triageUrl = process.env.TRIAGE_SERVICE_URL?.trim();
  let triage: TriageResult | null = null;
  let triageError: string | null = null;

  if (triageUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90_000);
      const res = await fetch(`${triageUrl.replace(/\/$/, "")}/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        triage = (await res.json()) as TriageResult;
      } else {
        triageError = `triage responded ${res.status}`;
      }
    } catch (err) {
      triageError = err instanceof Error ? err.message : "triage fetch failed";
    }
  }

  // Persist to Firestore / local backup
  let savedRecord: StoredFeedback | null = null;
  try {
    savedRecord = await saveFeedback({
      ...body,
      triage,
      triageError,
      storedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[make-a-wish] failed to persist submission:", err);
  }

  return NextResponse.json({
    ok: true,
    stored: true,
    id: savedRecord?.id,
    source: savedRecord?.source,
    triage,
    triageError,
  });
}

/** Returns stored submissions from Firestore / local backup. */
export async function GET() {
  try {
    const list = await getFeedbackList();
    return NextResponse.json(list);
  } catch (err) {
    console.error("[make-a-wish] failed to fetch feedback list:", err);
    return NextResponse.json([], { status: 500 });
  }
}
