import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json(
      { ok: false, error: "Question cannot be empty" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const triageServiceUrl =
    process.env.AGENT_TRIAGE_URL?.trim() ||
    process.env.NEXT_PUBLIC_TRIAGE_URL?.trim() ||
    "http://127.0.0.1:8081";

  try {
    const res = await fetch(`${triageServiceUrl}/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { ok: false, error: `Backend returned ${res.status}: ${errText.slice(0, 200)}` },
        { status: res.status, headers: CORS_HEADERS },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[api/question] Error connecting to triage backend:", msg);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to connect to agent service",
        message: msg,
      },
      { status: 502, headers: CORS_HEADERS },
    );
  }
}
