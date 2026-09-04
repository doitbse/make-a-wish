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
  repos?: string[];
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
  triage_status?: "needs_pr" | "needs_info" | "wont_fix" | "question";
  target_repo?: string | null;
  pr_url?: string | null;
  pr_number?: number | null;
  branch_name?: string | null;
  repro_steps?: string[];
  likely_root_cause?: string;
  proposed_fix?: string;
  affected_files?: string[];
  notes?: string;
  [key: string]: unknown;
}
