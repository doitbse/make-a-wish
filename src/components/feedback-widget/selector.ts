/**
 * DOM inspection helpers for the annotation mode.
 *
 * These run in the browser only — the feedback widget is a client component
 * and these functions are imported from event handlers / effects.
 */

import type { Annotation } from "./types";

/**
 * Build a reasonably unique CSS selector for an element by walking up to
 * <body>, preferring ids, and falling back to `tag:nth-of-type(n)` segments.
 * Depth is capped at 6 to keep selectors readable.
 */
export function buildSelector(el: Element | null): string {
  if (!el) return "";
  const parts: string[] = [];
  let current: Element | null = el;
  let depth = 0;

  while (
    current &&
    current !== document.body &&
    current !== document.documentElement &&
    depth < 6
  ) {
    const node: Element = current;

    // An id is unique enough — stop here.
    if (node.id) {
      parts.unshift(`#${node.id}`);
      break;
    }

    let seg = node.tagName.toLowerCase();

    const parent = node.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === node.tagName,
      );
      if (siblings.length > 1) {
        const idx = siblings.indexOf(node) + 1;
        seg += `:nth-of-type(${idx})`;
      }
    }

    parts.unshift(seg);
    current = parent;
    depth++;
  }

  if (parts.length === 0) return el.tagName.toLowerCase();
  return parts.join(" > ");
}

/** A short, human-readable label like `button.btn-primary` for display. */
export function describeElement(el: Element): string {
  const id = el.id ? `#${el.id}` : "";
  let cls = "";
  if (typeof el.className === "string" && el.className.trim()) {
    cls =
      "." +
      el.className
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .join(".");
  }
  return (el.tagName.toLowerCase() + id + cls).slice(0, 80);
}

/** Truncated visible text for an element. */
export function elementText(el: Element, max = 120): string {
  const raw = (el.textContent || "").replace(/\s+/g, " ").trim();
  if (raw.length <= max) return raw;
  return raw.slice(0, max - 1).trimEnd() + "…";
}

/**
 * Capture a full-page screenshot with numbered markers drawn at each captured
 * annotation's page-relative position. Returns a PNG data URL, or null when the
 * capture fails (e.g. tainted canvas / unavailable APIs).
 */
export async function captureAnnotatedScreenshot(
  annotations: Annotation[],
): Promise<string | null> {
  try {
    // Temporarily clear any hover styling from DOM elements before capture
    document
      .querySelectorAll("[data-maw-hover]")
      .forEach((el) => el.removeAttribute("data-maw-hover"));

    const { toPng } = await import("html-to-image");
    const root = document.documentElement;
    const dataUrl = await toPng(root, {
      backgroundColor: "#ffffff",
      width: root.scrollWidth,
      height: root.scrollHeight,
      filter: (node: Node) => {
        if (node instanceof HTMLElement || node instanceof SVGElement) {
          if (
            node.hasAttribute("data-maw-chrome") ||
            Boolean(node.closest && node.closest("[data-maw-chrome]"))
          ) {
            return false;
          }
        }
        return true;
      },
    });

    if (annotations.length === 0) return dataUrl;

    // Load the base screenshot, draw numbered markers on a canvas, re-export.
    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("failed to load screenshot image"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;

    ctx.drawImage(img, 0, 0);

    // html-to-image renders at devicePixelRatio, so scale CSS px -> device px.
    const scale = canvas.width / root.scrollWidth;

    annotations.forEach((a, i) => {
      const x = (a.rect.x + window.scrollX) * scale;
      const y = (a.rect.y + window.scrollY) * scale;
      const r = 13 * scale;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "#fc3165";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${14 * scale}px "Inter", -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(i + 1), x, y);
    });

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("[make-a-wish] screenshot capture failed:", err);
    return null;
  }
}
