import { Annotation, buildSelector, captureAnnotatedScreenshot, describeElement, elementText } from "./screenshot";

export interface WidgetConfig {
  appId: string;
  repo: string;
  repos?: string[];
  apiUrl: string;
  userEmail?: string;
  position?: "bottom-right" | "bottom-left";
}

export function parseRepos(reposAttr?: string | null, repoAttr?: string | null): string[] {
  const result: string[] = [];
  const parseRaw = (val?: string | null) => {
    if (!val) return;
    const trimmed = val.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (typeof item === "string" && item.trim()) {
              result.push(item.trim());
            }
          }
          return;
        }
      } catch {
        // Fall back to comma splitting
      }
    }
    for (const part of trimmed.split(",")) {
      const clean = part.trim();
      if (clean && !result.includes(clean)) {
        result.push(clean);
      }
    }
  };

  parseRaw(reposAttr);
  parseRaw(repoAttr);
  return Array.from(new Set(result));
}

export type Category = "Bug" | "Idea" | "Question" | "Praise";

const CATEGORIES: { label: Category; emoji: string }[] = [
  { label: "Bug", emoji: "🐛" },
  { label: "Idea", emoji: "💡" },
  { label: "Question", emoji: "❓" },
  { label: "Praise", emoji: "❤️" },
];

export class MakeAWishWidgetUI {
  private root: ShadowRoot;
  private config: WidgetConfig;
  private isOpen = false;
  private isAnnotating = false;
  private isSubmitting = false;
  private isDone = false;
  private selectedCategory: Category | null = "Bug";
  private textValue = "";
  private annotations: Annotation[] = [];
  private screenshotDataUrl: string | null = null;
  private errorMessage: string | null = null;
  private modalPos: { x: number; y: number } | null = null;
  private shouldFocusTextarea = false;

  // External DOM elements for annotation
  private annotationOverlay: HTMLDivElement | null = null;
  private annotationPill: HTMLDivElement | null = null;
  private hoveredElement: Element | null = null;
  private pinElements: HTMLElement[] = [];

  constructor(root: ShadowRoot, config: WidgetConfig) {
    this.root = root;
    this.config = config;
    window.addEventListener("resize", () => {
      if (this.modalPos && this.isOpen) {
        const modal = this.root.querySelector(".maw-modal") as HTMLElement | null;
        if (modal) {
          const rect = modal.getBoundingClientRect();
          const pad = 8;
          const maxLeft = Math.max(pad, window.innerWidth - rect.width - pad);
          const maxTop = Math.max(pad, window.innerHeight - rect.height - pad);
          this.modalPos.x = Math.max(pad, Math.min(maxLeft, this.modalPos.x));
          this.modalPos.y = Math.max(pad, Math.min(maxTop, this.modalPos.y));
          modal.style.left = `${this.modalPos.x}px`;
          modal.style.top = `${this.modalPos.y}px`;
        }
      }
    });
    this.render();
  }

  public updateConfig(newConfig: Partial<WidgetConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.render();
  }

  private hasMeaningfulText(): boolean {
    const stripped = this.textValue.replace(/\(\d+\)\s*/g, "").trim();
    return stripped.length > 0;
  }

