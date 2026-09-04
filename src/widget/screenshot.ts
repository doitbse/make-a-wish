import { toPng } from "html-to-image";

export interface Annotation {
  selector: string;
  tag: string;
  hint: string;
  text: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Build a reasonably unique CSS selector for an element by walking up to
 * <body>, preferring ids, and falling back to tag:nth-of-type(n) segments.
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

/** A short, human-readable label like button.btn-primary for display. */
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
  return raw.slice(0, max - 1).trimEnd() + "...";
}

/**
 * Capture a full-page screenshot with numbered markers drawn at each captured
 * annotation page-relative position. Returns a PNG data URL, or null if capture fails.
 */
export async function captureAnnotatedScreenshot(
  annotations: Annotation[],
): Promise<string | null> {
  try {
    // Clear any hover styling before capture
    document
      .querySelectorAll("[data-maw-hover]")
      .forEach((el) => el.removeAttribute("data-maw-hover"));

    const root = document.documentElement;
    const dataUrl = await toPng(root, {
      backgroundColor: "#ffffff",
      width: root.scrollWidth,
      height: root.scrollHeight,
      filter: (node: Node) => {
        if (node instanceof HTMLElement || node instanceof SVGElement) {
          if (
            node.hasAttribute("data-maw-chrome") ||
            node.tagName.toLowerCase() === "make-a-wish-widget" ||
            Boolean(node.closest && (node.closest("[data-maw-chrome]") || node.closest("make-a-wish-widget")))
          ) {
            return false;
          }
        }
        return true;
      },
    });

    if (annotations.length === 0) return dataUrl;

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

    const scale = canvas.width / root.scrollWidth;

    annotations.forEach((a, i) => {
      const x = (a.rect.x + window.scrollX) * scale;
      const y = (a.rect.y + window.scrollY) * scale;
      const r = 13 * scale;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "#6366f1";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${14 * scale}px Arial, sans-serif`;
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
