"use client";

/**
 * Dummy / testing in-app feedback widget.
 *
 * Renders a floating button that opens a "Make a wish" modal (top-right). Users
 * pick a category, describe the issue, and can annotate elements on the page
 * (hover to highlight, click to select). A full-page screenshot with numbered
 * markers is captured on submit and sent — alongside the selector/text metadata
 * — to a companion triage service (see TRIAGE_SERVICE_URL).
 *
 * This widget is intentionally self-contained so it can be dropped onto any
 * page. It talks to the local /api/feedback route, which forwards to the
 * (optional) triage service and persists submissions to data/feedback.json.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  type Annotation,
  type Category,
  type FeedbackSubmission,
  type TriageResult,
} from "./types";
import {
  buildSelector,
  captureAnnotatedScreenshot,
  describeElement,
  elementText,
} from "./selector";

const DEBUG = process.env.NEXT_PUBLIC_FEEDBACK_DEBUG === "1";

type Phase = "idle" | "submitting" | "done";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [text, setText] = useState("");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotating, setAnnotating] = useState(false);
  const [hovered, setHovered] = useState<Element | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  // ---------- Annotation mode ----------

  const exitAnnotation = useCallback(async () => {
    setAnnotating(false);
    // Clear hover styling.
    document
      .querySelectorAll("[data-maw-hover]")
      .forEach((el) => el.removeAttribute("data-maw-hover"));
    setHovered(null);
  }, []);

  const probe = useCallback((x: number, y: number): Element | null => {
    const overlay = overlayRef.current;
    if (!overlay) return null;
    // Temporarily disable the overlay so elementFromPoint sees beneath it.
    overlay.style.pointerEvents = "none";
    const el = document.elementFromPoint(x, y);
    overlay.style.pointerEvents = "auto";
    // Never highlight our own widget chrome.
    if (el && el.closest("[data-maw-chrome]")) return null;
    return el;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = probe(e.clientX, e.clientY);
      if (el === hovered) return;
      hovered?.removeAttribute("data-maw-hover");
      el?.setAttribute("data-maw-hover", "");
      setHovered(el);
    },
    [hovered, probe],
  );

  const onOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const el = probe(e.clientX, e.clientY);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const annotation: Annotation = {
        selector: buildSelector(el),
        tag: el.tagName.toLowerCase(),
        hint: describeElement(el),
        text: elementText(el),
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      };
      setAnnotations((prev) => [...prev, annotation]);
    },
    [probe],
  );

  // ---------- Submit ----------

  const canSubmit =
    phase !== "submitting" && category !== null && text.trim().length > 0;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setPhase("submitting");
    setError(null);

    let shot = screenshot;
    if (shot === null) {
      // Capture screenshot if we haven't yet, automatically excluding the Make-a-Wish UI.
      shot = await captureAnnotatedScreenshot(annotations);
    }
    setScreenshot(shot);

    const payload: FeedbackSubmission = {
      category: category!,
      text: text.trim(),
      annotations,
      screenshot: shot,
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        triage?: TriageResult | null;
        triageError?: string | null;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.triageError || `request failed (${res.status})`);
      }
      setResult(data.triage ?? null);
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "submission failed");
      setPhase("idle");
    }
  }, [canSubmit, category, text, annotations, screenshot]);

  const reset = useCallback(() => {
    setCategory(null);
    setText("");
    setAnnotations([]);
    setScreenshot(null);
    setResult(null);
    setError(null);
    setPhase("idle");
  }, []);

  // Cleanup hover styling on unmount.
  useEffect(() => {
    return () => {
      document
        .querySelectorAll("[data-maw-hover]")
        .forEach((el) => el.removeAttribute("data-maw-hover"));
    };
  }, []);

  // ---------- Render ----------

  return (
    <>
      <style>{`[data-maw-hover]{outline:2px solid #6366f1!important;outline-offset:2px!important;cursor:crosshair!important;}`}</style>

      {/* Floating launcher button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-maw-chrome
          aria-label="Make a wish — send feedback"
          className="fixed bottom-6 right-6 z-[10000] flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition hover:scale-105 hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
        >
          <SparkleIcon className="h-6 w-6" />
        </button>
      )}

      {/* Annotation overlay + markers */}
      {open && annotating && (
        <>
          <div
            ref={overlayRef}
            onMouseMove={onMouseMove}
            onClick={onOverlayClick}
            data-maw-chrome
            className="fixed inset-0 z-[9998] cursor-crosshair"
            style={{ background: "rgba(15,23,42,0.01)" }}
          />
          {annotations.map((a, i) => (
            <span
              key={i}
              data-maw-chrome
              className="pointer-events-none fixed z-[9999] flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white ring-2 ring-white"
              style={{ left: a.rect.x, top: a.rect.y }}
            >
              {i + 1}
            </span>
          ))}
          {/* Annotating pill */}
          <div
            data-maw-chrome
            className="fixed right-4 top-4 z-[10001] flex items-center gap-3 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
          >
            <span className="flex items-center gap-1.5">
              <HighlighterIcon className="h-4 w-4" />
              Annotating… ({annotations.length})
            </span>
            <button
              type="button"
              onClick={async () => {
                await exitAnnotation();
                const shot = await captureAnnotatedScreenshot(annotations);
                setScreenshot(shot);
              }}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-slate-100"
            >
              Done
            </button>
          </div>
        </>
      )}

      {/* Main modal */}
      {open && !annotating && (
        <div
          data-maw-chrome
          className="fixed right-4 top-4 z-[10000] flex max-h-[calc(100vh-2rem)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <SparkleIcon className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Make a wish
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-slate-400 hover:text-slate-600"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {phase === "done" ? (
              <SuccessPanel
                result={DEBUG ? result : null}
                onSendAnother={reset}
                onClose={() => setOpen(false)}
              />
            ) : (
              <>
                {/* Category chips */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const active = category === c.label;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setCategory(c.label)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          active
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span>{c.emoji}</span>
                        {c.label}
                      </button>
                    );
                  })}
                </div>

                {/* Free text */}
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell us more…"
                  rows={4}
                  className="mt-3 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />

                {/* Annotation controls */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAnnotating(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300"
                  >
                    <HighlighterIcon className="h-4 w-4" />
                    {annotations.length > 0
                      ? `Annotate (${annotations.length})`
                      : "Annotate screen"}
                  </button>
                </div>

                {/* Captured annotations */}
                {annotations.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {annotations.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs"
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <code className="block truncate font-mono text-[11px] text-indigo-700">
                            {a.hint}
                          </code>
                          <p className="truncate text-slate-500">{a.text}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setAnnotations((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                          aria-label="Remove annotation"
                          className="text-slate-300 hover:text-red-500"
                        >
                          <CloseIcon className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Screenshot thumbnail */}
                {screenshot && (
                  <div className="mt-3">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Screenshot
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshot}
                      alt="Annotated screenshot"
                      className="w-full rounded-lg border border-slate-200"
                    />
                  </div>
                )}

                {error && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    {error}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {phase !== "done" && (
            <div className="border-t border-slate-100 px-4 py-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {phase === "submitting" ? "Sending…" : "Send wish"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ---------- Sub-components & icons ----------

function SuccessPanel({
  result,
  onSendAnother,
  onClose,
}: {
  result: TriageResult | null;
  onSendAnother: () => void;
  onClose: () => void;
}) {
  return (
    <div className="py-2">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckIcon className="h-5 w-5" />
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-900">
          Thanks! Your wish was received.
        </p>
      </div>

      {result && (
        <TriageVerdict result={result} />
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onSendAnother}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          Send another
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/**
 * Renders the triage service's verdict. Field names match the API contract in
 * the companion repo (make-a-wish-agent): confirmed_category, priority,
 * severity, title, summary, suggested_labels, suggested_team, confidence, …
 */
function TriageVerdict({ result }: { result: TriageResult }) {
  const str = (k: string) =>
    typeof result[k] === "string" ? (result[k] as string) : undefined;
  const num = (k: string) =>
    typeof result[k] === "number" ? (result[k] as number) : undefined;
  const arr = (k: string) =>
    Array.isArray(result[k]) ? (result[k] as unknown[]) : undefined;

  const category = str("confirmed_category");
  const priority = str("priority");
  const severity = str("severity");
  const title = str("title");
  const summary = str("summary");
  const team = str("suggested_team");
  const labels = arr("suggested_labels")?.map(String);
  const confidence = num("confidence");
  const mode = str("mode");

  const rows: { k: string; v: string }[] = [];
  if (category) rows.push({ k: "category", v: category });
  if (priority) rows.push({ k: "priority", v: priority });
  if (severity) rows.push({ k: "severity", v: severity });
  if (team) rows.push({ k: "team", v: team });
  if (confidence !== undefined)
    rows.push({ k: "confidence", v: `${Math.round(confidence * 100)}%` });

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
      <p className="mb-1.5 flex items-center gap-1.5 font-semibold text-slate-700">
        Triage agent
        {mode && (
          <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
            {mode}
          </span>
        )}
      </p>
      {title && <p className="mb-1 font-medium text-slate-900">{title}</p>}
      {summary && <p className="mb-1.5 text-slate-600">{summary}</p>}
      {rows.length > 0 && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
          {rows.map((r) => (
            <div key={r.k} className="contents">
              <dt className="text-slate-400">{r.k}</dt>
              <dd className="text-slate-700">{r.v}</dd>
            </div>
          ))}
        </dl>
      )}
      {labels && labels.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {labels.map((l) => (
            <span
              key={l}
              className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
            >
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11l.9 2.6L22.5 17l-2.6.9L19 20l-.9-2.1L15.5 17l2.6-.9L19 13zM5 14l.7 2L7.7 17l-2 .7L5 19l-.7-1.3L2.3 17l2-.7L5 14z" />
    </svg>
  );
}

function HighlighterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 11-6 6v3h3l6-6" />
      <path d="m22 5-3-3-9 9 3 3 9-9z" />
      <path d="m15 6 3 3" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
