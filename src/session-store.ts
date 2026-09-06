import { Firestore } from "@google-cloud/firestore";

export interface ConversationTurn {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface UserSession {
  sessionId: string;
  userEmail: string;
  userName: string;
  userFirstName: string;
  turns: ConversationTurn[];
  appId?: string;
  repo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserMemory {
  userEmail: string;
  firstName: string;
  fullName: string;
  interactionCount: number;
  recentTopics: string[];
  preferredRepos: string[];
  firstSeen: string;
  lastSeen: string;
}

// In-memory cache for ultra-fast lookup and local fallback
const sessionCache = new Map<string, UserSession>();
const userMemoryCache = new Map<string, UserMemory>();

let firestoreInstance: Firestore | null = null;

function getDb(): Firestore | null {
  const projectId = process.env.GCP_PROJECT_ID?.trim() || "sascha-playground-doit";
  if (!firestoreInstance) {
    try {
      firestoreInstance = new Firestore({
        projectId,
        databaseId: "(default)",
        ignoreUndefinedProperties: true,
      });
    } catch (err) {
      console.warn("[session-store] Failed to initialize Firestore client:", err);
      return null;
    }
  }
  return firestoreInstance;
}

const SESSIONS_COLLECTION = "make_a_wish_sessions";
const USER_MEMORY_COLLECTION = "make_a_wish_user_memories";

/**
 * Extracts first name and display name from a DoiT email.
 * E.g., sascha@doit.com -> { firstName: "Sascha", fullName: "Sascha" }
 * luke.thorpe@doit.com -> { firstName: "Luke", fullName: "Luke Thorpe" }
 */
export function inferUserNameFromEmail(email?: string): { firstName: string; fullName: string } {
  if (!email || !email.includes("@")) {
    return { firstName: "there", fullName: "Friend" };
  }
  const localPart = email.split("@")[0].trim();
  const tokens = localPart
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());

  if (tokens.length === 0) {
    return { firstName: "there", fullName: "Friend" };
  }
  return {
    firstName: tokens[0],
    fullName: tokens.join(" "),
  };
}

export async function getSession(sessionId: string): Promise<UserSession | null> {
  if (!sessionId) return null;
  if (sessionCache.has(sessionId)) {
    return sessionCache.get(sessionId)!;
  }
  const db = getDb();
  if (db) {
    try {
      const doc = await db.collection(SESSIONS_COLLECTION).doc(sessionId).get();
      if (doc.exists) {
        const data = doc.data() as UserSession;
        sessionCache.set(sessionId, data);
        return data;
      }
    } catch (err) {
      console.warn(`[session-store] Error reading session ${sessionId} from Firestore:`, err);
    }
  }
  return null;
}

export async function saveSession(session: UserSession): Promise<void> {
  if (!session.sessionId) return;
  session.updatedAt = new Date().toISOString();
  sessionCache.set(session.sessionId, session);
  const db = getDb();
  if (db) {
    try {
      await db.collection(SESSIONS_COLLECTION).doc(session.sessionId).set(session, { merge: true });
    } catch (err) {
      console.warn(`[session-store] Error saving session ${session.sessionId} to Firestore:`, err);
    }
  }
}

export async function getUserMemory(userEmail: string): Promise<UserMemory | null> {
  if (!userEmail) return null;
  const key = userEmail.toLowerCase().trim();
  if (userMemoryCache.has(key)) {
    return userMemoryCache.get(key)!;
  }
  const db = getDb();
  if (db) {
    try {
      const doc = await db.collection(USER_MEMORY_COLLECTION).doc(key).get();
      if (doc.exists) {
        const data = doc.data() as UserMemory;
        userMemoryCache.set(key, data);
        return data;
      }
    } catch (err) {
      console.warn(`[session-store] Error loading user memory for ${key}:`, err);
    }
  }
  return null;
}

export async function saveUserMemory(memory: UserMemory): Promise<void> {
  if (!memory.userEmail) return;
  const key = memory.userEmail.toLowerCase().trim();
  memory.lastSeen = new Date().toISOString();
  userMemoryCache.set(key, memory);
  const db = getDb();
  if (db) {
    try {
      await db.collection(USER_MEMORY_COLLECTION).doc(key).set(memory, { merge: true });
    } catch (err) {
      console.warn(`[session-store] Error saving user memory for ${key}:`, err);
    }
  }
}
