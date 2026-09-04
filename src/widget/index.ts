import { MakeAWishWidgetUI, WidgetConfig, parseRepos } from "./ui";

export class MakeAWishWidgetElement extends HTMLElement {
  private ui: MakeAWishWidgetUI | null = null;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["data-app", "data-repo", "data-repos", "data-api", "data-user", "data-position"];
  }

  connectedCallback() {
    const config = this.resolveConfig();
    this.ui = new MakeAWishWidgetUI(this.shadow, config);
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (!this.ui) return;
    const partial: Partial<WidgetConfig> = {};
    if (name === "data-app") partial.appId = newValue;
    if (name === "data-repo" || name === "data-repos") {
      const repos = parseRepos(this.getAttribute("data-repos"), this.getAttribute("data-repo"));
      partial.repos = repos;
      partial.repo = repos[0] || "";
    }
    if (name === "data-api") partial.apiUrl = newValue;
    if (name === "data-user") partial.userEmail = newValue;
    if (name === "data-position") partial.position = newValue as "bottom-right" | "bottom-left";
    this.ui.updateConfig(partial);
  }

  private resolveConfig(): WidgetConfig {
    const repos = parseRepos(this.getAttribute("data-repos"), this.getAttribute("data-repo"));
    return {
      appId: this.getAttribute("data-app") || "",
      repo: repos[0] || "",
      repos: repos,
      apiUrl: this.getAttribute("data-api") || window.location.origin,
      userEmail: this.getAttribute("data-user") || undefined,
      position: (this.getAttribute("data-position") as "bottom-right" | "bottom-left") || "bottom-right",
    };
  }
}

// Register custom element
if (typeof window !== "undefined" && !customElements.get("make-a-wish-widget")) {
  customElements.define("make-a-wish-widget", MakeAWishWidgetElement);
}

// Auto-mount when included via script tag
function autoInitialize() {
  if (typeof document === "undefined") return;

  // Locate the script element that loaded widget.js
  const currentScript = (document.currentScript ||
    document.querySelector('script[src*="widget.js"]')) as HTMLScriptElement | null;

  let scriptOrigin = window.location.origin;
  let appId = "";
  let repo = "";
  let apiUrl = "";
  let userEmail = "";
  let position: "bottom-right" | "bottom-left" = "bottom-right";

  if (currentScript) {
    try {
      const url = new URL(currentScript.src, window.location.href);
      scriptOrigin = url.origin;
    } catch {
      scriptOrigin = window.location.origin;
    }

    appId = currentScript.getAttribute("data-app") || "";
    const rawRepos = currentScript.getAttribute("data-repos");
    const rawRepo = currentScript.getAttribute("data-repo");
    const repos = parseRepos(rawRepos, rawRepo);
    apiUrl = currentScript.getAttribute("data-api") || scriptOrigin;
    userEmail = currentScript.getAttribute("data-user") || "";
    const pos = currentScript.getAttribute("data-position");
    if (pos === "bottom-left" || pos === "bottom-right") {
      position = pos;
    }

    // Prevent multiple mountings
    if (document.querySelector("make-a-wish-widget")) {
      return;
    }

    const widget = document.createElement("make-a-wish-widget");
    if (appId) widget.setAttribute("data-app", appId);
    if (repos.length > 0) {
      widget.setAttribute("data-repos", repos.join(", "));
      widget.setAttribute("data-repo", repos[0]);
    }
    if (apiUrl) widget.setAttribute("data-api", apiUrl);
    if (userEmail) widget.setAttribute("data-user", userEmail);
    widget.setAttribute("data-position", position);

    document.body.appendChild(widget);
  } else {
    // If not loaded via script tag but auto-init called, check if already mounted
    if (!document.querySelector("make-a-wish-widget")) {
      const widget = document.createElement("make-a-wish-widget");
      document.body.appendChild(widget);
    }
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInitialize);
  } else {
    autoInitialize();
  }
}
