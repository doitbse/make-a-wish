import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { config, isMockMode } from "./config.js";
import {
  getSession,
  saveSession,
  getUserMemory,
  saveUserMemory,
  inferUserNameFromEmail,
  type UserSession,
} from "./session-store.js";

export interface QuestionRequest {
  question: string;
  sessionId?: string;
  appId?: string;
  repo?: string;
  repos?: string[];
  screenshot?: string | null;
  annotations?: Array<{ x: number; y: number; text?: string }>;
  url?: string;
  userAgent?: string;
  userEmail?: string;
}

export interface QuestionResponse {
  ok: boolean;
  answer: string;
  sessionId: string;
  userName?: string;
  userFirstName?: string;
  turnsCount?: number;
  sources?: string[];
  model?: string;
}

function resolveWorkspace(req: QuestionRequest): string | null {
  const repo = (req.repo || (req.repos && req.repos[0]) || "").toLowerCase();
  const appId = (req.appId || "").toLowerCase();

  if (repo.includes("ai-sales") || appId.includes("ai-sales")) {
    const p = "/Users/sascha/Desktop/development/fusion/ai-sales";
    if (fs.existsSync(p)) return p;
  }

  const wishPlatform = "/Users/sascha/Desktop/development/fusion/make-a-wish-platform";
  if (fs.existsSync(wishPlatform) && (repo.includes("platform") || appId.includes("platform"))) {
    return wishPlatform;
  }

  const wish = "/Users/sascha/Desktop/development/fusion/make-a-wish";
  if (fs.existsSync(wish)) return wish;

  return process.env.WORKSPACE_DIR || null;
}

function gatherWorkspaceSummary(workspaceDir: string | null): string {
  if (!workspaceDir || !fs.existsSync(workspaceDir)) {
    return "Workspace directory not locally accessible.";
  }

  const summaries: string[] = [];
  try {
    const readmePath = path.join(workspaceDir, "README.md");
    if (fs.existsSync(readmePath)) {
      const readme = fs.readFileSync(readmePath, "utf-8");
      summaries.push(`### README.md snippet:\n${readme.slice(0, 1500)}`);
    }

    const packageJsonPath = path.join(workspaceDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const pkg = fs.readFileSync(packageJsonPath, "utf-8");
      summaries.push(`### package.json snippet:\n${pkg.slice(0, 800)}`);
    }

    // Check for web app structure if Next.js project
    const webAppDir = path.join(workspaceDir, "web", "app");
    const srcAppDir = path.join(workspaceDir, "src", "app");
    const appDir = path.join(workspaceDir, "app");
    const targetDir = fs.existsSync(webAppDir)
      ? webAppDir
      : fs.existsSync(srcAppDir)
        ? srcAppDir
        : fs.existsSync(appDir)
          ? appDir
          : null;

    if (targetDir) {
      const entries = fs.readdirSync(targetDir, { withFileTypes: true });
      const routes = entries
        .map((e) => (e.isDirectory() ? `/${e.name}` : e.name))
        .filter((n) => !n.startsWith(".") && !n.includes("test"))
        .join(", ");
      summaries.push(`### Main Application Routes / Pages:\n${routes}`);
    }
  } catch (err) {
    console.warn("[question-agent] Error reading workspace context:", err);
  }

  return summaries.join("\n\n");
}

