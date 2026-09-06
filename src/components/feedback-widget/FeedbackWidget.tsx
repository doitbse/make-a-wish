"use client";

/**
 * Dummy / testing in-app feedback widget.
 *
 * Renders a floating button that opens a "Make a wish" modal (top-right). Users
 * pick a category, describe the issue, and can annotate elements on the page
 * (hover to highlight, click to select). A full-page screenshot with numbered
 * markers is captured on submit and sent (alongside the selector/text metadata)
 * to a companion triage service (see TRIAGE_SERVICE_URL).
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
  const [agentEngine] = useState<"both" | "adk" | "managed-agent">("adk");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalPos, setModalPos] = useState<{ x: number; y: number } | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const onHeaderPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (e.button !== 0) return;
    e.preventDefault();

    const modal = modalRef.current;
    if (!modal) return;
    const rect = modal.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = rect.left;
    const initialTop = rect.top;

    const onPointerMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - startX;
      const dy = moveEv.clientY - startY;
      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;
      const pad = 8;
      const maxLeft = Math.max(pad, window.innerWidth - rect.width - pad);
      const maxTop = Math.max(pad, window.innerHeight - rect.height - pad);
      newLeft = Math.max(pad, Math.min(maxLeft, newLeft));
      newTop = Math.max(pad, Math.min(maxTop, newTop));
      setModalPos({ x: newLeft, y: newTop });
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  }, []);

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
      setAnnotations((prev) => {
        const next = [...prev, annotation];
        const count = next.length;
        setText((currentText) => {
          if (count === 1) {
            if (!currentText.trim()) return "(1) ";
            if (!currentText.includes("(1)")) return currentText.trimEnd() + "\n(1) ";
            return currentText;
          }
          if (!currentText.includes(`(${count})`)) {
            return currentText.trimEnd() + `\n(${count}) `;
          }
          return currentText;
        });
        return next;
      });
    },
    [probe],
  );

  // ---------- Submit ----------

  const meaningfulText = text.replace(/\(\d+\)\s*/g, "").trim();
  const canSubmit =
    phase !== "submitting" && category !== null && meaningfulText.length > 0;

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
      agentMode: agentEngine,
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
  }, [canSubmit, category, text, annotations, screenshot, agentEngine]);

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
      <style>{`[data-maw-hover]{outline:2px solid #fc3165!important;outline-offset:2px!important;cursor:crosshair!important;}`}</style>

      {/* Floating launcher button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-maw-chrome
          aria-label="Make a wish: send feedback"
          className="fixed bottom-6 right-6 z-[10000] flex h-12 items-center gap-2 rounded-full bg-[#d42955] px-4 font-medium text-sm text-white shadow-lg shadow-[#d42955]/30 transition hover:scale-105 hover:bg-[#fc3165] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#fc3165]/30"
        >
          <SparkleIcon className="h-5 w-5" />
          <span>Make a wish</span>
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
              className="pointer-events-none fixed z-[9999] flex h-6 w-6 items-center justify-center rounded-full bg-[#fc3165] text-xs font-bold text-white ring-2 ring-white shadow-md"
              style={{ left: a.rect.x, top: a.rect.y }}
            >
              {i + 1}
            </span>
          ))}
          {/* Annotating pill */}
          <div
            data-maw-chrome
            className="fixed right-4 top-4 z-[10001] flex items-center gap-3 rounded-full bg-[#1a1a2e] border border-white/10 px-4 py-2 text-sm text-white shadow-xl"
          >
            <span className="flex items-center gap-1.5 font-normal">
              <HighlighterIcon className="h-4 w-4 text-[#fc3165]" />
              Annotating elements ({annotations.length})
            </span>
            <button
              type="button"
              onClick={async () => {
                await exitAnnotation();
                const shot = await captureAnnotatedScreenshot(annotations);
                setScreenshot(shot);
                setTimeout(() => {
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                    const len = textareaRef.current.value.length;
                    textareaRef.current.setSelectionRange(len, len);
                  }
                }, 50);
              }}
              className="rounded-full bg-[#d42955] px-3.5 py-1 text-xs font-medium text-white hover:bg-[#fc3165] transition"
            >
              Done
            </button>
          </div>
        </>
      )}

      {/* Main modal */}
      {open && !annotating && (
        <div
          ref={modalRef}
          data-maw-chrome
          style={
            modalPos
              ? { left: `${modalPos.x}px`, top: `${modalPos.y}px`, right: "auto", bottom: "auto" }
              : undefined
          }
          className="fixed right-4 bottom-20 z-[10000] flex max-h-[calc(100vh-6rem)] w-[min(92vw,388px)] flex-col overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_20px_40px_rgba(15,23,42,0.08)] touch-none"
        >
          {/* Top accent wash */}
          <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#fc3165]/35 via-[#ff7d9a]/15 to-transparent" />

          {/* Header */}
          <div
            onPointerDown={onHeaderPointerDown}
            title="Drag to move"
            className="flex items-center justify-between border-b border-[#e5e7eb] bg-white/95 px-4 py-3 cursor-grab select-none active:cursor-grabbing backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#9ca3af] hover:text-[#fc3165] flex items-center transition-colors" aria-hidden="true" title="Drag to move">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <circle cx="8" cy="6" r="1.5" />
                  <circle cx="16" cy="6" r="1.5" />
                  <circle cx="8" cy="12" r="1.5" />
                  <circle cx="16" cy="12" r="1.5" />
                  <circle cx="8" cy="18" r="1.5" />
                  <circle cx="16" cy="18" r="1.5" />
                </svg>
              </span>
              <SparkleIcon className="h-4 w-4 text-[#fc3165]" />
              <h2 className="font-serif text-[18px] font-normal tracking-[-0.5px] text-[#1a1a2e]">
                Make a wish
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-[6.5px] p-1 text-[#9ca3af] hover:bg-[#f8f9fa] hover:text-[#1a1a2e] cursor-pointer transition-colors"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {phase === "done" ? (
              <SuccessPanel
                result={DEBUG ? result : null}
                agentEngine={agentEngine}
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
                            ? "border-[#fc3165] bg-[#fc3165]/10 text-[#fc3165]"
                            : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-[#fc3165]/40 hover:text-[#1a1a2e] hover:bg-[#f8f9fa]"
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
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell us what you would like to see or fix..."
                  rows={4}
                  className="mt-3 w-full resize-none rounded-[10px] border border-[#e5e7eb] px-3 py-2 text-sm text-[#1a1a2e] placeholder:text-[#9ca3af] focus:border-[#fc3165] focus:outline-none focus:ring-2 focus:ring-[#fc3165]/15"
                />

                {/* Annotation controls */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!text.trim()) {
                        setText("(1) ");
                      }
                      setAnnotating(true);
                    }}
                    className="flex items-center gap-1.5 rounded-[6.5px] border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium text-[#1a1a2e] hover:border-[#fc3165] hover:text-[#fc3165] transition"
                  >
                    <HighlighterIcon className="h-4 w-4 text-[#fc3165]" />
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
                        className="flex items-start gap-2 rounded-[10px] border border-[#e5e7eb] bg-[#f8f9fa] px-2.5 py-1.5 text-xs"
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fc3165] text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <code className="block truncate font-mono text-[11px] text-[#fc3165]">
                            {a.hint}
                          </code>
                          <p className="truncate text-[#6b7280]">{a.text}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setAnnotations((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                          aria-label="Remove annotation"
                          className="text-[#9ca3af] hover:text-[#dc2626]"
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
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[#9ca3af]">
                      Screenshot
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshot}
                      alt="Annotated screenshot"
                      className="w-full rounded-[10px] border border-[#e5e7eb]"
                    />
                  </div>
                )}

                {error && (
                  <p className="mt-3 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    {error}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {phase !== "done" && (
            <div className="border-t border-[#e5e7eb] px-4 py-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full rounded-full bg-[#d42955] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#fc3165] disabled:cursor-not-allowed disabled:bg-[#e5e7eb] disabled:text-[#9ca3af]"
              >
                {phase === "submitting" ? "Sending..." : "Send wish"}
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
  agentEngine,
  onSendAnother,
  onClose,
}: {
  result: TriageResult | null;
  agentEngine?: "both" | "adk" | "managed-agent";
  onSendAnother: () => void;
  onClose: () => void;
}) {
  return (
    <div className="py-2">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fc3165]/10 text-[#fc3165]">
          <CheckIcon className="h-6 w-6" />
        </div>
        <p className="mt-3 font-serif text-[18px] font-normal tracking-[-0.5px] text-[#1a1a2e]">
          Thanks! Your wish was received.
        </p>
        {!result && (
          <div className="mt-2 space-y-1 text-xs text-[#6b7280]">
            <p>
              {agentEngine === "both"
                ? "Both Google ADK and Vertex Managed Agent are triaging your feedback concurrently to generate and compare pull requests."
                : agentEngine === "adk"
                  ? "Google ADK Agent is triaging your feedback in the background."
                  : "Vertex AI Managed Agent is triaging your feedback in the background."}
            </p>
            <p className="font-mono text-[11px] text-[#9ca3af]">
              Model: gemini-3.8-flash (global)
            </p>
          </div>
        )}
      </div>

      {result && (
        <TriageVerdict result={result} />
      )}

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onSendAnother}
          className="flex-1 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-2 text-xs font-medium text-[#1a1a2e] hover:border-[#fc3165] hover:text-[#fc3165] transition"
        >
          Send another
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-full bg-[#d42955] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#fc3165] transition"
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
    <div className="mt-3 rounded-[10px] border border-[#e5e7eb] bg-[#f8f9fa] p-3 text-xs">
      <p className="mb-1.5 flex items-center gap-1.5 font-semibold text-[#1a1a2e]">
        Triage agent
        {mode && (
          <span className="rounded-full bg-[#e5e7eb] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6b7280]">
            {mode}
          </span>
        )}
      </p>
      {title && <p className="mb-1 font-medium text-[#1a1a2e]">{title}</p>}
      {summary && <p className="mb-1.5 text-[#6b7280]">{summary}</p>}
      {rows.length > 0 && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
          {rows.map((r) => (
            <div key={r.k} className="contents">
              <dt className="text-[#9ca3af]">{r.k}</dt>
              <dd className="text-[#1a1a2e]">{r.v}</dd>
            </div>
          ))}
        </dl>
      )}
      {labels && labels.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {labels.map((l) => (
            <span
              key={l}
              className="rounded-full bg-[#fc3165]/10 px-2 py-0.5 text-[10px] font-medium text-[#fc3165]"
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