  private render() {
    this.root.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400&display=swap');

        :host {
          all: initial;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #1a1a2e;
          line-height: 1.5;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
        }
        * {
          box-sizing: border-box;
        }
        .maw-launcher {
          position: fixed;
          ${this.config.position === "bottom-left" ? "left: 24px;" : "right: 24px;"}
          bottom: 24px;
          z-index: 2147483640;
          display: flex;
          align-items: center;
          gap: 8px;
          height: 46px;
          padding: 0 18px;
          border-radius: 20px;
          background: #d42955;
          color: #ffffff;
          border: none;
          box-shadow: 0 8px 20px -4px rgba(212, 41, 85, 0.35), 0 4px 6px -2px rgba(212, 41, 85, 0.2);
          cursor: pointer;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: -0.2px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
        }
        .maw-launcher:hover {
          transform: translateY(-2px);
          background: #fc3165;
          box-shadow: 0 12px 24px -4px rgba(252, 49, 101, 0.45);
        }
        .maw-launcher svg {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }
        .maw-modal {
          position: fixed;
          ${this.config.position === "bottom-left" ? "left: 24px;" : "right: 24px;"}
          bottom: 84px;
          z-index: 2147483641;
          width: min(92vw, 388px);
          max-height: calc(100vh - 100px);
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(15, 23, 42, 0.08) 0px 20px 40px, rgba(0, 0, 0, 0.04) 0px 4px 6px -4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: maw-pop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          touch-action: none;
        }
        .maw-modal.is-dragging {
          user-select: none;
          -webkit-user-select: none;
          box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(15, 23, 42, 0.16) 0px 25px 50px, rgba(0, 0, 0, 0.08) 0px 8px 12px -4px;
        }
        @keyframes maw-pop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .maw-top-accent {
          height: 3px;
          width: 100%;
          background: linear-gradient(to right, rgba(252, 49, 101, 0.35), rgba(255, 125, 154, 0.15) 70%, rgba(252, 49, 101, 0.05));
          flex-shrink: 0;
        }
        .maw-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          border-bottom: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.95);
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
        }
        .maw-header:active,
        .maw-modal.is-dragging .maw-header {
          cursor: grabbing;
        }
        .maw-drag-handle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          margin-right: 4px;
          cursor: grab;
          transition: color 0.15s ease;
        }
        .maw-header:hover .maw-drag-handle {
          color: #fc3165;
        }
        .maw-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Source Serif 4', 'moderatSerif', Georgia, 'Times New Roman', serif;
          font-weight: 400;
          font-size: 18px;
          letter-spacing: -0.5px;
          color: #1a1a2e;
        }
        .maw-title-icon {
          width: 18px;
          height: 18px;
          color: #fc3165;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          flex-shrink: 0;
        }
        .maw-badge {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.35px;
          color: #fc3165;
          background: rgba(252, 49, 101, 0.08);
          border: 1px solid rgba(252, 49, 101, 0.18);
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .maw-close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 5px;
          border-radius: 6.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .maw-close-btn:hover {
          color: #1a1a2e;
          background: #f8f9fa;
        }
        .maw-body {
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .maw-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .maw-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .maw-chip:hover {
          border-color: rgba(252, 49, 101, 0.4);
          color: #1a1a2e;
          background: #f8f9fa;
        }
        .maw-chip.active {
          background: rgba(252, 49, 101, 0.09);
          color: #fc3165;
          border-color: #fc3165;
          font-weight: 500;
        }
        .maw-textarea {
          width: 100%;
          min-height: 96px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #1a1a2e;
          resize: vertical;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
        }
        .maw-textarea::placeholder {
          color: #9ca3af;
        }
        .maw-textarea:focus {
          border-color: #fc3165;
          box-shadow: 0 0 0 3px rgba(252, 49, 101, 0.12);
        }
        .maw-annotate-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: #f8f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        }
        .maw-annotate-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          padding: 6px 12px;
          border-radius: 6.5px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #1a1a2e;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .maw-annotate-btn svg {
          color: #fc3165;
        }
        .maw-annotate-btn:hover {
          border-color: #fc3165;
          color: #fc3165;
          background: #ffffff;
        }
        .maw-screenshot-preview {
          position: relative;
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          max-height: 140px;
        }
        .maw-screenshot-preview img {
          width: 100%;
          height: auto;
          display: block;
        }
        .maw-remove-shot {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(26, 26, 46, 0.8);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          width: 22px;
          height: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: background-color 0.15s ease;
        }
        .maw-remove-shot:hover {
          background: #fc3165;
        }
        .maw-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 4px;
        }
        .maw-submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #d42955;
          color: #ffffff;
          border: none;
          padding: 12px 18px;
          border-radius: 20px;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
        }
        .maw-submit-btn:hover:not(:disabled) {
          background: #fc3165;
        }
        .maw-submit-btn:disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .maw-error {
          padding: 8px 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
          font-size: 12px;
        }
        .maw-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 8px;
          gap: 12px;
        }
        .maw-success-icon {
          width: 52px;
          height: 52px;
          border-radius: 9999px;
          background: rgba(252, 49, 101, 0.10);
          color: #fc3165;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .maw-success-icon svg {
          width: 28px;
          height: 28px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.5;
        }
        .maw-success-title {
          font-family: 'Source Serif 4', 'moderatSerif', Georgia, serif;
          font-weight: 400;
          font-size: 20px;
          letter-spacing: -0.5px;
          color: #1a1a2e;
        }
        .maw-success-desc {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
        }
        .maw-secondary-btn {
          margin-top: 8px;
          background: #f8f9fa;
          color: #1a1a2e;
          border: 1px solid #e5e7eb;
          padding: 8px 18px;
          border-radius: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .maw-secondary-btn:hover {
          border-color: #fc3165;
          color: #fc3165;
          background: #ffffff;
        }
      </style>

      ${
        !this.isOpen
          ? `
        <button type="button" class="maw-launcher" id="mawLauncherBtn" data-maw-chrome>
          <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
          Make a wish
        </button>
      `
          : ""
      }

      ${
        this.isOpen && !this.isAnnotating
          ? `
        <div class="maw-modal" data-maw-chrome ${
          this.modalPos
            ? `style="left:${this.modalPos.x}px;top:${this.modalPos.y}px;right:auto;bottom:auto;animation:none;"`
            : ""
        }>
          <div class="maw-top-accent"></div>
          <div class="maw-header" id="mawHeader" title="Drag to move">
            <div class="maw-title">
              <span class="maw-drag-handle" aria-hidden="true" title="Drag to move">
                <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;">
                  <circle cx="8" cy="6" r="1.5" />
                  <circle cx="16" cy="6" r="1.5" />
                  <circle cx="8" cy="12" r="1.5" />
                  <circle cx="16" cy="12" r="1.5" />
                  <circle cx="8" cy="18" r="1.5" />
                  <circle cx="16" cy="18" r="1.5" />
                </svg>
              </span>
              <svg class="maw-title-icon" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
              Make a wish
              ${this.config.appId ? `<span class="maw-badge">${this.escapeHtml(this.config.appId)}</span>` : ""}
            </div>
            <button type="button" class="maw-close-btn" id="mawCloseBtn" aria-label="Close">
              <svg style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="maw-body">
            ${
              this.isDone
                ? `
              <div class="maw-success">
                <div class="maw-success-icon">
                  <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div class="maw-success-title">Wish received!</div>
                <div class="maw-success-desc">
                  Our autonomous triage agent will inspect the request, test the code, and open a pull request on GitHub.
                </div>
                <button type="button" class="maw-secondary-btn" id="mawResetBtn">Send another wish</button>
              </div>
            `
                : `
              <div class="maw-categories">
                ${CATEGORIES.map(
                  (c) => `
                  <button type="button" class="maw-chip ${this.selectedCategory === c.label ? "active" : ""}" data-category="${c.label}">
                    <span>${c.emoji}</span>
                    ${c.label}
                  </button>
                `,
                ).join("")}
              </div>

              <textarea
                class="maw-textarea"
                id="mawTextInput"
                placeholder="What would make this tool better? Describe what you want or report a bug..."
              >${this.escapeHtml(this.textValue)}</textarea>

              ${
                this.screenshotDataUrl
                  ? `
                <div class="maw-screenshot-preview">
                  <img src="${this.screenshotDataUrl}" alt="Annotated screenshot" />
                  <button type="button" class="maw-remove-shot" id="mawRemoveShotBtn" title="Remove screenshot">✕</button>
                </div>
              `
                  : `
                <div class="maw-annotate-row">
                  <span style="font-size:12px;color:#64748b;">Highlight visual elements</span>
                  <button type="button" class="maw-annotate-btn" id="mawStartAnnotateBtn">
                    <svg style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
                    Annotate page
                  </button>
                </div>
              `
              }

              ${this.errorMessage ? `<div class="maw-error">${this.escapeHtml(this.errorMessage)}</div>` : ""}

              <div class="maw-footer">
                <button
                  type="button"
                  class="maw-submit-btn"
                  id="mawSubmitBtn"
                  ${this.isSubmitting || !this.hasMeaningfulText() ? "disabled" : ""}
                >
                  ${this.isSubmitting ? "Submitting wish..." : "Send wish ✨"}
                </button>
              </div>
            `
            }
          </div>
        </div>
      `
          : ""
      }
    `;

    this.bindEvents();
  }

  private bindEvents() {
    const launcherBtn = this.root.getElementById("mawLauncherBtn");
    if (launcherBtn) {
      launcherBtn.addEventListener("click", () => {
        this.isOpen = true;
        this.render();
      });
    }

    const closeBtn = this.root.getElementById("mawCloseBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.isOpen = false;
        this.render();
      });
    }

    const header = this.root.getElementById("mawHeader");
    const modal = this.root.querySelector(".maw-modal") as HTMLElement | null;
    if (header && modal) {
      header.addEventListener("pointerdown", (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        if (e.button !== 0) return;

        e.preventDefault();
        const rect = modal.getBoundingClientRect();
        const startX = e.clientX;
        const startY = e.clientY;
        const initialLeft = rect.left;
        const initialTop = rect.top;

        modal.classList.add("is-dragging");
        modal.style.left = `${initialLeft}px`;
        modal.style.top = `${initialTop}px`;
        modal.style.right = "auto";
        modal.style.bottom = "auto";
        modal.style.animation = "none";
        this.modalPos = { x: initialLeft, y: initialTop };

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

          modal.style.left = `${newLeft}px`;
          modal.style.top = `${newTop}px`;
          this.modalPos = { x: newLeft, y: newTop };
        };

        const onPointerUp = () => {
          modal.classList.remove("is-dragging");
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
      });
    }

    const chips = this.root.querySelectorAll(".maw-chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", (e) => {
        const cat = (e.currentTarget as HTMLElement).getAttribute("data-category") as Category;
        this.selectedCategory = cat;
        this.render();
      });
    });

    const textarea = this.root.getElementById("mawTextInput") as HTMLTextAreaElement | null;
    if (textarea) {
      if (this.shouldFocusTextarea) {
        this.shouldFocusTextarea = false;
        setTimeout(() => {
          textarea.focus();
          const len = textarea.value.length;
          textarea.setSelectionRange(len, len);
        }, 50);
      }

      textarea.addEventListener("input", (e) => {
        this.textValue = (e.target as HTMLTextAreaElement).value;
        const submitBtn = this.root.getElementById("mawSubmitBtn") as HTMLButtonElement | null;
        if (submitBtn) {
          submitBtn.disabled = this.isSubmitting || !this.hasMeaningfulText();
        }
      });
    }

    const startAnnotateBtn = this.root.getElementById("mawStartAnnotateBtn");
    if (startAnnotateBtn) {
      startAnnotateBtn.addEventListener("click", () => {
        this.startAnnotationMode();
      });
    }

    const removeShotBtn = this.root.getElementById("mawRemoveShotBtn");
    if (removeShotBtn) {
      removeShotBtn.addEventListener("click", () => {
        this.screenshotDataUrl = null;
        this.annotations = [];
        if (this.textValue === "(1) ") {
          this.textValue = "";
        }
        this.render();
      });
    }

    const submitBtn = this.root.getElementById("mawSubmitBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        this.submitFeedback();
      });
    }

    const resetBtn = this.root.getElementById("mawResetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.isDone = false;
        this.textValue = "";
        this.selectedCategory = "Bug";
        this.annotations = [];
        this.screenshotDataUrl = null;
        this.errorMessage = null;
        this.render();
      });
    }
  }

  private startAnnotationMode() {
    this.isAnnotating = true;
    if (!this.textValue.trim()) {
      this.textValue = "(1) ";
    }
    this.render();

    // Create full-screen transparent click/probe overlay
    const overlay = document.createElement("div");
    overlay.setAttribute("data-maw-chrome", "");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483642";
    overlay.style.cursor = "crosshair";
    overlay.style.background = "rgba(15, 23, 42, 0.02)";
    document.body.appendChild(overlay);
    this.annotationOverlay = overlay;

    // Create top floating control pill
    const pill = document.createElement("div");
    pill.setAttribute("data-maw-chrome", "");
    pill.style.position = "fixed";
    pill.style.top = "20px";
    pill.style.right = "20px";
    pill.style.zIndex = "2147483645";
    pill.style.background = "#1a1a2e";
    pill.style.color = "#ffffff";
    pill.style.padding = "8px 16px";
    pill.style.borderRadius = "9999px";
    pill.style.border = "1px solid rgba(229, 231, 235, 0.2)";
    pill.style.display = "flex";
    pill.style.alignItems = "center";
    pill.style.gap = "10px";
    pill.style.boxShadow = "0 10px 25px -3px rgba(0, 0, 0, 0.35)";
    pill.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    pill.style.fontSize = "13px";
    pill.style.cursor = "grab";
    pill.style.userSelect = "none";
    pill.style.touchAction = "none";
    pill.title = "Drag to move";
    pill.innerHTML = `
      <span style="display:inline-flex;align-items:center;color:#9ca3af;cursor:grab;" title="Drag to move">
        <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:currentColor;">
          <circle cx="8" cy="6" r="1.5" />
          <circle cx="16" cy="6" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
          <circle cx="16" cy="12" r="1.5" />
          <circle cx="8" cy="18" r="1.5" />
          <circle cx="16" cy="18" r="1.5" />
        </svg>
      </span>
      <span id="mawPillText">Click elements to pin (${this.annotations.length})</span>
      <button type="button" id="mawDoneAnnotateBtn" style="background:#d42955;color:#ffffff;border:none;padding:5px 14px;border-radius:9999px;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;cursor:pointer;">Done</button>
      <button type="button" id="mawCancelAnnotateBtn" style="background:transparent;color:#9ca3af;border:none;padding:5px 8px;font-family:'Inter',sans-serif;font-size:12px;cursor:pointer;">Cancel</button>
    `;
    document.body.appendChild(pill);
    this.annotationPill = pill;

    pill.addEventListener("pointerdown", (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      if (e.button !== 0) return;
      e.preventDefault();
      pill.style.cursor = "grabbing";

      const rect = pill.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const initialLeft = rect.left;
      const initialTop = rect.top;

      pill.style.left = `${initialLeft}px`;
      pill.style.top = `${initialTop}px`;
      pill.style.right = "auto";
      pill.style.bottom = "auto";

      const onPillMove = (moveEv: PointerEvent) => {
        const dx = moveEv.clientX - startX;
        const dy = moveEv.clientY - startY;
        let nx = initialLeft + dx;
        let ny = initialTop + dy;
        const pad = 8;
        nx = Math.max(pad, Math.min(window.innerWidth - rect.width - pad, nx));
        ny = Math.max(pad, Math.min(window.innerHeight - rect.height - pad, ny));
        pill.style.left = `${nx}px`;
        pill.style.top = `${ny}px`;
      };

      const onPillUp = () => {
        pill.style.cursor = "grab";
        window.removeEventListener("pointermove", onPillMove);
        window.removeEventListener("pointerup", onPillUp);
        window.removeEventListener("pointercancel", onPillUp);
      };

      window.addEventListener("pointermove", onPillMove);
      window.addEventListener("pointerup", onPillUp);
      window.addEventListener("pointercancel", onPillUp);
    });

    // Attach outline style helper to document
    if (!document.getElementById("maw-hover-style")) {
      const style = document.createElement("style");
      style.id = "maw-hover-style";
      style.innerHTML = `[data-maw-hover] { outline: 2px solid #fc3165 !important; outline-offset: 2px !important; cursor: crosshair !important; }`;
      document.head.appendChild(style);
    }

    const probe = (x: number, y: number): Element | null => {
      overlay.style.pointerEvents = "none";
      const el = document.elementFromPoint(x, y);
      overlay.style.pointerEvents = "auto";
      if (!el || el.closest("[data-maw-chrome]") || el.closest("make-a-wish-widget")) {
        return null;
      }
      return el;
    };

    overlay.onmousemove = (e: MouseEvent) => {
      const el = probe(e.clientX, e.clientY);
      if (el === this.hoveredElement) return;
      if (this.hoveredElement) {
        this.hoveredElement.removeAttribute("data-maw-hover");
      }
      if (el) {
        el.setAttribute("data-maw-hover", "");
      }
      this.hoveredElement = el;
    };

    overlay.onclick = (e: MouseEvent) => {
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

      this.annotations.push(annotation);
      this.renderPin(annotation, this.annotations.length);

      const pillText = pill.querySelector("#mawPillText");
      if (pillText) {
        pillText.textContent = `Click elements to pin (${this.annotations.length})`;
      }

      const count = this.annotations.length;
      if (count === 1) {
        if (!this.textValue.trim()) {
          this.textValue = "(1) ";
        } else if (!this.textValue.includes("(1)")) {
          this.textValue = this.textValue.trimEnd() + "\n(1) ";
        }
      } else if (count > 1) {
        if (!this.textValue.includes(`(${count})`)) {
          this.textValue = this.textValue.trimEnd() + `\n(${count}) `;
        }
      }
    };

    const doneBtn = pill.querySelector("#mawDoneAnnotateBtn");
    if (doneBtn) {
      doneBtn.addEventListener("click", async () => {
        await this.finishAnnotation(true);
      });
    }

    const cancelBtn = pill.querySelector("#mawCancelAnnotateBtn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", async () => {
        await this.finishAnnotation(false);
      });
    }
  }

  private renderPin(annotation: Annotation, index: number) {
    const pin = document.createElement("div");
    pin.setAttribute("data-maw-chrome", "");
    pin.style.position = "fixed";
    pin.style.left = `${annotation.rect.x}px`;
    pin.style.top = `${annotation.rect.y}px`;
    pin.style.width = "24px";
    pin.style.height = "24px";
    pin.style.borderRadius = "9999px";
    pin.style.background = "#fc3165";
    pin.style.color = "#ffffff";
    pin.style.fontFamily = "'Inter', -apple-system, sans-serif";
    pin.style.fontSize = "12px";
    pin.style.fontWeight = "700";
    pin.style.display = "flex";
    pin.style.alignItems = "center";
    pin.style.justifyContent = "center";
    pin.style.boxShadow = "0 0 0 2px #ffffff, 0 4px 10px rgba(252, 49, 101, 0.4)";
    pin.style.zIndex = "2147483644";
    pin.style.pointerEvents = "none";
    pin.textContent = String(index);
    document.body.appendChild(pin);
    this.pinElements.push(pin);
  }

  private async finishAnnotation(saveScreenshot: boolean) {
    if (this.hoveredElement) {
      this.hoveredElement.removeAttribute("data-maw-hover");
      this.hoveredElement = null;
    }

    if (this.annotationOverlay) {
      this.annotationOverlay.remove();
      this.annotationOverlay = null;
    }
    if (this.annotationPill) {
      this.annotationPill.remove();
      this.annotationPill = null;
    }

    this.pinElements.forEach((p) => p.remove());
    this.pinElements = [];

    if (saveScreenshot) {
      const shot = await captureAnnotatedScreenshot(this.annotations);
      this.screenshotDataUrl = shot;
      if (this.annotations.length > 0) {
        if (!this.textValue.trim()) {
          this.textValue = "(1) ";
        } else if (!this.textValue.includes("(1)")) {
          this.textValue = this.textValue.trimEnd() + "\n(1) ";
        }
        for (let i = 2; i <= this.annotations.length; i++) {
          if (!this.textValue.includes(`(${i})`)) {
            this.textValue = this.textValue.trimEnd() + `\n(${i}) `;
          }
        }
      }
      this.shouldFocusTextarea = true;
    } else {
      if (this.textValue === "(1) ") {
        this.textValue = "";
      }
      this.annotations = [];
    }

    this.isAnnotating = false;
    this.render();
  }

  private async submitFeedback() {
    if (!this.hasMeaningfulText() || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = null;
    this.render();

    // Auto-capture screenshot if not done manually
    let shot = this.screenshotDataUrl;
    if (!shot) {
      shot = await captureAnnotatedScreenshot(this.annotations);
      this.screenshotDataUrl = shot;
    }

    const repos = (this.config.repos && this.config.repos.length > 0)
      ? this.config.repos
      : (this.config.repo ? [this.config.repo] : []);
    const primaryRepo = repos[0] || this.config.repo || "";

    const payload = {
      appId: this.config.appId || "default-app",
      repo: primaryRepo,
      repos: repos,
      category: this.selectedCategory,
      text: this.textValue.trim(),
      annotations: this.annotations,
      screenshot: shot,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userEmail: this.config.userEmail || "",
      timestamp: new Date().toISOString(),
    };

    try {
      const apiUrl = (this.config.apiUrl || window.location.origin).replace(/\/$/, "");
      const res = await fetch(`${apiUrl}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Make-A-Wish-App": this.config.appId || "generic",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Submission failed (${res.status}): ${errorText.slice(0, 150)}`);
      }

      this.isDone = true;
      this.isSubmitting = false;
      this.render();
    } catch (err) {
      this.isSubmitting = false;
      this.errorMessage = err instanceof Error ? err.message : "Submission failed";
      this.render();
    }
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