export async function answerQuestion(req: QuestionRequest): Promise<QuestionResponse> {
  const question = req.question.trim();
  const sessionId = req.sessionId?.trim() || `sess_${Math.random().toString(36).substring(2, 12)}`;

  if (!question) {
    return {
      ok: false,
      answer: "Please provide a valid question.",
      sessionId,
    };
  }

  // 1. Resolve or initialize conversation session
  let session = await getSession(sessionId);
  const names = inferUserNameFromEmail(req.userEmail || session?.userEmail);

  if (!session) {
    session = {
      sessionId,
      userEmail: req.userEmail || "",
      userName: names.fullName,
      userFirstName: names.firstName,
      turns: [],
      appId: req.appId,
      repo: req.repo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } else {
    if (req.userEmail && !session.userEmail) {
      session.userEmail = req.userEmail;
      session.userName = names.fullName;
      session.userFirstName = names.firstName;
    }
  }

  // 2. Retrieve and update persistent user memory
  const userEmail = (req.userEmail || session.userEmail || "").trim();
  let memory = userEmail ? await getUserMemory(userEmail) : null;
  if (userEmail) {
    const topicSummary = question.slice(0, 60);
    if (!memory) {
      memory = {
        userEmail,
        firstName: names.firstName,
        fullName: names.fullName,
        interactionCount: 1,
        recentTopics: [topicSummary],
        preferredRepos: req.repo ? [req.repo] : [],
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      };
    } else {
      memory.interactionCount += 1;
      memory.firstName = names.firstName;
      memory.fullName = names.fullName;
      if (!memory.recentTopics.includes(topicSummary)) {
        memory.recentTopics.unshift(topicSummary);
        memory.recentTopics = memory.recentTopics.slice(0, 5);
      }
      if (req.repo && !memory.preferredRepos.includes(req.repo)) {
        memory.preferredRepos.unshift(req.repo);
        memory.preferredRepos = memory.preferredRepos.slice(0, 3);
      }
    }
  }

  if (isMockMode()) {
    const isFirstTurn = session.turns.length === 0;
    const greeting = isFirstTurn ? `Hi ${names.firstName}! ` : "";
    const answer = `**Mock Agent Answer**: ${greeting}Received question: "${question}". In production mode, this query is answered by the Gemini 3.8 Flash agent with live repository context and cross-session memory.`;
    session.turns.push({
      role: "user",
      text: question,
      timestamp: new Date().toISOString(),
    });
    session.turns.push({
      role: "model",
      text: answer,
      timestamp: new Date().toISOString(),
    });
    await saveSession(session);
    if (memory) await saveUserMemory(memory);

    return {
      ok: true,
      answer,
      sessionId,
      userName: names.fullName,
      userFirstName: names.firstName,
      turnsCount: session.turns.length,
      model: "mock",
    };
  }

  const workspaceDir = resolveWorkspace(req);
  const workspaceContext = gatherWorkspaceSummary(workspaceDir);

  const client = new GoogleGenAI({
    vertexai: true,
    project: config.projectId || "sascha-playground-doit",
    location: config.location || "global",
  });

  const isFirstTurn = session.turns.length === 0;
  const memoryContext = memory
    ? `User Profile & Cross-Session Memory:
- Name: ${memory.fullName} (First name: ${memory.firstName})
- Email: ${memory.userEmail}
- Interaction count: ${memory.interactionCount}
- Recent topics: ${memory.recentTopics.join("; ")}
- Known repositories: ${memory.preferredRepos.join(", ")}`
    : `User Identity:
- First Name: ${names.firstName}
- Full Name: ${names.fullName}
- Email: ${userEmail || "unknown"}`;

  const systemInstruction = `You are the Make-a-Wish AI Assistant embedded inside the application "${req.appId || "this application"}".
The user is viewing URL: ${req.url || "current page"}.

Target Repository: ${req.repo || "known codebase"}
Workspace Context:
${workspaceContext}

${memoryContext}

Instructions:
1. ${
    isFirstTurn
      ? `Greet the user warmly by their first name (e.g. "Hi ${names.firstName}!").`
      : `This is a follow-up question in an ongoing conversation. Do not repeat the greeting or introduction. Answer directly in the context of the previous messages.`
  }
2. Provide a direct, concise, and helpful answer to the user's question.
3. If they ask what a specific feature, tab, or button does, explain its purpose and how to use it based on the application context.
4. If the user asks for something that is not yet supported or seems like an enhancement, explain how it currently works and invite them to file a feature request.
5. Use clean markdown formatting (bullet points, bold highlights, code formatting where appropriate).
6. Avoid overly verbose filler or robotic phrases. Be direct, clear, and professional.`;

  const contents: any[] = [];

  // Feed prior conversation turns into multi-turn contents array
  for (const turn of session.turns) {
    contents.push({
      role: turn.role,
      parts: [{ text: turn.text }],
    });
  }

  // Current turn with optional screenshot
  const currentParts: any[] = [];
  if (req.screenshot && req.screenshot.startsWith("data:image/")) {
    const base64Data = req.screenshot.replace(/^data:image\/\w+;base64,/, "");
    currentParts.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Data,
      },
    });
  }

  let promptText = `User Question: ${question}\n\nApp ID: ${req.appId || "default"}\nPage URL: ${req.url || "unknown"}`;
  if (req.annotations && req.annotations.length > 0) {
    promptText += `\nUser Annotations on Screen:\n${JSON.stringify(req.annotations, null, 2)}`;
  }
  currentParts.push({ text: promptText });

  contents.push({
    role: "user",
    parts: currentParts,
  });

  try {
    const response = await client.models.generateContent({
      model: config.adkModel || "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        temperature: 0.2,
      },
    });

    const answer =
      response.text || "I was unable to formulate an answer for this question. Please try rephrasing.";

    // Persist conversation turns and update memory
    session.turns.push({
      role: "user",
      text: question,
      timestamp: new Date().toISOString(),
    });
    session.turns.push({
      role: "model",
      text: answer,
      timestamp: new Date().toISOString(),
    });

    await saveSession(session);
    if (memory) {
      await saveUserMemory(memory);
    }

    return {
      ok: true,
      answer,
      sessionId,
      userName: names.fullName,
      userFirstName: names.firstName,
      turnsCount: session.turns.length,
      model: config.adkModel || "gemini-3.8-flash",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[question-agent] Error answering question:", msg);
    return {
      ok: false,
      answer: `Sorry, I encountered an error while answering your question: ${msg}`,
      sessionId,
    };
  }
}
