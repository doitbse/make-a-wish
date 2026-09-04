import { NextRequest, NextResponse } from "next/server";
import type { FeedbackSubmission, TriageResult } from "@/components/feedback-widget/types";
import {
  saveFeedback,
  updateFeedback,
  getFeedbackList,
  type StoredFeedback,
} from "@/lib/feedback-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Make-A-Wish-App",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Background worker to run Gemini agent triage asynchronously.
 * Keeps user response time < 150ms and prevents HTTP connection timeouts.
 */
async function triggerBackgroundTriage(
  feedbackId: string,
  submission: FeedbackSubmission,
  triageUrl: string,
) {
  console.log(`[make-a-wish] Starting background triage for submission ${feedbackId}...`);
  try {
    const controller = new AbortController();
    // 10-minute timeout for multi-step agent reasoning, repo inspection, and PR creation
    const timeout = setTimeout(() => controller.abort(), 600_000);
    const res = await fetch(`${triageUrl.replace(/\/$/, "")}/triage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const triage = (await res.json()) as TriageResult;
      await updateFeedback(feedbackId, {
        triage,
        status: "triaged",
        triageError: null,
        triagedAt: new Date().toISOString(),
      });
      console.log(`[make-a-wish] Successfully completed triage for ${feedbackId}.`);
    } else {
      const errorText = await res.text();
      await updateFeedback(feedbackId, {
        status: "triage_failed",
        triageError: `triage responded ${res.status}: ${errorText.slice(0, 200)}`,
      });
      console.warn(`[make-a-wish] Triage returned status ${res.status} for ${feedbackId}.`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "triage fetch failed";
    console.error(`[make-a-wish] Background triage error for ${feedbackId}:`, message);
    await updateFeedback(feedbackId, {
      status: "triage_failed",
      triageError: message,
    });
  }
}

/**
 * Persist a feedback submission immediately to Firestore and respond instantly (<150ms).
 * AI triage executes asynchronously in the background.
 */
export async function POST(req: NextRequest) {
  let body: FeedbackSubmission;
  try {
    body = (await req.json()) as FeedbackSubmission;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400, headers: CORS_HEADERS });
  }

  // 1. Immediately persist to Firestore / local backup
  let savedRecord: StoredFeedback | null = null;
  try {
    savedRecord = await saveFeedback({
      ...body,
      status: "pending_triage",
      triage: null,
      triageError: null,
      storedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[make-a-wish] failed to persist submission:", err);
  }

  // 2. Fire asynchronous background triage without blocking HTTP response
  const triageUrl = process.env.TRIAGE_SERVICE_URL?.trim();
  if (triageUrl && savedRecord?.id) {
    triggerBackgroundTriage(savedRecord.id, body, triageUrl).catch((err) => {
      console.error("[make-a-wish] unhandled error in background triage:", err);
    });
  }

  // 3. Return immediate 200 OK so client sees instant confirmation
  return NextResponse.json(
    {
      ok: true,
      stored: true,
      id: savedRecord?.id,
      source: savedRecord?.source,
      status: "pending_triage",
    },
    { headers: CORS_HEADERS },
  );
}

/** Returns stored submissions from Firestore / local backup. */
export async function GET() {
  try {
    const list = await getFeedbackList();
    return NextResponse.json(list, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[make-a-wish] failed to fetch feedback list:", err);
    return NextResponse.json([], { status: 500, headers: CORS_HEADERS });
  }
}
