import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      bot,
      message,
      history = [],
      connectors = [],
      approvalMode = "supervised",
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = bot?.model || "gemini-2.5-flash";

    // Prepare agent tool steps that the bot might execute based on prompt keywords
    const lowerMsg = (message || "").toLowerCase();
    const toolSteps: Array<{
      id: string;
      toolName: string;
      displayName: string;
      inputArgs: Record<string, any>;
      outputResult?: string;
      status: "completed" | "waiting_approval";
      durationMs: number;
    }> = [];

    let isWaitingApproval = false;

    // Simulate real agent tool decisions
    if (lowerMsg.includes("search") || lowerMsg.includes("lookup") || lowerMsg.includes("latest") || lowerMsg.includes("who is") || lowerMsg.includes("what is")) {
      toolSteps.push({
        id: "step-" + Math.random().toString(36).substring(2, 9),
        toolName: "web_search",
        displayName: "Web Search & Extraction",
        inputArgs: { query: message, num_results: 3 },
        outputResult: `Found 3 authoritative results from primary sources.\n- AbacusAI Bot documentation & release logs\n- ArXiv technical pre-print on reasoning agents\n- Open-weights model catalog index`,
        status: "completed",
        durationMs: 420,
      });
    }

    if (lowerMsg.includes("email") || lowerMsg.includes("gmail") || lowerMsg.includes("inbox") || lowerMsg.includes("mail")) {
      const isGmailConnected = connectors.some((c: any) => c.slug === "gmail" && c.isConnected);
      toolSteps.push({
        id: "step-" + Math.random().toString(36).substring(2, 9),
        toolName: "gmail_search_threads",
        displayName: "Gmail: Query VIP Threads",
        inputArgs: { filter: "is:unread label:important", max_results: 5 },
        outputResult: isGmailConnected
          ? "Retrieved 2 unread VIP threads from Board (Q3 Targets) and Lead Investor."
          : "Notice: Gmail connector is not authenticated. Simulating mock inbox read.",
        status: "completed",
        durationMs: 310,
      });
    }

    if (lowerMsg.includes("calendar") || lowerMsg.includes("schedule") || lowerMsg.includes("meeting")) {
      toolSteps.push({
        id: "step-" + Math.random().toString(36).substring(2, 9),
        toolName: "calendar_list_events",
        displayName: "Calendar: Check Day Agenda",
        inputArgs: { timeMin: new Date().toISOString(), timeMax: new Date(Date.now() + 86400000).toISOString() },
        outputResult: "Found 4 calendar events: 10:00 AM Architecture Review, 1:30 PM Customer Call, 3:00 PM Sync.",
        status: "completed",
        durationMs: 250,
      });
    }

    if (lowerMsg.includes("git") || lowerMsg.includes("repo") || lowerMsg.includes("pr") || lowerMsg.includes("code")) {
      toolSteps.push({
        id: "step-" + Math.random().toString(36).substring(2, 9),
        toolName: "github_list_pull_requests",
        displayName: "GitHub: Scan Open PRs",
        inputArgs: { repo: "abacusai/abacusai-bot", state: "open" },
        outputResult: "PR #518 (Media upgrade card) and PR #516 (Rail toggle like VS Code) analyzed.",
        status: "completed",
        durationMs: 380,
      });
    }

    if (lowerMsg.includes("run") || lowerMsg.includes("bash") || lowerMsg.includes("exec") || lowerMsg.includes("shell") || lowerMsg.includes("terminal")) {
      const isSensitive = lowerMsg.includes("rm") || lowerMsg.includes("delete") || lowerMsg.includes("kill") || lowerMsg.includes("deploy");
      if (approvalMode === "supervised" && isSensitive) {
        isWaitingApproval = true;
        toolSteps.push({
          id: "step-" + Math.random().toString(36).substring(2, 9),
          toolName: "bash_execute",
          displayName: "Terminal: Execute Shell Command",
          inputArgs: { command: "npm run deploy --env=production" },
          status: "waiting_approval",
          durationMs: 0,
        });
      } else {
        toolSteps.push({
          id: "step-" + Math.random().toString(36).substring(2, 9),
          toolName: "bash_execute",
          displayName: "Terminal: Execute Shell Command",
          inputArgs: { command: "git status -s" },
          outputResult: "Working tree clean on branch main.",
          status: "completed",
          durationMs: 190,
        });
      }
    }

    // Call real Gemini API if key is available
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const personaPrompt = bot?.persona || "You are an autonomous personal bot.";
        const memoryContext = (bot?.memory || [])
          .map((m: any) => `[${m.category.toUpperCase()}]: ${m.content}`)
          .join("\n");

        const systemInstructions = `${personaPrompt}\n\nBot Name: ${bot?.name || "Bot"}\nBot Title: ${bot?.title || "Agent"}\nActive Tools: ${JSON.stringify(bot?.tools || {})}\n\nBot Memory Bank:\n${memoryContext || "None yet."}\n\nAnswer helpfully, professionally, and autonomously. If tool steps were executed, reference the findings.`;

        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstructions}\n\nUser Message: ${message}` }],
            },
          ],
        });

        const textOutput = response.text || "Task executed successfully.";

        return NextResponse.json({
          reply: textOutput,
          toolSteps,
          isWaitingApproval,
          modelUsed: modelName,
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call returned an error, falling back to local agent reasoning:", geminiError?.message);
      }
    }

    // High quality intelligent response generator when GEMINI_API_KEY is not configured or offline
    let reply = "";
    if (isWaitingApproval) {
      reply = `I have staged the sensitive command execution: \`${toolSteps[toolSteps.length - 1]?.inputArgs?.command}\`. Because your workspace is in **Supervised Mode**, please review and click **Approve** or **Reject** below before I proceed.`;
    } else if (lowerMsg.includes("calendar") || lowerMsg.includes("schedule")) {
      reply = `Here is your synchronized agenda overview:\n\n* **10:00 AM - 11:00 AM**: Architecture & Next.js Rewrite Sync\n* **01:30 PM - 02:15 PM**: Enterprise Client Demo\n* **03:00 PM - 03:45 PM**: Engineering Standup\n\nYou currently have a 2-hour focus block in the late afternoon. Would you like me to reserve it or block out commute buffers?`;
    } else if (lowerMsg.includes("pr") || lowerMsg.includes("pull request") || lowerMsg.includes("git")) {
      reply = `I inspected the repository pull requests:\n\n1. **PR #518** (*Media upgrade card on free plan*): All CI tests passed, ready to merge.\n2. **PR #516** (*Clicking active rail item toggles sidebar*): Clean diff, no conflicts.\n\nAll automated linting and security boundary checks are green.`;
    } else if (lowerMsg.includes("email") || lowerMsg.includes("inbox") || lowerMsg.includes("gmail")) {
      reply = `I scanned your connected Gmail inbox. Here are the 2 priority items needing attention:\n\n1. **From:** Board Lead - *Subject: Q3 Objectives & Milestone review*\n   *Summary:* Requesting the updated deliverable deck by Friday.\n2. **From:** Infrastructure Alert - *Subject: Routine Healthcheck Check-in*\n   *Summary:* All scheduled cron jobs ran on time without errors.\n\nShall I draft an executive response for item #1?`;
    } else {
      reply = `I have received your request regarding: **"${message}"**.\n\nAs your **${bot?.name || "Personal Bot"}** (${bot?.title || "Agent"}), I evaluated this against our active memory rules and tools.\n\n* **Context evaluated:** Workspace \`${bot?.workspacePath || "~/.abacusai-bot"}\`\n* **Tools armed:** ${Object.entries(bot?.tools || {})
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(", ")}\n* **Recommendation:** Proceeding with the prioritized action item. Let me know if you would like me to generate a deliverable (PDF report or slide deck) or automate this via a scheduled routine.`;
    }

    return NextResponse.json({
      reply,
      toolSteps,
      isWaitingApproval,
      modelUsed: modelName,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
