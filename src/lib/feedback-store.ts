import { Firestore } from "@google-cloud/firestore";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { FeedbackSubmission, TriageResult } from "@/components/feedback-widget/types";

export type StoredFeedback = FeedbackSubmission & {
  id: string;
  triage: TriageResult | null;
  triageError: string | null;
  storedAt: string;
  triagedAt?: string;
  status?: "pending_triage" | "triaged" | "triage_failed";
  source?: "firestore" | "local";
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "feedback.json");
const COLLECTION_NAME = process.env.FIRESTORE_COLLECTION || "feedback_submissions";

let firestoreInstance: Firestore | null = null;

function getFirestoreClient(): Firestore | null {
  const projectId = process.env.GCP_PROJECT_ID?.trim();
  if (!projectId) return null;
  if (!firestoreInstance) {
    try {
      firestoreInstance = new Firestore({
        projectId,
        databaseId: "(default)",
        ignoreUndefinedProperties: true,
      });
    } catch (err) {
      console.error("[feedback-store] Failed to initialize Firestore:", err);
      return null;
    }
  }
  return firestoreInstance;
}

async function readLocalSubmissions(): Promise<StoredFeedback[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredFeedback[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalSubmissions(subs: StoredFeedback[]): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(subs, null, 2), "utf8");
  } catch (err) {
    console.error("[feedback-store] Failed to write local feedback backup:", err);
  }
}

export async function saveFeedback(
  data: Omit<StoredFeedback, "id">,
): Promise<StoredFeedback> {
  const id = `wish_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const record: StoredFeedback = {
    ...data,
    id,
    source: "local",
  };

  const db = getFirestoreClient();
  if (db) {
    try {
      // Deep copy and guard against oversized screenshot if >800KB
      const docPayload: Record<string, unknown> = {
        id,
        appId: record.appId || null,
        repo: record.repo || null,
        userEmail: record.userEmail || null,
        category: record.category,
        text: record.text,
        annotations: record.annotations || [],
        url: record.url ?? null,
        userAgent: record.userAgent ?? null,
        timestamp: record.timestamp || new Date().toISOString(),
        storedAt: record.storedAt,
        status: record.status || (record.triage ? "triaged" : "pending_triage"),
        triage: record.triage || null,
        triageError: record.triageError || null,
      };

      if (record.screenshot) {
        if (record.screenshot.length < 850_000) {
          docPayload.screenshot = record.screenshot;
        } else {
          console.warn("[feedback-store] Screenshot exceeds Firestore size limit, omitting image body.");
          docPayload.screenshot = null;
          docPayload.screenshotOmitted = true;
        }
      } else {
        docPayload.screenshot = null;
      }

      await db.collection(COLLECTION_NAME).doc(id).set(docPayload);
      record.source = "firestore";
      console.log(`[feedback-store] Persisted feedback ${id} to Firestore collection '${COLLECTION_NAME}'.`);
    } catch (err) {
      console.error("[feedback-store] Firestore write failed, falling back to local file:", err);
    }
  }

  // Also maintain local file backup
  const locals = await readLocalSubmissions();
  locals.unshift(record);
  await writeLocalSubmissions(locals);

  return record;
}

export async function updateFeedback(
  id: string,
  updates: Partial<StoredFeedback>,
): Promise<boolean> {
  const db = getFirestoreClient();
  let updatedInFirestore = false;
  if (db) {
    try {
      const updatePayload: Record<string, unknown> = {};
      if (updates.status !== undefined) updatePayload.status = updates.status;
      if (updates.triage !== undefined) updatePayload.triage = updates.triage;
      if (updates.triageError !== undefined) updatePayload.triageError = updates.triageError;
      if (updates.triagedAt !== undefined) updatePayload.triagedAt = updates.triagedAt;

      await db.collection(COLLECTION_NAME).doc(id).set(updatePayload, { merge: true });
      updatedInFirestore = true;
      console.log(`[feedback-store] Updated feedback ${id} in Firestore (status=${updates.status}).`);
    } catch (err) {
      console.error(`[feedback-store] Failed to update feedback ${id} in Firestore:`, err);
    }
  }

  // Also update local file
  try {
    const locals = await readLocalSubmissions();
    const idx = locals.findIndex((item) => item.id === id);
    if (idx !== -1) {
      locals[idx] = { ...locals[idx], ...updates };
      await writeLocalSubmissions(locals);
    }
  } catch (err) {
    console.error("[feedback-store] Failed to update local submissions:", err);
  }

  return updatedInFirestore;
}

export async function getFeedbackList(): Promise<StoredFeedback[]> {
  const db = getFirestoreClient();
  if (db) {
    try {
      const snap = await db
        .collection(COLLECTION_NAME)
        .orderBy("storedAt", "desc")
        .limit(100)
        .get();

      if (!snap.empty) {
        return snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            category: d.category,
            text: d.text || "",
            annotations: d.annotations || [],
            screenshot: d.screenshot || null,
            url: d.url || "",
            userAgent: d.userAgent || "",
            timestamp: d.timestamp || d.storedAt,
            storedAt: d.storedAt || new Date().toISOString(),
            triagedAt: d.triagedAt,
            status: d.status || (d.triage ? "triaged" : d.triageError ? "triage_failed" : "pending_triage"),
            triage: d.triage || null,
            triageError: d.triageError || null,
            source: "firestore",
          } as StoredFeedback;
        });
      }
    } catch (err) {
      console.error("[feedback-store] Firestore read failed, falling back to local file:", err);
    }
  }

  return readLocalSubmissions();
}
