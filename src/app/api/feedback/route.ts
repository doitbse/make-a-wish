import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { FeedbackSubmission, TriageResult } from "@/components/feedback-widget/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "feedback.json");

type StoredRecord = FeedbackSubmission & {
  triage: TriageResult | null;
  triageError: string | null;
  storedAt: string;
};

async function readSubmissions(): Promise<StoredRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeSubmissions(subs: StoredRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(subs, null, 2), "utf8");
}

/**
 * Persist a feedback submission and (optionally) forward it to the companion
 * triage service. The triage call is best-effort: a failure never blocks the
 * submission from being stored.
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
      const timeout = setTimeout(() => controller.abort(), 25_000);
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
      triageError =
        err instanceof Error ? err.message : "triage fetch failed";
    }
  }

  // Persist (best-effort — never fail the request on a disk error).
  try {
    const subs = await readSubmissions();
    subs.push({ ...body, triage, triageError, storedAt: new Date().toISOString() });
    await writeSubmissions(subs);
  } catch (err) {
    console.error("[make-a-wish] failed to persist submission:", err);
  }

  return NextResponse.json({ ok: true, stored: true, triage, triageError });
}

/** Returns stored submissions — handy for demos / debugging. */
export async function GET() {
  try {
    return NextResponse.json(await readSubmissions());
  } catch {
    return NextResponse.json([]);
  }
}
