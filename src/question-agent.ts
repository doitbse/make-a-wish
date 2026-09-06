import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { config, isMockMode } from "./config.js";

export interface QuestionRequest {
  question: string;
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
  if (!question) {
    return {
      ok: false,
      answer: "Please provide a valid question.",
    };
  }

  if (isMockMode()) {
    return {
      ok: true,
      answer: `**Mock Agent Answer**: Received question: "${question}". In production mode, this query is answered by the Gemini 3.8 Flash agent with live repository context.`,
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

  const systemInstruction = `You are the Make-a-Wish AI Assistant embedded inside the application "${req.appId || "this application"}".
The user is currently viewing the app at URL: ${req.url || "current page"} and has asked a direct question.

Target Repository: ${req.repo || "known codebase"}
Workspace Context:
${workspaceContext}

Instructions:
1. Provide a direct, concise, and helpful answer to the user's question.
2. If they ask what a specific feature, tab, or button does, explain its purpose and how to use it based on the application context.
3. If the user asks for something that is not yet supported or seems like an enhancement, explain how it currently works and invite them to file a feature request.
4. Use clean markdown formatting (bullet points, bold highlights, code formatting where appropriate).
5. Avoid overly verbose filler or robotic phrases. Be direct, clear, and professional.`;

  const contents: any[] = [];

  // If a screenshot is provided, include it in multimodal contents
  if (req.screenshot && req.screenshot.startsWith("data:image/")) {
    const base64Data = req.screenshot.replace(/^data:image\/\w+;base64,/, "");
    contents.push({
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

  contents.push({
    role: "user",
    parts: [{ text: promptText }],
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

    const answer = response.text || "I was unable to formulate an answer for this question. Please try rephrasing.";

    return {
      ok: true,
      answer,
      model: config.adkModel || "gemini-3.8-flash",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[question-agent] Error answering question:", msg);
    return {
      ok: false,
      answer: `Sorry, I encountered an error while answering your question: ${msg}`,
    };
  }
}
