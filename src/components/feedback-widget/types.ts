export type Category = "Bug" | "Wish" | "Confusing" | "Wrong data" | "Praise";

export const CATEGORIES: { label: Category; emoji: string }[] = [
  { label: "Bug", emoji: "🐞" },
  { label: "Wish", emoji: "✨" },
  { label: "Confusing", emoji: "🤔" },
  { label: "Wrong data", emoji: "🔢" },
  { label: "Praise", emoji: "🙌" },
];

export interface Annotation {
  selector: string;
  tag: string;
  hint: string;
  text: string;
  rect: { x: number; y: number; width: number; height: number };
}

export interface FeedbackSubmission {
  appId?: string;
  repo?: string;
  userEmail?: string;
  category: Category;
  text: string;
  annotations: Annotation[];
  screenshot: string | null;
  url: string;
  userAgent: string;
  timestamp: string;
}

// Shape returned by the companion triage service. Kept intentionally loose.
export interface TriageResult {
  [key: string]: unknown;
}
